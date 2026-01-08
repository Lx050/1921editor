# 页面列表和功能概述

## 公众号管理

### 公众号设置页 (/settings/wechat)
- **页面位置：** `src/views/Settings/WechatSettings.vue`
- **主要功能：** 发起扫码授权、展示已授权列表、切换发布账号
- **数据来源：** `/api/wechat/authorized-accounts`
- **核心组件：** 无 (采用 Tailwind 原生组件)

### 授权回调处理页 (/wechat/callback)
- **页面位置：** `src/views/Settings/WechatCallback.vue`
- **主要功能：** 接收微信 `auth_code` 并调用后端接口完成令牌换取与租户关联
- **接口调用：** `/api/wechat/exchange-auth`
- **特殊逻辑：** 成功后延时跳转并携带成功状态提示
