// @ts-expect-error - templates.js 尚未迁移到 TypeScript，遵循最简原则忽略类型
import { IMAGE_TEMPLATES } from '../styles/templates'
import type { ContentBlock, StyleConfig, BlockType, StyleTemplate } from '@/types'
import { useConfigStore } from '../stores/configStore'
import { useAppStore } from '../stores/appStore'
import type { OrgStylePreset } from '../stores/orgConfigStore'



/**
 * 读取组织级样式预设（仅当显式配置过时返回，否则返回 null）
 * @private
 */
function getOrgPresetIfConfigured(): OrgStylePreset | null {
	try {
		const stored = localStorage.getItem('org_template_config')
		if (!stored) return null
		const config = JSON.parse(stored)
		if (!config.stylePreset) return null
		// 合并默认值确保字段完整
		return {
			titleFontFamily: '微软雅黑, Microsoft YaHei, SimHei, STHeiti',
			titleFontSize: 16,
			titleBold: true,
			bodyFontFamily: '微软雅黑, Microsoft YaHei, SimHei, STHeiti',
			bodyFontSize: 14,
			bodyIndent: true,
			bodyLineHeight: 1.75,
			bodyLetterSpacing: 1.5,
			introFontFamily: '微软雅黑, Microsoft YaHei, SimHei, STHeiti',
			introFontSize: 14,
			...config.stylePreset
		}
	} catch {
		return null
	}
}

/**
 * 用组织字体样式包裹内容文本（内联 span，优先级最高）
 * @private
 */
function wrapContentWithOrgFont(content: string, blockType: string, preset: OrgStylePreset): string {
	let style = ''
	switch (blockType) {
		case 'title':
			style = `font-family:${preset.titleFontFamily};font-size:${preset.titleFontSize}px;`
			style += preset.titleBold ? 'font-weight:bold;' : 'font-weight:normal;'
			break
		case 'body':
			style = `font-family:${preset.bodyFontFamily};font-size:${preset.bodyFontSize}px;`
			break
		case 'intro':
		case 'outro':
			style = `font-family:${preset.introFontFamily};font-size:${preset.introFontSize}px;`
			break
	}
	if (!style) return content
	return `<span style="${style}">${content}</span>`
}

/**
 * 用组织块级样式包裹整个样式化块（text-indent / line-height / letter-spacing）
 * @private
 */
function wrapBlockWithOrgStyle(html: string, blockType: string, preset: OrgStylePreset): string {
	if (blockType !== 'body') return html
	const indent = preset.bodyIndent ? 'text-indent:2em;' : 'text-indent:0;'
	const style = `${indent}line-height:${preset.bodyLineHeight};letter-spacing:${preset.bodyLetterSpacing}px;`
	return `<section style="${style}">${html}</section>`
}

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

	// 读取组织级样式预设（仅在配置过时生效）
	const orgPreset = getOrgPresetIfConfigured()

	// 遍历内容块并应用装饰样式（只使用用户选择的装饰样式，不使用默认模板）
	let imageCounter = 0  // V2: 图片计数器，用于生成占位符ID

	contentBlocks.forEach((block: ContentBlock): void => {
		let blockHtml: string = ''

		// 只有有装饰样式配置时才生成内容
		if (styleConfig) {
			blockHtml = buildStyledBlock(block, styleConfig, addPlaceholderMarkers, imageCounter, orgPreset)
			htmlParts.push(blockHtml)

			// V2: 更新图片计数器
			if (block.type.startsWith('image_') || (block.meta && block.meta.aiImageUrl)) {
				imageCounter++
			}
		}
		// 如果没有样式配置，跳过该内容块
	})

	// 添加HTML尾部
	let footer = configStore.currentFooter
	const appStore = useAppStore()

	// 替换参与者占位符
	footer = footer
		.replace(/{{PLANNERS}}/g, appStore.plannerNames.join(' ') || ' ')
		.replace(/{{COPYWRITERS}}/g, appStore.copywriterNames.join(' ') || ' ')
		.replace(/{{EDITORS}}/g, appStore.editorNames.join(' ') || ' ')
		// V4: 替换尾部可变字段
		.replace(/{{TEAM_NAME}}/g, appStore.teamName || '"团队名称待填写"')
		.replace(/{{SOURCE_ACCOUNT}}/g, appStore.sourceAccount || '"来源公众号待填写"')
		.replace(/{{EDITOR_INPUT}}/g, appStore.editorInput || ' ')  // 编辑（用户填写，默认为空）

	// 🚀 将 footer 包裹在 contenteditable 容器中，允许用户直接在预览中编辑
	footer = `<div id="editable-footer" contenteditable="true" style="outline: none;">${footer}</div>`

	htmlParts.push(footer)

	return htmlParts.join('\n')
}

