import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Step1TextInput from '../views/Step1TextInput.vue'
import Step2Curtain from '../views/Step2Curtain.vue'
import Step3Preview from '../views/Step3Preview.vue'
import StyleConfig from '../views/StyleConfig.vue'
import DraftPreview from '../views/DraftPreview.vue'
import { useAppStore } from '../stores/appStore'

import UserConfig from '../views/UserConfig.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'UserConfig',
    component: UserConfig,
    meta: {
      title: '主页'
    }
  },
  {
    path: '/step1',
    name: 'Step1',
    component: Step1TextInput,
    meta: {
      step: 1,
      title: '步骤 1/3: 输入文本'
    }
  },
  {
    path: '/step2',
    name: 'Step2',
    component: Step2Curtain,
    meta: {
      step: 2,
      title: '步骤 2/3: 编辑内容'
    }
  },
  {
    path: '/step3',
    name: 'Step3',
    component: Step3Preview,
    meta: {
      step: 3,
      title: '步骤 3/3: 生成预览'
    }
  },
  {
    path: '/style-config',
    name: 'StyleConfig',
    component: StyleConfig,
    meta: {
      title: '样式配置'
    }
  },
  {
    path: '/preview',
    name: 'DraftPreview',
    component: DraftPreview,
    meta: {
      title: '草稿预览'
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
    validator: (appStore) => Boolean(appStore.rawText),
    redirect: '/step1',
    description: 'step2需要文本内容'
  },
  '/step3': {
    validator: (appStore) => Boolean(appStore.contentBlocks?.length),
    redirect: '/step2',
    description: 'step3需要内容块'
  },
  '/style-config': {
    validator: (appStore) => Boolean(appStore.rawText),
    redirect: '/step1',
    description: '样式配置需要文本内容'
  }
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
router.beforeEach((to, from, next) => {
  const appStore = useAppStore()

  // 检查目标路由是否有保护规则
  const guard = routeGuards[to.path]
  if (guard) {
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