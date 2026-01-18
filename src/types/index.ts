/**
 * 内容块类型枚举
 */
export type BlockType =
  | 'title'
  | 'body'
  | 'intro'
  | 'outro'
  | 'image_single'
  | 'image_single_caption'
  | 'image_double'
  | 'image_double_caption'
  | 'container';

/**
 * 内容块数据接口
 */
export interface ContentBlock {
  id: string;
  type: BlockType;
  text: string;
  meta?: Record<string, unknown>;
  children?: ContentBlock[];
}

/**
 * 内容块类型选项接口（用于下拉选择器）
 */
export interface BlockTypeOption {
  value: BlockType;
  label: string;
  icon: string;
}

/**
 * 样式模板接口
 */
export interface StyleTemplate {
  html: string;
  css: string;
  fullExample: string;
}

/**
 * 样式配置接口
 */
export interface StyleConfig {
  title?: StyleTemplate;
  body?: StyleTemplate;
  intro?: StyleTemplate;
  outro?: StyleTemplate;
  container?: StyleTemplate;
  metadata?: {
    rawText?: string;
    editorInput?: string;
    teamName?: string;
    sourceAccount?: string;
    teamProject?: string;
    teamDepartment?: string;
    teamLeader?: string;
    teamContact?: string;
    copywriterNames?: string[];
    plannerNames?: string[];
    editorNames?: string[];
  };
}

/**
 * 应用状态接口
 */
export interface AppStoreState {
  currentStep: number;
  rawText: string;
  contentBlocks: ContentBlock[];
  styleConfig: StyleConfig | null;
}

/**
 * 文本解析函数接口
 */
export interface TextParser {
  (text: string): ContentBlock[];
}

/**
 * HTML 构建函数接口
 */
export interface HtmlBuilder {
  (blocks: ContentBlock[], config?: StyleConfig | null): string;
}

/**
 * 图片模板接口
 */
export interface ImageTemplates {
  single: string;
  double: string;
}

/**
 * 图片类型守卫
 */
export function isImageBlock(type: BlockType): boolean {
  return type === 'image_single' || type === 'image_single_caption' || type === 'image_double' || type === 'image_double_caption';
}

/**
 * 文本类型守卫
 */
export function isTextBlock(type: BlockType): boolean {
  return !isImageBlock(type);
}

// 导出微信相关类型
export * from './wechat';