/**
 * 使用装饰样式构建内容块
 * @private
 * @param block - 内容块
 * @param styleConfig - 样式配置
 * @param addPlaceholderMarkers - V2: 是否添加占位符标记
 * @param imageIndex - V2: 图片索引
 * @param orgPreset - 组织级样式预设（可选，null 则不覆盖）
 * @returns 样式化后的HTML字符串
 */
function buildStyledBlock(
	block: ContentBlock,
	styleConfig: StyleConfig,
	addPlaceholderMarkers: boolean = false,
	imageIndex: number = 0,
	orgPreset: OrgStylePreset | null = null
): string {
	if (!block || typeof block !== 'object') {
		throw new Error('Invalid block: must be an object')
	}

	const content: string = block.text || ''
	// 如果有组织预设，用 span 包裹内容文本以覆盖模板字体
	const styledContent = orgPreset ? wrapContentWithOrgFont(content, block.type, orgPreset) : content

	// AI 生成图片优先渲染
	if (block.meta && block.meta.aiImageUrl) {
		let html = IMAGE_TEMPLATES.single
		// 替换默认图片 src
		html = html.replace(/src="[^"]*"/, `src="${block.meta.aiImageUrl}"`)
		// V2: 添加占位符标记
		if (addPlaceholderMarkers) {
			html = addImagePlaceholderMarker(html, `image_${imageIndex}`)
		}
		return html
	}

	let result: string
	switch (block.type) {
		case 'title':
			result = applyStyle(styledContent, styleConfig.title || null)
			break
		case 'body':
			result = applyStyle(styledContent, styleConfig.body || null)
			break
		case 'intro':
		case 'outro':
			result = applyStyle(styledContent, styleConfig.intro || null)
			break
		case 'image_single': {
			let html = IMAGE_TEMPLATES.single
			if (addPlaceholderMarkers) {
				html = addImagePlaceholderMarker(html, `image_${imageIndex}`)
			}
			return html
		}
		case 'image_single_caption': {
			let html = IMAGE_TEMPLATES.single_caption
			html = html.replace('{{caption}}', content)
			if (addPlaceholderMarkers) {
				html = addImagePlaceholderMarker(html, `image_${imageIndex}`)
			}
			return html
		}
		case 'image_double': {
			let html = IMAGE_TEMPLATES.double
			if (addPlaceholderMarkers) {
				html = addDoubleImagePlaceholderMarkers(html, `image_${imageIndex}`)
			}
			return html
		}
		case 'image_double_caption': {
			let html = IMAGE_TEMPLATES.double_caption
			let c1 = content;
			let c2 = content;
			if (content.includes('|') || content.includes('｜')) {
				const parts = content.split(/[|｜]/)
				c1 = parts[0] ? parts[0].trim() : ''
				c2 = parts[1] ? parts[1].trim() : ''
			} else if (content.trim().includes(' ')) {
				const parts = content.trim().split(/\s+/)
				if (parts.length >= 2) {
					c1 = parts[0]
					c2 = parts.slice(1).join(' ')
				}
			}
			html = html.replace('{{caption1}}', c1).replace('{{caption2}}', c2)
			if (addPlaceholderMarkers) {
				html = addDoubleImagePlaceholderMarkers(html, `image_${imageIndex}`)
			}
			return html
		}
		default:
			console.warn(`未知的内容块类型: ${block.type}，跳过该内容块`)
			result = ''
	}

	// 应用组织级块样式覆盖（text-indent / line-height / letter-spacing）
	if (orgPreset && result) {
		result = wrapBlockWithOrgStyle(result, block.type, orgPreset)
	}
	return result
}

/**
 * V2: 为双图模板添加占位符标记
 * @private
 * @param html - 原始HTML
 * @param placeholderIdBase - 占位符ID基准
 * @returns 添加标记后的HTML
 */
