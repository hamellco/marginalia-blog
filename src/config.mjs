// ─────────────────────────────────────────────────────────────
//  Marginalia — site configuration
//  Edit this file to change global settings. No other file needs
//  touching for routine changes.
// ─────────────────────────────────────────────────────────────

export const site = {
  title: "Marginalia",
  // Shown in <title> tags after the page name, and in RSS.
  tagline: "Notes in the margins of pop-culture, technology, and writing.",
  author: "Griffin D. Hamell",
  // Used to build absolute URLs (RSS, OpenGraph). No trailing slash.
  url: "https://marginalia.pages.dev",
  // The single nav link beside the theme toggle.
  navLabel: "Musings",
  navHref: "/",
  // Default theme on a visitor's first load: "light" or "dark".
  defaultTheme: "light",
  // IANA timezone used to render post timestamps (so EDT/EST is correct
  // no matter where the build runs). e.g. "America/New_York", "America/Chicago".
  timezone: "America/New_York",
  // Bylines: Mnemosyne supports per-post authors with bio pages. Marginalia
  // is single-author, so bylines are off — set to true to show "By <author>".
  showBylines: false,
};

// Author registry (used by the engine when showBylines is true). Each key is
// an author slug; posts reference authors by these slugs in frontmatter.
// Marginalia doesn't use this, but Mnemosyne supports it: clickable names →
// an author page listing their posts, with a Markdown bio.
export const authors = {
  // "griffin": { name: "Griffin D. Hamell", bio: "..." },
};

// The blogging engine version, shown in the footer pill.
// Use a trailing letter for stage: b = beta, a = alpha, rc = candidate.
export const versions = {
  engine: { codename: "Mnemosyne", version: "0.6b" },
};

// The glyph used for permalinks throughout the site.
export const permalinkGlyph = "※";
