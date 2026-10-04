# Changes made after the pre-delivery review

## Build / deploy
- `package.json`: `esbuild ^0.25` -> `^0.28` (conflicted with vite 8, made `npm install` fail with ERESOLVE). `package-lock.json` added; stale `bun.lock` removed.
- `requirements.txt`: added `psycopg[binary]` (needed for the PostgreSQL settings to work).
- `config/settings.py`: `X_FRAME_OPTIONS = 'DENY'`, minimum password length 6 -> 12. `server.ts` sends `X-Frame-Options: DENY`.
- README: demo-account password table removed; real-account instructions (`createsuperuser`, `setup_groups`) added.

## SEO
- `src/seo.ts`: one table of title/description per page (Arabic + English), canonical, Open Graph, Twitter card, Organization JSON-LD.
- `server.ts` injects the right `<head>` per URL into the HTML (crawlers / WhatsApp previews don't run JS), serves real `/robots.txt` and `/sitemap.xml` (built from `SITE_URL`), and returns HTTP 404 for unknown URLs.
- `static/img/og-image.jpg` (1200x630) used for `og:image` / `twitter:image`.
- **Set `SITE_URL=https://your-real-domain` in `.env` in production**, otherwise canonical/sitemap use localhost.

## Accessibility / UX
- Navbar: top items are real links; dropdown opens on keyboard focus, closes with Esc / when focus leaves, ArrowDown enters it; `aria-expanded`, `aria-haspopup`, `aria-current`; Esc closes the mobile menu.
- Contact form: label/`htmlFor`, `aria-invalid`, `aria-describedby` for errors, `aria-required`, autocomplete, focus moves to first invalid field, and to the confirmation after sending.
- Track page: result announced (live region) and focused after lookup.
- Skip-to-content link; focus moves to `<main>` after in-app navigation; real 404 page.
- Button colour darkened (`#a77a1c` -> `#8f6612`) so white text passes WCAG AA (3.9:1 -> 5.2:1); same for gold text on light backgrounds.

## Performance
- Six hero/gallery JPGs converted to WebP (~5.4 MB -> ~0.9 MB).
