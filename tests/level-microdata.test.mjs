import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const directions = new Set([
  "up",
  "up-right",
  "right",
  "down-right",
  "down",
  "down-left",
  "left",
  "up-left",
]);

const guides = JSON.parse(await readFile("data/level-guides.json", "utf8"));

test("every published guide contains verified board statistics", () => {
  assert.equal(Object.keys(guides).length, 35);

  for (const [id, guide] of Object.entries(guides)) {
    assert.ok(guide.stats.parkingCapacity >= 5, `Level ${id} initial parking slots`);
    assert.ok(guide.stats.verifiedMoveCount >= 6, `Level ${id} verified moves`);
    assert.ok(guide.stats.colorCount >= 2, `Level ${id} color count`);
    assert.match(guide.stats.solutionDuration, /^\d+:\d{2}$/, `Level ${id} duration`);
    assert.ok(guide.stats.criticalRoute.length >= 12, `Level ${id} critical route`);
  }
});

test("every published guide contains useful coordinate-based move checkpoints", () => {
  for (const [id, guide] of Object.entries(guides)) {
    assert.ok(guide.moveCheckpoints.length >= 6, `Level ${id} move count`);

    guide.moveCheckpoints.forEach((move, index) => {
      assert.equal(move.order, index + 1, `Level ${id} move order`);
      assert.ok(move.color.length > 0, `Level ${id} move ${move.order} color`);
      assert.ok(move.vehicle.length > 0, `Level ${id} move ${move.order} vehicle`);
      assert.ok(directions.has(move.direction), `Level ${id} move ${move.order} direction`);
      if (guide.positionSystem !== 'full-frame') {
        assert.ok(move.row >= 1 && move.row <= 6, `Level ${id} move ${move.order} row`);
        assert.ok(move.column >= 1 && move.column <= 6, `Level ${id} move ${move.order} column`);
      }
      assert.ok(move.xPercent >= 0 && move.xPercent <= 100, `Level ${id} move ${move.order} x`);
      assert.ok(move.yPercent >= 0 && move.yPercent <= 100, `Level ${id} move ${move.order} y`);
      assert.ok(move.region.length > 0, `Level ${id} move ${move.order} region`);
      assert.ok(move.purpose.length >= 12, `Level ${id} move ${move.order} purpose`);
      assert.ok(move.parkingCheck.length >= 12, `Level ${id} move ${move.order} parking check`);
    });
  }
});

test("every published guide describes the board state across three phases", () => {
  for (const [id, guide] of Object.entries(guides)) {
    assert.ok(guide.phaseMetrics.length >= 3, `Level ${id} phase count`);
    for (const phase of guide.phaseMetrics) {
      assert.ok(phase.phase.length > 0, `Level ${id} phase name`);
      assert.match(phase.moveRange, /\d/, `Level ${id} phase move range`);
      assert.ok(phase.boardState.length >= 16, `Level ${id} board state`);
      assert.ok(phase.parkingRule.length >= 12, `Level ${id} parking rule`);
    }
  }
});

