import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { prepareManifest } from "../scripts/seo-manifest-lib.mjs";

const manifest = JSON.parse(fs.readFileSync("public/seo-manifest.json", "utf8"));
const generator = fs.readFileSync("scripts/generate-seo-manifest.mjs", "utf8");
const sitemap = fs.readFileSync("app/sitemap.ts", "utf8");

const byPath = new Map(manifest.entries.map((entry) => [entry.path, entry]));

test("manifest contains only canonical public routes and retires legacy level URLs", () => {
  assert.ok(byPath.has("/levels/level-1/"));
  assert.ok(byPath.has("/levels/level-10/"));
  assert.ok(byPath.has("/guides/"));
  assert.ok(byPath.has("/guides/how-to-play/"));
  assert.equal(byPath.has("/levels/1/"), false);
  assert.equal(byPath.has("/blog/how-to-play-rotate-rings/"), false);
  assert.ok(manifest.deletedUrls.includes("https://rotaterings.online/levels/1/"));
  assert.ok(manifest.deletedUrls.includes("https://rotaterings.online/blog/how-to-play-rotate-rings/"));
});

test("generator uses record dates and page-specific change frequencies", () => {
  assert.match(generator, /entry\(`\/levels\/level-\$\{level\.id\}\/`,[\s\S]*level\.modifiedAt[\s\S]*"monthly"/);
  assert.match(generator, /entry\(`\/guides\/\$\{guide\.slug\}\/`,[\s\S]*guide\.modifiedAt[\s\S]*"monthly"/);
  assert.match(generator, /entry\("\/",[\s\S]*"weekly",\s*1/);
  assert.match(generator, /entry\("\/blog\/",[\s\S]*"weekly",\s*0\.9/);
  assert.match(generator, /entry\("\/privacy-policy\/",[\s\S]*"yearly",\s*0\.3/);
});

test("published manifest applies the approved frequency policy", () => {
  assert.equal(byPath.get("/").changeFrequency, "weekly");
  assert.equal(byPath.get("/levels/").changeFrequency, "weekly");
  assert.equal(byPath.get("/levels/level-1/").changeFrequency, "monthly");
  assert.equal(byPath.get("/guides/how-to-play/").changeFrequency, "monthly");
  assert.equal(byPath.get("/blog/").changeFrequency, "weekly");
  assert.equal(byPath.get("/privacy-policy/").changeFrequency, "yearly");
});

test("unchanged entries keep their own lastModified timestamps", () => {
  const previous = {
    schemaVersion: 1,
    fingerprintVersion: "test-v1",
    siteUrl: "https://example.com",
    generatedAt: "2026-11-06T00:00:00.000Z",
    entries: [
      { path: "/a/", canonicalUrl: "https://example.com/a/", indexable: true, contentFingerprint: "sha256:a", lastModified: "2026-11-01T00:00:00.000Z", changeFrequency: "weekly", priority: 0.8 },
      { path: "/b/", canonicalUrl: "https://example.com/b/", indexable: true, contentFingerprint: "sha256:b", lastModified: "2026-11-02T00:00:00.000Z", changeFrequency: "monthly", priority: 0.7 },
    ],
    deletedUrls: [],
    deletedAt: {},
  };
  const candidate = structuredClone(previous);
  candidate.generatedAt = "2026-11-07T00:00:00.000Z";
  candidate.entries[0].lastModified = candidate.generatedAt;
  candidate.entries[1].lastModified = candidate.generatedAt;

  const current = prepareManifest(candidate, previous);
  assert.equal(current.entries[0].lastModified, "2026-11-01T00:00:00.000Z");
  assert.equal(current.entries[1].lastModified, "2026-11-02T00:00:00.000Z");
});

test("one changed fingerprint advances only that page timestamp", () => {
  const previous = {
    schemaVersion: 1,
    fingerprintVersion: "test-v1",
    siteUrl: "https://example.com",
    generatedAt: "2026-11-06T00:00:00.000Z",
    entries: [
      { path: "/a/", canonicalUrl: "https://example.com/a/", indexable: true, contentFingerprint: "sha256:a", lastModified: "2026-11-01T00:00:00.000Z", changeFrequency: "weekly", priority: 0.8 },
      { path: "/b/", canonicalUrl: "https://example.com/b/", indexable: true, contentFingerprint: "sha256:b", lastModified: "2026-11-02T00:00:00.000Z", changeFrequency: "monthly", priority: 0.7 },
    ],
    deletedUrls: [],
    deletedAt: {},
  };
  const candidate = structuredClone(previous);
  candidate.generatedAt = "2026-11-07T00:00:00.000Z";
  candidate.entries[0].contentFingerprint = "sha256:changed";
  candidate.entries[0].lastModified = candidate.generatedAt;
  candidate.entries[1].lastModified = candidate.generatedAt;

  const current = prepareManifest(candidate, previous);
  assert.equal(current.entries[0].lastModified, "2026-11-07T00:00:00.000Z");
  assert.equal(current.entries[1].lastModified, "2026-11-02T00:00:00.000Z");
});

test("sitemap maps active manifest entries without adding redirect routes", () => {
  assert.match(sitemap, /seoManifest\.entries/);
  assert.match(sitemap, /filter\(\(entry\) => entry\.indexable\)/);
  assert.doesNotMatch(sitemap, /blog\/how-to-play-rotate-rings|levels\/1\//);
});
