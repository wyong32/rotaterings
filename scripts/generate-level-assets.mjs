import { spawnSync } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getOutputPaths,
  validateExtraction,
  writeDerivedImages,
  writeGuideImage,
  writeMatchImage,
} from "./lib/level-assets.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(rootDir, "data", "level-image-sources.json");
const levelsPath = path.join(rootDir, "data", "levels.json");

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
    windowsHide: true,
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}: ${result.stderr || ""}`.trim());
  }

  return result.stdout || "";
}

function selectEntries(manifest) {
  const level = readArg("--level");
  const from = Number(readArg("--from"));
  const to = Number(readArg("--to"));

  if (level) {
    return manifest.filter((entry) => entry.levelId === String(level));
  }
  if (Number.isFinite(from) && Number.isFinite(to)) {
    return manifest.filter((entry) => Number(entry.levelId) >= from && Number(entry.levelId) <= to);
  }

  throw new Error("Use --level N or --from N --to N");
}

async function ensureVideo(entry, paths) {
  const explicitSource = readArg("--source");
  if (explicitSource) {
    const resolved = path.resolve(explicitSource);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Source video does not exist: ${resolved}`);
    }
    return resolved;
  }

  await fsp.mkdir(paths.cacheDir, { recursive: true });
  const output = path.join(paths.cacheDir, `${entry.videoId}.mp4`);
  if (fs.existsSync(output)) {
    return output;
  }

  run("yt-dlp", [
    "--no-playlist",
    "-f",
    "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
    "--merge-output-format",
    "mp4",
    "-o",
    output,
    `https://www.youtube.com/watch?v=${entry.videoId}`,
  ]);

  if (!fs.existsSync(output)) {
    throw new Error(`yt-dlp completed without creating ${output}`);
  }
  return output;
}

function probeVideo(source) {
  const output = run(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
      "-of",
      "json",
      source,
    ],
    { capture: true },
  );
  const stream = JSON.parse(output).streams?.[0];
  if (!stream?.width || !stream?.height) {
    throw new Error(`Could not read video dimensions for ${source}`);
  }
  return { width: stream.width, height: stream.height };
}

function framePath(paths, levelId, kind, time) {
  const safeTime = time.replaceAll(":", "-").replaceAll(".", "-");
  return path.join(paths.cacheDir, `${levelId}-${kind}-${safeTime}.png`);
}

async function extractFrame(source, time, output) {
  if (fs.existsSync(output)) {
    return output;
  }
  await fsp.mkdir(path.dirname(output), { recursive: true });
  run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", time, "-i", source, "-frames:v", "1", output]);
  if (!fs.existsSync(output)) {
    throw new Error(`FFmpeg did not create frame ${output}`);
  }
  return output;
}

async function processEntry(entry) {
  const paths = getOutputPaths(rootDir, entry.levelId);
  const source = await ensureVideo(entry, paths);
  const dimensions = probeVideo(source);
  validateExtraction(entry, dimensions.width, dimensions.height);
  if (entry.guideCrop) {
    validateExtraction({ crop: entry.guideCrop }, dimensions.width, dimensions.height);
  }

  const coverFrame = await extractFrame(
    source,
    entry.coverTime,
    framePath(paths, entry.levelId, "cover", entry.coverTime),
  );
  await writeDerivedImages({
    source: coverFrame,
    paths,
    crop: entry.crop,
    watermark: "rotaterings.online",
  });

  const matchTimes = entry.matchTimes || [entry.coverTime];
  for (let index = 0; index < matchTimes.length; index += 1) {
    const time = matchTimes[index];
    if (index === 0 && time === entry.coverTime) {
      continue;
    }
    const frame = await extractFrame(
      source,
      time,
      framePath(paths, entry.levelId, `match-${index}`, time),
    );
    await writeMatchImage({
      source: frame,
      output: path.join(paths.privateDir, `match-${index}.webp`),
      crop: entry.crop,
    });
  }

  const guideImages = [];
  for (let index = 0; index < (entry.guideTimes || []).length; index += 1) {
    const time = entry.guideTimes[index];
    const frame = await extractFrame(
      source,
      time,
      framePath(paths, entry.levelId, `guide-${index + 1}`, time),
    );
    const output = path.join(paths.stepDir, `step-${index + 1}.webp`);
    await writeGuideImage({
      source: frame,
      output,
      watermark: "rotaterings.online",
      crop: entry.guideCrop,
    });
    guideImages.push(`/levels/${entry.levelId}/steps/step-${index + 1}.webp`);
  }

  return {
    levelId: entry.levelId,
    coverImage: `/levels/${entry.levelId}/cover.webp`,
    guideImages,
  };
}

async function main() {
  const manifest = JSON.parse(await fsp.readFile(manifestPath, "utf8"));
  const selected = selectEntries(manifest);
  if (selected.length === 0) {
    throw new Error("No manifest entries matched the requested level range");
  }
  if (readArg("--source") && selected.length !== 1) {
    throw new Error("--source can only be used with a single --level");
  }

  const generated = [];
  for (const entry of selected) {
    generated.push(await processEntry(entry));
  }

  const levels = JSON.parse(await fsp.readFile(levelsPath, "utf8"));
  const byLevel = new Map(generated.map((entry) => [entry.levelId, entry]));
  const updated = levels.map((level) => {
    const assets = byLevel.get(level.id);
    if (!assets) {
      return level;
    }
    return {
      ...level,
      coverImage: assets.coverImage,
      guideImages: assets.guideImages,
      assetVersion: (level.assetVersion || 0) + 1,
    };
  });
  await fsp.writeFile(levelsPath, `${JSON.stringify(updated, null, 2)}\n`);

  console.log(JSON.stringify({ generated: generated.map((entry) => entry.levelId) }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
