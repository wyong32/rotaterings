import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));

test("initial batch contains ten ordered Rotate Rings guides", () => {
  const levels = readJson("data/levels.json");
  const guides = readJson("data/level-guides.json");
  const sources = readJson("data/level-image-sources.json");

  assert.deepEqual(levels.map((level) => level.id), Array.from({ length: 10 }, (_, index) => String(index + 1)));
  assert.deepEqual(Object.keys(guides), Array.from({ length: 10 }, (_, index) => String(index + 1)));
  assert.deepEqual(sources.map((source) => source.levelId), Array.from({ length: 10 }, (_, index) => String(index + 1)));

  for (const level of levels) {
    const guide = guides[level.id];
    const source = sources.find((entry) => entry.levelId === level.id);

    assert.equal(level.title, `Rotate Rings Level ${level.id} Walkthrough`);
    assert.match(level.description, /ring|loop|frame/i);
    assert.ok(level.guideImages.length >= 3);
    assert.ok(guide.objective.length >= 40);
    assert.ok(guide.quickAnswer.length >= 90);
    assert.ok(guide.steps.length >= 3);
    assert.ok(guide.boardData.ringCount >= 2);
    assert.equal(guide.boardData.rings.length, guide.boardData.ringCount);
    assert.ok(guide.boardData.rings.every((ring) => Number.isFinite(ring.x) && Number.isFinite(ring.y) && Number.isFinite(ring.initialAngle)));
    assert.ok(guide.removalOrder.length >= 2);
    assert.ok(guide.stats.verifiedMoveCount >= 1);
    assert.ok(source.sourceType === "youtube-video" || source.sourceType === "official-online-config");
    assert.ok(source.crop.width > 0 && source.crop.height > 0);
  }
});

test("video-backed guide boundaries are ordered and do not overlap", () => {
  const sources = readJson("data/level-image-sources.json").filter((entry) => entry.sourceType === "youtube-video");
  assert.equal(sources.length, 9);
  assert.ok(sources.every((entry) => entry.videoId === "P7Mwdxl2oSI"));

  for (let index = 0; index < sources.length; index += 1) {
    const source = sources[index];
    assert.ok(source.startSecond < source.endSecond);
    assert.ok(source.guideTimes.length >= 3);
    assert.ok(source.guideTimes.every((time) => Number(time) >= source.startSecond && Number(time) <= source.endSecond));
    if (index > 0) {
      assert.ok(sources[index - 1].endSecond <= source.startSecond);
    }
  }
});
