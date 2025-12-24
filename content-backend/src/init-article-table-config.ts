import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TenantService } from './tenant/tenant.service';
import { ConfigService } from '@nestjs/config';

/**
 * 初始化租户的文章管理表配置
 * 运行: npx ts-node src/init-article-table-config.ts
 */
async function initArticleTableConfig() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tenantService = app.get(TenantService);
  const configService = app.get(ConfigService);

  console.log('🔧 初始化租户的文章管理表配置...\n');

  // 从环境变量读取配置
  const appToken = configService.get<string>('FEISHU_ARTICLE_BASE_APP_TOKEN');
  const tableId = configService.get<string>('FEISHU_ARTICLE_BASE_TABLE_ID');

  if (!appToken || !tableId) {
    console.log('❌ 错误: 请先在 .env 文件中配置以下环境变量:');
    console.log('   FEISHU_ARTICLE_BASE_APP_TOKEN=你的AppToken');
    console.log('   FEISHU_ARTICLE_BASE_TABLE_ID=你的TableID');
    console.log('\n📝 获取方式:');
    console.log('   1. 打开飞书多维表格');
    console.log(
      '   2. 从 URL 中提取: https://xxx.feishu.cn/base/{AppToken}?table={TableID}',
    );
    await app.close();
    process.exit(1);
  }

  try {
    // 获取默认租户
    const tenant = await tenantService.findById(
      '00000000-0000-0000-0000-000000000001',
    );

    if (!tenant) {
      console.log('❌ 默认租户不存在，请先创建租户');
      await app.close();
      process.exit(1);
    }

    console.log(`📌 租户信息: ${tenant.name} (${tenant.id})`);

    // 更新租户设置
    const articleTableConfig = {
      appToken,
      tableId,
      configuredAt: new Date().toISOString(),
    };

    const settings = tenant.settings || {};
    settings.articleTable = articleTableConfig;

    await tenantService.update(tenant.id, { settings });

    console.log('\n✅ 文章管理表配置成功:');
    console.log(`   App Token: ${appToken}`);
    console.log(`   Table ID: ${tableId}`);
    console.log(`   配置时间: ${articleTableConfig.configuredAt}`);

    console.log('\n📝 下一步:');
    console.log(
      '   1. 确保飞书表格有以下字段: 标题, 状态, 内容策划, 文案撰稿, 文章编辑, 最后更新, 系统ID',
    );
    console.log('   2. 重启后端服务');
    console.log('   3. 创建一篇文章测试同步');
  } catch (error) {
    console.error('❌ 配置失败:', error.message);
  }

  await app.close();
}

initArticleTableConfig();
