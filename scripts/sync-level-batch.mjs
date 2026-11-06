import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(rootDir, "..");

const DEFAULT_CSV_PATH = "C:\\Users\\User\\Downloads\\Rotate Rings All Level Gameplay Walkthrough Solution.csv";
const DEFAULT_BATCH_SIZE = 20;

function loadGameConfig() {
  const configPath =
    process.env.GAME_UPDATE_CONFIG ||
    path.join(workspaceRoot, "game-update-configs", "games", "rotaterings.json");

  if (!fs.existsSync(configPath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

const gameConfig = loadGameConfig();
const levelUpdateConfig = gameConfig.levelUpdates || {};
const csvPath = process.argv[2] || process.env.COLONY_FLOW_CSV || levelUpdateConfig.sourcePath || DEFAULT_CSV_PATH;
const batchSize = Number(process.env.COLONY_FLOW_BATCH_SIZE || levelUpdateConfig.batchSize || DEFAULT_BATCH_SIZE);

const levelsPath = path.join(rootDir, "data", "levels.json");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === "\"" && next === "\"") {
        field += "\"";
        i += 1;
      } else if (char === "\"") {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim().length > 0));
}

function parseLevelNumber(value) {
  const match = String(value || "").match(/level\s*-?\s*(\d+)/i) || String(value || "").match(/^(\d+)/);
  return match ? Number(match[1]) : NaN;
}

function extractVideoId(row) {
  const directVideoId = row.videoId || row.VideoId || row["Video ID"] || "";
  if (directVideoId.trim()) {
    return directVideoId.trim();
  }

  const videoUrl = row["Video url"] || row.videoUrl || row.VideoUrl || "";
  const match = videoUrl.match(/[?&]v=([^&]+)/) || videoUrl.match(/youtu\.be\/([^?&/]+)/) || videoUrl.match(/embed\/([^?&/]+)/);
  return match ? match[1] : "";
}

function getDifficulty(levelNumber) {
  if (levelNumber <= 30) {
    return "Easy";
  }

  if (levelNumber <= 80) {
    return "Medium";
  }

  if (levelNumber <= 120) {
    return "Hard";
  }

  return "Expert";
}

function normalizeThumbnail(row, videoId) {
  const thumbnail = row["Thumbnail url"] || row.thumbnail || row.videoThumbnail || "";
  if (thumbnail.trim()) {
    return thumbnail.trim().replace("/maxresdefault.jpg", "/mqdefault.jpg");
  }

  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}

function buildLevel(row) {
  const sourceTitle = row.Title || row.title || "";
  const levelNumber = parseLevelNumber(sourceTitle);
  const videoId = extractVideoId(row);
  const completionTime = (row["Duration in timestamp"] || row.Time || row.completionTime || "").trim();

  if (!Number.isFinite(levelNumber) || !videoId || !completionTime) {
    return null;
  }

  const thumbnail = normalizeThumbnail(row, videoId);

  return {
    id: String(levelNumber),
    title: `Rotate Rings Level ${levelNumber}`,
    difficulty: getDifficulty(levelNumber),
    thumbnail,
    category: "Ant Colony Levels",
    description: `Watch the Rotate Rings Level ${levelNumber} walkthrough and learn the best order to send worker ants, match cube colors, open colony slots, and clear the puzzle board.`,
    completionTime,
    videoUrl: `https://www.youtube.com/embed/${videoId}`,
    videoId,
    videoThumbnail: thumbnail,
    videoDuration: completionTime,
    videoTitle: `Rotate Rings Level ${levelNumber} Gameplay Walkthrough Solution`,
    guide: [
      {
        title: `Rotate Rings Level ${levelNumber} Walkthrough`,
        steps: [
          "Study the cube stacks, color holes, and available colony slots before making the first move.",
          "Send worker ants from the stack that can immediately deliver cubes to a matching color hole.",
          "Keep at least one colony slot open so the trail does not become blocked by the wrong color.",
          `Use the video route to copy the safest order and finish Rotate Rings Level ${levelNumber} without wasting moves.`,
        ],
      },
    ],
    tips: [
      "Plan two or three ant moves ahead before tapping a cube stack.",
      "Clear colors with fewer cubes first when space is limited.",
      "Avoid filling colony slots with colors that have no open matching hole.",
      "Pause the walkthrough at each major board change if the puzzle feels crowded.",
    ],
    tags: [
      "Rotate Rings",
      `Rotate Rings Level ${levelNumber}`,
      "walkthrough",
      "solution",
      "ant puzzle",
      "color sorting",
    ],
  };
}

const levels = JSON.parse(fs.readFileSync(levelsPath, "utf8"));
const currentMax = Math.max(...levels.map((level) => parseLevelNumber(level.id)).filter(Number.isFinite));
const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const headers = rows.shift();

const csvLevels = rows
  .map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])))
  .map(buildLevel)
  .filter(Boolean)
  .sort((a, b) => Number(a.id) - Number(b.id));

const selected = csvLevels.filter((level) => Number(level.id) > currentMax).slice(0, batchSize);
const byId = new Map(levels.map((level) => [level.id, level]));

for (const level of selected) {
  byId.set(level.id, level);
}

const updated = Array.from(byId.values()).sort((a, b) => parseLevelNumber(a.id) - parseLevelNumber(b.id));
fs.writeFileSync(levelsPath, `${JSON.stringify(updated, null, 2)}\n`);

const numericRowsAboveMax = csvLevels.filter((level) => Number(level.id) > currentMax).map((level) => Number(level.id));
const expectedEnd = selected.length > 0 ? Number(selected[selected.length - 1].id) : currentMax;
const skippedBetween = [];
for (let level = currentMax + 1; level <= expectedEnd; level += 1) {
  if (!numericRowsAboveMax.includes(level)) {
    skippedBetween.push(level);
  }
}

console.log(
  JSON.stringify(
    {
      csvPath,
      batchSize,
      previousMax: currentMax,
      added: selected.map((level) => Number(level.id)),
      newMax: Math.max(...updated.map((level) => parseLevelNumber(level.id)).filter(Number.isFinite)),
      availableAfterPreviousMax: numericRowsAboveMax.length,
      skippedBetween,
    },
    null,
    2,
  ),
);
