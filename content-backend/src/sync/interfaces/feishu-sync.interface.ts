/**
 * 飞书多维表格同步相关接口定义
 */

// 飞书人员字段格式
export interface FeishuPerson {
    id: string; // open_id
    name?: string;
    avatar_url?: string;
}

// 飞书多维表格记录字段
export interface FeishuArticleFields {
    标题: string;
    状态: string;
    内容策划: FeishuPerson[];
    文案撰稿: FeishuPerson[];
    文章编辑: FeishuPerson[];
    最后更新: number;
    系统ID: string;
}

// 飞书多维表格记录数据结构
export interface FeishuRecordData {
    fields: Partial<FeishuArticleFields>;
}

// 飞书 Webhook 事件结构
export interface FeishuWebhookEvent {
    event?: {
        record_id: string;
        app_token: string;
        table_id: string;
    };
    record_id?: string;
    app_token?: string;
    table_id?: string;
}

// 同步结果
export interface SyncResult {
    success: boolean;
    message?: string;
    error?: string;
}

// 用户分组映射结果
export interface UserGroupMapping {
    planners: FeishuPerson[];
    copywriters: FeishuPerson[];
    editors: FeishuPerson[];
}
