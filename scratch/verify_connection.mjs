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

async function runTest() {
  console.log('--- Step 1: Checking /services.html ---');
  const res1 = await request('http://127.0.0.1:8080/services.html');
  console.log('HTML status:', res1.status);
  console.log('HTML Cache-Control:', res1.headers['cache-control']);
  console.log('Initial cards count in HTML:', (res1.body.match(/class="service-showcase-card/g) || []).length);

  const token = 'adm_test_token_123';

  console.log('\n--- Step 2: Fetching Current Services via Admin API ---');
  const curRes = await request('http://127.0.0.1:8080/api/admin/services-page', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('API status:', curRes.status);
  const curData = JSON.parse(curRes.body);
  const spData = curData.draft || curData.published;
  console.log('Current services count in DB:', spData.services.length);

  // Add a 7th service card
  if (!spData.services.some(s => s.id === 'srv-ai-solutions')) {
    spData.services.push({
      id: 'srv-ai-solutions',
      num: '07',
      title: 'AI & Machine\nLearning',
      display_title: 'AI & Machine Learning',
      category_id: 'cat-software',
      category_name: 'Software Engineering',
      short_desc: 'Custom generative AI pipelines, predictive ML models, intelligent document processing, and enterprise LLM agents.',
      full_desc: 'Scale your business automation with state-of-the-art machine learning models.',
      icon_type: 'preset',
      icon_preset: 'code',
      icon_color: '#eb163c',
      button_label: 'Explore AI Tech',
      button_url: 'services/ai-solutions/',
      button_visible: true,
      button_target_blank: false,
      active: true,
      featured: true
    });
  }

  // Save Draft
  const saveRes = await request('http://127.0.0.1:8080/api/admin/services-page', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(spData)
  });
  console.log('Saved draft:', JSON.parse(saveRes.body).success);

  // Publish Live
  const pubRes = await request('http://127.0.0.1:8080/api/admin/services-page/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  console.log('Published live:', JSON.parse(pubRes.body).success);

  console.log('\n--- Step 3: Verify /services.html immediately ---');
  const resFinal = await request('http://127.0.0.1:8080/services.html');
  const cardCount = (resFinal.body.match(/class="service-showcase-card/g) || []).length;
  console.log('HTML status:', resFinal.status);
  console.log('Contains AI & Machine Learning card in HTML?:', resFinal.body.includes('AI &amp; Machine<br>Learning') || resFinal.body.includes('AI & Machine'));
  console.log('Total cards now in /services.html:', cardCount);
}

runTest().catch(console.error);
