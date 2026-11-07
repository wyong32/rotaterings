import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("public content describes ring mechanics rather than the old bus template", () => {
  const files = [
    "app/page.tsx",
    "app/levels/page.tsx",
    "app/levels/[id]/page.tsx",
    "components/home/level-navigation.tsx",
    "components/home/hero-section.tsx",
    "components/footer.tsx",
  ];
  const source = files.map(read).join("\n");

  assert.doesNotMatch(source, /\bbus(?:es)?\b|sand|parking|route notes/i);
  assert.match(source, /ring/i);
  assert.match(source, /gap/i);
  assert.match(source, /Find (?:a )?Level|Screenshot/i);
});

test("level pages expose board data, removal order, related guides, and source transparency", () => {
  const page = read("app/levels/[id]/page.tsx");
  const nearby = read("components/level/nearby-levels.tsx");

  assert.match(page, /boardData/);
  assert.match(page, /removalOrder/);
  assert.match(page, /sourceNote/);
  assert.match(nearby, /Continue with a published guide/);
  assert.match(page, /Video Walkthrough/);
});
