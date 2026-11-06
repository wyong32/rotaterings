import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import {
  descriptorFromPixels,
  rankLevelMatches,
  scoreDescriptors,
} from "../lib/image-matcher.mjs";
import { buildIndex } from "../scripts/build-level-match-index.mjs";

function solid(width, height, rgba) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    data.set(rgba, index * 4);
  }
  return { width, height, data };
}

function split(width, height, left, right) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      data.set(x < width / 2 ? left : right, (y * width + x) * 4);
    }
  }
  return { width, height, data };
}

test("identical images score higher than different palettes", () => {
  const orange = descriptorFromPixels(solid(16, 16, [244, 132, 46, 255]));
  const blue = descriptorFromPixels(solid(16, 16, [30, 120, 220, 255]));
  assert.ok(scoreDescriptors(orange, orange) > scoreDescriptors(orange, blue));
});

test("shape differences affect the descriptor score", () => {
  const orangeBlue = descriptorFromPixels(split(32, 16, [244, 132, 46, 255], [30, 120, 220, 255]));
  const blueOrange = descriptorFromPixels(split(32, 16, [30, 120, 220, 255], [244, 132, 46, 255]));
  assert.ok(scoreDescriptors(orangeBlue, orangeBlue) > scoreDescriptors(orangeBlue, blueOrange));
});

test("deduplicates multiple images belonging to one level", () => {
  const query = descriptorFromPixels(solid(16, 16, [244, 132, 46, 255]));
  const different = descriptorFromPixels(solid(16, 16, [30, 120, 220, 255]));
  const results = rankLevelMatches([query], [
    { levelId: "1", descriptor: query },
    { levelId: "1", descriptor: query },
    { levelId: "2", descriptor: different },
  ]);
  assert.deepEqual(results.map((result) => result.levelId), ["1", "2"]);
});

test("enforces result limits and returns readable confidence labels", () => {
  const query = descriptorFromPixels(solid(16, 16, [220, 120, 30, 255]));
  const index = Array.from({ length: 8 }, (_, index) => ({
    levelId: String(index + 1),
    descriptor: descriptorFromPixels(solid(16, 16, [220 - index * 10, 120, 30, 255])),
  }));
  const results = rankLevelMatches([query], index, 3);
  assert.equal(results.length, 3);
  assert.equal(results[0].confidence, "strong");
});

test("blank images produce finite descriptor values and scores", () => {
  const blank = descriptorFromPixels(solid(16, 16, [0, 0, 0, 0]));
  assert.equal(blank.hash.length, 16);
  assert.ok(blank.colors.every(Number.isFinite));
  assert.ok(blank.edges.every(Number.isFinite));
  assert.ok(Number.isFinite(scoreDescriptors(blank, blank)));
});

test("rejects malformed pixel input and descriptors", () => {
  assert.throws(() => descriptorFromPixels({ width: 2, height: 2, data: new Uint8ClampedArray(3) }), /pixel data/i);
  assert.throws(() => scoreDescriptors({ hash: "bad", colors: [], edges: [] }, { hash: "bad", colors: [], edges: [] }), /descriptor/i);
  assert.throws(() => rankLevelMatches([], [], 5), /query descriptor/i);
});

test("builds a descriptor-only index from private 600x500 WebP images", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "colony-match-index-"));
  try {
    for (const [levelId, color] of [["1", "#f97316"], ["2", "#38bdf8"]]) {
      const directory = path.join(root, levelId);
      await fs.mkdir(directory, { recursive: true });
      await sharp({ create: { width: 600, height: 500, channels: 4, background: color } })
        .webp({ lossless: true })
        .toFile(path.join(directory, "match-start.webp"));
    }

    const index = await buildIndex(root);
    assert.deepEqual(index.entries.map((entry) => entry.levelId), ["1", "2"]);
    assert.ok(index.entries.every((entry) => entry.source === "match-start.webp"));
    const serialized = JSON.stringify(index);
    assert.doesNotMatch(serialized, /data:image|colony-match-index-|[A-Za-z]:\\/i);
  } finally {
    await fs.rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});
