<template>
  <div class="h-full flex overflow-hidden relative">
    <!-- 移动端样式选择开关 -->
    <button 
      @click="showMobileSidebar = !showMobileSidebar"
      class="md:hidden fixed right-4 bottom-32 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      title="切换样式面板"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    <!-- 移动端遮罩层 -->
    <div 
      v-if="showMobileSidebar" 
      @click="showMobileSidebar = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
    ></div>

    <!-- 左侧样式选择面板 - 响应式 -->
    <div 
      :class="[
        'w-64 flex-shrink-0 h-full fixed left-0 top-0 z-30 bg-white shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0',
        showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <StyleSelector />
    </div>

    <!-- 右侧内容编辑区 - 响应式边距 -->
    <div class="flex-1 flex flex-col h-full overflow-hidden md:ml-64 w-full">
      <!-- 头部 - 固定不滚动 -->
      <div class="flex-shrink-0 p-6 pb-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">步骤 2/3: 编辑内容</h2>
        <p class="text-gray-600">
          左侧选择样式，点击文本块进行编辑，调整内容块的类型和顺序。
        </p>
      </div>

      <!-- 幕布工作区 - 可滚动，底部留出按钮空间 -->
      <div class="flex-1 overflow-y-auto px-6 pb-40">
        <div class="space-y-3 pb-4">
          <div
            v-for="(block, index) in contentBlocks"
            :key="block.id"
            class="relative group"
          >
        <!-- 内容块 -->
        <div
          @click="selectBlock(block.id)"
          :class="[
            'p-4 border rounded-lg cursor-pointer transition-all relative',
            selectedBlockId === block.id
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
          ]"
        >
          <!-- 块操作工具栏 - 选中时显示更丰富 -->
          <div class="flex items-center justify-between mb-3 bg-gray-50 p-2 rounded-lg border border-gray-100" v-if="selectedBlockId === block.id || editingBlockId === block.id">
            <div class="flex items-center space-x-2">
              <!-- 类型切换下拉 -->
              <div class="relative">
                <button
                  @click.stop="toggleTypeDropdown(block.id)"
                  class="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-400 transition-colors"
                  title="切换当前块的类型"
                >
                  <span class="text-lg">{{ getBlockTypeIcon(block.type) }}</span>
                  <span>{{ getBlockTypeDisplayName(block.type) }}</span>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- 类型下拉菜单 -->
                <div
                  v-if="showTypeDropdown === block.id"
                  class="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50"
                  @click.stop
                >
                  <div class="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                    选择类型
                  </div>
                  <button
                    v-for="option in getBlockTypeOptions()"
                    :key="option.value"
                    @click="changeBlockTypeFromDropdown(block.id, option.value)"
                    :class="[
                      'w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center space-x-2',
                      block.type === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    ]"
                  >
                    <span class="text-lg w-6 text-center">{{ option.icon }}</span>
                    <span>{{ option.label }}</span>
                    <span v-if="block.type === option.value" class="ml-auto text-blue-600">✓</span>
                  </button>
                </div>
              </div>

              <!-- 快捷切换按钮 (仅在宽屏显示) -->
              <div class="hidden sm:flex space-x-1 border-l border-gray-300 pl-2 ml-2">
                <button 
                  @click.stop="changeBlockType(block.id, 'title')"
                  class="p-1.5 rounded hover:bg-gray-200 text-gray-600" 
                  :class="{ 'bg-blue-100 text-blue-700': block.type === 'title' }"
                  title="设为标题"
                >
                  <span class="text-sm font-bold">H</span>
                </button>
                <button 
                  @click.stop="changeBlockType(block.id, 'body')"
                  class="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                  :class="{ 'bg-blue-100 text-blue-700': block.type === 'body' }"
                  title="设为正文"
                >
                  <span class="text-sm">T</span>
                </button>
                <button 
                  @click.stop="changeBlockType(block.id, 'intro')"
                  class="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                  :class="{ 'bg-blue-100 text-blue-700': block.type === 'intro' }"
                  title="设为引言"
                >
                  <span class="text-sm italic">“</span>
                </button>
              </div>
            </div>

            <!-- 右侧操作 -->
            <div class="flex items-center space-x-2">
              <button
                @click.stop="confirmDeleteBlock(index, block.id)"
                class="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                title="删除此块"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- 非选中状态下的简略标签 -->
          <div v-else class="flex items-center justify-between mb-2 opacity-60 hover:opacity-100 transition-opacity">
             <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                {{ getBlockTypeDisplayName(block.type) }}
             </div>
          </div>

          <!-- 块内容 -->
          <div
            v-if="block.text"
            class="text-gray-800"
          >
            <!-- 编辑模式 -->
            <div v-if="editingBlockId === block.id" class="relative">
              <textarea
                v-model="editingText"
                class="w-full p-4 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-500 resize-none pr-24"
                :class="getBlockTextareaClass(block.type)"
                :placeholder="getBlockPlaceholder(block.type)"
                rows="4"
                ref="editTextarea"
                @blur="handleTextareaBlur(block.id)"
                @keydown.enter.ctrl="saveBlockEdit(block.id)"
                @keydown.esc="cancelBlockEdit"
                @input="handleTextareaInput($event, block.id)"
              ></textarea>

              <!-- 大按钮组 -->
              <div class="absolute top-3 right-3 flex flex-col space-y-2">
                <button
                  @click.stop="saveBlockEdit(block.id)"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 text-sm font-medium transition-colors min-w-[80px]"
                  title="保存编辑内容 (Ctrl+Enter)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>保存</span>
                </button>
                <button
                  @click.stop="cancelBlockEdit"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 text-sm font-medium transition-colors min-w-[80px]"
                  title="取消编辑 (Esc)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span>取消</span>
                </button>
              </div>

              <!-- 快捷键提示 -->
              <div class="absolute bottom-3 left-3 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                💡 Ctrl+Enter 保存 | Esc 取消
              </div>
            </div>
            <!-- 显示模式 -->
            <div
              v-else
              class="relative group"
            >
              <div
                @click="startEditBlock(block.id)"
                class="cursor-pointer hover:bg-blue-50 p-4 rounded-lg transition-all border border-transparent hover:border-blue-200"
              >
                <div v-html="formatBlockText(block.text)"></div>
              </div>

              <!-- 大编辑按钮 - 减少误触 -->
              <div class="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                <button
                  @click.stop="startEditBlock(block.id)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 text-sm font-medium transition-colors"
                  title="点击编辑此内容块"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span>编辑</span>
                </button>
              </div>

              <!-- 点击提示 -->
              <div class="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  💡 点击文本区域或编辑按钮
                </div>
              </div>
            </div>
          </div>
          <!-- 图片模板显示 -->
          <div
            v-else-if="isImageBlock(block.type)"
            class="py-4 text-center"
          >
            <div class="flex items-center justify-center space-x-3">
              <span class="text-2xl">
                <span v-if="block.type === 'image_single'">🖼️</span>
                <span v-else-if="block.type === 'image_double'">🖼️🖼️</span>
              </span>
              <span class="text-sm text-gray-600 font-medium">
                {{ getImagePlaceholder(block.type) }}
              </span>
            </div>
          </div>
          <!-- 其他空内容的块 -->
          <div
            v-else
            class="text-gray-500 italic"
          >
            {{ getImagePlaceholder(block.type) }}
          </div>
        </div>

        <!-- 版式插入器 -->
        <div class="flex justify-center mt-2">
          <LayoutInserter
            @insert-image="insertImageBlock(index, $event)"
            @insert-text="insertTextBlock(index, $event)"
          />
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="contentBlocks.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">没有内容块</div>
        <div class="text-gray-500">请返回上一步重新输入文本</div>
      </div>
        </div>
      </div>

      <!-- 操作按钮 - 固定在底部，左边距为左侧面板宽度 -->
      <div class="fixed bottom-0 left-0 md:left-64 right-0 flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 pt-4 border-t bg-white z-10 shadow-lg space-y-3 sm:space-y-0">
        <div class="w-full sm:w-auto">
          <button
            @click="goToPreviousStep"
            class="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            ← 上一步：重填文本
          </button>
        </div>

        <div class="w-full sm:w-auto">
          <button
            @click="goToNextStep"
            class="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors shadow-lg flex items-center justify-center space-x-3"
            :disabled="contentBlocks.length === 0"
            title="进入下一步预览效果"
          >
            <span>下一步：预览效果</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 斜杠命令菜单 - 浮动在最上层 -->
    <div
      v-if="showSlashMenu"
      class="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 min-w-[200px]"
      :style="{ top: slashMenuPosition.top + 'px', left: slashMenuPosition.left + 'px' }"
    >
      <div class="px-3 py-1 text-xs text-gray-500 font-medium border-b border-gray-100 mb-1">
        快速命令 (输入 / 触发)
      </div>
      <button
        v-for="cmd in slashCommands"
        :key="cmd.value"
        @click="applySlashCommand(cmd.value)"
        class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center space-x-2"
      >
        <span class="text-lg">{{ cmd.icon }}</span>
        <div>
          <div class="font-medium text-gray-700">{{ cmd.label }}</div>
          <div class="text-xs text-gray-500">{{ cmd.description }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import { smartTextParser, cleanBlockText } from '../utils/textParser'
import { getBlockTypeDisplayName } from '../utils/styleAssembler'
import StyleSelector from '../components/StyleSelector.vue'
import LayoutInserter from '../components/LayoutInserter.vue'

const router = useRouter()
const appStore = useAppStore()
const selectedBlockId = ref(null)
const editingBlockId = ref(null)
const editingText = ref('')
const showTypeDropdown = ref(null)
const showSlashMenu = ref(false)
const slashMenuPosition = ref({ top: 0, left: 0 })
const slashMenuBlockId = ref(null)
const showMobileSidebar = ref(false)

// 计算属性
const contentBlocks = computed(() => appStore.contentBlocks)

// 监听原始文本变化，解析内容块
watch(() => appStore.rawText, (newText) => {
  if (newText && contentBlocks.value.length === 0) {
    const parsedBlocks = smartTextParser(newText)
    appStore.setContentBlocks(parsedBlocks)
  }
}, { immediate: true })

// 选择内容块
const selectBlock = (blockId) => {
  selectedBlockId.value = blockId === selectedBlockId.value ? null : blockId
}

// 斜杠命令配置
const slashCommands = [
  { value: 'title', label: '标题', icon: '📰', description: '小标题' },
  { value: 'body', label: '正文', icon: '📝', description: '普通段落' },
  { value: 'intro', label: '引言', icon: '💭', description: '引言/开篇' },
  { value: 'outro', label: '结尾', icon: '🏁', description: '结尾/总结' },
  { value: 'image_single', label: '单图', icon: '🖼️', description: '插入单图模板' },
  { value: 'image_double', label: '双图', icon: '🖼️🖼️', description: '插入双图模板' }
]

// 获取块类型图标
const getBlockTypeIcon = (type) => {
  const cmd = slashCommands.find(c => c.value === type)
  return cmd ? cmd.icon : '📄'
}

// 获取块类型选项
const getBlockTypeOptions = () => {
  return slashCommands.map(cmd => ({
    value: cmd.value,
    label: cmd.label,
    icon: cmd.icon
  }))
}

// 切换类型下拉菜单
const toggleTypeDropdown = (blockId) => {
  if (showTypeDropdown.value === blockId) {
    showTypeDropdown.value = null
  } else {
    showTypeDropdown.value = blockId
    // 关闭斜杠菜单
    showSlashMenu.value = false
  }
}

// 从下拉菜单改变块类型
const changeBlockTypeFromDropdown = (blockId, newType) => {
  changeBlockType(blockId, newType)
  showTypeDropdown.value = null
}

// 处理文本输入 - 监听斜杠命令
const handleTextareaInput = (event, blockId) => {
  const textarea = event.target
  const text = textarea.value
  const cursorPos = textarea.selectionStart
  
  // 检查光标前的字符
  const textBeforeCursor = text.substring(0, cursorPos)
  const lastChar = textBeforeCursor.slice(-1)
  
  if (lastChar === '/') {
    // 显示斜杠菜单
    showSlashMenu.value = true
    slashMenuBlockId.value = blockId
    
    // 计算菜单位置
    const rect = textarea.getBoundingClientRect()
    slashMenuPosition.value = {
      top: rect.top + window.scrollY + 40,
      left: rect.left + window.scrollX + 20
    }
  } else {
    // 隐藏斜杠菜单
    showSlashMenu.value = false
  }
}

// 应用斜杠命令
const applySlashCommand = (commandValue) => {
  if (slashMenuBlockId.value) {
    // 移除文本中的 '/' 字符
    editingText.value = editingText.value.replace(/\/$/, '')
    
    // 改变块类型
    changeBlockType(slashMenuBlockId.value, commandValue)
    
    // 关闭菜单
    showSlashMenu.value = false
    slashMenuBlockId.value = null
    
    // 重新聚焦到textarea
    nextTick(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.focus()
      }
    })
  }
}

