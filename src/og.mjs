// ─────────────────────────────────────────────────────────────
//  og.mjs — fetch Open Graph / meta tags for link posts at build time.
//  Results are cached in .cache/og.json so repeat builds are instant
//  and we don't hammer source sites. Delete that file to force refetch.
// ─────────────────────────────────────────────────────────────

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const CACHE_PATH = ".cache/og.json";

let cache = null;
async function loadCache() {
  if (cache) return cache;
  try {
    cache = JSON.parse(await readFile(CACHE_PATH, "utf8"));
  } catch {
    cache = {};
  }
  return cache;
}
async function saveCache() {
  if (!existsSync(".cache")) await mkdir(".cache", { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

// Pull a meta tag's content by property/name, tolerant of attribute order.
function metaContent(html, key) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return decodeEntities(m[1].trim());
  }
  return null;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
}

function hostname(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return ""; }
}

// Resolve a possibly-relative image URL against the page URL.
function absolutize(maybeUrl, base) {
  if (!maybeUrl) return null;
  try { return new URL(maybeUrl, base).href; }
  catch { return maybeUrl; }
}

/**
 * Fetch metadata for a URL. Returns:
 *   { title, image, description, siteName, author, url, domain }
 * Any field may be null if the source doesn't provide it — the build
 * tolerates that and falls back to whatever you put in frontmatter.
 */
export async function fetchOG(url, { force = false } = {}) {
  await loadCache();
  if (!force && cache[url]) return cache[url];

  const result = {
    title: null, image: null, description: null,
    siteName: null, author: null, url, domain: hostname(url),
  };

  try {
    const res = await fetch(url, {
      headers: {
        // A real-ish UA — some sites serve bare HTML to unknown agents.
        "User-Agent": "Mozilla/5.0 (compatible; MarginaliaBot/1.0; +https://marginalia.pages.dev)",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (res.ok) {
      const html = await res.text();
      result.title =
        metaContent(html, "og:title") ||
        (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null);
      result.image = absolutize(metaContent(html, "og:image"), url);
      result.description =
        metaContent(html, "og:description") ||
        metaContent(html, "description");
      result.siteName = metaContent(html, "og:site_name") || hostname(url);
      result.author =
        metaContent(html, "article:author") ||
        metaContent(html, "author");
    } else {
      console.warn(`  ! OG fetch ${res.status} for ${url}`);
    }
  } catch (err) {
    console.warn(`  ! OG fetch failed for ${url}: ${err.message}`);
  }

  cache[url] = result;
  await saveCache();
  return result;
}
