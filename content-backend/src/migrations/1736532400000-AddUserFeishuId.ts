import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFeishuId1736532400000 implements MigrationInterface {
  name = 'AddUserFeishuId1736532400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 添加 feishu_id 字段
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "feishu_id" VARCHAR(128) NULL
    `);

    // 添加索引以支持快速查找
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_feishu_id" ON "users" ("feishu_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_feishu_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "feishu_id"`,
    );
  }
}
