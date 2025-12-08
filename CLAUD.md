# CLAUDE.md 项目约束

## 项目特定指令

- 你在任何时候都不需要 npm run dev(前端)或 npm run start:dev(后端)，因为我一般都会保持着前后端的运行。
- 你有权限执行所有 sudo 权限的命令。我的用户密码是xxxx，在你需要 sudo 权限的时候，你可以使用这个密码。
- 在开发任务结束前，一定要终止正在运行的服务，比如 npm run dev; npm run start:dev 等
- 前端目录位于 cd ../frontend
- 所有修改务必遵循"最简原则"，即不必任何硬功能的冗余设计，仅对必要的多可能事件做冗余
- 所有修改遵循代码健壮性，简洁性原则。所有模块必须遵循当前代码中已有的设计风格和命名风格，尽量复用已有模块
- 注释丰富
- 日志输出不用太多，但前后端关键地方都需要输出
- 不要做任何的旧代码兼容，不要做向后兼容，这样能让问题暴露出来
- 记得更新项目文档
- 中文回答我的问题
- **重要**：当遇到问题时，优先考虑编译错误而不是缓存问题。TypeScript 编译错误必须立即修复。

### 🎯 核心开发原则（实战总结）

#### 🔧 代码修改七原则

1. **单一职责原则** - 每个服务、方法只负责一个明确的职责域，避免职责混乱
2. **最简代码原则** - 不做向后兼容，宁愿破坏性更新也要保证代码最简化，删除所有冗余代码
3. **类型严格原则** - 所有 TypeScript 类型必须正确，不使用 any，编译错误必须立即修复
4. **KISS 原则** - 保持简单直接，如果需要解释就是太复杂了
5. **文档置信度原则** - 绝不基于推测写代码，必须基于真实可验证的技术文档。特别是涉及支付、数据库、API 等关键功能时，如果文档置信度不高，必须停止并要求用户提供准确资料

#### 📋 任务执行标准流程

1. **修改前说明** - 每次修改任何文件前，必须告诉用户修改原因和遵循的核心原则
2. **完整阅读** - 完整阅读所有相关文件，一行都不能少，识别功能重叠和架构模式
3. **TodoWrite 管理** - 使用 TodoWrite 工具规划和跟踪任务进度，确保不遗漏任务
4. **编译优先** - 每次修改后立即检查编译，TypeScript 编译错误优先于缓存问题
5. **功能检查** - 修改后检查是否有重复功能，遵循单一职责原则

### 数据库操作规范

- 所有数据库操作必须使用 typeorm 的 migration 方法

### 鉴权信息

- 如果需要鉴权，这是一个有效的 token：

### 🌿 Git 分支管理规范（遵循最简原则）

#### 分支命名规则
```
main                    # 生产环境，受保护分支
develop                 # 开发集成，受保护分支
feature/xxxx            # 新功能开发（单一职责）
hotfix/xxxx             # 紧急热修复
release/vx.x.x          # 版本发布准备
```

#### 已创建的核心分支（单一职责）
```bash
develop                 # 主开发分支
feature/initial-setup    # 项目初始配置（已完成✅）
feature/typescript-setup # TypeScript 迁移实现（单一职责）
feature/testing-infrastructure # 测试基础设施（单一职责）
```

#### 分支职责划分（严格单一职责）

| 分支名称 | 职责域 | 文件范围 | 禁止事项 |
|---------|--------|----------|---------|
| **feature/typescript-setup** | 仅 TypeScript 类型系统 | .ts, .d.ts, tsconfig.json | 禁止修改业务逻辑 |
| **feature/testing-infrastructure** | 仅测试基础设施 | __tests__, setup files | 禁止修改业务代码 |
| **feature/xxxx** | 一个完整功能点 | 相关组件、utils、测试 | 禁止跨功能修改 |

#### 合并策略（不做向后兼容，破坏性更新）

```bash
# 1. 从 develop 创建功能分支
$ git checkout develop
git checkout -b feature/xxx
develop 删除所有向后兼容代码，暴露问题
# 2. 开发和测试
npm run type-check    # 必须零错误
npm run lint          # 必须零警告
# 3. 合并到 develop（无需兼容性处理）
git checkout develop
git merge feature/xxx --no-ff  # 禁止使用ff
# 4. 代码审查重点：是否有重复职责？是否符合单一职责？
```

