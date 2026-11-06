import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outputDir = path.join(root, "public", "images", "store");
const screenshots = [
  { level: 2, source: path.join(root, "public", "levels", "2", "steps", "step-1.webp") },
  { level: 6, source: path.join(root, "public", "levels", "6", "steps", "step-1.webp") },
  { level: 10, source: path.join(root, "public", "levels", "10", "steps", "step-1.webp") },
];

await fs.mkdir(outputDir, { recursive: true });

for (const { level, source } of screenshots) {
  await sharp(source)
    .resize(576, 1246, { fit: "contain", background: "#f6f3ee" })
    .webp({ quality: 88 })
    .toFile(path.join(outputDir, `rotate-rings-level-${level}.webp`));
}

const logo = path.join(root, "public", "logo.png");
const logoBuffer = await sharp(logo).resize(420, 420, { fit: "contain" }).png().toBuffer();
const ogLogo = await sharp(logoBuffer).resize(160, 160, { fit: "contain" }).png().toBuffer();
for (const size of [16, 32]) {
  await sharp(logoBuffer).resize(size, size).png().toFile(path.join(root, "public", `favicon-${size}x${size}.png`));
}
await sharp(logoBuffer).resize(180, 180).png().toFile(path.join(root, "public", "apple-touch-icon.png"));

const screenshot = await sharp(path.join(outputDir, "rotate-rings-level-2.webp"))
  .resize(360, 630, { fit: "cover", position: "top" })
  .webp()
  .toBuffer();
const title = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#eaf8fb"/>
  <text x="72" y="190" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#17313a">Rotate Rings</text>
  <text x="72" y="270" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#d9480f">Level Walkthroughs</text>
  <text x="72" y="335" font-family="Arial, sans-serif" font-size="25" fill="#435f68">Videos, board screenshots, and route notes</text>
</svg>`);

await sharp(title)
  .composite([
    { input: ogLogo, left: 70, top: 390 },
    { input: screenshot, left: 810, top: 0 },
  ])
  .webp({ quality: 90 })
  .toFile(path.join(root, "public", "images", "rotate-rings-og.webp"));

console.log("Generated gameplay screenshots, icons, and OpenGraph image.");
