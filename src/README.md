# 微信API无用户授权使用指南

## 🎯 核心优势

- ✅ **零用户授权** - 用户无需任何操作即可使用微信API
- ✅ **无30天限制** - 绕过refresh_token的30天限制
- ✅ **永久可用** - 使用企业微信公众号服务端授权
- ✅ **简单易用** - 前端直接调用，后端处理所有微信API

## 🔧 配置步骤

### 1. 申请微信公众号服务号

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 注册企业认证的服务号（需要营业执照，300元/年）
3. 在"开发" -> "基本配置"中获取：
   - `AppID`
   - `AppSecret`

### 2. 配置后端环境变量

在 `content-backend/.env` 中添加：
```bash
WECHAT_APP_ID=your_app_id_here
WECHAT_APP_SECRET=your_app_secret_here
```

### 3. 使用API

### 📸 上传图片

```vue
<template>
  <div>
    <WechatImageUploader @upload-success="handleUploadSuccess" />
  </div>
</template>

<script setup>
import WechatImageUploader from '@/components/WechatImageUploader.vue';

const handleUploadSuccess = (event) => {
  console.log('上传成功:', event.detail.result);
  // result 包含: { media_id: 'media_id_here', url: 'url_here' }
};
</script>
```

### 📝 创建图文

```javascript
import { wechatService } from '@/services/wechatService';

const article = {
  title: "文章标题",
  content: "文章内容HTML",
  author: "作者",
  digest: "文章摘要",
};

// 直接创建，无需授权
const result = await wechatService.createDraft(article);
console.log('创建成功:', result.media_id);
```

### 📱 发布图文

```javascript
// 先上传图片获取media_id
const imageResult = await wechatService.uploadImage(imageFile);

// 创建图文
const article = {
  title: "图文标题",
  content: `
    <p>文章内容</p>
    <img src="https://mmbiz.qpic.cn/..." />
  `,
  // 引用上传的图片
  content_source_url: imageResult.url,
};

const draftResult = await wechatService.createDraft(article);

// 发布图文
const publishResult = await fetch('/api/wechat/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    media_id: draftResult.media_id
  })
});
```

## 🔌 API 参考

### 主要接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/wechat/access-token` | GET | 获取access_token |
| `/api/wechat/status` | GET | 检查服务状态 |
| `/api/wechat/upload` | POST | 上传图片 |
| `/api/wechat/batch-upload` | POST | 批量上传图片 |
| `/api/wechat/draft` | POST | 创建图文草稿 |
| `/api/wechat/publish` | POST | 发布图文 |

### 错误处理

```javascript
try {
  const result = await wechatService.uploadImage(file);
  console.log('成功:', result);
} catch (error) {
  console.error('失败:', error.message);

  // 常见错误处理
  if (error.message.includes('invalid appid')) {
    alert('请在后端配置正确的WECHAT_APP_ID');
  } else if (error.message.includes('invalid appsecret')) {
    alert('请在后端配置正确的WECHAT_APP_SECRET');
  } else if (error.message.includes('access_token')) {
    alert('access_token获取失败，请检查网络连接');
  }
}
```

## ⚠️ 重要注意事项

### 1. 权限限制
使用服务端API有以下限制：
- ✅ 可以上传图片、创建图文、发布消息
- ❌ 无法获取用户个人信息（需要单独的网页授权）
- ❌ 无法发送模板消息（需要额外配置）

### 2. access_token管理
- 后端自动管理access_token，2小时刷新一次
- 前端无需关心token过期问题
- 永久可用，无30天限制

### 3. 企业认证要求
- 必须是企业认证的服务号
- 订阅号无法使用完整API
- 个人用户无法申请

## 🚀 部署建议

### 开发环境
1. 申请测试号或使用沙箱环境
2. 配置本地环境变量
3. 测试API连接

### 生产环境
1. 申请正式企业认证服务号
2. 配置生产环境变量
3. 添加IP白名单
4. 启用HTTPS

## 🔍 故障排查

### 检查配置
```bash
# 测试API连接
curl http://localhost:3001/api/wechat/test

# 检查服务状态
curl http://localhost:3001/api/wechat/status
```

### 常见问题

1. **"invalid appid"错误**
   - 检查WECHAT_APP_ID是否正确
   - 确认公众号类型是否为服务号

2. **"invalid appsecret"错误**
   - 检查WECHAT_APP_SECRET是否正确
   - 确认没有多余的空格

3. **网络连接失败**
   - 检查服务器网络连接
   - 确认防火墙设置

4. **上传失败**
   - 检查图片格式是否支持
   - 确认图片大小不超过2MB

## 💡 最佳实践

1. **错误处理**：总是try-catch微信API调用
2. **重试机制**：网络错误时自动重试
3. **日志记录**：记录API调用结果，便于调试
4. **监控告警**：监控API调用成功率

## 📞 技术支持

如有问题，请检查：
1. 后端日志：`content-backend/logs/`
2. 微信公众平台配置
3. 网络连接状态

---

**总结**：通过微信公众号服务端授权，你可以实现真正意义上的"零用户授权、无30天限制"的微信API调用，这是最优雅和用户友好的解决方案。