// 改变块类型
const changeBlockType = (blockId, newType) => {
  appStore.updateBlockType(blockId, newType)
}

// 插入图片块
const insertImageBlock = (index, imageType) => {
  appStore.insertImageBlock(index, imageType)
}

// 插入文本内容块
const insertTextBlock = (index, textType) => {
  const defaultTexts = {
    'title': '新的标题内容',
    'body': '新的正文内容，点击这里开始编辑...',
    'intro': '新的引言内容，点击这里开始编辑...',
    'outro': '新的结尾内容，点击这里开始编辑...'
  }

  const defaultText = defaultTexts[textType] || '新内容，点击编辑...'

  appStore.insertTextBlock(index + 1, textType, defaultText)
}

// 删除块
const deleteBlock = (index) => {
  const newBlocks = [...contentBlocks.value]
  newBlocks.splice(index, 1)
  appStore.setContentBlocks(newBlocks)

  // 如果删除的是当前选中的块，取消选中
  if (contentBlocks.value[index]?.id === selectedBlockId.value) {
    selectedBlockId.value = null
  }
}

// 确认删除块 - 防止误删除
const confirmDeleteBlock = (index, blockId) => {
  const block = contentBlocks.value[index]
  const blockType = block ? getBlockTypeDisplayName(block.type) : '内容块'

  // 使用更友好的确认对话框
  if (confirm(`确定要删除这个${blockType}吗？\n\n内容：${block?.text?.substring(0, 50)}${block?.text?.length > 50 ? '...' : ''}\n\n此操作不可恢复。`)) {
    deleteBlock(index)
  }
}

