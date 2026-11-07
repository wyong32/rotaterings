import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
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

function assertFiniteNumber(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${label} must be a finite number`);
}

function assertPublicAsset(value, label) {
  assertText(value, label);
  if (!value.startsWith("/") || value.includes("..")) throw new Error(`${label} must be a root-relative public path`);
  const publicRoot = path.join(rootDir, "public");
  const resolved = path.resolve(publicRoot, `.${value}`);
  if (!resolved.startsWith(`${publicRoot}${path.sep}`) || !fs.existsSync(resolved)) {
    throw new Error(`${label} does not exist: ${value}`);
  }
  return resolved;
}

function assetHash(publicPath) {
  const resolved = assertPublicAsset(publicPath, "Evidence asset");
  return crypto.createHash("sha256").update(fs.readFileSync(resolved)).digest("hex");
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
  if (!new RegExp(`\\bLevel ${id}\\b`, "i").test(level.title)) throw new Error(`Level ${id} title must identify the requested level`);
  const levelAssetPrefix = `/levels/${id}/`;
  const assets = [...new Set([level.thumbnail, level.coverImage, ...level.guideImages])];
  for (const [index, asset] of assets.entries()) {
    if (!asset.startsWith(levelAssetPrefix)) throw new Error(`Level ${id} asset must be stored under ${levelAssetPrefix}`);
    assertPublicAsset(asset, `Level ${id} asset[${index}]`);
  }

  if (!level.evidence || String(level.evidence.levelId) !== String(id)) {
    throw new Error(`Level ${id} evidence must identify the requested level`);
  }
  assertIsoDate(level.evidence.checkedAt, `Level ${id} evidence checkedAt`);
  assertText(level.evidence.sourceRecordId, `Level ${id} evidence sourceRecordId`, 8);
  assertText(level.evidence.sourceUrl, `Level ${id} evidence sourceUrl`, 12);
  let sourceUrl;
  try {
    sourceUrl = new URL(level.evidence.sourceUrl);
  } catch {
    throw new Error(`Level ${id} evidence sourceUrl must be an absolute URL`);
  }
  if (sourceUrl.protocol !== "https:") throw new Error(`Level ${id} evidence sourceUrl must use HTTPS`);
  if (!level.evidence.assetSha256 || typeof level.evidence.assetSha256 !== "object") {
    throw new Error(`Level ${id} evidence must include asset SHA-256 values`);
  }
  for (const asset of assets) {
    const expected = level.evidence.assetSha256[asset];
    if (!/^[a-f0-9]{64}$/.test(expected ?? "") || expected !== assetHash(asset)) {
      throw new Error(`Level ${id} evidence hash does not match ${asset}`);
    }
  }
  if (level.sourceType === "youtube-video") {
    assertText(level.videoId, `Level ${id} videoId`, 6);
    if (!Number.isInteger(level.sourceStartSecond) || level.sourceStartSecond < 0) {
      throw new Error(`Level ${id} sourceStartSecond must be a non-negative integer`);
    }
    if (!level.evidence.sourceUrl.includes(level.videoId)) throw new Error(`Level ${id} evidence does not match its videoId`);
  } else if (level.sourceType === "official-online-config") {
    if (sourceUrl.hostname !== "games.rotaterings.net") throw new Error(`Level ${id} config evidence must use the authorized game host`);
  } else {
    throw new Error(`Level ${id} sourceType is not supported`);
  }
}

function validateGuide(guide, level, id) {
  if (!guide || String(guide.sourceLevelId) !== String(id)) {
    throw new Error(`Level ${id} guide sourceLevelId must match the requested level`);
  }
  if (guide.sourceEvidenceId !== level.evidence.sourceRecordId) {
    throw new Error(`Level ${id} guide evidence does not match the level record`);
  }
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

  if (!Array.isArray(guide.beforeMove) || guide.beforeMove.length < 3) {
    throw new Error(`Level ${id} guide beforeMove is incomplete`);
  }
  guide.beforeMove.forEach((item, index) => assertText(item, `Level ${id} guide beforeMove[${index}]`, 15));

  guide.steps.forEach((step, index) => {
    assertText(step.title, `Level ${id} guide steps[${index}].title`, 5);
    assertText(step.instruction, `Level ${id} guide steps[${index}].instruction`, 20);
    assertText(step.imageAlt, `Level ${id} guide steps[${index}].imageAlt`, 20);
    assertPublicAsset(step.image, `Level ${id} guide steps[${index}].image`);
    if (!level.guideImages.includes(step.image)) throw new Error(`Level ${id} guide step image is not in the level asset record`);
  });
  guide.boardData.rings.forEach((ring, index) => {
    for (const field of ["color", "hex", "position"]) assertText(ring[field], `Level ${id} ring ${index + 1} ${field}`);
    for (const field of ["x", "y", "initialAngle", "openingDegrees", "linkedPoints"]) {
      assertFiniteNumber(ring[field], `Level ${id} ring ${index + 1} ${field}`);
    }
  });
  guide.removalOrder.forEach((move, index) => {
    if (move.order !== index + 1) throw new Error(`Level ${id} removalOrder must be sequential`);
    for (const field of ["piece", "color", "position", "action", "result"]) {
      assertText(move[field], `Level ${id} removalOrder[${index}].${field}`, field === "action" || field === "result" ? 15 : 1);
    }
  });
  guide.phaseMetrics.forEach((phase, index) => {
    for (const field of ["phase", "moveRange", "boardState", "rule"]) {
      assertText(phase[field], `Level ${id} phaseMetrics[${index}].${field}`, field === "rule" ? 15 : 1);
    }
  });
  guide.commonMistakes.forEach((mistake, index) => {
    for (const field of ["title", "action", "consequence"]) {
      assertText(mistake[field], `Level ${id} commonMistakes[${index}].${field}`, field === "title" ? 5 : 20);
    }
  });
  guide.faqs.forEach((faq, index) => {
    assertText(faq.question, `Level ${id} faqs[${index}].question`, 10);
    assertText(faq.answer, `Level ${id} faqs[${index}].answer`, 15);
  });
  if (guide.stats.ringCount !== guide.boardData.rings.length) throw new Error(`Level ${id} ring count does not match boardData`);
  if (guide.stats.verifiedMoveCount !== guide.removalOrder.length) throw new Error(`Level ${id} move count does not match removalOrder`);
}

export function validateBatchRecords({ requestedIds, existingLevels, existingGuides = {}, batchLevels, batchGuides }) {
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

  const existingSourceIds = new Set(existingLevels.map((level) => level.evidence?.sourceRecordId).filter(Boolean));
  const batchSourceIds = new Set();
  const existingConfigIds = new Set(Object.values(existingGuides).map((guide) => guide.boardData?.officialConfigId).filter((value) => value !== undefined && value !== null).map(String));
  const batchConfigIds = new Set();
  const existingAssetHashes = new Set(
    existingLevels.flatMap((level) => [level.coverImage, ...(level.guideImages ?? [])]).filter(Boolean).map(assetHash),
  );

  for (const id of requested) {
    if (existingIds.has(id)) throw new Error(`Level ${id} is already published`);
    const level = batchLevels.find((item) => Number(item.id) === id);
    validateLevel(level, id);
    const guide = batchGuides[String(id)];
    validateGuide(guide, level, id);
    if (existingSourceIds.has(level.evidence.sourceRecordId) || batchSourceIds.has(level.evidence.sourceRecordId)) {
      throw new Error(`Level ${id} reuses an existing sourceRecordId`);
    }
    batchSourceIds.add(level.evidence.sourceRecordId);
    const configValue = guide.boardData.officialConfigId;
    if ((typeof configValue !== "string" && typeof configValue !== "number") || String(configValue).trim().length < 1) {
      throw new Error(`Level ${id} guide officialConfigId is incomplete`);
    }
    const configId = String(configValue);
    if (existingConfigIds.has(configId) || batchConfigIds.has(configId)) throw new Error(`Level ${id} reuses an existing board configuration`);
    batchConfigIds.add(configId);
    const newHashes = [...new Set([level.coverImage, ...level.guideImages])].map(assetHash);
    if (newHashes.every((hash) => existingAssetHashes.has(hash))) throw new Error(`Level ${id} reuses an existing level asset set`);
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
    existingGuides,
    batchLevels: batch.levels ?? [],
    batchGuides: batch.guides ?? {},
  });

  const nextLevels = [...existingLevels, ...validated.levels].sort((a, b) => Number(a.id) - Number(b.id));
  const nextGuides = Object.fromEntries(
    Object.entries({ ...existingGuides, ...validated.guides }).sort(([left], [right]) => Number(left) - Number(right)),
  );

  writeJsonPair([
    [levelsPath, nextLevels],
    [guidesPath, nextGuides],
  ]);
  return { added: requestedIds, publishedCount: nextLevels.length };
}

function writeJsonPair(entries) {
  const token = `${process.pid}-${Date.now()}`;
  const prepared = entries.map(([target, value]) => ({
    target,
    temporary: `${target}.${token}.tmp`,
    backup: `${target}.${token}.bak`,
    value,
  }));

  let committed = false;
  try {
    for (const item of prepared) fs.writeFileSync(item.temporary, `${JSON.stringify(item.value, null, 2)}\n`, { flag: "wx" });
    for (const item of prepared) fs.renameSync(item.target, item.backup);
    for (const item of prepared) fs.renameSync(item.temporary, item.target);
    committed = true;
  } catch (error) {
    for (const item of [...prepared].reverse()) {
      fs.rmSync(item.temporary, { force: true });
      if (fs.existsSync(item.backup)) {
        fs.rmSync(item.target, { force: true });
        fs.renameSync(item.backup, item.target);
      }
    }
    throw error;
  }
  if (committed) {
    for (const item of prepared) {
      try {
        fs.rmSync(item.backup, { force: true });
      } catch {
        // A stale backup is safe to remove manually; the committed pair remains complete.
      }
    }
  }
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
