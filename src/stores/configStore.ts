import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tenantApi } from '../utils/api'
import { tokenStorage } from '../utils/tokenStorage'

export type WorkMode = 'daily' | 'three_rural' | 'reprint'

export interface WechatConfig {
	id: string
	name: string
	appId: string
	appSecretMasked?: string
	hasSecret?: boolean
}

// 默认配置
const DEFAULT_WECHAT_CONFIG: WechatConfig = {
	id: 'default',
	name: '未配置',
	appId: '',
	appSecretMasked: '',
	hasSecret: false
}

// HTML 头部常量 - 日常模式
const DAILY_HEADER = `
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

// HTML 尾部常量 - 日常模式
const DAILY_FOOTER = `
      <section data-tplid="333569" data-tools="135编辑器">
	<section class="article135" style="line-height:0.75;font-size:14px;background:none 50% 50% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0);padding:0px;box-sizing:border-box;letter-spacing:1.75px;font-family:微软雅黑,MicrosoftYaHe;" data-role="outer" data-doubao-translate-traverse-mark="1">
		<section style="margin-bottom: 0px;text-indent: 0em;white-space: normal;outline: 0px;text-align: center;color: #ffffff;line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;min-height: 14px;font-stretch: normal;background-color: #d32a63;font-family:微软雅黑;" class="" data-doubao-translate-traverse-mark="1">
			<p style="outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;" draggable="true" data-doubao-translate-traverse-mark="1">
				<br/>
			</p>
			<p style="outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;" data-doubao-translate-traverse-mark="1">
				<span style="outline: 0px;letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;"><strong style="outline: 0px;"><span style="padding: 10px 15px;outline: 0px;border-color: #fbfbfb;border-style: solid;border-width: 1px;line-height: 42px;">{{ORG_NAME}}</span></strong></span>
			</p>
		</section>
		<p style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;outline: 0px;color: rgb(255, 255, 255);line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: rgb(211, 42, 99);text-align:center;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1" align="center">
			<br/>
		</p>
		<section style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;text-align: center;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1">
			<span style="letter-spacing: 0.54px;text-indent: 0em;">文案：{{COPYWRITERS}}</span>
		</section>
		<section style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;text-align: center;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;font-family:微软雅黑;" class="" data-doubao-translate-traverse-mark="1">
			<span style="letter-spacing: 0.54px;text-indent: 0em;">图片：{{COPYWRITERS}}</span>
		</section>
		<section style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;text-align: center;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;font-family:微软雅黑;" class="" data-doubao-translate-traverse-mark="1">
			<span style="letter-spacing: 0px;text-indent: 0em;">编辑：{{EDITOR_INPUT}}</span>
		</section>
		<section style="margin-bottom: 0px;text-indent: 0em;white-space: normal;outline: 0px;text-align: center;color: #ffffff;line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;min-height: 14px;font-stretch: normal;background-color: #d32a63;" class="" data-doubao-translate-traverse-mark="1">
			<section style="outline: 0px;letter-spacing: 0.54px;text-indent: 0em;line-height: 1.75em;min-height: 14px;font-stretch: normal;" class="" data-doubao-translate-traverse-mark="1">
				<section style="line-height: 1.75em;" class="" data-doubao-translate-traverse-mark="1">
					<span style="letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">校对：{{PLANNERS}}</span>
				</section>
				<section style="line-height: 1.75em;" class="" data-doubao-translate-traverse-mark="1">
					<span style="letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">责编：{{EDITORS}}</span>
				</section>
				<p style="line-height: 1.75em;" data-doubao-translate-traverse-mark="1">
					<br/>
				</p>
			</section>
			<p style="margin-top: 5px;margin-bottom: 5px;outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1">
				<span style="outline: 0px;letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;"><img src="https://mmbiz.qlogo.cn/sz_mmbiz_jpg/viactygias9W2lZ8qnEWJGO01fwFZAFuWXX03KIb26nbcLQrusdXrQKFhicdekeus1sb4RRQKUe0hBL9vobdr6QJQ/640" class="rich_pages wxw-img" style="outline: 0px; background-color: rgb(197, 64, 114); line-height: 25.6px; width: 233px; vertical-align: baseline; visibility: visible !important; height: auto !important;box-sizing:border-box;" data-cropselx1="0" data-cropselx2="233" data-cropsely1="0" data-cropsely2="233" data-imgfileid="503969660" data-ratio="1" data-w="430"/></span>
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

