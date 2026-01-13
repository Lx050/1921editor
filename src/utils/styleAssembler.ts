// @ts-expect-error - templates.js 尚未迁移到 TypeScript，遵循最简原则忽略类型
import { IMAGE_TEMPLATES } from '../styles/templates'
import type { ContentBlock, StyleConfig, BlockType, StyleTemplate } from '@/types'
import { useConfigStore } from '../stores/configStore'
import { useAppStore } from '../stores/appStore'

/**
 * 样式组装引擎
 * 根据内容块类型和装饰样式配置生成最终的HTML
 * @param contentBlocks - 内容块数组
 * @param styleConfig - 装饰样式配置（可选）
 * @param addPlaceholderMarkers - V2: 是否添加图片占位符标记（用于图片替换功能）
 * @returns 完整的HTML字符串
 */
export function buildHtml(
	contentBlocks: ContentBlock[],
	styleConfig: StyleConfig | null = null,
	addPlaceholderMarkers: boolean = false
): string {
	const countImages = (block: ContentBlock): number => {
		let count = 0
		if (block.type === 'image_single' || block.type === 'image_single_caption' || (block.meta && block.meta.aiImageUrl)) {
			count = 1
		} else if (block.type === 'image_double' || block.type === 'image_double_caption') {
			count = 2
		} else if (block.type === 'container' && block.children) {
			count = block.children.reduce((acc, child) => acc + countImages(child), 0)
		}
		return count
	}
	if (!Array.isArray(contentBlocks)) {
		throw new Error('Invalid contentBlocks: must be an array')
	}

	const htmlParts: string[] = []

	// 添加HTML头部
	const configStore = useConfigStore()
	htmlParts.push(configStore.currentHeader)

	// 遍历内容块并应用装饰样式
	let imageCounter = 0

	contentBlocks.forEach((block: ContentBlock): void => {
		let blockHtml: string = ''

		if (styleConfig) {
			blockHtml = buildStyledBlock(block, styleConfig, addPlaceholderMarkers, imageCounter)
			htmlParts.push(blockHtml)
			imageCounter += countImages(block)
		}
	})

	// 添加HTML尾部
	let footer = configStore.currentFooter
	const appStore = useAppStore()

	footer = footer
		.replace(/{{PLANNERS}}/g, appStore.plannerNames.join(' ') || '王雪 宋欣翼')
		.replace(/{{COPYWRITERS}}/g, appStore.copywriterNames.join(' ') || (appStore.editorInput || ' '))
		.replace(/{{EDITORS}}/g, appStore.editorNames.join(' ') || '朱梦鹤')
		.replace(/{{TEAM_NAME}}/g, appStore.teamName || '社会实践队')
		.replace(/{{SOURCE_ACCOUNT}}/g, appStore.sourceAccount || '校团委青年媒体中心')
		.replace(/{{EDITOR_INPUT}}/g, appStore.editorInput || ' ')

	// 特殊处理：如果 TEAM_PROJECT 为空，移除整行
	if (appStore.teamProject) {
		footer = footer.replace(/<p v-if="{{TEAM_PROJECT}}">.*?<\/p>/g, `<p>社会实践专项：${appStore.teamProject}</p>`)
	} else {
		footer = footer.replace(/<p v-if="{{TEAM_PROJECT}}">.*?<\/p>/g, '')
	}
	footer = footer.replace(/{{TEAM_PROJECT}}/g, appStore.teamProject || '')

	footer = `<div id="editable-footer" contenteditable="true" style="outline: none;">${footer}</div>`
	htmlParts.push(footer)

	return htmlParts.join('\n')
}

/**
 * 使用装饰样式构建内容块
 * @private
 */
