import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const NAVY = { r: 17, g: 23, b: 91 };
const LUM_BG = 40;
const LUM_FG = 120;

function extractPngFromSvg(svgText) {
  const marker = "data:image/png;base64,";
  const start = svgText.indexOf(marker);
  if (start < 0) throw new Error("No embedded PNG in SVG");
  const end = svgText.indexOf('"', start);
  return Buffer.from(svgText.slice(start + marker.length, end), "base64");
}

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** White/light logo on dark bg → navy on transparent */
async function toNavyTransparent(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const lum = luminance(r, g, b);
    const effective = lum * (a / 255);
    if (effective < LUM_BG) {
      out[i] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 0;
    } else if (effective >= LUM_FG) {
      out[i] = NAVY.r;
      out[i + 1] = NAVY.g;
      out[i + 2] = NAVY.b;
      out[i + 3] = 255;
    } else {
      const t = (effective - LUM_BG) / (LUM_FG - LUM_BG);
      out[i] = NAVY.r;
      out[i + 1] = NAVY.g;
      out[i + 2] = NAVY.b;
      out[i + 3] = Math.round(255 * t);
    }
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
}

function writeSvg(outPath, pngBuffer, w, h) {
  const b64 = pngBuffer.toString("base64");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"><image width="${w}" height="${h}" xlink:href="data:image/png;base64,${b64}"/></svg>`;
  fs.writeFileSync(outPath, svg, "utf8");
}

async function trimPng(pipeline, maxWidth) {
  let p = pipeline.clone().trim({ threshold: 1 });
  const meta = await p.metadata();
  if (meta.width && meta.width > maxWidth) {
    p = p.resize({ width: maxWidth, withoutEnlargement: true });
  }
  return p.png({ compressionLevel: 9 }).toBuffer({ resolveWithObject: true });
}

/** Compact mark: tight box around ink in upper 72% of image, centered horizontally */
async function compactCrop(pipeline) {
  const { data, info } = await pipeline
    .clone()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const yMax = Math.floor(height * 0.72);
  let minX = width;
  let minY = yMax;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] > 20) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) {
    const side = Math.min(width, height);
    const left = Math.floor((width - side) / 2);
    return pipeline.clone().extract({ left, top: 0, width: side, height: side });
  }

  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.08);
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const right = Math.min(width - 1, maxX + pad);
  const bottom = Math.min(height - 1, maxY + pad);
  const w = right - left + 1;
  const h = bottom - top + 1;
  let size = Math.max(w, h);
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  size = Math.min(size, width, height);
  let extractLeft = Math.round(cx - size / 2);
  let extractTop = Math.round(cy - size / 2);
  extractLeft = Math.max(0, Math.min(width - size, extractLeft));
  extractTop = Math.max(0, Math.min(height - size, extractTop));

  return pipeline.clone().extract({
    left: extractLeft,
    top: extractTop,
    width: size,
    height: size,
  });
}

async function cornerAlpha(pngBuffer) {
  const { data, info } = await sharp(pngBuffer).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  return corners.map(([x, y]) => data[(y * width + x) * 4 + 3]);
}

const publicDir = path.join(process.cwd(), "public");
const currentLogoPath = path.join(publicDir, "logo.svg");
const currentSvg = fs.readFileSync(currentLogoPath, "utf8");
const currentPng = extractPngFromSvg(currentSvg);

let full;
let navySource;

if (currentSvg.includes('viewBox="0 0 1600') || currentSvg.length < 500_000) {
  navySource = sharp(currentPng);
  const meta = await sharp(currentPng).metadata();
  full = { data: currentPng, info: { width: meta.width, height: meta.height } };
} else {
  const originalSvg = execSync("git show HEAD:public/logo.svg", {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  const inputPng = extractPngFromSvg(originalSvg);
  const navy = await toNavyTransparent(inputPng);
  navySource = navy;
  full = await trimPng(navy, 1600);
  writeSvg(currentLogoPath, full.data, full.info.width, full.info.height);
}

const compactPipe = await compactCrop(navySource);
let compactBuf = await sharp(await compactPipe.png().toBuffer())
  .resize({ width: 768, height: 768, fit: "inside", withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toBuffer({ resolveWithObject: true });
const pad = Math.max(12, Math.round(Math.min(compactBuf.info.width, compactBuf.info.height) * 0.12));
compactBuf = await sharp(compactBuf.data)
  .extend({
    top: pad,
    bottom: pad,
    left: pad,
    right: pad,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer({ resolveWithObject: true });

writeSvg(
  path.join(publicDir, "logo-compact.svg"),
  compactBuf.data,
  compactBuf.info.width,
  compactBuf.info.height
);

const fullCorners = await cornerAlpha(full.data);
const compactCorners = await cornerAlpha(compactBuf.data);

console.log(
  JSON.stringify({
    full: { w: full.info.width, h: full.info.height, cornerAlpha: fullCorners },
    compact: { w: compactBuf.info.width, h: compactBuf.info.height, cornerAlpha: compactCorners },
  })
);
