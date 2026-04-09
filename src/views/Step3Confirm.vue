<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showAlert } from '@/composables/useConfirm'
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
      else await showAlert('复制失败，请手动选择代码进行复制')
    }
  } else {
    const result = await copyToClipboard(finalHtml.value)
    if (result.ok) markCopied()
    else await showAlert('复制失败，请手动选择代码进行复制')
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
  <div class="flex flex-col h-full w-full" style="background:var(--color-bg-page);">
    <!-- Top bar -->
    <div class="flex-shrink-0 px-6 py-3 flex items-center justify-between" style="border-bottom:var(--border-whisper); background:#fff;">
      <button
        class="text-sm"
        style="color:rgba(0,0,0,0.45);"
        @mouseenter="($event.target as HTMLElement).style.color='rgba(0,0,0,0.65)'"
        @mouseleave="($event.target as HTMLElement).style.color='rgba(0,0,0,0.45)'"
        @click="goBack"
      >
        &larr; 返回编辑
      </button>
      <span class="text-sm font-medium" style="color:rgba(0,0,0,0.65);">Manifold 发布确认</span>
      <span class="text-xs" style="color:var(--color-text-muted);">{{ wordCount }} 字</span>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <!-- Left sidebar: config panel -->
      <div class="w-72 flex-shrink-0 bg-white p-4 overflow-y-auto" style="border-right:var(--border-whisper);">
        <h3 class="text-sm font-medium mb-4" style="color:rgba(0,0,0,0.65);">文章配置</h3>

        <label class="block mb-3">
          <span class="text-xs" style="color:rgba(0,0,0,0.45);">标题</span>
          <input v-model="articleTitle" type="text" class="mt-1 w-full px-3 py-2 text-sm" style="border:var(--border-input); border-radius:var(--radius-xs);" placeholder="文章标题" />
        </label>

        <label class="block mb-3">
          <span class="text-xs" style="color:rgba(0,0,0,0.45);">作者</span>
          <input v-model="articleAuthor" type="text" class="mt-1 w-full px-3 py-2 text-sm" style="border:var(--border-input); border-radius:var(--radius-xs);" placeholder="作者名称" />
        </label>

        <label class="block mb-3">
          <span class="text-xs" style="color:rgba(0,0,0,0.45);">摘要</span>
          <textarea v-model="articleSummary" class="mt-1 w-full px-3 py-2 text-sm" style="border:var(--border-input); border-radius:var(--radius-xs);" rows="3" placeholder="文章摘要" />
        </label>

        <hr class="my-4" style="border-color:rgba(0,0,0,0.08);" />

        <!-- Mode selector -->
        <h4 class="text-xs mb-2" style="color:rgba(0,0,0,0.45);">工作模式</h4>
        <div class="flex gap-1 mb-4">
          <button
            v-for="opt in modeOptions"
            :key="opt.key"
            class="flex-1 py-1.5 text-xs rounded-lg transition-colors"
            :style="currentMode === opt.key
              ? 'background:var(--color-accent-primary); color:#fff;'
              : 'background:var(--color-bg-warm); color:rgba(0,0,0,0.55);'"
            @click="setMode(opt.key)"
          >{{ opt.label }}</button>
        </div>

        <!-- Mode-specific metadata -->
        <label v-if="currentMode === 'three_rural'" class="block mb-3">
          <span class="text-xs" style="color:rgba(0,0,0,0.45);">项目名称</span>
          <input v-model="appStore.teamName" type="text" class="mt-1 w-full px-3 py-2 text-sm" style="border:var(--border-input); border-radius:var(--radius-xs);" placeholder="实践项目" />
        </label>
        <label v-if="currentMode === 'reprint'" class="block mb-3">
          <span class="text-xs" style="color:rgba(0,0,0,0.45);">来源公众号</span>
          <input v-model="appStore.sourceAccount" type="text" class="mt-1 w-full px-3 py-2 text-sm" style="border:var(--border-input); border-radius:var(--radius-xs);" placeholder="来源公众号名" />
        </label>
        <label class="block mb-3">
          <span class="text-xs" style="color:rgba(0,0,0,0.45);">编辑</span>
          <input v-model="appStore.editorInput" type="text" class="mt-1 w-full px-3 py-2 text-sm" style="border:var(--border-input); border-radius:var(--radius-xs);" placeholder="编辑人员" />
        </label>

        <button
          class="w-full py-1.5 text-xs rounded-lg transition-colors mb-3"
          style="color:var(--color-accent-primary);"
          @click="regenerateHtml"
        >
          刷新预览
        </button>

        <hr class="my-4" style="border-color:rgba(0,0,0,0.08);" />

        <!-- Copy mode toggle -->
        <div class="flex gap-1 mb-2">
          <button
            class="flex-1 py-1 text-xs rounded-lg transition-colors"
            :style="copyMode === 'rich' ? 'background:var(--color-badge-bg); color:var(--color-accent-primary);' : 'background:var(--color-bg-warm); color:rgba(0,0,0,0.55);'"
            @click="copyMode = 'rich'"
          >富文本</button>
          <button
            class="flex-1 py-1 text-xs rounded-lg transition-colors"
            :style="copyMode === 'html' ? 'background:var(--color-badge-bg); color:var(--color-accent-primary);' : 'background:var(--color-bg-warm); color:rgba(0,0,0,0.55);'"
            @click="copyMode = 'html'"
          >HTML源码</button>
        </div>

        <button
          class="w-full h-10 rounded-xl text-sm font-medium transition-all active:scale-[0.98] mb-2"
          style="background:var(--color-accent-primary); color:#fff;"
          @click="copyHtml"
        >
          {{ copied ? '已复制!' : (copyMode === 'rich' ? '复制富文本' : '复制 HTML 源码') }}
        </button>

        <button
          class="w-full h-10 rounded-xl text-sm font-medium transition-all active:scale-[0.98] mb-2"
          style="border:1px solid var(--color-success); color:var(--color-success);"
          @mouseenter="($event.target as HTMLElement).style.background='var(--color-success-light)'"
          @mouseleave="($event.target as HTMLElement).style.background=''"
          disabled
        >
          同步到微信 (即将上线)
        </button>

        <button
          class="w-full h-10 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
          style="border:1px solid rgba(0,0,0,0.12); color:rgba(0,0,0,0.45);"
          @mouseenter="($event.target as HTMLElement).style.background='var(--color-bg-warm)'"
          @mouseleave="($event.target as HTMLElement).style.background=''"
          @click="goToStep1"
        >
          重新开始
        </button>
      </div>

      <!-- Right: preview -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="max-w-[680px] mx-auto bg-white p-6" style="box-shadow:var(--shadow-content-card); border-radius:8px;">
          <div v-if="finalHtml" v-html="finalHtml" class="wechat-preview" />
          <div v-else class="text-center py-12" style="color:var(--color-text-muted);">没有可预览的内容</div>
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
