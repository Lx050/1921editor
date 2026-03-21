<script setup lang="ts">
defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const shortcuts = [
  { section: '文本格式', items: [
    { keys: 'Ctrl+B', desc: '加粗' },
    { keys: 'Ctrl+I', desc: '斜体' },
    { keys: 'Ctrl+U', desc: '下划线' },
    { keys: 'Ctrl+E', desc: '行内代码' },
    { keys: 'Ctrl+.', desc: '上标' },
    { keys: 'Ctrl+,', desc: '下标' },
    { keys: 'Ctrl+K', desc: '链接' },
  ]},
  { section: '标题', items: [
    { keys: 'Ctrl+Alt+1', desc: '一级标题' },
    { keys: 'Ctrl+Alt+2', desc: '二级标题' },
    { keys: 'Ctrl+Alt+3', desc: '三级标题' },
  ]},
  { section: '编辑', items: [
    { keys: 'Ctrl+Z', desc: '撤销' },
    { keys: 'Ctrl+Shift+Z', desc: '重做' },
    { keys: 'Ctrl+A', desc: '全选' },
  ]},
  { section: '列表', items: [
    { keys: 'Ctrl+Shift+8', desc: '无序列表' },
    { keys: 'Ctrl+Shift+9', desc: '有序列表' },
  ]},
  { section: '缩进', items: [
    { keys: 'Tab', desc: '增加缩进' },
    { keys: 'Shift+Tab', desc: '减少缩进' },
  ]},
  { section: '其他', items: [
    { keys: 'Ctrl+S', desc: '手动保存' },
    { keys: 'Ctrl+Shift+C', desc: '复制微信HTML' },
    { keys: 'Ctrl+Shift+F', desc: '专注模式' },
    { keys: 'Ctrl+F', desc: '查找与替换' },
    { keys: '/', desc: '打开命令菜单' },
    { keys: 'Ctrl+Enter', desc: '插入分隔线' },
    { keys: 'Shift+Enter', desc: '换行 (不换段)' },
    { keys: '?', desc: '显示此面板' },
  ]},
]
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40"
      @click.self="emit('close')"
      @keydown.escape="emit('close')"
    >
      <div class="bg-white rounded-xl shadow-2xl w-[420px] max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between px-5 py-4 border-b">
          <h2 class="text-base font-semibold text-gray-800">键盘快捷键</h2>
          <button
            class="text-gray-400 hover:text-gray-600 text-lg leading-none"
            @click="emit('close')"
          >&times;</button>
        </div>

        <div class="px-5 py-4 space-y-4">
          <div v-for="section in shortcuts" :key="section.section">
            <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{{ section.section }}</h3>
            <div class="space-y-1">
              <div
                v-for="item in section.items"
                :key="item.keys"
                class="flex items-center justify-between py-1"
              >
                <span class="text-sm text-gray-700">{{ item.desc }}</span>
                <kbd class="text-xs px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600 font-mono">{{ item.keys }}</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