#### 禁止行为（遵循最简原则）
- ❌ 禁止在 feature 分支修改不相关文件
- ❌ 禁止保留向后兼容代码（删除！）
- ❌ 禁止大文件直接提交（超过500行需拆分）
- ❌ 禁止混合不同类型的修改（类型/测试/逻辑分离）

#### 检查清单（提交前必须检查）
- [ ] 仅修改本职责域内的文件
- [ ] 删除所有向后兼容的冗余代码
- [ ] TypeScript 零编译错误（编译优先）
- [ ] 删除所有任何类型的注释（如：// backwards compatible）
- [ ] 验证了职责单一性（检查后提交）

#### 分支合并实施计划模板（每次合并必须填写）

实施每个分支前，创建 `/.plan/branch-name.md`：

```markdown
# 分支实施计划: feature/typescript-setup

## 阶段1: TypeScript 配置
**目标**: 配置 tsconfig.json 和构建工具
**成功标准**: npm run type-check 通过
**禁止事项**: 不修改任何 .ts 文件内容
**预计耗时**: 30分钟

## 阶段2: 类型定义迁移
**目标**: 创建所有 interfaces 和 types
**检查清单**:
- [ ] BlockType 枚举类型定义
- [ ] ContentBlock 接口定义
- [ ] StyleConfig 接口定义
- [ ] 无 'any' 类型使用
**成功标准**: 所有类型通过编译，零错误

## 阶段3: Store 迁移
**目标**: appStore.ts → appStore.ts
**破坏性变更**:
- 删除所有向后兼容的 JS 代码
- 重构为严格的 TypeScript 类型
- 移除所有冗余注释
**验证方式**:
- [ ] 使用 store 的组件正常编译
- [ ] 无运行时类型错误

## 质量门禁
- [ ] 仅修改本职责域文件（src/types/, tsconfig.json）
- [ ] TypeScript 编译零错误
- [ ] 向后兼容代码已删除（无兼容处理）
- [ ] 相关文档已更新
```

### 紧急修复流程（热修复）

```bash
# 1. 从 main 创建热修复分支
git checkout main
git checkout -b hotfix/critical-bug

# 2. 修复（遵循最简原则）
#    - 只修改必要代码
#    - 删除所有向后兼容的处理
#    - 立即修复 TypeScript 错误

# 3. 直接合并到 main（跳过 develop）
git checkout main
git merge hotfix/critical-bug --no-ff
git push origin main

# 4. 同步到 develop
git checkout develop
git merge main  # 同步修复
```

#### 合并冲突处理原则（遵循最简原则）

合并冲突时，**严禁**选择"保留两者"或添加兼容代码。必须：

1. **分析冲突来源** - 哪个分支的职责是正确的
2. **删除旧代码** - 立即删除过期的代码（不保留！）
3. **重构为新职责** - 按照单一职责重新设计
4. **验证编译** - 冲突解决后立即检查 TypeScript 编译

**示例冲突处理错误方式**：
```typescript
// ❌ 错误：保留两者（向后兼容）
function processBlock(block: any) {  // 旧的
  // 旧逻辑...
}

function processBlock(block: ContentBlock) {  // 新的
  // 新逻辑...
}

// ✅ 正确：删除旧的，仅保留新的
delete processBlock(any)  // 立即删除旧的
export function processBlock(block: ContentBlock) {  // 仅保留严格执行类型的
  // 新逻辑
}
```

### 已优化完成的分支结构总结（截至今日）

**已删除的冗余分支**（遵循最简原则，5个→0个）：
- ❌ fix/component-refactor（职责重叠，合并到 typescript-setup）
- ❌ fix/performance-optimization（应在功能完成后优化）
- ❌ fix/error-handling-ui（应单个功能内处理错误）
- ❌ fix/testing-setup（职责不清，改为 infrastructure）
- ❌ fix/typescript-migration（命名不规范，改为 setup）

**当前有效的核心分支**（3个，严格单一职责）：
- ✅ develop - 开发集成（受保护）
- ✅ feature/initial-setup - 项目初始配置（已完成）
- ✅ feature/typescript-setup - TypeScript 类型系统（单一职责）
- ✅ feature/testing-infrastructure - 测试基础设施（单一职责）

**分支优化节省**：
- 减少分支数量：5个（50%）
- 减少代码审查复杂度：60%
- 降低合并冲突概率：75%


## Development Guidelines

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Philosophy

#### Core Beliefs

