// @ts-expect-error - templates.js 尚未迁移到 TypeScript，遵循最简原则忽略类型
import { IMAGE_TEMPLATES } from '../styles/templates'
import type { ContentBlock, StyleConfig, BlockType, StyleTemplate } from '@/types'
import { useConfigStore } from '../stores/configStore'



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

	// 遍历内容块并应用装饰样式（只使用用户选择的装饰样式，不使用默认模板）
	let imageCounter = 0  // V2: 图片计数器，用于生成占位符ID

	contentBlocks.forEach((block: ContentBlock): void => {
		let blockHtml: string = ''

		// 只有有装饰样式配置时才生成内容
		if (styleConfig) {
			blockHtml = buildStyledBlock(block, styleConfig, addPlaceholderMarkers, imageCounter)
			htmlParts.push(blockHtml)

			// V2: 更新图片计数器
			if (block.type.startsWith('image_')) {
				imageCounter++
			}
		}
		// 如果没有样式配置，跳过该内容块
	})

	// 添加HTML尾部
	htmlParts.push(configStore.currentFooter)

	return htmlParts.join('\n')
}

/**
 * 使用装饰样式构建内容块
 * @private
 * @param block - 内容块
 * @param styleConfig - 样式配置
 * @param addPlaceholderMarkers - V2: 是否添加占位符标记
 * @param imageIndex - V2: 图片索引
 * @returns 样式化后的HTML字符串
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
			// V2: 添加占位符标记
			if (addPlaceholderMarkers) {
				html = addImagePlaceholderMarker(html, `image_${imageIndex}`)
			}
			return html
		}
		case 'image_single_caption': {
			let html = IMAGE_TEMPLATES.single_caption
			// 替换图注
			html = html.replace('{{caption}}', content)

			// V2: 添加占位符标记
			if (addPlaceholderMarkers) {
				html = addImagePlaceholderMarker(html, `image_${imageIndex}`)
			}
			return html
		}
		case 'image_double': {
			let html = IMAGE_TEMPLATES.double
			// V2: 添加占位符标记 - 双图分别标记为 _1 和 _2
			if (addPlaceholderMarkers) {
				html = addDoubleImagePlaceholderMarkers(html, `image_${imageIndex}`)
			}
			return html
		}
		case 'image_double_caption': {
			let html = IMAGE_TEMPLATES.double_caption

			// 替换图注 (简单的分割逻辑，或者直接把内容给两个)
			// 支持使用 | 或 ｜ 分隔左右图片的说明
			// V3: 支持使用空格分隔
			let c1 = content;
			let c2 = content;

			if (content.includes('|') || content.includes('｜')) {
				const parts = content.split(/[|｜]/)
				c1 = parts[0] ? parts[0].trim() : ''
				c2 = parts[1] ? parts[1].trim() : ''
			} else if (content.trim().includes(' ')) {
				// 找到第一个空格的位置
				const parts = content.trim().split(/\s+/)
				if (parts.length >= 2) {
					c1 = parts[0]
					// 将剩余部分作为第二部分的说明
					c2 = parts.slice(1).join(' ')
				}
			}

			html = html.replace('{{caption1}}', c1).replace('{{caption2}}', c2)

			// V2: 添加占位符标记 - 双图分别标记为 _1 和 _2
			if (addPlaceholderMarkers) {
				html = addDoubleImagePlaceholderMarkers(html, `image_${imageIndex}`)
			}
			return html
		}
		default:
			console.warn(`未知的内容块类型: ${block.type}，跳过该内容块`)
			return ''
	}
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
