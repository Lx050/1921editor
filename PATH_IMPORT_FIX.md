# 路径导入问题修复

## 问题
```
Failed to resolve import "@/utils/api" from "src\views\TenantSettings.vue"
```

## 原因
由于 `vite.config.js` 中设置了 `root: './src'`，路径解析发生了变化。

## 解决方案

### 方法1: 使用相对路径（已采用）✅
```typescript
// 修改前
import api from '@/utils/api';

// 修改后
import api from '../utils/api';
```

### 方法2: 正确配置路径别名
```javascript
// vite.config.js
export default defineConfig({
  root: './src',
  resolve: {
    alias: {
      '@': '/src', // 指向src目录
    }
  },
})
```

## 项目约定

由于项目的 `root` 设置为 `./src`，建议在整个项目中使用**相对路径**导入，而不是路径别名。

**示例**:
```typescript
// views 中导入 utils
import api from '../utils/api';

// views 中导入 stores
import { useUserStore } from '../stores/userStore';

// views 中导入 components
import MyComponent from '../components/MyComponent.vue';
```

## 已修复
- ✅ `src/views/TenantSettings.vue` - 改为使用相对路径

## 状态
✅ 修复完成，页面现在应该可以正常加载
