/**
 * Gera ícones PWA a partir de public/imagens/logo.jpg (identidade original).
 * Uso: node scripts/generate-pwa-icons.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOGO = path.join(ROOT, 'public', 'imagens', 'logo.jpg');
const OUT = path.join(ROOT, 'public', 'icons');
const BG = '#0D0618';

if (!fs.existsSync(LOGO)) {
  console.error('Logo não encontrado:', LOGO);
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

async function iconSquare(size, outName, logoScale = 0.82) {
  const logoSize = Math.round(size * logoScale);
  const logo = await sharp(LOGO)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG
    }
  })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toFile(path.join(OUT, outName));

  console.log('ok', outName);
}

/** Maskable: logo ~60% do canvas (área segura Android). */
async function iconMaskable(size, outName) {
  const logoSize = Math.round(size * 0.58);
  const logo = await sharp(LOGO)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG
    }
  })
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toFile(path.join(OUT, outName));

  console.log('ok', outName, '(maskable)');
}

await iconSquare(192, 'icon-192.png');
await iconSquare(512, 'icon-512.png');
await iconSquare(180, 'apple-touch-icon.png');
await iconMaskable(512, 'icon-512-maskable.png');
console.log('Ícones PWA gerados em public/icons/');
