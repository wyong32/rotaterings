import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("level cards prefer generated covers and preserve six-by-five geometry", () => {
  const source = fs.readFileSync("components/level/level-card.tsx", "utf8");
  assert.match(source, /getLevelCover\(level\)/);
  assert.match(source, /aspect-\[6\/5\]/);
  assert.doesNotMatch(source, /aspect-\[272\/153\]/);
});

test("level metadata prefers the generated cover", () => {
  const source = fs.readFileSync("app/levels/[id]/layout.tsx", "utf8");
  assert.match(source, /getLevelCover\(level\)/);
});
