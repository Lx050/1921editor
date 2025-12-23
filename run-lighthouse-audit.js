const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runLighthouse() {
  console.log('🚀 Starting Lighthouse audit for http://localhost:1921...');

  // 运行 Lighthouse CLI
  const lighthouse = spawn('npx', ['lighthouse', 'http://localhost:1921',
    '--output=json',
    '--output-path=./lighthouse-reports/report-round2.json',
    '--chrome-flags="--headless"',
    '--quiet',
    '--only-categories=performance,accessibility,best-practices,seo'
  ], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  return new Promise((resolve, reject) => {
    lighthouse.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Lighthouse audit completed successfully!');

        // 读取生成的报告
        const reportPath = path.join(__dirname, 'lighthouse-reports', 'report-round2.json');
        if (fs.existsSync(reportPath)) {
          const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

          // 显示关键指标
          console.log('\n📊 Round 2 Performance Metrics:');
          console.log('Performance Score:', (report.categories.performance.score * 100).toFixed(0));

          const audits = report.audits;
          console.log('\n📈 Key Metrics:');
          console.log('  First Contentful Paint (FCP):', audits['first-contentful-paint'].displayValue);
          console.log('  Largest Contentful Paint (LCP):', audits['largest-contentful-paint'].displayValue);
          console.log('  Time to Interactive (TTI):', audits['interactive'].displayValue);
          console.log('  Total Blocking Time (TBT):', audits['total-blocking-time'].displayValue);
          console.log('  Cumulative Layout Shift (CLS):', audits['cumulative-layout-shift'].displayValue);
          console.log('  Speed Index:', audits['speed-index'].displayValue);

          // 资源摘要
          const resources = audits['resource-summary'].details.items;
          console.log('\n💾 Resource Summary:');
          resources.forEach(r => {
            console.log(`  ${r.resourceType}: ${r.requestCount} requests, ${formatBytes(r.transferSize)}`);
          });

          // 生成 HTML 报告
          const htmlReport = spawn('npx', ['lighthouse', 'http://localhost:1921',
            '--output=html',
            '--output-path=./lighthouse-reports/report-round2.html',
            '--chrome-flags="--headless"',
            '--quiet'
          ], {
            cwd: __dirname
          });

          htmlReport.on('close', () => {
            console.log('\n📄 HTML report generated: ./lighthouse-reports/report-round2.html');
            compareWithRound1(report);
            resolve(report);
          });
        } else {
          reject(new Error('Report file not found'));
        }
      } else {
        reject(new Error(`Lighthouse failed with code ${code}`));
      }
    });
  });
}

