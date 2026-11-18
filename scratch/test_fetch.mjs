import http from 'http';

http.get('http://127.0.0.1:8080/api/services-page/published', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    const data = JSON.parse(body);
    console.log('Published services count:', data.published?.services?.length);
    console.log('Services:', data.published?.services?.map(s => s.num + ' - ' + s.title.replace('\n', ' ')));
  });
}).on('error', (e) => console.error('Fetch error:', e));

