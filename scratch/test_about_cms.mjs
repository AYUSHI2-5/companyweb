import http from 'http';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing GET /api/about-page/published ---');
  const res1 = await request('http://127.0.0.1:8080/api/about-page/published');
  console.log('Status:', res1.status);
  console.log('Cache-Control:', res1.headers['cache-control']);
  const data1 = JSON.parse(res1.body);
  console.log('Published hero heading:', data1.published?.hero?.heading);
  console.log('Published team members count:', data1.published?.team?.members?.length);

  console.log('\n--- 2. Testing GET /api/admin/about-page ---');
  const token = 'adm_test_token_about';
  const res2 = await request('http://127.0.0.1:8080/api/admin/about-page', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Status:', res2.status);
  const data2 = JSON.parse(res2.body);
  console.log('Admin draft/pub status:', data2.status, 'version:', data2.version);

  console.log('\n--- 3. Testing GET /about.html ---');
  const res3 = await request('http://127.0.0.1:8080/about.html');
  console.log('Status:', res3.status);
  console.log('Cache-Control:', res3.headers['cache-control']);
  console.log('Contains about-page-cms.js?:', res3.body.includes('about-page-cms.js'));
  console.log('Contains team member M K Parmar?:', res3.body.includes('M K Parmar'));

  console.log('\n--- 4. Testing GET /admin/about.html ---');
  const res4 = await request('http://127.0.0.1:8080/admin/about.html', {
    headers: { 'Cookie': `admin_session=${token}` }
  });
  console.log('Admin page status:', res4.status);
  console.log('Contains section tabs?:', res4.body.includes('hp-tab-bar') && res4.body.includes('01. Hero Section'));
}

run().catch(console.error);
