<template>
  <div class="wechat-auth-demo">
    <div class="demo-header">
      <h2>微信公众号第三方授权演示</h2>
      <p>这个演示展示了如何使用第三方微信公众号授权功能</p>
    </div>

    <!-- 授权管理组件 -->
    <WechatAuthManager />

    <!-- 使用说明 -->
    <div class="usage-guide">
      <h3>使用说明</h3>

      <div class="guide-section">
        <h4>1. 申请微信开放平台</h4>
        <p>首先需要在 <a href="https://open.weixin.qq.com/" target="_blank">微信开放平台</a> 申请成为开发者，创建第三方平台应用。</p>
        <ul>
          <li>需要企业认证（300元/年）</li>
          <li>创建第三方平台应用</li>
          <li>获取 component_appid 和 component_appsecret</li>
          <li>配置授权事件接收URL</li>
        </ul>
      </div>

      <div class="guide-section">
        <h4>2. 配置后端服务</h4>
        <p>在 content-backend/.env 中配置微信开放平台信息：</p>
        <pre><code>WECHAT_OPEN_APP_ID=your_component_appid
WECHAT_OPEN_APP_SECRET=your_component_appsecret
WECHAT_OPEN_TOKEN=your_component_token
WECHAT_OPEN_AES_KEY=your_component_aes_key</code></pre>
      </div>

      <div class="guide-section">
        <h4>3. 授权流程</h4>
        <ol>
          <li>点击"添加新公众号授权"按钮</li>
          <li>系统生成授权链接</li>
          <li>公众号管理员扫码或点击链接进行授权</li>
          <li>授权完成后，公众号将出现在已授权列表中</li>
        </ol>
      </div>

      <div class="guide-section">
        <h4>4. 发布内容</h4>
        <p>获得授权后，可以：</p>
        <ul>
          <li>上传图片到公众号</li>
          <li>创建图文消息</li>
          <li>发布图文到公众号</li>
        </ul>
      </div>
    </div>

    <!-- API 接口示例 -->
    <div class="api-examples">
      <h3>API 接口示例</h3>

      <div class="example-section">
        <h4>1. 上传图片</h4>
        <pre><code>const formData = new FormData();
formData.append('file', imageFile);
formData.append('app_id', authorizedAppId);

const response = await fetch('/api/wechat/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('上传成功:', result.media_id);</code></pre>
      </div>

      <div class="example-section">
        <h4>2. 创建图文消息</h4>
        <pre><code>const article = {
  app_id: authorizedAppId,
  articles: [{
    title: "文章标题",
    content: "文章HTML内容",
    author: "作者",
    digest: "文章摘要"
  }]
};

const response = await fetch('/api/wechat/create-draft', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(article)
});

const result = await response.json();
console.log('创建成功:', result.media_id);</code></pre>
      </div>

      <div class="example-section">
        <h4>3. 发布图文消息</h4>
        <pre><code>const publishData = {
  app_id: authorizedAppId,
  media_id: draftMediaId
};

const response = await fetch('/api/wechat/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(publishData)
});

const result = await response.json();
console.log('发布成功:', result.publish_id);</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WechatAuthManager from '@/components/WechatAuthManager.vue';
</script>

<style scoped>
.wechat-auth-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.demo-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.usage-guide,
.api-examples {
  margin-top: 40px;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
}

.usage-guide h3,
.api-examples h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.guide-section,
.example-section {
  margin-bottom: 30px;
}

.guide-section h4,
.example-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #007bff;
}

.guide-section p,
.example-section p {
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.guide-section ul,
.guide-section ol {
  margin: 0;
  padding-left: 20px;
}

.guide-section li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.guide-section a {
  color: #007bff;
  text-decoration: none;
}

.guide-section a:hover {
  text-decoration: underline;
}

.example-section pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.example-section code {
  font-family: 'Courier New', monospace;
}
</style>