// 格式化块文本显示
const formatBlockText = (text) => {
  return cleanBlockText(text)
}

// 获取类型标签的样式类
const getTypeLabelClass = (type) => {
  const classMap = {
    'intro': 'bg-purple-100 text-purple-800',
    'title': 'bg-blue-100 text-blue-800',
    'body': 'bg-green-100 text-green-800',
    'outro': 'bg-purple-100 text-purple-800',
    'image_single': 'bg-yellow-100 text-yellow-800',
    'image_double': 'bg-orange-100 text-orange-800'
  }
  return classMap[type] || 'bg-gray-100 text-gray-800'
}

// 获取图片占位符文本
const getImagePlaceholder = (type) => {
  const placeholders = {
    'image_single': '[单图模板]',
    'image_double': '[双图模板]'
  }
  return placeholders[type] || '[图片]'
}

// 判断是否为图片块
const isImageBlock = (type) => {
  return ['image_single', 'image_double'].includes(type)
}

// 编辑功能相关方法
const startEditBlock = (blockId) => {
  const block = contentBlocks.value.find(b => b.id === blockId)
  if (block && block.text) {
    // 添加一个小的延迟，防止快速点击导致的误触
    setTimeout(() => {
      editingBlockId.value = blockId
      editingText.value = block.text
      selectedBlockId.value = null // 清除选择状态

      // 下一帧聚焦到textarea
      nextTick(() => {
        const textarea = document.querySelector('textarea')
        if (textarea) {
          textarea.focus()
          // 将光标移动到文本末尾
          textarea.selectionStart = textarea.selectionEnd = textarea.value.length
        }
      })
    }, 50) // 50ms延迟
  }
}

