// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FeishuTableSyncService } from './sync/feishu-table-sync.service';
import { ArticleSyncService } from './sync/article-sync.service';
import { TenantService } from './tenant/tenant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Article } from './entities/article.entity';
const fs = require('fs');

async function debugSync() {
  const logs = [];
  const log = (msg, data = null) => {
    console.log(msg);
    logs.push({ msg, data });
  };

  try {
    log('🚀 Starting Debug Sync...');
    const app = await NestFactory.createApplicationContext(AppModule);
    const syncService = app.get(FeishuTableSyncService); // Ensure this is exported/available
    const articleSyncService = app.get(ArticleSyncService);
    const tenantService = app.get(TenantService);
    const userRepository = app.get(getRepositoryToken(User));

    // 1. Get Default Tenant
    const tenant = await tenantService.findById(
      '00000000-0000-0000-0000-000000000001',
    );
    if (!tenant) {
      log('❌ Default Tenant not found');
      throw new Error('Tenant not found');
    }
    log(`✅ Tenant Found: ${tenant.name}`, tenant.id);
    log(`📋 Settings:`, tenant.settings?.userTable);

    // 2. Get a User (First one found)
    const user = await userRepository.findOne({
      where: { tenantId: tenant.id },
    });
    if (!user) {
      log('❌ No user found for tenant');
      throw new Error('User not found');
    }
    log(`✅ User Found: ${user.name}`, {
      role: user.role,
      feishuId: user.feishuId,
    });

    if (!user.feishuId) {
      log('⚠️ User has no FeishuID, using mock...');
      user.feishuId = 'ou_mock_user_123';
    }

    // 3. User Sync
    log('🔄 Triggering User Sync...');
    try {
      await syncService.syncUserToFeishuTable(user, tenant);
      log('✅ User Sync Completed Successfully');
    } catch (error) {
      log('❌ User Sync Failed', { error: error.message });
    }

    // 4. Article Sync
    log('🔄 Creating Mock Article for Sync...');
    const mockArticle = new Article();
    mockArticle.id = 'debug-' + Date.now();
    mockArticle.title = 'Debug Article ' + new Date().toISOString();
    mockArticle.status = 'DRAFT';
    mockArticle.tenantId = tenant.id;
    mockArticle.ownerId = user.id;
    mockArticle.planners = [user.id]; // Ensure array of IDs
    mockArticle.copywriters = [];
    mockArticle.editors = [];
    mockArticle.updatedAt = new Date();

    try {
      log('🔄 Triggering Article Sync...');
      const result = await articleSyncService.syncArticleToFeishu(
        mockArticle,
        tenant,
      );
      log('✅ Article Sync Result:', result);
    } catch (error) {
      log('❌ Article Sync Failed', {
        error: error.message,
        stack: error.stack,
      });
    }

    await app.close();
  } catch (err) {
    log('❌ Script Crash', { error: err.message, stack: err.stack });
  } finally {
    fs.writeFileSync('debug_result.json', JSON.stringify(logs, null, 2));
    console.log('📝 Logs written to debug_result.json');
  }
}

debugSync();
