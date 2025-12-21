import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TenantService } from './tenant/tenant.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const tenantService = app.get(TenantService);

    console.log('📋 查询默认租户配置...\n');

    try {
        const tenant = await tenantService.findById('00000000-0000-0000-0000-000000000001');

        if (tenant) {
            console.log('租户信息:');
            console.log('  ID:', tenant.id);
            console.log('  名称:', tenant.name);
            console.log('  Slug:', tenant.slug);
            console.log('  飞书AppId:', tenant.feishuAppId || '(未配置，使用全局配置)');
            console.log('  飞书AppSecret:', tenant.feishuAppSecret ? '已配置' : '(未配置，使用全局配置)');
            console.log('\n配置信息 (settings):');
            console.log(JSON.stringify(tenant.settings, null, 2));
        } else {
            console.log('❌ 租户不存在');
        }
    } catch (error) {
        console.error('❌ 查询失败:', error.message);
    }

    await app.close();
}

bootstrap();
