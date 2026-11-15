#!/usr/bin/env node
/**
 * Upload direct (zero dependance) de public/images et public/videos vers Cloudflare R2 (ou tout stockage S3).
 *
 * Variables requises :
 *   R2_ACCOUNT_ID       (ex: 1234567890abcdef1234567890abcdef)
 *   R2_ACCESS_KEY_ID    (cle API R2)
 *   R2_SECRET_ACCESS_KEY (secret API R2)
 *   R2_BUCKET           (defaut: magatte-media)
 *   R2_PUBLIC_URL       (ex: https://pub-xxxxxxxx.r2.dev ou https://media.magatteniang-expert.sn)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID?.trim();
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID?.trim();
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY?.trim();
const BUCKET = (process.env.R2_BUCKET || 'magatte-media').trim();
const PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').trim().replace(/\/+$/, '');
const ENDPOINT = (process.env.S3_ENDPOINT || (ACCOUNT_ID ? `https://${ACCOUNT_ID}.r2.cloudflarestorage.com` : '')).replace(/\/+$/, '');

if (!ENDPOINT || !ACCESS_KEY || !SECRET_KEY) {
  console.error('Variables manquantes : R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
  process.exit(1);
}

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function hmac(key, data) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}

function sha256Hex(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function encodeS3Key(key) {
  return key.split('/').map((seg) => encodeURIComponent(seg)).join('/');
}

async function uploadFile(localPath, s3Key) {
  const body = fs.readFileSync(localPath);
  const payloadHash = sha256Hex(body);
  const contentType = getMimeType(localPath);
  const cacheControl = 'public, max-age=31536000, immutable';

  const urlObj = new URL(`${ENDPOINT}/${BUCKET}/${encodeS3Key(s3Key)}`);
  const host = urlObj.host;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const region = 'auto';
  const service = 's3';

  const canonicalHeaders =
    `cache-control:${cacheControl}\n` +
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = 'cache-control;content-type;host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = [
    'PUT',
    urlObj.pathname,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const scope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    scope,
    sha256Hex(Buffer.from(canonicalRequest, 'utf8')),
  ].join('\n');

  const kDate = hmac(`AWS4${SECRET_KEY}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(urlObj.toString(), {
    method: 'PUT',
    headers: {
      'Cache-Control': cacheControl,
      'Content-Type': contentType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      Authorization: authorization,
    },
    body,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} pour ${s3Key}: ${errText.slice(0, 200)}`);
  }
}

function walkFiles(dir, baseDir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      const rel = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push({ fullPath, key: rel, size: fs.statSync(fullPath).size });
    }
  }
  return results;
}

async function main() {
  const rootPublic = path.resolve(process.cwd(), 'public');
  const files = [
    ...walkFiles(path.join(rootPublic, 'images'), rootPublic),
    ...walkFiles(path.join(rootPublic, 'videos'), rootPublic),
  ];

  if (files.length === 0) {
    console.error('Aucun fichier trouve dans public/images ou public/videos.');
    process.exit(1);
  }

  const totalMB = (files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2);
  console.log(`Envoi de ${files.length} fichiers (${totalMB} Mo) vers ${ENDPOINT}/${BUCKET}...`);

  let done = 0;
  let failed = 0;
  const concurrency = 8;
  let cursor = 0;

  async function worker() {
    while (cursor < files.length) {
      const item = files[cursor++];
      try {
        await uploadFile(item.fullPath, item.key);
        done++;
        if (done % 50 === 0 || done === files.length) {
          console.log(`Progression : ${done}/${files.length} fichiers envoyes`);
        }
      } catch (err) {
        failed++;
        console.error(`ECHEC ${item.key}:`, err.message);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  if (failed > 0) {
    console.error(`Termine avec ${failed} erreur(s).`);
    process.exit(1);
  }

  console.log(`Succes : ${done} fichiers (${totalMB} Mo) envoyes sur R2.`);

  if (PUBLIC_URL) {
    const probeUrl = `${PUBLIC_URL}/images/magatte-portrait.webp`;
    const probe = await fetch(probeUrl);
    console.log(`Verification URL publique (${probeUrl}) -> HTTP ${probe.status}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
