import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import { prepareManifest } from "./seo-manifest-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "public", "seo-manifest.json");
const generatedAt = new Date().toISOString();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function readTypeScriptModule(relativePath) {
  const output = ts.transpileModule(read(relativePath), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports });
  return module.exports;
}

function filesUnder(relativeDirectory) {
  const directory = path.join(root, relativeDirectory);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => entry.isDirectory()
      ? filesUnder(path.join(relativeDirectory, entry.name))
      : [path.join(relativeDirectory, entry.name)])
    .sort();
}

function fingerprint(...parts) {
  const hash = createHash("sha256");
  for (const part of parts.flat(Infinity)) {
    hash.update(typeof part === "string" ? part : JSON.stringify(part));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}

function sourceBundle(files) {
  return files.map((file) => [file, read(file)]);
}

const siteSource = read("lib/site.ts");
const siteUrl = siteSource.match(/SITE_URL\s*=\s*["']([^"']+)/)?.[1];
const siteUpdatedAt = siteSource.match(/LAST_SITE_UPDATE\s*=\s*["']([^"']+)/)?.[1];
if (!siteUrl || !siteUpdatedAt) throw new Error("Could not read SITE_URL or LAST_SITE_UPDATE from lib/site.ts");

const levels = readJson("data/levels.json");
const guides = readJson("data/level-guides.json");
const matchIndex = readJson("public/data/level-match-index.json");
const blogSource = read("data/blog-posts.ts");
const { blogPosts } = readTypeScriptModule("data/blog-posts.ts");
const evergreenGuideSource = read("data/guides.ts");
const { guides: evergreenGuides } = readTypeScriptModule("data/guides.ts");
if (!Array.isArray(blogPosts)) throw new Error("Could not read blog posts from data/blog-posts.ts");
if (!Array.isArray(evergreenGuides) || evergreenGuides.length !== 4) throw new Error("Expected four evergreen guides in data/guides.ts");

const shared = sourceBundle([
  "app/layout.tsx",
  "lib/site.ts",
  "components/layout/site-navbar.tsx",
  "components/footer.tsx",
]);
const pageDate = new Date(siteUpdatedAt).toISOString();

function pageTimestamp(value, label) {
  const timestamp = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00.000Z` : new Date(value).toISOString();
  if (Number.isNaN(Date.parse(timestamp))) throw new Error(`${label} has an invalid page date`);
  if (Date.parse(timestamp) > Date.parse(generatedAt)) throw new Error(`${label} page date is later than manifest generation`);
  return timestamp;
}

function latestTimestamp(records, fallback) {
  return records.reduce((latest, record) => {
    const candidate = pageTimestamp(record.modifiedAt ?? record.date ?? fallback, record.slug ?? record.id ?? "record");
    return Date.parse(candidate) > Date.parse(latest) ? candidate : latest;
  }, pageTimestamp(fallback, "fallback"));
}

function entry(pathname, content, modifiedAt, changeFrequency, priority) {
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return {
    path: normalizedPath,
    canonicalUrl: new URL(normalizedPath, siteUrl).href,
    indexable: true,
    contentFingerprint: fingerprint(shared, content),
    lastModified: pageTimestamp(modifiedAt, normalizedPath),
    changeFrequency,
    priority,
  };
}

const latestLevelDate = latestTimestamp(levels, siteUpdatedAt);
const latestGuideDate = latestTimestamp(evergreenGuides, siteUpdatedAt);
const latestBlogDate = latestTimestamp(blogPosts, siteUpdatedAt);

const entries = [
  entry("/", [sourceBundle(["app/page.tsx", ...filesUnder("components/home")]), levels], latestLevelDate, "weekly", 1),
  entry("/levels/", [sourceBundle(["app/levels/page.tsx", "app/levels/layout.tsx"]), levels], latestLevelDate, "weekly", 0.9),
  entry("/find-level/", [sourceBundle(["app/find-level/page.tsx", "app/find-level/layout.tsx", ...filesUnder("components/finder")]), matchIndex, levels.map(({ id, modifiedAt }) => ({ id, modifiedAt }))], latestLevelDate, "weekly", 0.9),
  entry("/guides/", [sourceBundle(["app/guides/page.tsx", "app/guides/layout.tsx"]), evergreenGuideSource], latestGuideDate, "monthly", 0.8),
  entry("/blog/", [sourceBundle(["app/blog/page.tsx", "app/blog/layout.tsx"]), blogSource], latestBlogDate, "weekly", 0.9),
  entry("/download/", sourceBundle(["app/download/page.tsx", "app/download/layout.tsx"]), pageDate, "monthly", 0.8),
  entry("/about-us/", sourceBundle(["app/about-us/page.tsx", "app/about-us/layout.tsx"]), pageDate, "monthly", 0.5),
  entry("/contact-us/", sourceBundle(["app/contact-us/page.tsx", "app/contact-us/layout.tsx"]), pageDate, "monthly", 0.5),
  entry("/privacy-policy/", sourceBundle(["app/privacy-policy/page.tsx", "app/privacy-policy/layout.tsx"]), pageDate, "yearly", 0.3),
  entry("/terms-of-service/", sourceBundle(["app/terms-of-service/page.tsx", "app/terms-of-service/layout.tsx"]), pageDate, "yearly", 0.3),
];

const levelTemplate = sourceBundle(["app/levels/[id]/page.tsx", "app/levels/[id]/layout.tsx"]);
for (const level of levels) {
  const related = levels
    .filter((candidate) => candidate.id !== level.id)
    .sort((left, right) => Math.abs(Number(left.id) - Number(level.id)) - Math.abs(Number(right.id) - Number(level.id)))
    .slice(0, 8)
    .map(({ id, coverImage, title }) => ({ id, coverImage, title }));
  entries.push(entry(`/levels/level-${level.id}/`, [levelTemplate, level, guides[level.id], related], level.modifiedAt, "monthly", 0.8));
}

const blogTemplate = sourceBundle(["app/blog/[slug]/page.tsx", "app/blog/[slug]/layout.tsx"]);
for (const post of blogPosts) {
  entries.push(entry(`/blog/${post.slug}/`, [blogTemplate, post], post.modifiedAt ?? post.date, "monthly", 0.7));
}

const evergreenGuideTemplate = sourceBundle(["app/guides/[slug]/page.tsx", "app/guides/[slug]/layout.tsx"]);
for (const guide of evergreenGuides) {
  entries.push(entry(`/guides/${guide.slug}/`, [evergreenGuideTemplate, guide], guide.modifiedAt, "monthly", 0.7));
}

entries.sort((left, right) => left.canonicalUrl.localeCompare(right.canonicalUrl));
const candidate = {
  schemaVersion: 1,
  fingerprintVersion: "rotaterings-content-v1",
  siteUrl,
  generatedAt,
  entries,
  deletedUrls: [],
  deletedAt: {},
};

let previous = null;
if (fs.existsSync(outputPath)) previous = JSON.parse(fs.readFileSync(outputPath, "utf8"));
const manifest = prepareManifest(candidate, previous);
manifest.deployment = {
  provider: "vercel",
  environment: process.env.VERCEL_ENV || "local",
  gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || process.env.SEO_GIT_COMMIT_SHA || "local",
};

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output: outputPath, entries: manifest.entries.length }, null, 2));