// HTML 头部常量 - 三下乡模式
const THREE_RURAL_HEADER = `
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

// HTML 尾部常量 - 三下乡模式
const THREE_RURAL_FOOTER = `
<!-- 三下乡模式尾部 -->
<section data-role="outer" label="edit by 135editor" data-pm-slice="0 0 []" class="">
	<section data-id="undefined" class="_135editor" data-tplid="340986">
		<p style="text-align:center;" align="center">
			<br/>
		</p>
	</section>
</section>
<p style="display: none;">
	<br/>
</p>
<section class="_135editor">
	<mp-style-type data-value="3"></mp-style-type>
</section>
<section class="article135" style="line-height:0.75;font-size:14px;background:none 50% 50% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0);padding:0px;box-sizing:border-box;letter-spacing:1.75px;font-family:微软雅黑,MicrosoftYaHe;" data-role="outer" data-doubao-translate-traverse-mark="1" data-tplid="338514">
	<section style="margin-bottom: 0px;text-indent: 0em;white-space: normal;outline: 0px;text-align: center;color: #ffffff;line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;min-height: 14px;font-stretch: normal;background-color: #d32a63;font-family:微软雅黑;" class="" data-doubao-translate-traverse-mark="1">
		<p style="outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;" draggable="true" data-doubao-translate-traverse-mark="1">
			<br/>
		</p>
		<p style="outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;" data-doubao-translate-traverse-mark="1">
			<span style="outline: 0px;letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;"><strong style="outline: 0px;"><span style="padding: 10px 15px;outline: 0px;border-color: #fbfbfb;border-style: solid;border-width: 1px;line-height: 42px;">{{ORG_NAME}}</span></strong></span>
		</p>
	</section>
	<p style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;outline: 0px;color: rgb(255, 255, 255);line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: rgb(211, 42, 99);text-align:center;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1" align="center">
		<br/>
	</p>
	<p style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;text-align:center;font-family:微软雅黑;" align="center">
		图文来源：{{TEAM_NAME}}
	</p>
	<p style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;text-align:center;font-family:微软雅黑;" align="center">
		<span style="letter-spacing: 1.5px; text-indent: 0em; caret-color: red;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">编辑：</span><span style="letter-spacing: 1.5px; text-indent: 0em; caret-color: red;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">{{EDITOR_INPUT}}</span>
	</p>
	<p style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;text-align:center;font-family:微软雅黑;" align="center">
		<span style="letter-spacing: 1.5px; text-indent: 0em; caret-color: red;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">审核：{{PLANNERS}}&nbsp;</span>
	</p>
	<section style="margin-bottom: 0px;text-indent: 0em;white-space: normal;outline: 0px;text-align: center;color: #ffffff;line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;min-height: 14px;font-stretch: normal;background-color: #d32a63;" class="" data-doubao-translate-traverse-mark="1">
		<section style="outline: 0px;letter-spacing: 0.54px;text-indent: 0em;line-height: 1.75em;min-height: 14px;font-stretch: normal;" class="" data-doubao-translate-traverse-mark="1">
			<p style="line-height: 1.75em;">
				<span style="letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">责编：{{EDITORS}}</span>
			</p>
			<p style="line-height: 1.75em;">
				<span style="letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;"><br/></span>
			</p>
		</section>
		<p style="margin-top: 5px;margin-bottom: 5px;outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1">
			<span style="outline: 0px;letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;"><img src="https://image2.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9zel9tbWJpel9qcGcvdmlhY3R5Z2lhczlXMmxaOHFuRVdKR08wMWZ3RlpBRnVXWFgwM0tJYjI2bmJjTFFydXNkWHJRS0ZoaWNkZWtldXMxc2I0UlJRS1VlMGhCTDl2b2JkcjZRSlEvNjQw" class="rich_pages wxw-img" style="outline: 0px; background-color: #c54072; line-height: 25.6px; width: 233px; vertical-align: baseline; visibility: visible !important; height: auto !important;box-sizing:border-box;" data-cropselx1="0" data-cropselx2="233" data-cropsely1="0" data-cropsely2="233" data-imgfileid="503969660"/></span>
		</p>
		<p style="margin-top: 5px;margin-bottom: 5px;outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1">
			<br/>
		</p>
	</section>
	<section data-doubao-translate-traverse-mark="1" class="">
		<p>
			<br/>
		</p>
	</section>
	<p style="display: none;" data-doubao-translate-traverse-mark="1">
		<br/>
	</p>
	<section class="_135editor" data-doubao-translate-traverse-mark="1">
		<mp-style-type data-value="10000"></mp-style-type>
		<p>
			<br/>
		</p>
	</section>
