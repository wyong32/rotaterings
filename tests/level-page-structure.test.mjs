import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(file, "utf8");
const page = read("app/levels/[id]/page.tsx");
const quick = read("components/level/level-quick-answer.tsx");
const steps = read("components/level/level-step-guide.tsx");
const mistakes = read("components/level/level-mistakes.tsx");
const nearby = read("components/level/nearby-levels.tsx");
const guides = JSON.parse(read("data/level-guides.json"));

test("canonical level page parses level-N and puts the answer before navigation", () => {
  assert.match(page, /parseLevelSlug/);
  assert.match(page, /<LevelQuickAnswer/);
  assert.match(page, /<LevelStepGuide/);
  assert.match(page, /<LevelMistakes/);
  assert.match(page, /<NearbyLevels/);
  assert.ok(page.indexOf("<LevelQuickAnswer") < page.indexOf("<NearbyLevels"));
  assert.doesNotMatch(page, /More Rotate Rings Levels/);
  assert.match(quick, /Quick Answer/);
  assert.match(steps, /Step-by-Step Solution/);
  assert.match(mistakes, /Common Mistakes/);
});

test("every published page has distinct challenge, mistakes, and FAQs", () => {
  const challenges = Object.values(guides).map((guide) => guide.keyChallenge);
  assert.equal(new Set(challenges).size, challenges.length);
  for (const [id, guide] of Object.entries(guides)) {
    assert.ok(guide.previousLevelDifference.length > 40, `Level ${id} needs a comparison`);
    assert.ok(guide.commonMistakes.length >= 2, `Level ${id} needs concrete mistakes`);
    assert.ok(guide.faqs.length >= 2, `Level ${id} needs FAQs`);
  }
});

test("nearby navigation uses nearest published levels and evergreen guide links", () => {
  assert.match(nearby, /previousLevel/);
  assert.match(nearby, /nextLevel/);
  assert.match(nearby, /nearbyLevels/);
  assert.match(nearby, /levelPath/);
  assert.match(nearby, /\/guides\/how-to-play\//);
  assert.match(nearby, /\/guides\/tips\//);
});

