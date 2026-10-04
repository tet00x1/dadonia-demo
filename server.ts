import express from 'express';
import path from 'path';
import fs from 'fs';
import { spawn, spawnSync, ChildProcess } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { KNOWN_PATHS, buildSeoHead, normalizeSeoPath } from './src/seo.ts';

/**
 * Front door of the site.
 *   - dev  (npm run dev):   Vite middleware serves the React app with hot reload
 *   - prod (npm start):     the built app in ./dist is served as static files
 * In both modes /api, /admin, /activity, /media and /static are proxied to Django
 * (runserver in dev, gunicorn in production).
 */
const IS_PROD = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);
const DJANGO_PORT = parseInt(process.env.DJANGO_PORT || '8001', 10);
const DJANGO_HOST = '127.0.0.1';
const DIST = path.resolve('dist');

const log = (msg: string) => console.log(`[Server] ${msg}`);

// Public address of the site (canonical URLs, sitemap, Open Graph). Only SITE_URL is read from .env
// here on purpose: DEBUG and the other Django settings must keep coming from the real environment.
function readSiteUrl(): string {
  let v = process.env.SITE_URL;
  if (!v) {
    try { v = dotenv.parse(fs.readFileSync(path.resolve('.env')))['SITE_URL']; } catch { /* no .env */ }
  }
  return (v || `http://localhost:${PORT}`).trim().replace(/\/+$/, '');
}
const SITE_URL = readSiteUrl();

// Local development has to work without a .env file, production must not.
const djangoEnv = {
  ...process.env,
  PYTHONUNBUFFERED: '1',
  DEBUG: process.env.DEBUG ?? (IS_PROD ? 'False' : 'True'),
};

// ---------------------------------------------------------------- Django
let djangoProcess: ChildProcess | null = null;
let shuttingDown = false;
let restartDelay = 1000;

/**
 * Find a working Python 3 on any OS: a project venv first, then the Windows
 * launcher (py), then python / python3. The Microsoft Store "python" shortcut
 * is skipped automatically because it exits with an error instead of running.
 */
type PyCmd = { cmd: string; pre: string[] };
function findPython(): PyCmd | null {
  const candidates: PyCmd[] = [];
  for (const dir of ['venv', '.venv']) {
    candidates.push({ cmd: path.resolve(dir, 'Scripts', 'python.exe'), pre: [] });
    candidates.push({ cmd: path.resolve(dir, 'bin', 'python'), pre: [] });
  }
  if (process.env.PYTHON) candidates.push({ cmd: process.env.PYTHON, pre: [] });
  candidates.push({ cmd: 'py', pre: ['-3'] }, { cmd: 'python', pre: [] }, { cmd: 'python3', pre: [] });

  for (const c of candidates) {
    if (path.isAbsolute(c.cmd) && !fs.existsSync(c.cmd)) continue;
    const r = spawnSync(c.cmd, [...c.pre, '-c', 'import sys; print(sys.version_info[0])'], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim() === '3') return c;
  }
  return null;
}

const PY = findPython();
if (!PY) {
  console.error(`
[Server] Python 3 was not found.
  1) Install Python 3.12 from https://www.python.org/downloads/ and tick "Add python.exe to PATH".
  2) Open a NEW terminal in this folder and run:
       python -m venv venv
       venv\\Scripts\\activate
       pip install -r requirements.txt
  3) Run "npm run dev" again.
`);
  process.exit(1);
}
const deps = spawnSync(PY.cmd, [...PY.pre, '-c', 'import django, whitenoise, dotenv, PIL'], { encoding: 'utf8' });
if (deps.status !== 0) {
  console.error('[Server] Python packages are missing. Run:  pip install -r requirements.txt  (inside the venv if you use one)');
  process.exit(1);
}

function runManage(args: string[]) {
  return spawnSync(PY!.cmd, [...PY!.pre, 'manage.py', ...args], { stdio: 'inherit', env: djangoEnv });
}

