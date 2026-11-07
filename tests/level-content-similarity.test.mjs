import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const guides = JSON.parse(fs.readFileSync("data/level-guides.json", "utf8"));

function tokens(value) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2),
  );
}

function jaccard(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / new Set([...a, ...b]).size;
}

function uniqueGuideCopy(guide) {
  return [
    guide.keyChallenge,
    guide.previousLevelDifference,
    ...(guide.commonMistakes ?? []).flatMap((mistake) => [mistake.action, mistake.consequence]),
    ...guide.steps.map((step) => step.instruction),
    ...guide.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
}

test("published level guides do not reuse near-identical solution copy", () => {
  const entries = Object.entries(guides);
  for (let left = 0; left < entries.length; left += 1) {
    for (let right = left + 1; right < entries.length; right += 1) {
      const [leftId, leftGuide] = entries[left];
      const [rightId, rightGuide] = entries[right];
      const score = jaccard(uniqueGuideCopy(leftGuide), uniqueGuideCopy(rightGuide));
      assert.ok(
        score < 0.72,
        `Levels ${leftId} and ${rightId} are too similar (${score.toFixed(3)})`,
      );
    }
  }
});

test("level-specific strategy fields are not exact duplicates", () => {
  const fields = ["keyChallenge", "previousLevelDifference", "stuckPoint"];
  for (const field of fields) {
    const values = Object.values(guides).map((guide) => guide[field]?.trim().toLowerCase());
    assert.equal(new Set(values).size, values.length, `${field} must be unique for every level`);
  }
});

