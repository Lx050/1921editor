import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAppStore } from '../stores/appStore'

// 使用动态导入以优化加载
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home/index.vue'),
    meta: {
      title: '主页'
    }
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/settings/wechat',
    name: 'WechatSettings',
    component: () => import('../views/Settings/WechatSettings.vue'),
    meta: {
      title: '公众号管理',
      requiresAuth: true
    }
  },
  {
    path: '/step1',
    name: 'Step1',
    component: () => import('../views/Step1TextInput.vue'),
    meta: {
      step: 1,
      title: '步骤 1/3: 输入文本'
    }
  },
  {
    path: '/step2',
    name: 'Step2',
    component: () => import('../views/Step2Curtain.vue'),
    meta: {
      step: 2,
      title: '步骤 2/3: 编辑内容'
    }
  },
  {
    path: '/step3',
    name: 'Step3',
    component: () => import('../views/Step3Preview.vue'),
    meta: {
      step: 3,
      title: '步骤 3/3: 生成预览'
    }
  },
  {
    path: '/step2v2',
    name: 'Step2v2',
    component: () => import('../views/Step2Editor.vue'),
    meta: {
      step: 2,
      title: 'Manifold Editor'
    }
  },
  {
    path: '/step3confirm',
    name: 'Step3Confirm',
    component: () => import('../views/Step3Confirm.vue'),
    meta: {
      step: 3,
      title: 'Manifold 发布确认'
    }
  },
  {
    path: '/step3/:id',
    name: 'Step3WithArticle',
    component: () => import('../views/Step3Preview.vue'),
    meta: {
      step: 3,
      title: '步骤 3/3: 编辑文章'
    }
  },
  {
    path: '/style-config',
    name: 'StyleConfig',
    component: () => import('../views/StyleConfig.vue'),
    meta: {
      title: '样式配置',
      requiresAuth: true
    }
  },
  {
    path: '/preview',
    name: 'DraftPreview',
    component: () => import('../views/DraftPreview.vue'),
    meta: {
      title: '草稿预览'
    }
  },
  {
    path: '/articles/:id/config',
    name: 'ArticleConfig',
    component: () => import('../views/ArticleConfig.vue'),
    meta: {
      title: '配置文章'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      title: '注册'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: {
      title: '忘记密码'
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
    meta: {
      title: '重置密码'
    }
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: () => import('../views/VerifyEmail.vue'),
    meta: {
      title: '验证邮箱'
    }
  },
  {
    path: '/settings/wechat/confirm',
    name: 'WechatCredentialConfirm',
    component: () => import('../views/Settings/WechatCredentialsConfirm.vue'),
    meta: {
      title: '确认公众号密钥'
    }
  },
  {
    path: '/settings/wechat/callback',
    name: 'WechatAuthCallback',
    component: () => import('../views/Settings/WechatCallback.vue'),
    meta: {
      title: '公众号授权回调',
      requiresAuth: true
    }
  },
  {
    path: '/auth/callback',
    name: 'LoginCallback',
    component: () => import('../views/LoginCallback.vue'),
    meta: {
      title: 'Auth Callback'
    }
  },
  {
    path: '/tenant-select',
    name: 'TenantSelect',
    component: () => import('../views/TenantSelect.vue'),
    meta: {
      title: '选择组织'
    }
  },
  {
    path: '/settings/tenant',
    name: 'TenantSettings',
    component: () => import('../views/TenantSettings.vue'),
    meta: {
      title: '租户配置',
      requiresAuth: true,
      description: '配置飞书多维表格实现多租户自助管理'
    }
  }
]


// 路由保护规则配置 - 集中管理所有路由保护逻辑
interface RouteGuard {
  validator: (appStore: ReturnType<typeof useAppStore>) => boolean
  redirect: string
  description: string
}

const routeGuards: Record<string, RouteGuard> = {
  '/step2': {
    // 允许有 rawText 或 contentBlocks（从保存的文章恢复时只有 contentBlocks）
    validator: (appStore) => Boolean(appStore.rawText) || Boolean(appStore.contentBlocks?.length),
    redirect: '/step1',
    description: 'step2需要文本内容或内容块'
  },
  '/step3': {
    validator: (appStore) => Boolean(appStore.contentBlocks?.length),
    redirect: '/step2',
    description: 'step3需要内容块'
  },
  '/step2v2': {
    validator: (appStore) => Boolean(appStore.rawText) || Boolean(appStore.contentBlocks?.length) || Boolean(appStore.editorJson),
    redirect: '/step1',
    description: 'step2v2需要文本内容或内容块'
  },
  '/step3confirm': {
    validator: (appStore) => Boolean(appStore.editorJson),
    redirect: '/step2v2',
    description: 'step3confirm需要编辑器内容'
  },

}

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 统一的错误记录函数
const logRouteGuard = (to: string, passed: boolean, message: string): void => {
  console.log(`[RouteGuard] ${passed ? '✅ 通过' : '⛔ 拦截'} | ${to}: ${message}`)
}

// 导航守卫 - 确保正确的步骤流程
router.beforeEach((to, _from, next) => {
  const appStore = useAppStore()

  // 检查目标路由是否有保护规则
  // 对于带参数的路径，提取基础路径来匹配守卫规则
  const basePath = to.path.startsWith('/step3/') ? '/step3' : to.path
  const guard = routeGuards[basePath]
  if (guard) {
    if (basePath === '/step3' && to.params?.id) {
      next()
      return
    }
    // 验证条件
    const isValid = guard.validator(appStore)

    // 记录日志
    logRouteGuard(to.path, isValid, guard.description)

    if (!isValid) {
      console.warn(`[RouteGuard] 跳转到 ${guard.redirect}`)
      next(guard.redirect)
      return
    }
  }

  next()
})

export default router
