import fs from 'fs';

// 1. Log in to get auth token
const loginRes = await fetch('http://localhost:8080/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
});
const loginData = await loginRes.json();
console.log('Login success:', loginData.success, 'Token:', loginData.token);
const token = loginData.token;

// 2. Test uploading a WebP picture via FormData (multipart)
const webpBuffer = Buffer.from('RIFF\x24\x00\x00\x00WEBPVP8X\x0a\x00\x00\x00\x00\x00\x00\x00\x63\x00\x00\x63\x00\x00', 'binary'); // 100x100 webp header
const blob = new Blob([webpBuffer], { type: 'image/webp' });
const formData = new FormData();
formData.append('files', blob, 'sample-test.webp');
formData.append('alt', 'Sample Test WebP Picture');

const uploadRes1 = await fetch('http://localhost:8080/api/admin/media/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
const uploadData1 = await uploadRes1.json();
console.log('Upload multipart webp result:', JSON.stringify(uploadData1, null, 2));

// 3. Test uploading a GIF picture via JSON Base64
const gifBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1x1 transparent GIF
const uploadRes2 = await fetch('http://localhost:8080/api/admin/media/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    files: [
      {
        name: 'pixel-test.gif',
        data: `data:image/gif;base64,${gifBase64}`,
        alt: 'Pixel Test GIF Picture'
      }
    ]
  })
});
const uploadData2 = await uploadRes2.json();
console.log('Upload JSON Base64 gif result:', JSON.stringify(uploadData2, null, 2));

// 4. Test validation rejecting a non-picture file (e.g. .txt or .pdf)
const badBlob = new Blob(['This is not a picture.'], { type: 'text/plain' });
const badFormData = new FormData();
badFormData.append('files', badBlob, 'document.pdf');

const uploadRes3 = await fetch('http://localhost:8080/api/admin/media/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: badFormData
});
const uploadData3 = await uploadRes3.json();
console.log('Validation rejection for non-picture (status ' + uploadRes3.status + '):', JSON.stringify(uploadData3, null, 2));

