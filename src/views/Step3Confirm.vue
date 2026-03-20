<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'
import { serializeToWechatHtml } from '../editor/serializers/htmlSerializer'
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

onMounted(() => {
  if (editorJson.value) {
    const header = configStore.currentHeader || ''
    let footer = configStore.currentFooter || ''
    footer = footer
      .replace(/\{\{PLANNERS\}\}/g, appStore.plannerNames.join(' ') || ' ')
      .replace(/\{\{COPYWRITERS\}\}/g, appStore.copywriterNames.join(' ') || ' ')
      .replace(/\{\{EDITORS\}\}/g, appStore.editorNames.join(' ') || ' ')
      .replace(/\{\{TEAM_NAME\}\}/g, appStore.teamName || '')
      .replace(/\{\{SOURCE_ACCOUNT\}\}/g, appStore.sourceAccount || '')
      .replace(/\{\{EDITOR_INPUT\}\}/g, appStore.editorInput || ' ')

    finalHtml.value = serializeToWechatHtml(editorJson.value as EditorDocument, header, footer)
  }
})

function copyHtml() {
  if (!finalHtml.value) return
  navigator.clipboard.writeText(finalHtml.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function goBack() {
  router.push('/step2')
}
</script>

<template>
  <div class="flex flex-col h-full w-full bg-gray-50">
    <div class="flex-shrink-0 border-b bg-white px-6 py-3 flex items-center justify-between">
      <button class="text-sm text-gray-500 hover:text-gray-700" @click="goBack">
        &larr; 返回编辑
      </button>
      <span class="text-sm font-medium text-gray-700">Manifold 发布确认</span>
      <div class="w-20" />
    </div>

    <div class="flex-1 flex overflow-hidden">
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

        <button
          class="w-full py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors mb-2"
          @click="copyHtml"
        >
          {{ copied ? '已复制!' : '复制 HTML 代码' }}
        </button>

        <button
          class="w-full py-2 border border-green-600 text-green-700 rounded text-sm hover:bg-green-50 transition-colors"
          disabled
        >
          同步到微信 (即将上线)
        </button>
      </div>

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
</style>
