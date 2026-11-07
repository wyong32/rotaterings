import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  parseRequestedLevelIds,
  validateBatchRecords,
} from "../scripts/sync-level-batch.mjs";

const levels = JSON.parse(fs.readFileSync("data/levels.json", "utf8"));
const guides = JSON.parse(fs.readFileSync("data/level-guides.json", "utf8"));
const syncScript = fs.readFileSync("scripts/sync-level-batch.mjs", "utf8");

const isIsoDate = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
  !Number.isNaN(Date.parse(value));

test("every published level has stable publication and modification dates", () => {
  for (const level of levels) {
    assert.ok(isIsoDate(level.publishedAt), `Level ${level.id} needs an ISO publishedAt date`);
    assert.ok(isIsoDate(level.modifiedAt), `Level ${level.id} needs an ISO modifiedAt date`);
    assert.ok(
      Date.parse(level.modifiedAt) >= Date.parse(level.publishedAt),
      `Level ${level.id} modifiedAt cannot predate publishedAt`,
    );
  }
});

test("every guide records a level-specific difference and concrete common mistakes", () => {
  assert.deepEqual(
    Object.keys(guides).sort((a, b) => Number(a) - Number(b)),
    levels.map((level) => level.id),
  );

  for (const level of levels) {
    const guide = guides[level.id];
    assert.ok(guide.previousLevelDifference?.length >= 40, `Level ${level.id} needs a specific comparison`);
    assert.ok(guide.commonMistakes?.length >= 2, `Level ${level.id} needs at least two common mistakes`);

    for (const mistake of guide.commonMistakes) {
      assert.ok(mistake.title?.length >= 8, `Level ${level.id} mistake needs a title`);
      assert.ok(mistake.action?.length >= 20, `Level ${level.id} mistake needs a concrete action`);
      assert.ok(mistake.consequence?.length >= 20, `Level ${level.id} mistake needs a concrete consequence`);
    }

    for (const comparison of guide.comparisonImages ?? []) {
      assert.ok(comparison.label?.length >= 3);
      assert.ok(comparison.wrongAlt?.length >= 15);
      assert.ok(comparison.correctAlt?.length >= 15);
      for (const image of [comparison.wrongImage, comparison.correctImage]) {
        assert.ok(image?.startsWith("/"));
        assert.ok(fs.existsSync(path.join("public", image.slice(1))), `${image} must exist`);
      }
    }
  }
});

test("level batch sync requires explicit verified IDs instead of max-plus-one generation", () => {
  assert.match(syncScript, /export function parseRequestedLevelIds/);
  assert.match(syncScript, /--levels/);
  assert.match(syncScript, /--input/);
  assert.match(syncScript, /validateBatchRecords/);
  assert.doesNotMatch(syncScript, /currentMax|COLONY_FLOW|worker ants|colony slots|ant puzzle/i);
});

test("explicit level selection supports priority ranges and rejects duplicates", () => {
  assert.deepEqual(parseRequestedLevelIds(["--levels", "100-104,110"]), [100, 101, 102, 103, 104, 110]);
  assert.throws(() => parseRequestedLevelIds(["--levels", "100-102,102"]), /Duplicate requested level/);
  assert.throws(() => parseRequestedLevelIds(["--levels", "261"]), /outside the supported/);
});

test("batch validation rejects published IDs and incomplete guide records", () => {
  const hashAsset = (asset) => crypto.createHash("sha256").update(fs.readFileSync(path.join("public", asset.slice(1)))).digest("hex");
  const source = structuredClone(levels[0]);
  const sourceAssets = [...new Set([source.thumbnail, source.coverImage, ...source.guideImages])];
  const verifiedLevelOne = {
    ...source,
    evidence: {
      levelId: "1",
      checkedAt: "2026-11-07T00:00:00.000Z",
      sourceRecordId: "config-level-1-verified",
      sourceUrl: "https://games.rotaterings.net/game/rotate-rings/index.html?v=20261016",
      assetSha256: Object.fromEntries(sourceAssets.map((asset) => [asset, hashAsset(asset)])),
    },
  };
  const verifiedGuideOne = {
    ...structuredClone(guides["1"]),
    sourceLevelId: "1",
    sourceEvidenceId: "config-level-1-verified",
  };
  assert.deepEqual(
    validateBatchRecords({
      requestedIds: [1],
      existingLevels: [],
      existingGuides: {},
      batchLevels: [verifiedLevelOne],
      batchGuides: { "1": verifiedGuideOne },
    }).levels.map((item) => item.id),
    ["1"],
  );

  const evidenceId = "config-level-100-verified";
  const level = {
    ...levels[0],
    id: "100",
    title: "Rotate Rings Level 100 Walkthrough",
    evidence: {
      levelId: "100",
      checkedAt: "2026-11-07T00:00:00.000Z",
      sourceRecordId: evidenceId,
      sourceUrl: "https://games.rotaterings.net/game/rotate-rings/index.html?v=20261016",
      assetSha256: verifiedLevelOne.evidence.assetSha256,
    },
  };
  const guide = {
    ...structuredClone(guides["1"]),
    sourceLevelId: "100",
    sourceEvidenceId: evidenceId,
  };

  assert.throws(
    () => validateBatchRecords({
      requestedIds: [100],
      existingLevels: levels,
      existingGuides: guides,
      batchLevels: [level],
      batchGuides: { "100": guide },
    }),
    /asset must be stored under \/levels\/100\//,
  );

  assert.throws(
    () => validateBatchRecords({
      requestedIds: [1],
      existingLevels: levels,
      batchLevels: [levels[0]],
      batchGuides: { "1": guides["1"] },
    }),
    /already published/,
  );

  assert.throws(
    () => validateBatchRecords({
      requestedIds: [1],
      existingLevels: [],
      existingGuides: {},
      batchLevels: [verifiedLevelOne],
      batchGuides: { "1": { ...verifiedGuideOne, commonMistakes: [] } },
    }),
    /commonMistakes is incomplete/,
  );

  assert.throws(
    () => validateBatchRecords({
      requestedIds: [1],
      existingLevels: [],
      existingGuides: {},
      batchLevels: [{ ...verifiedLevelOne, evidence: { ...verifiedLevelOne.evidence, levelId: "100" } }],
      batchGuides: { "1": verifiedGuideOne },
    }),
    /evidence must identify the requested level/,
  );

  assert.throws(
    () => validateBatchRecords({
      requestedIds: [1],
      existingLevels: [],
      existingGuides: {},
      batchLevels: [verifiedLevelOne],
      batchGuides: { "1": { ...verifiedGuideOne, sourceLevelId: "100" } },
    }),
    /sourceLevelId must match/,
  );

  assert.throws(
    () => validateBatchRecords({
      requestedIds: [1],
      existingLevels: [],
      existingGuides: {},
      batchLevels: [verifiedLevelOne],
      batchGuides: { "1": { ...verifiedGuideOne, beforeMove: [] } },
    }),
    /beforeMove is incomplete/,
  );
});

test("batch sync stages both data files and rolls back failed writes", () => {
  assert.match(syncScript, /writeJsonPair/);
  assert.match(syncScript, /\.temporary/);
  assert.match(syncScript, /\.backup/);
  assert.match(syncScript, /fs\.renameSync/);
});

