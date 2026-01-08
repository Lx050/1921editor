/**
 * 样式模板接口
 */
export interface StyleTemplate {
  html: string;
  css: string;
  fullExample: string;
}

/**
 * 文本样式模板映射
 */
export interface StyleTemplates {
  intro_outro: string;
  title: string;
  body: string;
}

/**
 * 图片模板映射
 */
export interface ImageTemplates {
  single: string;
  double: string;
}
