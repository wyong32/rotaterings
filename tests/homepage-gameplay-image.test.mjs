import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hero = await readFile("components/home/hero-section.tsx", "utf8");

test("homepage keeps the complete portrait gameplay interface visible", () => {
  for (const image of ["gameplay-1.webp", "gameplay-2.webp", "gameplay-3.webp"]) {
    assert.match(hero, new RegExp(image.replace(".", "\\.")));
  }
  assert.match(hero, /object-contain/);
  assert.match(hero, /aspect-\[576\/1246\]/);
  assert.doesNotMatch(hero, /h-\[430px\]/);
  assert.doesNotMatch(hero, /object-cover/);
});

test("homepage gameplay carousel supports automatic and manual navigation", () => {
  assert.match(hero, /setInterval/);
  assert.match(hero, /prefers-reduced-motion/);
  assert.match(hero, /Previous gameplay screenshot/);
  assert.match(hero, /Next gameplay screenshot/);
  assert.match(hero, /Show gameplay screenshot/);
});
