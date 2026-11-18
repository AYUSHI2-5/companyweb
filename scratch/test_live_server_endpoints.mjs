import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing /projects/kp-e-services/...');
  const res1 = await get('http://localhost:8080/projects/kp-e-services/');
  console.log('Status 1:', res1.status);
  console.log('Contains Title KP E-Services:', res1.data.includes('KP E-Services'));
  console.log('Contains FinTech & Loan Operations:', res1.data.includes('FinTech & Loan Operations'));
  console.log('Contains Manage in Admin:', res1.data.includes('Manage in Admin'));
  console.log('Contains Visit Live Project:', res1.data.includes('Visit Live Project'));
  console.log('Contains Lightbox modal:', res1.data.includes('lightbox-modal'));

  console.log('\nTesting /projects/dodani-erp/...');
  const res2 = await get('http://localhost:8080/projects/dodani-erp/');
  console.log('Status 2:', res2.status);
  console.log('Contains Title Dodani ERP:', res2.data.includes('Dodani ERP'));
  console.log('Contains Category Enterprise Logistics:', res2.data.includes('Enterprise Logistics & Supply Chain'));

  console.log('\nTesting /project-detail.html?slug=kp-e-services...');
  const res3 = await get('http://localhost:8080/project-detail.html?slug=kp-e-services');
  console.log('Status 3:', res3.status);
  console.log('Contains KP E-Services in project-detail.html:', res3.data.includes('KP E-Services'));

  console.log('\nTesting API /api/projects/kp-e-services...');
  const res4 = await get('http://localhost:8080/api/projects/kp-e-services');
  console.log('Status 4:', res4.status);
  const proj = JSON.parse(res4.data);
  console.log('API Project Title:', proj.title);
  console.log('API Project Category:', proj.category);
  console.log('API Images count:', proj.images.length);
}

run().catch(console.error);

