import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";

export const COVER_SIZE = Object.freeze({ width: 600, height: 500 });
export const GUIDE_SIZE = Object.freeze({ width: 720, height: 1280 });

export function chooseGuideSize(width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error("Source dimensions must be positive numbers");
  }

  return width >= GUIDE_SIZE.width && height >= GUIDE_SIZE.height
    ? { ...GUIDE_SIZE }
    : { width, height };
}

export function validateExtraction(entry, sourceWidth, sourceHeight) {
  if (!entry?.crop) {
    throw new Error("Extraction entry requires crop coordinates");
  }

  const { x, y, width, height } = entry.crop;
  if (
    ![x, y, width, height].every(Number.isFinite) ||
    x < 0 ||
    y < 0 ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error("Crop must contain positive coordinates within the source frame");
  }

  if (x + width > sourceWidth || y + height > sourceHeight) {
    throw new Error("Crop exceeds source frame bounds");
  }
}

export function getOutputPaths(rootDir, levelId) {
  const publicDir = path.join(rootDir, "public", "levels", String(levelId));
  const privateDir = path.join(rootDir, ".level-assets", "match", String(levelId));

  return {
    publicDir,
    privateDir,
    stepDir: path.join(publicDir, "steps"),
    cacheDir: path.join(rootDir, ".level-assets", "cache"),
    cover: path.join(publicDir, "cover.webp"),
    matchStart: path.join(privateDir, "match-start.webp"),
  };
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildWatermarkSvg(text, width) {
  if (!Number.isFinite(width) || width <= 0) {
    throw new Error("Watermark width must be a positive number");
  }

  const safeText = escapeXml(text);
  const fontSize = Math.max(18, Math.round(width * 0.045));
  const padding = Math.max(12, Math.round(width * 0.025));

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${fontSize + padding * 2}">` +
      `<text x="${padding}" y="${fontSize + padding}" fill="#ffffff" fill-opacity="0.24" ` +
      `font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="700">${safeText}</text>` +
      `</svg>`,
  );
}

export async function writeDerivedImages({ source, paths, crop, watermark }) {
  await fs.mkdir(paths.publicDir, { recursive: true });
  await fs.mkdir(paths.privateDir, { recursive: true });

  const normalizedCrop = await sharp(source)
    .extract({
      left: crop.x,
      top: crop.y,
      width: crop.width,
      height: crop.height,
    })
    .resize(COVER_SIZE.width, COVER_SIZE.height, { fit: "fill" })
    .png()
    .toBuffer();

  const watermarkSvg = buildWatermarkSvg(watermark, COVER_SIZE.width);

  await Promise.all([
    sharp(normalizedCrop)
      .composite([{ input: watermarkSvg, gravity: "southwest" }])
      .webp({ quality: 90 })
      .toFile(paths.cover),
    sharp(normalizedCrop).webp({ lossless: true }).toFile(paths.matchStart),
  ]);
}

export async function writeMatchImage({ source, output, crop }) {
  await fs.mkdir(path.dirname(output), { recursive: true });
  await sharp(source)
    .extract({
      left: crop.x,
      top: crop.y,
      width: crop.width,
      height: crop.height,
    })
    .resize(COVER_SIZE.width, COVER_SIZE.height, { fit: "fill" })
    .webp({ lossless: true })
    .toFile(output);
}

export async function writeGuideImage({ source, output, watermark, crop }) {
  const metadata = await sharp(source).metadata();
  const sourceWidth = crop?.width || metadata.width;
  const sourceHeight = crop?.height || metadata.height;
  const size = chooseGuideSize(sourceWidth, sourceHeight);
  const watermarkSvg = buildWatermarkSvg(watermark, size.width);

  await fs.mkdir(path.dirname(output), { recursive: true });
  let pipeline = sharp(source);
  if (crop) {
    pipeline = pipeline.extract({
      left: crop.x,
      top: crop.y,
      width: crop.width,
      height: crop.height,
    });
  }

  await pipeline
    .resize(size.width, size.height, {
      fit: "contain",
      withoutEnlargement: true,
      background: { r: 248, g: 216, b: 171, alpha: 1 },
    })
    .composite([{ input: watermarkSvg, gravity: "southwest" }])
    .webp({ quality: 90 })
    .toFile(output);
}
