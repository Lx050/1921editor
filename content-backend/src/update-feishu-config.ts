// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TenantService } from './tenant/tenant.service';
import { ConfigService } from '@nestjs/config';
import * as Lark from '@larksuiteoapi/node-sdk';

async function updateConfig() {
    try {
        const app = await NestFactory.createApplicationContext(AppModule);
        const tenantService = app.get(TenantService);
        const configService = app.get(ConfigService);

        const appToken = 'BVNSbP2B6aniprsQXuDcmOj2n4f';

        console.log('🔍 查找并更新 Feishu 配置...');

        const tenant = await tenantService.findById('00000000-0000-0000-0000-000000000001');
        if (!tenant) throw new Error('Tenant not found');

        const appId = tenant.feishuAppId || configService.get('FEISHU_APP_ID');
        const appSecret = tenant.feishuAppSecret || configService.get('FEISHU_APP_SECRET');

        if (!appId || !appSecret) throw new Error('Feishu credentials not found');

        const client = new Lark.Client({
            appId: appId,
            appSecret: appSecret,
            domain: Lark.Domain.Feishu,
        });

        console.log(`📡 列出 Base [${appToken}] 中的表格...`);
        const tablesRes = await client.bitable.appTable.list({
            path: { app_token: appToken },
            params: { page_size: 100 }
        });

        if (tablesRes.code !== 0) {
            console.error('❌ 获取表格列表失败:', tablesRes.msg);
            return;
        }

        const tables = tablesRes.data.items;
        console.log('📋 现有表格:', tables.map(t => `${t.name} (${t.table_id})`));

        const userTable = tables.find(t => t.name === '人员管理表');
        const articleTable = tables.find(t => t.name === '文章管理表');

        if (!userTable || !articleTable) {
            console.error('❌ 未找到必要的表格 (人员管理表/文章管理表)');
            return;
        }

        console.log(`✅ 找到表格:\n user: ${userTable.table_id}\n article: ${articleTable.table_id}`);

        const settings = tenant.settings || {};
        const newSettings = {
            ...settings,
            userTable: {
                appToken,
                tableId: userTable.table_id,
                configuredAt: new Date().toISOString()
            },
            articleTable: {
                appToken,
                tableId: articleTable.table_id,
                configuredAt: new Date().toISOString()
            }
        };

    } catch (e) {
        console.error('❌ Error:', e);
        const fs = require('fs');
        fs.writeFileSync('update_error.log', JSON.stringify({ msg: e.message, stack: e.stack }, null, 2));
    }

    await app.close();
}

updateConfig();
