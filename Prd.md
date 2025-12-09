产品需求文档 (PRD)

项目：版式装配引擎 V2.0

版本： 2.0 (并行工作流)
状态： 开发中（基于V1架构升级）
首席产品设计师： Claude Code
产品负责人： (你)
最后更新： 2025-12-09

版本历史：
- V1.0: 基础三向导流程（Vue 3 + TypeScript + Pinia）✅ 已实现
- V2.0: 并行工作流 + 微信图片上传（开发中）

1. 核心产品路线图 (Product Roadmap)

1.1. 核心目标 (Mission)

一款高速版式装配引擎，能将无格式的纯文本，一键转化为视觉统一、可直接用于发布平台（如135编辑器）的HTML代码。

1.2. 用户画像 (Persona)

画像： 微信公众号运营者、新媒体编辑。

核心痛点： 每天花费大量时间在135等编辑器中，手动为每一个标题、每一段正文、每一个图片“套用”样式。这个过程极其重复、繁琐、耗时，且容易出错导致版式不统一。

1.3. V1: 最小可行产品 (MVP)

智能文本解析器 (Smart Text Parser):

接受用户粘贴的大段纯文本。

自动清理多余的空格和空行，并智能地将文本分割成独立的“内容块”。

“幕布”工作区 (Curtain Workspace):

以“块”的形式，垂直展示所有解析后的内容块。（见原型B）

浮动工具栏 (Floating Toolbar):

点击任意文本块，弹出一个简洁的工具栏。

提供类型标记功能：[设为引言], [设为小标题], [设为正文], [设为结尾]。

版式插入器 (Layout Inserter):

在两个内容块之间显示一个 [+] 按钮。

点击后提供选项：[插入单图模板], [插入双图模板]。

（注：模板代码由产品负责人提供，包含占位符图片）。

一键应用样式 (Apply Style Button):

在“向导”的最后一步，一个全局的“生成”或“应用样式”按钮。

点击后，系统根据用户标记的类型，自动套用固定的<section>样式（引言/结尾用同一种，小标题用一种，正文用一种）。

预览与复制代码 (Preview & Copy):

“生成”后，提供一个最终的HTML预览窗口。

提供“复制HTML代码”按钮，用户可直接粘贴到135编辑器中。

1.4. V2 及以后版本 (Future Releases)

并行工作流 (V2): 实现图片上传、内容编辑、样式选择三线程并行处理，互不干涉。支持压缩包上传(.zip/.7z)自动解压，图片上传至微信素材库。

主题包 (Theme Packs) (V3): 引入“色系”概念。用户可以选择不同的主题包（如“科技蓝”、“商务灰”），系统会自动切换所有（引言、标题、正文）的<section>样式。

样式随机化引擎 (V3): 在V2的“主题包”基础上，一个主题包内含3种标题、3种正文样式，系统在应用时进行随机搭配。

自定义模板库 (V3): 允许高级用户上传和管理他们自己的<section>样式代码片段。

2. 关键业务逻辑 (Business Rules) (V2)

类型优先级： 如果用户没有标记类型，所有块默认为 [正文]。

样式一致性 (核心)：

所有被标记为 [引言] 或 [结尾] 的块，必须使用同一个 style_intro.html 模板包裹。

所有被标记为 [小标题] 的块，必须使用 style_title.html 模板包裹。

所有被标记为 [正文] 的块，必须使用 style_body.html 模板包裹。

图片占位符逻辑：

插入的"图片模板"使用占位符（&单图 / &&双图）标记位置。

图片上传与微信素材库：

上传的zip/7z压缩包中的图片自动上传至微信素材库，返回media_id和永久URL。

图片上传与内容编辑、样式选择并行进行，互不阻塞。

文件名匹配规则：image1.jpg → 第一个&单图位置，image2.jpg → 第二个&单图位置，double1-1.jpg + double1-2.jpg → 第一个&&双图位置。

3. 数据契约 (Data Contract) (V2)

输入 (Input):

raw_text: string (用户粘贴的纯文本或从docx解析的文本)。

config_styles: { intro: StyleTemplate, title: StyleTemplate, body: StyleTemplate } (用户选择的装饰样式配置，包含完整的HTML模板)。

wechat_images: Array<{ id: string, media_id: string, url: string, originalName: string, status: 'uploading' | 'completed' | 'failed' }> (上传到微信素材库的图片信息)。

