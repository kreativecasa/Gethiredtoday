// Generates favicon + app-icon PNGs from an SVG mark.
// Run: node scripts/generate-icons.mjs
// Outputs:
//   app/icon.png        (512×512 — Next.js serves at any requested size)
//   app/apple-icon.png  (180×180 — for iOS home screen)
//   public/icon-512.png (overwritten — used in OG metadata)

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Same geometry as components/logo.tsx Mark component — drawn at 48 viewBox
// units and scaled up. Keeping these identical so the favicon and the in-page
// logo mark are visually the same.
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="48" y2="48">
      <stop offset="0%" stop-color="#5fd4c1"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="48" height="48" rx="11" fill="url(#g)"/>
  <!-- Clean G: outer arc open at the right + short horizontal crossbar -->
  <path d="M34 18 A11 11 0 1 0 34 32 L34 26 L26 26"
        stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function main() {
  const root = process.cwd();
  const svgBuf = Buffer.from(SVG);

  const targets = [
    { file: "app/icon.png", size: 512 },
    { file: "app/apple-icon.png", size: 180 },
    { file: "public/icon-512.png", size: 512 },
  ];

  for (const { file, size } of targets) {
    const out = path.join(root, file);
    await ensureDir(path.dirname(out));
    const png = await sharp(svgBuf, { density: 384 }).resize(size, size).png().toBuffer();
    await writeFile(out, png);
    console.log(`wrote ${file} (${size}×${size}, ${png.length} bytes)`);
  }

  // Also save the raw SVG for modern browsers that prefer it
  await writeFile(path.join(root, "app/icon.svg"), SVG);
  console.log("wrote app/icon.svg");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