function addDoubleImagePlaceholderMarkers(html: string, placeholderIdBase: string): string {
	// 第一次替换
	let newHtml = html.replace(
		/<img([^>]*)>/,
		`<img$1 data-placeholder="${placeholderIdBase}_1">`
	)
	// 第二次替换（如果存在第二个img）
	newHtml = newHtml.replace(
		/<img([^>]*)>/,
		//这里必须小心，因为第一个已经替换过了，正则会再次匹配到第一个吗？
		//上面的正则 /<img([^>]*)>/ 匹配 <img 开头，直到 >。如果第一次替换后，img标签内多了 data-placeholder，但仍然符合 <img...> 格式。
		//所以必须使用 replace 的特性：它只替换第一个匹配项。
		//但是我们这里是第二次调用 replace，针对的是已经替换了一次的字符串。
		//如果不带 g 标志，replace 只替换第一个。
		//所以我们需要一种方法跳过第一个。

		//更好的方法可能是使用回调函数或者 split/join
		//或者，我们可以利用 data-placeholder 属性的存在来区分

		//简易方案：先替换第一个，产生的字符串中第一个img有了data-placeholder。
		//再次对新字符串replace，如果正则不匹配已经含有的，可以吗？
		//正则：/<img(?!.*data-placeholder)([^>]*)>/ 
		`<img$1 data-placeholder="${placeholderIdBase}_2">`
	)

	//修正逻辑：使用带回调的 replace 或者更精确的正则
	//为了稳健，我们重写逻辑：
	let counter = 1;
	return html.replace(/<img([^>]*)>/g, (match, p1) => {
		if (counter <= 2) {
			const replacement = `<img${p1} data-placeholder="${placeholderIdBase}_${counter}">`;
			counter++;
			return replacement;
		}
		return match;
	});
}

/**
 * V2: 为图片模板添加占位符标记
 * @private
 * @param html - 原始HTML
 * @param placeholderId - 占位符ID
 * @returns 添加标记后的HTML
 */
function addImagePlaceholderMarker(html: string, placeholderId: string): string {
	// 查找所有img标签并添加 data-placeholder 属性
	// 不添加默认边框，边框仅在悬停/选中时通过 JavaScript 添加
	return html.replace(
		/<img([^>]*)>/g,
		`<img$1 data-placeholder="${placeholderId}">`
	)
}

/**
 * 通用样式应用函数 - 使用占位符替换
 * 将 {{CONTENT}} 替换为用户内容
 * @private
 * @param content - 要插入的内容
 * @param styleObj - 样式对象（可选）
 * @returns 应用样式后的HTML字符串
 */
function applyStyle(content: string, styleObj: StyleTemplate | null | undefined): string {
	// 必须有有效的装饰样式才能应用
	if (!styleObj || typeof styleObj !== 'object' || !styleObj.fullExample) {
		console.warn('缺少有效的装饰样式，跳过该内容块')
		return ''
	}

	// 检查模板是否包含占位符
	if (!styleObj.fullExample.includes('{{CONTENT}}')) {
		console.warn('样式模板缺少 {{CONTENT}} 占位符，可能导致内容无法正确插入')
		// 降级处理：如果没有占位符，尝试直接返回模板（虽然这通常不是预期的行为）
		return styleObj.fullExample
	}

	// 直接替换占位符
	return styleObj.fullExample.replace('{{CONTENT}}', content)
}

/**
 * 获取块类型的中文显示名称
 * @param type - 块类型
 * @returns 中文名称
 */
export function getBlockTypeDisplayName(type: BlockType): string {
	if (typeof type !== 'string') {
		throw new Error('Invalid type: must be a string')
	}

	const typeNames: Record<BlockType, string> = {
		'intro': '引言',
		'title': '小标题',
		'body': '正文',
		'outro': '结尾',
		'image_single': '单图',
		'image_single_caption': '单图+注',
		'image_double': '双图',
		'image_double_caption': '双图+注'
	}

	return typeNames[type] || '正文'
}

/**
 * 获取所有可用的块类型选项
 * @returns 块类型选项数组
 */
export function getBlockTypeOptions(): Array<{ value: BlockType; label: string }> {
	return [
		{ value: 'intro', label: '引言' },
		{ value: 'title', label: '小标题' },
		{ value: 'body', label: '正文' },
		{ value: 'outro', label: '结尾' }
	]
}