upload_status: { total: number, completed: number, failed: number, status: 'idle' | 'uploading' | 'completed' | 'failed', errors: Array } (图片上传状态)。

输出 (Output):

final_html: string (一个完整的HTML字符串，由固定的头部、结尾、样式包裹的内容块、以及微信图片URL组成，可直接复制到135编辑器使用)。

4. 选定原型与架构蓝图

4.1. 选定的MVP原型：原型B (The "Wizard")

设计理念： 采用向导式流程，将复杂任务分解为三个清晰的步骤：1. 粘贴文本 -> 2. 编辑标记 -> 3. 生成预览。这最大程度地降低了用户的认知负荷，强化了“高速、简单”的核心价值。

ASCII 原型图：

+-----------------------------------------------------------------------------+
| [LOGO] 版式装配引擎 V1.0                   (步骤 2/3: 编辑内容)             |
+-----------------------------------------------------------------------------+
| [幕布] 工作区                                                               |
| +---------------------------------------------------------------------------+
| | [引言]                                                                    |
| | 这是引言文本... (点击此处弹出 [类型工具栏: 引言/标题/正文/结尾])          |
| +---------------------------------------------------------------------------+
| |                       [+] (点击插入: 单图/双图 模板)                      |
| +---------------------------------------------------------------------------+
| | [小标题]                                                                  |
| | 这是小标题...                                                             |
| +---------------------------------------------------------------------------+
| | [正文]                                                                    |
| | 这是正文文本...                                                             |
| +---------------------------------------------------------------------------+
| | (更多内容块...)                                                           |
| +---------------------------------------------------------------------------+
|                                                                             |
| [ <上一步: 重填文本 ]                                  [ 下一步: 生成样式> ] |
+-----------------------------------------------------------------------------+


4.2. 核心流程图 (Mermaid)

flowchart TD
    subgraph 步骤1: 输入
        A[用户粘贴纯文本 或 拖拽ZIP/7Z压缩包] --> B(自动解析并提取)
        B --> C{智能文本解析器}
        C -- 压缩包处理 --> D[提取.docx并解析]
        C -- 直接粘贴 --> E[清理/分割文本]
        D --> F[获取文本内容]
        E --> F
        D --> G[提取所有图片]
        G --> H[并行上传至微信素材库]
        F --> I(自动进入下一步)
        H --> I[图片上传持续进行中...]
    end

    subgraph 步骤2: 并行编辑（核心改进）
        I --> J[初始化内容块]
        J --> K[幕布工作区]

        subgraph 内容块编辑线程
            K --> L[浮动工具栏]
            L -- 标记类型 --> K
            K -- 点击+号 --> M[版式插入器]
            M -- 插入 --> K
        end

        subgraph 样式选择线程
            N[样式选择面板] -- 点击 --> O[选择装饰样式]
            O -- 实时预览 --> P[应用样式到内容块]
        end

        subgraph 图片上传线程
            H -- 上传成功 --> Q[添加到图片库]
            Q -- 更新 --> R[上传进度: 5/10 完成]
        end

        K -- 上传完成 --> S(下一步: 生成预览)
        R -- 全部成功 --> S
        R -- 部分失败 --> S
        R -- 全部失败 --> T[提示: 是否继续纯文本模式]
    end

    subgraph 步骤3: 图片替换与输出
        S --> U[样式组装引擎]
        V[样式模板库] --> U
        Q --> U[微信图片库 (media_id + url)]
        U -- 组装HTML --> W[final_html]
        W --> X[左右分栏预览]

        subgraph 左栏: 微信图片
            Y[图片列表]
            Y -- 点击 --> Z[选中图片]
        end

        subgraph 右栏: HTML预览
            AA[iframe预览]
            AA -- 点击图片 --> AB[选中占位符]
        end

        Z -- 替换 --> AC[更新final_html]
        AB -- 点击左栏图片 --> AC
        AC --> AA[实时刷新预览]
        AA --> AD[复制HTML代码]
        AD --> AE[粘贴到135编辑器]
    end


4.3. 组件交互说明 (当前实现架构 V1→V2 升级)

当前技术栈：Vue 3 + TypeScript + Pinia + Vite + TailwindCSS

App.vue (主应用 - 已实现):

管理核心状态 currentStep (值为 1, 2, 3)

管理数据状态 rawText, contentBlocks, styleConfig

根据 currentStep 渲染对应的步骤组件

