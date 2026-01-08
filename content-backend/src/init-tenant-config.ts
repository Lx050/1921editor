import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TenantService } from './tenant/tenant.service';

async function updateTenantConfig() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tenantService = app.get(TenantService);

  console.log('🔧 更新租户配置为正确的表格...\n');

  try {
    const tenant = await tenantService.findById(
      '00000000-0000-0000-0000-000000000001',
    );

    if (!tenant) {
      console.log('❌ 默认租户不存在');
      await app.close();
      return;
    }

    // 使用正确的配置
    const userTableConfig = {
      appToken: 'V9ORbOdvYax8ANs072Cc7AoQnQh',
      tableId: 'tblQrscswfqgfY9A',
      tableUrl:
        'https://pcn0utfudhj3.feishu.cn/base/V9ORbOdvYax8ANs072Cc7AoQnQh?table=tblQrscswfqgfY9A',
      configuredAt: new Date().toISOString(),
    };

    const settings = tenant.settings || {};
    settings.userTable = userTableConfig;

    tenant.settings = settings;
    await tenantService.update(tenant.id, tenant);

    console.log('✅ 配置已更新:');
    console.log('  App Token:', userTableConfig.appToken);
    console.log('  Table ID:', userTableConfig.tableId);
    console.log('  Table URL:', userTableConfig.tableUrl);
    console.log('\n✅ 配置已保存到数据库');
    console.log('\n📝 下一步:');
    console.log('1. 在飞书表格中设置"组织内可见"');
    console.log('2. 运行测试: node src/test-correct-table.js');
  } catch (error) {
    console.error('❌ 更新失败:', error.message);
  }

  await app.close();
}

updateTenantConfig();