</section>
<blockquote>
	<section class="article135" style="line-height:0.75;font-size:14px;background:none 50% 50% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0);padding:0px;box-sizing:border-box;letter-spacing:1.75px;font-family:微软雅黑,MicrosoftYaHe;" data-role="outer" data-doubao-translate-traverse-mark="1" data-tplid="338514">
		<section class="_135editor" data-role="paragraph"></section>
	</section>
</blockquote>
<section class="_135editor" data-role="paragraph">
	<p >
		<br/>
	</p>
</section>
`

// HTML 头部常量 - 转载模式
const REPRINT_HEADER = `
<!-- 转载模式头部 -->
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

// HTML 尾部常量 - 转载模式
const REPRINT_FOOTER = `
<!-- 转载模式尾部 -->
<section data-role="outer" label="edit by 135editor" data-pm-slice="0 0 []" class="">
	<section data-id="undefined" class="_135editor" data-tplid="340986">
		<p style="text-align:center;" align="center">
			<br/>
		</p>
	</section>
</section>
<p style="display: none;">
	<br/>
</p>
<section class="_135editor">
	<mp-style-type data-value="3"></mp-style-type>
</section>
<section class="article135" style="line-height:0.75;font-size:14px;background:none 50% 50% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0);padding:0px;box-sizing:border-box;letter-spacing:1.75px;font-family:微软雅黑,MicrosoftYaHe;" data-role="outer" data-doubao-translate-traverse-mark="1" data-tplid="338514">
	<section style="margin-bottom: 0px;text-indent: 0em;white-space: normal;outline: 0px;text-align: center;color: #ffffff;line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;min-height: 14px;font-stretch: normal;background-color: #d32a63;font-family:微软雅黑;" class="" data-doubao-translate-traverse-mark="1">
		<p style="outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;" draggable="true" data-doubao-translate-traverse-mark="1">
			<br/>
		</p>
		<p style="outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;" data-doubao-translate-traverse-mark="1">
			<span style="outline: 0px;letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;"><strong style="outline: 0px;"><span style="padding: 10px 15px;outline: 0px;border-color: #fbfbfb;border-style: solid;border-width: 1px;line-height: 42px;">{{ORG_NAME}}</span></strong></span>
		</p>
	</section>
	<p style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;outline: 0px;color: rgb(255, 255, 255);line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: rgb(211, 42, 99);text-align:center;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1" align="center">
		<br/>
	</p>
	<p style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;text-align:center;font-family:微软雅黑;"  align="center">
		来源：{{SOURCE_ACCOUNT}}
	</p>
	<p style="margin-bottom: 0px;min-height: 14px;text-indent: 0em;white-space: normal;outline: 0px;color: #ffffff;letter-spacing: 0.54px;font-size: 14px;font-stretch: normal;background-color: #d32a63;line-height: 1.75em;text-align:center;font-family:微软雅黑;"  align="center">
		编辑：{{EDITOR_INPUT}}
	</p>
	<section style="margin-bottom: 0px;text-indent: 0em;white-space: normal;outline: 0px;text-align: center;color: #ffffff;line-height: 1.5em;letter-spacing: 0.54px;font-size: 14px;min-height: 14px;font-stretch: normal;background-color: #d32a63;" class="" data-doubao-translate-traverse-mark="1">
		<section style="outline: 0px;letter-spacing: 0.54px;text-indent: 0em;line-height: 1.75em;min-height: 14px;font-stretch: normal;" class="" data-doubao-translate-traverse-mark="1">
			<section style="line-height: 1.75em;" class="" data-doubao-translate-traverse-mark="1">
				<span style="letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">校对：{{PLANNERS}}&nbsp;</span>
			</section>
			<p style="line-height: 1.75em;">
				<span style="letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;">责编：{{EDITORS}}</span>
			</p>
			<p style="line-height: 1.75em;">
				<span style="letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;" ><br/></span>
			</p>
		</section>
		<p style="margin-top: 5px;margin-bottom: 5px;outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1">
			<span style="outline: 0px;letter-spacing: 1.5px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;;"><img src="https://image2.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9zel9tbWJpel9qcGcvdmlhY3R5Z2lhczlXMmxaOHFuRVdKR08wMWZ3RlpBRnVXWFgwM0tJYjI2bmJjTFFydXNkWHJRS0ZoaWNkZWtldXMxc2I0UlJRS1VlMGhCTDl2b2JkcjZRSlEvNjQw" class="rich_pages wxw-img" style="outline: 0px; background-color: #c54072; line-height: 25.6px; width: 233px; vertical-align: baseline; visibility: visible !important; height: auto !important;box-sizing:border-box;" data-cropselx1="0" data-cropselx2="233" data-cropsely1="0" data-cropsely2="233" data-imgfileid="503969660" data-ratio="1" data-w="430"/></span>
		</p>
		<p style="margin-top: 5px;margin-bottom: 5px;outline: 0px;vertical-align: initial;letter-spacing: 1px;line-height: 1.75em;font-family:微软雅黑;" data-doubao-translate-traverse-mark="1">
			<br/>
		</p>
	</section>
	<section data-doubao-translate-traverse-mark="1" class="">
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
<blockquote>
	<section class="article135" style="line-height:0.75;font-size:14px;background:none 50% 50% / auto repeat scroll padding-box border-box rgba(0, 0, 0, 0);padding:0px;box-sizing:border-box;letter-spacing:1.75px;font-family:微软雅黑,MicrosoftYaHe;" data-role="outer" data-doubao-translate-traverse-mark="1" data-tplid="338514">
		<section class="_135editor" data-role="paragraph"></section>
	</section>
</blockquote>
`

