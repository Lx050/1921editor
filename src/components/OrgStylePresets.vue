<template>
	<div class="org-style-presets">
		<div class="section-header">
			<h3>排版样式预设</h3>
			<button class="btn-reset" @click="handleResetAll">恢复默认</button>
		</div>
		<p class="section-desc">设置后默认使用此样式，无需逐篇调整。</p>

		<!-- 小标题设置 -->
		<div class="preset-group">
			<div class="group-label">小标题</div>
			<div class="preset-row">
				<div class="preset-field">
					<label>字体</label>
					<select v-model="localPreset.titleFontFamily" @change="emitUpdate">
						<option v-for="f in fontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
					</select>
				</div>
				<div class="preset-field">
					<label>字号</label>
					<select v-model.number="localPreset.titleFontSize" @change="emitUpdate">
						<option v-for="s in sizeOptions" :key="s" :value="s">{{ s }}px</option>
					</select>
				</div>
				<div class="preset-field">
					<label>加粗</label>
					<input type="checkbox" v-model="localPreset.titleBold" @change="emitUpdate" />
				</div>
			</div>
		</div>

		<!-- 正文设置 -->
		<div class="preset-group">
			<div class="group-label">正文</div>
			<div class="preset-row">
				<div class="preset-field">
					<label>字体</label>
					<select v-model="localPreset.bodyFontFamily" @change="emitUpdate">
						<option v-for="f in fontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
					</select>
				</div>
				<div class="preset-field">
					<label>字号</label>
					<select v-model.number="localPreset.bodyFontSize" @change="emitUpdate">
						<option v-for="s in sizeOptions" :key="s" :value="s">{{ s }}px</option>
					</select>
				</div>
				<div class="preset-field">
					<label>首行缩进</label>
					<input type="checkbox" v-model="localPreset.bodyIndent" @change="emitUpdate" />
				</div>
			</div>
			<div class="preset-row">
				<div class="preset-field">
					<label>行高</label>
					<select v-model.number="localPreset.bodyLineHeight" @change="emitUpdate">
						<option :value="1.5">1.5倍</option>
						<option :value="1.75">1.75倍</option>
						<option :value="2">2倍</option>
						<option :value="2.25">2.25倍</option>
					</select>
				</div>
				<div class="preset-field">
					<label>字间距</label>
					<select v-model.number="localPreset.bodyLetterSpacing" @change="emitUpdate">
						<option :value="0.5">0.5px</option>
						<option :value="1">1px</option>
						<option :value="1.5">1.5px</option>
						<option :value="2">2px</option>
					</select>
				</div>
			</div>
		</div>

		<!-- 引言设置 -->
		<div class="preset-group">
			<div class="group-label">引言/结尾</div>
			<div class="preset-row">
				<div class="preset-field">
					<label>字体</label>
					<select v-model="localPreset.introFontFamily" @change="emitUpdate">
						<option v-for="f in fontOptions" :key="f.value" :value="f.value">{{ f.label }}</option>
					</select>
				</div>
				<div class="preset-field">
					<label>字号</label>
					<select v-model.number="localPreset.introFontSize" @change="emitUpdate">
						<option v-for="s in sizeOptions" :key="s" :value="s">{{ s }}px</option>
					</select>
				</div>
			</div>
		</div>

		<!-- 实时预览 -->
		<div class="preview-box">
			<div class="preview-label">预览效果</div>
			<div class="preview-content">
				<p :style="titlePreviewStyle">这是小标题样式预览</p>
				<p :style="bodyPreviewStyle">这是正文内容样式预览，包含首行缩进、字间距、行高等设置。这段文字可以帮助你直观感受排版效果。</p>
				<p :style="introPreviewStyle">这是引言/结尾样式预览文字。</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { OrgStylePreset } from '../stores/orgConfigStore'

const props = defineProps<{
	preset: OrgStylePreset
	defaultPreset: OrgStylePreset
}>()

const emit = defineEmits<{
	update: [preset: OrgStylePreset]
	reset: []
}>()

