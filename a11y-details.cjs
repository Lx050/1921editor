const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./lh-result.json', 'utf8'));

console.log('=== 可访问性详情分析 ===\n');

// Helper function to safely extract node info
function getNodeInfo(item) {
  if (item.node) {
    const node = item.node;
    if (node.selector) return node.selector;
    if (node.snippet) return node.snippet;
    if (node.html) return node.html.substring(0, 100);
  }
  if (item.selector) return item.selector;
  if (item.snippet) return item.snippet;
  return JSON.stringify(item).substring(0, 100);
}

// Buttons without accessible name
const btnAudit = data.audits['button-name'];
console.log('[Buttons without accessible name]');
if (btnAudit.details && btnAudit.details.items) {
  console.log(`  Found ${btnAudit.details.items.length} issues`);
  for (const item of btnAudit.details.items.slice(0, 5)) {
    console.log(`  - ${getNodeInfo(item)}`);
  }
} else {
  console.log('  No issues found');
}

// Color contrast
const contrastAudit = data.audits['color-contrast'];
console.log('\n[Color contrast issues]');
if (contrastAudit.details && contrastAudit.details.items) {
  console.log(`  Found ${contrastAudit.details.items.length} issues`);
  for (const item of contrastAudit.details.items.slice(0, 5)) {
    const nodeInfo = getNodeInfo(item);
    const contrast = item.contrastRatio ? ` (contrast: ${item.contrastRatio})` : '';
    console.log(`  - ${nodeInfo}${contrast}`);
  }
} else {
  console.log('  No issues found');
}

// Select name
const selectAudit = data.audits['select-name'];
console.log('\n[Select elements without labels]');
if (selectAudit.details && selectAudit.details.items) {
  console.log(`  Found ${selectAudit.details.items.length} issues`);
  for (const item of selectAudit.details.items.slice(0, 5)) {
    console.log(`  - ${getNodeInfo(item)}`);
  }
} else {
  console.log('  No issues found');
}

// Link name
const linkAudit = data.audits['link-name'];
console.log('\n[Links without accessible name]');
if (linkAudit.details && linkAudit.details.items) {
  console.log(`  Found ${linkAudit.details.items.length} issues`);
  for (const item of linkAudit.details.items.slice(0, 5)) {
    console.log(`  - ${getNodeInfo(item)}`);
  }
} else {
  console.log('  No issues found');
}

// Image alt
const imgAudit = data.audits['image-alt'];
console.log('\n[Images without alt text]');
if (imgAudit.details && imgAudit.details.items) {
  console.log(`  Found ${imgAudit.details.items.length} issues`);
  for (const item of imgAudit.details.items.slice(0, 5)) {
    console.log(`  - ${getNodeInfo(item)}`);
  }
} else {
  console.log('  No issues found');
}

// Overall accessibility score
console.log(`\n=== Overall Accessibility Score: ${data.categories.accessibility.score * 100}/100 ===\n`);
