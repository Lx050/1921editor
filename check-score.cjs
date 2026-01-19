const fs = require('fs');
if (fs.existsSync('./lh-quickfix.json')) {
  const data = JSON.parse(fs.readFileSync('./lh-quickfix.json', 'utf8'));
  console.log('=== 快速修复后分数 ===');
  console.log('Performance:', data.categories.performance.score * 100);
  console.log('Accessibility:', data.categories.accessibility.score * 100);
  console.log('Best Practices:', data.categories['best-practices'].score * 100);
  console.log('SEO:', data.categories.seo.score * 100);
  console.log('');
  console.log('=== 性能详情 ===');
  console.log('LCP:', data.audits['largest-contentful-paint'].displayValue);
  console.log('Speed Index:', data.audits['speed-index'].displayValue);
  console.log('Total Blocking Time:', data.audits['total-blocking-time'].displayValue);
} else {
  console.log('File not found - waiting for lighthouse to complete...');
}