function startDjango() {
  const onWindows = process.platform === 'win32';
  const cmd = IS_PROD
    ? (onWindows
        ? ['-m', 'waitress', `--listen=${DJANGO_HOST}:${DJANGO_PORT}`, '--threads=6', 'config.wsgi:application']
        : ['-m', 'gunicorn', 'config.wsgi:application',
           '--bind', `${DJANGO_HOST}:${DJANGO_PORT}`,
           '--workers', process.env.WEB_CONCURRENCY || '3', '--threads', '2', '--timeout', '60',
           '--access-logfile', '-', '--error-logfile', '-'])
    : ['manage.py', 'runserver', `${DJANGO_HOST}:${DJANGO_PORT}`, '--noreload'];

  log(`starting Django (${IS_PROD ? (onWindows ? 'waitress' : 'gunicorn') : 'runserver'}) on ${DJANGO_HOST}:${DJANGO_PORT}`);
  djangoProcess = spawn(PY!.cmd, [...PY!.pre, ...cmd], { stdio: 'inherit', env: djangoEnv });

  djangoProcess.on('exit', (code, signal) => {
    djangoProcess = null;
    if (shuttingDown) return;
    console.warn(`[Django] exited (code ${code}, signal ${signal}); restarting in ${restartDelay / 1000}s`);
    setTimeout(startDjango, restartDelay);
    restartDelay = Math.min(restartDelay * 2, 15000); // back off if it keeps crashing
  });
  djangoProcess.on('spawn', () => { setTimeout(() => { restartDelay = 1000; }, 30000); });
  djangoProcess.on('error', (err) => console.error('[Django] failed to start:', err));
}

function stop(signal: NodeJS.Signals) {
  shuttingDown = true;
  if (djangoProcess) djangoProcess.kill(signal);
  process.exit(0);
}
process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

// Apply pending migrations before serving traffic (idempotent and fast).
const migrated = runManage(['migrate', '--noinput']);
if (migrated.status !== 0) {
  console.error('[Server] Django migrations failed - read the error printed above (database settings live in .env).');
  process.exit(1);
}
startDjango();

// ---------------------------------------------------------------- Express
const app = express();
app.disable('x-powered-by');
// Trust the reverse proxy in front of us (nginx etc.) so req.ip is the real visitor.
app.set('trust proxy', process.env.TRUST_PROXY || 'loopback');

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const djangoProxy = createProxyMiddleware({
  target: `http://${DJANGO_HOST}:${DJANGO_PORT}`,
  changeOrigin: false, // keep the public Host header so Django's host/CSRF checks see the real domain
  ws: true,
  on: {
    // Django must see ONE trustworthy hop: overwrite whatever the browser sent.
    proxyReq: (proxyReq, req: any) => {
      proxyReq.setHeader('X-Forwarded-For', req.ip);
      proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
    },
    error: (err, req: any, res: any) => {
      console.error('[Proxy] Django unreachable:', err.message);
      if (res.headersSent || !res.writeHead) return;
      const wantsJson = (req.originalUrl || req.url || '').startsWith('/api');
      res.writeHead(503, {
        'Content-Type': wantsJson ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8',
        'Retry-After': '3',
      });
      res.end(
        wantsJson
          ? JSON.stringify({ ok: false, error: 'backend_unavailable' })
          : `<div style="font-family:Cairo,sans-serif;text-align:center;padding:50px;direction:rtl">
               <h2>جاري تحميل الصفحة...</h2><p>يرجى الانتظار لحظات.</p>
               <script>setTimeout(function(){location.reload()},2500)</script></div>`,
      );
    },
  },
});

// ---- robots.txt + sitemap.xml (generated from the same route table as the page titles)
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    ['User-agent: *', 'Allow: /', 'Disallow: /admin/', 'Disallow: /activity/', 'Disallow: /api/', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n'),
  );
});
app.get('/sitemap.xml', (_req, res) => {
  const urls = KNOWN_PATHS.map((p) => `  <url><loc>${SITE_URL}${p === '/' ? '/' : p}</loc></url>`).join('\n');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
});

const DJANGO_PREFIXES = ['/admin', '/activity', '/media', '/api', '/static'];
app.use((req, res, next) => {
  if (DJANGO_PREFIXES.some((p) => req.path === p || req.path.startsWith(p + '/'))) {
    return (djangoProxy as express.RequestHandler)(req, res, next);
  }
  next();
});

async function startServer() {
  if (IS_PROD) {
    if (!fs.existsSync(path.join(DIST, 'index.html'))) {
      console.error('[Server] dist/ not found - run "npm run build" first');
      process.exit(1);
    }
    // hashed build assets never change -> cache for a year; index.html must always be re-checked
    app.use('/assets', express.static(path.join(DIST, 'assets'), { immutable: true, maxAge: '1y' }));
    app.use(express.static(DIST, { index: false, maxAge: '1h' }));
    const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
    const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
    app.get('*', (req, res) => {
      // Real <head> per page for crawlers/link previews, and a real 404 status for unknown URLs
      const { html, known } = buildSeoHead(normalizeSeoPath(req.path), SITE_URL, 'ar');
      res.status(known ? 200 : 404);
      res.setHeader('Cache-Control', 'no-cache');
      res.type('html').send(indexHtml.replace(SEO_BLOCK, () => html));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    log(`${IS_PROD ? 'production' : 'development'} server on http://0.0.0.0:${PORT}`);
  });
}

startServer();
