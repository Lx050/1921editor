<template>
	<div class="org-template-editor">
		<div class="editor-header">
			<h3 class="editor-title">{{ title }}</h3>
			<div class="editor-actions">
				<button
					v-if="hasCustomContent"
					class="btn-reset"
					@click="handleReset"
				>
					恢复默认
				</button>
				<button class="btn-save" @click="handleSave">
					保存
				</button>
			</div>
		</div>

		<div class="editor-hint">
			<p>在下方画布中直接编辑内容。支持从微信编辑器 / 135编辑器复制粘贴富文本。</p>
			<p>编辑完成后点击"保存"，所有团队成员将自动使用此模板。</p>
		</div>

		<!-- 可视化画布 -->
		<div class="canvas-wrapper">
			<div class="canvas-toolbar">
				<span class="mode-label">{{ modeLabel }}</span>
				<button class="toolbar-btn" @click="handleCopyAll" title="复制全部">
					复制
				</button>
				<button class="toolbar-btn" @click="handlePasteReplace" title="粘贴替换">
					粘贴替换
				</button>
			</div>
			<div
				ref="canvasRef"
				class="editor-canvas"
				contenteditable="true"
				@input="onCanvasInput"
				@paste="onCanvasPaste"
				v-html="canvasHtml"
			></div>
		</div>

		<!-- 保存状态提示 -->
		<div v-if="saveStatus" class="save-status" :class="saveStatus">
			{{ saveStatus === 'success' ? '已保存' : '保存失败' }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps<{
	title: string
	type: 'header' | 'footer'
	mode: string
	defaultHtml: string
	customHtml: string | null
}>()

const emit = defineEmits<{
	save: [html: string]
	reset: []
}>()

const canvasRef = ref<HTMLDivElement | null>(null)
const canvasHtml = ref('')
const saveStatus = ref<'success' | 'error' | ''>('')
const isDirty = ref(false)

const modeLabel = computed(() => {
	const labels: Record<string, string> = {
		daily: '日常模式',
		three_rural: '三下乡模式',
		reprint: '转载模式'
	}
	return labels[props.mode] || props.mode
})

const hasCustomContent = computed(() => !!props.customHtml)

// 初始化画布内容
onMounted(() => {
	canvasHtml.value = props.customHtml || props.defaultHtml
})

// 监听外部属性变化
watch(() => [props.customHtml, props.defaultHtml, props.mode], () => {
	if (!isDirty.value) {
		canvasHtml.value = props.customHtml || props.defaultHtml
	}
})

function onCanvasInput() {
	isDirty.value = true
}

function onCanvasPaste(_e: ClipboardEvent) {
	// 允许富文本粘贴 - 浏览器默认会处理 HTML 粘贴
	// 不做 preventDefault，让富文本内容直接进入 contenteditable
	isDirty.value = true
}

function handleSave() {
	if (!canvasRef.value) return
	const html = canvasRef.value.innerHTML
	emit('save', html)
	isDirty.value = false
	saveStatus.value = 'success'
	setTimeout(() => { saveStatus.value = '' }, 2000)
}

function handleReset() {
	canvasHtml.value = props.defaultHtml
	isDirty.value = false
	emit('reset')
}

async function handleCopyAll() {
	if (!canvasRef.value) return
	try {
		// 选择画布全部内容
		const selection = window.getSelection()
		const range = document.createRange()
		range.selectNodeContents(canvasRef.value)
		selection?.removeAllRanges()
		selection?.addRange(range)
		// 使用 execCommand 复制（兼容微信编辑器粘贴）
		document.execCommand('copy')
		selection?.removeAllRanges()
		saveStatus.value = 'success'
		setTimeout(() => { saveStatus.value = '' }, 1500)
	} catch {
		console.error('Copy failed')
	}
}

async function handlePasteReplace() {
	try {
		const clipboardItems = await navigator.clipboard.read()
		for (const item of clipboardItems) {
			if (item.types.includes('text/html')) {
				const blob = await item.getType('text/html')
				const html = await blob.text()
				if (canvasRef.value) {
					canvasRef.value.innerHTML = html
					isDirty.value = true
				}
				return
			}
		}
		// 降级到纯文本
		const text = await navigator.clipboard.readText()
		if (canvasRef.value) {
			canvasRef.value.innerHTML = text
			isDirty.value = true
		}
	} catch {
		// 降级到 prompt
		console.warn('Clipboard API not available, falling back')
	}
}
</script>

<style scoped>
.org-template-editor {
	margin-bottom: 24px;
}

.editor-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.editor-title {
	font-size: 15px;
	font-weight: 600;
	color: #1e293b;
	margin: 0;
}

.editor-actions {
	display: flex;
	gap: 8px;
}

.btn-save {
	padding: 4px 16px;
	background: #3b82f6;
	color: white;
	border: none;
	border-radius: 4px;
	font-size: 13px;
	cursor: pointer;
}

.btn-save:hover {
	background: #2563eb;
}

.btn-reset {
	padding: 4px 16px;
	background: transparent;
	color: #64748b;
	border: 1px solid #cbd5e1;
	border-radius: 4px;
	font-size: 13px;
	cursor: pointer;
}

.btn-reset:hover {
	background: #f1f5f9;
}

.editor-hint {
	background: #f8fafc;
	border: 1px solid #e2e8f0;
	border-radius: 6px;
	padding: 10px 14px;
	margin-bottom: 12px;
}

.editor-hint p {
	margin: 0;
	font-size: 12px;
	color: #64748b;
	line-height: 1.6;
}

.editor-hint p + p {
	margin-top: 4px;
}

.canvas-wrapper {
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	overflow: hidden;
}

.canvas-toolbar {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 12px;
	background: #f8fafc;
	border-bottom: 1px solid #e2e8f0;
}

.mode-label {
	font-size: 12px;
	color: #94a3b8;
	margin-right: auto;
}

.toolbar-btn {
	padding: 2px 10px;
	background: white;
	border: 1px solid #cbd5e1;
	border-radius: 4px;
	font-size: 12px;
	color: #475569;
	cursor: pointer;
}

.toolbar-btn:hover {
	background: #f1f5f9;
}

.editor-canvas {
	min-height: 200px;
	max-height: 500px;
	overflow-y: auto;
	padding: 16px;
	background: white;
	outline: none;
	font-family: 微软雅黑, 'Microsoft YaHei', sans-serif;
	font-size: 14px;
	line-height: 1.75;
}

.editor-canvas:focus {
	box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* 确保画布中的图片自适应 */
.editor-canvas :deep(img) {
	max-width: 100%;
	height: auto;
}

.save-status {
	margin-top: 8px;
	font-size: 12px;
	text-align: right;
}

.save-status.success {
	color: #10b981;
}

.save-status.error {
	color: #ef4444;
}
</style>
