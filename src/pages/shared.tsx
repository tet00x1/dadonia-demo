import React from 'react';
import { motion } from 'framer-motion';

export const CONTACT = {
  phone1: '+201011944092',
  phone1Label: '00201011944092',
  phone2: '+201038122116',
  phone2Label: '00201038122116',
  email: 'donovamotors@gmail.com',
  whatsapp: '201011944092',
  hours: 'الأحد - الخميس: 08:30 ص إلى 05:00 م (توقيت القاهرة)',
};

export const whatsappLink = (text?: string) =>
  `https://wa.me/${CONTACT.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/** Dark green title band used at the top of every inner page. */
export const PageHero: React.FC<{ eyebrow: string; title: string; subtitle?: string }> = ({ eyebrow, title, subtitle }) => (
  <section data-hero className="bg-[#052e27] text-[#f7f7f1] border-b border-[#e2bc55]/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-xs tracking-widest text-[#e2bc55] block mb-3"
      >
        {eyebrow}
      </motion.span>
      <h1 className="block overflow-hidden pb-2 text-3xl sm:text-5xl leading-[1.35]">
        <motion.span
          className="block"
          initial={{ y: '110%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.span>
      </h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-[#b6c8c0] text-sm sm:text-base font-light leading-loose max-w-3xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  </section>
);

/** Thrown when the backend cannot be reached (network down, timeout, proxy error page). */
export class BackendUnavailableError extends Error {
  constructor(public reason: 'timeout' | 'network' | 'bad_response') {
    super('backend_unavailable');
  }
}

async function request(url: string, init: RequestInit | undefined, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { Accept: 'application/json', ...(init?.headers as Record<string, string> | undefined) },
    });
    try {
      return { status: res.status, data: await res.json() };
    } catch {
      throw new BackendUnavailableError('bad_response'); // e.g. an HTML error page from a proxy
    }
  } catch (err) {
    if (err instanceof BackendUnavailableError) throw err;
    throw new BackendUnavailableError((err as Error)?.name === 'AbortError' ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch JSON from the Django API. Read requests are retried once after a short
 * pause (covers the backend restarting); writes are never retried so a form
 * can't be submitted twice.
 */
export async function fetchJson<T = any>(
  url: string,
  init?: RequestInit,
  timeoutMs = 12000,
): Promise<{ status: number; data: T }> {
  const isRead = !init?.method || init.method.toUpperCase() === 'GET';
  try {
    return await request(url, init, timeoutMs);
  } catch (err) {
    if (!isRead) throw err;
    await new Promise((r) => setTimeout(r, 700));
    return request(url, init, timeoutMs);
  }
}

export const inputCls =
  'w-full bg-white border border-[#082f28]/15 rounded-xl px-4 py-3 text-sm text-[#082f28] placeholder:text-[#566a63]/70 focus:outline-none focus:border-[#a77a1c] focus:ring-2 focus:ring-[#a77a1c]/20 transition';
