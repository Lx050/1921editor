import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWechatCredentialTokens1768000000100 implements MigrationInterface {
  name = 'AddWechatCredentialTokens1768000000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "wechat_credential_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" character varying NOT NULL,
        "tenantId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "appId" character varying NOT NULL,
        "appSecret" character varying NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "used" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_wechat_credential_tokens" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_wechat_credential_tokens_token"
      ON "wechat_credential_tokens" ("token")
    `);

    await queryRunner.query(`
      ALTER TABLE "wechat_credential_tokens"
      ADD CONSTRAINT "FK_wechat_credential_tokens_tenant"
      FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "wechat_credential_tokens"
      ADD CONSTRAINT "FK_wechat_credential_tokens_user"
      FOREIGN KEY ("userId") REFERENCES "users"("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wechat_credential_tokens" DROP CONSTRAINT IF EXISTS "FK_wechat_credential_tokens_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wechat_credential_tokens" DROP CONSTRAINT IF EXISTS "FK_wechat_credential_tokens_tenant"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_wechat_credential_tokens_token"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "wechat_credential_tokens"`);
  }
}
