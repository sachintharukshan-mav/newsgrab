import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function createDibIco(sizes, svgBuffer) {
  const images = [];

  for (const size of sizes) {
    const { data, info } = sharp(svgBuffer)
      .resize(size, size)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then ? null : null; // async handled below
  }
}

async function generateAll() {
  const rootDir = process.cwd();
  const svgPath = path.join(rootDir, 'public', 'logo.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Generate multi-size DIB ICO
  const sizes = [16, 32, 48];
  const images = [];

  for (const size of sizes) {
    const { data, info } = await sharp(svgBuffer)
      .resize(size, size)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    const rowBytes = width * 4;
    const xorSize = rowBytes * height;

    const andRowBytes = Math.ceil(width / 32) * 4;
    const andSize = andRowBytes * height;
    const andMask = Buffer.alloc(andSize, 0);

    const dibHeader = Buffer.alloc(40);
    dibHeader.writeUInt32LE(40, 0);
    dibHeader.writeInt32LE(width, 4);
    dibHeader.writeInt32LE(height * 2, 8);
    dibHeader.writeUInt16LE(1, 12);
    dibHeader.writeUInt16LE(32, 14);
    dibHeader.writeUInt32LE(0, 16);
    dibHeader.writeUInt32LE(xorSize + andSize, 20);
    dibHeader.writeInt32LE(0, 24);
    dibHeader.writeInt32LE(0, 28);
    dibHeader.writeUInt32LE(0, 32);
    dibHeader.writeUInt32LE(0, 36);

    const xorMask = Buffer.alloc(xorSize);
    for (let y = 0; y < height; y++) {
      const srcY = height - 1 - y;
      for (let x = 0; x < width; x++) {
        const srcOffset = (srcY * width + x) * 4;
        const dstOffset = (y * width + x) * 4;
        xorMask[dstOffset] = data[srcOffset + 2];     // B
        xorMask[dstOffset + 1] = data[srcOffset + 1]; // G
        xorMask[dstOffset + 2] = data[srcOffset];     // R
        xorMask[dstOffset + 3] = data[srcOffset + 3]; // A
      }
    }

    const imageBuffer = Buffer.concat([dibHeader, xorMask, andMask]);
    images.push({ width, height, buffer: imageBuffer });
  }

  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + count * dirEntrySize;

  let currentOffset = dirSize;
  const entries = [];

  for (const item of images) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    entries.push(entry);
    currentOffset += item.buffer.length;
  }

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const icoBuffer = Buffer.concat([header, ...entries, ...images.map(img => img.buffer)]);

  // Write favicon.ico to src/app and public
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon.ico'), icoBuffer);
  console.log('✓ Generated src/app/favicon.ico and public/favicon.ico (' + icoBuffer.length + ' bytes)');

  // 2. Generate crisp 512x512 logo.png in public/
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(rootDir, 'public', 'logo.png'), png512);
  console.log('✓ Generated public/logo.png (' + png512.length + ' bytes)');

  // 3. Generate 180x180 apple-touch-icon.png in public/ and src/app/
  const png180 = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(rootDir, 'public', 'apple-touch-icon.png'), png180);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'apple-icon.png'), png180);
  console.log('✓ Generated public/apple-touch-icon.png and src/app/apple-icon.png');

  // 4. Copy icon.svg to public/icon.svg if not present
  fs.copyFileSync(path.join(rootDir, 'src', 'app', 'icon.svg'), path.join(rootDir, 'public', 'icon.svg'));
  console.log('✓ Synced public/icon.svg');
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
