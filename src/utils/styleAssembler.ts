import type { ContentBlock, StyleConfig, BlockType } from '@/types'
import type { ImageTemplates } from '@/types/templates'
// @ts-expect-error - JS 模块需要完整的重构，暂时使用 any
declare module '../styles/templates.js' {
  export const IMAGE_TEMPLATES: ImageTemplates
}
import { IMAGE_TEMPLATES } from '../styles/templates.js'

// HTML 头部常量
const HTML_HEADER = `
   <section data-role="outer" class="article135" label="edit by 135editor" style="font-size:14px;letter-spacing:1.75px;line-height:0.75;font-family:微软雅黑, Microsoft YaHe;" >
	<section data-tplid="340986" data-tools="135编辑器">
		<section data-id="undefined" class="_135editor">
			<p style="text-align:center;" align="center">
				<img src="https://mmbiz.qpic.cn/sz_mmbiz_gif/viactygias9W3ibK2JncMo0Bd5MgbKt7Wzg05h7zjF4IVGQzFJfZSxiaErzeGUgQxgV7iaD4p9OQ8icuiaTmvVgjgABaA/0?wx_fmt=gif&from=appmsg" class="rich_pages wxw-img js_insertlocalimg" data-s="300,640" data-type="gif" type="block" data-imgfileid="504015157" data-imgqrcoded="1" data-upload="1" style="vertical-align: baseline; width: 100%;box-sizing:border-box;max-width:100% !important;" draggable="false" data-ratio="0.3531047265987025" data-w="1079"/>
			</p>
		</section>
	</section>
	<section class="_135editor" data-tools="135编辑器" data-id="165701">
		<section style="margin: 10px auto;"></section>
	</section>
	<section data-tplid="340988" data-tools="135编辑器">
		<section data-tplid="333569" data-tools="135编辑器">
			<section class="article135" style="line-height:0.75;font-size:14px;background:none 50% 50% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0);padding:0px;box-sizing:border-box;letter-spacing:1.75px;font-family:微软雅黑,MicrosoftYaHe;" data-role="outer" data-doubao-translate-traverse-mark="1">
				<p style="display: none;" data-doubao-translate-traverse-mark="1">
					<br/>
				</p>
				<section class="_135editor" data-doubao-translate-traverse-mark="1">
					<mp-style-type data-value="10000"></mp-style-type>
				</section>
			</section>
		</section>
	</section>
</section>
`

