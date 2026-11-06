import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const navbarPath = new URL("../components/layout/site-navbar.tsx", import.meta.url);
const heroPath = new URL("../components/home/hero-section.tsx", import.meta.url);

test("desktop and mobile navigation expose the screenshot finder", async () => {
  const source = await readFile(navbarPath, "utf8");

  assert.match(source, /ScanSearch/);
  assert.match(source, /href:\s*"\/find-level\/"/);
  assert.match(source, /label:\s*"Find Level"/);
  assert.match(source, /navItems\.map/g);
});

test("homepage exposes a compact screenshot finder entry beside level search", async () => {
  const source = await readFile(heroPath, "utf8");

  assert.match(source, /href="\/find-level\/"/);
  assert.match(source, /Find by Screenshot/);
  assert.match(source, /level numbers (?:change|differ|move|are reordered)/i);
  assert.match(source, /ScanSearch/);
});
