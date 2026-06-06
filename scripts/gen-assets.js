// Generates simple branded placeholder PNG assets (solid accent + glyph dot)
// so the Expo project has valid icon/splash files. Replace with real artwork later.
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

// Solid color PNG with a centered filled circle in a second color.
function makePng(size, bg, fg, circleRatio) {
  const [br, bgc, bb] = bg;
  const [fr, fgc, fb] = fg;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size * circleRatio) / 2;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const inside = (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
      raw[p++] = inside ? fr : br;
      raw[p++] = inside ? fgc : bgc;
      raw[p++] = inside ? fb : bb;
      raw[p++] = 255;
    }
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const accent = [79, 70, 229]; // #4F46E5
const white = [255, 255, 255];
const dir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'icon.png'), makePng(1024, accent, white, 0.42));
fs.writeFileSync(path.join(dir, 'adaptive-icon.png'), makePng(1024, accent, white, 0.42));
fs.writeFileSync(path.join(dir, 'splash.png'), makePng(1284, white, accent, 0.18));
fs.writeFileSync(path.join(dir, 'favicon.png'), makePng(48, accent, white, 0.42));

console.log('Assets written to', dir);
