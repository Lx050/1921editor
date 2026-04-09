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
    <div class="rounded-lg overflow-hidden" style="border:1px solid rgba(0,0,0,0.08); background:var(--color-bg-warm);">
      <!-- Language bar -->
      <div class="flex items-center justify-between px-3 py-1.5" style="background:var(--color-bg-warm); border-bottom:1px solid rgba(0,0,0,0.08);">
        <div class="relative">
          <button
            class="text-[11px] flex items-center gap-1 font-mono"
            style="color:rgba(0,0,0,0.45);"
            @mouseover="($event.target as HTMLElement).style.color='rgba(0,0,0,0.65)'"
            @mouseout="($event.target as HTMLElement).style.color='rgba(0,0,0,0.45)'"
            @click="showPicker = !showPicker"
          >
            {{ displayLang }}
            <span class="text-[9px]">&#x25BC;</span>
          </button>
          <!-- Language dropdown -->
          <div
            v-if="showPicker"
            class="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto w-36"
            style="border:1px solid rgba(0,0,0,0.08);"
          >
            <button
              v-for="lang in languages"
              :key="lang.value"
              class="block w-full text-left px-3 py-1.5 text-xs transition-colors"
              @mouseover="(e) => { if (language !== lang.value) (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-warm)'; }"
              @mouseout="(e) => { if (language !== lang.value) (e.currentTarget as HTMLElement).style.background = ''; }"
              :style="language === lang.value ? { backgroundColor: 'var(--color-badge-bg)', color: 'var(--color-accent-primary)' } : { color: 'rgba(0,0,0,0.65)' }"
              @click="setLanguage(lang.value)"
            >
              {{ lang.label }}
            </button>
          </div>
        </div>
        <!-- Copy button -->
        <button
          class="text-[10px] transition-colors"
          style="color:var(--color-text-muted);"
          @mouseover="($event.target as HTMLElement).style.color='rgba(0,0,0,0.55)'"
          @mouseout="($event.target as HTMLElement).style.color='var(--color-text-muted)'"
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
