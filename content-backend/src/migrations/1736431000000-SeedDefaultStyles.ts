import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultStyles1736431000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 插入默认标题样式
    await queryRunner.query(`
      INSERT INTO style_templates (id, name, type, preview, full_example, is_custom, tenant_id, owner_id) VALUES
      ('10000000-0000-0000-0000-000000000001', 'Mac窗口标题', 'title', 
      '<div style="background: #f0f0f0; border-radius: 6px; padding: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"><div style="display: flex; gap: 4px; margin-bottom: 6px;"><div style="width: 8px; height: 8px; border-radius: 50%; background: #ff5f56;"></div><div style="width: 8px; height: 8px; border-radius: 50%; background: #ffbd2e;"></div><div style="width: 8px; height: 8px; border-radius: 50%; background: #27c93f;"></div></div><div style="height: 4px; background: #ddd; border-radius: 2px; width: 60%;"></div></div>',
      '<section class="_135editor" data-role="paragraph" style="margin: 20px 0;"><section style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;"><section style="background: #e9ecef; padding: 10px 15px; display: flex; align-items: center; border-bottom: 1px solid #dee2e6;"><div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; margin-right: 8px;"></div><div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; margin-right: 8px;"></div><div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div></section><section style="padding: 20px;"><p style="margin: 0; font-size: 16px; line-height: 1.75em; text-align: center; font-weight: normal; color: #333;">{{CONTENT}}</p></section></section></section>',
      false, NULL, NULL),
      
      ('10000000-0000-0000-0000-000000000002', 'INS风极简', 'title',
      '<div style="text-align: center; padding: 8px;"><span style="display: inline-block; border-bottom: 1px solid #333; padding-bottom: 2px; font-size: 12px;">INS STYLE</span></div>',
      '<section class="_135editor" data-role="paragraph" style="margin: 30px 0; text-align: center;"><section style="display: inline-block; position: relative; padding: 0 10px;"><span style="display: block; font-size: 12px; color: #999; letter-spacing: 4px; margin-bottom: 5px;">TITLE</span><span style="display: block; font-size: 16px; color: #333; font-weight: normal; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 8px; line-height: 1.75em;">{{CONTENT}}</span></section></section>',
      false, NULL, NULL),

      ('20000000-0000-0000-0000-000000000001', 'Mac代码窗', 'body',
      '<div style="background: #282c34; border-radius: 4px; padding: 6px;"><div style="display: flex; gap: 2px; margin-bottom: 4px;"><div style="width: 4px; height: 4px; border-radius: 50%; background: #ff5f56;"></div><div style="width: 4px; height: 4px; border-radius: 50%; background: #ffbd2e;"></div><div style="width: 4px; height: 4px; border-radius: 50%; background: #27c93f;"></div></div><div style="height: 2px; background: #3e4451; width: 80%;"></div></div>',
      '<section class="_135editor" data-role="paragraph" style="margin: 20px 0;"><section style="background: #282c34; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); overflow: hidden;"><section style="background: #21252b; padding: 10px 15px; display: flex; align-items: center;"><div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; margin-right: 8px;"></div><div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; margin-right: 8px;"></div><div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div></section><section style="padding: 20px; color: #abb2bf; font-family: Consolas, Monaco, ''Andale Mono'', ''Ubuntu Mono'', monospace; font-size: 14px; line-height: 1.6;"><p style="margin: 0;">{{CONTENT}}</p></section></section></section>',
      false, NULL, NULL),

      ('30000000-0000-0000-0000-000000000001', '大引号引言', 'intro',
      '<div style="text-align: center; font-size: 20px; color: #ddd; font-weight: bold;">“ ”</div>',
      '<section class="_135editor" data-role="paragraph" style="margin: 30px 0; text-align: center;"><span style="font-size: 60px; color: #f0f0f0; font-family: Arial, sans-serif; line-height: 0.5; display: block;">“</span><section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent; margin: -20px 20px 0;"><p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify"><span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, ''Microsoft YaHei'', SimHei, STHeiti;">{{CONTENT}}</span></p></section><span style="font-size: 60px; color: #f0f0f0; font-family: Arial, sans-serif; line-height: 0.5; display: block; margin-top: 10px;">”</span></section>',
      false, NULL, NULL)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM style_templates WHERE is_custom = false`,
    );
  }
}
