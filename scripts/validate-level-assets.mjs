import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { COVER_SIZE, getOutputPaths } from "./lib/level-assets.mjs";

sharp.cache(false);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const levels = JSON.parse(await fsp.readFile(path.join(rootDir, "data", "levels.json"), "utf8"));
const errors = [];
const warnings = [];
let checked = 0;

function publicPath(urlPath) {
  return path.join(rootDir, "public", urlPath.replace(/^\//, ""));
}

for (const level of levels) {
  if (!level.coverImage) {
    continue;
  }
  checked += 1;
  if (level.coverImage.includes("match-start")) {
    errors.push(`Level ${level.id}: private matching filename is exposed as a public cover`);
    continue;
  }

  const cover = publicPath(level.coverImage);
  if (!fs.existsSync(cover)) {
    errors.push(`Level ${level.id}: missing cover ${level.coverImage}`);
    continue;
  }

  const metadata = await sharp(cover).metadata();
  if (
    metadata.width !== COVER_SIZE.width ||
    metadata.height !== COVER_SIZE.height ||
    metadata.format !== "webp"
  ) {
    errors.push(`Level ${level.id}: cover must be a ${COVER_SIZE.width}x${COVER_SIZE.height} WebP`);
  }

  const stat = await fsp.stat(cover);
  if (stat.size > 120 * 1024) {
    warnings.push(`Level ${level.id}: cover is ${Math.ceil(stat.size / 1024)} KB`);
  }

  const paths = getOutputPaths(rootDir, level.id);
  if (!fs.existsSync(paths.matchStart)) {
    errors.push(`Level ${level.id}: missing private match-start.webp`);
  }

  for (const guideImage of level.guideImages || []) {
    const guidePath = publicPath(guideImage);
    if (!fs.existsSync(guidePath)) {
      errors.push(`Level ${level.id}: missing guide image ${guideImage}`);
    }
  }
}

function scanPublic(directory) {
  if (!fs.existsSync(directory)) {
    return;
  }
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      scanPublic(entryPath);
    } else if (/match-(?:start|mid|\d+)/i.test(entry.name)) {
      errors.push(`Private matching image found in public assets: ${path.relative(rootDir, entryPath)}`);
    }
  }
}

scanPublic(path.join(rootDir, "public", "levels"));

console.log(JSON.stringify({ checked, warnings, errors }, null, 2));
if (errors.length > 0) {
  process.exitCode = 1;
}
