import http from 'http';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data
        });
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing Unauthenticated Route Guard ---');
  const unauthRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/admin/dashboard.html',
    method: 'GET'
  });
  console.log('Unauthenticated /admin/dashboard.html status:', unauthRes.statusCode, 'Location:', unauthRes.headers.location);
  if (unauthRes.statusCode !== 302 || !unauthRes.headers.location?.includes('/admin/login')) {
    throw new Error('Expected 302 redirect to login for unauthenticated access');
  }

  console.log('\n--- 2. Testing Login Endpoint ---');
  const loginPayload = JSON.stringify({ username: 'admin', password: 'Baadam@2026' });
  const loginRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/admin/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginPayload)
    }
  }, loginPayload);

  console.log('Login status:', loginRes.statusCode, 'Body:', loginRes.data);
  const setCookie = loginRes.headers['set-cookie'];
  if (!setCookie) throw new Error('Set-Cookie header missing in login response');
  const sessionCookie = setCookie[0].split(';')[0];
  console.log('Obtained session cookie:', sessionCookie);

  console.log('\n--- 3. Testing Authenticated Admin Pages ---');
  const routes = [
    '/admin/dashboard.html',
    '/admin/homepage/index.html',
    '/admin/homepage/header.html',
    '/admin/homepage/hero.html',
    '/admin/homepage/services.html',
    '/admin/homepage/featured-work.html',
    '/admin/homepage/case-studies.html',
    '/admin/homepage/how-we-work.html',
    '/admin/homepage/next-steps.html',
    '/admin/media.html'
  ];

  for (const r of routes) {
    const pageRes = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: r,
      method: 'GET',
      headers: { 'Cookie': sessionCookie }
    });
    console.log(`Page ${r} -> status: ${pageRes.statusCode}, size: ${pageRes.data.length}`);
    if (pageRes.statusCode !== 200) {
      throw new Error(`Failed to load ${r}, got status ${pageRes.statusCode}`);
    }
  }

  console.log('\n--- 4. Testing Draft vs. Published Isolation ---');
  // Read current published hero
  const pubBefore = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/homepage/published',
    method: 'GET'
  });
  const pubDataParsed = JSON.parse(pubBefore.data);
  const pubConfig = pubDataParsed.published || pubDataParsed;
  const pubHeroBefore = pubConfig.hero?.main_headline || pubConfig.hero?.headline?.main || 'Initial Headline';
  console.log('Initial published hero headline:', pubHeroBefore);

  // Put new draft headline
  const draftHeroData = JSON.stringify({
    main_headline: 'Bespoke Enterprise Software & Scalable Digital Architecture',
    highlighted_headline: 'Scalable Digital Architecture',
    description: 'Updated draft description for testing isolation.'
  });

  const putDraftRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/admin/homepage/hero',
    method: 'PUT',
    headers: {
      'Cookie': sessionCookie,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(draftHeroData)
    }
  }, draftHeroData);
  console.log('PUT Draft response:', putDraftRes.statusCode, putDraftRes.data);

  // Check public endpoint - MUST NOT reflect draft
  const pubCheck = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/homepage/published',
    method: 'GET'
  });
  const pubCheckParsed = JSON.parse(pubCheck.data);
  const pubCheckConfig = pubCheckParsed.published || pubCheckParsed;
  const pubHeroCheck = pubCheckConfig.hero?.main_headline || pubCheckConfig.hero?.headline?.main;
  console.log('Public headline after draft save:', pubHeroCheck);
  if (pubHeroCheck !== pubHeroBefore) {
    throw new Error('Draft change leaked into published endpoint before publishing!');
  }
  console.log('CONFIRMED: Draft changes are strictly isolated from the live public site.');

  console.log('\n--- 5. Testing Publish Section Live ---');
  const pubActionRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/admin/homepage/hero/publish',
    method: 'POST',
    headers: { 'Cookie': sessionCookie }
  });
  console.log('Publish action response:', pubActionRes.statusCode, pubActionRes.data);

  // Now verify public endpoint HAS updated immediately
  const pubAfter = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/homepage/published',
    method: 'GET'
  });
  const pubAfterParsed = JSON.parse(pubAfter.data);
  const pubAfterConfig = pubAfterParsed.published || pubAfterParsed;
  const pubHeroAfter = pubAfterConfig.hero?.main_headline || pubAfterConfig.hero?.headline?.main;
  console.log('Public headline after publish:', pubHeroAfter);
  if (pubHeroAfter !== 'Bespoke Enterprise Software & Scalable Digital Architecture') {
    throw new Error('Public endpoint did not reflect published change');
  }
  console.log('CONFIRMED: Live website updated immediately upon publish without redeployment!');

  console.log('\n--- 6. Testing Media API ---');
  const mediaRes = await makeRequest({
    hostname: 'localhost',
    port: 8080,
    path: '/api/admin/media',
    method: 'GET',
    headers: { 'Cookie': sessionCookie }
  });
  const mediaList = JSON.parse(mediaRes.data);
  console.log(`Media Library contains ${mediaList.items.length} indexed items.`);

  console.log('\nALL E2E CMS TESTS PASSED SUCCESSFULLY! 🚀');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
