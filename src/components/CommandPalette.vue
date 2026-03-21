<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{ editor: Editor | null; visible: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'execute', id: string): void
}>()

const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

interface PaletteCommand {
  id: string
  label: string
  shortcut?: string
  category: string
  action: () => void
}

const commands = computed<PaletteCommand[]>(() => {
  if (!props.editor) return []
  const e = props.editor
  return [
    // Format
    { id: 'bold', label: '加粗', shortcut: 'Ctrl+B', category: '格式', action: () => e.chain().focus().toggleBold().run() },
    { id: 'italic', label: '斜体', shortcut: 'Ctrl+I', category: '格式', action: () => e.chain().focus().toggleItalic().run() },
    { id: 'underline', label: '下划线', shortcut: 'Ctrl+U', category: '格式', action: () => e.chain().focus().toggleUnderline().run() },
    { id: 'strike', label: '删除线', category: '格式', action: () => e.chain().focus().toggleStrike().run() },
    { id: 'code', label: '行内代码', shortcut: 'Ctrl+E', category: '格式', action: () => e.chain().focus().toggleCode().run() },
    { id: 'highlight', label: '高亮', category: '格式', action: () => e.chain().focus().toggleHighlight().run() },
    // Transform
    { id: 'upper', label: '转大写 UPPERCASE', category: '转换', action: () => (e.commands as any).transformText('upper') },
    { id: 'lower', label: '转小写 lowercase', category: '转换', action: () => (e.commands as any).transformText('lower') },
    { id: 'title', label: '转首字母大写 Title Case', category: '转换', action: () => (e.commands as any).transformText('title') },
    // Headings
    { id: 'h1', label: '一级标题', shortcut: 'Ctrl+Alt+1', category: '标题', action: () => e.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level: 1 }).run() },
    { id: 'h2', label: '二级标题', shortcut: 'Ctrl+Alt+2', category: '标题', action: () => e.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level: 2 }).run() },
    { id: 'h3', label: '三级标题', shortcut: 'Ctrl+Alt+3', category: '标题', action: () => e.chain().focus().toggleNode('manifoldHeading', 'manifoldParagraph', { level: 3 }).run() },
    // Blocks
    { id: 'quote', label: '引用', category: '块', action: () => e.chain().focus().toggleBlockquote().run() },
    { id: 'codeblock', label: '代码块', category: '块', action: () => e.chain().focus().toggleCodeBlock().run() },
    { id: 'hr', label: '分隔线', category: '块', action: () => e.chain().focus().setHorizontalRule().run() },
    { id: 'bullet', label: '无序列表', category: '列表', action: () => e.chain().focus().toggleBulletList().run() },
    { id: 'ordered', label: '有序列表', category: '列表', action: () => e.chain().focus().toggleOrderedList().run() },
    // Table
    { id: 'table', label: '插入表格', category: '表格', action: () => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    // Alignment
    { id: 'align-left', label: '左对齐', category: '对齐', action: () => e.chain().focus().setTextAlign('left').run() },
    { id: 'align-center', label: '居中', category: '对齐', action: () => e.chain().focus().setTextAlign('center').run() },
    { id: 'align-right', label: '右对齐', category: '对齐', action: () => e.chain().focus().setTextAlign('right').run() },
    // Actions
    { id: 'undo', label: '撤销', shortcut: 'Ctrl+Z', category: '操作', action: () => e.chain().focus().undo().run() },
    { id: 'redo', label: '重做', shortcut: 'Ctrl+Shift+Z', category: '操作', action: () => e.chain().focus().redo().run() },
    { id: 'clear-format', label: '清除格式', category: '操作', action: () => e.chain().focus().clearNodes().unsetAllMarks().run() },
    { id: 'select-all', label: '全选', shortcut: 'Ctrl+A', category: '操作', action: () => e.chain().focus().selectAll().run() },
    // Bookmarks
    { id: 'bookmark-add', label: '添加书签', category: '书签', action: () => (e.commands as any).addBookmark() },
    // Insert
    { id: 'insert-date', label: '插入当前日期', category: '插入', action: () => {
      const now = new Date()
      e.chain().focus().insertContent(`${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`).run()
    }},
    { id: 'insert-time', label: '插入当前时间', category: '插入', action: () => {
      const now = new Date()
      e.chain().focus().insertContent(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })).run()
    }},
    // Block roles
    { id: 'role-body', label: '设为正文', category: '角色', action: () => e.chain().focus().updateAttributes('manifoldParagraph', { blockRole: 'body' }).run() },
    { id: 'role-intro', label: '设为引言', category: '角色', action: () => e.chain().focus().updateAttributes('manifoldParagraph', { blockRole: 'intro' }).run() },
    { id: 'role-outro', label: '设为结尾', category: '角色', action: () => e.chain().focus().updateAttributes('manifoldParagraph', { blockRole: 'outro' }).run() },
  ]
})

const filteredCommands = computed(() => {
  if (!query.value) return commands.value
  const q = query.value.toLowerCase()
  return commands.value.filter(c =>
    c.label.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.id.includes(q)
  )
})

watch(() => props.visible, (val) => {
  if (val) {
    query.value = ''
    activeIndex.value = 0
    nextTick(() => inputRef.value?.focus())
  }
})

function execute(cmd: PaletteCommand) {
  cmd.action()
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % Math.max(1, filteredCommands.value.length)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + filteredCommands.value.length) % Math.max(1, filteredCommands.value.length)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const cmd = filteredCommands.value[activeIndex.value]
    if (cmd) execute(cmd)
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] bg-black/30"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-xl shadow-2xl w-[400px] max-h-[50vh] flex flex-col overflow-hidden" @keydown="handleKeydown">
        <div class="px-4 py-3 border-b">
          <input
            ref="inputRef"
            v-model="query"
            class="w-full text-sm outline-none placeholder:text-gray-400"
            placeholder="输入命令..."
          />
        </div>
        <div class="flex-1 overflow-y-auto py-1">
          <div v-if="filteredCommands.length === 0" class="px-4 py-6 text-center text-sm text-gray-400">
            未找到匹配的命令
          </div>
          <div
            v-for="(cmd, i) in filteredCommands"
            :key="cmd.id"
            class="flex items-center justify-between px-4 py-2 cursor-pointer text-sm transition-colors"
            :class="i === activeIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'"
            @click="execute(cmd)"
            @mouseenter="activeIndex = i"
          >
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-gray-400 w-8">{{ cmd.category }}</span>
              <span>{{ cmd.label }}</span>
            </div>
            <kbd v-if="cmd.shortcut" class="text-[10px] px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-gray-500">{{ cmd.shortcut }}</kbd>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
