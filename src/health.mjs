// ─────────────────────────────────────────────────────────────
//  health.mjs — build-time reachability check for Index links.
//  Each link gets pinged once per build; results cached in
//  .cache/health.json. A link is "up" if it responds without a
//  network/5xx error. This is a snapshot at build time, not live.
// ─────────────────────────────────────────────────────────────

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const CACHE_PATH = ".cache/health.json";
const TIMEOUT_MS = 8000;

let cache = null;
async function load() {
  if (cache) return cache;
  try { cache = JSON.parse(await readFile(CACHE_PATH, "utf8")); }
  catch { cache = {}; }
  return cache;
}
async function save() {
  if (!existsSync(".cache")) await mkdir(".cache", { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2));
}

/**
 * Returns "up" | "down" | "unknown" for a URL.
 * Cached for the session so repeat builds are fast; delete
 * .cache/health.json to force a fresh sweep.
 */
export async function checkHealth(url, { force = false } = {}) {
  await load();
  const today = new Date().toISOString().slice(0, 10);
  if (!force && cache[url] && cache[url].date === today) {
    return cache[url].status;
  }

  let status = "unknown";
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    // HEAD is light; some servers reject it, so fall back to GET.
    let res;
    try {
      res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl.signal,
        headers: { "User-Agent": "MarginaliaBot/1.0" } });
      if (res.status >= 400) throw new Error("retry-with-get");
    } catch {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal,
        headers: { "User-Agent": "MarginaliaBot/1.0" } });
    }
    clearTimeout(timer);
    status = res.status < 500 ? "up" : "down";
  } catch {
    status = "down";
  }

  cache[url] = { status, date: today };
  await save();
  return status;
}
