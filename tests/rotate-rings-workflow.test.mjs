import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";

const read = (file) => fs.readFileSync(file, "utf8");
const levels = JSON.parse(read("data/levels.json"));
const guides = JSON.parse(read("data/level-guides.json"));
const repositoryRoot = process.cwd();
const localWorkflowRoot = [
  path.join(repositoryRoot, "local-workflow"),
  path.resolve(repositoryRoot, "..", "..", "rotaterings", "local-workflow"),
].find((candidate) => fs.existsSync(path.join(candidate, "rotate-rings-release-plan.md")));
const automationPath = path.join(process.env.USERPROFILE ?? "", ".codex", "automations", "rotate-rings-5", "automation.toml");

test("public routes and metadata belong to rotaterings.online", () => {
  const sources = [
    "lib/site.ts",
    "app/layout.tsx",
    "app/page.tsx",
    "app/levels/layout.tsx",
    "app/levels/[id]/layout.tsx",
    "app/find-level/layout.tsx",
    "app/download/layout.tsx",
    "README.md",
  ].map(read).join("\n");

  assert.match(sources, /https:\/\/rotaterings\.online/);
  assert.match(sources, /id6793924927/);
  assert.match(sources, /com\.nebula\.rotaterings/);
  assert.match(sources, /rotate-rings-og\.webp/);
  assert.doesNotMatch(sources, /Jam Bus|Sandfall|jambussandfall|bus routing|sand color|Colony Flow/i);
});

test("level template exposes practical board and move data without video timestamps", () => {
  const page = read("app/levels/[id]/page.tsx");
  const components = [
    "components/level/level-step-guide.tsx",
    "components/level/nearby-levels.tsx",
  ].map(read).join("\n");
  const template = `${page}\n${components}`;
  for (const text of [
    "Opening Board Data",
    "Coordinates",
    "Start angle",
    "Verified Removal Order",
    "Board State by Phase",
    "Step-by-Step Solution",
    "Where players get stuck",
    "Continue with a published guide",
  ]) assert.match(template, new RegExp(text));

  assert.doesNotMatch(page, /Video checkpoint|timestamp|FRAME-VERIFIED|How This Guide Was Verified/i);
  assert.match(page, /guide\.boardData\.rings/);
  assert.match(page, /guide\.removalOrder/);
  assert.match(page, /guide\.phaseMetrics/);
});

