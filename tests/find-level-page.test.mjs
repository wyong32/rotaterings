import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync("app/find-level/page.tsx", "utf8");
const results = fs.readFileSync("components/finder/finder-results.tsx", "utf8");
const levels = JSON.parse(fs.readFileSync("data/levels.json", "utf8"));

test("finder supports all local input methods and never uploads screenshots", () => {
  const source = fs.readFileSync("components/finder/screenshot-finder.tsx", "utf8");
  assert.match(source, /type="file"/);
  assert.match(source, /onDrop/);
  assert.match(source, /addEventListener\("paste"/);
  assert.match(source, /createImageBitmap/);
  assert.match(source, /imageOrientation:\s*"from-image"/);
  assert.match(source, /height \* 0\.1/);
  assert.match(source, /height \* 0\.43/);
  assert.match(source, /height \* 0\.13/);
  assert.match(source, /height \* 0\.38/);
  assert.doesNotMatch(source, /FormData|XMLHttpRequest|fetch\([^)]*screenshot/i);
});

test("finder exposes a recoverable error state and explicit walkthrough links", () => {
  const finder = fs.readFileSync("components/finder/screenshot-finder.tsx", "utf8");
  assert.match(finder, /role="alert"/);
  assert.match(finder, /Try another image/);
  assert.match(results, /View walkthrough/);
  assert.match(results, /Strong match|Possible match|Low confidence/);
  assert.doesNotMatch(finder, /router\.push|window\.location/);
});

test("find-level route has canonical metadata and visible tool documentation", () => {
  const layout = fs.readFileSync("app/find-level/layout.tsx", "utf8");
  assert.match(layout, /Find Your Rotate Rings Level by Screenshot/);
  assert.match(layout, /canonical\("\/find-level\/"\)/);
  assert.match(page, /Find Your Rotate Rings Level by Screenshot/);
  assert.match(page, /stays on your device/i);
  assert.match(page, /WebApplication/);
  assert.match(page, /FAQPage/);
});

test("sitemap includes the screenshot finder", () => {
  const manifest = JSON.parse(fs.readFileSync("public/seo-manifest.json", "utf8"));
  const finder = manifest.entries.find((entry) => entry.path === "/find-level/");
  assert.ok(finder);
  assert.equal(finder.priority, 0.9);
});

test("finder explains renumbering and matching limits in 400 to 600 visible words", () => {
  const start = page.indexOf("FINDER_GUIDE_COPY_START");
  const end = page.indexOf("FINDER_GUIDE_COPY_END");
  assert.ok(start >= 0 && end > start, "finder guide copy markers are required");

  const source = page.slice(start, end);
  const text = [...source.matchAll(/copy:\s*"([^"]+)"/g)].map((match) => match[1]).join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  assert.ok(words >= 400, `finder explanation has only ${words} words`);
  assert.ok(words <= 600, `finder explanation has ${words} words`);
  assert.match(text, /level numbers|reorder/i);
  assert.match(text, /opening board|complete board/i);
  assert.match(text, /does not|cannot|only/i);
});

test("finder shows the real published coverage and links to supporting pages", () => {
  assert.equal(levels.length, 10);
  assert.match(page, /getAllLevels\(\)\.length/);
  assert.match(page, /publishedLevelCount/);
  assert.match(page, /\/levels\//);
  assert.match(page, /\/guides\/level-numbers-changed\//);
  assert.doesNotMatch(page, /processed Levels 1-\{MAX_LEVEL\}/);
});

test("finder results use canonical level-N walkthrough paths", () => {
  assert.match(results, /levelPath\(result\.levelId\)/);
  assert.doesNotMatch(results, /[`"']\/levels\/\$\{/);
  assert.match(results, /View walkthrough/);
});
