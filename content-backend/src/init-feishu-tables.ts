// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TenantService } from './tenant/tenant.service';
import { ConfigService } from '@nestjs/config';
import * as Lark from '@larksuiteoapi/node-sdk';

/**
 * 初始化飞书表格结构
 * 运行: npx ts-node src/init-feishu-tables.ts
 */
async function initFeishuTables() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tenantService = app.get(TenantService);
  const configService = app.get(ConfigService);

  console.log('🔧 初始化飞书表格结构...\n');

  // 1. 获取 App Token (使用用户指定的 Base)
  // URL: https://pcn0utfudhj3.feishu.cn/base/BVNSbP2B6aniprsQXuDcmOj2n4f
  const appToken = 'BVNSbP2B6aniprsQXuDcmOj2n4f';
  if (!appToken) {
    console.error('❌ 未配置 FEISHU_ARTICLE_BASE_APP_TOKEN');
    await app.close();
    process.exit(1);
  }

  // 2. 获取租户配置
  // 为了简化，这里我们使用默认租户的飞书凭证来进行操作
  // 实际生产中应该根据需要操作的 Base 所在的租户来获取凭证
  const tenant = await tenantService.findById(
    '00000000-0000-0000-0000-000000000001',
  );
  if (!tenant) {
    console.error('❌ 默认租户不存在');
    await app.close();
    process.exit(1);
  }

  const appId =
    tenant.feishuAppId || configService.get<string>('FEISHU_APP_ID');
  const appSecret =
    tenant.feishuAppSecret || configService.get<string>('FEISHU_APP_SECRET');

  if (!appId || !appSecret) {
    console.error('❌ 未找到飞书凭证 (AppID/AppSecret)');
    await app.close();
    process.exit(1);
  }

  const client = new Lark.Client({
    appId,
    appSecret,
    appType: Lark.AppType.SelfBuild,
    domain: Lark.Domain.Feishu,
  });

  try {
    console.log(`📡 连接飞书 Base: ${appToken}`);

    // ==========================================
    // 1. 获取现有表格
    // ==========================================
    console.log('\n📋 检查现有表格...');
    const tablesRes = await client.bitable.appTable.list({
      path: { app_token: appToken },
      params: { page_size: 100 },
    });

    if (tablesRes.code !== 0) {
      throw new Error(`获取表格列表失败: ${tablesRes.msg}`);
    }

    const tables = tablesRes.data?.items || [];
    let userTableId = '';
    let articleTableId = '';

    // ==========================================
    // 2. 处理人员管理表
    // ==========================================
    const userTable = tables.find((t) => t.name === '人员管理表');
    if (userTable) {
      console.log(
        `   ✅ 找到现有表: [${userTable.name}] (${userTable.table_id})`,
      );
      userTableId = userTable.table_id;
    } else {
      console.log('   🔨 创建新表 [人员管理表]...');
      const createUserRes = await client.bitable.appTable.create({
        path: { app_token: appToken },
        data: {
          table: {
            name: '人员管理表',
            default_view_name: '表格视图',
            fields: [
              { field_name: '姓名', type: 1 },
              {
                field_name: '岗位',
                type: 3,
                property: {
                  options: [
                    { name: 'ADMIN' },
                    { name: 'EDITOR' },
                    { name: 'COPYWRITER' },
                    { name: 'PLANNER' },
                  ],
                },
              },
              { field_name: 'FeishuID', type: 1 },
              { field_name: 'Email', type: 1 },
              { field_name: '最后登录时间', type: 5 },
              {
                field_name: '状态',
                type: 3,
                property: { options: [{ name: '激活' }, { name: '禁用' }] },
              },
            ],
          },
        },
      });
      if (createUserRes.code !== 0)
        throw new Error(`创建人员表失败: ${createUserRes.msg}`);
      userTableId = createUserRes.data.table_id;
      console.log(`   ✅ 创建成功: ${userTableId}`);
    }

    // ==========================================
    // 3. 处理文章管理表
    // ==========================================
    const articleTable = tables.find((t) => t.name === '文章管理表');
    if (articleTable) {
      console.log(
        `   ✅ 找到现有表: [${articleTable.name}] (${articleTable.table_id})`,
      );
      articleTableId = articleTable.table_id;
    } else {
      console.log('   🔨 创建新表 [文章管理表]...');
      const createArticleRes = await client.bitable.appTable.create({
        path: { app_token: appToken },
        data: {
          table: {
            name: '文章管理表',
            default_view_name: '看板视图',
            fields: [
              { field_name: '标题', type: 1 },
              {
                field_name: '状态',
                type: 3,
                property: {
                  options: [
                    { name: 'DRAFT' },
                    { name: 'PARSED' },
                    { name: 'ADJUSTED' },
                    { name: 'PUBLISHED' },
                  ],
                },
              },
              { field_name: '内容策划', type: 11 },
              { field_name: '文案撰稿', type: 11 },
              { field_name: '文章编辑', type: 11 },
              { field_name: '最后更新', type: 5 },
              { field_name: '系统ID', type: 1 },
            ],
          },
        },
      });
      if (createArticleRes.code !== 0)
        throw new Error(`创建文章表失败: ${createArticleRes.msg}`);
      articleTableId = createArticleRes.data.table_id;
      console.log(`   ✅ 创建成功: ${articleTableId}`);
    }

    // ==========================================
    // 4. 更新租户配置
    // ==========================================
    console.log('\n💾 更新租户配置...');
    const settingUpdate = {
      articleTable: {
        appToken,
        tableId: articleTableId,
        configuredAt: new Date().toISOString(),
      },
      userTable: {
        appToken,
        tableId: userTableId,
        configuredAt: new Date().toISOString(),
      },
    };

    const currentSettings = tenant.settings || {};
    await tenantService.update(tenant.id, {
      settings: {
        ...currentSettings,
        ...settingUpdate,
      },
    });

    console.log('✅ 配置已更新到数据库:');
    console.log(JSON.stringify(settingUpdate, null, 2));
    console.log('----------------------------------------');
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
    if (error.code) console.error('Error Code:', error.code);
    if (error.msg) console.error('Error Msg:', error.msg);
    console.error('Stack:', error.stack);
  }

  await app.close();
}

initFeishuTables();
