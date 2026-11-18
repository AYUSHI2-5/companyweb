import http from 'http';

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function test() {
  console.log('1. Testing public homepage SSR...');
  const hpRes = await request({
    host: 'localhost',
    port: 8080,
    path: '/',
    method: 'GET'
  });
  console.log('Homepage status:', hpRes.status, 'HTML length:', hpRes.body.length);
  console.log('Contains hero title:', hpRes.body.includes('hero-lens-headline'));
  console.log('Contains radar section:', hpRes.body.includes('radar-headline'));
  console.log('Contains 6 services:', hpRes.body.includes('service-acc-white') && hpRes.body.includes('acc-body-6'));

  console.log('\n2. Testing login...');
  const loginRes = await request({
    host: 'localhost',
    port: 8080,
    path: '/api/admin/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ username: 'admin', password: 'Baadam@2026' }));

  console.log('Login status:', loginRes.status);
  const loginData = JSON.parse(loginRes.body);
  console.log('Login success:', loginData.success, 'Token prefix:', loginData.token?.substring(0, 8));

  const authHeader = {
    'Authorization': 'Bearer ' + loginData.token,
    'Cookie': `admin_session=${loginData.token}`
  };

  console.log('\n3. Testing GET /api/admin/homepage...');
  const adminMeta = await request({
    host: 'localhost',
    port: 8080,
    path: '/api/admin/homepage',
    method: 'GET',
    headers: authHeader
  });
  console.log('Admin homepage meta status:', adminMeta.status);
  const metaObj = JSON.parse(adminMeta.body);
  console.log('Section status count:', Object.keys(metaObj.section_status || {}).length);

  console.log('\n4. Testing GET /admin/homepage/index.html...');
  const adminPage = await request({
    host: 'localhost',
    port: 8080,
    path: '/admin/homepage/index.html',
    method: 'GET',
    headers: authHeader
  });
  console.log('Admin page status:', adminPage.status, 'Page length:', adminPage.body.length);
  console.log('Contains tab 01 (header):', adminPage.body.includes('panel-header'));
  console.log('Contains tab 03 (radar):', adminPage.body.includes('panel-radar'));
  console.log('Contains tab 04 (services):', adminPage.body.includes('panel-services'));
  console.log('Contains tab 09 (footer):', adminPage.body.includes('panel-footer'));
  console.log('Contains tab 10 (overview):', adminPage.body.includes('panel-overview'));
}

test().catch(console.error);
