// ─────────────────────────────────────────────────────────────
//  templates.mjs — all HTML structure for Marginalia.
//  Pure functions: data in, HTML string out. The look lives here
//  and in styles.mjs. Edit freely; this is your design layer.
// ─────────────────────────────────────────────────────────────

import { site, versions, permalinkGlyph } from "./config.mjs";

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Date helpers ────────────────────────────────────────────────
function fmtLong(d) {
  // e.g. "June 19, 2026"
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}
function fmtStamp(d, tz) {
  // Render in the site's configured IANA timezone so the abbreviation
  // (EDT/EST) is correct regardless of where the build runs.
  const date = new Date(d);
  const zone = tz || site.timezone || "America/New_York";
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", timeZoneName: "short", timeZone: zone,
  });
  const day = date.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: zone,
  });
  return `${time}, ${day}`;
}
function fmtShort(d) {
  // e.g. "6/15/26"
  const date = new Date(d);
  const yy = String(date.getFullYear()).slice(-2);
  return `${date.getMonth() + 1}/${date.getDate()}/${yy}`;
}

// The link-post badge: a clean "external link" mark (box with an
// arrow leaving the top-right). Sized to match the pen badge.
const linkBadgeSVG = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 4h7v7"/><path d="M20 4l-9 9"/>
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>
  </svg>`;

// The article badge (a pen/nib).
const penBadgeSVG = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20l4-1L19 8a2 2 0 0 0-3-3L5 16l-1 4z"/><path d="M14 6l3 3"/>
  </svg>`;

// A badge notched into the top border (border–icon–border illusion).
function notchBadge(svg, label) {
  return `<span class="notch-badge" title="${label}" aria-label="${label}">${svg}</span>`;
}

// Permalink — icon only, no text, right-aligned by its container.
function permalink(href) {
  return `<a class="permalink" href="${esc(href)}" aria-label="Permalink to this post">${permalinkGlyph}</a>`;
}

// Centered permalink on its own line at the foot of a post box.
function permalinkRow(href) {
  return `<p class="permalink-row">${permalink(href)}</p>`;
}

function categoryLink(category) {
  if (!category) return "";
  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `<a href="/category/${slug}/">${esc(category)}</a>`;
}

// ── Masthead ──────────────────────────────────────────────────
export function masthead() {
  return `
  <header class="masthead">
    <a class="brand" href="/">${esc(site.title)}<span class="dot">.</span></a>
    <nav class="nav">
      <a href="${esc(site.navHref)}">${esc(site.navLabel)}</a>
      <a href="/colophon/">Colophon</a>
      <a href="/indexes/">Indexes</a>
      <button class="toggle" id="themeBtn" aria-label="Toggle light or dark theme" type="button">
        <span aria-hidden="true">◐</span> <span id="themeLbl">Dark</span>
      </button>
    </nav>
  </header>`;
}

// ── Version pills (footer) ────────────────────────────────────
export function versionPills() {
  const pill = (label, { codename, version }) => `
    <span class="pill">
      <span class="dot"></span>
      <span class="lbl">${esc(label)}</span>
      <span class="ver">${esc(codename)} v${esc(version)}</span>
    </span>`;
  return `
  <footer class="pills">
    ${pill("Design", versions.design)}
    ${pill("Backend", versions.backend)}
  </footer>`;
}

// ── Full article ──────────────────────────────────────────────
export function articleFull(post) {
  const updated =
    post.updated && new Date(post.updated) > new Date(post.date)
      ? `<br>Updated ${esc(fmtStamp(post.updated))}`
      : "";
  return `
  <article class="post-box article">
    ${notchBadge(penBadgeSVG, "Article")}
    <p class="kicker">${categoryLink(post.category)}</p>
    <h1 class="headline">${esc(post.title)}</h1>
    <div class="byline-block">
      <p class="byline">By <a href="/about/">${esc(site.author)}</a></p>
      <p class="timestamps">Posted ${esc(fmtStamp(post.date))}${updated}</p>
    </div>
    <div class="article-body">
      ${post.html}
    </div>
    ${permalinkRow(post.permalink)}
  </article>`;
}

// ── Link post ─────────────────────────────────────────────────
export function linkPost(post) {
  const og = post.og || {};
  const sourceTitle = post.source_title || og.title || "";
  const sourceImage = post.source_image || og.image || "";
  const sourceAuthor = post.source_author || og.author || "";
  const domain = og.domain || "";
  const lead = post.lead || sourceTitle;

  const authorLine = sourceAuthor
    ? `${esc(sourceAuthor)} <span>· original author</span>`
    : (domain ? `<span>${esc(domain)}</span>` : "");

  const thumb = sourceImage
    ? `<img class="lc-thumb" src="${esc(sourceImage)}" alt="${esc(sourceTitle || "Source preview")}" loading="lazy">`
    : `<div class="lc-thumb lc-thumb--empty" aria-hidden="true"></div>`;

  const leadHtml = lead
    ? `<a class="lc-lead" href="${esc(post.link_url)}">${esc(lead)}</a>`
    : "";
  const sep = lead && post.intro ? " — " : "";
  const introPart = post.intro ? post.introHtml : "";

  return `
  <article class="post-box link-card">
    ${notchBadge(linkBadgeSVG, "Link post")}
    <div class="lc-head">
      <span class="lc-author">${authorLine}</span>
      <span class="lc-date">${esc(fmtShort(post.date))}</span>
    </div>
    <div class="lc-grid">
      <p class="lc-intro">${leadHtml}${sep}${introPart}</p>
      <a class="lc-srccard" href="${esc(post.link_url)}" aria-label="Read the source article">
        ${thumb}
      </a>
    </div>
    <div class="lc-body">
      ${post.html}
      <p class="lc-thoughts">
        <span class="by">Thoughts by</span>
        <span class="name">${esc(site.author)}</span>
      </p>
    </div>
    ${permalinkRow(post.permalink)}
  </article>`;
}

