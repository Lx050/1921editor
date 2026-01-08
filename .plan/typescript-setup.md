# 分支实施计划: feature/typescript-setup

*遵循 CLAUD.md 最简原则、单一职责原则、编译优先原则*

## 阶段1: TypeScript 配置（不修改任何业务代码）
**目标**: 配置 tsconfig.json 和构建工具
**成功标准**: `npm run type-check` 通过（零错误、零警告）
**禁止事项**: 不修改任何 .ts/.vue 文件内容（严格单一职责）
**预计耗时**: 15分钟

### 实施步骤:
1. 安装 TypeScript 相关依赖
2. 创建 tsconfig.json（基于 @vue/tsconfig）
3. 添加 type-check 脚本
4. 验证配置正确性（不应有类型错误）

### 质量门禁:
- [ ] TypeScript 配置生效
- [ ] type-check 脚本可用
- [ ] 零类型错误
- [ ] 未修改任何业务文件

---

## 阶段2: 核心类型定义创建（不实现逻辑）
**目标**: 创建所有 interfaces 和 types
**成功标准**: 所有类型通过编译，零 'any'，零错误
**文件范围**: src/types/xxx.ts（新建目录，单一职责）
**禁止事项**: 不修改任何实现代码，仅创建类型定义

### 需要创建的类型:

#### `src/types/index.ts`
```typescript
export type BlockType = 'title' | 'body' | 'intro' | 'outro' | 'image_single' | 'image_double';

export interface ContentBlock {
  id: string;
  type: BlockType;
  text: string;
  meta?: Record<string, unknown>;
}

export interface StyleTemplate {
  html: string;
  css: string;
  fullExample: string;
}

export interface StyleConfig {
  title?: StyleTemplate;
  body?: StyleTemplate;
  intro?: StyleTemplate;
  outro?: StyleTemplate;
}

export interface AppStoreState {
  currentStep: number;
  rawText: string;
  contentBlocks: ContentBlock[];
  styleConfig: StyleConfig | null;
}
```

### 质量门禁:
- [ ] 所有类型正确定义（无 any）
- [ ] 类型通过编译测试
- [ ] 未修改任何实现文件（仅创建新类型文件）
- [ ] 类型命名符合项目规范

---

## 阶段3: Pinia Store 迁移（破坏性变更）
**目标**: appStore.js → appStore.ts（完全迁移，不兼容JS）
**破坏性变更**（遵循最简原则，不做向后兼容）:
- 删除所有向后兼容的 JS 代码（立即删除，不保留！）
- 重构为严格的 TypeScript 类型（无 'any'）
- 移除所有冗余注释
- 删除所有类型断言（如 `as any`）

**文件范围**: src/stores/appStore.ts（直接重命名，不保留js）

### 实施步骤:
1. 重命名 appStore.js → appStore.ts
2. 添加 TypeScript 类型注解
3. 删除所有向后兼容代码
4. 使用定义好的接口类型
5. 验证所有使用该 Store 的组件编译通过

### 质量门禁:
- [ ] appStore.ts 类型通过编译
- [ ] 无 'any' 类型使用
- [ ] 未保留向后兼容代码
- [ ] 使用 Store 的组件正常编译
- [ ] 删除所有冗余类型注释

---

## 阶段4: 工具函数迁移（小步快跑）
**目标**: 依次迁移 utils/ 目录到 TypeScript
**文件顺序**（从最简单到最复杂）:
1. src/utils/index.ts（导出文件）
2. src/utils/helpers.ts（简单工具函数）
3. src/utils/styleAssembler.ts（中等复杂度）
4. src/utils/textParser.ts（高复杂度，最后迁移）

### 迁移规范:
```typescript
// ❌ 禁止：向后兼容的 JS 代码
export function parseText(text: any) {  // any 类型！
  return text.split('\n');
}

// ✅ 正确：严格 TypeScript
export function parseText(text: string): string[] {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: text must be a non-empty string');
  }
  return text.split('\n');
}
```

### 质量门禁（每个文件）:
- [ ] 函数签名有完整类型注解
- [ ] 参数和返回值类型明确（无 any）
- [ ] 错误处理有类型保护
- [ ] 删除向后兼容代码
- [ ] 通过单元测试

---

## 阶段5: Vue 组件迁移（按使用频率）
**目标**: .vue 文件 script 部分迁移到 TypeScript
**优先级顺序**:
1. 公共组件（components/）
   - StyleSelector.vue（简单）
   - LayoutInserter.vue（简单）
   - FloatingToolbar.vue（中等）

2. 页面组件（views/）
   - Step3Preview.vue（简单）
   - Step1TextInput.vue（中等）
   - Step2Curtain.vue（复杂，649行需重构）

3. 根组件
   - App.vue（最后迁移）

