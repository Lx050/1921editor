/**
 * 样式模板库
 * 由产品负责人提供的HTML样式代码片段
 */

// 文本样式模板 - 直接在源头设置好字体格式
export const STYLE_TEMPLATES = {
  // 引言/结尾样式模板 - 微软雅黑 14px
  intro_outro: `
    <section class="_135editor" data-role="paragraph">
      <p style="margin: 1.5em 0; font-size: 14px; line-height: 1.75em; text-indent: 2.21428em; text-align: justify;" align="justify">
        <span style="font-weight: 400; color: #333333; text-shadow: none; font-size: 14px; letter-spacing: 1.5px; font-family: 微软雅黑, MicrosoftYaHei;">{{content}}</span>
      </p>
    </section>
  `,

  // 小标题样式模板 - 微软雅黑 16px 居中
  title: `
    <section class="_135editor" data-role="paragraph">
      <p style="margin: 0; font-size: 16px; line-height: 1.75em; text-indent: 0em; text-align: center;" align="center">
        <span style="font-weight: 400; color: rgb(51, 51, 51); text-shadow: none; letter-spacing: 1.5px; font-size: 16px; font-family: 微软雅黑, MicrosoftYaHei;">{{content}}</span>
      </p>
    </section>
  `,

  // 正文样式模板 - 微软雅黑 14px 两端对齐
  body: `
    <section class="_135editor" data-role="paragraph">
      <p style="margin: 0; font-size: 14px; line-height: 1.75em; text-indent: 2.21428em; text-align: justify;" align="justify">
        <span style="font-weight: 400; color: #333333; text-shadow: none; font-size: 14px; letter-spacing: 1.5px; font-family: 微软雅黑, MicrosoftYaHei;">{{content}}</span>
      </p>
    </section>
  `
}

// 图片模板
export const IMAGE_TEMPLATES = {
  // 单图模板 (横屏)
  single: `
    <section class="_135editor" data-tools="135编辑器" data-id="149958">
	<section style="margin: 10px auto;">
		<section style="background: linear-gradient(to bottom,#ffefcd,#ffffff);/* padding: 12px; */box-sizing:border-box;">
			<section style="/* background-color: #ffffff; */padding: 3px;box-sizing:border-box;">
				<section style="width: 100%;max-width:100% !important;box-sizing:border-box;" data-width="100%" class="">
					<img style="width: 100%; display: block;vertical-align:baseline;box-sizing:border-box;max-width:100% !important;" src="https://bcn.135editor.com/files/images/editor_styles/194203ed1fb963628dbf9a93e2430b30.png" data-width="100%" draggable="false" data-ratio="0.6487603305785123" data-w="484"/>
				</section>
			</section>
		</section>
	</section>
</section>
  `,

  // 带图注单图模板
  single_caption: `
    <section class="_135editor" data-tools="135编辑器" data-id="149958">
	<section style="margin: 10px auto;">
		<section style="background: linear-gradient(to bottom,#ffefcd,#ffffff);/* padding: 12px; */box-sizing:border-box;">
			<section style="/* background-color: #ffffff; */padding: 3px;box-sizing:border-box;">
				<section style="width: 100%;max-width:100% !important;box-sizing:border-box;" data-width="100%" class="">
					<img style="width: 100%; display: block;vertical-align:baseline;box-sizing:border-box;max-width:100% !important;" src="https://bcn.135editor.com/files/images/editor_styles/194203ed1fb963628dbf9a93e2430b30.png" data-width="100%" draggable="false" data-ratio="0.6487603305785123" data-w="484"/>
				</section>
                <section class="135brush">
                    <p style="vertical-align: inherit; color: #666666; font-size: 12px; text-decoration: inherit; line-height: 1.75em;text-align:center;" align="center">
                        <span style="color: #757576;"><span style="font-weight: 400; text-shadow: none; letter-spacing: 1.75px; font-size: 12px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{caption}}</span>&nbsp;</span>
                    </p>
                </section>
			</section>
		</section>
	</section>
</section>
  `,

  // 双图模板 (135编辑器标准)
  double: `
    <section class="_135editor" data-tools="135编辑器" data-id="94401">
        <section style="width: 100%; margin: 10px auto; max-width:100% !important; box-sizing:border-box;" data-width="100%">
            <section style="display: flex; justify-content: space-between;">
                <section style="width: 49%; max-width:100% !important; box-sizing:border-box;" class="" data-width="49%">
                    <img style="width:100%; display: block; vertical-align:baseline; box-sizing:border-box; max-width:100% !important;"
                         src="https://bcn.135editor.com/files/images/editor_styles/14df324fe8197ec294b38f540adb4b80.jpg"
                         data-width="100%" draggable="false" data-ratio="1.35" data-w="600" alt="图片1"/>
                </section>
                <section style="width: 49%; margin-left:12px; max-width:100% !important; box-sizing:border-box;" data-width="49%" class="">
                    <img style="width:100%; display: block; vertical-align:baseline; box-sizing:border-box; max-width:100% !important;"
                         src="https://bcn.135editor.com/files/images/editor_styles/f89266a84c9697acc23068c2653045e2.png"
                         data-width="100%" draggable="false" data-ratio="1.35" data-w="600" alt="图片2"/>
                </section>
            </section>
        </section>
    </section>
  `,

  // 带图注双图模板
  double_caption: `
    <section class="_135editor" data-tools="135编辑器" data-id="94401">
        <section style="width: 100%; margin: 10px auto; max-width:100% !important; box-sizing:border-box;" data-width="100%">
            <section style="display: flex; justify-content: space-between; align-items: flex-start;">
                <section style="width: 49%; max-width:100% !important; box-sizing:border-box;" class="" data-width="49%">
                    <img style="width:100%; display: block; vertical-align:baseline; box-sizing:border-box; max-width:100% !important;"
                         src="https://bcn.135editor.com/files/images/editor_styles/14df324fe8197ec294b38f540adb4b80.jpg"
                         data-width="100%" draggable="false" data-ratio="1.35" data-w="600" alt="图片1"/>
                    <section class="135brush">
                        <p style="vertical-align: inherit; color: #666666; font-size: 12px; text-decoration: inherit; line-height: 1.75em;text-align:center;" align="center">
                            <span style="color: #757576;"><span style="font-weight: 400; text-shadow: none; letter-spacing: 1.75px; font-size: 12px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{caption1}}</span>&nbsp;</span>
                        </p>
                    </section>
                </section>
                <section style="width: 49%; margin-left:12px; max-width:100% !important; box-sizing:border-box;" data-width="49%" class="">
                    <img style="width:100%; display: block; vertical-align:baseline; box-sizing:border-box; max-width:100% !important;"
                         src="https://bcn.135editor.com/files/images/editor_styles/f89266a84c9697acc23068c2653045e2.png"
                         data-width="100%" draggable="false" data-ratio="1.35" data-w="600" alt="图片2"/>
                    <section class="135brush">
                        <p style="vertical-align: inherit; color: #666666; font-size: 12px; text-decoration: inherit; line-height: 1.75em;text-align:center;" align="center">
                            <span style="color: #757576;"><span style="font-weight: 400; text-shadow: none; letter-spacing: 1.75px; font-size: 12px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{caption2}}</span>&nbsp;</span>
                        </p>
                    </section>
                </section>
            </section>
        </section>
    </section>
  `
}

