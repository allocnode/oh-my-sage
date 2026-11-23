// 从 public/icons/icon.svg 生成 PWA 图标 PNG：node scripts/generate-icons.mjs
import sharp from 'sharp';
import {mkdir, readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = join(root, 'public', 'icons');
await mkdir(iconsDir, {recursive: true});

const svg = await readFile(join(iconsDir, 'icon.svg'));

const targets = [
    ['icon-192.png', 192],
    ['icon-512.png', 512],
    ['apple-touch-icon.png', 180],
];

for (const [name, size] of targets) {
    await sharp(svg).resize(size, size).png().toFile(join(iconsDir, name));
    console.log('generated', name, size);
}
