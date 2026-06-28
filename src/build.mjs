// ─────────────────────────────────────────────────────────────
//  build.mjs — the Marginalia engine.
//  Reads posts/*.md, renders static HTML into dist/.
//  Run with: npm run build
// ─────────────────────────────────────────────────────────────

import { readdir, readFile, writeFile, mkdir, rm, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

import { site } from "./config.mjs";
import { css } from "./styles.mjs";
import { fetchOG } from "./og.mjs";
import { page, articleFull, linkPost, feedItem } from "./templates.mjs";
import { renderRSS } from "./rss.mjs";

const POSTS_DIR = "posts";
const OUT_DIR = "dist";
const PUBLIC_DIR = "public";

marked.setOptions({ mangle: false, headerIds: false });

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function excerptFrom(html, max = 180) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
}

async function loadPosts() {
  if (!existsSync(POSTS_DIR)) return [];
  const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith(".md"));
  const posts = [];

  for (const file of files) {
    const raw = await readFile(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const type = data.type === "link" ? "link" : "article";
    const slug = data.slug || slugify(data.title || path.basename(file, ".md"));
    const date = data.date ? new Date(data.date) : new Date();
    const permalink =
      type === "link" ? `/links/${slug}/` : `/posts/${slug}/`;

    const post = {
      ...data,
      type, slug, date,
      updated: data.updated ? new Date(data.updated) : null,
      permalink,
      html: marked.parse(content.trim()),
      sourceFile: file,
    };

    if (type === "article") {
      post.excerpt = data.excerpt || excerptFrom(post.html);
    }

    if (type === "link") {
      if (!data.link_url) {
        console.warn(`  ! link post ${file} has no link_url — skipping`);
        continue;
      }
      // Render the optional one-line intro as inline markdown (no <p> wrap).
      if (data.intro) post.introHtml = marked.parseInline(String(data.intro));
      process.stdout.write(`  · scraping ${data.link_url} … `);
      post.og = await fetchOG(data.link_url);
      console.log("ok");
    }

    posts.push(post);
  }

  // Newest first.
  posts.sort((a, b) => b.date - a.date);
  return posts;
}

async function writePage(routePath, html) {
  const dir = path.join(OUT_DIR, routePath);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html);
}

function renderFeed(posts) {
  const items = posts
    .map((p) => feedItem(p))
    .join(`\n<hr class="feed-sep">\n`);
  return page({
    title: "",
    css,
    body: items || `<p class="feed-dek">No posts yet. Add a Markdown file to /posts.</p>`,
  });
}

function renderPost(post) {
  const body = post.type === "link" ? linkPost(post) : articleFull(post);
  return page({
    title: post.title || (post.og && post.og.title) || "Untitled",
    css,
    body,
    showProgress: post.type === "article",
  });
}

function renderCategory(category, posts) {
  const items = posts.map((p) => feedItem(p)).join(`\n<hr class="feed-sep">\n`);
  return page({
    title: category,
    css,
    body: `<p class="kicker">${category}</p>\n${items}`,
  });
}

async function build() {
  const t0 = Date.now();
  console.log("Building Marginalia…");

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const posts = await loadPosts();
  console.log(`  loaded ${posts.length} post(s)`);

  // Home feed
  await writeFile(path.join(OUT_DIR, "index.html"), renderFeed(posts));

  // Individual posts
  for (const post of posts) {
    await writePage(post.permalink.replace(/^\/|\/$/g, ""), renderPost(post));
  }

  // Category archives
  const byCategory = {};
  for (const p of posts) {
    if (!p.category) continue;
    (byCategory[p.category] ||= []).push(p);
  }
  for (const [cat, list] of Object.entries(byCategory)) {
    await writePage(`category/${slugify(cat)}`, renderCategory(cat, list));
  }

  // RSS feed
  await writeFile(path.join(OUT_DIR, "feed.xml"), renderRSS(posts));

  // Copy /public assets (favicon, images, etc.) into dist if present.
  if (existsSync(PUBLIC_DIR)) {
    await cp(PUBLIC_DIR, OUT_DIR, { recursive: true });
  }

  console.log(`Done in ${Date.now() - t0}ms → ${OUT_DIR}/`);
  console.log(`  ${posts.length} posts, ${Object.keys(byCategory).length} categories`);
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
