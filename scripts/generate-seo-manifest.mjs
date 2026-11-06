import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
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
const blogSlugs = [...blogSource.matchAll(/\bslug:\s*["']([^"']+)["']/g)].map((match) => match[1]);
if (blogSlugs.length === 0) throw new Error("No published blog slugs found in data/blog-posts.ts");

const shared = sourceBundle([
  "app/layout.tsx",
  "lib/site.ts",
  "components/layout/site-navbar.tsx",
  "components/footer.tsx",
]);
const pageDate = new Date(siteUpdatedAt).toISOString();

function entry(pathname, content, changeFrequency, priority) {
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return {
    path: normalizedPath,
    canonicalUrl: new URL(normalizedPath, siteUrl).href,
    indexable: true,
    contentFingerprint: fingerprint(shared, content),
    lastModified: pageDate,
    changeFrequency,
    priority,
  };
}

const entries = [
  entry("/", [sourceBundle(["app/page.tsx", ...filesUnder("components/home")]), levels], "daily", 1),
  entry("/levels/", [sourceBundle(["app/levels/page.tsx", "app/levels/layout.tsx"]), levels], "weekly", 0.9),
  entry("/find-level/", [sourceBundle(["app/find-level/page.tsx", "app/find-level/layout.tsx", ...filesUnder("components/finder")]), matchIndex], "weekly", 0.9),
  entry("/blog/", [sourceBundle(["app/blog/page.tsx", "app/blog/layout.tsx"]), blogSource], "daily", 0.9),
  entry("/download/", sourceBundle(["app/download/page.tsx", "app/download/layout.tsx"]), "monthly", 0.8),
  entry("/about-us/", sourceBundle(["app/about-us/page.tsx", "app/about-us/layout.tsx"]), "monthly", 0.5),
  entry("/contact-us/", sourceBundle(["app/contact-us/page.tsx", "app/contact-us/layout.tsx"]), "monthly", 0.5),
  entry("/privacy-policy/", sourceBundle(["app/privacy-policy/page.tsx", "app/privacy-policy/layout.tsx"]), "yearly", 0.3),
  entry("/terms-of-service/", sourceBundle(["app/terms-of-service/page.tsx", "app/terms-of-service/layout.tsx"]), "yearly", 0.3),
];

const levelTemplate = sourceBundle(["app/levels/[id]/page.tsx", "app/levels/[id]/layout.tsx"]);
for (const level of levels) {
  const related = levels
    .filter((candidate) => candidate.id !== level.id)
    .sort((left, right) => Math.abs(Number(left.id) - Number(level.id)) - Math.abs(Number(right.id) - Number(level.id)))
    .slice(0, 8)
    .map(({ id, coverImage, title }) => ({ id, coverImage, title }));
  entries.push(entry(`/levels/${level.id}/`, [levelTemplate, level, guides[level.id], related], "weekly", 0.8));
}

const blogTemplate = sourceBundle(["app/blog/[slug]/page.tsx", "app/blog/[slug]/layout.tsx"]);
for (const slug of blogSlugs) {
  entries.push(entry(`/blog/${slug}/`, [blogTemplate, blogSource, slug], "monthly", 0.7));
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
