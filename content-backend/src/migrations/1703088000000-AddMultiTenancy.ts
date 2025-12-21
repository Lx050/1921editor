import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMultiTenancy1703088000000 implements MigrationInterface {
  name = 'AddMultiTenancy1703088000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. 创建 tenants 表
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "slug" character varying,
        "feishuAppId" character varying,
        "feishuAppSecret" character varying,
        "feishuBaseAppToken" character varying,
        "feishuBaseTableId" character varying,
        "wechatAppId" character varying,
        "wechatAppSecret" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "settings" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tenants" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tenants_name" UNIQUE ("name"),
        CONSTRAINT "UQ_tenants_slug" UNIQUE ("slug")
      )
    `);

    // 2. 创建默认租户（用于迁移现有数据）
    await queryRunner.query(`
      INSERT INTO "tenants" ("id", "name", "slug", "isActive")
      VALUES (
        '00000000-0000-0000-0000-000000000001',
        '默认租户',
        'default',
        true
      )
    `);

    // 3. 为 users 表添加 tenantId 列
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "tenantId" uuid
    `);

    // 4. 将所有现有用户分配给默认租户
    await queryRunner.query(`
      UPDATE "users" 
      SET "tenantId" = '00000000-0000-0000-0000-000000000001'
    `);

    // 5. 将 tenantId 设为 NOT NULL
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "tenantId" SET NOT NULL
    `);

    // 6. 移除 users 表的 feishuId 唯一约束
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP CONSTRAINT IF EXISTS "UQ_users_feishuId"
    `);

    // 7. 添加 users 表的外键约束
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "FK_users_tenant" 
      FOREIGN KEY ("tenantId") 
      REFERENCES "tenants"("id") 
      ON DELETE CASCADE
    `);

    // 8. 创建组合唯一索引（tenantId + feishuId）
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_users_tenant_feishu" 
      ON "users" ("tenantId", "feishuId")
    `);

    // 9. 为 articles 表添加 tenantId 列
    await queryRunner.query(`
      ALTER TABLE "articles" 
      ADD COLUMN "tenantId" uuid
    `);

    // 10. 基于文章所有者的租户ID更新文章的租户ID
    await queryRunner.query(`
      UPDATE "articles" a
      SET "tenantId" = u."tenantId"
      FROM "users" u
      WHERE a."ownerId" = u."id"
    `);

    // 11. 对于没有所有者的文章，分配给默认租户
    await queryRunner.query(`
      UPDATE "articles" 
      SET "tenantId" = '00000000-0000-0000-0000-000000000001'
      WHERE "tenantId" IS NULL
    `);

    // 12. 将 articles.tenantId 设为 NOT NULL
    await queryRunner.query(`
      ALTER TABLE "articles" 
      ALTER COLUMN "tenantId" SET NOT NULL
    `);

    // 13. 添加 articles 表的外键约束
    await queryRunner.query(`
      ALTER TABLE "articles" 
      ADD CONSTRAINT "FK_articles_tenant" 
      FOREIGN KEY ("tenantId") 
      REFERENCES "tenants"("id") 
      ON DELETE CASCADE
    `);

    // 14. 为 articles.tenantId 创建索引
    await queryRunner.query(`
      CREATE INDEX "IDX_articles_tenantId" 
      ON "articles" ("tenantId")
    `);

    // 15. 添加 ADMIN 角色到 UserRole 枚举
    await queryRunner.query(`
      ALTER TYPE "users_role_enum" 
      ADD VALUE IF NOT EXISTS 'ADMIN'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 回滚操作（按相反顺序）

    // 1. 移除 articles 索引和外键
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_articles_tenantId"`);
    await queryRunner.query(
      `ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "FK_articles_tenant"`,
    );
    await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "tenantId"`);

    // 2. 移除 users 索引和外键
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_tenant_feishu"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_users_tenant"`,
    );

    // 3. 恢复 users.feishuId 唯一约束
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "UQ_users_feishuId" UNIQUE ("feishuId")
    `);

    // 4. 移除 users.tenantId
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tenantId"`);

    // 5. 删除 tenants 表
    await queryRunner.query(`DROP TABLE "tenants"`);

    // 注意：无法移除枚举值，需要手动处理或创建新枚举类型
  }
}
