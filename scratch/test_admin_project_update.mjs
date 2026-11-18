async function testProjectLiveUpdate() {
  console.log('1. Logging in as admin...');
  const loginRes = await fetch('http://127.0.0.1:8080/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Baadam@2026' })
  });
  const cookie = loginRes.headers.get('set-cookie');
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('Logged in successfully. Token:', Boolean(token));

  // Get current project
  const curRes = await fetch('http://127.0.0.1:8080/api/projects/kp-e-services');
  const originalProj = await curRes.json();
  const originalDays = originalProj.service_duration_days || 90;
  console.log('Original service duration:', originalDays);

  // Update duration to 125 days
  console.log('2. Updating service_duration_days to 125 in Admin API...');
  const updateRes = await fetch('http://127.0.0.1:8080/api/projects/kp-e-services', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie ? cookie.split(';')[0] : '',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      service_duration_days: 125
    })
  });
  console.log('Update status:', updateRes.status);
  const updatedProj = await updateRes.json();
  console.log('Updated proj duration in response:', updatedProj.service_duration_days);

  // Fetch live page
  console.log('3. Fetching live public page http://127.0.0.1:8080/projects/kp-e-services/...');
  const pageRes = await fetch('http://127.0.0.1:8080/projects/kp-e-services/', {
    headers: { 'Cache-Control': 'no-cache' }
  });
  const pageHtml = await pageRes.text();
  const has125Days = pageHtml.includes('125 Days');
  console.log('Does live page immediately reflect 125 Days?', has125Days);

  // Revert back to original
  console.log('4. Reverting back to original days:', originalDays);
  await fetch('http://127.0.0.1:8080/api/projects/kp-e-services', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie ? cookie.split(';')[0] : '',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      service_duration_days: originalDays
    })
  });

  const revertPageRes = await fetch('http://127.0.0.1:8080/projects/kp-e-services/');
  const revertHtml = await revertPageRes.text();
  console.log(`Does live page reflect restored ${originalDays} Days?`, revertHtml.includes(`${originalDays} Days`));

  if (has125Days) {
    console.log('\n SUCCESS: Admin updates are immediately and dynamically reflected on the live project detail page!');
  } else {
    throw new Error('FAIL: Live page did not reflect admin update.');
  }
}

testProjectLiveUpdate().catch(err => {
  console.error(err);
  process.exit(1);
});

