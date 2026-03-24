<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- 顶部操作栏 -->
    <div class="flex-shrink-0 p-4 md:p-6 border-b bg-white">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">样式管理中心</h2>
          <p class="text-xs md:text-sm text-gray-600">管理装饰模板：添加、编辑、删除</p>
        </div>

        <div class="flex items-center space-x-2 md:space-x-3">
          <button
            @click="goBack"
            class="flex-1 md:flex-none px-3 md:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            ← 返回
          </button>
          <button
            @click="addNewStyle"
            class="flex-1 md:flex-none px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>添加样式</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="flex-shrink-0 flex border-b bg-white overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'flex-1 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap',
          activeTab === tab.value
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        ]"
      >
        {{ tab.label }} ({{ getStyleCount(tab.value) }})
      </button>
    </div>

    <!-- 样式列表 -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="style in currentStyles"
          :key="style.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
        >
          <!-- 样式预览 -->
          <div class="h-24 overflow-hidden rounded bg-gray-50 mb-3 flex items-center justify-center">
            <div v-html="sanitizeHtml(getPreviewWithContent(style))" class="transform scale-50 origin-center"></div>
          </div>

          <!-- 样式信息 -->
          <div class="mb-3">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-medium text-gray-900">{{ style.name }}</h3>
              <span class="px-2 py-0.5 text-xs font-medium rounded"
                :class="style.source === 'api' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'">
                {{ getStyleSourceLabel(style) }}
              </span>
            </div>
            <p class="text-xs text-gray-500">ID: {{ style.id }}</p>
          </div>

          <!-- 操作按钮 -->
          <div class="flex space-x-2">
            <button
              @click="editStyle(style)"
              :disabled="!canEditStyle(style)"
              :class="[
                'flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors',
                canEditStyle(style)
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
              :title="canEditStyle(style) ? '编辑' : (style.source === 'local' ? '只有管理员可以编辑本地样式' : '无权限编辑')"
            >
              编辑
            </button>
            <button
              @click="deleteStyleHandler(style)"
              :disabled="!canEditStyle(style)"
              :class="[
                'flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors',
                canEditStyle(style)
                  ? 'bg-red-100 hover:bg-red-200 text-red-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
              :title="canEditStyle(style) ? '删除' : (style.source === 'local' ? '只有管理员可以删除本地样式' : '无权限删除')"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="currentStyles.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">暂无样式</div>
        <button
          @click="addNewStyle"
          class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          添加第一个样式
        </button>
      </div>
    </div>

    <!-- 编辑/添加样式对话框 -->
    <div
      v-if="showEditDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeEditDialog"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">
            {{ editingStyle ? '编辑样式' : '添加新样式' }}
          </h3>

          <div class="space-y-4">
            <!-- 样式名称和类型 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">样式名称</label>
                <input
                  v-model="editForm.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="例如：渐变标题"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">样式类型</label>
                <select
                  v-model="editForm.type"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="title">标题</option>
                  <option value="body">正文</option>
                  <option value="intro">引言</option>
                </select>
              </div>
            </div>

            <!-- 编辑模式切换 -->
            <div class="border-b border-gray-200 flex space-x-4 mb-4">
              <button
                @click="editMode = 'visual'"
                :class="[
                  'py-2 px-1 text-sm font-medium border-b-2 transition-colors',
                  editMode === 'visual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                👁️ 可视化编辑 (推荐)
              </button>
              <button
                @click="editMode = 'code'"
                :class="[
                  'py-2 px-1 text-sm font-medium border-b-2 transition-colors',
                  editMode === 'code' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                ]"
              >
                📝 代码编辑
              </button>
            </div>

            <!-- 可视化编辑器 -->
            <div v-show="editMode === 'visual'" class="space-y-3">
              <div class="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex items-start">
                <span class="mr-2">💡</span>
                <div>
                  <p class="font-medium">使用说明：</p>
                  <ul class="list-disc list-inside mt-1 space-y-1 text-xs">
                    <li>从 135编辑器 或其他网页 <strong>复制</strong> 样式。</li>
                    <li>在下方编辑框中 <strong>粘贴 (Ctrl+V)</strong>。</li>
                    <li>选中原本的文字内容，点击 <strong>"设为内容占位符"</strong> 按钮。</li>
                  </ul>
                </div>
              </div>

              <div class="flex justify-between items-center">
                <label class="block text-sm font-medium text-gray-700">样式画布</label>
                <div class="space-x-2">
                  <button
                    @click="autoDetectPlaceholder"
                    class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded hover:bg-blue-200 transition-colors"
                    title="自动尝试识别并替换最长的文本段落"
                  >
                    🤖 自动识别占位符
                  </button>
                  <button
                    @click="setSelectionAsPlaceholder"
                    class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded hover:bg-orange-200 transition-colors"
                  >
                    ✨ 选中文字设为内容占位符
                  </button>
                </div>
              </div>

              <div
                ref="visualEditor"
                contenteditable="true"
                class="w-full min-h-[200px] p-4 border-2 border-dashed border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none overflow-y-auto bg-white"
                @input="syncVisualToCode"
                @paste="handleVisualPaste"
                style="outline: none;"
              ></div>
              
              <p class="text-xs text-gray-500 text-right">
                提示：如果样式显示不正常，请尝试切换到代码模式调整。
              </p>
            </div>

            <!-- 代码编辑器 -->
            <div v-show="editMode === 'code'" class="space-y-4">
              <!-- 预览HTML -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">预览HTML（缩略图）</label>
                <textarea
                  v-model="editForm.preview"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
                  placeholder="用于缩略图显示的HTML代码"
                ></textarea>
              </div>

              <!-- 完整模板HTML -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  完整模板HTML（必须包含 {{CONTENT}} 占位符）
                </label>
                <textarea
                  v-model="editForm.fullExample"
                  rows="8"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
                  placeholder="完整的HTML模板，用 {{CONTENT}} 作为内容占位符"
                  @input="syncCodeToVisual"
                ></textarea>
              </div>

              <!-- 预览区域 -->
              <div v-if="editForm.preview">
                <label class="block text-sm font-medium text-gray-700 mb-1">实时预览</label>
                <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div v-html="sanitizeHtml(editForm.preview)"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 对话框按钮 -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="closeEditDialog"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              @click="saveStyle"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 删除确认对话框 -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40" @click.self="showDeleteConfirm = false">
        <div class="bg-white rounded-xl shadow-2xl w-[360px] p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">确认删除</h3>
          <p class="text-sm text-gray-600 mb-6">确定要删除样式"{{ pendingDeleteStyle?.name }}"吗？此操作不可恢复。</p>
          <div class="flex justify-end gap-3">
            <button class="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200" @click="showDeleteConfirm = false">取消</button>
            <button class="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700" @click="confirmDelete">删除</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { sanitizeHtml } from '../utils/sanitizeHtml'
