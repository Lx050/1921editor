const { spawn } = require('child_process');
const fs = require('fs');

console.log('Running Lighthouse...');

const child = spawn('npx', ['lighthouse', 'http://localhost:1921', '--output=json', '--output-path=./lh-result.json', '--chrome-flags="--headless --no-sandbox"', '--quiet'], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log('Lighthouse exited with code:', code);
  if (fs.existsSync('./lh-result.json')) {
    const data = JSON.parse(fs.readFileSync('./lh-result.json', 'utf8'));
    console.log('Scores:');
    console.log('- Performance:', data.categories.performance.score * 100);
    console.log('- Accessibility:', data.categories.accessibility.score * 100);
    console.log('- Best Practices:', data.categories['best-practices'].score * 100);
    console.log('- SEO:', data.categories.seo.score * 100);
  }
});
