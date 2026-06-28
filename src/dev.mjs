// ─────────────────────────────────────────────────────────────
//  dev.mjs — local preview server.
//  Builds the site, serves dist/ at http://localhost:3000, and
//  rebuilds when anything in posts/ or src/ changes.
//  Run with: npm run dev
// ─────────────────────────────────────────────────────────────

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const PORT = 3000;
const ROOT = "dist";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
  ".xml": "application/xml", ".txt": "text/plain",
};

let building = false;
function runBuild() {
  if (building) return;
  building = true;
  const p = spawn("node", ["src/build.mjs"], { stdio: "inherit" });
  p.on("close", () => { building = false; });
}

async function serveFile(res, filePath) {
  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath.endsWith("/")) urlPath += "index.html";
  let filePath = path.join(ROOT, urlPath);

  // Try the file; fall back to /<path>/index.html; then 404 page.
  if (await serveFile(res, filePath)) return;
  if (await serveFile(res, path.join(ROOT, urlPath, "index.html"))) return;
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end("<h1>404</h1><p>Not found. Is the site built?</p>");
});

// Initial build, then watch.
runBuild();
for (const dir of ["posts", "pages", "src"]) {
  try {
    watch(dir, { recursive: true }, () => {
      console.log(`\n↻ change in ${dir}/ — rebuilding`);
      runBuild();
    });
  } catch {}
}

server.listen(PORT, () => {
  console.log(`\n  Marginalia dev → http://localhost:${PORT}\n`);
});
