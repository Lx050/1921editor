import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTenants1768000000000 implements MigrationInterface {
  name = 'AddUserTenants1768000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "tenantId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_tenants" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_tenants_user_tenant"
      ON "user_tenants" ("userId", "tenantId")
    `);

    await queryRunner.query(`
      ALTER TABLE "user_tenants"
      ADD CONSTRAINT "FK_user_tenants_user"
      FOREIGN KEY ("userId") REFERENCES "users"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "user_tenants"
      ADD CONSTRAINT "FK_user_tenants_tenant"
      FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
      ON DELETE CASCADE
    `);

    // Backfill existing users -> memberships
    await queryRunner.query(`
      INSERT INTO "user_tenants" ("userId", "tenantId")
      SELECT "id", "tenantId"
      FROM "users"
      ON CONFLICT DO NOTHING
    `);

    // Ensure default tenant membership for all users
    await queryRunner.query(`
      INSERT INTO "user_tenants" ("userId", "tenantId")
      SELECT "id", '00000000-0000-0000-0000-000000000001'
      FROM "users"
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_tenants" DROP CONSTRAINT IF EXISTS "FK_user_tenants_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tenants" DROP CONSTRAINT IF EXISTS "FK_user_tenants_user"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_tenants_user_tenant"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "user_tenants"`);
  }
}
