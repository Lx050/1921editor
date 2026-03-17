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
  },
  // ========== 以下为新增标题样式（补全主题预设引用 + SOTA 灵感新增） ==========
  {
    id: 'title_purple_badge',
    name: '优雅紫徽',
    type: 'title',
    preview: `<div style="text-align: center; padding: 8px;">
      <span style="background: #8b5cf6; color: white; padding: 2px 12px; border-radius: 20px; font-size: 10px;">PURPLE</span>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0; text-align: center;">
	<section style="display: inline-block; position: relative;">
		<section style="background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); padding: 8px 30px; border-radius: 25px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.35);">
			<p style="margin: 0; line-height: 1.75em; text-align: center;">
				<span style="font-size: 16px; color: #ffffff; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: normal;">{{CONTENT}}</strong></span>
			</p>
		</section>
		<section style="width: 60%; height: 3px; background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent); margin: 6px auto 0;"></section>
	</section>
</section>`
  },
  {
    id: 'title_stamp_red',
    name: '印章红印',
    type: 'title',
    preview: `<div style="text-align: center; padding: 6px;">
      <span style="border: 2px solid #dc2626; color: #dc2626; padding: 2px 8px; font-size: 10px; font-weight: bold;">印</span>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; border: 3px solid #dc2626; padding: 10px 28px; position: relative; background: rgba(220, 38, 38, 0.03);">
		<section style="position: absolute; top: -2px; left: -2px; width: 12px; height: 12px; border-top: 3px solid #dc2626; border-left: 3px solid #dc2626;"></section>
		<section style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; border-top: 3px solid #dc2626; border-right: 3px solid #dc2626;"></section>
		<section style="position: absolute; bottom: -2px; left: -2px; width: 12px; height: 12px; border-bottom: 3px solid #dc2626; border-left: 3px solid #dc2626;"></section>
		<section style="position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; border-bottom: 3px solid #dc2626; border-right: 3px solid #dc2626;"></section>
		<p style="margin: 0; line-height: 1.75em; text-align: center;">
			<span style="font-size: 16px; color: #dc2626; letter-spacing: 3px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: normal;">{{CONTENT}}</strong></span>
		</p>
	</section>
</section>`
  },
  {
    id: 'title_dark_band',
    name: '暗夜飘带',
    type: 'title',
    preview: `<div style="background: #1e293b; color: #e2e8f0; font-size: 10px; text-align: center; padding: 4px;">DARK</div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 14px 20px; position: relative; overflow: hidden;">
		<section style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(180deg, #60a5fa, #a78bfa);"></section>
		<p style="margin: 0; line-height: 1.75em; text-align: center;">
			<span style="font-size: 16px; color: #e2e8f0; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: normal;">{{CONTENT}}</strong></span>
		</p>
	</section>
</section>`
  },
  {
    id: 'title_rainbow_underline',
    name: '彩虹底线',
    type: 'title',
    preview: `<div style="text-align: center; padding: 6px;">
      <div style="font-size: 10px; margin-bottom: 2px;">Title</div>
      <div style="height: 3px; background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3); border-radius: 2px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block;">
		<p style="margin: 0 0 8px 0; line-height: 1.75em; text-align: center;">
			<span style="font-size: 16px; color: #333333; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: normal;">{{CONTENT}}</strong></span>
		</p>
		<section style="height: 4px; background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #ff6b6b); border-radius: 2px;"></section>
	</section>
</section>`
  },
  {
    id: 'title_left_accent',
    name: '左侧重点',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; padding: 6px;">
      <div style="width: 4px; height: 14px; background: #2563eb; border-radius: 2px;"></div>
      <div style="margin-left: 6px; font-size: 10px;">左侧</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="display: flex; align-items: center; padding: 0 8px;">
		<section style="width: 5px; height: 24px; background: linear-gradient(180deg, #2563eb, #60a5fa); border-radius: 3px; flex-shrink: 0;"></section>
		<section style="margin-left: 12px;">
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #1e293b; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: normal;">{{CONTENT}}</strong></span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_badge_number',
    name: '色块编号',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; padding: 4px;">
      <div style="background: #0F4C81; color: white; width: 16px; height: 16px; border-radius: 4px; font-size: 10px; text-align: center; line-height: 16px;">H</div>
      <div style="margin-left: 4px; font-size: 10px; border-bottom: 2px solid #0F4C81;">标题</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="display: flex; align-items: center;">
		<section style="background: linear-gradient(135deg, #0F4C81, #1a6fb5); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 8px rgba(15, 76, 129, 0.3);">
			<span style="color: #ffffff; font-size: 18px; font-weight: bold; font-family: Arial, sans-serif;">H</span>
		</section>
		<section style="margin-left: 12px; border-bottom: 2px solid #0F4C81; padding-bottom: 6px; flex: 1;">
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #0F4C81; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: normal;">{{CONTENT}}</strong></span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_center_line',
    name: '居中分线',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; padding: 6px;">
      <div style="flex: 1; height: 1px; background: #ccc;"></div>
      <div style="margin: 0 6px; font-size: 10px;">标题</div>
      <div style="flex: 1; height: 1px; background: #ccc;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 25px 0; text-align: center;">
	<section style="display: flex; align-items: center; padding: 0 8px;">
		<section style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #999);"></section>
		<section style="margin: 0 15px; flex-shrink: 0;">
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #333333; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: normal;">{{CONTENT}}</strong></span>
			</p>
		</section>
		<section style="flex: 1; height: 1px; background: linear-gradient(90deg, #999, transparent);"></section>
	</section>
</section>`
  },
  {
    id: 'title_shadow_offset',
    name: '重影偏移',
    type: 'title',
    preview: `<div style="text-align: center; padding: 6px; position: relative;">
      <div style="background: #eee; padding: 2px 10px; position: absolute; top: 4px; left: calc(50% - 18px); font-size: 8px;">影</div>
      <div style="background: #EF7060; color: white; padding: 2px 10px; position: relative; font-size: 10px;">重影</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; position: relative;">
		<section style="background: #f0cdc8; padding: 10px 28px; border-radius: 4px; position: absolute; top: 5px; left: 5px; width: 100%; box-sizing: border-box;"></section>
		<section style="background: linear-gradient(135deg, #EF7060, #e85d4a); padding: 10px 28px; border-radius: 4px; position: relative; box-shadow: 0 2px 10px rgba(239, 112, 96, 0.3);">
			<p style="margin: 0; line-height: 1.75em; text-align: center;">
				<span style="font-size: 16px; color: #ffffff; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: normal;">{{CONTENT}}</strong></span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== 校园主题标题样式 ==========
  {
    id: 'title_graduation_cap',
    name: '毕业帽标题',
    type: 'title',
    preview: `<div style="text-align: center; padding: 4px;">
      <div style="display: inline-block; margin-bottom: 2px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" fill="#4A9FF5"/></svg>
      </div>
      <div style="height: 3px; background: linear-gradient(90deg, transparent, #4A9FF5, transparent); border-radius: 2px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="text-align: center;">
		<section style="display: inline-block; margin-bottom: 6px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" style="display: block;"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" fill="#4A9FF5"/></svg>
		</section>
		<section style="padding: 10px 25px; background: linear-gradient(135deg, #E8F4FD, #D1ECFF); border-radius: 25px; display: inline-block;">
			<p style="margin: 0; line-height: 1.75em; text-align: center;">
				<span style="font-size: 16px; color: #2B6CB0; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti;"><strong style="font-weight: bold;">{{CONTENT}}</strong></span>
			</p>
		</section>
		<section style="height: 3px; background: linear-gradient(90deg, transparent, #4A9FF5, transparent); border-radius: 2px; margin-top: 8px; max-width: 200px; margin-left: auto; margin-right: auto;"></section>
	</section>
</section>`
  },
  {
    id: 'title_book_open',
    name: '书本标题',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; gap: 4px; padding: 4px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" fill="#34C759"/></svg>
      <div style="height: 3px; background: #34C759; border-radius: 2px; flex: 1;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="display: flex; align-items: center; padding: 0 10px;">
		<section style="flex-shrink: 0; margin-right: 10px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="display: block;"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" fill="#34C759"/></svg>
		</section>
		<section style="flex: 1;">
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #1A6B30; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
			<section style="height: 2px; background: linear-gradient(90deg, #34C759, #86EFAC); border-radius: 1px; margin-top: 6px;"></section>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_pencil_note',
    name: '铅笔标注',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; gap: 4px; padding: 4px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#FF8C42"/></svg>
      <div style="border-bottom: 2px dashed #FF8C42; flex: 1; font-size: 10px; color: #FF8C42;">标注</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="padding: 0 10px;">
		<section style="display: flex; align-items: center; margin-bottom: 8px;">
			<section style="flex-shrink: 0; margin-right: 8px; background: #FFF4EC; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" style="display: block;"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#FF8C42"/></svg>
			</section>
			<section style="flex: 1;">
				<p style="margin: 0; line-height: 1.75em;">
					<span style="font-size: 16px; color: #C2410C; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
		<section style="height: 2px; border-bottom: 2px dashed #FDBA74; margin: 0 5px;"></section>
	</section>
</section>`
  },
  {
    id: 'title_star_youth',
    name: '青春星标题',
    type: 'title',
    preview: `<div style="text-align: center; padding: 4px;">
      <div style="display: flex; justify-content: center; gap: 2px; margin-bottom: 2px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="8" height="8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFB800"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="10"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFB800"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="8" height="8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFB800"/></svg>
      </div>
      <div style="background: #FFF8E1; font-size: 10px; text-align: center; padding: 2px; border-radius: 4px; color: #B45309;">青春</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="text-align: center;">
		<section style="display: inline-flex; align-items: center; gap: 6px; margin-bottom: 6px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style="display: block;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFB800"/></svg>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style="display: block;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFB800"/></svg>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style="display: block;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFB800"/></svg>
		</section>
		<section style="background: linear-gradient(135deg, #FFF8E1, #FEF3C7); padding: 10px 30px; border-radius: 20px; display: inline-block; border: 1px solid #FDE68A;">
			<p style="margin: 0; line-height: 1.75em; text-align: center;">
				<span style="font-size: 16px; color: #B45309; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_megaphone',
    name: '喇叭通知',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; gap: 4px; padding: 4px; background: #FEF2F2; border-radius: 4px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1l5 5V4L5 9H4z" fill="#EF4444"/></svg>
      <div style="font-size: 10px; color: #EF4444;">通知</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="display: flex; align-items: center; padding: 0 10px;">
		<section style="flex-shrink: 0; background: #FEF2F2; border-radius: 8px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; border: 1px solid #FECACA;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" style="display: block;"><path d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1l5 5V4L5 9H4z" fill="#EF4444"/></svg>
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #DC2626; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
		</section>
		<section style="flex: 1; height: 1px; background: linear-gradient(90deg, #FECACA, transparent); margin-left: 10px;"></section>
	</section>
</section>`
  },
  {
    id: 'title_flag_banner',
    name: '旗帜标题',
    type: 'title',
    preview: `<div style="text-align: center; padding: 4px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #A78BFA); color: white; font-size: 10px; padding: 2px 12px; clip-path: polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%, 5% 50%);">旗帜</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="text-align: center;">
		<section style="display: inline-block; position: relative; padding: 10px 40px; background: linear-gradient(135deg, #7C3AED, #8B5CF6); border-radius: 4px;">
			<section style="position: absolute; left: -8px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-top: 12px solid transparent; border-bottom: 12px solid transparent; border-right: 8px solid #7C3AED;"></section>
			<section style="position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-top: 12px solid transparent; border-bottom: 12px solid transparent; border-left: 8px solid #8B5CF6;"></section>
			<p style="margin: 0; line-height: 1.75em; text-align: center;">
				<span style="font-size: 16px; color: #FFFFFF; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_campus_board',
    name: '黑板标题',
    type: 'title',
    preview: `<div style="background: #2D5016; border: 2px solid #8B6914; border-radius: 3px; padding: 4px; text-align: center;">
      <div style="font-size: 10px; color: #FFFFFF;">黑板</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="background: #2D5016; border: 4px solid #8B6914; border-radius: 6px; padding: 15px 20px; box-shadow: inset 0 0 20px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.15);">
		<p style="margin: 0; line-height: 1.75em; text-align: center;">
			<span style="font-size: 16px; color: #FFFFFF; letter-spacing: 3px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold; text-shadow: 0 0 3px rgba(255,255,255,0.3);">{{CONTENT}}</span>
		</p>
		<section style="height: 1px; background: rgba(255,255,255,0.2); margin-top: 10px;"></section>
	</section>
</section>`
  },
  {
    id: 'title_leaf_fresh',
    name: '清新树叶',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; gap: 3px; padding: 4px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path d="M17.75 2.01C12.01 2.01 6.97 5.67 5.22 10.84c-.18.53.15 1.09.69 1.27.53.18 1.09-.15 1.27-.69C8.7 6.92 13.03 4.01 17.75 4.01c.55 0 1-.45 1-1s-.45-1-1-1zM6.5 17.5c0 2.33 1.91 4.25 4.25 4.25h.04c1.09-.05 2.1-.56 2.78-1.39.66-.81.93-1.84.77-2.85-.18-1.1-.85-2.04-1.86-2.61-.33-.19-.69-.3-1.06-.33l2.8-3.34c.34-.41.28-1.02-.13-1.36-.41-.34-1.02-.28-1.36.13l-4.67 5.57c-.33.05-.64.14-.93.28-1.08.55-1.63 1.47-1.63 2.65z" fill="#10B981"/></svg>
      <div style="flex: 1; height: 2px; background: linear-gradient(90deg, #10B981, #6EE7B7, transparent);"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="display: flex; align-items: center; padding: 0 10px;">
		<section style="flex-shrink: 0; width: 32px; height: 32px; background: #ECFDF5; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" style="display: block;"><path d="M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93A15.46 15.46 0 006.05 8.05zm11.57 3.52c-1.79-.62-3.2-.85-4.17-.85-1.33 0-2.07.31-2.07.31.02.2.03.4.03.6 0 3.37-1.31 6.5-3.48 8.88.57.2 1.17.34 1.79.38C13.76 20.93 17 18.73 18.91 15.4c.55-1.1-.2-3.56-1.29-3.83z" fill="#10B981"/></svg>
		</section>
		<section style="flex: 1; border-bottom: 2px solid #A7F3D0;">
			<p style="margin: 0; padding-bottom: 8px; line-height: 1.75em;">
				<span style="font-size: 16px; color: #065F46; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_cherry_blossom',
    name: '樱花标题',
    type: 'title',
    preview: `<div style="text-align: center; padding: 4px;">
      <div style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); border: 1px solid #FBCFE8; border-radius: 20px; padding: 2px 8px; font-size: 10px; color: #BE185D; display: inline-block;">樱花</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="text-align: center; position: relative;">
		<section style="display: inline-flex; align-items: center; gap: 8px;">
			<section style="color: #F9A8D4; font-size: 18px;">&#10047;</section>
			<section style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); padding: 10px 28px; border-radius: 25px; border: 1px solid #FBCFE8;">
				<p style="margin: 0; line-height: 1.75em; text-align: center;">
					<span style="font-size: 16px; color: #BE185D; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
				</p>
			</section>
			<section style="color: #F9A8D4; font-size: 18px;">&#10047;</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_lightbulb',
    name: '灯泡标题',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; gap: 4px; padding: 4px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" fill="#F59E0B"/></svg>
      <div style="font-size: 10px; color: #F59E0B; border-bottom: 1px solid #FDE68A; flex: 1;">灯泡</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="display: flex; align-items: center; padding: 0 10px;">
		<section style="flex-shrink: 0; background: linear-gradient(135deg, #FEF3C7, #FDE68A); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 12px; box-shadow: 0 2px 8px rgba(245,158,11,0.2);">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" style="display: block;"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" fill="#F59E0B"/></svg>
		</section>
		<section style="flex: 1;">
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #92400E; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
			<section style="height: 2px; background: linear-gradient(90deg, #FDE68A, transparent); margin-top: 6px;"></section>
		</section>
	</section>
</section>`
  },
  // ========== SOTA 灵感标题样式 ==========
  {
    id: 'title_number_01',
    name: '数字编号标题',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; gap: 6px; padding: 4px;">
      <div style="background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; font-size: 10px; font-weight: bold; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">01</div>
      <div style="flex: 1; height: 2px; background: #DBEAFE;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="display: flex; align-items: center; padding: 0 10px;">
		<section style="flex-shrink: 0; background: linear-gradient(135deg, #3B82F6, #2563EB); color: #FFFFFF; font-size: 14px; font-weight: bold; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; box-shadow: 0 2px 8px rgba(59,130,246,0.3); font-family: 微软雅黑, Microsoft YaHei;">01</section>
		<section style="flex: 1;">
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #1E40AF; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
			<section style="height: 2px; background: linear-gradient(90deg, #3B82F6, #93C5FD, transparent); margin-top: 6px;"></section>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_bracket_green',
    name: '方括号标题',
    type: 'title',
    preview: `<div style="text-align: center; padding: 4px;">
      <span style="color: #10B981; font-size: 12px; font-weight: bold;">[ 标题 ]</span>
      <div style="height: 1px; background: #A7F3D0; margin-top: 2px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="text-align: center;">
		<p style="margin: 0; line-height: 1.75em; text-align: center;">
			<span style="font-size: 12px; color: #6EE7B7; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">[</span>
			<span style="font-size: 16px; color: #059669; letter-spacing: 3px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold; margin: 0 6px;">{{CONTENT}}</span>
			<span style="font-size: 12px; color: #6EE7B7; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">]</span>
		</p>
		<section style="height: 1px; background: linear-gradient(90deg, transparent, #A7F3D0, transparent); margin-top: 8px; max-width: 200px; margin-left: auto; margin-right: auto;"></section>
	</section>
</section>`
  },
  {
    id: 'title_ribbon_tag',
    name: '彩带标签',
    type: 'title',
    preview: `<div style="text-align: center; padding: 4px;">
      <div style="display: inline-block; background: linear-gradient(90deg, #EC4899, #F472B6); color: white; font-size: 9px; padding: 1px 10px 1px 6px; border-radius: 0 12px 12px 0;">标签</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="padding: 0 10px;">
		<section style="display: inline-block; background: linear-gradient(90deg, #EC4899, #F472B6); padding: 8px 24px 8px 16px; border-radius: 0 25px 25px 0; box-shadow: 0 2px 8px rgba(236,72,153,0.2);">
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #FFFFFF; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_trophy',
    name: '奖杯标题',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; gap: 4px; padding: 4px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="#F59E0B"/></svg>
      <div style="font-size: 10px; color: #B45309; border-bottom: 2px solid #FDE68A; flex: 1;">荣誉</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="display: flex; align-items: center; padding: 0 10px;">
		<section style="flex-shrink: 0; background: linear-gradient(135deg, #FEF3C7, #FDE68A); border-radius: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 12px; box-shadow: 0 2px 6px rgba(245,158,11,0.15);">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="display: block;"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="#F59E0B"/></svg>
		</section>
		<section style="flex: 1;">
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #92400E; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
			<section style="height: 2px; background: linear-gradient(90deg, #FDE68A, transparent); margin-top: 6px;"></section>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_sports_run',
    name: '运动会标题',
    type: 'title',
    preview: `<div style="display: flex; align-items: center; gap: 4px; padding: 4px;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" fill="#EF4444"/></svg>
      <div style="background: linear-gradient(90deg, #FEF2F2, transparent); padding: 1px 6px; font-size: 10px; color: #DC2626; flex: 1;">运动</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="display: flex; align-items: center; padding: 0 10px;">
		<section style="flex-shrink: 0; background: #FEF2F2; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-right: 12px; border: 2px solid #FECACA;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" style="display: block;"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" fill="#EF4444"/></svg>
		</section>
		<section style="flex: 1; background: linear-gradient(90deg, #FEF2F2, transparent); padding: 8px 14px; border-radius: 0 8px 8px 0;">
			<p style="margin: 0; line-height: 1.75em;">
				<span style="font-size: 16px; color: #DC2626; letter-spacing: 1.5px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_music_note',
    name: '音乐会标题',
    type: 'title',
    preview: `<div style="text-align: center; padding: 4px;">
      <span style="color: #8B5CF6; font-size: 12px;">&#9835;</span>
      <span style="color: #7C3AED; font-size: 10px; font-weight: bold;">音乐</span>
      <span style="color: #8B5CF6; font-size: 12px;">&#9835;</span>
    </div>`,
    fullExample: `<section class="_135editor" data-role="title" style="margin: 20px 0;">
	<section style="text-align: center;">
		<section style="display: inline-flex; align-items: center; gap: 10px;">
			<span style="color: #A78BFA; font-size: 20px;">&#9835;</span>
			<section style="background: linear-gradient(135deg, #F5F3FF, #EDE9FE); padding: 10px 28px; border-radius: 25px; border: 1px solid #DDD6FE;">
				<p style="margin: 0; line-height: 1.75em; text-align: center;">
					<span style="font-size: 16px; color: #5B21B6; letter-spacing: 2px; font-family: 微软雅黑, Microsoft YaHei, SimHei, STHeiti; font-weight: bold;">{{CONTENT}}</span>
				</p>
			</section>
			<span style="color: #A78BFA; font-size: 20px;">&#9835;</span>
		</section>
	</section>
</section>`
  },
  // ========== SOTA 标题样式（第二轮迭代，来源 doocs/md + Mintimate + mdnice） ==========
  {
    id: 'title_center_bottom_line',
    name: '居中底线（doocs）',
    type: 'title',
    preview: `<div style="text-align: center; padding: 6px 0;"><span style="font-size: 11px; font-weight: bold; border-bottom: 2px solid #0F4C81; padding-bottom: 3px;">居中底线</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; padding: 0 20px 8px; border-bottom: 2px solid #0F4C81;">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #0F4C81; letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_inverted_bg',
    name: '反色背景（doocs H2）',
    type: 'title',
    preview: `<div style="padding: 4px 8px; background: #0F4C81; color: white; font-size: 10px; font-weight: bold; border-radius: 4px; text-align: center;">反色标题</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="background: #0F4C81; padding: 10px 24px; border-radius: 4px;">
		<p style="margin: 0; font-size: 16px; font-weight: bold; color: #ffffff; text-align: center; letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_left_accent',
    name: '左侧重点线（doocs H3）',
    type: 'title',
    preview: `<div style="border-left: 3px solid #0F4C81; padding-left: 8px; font-size: 11px; font-weight: bold;">左侧强调</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="border-left: 3px solid #0F4C81; padding-left: 14px;">
		<p style="margin: 0; font-size: 16px; font-weight: bold; color: rgb(1,1,1); line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_shadow_elegant',
    name: '优雅阴影（Grace）',
    type: 'title',
    preview: `<div style="text-align: center; padding: 6px; text-shadow: 1px 1px 3px rgba(0,0,0,0.15); font-size: 11px; font-weight: bold; color: #333;">阴影优雅</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; padding: 12px 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-radius: 6px; background: #fff;">
		<p style="margin: 0; font-size: 17px; font-weight: bold; color: #333; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_asymmetric_card',
    name: '不对称圆角（Simple）',
    type: 'title',
    preview: `<div style="background: rgba(15,76,129,0.08); border: 1px solid rgba(15,76,129,0.15); border-radius: 6px 18px 6px 18px; padding: 4px 10px; font-size: 10px; text-align: center; font-weight: bold;">不对称圆角</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="background: rgba(15,76,129,0.06); border: 1px solid rgba(15,76,129,0.12); border-radius: 8px 24px 8px 24px; padding: 12px 24px;">
		<p style="margin: 0; font-size: 16px; font-weight: bold; color: #0F4C81; text-align: center; letter-spacing: 1.5px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_gradient_underline',
    name: '渐变下划线',
    type: 'title',
    preview: `<div style="text-align: center; padding: 6px 0;"><span style="font-size: 11px; font-weight: bold;">渐变线</span><div style="height: 2px; background: linear-gradient(to right, transparent, #667eea, transparent); margin-top: 3px;"></div></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<p style="margin: 0 0 6px; font-size: 17px; font-weight: bold; color: #333; letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
	<section style="height: 2px; background: linear-gradient(to right, transparent, #667eea, #764ba2, transparent); margin: 0 auto; width: 80%;"></section>
</section>`
  },
  {
    id: 'title_geek_pattern',
    name: '极客条纹（Geek）',
    type: 'title',
    preview: `<div style="background: repeating-linear-gradient(45deg, rgba(103,74,246,0.06), rgba(103,74,246,0.06) 3px, transparent 3px, transparent 6px); padding: 4px 8px; font-size: 10px; font-weight: bold; text-align: center; border-radius: 4px;">极客条纹</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="background: repeating-linear-gradient(45deg, rgba(103,74,246,0.06), rgba(103,74,246,0.06) 5px, transparent 5px, transparent 10px); padding: 14px 24px; border-radius: 6px; border: 1px solid rgba(103,74,246,0.15);">
		<p style="margin: 0; font-size: 16px; font-weight: bold; color: #674AF6; text-align: center; letter-spacing: 3px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_tech_gradient',
    name: '科技渐变（Tech）',
    type: 'title',
    preview: `<div style="border-left: 3px solid #0366d6; padding-left: 6px; background: linear-gradient(to right, rgba(3,102,214,0.08), transparent); font-size: 10px; font-weight: bold;">科技渐变</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="border-left: 4px solid #0366d6; padding: 12px 20px; background: linear-gradient(to right, rgba(3,102,214,0.08), transparent);">
		<p style="margin: 0; font-size: 16px; font-weight: bold; color: #0366d6; letter-spacing: 1.5px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  // ========== 第三轮迭代：国潮/古风/水墨/新拟态标题 ==========
  {
    id: 'title_guochao_gold',
    name: '国潮金标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(135deg, #2c1810, #4a2c1b); padding: 4px 8px; text-align: center; border: 1px solid #d4af37; border-radius: 4px;"><span style="color: #d4af37; font-size: 10px; font-weight: bold; letter-spacing: 2px;">国潮金</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="background: linear-gradient(135deg, #2c1810 0%, #4a2c1b 50%, #2c1810 100%); border: 2px solid #d4af37; border-radius: 8px; padding: 14px 28px; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(212,175,55,0.3);">
		<section style="position: absolute; top: 6px; left: 6px; width: 20px; height: 20px; border-left: 2px solid #d4af37; border-top: 2px solid #d4af37;"></section>
		<section style="position: absolute; bottom: 6px; right: 6px; width: 20px; height: 20px; border-right: 2px solid #d4af37; border-bottom: 2px solid #d4af37;"></section>
		<p style="margin: 0; font-size: 17px; font-weight: bold; color: #d4af37; text-align: center; letter-spacing: 4px; line-height: 1.75em; font-family: 楷体, KaiTi, STKaiti, serif;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_ink_wash',
    name: '水墨风标题',
    type: 'title',
    preview: `<div style="text-align: center; padding: 4px 0; border-bottom: 2px solid transparent; border-image: linear-gradient(to right, transparent 5%, rgba(0,0,0,0.6) 50%, transparent 95%) 1;"><span style="font-size: 10px; font-weight: bold; color: #333; font-family: serif;">水墨风</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<p style="margin: 0 0 8px; font-size: 18px; font-weight: bold; color: #2c2c2c; letter-spacing: 4px; line-height: 1.75em; font-family: 楷体, KaiTi, STKaiti, serif;">{{CONTENT}}</p>
	<section style="height: 3px; background: linear-gradient(to right, transparent 5%, rgba(0,0,0,0.08) 15%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.08) 85%, transparent 95%); margin: 0 auto; width: 85%; border-radius: 2px;"></section>
</section>`
  },
  {
    id: 'title_seal_stamp',
    name: '印章标题',
    type: 'title',
    preview: `<div style="display: inline-block; background: #c8102e; border: 2px solid #8b0000; border-radius: 4px; padding: 2px 8px;"><span style="color: white; font-size: 10px; font-weight: bold;">印章</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: #c8102e; border: 3px solid #8b0000; border-radius: 6px; padding: 10px 30px; box-shadow: inset 0 0 10px rgba(0,0,0,0.2), 0 4px 8px rgba(200,16,46,0.3);">
		<p style="margin: 0; font-size: 17px; font-weight: bold; color: #ffffff; letter-spacing: 4px; line-height: 1.75em; font-family: 楷体, KaiTi, STKaiti, serif; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_neumorphic',
    name: '新拟态标题',
    type: 'title',
    preview: `<div style="background: #e0e5ec; border-radius: 8px; padding: 4px 10px; box-shadow: 3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.5); text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #4a5568;">新拟态</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: #e0e5ec; border-radius: 16px; padding: 12px 32px; box-shadow: 8px 8px 16px rgba(163,177,198,0.5), -8px -8px 16px rgba(255,255,255,0.6);">
		<p style="margin: 0; font-size: 16px; font-weight: bold; color: #4a5568; letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_gradient_border',
    name: '渐变边框标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 2px; border-radius: 6px;"><div style="background: white; border-radius: 4px; padding: 3px 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold;">渐变边框</span></div></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); padding: 3px; border-radius: 12px;">
		<section style="background: white; border-radius: 10px; padding: 12px 30px;">
			<p style="margin: 0; font-size: 16px; font-weight: bold; color: #333; letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_organic_blob',
    name: '有机形状标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; padding: 4px 10px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: white;">有机形状</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; padding: 14px 36px; box-shadow: 0 6px 20px rgba(102,126,234,0.3);">
		<p style="margin: 0; font-size: 16px; font-weight: bold; color: #ffffff; letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  // ========== 杂志/复古/赛博/极光标题（第四轮迭代） ==========
  {
    id: 'title_editorial_serif',
    name: '杂志衬线标题',
    type: 'title',
    preview: `<div style="font-family: Georgia, serif; font-size: 12px; font-weight: 700; color: #2c3e50; letter-spacing: -0.5px; border-bottom: 2px solid #e74c3c; padding-bottom: 3px;">Editorial</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; padding: 0 20px 10px;">
		<p style="margin: 0; font-size: 22px; font-weight: 700; color: #2c3e50; letter-spacing: -0.5px; line-height: 1.3em; font-family: Georgia, 'Times New Roman', 宋体, SimSun, serif;">{{CONTENT}}</p>
		<section style="height: 3px; background: linear-gradient(to right, transparent, #e74c3c, transparent); margin-top: 8px;"></section>
	</section>
</section>`
  },
  {
    id: 'title_retro_terminal',
    name: '终端标题',
    type: 'title',
    preview: `<div style="background: #0a0a0a; color: #00ff41; font-family: Courier New, monospace; font-size: 10px; padding: 4px 6px; border: 1px solid #00ff41;">&gt; TITLE_</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: #0a0a0a; border: 2px solid #00ff41; padding: 12px 30px; box-shadow: 0 0 15px rgba(0,255,65,0.15), inset 0 0 30px rgba(0,255,65,0.05);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #00ff41; letter-spacing: 3px; line-height: 1.75em; font-family: 'Courier New', Consolas, monospace; text-shadow: 0 0 8px rgba(0,255,65,0.5);">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_aurora_gradient',
    name: '极光渐变标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(135deg, #6d327c, #485DA6, #00a1ba, #36C486); padding: 4px 8px; text-align: center; border-radius: 4px;"><span style="font-size: 10px; font-weight: bold; color: white;">Aurora</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: linear-gradient(135deg, #6d327c 0%, #485DA6 30%, #00a1ba 60%, #36C486 100%); padding: 14px 36px; border-radius: 8px; box-shadow: 0 4px 20px rgba(72,93,166,0.3);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #ffffff; letter-spacing: 2px; line-height: 1.75em; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_newspaper',
    name: '复古报纸标题',
    type: 'title',
    preview: `<div style="background: #f4e8d0; border-top: 2px double #333; border-bottom: 2px double #333; padding: 3px; text-align: center;"><span style="font-size: 10px; font-family: Georgia, serif; color: #2b2b2b; font-weight: bold;">NEWS</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="background: #f4e8d0; border-top: 3px double #2b2b2b; border-bottom: 3px double #2b2b2b; padding: 14px 20px;">
		<p style="margin: 0; font-size: 22px; font-weight: 700; color: #2b2b2b; letter-spacing: 4px; line-height: 1.4em; font-family: Georgia, '宋体', SimSun, serif;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_synthwave',
    name: '赛博朋克标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); padding: 4px 8px; text-align: center; border-radius: 4px;"><span style="font-size: 10px; font-weight: bold; color: #ff006e; text-shadow: 0 0 5px #ff006e;">CYBER</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); padding: 16px 30px; border-radius: 8px; border: 1px solid rgba(255,0,110,0.3); box-shadow: 0 0 20px rgba(255,0,110,0.15);">
		<p style="margin: 0; font-size: 20px; font-weight: bold; color: #ff006e; letter-spacing: 3px; line-height: 1.75em; text-shadow: 0 0 10px rgba(255,0,110,0.6), 0 0 20px rgba(255,0,110,0.3);">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_warm_flame',
    name: '暖焰标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(45deg, #ff9a9e, #fad0c4); padding: 4px 8px; text-align: center; border-radius: 4px;"><span style="font-size: 10px; font-weight: bold; color: white;">Warm</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%); padding: 14px 36px; border-radius: 50px; box-shadow: 0 4px 15px rgba(255,154,158,0.3);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #ffffff; letter-spacing: 2px; line-height: 1.75em; text-shadow: 0 1px 2px rgba(0,0,0,0.15);">{{CONTENT}}</p>
	</section>
</section>`
  },
  // ========== 粘土/粗野派/侘寂/全息/折纸/像素标题（第五轮迭代） ==========
  {
    id: 'title_claymorphism',
    name: '粘土标题',
    type: 'title',
    preview: `<div style="background: #e0e5ec; border-radius: 12px; padding: 4px 8px; box-shadow: 4px 4px 8px rgba(163,177,198,0.6), -4px -4px 8px rgba(255,255,255,0.5), inset 1px 1px 2px rgba(255,255,255,0.3);"><span style="font-size: 10px; font-weight: bold; color: #37597d;">Clay</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: #e0e5ec; border-radius: 20px; padding: 14px 36px; box-shadow: 9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5), inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(163,177,198,0.2);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #37597d; letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_brutalist',
    name: '粗野派标题',
    type: 'title',
    preview: `<div style="background: #ffff00; border: 2px solid #000; box-shadow: 4px 4px 0 #000; padding: 3px 8px;"><span style="font-size: 10px; font-weight: bold; color: #000; font-family: Courier New, monospace; text-transform: uppercase;">BRUTAL</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: #ffff00; border: 3px solid #000000; box-shadow: 8px 8px 0 #000000; padding: 12px 32px;">
		<p style="margin: 0; font-size: 20px; font-weight: 900; color: #000000; letter-spacing: 3px; line-height: 1.75em; font-family: 'Courier New', Consolas, monospace; text-transform: uppercase;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_wabi_sabi',
    name: '侘寂标题',
    type: 'title',
    preview: `<div style="padding: 4px 8px; border-bottom: 1px solid #c4b5a0;"><span style="font-size: 10px; color: #3a3a3a; letter-spacing: 2px;">侘 寂</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 30px 0; text-align: center;">
	<section style="display: inline-block; padding: 10px 40px 12px;">
		<p style="margin: 0; font-size: 18px; font-weight: 400; color: #3a3a3a; letter-spacing: 4px; line-height: 1.75em; font-family: '宋体', SimSun, Georgia, serif;">{{CONTENT}}</p>
		<section style="height: 1px; background: linear-gradient(to right, transparent, #c4b5a0 30%, #c4b5a0 70%, transparent); margin-top: 10px;"></section>
	</section>
</section>`
  },
  {
    id: 'title_holographic',
    name: '全息标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #4facfe); padding: 4px 8px; border-radius: 4px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: white;">Holo</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%); padding: 14px 36px; border-radius: 10px; box-shadow: 0 4px 20px rgba(102,126,234,0.35);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #ffffff; letter-spacing: 2px; line-height: 1.75em; text-shadow: 0 1px 3px rgba(0,0,0,0.25);">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_paper_fold',
    name: '折纸标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(to bottom, #fff 48%, #f0f0f0 50%, #fff 52%); border: 1px solid #e0e0e0; padding: 4px 8px; text-align: center;"><span style="font-size: 10px; color: #555;">折纸</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: linear-gradient(to bottom, #ffffff 0%, #f8f8f8 48%, #eeeeee 50%, #f8f8f8 52%, #ffffff 100%); border: 1px solid #e0e0e0; padding: 14px 36px; box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);">
		<p style="margin: 0; font-size: 18px; font-weight: 600; color: #444444; letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_pixel_art',
    name: '像素标题',
    type: 'title',
    preview: `<div style="background: #5c5c5c; border: 2px solid #000; box-shadow: inset 2px 2px 0 #fff, inset -2px -2px 0 #000; padding: 3px 8px;"><span style="font-size: 10px; font-weight: bold; color: #00ff00; font-family: Courier New, monospace;">8BIT</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: #2c2c2c; border: 3px solid #000000; box-shadow: inset 3px 3px 0 #555555, inset -3px -3px 0 #000000; padding: 12px 30px;">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #00ff00; letter-spacing: 3px; line-height: 1.75em; font-family: 'Courier New', Consolas, monospace; text-shadow: 2px 2px 0 #003300;">{{CONTENT}}</p>
	</section>
</section>`
  },
  // ========== 黑板/水彩/装饰艺术/票券/缎带/双色调标题（第六轮迭代） ==========
  {
    id: 'title_chalkboard',
    name: '黑板粉笔标题',
    type: 'title',
    preview: `<div style="background: #2d3436; border: 3px solid #5d4e37; padding: 4px 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #f5f6fa; font-family: Courier New, monospace; text-shadow: 1px 1px 2px rgba(255,255,255,0.3);">粉笔字</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: #2d3436; border: 5px solid #5d4e37; padding: 14px 36px; box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3);">
		<p style="margin: 0; font-size: 20px; font-weight: bold; color: #f5f6fa; letter-spacing: 3px; line-height: 1.75em; font-family: 'Courier New', Consolas, monospace; text-shadow: 1px 1px 2px rgba(255,255,255,0.3), -1px -1px 2px rgba(0,0,0,0.5);">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_watercolor',
    name: '水彩标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(135deg, rgba(249,213,229,0.7), rgba(191,227,240,0.7)); padding: 4px 8px; border-radius: 12px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #555;">水彩</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: linear-gradient(135deg, rgba(249,213,229,0.6) 0%, rgba(191,227,240,0.6) 50%, rgba(212,181,211,0.6) 100%); padding: 14px 40px; border-radius: 30px; box-shadow: 0 4px 20px rgba(249,213,229,0.4);">
		<p style="margin: 0; font-size: 18px; font-weight: 600; color: #555555; letter-spacing: 2px; line-height: 1.75em;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_art_deco',
    name: '装饰艺术标题',
    type: 'title',
    preview: `<div style="background: #1a1a1a; border: 2px double #d4af37; padding: 4px 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #d4af37; letter-spacing: 2px;">ART DECO</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="background: #1a1a1a; border: 3px double #d4af37; padding: 16px 30px; box-shadow: inset 4px 4px 0 rgba(212,175,55,0.1), inset -4px -4px 0 rgba(212,175,55,0.1);">
		<p style="margin: 0; font-size: 20px; font-weight: bold; color: #d4af37; letter-spacing: 4px; line-height: 1.75em; font-family: Georgia, 'Times New Roman', serif; text-transform: uppercase; background: linear-gradient(to right, rgba(212,175,55,0) 0%, rgba(212,175,55,0.15) 50%, rgba(212,175,55,0) 100%); padding: 4px 0;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_ticket',
    name: '票券标题',
    type: 'title',
    preview: `<div style="background: #fef9e7; border: 2px dashed #8b7355; padding: 4px 8px; text-align: center; border-radius: 4px;"><span style="font-size: 10px; font-weight: bold; color: #4a3c27;">TICKET</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: #fef9e7; border: 2px dashed #8b7355; padding: 14px 36px; border-radius: 8px; box-shadow: 0 2px 8px rgba(139,115,85,0.2);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #4a3c27; letter-spacing: 2px; line-height: 1.75em; font-family: Georgia, '宋体', SimSun, serif;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_ribbon',
    name: '缎带标题',
    type: 'title',
    preview: `<div style="background: #e74c3c; color: #fff; padding: 3px 10px; text-align: center; box-shadow: 0 2px 0 #c0392b;"><span style="font-size: 10px; font-weight: bold;">RIBBON</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: linear-gradient(180deg, #e74c3c 0%, #c0392b 100%); padding: 12px 40px; color: #ffffff; box-shadow: 0 4px 0 #a93226, 0 6px 12px rgba(231,76,60,0.3);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #ffffff; letter-spacing: 3px; line-height: 1.75em; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_duotone',
    name: '双色调标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(135deg, #5c0067, #00d4ff); padding: 4px 8px; text-align: center; border-radius: 4px;"><span style="font-size: 10px; font-weight: bold; color: #fff;">Duo</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: linear-gradient(135deg, #5c0067 0%, #00d4ff 100%); padding: 14px 36px; border-radius: 8px; box-shadow: 0 4px 15px rgba(92,0,103,0.3);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #ffffff; letter-spacing: 2px; line-height: 1.75em; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_stained_glass',
    name: '彩窗玻璃标题',
    type: 'title',
    preview: `<div style="background: linear-gradient(135deg, #FF6B6B, #4ECDC4); border: 2px solid #8B4513; padding: 4px 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #fff; text-shadow: 1px 1px 1px rgba(0,0,0,0.5);">彩窗</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="background: linear-gradient(135deg, #2C3E50, #34495E); padding: 6px; border: 3px solid #8B4513; box-shadow: inset 0 0 20px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2);">
		<section style="background: linear-gradient(135deg, rgba(255,107,107,0.75), rgba(78,205,196,0.75), rgba(69,183,209,0.6)); padding: 14px 30px; border: 2px solid #8B4513; box-shadow: inset 0 0 10px rgba(255,255,255,0.2);">
			<p style="margin: 0; font-size: 18px; font-weight: bold; color: #ffffff; letter-spacing: 2px; line-height: 1.75em; text-shadow: 1px 1px 3px rgba(0,0,0,0.5); font-family: Georgia, '华文楷体', STKaiti, serif;">{{CONTENT}}</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_blueprint',
    name: '蓝图工程标题',
    type: 'title',
    preview: `<div style="background: #0A2540; border: 1px solid #00D9FF; padding: 4px 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #00D9FF; font-family: Courier New, monospace;">BLUE</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="background-color: #0A2540; background-image: linear-gradient(rgba(30,73,118,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,73,118,0.5) 1px, transparent 1px); background-size: 20px 20px; padding: 18px 30px; border: 2px solid #00D9FF; box-shadow: 0 0 15px rgba(0,217,255,0.2);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #00D9FF; letter-spacing: 3px; line-height: 1.75em; font-family: Courier New, Consolas, monospace; text-transform: uppercase; text-shadow: 0 0 8px rgba(0,217,255,0.4);">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_classified',
    name: '分类广告标题',
    type: 'title',
    preview: `<div style="background: #F5F1E8; border: 2px double #8B7355; padding: 4px 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #C41E3A; font-family: Georgia, serif;">NEWS</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="background-color: #F5F1E8; padding: 14px 28px; border: 3px double #8B7355; box-shadow: inset 0 0 15px rgba(139,115,85,0.08);">
		<p style="margin: 0; font-size: 20px; font-weight: bold; color: #C41E3A; letter-spacing: 2px; line-height: 1.75em; font-family: Georgia, '宋体', SimSun, serif; border-bottom: 2px solid #2C2C2C; padding-bottom: 6px;">{{CONTENT}}</p>
	</section>
</section>`
  },
  {
    id: 'title_postage_stamp',
    name: '邮票标题',
    type: 'title',
    preview: `<div style="background: #FFF8DC; border: 2px solid #DC143C; padding: 4px 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #2C1810;">邮票</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; background: radial-gradient(circle at 5px 5px, transparent 3px, #DC143C 3px); background-size: 10px 10px; background-position: -5px -5px; padding: 8px;">
		<section style="background-color: #FFF8DC; border: 3px solid #DC143C; padding: 14px 30px; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
			<p style="margin: 0; font-size: 18px; font-weight: bold; color: #2C1810; letter-spacing: 2px; line-height: 1.75em; font-family: Georgia, '华文楷体', STKaiti, serif;">{{CONTENT}}</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'title_film_strip',
    name: '电影胶片标题',
    type: 'title',
    preview: `<div style="background: #1A1A1A; padding: 4px 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #FFD700;">FILM</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="background-color: #1A1A1A; padding: 6px 0; box-shadow: 0 6px 12px rgba(0,0,0,0.4); position: relative;">
		<section style="height: 8px; background: repeating-linear-gradient(90deg, transparent 0px, transparent 6px, #2C2C2C 6px, #2C2C2C 14px, transparent 14px, transparent 20px); margin-bottom: 4px;"></section>
		<section style="background: linear-gradient(180deg, #2a2a2a, #1A1A1A); padding: 12px 28px; border-left: 5px solid #2C2C2C; border-right: 5px solid #2C2C2C;">
			<p style="margin: 0; font-size: 18px; font-weight: bold; color: #FFD700; letter-spacing: 3px; line-height: 1.75em; font-family: Impact, '黑体', SimHei, sans-serif; text-transform: uppercase;">{{CONTENT}}</p>
		</section>
		<section style="height: 8px; background: repeating-linear-gradient(90deg, transparent 0px, transparent 6px, #2C2C2C 6px, #2C2C2C 14px, transparent 14px, transparent 20px); margin-top: 4px;"></section>
	</section>
</section>`
  },
  {
    id: 'title_terrazzo',
    name: '水磨石标题',
    type: 'title',
    preview: `<div style="background: #F0EDE5; border-radius: 6px; padding: 4px 8px; text-align: center;"><span style="font-size: 10px; font-weight: bold; color: #FF6B9D;">磨石</span></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="background-color: #F0EDE5; background-image: radial-gradient(circle at 15% 25%, #FF6B9D 2px, transparent 2px), radial-gradient(circle at 55% 65%, #4ECDC4 3px, transparent 3px), radial-gradient(circle at 85% 15%, #FFE66D 2px, transparent 2px), radial-gradient(circle at 35% 75%, #95E1D3 2px, transparent 2px), radial-gradient(circle at 70% 45%, #AA96DA 3px, transparent 3px); background-size: 80px 80px; padding: 18px 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
		<p style="margin: 0; font-size: 18px; font-weight: bold; color: #2C2C2C; letter-spacing: 1.5px; line-height: 1.75em; font-family: Arial, '微软雅黑', sans-serif;">{{CONTENT}}</p>
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
  },
  // ========== 以下为新增正文样式（补全主题预设引用 + SOTA 灵感新增） ==========
  {
    id: 'body_shadow_card',
    name: '浮影卡片',
    type: 'body',
    preview: `<div style="background: #fff; border-radius: 6px; padding: 6px; box-shadow: 0 4px 12px rgba(139,92,246,0.15); border-left: 3px solid #8b5cf6;">
      <div style="height: 3px; background: #f0f0f0; width: 70%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #ffffff; border-radius: 12px; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.12); padding: 20px; border-left: 4px solid #8b5cf6; position: relative; overflow: hidden;">
		<section style="position: absolute; top: 0; right: 0; width: 60px; height: 60px; background: linear-gradient(135deg, rgba(139,92,246,0.08), transparent); border-radius: 0 12px 0 60px;"></section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_highlight_box',
    name: '暖色高亮',
    type: 'body',
    preview: `<div style="background: #fef3e2; border-left: 3px solid #92400e; padding: 4px;">
      <div style="height: 3px; background: #d4a574; width: 50%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #fef3e2, #fde8cc); border-left: 5px solid #92400e; padding: 18px 20px; border-radius: 0 8px 8px 0; box-shadow: 0 2px 10px rgba(146, 64, 14, 0.08);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #451a03; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_rounded_bubble',
    name: '圆角气泡',
    type: 'body',
    preview: `<div style="background: linear-gradient(135deg, #fce4ec, #f3e5f5); border-radius: 12px; padding: 6px;">
      <div style="height: 3px; background: rgba(0,0,0,0.05); width: 60%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #fce4ec, #f3e5f5); border-radius: 20px; padding: 22px 24px; position: relative;">
		<section style="position: absolute; bottom: -8px; left: 30px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid #f3e5f5;"></section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #333333; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_dark_code',
    name: '深色终端',
    type: 'body',
    preview: `<div style="background: #0d1117; border-radius: 4px; padding: 6px;">
      <div style="display: flex; gap: 3px; margin-bottom: 4px;">
        <div style="width: 6px; height: 1px; background: #238636;"></div>
        <div style="width: 12px; height: 1px; background: #58a6ff;"></div>
      </div>
      <div style="height: 2px; background: #161b22; width: 70%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #0d1117; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.4);">
		<section style="background: #161b22; padding: 10px 15px; display: flex; align-items: center; gap: 8px;">
			<section style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56;"></section>
			<section style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></section>
			<section style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></section>
			<section style="flex: 1; text-align: center; color: #484f58; font-size: 12px; font-family: monospace;">terminal</section>
		</section>
		<section style="padding: 18px 20px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #c9d1d9; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #c9d1d9; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_quote_stripe',
    name: '条纹引述',
    type: 'body',
    preview: `<div style="border-left: 3px solid #009874; background: repeating-linear-gradient(0deg, #f8faf9, #f8faf9 2px, transparent 2px, transparent 4px); padding: 4px;">
      <div style="height: 3px; background: #eee; width: 60%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="border-left: 4px solid #009874; background: #f8faf9; padding: 18px 20px; border-radius: 0 6px 6px 0;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #1a1a1a; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_gradient_frame',
    name: '渐变画框',
    type: 'body',
    preview: `<div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 2px; border-radius: 6px;">
      <div style="background: white; border-radius: 4px; padding: 4px;">
        <div style="height: 3px; background: #eee; width: 60%;"></div>
      </div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 3px; border-radius: 12px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);">
		<section style="background: #ffffff; border-radius: 10px; padding: 20px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #000000; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  // ========== 校园主题正文样式 ==========
  {
    id: 'body_notebook_lined',
    name: '笔记本横线',
    type: 'body',
    preview: `<div style="background: #FFFFF0; padding: 4px 4px 4px 12px; border-left: 3px solid #EF4444; position: relative;">
      <div style="height: 2px; background: #E0D8C8; width: 80%; margin: 2px 0;"></div>
      <div style="height: 2px; background: #E0D8C8; width: 60%; margin: 2px 0;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #FFFFF8; border: 1px solid #E5DDD0; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
		<section style="border-left: 4px solid #EF4444; padding: 18px 20px 18px 22px; background-image: repeating-linear-gradient(transparent, transparent 27px, #E8E0D4 27px, #E8E0D4 28px); background-size: 100% 28px; background-position: 0 18px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 28px; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 28px; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #333333; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_sticky_note',
    name: '便签纸',
    type: 'body',
    preview: `<div style="background: #FEF9C3; padding: 6px; transform: rotate(-1deg); box-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
      <div style="height: 2px; background: #EAB308; width: 50%; opacity: 0.3;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #FEF9C3; padding: 22px 24px; transform: rotate(-0.5deg); box-shadow: 3px 3px 10px rgba(0,0,0,0.1); position: relative; border-bottom-right-radius: 20px;">
		<section style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 40px; height: 12px; background: rgba(234,179,8,0.3); border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;"></section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #713F12; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #713F12; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_campus_card',
    name: '校园卡片',
    type: 'body',
    preview: `<div style="background: #EFF6FF; border-radius: 8px; padding: 6px; border-top: 3px solid #3B82F6;">
      <div style="height: 2px; background: #93C5FD; width: 60%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #EFF6FF; border-radius: 12px; padding: 20px 22px; border-top: 3px solid #3B82F6; box-shadow: 0 2px 8px rgba(59,130,246,0.1);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1E3A5F; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #1E3A5F; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_chalkboard',
    name: '黑板文字',
    type: 'body',
    preview: `<div style="background: #2D5016; border: 2px solid #8B6914; border-radius: 3px; padding: 6px;">
      <div style="height: 2px; background: rgba(255,255,255,0.2); width: 80%;"></div>
      <div style="height: 2px; background: rgba(255,255,255,0.2); width: 50%; margin-top: 2px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #2D5016; border: 3px solid #8B6914; border-radius: 6px; padding: 22px 24px; box-shadow: inset 0 0 15px rgba(0,0,0,0.2), 0 3px 6px rgba(0,0,0,0.1);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #FFFFFF; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #FFFFFF; text-shadow: 0 0 2px rgba(255,255,255,0.2); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_bulletin',
    name: '公告栏',
    type: 'body',
    preview: `<div style="background: #FFFBEB; border: 1px solid #F59E0B; border-radius: 4px; padding: 4px;">
      <div style="background: #F59E0B; color: white; font-size: 8px; display: inline-block; padding: 0 4px; border-radius: 2px;">公告</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(245,158,11,0.1);">
		<section style="background: linear-gradient(90deg, #F59E0B, #FBBF24); padding: 6px 14px; display: flex; align-items: center; gap: 6px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style="display: block;"><path d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1l5 5V4L5 9H4z" fill="#FFFFFF"/></svg>
			<span style="font-size: 12px; color: #FFFFFF; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">校园公告</span>
		</section>
		<section style="padding: 18px 20px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #78350F; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #78350F; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_spring_green',
    name: '春日绿卡',
    type: 'body',
    preview: `<div style="background: #ECFDF5; border-left: 3px solid #10B981; border-radius: 0 6px 6px 0; padding: 6px;">
      <div style="height: 2px; background: #6EE7B7; width: 60%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #ECFDF5, #D1FAE5); border-left: 4px solid #10B981; border-radius: 0 12px 12px 0; padding: 20px 22px; box-shadow: 0 2px 8px rgba(16,185,129,0.08);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #064E3B; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #064E3B; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_pink_ribbon',
    name: '粉色丝带',
    type: 'body',
    preview: `<div style="background: #FDF2F8; border: 1px solid #FBCFE8; border-radius: 8px; padding: 4px; position: relative;">
      <div style="position: absolute; top: -2px; right: 6px; background: #EC4899; width: 6px; height: 10px; border-radius: 0 0 3px 3px;"></div>
      <div style="height: 2px; background: #F9A8D4; width: 50%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #FDF2F8; border: 1px solid #FBCFE8; border-radius: 12px; padding: 20px 22px; position: relative;">
		<section style="position: absolute; top: -1px; right: 20px; background: linear-gradient(180deg, #EC4899, #F472B6); width: 12px; height: 28px; border-radius: 0 0 6px 6px;"></section>
		<section style="position: absolute; top: -1px; right: 38px; background: linear-gradient(180deg, #EC4899, #F472B6); width: 12px; height: 20px; border-radius: 0 0 6px 6px;"></section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #831843; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #831843; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_sunflower',
    name: '向日葵阳光',
    type: 'body',
    preview: `<div style="background: linear-gradient(to bottom, #FEF3C7, #FFFBEB); border-radius: 8px; padding: 4px; border-bottom: 2px solid #F59E0B;">
      <div style="height: 2px; background: #FCD34D; width: 70%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(to bottom, #FEF3C7 0%, #FFFBEB 100%); border-radius: 12px; padding: 20px 22px; border-bottom: 3px solid #F59E0B; box-shadow: 0 2px 8px rgba(245,158,11,0.1);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #78350F; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #78350F; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== SOTA 灵感正文样式 ==========
  {
    id: 'body_event_card',
    name: '活动卡片',
    type: 'body',
    preview: `<div style="background: white; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
      <div style="background: linear-gradient(90deg, #3B82F6, #60A5FA); height: 3px;"></div>
      <div style="padding: 4px;">
        <div style="display: flex; align-items: center; gap: 3px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="8" height="8"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" fill="#3B82F6"/></svg>
          <span style="font-size: 8px; color: #3B82F6;">活动</span>
        </div>
      </div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
		<section style="background: linear-gradient(90deg, #3B82F6, #60A5FA); height: 4px;"></section>
		<section style="padding: 18px 20px;">
			<section style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="display: block;"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" fill="#3B82F6"/></svg>
				<span style="font-size: 12px; color: #3B82F6; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">校园活动</span>
			</section>
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #374151; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #374151; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_timeline_dot',
    name: '时间轴',
    type: 'body',
    preview: `<div style="display: flex; gap: 4px; padding: 4px;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #10B981; flex-shrink: 0;"></div>
        <div style="width: 1px; flex: 1; background: #A7F3D0;"></div>
      </div>
      <div style="flex: 1; height: 2px; background: #D1FAE5; margin-top: 4px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="display: flex; padding: 0 10px;">
		<section style="display: flex; flex-direction: column; align-items: center; margin-right: 16px; flex-shrink: 0;">
			<section style="width: 12px; height: 12px; border-radius: 50%; background: linear-gradient(135deg, #10B981, #34D399); box-shadow: 0 0 0 3px #D1FAE5; flex-shrink: 0;"></section>
			<section style="width: 2px; flex: 1; background: linear-gradient(to bottom, #A7F3D0, transparent); min-height: 20px;"></section>
		</section>
		<section style="flex: 1; background: #ECFDF5; border-radius: 8px; padding: 16px 18px; margin-bottom: 8px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #064E3B; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #064E3B; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_photo_frame',
    name: '照片框',
    type: 'body',
    preview: `<div style="background: white; border: 1px solid #E5E7EB; border-radius: 4px; padding: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background: #F3F4F6; height: 12px; border-radius: 2px;"></div>
      <div style="text-align: center; font-size: 8px; color: #9CA3AF; margin-top: 2px;">caption</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #374151; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #374151; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
		<section style="text-align: center; margin-top: 10px; padding-top: 8px; border-top: 1px dashed #E5E7EB;">
			<span style="font-size: 12px; color: #9CA3AF; font-family: 微软雅黑, Microsoft YaHei;">&#9679; &#9679; &#9679;</span>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_science_lab',
    name: '实验室笔记',
    type: 'body',
    preview: `<div style="background: #F0FDF4; border: 1px dashed #86EFAC; border-radius: 4px; padding: 4px;">
      <div style="display: flex; align-items: center; gap: 2px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="8" height="8"><path d="M13 2v2h-2V2h2m4.4 3.6L16 7l-1.4-1.4 1.4-1.4 1.4 1.4M20 11v2h-2v-2h2M6.4 3.6l1.4 1.4L6.4 6.4 5 5l1.4-1.4M4 11v2H2v-2h2m9 2c0-2.8-2.2-5-5-5v10c2.8 0 5-2.2 5-5z" fill="#22C55E"/></svg>
        <div style="height: 1px; background: #86EFAC; flex: 1;"></div>
      </div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #F0FDF4; border: 1px dashed #86EFAC; border-radius: 8px; padding: 18px 20px; position: relative;">
		<section style="position: absolute; top: -10px; left: 16px; background: #22C55E; color: white; font-size: 11px; padding: 2px 10px; border-radius: 10px; font-family: 微软雅黑, Microsoft YaHei; font-weight: bold;">Lab Note</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #14532D; background-color: transparent; margin-top: 4px;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #14532D; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== SOTA 正文样式（第二轮迭代，来源 mdnice/doocs/Paper/WeUI） ==========
  {
    id: 'body_quote_green',
    name: '绿色引用卡片（mdnice）',
    type: 'body',
    preview: `<div style="border-left: 3px solid #42b983; background: rgba(66,185,131,0.08); padding: 4px 8px; font-size: 9px;">引用正文</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="border-left: 4px solid #42b983; background: rgba(66,185,131,0.08); padding: 14px 20px; border-radius: 0 6px 6px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_quote_orange',
    name: '橙色引用卡片（mdnice）',
    type: 'body',
    preview: `<div style="border-left: 3px solid #e67e22; background: rgba(230,126,34,0.08); padding: 4px 8px; font-size: 9px;">橙色引用</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="border-left: 4px solid #e67e22; background: rgba(230,126,34,0.08); padding: 14px 20px; border-radius: 0 6px 6px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_quote_red',
    name: '红色引用卡片（mdnice）',
    type: 'body',
    preview: `<div style="border-left: 3px solid #e74c3c; background: rgba(231,76,60,0.08); padding: 4px 8px; font-size: 9px;">红色引用</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="border-left: 4px solid #e74c3c; background: rgba(231,76,60,0.08); padding: 14px 20px; border-radius: 0 6px 6px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_inset_shadow',
    name: '内凹阴影卡片（Grace）',
    type: 'body',
    preview: `<div style="background: #fafafa; box-shadow: inset 0 0 6px rgba(0,0,0,0.1); border-radius: 4px; padding: 4px 8px; font-size: 9px;">内凹阴影</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #fafafa; box-shadow: inset 0 0 10px rgba(0,0,0,0.06); border-radius: 8px; padding: 18px 22px; border: 1px solid rgba(0,0,0,0.04);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_gradient_frost',
    name: '渐变毛玻璃（Paper）',
    type: 'body',
    preview: `<div style="background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1)); border-radius: 4px; padding: 4px 8px; font-size: 9px;">毛玻璃</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%); border-radius: 10px; padding: 18px 22px; border: 1px solid rgba(99,102,241,0.1);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_elevation_card',
    name: '悬浮卡片（WeUI）',
    type: 'body',
    preview: `<div style="background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 6px; padding: 4px 8px; font-size: 9px;">悬浮卡片</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #ffffff; box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04); border-radius: 10px; padding: 20px 24px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== 第三轮迭代：新拟态/毛玻璃/国潮正文样式 ==========
  {
    id: 'body_neumorphic',
    name: '新拟态正文',
    type: 'body',
    preview: `<div style="background: #e0e5ec; box-shadow: 3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.5); border-radius: 6px; padding: 4px 8px; font-size: 9px;">新拟态</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #e0e5ec; border-radius: 16px; padding: 20px 24px; box-shadow: 8px 8px 16px rgba(163,177,198,0.5), -8px -8px 16px rgba(255,255,255,0.6);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #4a5568; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #4a5568; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_neumorphic_inset',
    name: '新拟态内凹',
    type: 'body',
    preview: `<div style="background: #e0e5ec; box-shadow: inset 3px 3px 6px rgba(163,177,198,0.5), inset -3px -3px 6px rgba(255,255,255,0.6); border-radius: 6px; padding: 4px 8px; font-size: 9px;">内凹拟态</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #e0e5ec; border-radius: 16px; padding: 20px 24px; box-shadow: inset 6px 6px 12px rgba(163,177,198,0.5), inset -6px -6px 12px rgba(255,255,255,0.7);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #4a5568; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #4a5568; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_glassmorphism',
    name: '毛玻璃正文',
    type: 'body',
    preview: `<div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; padding: 4px 8px; font-size: 9px; box-shadow: 0 4px 12px rgba(31,38,135,0.15);">毛玻璃</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05)); border: 1px solid rgba(255,255,255,0.3); border-radius: 16px; padding: 20px 24px; box-shadow: 0 8px 32px rgba(31,38,135,0.12);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_gradient_border',
    name: '渐变边框正文',
    type: 'body',
    preview: `<div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 2px; border-radius: 6px;"><div style="background: white; border-radius: 4px; padding: 4px 8px; font-size: 9px;">渐变边框</div></div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 2px; border-radius: 14px;">
		<section style="background: white; border-radius: 12px; padding: 20px 24px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_guochao_classic',
    name: '国潮古典正文',
    type: 'body',
    preview: `<div style="background: #faf0e6; border-left: 3px solid #8b4513; padding: 4px 8px; font-size: 9px; font-family: serif;">古典正文</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(to bottom, #faf0e6, #f5f5dc); border-left: 4px solid #8b4513; border-radius: 0 8px 8px 0; padding: 20px 24px; box-shadow: 0 2px 8px rgba(139,69,19,0.1);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #2c1810; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #2c1810; letter-spacing: 1.75px; font-size: 14px; font-family: 楷体, KaiTi, STKaiti, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_layered_shadow',
    name: '层叠阴影正文',
    type: 'body',
    preview: `<div style="background: white; box-shadow: 0 1px 1px rgba(0,0,0,0.06), 0 2px 2px rgba(0,0,0,0.06), 0 4px 4px rgba(0,0,0,0.06); border-radius: 6px; padding: 4px 8px; font-size: 9px;">层叠阴影</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #ffffff; border-radius: 12px; padding: 20px 24px; box-shadow: 0 1px 1px rgba(0,0,0,0.06), 0 2px 2px rgba(0,0,0,0.06), 0 4px 4px rgba(0,0,0,0.06), 0 8px 8px rgba(0,0,0,0.06), 0 16px 16px rgba(0,0,0,0.06);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== 杂志/终端/渐变/Notion 正文（第四轮迭代） ==========
  {
    id: 'body_editorial_serif',
    name: '杂志衬线正文',
    type: 'body',
    preview: `<div style="font-family: Georgia, serif; font-size: 9px; line-height: 1.7; color: #333; text-indent: 2em;">杂志衬线排版...</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="padding: 0 8px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.85em; letter-spacing: 0.5px; font-size: 15px; color: #333333; background-color: transparent;">
			<p style="font-size: 15px; text-indent: 2em; line-height: 1.85em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #333333; letter-spacing: 0.5px; font-size: 15px; font-family: Georgia, 'Times New Roman', '宋体', SimSun, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_retro_terminal',
    name: '终端正文',
    type: 'body',
    preview: `<div style="background: #0a0a0a; color: #00ff41; font-family: Courier New, monospace; font-size: 8px; padding: 4px 6px; border: 1px solid #00ff41;">&gt; text_</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #0a0a0a; border: 1px solid rgba(0,255,65,0.3); border-radius: 4px; padding: 18px 22px; box-shadow: inset 0 0 30px rgba(0,255,65,0.03);">
		<section data-autoskip="1" class="135brush" style="text-align: left; line-height: 1.75em; letter-spacing: 1px; font-size: 14px; color: #00ff41; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 0; line-height: 1.75em; text-align: left;" align="left">
				<span style="font-weight: 400; color: #00ff41; letter-spacing: 1px; font-size: 14px; font-family: 'Courier New', Consolas, monospace;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_warm_gradient',
    name: '暖焰渐变卡片',
    type: 'body',
    preview: `<div style="background: linear-gradient(45deg, #ff9a9e, #fad0c4); border-radius: 6px; padding: 4px 8px; font-size: 9px; color: white;">暖色渐变</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(120deg, #fff5f5 0%, #fff0ed 50%, #ffecd2 100%); border-radius: 10px; padding: 20px 24px; box-shadow: 0 2px 12px rgba(255,154,158,0.15);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #5a3e36; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #5a3e36; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_cool_gradient',
    name: '冰蓝渐变卡片',
    type: 'body',
    preview: `<div style="background: linear-gradient(120deg, #a1c4fd, #c2e9fb); border-radius: 6px; padding: 4px 8px; font-size: 9px; color: #1a365d;">冰蓝渐变</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(120deg, #e8f4fd 0%, #d6eef8 50%, #c2e9fb 100%); border-radius: 10px; padding: 20px 24px; box-shadow: 0 2px 12px rgba(161,196,253,0.2);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1a365d; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #1a365d; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_newspaper_vintage',
    name: '复古报纸正文',
    type: 'body',
    preview: `<div style="background: #f4e8d0; font-family: Georgia, serif; font-size: 9px; color: #2b2b2b; padding: 4px 8px; border-top: 1px double #333; border-bottom: 1px double #333;">旧报纸</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #f4e8d0; padding: 18px 22px; border-top: 1px solid #c4b8a0; border-bottom: 1px solid #c4b8a0;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.8em; letter-spacing: 0.5px; font-size: 14px; color: #2b2b2b; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2em; line-height: 1.8em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #2b2b2b; letter-spacing: 0.5px; font-size: 14px; font-family: Georgia, '宋体', SimSun, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_notion_block',
    name: 'Notion风格块',
    type: 'body',
    preview: `<div style="background: #f7f6f3; border-left: 3px solid #37352f; padding: 4px 8px; font-size: 9px; color: #37352f;">Notion block</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #f7f6f3; border-left: 3px solid #37352f; border-radius: 3px; padding: 16px 20px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #37352f; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #37352f; letter-spacing: 1.75px; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 微软雅黑, sans-serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== 粘土/粗野派/侘寂/全息/折纸/像素正文（第五轮迭代） ==========
  {
    id: 'body_claymorphism',
    name: '粘土正文',
    type: 'body',
    preview: `<div style="background: #e0e5ec; border-radius: 10px; padding: 4px 8px; box-shadow: 4px 4px 8px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.4); font-size: 9px; color: #37597d;">粘土</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #e0e5ec; border-radius: 16px; padding: 20px 24px; box-shadow: 6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5), inset 1px 1px 2px rgba(255,255,255,0.2);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #37597d; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #37597d; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_brutalist',
    name: '粗野派正文',
    type: 'body',
    preview: `<div style="background: #fff; border: 2px solid #000; box-shadow: 4px 4px 0 #000; padding: 4px 8px; font-size: 9px; color: #000; font-family: Courier New, monospace;">BRUTAL</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #ffffff; border: 3px solid #000000; box-shadow: 6px 6px 0 #000000; padding: 20px 24px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1px; font-size: 14px; color: #000000; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #000000; letter-spacing: 1px; font-size: 14px; font-family: 'Courier New', Consolas, monospace;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_wabi_sabi',
    name: '侘寂正文',
    type: 'body',
    preview: `<div style="background: #f5f5f0; border-left: 2px solid #8b7e74; padding: 4px 8px; font-size: 9px; color: #3a3a3a;">侘寂</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #f5f5f0; border-left: 2px solid #8b7e74; padding: 22px 24px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.85em; letter-spacing: 0.5px; font-size: 14px; color: #3a3a3a; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2em; line-height: 1.85em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #3a3a3a; letter-spacing: 0.5px; font-size: 14px; font-family: '宋体', SimSun, Georgia, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_holographic',
    name: '全息卡片正文',
    type: 'body',
    preview: `<div style="background: linear-gradient(135deg, #667eea, #f093fb, #4facfe); border-radius: 6px; padding: 4px 8px; font-size: 9px; color: #fff;">Holo</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(240,147,251,0.08) 50%, rgba(79,172,254,0.1) 100%); border: 1px solid rgba(102,126,234,0.2); border-radius: 12px; padding: 20px 24px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #2d3748; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #2d3748; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_paper_card',
    name: '折纸卡片正文',
    type: 'body',
    preview: `<div style="background: linear-gradient(to bottom, #fff 48%, #f0f0f0 50%, #fff 52%); border: 1px solid #e0e0e0; padding: 4px 8px; font-size: 9px; color: #444;">折纸</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #ffffff; border: 1px solid #e8e8e8; padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06), 0 12px 20px rgba(0,0,0,0.03);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #444444; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #444444; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_pixel_retro',
    name: '像素正文',
    type: 'body',
    preview: `<div style="background: #2c2c2c; border: 2px solid #000; box-shadow: inset 2px 2px 0 #555, inset -2px -2px 0 #000; padding: 4px 8px; font-size: 8px; color: #00ff00; font-family: Courier New, monospace;">PIXEL</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #1a1a2e; border: 2px solid #333355; box-shadow: inset 3px 3px 0 #2a2a4e, inset -3px -3px 0 #0a0a1e; padding: 18px 22px;">
		<section data-autoskip="1" class="135brush" style="text-align: left; line-height: 1.75em; letter-spacing: 1px; font-size: 14px; color: #e0e0e0; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 0; line-height: 1.75em; text-align: left;" align="left">
				<span style="font-weight: 400; color: #e0e0e0; letter-spacing: 1px; font-size: 14px; font-family: 'Courier New', Consolas, monospace;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== 黑板/水彩/装饰艺术/票券/缎带/双色调正文（第六轮迭代） ==========
  {
    id: 'body_chalkboard',
    name: '黑板粉笔正文',
    type: 'body',
    preview: `<div style="background: #2d3436; border: 3px solid #5d4e37; padding: 4px 8px; font-size: 8px; color: #f5f6fa; font-family: Courier New, monospace;">粉笔</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #2d3436; border: 4px solid #5d4e37; padding: 20px 24px; box-shadow: inset 0 0 20px rgba(0,0,0,0.5);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #f5f6fa; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #f5f6fa; letter-spacing: 1.5px; font-size: 14px; font-family: 'Courier New', Consolas, monospace; text-shadow: 1px 1px 2px rgba(255,255,255,0.2);">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_watercolor',
    name: '水彩正文',
    type: 'body',
    preview: `<div style="background: linear-gradient(135deg, rgba(249,213,229,0.5), rgba(191,227,240,0.5)); padding: 4px 8px; border-radius: 8px; font-size: 9px; color: #555;">水彩</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(135deg, rgba(249,213,229,0.4) 0%, rgba(191,227,240,0.4) 50%, rgba(197,225,165,0.3) 100%); border-radius: 16px; padding: 20px 24px; box-shadow: 0 4px 20px rgba(249,213,229,0.3);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #555555; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #555555; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_art_deco',
    name: '装饰艺术正文',
    type: 'body',
    preview: `<div style="background: #1a1a1a; border: 1px double #d4af37; padding: 4px 8px; font-size: 9px; color: #f5e6d3;">Art Deco</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #1a1a1a; border: 2px solid #d4af37; padding: 20px 24px; box-shadow: inset 3px 3px 0 rgba(212,175,55,0.08), inset -3px -3px 0 rgba(212,175,55,0.08);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #f5e6d3; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #f5e6d3; letter-spacing: 1.75px; font-size: 14px; font-family: Georgia, 'Times New Roman', '宋体', SimSun, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_ticket',
    name: '票券正文',
    type: 'body',
    preview: `<div style="background: #fef9e7; border: 2px dashed #8b7355; padding: 4px 8px; border-radius: 4px; font-size: 9px; color: #4a3c27;">票券</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: #fef9e7; border: 2px dashed #c4b08a; border-radius: 8px; padding: 20px 24px; box-shadow: 0 2px 8px rgba(139,115,85,0.15);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #4a3c27; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #4a3c27; letter-spacing: 1.75px; font-size: 14px; font-family: Georgia, '宋体', SimSun, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_ribbon_accent',
    name: '缎带强调正文',
    type: 'body',
    preview: `<div style="border-left: 4px solid #e74c3c; background: linear-gradient(to right, rgba(231,76,60,0.08), transparent); padding: 4px 8px; font-size: 9px; color: #333;">缎带</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="border-left: 5px solid #e74c3c; background: linear-gradient(to right, rgba(231,76,60,0.06) 0%, transparent 100%); padding: 18px 22px; box-shadow: 0 2px 8px rgba(231,76,60,0.08);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgb(1,1,1); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgb(1,1,1); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_duotone',
    name: '双色调正文',
    type: 'body',
    preview: `<div style="background: linear-gradient(135deg, rgba(92,0,103,0.1), rgba(0,212,255,0.1)); padding: 4px 8px; border-radius: 6px; font-size: 9px; color: #2d3748;">双色调</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(135deg, rgba(92,0,103,0.08) 0%, rgba(0,212,255,0.08) 100%); border: 1px solid rgba(92,0,103,0.12); border-radius: 10px; padding: 20px 24px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #2d3748; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #2d3748; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_stained_glass',
    name: '彩窗玻璃正文',
    type: 'body',
    preview: `<div style="background: linear-gradient(135deg, rgba(255,107,107,0.2), rgba(78,205,196,0.2)); border: 1px solid #8B4513; padding: 4px 8px; font-size: 9px; color: #2C3E50;">彩窗</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: linear-gradient(135deg, #2C3E50, #34495E); border: 3px solid #8B4513; padding: 4px; box-shadow: inset 0 0 15px rgba(0,0,0,0.2);">
		<section style="background: linear-gradient(135deg, rgba(255,107,107,0.12), rgba(78,205,196,0.12), rgba(247,220,111,0.08)); padding: 18px 22px; border: 1px solid rgba(139,69,19,0.3);">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #ecf0f1; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #ecf0f1; letter-spacing: 1.75px; font-size: 14px; font-family: Georgia, '华文楷体', STKaiti, serif; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_blueprint',
    name: '蓝图工程正文',
    type: 'body',
    preview: `<div style="background: #0A2540; border: 1px dashed #00D9FF; padding: 4px 8px; font-size: 9px; color: #FFFFFF; font-family: monospace;">蓝图</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background-color: #0A2540; background-image: linear-gradient(rgba(30,73,118,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,73,118,0.4) 1px, transparent 1px); background-size: 20px 20px; border: 2px dashed #00D9FF; padding: 20px 22px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #FFFFFF; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #FFFFFF; letter-spacing: 1.75px; font-size: 14px; font-family: Courier New, Consolas, monospace;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_classified',
    name: '分类广告正文',
    type: 'body',
    preview: `<div style="background: #FFFFFF; border: 1px solid #2C2C2C; padding: 4px 8px; font-size: 9px; color: #2C2C2C; font-family: Georgia, serif;">分类</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background-color: #F5F1E8; border: 3px double #8B7355; padding: 4px;">
		<section style="background-color: #FFFFFF; border: 1px solid #2C2C2C; padding: 18px 22px; box-shadow: 2px 2px 0 rgba(0,0,0,0.08);">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.65em; letter-spacing: 1px; font-size: 14px; color: #2C2C2C; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.65em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #2C2C2C; letter-spacing: 1.25px; font-size: 14px; font-family: Georgia, '宋体', SimSun, serif;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_postage_stamp',
    name: '邮票正文',
    type: 'body',
    preview: `<div style="background: #FFF8DC; border: 1px solid #DC143C; padding: 4px 8px; font-size: 9px; color: #2C1810;">邮票</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background: radial-gradient(circle at 5px 5px, transparent 3px, #DC143C 3px); background-size: 10px 10px; background-position: -5px -5px; padding: 7px;">
		<section style="background-color: #FFF8DC; border: 2px solid #DC143C; padding: 18px 22px; box-shadow: 0 3px 8px rgba(0,0,0,0.12);">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #2C1810; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #2C1810; letter-spacing: 1.75px; font-size: 14px; font-family: Georgia, '华文楷体', STKaiti, serif;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'body_film_strip',
    name: '电影胶片正文',
    type: 'body',
    preview: `<div style="background: #1A1A1A; border-left: 3px solid #2C2C2C; border-right: 3px solid #2C2C2C; padding: 4px 8px; font-size: 9px; color: #FFFFFF;">胶片</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background-color: #1A1A1A; padding: 4px 0; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
		<section style="height: 6px; background: repeating-linear-gradient(90deg, transparent 0px, transparent 6px, #2C2C2C 6px, #2C2C2C 12px, transparent 12px, transparent 18px);"></section>
		<section style="background-color: #FFFFFF; padding: 18px 22px; margin: 4px 6px; border-left: 4px solid #2C2C2C; border-right: 4px solid #2C2C2C;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #2C2C2C; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #2C2C2C; letter-spacing: 1.75px; font-size: 14px; font-family: Arial, '微软雅黑', sans-serif;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
		<section style="height: 6px; background: repeating-linear-gradient(90deg, transparent 0px, transparent 6px, #2C2C2C 6px, #2C2C2C 12px, transparent 12px, transparent 18px);"></section>
	</section>
</section>`
  },
  {
    id: 'body_terrazzo',
    name: '水磨石正文',
    type: 'body',
    preview: `<div style="background: #F0EDE5; border-radius: 4px; padding: 4px 8px; font-size: 9px; color: #2C2C2C;">磨石</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 15px 0;">
	<section style="background-color: #F0EDE5; background-image: radial-gradient(circle at 18% 28%, #FF6B9D 2px, transparent 2px), radial-gradient(circle at 58% 68%, #4ECDC4 3px, transparent 3px), radial-gradient(circle at 82% 18%, #FFE66D 2px, transparent 2px), radial-gradient(circle at 38% 78%, #95E1D3 2px, transparent 2px), radial-gradient(circle at 72% 48%, #AA96DA 3px, transparent 3px); background-size: 80px 80px; padding: 20px; border-radius: 10px;">
		<section style="background-color: rgba(255,255,255,0.92); padding: 18px 22px; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.06);">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #2C2C2C; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #2C2C2C; letter-spacing: 1.75px; font-size: 14px; font-family: Arial, '微软雅黑', sans-serif;">{{CONTENT}}</span>
				</p>
			</section>
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
  },
  // ========== 以下为新增引言样式（补全主题预设引用 + SOTA 灵感新增） ==========
  {
    id: 'intro_dotted_frame',
    name: '紫点虚框',
    type: 'intro',
    preview: `<div style="border: 2px dotted #8b5cf6; border-radius: 8px; padding: 4px;">
      <div style="height: 2px; background: #f0f0f0; width: 60%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="border: 2px dotted #8b5cf6; border-radius: 12px; padding: 20px; background: linear-gradient(135deg, #faf5ff, #f5f3ff); position: relative;">
		<section style="position: absolute; top: -8px; left: 20px; background: #8b5cf6; color: #fff; padding: 2px 12px; border-radius: 10px; font-size: 12px; letter-spacing: 1px;">引言</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent; margin-top: 5px;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #4c1d95; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_dark_mode',
    name: '暗夜引言',
    type: 'intro',
    preview: `<div style="background: #1e293b; border-radius: 4px; padding: 4px;">
      <div style="height: 2px; background: #475569; width: 60%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 10px; padding: 22px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); position: relative; overflow: hidden;">
		<section style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle at top right, rgba(96,165,250,0.1), transparent); border-radius: 0 10px 0 0;"></section>
		<section style="display: flex; align-items: center; margin-bottom: 12px;">
			<section style="width: 3px; height: 16px; background: linear-gradient(180deg, #60a5fa, #a78bfa); border-radius: 2px;"></section>
			<section style="margin-left: 8px; color: #64748b; font-size: 12px; letter-spacing: 2px;">INTRO</section>
		</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #cbd5e1; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #cbd5e1; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_highlight_strip',
    name: '大地高亮条',
    type: 'intro',
    preview: `<div style="padding: 4px;">
      <div style="height: 3px; background: #92400e; width: 30%; margin-bottom: 2px;"></div>
      <div style="background: #fef3e2; padding: 3px; border-radius: 2px;">
        <div style="height: 2px; background: #d4a574; width: 50%;"></div>
      </div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="position: relative;">
		<section style="width: 60px; height: 4px; background: linear-gradient(90deg, #92400e, #b45309); border-radius: 2px; margin-bottom: -2px; margin-left: 15px; position: relative; z-index: 1;"></section>
		<section style="background: linear-gradient(180deg, #fef3e2, #fffbf0); padding: 20px; border: 1px solid #fde68a; border-radius: 6px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #451a03; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_gradient_left',
    name: '左渐变引言',
    type: 'intro',
    preview: `<div style="display: flex; padding: 4px;">
      <div style="width: 4px; background: linear-gradient(180deg, #ec4899, #f472b6); border-radius: 2px;"></div>
      <div style="flex: 1; background: linear-gradient(90deg, #fdf2f8, #fff); padding: 3px; margin-left: 4px;">
        <div style="height: 2px; background: #eee; width: 50%;"></div>
      </div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="display: flex; overflow: hidden; border-radius: 8px; box-shadow: 0 2px 12px rgba(236, 72, 153, 0.1);">
		<section style="width: 6px; background: linear-gradient(180deg, #ec4899, #f472b6, #fb923c); flex-shrink: 0;"></section>
		<section style="flex: 1; background: linear-gradient(90deg, #fdf2f8, #ffffff); padding: 18px 20px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333333; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #831843; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_callout_info',
    name: '信息提示',
    type: 'intro',
    preview: `<div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 3px; display: flex; align-items: center;">
      <div style="color: #2563eb; font-size: 12px; margin-right: 4px;">i</div>
      <div style="height: 2px; background: #dbeafe; width: 50%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 18px 20px; display: flex; gap: 12px;">
		<section style="flex-shrink: 0; width: 28px; height: 28px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
			<span style="color: #ffffff; font-size: 16px; font-weight: bold; font-family: serif;">i</span>
		</section>
		<section style="flex: 1;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1e40af; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 0; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #1e40af; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_callout_tip',
    name: '贴士提醒',
    type: 'intro',
    preview: `<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 3px; display: flex; align-items: center;">
      <div style="color: #16a34a; font-size: 10px; margin-right: 4px;">TIP</div>
      <div style="height: 2px; background: #dcfce7; width: 50%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px 20px; display: flex; gap: 12px;">
		<section style="flex-shrink: 0; width: 28px; height: 28px; background: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
			<span style="color: #ffffff; font-size: 14px; font-family: serif;">&#10003;</span>
		</section>
		<section style="flex: 1;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #15803d; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 0; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #15803d; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_callout_warning',
    name: '警告提示',
    type: 'intro',
    preview: `<div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 4px; padding: 3px; display: flex; align-items: center;">
      <div style="color: #d97706; font-size: 10px; margin-right: 4px;">!</div>
      <div style="height: 2px; background: #fef3c7; width: 50%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 18px 20px; display: flex; gap: 12px;">
		<section style="flex-shrink: 0; width: 28px; height: 28px; background: #d97706; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
			<span style="color: #ffffff; font-size: 16px; font-weight: bold; font-family: serif;">!</span>
		</section>
		<section style="flex: 1;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #92400e; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 0; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #92400e; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_book_quote',
    name: '书页引述',
    type: 'intro',
    preview: `<div style="background: #fafaf9; border: 1px solid #e7e5e4; padding: 4px; position: relative;">
      <div style="position: absolute; top: -1px; left: 8px; font-size: 16px; color: #a8a29e;">"</div>
      <div style="height: 2px; background: #eee; width: 60%; margin-top: 8px;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #fafaf9; border: 1px solid #e7e5e4; padding: 25px 22px 20px; position: relative; border-radius: 4px;">
		<section style="position: absolute; top: 8px; left: 18px; font-size: 48px; color: #d6d3d1; font-family: Georgia, serif; line-height: 1;">"</section>
		<section style="position: absolute; bottom: 0; right: 18px; font-size: 48px; color: #d6d3d1; font-family: Georgia, serif; line-height: 0.5; transform: rotate(180deg);">"</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #44403c; background-color: transparent; margin-top: 15px;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #44403c; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== 校园主题引言样式 ==========
  {
    id: 'intro_campus_announce',
    name: '校园通知',
    type: 'intro',
    preview: `<div style="background: #EFF6FF; border-left: 3px solid #3B82F6; padding: 4px 6px; border-radius: 0 4px 4px 0;">
      <div style="font-size: 8px; color: #3B82F6; font-weight: bold;">通知</div>
      <div style="height: 2px; background: #93C5FD; width: 50%;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #EFF6FF; border-left: 4px solid #3B82F6; border-radius: 0 8px 8px 0; padding: 18px 20px; box-shadow: 0 2px 6px rgba(59,130,246,0.08);">
		<section style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="display: block;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#3B82F6"/></svg>
			<span style="font-size: 13px; color: #2563EB; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">校园通知</span>
		</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1E3A5F; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #1E3A5F; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_youth_quote',
    name: '青春语录',
    type: 'intro',
    preview: `<div style="background: linear-gradient(135deg, #DBEAFE, #E0E7FF); border-radius: 8px; padding: 4px; text-align: center;">
      <div style="font-size: 14px; color: #818CF8;">&#10022;</div>
      <div style="height: 2px; background: #818CF8; width: 40%; margin: 0 auto;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #DBEAFE, #E0E7FF); border-radius: 16px; padding: 25px 22px; text-align: center; position: relative;">
		<section style="font-size: 32px; color: #818CF8; line-height: 1; margin-bottom: 8px;">&#10022;</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #3730A3; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #3730A3; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
		<section style="width: 40px; height: 2px; background: linear-gradient(90deg, #818CF8, #A5B4FC); margin: 12px auto 0; border-radius: 1px;"></section>
	</section>
</section>`
  },
  {
    id: 'intro_study_tip',
    name: '学习小贴士',
    type: 'intro',
    preview: `<div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 6px; padding: 4px;">
      <div style="display: flex; align-items: center; gap: 3px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="10"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" fill="#F59E0B"/></svg>
        <span style="font-size: 8px; color: #B45309;">学习小贴士</span>
      </div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; overflow: hidden;">
		<section style="background: linear-gradient(90deg, #FDE68A, #FEF3C7); padding: 8px 14px; display: flex; align-items: center; gap: 6px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="display: block;"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" fill="#F59E0B"/></svg>
			<span style="font-size: 13px; color: #92400E; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">学习小贴士</span>
		</section>
		<section style="padding: 18px 20px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #78350F; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #78350F; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_spring_bloom',
    name: '春日花开',
    type: 'intro',
    preview: `<div style="background: #FDF2F8; border-radius: 8px; padding: 4px; text-align: center;">
      <span style="font-size: 10px; color: #EC4899;">&#10047; &#10047; &#10047;</span>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #FDF2F8, #FCE7F3); border-radius: 16px; padding: 22px; position: relative; border: 1px solid #FBCFE8;">
		<section style="text-align: center; margin-bottom: 10px; color: #F9A8D4; font-size: 16px; letter-spacing: 6px;">&#10047; &#10047; &#10047;</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #831843; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #831843; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_campus_news',
    name: '校园快讯',
    type: 'intro',
    preview: `<div style="border: 1px solid #E5E7EB; border-radius: 4px; overflow: hidden;">
      <div style="background: #1F2937; color: white; font-size: 8px; padding: 2px 4px;">快讯</div>
      <div style="padding: 3px; height: 2px; background: #F3F4F6;"></div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
		<section style="background: linear-gradient(90deg, #1F2937, #374151); padding: 8px 16px; display: flex; align-items: center; gap: 8px;">
			<section style="background: #EF4444; color: white; font-size: 11px; padding: 2px 8px; border-radius: 3px; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">快讯</section>
			<span style="font-size: 13px; color: #F9FAFB; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">校园新闻</span>
		</section>
		<section style="padding: 18px 20px; background: #F9FAFB;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1F2937; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #1F2937; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_reading_corner',
    name: '阅读角',
    type: 'intro',
    preview: `<div style="background: #F5F3FF; border: 1px solid #DDD6FE; border-radius: 6px; padding: 4px;">
      <div style="display: flex; align-items: center; gap: 3px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="10"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" fill="#7C3AED"/></svg>
        <span style="font-size: 8px; color: #7C3AED;">阅读角</span>
      </div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #F5F3FF; border: 1px solid #DDD6FE; border-radius: 12px; overflow: hidden;">
		<section style="background: linear-gradient(90deg, #7C3AED, #8B5CF6); padding: 8px 14px; display: flex; align-items: center; gap: 6px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style="display: block;"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" fill="#FFFFFF"/></svg>
			<span style="font-size: 13px; color: #FFFFFF; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">阅读角</span>
		</section>
		<section style="padding: 18px 20px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #4C1D95; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #4C1D95; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_exam_notice',
    name: '考试提醒',
    type: 'intro',
    preview: `<div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 4px; padding: 4px;">
      <div style="font-size: 8px; color: #EF4444; font-weight: bold;">!! 提醒</div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; overflow: hidden;">
		<section style="background: linear-gradient(90deg, #EF4444, #F87171); padding: 8px 14px; display: flex; align-items: center; gap: 6px;">
			<section style="background: #FFFFFF; color: #EF4444; font-size: 12px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">!</section>
			<span style="font-size: 13px; color: #FFFFFF; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">重要提醒</span>
		</section>
		<section style="padding: 18px 20px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #991B1B; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #991B1B; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_growth_green',
    name: '绿色成长',
    type: 'intro',
    preview: `<div style="background: #ECFDF5; border-radius: 8px; padding: 4px; border-left: 3px solid #10B981;">
      <div style="display: flex; align-items: center; gap: 3px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="10" height="10"><path d="M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93A15.46 15.46 0 006.05 8.05zm11.57 3.52c-1.79-.62-3.2-.85-4.17-.85-1.33 0-2.07.31-2.07.31.02.2.03.4.03.6 0 3.37-1.31 6.5-3.48 8.88.57.2 1.17.34 1.79.38C13.76 20.93 17 18.73 18.91 15.4c.55-1.1-.2-3.56-1.29-3.83z" fill="#10B981"/></svg>
        <span style="font-size: 8px; color: #059669;">成长</span>
      </div>
    </div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #ECFDF5, #D1FAE5); border-radius: 16px; padding: 22px; border-left: 4px solid #10B981;">
		<section style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" style="display: block;"><path d="M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93A15.46 15.46 0 006.05 8.05zm11.57 3.52c-1.79-.62-3.2-.85-4.17-.85-1.33 0-2.07.31-2.07.31.02.2.03.4.03.6 0 3.37-1.31 6.5-3.48 8.88.57.2 1.17.34 1.79.38C13.76 20.93 17 18.73 18.91 15.4c.55-1.1-.2-3.56-1.29-3.83z" fill="#10B981"/></svg>
			<span style="font-size: 13px; color: #059669; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">成长感悟</span>
		</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #064E3B; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #064E3B; text-shadow: none; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== SOTA 引言样式（第二轮迭代） ==========
  {
    id: 'intro_dashed_elegant',
    name: '虚线优雅（Grace H3）',
    type: 'intro',
    preview: `<div style="text-align: center; font-size: 9px; color: #666; font-style: italic; border-bottom: 1px dashed #ccc; padding-bottom: 4px;">优雅虚线引言</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0; text-align: center;">
	<section style="display: inline-block; padding: 12px 30px 14px; border-bottom: 1px dashed #999;">
		<section data-autoskip="1" class="135brush" style="text-align: center; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #666; background-color: transparent;">
			<p style="font-size: 14px; line-height: 1.75em; text-align: center; font-style: italic;">
				<span style="font-weight: 400; color: #666; letter-spacing: 2px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_shadow_quote',
    name: '阴影引用框（Grace）',
    type: 'intro',
    preview: `<div style="background: #f9f9f9; box-shadow: 0 2px 6px rgba(0,0,0,0.08); padding: 4px 8px; font-size: 9px; font-style: italic; border-radius: 4px;">阴影引言</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="background: #f9f9f9; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border-radius: 8px; padding: 20px 24px; border-left: 3px solid #ddd;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #555; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify; font-style: italic;" align="justify">
				<span style="font-weight: 400; color: #555; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_gradient_tech',
    name: '科技渐变引言（Tech）',
    type: 'intro',
    preview: `<div style="background: linear-gradient(to right, rgba(3,102,214,0.06), transparent); border-left: 3px solid #0366d6; padding: 4px 8px; font-size: 9px;">科技引言</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="background: linear-gradient(to right, rgba(3,102,214,0.06), transparent); border-left: 4px solid #0366d6; padding: 16px 22px; border-radius: 0 8px 8px 0;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #333; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #333; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_overlay_caption',
    name: '半透明叠加（mdnice）',
    type: 'intro',
    preview: `<div style="background: rgba(0,0,0,0.6); color: white; padding: 4px 8px; font-size: 9px; border-radius: 4px;">叠加引言</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="background: linear-gradient(135deg, #1a1a2e, #16213e); border-radius: 10px; padding: 22px 26px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgba(255,255,255,0.9); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgba(255,255,255,0.9); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== GitHub Alert 风格引言（第三轮迭代） ==========
  {
    id: 'intro_alert_note',
    name: 'Alert NOTE（蓝）',
    type: 'intro',
    preview: `<div style="background: #ddf4ff; border-left: 3px solid #0969da; padding: 4px 8px; font-size: 9px; color: #0969da; border-radius: 0 4px 4px 0;"><strong>Note</strong> 提示</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #ddf4ff; border-left: 4px solid #0969da; border-radius: 0 8px 8px 0; padding: 16px 20px;">
		<section style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style="display: block;"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="#0969da"/></svg>
			<span style="font-size: 14px; color: #0969da; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">Note</span>
		</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1f2328; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #1f2328; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_alert_tip',
    name: 'Alert TIP（绿）',
    type: 'intro',
    preview: `<div style="background: #dafbe1; border-left: 3px solid #1a7f37; padding: 4px 8px; font-size: 9px; color: #1a7f37; border-radius: 0 4px 4px 0;"><strong>Tip</strong> 建议</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #dafbe1; border-left: 4px solid #1a7f37; border-radius: 0 8px 8px 0; padding: 16px 20px;">
		<section style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style="display: block;"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z" fill="#1a7f37"/></svg>
			<span style="font-size: 14px; color: #1a7f37; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">Tip</span>
		</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1f2328; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #1f2328; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_alert_important',
    name: 'Alert IMPORTANT（紫）',
    type: 'intro',
    preview: `<div style="background: #fbefff; border-left: 3px solid #8250df; padding: 4px 8px; font-size: 9px; color: #8250df; border-radius: 0 4px 4px 0;"><strong>Important</strong> 重要</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #fbefff; border-left: 4px solid #8250df; border-radius: 0 8px 8px 0; padding: 16px 20px;">
		<section style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style="display: block;"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill="#8250df"/></svg>
			<span style="font-size: 14px; color: #8250df; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">Important</span>
		</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1f2328; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #1f2328; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_alert_warning',
    name: 'Alert WARNING（黄）',
    type: 'intro',
    preview: `<div style="background: #fff8c5; border-left: 3px solid #bf8700; padding: 4px 8px; font-size: 9px; color: #bf8700; border-radius: 0 4px 4px 0;"><strong>Warning</strong> 注意</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #fff8c5; border-left: 4px solid #bf8700; border-radius: 0 8px 8px 0; padding: 16px 20px;">
		<section style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style="display: block;"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" fill="#bf8700"/></svg>
			<span style="font-size: 14px; color: #bf8700; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">Warning</span>
		</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1f2328; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #1f2328; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_alert_caution',
    name: 'Alert CAUTION（红）',
    type: 'intro',
    preview: `<div style="background: #ffebe9; border-left: 3px solid #d1242f; padding: 4px 8px; font-size: 9px; color: #d1242f; border-radius: 0 4px 4px 0;"><strong>Caution</strong> 警告</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #ffebe9; border-left: 4px solid #d1242f; border-radius: 0 8px 8px 0; padding: 16px 20px;">
		<section style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" style="display: block;"><path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" fill="#d1242f"/></svg>
			<span style="font-size: 14px; color: #d1242f; font-weight: bold; font-family: 微软雅黑, Microsoft YaHei;">Caution</span>
		</section>
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #1f2328; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #1f2328; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== 杂志/复古/极光/霓虹引言（第四轮迭代） ==========
  {
    id: 'intro_magazine_pullquote',
    name: '杂志拉引',
    type: 'intro',
    preview: `<div style="border-left: 3px solid #e74c3c; padding-left: 6px; font-family: Georgia, serif; font-style: italic; font-size: 9px; color: #555;">"引言..."</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 25px 0;">
	<section style="border-left: 4px solid #e74c3c; padding: 2px 0 2px 24px; margin: 0 20px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.6em; letter-spacing: 0.5px; font-size: 16px; color: #555555; background-color: transparent;">
			<p style="font-size: 16px; text-indent: 0; line-height: 1.6em; text-align: justify; font-style: italic;" align="justify">
				<span style="font-weight: 400; color: #555555; letter-spacing: 0.5px; font-size: 16px; font-style: italic; font-family: Georgia, 'Times New Roman', '宋体', SimSun, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_retro_sepia',
    name: '复古旧纸引言',
    type: 'intro',
    preview: `<div style="background: #f4e8d0; border: 1px solid #c4b8a0; padding: 4px 8px; font-size: 9px; color: #5a4a3a; font-family: Georgia, serif;">旧纸张</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #f4e8d0 0%, #efe0c8 100%); border: 1px solid #c4b8a0; border-radius: 4px; padding: 18px 22px; box-shadow: 2px 2px 8px rgba(0,0,0,0.08);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 0.5px; font-size: 14px; color: #5a4a3a; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #5a4a3a; letter-spacing: 0.5px; font-size: 14px; font-family: Georgia, '宋体', SimSun, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_aurora_card',
    name: '极光卡片引言',
    type: 'intro',
    preview: `<div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 6px; padding: 4px 8px; font-size: 9px; color: white;">极光引言</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #6d327c 0%, #485DA6 30%, #00a1ba 60%, #00BF98 80%, #36C486 100%); border-radius: 10px; padding: 20px 24px; box-shadow: 0 4px 15px rgba(72,93,166,0.25);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgba(255,255,255,0.95); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgba(255,255,255,0.95); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_synthwave_neon',
    name: '赛博霓虹引言',
    type: 'intro',
    preview: `<div style="background: #0f0c29; border: 1px solid rgba(255,0,110,0.3); padding: 4px 8px; font-size: 9px; color: #00f5ff; border-radius: 4px;">NEON</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); border: 1px solid rgba(0,245,255,0.2); border-radius: 8px; padding: 20px 24px; box-shadow: 0 0 20px rgba(0,245,255,0.08);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #00f5ff; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #00f5ff; letter-spacing: 1.75px; font-size: 14px; font-family: 'Courier New', Consolas, monospace; text-shadow: 0 0 8px rgba(0,245,255,0.4);">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== 粘土/粗野派/禅意/全息引言（第五轮迭代） ==========
  {
    id: 'intro_clay_callout',
    name: '粘土引言',
    type: 'intro',
    preview: `<div style="background: #e0e5ec; border-radius: 8px; padding: 4px 8px; box-shadow: 3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.4); font-size: 9px; color: #37597d;">Clay</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #e0e5ec; border-radius: 16px; padding: 18px 22px; box-shadow: 6px 6px 12px rgba(163,177,198,0.6), -6px -6px 12px rgba(255,255,255,0.5), inset 1px 1px 2px rgba(255,255,255,0.2);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #37597d; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #37597d; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_brutalist_accent',
    name: '粗野派引言',
    type: 'intro',
    preview: `<div style="background: #ff0000; color: #fff; border: none; box-shadow: 4px 4px 0 #000; padding: 4px 8px; font-size: 9px; font-family: Courier New, monospace; font-weight: bold;">ALERT</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #ff0000; box-shadow: 8px 8px 0 #000000; padding: 18px 22px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1px; font-size: 14px; color: #ffffff; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 700; color: #ffffff; letter-spacing: 1px; font-size: 14px; font-family: 'Courier New', Consolas, monospace;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_wabi_sabi_zen',
    name: '禅意引言',
    type: 'intro',
    preview: `<div style="background: #faf8f3; padding: 4px 8px; border-bottom: 1px solid #d4cfc0; font-size: 9px; color: #8b7e74; font-style: italic;">禅</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(180deg, #faf8f3 0%, #f5f5f0 100%); padding: 24px 26px; border-top: 1px solid #d4cfc0; border-bottom: 1px solid #d4cfc0;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.85em; letter-spacing: 0.5px; font-size: 14px; color: #5a5a5a; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2em; line-height: 1.85em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #5a5a5a; letter-spacing: 0.5px; font-size: 14px; font-family: '宋体', SimSun, Georgia, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_holographic_card',
    name: '全息引言',
    type: 'intro',
    preview: `<div style="background: linear-gradient(135deg, #667eea, #f093fb, #4facfe); border-radius: 6px; padding: 4px 8px; font-size: 9px; color: #fff;">Holo</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%); border-radius: 12px; padding: 20px 24px; box-shadow: 0 4px 15px rgba(102,126,234,0.25);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: rgba(255,255,255,0.95); background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: rgba(255,255,255,0.95); letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  // ========== 黑板/水彩/装饰艺术/票券引言（第六轮迭代） ==========
  {
    id: 'intro_chalkboard',
    name: '黑板粉笔引言',
    type: 'intro',
    preview: `<div style="background: #2d3436; border: 2px solid #5d4e37; padding: 4px 8px; font-size: 9px; color: #fdcb6e; font-family: Courier New, monospace;">粉笔</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #2d3436; border: 4px solid #5d4e37; border-radius: 4px; padding: 18px 22px; box-shadow: inset 0 0 15px rgba(0,0,0,0.4);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #fdcb6e; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #fdcb6e; letter-spacing: 1.5px; font-size: 14px; font-family: 'Courier New', Consolas, monospace; text-shadow: 1px 1px 2px rgba(253,203,110,0.2);">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_watercolor_wash',
    name: '水彩晕染引言',
    type: 'intro',
    preview: `<div style="background: linear-gradient(135deg, rgba(249,213,229,0.6), rgba(168,218,220,0.6)); padding: 4px 8px; border-radius: 12px; font-size: 9px; color: #666;">水彩引言</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, rgba(249,213,229,0.5) 0%, rgba(168,218,220,0.5) 50%, rgba(212,181,211,0.4) 100%); border-radius: 20px; padding: 20px 24px; box-shadow: 0 4px 15px rgba(249,213,229,0.3), inset 0 -2px 6px rgba(255,255,255,0.4);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #666666; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #666666; letter-spacing: 1.75px; font-size: 14px; font-family: 微软雅黑, &quot;Microsoft YaHei&quot;, SimHei, STHeiti;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_art_deco_gold',
    name: '装饰艺术金色引言',
    type: 'intro',
    preview: `<div style="background: #001f3f; border: 1px double #d4af37; padding: 4px 8px; font-size: 9px; color: #d4af37;">Deco</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: linear-gradient(135deg, #001f3f 0%, #003459 100%); border: 2px double #d4af37; padding: 18px 22px;">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #f5e6d3; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #f5e6d3; letter-spacing: 1.75px; font-size: 14px; font-family: Georgia, 'Times New Roman', '宋体', SimSun, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_ticket_stub',
    name: '票根引言',
    type: 'intro',
    preview: `<div style="background: #fef9e7; border: 2px dotted #c4b08a; padding: 4px 8px; border-radius: 8px; font-size: 9px; color: #4a3c27;">票根</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background: #fef9e7; border: 3px dotted #c4b08a; border-radius: 12px; padding: 18px 22px; box-shadow: 0 2px 8px rgba(196,176,138,0.2);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #4a3c27; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #4a3c27; letter-spacing: 1.75px; font-size: 14px; font-family: Georgia, '宋体', SimSun, serif;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_blueprint',
    name: '蓝图工程引言',
    type: 'intro',
    preview: `<div style="background: #0A2540; border: 1px dashed #00D9FF; padding: 4px 8px; font-size: 9px; color: #00D9FF; font-family: monospace;">蓝图</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background-color: #0A2540; background-image: linear-gradient(rgba(30,73,118,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(30,73,118,0.35) 1px, transparent 1px); background-size: 20px 20px; border: 2px solid #00D9FF; padding: 18px 22px; box-shadow: 0 0 12px rgba(0,217,255,0.15);">
		<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #FFFFFF; background-color: transparent;">
			<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
				<span style="font-weight: 400; color: #e0f0ff; letter-spacing: 1.75px; font-size: 14px; font-family: Courier New, Consolas, monospace;">{{CONTENT}}</span>
			</p>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_postage',
    name: '邮票引言',
    type: 'intro',
    preview: `<div style="background: #FFF8DC; border: 2px solid #DC143C; padding: 4px 8px; font-size: 9px; color: #2C1810;">邮票</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="display: inline-block; background: radial-gradient(circle at 5px 5px, transparent 3px, #DC143C 3px); background-size: 10px 10px; background-position: -5px -5px; padding: 7px;">
		<section style="background-color: #FFF8DC; border: 2px solid #DC143C; padding: 18px 22px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #2C1810; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #2C1810; letter-spacing: 1.75px; font-size: 14px; font-family: Georgia, '华文楷体', STKaiti, serif;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_envelope',
    name: '信封引言',
    type: 'intro',
    preview: `<div style="background: #FFF8E7; border-top: 4px solid; border-image: repeating-linear-gradient(90deg, #DC143C 0px, #DC143C 8px, #fff 8px, #fff 12px, #1E3A8A 12px, #1E3A8A 20px) 4; padding: 4px 8px; font-size: 9px; color: #3C2F1F;">信封</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background-color: #E8DCC4; padding: 6px; border-radius: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
		<section style="border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-image: repeating-linear-gradient(90deg, #DC143C 0px, #DC143C 8px, #FFFFFF 8px, #FFFFFF 14px, #1E3A8A 14px, #1E3A8A 22px, #FFFFFF 22px, #FFFFFF 28px) 6; padding: 16px 20px; background-color: #FFF8E7;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #3C2F1F; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: 400; color: #3C2F1F; letter-spacing: 1.75px; font-size: 14px; font-family: Georgia, '华文楷体', STKaiti, cursive;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  },
  {
    id: 'intro_woodblock',
    name: '木刻版画引言',
    type: 'intro',
    preview: `<div style="background: #1A1A1A; border: 2px solid #F4E8D0; padding: 4px 8px; font-size: 9px; color: #F4E8D0; font-weight: bold;">木刻</div>`,
    fullExample: `<section class="_135editor" data-role="paragraph" style="margin: 20px 0;">
	<section style="background-color: #F4E8D0; background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,69,19,0.03) 2px, rgba(139,69,19,0.03) 4px); padding: 6px; border: 4px solid #8B4513; box-shadow: 0 5px 10px rgba(0,0,0,0.2);">
		<section style="background-color: #1A1A1A; border: 2px solid #FFFFFF; padding: 18px 22px;">
			<section data-autoskip="1" class="135brush" style="text-align: justify; line-height: 1.75em; letter-spacing: 1.5px; font-size: 14px; color: #F4E8D0; background-color: transparent;">
				<p style="font-size: 14px; text-indent: 2.25em; line-height: 1.75em; text-align: justify;" align="justify">
					<span style="font-weight: bold; color: #F4E8D0; letter-spacing: 1.75px; font-size: 14px; font-family: Impact, '黑体', SimHei, sans-serif;">{{CONTENT}}</span>
				</p>
			</section>
		</section>
	</section>
</section>`
  }
]
