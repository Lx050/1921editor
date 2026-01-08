---
name: typeorm-migration-writer
description: 用于编写符合团队规范的 TypeORM Migration 脚本。当用户请求创建、编写或生成 migration 脚本时触发，包括新增/修改/删除表字段、创建/删除表、索引和外键管理、数据迁移等数据库结构变更任务。
---

# TypeORM Migration Writer

NestJS + TypeORM + PostgreSQL 项目的数据库迁移脚本编写指导。

## 核心规范

### 🚫 强制禁止

- **禁止自动生成**: 不使用 `migration:generate` 命令，必须手动编写
- **禁止直接修改数据库**: 不使用 SQL 或图形化工具直接修改表结构
- **禁用 synchronize**: TypeORM 配置中 `synchronize: false`

### ✅ 必须遵守

1. **原子化操作** - 拆分为多个小的独立脚本，方便回滚
2. **时间戳命名** - 文件名格式：`<timestamp>-<描述>.ts`，使用 `date +%s%3N` 生成时间戳
3. **KISS 原则** - 保持简单，避免复杂操作
4. **完整性保证** - `up()` 必须有对应的 `down()` 方法，且能完全回滚

## 基本结构

```typescript
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserEmail1734567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        length: '255',
        isNullable: true,
        comment: '用户邮箱',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'email');
  }
}
```

## 常用操作

**新增字段**: `queryRunner.addColumn(tableName, new TableColumn({...}))`
**删除字段**: `queryRunner.dropColumn(tableName, columnName)`
**修改字段**: `queryRunner.changeColumn(tableName, columnName, new TableColumn({...}))`
**重命名字段**: `queryRunner.renameColumn(tableName, oldName, newName)`
**创建表**: `queryRunner.createTable(new Table({...}))`
**删除表**: `queryRunner.dropTable(tableName)`
**创建索引**: `queryRunner.createIndex(tableName, new TableIndex({...}))`
**创建外键**: `queryRunner.createForeignKey(tableName, new TableForeignKey({...}))`

## 外键处理

复杂数据迁移时可临时禁用外键检查：

```typescript
await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
// 执行操作
await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
```

## 工作流程

1. 生成时间戳：`date +%s%3N`
2. 创建文件：`<timestamp>-<描述>.ts`
3. 编写 `up()` 和 `down()` 方法
4. 测试：`npm run migration:run`
5. 飞书群通知团队

## 团队通知模板

```text
📢 【数据库变更通知】
分支：feature/xxx
涉及表：<表名>
主要变更：<简要描述>
Migration 文件：<文件名>

⚠️ 请执行：
git pull origin develop
npm run migration:run
```

## 特殊场景

**修改字段类型需数据转换**：先新增临时字段 → 迁移数据 → 删除旧字段
**删除字段/表**：必须先在团队群内讨论确认（至少 24 小时）
**复杂重构**：拆分为多个 Migration，每个只做一件事
