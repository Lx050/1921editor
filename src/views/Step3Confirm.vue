<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { serializeToWechatHtml } from '../editor/serializers/htmlSerializer'
import { copyRichText, copyToClipboard } from '../utils/clipboard'
import type { EditorDocument } from '@/types/editor'

const router = useRouter()
const appStore = useAppStore()
const configStore = useConfigStore()
const { editorJson } = storeToRefs(appStore)

const finalHtml = ref('')
const copied = ref(false)

const articleTitle = ref('')
const articleAuthor = ref('')
const articleSummary = ref('')

const currentMode = computed(() => configStore.mode)

function regenerateHtml() {
  if (!editorJson.value) return
  finalHtml.value = serializeToWechatHtml(editorJson.value as EditorDocument)
}

onMounted(() => {
  regenerateHtml()
})

// Re-generate when mode changes
watch(() => configStore.mode, () => {
  regenerateHtml()
})

function setMode(mode: 'daily' | 'three_rural' | 'reprint') {
  configStore.setMode(mode)
}

const copyMode = ref<'html' | 'rich'>('rich')

async function copyHtml() {
  if (!finalHtml.value) return

  const markCopied = () => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }

  if (copyMode.value === 'rich') {
    const result = await copyRichText(finalHtml.value)
    if (result.ok) {
      markCopied()
    } else {
      const textResult = await copyToClipboard(finalHtml.value)
      if (textResult.ok) markCopied()
      else alert('复制失败，请手动选择代码进行复制')
    }
  } else {
    const result = await copyToClipboard(finalHtml.value)
    if (result.ok) markCopied()
    else alert('复制失败，请手动选择代码进行复制')
  }
}

function goBack() {
  router.push('/step2')
}

function goToStep1() {
  router.push('/step1')
}

const modeOptions = [
  { key: 'daily' as const, label: '日常' },
  { key: 'three_rural' as const, label: '三下乡' },
  { key: 'reprint' as const, label: '转载' },
]

const wordCount = computed(() => {
  if (!editorJson.value) return 0
  const doc = editorJson.value as EditorDocument
  let count = 0
  function walk(node: any) {
    if (node.type === 'text' && node.text) count += node.text.length
    if (node.content) node.content.forEach(walk)
  }
  walk(doc)
  return count
})
</script>

<template>
  <div class="flex flex-col h-full w-full bg-gray-50">
    <!-- Top bar -->
    <div class="flex-shrink-0 border-b bg-white px-6 py-3 flex items-center justify-between">
      <button class="text-sm text-gray-500 hover:text-gray-700" @click="goBack">
        &larr; 返回编辑
      </button>
      <span class="text-sm font-medium text-gray-700">Manifold 发布确认</span>
      <span class="text-xs text-gray-400">{{ wordCount }} 字</span>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <!-- Left sidebar: config panel -->
      <div class="w-72 flex-shrink-0 border-r bg-white p-4 overflow-y-auto">
        <h3 class="text-sm font-medium text-gray-700 mb-4">文章配置</h3>

        <label class="block mb-3">
          <span class="text-xs text-gray-500">标题</span>
          <input v-model="articleTitle" type="text" class="mt-1 w-full px-3 py-2 border rounded text-sm" placeholder="文章标题" />
        </label>

        <label class="block mb-3">
          <span class="text-xs text-gray-500">作者</span>
          <input v-model="articleAuthor" type="text" class="mt-1 w-full px-3 py-2 border rounded text-sm" placeholder="作者名称" />
        </label>

        <label class="block mb-3">
          <span class="text-xs text-gray-500">摘要</span>
          <textarea v-model="articleSummary" class="mt-1 w-full px-3 py-2 border rounded text-sm" rows="3" placeholder="文章摘要" />
        </label>

        <hr class="my-4" />

        <!-- Mode selector -->
        <h4 class="text-xs text-gray-500 mb-2">工作模式</h4>
        <div class="flex gap-1 mb-4">
          <button
            v-for="opt in modeOptions"
            :key="opt.key"
            class="flex-1 py-1.5 text-xs rounded transition-colors"
            :class="currentMode === opt.key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="setMode(opt.key)"
          >{{ opt.label }}</button>
        </div>

        <!-- Mode-specific metadata -->
        <label v-if="currentMode === 'three_rural'" class="block mb-3">
          <span class="text-xs text-gray-500">团队名称</span>
          <input v-model="appStore.teamName" type="text" class="mt-1 w-full px-3 py-2 border rounded text-sm" placeholder="三下乡团队" />
        </label>
        <label v-if="currentMode === 'reprint'" class="block mb-3">
          <span class="text-xs text-gray-500">来源公众号</span>
          <input v-model="appStore.sourceAccount" type="text" class="mt-1 w-full px-3 py-2 border rounded text-sm" placeholder="来源公众号名" />
        </label>
        <label class="block mb-3">
          <span class="text-xs text-gray-500">编辑</span>
          <input v-model="appStore.editorInput" type="text" class="mt-1 w-full px-3 py-2 border rounded text-sm" placeholder="编辑人员" />
        </label>

        <button
          class="w-full py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors mb-3"
          @click="regenerateHtml"
        >
          刷新预览
        </button>

        <hr class="my-4" />

        <!-- Copy mode toggle -->
        <div class="flex gap-1 mb-2">
          <button
            class="flex-1 py-1 text-xs rounded transition-colors"
            :class="copyMode === 'rich' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'"
            @click="copyMode = 'rich'"
          >富文本</button>
          <button
            class="flex-1 py-1 text-xs rounded transition-colors"
            :class="copyMode === 'html' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'"
            @click="copyMode = 'html'"
          >HTML源码</button>
        </div>

        <button
          class="w-full py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors mb-2"
          @click="copyHtml"
        >
          {{ copied ? '已复制!' : (copyMode === 'rich' ? '复制富文本' : '复制 HTML 源码') }}
        </button>

        <button
          class="w-full py-2 border border-green-600 text-green-700 rounded text-sm hover:bg-green-50 transition-colors mb-2"
          disabled
        >
          同步到微信 (即将上线)
        </button>

        <button
          class="w-full py-2 border border-gray-300 text-gray-500 rounded text-sm hover:bg-gray-50 transition-colors"
          @click="goToStep1"
        >
          重新开始
        </button>
      </div>

      <!-- Right: preview -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="max-w-[680px] mx-auto bg-white shadow-sm rounded p-6">
          <div v-if="finalHtml" v-html="finalHtml" class="wechat-preview" />
          <div v-else class="text-center py-12 text-gray-400">没有可预览的内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wechat-preview :deep(img) {
  max-width: 100%;
  height: auto;
}
.wechat-preview :deep(section) {
  margin: 10px 0;
}
.wechat-preview :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
