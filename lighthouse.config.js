module.exports = {
  extends: 'lighthouse:default',
  settings: {
    // 只运行特定的审计类别
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],

    // 预设配置：桌面端
    preset: 'desktop',

    // 无头模式运行
    headless: true,

    // 模拟设备
    emulatedFormFactor: 'desktop',

    // 屏幕截图
    disableFullPageScreenshot: false,

    // Chrome 标志
    chromeFlags: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox'
    ]
  },

  // 自定义审计
  audits: [
    // 添加自定义审计（如果需要）
  ],

  // 自定义聚合器
  aggregation: [
    // 自定义评分规则（如果需要）
  ]
};