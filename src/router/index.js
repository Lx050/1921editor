import { createRouter, createWebHistory } from 'vue-router'
import Step1TextInput from '../views/Step1TextInput.vue'
import Step2Curtain from '../views/Step2Curtain.vue'
import Step3Preview from '../views/Step3Preview.vue'
import StyleConfig from '../views/StyleConfig.vue'
import { useAppStore } from '../stores/appStore.js'

const routes = [
  {
    path: '/',
    redirect: '/step1'
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫 - 确保步骤流程正确
router.beforeEach((to, from, next) => {
  const appStore = useAppStore()

  // 如果直接访问step2或step3，检查是否有前置条件
  if (to.path === '/step2' && from.path !== '/step1') {
    // 从非step1页面过来，需要检查是否有文本内容
    if (!appStore.rawText) {
      next('/step1')
      return
    }
  }

  if (to.path === '/step3' && from.path !== '/step2') {
    // 从非step2页面过来，需要检查是否有内容块
    if (!appStore.contentBlocks || appStore.contentBlocks.length === 0) {
      next('/step2')
      return
    }
  }

  // 样式配置页面需要有内容才能访问
  if (to.path === '/style-config' && !appStore.rawText) {
    next('/step1')
    return
  }

  next()
})

export default router