# 内容解析与排版装配引擎 (V2 并行版) - 核心逻辑工作流

此文档详细记录了“1921editor”项目的核心业务逻辑，即如何通过“向导式三步骤”将碎片化的输入转化为生产级 HTML。

---

## Step 1: 智能解析 (Smart Input & Parsing)
**目标**：将非结构化的输入（文字/压缩包）转化为结构化的 `ContentBlocks`。

### 1.1 协议识别
- **纯文本**：通过 `smartTextParser.ts` 进行空行切割，清理冗余空格。
- **Docx**：调用 `Mammoth.js` 提取原始 HTML 段落，并同步提取内嵌图片。
- **Zip/7z**：调用 `JSZip` 并行解压。
    - **文本通道**：提取 `.docx` 背景内容。
    - **图片通道**：提取所有图片资源，并立即触发 `wechatApi.ts` 进行并行微信 CDN 上传。

### 1.2 语义标记 (Semantic Tagging)
解析过程中识别以下系统标记：
- `&` : 标记为“单图占位符” (`image_single_caption`)。
- `&&` : 标记为“双图占位符” (`image_double_caption`)。

---

## Step 2: 幕布编辑 (Curtain Editing & Tagging)
**目标**：通过并行的交互设计，快速完成内容的结构化标记。

### 2.1 并行线程
- **编辑线程**：在“幕布”工作区对内容块进行类型定义（引言、小标题、正文、结尾）。
- **上传线程**：后台同步上传图片至微信素材库。Pinia 实时更新上传进度（如 `5/10 完成`），不阻塞用户编辑动作。

### 2.2 逻辑插入
- **版式插入器**：在两个内容块之间，允许动态插入图片模板块。
- **实时同步**：所有的标记动作立即更新 Store 中的 `contentBlocks` 状态，确保 Step 3 获取的是最新的结构数据。

---

## Step 3: 排版装配 (Style Assembling & Output)
**目标**：注入样式模板，处理图片映射，生成最终代码。

### 3.1 模板注入机制
`styleAssembler.ts` 根据内容块的 `Type` 属性，将其包裹在对应的 HTML 片段中：
- **Type: Title** -> 套用 `title.html` 模板。
- **Type: Body** -> 套用 `body.html` 模板。
- **Type: Intro/Outro** -> 套用统一的装饰模板。

### 3.2 图片动态映射
针对占位符进行实时替换：
- **交互方式**：点击右侧预览区的占位符图片 -> 选中左侧图片库中的实图 -> `ArticleService` 执行 URL 替换。
- **安全过滤**：最后一步通过 `DOMPurify` 净化 HTML，移除任何潜在的 XSS 攻击向量。

### 3.3 零快闪预览
利用 `data-placeholder` 属性，在预览 iframe 中实现图片的平滑切换，避免频繁刷新导致的视觉跳动。

---

## 参考文献 (References - 代码级)
- **解析层**: `src/utils/textParser.ts`
- **装配层**: `src/utils/styleAssembler.ts`
- **上传层**: `src/utils/wechatApi.ts`
- **业务梳理**: `SYSTEM_WORKFLOW.md`