// 默认占位符 - 可以根据需要为其他模式设置不同的默认值
export const DEFAULT_HEADERS: Record<WorkMode, string> = {
	daily: DAILY_HEADER,
	three_rural: THREE_RURAL_HEADER,
	reprint: REPRINT_HEADER
}

export const DEFAULT_FOOTERS: Record<WorkMode, string> = {
	daily: DAILY_FOOTER,
	three_rural: THREE_RURAL_FOOTER,
	reprint: REPRINT_FOOTER
}

export const useConfigStore = defineStore('config', () => {
	// 状态
	const wechatConfig = ref<WechatConfig>(DEFAULT_WECHAT_CONFIG)
	const mode = ref<WorkMode>('daily')
	const savedAccounts = ref<WechatConfig[]>([])
	const currentHeader = ref<string>(DAILY_HEADER)
	const currentFooter = ref<string>(DAILY_FOOTER)

	// 初始化（从 localStorage 读取）
	const init = () => {
		// 恢复保存的账号
		const storedAccounts = localStorage.getItem('wechat_accounts')
		if (storedAccounts) {
			try {
				const parsedAccounts = JSON.parse(storedAccounts)
				savedAccounts.value = parsedAccounts.map((account: WechatConfig) => ({
					...account,
					appSecretMasked: account.appSecretMasked || '',
					hasSecret: account.hasSecret ?? false
				}))
				localStorage.setItem('wechat_accounts', JSON.stringify(savedAccounts.value))

				// 确保默认账号名称是最新的
				const defaultAcc = savedAccounts.value.find(a => a.id === 'default')
				if (defaultAcc) {
					defaultAcc.name = DEFAULT_WECHAT_CONFIG.name
				}
			} catch (e) {
				console.error('Failed to parse saved accounts', e)
				savedAccounts.value = []
			}
		}

		// 如果没有账号，添加默认账号
		if (savedAccounts.value.length === 0) {
			savedAccounts.value.push(DEFAULT_WECHAT_CONFIG)
		}

		// 默认选中第一个
		wechatConfig.value = savedAccounts.value[0]

		// 恢复保存的模式
		const storedMode = localStorage.getItem('config_mode') as WorkMode
		if (storedMode && DEFAULT_HEADERS[storedMode]) {
			setMode(storedMode)
		}

		// 登录状态下同步一次后端微信配置，修正本地缓存
		const storedTenant = localStorage.getItem('currentTenant')
		const storedUserInfo = localStorage.getItem('userInfo')
		const hasAuth = !!tokenStorage.getToken() || !!storedUserInfo
		if (hasAuth) {
			let tenantId: string | undefined
			if (storedTenant) {
				try {
					const tenant = JSON.parse(storedTenant)
					tenantId = tenant?.id
				} catch (e) {
					console.error('Failed to parse stored tenant', e)
				}
			}
			if (!tenantId && storedUserInfo) {
				try {
					const userInfo = JSON.parse(storedUserInfo)
					tenantId = userInfo?.tenantId
				} catch (e) {
					console.error('Failed to parse stored user info', e)
				}
			}
			if (tenantId) {
				fetchBackendConfig(tenantId)
			}
		}
	}

	// Actions
	const setMode = (newMode: WorkMode) => {
		mode.value = newMode

		// 优先使用空间级自定义模板，无则回退到默认值
		let orgHeader: string | null = null
		let orgFooter: string | null = null
		try {
			const stored = localStorage.getItem('org_template_config')
			if (stored) {
				const orgConfig = JSON.parse(stored)
				orgHeader = orgConfig.headers?.[newMode] || null
				orgFooter = orgConfig.footers?.[newMode] || null
			}
		} catch (e) {
			// ignore parse errors
		}

		currentHeader.value = orgHeader || DEFAULT_HEADERS[newMode]
		currentFooter.value = orgFooter || DEFAULT_FOOTERS[newMode]

		// 持久化模式
		localStorage.setItem('config_mode', newMode)
	}

	const setFooter = (html: string) => {
		currentFooter.value = html
	}

	const saveAccount = (account: WechatConfig) => {
		const index = savedAccounts.value.findIndex(a => a.id === account.id)
		if (index >= 0) {
			savedAccounts.value[index] = account
		} else {
			savedAccounts.value.push(account)
		}
		// 持久化
		localStorage.setItem('wechat_accounts', JSON.stringify(savedAccounts.value))

		// 如果当前正在使用该账号，也更新之
		if (wechatConfig.value.id === account.id) {
			wechatConfig.value = account
		}
	}

	const removeAccount = (id: string) => {
		savedAccounts.value = savedAccounts.value.filter(a => a.id !== id)
		localStorage.setItem('wechat_accounts', JSON.stringify(savedAccounts.value))

		// 如果删除了当前账号，回退到第一个
		if (wechatConfig.value.id === id && savedAccounts.value.length > 0) {
			wechatConfig.value = savedAccounts.value[0]
		}
	}

	const selectAccount = (id: string) => {
		const account = savedAccounts.value.find(a => a.id === id)
		if (account) {
			wechatConfig.value = account
		}
	}

	const fetchBackendConfig = async (tenantId: string) => {
		try {
			const res = await tenantApi.getWechatConfig(tenantId)
			if (res.data && res.data.appId) {
				const nextConfig = {
					...wechatConfig.value,
					appId: res.data.appId,
					appSecretMasked: res.data.appSecretMasked || '',
					hasSecret: !!res.data.hasSecret
				}
				wechatConfig.value = nextConfig

				const accountIndex = savedAccounts.value.findIndex(
					account => account.id === nextConfig.id
				)
				if (accountIndex >= 0) {
					savedAccounts.value[accountIndex] = {
						...savedAccounts.value[accountIndex],
						appId: nextConfig.appId,
						appSecretMasked: nextConfig.appSecretMasked,
						hasSecret: nextConfig.hasSecret
					}
				} else {
					savedAccounts.value.push(nextConfig)
				}
				localStorage.setItem('wechat_accounts', JSON.stringify(savedAccounts.value))
				console.log('WeChat config updated from backend')
			}
		} catch (e) {
			console.error('Failed to fetch WeChat config', e)
		}
	}


	// 初始化调用
	init()

	return {
		wechatConfig,
		mode,
		savedAccounts,
		currentHeader,
		currentFooter,
		setMode,
		setFooter,
		saveAccount,
		removeAccount,
		selectAccount,
		fetchBackendConfig
	}
})
