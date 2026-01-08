import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateInviteCodeForExistingTenant1736320100000
  implements MigrationInterface
{
  name = 'GenerateInviteCodeForExistingTenant1736320100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 为现有租户生成邀请码（如果没有的话）
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字符
    let inviteCode = '';
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      inviteCode += chars.charAt(randomIndex);
    }

    await queryRunner.query(`
      UPDATE tenants
      SET "inviteCode" = $1, "inviteCodeExpires" = NULL
      WHERE "inviteCode" IS NULL
    `, [inviteCode]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE tenants SET "inviteCode" = NULL`);
  }
}
