import http from 'http';

http.get('http://localhost:3000/about.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const hasMain = data.includes('<main class="site-main page-main">');
    const hasHeader = data.includes('<header class="site-header">');
    const hasFooter = data.includes('<footer class="site-footer"');
    const hasOldHeading = data.includes('Empowering Businesses');
    console.log({ hasMain, hasHeader, hasFooter, hasOldHeading });
  });
}).on('error', err => console.error(err));
