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
};

// Footer version pills. Bump these by hand when you ship changes.
export const versions = {
  design:  { codename: "Daedalus",  version: "2.1" },
  backend: { codename: "Mnemosyne", version: "4.0" },
};

// The glyph used for permalinks throughout the site.
export const permalinkGlyph = "※";