监听路由变化，更新步骤状态

Step1TextInput.vue (已部分实现):

现有功能：
  - 大型 <textarea> 用于文本粘贴
  - 支持 Word文档(.docx) 上传和解析
  - 智能示例和标注示例插入

待增强功能：
  - 支持 zip/7z 压缩包拖拽上传
  - JSZip 解压并提取 docx 和图片
  - 解压后立即启动图片上传线程
  - 上传完成后自动跳转到 Step2

Step2Curtain.vue (已部分实现):

现有布局：垂直内容块列表 + 浮动工具栏 + 图片插入器

现有功能：
  - 点击内容块弹出 FloatingToolbar 标记类型
  - 块之间显示 LayoutInserter (+按钮) 插入图片占位符
  - 内容块文本可编辑、可删除

待增强功能：
  - 顶部添加 UploadProgress 组件显示上传进度
  - 左右分栏布局：左侧 ContentEditor，右侧 StyleSelector
  - StyleSelector 面板实时选择装饰样式
  - 上传进度与UI操作解耦（只禁用“下一步”按钮）

Step3Preview.vue (已实现基础版本):

现有功能：
  - 左右标签页切换（预览/代码）
  - iframe 预览 final_html
  - 复制HTML功能

待增强功能：
  - 左右分栏布局（左：微信图片列表，右：HTML预览）
  - 点击图片占位符选中（蓝色边框）
  - 点击左栏图片替换选中的占位符
  - 实时更新 final_html

StyleConfig.vue (已存在):

现有功能：选择标题、正文、引言的装饰样式

待增强功能：
  - 微信配置入口
  - 管理 APPID 和 APPSECRET

stores/appStore.ts (已部分实现):

现有状态：
  - currentStep, rawText, contentBlocks, styleConfig

待扩展状态：
  - wechatImages: 微信图片列表
  - uploadStatus: 上传进度状态

utils/ 目录结构：
  - textParser.ts: 智能文本解析（已实现）
  - styleAssembler.ts: 样式组装引擎（已实现）
  - wechatApi.ts: 微信API服务层（待创建）
  - zipProcessor.ts: 压缩包处理（待创建）

components/ 待创建组件：
  - UploadProgress.vue: 上传进度显示
  - ContentEditor.vue: 内容块编辑区（抽取现有逻辑）
  - StyleSelector.vue: 样式选择面板
  - WechatImageGallery.vue: 微信图片列表

Step1_TextInput.vue:

支持文本粘贴、Word文档上传（.docx）、压缩包上传（.zip/.7z）。

“下一步”按钮：触发以下并行操作：
  - 解析文本内容 → 存入 rawText
  - 解压并提取图片 → 调用 uploadImagesToWechat()
  - 立即跳转到 Step2（不等待上传完成）

Step2_Curtain.vue（核心并行组件）:

Props: 接收 contentBlocks, wechatImages, uploadStatus。

Layout: 三栏布局
  - 顶部栏：UploadProgress 组件（显示上传进度，不阻塞操作）
  - 左栏：ContentEditor（内容块编辑）
  - 右栏：StyleSelector（样式选择面板）
  - 底部：NextStepButton（上传完成前禁用）

Logic:
  - useEffect (依赖 rawText): 调用 smartTextParser(rawText)
  - handleTypeChange(id, newType): 更新 contentBlocks
  - handleInsertImage(index, imageType): 插入图片占位符
  - handleStyleChange(type, style): 实时预览样式效果

并行机制：
  - 图片上传在后台线程连续进行
  - 内容编辑与样式选择可同时进行，互不阻塞
  - 只有"下一步"按钮状态与上传进度耦合

Step3_Preview.vue:

Props: 接收 contentBlocks, wechatImages, styleConfig。

Layout: 左右分栏
  - 左栏：WechatImageGallery（微信图片列表，可点击选择）
  - 右栏：HtmlPreview（iframe预览，可点击图片选中占位符）

Logic:
  - buildHtml(contentBlocks, styleConfig): 样式组装引擎
  - handleImageClickInPreview(imageId): 选中占位符
  - handleImageClickInGallery(image): 替换选中的占位符
  - updateHtml(): 实时更新final_html

Render:
  - iframe 预览实时反映替换结果
  - 提供"复制HTML代码"按钮

4.4. 技术架构升级 (V2)

