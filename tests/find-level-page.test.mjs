import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

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
  const results = fs.readFileSync("components/finder/finder-results.tsx", "utf8");
  assert.match(finder, /role="alert"/);
  assert.match(finder, /Try another image/);
  assert.match(results, /View walkthrough/);
  assert.match(results, /Strong match|Possible match|Low confidence/);
  assert.doesNotMatch(finder, /router\.push|window\.location/);
});

test("find-level route has canonical metadata and visible tool documentation", () => {
  const layout = fs.readFileSync("app/find-level/layout.tsx", "utf8");
  const page = fs.readFileSync("app/find-level/page.tsx", "utf8");
  assert.match(layout, /Find Your Jam Bus:Sandfall Level by Screenshot/);
  assert.match(layout, /canonical\("\/find-level\/"\)/);
  assert.match(page, /Find Your Jam Bus:Sandfall Level by Screenshot/);
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
