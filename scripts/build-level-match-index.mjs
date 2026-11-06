import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import { descriptorFromPixels } from "../lib/image-matcher.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

function numericLevelSort(left, right) {
  return Number(left) - Number(right) || left.localeCompare(right);
}

export async function buildIndex(inputDir) {
  const levelDirectories = (await fs.readdir(inputDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
    .sort((left, right) => numericLevelSort(left.name, right.name));
  const entries = [];

  for (const levelDirectory of levelDirectories) {
    const levelId = levelDirectory.name;
    const directory = path.join(inputDir, levelId);
    const files = (await fs.readdir(directory, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".webp"))
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));

    for (const source of files) {
      const file = path.join(directory, source);
      const encoded = await fs.readFile(file);
      const { data, info } = await sharp(encoded).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      if (info.width !== 600 || info.height !== 500) {
        throw new Error(`${levelId}/${source} must be exactly 600x500`);
      }
      entries.push({
        levelId,
        source,
        descriptor: descriptorFromPixels({ data, width: info.width, height: info.height }),
      });
    }
  }

  if (entries.length === 0) {
    throw new Error(`No 600x500 WebP matching images found in ${inputDir}`);
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    entries,
  };
}

async function main() {
  const inputDir = path.join(rootDir, ".level-assets", "match");
  const output = path.join(rootDir, "public", "data", "level-match-index.json");
  const index = await buildIndex(inputDir);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${JSON.stringify(index)}\n`);
  console.log(JSON.stringify({ output, entries: index.entries.length }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
