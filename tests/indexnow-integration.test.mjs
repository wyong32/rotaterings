import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { notifyIndexNow } from "../scripts/notify-indexnow.mjs";
import { validateManifest } from "../scripts/seo-manifest-lib.mjs";

const manifest = JSON.parse(fs.readFileSync("public/seo-manifest.json", "utf8"));
const key = fs.readFileSync("public/9a87c67e460ebc82953c717d7bceacee.txt", "utf8").trim();
const workflow = fs.readFileSync(".github/workflows/indexnow.yml", "utf8");
const sitemap = fs.readFileSync("app/sitemap.ts", "utf8");
const levels = JSON.parse(fs.readFileSync("data/levels.json", "utf8"));
const blogSource = fs.readFileSync("data/blog-posts.ts", "utf8");
const blogCount = [...blogSource.matchAll(/\bslug:\s*["']([^"']+)["']/g)].length;
const guideSource = fs.readFileSync("data/guides.ts", "utf8");
const guideCount = [...guideSource.matchAll(/\bslug:\s*["']([^"']+)["']/g)].length;
const expectedRouteCount = 10 + levels.length + blogCount + guideCount;

test("SEO manifest lists every public canonical route once", () => {
  assert.deepEqual(validateManifest(manifest), []);
  assert.equal(manifest.entries.length, expectedRouteCount);
  assert.equal(new Set(manifest.entries.map((entry) => entry.canonicalUrl)).size, expectedRouteCount);
  assert.ok(manifest.entries.some((entry) => entry.canonicalUrl === "https://rotaterings.online/levels/level-10/"));
  assert.ok(manifest.entries.some((entry) => entry.canonicalUrl === "https://rotaterings.online/find-level/"));
  assert.ok(manifest.entries.some((entry) => entry.canonicalUrl === "https://rotaterings.online/guides/how-to-play/"));
});

test("IndexNow uses a public validation key and waits for production", () => {
  assert.match(key, /^[a-f0-9]{32}$/);
  assert.match(workflow, /deployment_status/);
  assert.match(workflow, /push:/);
  assert.match(workflow, /workflow_dispatch/);
  assert.match(workflow, /vercel\[bot\]/);
  assert.match(workflow, /seo-manifest\.json/);
  assert.match(workflow, /notify-indexnow\.mjs/);
  assert.match(workflow, /upload-artifact/);
});

test("Sitemap and IndexNow share the same route manifest", async () => {
  assert.match(sitemap, /seoManifest\.entries/);
  const dryRun = await notifyIndexNow({ current: manifest, checkpoint: null });
  assert.equal(dryRun.mode, "dry-run");
  assert.equal(dryRun.urls, expectedRouteCount + manifest.deletedUrls.length);
});
