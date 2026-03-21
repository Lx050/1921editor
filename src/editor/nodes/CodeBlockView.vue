<script setup lang="ts">
import { ref, computed } from 'vue'
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const language = computed(() => props.node.attrs.language || '')
const showPicker = ref(false)

const languages = [
  { value: '', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'XML' },
  { value: 'markdown', label: 'Markdown' },
]

function setLanguage(lang: string) {
  props.updateAttributes({ language: lang })
  showPicker.value = false
}

const displayLang = computed(() => {
  const found = languages.find(l => l.value === language.value)
  return found ? found.label : language.value || 'Plain Text'
})
</script>

<template>
  <NodeViewWrapper class="manifold-codeblock relative my-3" data-drag-handle>
    <div class="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      <!-- Language bar -->
      <div class="flex items-center justify-between px-3 py-1.5 bg-gray-100 border-b border-gray-200">
        <div class="relative">
          <button
            class="text-[11px] text-gray-500 hover:text-gray-700 flex items-center gap-1 font-mono"
            @click="showPicker = !showPicker"
          >
            {{ displayLang }}
            <span class="text-[9px]">&#x25BC;</span>
          </button>
          <!-- Language dropdown -->
          <div
            v-if="showPicker"
            class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto w-36"
          >
            <button
              v-for="lang in languages"
              :key="lang.value"
              class="block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors"
              :class="language === lang.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'"
              @click="setLanguage(lang.value)"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>
        <!-- Copy button -->
        <button
          class="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
          @click="navigator.clipboard.writeText(node.textContent)"
          title="Copy code"
        >Copy</button>
      </div>
      <!-- Code content -->
      <NodeViewContent
        as="pre"
        class="manifold-codeblock-content px-4 py-3 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap"
      />
    </div>
    <!-- Backdrop to close picker -->
    <div v-if="showPicker" class="fixed inset-0 z-10" @click="showPicker = false" />
  </NodeViewWrapper>
</template>
