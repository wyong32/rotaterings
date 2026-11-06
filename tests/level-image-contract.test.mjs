import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("level contract contains new optional image fields and cover fallback order", () => {
  const types = fs.readFileSync("types/index.ts", "utf8");
  const data = fs.readFileSync("lib/data.ts", "utf8");

  for (const field of [
    "coverImage?: string",
    "matchImages?: string[]",
    "guideImages?: string[]",
    "assetVersion?: number",
  ]) {
    assert.match(types, new RegExp(field.replace(/[?*+()[\]{}]/g, "\\$&")));
  }

  assert.match(
    data,
    /level\.coverImage\s*\|\|\s*level\.videoThumbnail\s*\|\|\s*level\.thumbnail/,
  );
});