// ── Feed item (homepage) ──────────────────────────────────────
export function feedItem(post) {
  return post.type === "link" ? linkPost(post) : articleCard(post);
}

// Boxed article preview for the feed.
function articleCard(post) {
  return `
  <article class="post-box feed-article">
    ${notchBadge(penBadgeSVG, "Article")}
    <p class="kicker">${categoryLink(post.category)}</p>
    <h2 class="feed-headline"><a href="${esc(post.permalink)}">${esc(post.title)}</a></h2>
    <p class="feed-dek">${esc(post.excerpt || "")}</p>
    ${permalinkRow(post.permalink)}
  </article>`;
}

// ── Standalone pages (Colophon = about, Indexes = link list) ──

// A simple Markdown-driven page: sans heading, no kicker, prose body
// set in the reading serif with a drop cap on the first paragraph.
export function colophonPage({ title, html }) {
  return `
  <article class="page page--colophon">
    <h1 class="page-title">${esc(title)}</h1>
    <div class="page-body article-body">
      ${html}
    </div>
  </article>`;
}

// Status dot: filled = up, hollow = down, faint ring = unknown.
function statusDot(status) {
  const cls =
    status === "up" ? "is-up" : status === "down" ? "is-down" : "is-unknown";
  const label =
    status === "up" ? "Online" : status === "down" ? "Unreachable" : "Unknown";
  return `<span class="status ${cls}" title="${label} (checked at last build)" aria-label="${label}"></span>`;
}

// Indexes page: sections of curated links, each with a build-time
// status dot. `sections` is [{ title, intro, links: [{title,url,note,status}] }].
export function indexesPage({ title, intro, sections }) {
  const renderLink = (l) => `
    <li class="index-link">
      ${statusDot(l.status)}
      <a class="index-link-title" href="${esc(l.url)}">${esc(l.title)}</a>
      ${l.note ? `<span class="index-link-note">${esc(l.note)}</span>` : ""}
    </li>`;

  const renderSection = (s) => `
    <section class="index-section">
      <h2 class="index-section-title">${esc(s.title)}</h2>
      ${s.intro ? `<p class="index-section-intro">${esc(s.intro)}</p>` : ""}
      <ul class="index-list">
        ${s.links.map(renderLink).join("\n")}
      </ul>
    </section>`;

  return `
  <article class="page page--indexes">
    <h1 class="page-title">${esc(title)}</h1>
    ${intro ? `<p class="page-intro">${esc(intro)}</p>` : ""}
    ${sections.map(renderSection).join("\n")}
  </article>`;
}

// ── Page shell ────────────────────────────────────────────────
export function page({ title, body, css, showProgress = false }) {
  const pageTitle = title ? `${title} — ${site.title}` : site.title;
  return `<!DOCTYPE html>
<html lang="en" data-theme="${site.defaultTheme}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(site.tagline)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400;9..144,500;9..144,600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
${showProgress ? `<div class="progress-track"><div class="progress-fill" id="pfill"></div></div>` : ""}
${masthead()}
<main class="wrap">
${body}
</main>
${versionPills()}
<script>${clientJS(showProgress)}</script>
</body>
</html>`;
}

// ── Tiny client script: theme toggle (+ progress bar on posts) ─
function clientJS(showProgress) {
  return `
(function(){
  var root=document.documentElement,btn=document.getElementById('themeBtn'),lbl=document.getElementById('themeLbl');
  var saved=null; try{saved=localStorage.getItem('theme');}catch(e){}
  if(!saved&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)saved='dark';
  if(saved){root.setAttribute('data-theme',saved);}
  if(lbl)lbl.textContent=root.getAttribute('data-theme')==='dark'?'Light':'Dark';
  if(btn)btn.addEventListener('click',function(){
    var d=root.getAttribute('data-theme')==='dark';
    root.setAttribute('data-theme',d?'light':'dark');
    if(lbl)lbl.textContent=d?'Dark':'Light';
    try{localStorage.setItem('theme',d?'light':'dark');}catch(e){}
  });
  ${showProgress ? `
  var fill=document.getElementById('pfill'),art=document.querySelector('main article');
  if(fill&&art){
    var upd=function(){
      var r=art.getBoundingClientRect(),start=window.scrollY+r.top,end=start+r.height-window.innerHeight;
      fill.style.width=Math.min(100,Math.max(0,((window.scrollY-start)/Math.max(1,end-start))*100))+'%';
    };
    window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
  }` : ""}
})();`;
}
