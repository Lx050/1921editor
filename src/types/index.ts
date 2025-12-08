/**
 * 内容块类型枚举
 */
export type BlockType =
  | 'title'
  | 'body'
  | 'intro'
  | 'outro'
  | 'image_single'
  | 'image_double';

/**
 * 内容块数据接口
 */
export interface ContentBlock {
  id: string;
  type: BlockType;
  text: string;
  meta?: Record<string, unknown>;
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
  return type === 'image_single' || type === 'image_double';
}

/**
 * 文本类型守卫
 */
export function isTextBlock(type: BlockType): boolean {
  return !isImageBlock(type);
}
