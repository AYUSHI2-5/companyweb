async function test() {
  const loginRes = await fetch('http://127.0.0.1:8080/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
  });
  console.log('Login status:', loginRes.status);
  const cookie = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie:', cookie);
  const data = await loginRes.json();
  console.log('Login response:', data);

  const checkRes = await fetch('http://127.0.0.1:8080/api/admin/auth/check', {
    headers: { 'Cookie': cookie.split(';')[0] }
  });
  console.log('Check status:', checkRes.status);
  const checkData = await checkRes.json();
  console.log('Check response:', checkData);
}

test().catch(console.error);
