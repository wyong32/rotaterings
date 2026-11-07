import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function loadLevelPaths() {
  const source = read("lib/level-paths.ts");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports });
  return module.exports;
}

test("level URL helpers produce only canonical Level 1-260 paths", () => {
  const { levelPath, parseLevelSlug, isLegacyLevelPath } = loadLevelPaths();

  assert.equal(levelPath(1), "/levels/level-1/");
  assert.equal(levelPath("260"), "/levels/level-260/");
  assert.throws(() => levelPath(0), /level/i);
  assert.throws(() => levelPath(261), /level/i);
  assert.throws(() => levelPath("abc"), /level/i);

  assert.equal(parseLevelSlug("level-1"), "1");
  assert.equal(parseLevelSlug("level-260"), "260");
  assert.equal(parseLevelSlug("1"), null);
  assert.equal(parseLevelSlug("level-01"), null);
  assert.equal(parseLevelSlug("level-261"), null);

  assert.equal(isLegacyLevelPath("/levels/1/"), true);
  assert.equal(isLegacyLevelPath("/levels/260"), true);
  assert.equal(isLegacyLevelPath("/levels/level-1/"), false);
  assert.equal(isLegacyLevelPath("/levels/261/"), false);
});

test("Next.js permanently redirects one legacy numeric route to the canonical route", () => {
  const source = read("next.config.ts");

  assert.match(source, /async\s+redirects\s*\(\)/);
  assert.match(source, /source:\s*["']\/levels\/:id\(\\\\d\+\)\/?["']/);
  assert.match(source, /destination:\s*["']\/levels\/level-:id\/["']/);
  assert.match(source, /permanent:\s*true/);
});

test("shared level links use the canonical helper instead of rebuilding URLs", () => {
  const files = [
    "components/layout/site-navbar.tsx",
    "components/footer.tsx",
    "components/home/hero-section.tsx",
    "components/level/level-card.tsx",
    "components/level/level-grid.tsx",
    "components/level/level-search.tsx",
    "components/finder/finder-results.tsx",
  ];

  for (const file of files) {
    const source = read(file);
    assert.match(source, /levelPath/, `${file} must use levelPath`);
    assert.doesNotMatch(source, /[`"']\/levels\/\$\{/, `${file} must not build a level URL inline`);
  }
});
