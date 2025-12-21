-- 添加数据库索引以优化查询性能
-- 执行时间: 2025-12-21

-- users 表索引
CREATE INDEX IF NOT EXISTS "idx_users_tenant_feishu" 
ON "users"("tenantId", "feishuId");

CREATE INDEX IF NOT EXISTS "idx_users_tenant" 
ON "users"("tenantId");

-- articles 表索引
CREATE INDEX IF NOT EXISTS "idx_articles_owner" 
ON "articles"("ownerId");

CREATE INDEX IF NOT EXISTS "idx_articles_status" 
ON "articles"("status");

CREATE INDEX IF NOT EXISTS "idx_articles_created" 
ON "articles"("createdAt" DESC);

CREATE INDEX IF NOT EXISTS "idx_articles_tenant" 
ON "articles"("tenantId");

-- tenants 表索引
CREATE INDEX IF NOT EXISTS "idx_tenants_slug" 
ON "tenants"("slug");

CREATE INDEX IF NOT EXISTS "idx_tenants_active" 
ON "tenants"("isActive");

-- 验证索引创建
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN ('users', 'articles', 'tenants')
ORDER BY tablename, indexname;