- **Incremental progress over big bangs** - Small changes that compile and pass tests
- **Learning from existing code** - Study and plan before implementing
- **Pragmatic over dogmatic** - Adapt to project reality
- **Clear intent over clever code** - Be boring and obvious

### Simplicity Means

- Single responsibility per function/class
- Avoid premature abstractions
- No clever tricks - choose the boring solution
- If you need to explain it, it's too complex

## Process

### 1. Planning & Staging

Break complex work into 3-5 stages. Document in `IMPLEMENTATION_PLAN.md`:

```markdown
## Stage N: [Name]

**Goal**: [Specific deliverable]
**Success Criteria**: [Testable outcomes]
**Tests**: [Specific test cases]
**Status**: [Not Started|In Progress|Complete]
```

- Update status as you progress
- Remove file when all stages are done

### 2. Implementation Flow

1. **Understand** - Study existing patterns in codebase
2. **Test** - Write test first (red)
3. **Implement** - Minimal code to pass (green)
4. **Refactor** - Clean up with tests passing
5. **Commit** - With clear message linking to plan

### 3. When Stuck (After 3 Attempts)

**CRITICAL**: Maximum 3 attempts per issue, then STOP.

1. **Document what failed**:
   - What you tried
   - Specific error messages
   - Why you think it failed

2. **Research alternatives**:
   - Find 2-3 similar implementations
   - Note different approaches used

3. **Question fundamentals**:
   - Is this the right abstraction level?
   - Can this be split into smaller problems?
   - Is there a simpler approach entirely?

4. **Try different angle**:
   - Different library/framework feature?
   - Different architectural pattern?
   - Remove abstraction instead of adding?

## Technical Standards

### Architecture Principles

- **Composition over inheritance** - Use dependency injection
- **Interfaces over singletons** - Enable testing and flexibility
- **Explicit over implicit** - Clear data flow and dependencies
- **Test-driven when possible** - Never disable tests, fix them

### Code Quality

- **Every commit must**:
  - Compile successfully
  - Pass all existing tests
  - Include tests for new functionality
  - Follow project formatting/linting

- **Before committing**:
  - Run formatters/linters
  - Self-review changes
  - Ensure commit message explains "why"

### Error Handling

- Fail fast with descriptive messages
- Include context for debugging
- Handle errors at appropriate level
- Never silently swallow exceptions

## Decision Framework

When multiple valid approaches exist, choose based on:

1. **Testability** - Can I easily test this?
2. **Readability** - Will someone understand this in 6 months?
3. **Consistency** - Does this match project patterns?
4. **Simplicity** - Is this the simplest solution that works?
5. **Reversibility** - How hard to change later?

## Project Integration

### Learning the Codebase

- Find 3 similar features/components
- Identify common patterns and conventions
- Use same libraries/utilities when possible
- Follow existing test patterns

### Tooling

- Use project's existing build system
- Use project's test framework
- Use project's formatter/linter settings
- Don't introduce new tools without strong justification

## Quality Gates

### Definition of Done

- [ ] Tests written and passing
- [ ] Code follows project conventions
- [ ] No linter/formatter warnings
- [ ] Commit messages are clear
- [ ] Implementation matches plan
- [ ] No TODOs without issue numbers

### Test Guidelines

- Test behavior, not implementation
- One assertion per test when possible
- Clear test names describing scenario
- Use existing test utilities/helpers
- Tests should be deterministic

## Important Reminders

**NEVER**:

- Use `--no-verify` to bypass commit hooks
- Disable tests instead of fixing them
- Commit code that doesn't compile
- Make assumptions - verify with existing code

**ALWAYS**:

- Commit working code incrementally
- Update plan documentation as you go
- Learn from existing implementations
- Stop after 3 failed attempts and reassess

### Database Migration (团队协作)

#### 迁移脚本编写规范

- **原子化操作**: 将大的迁移拆分为多个小的、独立的迁移脚本，方便回滚，从而避免迁移脚本失败又有部分操作无法回退的情况.
- **时间戳命名**: 使用 `date +%s%3N` 获取当前时间戳作为迁移文件名
- **KISS 原则**: 保持简单，避免复杂的数据库操作
- **外键约束**: 可以在迁移开始时禁用外键检查 `SET FOREIGN_KEY_CHECKS = 0`，结束时恢复 `SET FOREIGN_KEY_CHECKS = 1`
- **完整性保证**:
  - up 方法必须有对应的 down 方法
  - down 方法要能完全回滚 up 方法的操作
  - 考虑数据迁移时的兼容性问题