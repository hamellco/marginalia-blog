// ─────────────────────────────────────────────────────────────
//  styles.mjs — the complete Marginalia stylesheet.
//  Monochrome, light + dark. This is the whole visual system;
//  every color is a token defined once at the top.
// ─────────────────────────────────────────────────────────────

export const css = `
:root[data-theme="light"]{
  --serif:'Fraunces',Georgia,serif; --read:'Newsreader',Georgia,serif; --sans:'Space Grotesk',system-ui,sans-serif;
  --ink:#141414; --ink-2:#3a3a3a; --muted:#6e6e6e; --faint:#9c9c9c;
  --line:#e4e4e4; --line-2:#cfcfcf; --bg:#fbfbfa; --surface:#f3f2f0; --pill-bg:#f0efed;
}
:root[data-theme="dark"]{
  --serif:'Fraunces',Georgia,serif; --read:'Newsreader',Georgia,serif; --sans:'Space Grotesk',system-ui,sans-serif;
  --ink:#f2f1ee; --ink-2:#cfcdc8; --muted:#9a9893; --faint:#6b6964;
  --line:#2a2a28; --line-2:#3c3b38; --bg:#121211; --surface:#1c1c1a; --pill-bg:#222220;
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
.timestamps{font-size:12px;line-height:1.55;margin:0;color:var(--faint);}
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

/* version pills */
.pills{max-width:660px;margin:0 auto;display:flex;gap:10px;flex-wrap:wrap;padding:1.5rem 1.5rem 3rem;}.pill{font-family:var(--sans);font-size:11px;letter-spacing:.03em;background:var(--pill-bg);color:var(--ink);border:.5px solid var(--line-2);border-radius:999px;padding:6px 13px;display:inline-flex;align-items:center;gap:7px;}
.pill .dot{width:5px;height:5px;border-radius:50%;background:var(--muted);}
.pill .lbl{color:var(--faint);text-transform:uppercase;letter-spacing:.08em;font-size:10px;}
.pill .ver{color:var(--ink);font-weight:500;}

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
