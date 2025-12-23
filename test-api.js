/**
 * 测试草稿保存API的脚本
 * 运行方式：node test-api.js
 */

const axios = require('axios');

// 配置
const API_BASE = 'http://localhost:3001/api';
const TEST_JWT = 'your-jwt-token-here'; // 需要替换为实际的JWT token

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Authorization': `Bearer ${TEST_JWT}`,
    'Content-Type': 'application/json'
  }
});

async function testDraftSave() {
  console.log('🧪 开始测试草稿保存功能...\n');

  try {
    // 步骤1：创建测试文章
    console.log('📝 步骤1：创建测试文章...');
    const createResponse = await api.post('/articles', {
      title: '测试草稿保存 - ' + new Date().toLocaleString()
    });

    const articleId = createResponse.data.id;
    console.log('✅ 文章创建成功，ID:', articleId);
    console.log('文章状态:', createResponse.data.status);

    // 步骤2：保存草稿
    console.log('\n💾 步骤2：保存草稿...');
    const saveResponse = await api.post(`/articles/${articleId}/save-draft`);

    console.log('✅ 草稿保存成功');
    console.log('保存后的文章状态:', saveResponse.data.status);
    console.log('更新时间:', saveResponse.data.updatedAt);

    // 步骤3：获取文章列表验证
    console.log('\n📋 步骤3：获取文章列表验证...');
    const listResponse = await api.get('/articles');

    const draftArticles = listResponse.data.filter(article => article.status === 'DRAFT');
    const savedArticle = draftArticles.find(article => article.id === articleId);

    if (savedArticle) {
      console.log('✅ 草稿文章已出现在列表中');
      console.log('标题:', savedArticle.title);
      console.log('状态:', savedArticle.status);
      console.log('创建时间:', savedArticle.createdAt);
      console.log('更新时间:', savedArticle.updatedAt);
    } else {
      console.log('❌ 草稿文章未在列表中找到');
    }

    // 步骤4：测试错误处理 - 无效文章ID
    console.log('\n🚫 步骤4：测试错误处理...');
    try {
      await api.post('/articles/invalid-id/save-draft');
      console.log('❌ 应该返回错误但没有');
    } catch (error) {
      console.log('✅ 正确处理了无效ID错误');
      console.log('错误状态:', error.response.status);
      console.log('错误消息:', error.response.data.message);
    }

    console.log('\n🎉 所有测试完成！');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

// 运行测试
if (require.main === module) {
  console.log('⚠️  请确保：');
  console.log('1. 后端服务正在运行 (npm run start:dev)');
  console.log('2. 数据库连接正常');
  console.log('3. 已替换TEST_JWT为有效的JWT token\n');

  if (TEST_JWT === 'your-jwt-token-here') {
    console.log('❌ 请先在脚本中设置有效的JWT token');
    process.exit(1);
  }

  testDraftSave();
}

module.exports = { testDraftSave };