# 代码审查报告 - 前端 (Vue 3)

## 审查范围
- 组件设计
- 状态管理
- 性能优化
- 安全性
- 用户体验

---

## 🔴 严重问题 (Critical)

### 1. Token 存储在 sessionStorage 不安全
**位置**: `src/stores/userStore.ts`

**问题**:
```javascript
sessionStorage.setItem('token', token); // ❌ 易受 XSS 攻击
```

**建议**: 使用 HttpOnly Cookie
```typescript
// 后端设置 Cookie
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
});

// 前端无需手动存储，浏览器自动携带
```

---

### 2. API 请求未处理 401 自动跳转
**位置**: `src/utils/api.ts`

**当前**:
```typescript
api.interceptors.response.use(
  response => response,
  error => Promise.reject(error) // ❌ 未处理认证失败
);
```

**建议**:
```typescript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 清除 token
      sessionStorage.removeItem('token');
      
      // 跳转登录页
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath }
      });
    }
    return Promise.reject(error);
  }
);
```

---

### 3. 缺少 CSRF 防护
**位置**: 全局

**建议**: 添加 CSRF Token
```typescript
// main.js
import axios from 'axios';

// 从 meta 标签读取 CSRF token
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
```

---

## 🟡 重要问题 (High)

### 4. 组件过大，职责不清
**位置**: `src/views/Step2Curtain.vue`

**问题**: 单个组件超过 500 行，包含多个职责

**建议**: 拆分为多个子组件
```
Step2Curtain.vue (容器组件)
  ├── TextEditor.vue (文本编辑)
  ├── ImageUploader.vue (图片上传)
  ├── StylePanel.vue (样式面板)
  └── PreviewPane.vue (实时预览)
```

---

### 5. 缺少错误边界
**位置**: 全局

**建议**: 添加全局错误处理
```typescript
// main.js
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  console.error('Component:', instance);
  console.error('Error info:', info);
  
  // 上报到错误监控服务
  // Sentry.captureException(err);
  
  // 显示友好提示
  ElMessage.error('系统错误，请稍后重试');
};
```

---

### 6. 状态管理混乱
**位置**: `src/stores/userStore.ts`

**问题**: 混用 Composition API 和 Options API

**建议**: 统一使用 Composition API (Pinia)
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null);
  const token = ref(sessionStorage.getItem('token'));
  
  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const userName = computed(() => user.value?.name || '');
  
  // Actions
  async function login(credentials) {
    const response = await api.post('/auth/login', credentials);
    token.value = response.data.token;
    user.value = response.data.user;
    sessionStorage.setItem('token', token.value);
  }
  
  function logout() {
    token.value = null;
    user.value = null;
    sessionStorage.removeItem('token');
  }
  
  return { user, token, isLoggedIn, userName, login, logout };
});
```

---

## 🟢 建议优化 (Medium)

### 7. 缺少加载状态
**位置**: 多个组件

**建议**: 统一的加载状态管理
```vue
<template>
  <div v-loading="loading">
    <ArticleList :articles="articles" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';

const { state: articles, isLoading: loading } = useAsyncState(
  () => api.get('/articles').then(res => res.data),
  []
);
</script>
```

---

### 8. 图片未懒加载
**位置**: `src/components/ArticleCard.vue`

**建议**: 使用 Intersection Observer
```vue
<template>
  <img 
    v-lazy="imageUrl" 
    :alt="article.title"
    loading="lazy"
  />
</template>

<script setup>
import { directive as vLazy } from 'vue3-lazy';
</script>
```

---

### 9. 缺少防抖/节流
**位置**: `src/views/Step1TextInput.vue`

**问题**: 实时保存未防抖
```typescript
watch(content, (newVal) => {
  saveArticle(newVal); // ❌ 频繁触发
});
```

**建议**:
```typescript
import { useDebounceFn } from '@vueuse/core';

const debouncedSave = useDebounceFn((content) => {
  saveArticle(content);
}, 1000);

watch(content, (newVal) => {
  debouncedSave(newVal);
});
```

---

### 10. 路由守卫不完整
**位置**: `src/router/index.ts`

**当前**:
```typescript
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  if (!token && to.path !== '/login') {
    next('/login');
  } else {
    next();
  }
});
```

**建议**: 添加权限验证
```typescript
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } });
    return;
  }
  
  // 需要特定角色
  if (to.meta.roles && !to.meta.roles.includes(userStore.user?.role)) {
    next({ path: '/403' });
    return;
  }
  
  // 已登录用户访问登录页，跳转首页
  if (to.path === '/login' && userStore.isLoggedIn) {
    next('/');
    return;
  }
  
  next();
});
```

---

## 📊 性能优化建议

### 11. 组件懒加载
```typescript
// router/index.ts
const routes = [
  {
    path: '/articles/:id',
    component: () => import('../views/ArticleDetail.vue'), // ✅ 懒加载
  },
];
```

---

### 12. 虚拟滚动
**位置**: 文章列表

**建议**: 使用虚拟滚动优化长列表
```vue
<template>
  <RecycleScroller
    :items="articles"
    :item-size="200"
    key-field="id"
  >
    <template #default="{ item }">
      <ArticleCard :article="item" />
    </template>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
</script>
```

---

### 13. 图片压缩
**建议**: 上传前压缩图片
```typescript
import imageCompression from 'browser-image-compression';

async function handleImageUpload(file) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  
  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}
```

---

## 🎨 用户体验优化

### 14. 添加骨架屏
```vue
<template>
  <div v-if="loading">
    <el-skeleton :rows="5" animated />
  </div>
  <div v-else>
    <ArticleList :articles="articles" />
  </div>
</template>
```

---

### 15. 添加空状态
```vue
<template>
  <div v-if="articles.length === 0" class="empty-state">
    <img src="/empty.svg" alt="暂无数据" />
    <p>还没有文章，快去创建一篇吧！</p>
    <el-button type="primary" @click="createArticle">
      创建文章
    </el-button>
  </div>
</template>
```

---

### 16. 添加离线提示
```typescript
// main.js
window.addEventListener('online', () => {
  ElMessage.success('网络已恢复');
});

window.addEventListener('offline', () => {
  ElMessage.warning('网络已断开，请检查连接');
});
```

---

## ✅ 做得好的地方

1. ✅ 使用 Vue 3 Composition API
2. ✅ 使用 Vite 构建工具
3. ✅ 组件化设计合理
4. ✅ 使用 TypeScript
5. ✅ 代理配置正确

---

## 🎯 优先级修复清单

### 立即修复 (P0)
- [ ] Token 存储改用 HttpOnly Cookie
- [ ] 添加 401 自动跳转
- [ ] 添加 CSRF 防护

### 本周修复 (P1)
- [ ] 拆分大组件
- [ ] 添加全局错误处理
- [ ] 统一状态管理

### 下周优化 (P2)
- [ ] 添加加载状态
- [ ] 图片懒加载
- [ ] 添加防抖节流

---

## 📦 推荐的依赖包

```json
{
  "dependencies": {
    "@vueuse/core": "^10.0.0",
    "pinia": "^2.1.0",
    "vue-virtual-scroller": "^2.0.0",
    "browser-image-compression": "^2.0.0"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-plugin-vue": "^9.0.0"
  }
}
```

---

**审查人**: AI Assistant  
**审查时间**: 2025-12-21  
**代码版本**: v1.0
