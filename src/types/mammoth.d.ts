/**
 * Mammoth.js 类型定义
 * 用于 .docx 文档转换为 HTML
 */

declare module 'mammoth' {
  /**
   * Mammoth 图像对象
   */
  interface MammothImage {
    alt?: string
    contentType?: string
    read(buffer: string): Promise<ArrayBuffer>
  }

  /**
   * Mammoth 段落子元素
   */
  interface MammothChildElement {
    type: string
    value?: string
    [key: string]: unknown
  }

  /**
   * Mammoth 段落对象
   */
  interface MammothParagraph {
    styleId?: string
    styleName?: string
    alignment?: string
    children?: MammothChildElement[]
    [key: string]: unknown
  }

  /**
   * Mammoth 转换结果
   */
  interface MammothResult {
    value: string
    messages: MammothMessage[]
  }

  /**
   * Mammoth 消息
   */
  interface MammothMessage {
    type: 'info' | 'warning'
    message: string
  }

  /**
   * Mammoth 图片元素
   */
  interface MammothImgElement {
    src: string
    alt?: string
  }

  /**
   * Mammoth 图像处理选项
   */
  interface MammothImages {
    imgElement(handler: (image: MammothImage) => MammothImgElement | Promise<MammothImgElement>): {
      convertImage: (image: MammothImage) => MammothImgElement | Promise<MammothImgElement>
    }
  }

  /**
   * Mammoth 变换函数
   */
  interface MammothTransforms {
    paragraph(
      transform: (paragraph: MammothParagraph) => MammothParagraph
    ): (document: unknown) => unknown
  }

  /**
   * Mammoth 转换选项
   */
  interface MammothOptions {
    convertImage?: {
      convertImage: (image: MammothImage) => MammothImgElement | Promise<MammothImgElement>
    }
    styleMap?: string[]
    transformDocument?: (document: unknown) => unknown
    [key: string]: unknown
  }

  /**
   * Mammoth 主接口
   */
  interface Mammoth {
    /**
     * 转换 ArrayBuffer 为 HTML
     */
    convertToHtml(
      options: { arrayBuffer: ArrayBuffer },
      mammothOptions?: MammothOptions
    ): Promise<MammothResult>

    /**
     * 转换原始文本为 HTML
     */
    convertToHtml(
      options: { path: string },
      mammothOptions?: MammothOptions
    ): Promise<MammothResult>

    /**
     * 图像处理工具
     */
    images: MammothImages

    /**
     * 文档变换工具
     */
    transforms: MammothTransforms
  }

  const mammoth: Mammoth
  export = mammoth
}
