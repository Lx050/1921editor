import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArticleParticipantsFields1766319183959 implements MigrationInterface {
  name = 'AddArticleParticipantsFields1766319183959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 添加 planner, copywriter, editor 字段到 articles 表
    await queryRunner.query(
      `ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "planners" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "copywriters" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "editors" jsonb NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 删除添加的字段
    await queryRunner.query(
      `ALTER TABLE "articles" DROP COLUMN IF EXISTS "planners"`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" DROP COLUMN IF EXISTS "copywriters"`,
    );
    await queryRunner.query(
      `ALTER TABLE "articles" DROP COLUMN IF EXISTS "editors"`,
    );
  }
}
