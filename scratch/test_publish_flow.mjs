async function test() {
  // 1. Login
  const loginRes = await fetch('http://127.0.0.1:8080/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
  });
  const cookie = loginRes.headers.get('set-cookie');

  // 2. Fetch current draft
  const getRes = await fetch('http://127.0.0.1:8080/api/admin/services-page', {
    headers: { 'Cookie': cookie.split(';')[0] }
  });
  const data = await getRes.json();
  console.log('Current version:', data.version, 'Status:', data.status);

  // 3. Update Draft (change subtitle test)
  const draft = data.draft;
  draft.header.subtitle_line1 = 'We develop websites, mobile apps, enterprise software and 3D games with top-tier performance.';

  const putRes = await fetch('http://127.0.0.1:8080/api/admin/services-page', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie.split(';')[0]
    },
    body: JSON.stringify(draft)
  });
  const putData = await putRes.json();
  console.log('Draft save result status:', putData.status);

  // 4. Publish
  const pubRes = await fetch('http://127.0.0.1:8080/api/admin/services-page/publish', {
    method: 'POST',
    headers: { 'Cookie': cookie.split(';')[0] }
  });
  const pubData = await pubRes.json();
  console.log('Publish result:', pubData.success, 'New version:', pubData.version);

  // 5. Verify public API has the published changes
  const publicRes = await fetch('http://127.0.0.1:8080/api/services-page/published');
  const publicData = await publicRes.json();
  console.log('Public API updated line 1:', publicData.published.header.subtitle_line1);
}

test().catch(console.error);