import toast from '../composables/useToast'
import { useStyleStore } from '../stores/styleStore'
import { useUserStore } from '../stores/userStore'
import {
  getAllStyles,
  updateStyle as updateLocalStyle,
  deleteStyle as deleteLocalStyle,
  isCustomStyle as isLocalCustomStyle
} from '../styles/styleStorage'

const router = useRouter()
const styleStore = useStyleStore()
const userStore = useUserStore()

// Tab 配置
const tabs = [
  { value: 'title', label: '标题样式' },
  { value: 'body', label: '正文样式' },
  { value: 'intro', label: '引言样式' }
]

// 当前激活的 Tab
const activeTab = ref('title')

// 样式数据（API + 本地）
const allStyles = ref({ title: [], body: [], intro: [] })

// 加载所有样式（合并 API 样式和本地样式）
const loadStyles = async () => {
  // 确保 styleStore 已加载
  await styleStore.fetchStyles()

  // 合并 API 样式和本地样式
  const localStyles = getAllStyles()

  allStyles.value = {
    title: [...styleStore.apiTitleStyles, ...localStyles.title],
    body: [...styleStore.apiBodyStyles, ...localStyles.body],
    intro: [...styleStore.apiIntroStyles, ...localStyles.intro]
  }
}

// 当前显示的样式列表
const currentStyles = computed(() => {
  return allStyles.value[activeTab.value] || []
})

// 获取样式数量
const getStyleCount = (type) => {
  return allStyles.value[type]?.length || 0
}

// 编辑对话框状态
const showEditDialog = ref(false)
const editingStyle = ref(null)
const editMode = ref('visual') // 'visual' | 'code'
const visualEditor = ref(null)
const editForm = ref({
  name: '',
  type: 'title',
  preview: '',
  fullExample: ''
})

// 添加新样式
const addNewStyle = () => {
  editingStyle.value = null
  editMode.value = 'visual'
  editForm.value = {
    name: '',
    type: activeTab.value,
    preview: '',
    fullExample: ''
  }
  showEditDialog.value = true
  nextTick(() => {
    if (visualEditor.value) {
      visualEditor.value.innerHTML = ''
    }
  })
}

// 编辑样式
const editStyle = (style) => {
  editingStyle.value = style
  editMode.value = 'visual'
  editForm.value = {
    name: style.name,
    type: style.type,
    preview: style.preview,
    fullExample: style.fullExample
  }
  showEditDialog.value = true

  // 初始化可视化编辑器内容
  nextTick(() => {
    if (visualEditor.value) {
      // 使用正则替换，避免 Vue 解析 {{CONTENT}}
      const tempPlaceholder = '\u0000CONTENT\u0000'
      const escapedHtml = style.fullExample.replace(/\{\{CONTENT\}\}/g, tempPlaceholder)
      visualEditor.value.innerHTML = escapedHtml.replace(tempPlaceholder, '<span data-placeholder="true">[内容占位符]</span>')
    }
  })
}

