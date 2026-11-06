import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, ".level-assets", "store");
const outputDir = path.join(root, "public", "images", "store");
const screenshots = [
  "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/d9/1a/46/d91a46d6-2ea5-09dc-b365-313b4beae75d/_U5ba3_U4f20_U56feios6.5_U6807_U98983.png/1242x2688bb.png",
  "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/04/61/d5/0461d507-be90-6c66-ab6f-ce1344f36bab/_U5ba3_U4f20_U56feios6.5_U6807_U98982.png/1242x2688bb.png",
  "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a4/3b/3f/a43b3f23-e1a9-db78-2e4c-12071ffe1d15/_U5ba3_U4f20_U56feios6.5-2.png/1242x2688bb.png",
];

await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

for (const [index, url] of screenshots.entries()) {
  const source = path.join(sourceDir, `gameplay-${index + 1}.png`);
  try {
    await fs.access(source);
  } catch {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Screenshot download failed: ${response.status}`);
    await fs.writeFile(source, Buffer.from(await response.arrayBuffer()));
  }

  await sharp(source)
    .resize(576, 1246, { fit: "cover", position: "top" })
    .webp({ quality: 88 })
    .toFile(path.join(outputDir, `gameplay-${index + 1}.webp`));
}

const logo = path.join(root, "public", "logo.png");
const logoBuffer = await sharp(logo).resize(420, 420, { fit: "contain" }).png().toBuffer();
const ogLogo = await sharp(logoBuffer).resize(160, 160, { fit: "contain" }).png().toBuffer();
for (const size of [16, 32]) {
  await sharp(logoBuffer).resize(size, size).png().toFile(path.join(root, "public", `favicon-${size}x${size}.png`));
}
await sharp(logoBuffer).resize(180, 180).png().toFile(path.join(root, "public", "apple-touch-icon.png"));

const screenshot = await sharp(path.join(outputDir, "gameplay-1.webp"))
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

console.log("Generated store screenshots, icons, and OpenGraph image.");
