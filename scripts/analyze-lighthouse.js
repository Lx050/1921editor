import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取最新的 Lighthouse 报告
const reportsDir = path.join(__dirname, '..', 'lighthouse-reports');
const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.html'));
const latestReport = files.sort().pop();

console.log('\n=== Lighthouse 性能优化分析报告 ===\n');
console.log(`分析报告文件: ${latestReport}\n`);

const reportPath = path.join(reportsDir, latestReport);
const reportContent = fs.readFileSync(reportPath, 'utf8');

// 提取 JSON 数据
const jsonMatch = reportContent.match(/<script id="lh-json" type="application\/json">([\s\S]*?)<\/script>/);

if (jsonMatch) {
  try {
    const lhr = JSON.parse(jsonMatch[1]);

    // 性能分数
    const performance = lhr.categories.performance;
    console.log(`🚀 性能总分: ${Math.round(performance.score * 100)} / 100`);

    // 各项指标
    const audits = lhr.audits;

    console.log('\n📊 关键指标详情:');
    console.log(`  • First Contentful Paint (FCP): ${formatValue(audits['first-contentful-paint'])}`);
    console.log(`  • Largest Contentful Paint (LCP): ${formatValue(audits['largest-contentful-paint'])}`);
    console.log(`  • Time to Interactive (TTI): ${formatValue(audits['interactive'])}`);
    console.log(`  • Speed Index: ${formatValue(audits['speed-index'])}`);
    console.log(`  • Cumulative Layout Shift (CLS): ${formatValue(audits['cumulative-layout-shift'])}`);

    // 资源指标
    console.log('\n📦 资源统计:');
    console.log(`  • JavaScript 文件大小: ${formatBytes(audits['total-byte-weight'].details.items.find(i => i.resourceType === 'script')?.totalBytes || 0)}`);
    console.log(`  • CSS 文件大小: ${formatBytes(audits['total-byte-weight'].details.items.find(i => i.resourceType === 'stylesheet')?.totalBytes || 0)}`);
    console.log(`  • 图片文件大小: ${formatBytes(audits['total-byte-weight'].details.items.find(i => i.resourceType === 'image')?.totalBytes || 0)}`);
    console.log(`  • DOM 节点数量: ${audits['dom-size'].details.items?.[0]?.value || 0}`);

    // 优化建议
    console.log('\n💡 优化建议:');

    // 检查需要优化的项目
    if (audits['unused-css-rules']) {
      console.log(`  • 未使用的 CSS: ${formatBytes(audits['unused-css-rules'].details.wastedBytes)}`);
    }

    if (audits['unused-javascript']) {
      console.log(`  • 未使用的 JavaScript: ${formatBytes(audits['unused-javascript'].details.wastedBytes)}`);
    }

    if (audits['render-blocking-resources']) {
      console.log(`  • 阻塞渲染的资源: ${audits['render-blocking-resources'].details.items?.length || 0} 个`);
    }

    if (audits['uses-text-compression']) {
      console.log(`  • 文本压缩: 可节省 ${formatBytes(audits['uses-text-compression'].details.wastedBytes)}`);
    }

    if (audits['unminified-css']) {
      console.log(`  • 未压缩的 CSS: ${formatBytes(audits['unminified-css'].details.wastedBytes)}`);
    }

    if (audits['unminified-javascript']) {
      console.log(`  • 未压缩的 JavaScript: ${formatBytes(audits['unminified-javascript'].details.wastedBytes)}`);
    }

    // 输出具体的优化机会
    console.log('\n🎯 具体优化机会:');
    const opportunities = lhr.categories.performance.auditRefs.filter(r =>
      r.group === 'metrics' && audits[r.id]?.score < 1
    );

    opportunities.forEach(ref => {
      const audit = audits[ref.id];
      if (audit && audit.score < 1) {
        console.log(`  • ${ref.title}: ${audit.description || '需要优化'}`);
      }
    });

  } catch (e) {
    console.error('解析报告失败:', e.message);
  }
}

function formatValue(audit) {
  if (!audit) return 'N/A';
  const value = audit.displayValue || audit.numericValue;
  if (audit.numericUnit === 'ms') {
    return `${(value / 1000).toFixed(2)}s`;
  }
  return value;
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}