// 处理可视化粘贴
const handleVisualPaste = (e) => {
  // 允许默认粘贴行为，浏览器会自动处理HTML
  // 我们只需要在粘贴后同步代码
  setTimeout(syncVisualToCode, 0)
}

// 同步可视化内容到代码
const syncVisualToCode = () => {
  if (!visualEditor.value) return
  
  let html = visualEditor.value.innerHTML
  
  // 将可视化的占位符替换回 {{CONTENT}}
  // 使用 data-placeholder 属性或文本内容来匹配
  html = html.replace(/<span[^>]*data-placeholder="true"[^>]*>\[内容占位符\]<\/span>/g, '{{CONTENT}}')
  // 兼容旧的匹配方式（以防万一）
  html = html.replace(/<span[^>]*>\[内容占位符\]<\/span>/g, '{{CONTENT}}')
  
  // 简单的清理：移除 contenteditable 属性（如果有）
  html = html.replace(/ contenteditable="true"/g, '')
  
  editForm.value.fullExample = html
  // 预览通常是完整代码的简化版，这里暂时直接用完整代码，用户可以在代码模式微调
  editForm.value.preview = html
}

// 同步代码到可视化内容
const syncCodeToVisual = () => {
  if (!visualEditor.value) return

  const html = editForm.value.fullExample
  // 使用临时占位符，避免 Vue 解析 {{CONTENT}}
  const tempPlaceholder = '\u0000CONTENT\u0000' // 使用空字符避免 Vue 解析
  const escapedHtml = html.replace(/\{\{CONTENT\}\}/g, tempPlaceholder)
  visualEditor.value.innerHTML = escapedHtml.replace(tempPlaceholder, '<span data-placeholder="true">[内容占位符]</span>')
}

// 自动识别占位符
const autoDetectPlaceholder = () => {
  if (!visualEditor.value) return
  
  // 递归查找最长的文本节点
  const findLongestTextNode = (node) => {
    let longest = { node: null, length: 0 }
    
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
      return { node: node, length: node.textContent.trim().length }
    }
    
    for (const child of node.childNodes) {
      const result = findLongestTextNode(child)
      if (result.length > longest.length) {
        longest = result
      }
    }
    
    return longest
  }
  
  const { node } = findLongestTextNode(visualEditor.value)
  
  if (node) {
    // 创建占位符
    const placeholder = document.createElement('span')
    placeholder.setAttribute('data-placeholder', 'true')
    placeholder.textContent = '[内容占位符]'
    
    // 替换节点
    const parent = node.parentNode
    parent.replaceChild(placeholder, node)
    
    // 应用标准样式
    const type = editForm.value.type
    if (type === 'title') {
        parent.style.fontSize = '16px'
        parent.style.fontWeight = 'normal'
        parent.style.fontFamily = "'微软雅黑', 'Microsoft YaHei', sans-serif"
        parent.style.lineHeight = '1.75'
        parent.style.textIndent = '0'
    } else if (type === 'body' || type === 'intro') {
        parent.style.fontSize = '14px'
        parent.style.fontFamily = "'微软雅黑', 'Microsoft YaHei', SimHei, STHeiti, sans-serif"
        parent.style.lineHeight = '1.75em'
        parent.style.textAlign = 'justify'
        parent.style.textIndent = '2.25em'
        parent.style.letterSpacing = '1.75px'
        parent.style.color = '#000000'
    }
    
    // 同步
    syncVisualToCode()
    toast.success('已自动识别占位符并应用标准样式')
  } else {
    toast.warning('未找到合适的文本内容，请手动选中文字设置')
  }
}

