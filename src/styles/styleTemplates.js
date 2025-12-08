/**
 * 共享的样式模板数据
 * 供 StyleConfig 和 StyleSelector 组件使用
 * 包含高仿 135编辑器/SVG 风格的高级样式
 */

// 标题装饰样式数据
export const titleDecorations = [
  {
    id: 'title_mac',
    name: 'Mac窗口标题',
    type: 'title',
    preview: `<div style="background: #f0f0f0; border-radius: 6px; padding: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <div style="display: flex; gap: 4px; margin-bottom: 6px;">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #ff5f56;"></div>
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffbd2e;"></div>
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #27c93f;"></div>
      </div>
      <div style="height: 4px; background: #ddd; border-radius: 2px; width: 60%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
      <section style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        <section style="background: #e9ecef; padding: 10px 15px; display: flex; align-items: center; border-bottom: 1px solid #dee2e6;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; margin-right: 8px;"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; margin-right: 8px;"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div>
        </section>
        <section style="padding: 20px;">
          <p style="margin: 0; font-size: 16px; line-height: 1.75em; text-align: center; font-weight: normal; color: #333;">
            {{CONTENT}}
          </p>
        </section>
      </section>
    </section>`
  },
  {
    id: 'title_ins_simple',
    name: 'INS风极简',
    type: 'title',
    preview: `<div style="text-align: center; padding: 8px;">
      <span style="display: inline-block; border-bottom: 1px solid #333; padding-bottom: 2px; font-size: 12px;">INS STYLE</span>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 30px 0; text-align: center;">
      <section style="display: inline-block; position: relative; padding: 0 10px;">
        <span style="display: block; font-size: 12px; color: #999; letter-spacing: 4px; margin-bottom: 5px;">TITLE</span>
        <span style="display: block; font-size: 16px; color: #333; font-weight: normal; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 8px; line-height: 1.75em;">{{CONTENT}}</span>
      </section>
    </section>`
  },
  {
    id: 'title_gradient_tag',
    name: '渐变标签',
    type: 'title',
    preview: `<div style="padding: 8px;">
      <span style="background: linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%); color: white; padding: 2px 8px; border-radius: 10px 0 10px 0; font-size: 10px;">New</span>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
      <section style="display: inline-block; background: linear-gradient(90deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); border-radius: 20px 0 20px 0; padding: 5px 20px; box-shadow: 2px 2px 5px rgba(255, 154, 158, 0.4);">
        <p style="margin: 0; font-size: 16px; color: #fff; font-weight: normal; letter-spacing: 1px; line-height: 1.75em;">{{CONTENT}}</p>
      </section>
    </section>`
  },
  {
    id: 'title_chinese_ink',
    name: '水墨中国风',
    type: 'title',
    preview: `<div style="text-align: center; padding: 8px;">
      <div style="border: 1px solid #333; width: 20px; height: 20px; transform: rotate(45deg); display: inline-block;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 30px 0; text-align: center;">
      <section style="display: flex; align-items: center; justify-content: center;">
        <section style="width: 40px; height: 1px; background: #333;"></section>
        <section style="margin: 0 15px; border: 1px solid #333; padding: 5px; transform: rotate(45deg);">
          <div style="width: 100%; height: 100%; background: #333; transform: scale(0.8);"></div>
        </section>
        <section style="width: 40px; height: 1px; background: #333;"></section>
      </section>
      <p style="margin-top: 15px; font-size: 16px; font-weight: normal; color: #333; font-family: 'STKaiti', 'KaiTi', serif; line-height: 1.75em;">{{CONTENT}}</p>
    </section>`
  },
  {
    id: 'title_number_circle',
    name: '序号圆点',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; padding: 8px;">
      <div style="width: 16px; height: 16px; background: #6c5ce7; border-radius: 50%; color: white; font-size: 10px; text-align: center; line-height: 16px;">1</div>
      <div style="width: 30px; height: 1px; background: #6c5ce7; margin-left: 4px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
      <section style="display: flex; align-items: center;">
        <section style="width: 30px; height: 30px; background: #6c5ce7; border-radius: 50%; color: white; font-size: 16px; font-weight: bold; text-align: center; line-height: 30px; flex-shrink: 0; box-shadow: 0 2px 5px rgba(108, 92, 231, 0.4);">01</section>
        <section style="flex: 1; margin-left: 10px; border-bottom: 2px dashed #a29bfe; padding-bottom: 5px;">
          <p style="margin: 0; font-size: 16px; font-weight: normal; color: #6c5ce7; line-height: 1.75em;">{{CONTENT}}</p>
        </section>
      </section>
    </section>`
  },
  {
    id: 'title_red_svg',
    name: '红金法治',
    type: 'title',
    preview: `<div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 4px;">
      <div style="width: 8px; height: 8px; background: #b90e0e;"></div>
      <div style="background: #ffeed0; padding: 2px 8px; color: #b90e0e; font-size: 10px;">法治</div>
      <div style="width: 8px; height: 8px; background: #b90e0e;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" data-tools="135编辑器" data-id="166838">
	<section style="margin: 10px auto;" class="">
		<section style="display: flex;justify-content: space-between;margin: 0 8px;align-items: flex-end;" class="">
			<section style="width: 16px;margin-bottom: -11px;box-sizing:border-box;">
				<svg id="_图层_2" data-name="图层 2" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 26.78 22.19" style="display: block;" xml:space="default">
					<g id="_图层_1-2" data-name="图层 1">
						<g>
							<path d="m0,0h9.94v22.19L0,14.54V0Z" style="fill: #b90e0e; fill-rule: evenodd; stroke-width: 0px;"></path>
							<path d="m16.83,0h9.95v22.19l-9.95-7.65V0Z" style="fill: #b90e0e; fill-rule: evenodd; stroke-width: 0px;"></path>
						</g>
					</g>
				</svg>
			</section>
			<section style="width: 16px;margin-bottom: -11px;box-sizing:border-box;transform: rotateY(180deg);-webkit-transform: rotateY(180deg);-moz-transform: rotateY(180deg);-o-transform: rotateY(180deg);">
				<svg id="_图层_2" data-name="图层 2" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 26.78 22.19" style="display: block;" xml:space="default">
					<g id="_图层_1-2" data-name="图层 1">
						<g>
							<path d="m0,0h9.94v22.19L0,14.54V0Z" style="fill: #b90e0e; fill-rule: evenodd; stroke-width: 0px;"></path>
							<path d="m16.83,0h9.95v22.19l-9.95-7.65V0Z" style="fill: #b90e0e; fill-rule: evenodd; stroke-width: 0px;"></path>
						</g>
					</g>
				</svg>
			</section>
		</section>
		<section style="background-color: #ffeed0;padding: 8px 10px;margin: 3px 0;box-sizing:border-box;" class="">
			<section style="font-size: 16px;color: #b90e0e;text-align: center;" class="">
				<p style="line-height: 1.75em;">
					<span style="font-size: 16px;font-family:微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong class="135brush" data-brushtype="text" style="font-weight: normal;">{{CONTENT}}</strong></span>
				</p>
			</section>
		</section>
		<section style="width: 8%;height: 3px;background-color: #b90e0e;margin: 4px auto 0;box-sizing:border-box;max-width:8% !important;" data-width="8%"></section>
	</section>
</section>`
  },
  {
    id: 'title_orange_gradient',
    name: '金秋渐变',
    type: 'title',
    preview: `<div style="padding: 4px;">
      <div style="height: 2px; background: linear-gradient(to right,#fcd053,#ffffff);"></div>
      <div style="background: linear-gradient(to right,#f04e12,#ff9b19); color: white; font-size: 10px; text-align: center; padding: 2px;">金秋</div>
      <div style="height: 2px; background: linear-gradient(to left,#fcd053,#ffffff);"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" data-tools="135编辑器" data-id="163889">
	<section style="margin: 10px auto; display: flex; justify-content: center;" class="">
		<section class="">
			<section style="width: 100%;height: 12px;background: linear-gradient(to right,#fcd053,#ffffff);margin-bottom: -5px;max-width:100% !important;box-sizing:border-box;" data-width="100%" class=""></section>
			<section style="padding: 8px 25px;background: linear-gradient(to right,#f04e12,#ff9b19);margin: 0 10px;box-sizing:border-box;" class="">
				<section style="font-size: 16px;color: #ffffff;text-align: center; ">
					<p style="line-height:1.75em">
						<span style="font-size: 16px;font-family:微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong class="135brush" data-brushtype="text" style="font-weight: normal;">{{CONTENT}}</strong></span>
					</p>
				</section>
			</section>
			<section style="width: 100%;height: 12px;background: linear-gradient(to left,#fcd053,#ffffff);margin-top: -5px;max-width:100% !important;box-sizing:border-box;" data-width="100%" class=""></section>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_blue_box',
    name: '清爽蓝框',
    type: 'title',
    preview: `<div style="background: #d1f4ea; padding: 4px;">
      <div style="background: #6eb4f5; color: white; font-size: 10px; text-align: center; padding: 2px;">蓝框</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" data-tools="135编辑器" data-id="156959">
	<section style="margin: 10px auto; display: flex; justify-content: center;" class="">
		<section style="background: linear-gradient(to right,#d1f4ea,#ffffff);padding: 5px;box-sizing:border-box;" class="">
			<section style="background-color: #6eb4f5;padding: 4px 15px;box-sizing:border-box;" class="">
				<section style="font-size: 16px;color: #ffffff;text-align: center;">
					<p style="line-height:1.75em">
						<span style="font-size: 16px;font-family:微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong class="135brush" data-brushtype="text" style="font-weight: normal;">{{CONTENT}}</strong></span>
					</p>
				</section>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_skew_blue',
    name: '斜角蓝橙',
    type: 'title',
    preview: `<div style="transform: skew(-20deg); border: 1px solid #65dffe; padding: 2px;">
      <div style="background: #0874f9; color: white; font-size: 10px; text-align: center; transform: skew(20deg);">斜角</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" data-tools="135编辑器" data-id="146566">
	<section style="margin: 10px auto; display: flex; justify-content: center;" class="">
		<section style="display: flex;flex-direction: column;" class="">
			<section style="width: 10px;height: 10px;background-color: #ff8034;margin-left: auto;margin-bottom: -5px;z-index: 5;box-sizing:border-box;"></section>
			<section style=";margin: 0 10px;transform: skew(-20deg);-webkit-transform: skew(-20deg);-moz-transform: skew(-20deg);-o-transform: skew(-20deg);" class="">
				<section style="border: 1px solid #65dffe;box-sizing:border-box;" class="">
					<section style="background-color: #0874f9;padding: 5px 20px;box-sizing:border-box;transform: translate(-4px,4px);-webkit-transform: translate(-4px,4px);-moz-transform: translate(-4px,4px);-o-transform: translate(-4px,4px);" class="">
						<section style="font-size: 16px;color: #ffffff;text-align: center;transform: skew(20deg);-webkit-transform: skew(20deg);-moz-transform: skew(20deg);-o-transform: skew(20deg);" class="">
							<p style="line-height:1.75em">
								<span style="font-size: 16px;font-family:微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong class="135brush" data-brushtype="text" style="font-weight: normal;">{{CONTENT}}</strong></span>
							</p>
						</section>
					</section>
				</section>
				<section style="width: 50%;height: 10px;background: linear-gradient(to right,#cbf467,transparent);margin-left: -10px;box-sizing:border-box;max-width:50% !important;" data-width="50%" class=""></section>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_news_flash',
    name: '突发新闻',
    type: 'title',
    preview: `<div style="background: linear-gradient(to right, #3859fe, #768cf9); color: white; font-size: 10px; text-align: center; padding: 4px;">NEWS</div>`,
    fullExample: `<section class="_135editor" data-role="title" data-tools="135编辑器" data-id="97610">
	<section style="margin: 10px auto; text-align: center;" class="">
		<section style="display:inline-block;">
			<section style="background:url(https://image2.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9naWYvN1FSVHZrSzJxQzZEMk9oaWJIVU16MVhpYUM3djBSY1VBMVRPMGZNWnNTQWliRVZibEhtdkVOeXZNaDR2VE5TNWliRmxIc0phUDZ6MGhrY1FEY3ZscXpub25nLzA/d3hfZm10PWdpZg==);background-repeat:no-repeat ;background-size:100%;background-position:bottom;">
				<section style="background:url(https://image2.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xbG9nby5jbi9tbWJpel9naWYvN1FSVHZrSzJxQzZEMk9oaWJIVU16MVhpYUM3djBSY1VBMTY3ZVFWb3B1T1RUbllEaWNLTXZmSFpNRkVocUxjeFZHbEp1dW9teWxQMHZqeE8yWHBhMXV5cUEvMD93eF9mbXQ9Z2lm);background-repeat:no-repeat ;background-size:100%;background-position:top;padding:6px 0px;box-sizing:border-box;" class="">
					<section class="135brush" data-brushtype="text" style="background-image: -webkit-linear-gradient(left, #3859fe, #768cf9); color: #ffffff; letter-spacing: 2px; font-size: 16px; text-align: center; padding: 8px 1em;box-sizing:border-box;">
						<p style="line-height:1.75em">
							<span style="font-size: 16px;font-family:微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: normal;">{{CONTENT}}</strong></span>
						</p>
					</section>
				</section>
			</section>
		</section>
	</section>
</section>`
  }
]

