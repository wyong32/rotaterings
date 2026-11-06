import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function collectFiles(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!existsSync(absolutePath)) return [];
  if (statSync(absolutePath).isFile()) return [absolutePath];
  return readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(absolutePath, entry.name);
    return entry.isDirectory()
      ? collectFiles(path.relative(root, child))
      : [child];
  });
}

test("site configuration belongs only to Rotate Rings", () => {
  const source = read("lib/site.ts");
  assert.match(source, /https:\/\/rotaterings\.online/);
  assert.match(source, /Rotate Rings/);
  assert.match(source, /Nebula Studio/);
  assert.match(source, /id6793924927/);
  assert.match(source, /com\.nebula\.rotaterings/);
});

test("public application files contain no previous-site identity", () => {
  const roots = ["app", "components", "data", "lib", "public", "package.json", "README.md"];
  const forbidden = /jam[- ]?bus|sandfall|jambussandfall|Colony Flow|colonyflow\.org|Bubble Word Jam|bustrafficfever/gi;
  const violations = roots.flatMap(collectFiles).flatMap((file) => {
    if (/\.(?:webp|png|jpg|jpeg|ico|woff2?)$/i.test(file)) return [];
    const matches = readFileSync(file, "utf8").match(forbidden);
    return matches ? [`${path.relative(root, file)}: ${[...new Set(matches)].join(", ")}`] : [];
  });
  assert.deepEqual(violations, []);
});

