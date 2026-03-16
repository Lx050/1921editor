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
  `,

  // ========== 新增图片框样式 ==========

  // 圆角阴影单图
  single_shadow: `
    <section class="_135editor" data-tools="135编辑器">
	<section style="margin: 10px auto; padding: 0 8px; box-sizing: border-box;">
		<section style="border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
			<img style="width: 100%; display: block; vertical-align: baseline; box-sizing: border-box; max-width: 100% !important;" src="https://bcn.135editor.com/files/images/editor_styles/194203ed1fb963628dbf9a93e2430b30.png" data-width="100%" draggable="false"/>
		</section>
	</section>
</section>
  `,

  // 拍立得风格单图
  single_polaroid: `
    <section class="_135editor" data-tools="135编辑器">
	<section style="margin: 10px auto; display: flex; justify-content: center;">
		<section style="background: #ffffff; padding: 8px 8px 30px 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); transform: rotate(-1deg);">
			<img style="width: 100%; display: block; vertical-align: baseline; box-sizing: border-box; max-width: 100% !important;" src="https://bcn.135editor.com/files/images/editor_styles/194203ed1fb963628dbf9a93e2430b30.png" data-width="100%" draggable="false"/>
		</section>
	</section>
</section>
  `,

  // 渐变边框单图（紫色版）
  single_gradient_purple: `
    <section class="_135editor" data-tools="135编辑器">
	<section style="margin: 10px auto;">
		<section style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 3px; border-radius: 8px; box-sizing: border-box;">
			<section style="border-radius: 6px; overflow: hidden;">
				<img style="width: 100%; display: block; vertical-align: baseline; box-sizing: border-box; max-width: 100% !important;" src="https://bcn.135editor.com/files/images/editor_styles/194203ed1fb963628dbf9a93e2430b30.png" data-width="100%" draggable="false"/>
			</section>
		</section>
	</section>