// 正文装饰样式数据
export const bodyDecorations = [
  {
    id: 'body_mac_window',
    name: 'Mac代码窗',
    type: 'body',
    preview: `<div style="background: #282c34; border-radius: 4px; padding: 6px;">
      <div style="display: flex; gap: 2px; margin-bottom: 4px;">
        <div style="width: 4px; height: 4px; border-radius: 50%; background: #ff5f56;"></div>
        <div style="width: 4px; height: 4px; border-radius: 50%; background: #ffbd2e;"></div>
        <div style="width: 4px; height: 4px; border-radius: 50%; background: #27c93f;"></div>
      </div>
      <div style="height: 2px; background: #3e4451; width: 80%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
      <section style="background: #282c34; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); overflow: hidden;">
        <section style="background: #21252b; padding: 10px 15px; display: flex; align-items: center;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56; margin-right: 8px;"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e; margin-right: 8px;"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div>
        </section>
        <section style="padding: 20px; color: #abb2bf; font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0;">{{CONTENT}}</p>
        </section>
      </section>
    </section>`
  },
  {
    id: 'body_ins_card',
    name: 'INS风卡片',
    type: 'body',
    preview: `<div style="background: #fff; border-radius: 8px; padding: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
      <div style="height: 4px; background: #f0f0f0; border-radius: 2px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0; padding: 20px; background: #ffffff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
      <section style="display: flex; align-items: center; margin-bottom: 15px;">
        <div style="width: 8px; height: 8px; background: #ff9a9e; border-radius: 50%;"></div>
        <div style="height: 1px; background: #eee; flex: 1; margin-left: 10px;"></div>
      </section>
      <section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
        <p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
          <span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, 'Microsoft YaHei', SimHei, STHeiti;">{{CONTENT}}</span>
        </p>
      </section>
      <section style="display: flex; align-items: center; margin-top: 15px;">
        <div style="height: 1px; background: #eee; flex: 1; margin-right: 10px;"></div>
        <div style="width: 8px; height: 8px; background: #a18cd1; border-radius: 50%;"></div>
      </section>
    </section>`
  },
  {
    id: 'body_paper_note',
    name: '复古纸条',
    type: 'body',
    preview: `<div style="background: #fff8e1; border: 1px solid #ffe082; padding: 6px; transform: rotate(-2deg);">
      <div style="height: 2px; background: #ffe082; width: 100%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
      <section style="background: #fff8e1; padding: 20px; border: 1px solid #ffe082; box-shadow: 2px 2px 0 rgba(0,0,0,0.1); transform: rotate(-1deg); position: relative;">
        <div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 40px; height: 15px; background: rgba(255,255,255,0.5); transform: rotate(2deg);"></div>
      <section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
        <p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
          <span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, 'Microsoft YaHei', SimHei, STHeiti;">{{CONTENT}}</span>
        </p>
      </section>
      </section>
    </section>`
  },
  {
    id: 'body_dashed_box',
    name: '虚线边框',
    type: 'body',
    preview: `<div style="border: 1px dashed #ff7675; border-radius: 4px; padding: 6px;">
      <div style="height: 4px; background: #ffeaa7; width: 50%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0; padding: 2px; background: linear-gradient(to right, #ff7675, #fd79a8); border-radius: 12px;">
      <section style="background: #fff; padding: 20px; border-radius: 10px; border: 1px dashed #ff7675;">
      <section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
        <p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
          <span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, 'Microsoft YaHei', SimHei, STHeiti;">{{CONTENT}}</span>
        </p>
      </section>
      </section>
    </section>`
  },
  {
    id: 'body_blue_orange_border',
    name: '蓝橙边框',
    type: 'body',
    preview: `<div style="border-top: 1px solid #2676c7; border-bottom: 1px solid #2676c7; padding: 4px;">
      <div style="height: 2px; background: #eee;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="165403">
	<section style="margin: 10px auto;">
		<section style="display: flex;align-items: center;">
			<section style="flex-shrink: 0;display: flex;transform: rotateY(180deg);-webkit-transform: rotateY(180deg);-moz-transform: rotateY(180deg);-o-transform: rotateY(180deg);">
				<section style="width: 10px;box-sizing:border-box;">
					<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 14.99 15.82" style="display: block;" xml:space="default">
						<g id="图层_2" data-name="图层 2">
							<g id="图层_1-2" data-name="图层 1">
								<path d="M0,15.82,8.11,7.91,0,0H6.88L15,7.91,6.88,15.82Z" style="fill:#176cc3;fill-rule:evenodd"></path>
							</g>
						</g>
					</svg>
				</section>
				<section style="width: 10px;box-sizing:border-box;">
					<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 14.99 15.82" style="display: block;" xml:space="default">
						<g id="图层_2" data-name="图层 2">
							<g id="图层_1-2" data-name="图层 1">
								<path d="M0,15.82,8.11,7.91,0,0H6.88L15,7.91,6.88,15.82Z" style="fill:#fa914e;fill-rule:evenodd"></path>
							</g>
						</g>
					</svg>
				</section>
				<section style="width: 10px;box-sizing:border-box;">
					<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 14.99 15.82" style="display: block;" xml:space="default">
						<g id="图层_2" data-name="图层 2">
							<g id="图层_1-2" data-name="图层 1">
								<path d="M0,15.82,8.11,7.91,0,0H6.88L15,7.91,6.88,15.82Z" style="fill:#176cc3;fill-rule:evenodd"></path>
							</g>
						</g>
					</svg>
				</section>
				<section style="width: 10px;box-sizing:border-box;">
					<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 14.99 15.82" style="display: block;" xml:space="default">
						<g id="图层_2" data-name="图层 2">
							<g id="图层_1-2" data-name="图层 1">
								<path d="M0,15.82,8.11,7.91,0,0H6.88L15,7.91,6.88,15.82Z" style="fill:#fa914e;fill-rule:evenodd"></path>
							</g>
						</g>
					</svg>
				</section>
			</section>
			<section style="width: 100%;height: 1px;border-top: 1px solid #2676c7;max-width:100% !important;box-sizing:border-box;" data-width="100%"></section>
		</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background-color: transparent;padding: 15px 0; ;box-sizing:border-box;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em;text-align:justify;" align="justify">
				<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
		<section style="display: flex;align-items: center;" class="">
			<section style="width: 100%;height: 1px;border-top: 1px solid #2676c7;max-width:100% !important;box-sizing:border-box;" data-width="100%" class=""></section>
			<section style="flex-shrink: 0;display: flex;">
				<section style="width: 10px;box-sizing:border-box;" class="">
					<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 14.99 15.82" style="display: block;" xml:space="default">
						<g id="图层_2" data-name="图层 2">
							<g id="图层_1-2" data-name="图层 1">
								<path d="M0,15.82,8.11,7.91,0,0H6.88L15,7.91,6.88,15.82Z" style="fill:#176cc3;fill-rule:evenodd"></path>
							</g>
						</g>
					</svg>
				</section>
				<section style="width: 10px;box-sizing:border-box;">
					<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 14.99 15.82" style="display: block;" xml:space="default">
						<g id="图层_2" data-name="图层 2">
							<g id="图层_1-2" data-name="图层 1">
								<path d="M0,15.82,8.11,7.91,0,0H6.88L15,7.91,6.88,15.82Z" style="fill:#fa914e;fill-rule:evenodd"></path>
							</g>
						</g>
					</svg>
				</section>
				<section style="width: 10px;box-sizing:border-box;">
					<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 14.99 15.82" style="display: block;" xml:space="default">
						<g id="图层_2" data-name="图层 2">
							<g id="图层_1-2" data-name="图层 1">
								<path d="M0,15.82,8.11,7.91,0,0H6.88L15,7.91,6.88,15.82Z" style="fill:#176cc3;fill-rule:evenodd"></path>
							</g>
						</g>
					</svg>
				</section>
				<section style="width: 10px;box-sizing:border-box;">
					<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 14.99 15.82" style="display: block;" xml:space="default">
						<g id="图层_2" data-name="图层 2">
							<g id="图层_1-2" data-name="图层 1">
								<path d="M0,15.82,8.11,7.91,0,0H6.88L15,7.91,6.88,15.82Z" style="fill:#fa914e;fill-rule:evenodd"></path>
							</g>
						</g>
					</svg>
				</section>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_red_corner',
    name: '红角边框',
    type: 'body',
    preview: `<div style="background: #ffeed0; padding: 4px;">
      <div style="background: #fff; border: 1px solid #b90e0e; height: 10px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="166835">
	<section style="margin: 10px auto; padding-right: 7px; box-sizing: border-box;" class="">
		<section style="background-color: #ffeed0;" class="">
			<section style="background-color: #b90e0e;padding-top: 6px;padding-right: 6px;box-sizing:border-box;transform: translate(6px,6px);-webkit-transform: translate(6px,6px);-moz-transform: translate(6px,6px);-o-transform: translate(6px,6px);" class="">
				<section style="padding: 10px 10px;background-color: #ffffff;box-sizing:border-box;transform: translate(0px,-6px);-webkit-transform: translate(0px,-6px);-moz-transform: translate(0px,-6px);-o-transform: translate(0px,-6px);" class="">
					<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background-color: transparent;">
						<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em;">
							<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
						</p>
					</section>
				</section>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_yellow_border',
    name: '黄色边框',
    type: 'body',
    preview: `<div style="border: 1px solid #fcd052; padding: 4px; background: #fffbef;">
      <div style="height: 2px; background: #eee;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="163882">
	<section style="margin: 10px auto; border: 1px solid #fcd052; padding: 6px;box-sizing:border-box;" class="">
		<section style="background-color: #fffbef;padding: 12px 10px;box-sizing:border-box;">
			<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em;">
					<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_gradient_border',
    name: '渐变边框',
    type: 'body',
    preview: `<div style="background: linear-gradient(#ffbb3a, #e32601); padding: 2px;">
      <div style="background: #fff; height: 10px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="162624">
	<section style="margin: 10px auto; background: linear-gradient(#ffbb3a, #e32601); padding: 3px;box-sizing:border-box;" class="">
		<section style="background-color: #ffffff;padding: 15px 10px;box-sizing:border-box;" class="">
			<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em;">
					<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_red_border_img',
    name: '红框插图',
    type: 'body',
    preview: `<div style="border: 1px solid #cc000b; padding: 4px;">
      <div style="height: 2px; background: #eee;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="135761">
	<section style="margin: 10px auto;">
		<section style="display: flex;justify-content: flex-start;padding: 0 0 0 15px;margin: 0 0 -20px;box-sizing:border-box;" class="">
			<section style="background-color: #ffffff;">
				<section class="assistant" style="width: 44px;box-sizing:border-box;">
					<img class="assistant" style="width: 100%; display: block;vertical-align:baseline;box-sizing:border-box;max-width:100% !important;" src="https://bcn.135editor.com/files/images/editor_styles/cf5a6b1e98df4d25592b95fafdaf0043.gif" data-width="100%" draggable="false"/>
				</section>
			</section>
		</section>
		<section style="padding: 20px 15px ;border: 1px solid #cc000b;box-sizing:border-box;" class="">
			<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em;">
					<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
		<section style="display: flex;justify-content: flex-end;padding: 0 15px 0 0;margin: -20px 0 0;box-sizing:border-box;" class="">
			<section style="background-color: #ffffff;">
				<section class="assistant" style="width: 44px;box-sizing:border-box;" mark-selection="">
					<img class="assistant" style="width: 100%; display: block;vertical-align:baseline;box-sizing:border-box;max-width:100% !important;" src="https://bcn.135editor.com/files/images/editor_styles/cf5a6b1e98df4d25592b95fafdaf0043.gif" data-width="100%" draggable="false"/>
				</section>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_cyan_bg',
    name: '青色背景',
    type: 'body',
    preview: `<div style="background: #f2faf9; border: 1px solid #33b5c8; padding: 4px;">
      <div style="background: #fff; height: 10px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="161178">
	<section style="margin: 10px auto;">
		<section style="border: 1px solid #33b5c8;background-color: #f2faf9;padding: 8px;box-sizing: border-box;" class="">
			<section style="background-color: #ffffff;padding: 10px;box-sizing: border-box;">
				<section style="text-align: justify;line-height: 1.75em;letter-spacing: 1.5px;font-size: 14px;color: #333333;background-color: transparent; box-sizing: border-box;">
					<section style="line-height: 2.07143em; color: #262626; text-shadow: none; letter-spacing: 1.5px; font-size: 14px;" class="135brush" data-autoskip="1">
						<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em;">
							<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
						</p>
					</section>
				</section>
			</section>
		</section>
		<section style="width: 35%;height: 3px;border-bottom: 1px solid #ffa5a5;margin-left: auto;box-sizing:border-box;max-width:35% !important;" data-width="35%"></section>
	</section>
</section>`
  },
  {
    id: 'body_orange_dots',
    name: '橙色圆点',
    type: 'body',
    preview: `<div style="background: rgb(255, 245, 230); padding: 4px;">
      <div style="display: flex; gap: 2px;">
        <div style="width: 4px; height: 4px; background: #ffb85d; border-radius: 50%;"></div>
        <div style="width: 4px; height: 4px; background: #ffb85d; border-radius: 50%;"></div>
      </div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="160493">
	<section style="margin: 10px auto; background-color: rgb(255, 245, 230); padding: 10px 0px; box-sizing: border-box;" class="">
		<section style="display: flex;padding-left: 14px;box-sizing:border-box;">
			<section style="width: 10px;height: 10px;border-radius: 100%;background-color: #ffb85d;box-sizing:border-box;"></section>
			<section style="width: 10px;height: 10px;border-radius: 100%;background-color: #ffb85d;margin-left:9px;box-sizing:border-box;"></section>
			<section style="width: 10px;height: 10px;border-radius: 100%;background-color: #ffb85d;margin-left:9px;box-sizing:border-box;"></section>
		</section>
		<section style="padding: 10px 15px;box-sizing:border-box;" class="">
			<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em;text-align:justify;" align="justify">
					<span style="font-weight: 400; color: rgb(0, 0, 0); text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
		<section style="display: flex;padding-right: 14px;justify-content: flex-end;box-sizing:border-box;" class="">
			<section style="width: 10px;height: 10px;border-radius: 100%;background-color: #e9211c;box-sizing:border-box;"></section>
			<section style="width: 10px;height: 10px;border-radius: 100%;background-color: #e9211c;margin-left:9px;box-sizing:border-box;"></section>
			<section style="width: 10px;height: 10px;border-radius: 100%;background-color: #e9211c;margin-left:9px;box-sizing:border-box;"></section>
		</section>
	</section>
</section>`
  }
]

// 引言装饰样式数据
export const introDecorations = [
  {
    id: 'intro_quote_big',
    name: '大引号',
    type: 'intro',
    preview: `<div style="text-align: center; font-size: 20px; color: #ddd; font-weight: bold;">“ ”</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 30px 0; text-align: center;">
      <span style="font-size: 60px; color: #f0f0f0; font-family: Arial, sans-serif; line-height: 0.5; display: block;">“</span>
      <section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent; margin: -20px 20px 0;">
        <p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
          <span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, 'Microsoft YaHei', SimHei, STHeiti;">{{CONTENT}}</span>
        </p>
      </section>
      <span style="font-size: 60px; color: #f0f0f0; font-family: Arial, sans-serif; line-height: 0.5; display: block; margin-top: 10px;">”</span>
    </section>`
  },
  {
    id: 'intro_vertical_line',
    name: '竖线引言',
    type: 'intro',
    preview: `<div style="border-left: 2px solid #0984e3; padding-left: 6px; font-size: 10px; color: #666;">引言内容...</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0; background: #f1f2f6; border-left: 5px solid #0984e3; padding: 15px 20px;">
      <section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
        <p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
          <span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, 'Microsoft YaHei', SimHei, STHeiti;">{{CONTENT}}</span>
        </p>
      </section>
    </section>`
  },
  {
    id: 'intro_gradient_bg',
    name: '渐变背景',
    type: 'intro',
    preview: `<div style="background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); padding: 6px; border-radius: 4px;"></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0; background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); padding: 25px; border-radius: 8px; color: #fff; box-shadow: 0 5px 15px rgba(132, 250, 176, 0.3);">
      <section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #ffffff; background-color: transparent;">
        <p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
          <span style="font-weight: 400; color: #ffffff; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, 'Microsoft YaHei', SimHei, STHeiti;">{{CONTENT}}</span>
        </p>
      </section>
    </section>`
  },
  {
    id: 'intro_red_orange_bars',
    name: '红橙竖条',
    type: 'intro',
    preview: `<div style="display: flex; gap: 4px; padding: 4px;">
      <div style="width: 4px; height: 20px; background: #ffb85d; border-radius: 2px;"></div>
      <div style="width: 4px; height: 20px; background: #e9211c; border-radius: 2px;"></div>
      <div style="background: #ffefd8; flex: 1; height: 20px; border-radius: 2px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="160494">
	<section style="margin: 10px auto;">
		<section style="display: flex;" class="">
			<section style="display: flex;margin-left: 25px;margin-bottom: -20px;">
				<section style="width: 6px;height: 28px;border-radius: 4px;background-color: #ffb85d;box-sizing:border-box;"></section>
				<section style="width: 6px;height: 28px;border-radius: 4px;background-color: #e9211c;margin-left: 9px;box-sizing:border-box;"></section>
			</section>
		</section>
		<section style="background-color: #ffefd8;border-radius:6px;padding: 12px;box-sizing:border-box;" class="">
			<section style="background-color: #ffffff;padding: 13px;border-radius:6px;box-sizing:border-box;" class="">
				<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background-color: transparent;">
					<p style="text-align: justify; font-size: 14px; text-indent: 2.25em; line-height: 1.75em;" align="justify">
						<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
					</p>
				</section>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_quote_author',
    name: '名言引用',
    type: 'intro',
    preview: `<div style="padding: 4px;">
      <div style="font-size: 10px; color: #333;">“ ... ”</div>
      <div style="text-align: right; font-size: 8px;">— Author</div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="158311">
	<section style="margin: 10px auto; display: flex; align-items: center;">
		<section style="width: 100%;z-index: 5;max-width:100% !important;box-sizing:border-box;" data-width="100%" class="">
			<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background-color: transparent;">
				<p style="text-align: justify; line-height: 1.75em; text-indent: 2.25em; font-size: 14px;" align="justify">
					<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">“ {{CONTENT}} ”</span>
				</p>
			</section>
			<section style="display: flex;justify-content: flex-end;" class="">
				<section style="display: flex;align-items: center;" class="">
					<section style="width: 80px;height: 1px;background-color: #333333;box-sizing:border-box;"></section>
					<section style="flex-shrink: 0;">
						<section style="font-size: 16px; color: #333333; text-align: justify; padding: 0px 5px; box-sizing: border-box;" class="">
							<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 16px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">高尔基</span>
						</section>
					</section>
				</section>
			</section>
		</section>
		<section style="width: 100%;margin-left: -100.1%;z-index: 0;max-width:100% !important;box-sizing:border-box;" data-width="100%" class="">
			<section style="width: 60%;margin: 0 auto;box-sizing:border-box;max-width:60% !important;" data-width="60%" class="">
				<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 115.55 78.41" style="display: block;" xml:space="default">
					<g id="图层_2" data-name="图层 2">
						<g id="图层_1-2" data-name="图层 1">
							<path d="M42,0H12A12,12,0,0,0,0,12V27.54a12,12,0,0,0,12,12H33.14S40.8,42,41.06,50.1c.22,6.7,0,11.51-5.48,14.65a15.6,15.6,0,0,1-8.07,1.94c-2.18,0-4.6,0-6.3,1.19-2.79,2-3.32,8.3,1.59,9.92s13.77-.07,19.81-4S53.44,64.41,54,56.48V12A12,12,0,0,0,42,0Z" style="fill:#fcf8eb"></path>
							<path d="M103.55,0h-30a12,12,0,0,0-12,12V27.54a12,12,0,0,0,12,12H94.72s7.66,2.41,7.93,10.56c.21,6.7,0,11.51-5.48,14.65a15.63,15.63,0,0,1-8.07,1.94c-2.19,0-4.61,0-6.3,1.19-2.79,2-3.32,8.3,1.58,9.92s13.78-.07,19.81-4S115,64.41,115.55,56.48V12A12,12,0,0,0,103.55,0Z" style="fill:#fcf8eb"></path>
						</g>
					</g>
				</svg>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_yellow_top_bar',
    name: '黄渐变顶条',
    type: 'intro',
    preview: `<div style="padding: 4px;">
      <div style="height: 4px; background: linear-gradient(to right,#ffd884,#fff3c3);"></div>
      <div style="background: #fffcf0; border: 1px solid #ffc665; height: 10px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="157878">
	<section style="margin: 10px auto;">
		<section style="width: 100%;height: 9px;background: linear-gradient(to right,#ffd884,#fff3c3);max-width:100% !important;box-sizing:border-box;" data-width="100%" class="">
			<section style="width: 46px;height: 100%;margin-left: auto;background-color: #de3b27;-webkit-clip-path: polygon(4px 0,100% 0,100% 100%,0 100%);box-sizing:border-box;" class="" ></section>
		</section>
		<section style="background-color: #fffcf0;padding: 10px 10px;border: 1px solid #ffc665;box-sizing:border-box;" class="">
			<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background-color: transparent;">
				<p style="text-align: justify; line-height: 1.75em; text-indent: 2.25em; font-size: 14px;" align="justify">
					<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_green_icon',
    name: '绿底图标',
    type: 'intro',
    preview: `<div style="background: #f2f6f2; padding: 4px; text-align: center;">
      <div style="width: 10px; height: 10px; background: #999; margin: 0 auto;"></div>
      <div style="height: 2px; background: #ccc; margin-top: 2px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-tools="135编辑器" data-id="146030">
	<section style="margin: 10px auto;" class="">
		<section class="assistant" style="width: 45px;margin: 0 auto -20px;box-sizing:border-box;">
			<img class="assistant" style="width: 100%; display: block;vertical-align:baseline;box-sizing:border-box;max-width:100% !important;" src="https://bcn.135editor.com/files/images/editor_styles/658d0346acda8161efb778c09f5a0595.gif" data-width="100%" draggable="false" data-ratio="0.948905109489051" data-w="137"/>
		</section>
		<section style="padding: 20px 10px;background-color: #f2f6f2;box-sizing:border-box;" class="">
			<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#051605;background-color: transparent;">
				<p style="text-indent: 2.25em; font-size: 14px; line-height: 1.75em;">
					<span style="font-weight: 400; color: rgb(0, 0, 0); text-shadow: none; letter-spacing: 1.75px; font-size: 14px;font-family:微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  }
]
