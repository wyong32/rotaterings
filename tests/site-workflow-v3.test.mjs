import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { prepareManifest } from '../scripts/seo-manifest-lib.mjs';

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("public app sources use current metadata without copied advertising", async () => {
  const paths = [
    "app/layout.tsx",
    "app/levels/layout.tsx",
    "app/blog/layout.tsx",
    "app/download/layout.tsx",
    "app/about-us/layout.tsx",
    "app/contact-us/layout.tsx",
    "app/privacy-policy/layout.tsx",
    "app/terms-of-service/layout.tsx",
    "app/levels/page.tsx",
    "app/blog/page.tsx",
    "app/download/page.tsx",
    "app/about-us/page.tsx",
    "app/contact-us/page.tsx",
    "app/privacy-policy/page.tsx",
    "app/terms-of-service/page.tsx",
  ];
  const combined = (await Promise.all(paths.map(source))).join("\n");

  assert.doesNotMatch(combined, /July 2026|Colony Flow|ant colony|worker ants/i);
  assert.doesNotMatch(combined, /@JamBusSandfallGuide/);
  assert.doesNotMatch(combined, /GptAd/);
  assert.doesNotMatch(combined, /AffiliateAd|adsbygoogle|googletagmanager|ca-pub-/);
  assert.match(combined, /siteDescription/);
});

test("site scripts include the configured analytics tag without advertising", async () => {
  const [layout, scripts, finder] = await Promise.all([
    source("app/layout.tsx"),
    source("components/site-scripts.tsx"),
    source("app/find-level/page.tsx"),
  ]);

  assert.match(layout, /<SiteScripts\s*\/>/);
  assert.doesNotMatch(layout, /googletagmanager|adsbygoogle|AffiliateGlobalAds/);
  assert.match(scripts, /googletagmanager/);
  assert.match(scripts, /G-1B8QN68TBD/);
  assert.doesNotMatch(scripts, /adsbygoogle|AffiliateGlobalAds|ca-pub-/);
  assert.doesNotMatch(finder, /AffiliateAd|adsbygoogle/);
});

test("sitemap uses stable dates and publishes the screenshot finder", async () => {
  const [sitemap, site] = await Promise.all([
    source("app/sitemap.ts"),
    source("lib/site.ts"),
  ]);
  const manifest = JSON.parse(await source("public/seo-manifest.json"));
  const siteUpdatedAt = site.match(/LAST_SITE_UPDATE\s*=\s*["']([^"']+)/)?.[1];
  assert.ok(siteUpdatedAt);
  const expectedLastModified = new Date(siteUpdatedAt).toISOString();

  assert.match(sitemap, /seoManifest\.entries/);
  assert.ok(manifest.entries.some((entry) => entry.path === "/find-level/"));
  assert.ok(manifest.entries.every((entry) =>
    Date.parse(entry.lastModified) >= Date.parse(expectedLastModified) &&
    Date.parse(entry.lastModified) <= Date.parse(manifest.generatedAt)));
  const repeat = prepareManifest({ ...manifest,
    generatedAt: new Date(Date.parse(manifest.generatedAt) + 1000).toISOString(),
  }, manifest);
  assert.deepEqual(repeat.entries.map(entry => entry.lastModified),
    manifest.entries.map(entry => entry.lastModified));
  assert.doesNotMatch(sitemap, /lastModified:\s*new Date\(\)/);
});

test("levels page and footer expose the main guide routes", async () => {
  const [levels, footer, readme] = await Promise.all([
    source("app/levels/page.tsx"),
    source("components/footer.tsx"),
    source("README.md"),
  ]);

  assert.match(levels, /<h1/);
  assert.match(levels, /Levels 1-\{MAX_LEVEL\} Walkthroughs/);
  assert.match(levels, /\/find-level\//);
  assert.match(footer, /\/find-level\//);
  assert.match(readme, /https:\/\/jambussandfall\.org\/find-level\//);
  assert.doesNotMatch(readme, /Vercel|GitHub|new-game-site-launch-workflow/i);
});

test("site configuration uses official Jam Bus store links and no stale game terms", async () => {
  const [site, packageJson, layout] = await Promise.all([
    source("lib/site.ts"),
    source("package.json"),
    source("app/layout.tsx"),
  ]);
  const combined = `${site}\n${layout}`;

  assert.match(site, /id6797530374/);
  assert.match(site, /bus\.sand\.fall\.jam\.loop\.traffic\.flow/);
  assert.match(packageJson, /jambussandfall-guide/);
  assert.doesNotMatch(combined, /Colony Flow|ant colony|worker ants|pixel-art board/i);
});

test("level search inputs have stable labels, ids, and names", async () => {
  const [navbar, hero, dialog] = await Promise.all([
    source("components/layout/site-navbar.tsx"),
    source("components/home/hero-section.tsx"),
    source("components/level/level-search.tsx"),
  ]);
  const combined = `${navbar}\n${hero}\n${dialog}`;

  assert.match(combined, /site-level-search/);
  assert.match(combined, /hero-level-search/);
  assert.match(combined, /level-dialog-search/);
  assert.ok((combined.match(/name="level"/g) || []).length >= 3);
});

test("mobile navigation and secondary text meet the local accessibility contract", async () => {
  const [navbar, styles] = await Promise.all([
    source("components/layout/site-navbar.tsx"),
    source("app/globals.css"),
  ]);

  assert.match(navbar, /aria-label=\{mobileMenuOpen \? "Close navigation" : "Open navigation"\}/);
  assert.match(navbar, /aria-expanded=\{mobileMenuOpen\}/);
  assert.match(styles, /--muted-foreground:\s*30 8% 42%/);
  assert.match(styles, /--primary:\s*25 87% 34%/);
});
