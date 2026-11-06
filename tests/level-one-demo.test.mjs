import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const guides = JSON.parse(fs.readFileSync("data/level-guides.json", "utf8"));

test("verified Level 1 guide is specific and omits internal production labels", () => {
  const guide = guides["1"];
  assert.ok(guide, "expected a verified Level 1 guide");
  assert.match(guide.quickAnswer, /cyan|white|yellow|orange|red/i);
  assert.match(guide.quickAnswer, /bus|parking/i);
  assert.ok(guide.steps.length >= 3);

  const publishedCopy = JSON.stringify(guide);
  for (const forbidden of [
    "frame-verified",
    "video analysis",
    "video checkpoint",
    "verified tap order",
    "source transparency",
    "how this guide was verified",
    "00:05",
    "00:12",
    "00:17",
  ]) {
    assert.doesNotMatch(publishedCopy, new RegExp(forbidden, "i"));
  }
});

test("all published guides contain board-specific copy and three screenshots", () => {
  assert.equal(Object.keys(guides).length, 35);
  const quickAnswers = new Set();

  for (let id = 1; id <= 35; id += 1) {
    const guide = guides[String(id)];
    assert.ok(guide, `missing Level ${id} guide`);
    assert.ok(guide.objective.length > 20);
    assert.ok(guide.keyChallenge.length > 20);
    assert.ok(guide.quickAnswer.length > 90);
    assert.ok(guide.steps.length >= 3);
    assert.equal(guide.faqs.length, 4);
    for (const [index, step] of guide.steps.entries()) {
      assert.equal(step.image, `/levels/${id}/steps/step-${index + 1}.webp`);
    }
    quickAnswers.add(guide.quickAnswer);
  }

  assert.equal(quickAnswers.size, 35);
});
