import fs from 'fs';
import path from 'path';

const ALLOWED_IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'avif', 'bmp', 'ico', 'tiff', 'tif', 'heic']);

function validatePicture(filename, buffer) {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'Empty file' };
  }
  if (buffer.length > 50 * 1024 * 1024) {
    return { valid: false, error: 'File exceeds 50MB limit' };
  }
  const ext = (path.extname(filename || '') || '').toLowerCase().replace('.', '');
  if (!ext || !ALLOWED_IMAGE_EXTS.has(ext)) {
    return { valid: false, error: `Invalid format .${ext}. Only picture files are allowed (JPG, PNG, WebP, SVG, GIF, AVIF, BMP, ICO, TIFF).` };
  }
  return { valid: true, ext };
}

console.log('Testing .png:', validatePicture('sample.png', Buffer.from([1, 2, 3])));
console.log('Testing .pdf:', validatePicture('sample.pdf', Buffer.from([1, 2, 3])));
console.log('Testing .webp:', validatePicture('banner.webp', Buffer.from([1, 2, 3])));
console.log('Testing .gif:', validatePicture('anim.gif', Buffer.from([1, 2, 3])));
console.log('Testing .svg:', validatePicture('icon.svg', Buffer.from([1, 2, 3])));
console.log('Testing .exe:', validatePicture('virus.exe', Buffer.from([1, 2, 3])));