function buildStyledBlock(
	block: ContentBlock,
	styleConfig: StyleConfig,
	addPlaceholderMarkers: boolean = false,
	imageIndex: number = 0,
	isInsideContainer: boolean = false
): string {
	if (!block || typeof block !== 'object') {
		throw new Error('Invalid block: must be an object')
	}

	const content: string = block.text || ''

	const normalizeCaptionText = (value: string): string => {
		if (!value) return ''
		return value.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
	}

	// 容器逻辑：
	// 1. 小标题 (title) 无论是否在容器内，都保留其选择的组件样式（因为标题带图标，属于内容的一部分）
	// 2. 正文 (body) 和 引言 (intro) 如果在容器内，则强制使用兜底样式（因为容器本身已经套了正文样式的大边框）
	let blockStyle: StyleTemplate | null = null
	if (block.type === 'title') {
		blockStyle = styleConfig.title || null
	} else if (!isInsideContainer) {
		if (block.type === 'body') blockStyle = styleConfig.body || null
		else if (block.type === 'intro' || block.type === 'outro') blockStyle = styleConfig.intro || null
	}

	// AI 生成图片优先渲染
	if (block.meta && block.meta.aiImageUrl) {
		let html = IMAGE_TEMPLATES.single
		html = html.replace(/src="[^"]*"/, `src="${block.meta.aiImageUrl}"`)
		if (addPlaceholderMarkers) {
			html = addImagePlaceholderMarker(html, `image_${imageIndex}`)
		}
		return html
	}

	switch (block.type) {
		case 'title':
			return applyStyle(content, blockStyle, 'title')
		case 'body':
			return applyStyle(content, blockStyle, 'body')
		case 'intro':
		case 'outro':
			return applyStyle(content, blockStyle, 'intro')
		case 'image_single': {
			let html = IMAGE_TEMPLATES.single
			if (addPlaceholderMarkers) html = addImagePlaceholderMarker(html, `image_${imageIndex}`)
			return html
		}
		case 'image_single_caption': {
			let html = IMAGE_TEMPLATES.single_caption
			html = html.replace('{{caption}}', normalizeCaptionText(content))
			if (addPlaceholderMarkers) html = addImagePlaceholderMarker(html, `image_${imageIndex}`)
			return html
		}
		case 'image_double': {
			let html = IMAGE_TEMPLATES.double
			if (addPlaceholderMarkers) html = addDoubleImagePlaceholderMarkers(html, `image_${imageIndex}`)
			return html
		}
		case 'image_double_caption': {
			let html = IMAGE_TEMPLATES.double_caption
			let c1 = content, c2 = content
			if (content.includes('|') || content.includes('｜')) {
				const parts = content.split(/[|｜]/)
				c1 = parts[0]?.trim() || ''; c2 = parts[1]?.trim() || ''
			} else if (content.trim().includes(' ')) {
				const parts = content.trim().split(/\s+/)
				if (parts.length >= 2) { c1 = parts[0]; c2 = parts.slice(1).join(' ') }
			}
			html = html.replace('{{caption1}}', normalizeCaptionText(c1)).replace('{{caption2}}', normalizeCaptionText(c2))
			if (addPlaceholderMarkers) html = addDoubleImagePlaceholderMarkers(html, `image_${imageIndex}`)
			return html
		}
		case 'container': {
			// 递归渲染子块，标记为 isInsideContainer = true
			const childrenHtml = block.children?.map((child, idx) => {
				const prevImagesCount = block.children?.slice(0, idx).reduce((acc, curr) =>
					acc + (curr.type.startsWith('image_') || (curr.meta && curr.meta.aiImageUrl) ? 1 : 0), 0) || 0;
				return buildStyledBlock(child, styleConfig, addPlaceholderMarkers, imageIndex + prevImagesCount, true)
			}).join('\n') || ''

			// 容器整体使用选中的“正文样式”套壳
			// 优先级：配置中显式指定的 container 样式 > body 样式 > 无样式
			const containerStyle = styleConfig.container || styleConfig.body || null
			return applyStyle(childrenHtml, containerStyle, 'container')
		}
		default:
			return ''
	}
}

function addDoubleImagePlaceholderMarkers(html: string, placeholderIdBase: string): string {
	let counter = 1
	return html.replace(/<img([^>]*)>/g, (match, p1) => {
		if (counter <= 2) {
			const replacement = `<img${p1} data-placeholder="${placeholderIdBase}_${counter}">`
			counter++
			return replacement
		}
		return match
	})
}

function addImagePlaceholderMarker(html: string, placeholderId: string): string {
	return html.replace(/<img([^>]*)>/g, `<img$1 data-placeholder="${placeholderId}">`)
}

function applyStyle(content: string, styleObj: StyleTemplate | null | undefined, type?: BlockType): string {
	if (styleObj && styleObj.fullExample) {
		return styleObj.fullExample.replace('{{CONTENT}}', content)
	}

	// 默认兜底样式 (微软雅黑 + 16/14/12px)
	switch (type) {
		case 'title':
			return `<section style="margin: 10px auto; text-align: center;"><p style="line-height: 1.6em;"><span style="font-family: '微软雅黑', sans-serif; font-size: 16px; font-weight: bold; color: #333;">${content}</span></p></section>`
		case 'body':
			return `<section style="font-size: 14px; color: #333333; line-height: 1.6; margin: 1em 0px; text-align: justify; padding: 0px 10px; box-sizing: border-box; font-family: 微软雅黑, sans-serif;">
	<p style="text-indent: 2.25em; line-height: 1.75em; margin: 0;">
		<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, 'Microsoft YaHei', SimHei, STHeiti;">${content}</span>
	</p>
</section>`
		case 'intro':
			return `<section style="font-size: 12px; color: #666666; line-height: 1.6; margin: 1em 0px; text-align: justify; padding: 0px 10px; box-sizing: border-box; font-family: 微软雅黑, sans-serif;">
	<p style="text-indent: 0; line-height: 1.6em; margin: 0;">
		<span style="font-weight: 400; color: #666666; text-shadow: none; letter-spacing: 1.5px; font-size: 12px; font-family: 微软雅黑, 'Microsoft YaHei', SimHei, STHeiti;">${content}</span>
	</p>
</section>`
		case 'container':
			return `<section class="nested-container-wrapper" style="margin: 0; padding: 0;">${content}</section>`
		default:
			return content
	}
}

export function getBlockTypeDisplayName(type: BlockType): string {
	const typeNames: Record<BlockType, string> = {
		'intro': '引言', 'title': '小标题', 'body': '正文', 'outro': '结尾',
		'image_single': '单图', 'image_single_caption': '单图+注',
		'image_double': '双图', 'image_double_caption': '双图+注',
		'container': '容器'
	}
	return typeNames[type] || '正文'
}

export function getBlockTypeOptions(): Array<{ value: BlockType; label: string }> {
	return [
		{ value: 'intro', label: '引言' },
		{ value: 'title', label: '小标题' },
		{ value: 'body', label: '正文' },
		{ value: 'outro', label: '结尾' },
		{ value: 'container', label: '容器' }
	]
}
