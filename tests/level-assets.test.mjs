import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import {
  buildWatermarkSvg,
  chooseGuideSize,
  getOutputPaths,
  validateExtraction,
  writeDerivedImages,
  writeGuideImage,
  writeMatchImage,
} from "../scripts/lib/level-assets.mjs";

sharp.cache(false);

test("uses 720x1280 only when the source supports it", () => {
  assert.deepEqual(chooseGuideSize(1080, 1920), { width: 720, height: 1280 });
  assert.deepEqual(chooseGuideSize(540, 960), { width: 540, height: 960 });
});

test("rejects crop coordinates outside the source", () => {
  assert.throws(() =>
    validateExtraction(
      { crop: { x: -1, y: 0, width: 600, height: 500 } },
      1080,
      1920,
    ),
  );
  assert.throws(() =>
    validateExtraction(
      { crop: { x: 700, y: 100, width: 600, height: 500 } },
      1080,
      1920,
    ),
  );
});

test("keeps public and private outputs separate", () => {
  const paths = getOutputPaths("C:/site", "125");
  assert.equal(paths.cover.replaceAll("\\", "/"), "C:/site/public/levels/125/cover.webp");
  assert.equal(
    paths.matchStart.replaceAll("\\", "/"),
    "C:/site/.level-assets/match/125/match-start.webp",
  );
});

test("watermark SVG is transparent and uses the requested label", () => {
  const svg = buildWatermarkSvg("rotaterings.online", 600).toString("utf8");
  assert.match(svg, /rotaterings\.online/);
  assert.match(svg, /fill-opacity="0\.38"/);
  assert.doesNotMatch(svg, /<rect/);
});

test("writes a 600x500 public cover and private lossless match image", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "colony-level-assets-"));
  t.after(() =>
    fs.rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }),
  );

  const source = path.join(root, "source.png");
  await sharp({
    create: {
      width: 1080,
      height: 1920,
      channels: 4,
      background: { r: 244, g: 132, b: 46, alpha: 1 },
    },
  })
    .png()
    .toFile(source);

  const paths = getOutputPaths(root, "1");
  await writeDerivedImages({
    source,
    paths,
    crop: { x: 100, y: 100, width: 600, height: 500 },
    watermark: "rotaterings.online",
  });

  const readShape = async (file) => {
    const { width, height, format } = await sharp(file).metadata();
    return { width, height, format };
  };

  assert.deepEqual(await readShape(paths.cover), {
    width: 600,
    height: 500,
    format: "webp",
  });
  assert.deepEqual(await readShape(paths.matchStart), {
    width: 600,
    height: 500,
    format: "webp",
  });
});

test("guide export preserves a lower resolution portrait without upscaling", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "colony-guide-assets-"));
  t.after(() =>
    fs.rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }),
  );

  const source = path.join(root, "source.png");
  const output = path.join(root, "step-1.webp");
  await sharp({
    create: {
      width: 540,
      height: 960,
      channels: 4,
      background: { r: 255, g: 220, b: 120, alpha: 1 },
    },
  })
    .png()
    .toFile(source);

  await writeGuideImage({ source, output, watermark: "rotaterings.online" });
  const { width, height, format } = await sharp(output).metadata();
  assert.deepEqual({ width, height, format }, { width: 540, height: 960, format: "webp" });
});

test("guide export uses the configured complete-interface crop", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "colony-guide-crop-"));
  t.after(() =>
    fs.rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }),
  );

  const source = path.join(root, "source.png");
  const output = path.join(root, "step.webp");
  const blueRegion = await sharp({
    create: {
      width: 600,
      height: 1200,
      channels: 4,
      background: { r: 20, g: 80, b: 220, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: 1080,
      height: 1920,
      channels: 4,
      background: { r: 220, g: 40, b: 40, alpha: 1 },
    },
  })
    .composite([{ input: blueRegion, left: 240, top: 100 }])
    .png()
    .toFile(source);

  await writeGuideImage({
    source,
    output,
    watermark: "rotaterings.online",
    crop: { x: 240, y: 100, width: 600, height: 1200 },
  });

  const pixel = await sharp(output).extract({ left: 360, top: 1100, width: 1, height: 1 }).raw().toBuffer();
  assert.ok(pixel[2] > pixel[0], "expected the configured blue game-interface crop");
});

test("additional matching images remain unwatermarked lossless 600x500 files", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "colony-match-assets-"));
  t.after(() =>
    fs.rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }),
  );

  const source = path.join(root, "source.png");
  const output = path.join(root, "match-mid-1.webp");
  await sharp({
    create: {
      width: 1080,
      height: 1920,
      channels: 4,
      background: { r: 20, g: 160, b: 220, alpha: 1 },
    },
  })
    .png()
    .toFile(source);

  await writeMatchImage({
    source,
    output,
    crop: { x: 100, y: 100, width: 600, height: 500 },
  });

  const { width, height, format } = await sharp(output).metadata();
  assert.deepEqual({ width, height, format }, { width: 600, height: 500, format: "webp" });
});
