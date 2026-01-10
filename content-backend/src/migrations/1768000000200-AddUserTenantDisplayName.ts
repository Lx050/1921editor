import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTenantDisplayName1768000000200 implements MigrationInterface {
  name = 'AddUserTenantDisplayName1768000000200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_tenants"
      ADD COLUMN IF NOT EXISTS "displayName" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_tenants"
      DROP COLUMN IF EXISTS "displayName"
    `);
  }
}
