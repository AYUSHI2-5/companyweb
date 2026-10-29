import fs from 'node:fs';

const emptyMainBlock = `  <!-- Main Content Container -->
  <main class="site-main page-main">
    <!-- Live Animated Technology Atmosphere Backdrop -->
    <div class="page-bg-decor" aria-hidden="true">
    </div>
    <div class="page-container">
    </div>
  </main>`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <main ...> ... </main>
  const mainRegex = /<!-- Main Content Container[\s\S]*?<\/main>/;
  if (!mainRegex.test(content)) {
    // Try matching <main class="site-main page-main">[\s\S]*?<\/main>
    const fallbackRegex = /<main class="site-main page-main">[\s\S]*?<\/main>/;
    if (fallbackRegex.test(content)) {
      content = content.replace(fallbackRegex, emptyMainBlock);
      console.log('Replaced with fallback regex in', filePath);
    } else {
      console.error('Could not find main tag in', filePath);
      return;
    }
  } else {
    content = content.replace(mainRegex, emptyMainBlock);
    console.log('Replaced with mainRegex in', filePath);
  }

  // Ensure tech-background.js script is included
  if (!content.includes('tech-background.js')) {
    content = content.replace('</body>', '  <script src="tech-background.js" defer></script>\n</body>');
    console.log('Added tech-background.js to', filePath);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

processFile('c:\\Users\\Admin\\Desktop\\Baadam.com\\services.html');
processFile('c:\\Users\\Admin\\Desktop\\Baadam.com\\portfolio.html');
console.log('Finished updating services.html and portfolio.html');
