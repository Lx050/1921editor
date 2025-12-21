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

---

## 项目架构（Legacy Info）

### 核心技术栈
- **Vue 3** + TypeScript - 使用 Composition API
- **Pinia** - 状态管理，严格类型注解
- **Vue Router** - 路由管理，包含路由守卫
- **Vite** - 构建工具，配置了代码分割和代理
- **TailwindCSS** - 样式框架

### 目录结构
```
src/
├── components/          # Vue 组件
│   ├── FloatingToolbar.vue    # 浮动工具栏
│   ├── LayoutInserter.vue     # 版式插入器
│   ├── StyleSelector.vue      # 样式选择器
│   ├── UploadProgress.vue     # 上传进度组件
│   ├── WechatImageGallery.vue # 微信图片画廊
│   └── ErrorBoundary.vue      # 错误边界组件
├── views/               # 页面组件
│   ├── Step1TextInput.vue     # 步骤1：文本输入
│   ├── Step2Curtain.vue       # 步骤2：内容编辑
│   ├── Step3Preview.vue       # 步骤3：预览生成
│   ├── StyleConfig.vue        # 样式配置
│   ├── UserConfig.vue         # 用户配置
│   └── DraftPreview.vue       # 草稿预览
├── stores/              # Pinia 状态管理
│   ├── appStore.ts            # 应用主状态
│   └── configStore.ts         # 配置状态
├── utils/               # 工具函数
│   ├── textParser.ts          # 智能文本解析器
│   ├── styleAssembler.ts      # 样式组装引擎
│   ├── wechatApi.ts           # 微信 API 封装
│   ├── uploadManager.ts       # 上传管理器
│   ├── zipProcessor.ts        # 压缩包处理器
│   └── errorHandler.ts        # 错误处理器
├── styles/              # 样式文件
│   ├── main.css               # 主样式
│   ├── templates.js           # HTML 样式模板
│   ├── styleTemplates.js      # 样式模板配置
│   ├── styleStorage.js        # 样式存储
│   ├── compatibility.css      # 兼容性样式
│   └── loader.css             # 加载器样式
├── types/               # TypeScript 类型定义
│   ├── index.ts               # 通用类型
│   ├── templates.ts           # 模板类型
│   └── wechat.ts              # 微信相关类型
├── config/              # 配置文件
│   └── index.ts               # 应用配置
└── router/              # 路由配置
    └── index.ts               # 路由定义和守卫
```

### 核心功能模块

#### 1. 文本处理流程
- **文本解析** (`utils/textParser.ts`): 支持标注语法（#、##、&、&&）和智能识别
- **内容块管理**: 每个文本块包含类型、内容、图片等信息
- **样式组装** (`utils/styleAssembler.ts`): 将内容块转换为带样式的 HTML

#### 2. 三步工作流
- Step 1: 文本输入和初步处理
- Step 2: 内容编辑和类型标记
- Step 3: 预览生成和 HTML 输出

#### 3. 微信集成
- API 代理配置已解决跨域问题 (`/wechat-api`)
- 支持微信图片上传和管理
- 适配微信公众号发布需求

#### 4. 状态管理
- 使用 Pinia 进行集中状态管理
- 严格的 TypeScript 类型检查
- 路由守卫确保工作流程正确性

### 关键设计原则

1. **类型安全**: 所有 TypeScript 文件必须有正确的类型注解，不使用 `any`
2. **单一职责**: 每个函数/组件只负责一个明确的职责
3. **无向后兼容**: 代码保持简洁，不做旧版本兼容
4. **错误处理**: 关键位置添加适当的错误处理和日志输出
5. **性能优化**:
   - 使用 Vite 的代码分割功能，将大库（mammoth、jszip）单独打包
   - 配置了合理的 chunk 大小限制（1000KB）
   - 启用 CSS 代码分割

### 开发注意事项

- 服务器运行在端口 1921
- 构建输出目录在 `src/dist/`
- 类型错误必须立即修复，优先于缓存问题
- 所有修改遵循最简原则，避免冗余设计
- 注释要丰富，特别是核心业务逻辑
- 更新代码后要及时更新相关文档