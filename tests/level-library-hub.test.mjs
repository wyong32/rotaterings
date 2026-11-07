import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(file, "utf8");
const page = read("app/levels/page.tsx");
const layout = read("app/levels/layout.tsx");
const library = read("components/level/level-library.tsx");
const card = read("components/level/level-card.tsx");
const utils = read("lib/level-utils.ts");
const levels = JSON.parse(read("data/levels.json"));

test("levels hub owns the 1-260 library intent and four editorial ranges", () => {
  assert.match(page, /Rotate Rings Levels 1-260 Walkthroughs/);
  for (const range of ["1-30", "31-99", "100-200", "201-260"]) assert.match(page, new RegExp(range));
  assert.match(layout, /Levels 1-260/);
  assert.match(page, /TARGET_LEVEL_COUNT/);
  assert.match(page, /levels\.length/);
  assert.equal(levels.length, 10);
});

test("level grid links only published records and exposes useful facts", () => {
  assert.match(library, /levels\.filter/);
  assert.match(library, /levelPath/);
  assert.match(library, /No verified guides are published in this range yet/);
  assert.doesNotMatch(library, /Array\.from\(\{ length: 260/);
  assert.match(card, /verifiedMoveCount/);
  assert.match(card, /DifficultyBadge/);
  assert.match(utils, /deriveLevelDifficulty/);
});

test("levels hub explains missing numbers and points to screenshot matching", () => {
  const sources = [page, library].join(" ");
  const words = sources.match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
  assert.ok(words.length >= 1050, `level hub source contains only ${words.length} words`);
  assert.match(page, /level order changed/i);
  assert.match(page, /find-level/);
  assert.match(page, /Missing numbers/);
});

test("levels hub publishes collection, item-list, breadcrumb schema and guide links", () => {
  assert.match(page, /"@type": "CollectionPage"/);
  assert.match(page, /"@type": "ItemList"/);
  assert.match(page, /"@type": "BreadcrumbList"/);
  assert.match(page, /levels\.map/);
  assert.doesNotMatch(layout, /levels-schema|CollectionPage|ItemList/);
  for (const slug of ["how-to-play", "tips", "level-numbers-changed", "where-to-play"]) {
    assert.match(page, new RegExp(`/guides/${slug}/`));
  }
});

