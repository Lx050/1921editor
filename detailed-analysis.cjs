const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./lh-result.json', 'utf8'));

console.log('=== 详细问题分析 ===\n');

// LCP details
const lcpAudit = data.audits['largest-contentful-paint'];
console.log('[LCP] Largest Contentful Paint');
console.log(`  当前值: ${lcpAudit.displayValue}`);
console.log(`  目标: < 2.5s`);
if (lcpAudit.details && lcpAudit.details.items) {
  console.log(`  LCP 元素: ${JSON.stringify(lcpAudit.details.items[0] || {}, null, 2)}`);
}

// Speed Index details
const siAudit = data.audits['speed-index'];
console.log(`\n[Speed Index]`);
console.log(`  当前值: ${siAudit.displayValue}`);
console.log(`  目标: < 3.4s`);

// Resource summary
console.log('\n=== 资源概览 ===\n');
const rsAudit = data.audits['resource-summary'];
if (rsAudit.details && rsAudit.details.items) {
  for (const item of rsAudit.details.items) {
    console.log(`${item.label}: ${item.transferSize} bytes (${item.resourceCount} resources)`);
  }
}

// Unused JavaScript
const unusedJs = data.audits['unused-javascript'];
console.log(`\n=== 未使用的 JavaScript ===\n`);
console.log(`  浪费: ${unusedJs.displayValue}`);
if (unusedJs.details && unusedJs.details.items) {
  console.log('  主要来源:');
  for (const item of unusedJs.details.items.slice(0, 5)) {
    console.log(`    - ${item.url}: ${item.wastedBytes} bytes`);
  }
}

// Unused CSS
const unusedCss = data.audits['unused-css-rules'];
console.log(`\n=== 未使用的 CSS ===\n`);
console.log(`  浪费: ${unusedCss.displayValue}`);

// Render-blocking resources
const blocking = data.audits['render-blocking-resources'];
console.log(`\n=== 渲染阻塞资源 ===\n`);
if (blocking.details && blocking.details.items) {
  for (const item of blocking.details.items) {
    console.log(`  ${item.url}: ${item.totalBytes} bytes`);
  }
}

// Accessibility details
console.log('\n=== 可访问性详情 ===\n');

// Button name
const btnName = data.audits['button-name'];
console.log('[Buttons without accessible name]');
if (btnName.details && btnName.details.items) {
  for (const item of btnName.details.items.slice(0, 3)) {
    console.log(`  ${item.node}`);
  }
}

// Color contrast
const contrast = data.audits['color-contrast'];
console.log('\n[Color contrast issues]');
if (contrast.details && contrast.details.items) {
  for (const item of contrast.details.items.slice(0, 3)) {
    console.log(`  ${item.node} - contrast: ${item.contrastRatio}`);
  }
}

// Select name
const selectName = data.audits['select-name'];
console.log('\n[Select elements without labels]');
if (selectName.details && selectName.details.items) {
  for (const item of selectName.details.items.slice(0, 3)) {
    console.log(`  ${item.node}`);
  }
}
