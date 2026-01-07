---
name: content-parsing-assembly-engine
description: 文章内容解析与排版装配引擎。涵盖 Step 1 的语义解析、Step 2 的块编辑及 Step 3 的 HTML 渲染。当涉及格式解析错误、样式渲染不全或内容块状态同步问题时使用。
---

# 内容解析与排版装配引擎工作流

## 1. Step 1: 语义解析 (Text Parsing)

将外部输入转换为内部 `ContentBlocks` 数据模型。

**触发示例：**
"修复 .docx 导入格式错乱"
"增加一个新的标题语法识别"

**执行步骤：**
1.  **文本拆分**: `src/utils/textParser.ts` -> `smartTextParser`。基于空行和分隔符。
2.  **语义标记**:
    - `&`: `image_single_caption`
    - `&&`: `image_double_caption`
3.  **状态映射**: 更新 `Pinia` Store 中的 `appStore.contentBlocks`。

---

## 2. Step 3: 样式装配 (Style Assembling)

根据 CSS 模板和语义块生成最终呈现 HTML。

**核心逻辑：**
1.  **装配逻辑**: `src/utils/styleAssembler.ts` -> `generateHtml`。
2.  **安全净化**: 使用 `DOMPurify` 确保输出 HTML 不包含样式注入或 XSS 脚本。
    - **规范**: 参照 `.agent/workflows/vue-code-review.md` 中的安全性章节。
3.  **图片增强**: 给图片标签添加 `data-placeholder` 属性，便于 Step 3 的零快闪替换。

---

## 3. 常见问题排查 (Troubleshooting)

- **样式丢失**: 检查 `StyleSelector.vue` 选中的样式是否正确存入 `appStore.styleConfig`。
- **解析失败**: 检查 `mammoth.js` 转换后的原始 HTML 片段是否包含预期的段落标记。

---

## 相关 Skills 协作
- **前端审查**: 见 `.agent/workflows/vue-code-review.md`。
- **代码重构**: 见 `.agent/workflows/react-code-review.md` (如有涉及 React 组件)。

## 参考文献 (References)
- **核心文件**: `src/utils/textParser.ts` (解析)
- **核心文件**: `src/utils/styleAssembler.ts` (装配)
- **文档**: `docs/完整业务流程梳理.md`