前端框架: Vue 3 + TypeScript + Vite
  - 理由：支持TypeScript保证代码质量，Vite提供极速开发体验
  - Pinia：状态管理，支持图片上传状态的跨组件共享

样式框架: TailwindCSS
  - 快速构建响应式UI，保持视觉一致性

核心逻辑:
  - smartTextParser.ts: 智能文本解析
  - styleAssembler.ts: 样式组装引擎
  - wechatApi.ts: 微信API服务层（上传图片、获取token）
  - zipProcessor.ts: 压缩包处理（JSZip）

并行处理机制:
  - Upload Manager: 管理图片上传队列
  - Pinia Store: 实时同步上传进度
  - Web Worker (可选): 解压大尺寸压缩包}

4.4. 技术选型与风险 (V2)

技术选型:

框架: Vue 3 + TypeScript + Vite + Pinia
  - Vue 3: Composition API提供灵活的代码组织方式
  - TypeScript: 类型安全，减少运行时错误
  - Vite: 极速的开发和构建体验
  - Pinia: Vue官方状态管理，支持TypeScript

核心库:
  - JSZip: 处理zip/7z压缩包解压
  - Mammoth: 解析Word文档(docx)提取文本
  - Axios: HTTP请求库，调用微信API

UI框架: TailwindCSS
  - 快速构建一致的UI界面
  - 支持响应式设计

风险与规避:

风险 1 (高): 图片上传到微信的并发限制

描述: 微信素材API有调用频率限制（约5000次/天，并发限制）

规避:
  - 实现上传队列，限制并发数为3
  - 添加指数退避重试机制
  - 提供错误提示和手动重试选项
  - 必要时实现服务器端代理上传

风险 2 (高): 压缩包解压性能

描述: 大尺寸压缩包（>50MB）在浏览器解压会阻塞主线程

规避:
  - 使用Web Worker进行解压
  - 显示解压进度条
  - 限制单个压缩包大小（50MB）
  - 提供服务器端解压备选方案

风险 3 (中): 并行处理的复杂性

描述: 图片上传、内容编辑、样式选择三线程并行可能导致状态不一致

规避:
  - Pinia集中管理状态，确保单向数据流
  - 严格的TypeScript类型约束
  - 单元测试覆盖状态变化逻辑
  - 上传状态与编辑状态解耦设计

风险 4 (中): 微信API凭证安全

描述: APPID和APPSECRET在前端暴露存在安全风险

规避:
  - 实现后端代理服务，前端不直接接触凭证
  - 使用环境变量存储敏感信息
  - 实现IP白名单限制
  - 定期轮换凭证

风险 5 (低): 浏览器兼容性

描述: JSZip、File API、Clipboard API等在现代浏览器支持良好，但旧版浏览器可能不支持

规避:
  - 明确支持浏览器版本（Chrome 80+, Firefox 75+, Edge 80+）
  - 提供不兼容提示和降级方案
  - 核心功能保证兼容性，高级功能可降级

5. 附录

5.1. 版本迭代记录

V1.0 (MVP - 已实现):
  - 核心功能：文本解析、三向导流程、样式组装、样式配置
  - 技术栈：Vue 3 + TypeScript + Pinia + Vite + TailwindCSS
  - 组件：Step1输入、Step2编辑、Step3预览、StyleConfig配置
  - 实现：智能文本解析、浮动工具栏、版式插入器、样式组装

V2.0 (开发中):
  - 新增：并行工作流、压缩包上传、微信图片上传、图片替换
  - 改进：Step2左右分栏、实时进度显示、后台上传不阻塞
  - 体验：三线程并行、一键上传所有图片、选中替换视觉反馈

5.2. 术语表

  - **内容块 (Content Block)**: 文本或图片的最小编辑单元，存储在Pinia store的contentBlocks数组中
  - **占位符 (Placeholder)**: &单图、&&双图等图片位置标记，在Step2显示为静态模板
  - **装饰样式 (Decoration Style)**: 标题、正文、引言的视觉样式，存储在styleConfig对象中
  - **并行工作流 (Concurrent Workflow)**: 图片上传、内容编辑、样式选择三线程同时进行，互不阻塞
  - **微信素材库 (Wechat Material)**: 微信公众号的图片和媒体资源库，上传后返回media_id和永久URL
  - **Blob URL**: 浏览器内存中的临时URL，用于本地预览上传的图片
  - **PINIA**: Vue官方状态管理库，用于跨组件共享上传状态和图片数据