const fs = require('fs');
if (fs.existsSync('./lh-final.json')) {
  const data = JSON.parse(fs.readFileSync('./lh-final.json', 'utf8'));
  console.log('Performance:', data.categories.performance.score * 100);
  console.log('Accessibility:', data.categories.accessibility.score * 100);
  console.log('Best Practices:', data.categories['best-practices'].score * 100);
  console.log('SEO:', data.categories.seo.score * 100);
} else {
  console.log('File not found');
}