// HTML 尾部常量
const HTML_FOOTER = `
      <section data-tplid="333569" data-tools="135编辑器">
	<section class="article135" style="line-height:0.75;font-size:14px;background:none 50% 50% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0);padding:0px;box-sizing:border-box;letter-spacing:1.75px;font-family:微软雅黑,MicrosoftYaHe;" data-role="outer" data-doubao-translate-traverse-mark="1">
		<section style="margin-bottom: 0px;text-indent: 0em;white-space: normal;outline: 0px;text-align: center;color: #ffffff;line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;min-height: 14px;font-stretch: normal;background-color: #d32a63;font-family:微软雅黑;" class="" data-doubao-translate-traverse-mark="1">
			<p style="outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;" draggable="true" data-doubao-translate-traverse-mark="1">
				<br/>
			</p>
			<p style="outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;" data-doubao-translate-traverse-mark="1">
				<span style="outline: 0px;letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;"><strong style="outline: 0px;"><span style="padding: 10px 15px;outline: 0px;border-color: #fbfbfb;border-style: solid;border-width: 1px;line-height: 42px;">校团委青年媒体中心</span></strong></span>
			</p>
		</section>
		<p style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;outline: 0px;color: rgb(255, 255, 255);line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: rgb(211, 42, 99);text-align:center;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1" align="center">
			<br/>
		</p>
		<section style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;text-align: center;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1">
			<span style="letter-spacing: 0.54px;text-indent: 0em;">文案：</span>
		</section>
		<section style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;text-align: center;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;font-family:微软雅黑;" class="" data-doubao-translate-traverse-mark="1">
			<span style="letter-spacing: 0.54px;text-indent: 0em;">图片：</span>
		</section>
		<section style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;text-align: center;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;font-family:微软雅黑;" class="" data-doubao-translate-traverse-mark="1">
			<span style="letter-spacing: 0px;text-indent: 0em;">编辑：</span>
		</section>
		<section style="margin-bottom: 0px;text-indent: 0em;white-space: normal;outline: 0px;text-align: center;color: #ffffff;line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;min-height: 14px;font-stretch: normal;background-color: #d32a63;" class="" data-doubao-translate-traverse-mark="1">
			<section style="outline: 0px;letter-spacing: 0.54px;text-indent: 0em;line-height: 1.75em;min-height: 14px;font-stretch: normal;" class="" data-doubao-translate-traverse-mark="1">
				<section style="line-height: 1.75em;" class="" data-doubao-translate-traverse-mark="1">
					<span style="letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">校对：王雪 宋欣翼</span>
				</section>
				<section style="line-height: 1.75em;" class="" data-doubao-translate-traverse-mark="1">
					<span style="letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">责编：朱梦鹤</span>
				</section>
				<p style="line-height: 1.75em;" data-doubao-translate-traverse-mark="1">
					<br/>
				</p>
			</section>
			<p style="margin-top: 5px;margin-bottom: 5px;outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1">
				<span style="outline: 0px;letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;"><img src="https://image2.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9zel9tbWJpel9qcGcvdmlhY3R5Z2lhczlXMmxaOHFuRVdKR08wMWZ3RlpBRnVXWFgwM0tJYjI2bmJjTFFydXNkWHJRS0ZoaWNkZWtldXMxc2I0UlJRS1VlMGhCTDl2b2JkcjZRSlEvNjQw" class="rich_pages wxw-img" style="outline: 0px; background-color: rgb(197, 64, 114); line-height: 25.6px; width: 233px; vertical-align: baseline; visibility: visible !important; height: auto !important;box-sizing:border-box;" data-cropselx1="0" data-cropselx2="233" data-cropsely1="0" data-cropsely2="233" data-imgfileid="503969660" data-ratio="1" data-w="430"/></span>
			</p>
			<p style="margin-top: 5px;margin-bottom: 5px;outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1">
				<br/>
			</p>
		</section>
		<section data-doubao-translate-traverse-mark="1">
			<p>
				<br/>
			</p>
		</section>
		<p style="display: none;" data-doubao-translate-traverse-mark="1">
			<br/>
		</p>
		<section class="_135editor" data-doubao-translate-traverse-mark="1">
			<mp-style-type data-value="10000"></mp-style-type>
		</section>
	</section>
</section>
`

/**
 * 样式组装引擎
 * 根据内容块类型和装饰样式配置生成最终的HTML
 * @param contentBlocks - 内容块数组
 * @param styleConfig - 装饰样式配置（可选）
 * @returns 完整的HTML字符串
 */
export function buildHtml(contentBlocks: ContentBlock[], styleConfig: StyleConfig | null = null): string {
  if (!Array.isArray(contentBlocks)) {
    throw new Error('Invalid contentBlocks: must be an array')
  }

  const htmlParts: string[] = []

  // 添加HTML头部
  htmlParts.push(HTML_HEADER)

  // 遍历内容块并应用装饰样式（只使用用户选择的装饰样式，不使用默认模板）
  contentBlocks.forEach((block: ContentBlock): void => {
    let blockHtml: string = ''

    // 只有有装饰样式配置时才生成内容
    if (styleConfig) {
      blockHtml = buildStyledBlock(block, styleConfig)
      htmlParts.push(blockHtml)
    }
    // 如果没有样式配置，跳过该内容块
  })

  // 添加HTML尾部
  htmlParts.push(HTML_FOOTER)

  return htmlParts.join('\n')
}

/**
 * 使用装饰样式构建内容块
 * @private
 * @param block - 内容块
 * @param styleConfig - 样式配置
 * @returns 样式化后的HTML字符串
 */
function buildStyledBlock(block: ContentBlock, styleConfig: StyleConfig): string {
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
    case 'image_single':
      return IMAGE_TEMPLATES.single as unknown as string
    case 'image_double':
      return IMAGE_TEMPLATES.double as unknown as string
    default:
      console.warn(`未知的内容块类型: ${block.type}，跳过该内容块`)
      return ''
  }
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
    'image_double': '双图'
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
