import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function loadGuides() {
  const output = ts.transpileModule(read("data/guides.ts"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports });
  return module.exports.guides;
}

function guideWordCount(guide) {
  const text = [
    guide.title,
    guide.description,
    ...guide.introduction,
    ...guide.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.items ?? []),
    ]),
    ...guide.faq.flatMap((item) => [item.question, item.answer]),
  ].join(" ");

  return text.trim().split(/\s+/).filter(Boolean).length;
}

test("publishes four substantial evergreen guides with distinct metadata", () => {
  const guides = loadGuides();
  const requiredSlugs = ["how-to-play", "tips", "level-numbers-changed", "where-to-play"];

  assert.deepEqual(Array.from(guides, (guide) => guide.slug), requiredSlugs);
  assert.equal(new Set(guides.map((guide) => guide.title)).size, guides.length);
  assert.equal(new Set(guides.map((guide) => guide.description)).size, guides.length);

  for (const guide of guides) {
    const words = guideWordCount(guide);
    assert.ok(words >= 800, `${guide.slug} has only ${words} words`);
    assert.ok(words <= 1200, `${guide.slug} has ${words} words`);
    assert.match(guide.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(guide.modifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(guide.relatedLevelIds.length >= 3);
  }
});

test("guide routes provide canonical metadata, Article schema, breadcrumbs, and useful links", () => {
  const indexPage = read("app/guides/page.tsx");
  const routeLayout = read("app/guides/[slug]/layout.tsx");
  const routePage = read("app/guides/[slug]/page.tsx");
  const combined = `${indexPage}\n${routeLayout}\n${routePage}`;

  assert.match(routeLayout, /generateMetadata/);
  assert.match(routeLayout, /canonical\(`\/guides\/\$\{slug\}/);
  assert.match(routeLayout, /["']@type["']:\s*["']Article["']/);
  assert.match(routeLayout, /["']@type["']:\s*["']BreadcrumbList["']/);
  assert.match(combined, /\/levels\//);
  assert.match(combined, /\/find-level\//);
  assert.match(combined, /\/download\//);
  assert.match(routePage, /levelPath/);
});

test("legacy evergreen blog URLs redirect permanently in one hop", () => {
  const config = read("next.config.ts");
  const expected = [
    ["/blog/how-to-play-rotate-rings/", "/guides/how-to-play/"],
    ["/blog/rotate-rings-removal-order-strategy/", "/guides/tips/"],
    ["/blog/find-rotate-rings-level-by-screenshot/", "/guides/level-numbers-changed/"],
  ];

  for (const [source, destination] of expected) {
    assert.match(config, new RegExp(`source:\\s*["']${source.replaceAll("/", "\\/")}["']`));
    assert.match(config, new RegExp(`destination:\\s*["']${destination.replaceAll("/", "\\/")}["']`));
  }
  assert.ok((config.match(/permanent:\s*true/g) ?? []).length >= 4);

  const blogData = read("data/blog-posts.ts");
  assert.doesNotMatch(blogData, /slug:\s*["'](?:how-to-play-rotate-rings|rotate-rings-removal-order-strategy|find-rotate-rings-level-by-screenshot)["']/);
});

test("primary navigation links to the evergreen guide library", () => {
  assert.match(read("components/layout/site-navbar.tsx"), /href:\s*["']\/guides\/["']/);
  assert.match(read("components/footer.tsx"), /["']\/guides\/["']/);
});
