import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateStyleTemplatesTable1736430000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'style_templates',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
            comment: '样式名称',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '20',
            isNullable: false,
            comment: '样式类型：title/body/intro',
          },
          {
            name: 'preview',
            type: 'text',
            isNullable: false,
            comment: '预览 HTML',
          },
          {
            name: 'full_example',
            type: 'text',
            isNullable: false,
            comment: '完整示例 HTML',
          },
          {
            name: 'is_custom',
            type: 'boolean',
            default: false,
            comment: '是否为自定义样式',
          },
          {
            name: 'tenant_id',
            type: 'uuid',
            isNullable: true,
            comment: '租户ID（系统默认样式为null）',
          },
          {
            name: 'owner_id',
            type: 'uuid',
            isNullable: true,
            comment: '创建者ID（系统默认样式为null）',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // 创建索引
    await queryRunner.createIndex(
      'style_templates',
      new TableIndex({
        name: 'IDX_style_templates_tenant_type',
        columnNames: ['tenant_id', 'type'],
      }),
    );

    await queryRunner.createIndex(
      'style_templates',
      new TableIndex({
        name: 'IDX_style_templates_owner',
        columnNames: ['owner_id'],
      }),
    );

    // 创建外键
    await queryRunner.createForeignKey(
      'style_templates',
      new TableForeignKey({
        columnNames: ['tenant_id'],
        referencedTableName: 'tenants',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'style_templates',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('style_templates');
  }
}