// 将选中文字设为占位符
const setSelectionAsPlaceholder = () => {
  const selection = window.getSelection()
  if (!selection.rangeCount) return
  
  const range = selection.getRangeAt(0)
  
  // 检查选区是否在编辑器内
  if (!visualEditor.value.contains(range.commonAncestorContainer)) {
    toast.warning('请先选中编辑器内的文字')
    return
  }
  
  // 创建占位符元素
  const placeholder = document.createElement('span')
  placeholder.setAttribute('data-placeholder', 'true')
  placeholder.textContent = '[内容占位符]'
  
  // 替换选区
  range.deleteContents()
  range.insertNode(placeholder)
  
  // 应用标准样式到父元素
  const parent = placeholder.parentElement
  if (parent) {
    const type = editForm.value.type
    if (type === 'title') {
        parent.style.fontSize = '16px'
        parent.style.fontWeight = 'normal'
        parent.style.fontFamily = "'微软雅黑', 'Microsoft YaHei', sans-serif"
        parent.style.lineHeight = '1.75'
        parent.style.textIndent = '0'
    } else if (type === 'body' || type === 'intro') {
        parent.style.fontSize = '14px'
        parent.style.fontFamily = "'微软雅黑', 'Microsoft YaHei', SimHei, STHeiti, sans-serif"
        parent.style.lineHeight = '1.75em'
        parent.style.textAlign = 'justify'
        parent.style.textIndent = '2.25em'
        parent.style.letterSpacing = '1.75px'
        parent.style.color = '#000000'
    }
  }
  
  // 清除选择
  selection.removeAllRanges()
  
  // 同步更新代码
  syncVisualToCode()
}

// 判断是否可以编辑样式
// 云端样式（API样式）：所有人都可以修改和删除
// 本地样式：只有管理员可以修改/删除
const canEditStyle = (style) => {
  if (!style) return false
  // API 样式：所有人都可以修改
  if (style.source === 'api') {
    return true
  }
  // 本地样式：只有管理员可以修改
  return userStore.isAdmin
}

// 判断样式来源标签文本
const getStyleSourceLabel = (style) => {
  if (style.source === 'api') {
    return style.isCustom ? '自定义' : '系统'
  }
  return '本地'
}

// 获取带示例文字的预览HTML
const getPreviewWithContent = (style) => {
  const sampleText = '西大'
  let html = style.fullExample || style.preview || ''

  // 替换任意占位符为示例文字
  html = html.replace(/\{\{[^}]+\}\}/g, sampleText)

  // 若模板未包含占位符，追加一个可见示例
  if (!html.includes(sampleText)) {
    html += `<div style="margin-top: 6px; text-align: center; font-size: 14px; color: #333;">${sampleText}</div>`
  }

  return html
}

// 保存样式
const saveStyle = async () => {
  if (!editForm.value.name || !editForm.value.fullExample) {
    toast.warning('请填写样式名称和完整模板HTML')
    return
  }

  if (!editForm.value.fullExample.includes('{{CONTENT}}')) {
    toast.warning('完整模板HTML必须包含 {{CONTENT}} 占位符')
    return
  }

  try {
    if (editingStyle.value) {
      if (!canEditStyle(editingStyle.value)) {
        toast.error(editingStyle.value.source === 'local' ? '只有管理员可以修改本地样式' : '您没有权限修改此样式')
        return
      }

      if (editingStyle.value.source === 'api') {
        await styleStore.updateStyle(editingStyle.value.id, {
          name: editForm.value.name,
          type: editForm.value.type,
          preview: editForm.value.preview,
          fullExample: editForm.value.fullExample
        })
      } else {
        updateLocalStyle(editingStyle.value.id, {
          name: editForm.value.name,
          type: editForm.value.type,
          preview: editForm.value.preview,
          fullExample: editForm.value.fullExample
        })
      }

      await loadStyles()
      closeEditDialog()
      toast.success('保存成功')
    } else {
      await styleStore.addStyle({
        name: editForm.value.name,
        type: editForm.value.type,
        preview: editForm.value.preview,
        fullExample: editForm.value.fullExample
      })

      await loadStyles()
      closeEditDialog()
      toast.success('添加成功')
    }
  } catch (error) {
    console.error('保存样式失败:', error)
    toast.error('保存失败: ' + (error.message || '请重试'))
  }
}

// 确认删除对话框状态
const pendingDeleteStyle = ref(null)
const showDeleteConfirm = ref(false)

// 删除样式
const deleteStyleHandler = async (style) => {
  if (!canEditStyle(style)) {
    toast.error(style.source === 'local' ? '只有管理员可以删除本地样式' : '您没有权限删除此样式')
    return
  }

  pendingDeleteStyle.value = style
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  const style = pendingDeleteStyle.value
  if (!style) return
  showDeleteConfirm.value = false

  try {
    if (style.source === 'api') {
      await styleStore.deleteStyle(style.id)
    } else {
      deleteLocalStyle(style.id)
    }

    await loadStyles()
    toast.success('删除成功')
  } catch (error) {
    console.error('删除样式失败:', error)
    toast.error('删除失败: ' + (error.message || '请重试'))
  } finally {
    pendingDeleteStyle.value = null
  }
}

// 关闭编辑对话框
const closeEditDialog = () => {
  showEditDialog.value = false
  editingStyle.value = null
}

// 返回编辑页面
const goBack = () => {
  router.push('/step2')
}

// 组件挂载时加载样式
onMounted(() => {
  loadStyles()
})
</script>

<style scoped>
/* 组件特定样式 */
</style>
