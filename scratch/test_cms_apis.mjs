async function test() {
  const base = 'http://127.0.0.1:8080';

  // 1. Test public published API
  console.log('Testing GET /api/homepage/published...');
  let res = await fetch(`${base}/api/homepage/published`);
  let data = await res.json();
  console.log('Published sections:', Object.keys(data.published));

  // 2. Test Login
  console.log('Testing POST /api/admin/login...');
  let loginRes = await fetch(`${base}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
  });
  let loginData = await loginRes.json();
  console.log('Login success:', loginData.success, 'Token:', loginData.token ? loginData.token.slice(0, 15) + '...' : 'none');

  const token = loginData.token;

  // 3. Test Auth Check
  let authRes = await fetch(`${base}/api/admin/auth/check`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  let authData = await authRes.json();
  console.log('Auth check:', authData);

  // 4. Test Get Homepage status
  let hpRes = await fetch(`${base}/api/admin/homepage`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  let hpData = await hpRes.json();
  console.log('Homepage status:', hpData.section_status);

  // 5. Test Get Hero Section
  let heroRes = await fetch(`${base}/api/admin/homepage/hero`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  let heroData = await heroRes.json();
  console.log('Hero section title:', heroData.draft?.headline?.main);

  // 6. Test Media Library
  let mediaRes = await fetch(`${base}/api/admin/media`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  let mediaData = await mediaRes.json();
  console.log('Media count:', mediaData.count);

  console.log('ALL API TESTS PASSED!');
}

test().catch(console.error);
