// ─────────────────────────────────────────────────────────────
//  new.mjs — scaffold a new post.
//  Usage:
//    npm run new:post "My Title"
//    npm run new:link "My Title" https://example.com/article
// ─────────────────────────────────────────────────────────────

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const kind = process.argv[2];                 // "post" | "link"
const title = process.argv[3] || "Untitled";
const linkUrl = process.argv[4] || "";

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const today = new Date().toISOString();
const slug = slugify(title);
const file = `posts/${slug}.md`;

if (!existsSync("posts")) await mkdir("posts", { recursive: true });

let body;
if (kind === "link") {
  body = `---
type: link
title: "${title}"
date: ${today}
link_url: "${linkUrl}"
# Optional overrides — leave blank to use the scraped Open Graph data:
# lead: "A short headline for the source (defaults to its og:title)"
# source_title: ""
# source_image: ""
# source_author: ""
intro: "One-line setup that runs into the source headline."
---

Your commentary goes here. This is the part in your own voice, set in the
reading serif, below the source card.
`;
} else {
  body = `---
type: article
title: "${title}"
date: ${today}
category: "On Writing"
# updated: ${today}   # uncomment when you edit after publishing
# excerpt: "Optional custom summary for the feed."
---

Open with the paragraph that gets the drop cap. Write normally in Markdown —
**bold**, _italic_, [links](https://example.com), > blockquotes, ## headings,
and \`code\` all render.
`;
}

await writeFile(file, body);
console.log(`Created ${file}`);
