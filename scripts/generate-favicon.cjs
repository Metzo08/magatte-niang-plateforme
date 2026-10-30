/**
 * Génère le favicon officiel Magatte Niang (monogramme MN).
 * Couleurs du logo corporate (Header) :
 *   - fond : bleu marine #0B1B2B (brand-900)
 *   - M    : blanc
 *   - N    : orange #F26A1B (accent-500)
 * Produit public/favicon.ico (32x32) et public/favicon-256.png.
 * Sans dépendance externe — ICO PNG + PNG encodés en pur Node.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const NAVY = [11, 27, 43, 255];      // #0B1B2B
const WHITE = [255, 255, 255, 255];
const ORANGE = [242, 106, 27, 255];  // #F26A1B

// Glyphes 5x5 (M blanc, N orange comme dans le header)
const GLYPH_M = ['#.#', '###', '#.#', '#.#', '#.#'];
const GLYPH_N = ['#.#', '##.', '#.#', '#.#', '#.#'];

function inRoundedRect(x, y, w, h, radius) {
  const left = radius;
  const right = w - radius;
  const top = radius;
  const bottom = h - radius;
  if (x < radius) {
    if (y < radius) return (x - left) ** 2 + (y - top) ** 2 <= radius ** 2;
    if (y >= h - radius) return (x - left) ** 2 + (y - bottom) ** 2 <= radius ** 2;
  }
  if (x >= w - radius) {
    if (y < radius) return (x - right) ** 2 + (y - top) ** 2 <= radius ** 2;
    if (y >= h - radius) return (x - right) ** 2 + (y - bottom) ** 2 <= radius ** 2;
  }
  return x >= 0 && x < w && y >= 0 && y < h;
}

function setPixel(px, x, y, color) {
  if (x < 0 || y < 0 || x >= px.width || y >= px.height) return;
  const i = (y * px.width + x) * 4;
  px.data[i] = color[0];
  px.data[i + 1] = color[1];
  px.data[i + 2] = color[2];
  px.data[i + 3] = color[3];
}

function drawGlyph(px, ox, oy, cell, glyph, color) {
  const pad = Math.max(1, Math.floor(cell / 8));
  for (let r = 0; r < glyph.length; r++) {
    for (let c = 0; c < glyph[0].length; c++) {
      if (glyph[r][c] !== '#') continue;
      for (let dy = pad; dy < cell - pad; dy++) {
        for (let dx = pad; dx < cell - pad; dx++) {
          setPixel(px, ox + c * cell + dx, oy + r * cell + dy, color);
        }
      }
    }
  }
}

function render(size) {
  const px = { width: size, height: size, data: new Uint8Array(size * size * 4) };
  const radius = Math.max(2, Math.round(size * 0.18));
  const margin = Math.max(1, Math.round(size * 0.04));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (inRoundedRect(x, y, size, size, radius)) {
        setPixel(px, x, y, NAVY);
      }
    }
  }
  // "MN" centré : 2 glyphs de 3 colonnes + 1 colonne d'écart = 7 colonnes
  const cell = Math.floor((size - 2 * margin) / 7);
  const glyphW = 3 * cell;
  const totalW = glyphW * 2 + cell;
  const ox = Math.floor((size - totalW) / 2);
  const totalH = 5 * cell;
  const oy = Math.floor((size - totalH) / 2);
  drawGlyph(px, ox, oy, cell, GLYPH_M, WHITE);
  drawGlyph(px, ox + glyphW + cell, oy, cell, GLYPH_N, ORANGE);
  return px;
}
// ==== PNG encoder minimal (sans dépendance) ====
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  let v = crc ^ 0xffffffff;
  // Normalise en entier non signé 32 bits (JS bits = signés)
  return v < 0 ? v + 4294967296 : v;
}

function chunk(type, data) {
  const out = Buffer.alloc(4 + type.length + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  Buffer.from(type, 'ascii').copy(out, 4);
  Buffer.from(data).copy(out, 4 + type.length);
  const crcBuf = Buffer.concat([Buffer.from(type, 'ascii'), Buffer.from(data)]);
  out.writeUInt32BE(crc32(crcBuf), 4 + type.length + data.length);
  return out;
}

function adler32(buf) {
  let a = 1, b = 0;
  for (const byte of buf) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  // Combine as unsigned 32-bit sans débordement signé JS :
  // (b << 16 | a) via multiplication (pas de wrap 32-bit signé).
  return (b & 0xffff) * 65536 + (a & 0xffff);
}

// Déflate "stored" (non compressé) — valide pour PNG
function deflateStored(raw) {
  const blocks = [];
  let off = 0;
  if (raw.length === 0) {
    blocks.push(Buffer.from([0x01, 0x00, 0x00, 0xff, 0xff]));
  }
  while (off < raw.length) {
    const len = Math.min(65535, raw.length - off);
    const last = off + len >= raw.length;
    const hdr = Buffer.alloc(5);
    hdr[0] = last ? 0x01 : 0x00;
    hdr[1] = len & 0xff;
    hdr[2] = (len >> 8) & 0xff;
    hdr[3] = (~len) & 0xff;
    hdr[4] = ((~len) >> 8) & 0xff;
    blocks.push(hdr);
    blocks.push(Buffer.from(raw.slice(off, off + len)));
    off += len;
  }
  const adler = Buffer.alloc(4);
  adler.writeUInt32BE(adler32(raw));
  return Buffer.concat([Buffer.from([0x78, 0x01]), Buffer.concat(blocks), adler]);
}

function encodePNG(px) {
  const { width: w, height: h, data } = px;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  // scanlines : 1 octet filtre 0 + pixels RGBA
  const raw = Buffer.alloc(h * (1 + w * 4));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 4)] = 0;
    Buffer.from(data.slice(y * w * 4, (y + 1) * w * 4)).copy(raw, y * (1 + w * 4) + 1);
  }
  const idat = deflateStored(raw);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function encodeICO(png32) {
  const ico = Buffer.alloc(6 + 16 + png32.length);
  ico.writeUInt16LE(0, 0);   // reserved
  ico.writeUInt16LE(1, 2);   // type : icône
  ico.writeUInt16LE(1, 4);   // count : 1 image
  ico[6] = 32;               // width
  ico[7] = 32;               // height
  ico[8] = 0;                // couleurs
  ico[9] = 0;                // réservé
  ico.writeUInt16LE(1, 10);  // plans
  ico.writeUInt16LE(32, 12); // profondeur
  ico.writeUInt32LE(png32.length, 14); // taille image
  ico.writeUInt32LE(22, 18); // offset (6 + 16)
  Buffer.from(png32).copy(ico, 22);
  return ico;
}

// ==== Génération ====
const publicDir = path.join(__dirname, '..', 'public');
const png32 = encodePNG(render(32));
const png256 = encodePNG(render(256));
const ico = encodeICO(png32);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico);
fs.writeFileSync(path.join(publicDir, 'favicon-256.png'), png256);

console.log('FAVICON OK');
console.log('favicon.ico      :', ico.length, 'octets');
console.log('favicon-256.png  :', png256.length, 'octets');