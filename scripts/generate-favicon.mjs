import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const svgPath = path.join(root, "app", "icon.svg");
const svg = fs.readFileSync(svgPath);

const outputs = [{ file: path.join(root, "app", "apple-icon.png"), size: 180 }];

for (const { file, size } of outputs) {
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toFile(file);
  console.log(`Wrote ${path.relative(root, file)} (${size}x${size})`);
}