test("all ten published guides have distinct board facts and full-interface images", async () => {
  assert.deepEqual(levels.map((level) => level.id), Array.from({ length: 10 }, (_, index) => String(index + 1)));
  const configurations = new Set();

  for (const level of levels) {
    const guide = guides[level.id];
    assert.ok(guide);
    assert.ok(guide.boardData.rings.length >= 2);
    assert.ok(guide.removalOrder.length >= 2);
    assert.ok(guide.phaseMetrics.length >= 2);
    assert.ok(guide.steps.length >= 3);
    assert.ok(guide.faqs.length >= 4);
    configurations.add(guide.boardData.officialConfigId);

    const cover = path.join("public", level.coverImage.replace(/^\//, ""));
    assert.ok(fs.existsSync(cover));
    assert.deepEqual(await sharp(cover).metadata().then(({ width, height }) => ({ width, height })), { width: 600, height: 500 });

    for (const image of level.guideImages) {
      const file = path.join("public", image.replace(/^\//, ""));
      assert.ok(fs.existsSync(file));
      const metadata = await sharp(file).metadata();
      assert.ok((metadata.height ?? 0) > (metadata.width ?? 0));
      assert.ok((metadata.height ?? 0) >= 1000);
    }
  }

  assert.equal(configurations.size, 10);
});

test("homepage includes free online play and three complete gameplay screenshots", () => {
  const home = read("app/page.tsx");
  const online = read("components/home/online-game.tsx");
  const hero = read("components/home/hero-section.tsx");
  const site = read("lib/site.ts");
  assert.match(home, /<OnlineGame/);
  assert.match(site, /games\.rotaterings\.net\/game\/rotate-rings\/index\.html\?v=20261016/);
  assert.match(online, /ONLINE_GAME_URL/);
  assert.match(online, /allowFullScreen/);
  for (const level of [2, 6, 10]) assert.match(hero, new RegExp(`rotate-rings-level-${level}\\.webp`));
  assert.match(hero, /object-contain/);
  const imageScript = read("scripts/generate-site-images.mjs");
  for (const level of [2, 6, 10]) assert.match(imageScript, new RegExp(`\"${level}\", \"steps\", \"step-1\\.webp\"`));
  assert.doesNotMatch(imageScript, /mzstatic|PurpleSource|Jam Bus|Sandfall/i);
});

test("public copy contains no inherited game terms or visible video timing labels", () => {
  const sources = [
    "components/blog/blog-hero.tsx",
    "app/blog/[slug]/layout.tsx",
    "components/home/hero-section.tsx",
    "app/levels/[id]/page.tsx",
  ].map(read).join("\n");
  assert.doesNotMatch(sources, /Jam Bus|Sandfall|bus route|sand matching|parking capacity/i);
  assert.doesNotMatch(read("app/levels/[id]/page.tsx"), /solutionDuration|Updated \{LAST_SITE_UPDATE\}/);
});

test("new site has no copied analytics or advertising account", () => {
  const sources = ["app/layout.tsx", "components/site-scripts.tsx", "components/home/hero-section.tsx"].map(read).join("\n");
  assert.doesNotMatch(sources, /googletagmanager|adsbygoogle|ca-pub-|G-1B8QN68TBD/);
});

test("README stays limited to the site summary and core public URLs", () => {
  const readme = read("README.md");
  assert.match(readme, /https:\/\/rotaterings\.online\/levels\/1\//);
  assert.match(readme, /https:\/\/rotaterings\.online\/#play/);
  assert.doesNotMatch(readme, /Vercel|GitHub|workflow|local-workflow/i);
});

test("local release plan prioritizes verified Levels 100-200 and 30-50 pages per week", { skip: !localWorkflowRoot }, () => {
  const plan = read(path.join(localWorkflowRoot, "rotate-rings-release-plan.md"));
  assert.match(plan, /Levels 100-200/i);
  assert.match(plan, /30-50 pages per week/i);
  assert.match(plan, /\/levels\/level-\{level\}\//);
  assert.match(plan, /verified-only|verified only/i);
  assert.match(plan, /11-30[\s\S]*201-260[\s\S]*31-99/i);
  assert.doesNotMatch(plan, /next five standard levels in strict numeric order/i);
});

test("local progress records the priority range, weekly target, and production gates", { skip: !localWorkflowRoot }, () => {
  const progress = JSON.parse(read(path.join(localWorkflowRoot, "update-progress.json")));
  assert.equal(progress.targetLevelCount, 260);
  assert.deepEqual(progress.priorityRange, [100, 200]);
  assert.deepEqual(progress.weeklyTarget, { minimum: 30, maximum: 50 });
  assert.deepEqual(progress.releaseOrder, ["100-200", "11-30", "201-260", "31-99"]);
  assert.equal(progress.progressAdvancementRequires.productionVerification, true);
  assert.equal(progress.progressAdvancementRequires.indexNow, true);
});

test("scheduled updater uses the verified priority queue and final publication gates", { skip: !fs.existsSync(automationPath) }, () => {
  const automation = read(automationPath);
  assert.match(automation, /100-200/);
  assert.match(automation, /30-50/);
  assert.match(automation, /\/levels\/level-N\//);
  assert.match(automation, /Vercel/);
  assert.match(automation, /IndexNow/);
  assert.match(automation, /update-progress\.json/);
  assert.doesNotMatch(automation, /下一批从 Levels 11-15 开始/);
});
