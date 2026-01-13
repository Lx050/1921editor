#!/usr/bin/env node

/**
 * Lighthouse 性能分析脚本
 * 用于分析前端应用的性能指标
 */

import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

// 获取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置选项
const config = {
  // 目标URL（开发服务器当前端口）
  url: 'http://localhost:1921',
  // 输出目录
  outputDir: path.join(__dirname, '../lighthouse-reports'),
  // 输出格式
  outputFormats: ['html', 'json'],
  // Lighthouse 配置
  lighthouseConfig: {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      preset: 'desktop',
      // 设置为 true 会显示浏览器
      headless: true,
      // 禁用屏幕截图
      disableDeviceEmulation: false,
      // Chrome 标志
      chromeFlags: ['--no-sandbox', '--disable-gpu']
    }
  }
};

// 创建输出目录
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// 获取当前时间戳
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

// 构建 Lighthouse 命令
function buildLighthouseCommand() {
  const cmd = 'npx';
  const args = ['lighthouse'];

  // 添加 URL
  args.push(config.url);

  // 为每种格式单独运行 Lighthouse（避免路径问题）
  if (config.outputFormats.length === 1) {
    const format = config.outputFormats[0];
    const outputFile = path.join(config.outputDir, `report-${timestamp}.${format}`);
    args.push(`--output=${format}`);
    args.push(`--output-path=${outputFile}`);
  } else {
    // 默认生成 HTML 报告
    const outputFile = path.join(config.outputDir, `report-${timestamp}.html`);
    args.push('--output=html');
    args.push(`--output-path=${outputFile}`);
  }

  // 添加配置
  args.push('--config-path=' + path.join(__dirname, '../lighthouse.config.js'));

  // 添加静默模式
  args.push('--quiet');

  // 添加 verbose 输出用于调试
  args.push('--verbose');

  return { cmd, args };
}

// 运行 Lighthouse
function runLighthouse() {
  const { cmd, args } = buildLighthouseCommand();

  console.log('🚀 开始运行 Lighthouse 性能分析...');
  console.log(`📍 目标 URL: ${config.url}`);
  console.log(`📊 输出目录: ${config.outputDir}`);

  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: true
  });

  child.on('error', (error) => {
    console.error('❌ 运行 Lighthouse 时出错:', error);
    process.exit(1);
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Lighthouse 分析完成！');
      console.log('\n📋 生成的报告:');
      config.outputFormats.forEach(format => {
        const file = path.join(config.outputDir, `report-${timestamp}.${format}`);
        console.log(`  - ${format.toUpperCase()}: ${file}`);
      });

      // 打开 HTML 报告
      if (config.outputFormats.includes('html')) {
        const htmlFile = path.join(config.outputDir, `report-${timestamp}.html`);
        console.log(`\n🌐 正在打开报告: ${htmlFile}`);

        // Windows
        if (process.platform === 'win32') {
          spawn('start', [htmlFile], { shell: true });
        }
        // macOS
        else if (process.platform === 'darwin') {
          spawn('open', [htmlFile]);
        }
        // Linux
        else {
          spawn('xdg-open', [htmlFile]);
        }
      }
    } else {
      console.error(`\n❌ Lighthouse 运行失败，退出码: ${code}`);
      process.exit(code);
    }
  });
}

// 检查服务器是否运行
function checkServer() {
  console.log(`🔍 检查服务器是否运行在 ${config.url}...`);

    const req = http.request(config.url, () => {
    console.log('✅ 服务器运行正常');
    runLighthouse();
  });

  req.on('error', () => {
    console.error(`❌ 无法连接到 ${config.url}`);
    console.error('请确保开发服务器正在运行 (npm run dev)');
    process.exit(1);
  });

  req.setTimeout(5000, () => {
    req.destroy();
    console.error('❌ 连接超时');
    process.exit(1);
  });

  req.end();
}

// 主函数
function main() {
  console.log('🔧 Lighthouse 性能分析工具\n');

  // 检查 npx 和 lighthouse 是否可用
  exec('npx lighthouse --version', (error, stdout) => {
    if (error) {
      console.error('❌ Lighthouse 不可用');
      console.error('请运行: npm install -g lighthouse 或使用 npx');
      process.exit(1);
    }

    console.log(`📌 Lighthouse 版本: ${stdout.trim()}`);
    checkServer();
  });
}

// 运行主函数
main();