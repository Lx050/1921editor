import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserLastLoginAt1766340200000 implements MigrationInterface {
  name = 'AddUserLastLoginAt1766340200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastloginat" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "lastloginat"`,
    );
  }
}
