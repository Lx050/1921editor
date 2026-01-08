import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1734762000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // users 表索引
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_tenant_feishu" 
      ON "users"("tenantId", "feishuId");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_tenant" 
      ON "users"("tenantId");
    `);

    // articles 表索引
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_articles_owner" 
      ON "articles"("ownerId");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_articles_status" 
      ON "articles"("status");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_articles_created" 
      ON "articles"("createdAt" DESC);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_articles_tenant" 
      ON "articles"("tenantId");
    `);

    // tenants 表索引
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_tenants_slug" 
      ON "tenants"("slug");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_tenants_active" 
      ON "tenants"("isActive");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_tenant_feishu";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_tenant";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_articles_owner";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_articles_status";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_articles_created";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_articles_tenant";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tenants_slug";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tenants_active";`);
  }
}
