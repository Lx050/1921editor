import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 生成报告文件名
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputDir = path.join(__dirname, '../lighthouse-reports');
const outputFile = path.join(outputDir, `report-${timestamp}.html`);

console.log('🚀 开始运行 Lighthouse 性能分析...');
console.log(`📍 目标 URL: http://localhost:1921`);
console.log(`📊 输出文件: ${outputFile}`);

// 运行 Lighthouse
const args = [
  'lighthouse',
  'http://localhost:1921',
  '--output=html',
  `--output-path=${outputFile}`,
  '--quiet',
  '--chrome-flags="--headless --no-sandbox --disable-gpu"',
  '--preset=desktop'
];

const child = spawn('npx', args, {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('❌ 运行错误:', error.message);
  process.exit(1);
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Lighthouse 分析完成！');
    console.log(`📄 报告已生成: ${outputFile}`);

    // 尝试打开报告
    if (process.platform === 'win32') {
      spawn('start', [outputFile], { shell: true });
    }
  } else {
    console.error(`\n❌ Lighthouse 运行失败，退出码: ${code}`);
    process.exit(code);
  }
});