import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIsActive1766340100000 implements MigrationInterface {
  name = 'AddUserIsActive1766340100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isactive" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "isactive"`,
    );
  }
}