</section>
  `,

  // 三图模板
  triple: `
    <section class="_135editor" data-tools="135编辑器">
        <section style="width: 100%; margin: 10px auto; max-width: 100% !important; box-sizing: border-box;" data-width="100%">
            <section style="display: flex; justify-content: space-between; gap: 6px;">
                <section style="width: 32%; max-width: 100% !important; box-sizing: border-box;" data-width="32%">
                    <img style="width: 100%; display: block; vertical-align: baseline; box-sizing: border-box; max-width: 100% !important;"
                         src="https://bcn.135editor.com/files/images/editor_styles/14df324fe8197ec294b38f540adb4b80.jpg"
                         data-width="100%" draggable="false" alt="图片1"/>
                </section>
                <section style="width: 32%; max-width: 100% !important; box-sizing: border-box;" data-width="32%">
                    <img style="width: 100%; display: block; vertical-align: baseline; box-sizing: border-box; max-width: 100% !important;"
                         src="https://bcn.135editor.com/files/images/editor_styles/f89266a84c9697acc23068c2653045e2.png"
                         data-width="100%" draggable="false" alt="图片2"/>
                </section>
                <section style="width: 32%; max-width: 100% !important; box-sizing: border-box;" data-width="32%">
                    <img style="width: 100%; display: block; vertical-align: baseline; box-sizing: border-box; max-width: 100% !important;"
                         src="https://bcn.135editor.com/files/images/editor_styles/194203ed1fb963628dbf9a93e2430b30.png"
                         data-width="100%" draggable="false" alt="图片3"/>
                </section>
            </section>
        </section>
    </section>
  `
}

// 分割线模板
export const DIVIDER_TEMPLATES = {
  // 渐变淡出线
  gradient_fade: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0;">
      <section style="height: 1px; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent);"></section>
    </section>
  `,

  // 三点分隔符
  three_dots: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <section style="display: inline-flex; gap: 12px; align-items: center;">
        <section style="width: 6px; height: 6px; background: #d1d5db; border-radius: 50%;"></section>
        <section style="width: 6px; height: 6px; background: #9ca3af; border-radius: 50%;"></section>
        <section style="width: 6px; height: 6px; background: #d1d5db; border-radius: 50%;"></section>
      </section>
    </section>
  `,

  // 星号分隔符
  star_divider: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; display: flex; align-items: center;">
      <section style="flex: 1; height: 1px; background: #e5e7eb;"></section>
      <section style="margin: 0 12px; color: #9ca3af; font-size: 14px;">&#10026;</section>
      <section style="flex: 1; height: 1px; background: #e5e7eb;"></section>
    </section>
  `,

  // 菱形分隔
  diamond: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; display: flex; align-items: center; justify-content: center;">
      <section style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #d1d5db); max-width: 120px;"></section>
      <section style="width: 8px; height: 8px; background: #9ca3af; transform: rotate(45deg); margin: 0 12px;"></section>
      <section style="flex: 1; height: 1px; background: linear-gradient(90deg, #d1d5db, transparent); max-width: 120px;"></section>
    </section>
  `,

  // 波浪分隔线
  wave: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center; color: #d1d5db; font-size: 18px; letter-spacing: 4px;">
      ～～～～～～～
    </section>
  `,

  // 双线分隔
  double_line: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0;">
      <section style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; height: 4px;"></section>
    </section>
  `,

  // ========== 校园主题分隔线 ==========

  // 书本分隔线
  book_divider: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <section style="display: inline-flex; align-items: center; gap: 10px;">
        <section style="width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #93C5FD);"></section>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style="display: block;"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" fill="#93C5FD"/></svg>
        <section style="width: 60px; height: 1px; background: linear-gradient(90deg, #93C5FD, transparent);"></section>
      </section>
    </section>
  `,

  // 星星分隔线
  star_campus: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <section style="display: inline-flex; align-items: center; gap: 6px;">
        <section style="width: 50px; height: 1px; background: linear-gradient(90deg, transparent, #FDE68A);"></section>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" style="display: block;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FDE68A"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="display: block;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F59E0B"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" style="display: block;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FDE68A"/></svg>
        <section style="width: 50px; height: 1px; background: linear-gradient(90deg, #FDE68A, transparent);"></section>
      </section>
    </section>
  `,

  // 樱花分隔线
  cherry_blossom_divider: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center; color: #F9A8D4; font-size: 16px; letter-spacing: 8px;">
      &#10047; &#10047; &#10047;
    </section>
  `,

  // 铅笔画虚线
  pencil_dash: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; display: flex; align-items: center; padding: 0 20px;">
      <section style="flex: 1; border-top: 2px dashed #FDBA74;"></section>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="display: block; margin: 0 8px;"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#FDBA74"/></svg>
    </section>
  `,

  // 绿叶分隔线
  leaf_divider: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <section style="display: inline-flex; align-items: center; gap: 8px;">
        <section style="width: 50px; height: 1px; background: linear-gradient(90deg, transparent, #A7F3D0);"></section>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="display: block;"><path d="M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93A15.46 15.46 0 006.05 8.05zm11.57 3.52c-1.79-.62-3.2-.85-4.17-.85-1.33 0-2.07.31-2.07.31.02.2.03.4.03.6 0 3.37-1.31 6.5-3.48 8.88.57.2 1.17.34 1.79.38C13.76 20.93 17 18.73 18.91 15.4c.55-1.1-.2-3.56-1.29-3.83z" fill="#6EE7B7"/></svg>
        <section style="width: 50px; height: 1px; background: linear-gradient(90deg, #A7F3D0, transparent);"></section>
      </section>
    </section>
  `,

  // ========== SOTA 灵感新增分隔线 ==========

  // 奖杯分隔线
  trophy_divider: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <section style="display: inline-flex; align-items: center; gap: 8px;">
        <section style="width: 50px; height: 1px; background: linear-gradient(90deg, transparent, #FDE68A);"></section>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="display: block;"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="#F59E0B"/></svg>
        <section style="width: 50px; height: 1px; background: linear-gradient(90deg, #FDE68A, transparent);"></section>
      </section>
    </section>
  `,

  // 音乐符号分隔线
  music_divider: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center; color: #A78BFA; font-size: 16px; letter-spacing: 8px;">
      &#9835; &#9833; &#9835;
    </section>
  `,

  // 心形分隔线
  heart_divider: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <section style="display: inline-flex; align-items: center; gap: 6px;">
        <section style="width: 40px; height: 1px; background: linear-gradient(90deg, transparent, #FBCFE8);"></section>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style="display: block;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#F9A8D4"/></svg>
        <section style="width: 40px; height: 1px; background: linear-gradient(90deg, #FBCFE8, transparent);"></section>
      </section>
    </section>
  `,

  // 毕业帽分隔线
  graduation_divider: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <section style="display: inline-flex; align-items: center; gap: 8px;">
        <section style="width: 50px; height: 1px; background: linear-gradient(90deg, transparent, #93C5FD);"></section>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="display: block;"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" fill="#93C5FD"/></svg>
        <section style="width: 50px; height: 1px; background: linear-gradient(90deg, #93C5FD, transparent);"></section>
      </section>
    </section>
  `,

  // 彩虹渐变线
  rainbow_line: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; padding: 0 30px;">
      <section style="height: 2px; background: linear-gradient(90deg, #EF4444, #F59E0B, #10B981, #3B82F6, #8B5CF6); border-radius: 1px;"></section>
    </section>
  `,

  // ========== SOTA 高级分隔线（第二轮迭代） ==========

  // 渐变淡入淡出线（doocs Grace 风格）
  gradient_fade: `
    <section class="_135editor" data-role="separator" style="margin: 30px 0; padding: 0 20px;">
      <section style="height: 1px; background: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.12), rgba(0,0,0,0)); margin: 0 auto;"></section>
    </section>
  `,

  // 超细线（doocs transform 技巧）
  thin_scale_line: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; padding: 0 30px;">
      <section style="height: 1px; background: #e0e0e0; transform: scale(1, 0.5);"></section>
    </section>
  `,

  // 双线分隔（经典排版）
  double_classic: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; padding: 0 40px;">
      <section style="border-top: 3px double #ccc;"></section>
    </section>
  `,

  // SVG 波浪线
  svg_wave: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 20" width="80%" height="20" style="display: inline-block;">
        <path d="M0 10 Q25 0 50 10 Q75 20 100 10 Q125 0 150 10 Q175 20 200 10 Q225 0 250 10 Q275 20 300 10 Q325 0 350 10 Q375 20 400 10" fill="none" stroke="#d0d0d0" stroke-width="1.5"/>
      </svg>
    </section>
  `,

  // 渐变菱形
  gradient_diamond: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <section style="display: flex; align-items: center; justify-content: center; gap: 12px; padding: 0 30px;">
        <section style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #667eea);"></section>
        <section style="width: 8px; height: 8px; background: #667eea; transform: rotate(45deg);"></section>
        <section style="flex: 1; height: 1px; background: linear-gradient(to left, transparent, #667eea);"></section>
      </section>
    </section>
  `,

  // 虚线圆点
  dotted_spacer: `
    <section class="_135editor" data-role="separator" style="margin: 30px 0; text-align: center;">
      <span style="color: #bbb; font-size: 20px; letter-spacing: 12px;">&#8226; &#8226; &#8226;</span>
    </section>
  `,

  // ========== 国潮/新拟态/SVG 分隔线（第三轮迭代） ==========

  // SVG 云纹分隔线（国潮）
  svg_cloud_pattern: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 30" width="80%" height="30" style="display: inline-block;">
        <path d="M0 15 C20 5, 40 5, 50 15 C60 25, 80 25, 100 15 C120 5, 140 5, 150 15 C160 25, 180 25, 200 15 C220 5, 240 5, 250 15 C260 25, 280 25, 300 15 C320 5, 340 5, 350 15 C360 25, 380 25, 400 15" fill="none" stroke="#d4af37" stroke-width="1.5" opacity="0.7"/>
        <circle cx="100" cy="15" r="2" fill="#d4af37" opacity="0.5"/>
        <circle cx="200" cy="15" r="2" fill="#d4af37" opacity="0.5"/>
        <circle cx="300" cy="15" r="2" fill="#d4af37" opacity="0.5"/>
      </svg>
    </section>
  `,

  // 水墨晕染分隔线
  ink_wash_divider: `
    <section class="_135editor" data-role="separator" style="margin: 30px 0; padding: 0 20px;">
      <section style="height: 2px; background: linear-gradient(to right, transparent, rgba(60,60,60,0.1) 15%, rgba(60,60,60,0.4) 35%, rgba(60,60,60,0.6) 50%, rgba(60,60,60,0.4) 65%, rgba(60,60,60,0.1) 85%, transparent); border-radius: 1px;"></section>
    </section>
  `,

  // 新拟态凹槽分隔线
  neumorphic_groove: `
    <section class="_135editor" data-role="separator" style="margin: 30px 0; padding: 0 30px;">
      <section style="height: 4px; background: #e0e5ec; border-radius: 2px; box-shadow: inset 1px 1px 2px rgba(166,180,200,0.7), inset -1px -1px 2px rgba(255,255,255,0.9);"></section>
    </section>
  `,

  // 印章装饰分隔线（国潮）
  seal_ornament_divider: `
    <section class="_135editor" data-role="separator" style="margin: 25px 0; text-align: center;">
      <section style="display: flex; align-items: center; justify-content: center; gap: 12px; padding: 0 30px;">
        <section style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #c8102e);"></section>
        <section style="width: 22px; height: 22px; border: 2px solid #c8102e; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <section style="width: 10px; height: 10px; background: #c8102e; border-radius: 50%;"></section>
        </section>
        <section style="flex: 1; height: 1px; background: linear-gradient(to left, transparent, #c8102e);"></section>
      </section>
    </section>
  `
}

