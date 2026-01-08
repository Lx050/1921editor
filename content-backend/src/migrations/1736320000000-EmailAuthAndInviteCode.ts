import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmailAuthAndInviteCode1736320000000 implements MigrationInterface {
  name = 'EmailAuthAndInviteCode1736320000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==================== USERS 表修改 ====================

    // 1. 删除旧的飞书相关索引
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_a80f2b71c4ce62405b1686a13b"`,
    ); // (tenantId, feishuId)

    // 2. 删除 feishuId 列
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "feishuId"`,
    );

    // 3. 处理现有的 null email 值（先删除这些用户，因为他们使用飞书登录）
    await queryRunner.query(`DELETE FROM "users" WHERE "email" IS NULL`);

    // 4. 修改 email 列为必填且唯一
    const hasEmailUnique = await queryRunner.query(`
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_name = 'users'
        AND constraint_type = 'UNIQUE'
        AND constraint_name LIKE '%email%'
    `);
    if (!hasEmailUnique.length) {
      await queryRunner.query(
        `ALTER TABLE "users" ADD CONSTRAINT "UQ_users_email" UNIQUE ("email")`,
      );
    }
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`,
    );

    // 4. 添加新的邮箱密码相关列
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emailVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verificationToken" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resetPasswordToken" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP`,
    );

    // 5. 创建新的索引
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_users_tenant_email" ON "users" ("tenantId", "email") `,
    );

    // ==================== TENANTS 表修改 ====================

    // 6. 删除飞书配置列
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP COLUMN IF EXISTS "feishuAppId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP COLUMN IF EXISTS "feishuAppSecret"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP COLUMN IF EXISTS "feishuBaseAppToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP COLUMN IF EXISTS "feishuBaseTableId"`,
    );

    // 7. 添加邀请码相关列
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "inviteCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "inviteCodeExpires" TIMESTAMP`,
    );

    // 8. 创建邀请码唯一索引
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_tenants_invite_code" ON "tenants" ("inviteCode") WHERE "inviteCode" IS NOT NULL`,
    );

    // ==================== 创建新表 ====================

    // 9. 创建邮箱验证令牌表
    await queryRunner.query(`
      CREATE TABLE "email_verification_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "token" character varying NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_email_verification_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_email_verification_tokens_token" UNIQUE ("token")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_email_verification_tokens_email" ON "email_verification_tokens" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_email_verification_tokens_expires" ON "email_verification_tokens" ("expiresAt")`,
    );

    // 10. 创建密码重置令牌表
    await queryRunner.query(`
      CREATE TABLE "password_reset_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "token" character varying NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "used" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_password_reset_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_password_reset_tokens_token" UNIQUE ("token")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_password_reset_tokens_email" ON "password_reset_tokens" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_password_reset_tokens_expires" ON "password_reset_tokens" ("expiresAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ==================== 删除新表 ====================

    await queryRunner.query(`DROP TABLE IF EXISTS "password_reset_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "email_verification_tokens"`);

    // ==================== TENANTS 表回退 ====================

    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_tenants_invite_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP COLUMN IF EXISTS "inviteCodeExpires"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" DROP COLUMN IF EXISTS "inviteCode"`,
    );

    // 恢复飞书配置列
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "feishuBaseTableId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "feishuBaseAppToken" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "feishuAppSecret" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "feishuAppId" character varying`,
    );

    // ==================== USERS 表回退 ====================

    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."IDX_users_tenant_email"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_users_email"`);

    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "resetPasswordExpires"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "resetPasswordToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "verificationToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "emailVerified"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "password"`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_users_email"`,
    );

    // 恢复 feishuId 列
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "feishuId" character varying NOT NULL`,
    );

    // 恢复旧的飞书索引
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a80f2b71c4ce62405b1686a13b" ON "users" ("tenantId", "feishuId") `,
    );
  }
}
