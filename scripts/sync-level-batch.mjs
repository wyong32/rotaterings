import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const levelsPath = path.join(rootDir, "data", "levels.json");
const guidesPath = path.join(rootDir, "data", "level-guides.json");
const TARGET_LEVEL_COUNT = 260;

function getFlag(args, name) {
  const index = args.indexOf(name);
  if (index === -1 || !args[index + 1] || args[index + 1].startsWith("--")) {
    throw new Error(`${name} requires a value`);
  }
  return args[index + 1];
}

export function parseRequestedLevelIds(args) {
  const value = getFlag(args, "--levels");
  const ids = [];
  const seen = new Set();

  for (const part of value.split(",").map((item) => item.trim()).filter(Boolean)) {
    const match = part.match(/^(\d+)(?:-(\d+))?$/);
    if (!match) throw new Error(`Invalid level selection: ${part}`);

    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);
    if (start > end) throw new Error(`Descending ranges are not supported: ${part}`);

    for (let id = start; id <= end; id += 1) {
      if (id < 1 || id > TARGET_LEVEL_COUNT) {
        throw new Error(`Level ${id} is outside the supported 1-${TARGET_LEVEL_COUNT} range`);
      }
      if (seen.has(id)) throw new Error(`Duplicate requested level: ${id}`);
      seen.add(id);
      ids.push(id);
    }
  }

  if (ids.length === 0) throw new Error("--levels must select at least one level");
  return ids;
}

function assertText(value, label, minimum = 1) {
  if (typeof value !== "string" || value.trim().length < minimum) {
    throw new Error(`${label} is incomplete`);
  }
}

function assertIsoDate(value, label) {
  assertText(value, label);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) || Number.isNaN(Date.parse(value))) {
    throw new Error(`${label} must be an ISO timestamp with milliseconds`);
  }
}

function validateLevel(level, id) {
  if (String(level.id) !== String(id)) throw new Error(`Level ${id} has a mismatched id`);
  for (const field of ["title", "difficulty", "thumbnail", "coverImage", "description", "sourceType"]) {
    assertText(level[field], `Level ${id} ${field}`);
  }
  assertIsoDate(level.publishedAt, `Level ${id} publishedAt`);
  assertIsoDate(level.modifiedAt, `Level ${id} modifiedAt`);
  if (Date.parse(level.modifiedAt) < Date.parse(level.publishedAt)) {
    throw new Error(`Level ${id} modifiedAt cannot predate publishedAt`);
  }
  if (!Array.isArray(level.guideImages) || level.guideImages.length < 2) {
    throw new Error(`Level ${id} needs at least two guide images`);
  }
}

function validateGuide(guide, id) {
  for (const field of [
    "objective",
    "keyChallenge",
    "previousLevelDifference",
    "quickAnswer",
    "startingBoard",
    "stuckPoint",
    "sourceNote",
  ]) {
    assertText(guide[field], `Level ${id} guide ${field}`, 20);
  }

  for (const [field, minimum] of [
    ["overallStrategy", 2],
    ["removalOrder", 2],
    ["phaseMetrics", 2],
    ["steps", 3],
    ["commonMistakes", 2],
    ["faqs", 2],
  ]) {
    if (!Array.isArray(guide[field]) || guide[field].length < minimum) {
      throw new Error(`Level ${id} guide ${field} is incomplete`);
    }
  }

  if (!guide.boardData || !Array.isArray(guide.boardData.rings) || guide.boardData.rings.length < 2) {
    throw new Error(`Level ${id} guide boardData is incomplete`);
  }
  if (!guide.stats || !Number.isInteger(guide.stats.verifiedMoveCount)) {
    throw new Error(`Level ${id} guide stats are incomplete`);
  }
}

export function validateBatchRecords({ requestedIds, existingLevels, batchLevels, batchGuides }) {
  const existingIds = new Set(existingLevels.map((level) => Number(level.id)));
  const levelIds = batchLevels.map((level) => Number(level.id));
  const duplicateBatchIds = levelIds.filter((id, index) => levelIds.indexOf(id) !== index);
  if (duplicateBatchIds.length > 0) throw new Error(`Duplicate batch level: ${duplicateBatchIds[0]}`);

  const requested = [...requestedIds].sort((a, b) => a - b);
  const provided = [...levelIds].sort((a, b) => a - b);
  if (JSON.stringify(requested) !== JSON.stringify(provided)) {
    throw new Error(`Batch levels do not match requested levels: expected ${requested.join(", ")}`);
  }

  const guideIds = Object.keys(batchGuides).map(Number).sort((a, b) => a - b);
  if (JSON.stringify(requested) !== JSON.stringify(guideIds)) {
    throw new Error(`Batch guides do not match requested levels: expected ${requested.join(", ")}`);
  }

  for (const id of requested) {
    if (existingIds.has(id)) throw new Error(`Level ${id} is already published`);
    validateLevel(batchLevels.find((level) => Number(level.id) === id), id);
    validateGuide(batchGuides[String(id)], id);
  }

  const serialized = JSON.stringify({ batchLevels, batchGuides }).toLowerCase();
  const unrelatedTerms = [
    "jam" + " bus",
    "sand" + "fall",
    "worker" + " ant",
    "colony" + " slot",
    "cube" + " stack",
  ];
  if (unrelatedTerms.some((term) => serialized.includes(term))) {
    throw new Error("Batch contains content from another game");
  }

  return {
    levels: [...batchLevels].sort((a, b) => Number(a.id) - Number(b.id)),
    guides: Object.fromEntries(requested.map((id) => [String(id), batchGuides[String(id)]])),
  };
}

export function syncVerifiedBatch({ inputPath, requestedIds }) {
  const existingLevels = JSON.parse(fs.readFileSync(levelsPath, "utf8"));
  const existingGuides = JSON.parse(fs.readFileSync(guidesPath, "utf8"));
  const batch = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const validated = validateBatchRecords({
    requestedIds,
    existingLevels,
    batchLevels: batch.levels ?? [],
    batchGuides: batch.guides ?? {},
  });

  const nextLevels = [...existingLevels, ...validated.levels].sort((a, b) => Number(a.id) - Number(b.id));
  const nextGuides = Object.fromEntries(
    Object.entries({ ...existingGuides, ...validated.guides }).sort(([left], [right]) => Number(left) - Number(right)),
  );

  fs.writeFileSync(levelsPath, `${JSON.stringify(nextLevels, null, 2)}\n`);
  fs.writeFileSync(guidesPath, `${JSON.stringify(nextGuides, null, 2)}\n`);
  return { added: requestedIds, publishedCount: nextLevels.length };
}

function main(args) {
  const requestedIds = parseRequestedLevelIds(args);
  const inputValue = getFlag(args, "--input");
  const inputPath = path.resolve(process.cwd(), inputValue);
  if (!fs.existsSync(inputPath)) throw new Error(`Input file not found: ${inputPath}`);
  console.log(JSON.stringify(syncVerifiedBatch({ inputPath, requestedIds }), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
