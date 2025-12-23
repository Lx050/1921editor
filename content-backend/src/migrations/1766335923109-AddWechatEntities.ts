import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWechatEntities1766335923109 implements MigrationInterface {
    name = 'AddWechatEntities1766335923109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_tenant"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_articles_tenant"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_tenant_feishu"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_articles_tenantId"`);
        await queryRunner.query(`CREATE TABLE "wechat_authorizers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenantId" uuid NOT NULL, "authorizerAppId" character varying NOT NULL, "authorizerAccessToken" text, "authorizerRefreshToken" text, "expiresAt" TIMESTAMP, "nickName" character varying, "headImg" character varying, "userName" character varying, "principalName" character varying, "serviceTypeInfo" jsonb, "verifyTypeInfo" jsonb, "alias" character varying, "qrcodeUrl" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_27f5302591ea9b84216f76b16b3" UNIQUE ("authorizerAppId"), CONSTRAINT "PK_0e2510f408dc91c1d94c211d489" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74a1821304e1f9e62be5bc9bff" ON "wechat_authorizers" ("tenantId", "authorizerAppId") `);
        await queryRunner.query(`CREATE TABLE "wechat_platform_config" ("id" SERIAL NOT NULL, "componentVerifyTicket" character varying, "componentAccessToken" text, "tokenExpiresAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c71135fa0ded6382a19354f6cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "isactive"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "createdat"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "updatedat"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_f1b4e50d435570b5abdf6341f05"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isactive" SET NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a80f2b71c4ce62405b1686a13b" ON "users" ("tenantId", "feishuId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ee1c1577f1e3cfc6629cec86f5" ON "articles" ("tenantId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_ee1c1577f1e3cfc6629cec86f57" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wechat_authorizers" ADD CONSTRAINT "FK_f12f88d87e969f03990b152ab62" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wechat_authorizers" DROP CONSTRAINT "FK_f12f88d87e969f03990b152ab62"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_ee1c1577f1e3cfc6629cec86f57"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee1c1577f1e3cfc6629cec86f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a80f2b71c4ce62405b1686a13b"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isactive" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_f1b4e50d435570b5abdf6341f05" UNIQUE ("feishuId")`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "updatedat" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "createdat" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "isactive" boolean DEFAULT true`);
        await queryRunner.query(`DROP TABLE "wechat_platform_config"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74a1821304e1f9e62be5bc9bff"`);
        await queryRunner.query(`DROP TABLE "wechat_authorizers"`);
        await queryRunner.query(`CREATE INDEX "IDX_articles_tenantId" ON "articles" ("tenantId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_tenant_feishu" ON "users" ("feishuId", "tenantId") `);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_articles_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_tenant" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
