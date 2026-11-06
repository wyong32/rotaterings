import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const guides = JSON.parse(fs.readFileSync("data/level-guides.json", "utf8"));
const levels = JSON.parse(fs.readFileSync("data/levels.json", "utf8"));

const expectedVideos = new Map([
  [31, "VnGz-uqz118"],
  [32, "SV7gqvjhVZ0"],
  [33, "i4RRoFuSReo"],
  [34, "Z21VUASTIjk"],
  [35, "FMTde56ACjc"],
]);

test("Levels 31-35 use the verified source videos and full-frame checkpoints", () => {
  for (let id = 31; id <= 35; id += 1) {
    const guide = guides[id];
    const level = levels.find((item) => Number(item.id) === id);

    assert.ok(guide, `Level ${id} guide`);
    assert.ok(level, `Level ${id} record`);
    assert.equal(level.videoId, expectedVideos.get(id));
    assert.equal(level.category, "Levels 31-35");
    assert.equal(guide.positionSystem, "full-frame");
    assert.equal(guide.moveCheckpoints.length, 6);

    for (const move of guide.moveCheckpoints) {
      assert.equal(move.row, undefined);
      assert.equal(move.column, undefined);
      assert.match(move.instruction, /x \d+%, y \d+%/);
      assert.ok(move.precondition.length > 20);
      assert.ok(move.result.length > 20);
    }
  }
});

test("Level 31 and Level 35 preserve the observed opening vehicles", () => {
  assert.deepEqual(
    {
      color: guides[31].moveCheckpoints[0].color,
      direction: guides[31].moveCheckpoints[0].direction,
      x: guides[31].moveCheckpoints[0].xPercent,
      y: guides[31].moveCheckpoints[0].yPercent,
    },
    { color: "cyan", direction: "left", x: 13, y: 52 },
  );

  assert.deepEqual(
    {
      color: guides[35].moveCheckpoints[0].color,
      direction: guides[35].moveCheckpoints[0].direction,
      x: guides[35].moveCheckpoints[0].xPercent,
      y: guides[35].moveCheckpoints[0].yPercent,
    },
    { color: "cyan", direction: "up-right", x: 89, y: 68 },
  );
});
