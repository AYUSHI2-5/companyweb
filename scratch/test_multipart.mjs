// Multipart Form-Data parser for Node.js Buffers
export function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from('--' + boundary);
  let start = 0;

  while ((start = buffer.indexOf(boundaryBuffer, start)) !== -1) {
    start += boundaryBuffer.length;
    // Check if end boundary
    if (buffer.slice(start, start + 2).toString() === '--') {
      break;
    }
    // Skip CRLF
    if (buffer.slice(start, start + 2).toString() === '\r\n') {
      start += 2;
    }

    const headerEnd = buffer.indexOf(Buffer.from('\r\n\r\n'), start);
    if (headerEnd === -1) break;

    const headerText = buffer.slice(start, headerEnd).toString('utf8');
    const bodyStart = headerEnd + 4;
    const nextBoundary = buffer.indexOf(boundaryBuffer, bodyStart);
    if (nextBoundary === -1) break;

    // Body ends 2 bytes before next boundary (\r\n)
    let bodyEnd = nextBoundary;
    if (buffer.slice(bodyEnd - 2, bodyEnd).toString() === '\r\n') {
      bodyEnd -= 2;
    }

    const partBuffer = buffer.slice(bodyStart, bodyEnd);

    // Parse headers
    const headers = {};
    headerText.split('\r\n').forEach(line => {
      const col = line.indexOf(':');
      if (col !== -1) {
        const key = line.slice(0, col).trim().toLowerCase();
        const val = line.slice(col + 1).trim();
        headers[key] = val;
      }
    });

    const disposition = headers['content-disposition'] || '';
    const nameMatch = disposition.match(/name=["']([^"']+)["']/i);
    const filenameMatch = disposition.match(/filename=["']([^"']+)["']/i);
    const contentType = headers['content-type'] || 'application/octet-stream';

    parts.push({
      name: nameMatch ? nameMatch[1] : '',
      filename: filenameMatch ? filenameMatch[1] : null,
      contentType,
      data: partBuffer
    });

    start = nextBoundary;
  }

  return parts;
}

// Test with simulated multipart data
const boundary = '----WebKitFormBoundaryXyZ123';
const simulated = Buffer.concat([
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="alt"\r\n\r\nSample Alt Text\r\n`),
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test_pic.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
  Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46]), // JPEG header
  Buffer.from(`\r\n--${boundary}--\r\n`)
]);

const parsed = parseMultipart(simulated, boundary);
console.log('Parsed parts count:', parsed.length);
console.log('Field 1:', parsed[0].name, '=', parsed[0].data.toString());
console.log('Field 2:', parsed[1].name, 'filename=', parsed[1].filename, 'contentType=', parsed[1].contentType, 'length=', parsed[1].data.length);

