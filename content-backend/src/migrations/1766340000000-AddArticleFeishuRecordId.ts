import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArticleFeishuRecordId1766340000000
  implements MigrationInterface
{
  name = 'AddArticleFeishuRecordId1766340000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "feishurecordid" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles" DROP COLUMN IF EXISTS "feishurecordid"`,
    );
  }
}
