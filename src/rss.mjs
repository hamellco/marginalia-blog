// ─────────────────────────────────────────────────────────────
//  rss.mjs — generate a minimal, valid RSS 2.0 feed.
// ─────────────────────────────────────────────────────────────

import { site } from "./config.mjs";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function renderRSS(posts) {
  const items = posts.slice(0, 30).map((p) => {
    const link = `${site.url}${p.permalink}`;
    const title = p.title || (p.og && p.og.title) || "Untitled";
    const desc = p.type === "link"
      ? `Link: ${p.link_url}`
      : (p.excerpt || "");
    return `    <item>
      <title>${esc(title)}</title>
      <link>${esc(link)}</link>
      <guid>${esc(link)}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(desc)}</description>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(site.title)}</title>
    <link>${esc(site.url)}</link>
    <description>${esc(site.tagline)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}
