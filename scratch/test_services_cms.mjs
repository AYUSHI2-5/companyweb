async function test() {
  console.log('Testing Public API...');
  const pubRes = await fetch('http://127.0.0.1:8080/api/services-page/published');
  console.log('Public status:', pubRes.status);
  const pubData = await pubRes.json();
  console.log('Published services count:', pubData.published?.services?.length);

  console.log('Testing Admin Login & Protected API...');
  const loginRes = await fetch('http://127.0.0.1:8080/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
  });
  const cookie = loginRes.headers.get('set-cookie');
  const adminRes = await fetch('http://127.0.0.1:8080/api/admin/services-page', {
    headers: { 'Cookie': cookie.split(';')[0] }
  });
  console.log('Admin API status:', adminRes.status);
  const adminData = await adminRes.json();
  console.log('Admin draft services count:', adminData.draft?.services?.length);

  console.log('Testing /admin/services route...');
  const routeRes = await fetch('http://127.0.0.1:8080/admin/services', {
    headers: { 'Cookie': cookie.split(';')[0] }
  });
  console.log('Route /admin/services status:', routeRes.status);
  const html = await routeRes.text();
  console.log('Contains Services Management:', html.includes('Services Page Management'));
}

test().catch(console.error);
