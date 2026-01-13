/**
 * Article 相关类型定义
 * 替换 any 类型，提供类型安全
 */

/**
 * 文章元数据（三下乡模式专用）
 */
export interface ArticleMetadata {
  /** 队伍专项 */
  teamProject?: string;
  /** 队伍名称 */
  teamName?: string;
  /** 所属院系 */
  teamDepartment?: string;
  /** 负责人 */
  teamLeader?: string;
  /** 联系方式 */
  teamContact?: string;
  /** 编辑输入 */
  editorInput?: string;
}

/**
 * 文章配置
 */
export interface ArticleConfig {
  /** 布局类型 */
  layout?: string;
  /** 样式配置 */
  style?: Record<string, unknown>;
  /** 元数据（三下乡模式） */
  metadata?: ArticleMetadata;
  /** 上传的原始文件名 */
  uploadedFile?: string;
  /** 图片 URL 数组 */
  imageUrls?: string[];
}

/**
 * 文章图片
 */
export interface ArticleImage {
  /** 图片 URL */
  url?: string;
  /** 图片路径（本地存储路径） */
  path?: string;
  /** 图片说明 */
  caption?: string;
  /** 替代文本 */
  alt?: string;
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
}

/**
 * 微信发布结果
 */
export interface WechatPublishResult {
  /** 微信文章 URL */
  wechat_url: string;
  /** 发布状态 */
  status: string;
  /** 发布时间 */
  published_at: Date;
}