### 组件迁移规范:
```vue
<script setup lang="ts">
// ❌ 禁止：松散类型
const props = defineProps([
  'contentBlocks',  // 无类型！
  'styleConfig'
]);

// ✅ 正确：严格类型
interface Props {
  contentBlocks: ContentBlock[];
  styleConfig?: StyleConfig | null;
}

const props = withDefaults(defineProps<Props>(), {
  styleConfig: null
});
```

### 质量门禁（每个组件）:
- [ ] `<script setup lang="ts">` 声明
- [ ] Props 有 TypeScript 接口定义
- [ ] Emits 有类型定义
- [ ] 内部变量有类型注解
- [ ] computed 有返回类型
- [ ] 函数参数和返回值有类型
- [ ] 删除所有 `as any` 断言
- [ ] 组件编译零错误

---

## 最终验证（提交前必须检查）

### TypeScript 严格检查:
```bash
# 1. 类型检查
npm run type-check    # 必须零错误！

# 2. ESLint 检查
npm run lint          # 必须零警告！

# 3. 构建验证
npm run build         # 必须成功！

# 4. 运行验证
npm run dev           # 应用正常启动
```

### 代码质量门禁（CLAUD.md 原则）:
- [ ] **类型严格原则**: 零 'any' 类型
- [ ] **最简代码原则**: 删除所有向后兼容代码
- [ ] **单一职责原则**: 仅修改 TypeScript 迁移相关文件
- [ ] **编译优先原则**: TypeScript 编译零错误（优先于功能测试）
- [ ] **KISS原则**: 代码简单直接，无需复杂解释

### 破坏性变更检查:
- [ ] 删除所有 `.js` 文件（除必要配置）
- [ ] 删除所有类型注释（如 `// @ts-ignore`）
- [ ] 删除向后兼容代码（如 `if (typeof x === 'undefined')` 等）
- [ ] 删除冗余的类型转换（如 `as unknown as T`）

---

## 提交信息规范（每次提交）

### 阶段1提交:
```bash
git commit -m "chore: setup TypeScript and build configuration

- Add TypeScript 5.0+ dependencies
- Configure tsconfig.json with strict mode
- Add type-check script to package.json
- Update Vite config for TypeScript support

No business logic changes made."
```

### 阶段2提交:
```bash
git commit -m "feat: add core type definitions

- Define BlockType, ContentBlock, StyleConfig interfaces
- Create src/types/ directory
- Add JSDoc comments for all types

All types are strict, no 'any' used."
```

### 阶段3-5提交（每个文件）:
```bash
git commit -m "refactor: migrate appStore to TypeScript

**BREAKING CHANGE**: appStore.js renamed to appStore.ts

Changes:
- Add full TypeScript type annotations
- Remove all backward compatibility code
- Delete redundant comments
- Use strict ContentBlock and StyleConfig types

Verification:
- [x] TypeScript compilation passes
- [x] All dependent components compile
- [x] No 'any' types used
- [x] No backward compatible code retained"
```

---

## 风险评估与处理

### 高风险项:
1. **Step2Curtain.vue (649行)** - 文件过大，迁移可能引入错误
   - **对策**: 先重构组件（拆分为子组件），再迁移
   - **决策**: 如果超过2小时，停止并请示

2. **textParser.js 复杂度** - 正则表达式和字符串处理复杂
   - **对策**: 先补充单元测试，再迁移（测试驱动）
   - **验证**: 迁移后所有测试通过

3. **第三方库类型** - mammoth.js 等可能缺少类型定义
   - **对策**: 优先安装 @types/xxx，其次创建自定义 .d.ts
   - **禁止**: 使用 any 绕过类型检查（立即修复类型错误）

### 回滚计划:
```bash
# 如果发现严重问题，回滚到 JS 版本
git checkout HEAD~N  # N 为迁移的提交数
# 重新规划实施
```

---

## 已验证的类型安全示例

### 正确示例:
```typescript
// ✅ 正确：严格类型保护
export function updateBlockType(
  blocks: ContentBlock[],
  id: string,
  type: BlockType
): ContentBlock[] {
  if (!blocks || !Array.isArray(blocks)) {
    throw new Error('Invalid blocks array');
  }

  return blocks.map(block =>
    block.id === id ? { ...block, type } : block
  );
}
```

### 错误示例（立即修复）:
```typescript
// ❌ 错误：松散类型（向后兼容）
export function updateBlockType(blocks: any, id: any, type: any): any {
  return blocks.map(block =>
    block.id === id ? { ...block, type } : block
  );
}
```

---

*遵循 CLAUD.md: 最简原则、单一职责原则、编译优先原则、不做向后兼容*
*创建日期: 2025-12-09*
*实施人: Claude Code*
