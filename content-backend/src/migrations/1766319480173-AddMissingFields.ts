import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingFields1766319480173 implements MigrationInterface {
  name = 'AddMissingFields1766319480173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 为 users 表添加缺失的字段
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP`,
    );

    // 为 tenants 表添加缺失的字段
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "settings" jsonb DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除添加的字段
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLoginAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
    await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "settings"`);
    await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "isActive"`);
  }
}
