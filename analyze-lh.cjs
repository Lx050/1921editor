const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./lh-result.json', 'utf8'));

console.log('=== 性能问题分析 ===\n');

// Performance audits
const perfAudits = data.categories.performance.auditRefs.filter(a => a.weight > 0);
console.log('需要修复的性能问题：');

for (const ref of perfAudits) {
  const audit = data.audits[ref.id];
  if (audit.score !== null && audit.score < 1) {
    console.log(`\n[${ref.id}]`);
    console.log(`  分数: ${audit.score}`);
    console.log(`  标题: ${audit.title}`);
    if (audit.description) console.log(`  说明: ${audit.description}`);
    if (audit.details && audit.details.items && audit.details.items.length > 0) {
      console.log(`  影响项数: ${audit.details.items.length}`);
    }
  }
}

// Accessibility audits
console.log('\n=== 可访问性问题 ===\n');
const a11yAudits = data.categories.accessibility.auditRefs;
for (const ref of a11yAudits) {
  const audit = data.audits[ref.id];
  if (audit.score !== null && audit.score < 1) {
    console.log(`\n[${ref.id}]`);
    console.log(`  分数: ${audit.score}`);
    console.log(`  标题: ${audit.title}`);
    if (audit.description) {
      const desc = audit.description.length > 100 ? audit.description.substring(0, 100) + '...' : audit.description;
      console.log(`  说明: ${desc}`);
    }
  }
}
