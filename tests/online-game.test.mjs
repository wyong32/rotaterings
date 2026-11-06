import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("homepage provides the approved online Rotate Rings game", () => {
  const page = read("app/page.tsx");
  const component = read("components/home/online-game.tsx");

  assert.match(page, /OnlineGame/);
  assert.match(component, /games\.rotaterings\.net\/game\/rotate-rings\/index\.html\?v=20261016/);
  assert.match(component, /iframe/);
  assert.match(component, /Reload/);
  assert.match(component, /Full screen/);
  assert.match(component, /Open game/);
});