function compareWithRound1(report2) {
  const report1Path = path.join(__dirname, 'lighthouse-reports', 'report-latest.json');

  if (fs.existsSync(report1Path)) {
    try {
      const report1 = JSON.parse(fs.readFileSync(report1Path, 'utf8'));

      console.log('\n🔄 Performance Comparison (Round 1 vs Round 2):');

      // Performance 分数对比
      const score1 = report1.categories.performance.score * 100;
      const score2 = report2.categories.performance.score * 100;
      const scoreDiff = score2 - score1;

      console.log('\n📊 Performance Score:');
      console.log(`  Round 1: ${score1.toFixed(0)}`);
      console.log(`  Round 2: ${score2.toFixed(0)}`);
      console.log(`  Change: ${scoreDiff >= 0 ? '+' : ''}${scoreDiff.toFixed(0)} ${scoreDiff >= 0 ? '🟢' : '🔴'}`);

      // 关键指标对比
      const metrics = [
        { id: 'first-contentful-paint', name: 'First Contentful Paint (FCP)' },
        { id: 'largest-contentful-paint', name: 'Largest Contentful Paint (LCP)' },
        { id: 'interactive', name: 'Time to Interactive (TTI)' },
        { id: 'total-blocking-time', name: 'Total Blocking Time (TBT)' },
        { id: 'cumulative-layout-shift', name: 'Cumulative Layout Shift (CLS)' },
        { id: 'speed-index', name: 'Speed Index (SI)' }
      ];

      console.log('\n📈 Metrics Comparison:');
      metrics.forEach(metric => {
        const value1 = report1.audits[metric.id];
        const value2 = report2.audits[metric.id];

        if (value1 && value2) {
          const numeric1 = metric.id.includes('layout-shift') ? value1.numericValue : value1.numericValue / 1000;
          const numeric2 = metric.id.includes('layout-shift') ? value2.numericValue : value2.numericValue / 1000;
          const diff = numeric2 - numeric1;

          console.log(`\n  ${metric.name}:`);
          console.log(`    Round 1: ${value1.displayValue}`);
          console.log(`    Round 2: ${value2.displayValue}`);
          console.log(`    Change: ${diff >= 0 ? '+' : ''}${diff.toFixed(metric.id.includes('layout-shift') ? 3 : 2)}${metric.id.includes('layout-shift') ? '' : 's'} ${diff >= 0 ? '🔴' : '🟢'}`);
        }
      });

      // 资源对比
      console.log('\n💾 Resource Summary Comparison:');
      const resources1 = report1.audits['resource-summary'].details.items;
      const resources2 = report2.audits['resource-summary'].details.items;

      const resourceTypes = ['Script', 'Stylesheet', 'Image', 'Font', 'Document'];
      resourceTypes.forEach(type => {
        const r1 = resources1.find(r => r.resourceType === type);
        const r2 = resources2.find(r => r.resourceType === type);

        if (r1 && r2) {
          const sizeDiff = r2.transferSize - r1.transferSize;
          const countDiff = r2.requestCount - r1.requestCount;

          console.log(`\n  ${type}s:`);
          console.log(`    Size: ${formatBytes(r1.transferSize)} → ${formatBytes(r2.transferSize)} (${sizeDiff >= 0 ? '+' : ''}${formatBytes(sizeDiff)})`);
          console.log(`    Count: ${r1.requestCount} → ${r2.requestCount} (${countDiff >= 0 ? '+' : ''}${countDiff})`);
        }
      });

      // 识别改进和退化
      console.log('\n✅ Improvements:');
      const improvements = [];
      const regressions = [];

      metrics.forEach(metric => {
        const value1 = report1.audits[metric.id];
        const value2 = report2.audits[metric.id];

        if (value1 && value2) {
          const numeric1 = value1.numericValue;
          const numeric2 = value2.numericValue;
          const isImprovement = metric.id.includes('layout-shift') ? numeric2 < numeric1 : numeric2 < numeric1;

          if (isImprovement) {
            improvements.push(metric.name);
          } else if (numeric2 !== numeric1) {
            regressions.push(metric.name);
          }
        }
      });

      if (improvements.length > 0) {
        improvements.forEach(imp => console.log(`  ✓ ${imp}`));
      } else {
        console.log('  None identified');
      }

      console.log('\n⚠️ Regressions:');
      if (regressions.length > 0) {
        regressions.forEach(reg => console.log(`  ! ${reg}`));
      } else {
        console.log('  None - Great job!');
      }

      // 优化建议
      console.log('\n💡 Top Optimization Opportunities:');
      const opportunities = report2.audits;
      const failedAudits = Object.entries(opportunities)
        .filter(([key, audit]) => audit.scoreDisplayMode === 'numeric' && audit.score < 0.9)
        .sort(([, a], [, b]) => a.score - b.score)
        .slice(0, 5);

      if (failedAudits.length > 0) {
        failedAudits.forEach(([key, audit]) => {
          console.log(`\n  ⚠️ ${audit.title} (Score: ${(audit.score * 100).toFixed(0)})`);
          if (audit.description) {
            console.log(`     ${audit.description.substring(0, 150)}...`);
          }
        });
      } else {
        console.log('\n  🎉 No critical optimization opportunities found!');
      }

    } catch (err) {
      console.error('Error comparing reports:', err);
    }
  } else {
    console.log('⚠️ First round report not found at:', report1Path);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 运行审计
runLighthouse().catch(console.error);