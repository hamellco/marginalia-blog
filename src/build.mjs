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
import { page, articleFull, linkPost, feedItem, colophonPage, indexesPage, archivesPage, enginePage } from "./templates.mjs";
import { renderRSS } from "./rss.mjs";
import { checkHealth } from "./health.mjs";

const POSTS_DIR = "posts";
const PAGES_DIR = "pages";
const OUT_DIR = "dist";
const PUBLIC_DIR = "public";

// ── Mnemosyne Markdown: a deliberate subset of CommonMark ──────
// We keep marked (battle-tested, build-time only, ships nothing to
// readers) but turn OFF features we don't want, so the authoring
// spec is tight and predictable:
//   ON : paragraphs, bold, italic, links, images (w/ caption+align),
//        blockquotes, headings, inline code, lists, code blocks, hr
//   OFF: GitHub tables, raw inline HTML, bare-URL autolinking
marked.setOptions({
  mangle: false,
  headerIds: false,
  gfm: false,        // no GitHub extensions (tables, strikethrough, autolinks)
  breaks: false,
});

// Custom image rendering: alt = caption, optional title = alignment.
//   ![A quiet street](street.jpg)            → centered + caption
//   ![A quiet street](street.jpg "left")     → float left, text wraps
//   ![A quiet street](street.jpg "right")    → float right, text wraps
const renderer = {
  image(href, title, text) {
    const align = (title || "").toLowerCase().trim();
    const alignClass =
      align === "left" ? "fig--left" :
      align === "right" ? "fig--right" : "fig--center";
    const caption = text
      ? `<figcaption class="fig-caption">${text}</figcaption>`
      : "";
    return `<figure class="fig ${alignClass}">` +
      `<img src="${href}" alt="${text || ""}" loading="lazy">` +
      `${caption}</figure>`;
  },
};
marked.use({ renderer });

const STOPWORDS = new Set([
  "a","an","and","the","of","to","in","on","for","with","but","or","nor",
  "is","are","was","were","be","by","at","as","it","its","this","that",
  "why","how","what","when","from","into","over","under","why",
]);

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Shorter, smarter slug for post URLs: drop filler words, keep the
// meaningful ones, cap to ~5 words / 50 chars.
function shortSlug(s) {
  const words = String(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/[\s-]+/)
    .filter((w) => w && !STOPWORDS.has(w));
  let slug = "";
  for (const w of words) {
    const next = slug ? slug + "-" + w : w;
    if (next.length > 50) break;
    slug = next;
    if (slug.split("-").length >= 5) break;
  }
  return slug || slugify(s);
}

function excerptFrom(html, max = 360) {
  // Use the first paragraph of the post for a fuller feed preview.
  const firstPara = html.match(/<p>(.*?)<\/p>/s);
  const source = firstPara ? firstPara[1] : html;
  let text = source.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  // Decode entities so the excerpt isn't double-escaped when re-rendered.
  text = text
    .replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"').replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
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
    const slug = data.slug || shortSlug(data.title || path.basename(file, ".md"));
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
    .join("\n");
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
    wide: post.type === "article",
  });
}

function renderCategory(category, posts) {
  const items = posts.map((p) => feedItem(p)).join("\n");
  return page({
    title: category,
    css,
    body: items,
  });
}

// ── Standalone pages (Colophon, Indexes) ─────────────────────
async function buildStandalonePages() {
  if (!existsSync(PAGES_DIR)) return;

  // Colophon (about)
  if (existsSync(path.join(PAGES_DIR, "colophon.md"))) {
    const raw = await readFile(path.join(PAGES_DIR, "colophon.md"), "utf8");
    const { data, content } = matter(raw);
    const html = page({
      title: data.title || "Colophon",
      css,
      body: colophonPage({
        title: data.title || "Colophon",
        html: marked.parse(content.trim()),
      }),
    });
    await writePage("colophon", html);
  }

  // Indexes (curated links with build-time status dots)
  if (existsSync(path.join(PAGES_DIR, "indexes.md"))) {
    const raw = await readFile(path.join(PAGES_DIR, "indexes.md"), "utf8");
    const { data } = matter(raw);
    const sections = data.sections || [];

    // Check each link's reachability (cached per day).
    let count = 0;
    for (const s of sections) {
      for (const l of s.links || []) {
        process.stdout.write(`  · checking ${l.url} … `);
        l.status = await checkHealth(l.url);
        console.log(l.status);
        count++;
      }
    }

    const html = page({
      title: data.title || "Indexes",
      css,
      body: indexesPage({
        title: data.title || "Indexes",
        intro: data.intro || "",
        sections,
      }),
    });
    await writePage("indexes", html);
    console.log(`  indexes: ${count} link(s) checked`);
  }
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

  // Standalone pages: Colophon + Indexes
  await buildStandalonePages();

  // Archives — textual list of every post
  await writePage("archives", page({
    title: "Archives", css, body: archivesPage(posts),
  }));

  // Engine — Mnemosyne features + version history
  await writePage("engine", page({
    title: "Mnemosyne", css, body: enginePage({
      features: [
        { title: "Markdown engine", desc: "A tight CommonMark subset compiled to static HTML." },
        { title: "Link scraper", desc: "Pulls Open Graph title, image, and author at build time." },
        { title: "Theme system", desc: "Monochrome light/dark from a single token set." },
        { title: "Link heartbeat", desc: "Build-time reachability check for Index links." },
        { title: "Reading progress", desc: "A hairline bar measured against the article." },
        { title: "Optional bylines", desc: "Multi-author support with per-author pages, off by default." },
        { title: "Smart slugs", desc: "Short, readable URLs generated from the title." },
        { title: "RSS + archives", desc: "A feed and a full textual index, generated automatically." },
      ],
      history: [
        { version: "0.6b", notes: "Tight Markdown subset, optional bylines, contrast pass, wider reading view, short slugs." },
        { version: "0.5b", notes: "Engine page, single footer pill, archives, image captions." },
        { version: "0.4b", notes: "Colophon and Indexes pages; link health checks." },
        { version: "0.3b", notes: "Boxed posts with notched badges; centered permalinks." },
        { version: "0.2b", notes: "Monochrome themes, three-font system, link posts." },
        { version: "0.1b", notes: "First build: Markdown posts, drop cap, RSS." },
      ],
    }),
  }));

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