const saveBlockEdit = (blockId) => {
  if (editingText.value.trim()) {
    appStore.updateBlockText(blockId, editingText.value.trim())
  }
  editingBlockId.value = null
  editingText.value = ''
}

const cancelBlockEdit = () => {
  editingBlockId.value = null
  editingText.value = ''
}

// 处理textarea失去焦点事件 - 防止误触
const handleTextareaBlur = (blockId) => {
  // 延迟处理，避免点击按钮时触发blur
  setTimeout(() => {
    // 检查当前焦点是否在按钮上
    const activeElement = document.activeElement
    if (activeElement && activeElement.tagName === 'BUTTON') {
      // 如果焦点在按钮上，不处理blur事件
      return
    }
    // 否则保存编辑
    saveBlockEdit(blockId)
  }, 150) // 150ms延迟，给点击按钮足够时间
}

// 获取不同类型文本框的样式类
const getBlockTextareaClass = (type) => {
  const classMap = {
    'title': 'text-lg font-semibold text-center',
    'body': 'text-base',
    'intro': 'text-base italic',
    'outro': 'text-base italic'
  }
  return classMap[type] || 'text-base'
}

// 获取不同类型的占位符文本
const getBlockPlaceholder = (type) => {
  const placeholders = {
    'title': '请输入标题内容...',
    'body': '请输入正文内容...',
    'intro': '请输入引言内容...',
    'outro': '请输入结尾内容...'
  }
  return placeholders[type] || '请输入内容...'
}


// 导航操作
const goToPreviousStep = () => {
  router.push('/step1')
}

const goToStyleConfig = () => {
  router.push('/style-config')
}

const goToNextStep = () => {
  if (contentBlocks.value.length > 0) {
    // 验证是否有装饰样式配置
    const styleConfig = appStore.styleConfig
    const hasTitleStyle = styleConfig?.title && styleConfig.title.fullExample
    const hasBodyStyle = styleConfig?.body && styleConfig.body.fullExample
    const hasIntroStyle = styleConfig?.intro && styleConfig.intro.fullExample

    if (!hasTitleStyle && !hasBodyStyle && !hasIntroStyle) {
      alert('请先在左侧选择装饰样式后再进入预览阶段！')
      return
    }
    router.push('/step3')
  }
}

// 组件挂载时如果没有内容块，返回第一步
onMounted(() => {
  if (contentBlocks.value.length === 0 && !appStore.rawText) {
    router.push('/step1')
  }
  
  // 点击外部关闭下拉菜单和斜杠菜单
  document.addEventListener('click', () => {
    showTypeDropdown.value = null
    showSlashMenu.value = false
  })
})
</script>

<style scoped>
/* 组件特定的样式 */
</style>