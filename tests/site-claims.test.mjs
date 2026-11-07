import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const current = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(current) : [current];
  });
}

const publicSourceFiles = [
  ...filesUnder("app"),
  ...filesUnder("components"),
  "lib/site.ts",
].filter((file) => /\.(?:ts|tsx)$/.test(file));
const publicSource = publicSourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

test("public copy never presents RotateRings.online as an official site or download source", () => {
  assert.doesNotMatch(publicSource, /official mobile download links/i);
  assert.doesNotMatch(publicSource, /official mobile game/i);
  assert.doesNotMatch(publicSource, /official RotateRings\.online|RotateRings\.online is (?:an? )?official/i);
  assert.doesNotMatch(publicSource, /download (?:the )?official (?:app|game) from RotateRings\.online/i);
});

test("store wording identifies marketplace listings without claiming site ownership", () => {
  const site = fs.readFileSync("lib/site.ts", "utf8");
  assert.match(site, /store links to the official App Store and Google Play listings/);
  assert.match(publicSource, /does not host (?:an|the) application file/i);
});

test("footer carries the independent-site and trademark disclaimer on every page", () => {
  const footer = fs.readFileSync("components/footer.tsx", "utf8");
  assert.match(footer, /independent fan guide/i);
  assert.match(footer, /not affiliated with, endorsed by, or connected to/i);
  assert.match(footer, /trademark/i);
  assert.match(footer, /GAME_DEVELOPER/);
});
