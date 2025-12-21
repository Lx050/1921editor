import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建 users 表
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "feishuId" character varying NOT NULL,
                "name" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'EDITOR',
                "email" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_feishuId" UNIQUE ("feishuId"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

    // 创建 articles 表
    await queryRunner.query(`
            CREATE TABLE "articles" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "title" character varying,
                "config" jsonb,
                "content" text,
                "images" jsonb DEFAULT '[]',
                "status" character varying NOT NULL DEFAULT 'DRAFT',
                "wechatResult" jsonb,
                "ownerId" uuid,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_articles" PRIMARY KEY ("id")
            )
        `);

    // 添加外键约束
    await queryRunner.query(`
            ALTER TABLE "articles"
            ADD CONSTRAINT "FK_articles_ownerId"
            FOREIGN KEY ("ownerId")
            REFERENCES "users"("id")
            ON DELETE SET NULL
            ON UPDATE NO ACTION
        `);

    // 创建索引
    await queryRunner.query(`
            CREATE INDEX "IDX_users_feishuId" ON "users" ("feishuId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_articles_ownerId" ON "articles" ("ownerId")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_articles_status" ON "articles" ("status")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_articles_createdAt" ON "articles" ("createdAt")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_articles_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_articles_status"`);
    await queryRunner.query(`DROP INDEX "IDX_articles_ownerId"`);
    await queryRunner.query(`DROP INDEX "IDX_users_feishuId"`);
    await queryRunner.query(
      `ALTER TABLE "articles" DROP CONSTRAINT "FK_articles_ownerId"`,
    );
    await queryRunner.query(`DROP TABLE "articles"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
