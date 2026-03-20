/**
 * Manifold Image-Driven SVG Templates
 *
 * 6 categories × 6 variants = 36 templates
 * Each template includes imageSlots metadata and data-image-slot attributes
 * All interactions use SMIL only (WeChat compatible, no JS)
 *
 * Categories:
 * 1. click_expand_image  - 点击展开大图
 * 2. tab_switch_image    - 标签页切换图片
 * 3. before_after_image  - 前后对比滑块
 * 4. image_sequence      - 多图序列翻页
 * 5. grid_zoom_image     - 网格点击放大
 * 6. card_flip_image     - 卡牌翻转揭秘
 */

// ============================================================
// Category 1: click_expand_image — 点击展开大图
// ============================================================

export const SVG_CLICK_EXPAND_IMAGE = [
  {
    id: 'click_expand_single_v',
    name: '单图竖展开',
    category: 'click_expand_image',
    tags: ['展开', '图片', '点击', 'GQ风格', '竖版'],
    colorScheme: '#1a1a2e',
    interactive: true,
    interactionType: 'click_expand_image',
    source: 'manifold',
    imageSlots: [
      { id: 'main_image', label: '主图', width: 560, height: 400 }
    ],
    svg: `<svg viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <clipPath id="cev_clip"><rect x="20" y="80" width="560" height="0"><animate attributeName="height" from="0" to="400" begin="cev_trigger.click" dur="0.5s" fill="freeze"/></rect></clipPath>
  </defs>
  <rect width="600" height="520" rx="12" fill="#1a1a2e"/>
  <text x="300" y="45" text-anchor="middle" fill="#e0e0e0" font-size="16" font-family="sans-serif" font-weight="600">点击查看大图</text>
  <rect id="cev_trigger" x="20" y="50" width="560" height="30" fill="transparent" cursor="pointer"/>
  <line x1="200" y1="60" x2="400" y2="60" stroke="#667EEA" stroke-width="2" opacity="0.6"/>
  <polygon points="290,65 310,65 300,72" fill="#667EEA" opacity="0.8">
    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
  </polygon>
  <g clip-path="url(#cev_clip)">
    <rect x="20" y="80" width="560" height="400" rx="8" fill="#2a2a4a"/>
    <image data-image-slot="main_image" href="placeholder" x="20" y="80" width="560" height="400" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <text x="300" y="505" text-anchor="middle" fill="#888" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'click_expand_single_h',
    name: '单图横展开',
    category: 'click_expand_image',
    tags: ['展开', '图片', '点击', '横版'],
    colorScheme: '#16213e',
    interactive: true,
    interactionType: 'click_expand_image',
    source: 'manifold',
    imageSlots: [
      { id: 'main_image', label: '主图', width: 560, height: 320 }
    ],
    svg: `<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <clipPath id="ceh_clip"><rect x="20" y="70" width="0" height="320"><animate attributeName="width" from="0" to="560" begin="ceh_trigger.click" dur="0.6s" fill="freeze"/></rect></clipPath>
  </defs>
  <rect width="600" height="420" rx="12" fill="#16213e"/>
  <rect id="ceh_trigger" x="240" y="200" width="120" height="40" rx="20" fill="#667EEA" cursor="pointer" opacity="0.9">
    <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
  </rect>
  <text x="300" y="225" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">展开查看</text>
  <g clip-path="url(#ceh_clip)">
    <rect x="20" y="70" width="560" height="320" rx="8" fill="#1e1e3a"/>
    <image data-image-slot="main_image" href="placeholder" x="20" y="70" width="560" height="320" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <text x="300" y="410" text-anchor="middle" fill="#888" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'click_expand_multi_seq',
    name: '多图顺序展开',
    category: 'click_expand_image',
    tags: ['展开', '多图', '顺序', '序列'],
    colorScheme: '#0f3460',
    interactive: true,
    interactionType: 'click_expand_image',
    source: 'manifold',
    imageSlots: [
      { id: 'img1', label: '图片1', width: 560, height: 180 },
      { id: 'img2', label: '图片2', width: 560, height: 180 },
      { id: 'img3', label: '图片3', width: 560, height: 180 }
    ],
    svg: `<svg viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <clipPath id="cem1_c"><rect x="20" y="60" width="560" height="0"><animate attributeName="height" from="0" to="180" begin="cem1_t.click" dur="0.4s" fill="freeze"/></rect></clipPath>
    <clipPath id="cem2_c"><rect x="20" y="270" width="560" height="0"><animate attributeName="height" from="0" to="180" begin="cem2_t.click" dur="0.4s" fill="freeze"/></rect></clipPath>
    <clipPath id="cem3_c"><rect x="20" y="480" width="560" height="0"><animate attributeName="height" from="0" to="180" begin="cem3_t.click" dur="0.4s" fill="freeze"/></rect></clipPath>
  </defs>
  <rect width="600" height="700" rx="12" fill="#0f3460"/>
  <rect id="cem1_t" x="20" y="30" width="560" height="28" rx="4" fill="#1a1a4e" cursor="pointer"/>
  <text x="300" y="50" text-anchor="middle" fill="#ccc" font-size="13" font-family="sans-serif">图片 1 — 点击展开</text>
  <g clip-path="url(#cem1_c)"><image data-image-slot="img1" href="placeholder" x="20" y="60" width="560" height="180" preserveAspectRatio="xMidYMid slice"/></g>
  <rect id="cem2_t" x="20" y="240" width="560" height="28" rx="4" fill="#1a1a4e" cursor="pointer"/>
  <text x="300" y="260" text-anchor="middle" fill="#ccc" font-size="13" font-family="sans-serif">图片 2 — 点击展开</text>
  <g clip-path="url(#cem2_c)"><image data-image-slot="img2" href="placeholder" x="20" y="270" width="560" height="180" preserveAspectRatio="xMidYMid slice"/></g>
  <rect id="cem3_t" x="20" y="450" width="560" height="28" rx="4" fill="#1a1a4e" cursor="pointer"/>
  <text x="300" y="470" text-anchor="middle" fill="#ccc" font-size="13" font-family="sans-serif">图片 3 — 点击展开</text>
  <g clip-path="url(#cem3_c)"><image data-image-slot="img3" href="placeholder" x="20" y="480" width="560" height="180" preserveAspectRatio="xMidYMid slice"/></g>
  <text x="300" y="690" text-anchor="middle" fill="#888" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'click_expand_accordion',
    name: '手风琴展开',
    category: 'click_expand_image',
    tags: ['手风琴', '展开', '交互', '多图'],
    colorScheme: '#533483',
    interactive: true,
    interactionType: 'click_expand_image',
    source: 'manifold',
    imageSlots: [
      { id: 'acc1', label: '面板1', width: 560, height: 160 },
      { id: 'acc2', label: '面板2', width: 560, height: 160 },
      { id: 'acc3', label: '面板3', width: 560, height: 160 },
      { id: 'acc4', label: '面板4', width: 560, height: 160 }
    ],
    svg: `<svg viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <clipPath id="acc1c"><rect x="20" y="60" width="560" height="0"><animate attributeName="height" from="0" to="160" begin="acc1t.click" dur="0.35s" fill="freeze"/></rect></clipPath>
    <clipPath id="acc2c"><rect x="20" y="260" width="560" height="0"><animate attributeName="height" from="0" to="160" begin="acc2t.click" dur="0.35s" fill="freeze"/></rect></clipPath>
    <clipPath id="acc3c"><rect x="20" y="460" width="560" height="0"><animate attributeName="height" from="0" to="160" begin="acc3t.click" dur="0.35s" fill="freeze"/></rect></clipPath>
    <clipPath id="acc4c"><rect x="20" y="660" width="560" height="0"><animate attributeName="height" from="0" to="160" begin="acc4t.click" dur="0.35s" fill="freeze"/></rect></clipPath>
  </defs>
  <rect width="600" height="800" rx="12" fill="#1a1030"/>
  <g id="acc1t" cursor="pointer"><rect x="20" y="28" width="560" height="30" rx="6" fill="#533483"/><text x="50" y="49" fill="#fff" font-size="14" font-family="sans-serif">01 — 点击展开</text><polygon points="556,38 548,34 548,42" fill="#fff"/></g>
  <g clip-path="url(#acc1c)"><image data-image-slot="acc1" href="placeholder" x="20" y="60" width="560" height="160" preserveAspectRatio="xMidYMid slice"/></g>
  <g id="acc2t" cursor="pointer"><rect x="20" y="228" width="560" height="30" rx="6" fill="#533483"/><text x="50" y="249" fill="#fff" font-size="14" font-family="sans-serif">02 — 点击展开</text><polygon points="556,238 548,234 548,242" fill="#fff"/></g>
  <g clip-path="url(#acc2c)"><image data-image-slot="acc2" href="placeholder" x="20" y="260" width="560" height="160" preserveAspectRatio="xMidYMid slice"/></g>
  <g id="acc3t" cursor="pointer"><rect x="20" y="428" width="560" height="30" rx="6" fill="#533483"/><text x="50" y="449" fill="#fff" font-size="14" font-family="sans-serif">03 — 点击展开</text><polygon points="556,438 548,434 548,442" fill="#fff"/></g>
  <g clip-path="url(#acc3c)"><image data-image-slot="acc3" href="placeholder" x="20" y="460" width="560" height="160" preserveAspectRatio="xMidYMid slice"/></g>
  <g id="acc4t" cursor="pointer"><rect x="20" y="628" width="560" height="30" rx="6" fill="#533483"/><text x="50" y="649" fill="#fff" font-size="14" font-family="sans-serif">04 — 点击展开</text><polygon points="556,638 548,634 548,642" fill="#fff"/></g>
  <g clip-path="url(#acc4c)"><image data-image-slot="acc4" href="placeholder" x="20" y="660" width="560" height="160" preserveAspectRatio="xMidYMid slice"/></g>
  <text x="300" y="790" text-anchor="middle" fill="#888" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'click_expand_titled',
    name: '标题展开卡片',
    category: 'click_expand_image',
    tags: ['展开', '标题', '卡片', '优雅'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click_expand_image',
    source: 'manifold',
    imageSlots: [
      { id: 'hero', label: '封面图', width: 520, height: 300 }
    ],
    svg: `<svg viewBox="0 0 600 460" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <clipPath id="cet_clip"><rect x="40" y="120" width="520" height="0"><animate attributeName="height" from="0" to="300" begin="cet_btn.click" dur="0.5s" fill="freeze"/></rect></clipPath>
  </defs>
  <rect width="600" height="460" rx="16" fill="#ecf0f1"/>
  <rect x="40" y="20" width="520" height="80" rx="8" fill="#2c3e50"/>
  <text x="300" y="55" text-anchor="middle" fill="#ecf0f1" font-size="20" font-family="serif" font-weight="700">探索更多</text>
  <text x="300" y="78" text-anchor="middle" fill="#95a5a6" font-size="12" font-family="sans-serif">DISCOVER MORE</text>
  <g id="cet_btn" cursor="pointer">
    <rect x="250" y="105" width="100" height="24" rx="12" fill="#3498db"/>
    <text x="300" y="121" text-anchor="middle" fill="#fff" font-size="11" font-family="sans-serif">展开图片</text>
  </g>
  <g clip-path="url(#cet_clip)">
    <rect x="40" y="120" width="520" height="300" rx="8" fill="#bdc3c7"/>
    <image data-image-slot="hero" href="placeholder" x="40" y="120" width="520" height="300" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <text x="300" y="448" text-anchor="middle" fill="#95a5a6" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'click_expand_fade',
    name: '淡入展开',
    category: 'click_expand_image',
    tags: ['淡入', '展开', '渐变', '优雅'],
    colorScheme: '#2d1b69',
    interactive: true,
    interactionType: 'click_expand_image',
    source: 'manifold',
    imageSlots: [
      { id: 'fade_img', label: '展示图', width: 540, height: 360 }
    ],
    svg: `<svg viewBox="0 0 600 460" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <linearGradient id="cef_grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#667EEA"/><stop offset="100%" stop-color="#764ba2"/></linearGradient>
  </defs>
  <rect width="600" height="460" rx="12" fill="#0d0d1a"/>
  <rect x="30" y="60" width="540" height="360" rx="10" fill="#1a1a2e"/>
  <g opacity="0">
    <animate attributeName="opacity" from="0" to="1" begin="cef_trigger.click" dur="0.8s" fill="freeze"/>
    <image data-image-slot="fade_img" href="placeholder" x="30" y="60" width="540" height="360" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g id="cef_trigger" cursor="pointer" opacity="1">
    <animate attributeName="opacity" from="1" to="0" begin="cef_trigger.click" dur="0.3s" fill="freeze"/>
    <rect x="30" y="60" width="540" height="360" rx="10" fill="url(#cef_grad)" opacity="0.3"/>
    <circle cx="300" cy="240" r="40" fill="none" stroke="#fff" stroke-width="2" opacity="0.8"/>
    <polygon points="290,225 290,255 315,240" fill="#fff" opacity="0.8"/>
    <text x="300" y="300" text-anchor="middle" fill="#fff" font-size="14" font-family="sans-serif" opacity="0.9">点击揭晓</text>
  </g>
  <text x="300" y="448" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  }
]

// ============================================================
// Category 2: tab_switch_image — 标签页切换图片
// ============================================================

export const SVG_TAB_SWITCH_IMAGE = [
  {
    id: 'tab_switch_3h',
    name: '三标签横排',
    category: 'tab_switch_image',
    tags: ['标签', '切换', '三图', '横排'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'tab_switch_image',
    source: 'manifold',
    imageSlots: [
      { id: 'tab1', label: '标签1图片', width: 540, height: 340 },
      { id: 'tab2', label: '标签2图片', width: 540, height: 340 },
      { id: 'tab3', label: '标签3图片', width: 540, height: 340 }
    ],
    svg: `<svg viewBox="0 0 600 460" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="460" rx="12" fill="#f8f9fa"/>
  <g id="ts3h_t1" cursor="pointer"><rect x="30" y="15" width="170" height="36" rx="18" fill="#2c3e50"/><text x="115" y="38" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">标签 1</text></g>
  <g id="ts3h_t2" cursor="pointer"><rect x="215" y="15" width="170" height="36" rx="18" fill="#95a5a6"/><text x="300" y="38" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">标签 2</text></g>
  <g id="ts3h_t3" cursor="pointer"><rect x="400" y="15" width="170" height="36" rx="18" fill="#95a5a6"/><text x="485" y="38" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">标签 3</text></g>
  <rect x="30" y="65" width="540" height="340" rx="8" fill="#e0e0e0"/>
  <image data-image-slot="tab1" href="placeholder" x="30" y="65" width="540" height="340" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="ts3h_t1.click"/>
    <set attributeName="visibility" to="hidden" begin="ts3h_t2.click"/>
    <set attributeName="visibility" to="hidden" begin="ts3h_t3.click"/>
  </image>
  <image data-image-slot="tab2" href="placeholder" x="30" y="65" width="540" height="340" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="ts3h_t1.click"/>
    <set attributeName="visibility" to="visible" begin="ts3h_t2.click"/>
    <set attributeName="visibility" to="hidden" begin="ts3h_t3.click"/>
  </image>
  <image data-image-slot="tab3" href="placeholder" x="30" y="65" width="540" height="340" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="ts3h_t1.click"/>
    <set attributeName="visibility" to="hidden" begin="ts3h_t2.click"/>
    <set attributeName="visibility" to="visible" begin="ts3h_t3.click"/>
  </image>
  <text x="300" y="450" text-anchor="middle" fill="#aaa" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'tab_switch_4h',
    name: '四标签横排',
    category: 'tab_switch_image',
    tags: ['标签', '切换', '四图', '横排'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'tab_switch_image',
    source: 'manifold',
    imageSlots: [
      { id: 'tab1', label: '标签1', width: 540, height: 320 },
      { id: 'tab2', label: '标签2', width: 540, height: 320 },
      { id: 'tab3', label: '标签3', width: 540, height: 320 },
      { id: 'tab4', label: '标签4', width: 540, height: 320 }
    ],
    svg: `<svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="450" rx="12" fill="#1a1a2e"/>
  <g id="ts4_t1" cursor="pointer"><rect x="20" y="12" width="132" height="32" rx="6" fill="#1abc9c"/><text x="86" y="33" text-anchor="middle" fill="#fff" font-size="12" font-family="sans-serif">Tab 1</text></g>
  <g id="ts4_t2" cursor="pointer"><rect x="162" y="12" width="132" height="32" rx="6" fill="#34495e"/><text x="228" y="33" text-anchor="middle" fill="#aaa" font-size="12" font-family="sans-serif">Tab 2</text></g>
  <g id="ts4_t3" cursor="pointer"><rect x="304" y="12" width="132" height="32" rx="6" fill="#34495e"/><text x="370" y="33" text-anchor="middle" fill="#aaa" font-size="12" font-family="sans-serif">Tab 3</text></g>
  <g id="ts4_t4" cursor="pointer"><rect x="446" y="12" width="132" height="32" rx="6" fill="#34495e"/><text x="512" y="33" text-anchor="middle" fill="#aaa" font-size="12" font-family="sans-serif">Tab 4</text></g>
  <rect x="20" y="56" width="560" height="6" rx="3" fill="#34495e"/>
  <rect x="30" y="75" width="540" height="320" rx="8" fill="#2a2a4a"/>
  <image data-image-slot="tab1" href="placeholder" x="30" y="75" width="540" height="320" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="ts4_t1.click"/><set attributeName="visibility" to="hidden" begin="ts4_t2.click"/><set attributeName="visibility" to="hidden" begin="ts4_t3.click"/><set attributeName="visibility" to="hidden" begin="ts4_t4.click"/>
  </image>
  <image data-image-slot="tab2" href="placeholder" x="30" y="75" width="540" height="320" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="ts4_t1.click"/><set attributeName="visibility" to="visible" begin="ts4_t2.click"/><set attributeName="visibility" to="hidden" begin="ts4_t3.click"/><set attributeName="visibility" to="hidden" begin="ts4_t4.click"/>
  </image>
  <image data-image-slot="tab3" href="placeholder" x="30" y="75" width="540" height="320" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="ts4_t1.click"/><set attributeName="visibility" to="hidden" begin="ts4_t2.click"/><set attributeName="visibility" to="visible" begin="ts4_t3.click"/><set attributeName="visibility" to="hidden" begin="ts4_t4.click"/>
  </image>
  <image data-image-slot="tab4" href="placeholder" x="30" y="75" width="540" height="320" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="ts4_t1.click"/><set attributeName="visibility" to="hidden" begin="ts4_t2.click"/><set attributeName="visibility" to="hidden" begin="ts4_t3.click"/><set attributeName="visibility" to="visible" begin="ts4_t4.click"/>
  </image>
  <text x="300" y="440" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'tab_switch_side',
    name: '侧边标签切换',
    category: 'tab_switch_image',
    tags: ['标签', '侧边', '竖排', '切换'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'tab_switch_image',
    source: 'manifold',
    imageSlots: [
      { id: 'side1', label: '左侧1', width: 460, height: 380 },
      { id: 'side2', label: '左侧2', width: 460, height: 380 },
      { id: 'side3', label: '左侧3', width: 460, height: 380 }
    ],
    svg: `<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="420" rx="12" fill="#1a1a1a"/>
  <g id="tss_t1" cursor="pointer"><rect x="15" y="20" width="90" height="110" rx="8" fill="#e74c3c"/><text x="60" y="80" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif" writing-mode="tb">标签 1</text></g>
  <g id="tss_t2" cursor="pointer"><rect x="15" y="145" width="90" height="110" rx="8" fill="#444"/><text x="60" y="205" text-anchor="middle" fill="#aaa" font-size="13" font-family="sans-serif" writing-mode="tb">标签 2</text></g>
  <g id="tss_t3" cursor="pointer"><rect x="15" y="270" width="90" height="110" rx="8" fill="#444"/><text x="60" y="330" text-anchor="middle" fill="#aaa" font-size="13" font-family="sans-serif" writing-mode="tb">标签 3</text></g>
  <rect x="120" y="20" width="460" height="380" rx="8" fill="#2a2a2a"/>
  <image data-image-slot="side1" href="placeholder" x="120" y="20" width="460" height="380" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="tss_t1.click"/><set attributeName="visibility" to="hidden" begin="tss_t2.click"/><set attributeName="visibility" to="hidden" begin="tss_t3.click"/>
  </image>
  <image data-image-slot="side2" href="placeholder" x="120" y="20" width="460" height="380" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="tss_t1.click"/><set attributeName="visibility" to="visible" begin="tss_t2.click"/><set attributeName="visibility" to="hidden" begin="tss_t3.click"/>
  </image>
  <image data-image-slot="side3" href="placeholder" x="120" y="20" width="460" height="380" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="tss_t1.click"/><set attributeName="visibility" to="hidden" begin="tss_t2.click"/><set attributeName="visibility" to="visible" begin="tss_t3.click"/>
  </image>
  <text x="350" y="412" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'tab_switch_circle',
    name: '圆形图标切换',
    category: 'tab_switch_image',
    tags: ['标签', '圆形', '图标', '切换'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'tab_switch_image',
    source: 'manifold',
    imageSlots: [
      { id: 'circ1', label: '图标1内容', width: 520, height: 320 },
      { id: 'circ2', label: '图标2内容', width: 520, height: 320 },
      { id: 'circ3', label: '图标3内容', width: 520, height: 320 }
    ],
    svg: `<svg viewBox="0 0 600 440" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="440" rx="12" fill="#f5f0ff"/>
  <g id="tsc_t1" cursor="pointer"><circle cx="200" cy="35" r="22" fill="#8e44ad"/><text x="200" y="40" text-anchor="middle" fill="#fff" font-size="16" font-family="sans-serif">A</text></g>
  <g id="tsc_t2" cursor="pointer"><circle cx="300" cy="35" r="22" fill="#bbb"/><text x="300" y="40" text-anchor="middle" fill="#fff" font-size="16" font-family="sans-serif">B</text></g>
  <g id="tsc_t3" cursor="pointer"><circle cx="400" cy="35" r="22" fill="#bbb"/><text x="400" y="40" text-anchor="middle" fill="#fff" font-size="16" font-family="sans-serif">C</text></g>
  <rect x="40" y="75" width="520" height="320" rx="10" fill="#e8e0f0"/>
  <image data-image-slot="circ1" href="placeholder" x="40" y="75" width="520" height="320" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="tsc_t1.click"/><set attributeName="visibility" to="hidden" begin="tsc_t2.click"/><set attributeName="visibility" to="hidden" begin="tsc_t3.click"/>
  </image>
  <image data-image-slot="circ2" href="placeholder" x="40" y="75" width="520" height="320" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="tsc_t1.click"/><set attributeName="visibility" to="visible" begin="tsc_t2.click"/><set attributeName="visibility" to="hidden" begin="tsc_t3.click"/>
  </image>
  <image data-image-slot="circ3" href="placeholder" x="40" y="75" width="520" height="320" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="tsc_t1.click"/><set attributeName="visibility" to="hidden" begin="tsc_t2.click"/><set attributeName="visibility" to="visible" begin="tsc_t3.click"/>
  </image>
  <text x="300" y="432" text-anchor="middle" fill="#aaa" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'tab_switch_gradient',
    name: '渐变标签切换',
    category: 'tab_switch_image',
    tags: ['标签', '渐变', '切换', '现代'],
    colorScheme: '#667EEA',
    interactive: true,
    interactionType: 'tab_switch_image',
    source: 'manifold',
    imageSlots: [
      { id: 'grad1', label: '渐变1', width: 540, height: 330 },
      { id: 'grad2', label: '渐变2', width: 540, height: 330 },
      { id: 'grad3', label: '渐变3', width: 540, height: 330 }
    ],
    svg: `<svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <linearGradient id="tsg_g1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#667EEA"/><stop offset="100%" stop-color="#764ba2"/></linearGradient>
    <linearGradient id="tsg_g2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f093fb"/><stop offset="100%" stop-color="#f5576c"/></linearGradient>
    <linearGradient id="tsg_g3" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4facfe"/><stop offset="100%" stop-color="#00f2fe"/></linearGradient>
  </defs>
  <rect width="600" height="450" rx="12" fill="#0d0d1a"/>
  <g id="tsg_t1" cursor="pointer"><rect x="30" y="15" width="170" height="34" rx="17" fill="url(#tsg_g1)"/><text x="115" y="37" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">主题 A</text></g>
  <g id="tsg_t2" cursor="pointer"><rect x="215" y="15" width="170" height="34" rx="17" fill="url(#tsg_g2)" opacity="0.5"/><text x="300" y="37" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">主题 B</text></g>
  <g id="tsg_t3" cursor="pointer"><rect x="400" y="15" width="170" height="34" rx="17" fill="url(#tsg_g3)" opacity="0.5"/><text x="485" y="37" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">主题 C</text></g>
  <rect x="30" y="65" width="540" height="330" rx="10" fill="#1a1a2e"/>
  <image data-image-slot="grad1" href="placeholder" x="30" y="65" width="540" height="330" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="tsg_t1.click"/><set attributeName="visibility" to="hidden" begin="tsg_t2.click"/><set attributeName="visibility" to="hidden" begin="tsg_t3.click"/>
  </image>
  <image data-image-slot="grad2" href="placeholder" x="30" y="65" width="540" height="330" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="tsg_t1.click"/><set attributeName="visibility" to="visible" begin="tsg_t2.click"/><set attributeName="visibility" to="hidden" begin="tsg_t3.click"/>
  </image>
  <image data-image-slot="grad3" href="placeholder" x="30" y="65" width="540" height="330" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="tsg_t1.click"/><set attributeName="visibility" to="hidden" begin="tsg_t2.click"/><set attributeName="visibility" to="visible" begin="tsg_t3.click"/>
  </image>
  <text x="300" y="440" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'tab_switch_magazine',
    name: '杂志风标签',
    category: 'tab_switch_image',
    tags: ['标签', '杂志', 'GQ', '高端', '切换'],
    colorScheme: '#c0392b',
    interactive: true,
    interactionType: 'tab_switch_image',
    source: 'manifold',
    imageSlots: [
      { id: 'mag1', label: '封面1', width: 540, height: 360 },
      { id: 'mag2', label: '封面2', width: 540, height: 360 },
      { id: 'mag3', label: '封面3', width: 540, height: 360 }
    ],
    svg: `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="500" rx="0" fill="#0a0a0a"/>
  <line x1="30" y1="48" x2="570" y2="48" stroke="#c0392b" stroke-width="3"/>
  <text x="30" y="38" fill="#c0392b" font-size="22" font-family="serif" font-weight="700" letter-spacing="6">MANIFOLD</text>
  <text x="570" y="38" text-anchor="end" fill="#666" font-size="11" font-family="sans-serif" letter-spacing="2">GALLERY</text>
  <g id="tsm_t1" cursor="pointer"><text x="30" y="75" fill="#fff" font-size="14" font-family="serif" text-decoration="underline">I</text></g>
  <g id="tsm_t2" cursor="pointer"><text x="70" y="75" fill="#666" font-size="14" font-family="serif">II</text></g>
  <g id="tsm_t3" cursor="pointer"><text x="110" y="75" fill="#666" font-size="14" font-family="serif">III</text></g>
  <rect x="30" y="90" width="540" height="360" fill="#1a1a1a"/>
  <image data-image-slot="mag1" href="placeholder" x="30" y="90" width="540" height="360" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="tsm_t1.click"/><set attributeName="visibility" to="hidden" begin="tsm_t2.click"/><set attributeName="visibility" to="hidden" begin="tsm_t3.click"/>
  </image>
  <image data-image-slot="mag2" href="placeholder" x="30" y="90" width="540" height="360" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="tsm_t1.click"/><set attributeName="visibility" to="visible" begin="tsm_t2.click"/><set attributeName="visibility" to="hidden" begin="tsm_t3.click"/>
  </image>
  <image data-image-slot="mag3" href="placeholder" x="30" y="90" width="540" height="360" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="tsm_t1.click"/><set attributeName="visibility" to="hidden" begin="tsm_t2.click"/><set attributeName="visibility" to="visible" begin="tsm_t3.click"/>
  </image>
  <line x1="30" y1="465" x2="570" y2="465" stroke="#333" stroke-width="1"/>
  <text x="300" y="488" text-anchor="middle" fill="#444" font-size="10" font-family="sans-serif" letter-spacing="3">MANIFOLD INTERACTIVE</text>
</svg>`
  }
]

// ============================================================
// Category 3: before_after_image — 前后对比滑块
// ============================================================

export const SVG_BEFORE_AFTER_IMAGE = [
  {
    id: 'before_after_lr',
    name: '左右对比',
    category: 'before_after_image',
    tags: ['对比', '左右', '滑块', '前后'],
    colorScheme: '#2ecc71',
    interactive: true,
    interactionType: 'before_after_image',
    source: 'manifold',
    imageSlots: [
      { id: 'before', label: '对比前', width: 540, height: 360 },
      { id: 'after', label: '对比后', width: 540, height: 360 }
    ],
    svg: `<svg viewBox="0 0 600 440" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <clipPath id="balr_left"><rect x="30" y="40" width="270" height="360"/></clipPath>
    <clipPath id="balr_right"><rect x="300" y="40" width="270" height="360"/></clipPath>
    <clipPath id="balr_full"><rect x="30" y="40" width="540" height="360"/></clipPath>
  </defs>
  <rect width="600" height="440" rx="12" fill="#1a1a1a"/>
  <g clip-path="url(#balr_full)">
    <image data-image-slot="after" href="placeholder" x="30" y="40" width="540" height="360" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g clip-path="url(#balr_left)">
    <image data-image-slot="before" href="placeholder" x="30" y="40" width="540" height="360" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <line x1="300" y1="40" x2="300" y2="400" stroke="#fff" stroke-width="3"/>
  <circle cx="300" cy="220" r="16" fill="#fff" stroke="#2ecc71" stroke-width="2"/>
  <polygon points="293,216 293,224 288,220" fill="#2ecc71"/>
  <polygon points="307,216 307,224 312,220" fill="#2ecc71"/>
  <text x="165" y="25" text-anchor="middle" fill="#888" font-size="11" font-family="sans-serif">BEFORE</text>
  <text x="435" y="25" text-anchor="middle" fill="#888" font-size="11" font-family="sans-serif">AFTER</text>
  <text x="300" y="430" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'before_after_tb',
    name: '上下对比',
    category: 'before_after_image',
    tags: ['对比', '上下', '前后'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'before_after_image',
    source: 'manifold',
    imageSlots: [
      { id: 'before', label: '对比前', width: 540, height: 200 },
      { id: 'after', label: '对比后', width: 540, height: 200 }
    ],
    svg: `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="500" rx="12" fill="#0d1b2a"/>
  <text x="300" y="30" text-anchor="middle" fill="#3498db" font-size="14" font-family="sans-serif" font-weight="600">BEFORE</text>
  <rect x="30" y="40" width="540" height="200" rx="8" fill="#1b2838"/>
  <image data-image-slot="before" href="placeholder" x="30" y="40" width="540" height="200" preserveAspectRatio="xMidYMid slice"/>
  <line x1="30" y1="250" x2="570" y2="250" stroke="#3498db" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="300" y="275" text-anchor="middle" fill="#3498db" font-size="14" font-family="sans-serif" font-weight="600">AFTER</text>
  <rect x="30" y="285" width="540" height="200" rx="8" fill="#1b2838"/>
  <image data-image-slot="after" href="placeholder" x="30" y="285" width="540" height="200" preserveAspectRatio="xMidYMid slice"/>
  <text x="300" y="495" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'before_after_circle',
    name: '圆形遮罩对比',
    category: 'before_after_image',
    tags: ['对比', '圆形', '遮罩', '创意'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'before_after_image',
    source: 'manifold',
    imageSlots: [
      { id: 'before', label: '底层图', width: 500, height: 500 },
      { id: 'after', label: '圆内图', width: 500, height: 500 }
    ],
    svg: `<svg viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <clipPath id="bac_circle"><circle cx="300" cy="280" r="0"><animate attributeName="r" from="0" to="200" begin="bac_trigger.click" dur="0.8s" fill="freeze"/></circle></clipPath>
    <clipPath id="bac_box"><rect x="50" y="30" width="500" height="500" rx="10"/></clipPath>
  </defs>
  <rect width="600" height="560" rx="12" fill="#1a1a1a"/>
  <g clip-path="url(#bac_box)">
    <image data-image-slot="before" href="placeholder" x="50" y="30" width="500" height="500" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g clip-path="url(#bac_box)">
    <g clip-path="url(#bac_circle)">
      <image data-image-slot="after" href="placeholder" x="50" y="30" width="500" height="500" preserveAspectRatio="xMidYMid slice"/>
    </g>
  </g>
  <circle id="bac_trigger" cx="300" cy="280" r="40" fill="none" stroke="#e67e22" stroke-width="3" cursor="pointer" opacity="0.9">
    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="300" y="285" text-anchor="middle" fill="#e67e22" font-size="12" font-family="sans-serif" cursor="pointer">揭开</text>
  <text x="300" y="548" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'before_after_diagonal',
    name: '对角线对比',
    category: 'before_after_image',
    tags: ['对比', '对角线', '斜切', '创意'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'before_after_image',
    source: 'manifold',
    imageSlots: [
      { id: 'before', label: '左上图', width: 540, height: 400 },
      { id: 'after', label: '右下图', width: 540, height: 400 }
    ],
    svg: `<svg viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <clipPath id="bad_top"><polygon points="30,40 570,40 30,440"/></clipPath>
    <clipPath id="bad_bot"><polygon points="570,40 570,440 30,440"/></clipPath>
    <clipPath id="bad_box"><rect x="30" y="40" width="540" height="400" rx="8"/></clipPath>
  </defs>
  <rect width="600" height="480" rx="12" fill="#1a0a2e"/>
  <g clip-path="url(#bad_box)">
    <g clip-path="url(#bad_top)"><image data-image-slot="before" href="placeholder" x="30" y="40" width="540" height="400" preserveAspectRatio="xMidYMid slice"/></g>
    <g clip-path="url(#bad_bot)"><image data-image-slot="after" href="placeholder" x="30" y="40" width="540" height="400" preserveAspectRatio="xMidYMid slice"/></g>
  </g>
  <line x1="30" y1="440" x2="570" y2="40" stroke="#fff" stroke-width="3" opacity="0.8"/>
  <text x="120" y="120" fill="#fff" font-size="12" font-family="sans-serif" opacity="0.9">BEFORE</text>
  <text x="440" y="380" fill="#fff" font-size="12" font-family="sans-serif" opacity="0.9">AFTER</text>
  <text x="300" y="470" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'before_after_multi',
    name: '多组对比',
    category: 'before_after_image',
    tags: ['对比', '多组', '前后', '批量'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'before_after_image',
    source: 'manifold',
    imageSlots: [
      { id: 'pair1_before', label: '组1-前', width: 250, height: 200 },
      { id: 'pair1_after', label: '组1-后', width: 250, height: 200 },
      { id: 'pair2_before', label: '组2-前', width: 250, height: 200 },
      { id: 'pair2_after', label: '组2-后', width: 250, height: 200 }
    ],
    svg: `<svg viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="520" rx="12" fill="#0d1117"/>
  <text x="300" y="30" text-anchor="middle" fill="#1abc9c" font-size="15" font-family="sans-serif" font-weight="600">对比展示</text>
  <text x="155" y="58" text-anchor="middle" fill="#888" font-size="11" font-family="sans-serif">BEFORE</text>
  <text x="445" y="58" text-anchor="middle" fill="#888" font-size="11" font-family="sans-serif">AFTER</text>
  <rect x="30" y="65" width="250" height="200" rx="6" fill="#161b22"/>
  <image data-image-slot="pair1_before" href="placeholder" x="30" y="65" width="250" height="200" preserveAspectRatio="xMidYMid slice"/>
  <rect x="320" y="65" width="250" height="200" rx="6" fill="#161b22"/>
  <image data-image-slot="pair1_after" href="placeholder" x="320" y="65" width="250" height="200" preserveAspectRatio="xMidYMid slice"/>
  <polygon points="290,165 310,155 310,175" fill="#1abc9c"/>
  <rect x="30" y="290" width="250" height="200" rx="6" fill="#161b22"/>
  <image data-image-slot="pair2_before" href="placeholder" x="30" y="290" width="250" height="200" preserveAspectRatio="xMidYMid slice"/>
  <rect x="320" y="290" width="250" height="200" rx="6" fill="#161b22"/>
  <image data-image-slot="pair2_after" href="placeholder" x="320" y="290" width="250" height="200" preserveAspectRatio="xMidYMid slice"/>
  <polygon points="290,390 310,380 310,400" fill="#1abc9c"/>
  <text x="300" y="510" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'before_after_annotated',
    name: '标注对比',
    category: 'before_after_image',
    tags: ['对比', '标注', '说明', '前后'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'before_after_image',
    source: 'manifold',
    imageSlots: [
      { id: 'before', label: '修改前', width: 540, height: 300 },
      { id: 'after', label: '修改后', width: 540, height: 300 }
    ],
    svg: `<svg viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="480" rx="12" fill="#fdf6e3"/>
  <rect x="30" y="20" width="540" height="300" rx="8" fill="#eee8d5"/>
  <image data-image-slot="before" href="placeholder" x="30" y="20" width="540" height="300" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="baa_before.click"/>
    <set attributeName="visibility" to="hidden" begin="baa_after.click"/>
  </image>
  <image data-image-slot="after" href="placeholder" x="30" y="20" width="540" height="300" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="hidden" begin="baa_before.click"/>
    <set attributeName="visibility" to="visible" begin="baa_after.click"/>
  </image>
  <g id="baa_before" cursor="pointer"><rect x="30" y="340" width="260" height="44" rx="22" fill="#d33682"/><text x="160" y="367" text-anchor="middle" fill="#fff" font-size="15" font-family="sans-serif" font-weight="600">修改前</text></g>
  <g id="baa_after" cursor="pointer"><rect x="310" y="340" width="260" height="44" rx="22" fill="#268bd2"/><text x="440" y="367" text-anchor="middle" fill="#fff" font-size="15" font-family="sans-serif" font-weight="600">修改后</text></g>
  <rect x="30" y="400" width="540" height="40" rx="6" fill="#eee8d5"/>
  <text x="300" y="425" text-anchor="middle" fill="#657b83" font-size="12" font-family="sans-serif">点击按钮切换查看前后对比效果</text>
  <text x="300" y="468" text-anchor="middle" fill="#93a1a1" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  }
]

// ============================================================
// Category 4: image_sequence — 多图序列翻页
// ============================================================

export const SVG_IMAGE_SEQUENCE = [
  {
    id: 'seq_lr_flip',
    name: '左右翻页',
    category: 'image_sequence',
    tags: ['翻页', '左右', '序列', '相册'],
    colorScheme: '#34495e',
    interactive: true,
    interactionType: 'image_sequence',
    source: 'manifold',
    imageSlots: [
      { id: 'page1', label: '第1页', width: 440, height: 360 },
      { id: 'page2', label: '第2页', width: 440, height: 360 },
      { id: 'page3', label: '第3页', width: 440, height: 360 },
      { id: 'page4', label: '第4页', width: 440, height: 360 }
    ],
    svg: `<svg viewBox="0 0 600 460" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="460" rx="12" fill="#2c3e50"/>
  <rect x="80" y="30" width="440" height="360" rx="8" fill="#34495e"/>
  <image data-image-slot="page1" href="placeholder" x="80" y="30" width="440" height="360" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="0s"/>
    <set attributeName="visibility" to="hidden" begin="slr_r.click"/>
  </image>
  <image data-image-slot="page2" href="placeholder" x="80" y="30" width="440" height="360" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="slr_r.click"/>
    <set attributeName="visibility" to="hidden" begin="slr_r2.click"/>
  </image>
  <image data-image-slot="page3" href="placeholder" x="80" y="30" width="440" height="360" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="slr_r2.click"/>
    <set attributeName="visibility" to="hidden" begin="slr_r3.click"/>
  </image>
  <image data-image-slot="page4" href="placeholder" x="80" y="30" width="440" height="360" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="slr_r3.click"/>
  </image>
  <g id="slr_r" cursor="pointer" visibility="visible"><set attributeName="visibility" to="hidden" begin="slr_r.click"/><circle cx="555" cy="210" r="22" fill="#ecf0f1"/><polygon points="550,200 565,210 550,220" fill="#2c3e50"/></g>
  <g id="slr_r2" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="slr_r.click"/><set attributeName="visibility" to="hidden" begin="slr_r2.click"/><circle cx="555" cy="210" r="22" fill="#ecf0f1"/><polygon points="550,200 565,210 550,220" fill="#2c3e50"/></g>
  <g id="slr_r3" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="slr_r2.click"/><set attributeName="visibility" to="hidden" begin="slr_r3.click"/><circle cx="555" cy="210" r="22" fill="#ecf0f1"/><polygon points="550,200 565,210 550,220" fill="#2c3e50"/></g>
  <text x="300" y="415" text-anchor="middle" fill="#95a5a6" font-size="12" font-family="sans-serif">点击箭头翻页</text>
  <text x="300" y="448" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'seq_tb_flip',
    name: '上下翻页',
    category: 'image_sequence',
    tags: ['翻页', '上下', '序列'],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'image_sequence',
    source: 'manifold',
    imageSlots: [
      { id: 'page1', label: '第1页', width: 520, height: 320 },
      { id: 'page2', label: '第2页', width: 520, height: 320 },
      { id: 'page3', label: '第3页', width: 520, height: 320 },
      { id: 'page4', label: '第4页', width: 520, height: 320 }
    ],
    svg: `<svg viewBox="0 0 600 480" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="480" rx="12" fill="#0d1f0d"/>
  <rect x="40" y="40" width="520" height="320" rx="8" fill="#1a3a1a"/>
  <image data-image-slot="page1" href="placeholder" x="40" y="40" width="520" height="320" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="0s"/><set attributeName="visibility" to="hidden" begin="stb_d.click"/>
  </image>
  <image data-image-slot="page2" href="placeholder" x="40" y="40" width="520" height="320" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="stb_d.click"/><set attributeName="visibility" to="hidden" begin="stb_d2.click"/>
  </image>
  <image data-image-slot="page3" href="placeholder" x="40" y="40" width="520" height="320" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="stb_d2.click"/><set attributeName="visibility" to="hidden" begin="stb_d3.click"/>
  </image>
  <image data-image-slot="page4" href="placeholder" x="40" y="40" width="520" height="320" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="stb_d3.click"/>
  </image>
  <g id="stb_d" cursor="pointer" visibility="visible"><set attributeName="visibility" to="hidden" begin="stb_d.click"/><rect x="260" y="380" width="80" height="36" rx="18" fill="#27ae60"/><polygon points="290,390 310,390 300,406" fill="#fff"/></g>
  <g id="stb_d2" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="stb_d.click"/><set attributeName="visibility" to="hidden" begin="stb_d2.click"/><rect x="260" y="380" width="80" height="36" rx="18" fill="#27ae60"/><polygon points="290,390 310,390 300,406" fill="#fff"/></g>
  <g id="stb_d3" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="stb_d2.click"/><set attributeName="visibility" to="hidden" begin="stb_d3.click"/><rect x="260" y="380" width="80" height="36" rx="18" fill="#27ae60"/><polygon points="290,390 310,390 300,406" fill="#fff"/></g>
  <text x="300" y="445" text-anchor="middle" fill="#4a8a4a" font-size="12" font-family="sans-serif">向下翻页浏览</text>
  <text x="300" y="470" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'seq_fade',
    name: '淡入淡出序列',
    category: 'image_sequence',
    tags: ['淡入', '淡出', '序列', '渐变'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'image_sequence',
    source: 'manifold',
    imageSlots: [
      { id: 'fade1', label: '图1', width: 520, height: 340 },
      { id: 'fade2', label: '图2', width: 520, height: 340 },
      { id: 'fade3', label: '图3', width: 520, height: 340 },
      { id: 'fade4', label: '图4', width: 520, height: 340 }
    ],
    svg: `<svg viewBox="0 0 600 460" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="460" rx="12" fill="#1a0a2e"/>
  <rect x="40" y="40" width="520" height="340" rx="10" fill="#2a1a3e"/>
  <image data-image-slot="fade1" href="placeholder" x="40" y="40" width="520" height="340" preserveAspectRatio="xMidYMid slice" opacity="1">
    <set attributeName="opacity" to="1" begin="0s"/><set attributeName="opacity" to="0" begin="sf_n.click"/>
  </image>
  <image data-image-slot="fade2" href="placeholder" x="40" y="40" width="520" height="340" preserveAspectRatio="xMidYMid slice" opacity="0">
    <set attributeName="opacity" to="1" begin="sf_n.click"/><set attributeName="opacity" to="0" begin="sf_n2.click"/>
  </image>
  <image data-image-slot="fade3" href="placeholder" x="40" y="40" width="520" height="340" preserveAspectRatio="xMidYMid slice" opacity="0">
    <set attributeName="opacity" to="1" begin="sf_n2.click"/><set attributeName="opacity" to="0" begin="sf_n3.click"/>
  </image>
  <image data-image-slot="fade4" href="placeholder" x="40" y="40" width="520" height="340" preserveAspectRatio="xMidYMid slice" opacity="0">
    <set attributeName="opacity" to="1" begin="sf_n3.click"/>
  </image>
  <g id="sf_n" cursor="pointer" visibility="visible"><set attributeName="visibility" to="hidden" begin="sf_n.click"/><rect x="230" y="400" width="140" height="36" rx="18" fill="#8e44ad"/><text x="300" y="423" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">下一张</text></g>
  <g id="sf_n2" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="sf_n.click"/><set attributeName="visibility" to="hidden" begin="sf_n2.click"/><rect x="230" y="400" width="140" height="36" rx="18" fill="#8e44ad"/><text x="300" y="423" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">下一张</text></g>
  <g id="sf_n3" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="sf_n2.click"/><set attributeName="visibility" to="hidden" begin="sf_n3.click"/><rect x="230" y="400" width="140" height="36" rx="18" fill="#8e44ad"/><text x="300" y="423" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">下一张</text></g>
  <text x="300" y="453" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'seq_card_stack',
    name: '卡片堆叠翻页',
    category: 'image_sequence',
    tags: ['卡片', '堆叠', '序列', '层叠'],
    colorScheme: '#d35400',
    interactive: true,
    interactionType: 'image_sequence',
    source: 'manifold',
    imageSlots: [
      { id: 'card1', label: '卡片1', width: 440, height: 320 },
      { id: 'card2', label: '卡片2', width: 440, height: 320 },
      { id: 'card3', label: '卡片3', width: 440, height: 320 },
      { id: 'card4', label: '卡片4', width: 440, height: 320 }
    ],
    svg: `<svg viewBox="0 0 600 460" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="460" rx="12" fill="#1a1210"/>
  <rect x="95" y="55" width="440" height="320" rx="6" fill="#3a2a20" opacity="0.3"/>
  <rect x="90" y="50" width="440" height="320" rx="6" fill="#3a2a20" opacity="0.5"/>
  <rect x="85" y="45" width="440" height="320" rx="6" fill="#3a2a20" opacity="0.7"/>
  <g visibility="visible"><set attributeName="visibility" to="hidden" begin="scs_n.click"/>
    <rect x="80" y="40" width="440" height="320" rx="8" fill="#4a3a30"/>
    <image data-image-slot="card1" href="placeholder" x="80" y="40" width="440" height="320" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g visibility="hidden"><set attributeName="visibility" to="visible" begin="scs_n.click"/><set attributeName="visibility" to="hidden" begin="scs_n2.click"/>
    <rect x="80" y="40" width="440" height="320" rx="8" fill="#4a3a30"/>
    <image data-image-slot="card2" href="placeholder" x="80" y="40" width="440" height="320" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g visibility="hidden"><set attributeName="visibility" to="visible" begin="scs_n2.click"/><set attributeName="visibility" to="hidden" begin="scs_n3.click"/>
    <rect x="80" y="40" width="440" height="320" rx="8" fill="#4a3a30"/>
    <image data-image-slot="card3" href="placeholder" x="80" y="40" width="440" height="320" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g visibility="hidden"><set attributeName="visibility" to="visible" begin="scs_n3.click"/>
    <rect x="80" y="40" width="440" height="320" rx="8" fill="#4a3a30"/>
    <image data-image-slot="card4" href="placeholder" x="80" y="40" width="440" height="320" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g id="scs_n" cursor="pointer" visibility="visible"><set attributeName="visibility" to="hidden" begin="scs_n.click"/><rect x="230" y="385" width="140" height="36" rx="18" fill="#d35400"/><text x="300" y="408" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">翻开</text></g>
  <g id="scs_n2" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="scs_n.click"/><set attributeName="visibility" to="hidden" begin="scs_n2.click"/><rect x="230" y="385" width="140" height="36" rx="18" fill="#d35400"/><text x="300" y="408" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">翻开</text></g>
  <g id="scs_n3" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="scs_n2.click"/><set attributeName="visibility" to="hidden" begin="scs_n3.click"/><rect x="230" y="385" width="140" height="36" rx="18" fill="#d35400"/><text x="300" y="408" text-anchor="middle" fill="#fff" font-size="13" font-family="sans-serif">翻开</text></g>
  <text x="300" y="448" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'seq_filmstrip',
    name: '胶片滚动',
    category: 'image_sequence',
    tags: ['胶片', '电影', '滚动', '序列'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'image_sequence',
    source: 'manifold',
    imageSlots: [
      { id: 'film1', label: '帧1', width: 400, height: 260 },
      { id: 'film2', label: '帧2', width: 400, height: 260 },
      { id: 'film3', label: '帧3', width: 400, height: 260 },
      { id: 'film4', label: '帧4', width: 400, height: 260 },
      { id: 'film5', label: '帧5', width: 400, height: 260 }
    ],
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="400" rx="0" fill="#0a0a0a"/>
  <rect x="0" y="30" width="600" height="8" fill="#222"/>
  <rect x="0" y="330" width="600" height="8" fill="#222"/>
  <rect x="20" y="32" width="16" height="4" rx="1" fill="#444"/><rect x="56" y="32" width="16" height="4" rx="1" fill="#444"/><rect x="92" y="32" width="16" height="4" rx="1" fill="#444"/><rect x="128" y="32" width="16" height="4" rx="1" fill="#444"/><rect x="164" y="32" width="16" height="4" rx="1" fill="#444"/><rect x="200" y="32" width="16" height="4" rx="1" fill="#444"/>
  <rect x="100" y="50" width="400" height="260" rx="4" fill="#1a1a1a"/>
  <image data-image-slot="film1" href="placeholder" x="100" y="50" width="400" height="260" preserveAspectRatio="xMidYMid slice" visibility="visible">
    <set attributeName="visibility" to="visible" begin="0s"/><set attributeName="visibility" to="hidden" begin="sfm_n.click"/>
  </image>
  <image data-image-slot="film2" href="placeholder" x="100" y="50" width="400" height="260" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="sfm_n.click"/><set attributeName="visibility" to="hidden" begin="sfm_n2.click"/>
  </image>
  <image data-image-slot="film3" href="placeholder" x="100" y="50" width="400" height="260" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="sfm_n2.click"/><set attributeName="visibility" to="hidden" begin="sfm_n3.click"/>
  </image>
  <image data-image-slot="film4" href="placeholder" x="100" y="50" width="400" height="260" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="sfm_n3.click"/><set attributeName="visibility" to="hidden" begin="sfm_n4.click"/>
  </image>
  <image data-image-slot="film5" href="placeholder" x="100" y="50" width="400" height="260" preserveAspectRatio="xMidYMid slice" visibility="hidden">
    <set attributeName="visibility" to="visible" begin="sfm_n4.click"/>
  </image>
  <g id="sfm_n" cursor="pointer" visibility="visible"><set attributeName="visibility" to="hidden" begin="sfm_n.click"/><rect x="250" y="350" width="100" height="30" rx="4" fill="#333"/><text x="300" y="370" text-anchor="middle" fill="#aaa" font-size="11" font-family="monospace">NEXT ></text></g>
  <g id="sfm_n2" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="sfm_n.click"/><set attributeName="visibility" to="hidden" begin="sfm_n2.click"/><rect x="250" y="350" width="100" height="30" rx="4" fill="#333"/><text x="300" y="370" text-anchor="middle" fill="#aaa" font-size="11" font-family="monospace">NEXT ></text></g>
  <g id="sfm_n3" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="sfm_n2.click"/><set attributeName="visibility" to="hidden" begin="sfm_n3.click"/><rect x="250" y="350" width="100" height="30" rx="4" fill="#333"/><text x="300" y="370" text-anchor="middle" fill="#aaa" font-size="11" font-family="monospace">NEXT ></text></g>
  <g id="sfm_n4" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="sfm_n3.click"/><set attributeName="visibility" to="hidden" begin="sfm_n4.click"/><rect x="250" y="350" width="100" height="30" rx="4" fill="#333"/><text x="300" y="370" text-anchor="middle" fill="#aaa" font-size="11" font-family="monospace">NEXT ></text></g>
  <text x="300" y="395" text-anchor="middle" fill="#333" font-size="10" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'seq_rotate',
    name: '旋转切换',
    category: 'image_sequence',
    tags: ['旋转', '3D', '切换', '序列'],
    colorScheme: '#16a085',
    interactive: true,
    interactionType: 'image_sequence',
    source: 'manifold',
    imageSlots: [
      { id: 'rot1', label: '视角1', width: 400, height: 400 },
      { id: 'rot2', label: '视角2', width: 400, height: 400 },
      { id: 'rot3', label: '视角3', width: 400, height: 400 },
      { id: 'rot4', label: '视角4', width: 400, height: 400 }
    ],
    svg: `<svg viewBox="0 0 600 520" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="520" rx="12" fill="#0a1a1a"/>
  <defs><clipPath id="srot_c"><circle cx="300" cy="230" r="190"/></clipPath></defs>
  <circle cx="300" cy="230" r="195" fill="none" stroke="#16a085" stroke-width="2" opacity="0.3"/>
  <circle cx="300" cy="230" r="190" fill="#0f2f2f"/>
  <g clip-path="url(#srot_c)">
    <image data-image-slot="rot1" href="placeholder" x="100" y="30" width="400" height="400" preserveAspectRatio="xMidYMid slice" visibility="visible">
      <set attributeName="visibility" to="visible" begin="0s"/><set attributeName="visibility" to="hidden" begin="srot_n.click"/>
    </image>
    <image data-image-slot="rot2" href="placeholder" x="100" y="30" width="400" height="400" preserveAspectRatio="xMidYMid slice" visibility="hidden">
      <set attributeName="visibility" to="visible" begin="srot_n.click"/><set attributeName="visibility" to="hidden" begin="srot_n2.click"/>
    </image>
    <image data-image-slot="rot3" href="placeholder" x="100" y="30" width="400" height="400" preserveAspectRatio="xMidYMid slice" visibility="hidden">
      <set attributeName="visibility" to="visible" begin="srot_n2.click"/><set attributeName="visibility" to="hidden" begin="srot_n3.click"/>
    </image>
    <image data-image-slot="rot4" href="placeholder" x="100" y="30" width="400" height="400" preserveAspectRatio="xMidYMid slice" visibility="hidden">
      <set attributeName="visibility" to="visible" begin="srot_n3.click"/>
    </image>
  </g>
  <g id="srot_n" cursor="pointer" visibility="visible"><set attributeName="visibility" to="hidden" begin="srot_n.click"/><circle cx="510" cy="230" r="24" fill="#16a085" opacity="0.9"/><path d="M504,224 L518,230 L504,236" fill="#fff"/></g>
  <g id="srot_n2" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="srot_n.click"/><set attributeName="visibility" to="hidden" begin="srot_n2.click"/><circle cx="510" cy="230" r="24" fill="#16a085" opacity="0.9"/><path d="M504,224 L518,230 L504,236" fill="#fff"/></g>
  <g id="srot_n3" cursor="pointer" visibility="hidden"><set attributeName="visibility" to="visible" begin="srot_n2.click"/><set attributeName="visibility" to="hidden" begin="srot_n3.click"/><circle cx="510" cy="230" r="24" fill="#16a085" opacity="0.9"/><path d="M504,224 L518,230 L504,236" fill="#fff"/></g>
  <circle cx="260" cy="455" r="6" fill="#16a085"/><circle cx="280" cy="455" r="6" fill="#0f2f2f" stroke="#16a085" stroke-width="1"/><circle cx="300" cy="455" r="6" fill="#0f2f2f" stroke="#16a085" stroke-width="1"/><circle cx="320" cy="455" r="6" fill="#0f2f2f" stroke="#16a085" stroke-width="1"/>
  <text x="300" y="500" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  }
]

// ============================================================
// Category 5: grid_zoom_image — 网格点击放大
// ============================================================

export const SVG_GRID_ZOOM_IMAGE = [
  {
    id: 'grid_zoom_2x2',
    name: '2x2网格放大',
    category: 'grid_zoom_image',
    tags: ['网格', '2x2', '放大', '相册'],
    colorScheme: '#2980b9',
    interactive: true,
    interactionType: 'grid_zoom_image',
    source: 'manifold',
    imageSlots: [
      { id: 'g1', label: '左上', width: 260, height: 200 },
      { id: 'g2', label: '右上', width: 260, height: 200 },
      { id: 'g3', label: '左下', width: 260, height: 200 },
      { id: 'g4', label: '右下', width: 260, height: 200 }
    ],
    svg: `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="500" rx="12" fill="#0d1b2a"/>
  <rect x="25" y="25" width="260" height="200" rx="6" fill="#1b2838"/>
  <image data-image-slot="g1" href="placeholder" x="25" y="25" width="260" height="200" preserveAspectRatio="xMidYMid slice"/>
  <rect x="315" y="25" width="260" height="200" rx="6" fill="#1b2838"/>
  <image data-image-slot="g2" href="placeholder" x="315" y="25" width="260" height="200" preserveAspectRatio="xMidYMid slice"/>
  <rect x="25" y="255" width="260" height="200" rx="6" fill="#1b2838"/>
  <image data-image-slot="g3" href="placeholder" x="25" y="255" width="260" height="200" preserveAspectRatio="xMidYMid slice"/>
  <rect x="315" y="255" width="260" height="200" rx="6" fill="#1b2838"/>
  <image data-image-slot="g4" href="placeholder" x="315" y="255" width="260" height="200" preserveAspectRatio="xMidYMid slice"/>
  <text x="300" y="488" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'grid_zoom_3x3',
    name: '3x3九宫格',
    category: 'grid_zoom_image',
    tags: ['网格', '3x3', '九宫格', '放大'],
    colorScheme: '#c0392b',
    interactive: true,
    interactionType: 'grid_zoom_image',
    source: 'manifold',
    imageSlots: [
      { id: 'g1', label: '1', width: 170, height: 150 },
      { id: 'g2', label: '2', width: 170, height: 150 },
      { id: 'g3', label: '3', width: 170, height: 150 },
      { id: 'g4', label: '4', width: 170, height: 150 },
      { id: 'g5', label: '5', width: 170, height: 150 },
      { id: 'g6', label: '6', width: 170, height: 150 },
      { id: 'g7', label: '7', width: 170, height: 150 },
      { id: 'g8', label: '8', width: 170, height: 150 },
      { id: 'g9', label: '9', width: 170, height: 150 }
    ],
    svg: `<svg viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="560" rx="12" fill="#1a0a0a"/>
  <image data-image-slot="g1" href="placeholder" x="25" y="20" width="170" height="150" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g2" href="placeholder" x="215" y="20" width="170" height="150" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g3" href="placeholder" x="405" y="20" width="170" height="150" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g4" href="placeholder" x="25" y="190" width="170" height="150" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g5" href="placeholder" x="215" y="190" width="170" height="150" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g6" href="placeholder" x="405" y="190" width="170" height="150" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g7" href="placeholder" x="25" y="360" width="170" height="150" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g8" href="placeholder" x="215" y="360" width="170" height="150" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g9" href="placeholder" x="405" y="360" width="170" height="150" preserveAspectRatio="xMidYMid slice"/>
  <text x="300" y="545" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'grid_zoom_2x3',
    name: '2x3网格',
    category: 'grid_zoom_image',
    tags: ['网格', '2x3', '六图', '相册'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'grid_zoom_image',
    source: 'manifold',
    imageSlots: [
      { id: 'g1', label: '图1', width: 270, height: 180 },
      { id: 'g2', label: '图2', width: 270, height: 180 },
      { id: 'g3', label: '图3', width: 270, height: 180 },
      { id: 'g4', label: '图4', width: 270, height: 180 },
      { id: 'g5', label: '图5', width: 270, height: 180 },
      { id: 'g6', label: '图6', width: 270, height: 180 }
    ],
    svg: `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="600" rx="12" fill="#120a1e"/>
  <image data-image-slot="g1" href="placeholder" x="20" y="20" width="270" height="180" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g2" href="placeholder" x="310" y="20" width="270" height="180" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g3" href="placeholder" x="20" y="210" width="270" height="180" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g4" href="placeholder" x="310" y="210" width="270" height="180" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g5" href="placeholder" x="20" y="400" width="270" height="180" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="g6" href="placeholder" x="310" y="400" width="270" height="180" preserveAspectRatio="xMidYMid slice"/>
  <text x="300" y="595" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'grid_zoom_masonry',
    name: '瀑布流布局',
    category: 'grid_zoom_image',
    tags: ['瀑布流', '不等高', '创意', '网格'],
    colorScheme: '#16a085',
    interactive: true,
    interactionType: 'grid_zoom_image',
    source: 'manifold',
    imageSlots: [
      { id: 'ms1', label: '大图', width: 350, height: 300 },
      { id: 'ms2', label: '右上', width: 200, height: 140 },
      { id: 'ms3', label: '右中', width: 200, height: 140 },
      { id: 'ms4', label: '下左', width: 170, height: 160 },
      { id: 'ms5', label: '下右', width: 370, height: 160 }
    ],
    svg: `<svg viewBox="0 0 600 510" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="510" rx="12" fill="#0a1a18"/>
  <image data-image-slot="ms1" href="placeholder" x="20" y="20" width="350" height="300" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="ms2" href="placeholder" x="380" y="20" width="200" height="140" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="ms3" href="placeholder" x="380" y="170" width="200" height="150" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="ms4" href="placeholder" x="20" y="330" width="170" height="160" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="ms5" href="placeholder" x="200" y="330" width="380" height="160" preserveAspectRatio="xMidYMid slice"/>
  <text x="300" y="505" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'grid_zoom_puzzle',
    name: '拼图布局',
    category: 'grid_zoom_image',
    tags: ['拼图', '不规则', '创意', '网格'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'grid_zoom_image',
    source: 'manifold',
    imageSlots: [
      { id: 'pz1', label: '中央大图', width: 300, height: 300 },
      { id: 'pz2', label: '左上', width: 130, height: 145 },
      { id: 'pz3', label: '左下', width: 130, height: 145 },
      { id: 'pz4', label: '右上', width: 130, height: 145 },
      { id: 'pz5', label: '右下', width: 130, height: 145 }
    ],
    svg: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="360" rx="12" fill="#1a0a0a"/>
  <image data-image-slot="pz2" href="placeholder" x="20" y="20" width="130" height="145" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="pz3" href="placeholder" x="20" y="175" width="130" height="145" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="pz1" href="placeholder" x="160" y="20" width="280" height="300" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="pz4" href="placeholder" x="450" y="20" width="130" height="145" preserveAspectRatio="xMidYMid slice"/>
  <image data-image-slot="pz5" href="placeholder" x="450" y="175" width="130" height="145" preserveAspectRatio="xMidYMid slice"/>
  <text x="300" y="348" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'grid_zoom_circles',
    name: '圆形头像墙',
    category: 'grid_zoom_image',
    tags: ['圆形', '头像', '人物', '网格'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'grid_zoom_image',
    source: 'manifold',
    imageSlots: [
      { id: 'av1', label: '头像1', width: 120, height: 120 },
      { id: 'av2', label: '头像2', width: 120, height: 120 },
      { id: 'av3', label: '头像3', width: 120, height: 120 },
      { id: 'av4', label: '头像4', width: 120, height: 120 },
      { id: 'av5', label: '头像5', width: 120, height: 120 },
      { id: 'av6', label: '头像6', width: 120, height: 120 }
    ],
    svg: `<svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <clipPath id="gc1"><circle cx="110" cy="100" r="60"/></clipPath>
    <clipPath id="gc2"><circle cx="300" cy="100" r="60"/></clipPath>
    <clipPath id="gc3"><circle cx="490" cy="100" r="60"/></clipPath>
    <clipPath id="gc4"><circle cx="110" cy="240" r="60"/></clipPath>
    <clipPath id="gc5"><circle cx="300" cy="240" r="60"/></clipPath>
    <clipPath id="gc6"><circle cx="490" cy="240" r="60"/></clipPath>
  </defs>
  <rect width="600" height="340" rx="12" fill="#1a1400"/>
  <circle cx="110" cy="100" r="62" fill="none" stroke="#f39c12" stroke-width="2"/>
  <g clip-path="url(#gc1)"><image data-image-slot="av1" href="placeholder" x="50" y="40" width="120" height="120" preserveAspectRatio="xMidYMid slice"/></g>
  <circle cx="300" cy="100" r="62" fill="none" stroke="#f39c12" stroke-width="2"/>
  <g clip-path="url(#gc2)"><image data-image-slot="av2" href="placeholder" x="240" y="40" width="120" height="120" preserveAspectRatio="xMidYMid slice"/></g>
  <circle cx="490" cy="100" r="62" fill="none" stroke="#f39c12" stroke-width="2"/>
  <g clip-path="url(#gc3)"><image data-image-slot="av3" href="placeholder" x="430" y="40" width="120" height="120" preserveAspectRatio="xMidYMid slice"/></g>
  <circle cx="110" cy="240" r="62" fill="none" stroke="#f39c12" stroke-width="2"/>
  <g clip-path="url(#gc4)"><image data-image-slot="av4" href="placeholder" x="50" y="180" width="120" height="120" preserveAspectRatio="xMidYMid slice"/></g>
  <circle cx="300" cy="240" r="62" fill="none" stroke="#f39c12" stroke-width="2"/>
  <g clip-path="url(#gc5)"><image data-image-slot="av5" href="placeholder" x="240" y="180" width="120" height="120" preserveAspectRatio="xMidYMid slice"/></g>
  <circle cx="490" cy="240" r="62" fill="none" stroke="#f39c12" stroke-width="2"/>
  <g clip-path="url(#gc6)"><image data-image-slot="av6" href="placeholder" x="430" y="180" width="120" height="120" preserveAspectRatio="xMidYMid slice"/></g>
  <text x="300" y="330" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  }
]

// ============================================================
// Category 6: card_flip_image — 卡牌翻转揭秘
// ============================================================

export const SVG_CARD_FLIP_IMAGE = [
  {
    id: 'card_flip_h',
    name: '单卡横翻',
    category: 'card_flip_image',
    tags: ['卡牌', '翻转', '横翻', '揭秘'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'card_flip_image',
    source: 'manifold',
    imageSlots: [
      { id: 'front', label: '正面', width: 400, height: 300 },
      { id: 'back', label: '背面', width: 400, height: 300 }
    ],
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="400" rx="12" fill="#1a0a0a"/>
  <g id="cfh_front" cursor="pointer" visibility="visible">
    <set attributeName="visibility" to="hidden" begin="cfh_front.click"/>
    <rect x="100" y="40" width="400" height="300" rx="10" fill="#2a1a1a"/>
    <image data-image-slot="front" href="placeholder" x="100" y="40" width="400" height="300" preserveAspectRatio="xMidYMid slice"/>
    <rect x="100" y="40" width="400" height="300" rx="10" fill="none" stroke="#e74c3c" stroke-width="2"/>
    <text x="300" y="360" text-anchor="middle" fill="#e74c3c" font-size="12" font-family="sans-serif">点击翻转</text>
  </g>
  <g visibility="hidden">
    <set attributeName="visibility" to="visible" begin="cfh_front.click"/>
    <rect x="100" y="40" width="400" height="300" rx="10" fill="#2a1a1a"/>
    <image data-image-slot="back" href="placeholder" x="100" y="40" width="400" height="300" preserveAspectRatio="xMidYMid slice"/>
    <rect x="100" y="40" width="400" height="300" rx="10" fill="none" stroke="#3498db" stroke-width="2"/>
  </g>
  <text x="300" y="390" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'card_flip_v',
    name: '单卡竖翻',
    category: 'card_flip_image',
    tags: ['卡牌', '翻转', '竖翻', '揭秘'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'card_flip_image',
    source: 'manifold',
    imageSlots: [
      { id: 'front', label: '正面', width: 320, height: 400 },
      { id: 'back', label: '背面', width: 320, height: 400 }
    ],
    svg: `<svg viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="500" rx="12" fill="#0a0a1a"/>
  <g id="cfv_front" cursor="pointer" visibility="visible">
    <set attributeName="visibility" to="hidden" begin="cfv_front.click"/>
    <rect x="140" y="30" width="320" height="400" rx="12" fill="#1a1a3a"/>
    <image data-image-slot="front" href="placeholder" x="140" y="30" width="320" height="400" preserveAspectRatio="xMidYMid slice"/>
    <rect x="140" y="30" width="320" height="400" rx="12" fill="none" stroke="#3498db" stroke-width="2"/>
    <circle cx="300" cy="460" r="14" fill="#3498db" opacity="0.8">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x="300" y="465" text-anchor="middle" fill="#fff" font-size="10" font-family="sans-serif">翻</text>
  </g>
  <g visibility="hidden">
    <set attributeName="visibility" to="visible" begin="cfv_front.click"/>
    <rect x="140" y="30" width="320" height="400" rx="12" fill="#1a1a3a"/>
    <image data-image-slot="back" href="placeholder" x="140" y="30" width="320" height="400" preserveAspectRatio="xMidYMid slice"/>
    <rect x="140" y="30" width="320" height="400" rx="12" fill="none" stroke="#e74c3c" stroke-width="2"/>
  </g>
  <text x="300" y="492" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'card_flip_dual',
    name: '双卡对比翻转',
    category: 'card_flip_image',
    tags: ['卡牌', '双卡', '对比', '翻转'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'card_flip_image',
    source: 'manifold',
    imageSlots: [
      { id: 'left_front', label: '左卡正面', width: 240, height: 300 },
      { id: 'left_back', label: '左卡背面', width: 240, height: 300 },
      { id: 'right_front', label: '右卡正面', width: 240, height: 300 },
      { id: 'right_back', label: '右卡背面', width: 240, height: 300 }
    ],
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="400" rx="12" fill="#0d0a14"/>
  <text x="300" y="25" text-anchor="middle" fill="#9b59b6" font-size="13" font-family="sans-serif" letter-spacing="4">VS</text>
  <g id="cfd_lf" cursor="pointer" visibility="visible">
    <set attributeName="visibility" to="hidden" begin="cfd_lf.click"/>
    <rect x="30" y="40" width="240" height="300" rx="10" fill="#1a1028"/>
    <image data-image-slot="left_front" href="placeholder" x="30" y="40" width="240" height="300" preserveAspectRatio="xMidYMid slice"/>
    <rect x="30" y="40" width="240" height="300" rx="10" fill="none" stroke="#9b59b6" stroke-width="2"/>
  </g>
  <g visibility="hidden"><set attributeName="visibility" to="visible" begin="cfd_lf.click"/>
    <rect x="30" y="40" width="240" height="300" rx="10" fill="#1a1028"/>
    <image data-image-slot="left_back" href="placeholder" x="30" y="40" width="240" height="300" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g id="cfd_rf" cursor="pointer" visibility="visible">
    <set attributeName="visibility" to="hidden" begin="cfd_rf.click"/>
    <rect x="330" y="40" width="240" height="300" rx="10" fill="#1a1028"/>
    <image data-image-slot="right_front" href="placeholder" x="330" y="40" width="240" height="300" preserveAspectRatio="xMidYMid slice"/>
    <rect x="330" y="40" width="240" height="300" rx="10" fill="none" stroke="#9b59b6" stroke-width="2"/>
  </g>
  <g visibility="hidden"><set attributeName="visibility" to="visible" begin="cfd_rf.click"/>
    <rect x="330" y="40" width="240" height="300" rx="10" fill="#1a1028"/>
    <image data-image-slot="right_back" href="placeholder" x="330" y="40" width="240" height="300" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <text x="150" y="365" text-anchor="middle" fill="#777" font-size="11" font-family="sans-serif">点击翻转</text>
  <text x="450" y="365" text-anchor="middle" fill="#777" font-size="11" font-family="sans-serif">点击翻转</text>
  <text x="300" y="390" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'card_flip_triple',
    name: '三卡横排翻转',
    category: 'card_flip_image',
    tags: ['卡牌', '三卡', '翻转', '横排'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'card_flip_image',
    source: 'manifold',
    imageSlots: [
      { id: 'c1f', label: '卡1正面', width: 160, height: 220 },
      { id: 'c1b', label: '卡1背面', width: 160, height: 220 },
      { id: 'c2f', label: '卡2正面', width: 160, height: 220 },
      { id: 'c2b', label: '卡2背面', width: 160, height: 220 },
      { id: 'c3f', label: '卡3正面', width: 160, height: 220 },
      { id: 'c3b', label: '卡3背面', width: 160, height: 220 }
    ],
    svg: `<svg viewBox="0 0 600 330" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="330" rx="12" fill="#0a1412"/>
  <g id="cft_1f" cursor="pointer" visibility="visible"><set attributeName="visibility" to="hidden" begin="cft_1f.click"/>
    <rect x="30" y="20" width="160" height="220" rx="8" fill="#0f2420"/>
    <image data-image-slot="c1f" href="placeholder" x="30" y="20" width="160" height="220" preserveAspectRatio="xMidYMid slice"/>
    <rect x="30" y="20" width="160" height="220" rx="8" fill="none" stroke="#1abc9c" stroke-width="2"/>
  </g>
  <g visibility="hidden"><set attributeName="visibility" to="visible" begin="cft_1f.click"/>
    <rect x="30" y="20" width="160" height="220" rx="8" fill="#0f2420"/>
    <image data-image-slot="c1b" href="placeholder" x="30" y="20" width="160" height="220" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g id="cft_2f" cursor="pointer" visibility="visible"><set attributeName="visibility" to="hidden" begin="cft_2f.click"/>
    <rect x="220" y="20" width="160" height="220" rx="8" fill="#0f2420"/>
    <image data-image-slot="c2f" href="placeholder" x="220" y="20" width="160" height="220" preserveAspectRatio="xMidYMid slice"/>
    <rect x="220" y="20" width="160" height="220" rx="8" fill="none" stroke="#1abc9c" stroke-width="2"/>
  </g>
  <g visibility="hidden"><set attributeName="visibility" to="visible" begin="cft_2f.click"/>
    <rect x="220" y="20" width="160" height="220" rx="8" fill="#0f2420"/>
    <image data-image-slot="c2b" href="placeholder" x="220" y="20" width="160" height="220" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <g id="cft_3f" cursor="pointer" visibility="visible"><set attributeName="visibility" to="hidden" begin="cft_3f.click"/>
    <rect x="410" y="20" width="160" height="220" rx="8" fill="#0f2420"/>
    <image data-image-slot="c3f" href="placeholder" x="410" y="20" width="160" height="220" preserveAspectRatio="xMidYMid slice"/>
    <rect x="410" y="20" width="160" height="220" rx="8" fill="none" stroke="#1abc9c" stroke-width="2"/>
  </g>
  <g visibility="hidden"><set attributeName="visibility" to="visible" begin="cft_3f.click"/>
    <rect x="410" y="20" width="160" height="220" rx="8" fill="#0f2420"/>
    <image data-image-slot="c3b" href="placeholder" x="410" y="20" width="160" height="220" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <text x="110" y="262" text-anchor="middle" fill="#1abc9c" font-size="10" font-family="sans-serif" opacity="0.7">点击翻转</text>
  <text x="300" y="262" text-anchor="middle" fill="#1abc9c" font-size="10" font-family="sans-serif" opacity="0.7">点击翻转</text>
  <text x="490" y="262" text-anchor="middle" fill="#1abc9c" font-size="10" font-family="sans-serif" opacity="0.7">点击翻转</text>
  <text x="300" y="310" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'card_flip_text_overlay',
    name: '翻转文字覆盖',
    category: 'card_flip_image',
    tags: ['卡牌', '翻转', '文字', '覆盖'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'card_flip_image',
    source: 'manifold',
    imageSlots: [
      { id: 'cover', label: '封面图', width: 440, height: 320 }
    ],
    svg: `<svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <rect width="600" height="420" rx="12" fill="#1a1a2e"/>
  <g id="cfto_front" cursor="pointer" visibility="visible">
    <set attributeName="visibility" to="hidden" begin="cfto_front.click"/>
    <rect x="80" y="30" width="440" height="320" rx="10" fill="#2a2a4a"/>
    <image data-image-slot="cover" href="placeholder" x="80" y="30" width="440" height="320" preserveAspectRatio="xMidYMid slice"/>
    <rect x="80" y="280" width="440" height="70" rx="0 0 10 10" fill="rgba(0,0,0,0.6)"/>
    <text x="300" y="320" text-anchor="middle" fill="#fff" font-size="16" font-family="serif">点击了解更多</text>
  </g>
  <g visibility="hidden">
    <set attributeName="visibility" to="visible" begin="cfto_front.click"/>
    <rect x="80" y="30" width="440" height="320" rx="10" fill="#2c3e50"/>
    <text x="300" y="140" text-anchor="middle" fill="#ecf0f1" font-size="20" font-family="serif" font-weight="700">标题文字</text>
    <line x1="200" y1="160" x2="400" y2="160" stroke="#3498db" stroke-width="2"/>
    <text x="300" y="200" text-anchor="middle" fill="#95a5a6" font-size="14" font-family="sans-serif">这里是详细描述文字</text>
    <text x="300" y="230" text-anchor="middle" fill="#95a5a6" font-size="14" font-family="sans-serif">可以放置更多内容</text>
    <text x="300" y="290" text-anchor="middle" fill="#3498db" font-size="12" font-family="sans-serif">-- Manifold --</text>
  </g>
  <text x="300" y="380" text-anchor="middle" fill="#667" font-size="12" font-family="sans-serif">点击卡片翻转</text>
  <text x="300" y="410" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  },
  {
    id: 'card_flip_scratch',
    name: '刮刮卡揭秘',
    category: 'card_flip_image',
    tags: ['刮刮卡', '揭秘', '惊喜', '互动'],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'card_flip_image',
    source: 'manifold',
    imageSlots: [
      { id: 'hidden_img', label: '隐藏图', width: 440, height: 300 }
    ],
    svg: `<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <!-- Manifold SVG Engine -->
  <defs>
    <linearGradient id="cfs_gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f1c40f"/><stop offset="50%" stop-color="#f39c12"/><stop offset="100%" stop-color="#e67e22"/></linearGradient>
    <pattern id="cfs_scratch" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="#daa520" opacity="0.3"/></pattern>
  </defs>
  <rect width="600" height="400" rx="12" fill="#1a1400"/>
  <rect x="80" y="30" width="440" height="300" rx="10" fill="#2a2000"/>
  <image data-image-slot="hidden_img" href="placeholder" x="80" y="30" width="440" height="300" preserveAspectRatio="xMidYMid slice"/>
  <g id="cfs_cover" cursor="pointer" opacity="1">
    <animate attributeName="opacity" from="1" to="0" begin="cfs_cover.click" dur="0.6s" fill="freeze"/>
    <rect x="80" y="30" width="440" height="300" rx="10" fill="url(#cfs_gold)"/>
    <rect x="80" y="30" width="440" height="300" rx="10" fill="url(#cfs_scratch)"/>
    <text x="300" y="170" text-anchor="middle" fill="#fff" font-size="28" font-family="serif" font-weight="700">?</text>
    <text x="300" y="210" text-anchor="middle" fill="#fff" font-size="14" font-family="sans-serif" opacity="0.9">点击刮开查看</text>
  </g>
  <text x="300" y="360" text-anchor="middle" fill="#8a7a2a" font-size="12" font-family="sans-serif">点击揭晓惊喜</text>
  <text x="300" y="388" text-anchor="middle" fill="#555" font-size="11" font-family="sans-serif">Manifold</text>
</svg>`
  }
]
