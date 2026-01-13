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

			if (block.type.startsWith('image_') || (block.meta && block.meta.aiImageUrl)) {
				imageCounter++
			}
		}
	})

	// 添加HTML尾部
	let footer = configStore.currentFooter
	const appStore = useAppStore()

	footer = footer
		.replace(/{{PLANNERS}}/g, appStore.plannerNames.join(' ') || ' ')
		.replace(/{{COPYWRITERS}}/g, appStore.copywriterNames.join(' ') || ' ')
		.replace(/{{EDITORS}}/g, appStore.editorNames.join(' ') || ' ')
		.replace(/{{TEAM_NAME}}/g, appStore.teamName || '"团队名称待填写"')
		.replace(/{{SOURCE_ACCOUNT}}/g, appStore.sourceAccount || '"来源公众号待填写"')
		.replace(/{{EDITOR_INPUT}}/g, appStore.editorInput || ' ')

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
	imageIndex: number = 0
): string {
	if (!block || typeof block !== 'object') {
		throw new Error('Invalid block: must be an object')
	}

	const content: string = block.text || ''

	const normalizeCaptionText = (value: string): string => {
		if (!value) return ''
		return value.replace(/&nbsp;/g, ' ').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
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
			return applyStyle(content, styleConfig.title || null)
		case 'body':
			return applyStyle(content, styleConfig.body || null)
		case 'intro':
		case 'outro':
			return applyStyle(content, styleConfig.intro || null)
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
			const childrenHtml = block.children?.map((child, idx) =>
				buildStyledBlock(child, styleConfig, addPlaceholderMarkers, imageIndex + idx + 1)
			).join('\n') || ''
			return applyStyle(childrenHtml, styleConfig.container || null)
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

function applyStyle(content: string, styleObj: StyleTemplate | null | undefined): string {
	if (!styleObj || !styleObj.fullExample) return content
	return styleObj.fullExample.replace('{{CONTENT}}', content)
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
