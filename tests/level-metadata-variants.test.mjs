import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function loadMetadataHelpers() {
  const source = fs.readFileSync("lib/level-metadata.ts", "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports });
  return module.exports;
}

test("level titles rotate across four search intents", () => {
  const { getLevelPageTitle } = loadMetadataHelpers();
  assert.match(getLevelPageTitle(1), /Walkthrough/);
  assert.match(getLevelPageTitle(2), /Solution/);
  assert.match(getLevelPageTitle(3), /Hints & Answer/);
  assert.match(getLevelPageTitle(4), /Step-by-Step/);
  assert.equal(getLevelPageTitle(5), getLevelPageTitle(1).replace("Level 1", "Level 5"));
});

test("metadata and Schema use canonical helper and page-specific dates", () => {
  const layout = fs.readFileSync("app/levels/[id]/layout.tsx", "utf8");
  assert.match(layout, /parseLevelSlug/);
  assert.match(layout, /levelPath/);
  assert.match(layout, /level\.publishedAt/);
  assert.match(layout, /level\.modifiedAt/);
  assert.doesNotMatch(layout, /LAST_SITE_UPDATE/);
  assert.match(layout, /getLevelPageTitle/);
});

