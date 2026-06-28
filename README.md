# Marginalia

A small, custom static blogging engine — no framework. You write Markdown files;
a Node build script turns them into a fast, monochrome, light/dark site and emits
plain HTML into `dist/`. Built to deploy on Cloudflare Pages.

## Quick start

```bash
npm install        # one time
npm run dev        # build + preview at http://localhost:3000 (rebuilds on save)
npm run build      # one-off production build into dist/
```

## Writing posts

Posts are Markdown files in `posts/`. Scaffold one:

```bash
npm run new:post "My essay title"
npm run new:link "My link title" https://example.com/the-article
```

### Full article frontmatter
```yaml
---
type: article
title: "Headline"
date: 2026-06-19T08:42:00-04:00
category: "On Writing"        # becomes a clickable, archived category
updated: 2026-06-20T11:03:00-04:00   # optional — shows an "Updated" line
excerpt: "Optional feed summary"     # optional — auto-generated if omitted
---

First paragraph gets the drop cap. Write in normal Markdown.
```

### Link post frontmatter
```yaml
---
type: link
title: "Internal title"
date: 2026-06-15T09:00:00-04:00
link_url: "https://source.com/article"   # the headline links here
lead: "Headline shown in the card"        # optional — defaults to scraped og:title
intro: "One line that runs into the lead headline."
source_author: "Original Author"          # optional — defaults to scraped author
source_image: "https://..."               # optional — defaults to scraped og:image
---

Your commentary in your own voice goes here.
```

**Auto-pulled metadata:** for link posts, the build fetches the source URL's Open Graph
tags (title, image, description, author) and fills anything you didn't specify in
frontmatter. Results cache in `.cache/og.json`; delete that file to force a refresh.
Any field you set in frontmatter overrides the scrape.

## Configuration

Everything global lives in `src/config.mjs`: site title, author, URL, the "Musings"
nav label, default theme, timezone (controls the EDT/EST stamp), and the two footer
version pills (`Daedalus` / `Mnemosyne`).

## Project layout

```
posts/            your Markdown posts
public/           static assets copied verbatim into dist/ (favicon, images)
src/
  config.mjs      global settings — edit this
  styles.mjs      the whole monochrome stylesheet
  templates.mjs   HTML structure for every page type
  og.mjs          build-time Open Graph scraper + cache
  rss.mjs         RSS feed
  build.mjs       the engine (npm run build)
  dev.mjs         local preview server (npm run dev)
  new.mjs         post scaffolder
dist/             generated output — served by Cloudflare
```

## Deploy to Cloudflare Pages

1. Push this folder to a GitHub repo.
2. In Cloudflare Pages: **Create project → Connect to Git →** pick the repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 18 or newer (set env var `NODE_VERSION=20` if needed).
4. Deploy. Every push rebuilds and republishes.

Set your real domain in `src/config.mjs` (`site.url`) so RSS and meta links are absolute.

## Notes

- The site ships almost no JavaScript: just the theme toggle and the reading
  progress bar. Everything else is static HTML + one stylesheet.
- The drop cap, the link badge, and the monochrome restraint are the whole
  aesthetic. Keep it disciplined.
