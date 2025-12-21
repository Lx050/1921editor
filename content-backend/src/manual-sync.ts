import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FeishuTableSyncService } from './sync/feishu-table-sync.service';
import { TenantService } from './tenant/tenant.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const syncService = app.get(FeishuTableSyncService);
    const tenantService = app.get(TenantService);

    console.log('🔄 开始手动同步所有用户到飞书表格...\n');

    try {
        // 先检查租户配置
        const tenant = await tenantService.findById('00000000-0000-0000-0000-000000000001');
        console.log('租户信息:');
        console.log('  名称:', tenant.name);
        console.log('  配置:', JSON.stringify(tenant.settings, null, 2));
        console.log('');

        // 同步默认租户的所有用户
        await syncService.syncAllUsersToFeishuTable('00000000-0000-0000-0000-000000000001');
        console.log('\n✅ 同步完成！');
    } catch (error) {
        console.error('\n❌ 同步失败:');
        console.error('错误类型:', error.constructor.name);
        console.error('错误消息:', error.message);
        if (error.response) {
            console.error('API响应:', JSON.stringify(error.response, null, 2));
        }
        console.error('\n完整错误:');
        console.error(error);
    }

    await app.close();
}

bootstrap();