const localPreset = reactive<OrgStylePreset>({ ...props.preset })

watch(() => props.preset, (newVal) => {
	Object.assign(localPreset, newVal)
}, { deep: true })

const fontOptions = [
	{ label: '微软雅黑', value: '微软雅黑, Microsoft YaHei, SimHei, STHeiti' },
	{ label: '宋体', value: '宋体, SimSun, STSong' },
	{ label: '黑体', value: '黑体, SimHei, STHeiti' },
	{ label: '楷体', value: '楷体, KaiTi, STKaiti' },
	{ label: '仿宋', value: '仿宋, FangSong, STFangsong' },
	{ label: 'Arial', value: 'Arial, Helvetica, sans-serif' }
]

const sizeOptions = [12, 13, 14, 15, 16, 17, 18, 20]

const titlePreviewStyle = computed(() => ({
	fontFamily: localPreset.titleFontFamily,
	fontSize: localPreset.titleFontSize + 'px',
	fontWeight: localPreset.titleBold ? 'bold' : 'normal',
	textAlign: 'center' as const,
	margin: '0 0 8px',
	lineHeight: '1.75'
}))

const bodyPreviewStyle = computed(() => ({
	fontFamily: localPreset.bodyFontFamily,
	fontSize: localPreset.bodyFontSize + 'px',
	textIndent: localPreset.bodyIndent ? '2em' : '0',
	lineHeight: localPreset.bodyLineHeight + '',
	letterSpacing: localPreset.bodyLetterSpacing + 'px',
	margin: '0 0 8px',
	textAlign: 'justify' as const
}))

const introPreviewStyle = computed(() => ({
	fontFamily: localPreset.introFontFamily,
	fontSize: localPreset.introFontSize + 'px',
	margin: '0',
	lineHeight: '1.75',
	color: '#666'
}))

function emitUpdate() {
	emit('update', { ...localPreset })
}

function handleResetAll() {
	Object.assign(localPreset, props.defaultPreset)
	emit('reset')
}
</script>

<style scoped>
.org-style-presets {
	margin-bottom: 24px;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 4px;
}

.section-header h3 {
	font-size: 15px;
	font-weight: 600;
	color: #1e293b;
	margin: 0;
}

.section-desc {
	font-size: 12px;
	color: #94a3b8;
	margin: 0 0 16px;
}

.btn-reset {
	padding: 4px 12px;
	background: transparent;
	color: #64748b;
	border: 1px solid #cbd5e1;
	border-radius: 4px;
	font-size: 12px;
	cursor: pointer;
}

.btn-reset:hover {
	background: #f1f5f9;
}

.preset-group {
	margin-bottom: 16px;
	padding: 12px;
	background: #f8fafc;
	border: 1px solid #e2e8f0;
	border-radius: 6px;
}

.group-label {
	font-size: 13px;
	font-weight: 600;
	color: #475569;
	margin-bottom: 8px;
}

.preset-row {
	display: flex;
	gap: 16px;
	flex-wrap: wrap;
	margin-bottom: 8px;
}

.preset-row:last-child {
	margin-bottom: 0;
}

.preset-field {
	display: flex;
	align-items: center;
	gap: 6px;
}

.preset-field label {
	font-size: 12px;
	color: #64748b;
	white-space: nowrap;
}

.preset-field select {
	padding: 3px 6px;
	border: 1px solid #cbd5e1;
	border-radius: 4px;
	font-size: 12px;
	background: white;
}

.preset-field input[type="checkbox"] {
	width: 14px;
	height: 14px;
	cursor: pointer;
}

.preview-box {
	margin-top: 16px;
	border: 1px solid #e2e8f0;
	border-radius: 6px;
	overflow: hidden;
}

.preview-label {
	background: #f8fafc;
	padding: 6px 12px;
	font-size: 12px;
	color: #94a3b8;
	border-bottom: 1px solid #e2e8f0;
}

.preview-content {
	padding: 16px;
	background: white;
}
</style>
