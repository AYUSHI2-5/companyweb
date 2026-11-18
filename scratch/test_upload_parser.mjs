import fs from 'fs';

// Helper to extract image dimensions from buffers without external libraries
function getImageDimensions(buffer, ext) {
  try {
    ext = ext.toLowerCase().replace('.', '');
    
    // PNG: bytes 16-23 are Width (4 bytes) and Height (4 bytes) in big-endian
    if (ext === 'png' && buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }

    // GIF: bytes 6-9 are Width (2 bytes) and Height (2 bytes) in little-endian
    if (ext === 'gif' && buffer.length >= 10 && buffer.toString('ascii', 0, 3) === 'GIF') {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height };
    }

    // JPEG: scan for SOF0/SOF2 marker (0xFF, 0xC0 or 0xC2)
    if ((ext === 'jpg' || ext === 'jpeg') && buffer.length >= 4 && buffer[0] === 0xFF && buffer[1] === 0xD8) {
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xFF) {
          offset++;
          continue;
        }
        const marker = buffer[offset + 1];
        // SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2)
        if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    }

    // SVG: parse XML width and height or viewBox
    if (ext === 'svg') {
      const str = buffer.toString('utf8', 0, Math.min(buffer.length, 2048));
      const vbMatch = str.match(/viewBox=["']\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*["']/i);
      if (vbMatch) {
        return { width: Math.round(parseFloat(vbMatch[3])), height: Math.round(parseFloat(vbMatch[4])) };
      }
      const wMatch = str.match(/width=["']([0-9.]+)(?:px)?["']/i);
      const hMatch = str.match(/height=["']([0-9.]+)(?:px)?["']/i);
      if (wMatch && hMatch) {
        return { width: Math.round(parseFloat(wMatch[1])), height: Math.round(parseFloat(hMatch[1])) };
      }
    }

    // WebP: VP8 / VP8L / VP8X
    if (ext === 'webp' && buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      const type = buffer.toString('ascii', 12, 16);
      if (type === 'VP8X') {
        const width = 1 + buffer.readUIntLE(24, 3);
        const height = 1 + buffer.readUIntLE(27, 3);
        return { width, height };
      } else if (type === 'VP8L') {
        const b0 = buffer[21];
        const b1 = buffer[22];
        const b2 = buffer[23];
        const b3 = buffer[24];
        const width = 1 + (((b1 & 0x3F) << 8) | b0);
        const height = 1 + (((b3 & 0xF) << 10) | (b2 << 2) | ((b1 & 0xC0) >> 6));
        return { width, height };
      }
    }
  } catch (e) {
    // Ignore dimension parsing errors gracefully
  }
  return { width: 0, height: 0 };
}

// Test against some existing assets
const testJpg = fs.readFileSync('assets/about-digital-solutions.jpg');
console.log('about-digital-solutions.jpg dims:', getImageDimensions(testJpg, 'jpg'));

const testPng = fs.readFileSync('assets/about-office-showcase.png');
console.log('about-office-showcase.png dims:', getImageDimensions(testPng, 'png'));

if (fs.existsSync('assets/baadam-logo.png')) {
  const logo = fs.readFileSync('assets/baadam-logo.png');
  console.log('baadam-logo.png dims:', getImageDimensions(logo, 'png'));
}

