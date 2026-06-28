// ─────────────────────────────────────────────────────────────
//  styles.mjs — the complete Marginalia stylesheet.
//  Monochrome, light + dark. This is the whole visual system;
//  every color is a token defined once at the top.
// ─────────────────────────────────────────────────────────────

export const css = `
:root[data-theme="light"]{
  --serif:'Fraunces',Georgia,serif; --read:'Newsreader',Georgia,serif; --sans:'Space Grotesk',system-ui,sans-serif; --mono:'JetBrains Mono',ui-monospace,Menlo,monospace;
  --ink:#141414; --ink-2:#2e2e2e; --muted:#565656; --faint:#6f6f6f;
  --line:#e0ddd7; --line-2:#c4c1ba; --bg:#fbfbfa; --surface:#f1f0ed; --pill-bg:#eeece8;
}
:root[data-theme="dark"]{
  --serif:'Fraunces',Georgia,serif; --read:'Newsreader',Georgia,serif; --sans:'Space Grotesk',system-ui,sans-serif; --mono:'JetBrains Mono',ui-monospace,Menlo,monospace;
  --ink:#f2f1ee; --ink-2:#dad8d3; --muted:#aeaca6; --faint:#8d8b85;
  --line:#2c2c2a; --line-2:#403f3c; --bg:#121211; --surface:#1c1c1a; --pill-bg:#222220;
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--read);
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;
  transition:background .25s ease,color .25s ease;}

a{color:inherit;}

/* progress bar */
.progress-track{position:fixed;top:0;left:0;right:0;height:2px;z-index:50;background:transparent;}
.progress-fill{height:100%;width:0%;background:var(--ink);transition:width .08s linear;}

/* reading bar — dark band that slides in on scroll (long-form pages).
   Carries the blog name in white plus the progress fill underneath. */
.reading-bar{position:fixed;top:0;left:0;right:0;height:44px;z-index:60;
  background:#111110;color:#f4f3ef;display:flex;align-items:center;
  padding:0 clamp(1.25rem,4vw,2.5rem);
  transform:translateY(-100%);transition:transform .28s cubic-bezier(.4,0,.2,1);
  box-shadow:0 1px 0 rgba(255,255,255,.05);}
.reading-bar.is-visible{transform:translateY(0);}
.reading-bar-brand{font-family:var(--serif);font-weight:600;font-size:17px;letter-spacing:-.01em;color:#f4f3ef;font-variation-settings:'opsz' 40,'SOFT' 0;}
.reading-bar-brand .dot{color:rgba(244,243,239,.45);}
.reading-bar-fill{position:absolute;left:0;bottom:0;height:4px;width:0%;background:#b8b6b0;transition:width .08s linear;}

/* masthead */
.masthead{max-width:660px;margin:0 auto;padding:2.5rem 1.5rem 1.5rem;display:flex;justify-content:space-between;align-items:center;border-bottom:.5px solid var(--line);}
.brand{font-family:var(--serif);font-weight:600;font-size:22px;letter-spacing:-.01em;color:var(--ink);text-decoration:none;font-variation-settings:'opsz' 40,'SOFT' 0;}
.brand .dot{color:var(--faint);}
.nav{display:flex;gap:16px;align-items:center;font-family:var(--sans);font-size:12.5px;}
.nav>a{color:var(--muted);text-decoration:none;letter-spacing:.02em;}
.nav>a:hover{color:var(--ink);}
.toggle{font-family:var(--sans);font-size:12px;background:var(--surface);color:var(--ink);border:.5px solid var(--line-2);border-radius:999px;padding:6px 12px;cursor:pointer;display:flex;gap:6px;align-items:center;}
.toggle:hover{border-color:var(--ink);}

.wrap{max-width:660px;margin:0 auto;padding:3rem 1.5rem 6rem;}
/* dedicated reading view: wider container that scales on large screens
   (good on 4K), no box chrome. Everything shares one width so the
   headline, byline, and body align to the same edges. The container
   itself is capped so lines never get unreadably long. */
.wrap--wide{max-width:clamp(720px, 62vw, 940px);}
.wrap--wide .post-box{border:0;border-radius:0;background:none;padding:1rem 0 0;margin:0;}
.wrap--wide .post-box .notch-badge{display:none;}
.wrap--wide .article-body p{font-size:20px;line-height:1.72;}

/* shared permalink glyph */
.permalink{color:var(--ink);text-decoration:none;line-height:1;padding:4px;border-radius:6px;}
.permalink:hover{background:var(--surface);}

/* shared post box — every post sits in its own bordered frame */
.post-box{position:relative;border:.5px solid var(--line-2);border-radius:14px;padding:2rem 1.8rem 1.4rem;background:var(--bg);margin:0 0 2rem;}
.post-box:last-of-type{margin-bottom:0;}

/* badge notched into the top border: border–icon–border illusion.
   The swatch background masks the border line behind the icon. */
.notch-badge{position:absolute;top:0;left:50%;transform:translate(-50%,-50%);
  width:34px;height:24px;background:var(--bg);display:flex;align-items:center;justify-content:center;}
.notch-badge svg{width:17px;height:17px;stroke:var(--ink);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}

/* centered permalink on its own line at the foot of each box */
.permalink-row{margin:1.4rem 0 0;display:flex;justify-content:center;}
.permalink-row .permalink{font-size:18px;}

/* kicker / category */
.kicker{font-family:var(--sans);font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;margin:0 0 .9rem;}
.kicker a{color:var(--muted);text-decoration:none;}
.kicker a:hover{color:var(--ink);}

/* full article */
.headline{font-family:var(--serif);font-weight:600;font-size:clamp(30px,5.5vw,44px);line-height:1.05;letter-spacing:-.018em;margin:0 0 1.4rem;color:var(--ink);font-variation-settings:'opsz' 80,'SOFT' 0;}
.byline-block{font-family:var(--sans);border-top:.5px solid var(--line);border-bottom:.5px solid var(--line);padding:.9rem 0;margin:0 0 2.2rem;}
.byline{font-size:13.5px;line-height:1.5;margin:0 0 5px;color:var(--ink);}
.byline a{color:var(--ink);text-decoration:none;border-bottom:1px solid var(--line-2);}
.byline a:hover{border-bottom-color:var(--ink);}
.timestamps{font-size:12px;line-height:1.55;margin:0;color:var(--muted);}
.article-body p{font-size:19px;line-height:1.68;margin:0 0 1.35rem;color:var(--ink-2);}
.article-body h2{font-family:var(--serif);font-weight:600;font-size:27px;line-height:1.15;letter-spacing:-.01em;margin:2.4rem 0 1rem;color:var(--ink);font-variation-settings:'opsz' 50,'SOFT' 0;}
.article-body h3{font-family:var(--serif);font-weight:600;font-size:21px;margin:2rem 0 .8rem;color:var(--ink);}
.article-body blockquote{font-family:var(--read);font-style:italic;font-size:20px;line-height:1.55;color:var(--muted);border-left:2px solid var(--line-2);margin:1.6rem 0;padding:0 0 0 1.2rem;}
.article-body img{max-width:100%;border-radius:10px;border:.5px solid var(--line);display:block;margin:1.6rem 0;}
.article-body code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.85em;background:var(--surface);padding:2px 6px;border-radius:5px;}
.article-body pre{background:var(--surface);border:.5px solid var(--line);border-radius:10px;padding:1.1rem 1.3rem;overflow:auto;margin:1.6rem 0;}
.article-body pre code{background:none;padding:0;}
.article-body > p:first-of-type::first-letter{float:left;font-family:var(--serif);font-weight:600;font-size:5.1em;line-height:.7;padding:.05em .09em 0 0;color:var(--ink);font-variation-settings:'opsz' 144,'SOFT' 0;}
.article-body a{color:var(--ink);text-decoration:none;border-bottom:1px solid var(--line-2);}
.article-body a:hover{border-bottom-color:var(--ink);}

/* link post (border + badge now handled by .post-box / .notch-badge) */
.lc-head{display:flex;justify-content:space-between;align-items:baseline;font-family:var(--sans);margin:.3rem 0 1.1rem;gap:1rem;}
.lc-author{font-size:12.5px;font-weight:500;color:var(--ink);letter-spacing:.02em;}
.lc-author span{color:var(--faint);font-weight:400;}
.lc-date{font-size:12.5px;color:var(--muted);white-space:nowrap;}
.lc-grid{display:grid;grid-template-columns:minmax(0,1fr) 190px;gap:1.6rem;align-items:start;}
.lc-intro{margin:0;font-family:var(--read);font-size:16.5px;line-height:1.6;color:var(--ink-2);}
.lc-lead{font-family:var(--serif);font-weight:600;font-size:21px;line-height:1.15;color:var(--ink);letter-spacing:-.01em;text-decoration:none;}
.lc-lead:hover{text-decoration:underline;text-underline-offset:3px;}
.lc-srccard{text-decoration:none;display:block;}
.lc-thumb{width:100%;aspect-ratio:4/3;background:var(--surface);border-radius:10px;object-fit:cover;display:block;border:.5px solid var(--line);}
.lc-thumb--empty{display:block;}
.lc-body{margin:1.5rem 0 0;padding:1.5rem 0 0;border-top:.5px solid var(--line);font-family:var(--read);}
.lc-body p{font-size:16px;line-height:1.65;margin:0 0 1rem;color:var(--ink-2);}
.lc-body a{color:var(--ink);text-decoration:none;border-bottom:1px solid var(--line-2);}
.lc-thoughts{font-family:var(--read);font-size:14px;color:var(--muted);margin:1.1rem 0 0;display:flex;align-items:center;gap:8px;}
.lc-thoughts .by{color:var(--faint);font-style:italic;}
.lc-thoughts .name{color:var(--ink);font-style:italic;}

/* feed (boxed previews) */
.feed-headline{font-family:var(--serif);font-weight:600;font-size:28px;line-height:1.1;letter-spacing:-.015em;margin:0 0 .5rem;font-variation-settings:'opsz' 60,'SOFT' 0;}
.feed-headline a{color:var(--ink);text-decoration:none;}
.feed-headline a:hover{text-decoration:underline;text-underline-offset:3px;}
.feed-dek{font-size:17px;line-height:1.55;color:var(--muted);margin:0;}

/* standalone pages (Colophon, Indexes) */
.page-title{font-family:var(--sans);font-weight:600;font-size:clamp(28px,5vw,40px);line-height:1.05;letter-spacing:-.01em;margin:0 0 1.4rem;color:var(--ink);}
.page-intro{font-family:var(--read);font-size:19px;line-height:1.6;color:var(--ink-2);margin:0 0 2.4rem;}
.page--colophon .page-body > p:first-of-type::first-letter{float:left;font-family:var(--serif);font-weight:600;font-size:5.1em;line-height:.7;padding:.05em .09em 0 0;color:var(--ink);font-variation-settings:'opsz' 144,'SOFT' 0;}

/* indexes: sections of curated links with status dots */
.index-section{margin:0 0 2.6rem;}
.index-section-title{font-family:var(--sans);font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 .4rem;}
.index-section-intro{font-family:var(--read);font-size:15px;line-height:1.55;color:var(--faint);margin:0 0 1rem;}
.index-list{list-style:none;margin:0;padding:0;}
.index-link{display:flex;align-items:baseline;gap:10px;padding:.5rem 0;border-bottom:.5px solid var(--line);font-family:var(--read);}
.index-link:last-child{border-bottom:0;}
.index-link-title{font-size:17px;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--line-2);}
.index-link-title:hover{border-bottom-color:var(--ink);}
.index-link-note{font-size:14px;color:var(--muted);}

/* status dot — matches the monochrome system */
.status{flex:0 0 auto;width:8px;height:8px;border-radius:50%;align-self:center;position:relative;top:1px;}
.status.is-up{background:var(--ink);}
.status.is-down{background:transparent;border:1.5px solid var(--line-2);}
.status.is-unknown{background:transparent;border:1.5px dotted var(--faint);}

/* ── site footer ── */
.site-footer{max-width:660px;margin:0 auto;padding:2.5rem 1.5rem 3.5rem;border-top:.5px solid var(--line);display:flex;flex-direction:column;align-items:center;gap:1rem;text-align:center;}
.backmatter{display:flex;gap:20px;font-family:var(--sans);font-size:12.5px;}
.backmatter a{color:var(--muted);text-decoration:none;letter-spacing:.03em;}
.backmatter a:hover{color:var(--ink);}
.engine-pill{font-family:var(--mono);font-size:11px;letter-spacing:.02em;background:var(--pill-bg);color:var(--ink);border:.5px solid var(--line-2);border-radius:999px;padding:6px 14px;display:inline-flex;align-items:center;gap:8px;text-decoration:none;}
.engine-pill:hover{border-color:var(--ink);}
.engine-pill .dot{width:5px;height:5px;border-radius:50%;background:var(--muted);}
.engine-pill .lbl{color:var(--faint);}
.engine-pill .ver{color:var(--ink);font-weight:500;}
.copyright{font-family:var(--sans);font-size:11px;line-height:1.5;color:var(--faint);margin:0;max-width:42ch;}

/* ── archives ── */
.archive-list{list-style:none;margin:0;padding:0;}
.archive-row{display:grid;grid-template-columns:90px 90px 1fr;gap:14px;align-items:baseline;padding:.6rem 0;border-bottom:.5px solid var(--line);font-family:var(--sans);font-size:14px;}
.archive-date{color:var(--faint);font-size:12.5px;white-space:nowrap;}
.archive-type{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;}
.archive-title{font-family:var(--read);font-size:17px;color:var(--ink);text-decoration:none;}
.archive-title:hover{text-decoration:underline;text-underline-offset:3px;}
@media (max-width:560px){.archive-row{grid-template-columns:1fr;gap:2px;}}

/* ── engine (Mnemosyne) page — monospace ── */
.page--engine{font-family:var(--mono);}
.engine-head{margin:0 0 2.5rem;}
.engine-name{font-family:var(--mono);font-weight:500;font-size:30px;letter-spacing:-.01em;margin:0;color:var(--ink);}
.engine-ver{font-family:var(--mono);font-size:13px;color:var(--muted);margin:.2rem 0 0;}
.engine-tagline{font-family:var(--mono);font-size:13px;color:var(--faint);margin:.8rem 0 0;}
.engine-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:0 0 3rem;}
.engine-feature{border:.5px solid var(--line-2);border-radius:10px;padding:1.1rem 1.2rem;background:var(--bg);}
.engine-feature-title{font-family:var(--mono);font-size:13px;font-weight:500;margin:0 0 .4rem;color:var(--ink);}
.engine-feature-desc{font-family:var(--mono);font-size:12px;line-height:1.5;color:var(--muted);margin:0;}
.engine-history-title{font-family:var(--mono);font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--faint);margin:0 0 1rem;}
.engine-version{display:grid;grid-template-columns:60px 1fr;gap:14px;padding:.55rem 0;border-bottom:.5px solid var(--line);}
.engine-version-tag{font-family:var(--mono);font-size:12px;color:var(--ink);font-weight:500;}
.engine-version-notes{font-family:var(--mono);font-size:12px;line-height:1.5;color:var(--muted);}

/* ── figures: captions + alignment ── */
.fig{margin:1.8rem 0;}
.fig img{width:100%;border-radius:10px;border:.5px solid var(--line);display:block;}
.fig-caption{font-family:var(--read);font-style:italic;font-size:14px;line-height:1.5;color:var(--muted);margin:.5rem 0 0;text-align:center;}
.fig--center{text-align:center;}
.fig--left{float:left;width:min(48%,300px);margin:.4rem 1.6rem 1.1rem 0;}
.fig--right{float:right;width:min(48%,300px);margin:.4rem 0 1.1rem 1.6rem;}
.fig--left .fig-caption,.fig--right .fig-caption{text-align:left;}
@media (max-width:560px){.fig--left,.fig--right{float:none;width:100%;margin:1.8rem 0;}}

/* focus + motion */
a:focus-visible,button:focus-visible{outline:2px solid var(--ink);outline-offset:3px;border-radius:3px;}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important;}}

@media (max-width:560px){
  .lc-grid{grid-template-columns:1fr;}
  .lc-srccard{order:-1;}
  .lc-thumb{aspect-ratio:16/9;}
  .masthead{padding:2rem 1.25rem 1.25rem;}
  .wrap{padding:2.5rem 1.25rem 4rem;}
}
`;
