/**
 * SVG Templates Expanded - 10 新交互类别 60+ 模板
 *
 * 新增类别:
 *  1. slider_compare  - 前后对比滑块 (6)
 *  2. photo_wall      - 照片墙画廊 (6)
 *  3. infographic     - 信息图表流 (6)
 *  4. quiz_poll       - 投票问答 (6)
 *  5. faq_accordion   - FAQ手风琴 (6)
 *  6. envelope_letter - 信封拆信 (6)
 *  7. h_scroll        - 横向滚动条 (6)
 *  8. num_counter     - 数字计数器 (6)
 *  9. atmosphere      - 氛围特效 (6)
 * 10. retro_vintage   - 复古装饰 (6)
 *
 * 全部使用 SMIL 动画,兼容微信 WebView
 */

// ==================== 1. 前后对比滑块 slider_compare ====================
export const SVG_SLIDER_COMPARE = [
  {
    id: 'compare_curtain_01',
    name: '帷幕揭开对比',
    category: 'slider_compare',
    tags: ['前后对比', '幕布', '揭秘', '效果展示'],
    colorScheme: '#2980b9',
    interactive: true,
    interactionType: 'click-compare',
    svg: `<svg viewBox="0 0 600 360" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cmp01_before" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e8d5b7"/><stop offset="100%" stop-color="#c4a882"/></linearGradient>
    <linearGradient id="cmp01_after" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2980b9"/><stop offset="100%" stop-color="#1abc9c"/></linearGradient>
    <clipPath id="cmp01_clip"><rect x="0" y="0" width="600" height="360" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#cmp01_clip)">
    <rect width="600" height="360" fill="url(#cmp01_after)"/>
    <text x="450" y="180" text-anchor="middle" font-size="28" fill="rgba(255,255,255,0.9)" font-weight="bold">AFTER</text>
    <text x="450" y="210" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.6)">焕然一新</text>
    <g id="cmp01_cover" style="cursor:pointer;">
      <rect width="600" height="360" fill="url(#cmp01_before)"/>
      <text x="300" y="160" text-anchor="middle" font-size="28" fill="rgba(120,80,40,0.9)" font-weight="bold">BEFORE</text>
      <text x="300" y="190" text-anchor="middle" font-size="14" fill="rgba(120,80,40,0.6)">点击查看变化</text>
      <circle cx="300" cy="240" r="20" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" stroke-width="2">
        <animate attributeName="r" values="20;24;20" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <polygon points="295,232 310,240 295,248" fill="rgba(255,255,255,0.8)"/>
      <animate attributeName="width" from="600" to="0" begin="click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </g>
  </g>
</svg>`
  },
  {
    id: 'compare_split_02',
    name: '左右分屏对比',
    category: 'slider_compare',
    tags: ['左右对比', '分屏', '设计', '改版'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-split-compare',
    svg: `<svg viewBox="0 0 600 360" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cmp02_l" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffecd2"/><stop offset="100%" stop-color="#fcb69f"/></linearGradient>
    <linearGradient id="cmp02_r" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#a18cd1"/><stop offset="100%" stop-color="#fbc2eb"/></linearGradient>
    <clipPath id="cmp02_clip"><rect width="600" height="360" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#cmp02_clip)">
    <rect width="300" height="360" fill="url(#cmp02_l)"/>
    <rect x="300" width="300" height="360" fill="url(#cmp02_r)"/>
    <text x="150" y="100" text-anchor="middle" font-size="16" fill="#c0392b" font-weight="bold">V1.0</text>
    <rect x="50" y="120" width="200" height="30" rx="4" fill="rgba(192,57,43,0.15)"/>
    <rect x="50" y="160" width="160" height="30" rx="4" fill="rgba(192,57,43,0.1)"/>
    <rect x="50" y="200" width="180" height="30" rx="4" fill="rgba(192,57,43,0.1)"/>
    <text x="450" y="100" text-anchor="middle" font-size="16" fill="#8e44ad" font-weight="bold">V2.0</text>
    <rect x="350" y="120" width="200" height="30" rx="8" fill="rgba(142,68,173,0.15)"/>
    <rect x="350" y="160" width="160" height="30" rx="8" fill="rgba(142,68,173,0.1)"/>
    <rect x="350" y="200" width="180" height="30" rx="8" fill="rgba(142,68,173,0.1)"/>
    <line x1="300" y1="0" x2="300" y2="360" stroke="white" stroke-width="3" stroke-dasharray="8 4"/>
    <text x="300" y="320" text-anchor="middle" font-size="13" fill="#666">点击查看设计对比详情</text>
    <g id="cmp02_detail" opacity="0">
      <rect x="100" y="250" width="400" height="80" rx="10" fill="white" opacity="0.95"/>
      <text x="300" y="280" text-anchor="middle" font-size="14" fill="#333" font-weight="bold">设计升级要点</text>
      <text x="300" y="305" text-anchor="middle" font-size="12" fill="#666">圆角 + 渐变 + 卡片化 = 更现代的视觉体验</text>
    </g>
  </g>
  <rect x="0" y="0" width="600" height="360" fill="transparent" style="cursor:pointer;" id="cmp02_btn">
    <set attributeName="width" to="0" begin="click"/>
  </rect>
  <animate xlink:href="#cmp02_detail" attributeName="opacity" from="0" to="1" begin="cmp02_btn.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
</svg>`
  },
  {
    id: 'compare_circle_03',
    name: '圆形擦除对比',
    category: 'slider_compare',
    tags: ['圆形', '擦除', '对比', '创意'],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'click-circle-compare',
    svg: `<svg viewBox="0 0 600 360" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cmp03_old" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#bdc3c7"/><stop offset="100%" stop-color="#95a5a6"/></linearGradient>
    <linearGradient id="cmp03_new" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#27ae60"/><stop offset="100%" stop-color="#2ecc71"/></linearGradient>
    <clipPath id="cmp03_circle"><circle id="cmp03_c" cx="300" cy="180" r="0"/></clipPath>
    <clipPath id="cmp03_outer"><rect width="600" height="360" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#cmp03_outer)">
    <rect width="600" height="360" fill="url(#cmp03_old)"/>
    <text x="300" y="170" text-anchor="middle" font-size="22" fill="rgba(0,0,0,0.3)" font-weight="bold">BEFORE</text>
    <text x="300" y="200" text-anchor="middle" font-size="13" fill="rgba(0,0,0,0.2)">点击中心查看效果</text>
    <g clip-path="url(#cmp03_circle)">
      <rect width="600" height="360" fill="url(#cmp03_new)"/>
      <text x="300" y="170" text-anchor="middle" font-size="22" fill="white" font-weight="bold">AFTER</text>
      <text x="300" y="200" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.8)">全新升级</text>
    </g>
    <circle cx="300" cy="180" r="30" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2" style="cursor:pointer;" id="cmp03_btn">
      <animate attributeName="r" values="30;34;30" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x="300" y="185" text-anchor="middle" font-size="11" fill="white" style="pointer-events:none;">GO</text>
  </g>
  <animate xlink:href="#cmp03_c" attributeName="r" from="0" to="400" begin="cmp03_btn.click" dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
</svg>`
  },
  {
    id: 'compare_blinds_04',
    name: '百叶窗切换对比',
    category: 'slider_compare',
    tags: ['百叶窗', '切换', '对比', '酷炫'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-blinds-compare',
    svg: `<svg viewBox="0 0 600 360" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cmp04_a" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f39c12"/><stop offset="100%" stop-color="#e67e22"/></linearGradient>
    <linearGradient id="cmp04_b" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3498db"/><stop offset="100%" stop-color="#2980b9"/></linearGradient>
    <clipPath id="cmp04_outer"><rect width="600" height="360" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#cmp04_outer)">
    <rect width="600" height="360" fill="url(#cmp04_b)"/>
    <text x="300" y="180" text-anchor="middle" font-size="24" fill="white" font-weight="bold">NEW DESIGN</text>
    <g id="cmp04_blinds" style="cursor:pointer;">
      <rect x="0" y="0" width="120" height="360" fill="url(#cmp04_a)"><animate attributeName="width" from="120" to="0" begin="cmp04_blinds.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <rect x="120" y="0" width="120" height="360" fill="url(#cmp04_a)"><animate attributeName="width" from="120" to="0" begin="cmp04_blinds.click+0.1s" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <rect x="240" y="0" width="120" height="360" fill="url(#cmp04_a)"><animate attributeName="width" from="120" to="0" begin="cmp04_blinds.click+0.2s" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <rect x="360" y="0" width="120" height="360" fill="url(#cmp04_a)"><animate attributeName="width" from="120" to="0" begin="cmp04_blinds.click+0.3s" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <rect x="480" y="0" width="120" height="360" fill="url(#cmp04_a)"><animate attributeName="width" from="120" to="0" begin="cmp04_blinds.click+0.4s" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <text x="300" y="170" text-anchor="middle" font-size="24" fill="white" font-weight="bold">OLD DESIGN</text>
      <text x="300" y="210" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.7)">点击百叶窗揭晓新设计</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'compare_diagonal_05',
    name: '对角线分割对比',
    category: 'slider_compare',
    tags: ['对角线', '几何', '对比', '时尚'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-diagonal-compare',
    svg: `<svg viewBox="0 0 600 360" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cmp05_warm" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e74c3c"/><stop offset="100%" stop-color="#f39c12"/></linearGradient>
    <linearGradient id="cmp05_cool" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9b59b6"/><stop offset="100%" stop-color="#3498db"/></linearGradient>
    <clipPath id="cmp05_outer"><rect width="600" height="360" rx="12"/></clipPath>
    <clipPath id="cmp05_tri"><polygon points="0,0 600,0 0,360"/></clipPath>
  </defs>
  <g clip-path="url(#cmp05_outer)">
    <rect width="600" height="360" fill="url(#cmp05_cool)"/>
    <text x="420" y="260" text-anchor="middle" font-size="20" fill="white" font-weight="bold">AFTER</text>
    <g clip-path="url(#cmp05_tri)">
      <rect width="600" height="360" fill="url(#cmp05_warm)"/>
      <text x="180" y="130" text-anchor="middle" font-size="20" fill="white" font-weight="bold">BEFORE</text>
    </g>
    <line x1="0" y1="360" x2="600" y2="0" stroke="white" stroke-width="3" opacity="0.6"/>
    <circle cx="300" cy="180" r="22" fill="white" opacity="0.9" style="cursor:pointer;" id="cmp05_btn">
      <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x="300" y="185" text-anchor="middle" font-size="10" fill="#333" font-weight="bold" style="pointer-events:none;">VS</text>
  </g>
</svg>`
  },
  {
    id: 'compare_flip_06',
    name: '翻转卡片对比',
    category: 'slider_compare',
    tags: ['翻转', '卡片', '3D', '对比'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-flip-compare',
    svg: `<svg viewBox="0 0 600 360" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cmp06_front" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1abc9c"/><stop offset="100%" stop-color="#16a085"/></linearGradient>
    <linearGradient id="cmp06_back" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e74c3c"/><stop offset="100%" stop-color="#c0392b"/></linearGradient>
    <clipPath id="cmp06_outer"><rect width="600" height="360" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#cmp06_outer)">
    <rect width="600" height="360" fill="url(#cmp06_back)"/>
    <text x="300" y="160" text-anchor="middle" font-size="20" fill="white" font-weight="bold">BEFORE</text>
    <text x="300" y="190" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.7)">改造前的样子</text>
    <rect x="150" y="220" width="300" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
    <rect x="180" y="240" width="240" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
    <g id="cmp06_card" style="cursor:pointer;">
      <rect width="600" height="360" fill="url(#cmp06_front)" rx="12"/>
      <text x="300" y="140" text-anchor="middle" font-size="20" fill="white" font-weight="bold">AFTER</text>
      <text x="300" y="170" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.8)">焕然一新 | 点击翻转查看原貌</text>
      <rect x="150" y="200" width="300" height="100" rx="10" fill="rgba(255,255,255,0.1)"/>
      <text x="300" y="240" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.7)">新方案展示区域</text>
      <text x="300" y="260" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.5)">现代化 | 简洁 | 高效</text>
      <animateTransform attributeName="transform" type="scale" from="1 1" to="1 0" begin="click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </g>
  </g>
</svg>`
  }
]

// ==================== 2. 照片墙画廊 photo_wall ====================
export const SVG_PHOTO_WALL = [
  {
    id: 'wall_grid_01',
    name: '九宫格展开',
    category: 'photo_wall',
    tags: ['九宫格', '画廊', '照片墙', '展开'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-grid-expand',
    svg: `<svg viewBox="0 0 600 600" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pw01_1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e74c3c"/><stop offset="100%" stop-color="#c0392b"/></linearGradient>
    <linearGradient id="pw01_2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f39c12"/><stop offset="100%" stop-color="#e67e22"/></linearGradient>
    <linearGradient id="pw01_3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2ecc71"/><stop offset="100%" stop-color="#27ae60"/></linearGradient>
    <linearGradient id="pw01_4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3498db"/><stop offset="100%" stop-color="#2980b9"/></linearGradient>
    <linearGradient id="pw01_5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9b59b6"/><stop offset="100%" stop-color="#8e44ad"/></linearGradient>
    <linearGradient id="pw01_6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1abc9c"/><stop offset="100%" stop-color="#16a085"/></linearGradient>
    <linearGradient id="pw01_7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e67e22"/><stop offset="100%" stop-color="#d35400"/></linearGradient>
    <linearGradient id="pw01_8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#34495e"/><stop offset="100%" stop-color="#2c3e50"/></linearGradient>
    <linearGradient id="pw01_9" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f1c40f"/><stop offset="100%" stop-color="#f39c12"/></linearGradient>
  </defs>
  <rect width="600" height="600" fill="#ecf0f1" rx="12"/>
  <g id="pw01_grid" style="cursor:pointer;">
    <rect x="10" y="10" width="186" height="186" rx="8" fill="url(#pw01_1)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw01_grid.click" dur="0.3s" fill="freeze"/></rect>
    <rect x="206" y="10" width="186" height="186" rx="8" fill="url(#pw01_2)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw01_grid.click+0.1s" dur="0.3s" fill="freeze"/></rect>
    <rect x="402" y="10" width="186" height="186" rx="8" fill="url(#pw01_3)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw01_grid.click+0.2s" dur="0.3s" fill="freeze"/></rect>
    <rect x="10" y="206" width="186" height="186" rx="8" fill="url(#pw01_4)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw01_grid.click+0.15s" dur="0.3s" fill="freeze"/></rect>
    <rect x="206" y="206" width="186" height="186" rx="8" fill="url(#pw01_5)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw01_grid.click+0.25s" dur="0.3s" fill="freeze"/></rect>
    <rect x="402" y="206" width="186" height="186" rx="8" fill="url(#pw01_6)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw01_grid.click+0.3s" dur="0.3s" fill="freeze"/></rect>
    <rect x="10" y="402" width="186" height="186" rx="8" fill="url(#pw01_7)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw01_grid.click+0.25s" dur="0.3s" fill="freeze"/></rect>
    <rect x="206" y="402" width="186" height="186" rx="8" fill="url(#pw01_8)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw01_grid.click+0.35s" dur="0.3s" fill="freeze"/></rect>
    <rect x="402" y="402" width="186" height="186" rx="8" fill="url(#pw01_9)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw01_grid.click+0.4s" dur="0.3s" fill="freeze"/></rect>
    <text x="300" y="290" text-anchor="middle" font-size="18" fill="#999" font-weight="bold">点击展开九宫格画廊</text>
    <circle cx="300" cy="320" r="15" fill="none" stroke="#bbb" stroke-width="2"><animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/></circle>
  </g>
</svg>`
  },
  {
    id: 'wall_masonry_02',
    name: '瀑布流画廊',
    category: 'photo_wall',
    tags: ['瀑布流', '不规则', '画廊', 'Pinterest'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-masonry',
    svg: `<svg viewBox="0 0 600 500" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pw02_a" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e8daef"/><stop offset="100%" stop-color="#d2b4de"/></linearGradient>
    <linearGradient id="pw02_b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#aed6f1"/><stop offset="100%" stop-color="#85c1e9"/></linearGradient>
    <linearGradient id="pw02_c" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#a9dfbf"/><stop offset="100%" stop-color="#82e0aa"/></linearGradient>
    <linearGradient id="pw02_d" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f9e79f"/><stop offset="100%" stop-color="#f7dc6f"/></linearGradient>
    <linearGradient id="pw02_e" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f5b7b1"/><stop offset="100%" stop-color="#f1948a"/></linearGradient>
  </defs>
  <rect width="600" height="500" fill="#fafafa" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#8e44ad" font-weight="bold">瀑 布 流 画 廊</text>
  <g id="pw02_col1">
    <rect x="15" y="50" width="180" height="140" rx="10" fill="url(#pw02_a)"/><text x="105" y="125" text-anchor="middle" font-size="12" fill="#7d3c98">01</text>
    <rect x="15" y="200" width="180" height="200" rx="10" fill="url(#pw02_b)"/><text x="105" y="305" text-anchor="middle" font-size="12" fill="#2e86c1">02</text>
    <rect x="15" y="410" width="180" height="80" rx="10" fill="url(#pw02_c)"/><text x="105" y="455" text-anchor="middle" font-size="12" fill="#1e8449">03</text>
  </g>
  <g id="pw02_col2">
    <rect x="210" y="50" width="180" height="200" rx="10" fill="url(#pw02_d)"/><text x="300" y="155" text-anchor="middle" font-size="12" fill="#b7950b">04</text>
    <rect x="210" y="260" width="180" height="100" rx="10" fill="url(#pw02_e)"/><text x="300" y="315" text-anchor="middle" font-size="12" fill="#c0392b">05</text>
    <rect x="210" y="370" width="180" height="120" rx="10" fill="url(#pw02_a)"/><text x="300" y="435" text-anchor="middle" font-size="12" fill="#7d3c98">06</text>
  </g>
  <g id="pw02_col3">
    <rect x="405" y="50" width="180" height="100" rx="10" fill="url(#pw02_c)"/><text x="495" y="105" text-anchor="middle" font-size="12" fill="#1e8449">07</text>
    <rect x="405" y="160" width="180" height="160" rx="10" fill="url(#pw02_e)"/><text x="495" y="245" text-anchor="middle" font-size="12" fill="#c0392b">08</text>
    <rect x="405" y="330" width="180" height="160" rx="10" fill="url(#pw02_b)"/><text x="495" y="415" text-anchor="middle" font-size="12" fill="#2e86c1">09</text>
  </g>
</svg>`
  },
  {
    id: 'wall_polaroid_03',
    name: '拍立得散落',
    category: 'photo_wall',
    tags: ['拍立得', '照片', '随机', '文艺'],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click-polaroid',
    svg: `<svg viewBox="0 0 600 450" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="pw03_shadow"><feDropShadow dx="2" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.15)"/></filter>
  </defs>
  <rect width="600" height="450" fill="#f5f0e8" rx="12"/>
  <g filter="url(#pw03_shadow)">
    <g transform="rotate(-8 120 180)" id="pw03_p1" style="cursor:pointer;">
      <rect x="40" y="80" width="160" height="200" fill="white" rx="2"/>
      <rect x="52" y="92" width="136" height="136" fill="#e74c3c" rx="1"/>
      <text x="120" y="260" text-anchor="middle" font-size="11" fill="#666">夏日回忆</text>
      <animate attributeName="opacity" from="0" to="1" begin="0.2s" dur="0.5s" fill="freeze"/>
    </g>
    <g transform="rotate(5 300 200)" id="pw03_p2" style="cursor:pointer;">
      <rect x="220" y="60" width="160" height="200" fill="white" rx="2"/>
      <rect x="232" y="72" width="136" height="136" fill="#3498db" rx="1"/>
      <text x="300" y="240" text-anchor="middle" font-size="11" fill="#666">海边漫步</text>
      <animate attributeName="opacity" from="0" to="1" begin="0.4s" dur="0.5s" fill="freeze"/>
    </g>
    <g transform="rotate(-3 480 180)" id="pw03_p3" style="cursor:pointer;">
      <rect x="400" y="90" width="160" height="200" fill="white" rx="2"/>
      <rect x="412" y="102" width="136" height="136" fill="#2ecc71" rx="1"/>
      <text x="480" y="270" text-anchor="middle" font-size="11" fill="#666">山间小径</text>
      <animate attributeName="opacity" from="0" to="1" begin="0.6s" dur="0.5s" fill="freeze"/>
    </g>
    <g transform="rotate(7 180 380)" id="pw03_p4" style="cursor:pointer;">
      <rect x="100" y="290" width="160" height="200" fill="white" rx="2" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="pw03_p1.click" dur="0.5s" fill="freeze"/>
      </rect>
      <rect x="112" y="302" width="136" height="136" fill="#f39c12" rx="1" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="pw03_p1.click" dur="0.5s" fill="freeze"/>
      </rect>
    </g>
    <g transform="rotate(-5 420 380)" id="pw03_p5" style="cursor:pointer;">
      <rect x="340" y="280" width="160" height="200" fill="white" rx="2" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="pw03_p2.click" dur="0.5s" fill="freeze"/>
      </rect>
      <rect x="352" y="292" width="136" height="136" fill="#9b59b6" rx="1" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="pw03_p2.click" dur="0.5s" fill="freeze"/>
      </rect>
    </g>
  </g>
</svg>`
  },
  {
    id: 'wall_filmstrip_04',
    name: '胶片条展示',
    category: 'photo_wall',
    tags: ['胶片', '电影', '复古', '连续'],
    colorScheme: '#2c3e50',
    interactive: false,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="200" fill="#1a1a1a" rx="8"/>
  <rect x="0" y="15" width="600" height="170" fill="#2c3e50"/>
  <g fill="#1a1a1a">
    <rect x="15" y="0" width="12" height="15" rx="1"/><rect x="42" y="0" width="12" height="15" rx="1"/><rect x="69" y="0" width="12" height="15" rx="1"/><rect x="96" y="0" width="12" height="15" rx="1"/><rect x="123" y="0" width="12" height="15" rx="1"/><rect x="150" y="0" width="12" height="15" rx="1"/><rect x="177" y="0" width="12" height="15" rx="1"/><rect x="204" y="0" width="12" height="15" rx="1"/><rect x="231" y="0" width="12" height="15" rx="1"/><rect x="258" y="0" width="12" height="15" rx="1"/><rect x="285" y="0" width="12" height="15" rx="1"/><rect x="312" y="0" width="12" height="15" rx="1"/><rect x="339" y="0" width="12" height="15" rx="1"/><rect x="366" y="0" width="12" height="15" rx="1"/><rect x="393" y="0" width="12" height="15" rx="1"/><rect x="420" y="0" width="12" height="15" rx="1"/><rect x="447" y="0" width="12" height="15" rx="1"/><rect x="474" y="0" width="12" height="15" rx="1"/><rect x="501" y="0" width="12" height="15" rx="1"/><rect x="528" y="0" width="12" height="15" rx="1"/><rect x="555" y="0" width="12" height="15" rx="1"/>
    <rect x="15" y="185" width="12" height="15" rx="1"/><rect x="42" y="185" width="12" height="15" rx="1"/><rect x="69" y="185" width="12" height="15" rx="1"/><rect x="96" y="185" width="12" height="15" rx="1"/><rect x="123" y="185" width="12" height="15" rx="1"/><rect x="150" y="185" width="12" height="15" rx="1"/><rect x="177" y="185" width="12" height="15" rx="1"/><rect x="204" y="185" width="12" height="15" rx="1"/><rect x="231" y="185" width="12" height="15" rx="1"/><rect x="258" y="185" width="12" height="15" rx="1"/><rect x="285" y="185" width="12" height="15" rx="1"/><rect x="312" y="185" width="12" height="15" rx="1"/><rect x="339" y="185" width="12" height="15" rx="1"/><rect x="366" y="185" width="12" height="15" rx="1"/><rect x="393" y="185" width="12" height="15" rx="1"/><rect x="420" y="185" width="12" height="15" rx="1"/><rect x="447" y="185" width="12" height="15" rx="1"/><rect x="474" y="185" width="12" height="15" rx="1"/><rect x="501" y="185" width="12" height="15" rx="1"/><rect x="528" y="185" width="12" height="15" rx="1"/><rect x="555" y="185" width="12" height="15" rx="1"/>
  </g>
  <rect x="20" y="30" width="100" height="140" rx="3" fill="#e74c3c"/>
  <rect x="130" y="30" width="100" height="140" rx="3" fill="#f39c12"/>
  <rect x="240" y="30" width="100" height="140" rx="3" fill="#2ecc71"/>
  <rect x="350" y="30" width="100" height="140" rx="3" fill="#3498db"/>
  <rect x="460" y="30" width="120" height="140" rx="3" fill="#9b59b6"/>
  <text x="70" y="105" text-anchor="middle" font-size="11" fill="white">01</text>
  <text x="180" y="105" text-anchor="middle" font-size="11" fill="white">02</text>
  <text x="290" y="105" text-anchor="middle" font-size="11" fill="white">03</text>
  <text x="400" y="105" text-anchor="middle" font-size="11" fill="white">04</text>
  <text x="520" y="105" text-anchor="middle" font-size="11" fill="white">05</text>
</svg>`
  },
  {
    id: 'wall_carousel_05',
    name: '卡片轮播展示',
    category: 'photo_wall',
    tags: ['轮播', '卡片', '滑动', '展示'],
    colorScheme: '#16a085',
    interactive: true,
    interactionType: 'click-carousel',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pw05_bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0d3b66"/><stop offset="100%" stop-color="#1d3557"/></linearGradient>
  </defs>
  <rect width="600" height="350" fill="url(#pw05_bg)" rx="12"/>
  <rect x="50" y="40" width="160" height="240" rx="12" fill="#e76f51" opacity="0.4"/>
  <rect x="130" y="30" width="160" height="260" rx="12" fill="#f4a261" opacity="0.6"/>
  <g id="pw05_main" style="cursor:pointer;">
    <rect x="220" y="20" width="160" height="280" rx="12" fill="#2a9d8f"/>
    <text x="300" y="150" text-anchor="middle" font-size="16" fill="white" font-weight="bold">FEATURED</text>
    <text x="300" y="175" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)">精选内容</text>
    <rect x="240" y="200" width="120" height="60" rx="8" fill="rgba(255,255,255,0.15)"/>
    <text x="300" y="235" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.6)">点击查看详情</text>
  </g>
  <rect x="310" y="30" width="160" height="260" rx="12" fill="#e9c46a" opacity="0.6"/>
  <rect x="390" y="40" width="160" height="240" rx="12" fill="#264653" opacity="0.4"/>
  <g>
    <circle cx="270" y="340" r="4" fill="rgba(255,255,255,0.3)"/>
    <circle cx="285" cy="340" r="4" fill="rgba(255,255,255,0.3)"/>
    <circle cx="300" cy="340" r="5" fill="white"/>
    <circle cx="315" cy="340" r="4" fill="rgba(255,255,255,0.3)"/>
    <circle cx="330" cy="340" r="4" fill="rgba(255,255,255,0.3)"/>
  </g>
</svg>`
  },
  {
    id: 'wall_mosaic_06',
    name: '马赛克拼图',
    category: 'photo_wall',
    tags: ['马赛克', '拼图', '彩色', '几何'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-mosaic-reveal',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="#2c3e50" rx="12"/>
  <g id="pw06_mosaic" style="cursor:pointer;">
    <rect x="10" y="10" width="140" height="185" rx="6" fill="#e74c3c" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw06_mosaic.click" dur="0.2s" fill="freeze"/></rect>
    <rect x="160" y="10" width="280" height="185" rx="6" fill="#3498db" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw06_mosaic.click+0.1s" dur="0.2s" fill="freeze"/></rect>
    <rect x="450" y="10" width="140" height="90" rx="6" fill="#2ecc71" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw06_mosaic.click+0.15s" dur="0.2s" fill="freeze"/></rect>
    <rect x="450" y="105" width="140" height="90" rx="6" fill="#f1c40f" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw06_mosaic.click+0.2s" dur="0.2s" fill="freeze"/></rect>
    <rect x="10" y="205" width="190" height="90" rx="6" fill="#9b59b6" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw06_mosaic.click+0.12s" dur="0.2s" fill="freeze"/></rect>
    <rect x="210" y="205" width="190" height="185" rx="6" fill="#1abc9c" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw06_mosaic.click+0.18s" dur="0.2s" fill="freeze"/></rect>
    <rect x="410" y="205" width="180" height="90" rx="6" fill="#e67e22" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw06_mosaic.click+0.22s" dur="0.2s" fill="freeze"/></rect>
    <rect x="10" y="305" width="190" height="85" rx="6" fill="#f39c12" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw06_mosaic.click+0.25s" dur="0.2s" fill="freeze"/></rect>
    <rect x="410" y="305" width="180" height="85" rx="6" fill="#c0392b" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="pw06_mosaic.click+0.28s" dur="0.2s" fill="freeze"/></rect>
    <text x="300" y="195" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.5)">点击拼出马赛克画廊</text>
  </g>
</svg>`
  }
]

// ==================== 3. 信息图表流 infographic ====================
export const SVG_INFOGRAPHIC = [
  {
    id: 'info_funnel_01',
    name: '漏斗转化图',
    category: 'infographic',
    tags: ['漏斗', '转化', '数据', '营销'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-funnel',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="inf01_1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3498db"/><stop offset="100%" stop-color="#2980b9"/></linearGradient>
    <linearGradient id="inf01_2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#2ecc71"/><stop offset="100%" stop-color="#27ae60"/></linearGradient>
    <linearGradient id="inf01_3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f39c12"/><stop offset="100%" stop-color="#e67e22"/></linearGradient>
    <linearGradient id="inf01_4" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#e74c3c"/><stop offset="100%" stop-color="#c0392b"/></linearGradient>
  </defs>
  <rect width="600" height="400" fill="#fafafa" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="18" fill="#2c3e50" font-weight="bold">转化漏斗</text>
  <g id="inf01_funnel" style="cursor:pointer;">
    <polygon points="100,60 500,60 460,140 140,140" fill="url(#inf01_1)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf01_funnel.click" dur="0.3s" fill="freeze"/>
    </polygon>
    <text x="300" y="108" text-anchor="middle" font-size="14" fill="white" font-weight="bold" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf01_funnel.click+0.1s" dur="0.3s" fill="freeze"/>
      访问量 10,000
    </text>
    <polygon points="140,150 460,150 410,230 190,230" fill="url(#inf01_2)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf01_funnel.click+0.2s" dur="0.3s" fill="freeze"/>
    </polygon>
    <text x="300" y="198" text-anchor="middle" font-size="14" fill="white" font-weight="bold" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf01_funnel.click+0.3s" dur="0.3s" fill="freeze"/>
      注册量 3,200
    </text>
    <polygon points="190,240 410,240 370,320 230,320" fill="url(#inf01_3)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf01_funnel.click+0.4s" dur="0.3s" fill="freeze"/>
    </polygon>
    <text x="300" y="288" text-anchor="middle" font-size="14" fill="white" font-weight="bold" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf01_funnel.click+0.5s" dur="0.3s" fill="freeze"/>
      付费量 890
    </text>
    <polygon points="230,330 370,330 340,380 260,380" fill="url(#inf01_4)" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf01_funnel.click+0.6s" dur="0.3s" fill="freeze"/>
    </polygon>
    <text x="300" y="362" text-anchor="middle" font-size="13" fill="white" font-weight="bold" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf01_funnel.click+0.7s" dur="0.3s" fill="freeze"/>
      复购 320
    </text>
    <text x="300" y="220" text-anchor="middle" font-size="15" fill="#bbb">点击展开漏斗数据</text>
  </g>
</svg>`
  },
  {
    id: 'info_process_02',
    name: '流程步骤图',
    category: 'infographic',
    tags: ['流程', '步骤', '教程', '指南'],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'click-process',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="300" fill="white" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">操作流程</text>
  <line x1="100" y1="120" x2="500" y2="120" stroke="#ecf0f1" stroke-width="4" stroke-linecap="round"/>
  <line x1="100" y1="120" x2="500" y2="120" stroke="#27ae60" stroke-width="4" stroke-linecap="round" stroke-dasharray="400" stroke-dashoffset="400">
    <animate attributeName="stroke-dashoffset" from="400" to="0" begin="1s" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
  </line>
  <g>
    <circle cx="100" cy="120" r="20" fill="white" stroke="#27ae60" stroke-width="3"/>
    <text x="100" y="125" text-anchor="middle" font-size="14" fill="#27ae60" font-weight="bold">1</text>
    <text x="100" y="165" text-anchor="middle" font-size="12" fill="#666">注册</text>
    <circle cx="233" cy="120" r="20" fill="white" stroke="#3498db" stroke-width="3"/>
    <text x="233" y="125" text-anchor="middle" font-size="14" fill="#3498db" font-weight="bold">2</text>
    <text x="233" y="165" text-anchor="middle" font-size="12" fill="#666">配置</text>
    <circle cx="366" cy="120" r="20" fill="white" stroke="#f39c12" stroke-width="3"/>
    <text x="366" y="125" text-anchor="middle" font-size="14" fill="#f39c12" font-weight="bold">3</text>
    <text x="366" y="165" text-anchor="middle" font-size="12" fill="#666">发布</text>
    <circle cx="500" cy="120" r="20" fill="white" stroke="#e74c3c" stroke-width="3"/>
    <text x="500" y="125" text-anchor="middle" font-size="14" fill="#e74c3c" font-weight="bold">4</text>
    <text x="500" y="165" text-anchor="middle" font-size="12" fill="#666">完成</text>
  </g>
  <foreignObject x="50" y="190" width="500" height="90">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:13px;color:#888;text-align:center;line-height:1.6;">
      <p style="margin:0;">简单四步，轻松完成全部流程</p>
      <p style="margin:4px 0 0;font-size:11px;color:#bbb;">每个步骤都有详细指引，确保零失误</p>
    </div>
  </foreignObject>
</svg>`
  },
  {
    id: 'info_pie_03',
    name: '饼图数据展示',
    category: 'infographic',
    tags: ['饼图', '占比', '统计', '分析'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-pie',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="350" fill="white" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">用户分布</text>
  <g transform="translate(200,190)" id="inf03_pie" style="cursor:pointer;">
    <circle r="120" fill="#ecf0f1"/>
    <circle r="120" fill="transparent" stroke="#9b59b6" stroke-width="240" stroke-dasharray="0 754" transform="rotate(-90)">
      <animate attributeName="stroke-dasharray" from="0 754" to="301 754" begin="inf03_pie.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </circle>
    <circle r="120" fill="transparent" stroke="#3498db" stroke-width="240" stroke-dasharray="0 754" transform="rotate(54)">
      <animate attributeName="stroke-dasharray" from="0 754" to="188 754" begin="inf03_pie.click+0.2s" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </circle>
    <circle r="120" fill="transparent" stroke="#2ecc71" stroke-width="240" stroke-dasharray="0 754" transform="rotate(144)">
      <animate attributeName="stroke-dasharray" from="0 754" to="151 754" begin="inf03_pie.click+0.4s" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </circle>
    <circle r="120" fill="transparent" stroke="#f39c12" stroke-width="240" stroke-dasharray="0 754" transform="rotate(216)">
      <animate attributeName="stroke-dasharray" from="0 754" to="113 754" begin="inf03_pie.click+0.6s" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </circle>
    <circle r="50" fill="white"/>
    <text x="0" y="5" text-anchor="middle" font-size="14" fill="#666">点击</text>
  </g>
  <g transform="translate(420,100)">
    <rect x="0" y="0" width="14" height="14" rx="3" fill="#9b59b6"/><text x="22" y="12" font-size="12" fill="#666">移动端 40%</text>
    <rect x="0" y="28" width="14" height="14" rx="3" fill="#3498db"/><text x="22" y="40" font-size="12" fill="#666">桌面端 25%</text>
    <rect x="0" y="56" width="14" height="14" rx="3" fill="#2ecc71"/><text x="22" y="68" font-size="12" fill="#666">平板 20%</text>
    <rect x="0" y="84" width="14" height="14" rx="3" fill="#f39c12"/><text x="22" y="96" font-size="12" fill="#666">其他 15%</text>
  </g>
</svg>`
  },
  {
    id: 'info_bar_04',
    name: '柱状图对比',
    category: 'infographic',
    tags: ['柱状图', '对比', '数据', '增长'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-bar-grow',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="inf04_bar" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stop-color="#e67e22"/><stop offset="100%" stop-color="#f39c12"/></linearGradient>
  </defs>
  <rect width="600" height="350" fill="white" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">月度数据</text>
  <line x1="80" y1="290" x2="560" y2="290" stroke="#ecf0f1" stroke-width="2"/>
  <g id="inf04_bars" style="cursor:pointer;">
    <rect x="100" y="290" width="50" height="0" fill="url(#inf04_bar)" rx="4"><animate attributeName="height" from="0" to="80" begin="inf04_bars.click" dur="0.4s" fill="freeze"/><animate attributeName="y" from="290" to="210" begin="inf04_bars.click" dur="0.4s" fill="freeze"/></rect>
    <rect x="170" y="290" width="50" height="0" fill="url(#inf04_bar)" rx="4"><animate attributeName="height" from="0" to="140" begin="inf04_bars.click+0.1s" dur="0.4s" fill="freeze"/><animate attributeName="y" from="290" to="150" begin="inf04_bars.click+0.1s" dur="0.4s" fill="freeze"/></rect>
    <rect x="240" y="290" width="50" height="0" fill="url(#inf04_bar)" rx="4"><animate attributeName="height" from="0" to="100" begin="inf04_bars.click+0.2s" dur="0.4s" fill="freeze"/><animate attributeName="y" from="290" to="190" begin="inf04_bars.click+0.2s" dur="0.4s" fill="freeze"/></rect>
    <rect x="310" y="290" width="50" height="0" fill="url(#inf04_bar)" rx="4"><animate attributeName="height" from="0" to="180" begin="inf04_bars.click+0.3s" dur="0.4s" fill="freeze"/><animate attributeName="y" from="290" to="110" begin="inf04_bars.click+0.3s" dur="0.4s" fill="freeze"/></rect>
    <rect x="380" y="290" width="50" height="0" fill="url(#inf04_bar)" rx="4"><animate attributeName="height" from="0" to="220" begin="inf04_bars.click+0.4s" dur="0.4s" fill="freeze"/><animate attributeName="y" from="290" to="70" begin="inf04_bars.click+0.4s" dur="0.4s" fill="freeze"/></rect>
    <rect x="450" y="290" width="50" height="0" fill="url(#inf04_bar)" rx="4"><animate attributeName="height" from="0" to="200" begin="inf04_bars.click+0.5s" dur="0.4s" fill="freeze"/><animate attributeName="y" from="290" to="90" begin="inf04_bars.click+0.5s" dur="0.4s" fill="freeze"/></rect>
  </g>
  <g font-size="11" fill="#999" text-anchor="middle">
    <text x="125" y="310">1月</text><text x="195" y="310">2月</text><text x="265" y="310">3月</text>
    <text x="335" y="310">4月</text><text x="405" y="310">5月</text><text x="475" y="310">6月</text>
  </g>
</svg>`
  },
  {
    id: 'info_radar_05',
    name: '雷达能力图',
    category: 'infographic',
    tags: ['雷达', '能力', '评估', '多维'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-radar',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="white" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">技能评估</text>
  <g transform="translate(300,210)" id="inf05_radar" style="cursor:pointer;">
    <polygon points="0,-120 114,-37 70,97 -70,97 -114,-37" fill="none" stroke="#ecf0f1" stroke-width="1"/>
    <polygon points="0,-90 85,-28 53,73 -53,73 -85,-28" fill="none" stroke="#ecf0f1" stroke-width="1"/>
    <polygon points="0,-60 57,-19 35,49 -35,49 -57,-19" fill="none" stroke="#ecf0f1" stroke-width="1"/>
    <polygon points="0,-30 28,-9 18,24 -18,24 -28,-9" fill="none" stroke="#ecf0f1" stroke-width="1"/>
    <line x1="0" y1="0" x2="0" y2="-120" stroke="#ecf0f1"/><line x1="0" y1="0" x2="114" y2="-37" stroke="#ecf0f1"/>
    <line x1="0" y1="0" x2="70" y2="97" stroke="#ecf0f1"/><line x1="0" y1="0" x2="-70" y2="97" stroke="#ecf0f1"/>
    <line x1="0" y1="0" x2="-114" y2="-37" stroke="#ecf0f1"/>
    <polygon points="0,-108 91,-26 42,78 -63,68 -80,-30" fill="rgba(26,188,156,0.2)" stroke="#1abc9c" stroke-width="2" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf05_radar.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </polygon>
    <text x="0" y="-130" text-anchor="middle" font-size="12" fill="#666">前端</text>
    <text x="125" y="-30" font-size="12" fill="#666">后端</text>
    <text x="80" y="115" font-size="12" fill="#666">设计</text>
    <text x="-80" y="115" font-size="12" fill="#666">沟通</text>
    <text x="-125" y="-30" font-size="12" fill="#666">管理</text>
    <text x="0" y="5" text-anchor="middle" font-size="13" fill="#bbb">点击</text>
  </g>
</svg>`
  },
  {
    id: 'info_flowchart_06',
    name: '决策流程树',
    category: 'infographic',
    tags: ['流程图', '决策', '树形', '分支'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-flowchart',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="#fafafa" rx="12"/>
  <g id="inf06_flow" style="cursor:pointer;">
    <rect x="225" y="20" width="150" height="45" rx="22" fill="#2c3e50"/><text x="300" y="48" text-anchor="middle" font-size="13" fill="white">开始</text>
    <line x1="300" y1="65" x2="300" y2="100" stroke="#bdc3c7" stroke-width="2"/>
    <rect x="200" y="100" width="200" height="50" rx="8" fill="#3498db" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click" dur="0.3s" fill="freeze"/>
    </rect>
    <text x="300" y="130" text-anchor="middle" font-size="12" fill="white" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click" dur="0.3s" fill="freeze"/>需要新功能?</text>
    <line x1="200" y1="125" x2="120" y2="200" stroke="#bdc3c7" stroke-width="2" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.2s" dur="0.3s" fill="freeze"/></line>
    <line x1="400" y1="125" x2="480" y2="200" stroke="#bdc3c7" stroke-width="2" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.2s" dur="0.3s" fill="freeze"/></line>
    <text x="140" y="175" font-size="11" fill="#27ae60" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.2s" dur="0.3s" fill="freeze"/>是</text>
    <text x="440" y="175" font-size="11" fill="#e74c3c" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.2s" dur="0.3s" fill="freeze"/>否</text>
    <rect x="30" y="200" width="180" height="45" rx="8" fill="#27ae60" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.4s" dur="0.3s" fill="freeze"/></rect>
    <text x="120" y="228" text-anchor="middle" font-size="12" fill="white" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.4s" dur="0.3s" fill="freeze"/>编写需求文档</text>
    <rect x="390" y="200" width="180" height="45" rx="8" fill="#e74c3c" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.4s" dur="0.3s" fill="freeze"/></rect>
    <text x="480" y="228" text-anchor="middle" font-size="12" fill="white" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.4s" dur="0.3s" fill="freeze"/>优化现有功能</text>
    <line x1="120" y1="245" x2="120" y2="290" stroke="#bdc3c7" stroke-width="2" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.6s" dur="0.3s" fill="freeze"/></line>
    <line x1="480" y1="245" x2="480" y2="290" stroke="#bdc3c7" stroke-width="2" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.6s" dur="0.3s" fill="freeze"/></line>
    <rect x="30" y="290" width="180" height="45" rx="8" fill="#f39c12" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.7s" dur="0.3s" fill="freeze"/></rect>
    <text x="120" y="318" text-anchor="middle" font-size="12" fill="white" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.7s" dur="0.3s" fill="freeze"/>开发实现</text>
    <rect x="390" y="290" width="180" height="45" rx="8" fill="#f39c12" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.7s" dur="0.3s" fill="freeze"/></rect>
    <text x="480" y="318" text-anchor="middle" font-size="12" fill="white" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.7s" dur="0.3s" fill="freeze"/>性能调优</text>
    <line x1="120" y1="335" x2="300" y2="370" stroke="#bdc3c7" stroke-width="2" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.8s" dur="0.3s" fill="freeze"/></line>
    <line x1="480" y1="335" x2="300" y2="370" stroke="#bdc3c7" stroke-width="2" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.8s" dur="0.3s" fill="freeze"/></line>
    <rect x="225" y="360" width="150" height="35" rx="17" fill="#2c3e50" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.9s" dur="0.3s" fill="freeze"/></rect>
    <text x="300" y="382" text-anchor="middle" font-size="12" fill="white" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="inf06_flow.click+0.9s" dur="0.3s" fill="freeze"/>上线</text>
  </g>
</svg>`
  }
]

// ==================== 4. 投票问答 quiz_poll ====================
export const SVG_QUIZ_POLL = [
  {
    id: 'quiz_ab_01',
    name: 'AB选择投票',
    category: 'quiz_poll',
    tags: ['投票', 'AB选择', '互动', '参与'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-vote',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="qz01_a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e74c3c"/><stop offset="100%" stop-color="#c0392b"/></linearGradient>
    <linearGradient id="qz01_b" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#3498db"/><stop offset="100%" stop-color="#2980b9"/></linearGradient>
  </defs>
  <rect width="600" height="300" fill="#fafafa" rx="12"/>
  <text x="300" y="40" text-anchor="middle" font-size="18" fill="#2c3e50" font-weight="bold">你更喜欢哪个?</text>
  <g id="qz01_optA" style="cursor:pointer;">
    <rect x="30" y="70" width="255" height="200" rx="12" fill="url(#qz01_a)"/>
    <text x="157" y="150" text-anchor="middle" font-size="48" fill="white" font-weight="bold">A</text>
    <text x="157" y="185" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.8)">选项 A</text>
    <rect x="80" y="220" width="155" height="30" rx="15" fill="rgba(255,255,255,0.2)"/>
    <rect x="80" y="220" width="0" height="30" rx="15" fill="rgba(255,255,255,0.4)">
      <animate attributeName="width" from="0" to="100" begin="qz01_optA.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </rect>
    <text x="157" y="240" text-anchor="middle" font-size="12" fill="white" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="qz01_optA.click+0.3s" dur="0.3s" fill="freeze"/>
      65%
    </text>
  </g>
  <g id="qz01_optB" style="cursor:pointer;">
    <rect x="315" y="70" width="255" height="200" rx="12" fill="url(#qz01_b)"/>
    <text x="442" y="150" text-anchor="middle" font-size="48" fill="white" font-weight="bold">B</text>
    <text x="442" y="185" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.8)">选项 B</text>
    <rect x="365" y="220" width="155" height="30" rx="15" fill="rgba(255,255,255,0.2)"/>
    <rect x="365" y="220" width="0" height="30" rx="15" fill="rgba(255,255,255,0.4)">
      <animate attributeName="width" from="0" to="55" begin="qz01_optB.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </rect>
    <text x="442" y="240" text-anchor="middle" font-size="12" fill="white" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="qz01_optB.click+0.3s" dur="0.3s" fill="freeze"/>
      35%
    </text>
  </g>
  <text x="300" y="55" text-anchor="middle" font-size="11" fill="#999">VS</text>
</svg>`
  },
  {
    id: 'quiz_four_02',
    name: '四选一问答',
    category: 'quiz_poll',
    tags: ['四选一', '测试', '问答', '知识'],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'click-quiz-answer',
    svg: `<svg viewBox="0 0 600 380" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="380" fill="white" rx="12"/>
  <rect x="20" y="20" width="560" height="80" rx="10" fill="#f8f9fa"/>
  <text x="300" y="55" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">Q: 以下哪个是正确的?</text>
  <text x="300" y="80" text-anchor="middle" font-size="12" fill="#999">点击选择你的答案</text>
  <g id="qz02_a" style="cursor:pointer;">
    <rect x="20" y="115" width="270" height="55" rx="10" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1"/>
    <text x="40" y="148" font-size="14" fill="#2c3e50">A. 选项一</text>
    <animate xlink:href="#qz02_a rect" attributeName="fill" to="#e74c3c" begin="click" dur="0.3s" fill="freeze"/>
  </g>
  <g id="qz02_b" style="cursor:pointer;">
    <rect x="310" y="115" width="270" height="55" rx="10" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1"/>
    <text x="330" y="148" font-size="14" fill="#2c3e50">B. 选项二</text>
    <animate xlink:href="#qz02_b rect" attributeName="fill" to="#27ae60" begin="click" dur="0.3s" fill="freeze"/>
  </g>
  <g id="qz02_c" style="cursor:pointer;">
    <rect x="20" y="185" width="270" height="55" rx="10" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1"/>
    <text x="40" y="218" font-size="14" fill="#2c3e50">C. 选项三</text>
    <animate xlink:href="#qz02_c rect" attributeName="fill" to="#e74c3c" begin="click" dur="0.3s" fill="freeze"/>
  </g>
  <g id="qz02_d" style="cursor:pointer;">
    <rect x="310" y="185" width="270" height="55" rx="10" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1"/>
    <text x="330" y="218" font-size="14" fill="#2c3e50">D. 选项四</text>
    <animate xlink:href="#qz02_d rect" attributeName="fill" to="#e74c3c" begin="click" dur="0.3s" fill="freeze"/>
  </g>
  <g opacity="0">
    <rect x="20" y="260" width="560" height="100" rx="10" fill="#d5f5e6"/>
    <text x="300" y="300" text-anchor="middle" font-size="15" fill="#27ae60" font-weight="bold">正确答案: B</text>
    <text x="300" y="325" text-anchor="middle" font-size="12" fill="#666">解析: 选项B是正确答案,因为...</text>
    <animate attributeName="opacity" from="0" to="1" begin="qz02_b.click" dur="0.5s" fill="freeze"/>
  </g>
</svg>`
  },
  {
    id: 'quiz_slider_03',
    name: '滑条评分',
    category: 'quiz_poll',
    tags: ['评分', '滑条', '打分', '反馈'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-rate',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="qz03_bar" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f39c12"/><stop offset="100%" stop-color="#e74c3c"/></linearGradient>
  </defs>
  <rect width="600" height="200" fill="white" rx="12"/>
  <text x="300" y="40" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">给本文打分</text>
  <rect x="50" y="80" width="500" height="12" rx="6" fill="#ecf0f1"/>
  <rect x="50" y="80" width="0" height="12" rx="6" fill="url(#qz03_bar)" id="qz03_fill">
    <animate attributeName="width" from="0" to="400" begin="qz03_btn.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
  </rect>
  <g font-size="11" fill="#999">
    <text x="50" y="115">0</text><text x="175" y="115">25</text><text x="300" y="115">50</text>
    <text x="425" y="115">75</text><text x="540" y="115">100</text>
  </g>
  <g transform="translate(300,160)" id="qz03_btn" style="cursor:pointer;">
    <rect x="-60" y="-15" width="120" height="30" rx="15" fill="#f39c12"/>
    <text x="0" y="5" text-anchor="middle" font-size="13" fill="white" font-weight="bold">提交评分</text>
  </g>
  <text x="300" y="65" text-anchor="middle" font-size="28" fill="#f39c12" font-weight="bold" opacity="0" id="qz03_score">
    <animate attributeName="opacity" from="0" to="1" begin="qz03_btn.click+0.5s" dur="0.3s" fill="freeze"/>
    80分
  </text>
</svg>`
  },
  {
    id: 'quiz_truefalse_04',
    name: '判断对错',
    category: 'quiz_poll',
    tags: ['判断', '对错', '真假', '测试'],
    colorScheme: '#2ecc71',
    interactive: true,
    interactionType: 'click-judge',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="250" fill="#fafafa" rx="12"/>
  <text x="300" y="40" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">判断: 地球是太阳系最大的行星?</text>
  <g id="qz04_true" style="cursor:pointer;">
    <circle cx="200" cy="130" r="50" fill="#2ecc71" opacity="0.9"/>
    <text x="200" y="125" text-anchor="middle" font-size="36" fill="white">O</text>
    <text x="200" y="150" text-anchor="middle" font-size="12" fill="white">正确</text>
  </g>
  <g id="qz04_false" style="cursor:pointer;">
    <circle cx="400" cy="130" r="50" fill="#e74c3c" opacity="0.9"/>
    <text x="400" y="125" text-anchor="middle" font-size="36" fill="white">X</text>
    <text x="400" y="150" text-anchor="middle" font-size="12" fill="white">错误</text>
  </g>
  <g opacity="0" id="qz04_result">
    <rect x="100" y="195" width="400" height="40" rx="8" fill="#fdeaea"/>
    <text x="300" y="220" text-anchor="middle" font-size="14" fill="#e74c3c" font-weight="bold">正确! 木星才是太阳系最大的行星</text>
    <animate attributeName="opacity" from="0" to="1" begin="qz04_false.click" dur="0.5s" fill="freeze"/>
  </g>
</svg>`
  },
  {
    id: 'quiz_emoji_05',
    name: '表情投票',
    category: 'quiz_poll',
    tags: ['表情', '心情', '投票', '反馈'],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click-emoji-vote',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="200" fill="white" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">你的感受如何?</text>
  <g id="qz05_e1" style="cursor:pointer;" transform="translate(80,100)">
    <circle r="35" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
    <circle cx="-10" cy="-8" r="4" fill="#2c3e50"/><circle cx="10" cy="-8" r="4" fill="#2c3e50"/>
    <path d="M-12,8 Q0,20 12,8" stroke="#2c3e50" stroke-width="2" fill="none"/>
    <text x="0" y="55" text-anchor="middle" font-size="11" fill="#999">开心</text>
    <animateTransform attributeName="transform" type="scale" from="1" to="1.3" begin="click" dur="0.3s" fill="freeze" additive="sum"/>
  </g>
  <g id="qz05_e2" style="cursor:pointer;" transform="translate(200,100)">
    <circle r="35" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
    <circle cx="-10" cy="-8" r="4" fill="#2c3e50"/><circle cx="10" cy="-8" r="4" fill="#2c3e50"/>
    <line x1="-10" y1="10" x2="10" y2="10" stroke="#2c3e50" stroke-width="2"/>
    <text x="0" y="55" text-anchor="middle" font-size="11" fill="#999">一般</text>
    <animateTransform attributeName="transform" type="scale" from="1" to="1.3" begin="click" dur="0.3s" fill="freeze" additive="sum"/>
  </g>
  <g id="qz05_e3" style="cursor:pointer;" transform="translate(320,100)">
    <circle r="35" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
    <circle cx="-10" cy="-8" r="4" fill="#2c3e50"/><circle cx="10" cy="-8" r="4" fill="#2c3e50"/>
    <path d="M-12,14 Q0,4 12,14" stroke="#2c3e50" stroke-width="2" fill="none"/>
    <text x="0" y="55" text-anchor="middle" font-size="11" fill="#999">难过</text>
    <animateTransform attributeName="transform" type="scale" from="1" to="1.3" begin="click" dur="0.3s" fill="freeze" additive="sum"/>
  </g>
  <g id="qz05_e4" style="cursor:pointer;" transform="translate(440,100)">
    <circle r="35" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
    <circle cx="-10" cy="-8" r="4" fill="#2c3e50"/><circle cx="10" cy="-8" r="4" fill="#2c3e50"/>
    <path d="M-10,12 Q0,6 10,12" stroke="#2c3e50" stroke-width="2" fill="none"/>
    <text x="0" y="55" text-anchor="middle" font-size="11" fill="#999">生气</text>
    <animateTransform attributeName="transform" type="scale" from="1" to="1.3" begin="click" dur="0.3s" fill="freeze" additive="sum"/>
  </g>
  <g id="qz05_e5" style="cursor:pointer;" transform="translate(540,100)">
    <circle r="35" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
    <text x="0" y="-2" text-anchor="middle" font-size="14" fill="#2c3e50">?_?</text>
    <text x="0" y="55" text-anchor="middle" font-size="11" fill="#999">迷惑</text>
    <animateTransform attributeName="transform" type="scale" from="1" to="1.3" begin="click" dur="0.3s" fill="freeze" additive="sum"/>
  </g>
</svg>`
  },
  {
    id: 'quiz_progress_06',
    name: '知识问答进度',
    category: 'quiz_poll',
    tags: ['进度', '问答', '闯关', '测验'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-quiz-progress',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="qz06_prog" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#9b59b6"/><stop offset="100%" stop-color="#8e44ad"/></linearGradient>
  </defs>
  <rect width="600" height="250" fill="white" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">知识闯关</text>
  <rect x="50" y="55" width="500" height="8" rx="4" fill="#ecf0f1"/>
  <rect x="50" y="55" width="0" height="8" rx="4" fill="url(#qz06_prog)" id="qz06_bar"/>
  <g id="qz06_q1" style="cursor:pointer;">
    <circle cx="113" cy="59" r="14" fill="white" stroke="#9b59b6" stroke-width="2"/>
    <text x="113" y="63" text-anchor="middle" font-size="10" fill="#9b59b6" font-weight="bold">1</text>
    <animate xlink:href="#qz06_bar" attributeName="width" to="100" begin="click" dur="0.5s" fill="freeze"/>
    <animate xlink:href="#qz06_q1 circle" attributeName="fill" to="#9b59b6" begin="click" dur="0.3s" fill="freeze"/>
  </g>
  <g id="qz06_q2" style="cursor:pointer;">
    <circle cx="225" cy="59" r="14" fill="white" stroke="#9b59b6" stroke-width="2"/>
    <text x="225" y="63" text-anchor="middle" font-size="10" fill="#9b59b6" font-weight="bold">2</text>
    <animate xlink:href="#qz06_bar" attributeName="width" to="225" begin="click" dur="0.5s" fill="freeze"/>
    <animate xlink:href="#qz06_q2 circle" attributeName="fill" to="#9b59b6" begin="click" dur="0.3s" fill="freeze"/>
  </g>
  <g id="qz06_q3" style="cursor:pointer;">
    <circle cx="337" cy="59" r="14" fill="white" stroke="#9b59b6" stroke-width="2"/>
    <text x="337" y="63" text-anchor="middle" font-size="10" fill="#9b59b6" font-weight="bold">3</text>
    <animate xlink:href="#qz06_bar" attributeName="width" to="350" begin="click" dur="0.5s" fill="freeze"/>
    <animate xlink:href="#qz06_q3 circle" attributeName="fill" to="#9b59b6" begin="click" dur="0.3s" fill="freeze"/>
  </g>
  <g id="qz06_q4" style="cursor:pointer;">
    <circle cx="450" cy="59" r="14" fill="white" stroke="#9b59b6" stroke-width="2"/>
    <text x="450" y="63" text-anchor="middle" font-size="10" fill="#9b59b6" font-weight="bold">4</text>
    <animate xlink:href="#qz06_bar" attributeName="width" to="500" begin="click" dur="0.5s" fill="freeze"/>
    <animate xlink:href="#qz06_q4 circle" attributeName="fill" to="#9b59b6" begin="click" dur="0.3s" fill="freeze"/>
  </g>
  <rect x="50" y="100" width="500" height="120" rx="10" fill="#f8f9fa"/>
  <text x="300" y="145" text-anchor="middle" font-size="14" fill="#666">点击数字依次答题</text>
  <text x="300" y="175" text-anchor="middle" font-size="12" fill="#999">每答对一题进度条前进一步</text>
</svg>`
  }
]

// ==================== 5. FAQ手风琴 faq_accordion ====================
export const SVG_FAQ_ACCORDION = [
  {
    id: 'faq_simple_01',
    name: '简约FAQ',
    category: 'faq_accordion',
    tags: ['FAQ', '问答', '手风琴', '展开'],
    colorScheme: '#34495e',
    interactive: true,
    interactionType: 'click-faq-expand',
    svg: `<svg viewBox="0 0 600 360" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="360" fill="white" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="18" fill="#2c3e50" font-weight="bold">常见问题</text>
  <g id="faq01_q1" style="cursor:pointer;">
    <rect x="30" y="55" width="540" height="45" rx="8" fill="#f8f9fa"/>
    <text x="55" y="83" font-size="14" fill="#2c3e50" font-weight="bold">Q: 如何开始使用?</text>
    <text x="545" y="83" text-anchor="end" font-size="16" fill="#bbb">+</text>
    <g opacity="0" id="faq01_a1">
      <rect x="30" y="100" width="540" height="50" fill="#f0f7ff"/>
      <foreignObject x="45" y="105" width="510" height="40"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:13px;color:#666;line-height:1.5;">A: 注册账号后,按照引导完成初始设置即可开始使用。全程不超过3分钟。</div></foreignObject>
      <animate attributeName="opacity" from="0" to="1" begin="faq01_q1.click" dur="0.4s" fill="freeze"/>
    </g>
  </g>
  <g id="faq01_q2" style="cursor:pointer;">
    <rect x="30" y="160" width="540" height="45" rx="8" fill="#f8f9fa"/>
    <text x="55" y="188" font-size="14" fill="#2c3e50" font-weight="bold">Q: 支持哪些格式?</text>
    <text x="545" y="188" text-anchor="end" font-size="16" fill="#bbb">+</text>
    <g opacity="0" id="faq01_a2">
      <rect x="30" y="205" width="540" height="50" fill="#f0f7ff"/>
      <foreignObject x="45" y="210" width="510" height="40"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:13px;color:#666;line-height:1.5;">A: 支持 JPG、PNG、SVG、GIF 等常见图片格式,以及 DOCX 文档格式。</div></foreignObject>
      <animate attributeName="opacity" from="0" to="1" begin="faq01_q2.click" dur="0.4s" fill="freeze"/>
    </g>
  </g>
  <g id="faq01_q3" style="cursor:pointer;">
    <rect x="30" y="265" width="540" height="45" rx="8" fill="#f8f9fa"/>
    <text x="55" y="293" font-size="14" fill="#2c3e50" font-weight="bold">Q: 如何联系客服?</text>
    <text x="545" y="293" text-anchor="end" font-size="16" fill="#bbb">+</text>
    <g opacity="0" id="faq01_a3">
      <rect x="30" y="310" width="540" height="40" fill="#f0f7ff"/>
      <foreignObject x="45" y="315" width="510" height="30"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:13px;color:#666;line-height:1.5;">A: 可以通过公众号后台留言或发送邮件至 support@example.com</div></foreignObject>
      <animate attributeName="opacity" from="0" to="1" begin="faq01_q3.click" dur="0.4s" fill="freeze"/>
    </g>
  </g>
</svg>`
  },
  {
    id: 'faq_card_02',
    name: '卡片式FAQ',
    category: 'faq_accordion',
    tags: ['卡片', 'FAQ', '彩色', '展开'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-card-faq',
    svg: `<svg viewBox="0 0 600 320" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="320" fill="#f0f4f8" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="18" fill="#2c3e50" font-weight="bold">帮助中心</text>
  <g id="faq02_c1" style="cursor:pointer;">
    <rect x="20" y="55" width="175" height="120" rx="12" fill="white"/>
    <circle cx="107" cy="95" r="20" fill="#e8f4fd"/>
    <text x="107" y="100" text-anchor="middle" font-size="18" fill="#3498db">?</text>
    <text x="107" y="140" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">入门指南</text>
    <text x="107" y="158" text-anchor="middle" font-size="10" fill="#999">点击了解</text>
  </g>
  <g id="faq02_c2" style="cursor:pointer;">
    <rect x="212" y="55" width="175" height="120" rx="12" fill="white"/>
    <circle cx="299" cy="95" r="20" fill="#fef3e2"/>
    <text x="299" y="100" text-anchor="middle" font-size="18" fill="#f39c12">!</text>
    <text x="299" y="140" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">常见问题</text>
    <text x="299" y="158" text-anchor="middle" font-size="10" fill="#999">点击查看</text>
  </g>
  <g id="faq02_c3" style="cursor:pointer;">
    <rect x="405" y="55" width="175" height="120" rx="12" fill="white"/>
    <circle cx="492" cy="95" r="20" fill="#e8f8f0"/>
    <text x="492" y="100" text-anchor="middle" font-size="18" fill="#27ae60">$</text>
    <text x="492" y="140" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">收费说明</text>
    <text x="492" y="158" text-anchor="middle" font-size="10" fill="#999">点击了解</text>
  </g>
  <g opacity="0" id="faq02_detail">
    <rect x="20" y="190" width="560" height="110" rx="12" fill="white"/>
    <foreignObject x="40" y="200" width="520" height="90">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:13px;color:#666;line-height:1.8;">
        <p style="margin:0;font-weight:bold;color:#2c3e50;">快速上手三步走</p>
        <p style="margin:4px 0 0;">1. 注册并登录账号</p>
        <p style="margin:2px 0 0;">2. 选择模板开始编辑</p>
        <p style="margin:2px 0 0;">3. 一键发布到公众号</p>
      </div>
    </foreignObject>
    <animate attributeName="opacity" from="0" to="1" begin="faq02_c1.click" dur="0.5s" fill="freeze"/>
  </g>
</svg>`
  },
  {
    id: 'faq_timeline_03',
    name: '时间线FAQ',
    category: 'faq_accordion',
    tags: ['时间线', '历程', 'FAQ', '展开'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-timeline-faq',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="350" fill="white" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">发展历程</text>
  <line x1="100" y1="60" x2="100" y2="330" stroke="#ecf0f1" stroke-width="3"/>
  <g id="faq03_t1" style="cursor:pointer;">
    <circle cx="100" cy="90" r="10" fill="#9b59b6"/>
    <text x="125" y="88" font-size="13" fill="#2c3e50" font-weight="bold">2023.01 项目启动</text>
    <text x="125" y="105" font-size="11" fill="#999">点击查看详情</text>
    <g opacity="0"><rect x="125" y="110" width="440" height="30" rx="6" fill="#f5f0ff"/><text x="140" y="130" font-size="11" fill="#666">团队组建完成,确定产品方向和技术架构</text>
      <animate attributeName="opacity" from="0" to="1" begin="faq03_t1.click" dur="0.4s" fill="freeze"/>
    </g>
  </g>
  <g id="faq03_t2" style="cursor:pointer;">
    <circle cx="100" cy="165" r="10" fill="#3498db"/>
    <text x="125" y="163" font-size="13" fill="#2c3e50" font-weight="bold">2023.06 公测上线</text>
    <text x="125" y="180" font-size="11" fill="#999">点击查看详情</text>
    <g opacity="0"><rect x="125" y="185" width="440" height="30" rx="6" fill="#edf7ff"/><text x="140" y="205" font-size="11" fill="#666">首批1000名用户参与内测,收集反馈优化产品</text>
      <animate attributeName="opacity" from="0" to="1" begin="faq03_t2.click" dur="0.4s" fill="freeze"/>
    </g>
  </g>
  <g id="faq03_t3" style="cursor:pointer;">
    <circle cx="100" cy="240" r="10" fill="#27ae60"/>
    <text x="125" y="238" font-size="13" fill="#2c3e50" font-weight="bold">2024.01 正式发布</text>
    <text x="125" y="255" font-size="11" fill="#999">点击查看详情</text>
    <g opacity="0"><rect x="125" y="260" width="440" height="30" rx="6" fill="#e8f8f0"/><text x="140" y="280" font-size="11" fill="#666">正式版上线,用户数突破10万,获得行业认可</text>
      <animate attributeName="opacity" from="0" to="1" begin="faq03_t3.click" dur="0.4s" fill="freeze"/>
    </g>
  </g>
</svg>`
  },
  {
    id: 'faq_bubble_04',
    name: '对话气泡FAQ',
    category: 'faq_accordion',
    tags: ['对话', '气泡', '聊天', 'FAQ'],
    colorScheme: '#2ecc71',
    interactive: true,
    interactionType: 'click-chat-faq',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="350" fill="#f0f4f8" rx="12"/>
  <text x="300" y="30" text-anchor="middle" font-size="14" fill="#999">在线咨询</text>
  <g id="faq04_q1" style="cursor:pointer;">
    <rect x="200" y="45" width="380" height="40" rx="16" fill="#dcf8c6"/>
    <text x="220" y="70" font-size="13" fill="#333">如何上传图片?</text>
    <polygon points="550,75 560,85 540,85" fill="#dcf8c6"/>
  </g>
  <g opacity="0" id="faq04_a1">
    <rect x="20" y="95" width="380" height="55" rx="16" fill="white"/>
    <foreignObject x="35" y="100" width="350" height="45"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px;color:#333;line-height:1.5;">点击编辑区右侧的图片按钮,选择本地图片即可上传。支持JPG/PNG格式。</div></foreignObject>
    <polygon points="50,140 40,150 60,150" fill="white"/>
    <animate attributeName="opacity" from="0" to="1" begin="faq04_q1.click" dur="0.4s" fill="freeze"/>
  </g>
  <g id="faq04_q2" style="cursor:pointer;">
    <rect x="200" y="165" width="380" height="40" rx="16" fill="#dcf8c6"/>
    <text x="220" y="190" font-size="13" fill="#333">怎么修改字体大小?</text>
    <polygon points="550,195 560,205 540,205" fill="#dcf8c6"/>
  </g>
  <g opacity="0" id="faq04_a2">
    <rect x="20" y="215" width="380" height="55" rx="16" fill="white"/>
    <foreignObject x="35" y="220" width="350" height="45"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px;color:#333;line-height:1.5;">选中文字后,在工具栏中选择字号下拉菜单,可选择12-36px之间的字体大小。</div></foreignObject>
    <polygon points="50,260 40,270 60,270" fill="white"/>
    <animate attributeName="opacity" from="0" to="1" begin="faq04_q2.click" dur="0.4s" fill="freeze"/>
  </g>
  <g id="faq04_q3" style="cursor:pointer;">
    <rect x="200" y="285" width="380" height="40" rx="16" fill="#dcf8c6"/>
    <text x="220" y="310" font-size="13" fill="#333">如何导出文件?</text>
    <polygon points="550,315 560,325 540,325" fill="#dcf8c6"/>
  </g>
</svg>`
  },
  {
    id: 'faq_number_05',
    name: '数字编号FAQ',
    category: 'faq_accordion',
    tags: ['编号', '数字', '列表', 'FAQ'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-number-faq',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="300" fill="white" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">使用指南</text>
  <g id="faq05_n1" style="cursor:pointer;">
    <circle cx="60" cy="80" r="20" fill="#e67e22"/><text x="60" y="85" text-anchor="middle" font-size="16" fill="white" font-weight="bold">1</text>
    <text x="95" y="85" font-size="14" fill="#2c3e50">注册账号</text>
    <text x="95" y="105" font-size="11" fill="#999" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="faq05_n1.click" dur="0.3s" fill="freeze"/>填写邮箱和密码即可完成注册</text>
  </g>
  <g id="faq05_n2" style="cursor:pointer;">
    <circle cx="60" cy="150" r="20" fill="#f39c12"/><text x="60" y="155" text-anchor="middle" font-size="16" fill="white" font-weight="bold">2</text>
    <text x="95" y="155" font-size="14" fill="#2c3e50">选择模板</text>
    <text x="95" y="175" font-size="11" fill="#999" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="faq05_n2.click" dur="0.3s" fill="freeze"/>浏览丰富的模板库,找到适合的样式</text>
  </g>
  <g id="faq05_n3" style="cursor:pointer;">
    <circle cx="60" cy="220" r="20" fill="#1abc9c"/><text x="60" y="225" text-anchor="middle" font-size="16" fill="white" font-weight="bold">3</text>
    <text x="95" y="225" font-size="14" fill="#2c3e50">编辑内容</text>
    <text x="95" y="245" font-size="11" fill="#999" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="faq05_n3.click" dur="0.3s" fill="freeze"/>输入文字和图片,自定义排版样式</text>
  </g>
  <text x="300" y="285" text-anchor="middle" font-size="11" fill="#bbb">点击每个步骤查看详情</text>
</svg>`
  },
  {
    id: 'faq_toggle_06',
    name: '开关式FAQ',
    category: 'faq_accordion',
    tags: ['开关', '切换', '显隐', 'FAQ'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-toggle-faq',
    svg: `<svg viewBox="0 0 600 280" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="280" fill="#fafafa" rx="12"/>
  <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">功能说明</text>
  <g id="faq06_s1" style="cursor:pointer;">
    <rect x="30" y="55" width="540" height="50" rx="10" fill="white" stroke="#ecf0f1" stroke-width="1"/>
    <text x="55" y="85" font-size="14" fill="#2c3e50">智能排版</text>
    <rect x="490" y="72" width="40" height="20" rx="10" fill="#ecf0f1"/>
    <circle cx="500" cy="82" r="8" fill="white">
      <animate attributeName="cx" from="500" to="520" begin="faq06_s1.click" dur="0.3s" fill="freeze"/>
    </circle>
    <animate xlink:href="#faq06_s1 rect:nth-of-type(2)" attributeName="fill" to="#1abc9c" begin="faq06_s1.click" dur="0.3s" fill="freeze"/>
  </g>
  <g id="faq06_s2" style="cursor:pointer;">
    <rect x="30" y="115" width="540" height="50" rx="10" fill="white" stroke="#ecf0f1" stroke-width="1"/>
    <text x="55" y="145" font-size="14" fill="#2c3e50">图片优化</text>
    <rect x="490" y="132" width="40" height="20" rx="10" fill="#ecf0f1"/>
    <circle cx="500" cy="142" r="8" fill="white">
      <animate attributeName="cx" from="500" to="520" begin="faq06_s2.click" dur="0.3s" fill="freeze"/>
    </circle>
  </g>
  <g id="faq06_s3" style="cursor:pointer;">
    <rect x="30" y="175" width="540" height="50" rx="10" fill="white" stroke="#ecf0f1" stroke-width="1"/>
    <text x="55" y="205" font-size="14" fill="#2c3e50">一键发布</text>
    <rect x="490" y="192" width="40" height="20" rx="10" fill="#ecf0f1"/>
    <circle cx="500" cy="202" r="8" fill="white">
      <animate attributeName="cx" from="500" to="520" begin="faq06_s3.click" dur="0.3s" fill="freeze"/>
    </circle>
  </g>
  <text x="300" y="260" text-anchor="middle" font-size="11" fill="#bbb">点击开关查看功能详情</text>
</svg>`
  }
]

// ==================== 6. 信封拆信 envelope_letter ====================
export const SVG_ENVELOPE_LETTER = [
  {
    id: 'env_classic_01',
    name: '经典信封拆开',
    category: 'envelope_letter',
    tags: ['信封', '拆信', '经典', '邀请'],
    colorScheme: '#c0392b',
    interactive: true,
    interactionType: 'click-open-envelope',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="env01_body" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f5e6d3"/><stop offset="100%" stop-color="#e8d5b7"/></linearGradient>
    <linearGradient id="env01_flap" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#d4c4a8"/><stop offset="100%" stop-color="#c4a882"/></linearGradient>
  </defs>
  <rect width="600" height="400" fill="#fafafa" rx="12"/>
  <g transform="translate(100,80)">
    <rect width="400" height="250" rx="8" fill="url(#env01_body)"/>
    <polygon points="0,0 200,120 400,0" fill="url(#env01_flap)" stroke="#c4a882" stroke-width="1"/>
    <polygon points="0,250 200,140 400,250" fill="#e0c9a8"/>
    <rect x="50" y="160" width="300" height="60" rx="6" fill="white" opacity="0.7"/>
    <text x="200" y="195" text-anchor="middle" font-size="14" fill="#8B7355" font-weight="bold">您的专属邀请函</text>
    <g id="env01_letter" style="cursor:pointer;">
      <rect x="30" y="20" width="340" height="200" rx="4" fill="white" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="click" dur="0.5s" fill="freeze"/>
        <animate attributeName="y" from="20" to="-120" begin="click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </rect>
      <foreignObject x="50" y="40" width="300" height="160" opacity="0">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:14px;color:#333;line-height:1.8;text-align:center;">
          <p style="margin:0;font-size:18px;font-weight:bold;color:#c0392b;">邀请函</p>
          <p style="margin:8px 0 0;">诚挚邀请您参加我们的活动</p>
          <p style="margin:4px 0 0;font-size:12px;color:#999;">时间: 2025年1月1日</p>
          <p style="margin:2px 0 0;font-size:12px;color:#999;">地点: 线上直播间</p>
        </div>
        <animate attributeName="opacity" from="0" to="1" begin="env01_letter.click+0.3s" dur="0.5s" fill="freeze"/>
      </foreignObject>
    </g>
    <text x="200" y="135" text-anchor="middle" font-size="13" fill="#a08060">点击拆开信封</text>
    <circle cx="200" cy="2" r="15" fill="#c0392b" opacity="0.8">
      <animate attributeName="r" values="15;12;0" begin="env01_letter.click" dur="0.4s" fill="freeze"/>
    </circle>
  </g>
</svg>`
  },
  {
    id: 'env_red_02',
    name: '红色利是封',
    category: 'envelope_letter',
    tags: ['红包', '利是', '新年', '喜庆'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-red-envelope',
    svg: `<svg viewBox="0 0 600 420" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="env02_red" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e74c3c"/><stop offset="100%" stop-color="#c0392b"/></linearGradient>
    <radialGradient id="env02_gold" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f1c40f"/><stop offset="100%" stop-color="#d4ac0d"/></radialGradient>
  </defs>
  <rect width="600" height="420" fill="#fef9e7" rx="12"/>
  <g transform="translate(150,30)">
    <rect width="300" height="380" rx="12" fill="url(#env02_red)"/>
    <rect x="20" y="20" width="260" height="340" rx="8" fill="none" stroke="#f5b041" stroke-width="1" stroke-dasharray="4 4" opacity="0.3"/>
    <circle cx="150" cy="160" r="45" fill="url(#env02_gold)" id="env02_seal" style="cursor:pointer;">
      <animate attributeName="r" values="45;48;45" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x="150" y="155" text-anchor="middle" font-size="22" fill="#c0392b" font-weight="bold" style="pointer-events:none;">福</text>
    <text x="150" y="175" text-anchor="middle" font-size="10" fill="#c0392b" style="pointer-events:none;">点击开启</text>
    <g opacity="0" id="env02_content">
      <rect x="30" y="220" width="240" height="130" rx="8" fill="rgba(255,255,255,0.95)"/>
      <text x="150" y="260" text-anchor="middle" font-size="22" fill="#c0392b" font-weight="bold">恭喜发财</text>
      <text x="150" y="290" text-anchor="middle" font-size="14" fill="#e74c3c">万事如意 红包拿来</text>
      <text x="150" y="320" text-anchor="middle" font-size="12" fill="#999">2025 新年快乐</text>
      <animate attributeName="opacity" from="0" to="1" begin="env02_seal.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </g>
  </g>
</svg>`
  },
  {
    id: 'env_golden_03',
    name: '金色贺卡',
    category: 'envelope_letter',
    tags: ['贺卡', '金色', '祝福', '典雅'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-greeting-card',
    svg: `<svg viewBox="0 0 600 360" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="env03_gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f7dc6f"/><stop offset="50%" stop-color="#f1c40f"/><stop offset="100%" stop-color="#d4ac0d"/></linearGradient>
  </defs>
  <rect width="600" height="360" fill="#1a1a2e" rx="12"/>
  <g id="env03_card" style="cursor:pointer;">
    <rect x="100" y="40" width="400" height="280" rx="12" fill="url(#env03_gold)"/>
    <rect x="115" y="55" width="370" height="250" rx="8" fill="none" stroke="#1a1a2e" stroke-width="1" opacity="0.2"/>
    <text x="300" y="140" text-anchor="middle" font-size="28" fill="#1a1a2e" font-weight="bold">HAPPY</text>
    <text x="300" y="175" text-anchor="middle" font-size="28" fill="#1a1a2e" font-weight="bold">NEW YEAR</text>
    <text x="300" y="210" text-anchor="middle" font-size="14" fill="rgba(26,26,46,0.6)">2025</text>
    <text x="300" y="260" text-anchor="middle" font-size="12" fill="rgba(26,26,46,0.5)">点击展开祝福</text>
    <g opacity="0" id="env03_msg">
      <rect x="130" y="230" width="340" height="70" rx="8" fill="rgba(26,26,46,0.1)"/>
      <text x="300" y="260" text-anchor="middle" font-size="14" fill="#1a1a2e">愿新的一年</text>
      <text x="300" y="282" text-anchor="middle" font-size="14" fill="#1a1a2e">万事胜意 前程似锦</text>
      <animate attributeName="opacity" from="0" to="1" begin="env03_card.click" dur="0.6s" fill="freeze"/>
    </g>
  </g>
  <g opacity="0.3">
    <circle cx="50" cy="50" r="2" fill="#f1c40f"><animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="550" cy="80" r="1.5" fill="#f1c40f"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite"/></circle>
    <circle cx="80" cy="300" r="2" fill="#f1c40f"><animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite"/></circle>
    <circle cx="520" cy="330" r="1.5" fill="#f1c40f"><animate attributeName="opacity" values="0.3;1;0.3" dur="3.5s" repeatCount="indefinite"/></circle>
  </g>
</svg>`
  },
  {
    id: 'env_scroll_04',
    name: '卷轴展开',
    category: 'envelope_letter',
    tags: ['卷轴', '古风', '展开', '书信'],
    colorScheme: '#8B7355',
    interactive: true,
    interactionType: 'click-scroll-open',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="env04_paper" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#faf0e6"/><stop offset="100%" stop-color="#f5e6d3"/></linearGradient>
    <linearGradient id="env04_rod" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8B7355"/><stop offset="50%" stop-color="#a0896a"/><stop offset="100%" stop-color="#6b5240"/></linearGradient>
  </defs>
  <rect width="600" height="350" fill="#f0ebe3" rx="12"/>
  <rect x="100" y="40" width="400" height="270" fill="url(#env04_paper)" rx="4"/>
  <g id="env04_scroll" style="cursor:pointer;">
    <rect x="100" y="40" width="400" height="270" fill="url(#env04_paper)" rx="4">
      <animate attributeName="height" from="0" to="270" begin="click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </rect>
    <foreignObject x="130" y="70" width="340" height="210" opacity="0">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;color:#5d4037;line-height:2;text-align:center;font-family:serif;">
        <p style="margin:0;font-size:20px;font-weight:bold;">致远方的朋友</p>
        <p style="margin:10px 0 0;">见字如面</p>
        <p style="margin:0;">岁月如歌 愿你安好</p>
        <p style="margin:15px 0 0;font-size:13px;color:#8d6e63;">—— 书于甲辰年冬</p>
      </div>
      <animate attributeName="opacity" from="0" to="1" begin="env04_scroll.click+0.5s" dur="0.5s" fill="freeze"/>
    </foreignObject>
  </g>
  <rect x="90" y="30" width="420" height="18" rx="9" fill="url(#env04_rod)"/>
  <circle cx="90" cy="39" r="12" fill="url(#env04_rod)"/><circle cx="510" cy="39" r="12" fill="url(#env04_rod)"/>
  <rect x="90" y="300" width="420" height="18" rx="9" fill="url(#env04_rod)"/>
  <circle cx="90" cy="309" r="12" fill="url(#env04_rod)"/><circle cx="510" cy="309" r="12" fill="url(#env04_rod)"/>
  <text x="300" y="185" text-anchor="middle" font-size="14" fill="#a08060">点击展开卷轴</text>
</svg>`
  },
  {
    id: 'env_seal_05',
    name: '火漆封印',
    category: 'envelope_letter',
    tags: ['火漆', '封印', '神秘', '高级'],
    colorScheme: '#922b21',
    interactive: true,
    interactionType: 'click-break-seal',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="env05_seal" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#c0392b"/><stop offset="70%" stop-color="#922b21"/><stop offset="100%" stop-color="#641e16"/></radialGradient>
  </defs>
  <rect width="600" height="350" fill="#2c3e50" rx="12"/>
  <rect x="80" y="40" width="440" height="270" rx="8" fill="#f5e6d3"/>
  <rect x="95" y="55" width="410" height="240" rx="4" fill="none" stroke="#d5c4a1" stroke-width="1"/>
  <g opacity="0" id="env05_content">
    <foreignObject x="120" y="80" width="360" height="180">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:15px;color:#333;line-height:1.8;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:bold;color:#922b21;">SECRET MESSAGE</p>
        <p style="margin:12px 0 0;">This is a confidential communication</p>
        <p style="margin:4px 0 0;">meant only for your eyes.</p>
        <p style="margin:15px 0 0;font-size:12px;color:#999;">— The Secret Society —</p>
      </div>
    </foreignObject>
    <animate attributeName="opacity" from="0" to="1" begin="env05_wax.click+0.3s" dur="0.5s" fill="freeze"/>
  </g>
  <circle cx="300" cy="175" r="40" fill="url(#env05_seal)" id="env05_wax" style="cursor:pointer;">
    <animate attributeName="r" values="40;42;40" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="r" from="40" to="0" begin="click" dur="0.5s" fill="freeze"/>
  </circle>
  <text x="300" y="172" text-anchor="middle" font-size="16" fill="#f5e6d3" font-weight="bold" style="pointer-events:none;">S</text>
  <text x="300" y="188" text-anchor="middle" font-size="8" fill="#f5e6d3" style="pointer-events:none;">SEALED</text>
</svg>`
  },
  {
    id: 'env_ticket_06',
    name: '门票入场券',
    category: 'envelope_letter',
    tags: ['门票', '入场券', '活动', '邀请'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-ticket',
    svg: `<svg viewBox="0 0 600 280" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="env06_bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8e44ad"/><stop offset="100%" stop-color="#6c3483"/></linearGradient>
  </defs>
  <rect width="600" height="280" fill="#f5f0ff" rx="12"/>
  <g transform="translate(50,30)" id="env06_ticket" style="cursor:pointer;">
    <rect width="500" height="220" rx="12" fill="url(#env06_bg)"/>
    <rect x="350" y="0" width="1" height="220" stroke="white" stroke-width="1" stroke-dasharray="6 4" opacity="0.4"/>
    <text x="175" y="60" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.6)">ADMIT ONE</text>
    <text x="175" y="100" text-anchor="middle" font-size="24" fill="white" font-weight="bold">年度盛典</text>
    <text x="175" y="130" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.8)">2025.01.01 | 19:00</text>
    <text x="175" y="160" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.5)">VIP座位区</text>
    <rect x="100" y="175" width="150" height="30" rx="15" fill="rgba(255,255,255,0.15)"/>
    <text x="175" y="195" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.7)">点击入场</text>
    <g opacity="0" id="env06_qr">
      <rect x="370" y="40" width="110" height="110" rx="8" fill="white"/>
      <rect x="385" y="55" width="80" height="80" fill="#ecf0f1"/>
      <text x="425" y="100" text-anchor="middle" font-size="10" fill="#666">QR CODE</text>
      <text x="425" y="175" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.5)">NO.20250101</text>
      <animate attributeName="opacity" from="0" to="1" begin="env06_ticket.click" dur="0.5s" fill="freeze"/>
    </g>
  </g>
</svg>`
  }
]

// ==================== 7. 横向滚动条 h_scroll ====================
export const SVG_H_SCROLL = [
  {
    id: 'hscroll_timeline_01',
    name: '横向时间轴',
    category: 'h_scroll',
    tags: ['时间轴', '横向', '历史', '发展'],
    colorScheme: '#2980b9',
    interactive: true,
    interactionType: 'click-h-timeline',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="250" fill="white" rx="12"/>
  <text x="300" y="30" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">发展历程</text>
  <line x1="40" y1="100" x2="560" y2="100" stroke="#ecf0f1" stroke-width="3" stroke-linecap="round"/>
  <line x1="40" y1="100" x2="40" y2="100" stroke="#2980b9" stroke-width="3" stroke-linecap="round" id="hsc01_line">
    <animate attributeName="x2" from="40" to="560" begin="hsc01_start.click" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
  </line>
  <g id="hsc01_start" style="cursor:pointer;">
    <g opacity="0" id="hsc01_n1">
      <circle cx="100" cy="100" r="8" fill="#2980b9"/><text x="100" y="80" text-anchor="middle" font-size="11" fill="#2c3e50" font-weight="bold">2020</text><text x="100" y="130" text-anchor="middle" font-size="10" fill="#999">创立</text>
      <animate attributeName="opacity" from="0" to="1" begin="hsc01_start.click+0.3s" dur="0.3s" fill="freeze"/>
    </g>
    <g opacity="0" id="hsc01_n2">
      <circle cx="230" cy="100" r="8" fill="#27ae60"/><text x="230" y="80" text-anchor="middle" font-size="11" fill="#2c3e50" font-weight="bold">2021</text><text x="230" y="130" text-anchor="middle" font-size="10" fill="#999">增长</text>
      <animate attributeName="opacity" from="0" to="1" begin="hsc01_start.click+0.7s" dur="0.3s" fill="freeze"/>
    </g>
    <g opacity="0" id="hsc01_n3">
      <circle cx="360" cy="100" r="8" fill="#f39c12"/><text x="360" y="80" text-anchor="middle" font-size="11" fill="#2c3e50" font-weight="bold">2023</text><text x="360" y="130" text-anchor="middle" font-size="10" fill="#999">突破</text>
      <animate attributeName="opacity" from="0" to="1" begin="hsc01_start.click+1.1s" dur="0.3s" fill="freeze"/>
    </g>
    <g opacity="0" id="hsc01_n4">
      <circle cx="490" cy="100" r="8" fill="#e74c3c"/><text x="490" y="80" text-anchor="middle" font-size="11" fill="#2c3e50" font-weight="bold">2025</text><text x="490" y="130" text-anchor="middle" font-size="10" fill="#999">腾飞</text>
      <animate attributeName="opacity" from="0" to="1" begin="hsc01_start.click+1.5s" dur="0.3s" fill="freeze"/>
    </g>
    <text x="300" y="180" text-anchor="middle" font-size="13" fill="#bbb">点击播放时间线</text>
  </g>
  <foreignObject x="50" y="190" width="500" height="50">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px;color:#999;text-align:center;line-height:1.6;">每个节点都是一次飞跃,每段旅程都值得铭记</div>
  </foreignObject>
</svg>`
  },
  {
    id: 'hscroll_showcase_02',
    name: '横向展品橱窗',
    category: 'h_scroll',
    tags: ['橱窗', '展品', '横向', '展示'],
    colorScheme: '#34495e',
    interactive: false,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 220" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hsc02_bg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#2c3e50"/><stop offset="100%" stop-color="#34495e"/></linearGradient>
  </defs>
  <rect width="600" height="220" fill="url(#hsc02_bg)" rx="12"/>
  <text x="300" y="30" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.6)">精选展品</text>
  <g>
    <rect x="20" y="50" width="130" height="130" rx="10" fill="rgba(255,255,255,0.08)"/>
    <rect x="35" y="65" width="100" height="70" rx="6" fill="#e74c3c" opacity="0.8"/>
    <text x="85" y="155" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)">作品一</text>
  </g>
  <g>
    <rect x="165" y="50" width="130" height="130" rx="10" fill="rgba(255,255,255,0.08)"/>
    <rect x="180" y="65" width="100" height="70" rx="6" fill="#3498db" opacity="0.8"/>
    <text x="230" y="155" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)">作品二</text>
  </g>
  <g>
    <rect x="310" y="50" width="130" height="130" rx="10" fill="rgba(255,255,255,0.08)"/>
    <rect x="325" y="65" width="100" height="70" rx="6" fill="#2ecc71" opacity="0.8"/>
    <text x="375" y="155" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)">作品三</text>
  </g>
  <g>
    <rect x="455" y="50" width="130" height="130" rx="10" fill="rgba(255,255,255,0.08)"/>
    <rect x="470" y="65" width="100" height="70" rx="6" fill="#f39c12" opacity="0.8"/>
    <text x="520" y="155" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)">作品四</text>
  </g>
  <g font-size="0">
    <circle cx="260" cy="200" r="4" fill="rgba(255,255,255,0.3)"/>
    <circle cx="280" cy="200" r="4" fill="white"/>
    <circle cx="300" cy="200" r="4" fill="rgba(255,255,255,0.3)"/>
    <circle cx="320" cy="200" r="4" fill="rgba(255,255,255,0.3)"/>
    <circle cx="340" cy="200" r="4" fill="rgba(255,255,255,0.3)"/>
  </g>
</svg>`
  },
  {
    id: 'hscroll_stats_03',
    name: '横向数据条',
    category: 'h_scroll',
    tags: ['数据', '横条', '统计', '比较'],
    colorScheme: '#16a085',
    interactive: true,
    interactionType: 'click-h-bars',
    svg: `<svg viewBox="0 0 600 280" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hsc03_g1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#16a085"/><stop offset="100%" stop-color="#1abc9c"/></linearGradient>
    <linearGradient id="hsc03_g2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#2980b9"/><stop offset="100%" stop-color="#3498db"/></linearGradient>
    <linearGradient id="hsc03_g3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#8e44ad"/><stop offset="100%" stop-color="#9b59b6"/></linearGradient>
    <linearGradient id="hsc03_g4" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#d35400"/><stop offset="100%" stop-color="#e67e22"/></linearGradient>
  </defs>
  <rect width="600" height="280" fill="white" rx="12"/>
  <text x="300" y="30" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">技能掌握度</text>
  <g id="hsc03_bars" style="cursor:pointer;">
    <text x="40" y="75" font-size="13" fill="#666">前端开发</text>
    <rect x="140" y="60" width="420" height="22" rx="11" fill="#ecf0f1"/>
    <rect x="140" y="60" width="0" height="22" rx="11" fill="url(#hsc03_g1)"><animate attributeName="width" from="0" to="378" begin="hsc03_bars.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
    <text x="530" y="76" text-anchor="end" font-size="11" fill="#16a085" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="hsc03_bars.click+0.5s" dur="0.3s" fill="freeze"/>90%</text>

    <text x="40" y="125" font-size="13" fill="#666">后端开发</text>
    <rect x="140" y="110" width="420" height="22" rx="11" fill="#ecf0f1"/>
    <rect x="140" y="110" width="0" height="22" rx="11" fill="url(#hsc03_g2)"><animate attributeName="width" from="0" to="336" begin="hsc03_bars.click+0.2s" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
    <text x="490" y="126" text-anchor="end" font-size="11" fill="#2980b9" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="hsc03_bars.click+0.7s" dur="0.3s" fill="freeze"/>80%</text>

    <text x="40" y="175" font-size="13" fill="#666">UI 设计</text>
    <rect x="140" y="160" width="420" height="22" rx="11" fill="#ecf0f1"/>
    <rect x="140" y="160" width="0" height="22" rx="11" fill="url(#hsc03_g3)"><animate attributeName="width" from="0" to="294" begin="hsc03_bars.click+0.4s" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
    <text x="448" y="176" text-anchor="end" font-size="11" fill="#8e44ad" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="hsc03_bars.click+0.9s" dur="0.3s" fill="freeze"/>70%</text>

    <text x="40" y="225" font-size="13" fill="#666">项目管理</text>
    <rect x="140" y="210" width="420" height="22" rx="11" fill="#ecf0f1"/>
    <rect x="140" y="210" width="0" height="22" rx="11" fill="url(#hsc03_g4)"><animate attributeName="width" from="0" to="252" begin="hsc03_bars.click+0.6s" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
    <text x="406" y="226" text-anchor="end" font-size="11" fill="#d35400" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="hsc03_bars.click+1.1s" dur="0.3s" fill="freeze"/>60%</text>
  </g>
  <text x="300" y="265" text-anchor="middle" font-size="11" fill="#bbb">点击展示数据</text>
</svg>`
  },
  {
    id: 'hscroll_brand_04',
    name: '品牌展示带',
    category: 'h_scroll',
    tags: ['品牌', 'Logo', '合作', '展示'],
    colorScheme: '#7f8c8d',
    interactive: false,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 120" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="120" fill="#fafafa" rx="10"/>
  <text x="300" y="25" text-anchor="middle" font-size="11" fill="#bbb" letter-spacing="3">合 作 伙 伴</text>
  <g opacity="0.4">
    <rect x="20" y="40" width="90" height="55" rx="8" fill="#ecf0f1"/><text x="65" y="72" text-anchor="middle" font-size="12" fill="#7f8c8d" font-weight="bold">BRAND A</text>
    <rect x="125" y="40" width="90" height="55" rx="8" fill="#ecf0f1"/><text x="170" y="72" text-anchor="middle" font-size="12" fill="#7f8c8d" font-weight="bold">BRAND B</text>
    <rect x="230" y="40" width="90" height="55" rx="8" fill="#ecf0f1"/><text x="275" y="72" text-anchor="middle" font-size="12" fill="#7f8c8d" font-weight="bold">BRAND C</text>
    <rect x="335" y="40" width="90" height="55" rx="8" fill="#ecf0f1"/><text x="380" y="72" text-anchor="middle" font-size="12" fill="#7f8c8d" font-weight="bold">BRAND D</text>
    <rect x="440" y="40" width="90" height="55" rx="8" fill="#ecf0f1"/><text x="485" y="72" text-anchor="middle" font-size="12" fill="#7f8c8d" font-weight="bold">BRAND E</text>
  </g>
  <text x="300" y="110" text-anchor="middle" font-size="10" fill="#ccc">更多合作品牌陆续加入</text>
</svg>`
  },
  {
    id: 'hscroll_steps_05',
    name: '横向步骤引导',
    category: 'h_scroll',
    tags: ['步骤', '引导', '教程', '横向'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-h-steps',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="200" fill="white" rx="12"/>
  <g id="hsc05_steps" style="cursor:pointer;">
    <g opacity="0" id="hsc05_s1">
      <circle cx="80" cy="80" r="30" fill="#e67e22"/><text x="80" y="86" text-anchor="middle" font-size="20" fill="white" font-weight="bold">1</text>
      <text x="80" y="135" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">下载</text>
      <text x="80" y="155" text-anchor="middle" font-size="10" fill="#999">App Store</text>
      <animate attributeName="opacity" from="0" to="1" begin="hsc05_steps.click" dur="0.3s" fill="freeze"/>
    </g>
    <line x1="110" y1="80" x2="160" y2="80" stroke="#ecf0f1" stroke-width="2" stroke-dasharray="6 3"/>
    <g opacity="0" id="hsc05_s2">
      <circle cx="190" cy="80" r="30" fill="#f39c12"/><text x="190" y="86" text-anchor="middle" font-size="20" fill="white" font-weight="bold">2</text>
      <text x="190" y="135" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">注册</text>
      <text x="190" y="155" text-anchor="middle" font-size="10" fill="#999">创建账户</text>
      <animate attributeName="opacity" from="0" to="1" begin="hsc05_steps.click+0.2s" dur="0.3s" fill="freeze"/>
    </g>
    <line x1="220" y1="80" x2="270" y2="80" stroke="#ecf0f1" stroke-width="2" stroke-dasharray="6 3"/>
    <g opacity="0" id="hsc05_s3">
      <circle cx="300" cy="80" r="30" fill="#27ae60"/><text x="300" y="86" text-anchor="middle" font-size="20" fill="white" font-weight="bold">3</text>
      <text x="300" y="135" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">配置</text>
      <text x="300" y="155" text-anchor="middle" font-size="10" fill="#999">个性设置</text>
      <animate attributeName="opacity" from="0" to="1" begin="hsc05_steps.click+0.4s" dur="0.3s" fill="freeze"/>
    </g>
    <line x1="330" y1="80" x2="380" y2="80" stroke="#ecf0f1" stroke-width="2" stroke-dasharray="6 3"/>
    <g opacity="0" id="hsc05_s4">
      <circle cx="410" cy="80" r="30" fill="#3498db"/><text x="410" y="86" text-anchor="middle" font-size="20" fill="white" font-weight="bold">4</text>
      <text x="410" y="135" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">使用</text>
      <text x="410" y="155" text-anchor="middle" font-size="10" fill="#999">开始体验</text>
      <animate attributeName="opacity" from="0" to="1" begin="hsc05_steps.click+0.6s" dur="0.3s" fill="freeze"/>
    </g>
    <line x1="440" y1="80" x2="490" y2="80" stroke="#ecf0f1" stroke-width="2" stroke-dasharray="6 3"/>
    <g opacity="0" id="hsc05_s5">
      <circle cx="520" cy="80" r="30" fill="#e74c3c"/><text x="520" y="86" text-anchor="middle" font-size="20" fill="white" font-weight="bold">5</text>
      <text x="520" y="135" text-anchor="middle" font-size="12" fill="#2c3e50" font-weight="bold">分享</text>
      <text x="520" y="155" text-anchor="middle" font-size="10" fill="#999">推荐好友</text>
      <animate attributeName="opacity" from="0" to="1" begin="hsc05_steps.click+0.8s" dur="0.3s" fill="freeze"/>
    </g>
    <text x="300" y="185" text-anchor="middle" font-size="12" fill="#bbb">点击播放步骤</text>
  </g>
</svg>`
  },
  {
    id: 'hscroll_news_06',
    name: '新闻头条滚动',
    category: 'h_scroll',
    tags: ['新闻', '头条', '滚动', '播报'],
    colorScheme: '#c0392b',
    interactive: false,
    interactionType: 'auto-scroll',
    svg: `<svg viewBox="0 0 600 80" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="hsc06_clip"><rect width="600" height="80" rx="8"/></clipPath>
  </defs>
  <g clip-path="url(#hsc06_clip)">
    <rect width="600" height="80" fill="#c0392b" rx="8"/>
    <rect x="15" y="20" width="70" height="40" rx="6" fill="rgba(255,255,255,0.15)"/>
    <text x="50" y="45" text-anchor="middle" font-size="13" fill="white" font-weight="bold">快讯</text>
    <g>
      <text x="100" y="45" font-size="14" fill="rgba(255,255,255,0.9)">今日头条: 科技创新推动产业升级,多项重大成果发布 | 经济持续复苏,消费信心指数创新高</text>
      <animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="12s" repeatCount="indefinite"/>
    </g>
  </g>
</svg>`
  }
]

// ==================== 8. 数字计数器 num_counter ====================
export const SVG_NUM_COUNTER = [
  {
    id: 'counter_big_01',
    name: '大数字展示',
    category: 'num_counter',
    tags: ['数字', '统计', '大数据', '展示'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-count-up',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cnt01_g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2c3e50"/><stop offset="100%" stop-color="#34495e"/></linearGradient>
  </defs>
  <rect width="600" height="200" fill="url(#cnt01_g)" rx="12"/>
  <g id="cnt01_nums" style="cursor:pointer;">
    <g>
      <text x="150" y="100" text-anchor="middle" font-size="52" fill="white" font-weight="bold" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="cnt01_nums.click" dur="0.5s" fill="freeze"/>
        10K+
      </text>
      <text x="150" y="130" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.5)" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="cnt01_nums.click+0.3s" dur="0.3s" fill="freeze"/>
        活跃用户
      </text>
    </g>
    <line x1="300" y1="50" x2="300" y2="150" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    <g>
      <text x="450" y="100" text-anchor="middle" font-size="52" fill="#1abc9c" font-weight="bold" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="cnt01_nums.click+0.2s" dur="0.5s" fill="freeze"/>
        98%
      </text>
      <text x="450" y="130" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.5)" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="cnt01_nums.click+0.5s" dur="0.3s" fill="freeze"/>
        好评率
      </text>
    </g>
    <text x="300" y="180" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击展示数据</text>
  </g>
</svg>`
  },
  {
    id: 'counter_cards_02',
    name: '数据卡片组',
    category: 'num_counter',
    tags: ['卡片', '数据', '指标', 'KPI'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-stat-cards',
    svg: `<svg viewBox="0 0 600 180" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="180" fill="#f8f9fa" rx="12"/>
  <g id="cnt02_cards" style="cursor:pointer;">
    <g opacity="0">
      <rect x="15" y="20" width="135" height="140" rx="10" fill="white"/>
      <text x="82" y="70" text-anchor="middle" font-size="32" fill="#3498db" font-weight="bold">256</text>
      <text x="82" y="95" text-anchor="middle" font-size="12" fill="#999">文章数量</text>
      <rect x="42" y="110" width="80" height="4" rx="2" fill="#ecf0f1"/><rect x="42" y="110" width="60" height="4" rx="2" fill="#3498db"/>
      <text x="82" y="140" text-anchor="middle" font-size="10" fill="#bbb">+12% vs 上月</text>
      <animate attributeName="opacity" from="0" to="1" begin="cnt02_cards.click" dur="0.3s" fill="freeze"/>
    </g>
    <g opacity="0">
      <rect x="160" y="20" width="135" height="140" rx="10" fill="white"/>
      <text x="227" y="70" text-anchor="middle" font-size="32" fill="#e74c3c" font-weight="bold">5.2W</text>
      <text x="227" y="95" text-anchor="middle" font-size="12" fill="#999">总阅读量</text>
      <rect x="187" y="110" width="80" height="4" rx="2" fill="#ecf0f1"/><rect x="187" y="110" width="70" height="4" rx="2" fill="#e74c3c"/>
      <text x="227" y="140" text-anchor="middle" font-size="10" fill="#bbb">+28% vs 上月</text>
      <animate attributeName="opacity" from="0" to="1" begin="cnt02_cards.click+0.15s" dur="0.3s" fill="freeze"/>
    </g>
    <g opacity="0">
      <rect x="305" y="20" width="135" height="140" rx="10" fill="white"/>
      <text x="372" y="70" text-anchor="middle" font-size="32" fill="#27ae60" font-weight="bold">89%</text>
      <text x="372" y="95" text-anchor="middle" font-size="12" fill="#999">完读率</text>
      <rect x="332" y="110" width="80" height="4" rx="2" fill="#ecf0f1"/><rect x="332" y="110" width="55" height="4" rx="2" fill="#27ae60"/>
      <text x="372" y="140" text-anchor="middle" font-size="10" fill="#bbb">+5% vs 上月</text>
      <animate attributeName="opacity" from="0" to="1" begin="cnt02_cards.click+0.3s" dur="0.3s" fill="freeze"/>
    </g>
    <g opacity="0">
      <rect x="450" y="20" width="135" height="140" rx="10" fill="white"/>
      <text x="517" y="70" text-anchor="middle" font-size="32" fill="#f39c12" font-weight="bold">4.8</text>
      <text x="517" y="95" text-anchor="middle" font-size="12" fill="#999">满意度</text>
      <rect x="477" y="110" width="80" height="4" rx="2" fill="#ecf0f1"/><rect x="477" y="110" width="76" height="4" rx="2" fill="#f39c12"/>
      <text x="517" y="140" text-anchor="middle" font-size="10" fill="#bbb">+0.3 vs 上月</text>
      <animate attributeName="opacity" from="0" to="1" begin="cnt02_cards.click+0.45s" dur="0.3s" fill="freeze"/>
    </g>
  </g>
</svg>`
  },
  {
    id: 'counter_circle_03',
    name: '环形进度数字',
    category: 'num_counter',
    tags: ['环形', '进度', '百分比', '完成度'],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'click-circle-counter',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="250" fill="white" rx="12"/>
  <text x="300" y="30" text-anchor="middle" font-size="14" fill="#2c3e50" font-weight="bold">项目完成度</text>
  <g id="cnt03_rings" style="cursor:pointer;">
    <g transform="translate(120,140)">
      <circle r="60" fill="none" stroke="#ecf0f1" stroke-width="10"/>
      <circle r="60" fill="none" stroke="#27ae60" stroke-width="10" stroke-dasharray="0 377" stroke-linecap="round" transform="rotate(-90)">
        <animate attributeName="stroke-dasharray" from="0 377" to="283 377" begin="cnt03_rings.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </circle>
      <text x="0" y="8" text-anchor="middle" font-size="24" fill="#27ae60" font-weight="bold" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="cnt03_rings.click+0.5s" dur="0.3s" fill="freeze"/>75%</text>
      <text x="0" y="28" text-anchor="middle" font-size="10" fill="#999">设计</text>
    </g>
    <g transform="translate(300,140)">
      <circle r="60" fill="none" stroke="#ecf0f1" stroke-width="10"/>
      <circle r="60" fill="none" stroke="#3498db" stroke-width="10" stroke-dasharray="0 377" stroke-linecap="round" transform="rotate(-90)">
        <animate attributeName="stroke-dasharray" from="0 377" to="226 377" begin="cnt03_rings.click+0.2s" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </circle>
      <text x="0" y="8" text-anchor="middle" font-size="24" fill="#3498db" font-weight="bold" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="cnt03_rings.click+0.7s" dur="0.3s" fill="freeze"/>60%</text>
      <text x="0" y="28" text-anchor="middle" font-size="10" fill="#999">开发</text>
    </g>
    <g transform="translate(480,140)">
      <circle r="60" fill="none" stroke="#ecf0f1" stroke-width="10"/>
      <circle r="60" fill="none" stroke="#e74c3c" stroke-width="10" stroke-dasharray="0 377" stroke-linecap="round" transform="rotate(-90)">
        <animate attributeName="stroke-dasharray" from="0 377" to="151 377" begin="cnt03_rings.click+0.4s" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </circle>
      <text x="0" y="8" text-anchor="middle" font-size="24" fill="#e74c3c" font-weight="bold" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="cnt03_rings.click+0.9s" dur="0.3s" fill="freeze"/>40%</text>
      <text x="0" y="28" text-anchor="middle" font-size="10" fill="#999">测试</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'counter_ticker_04',
    name: '数字跳动仪表',
    category: 'num_counter',
    tags: ['仪表', '跳动', '实时', '数据'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-ticker',
    svg: `<svg viewBox="0 0 600 160" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cnt04_bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1a1a2e"/><stop offset="100%" stop-color="#16213e"/></linearGradient>
  </defs>
  <rect width="600" height="160" fill="url(#cnt04_bg)" rx="12"/>
  <g id="cnt04_display" style="cursor:pointer;">
    <g transform="translate(60,80)">
      <rect x="-40" y="-35" width="80" height="70" rx="8" fill="rgba(231,76,60,0.15)" stroke="rgba(231,76,60,0.3)" stroke-width="1"/>
      <text x="0" y="12" text-anchor="middle" font-size="36" fill="#e74c3c" font-weight="bold" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="cnt04_display.click" dur="0.2s" fill="freeze"/>1</text>
    </g>
    <g transform="translate(155,80)">
      <rect x="-40" y="-35" width="80" height="70" rx="8" fill="rgba(231,76,60,0.15)" stroke="rgba(231,76,60,0.3)" stroke-width="1"/>
      <text x="0" y="12" text-anchor="middle" font-size="36" fill="#e74c3c" font-weight="bold" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="cnt04_display.click+0.1s" dur="0.2s" fill="freeze"/>2</text>
    </g>
    <text x="215" y="92" text-anchor="middle" font-size="36" fill="#e74c3c">,</text>
    <g transform="translate(265,80)">
      <rect x="-40" y="-35" width="80" height="70" rx="8" fill="rgba(231,76,60,0.15)" stroke="rgba(231,76,60,0.3)" stroke-width="1"/>
      <text x="0" y="12" text-anchor="middle" font-size="36" fill="#e74c3c" font-weight="bold" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="cnt04_display.click+0.2s" dur="0.2s" fill="freeze"/>3</text>
    </g>
    <g transform="translate(360,80)">
      <rect x="-40" y="-35" width="80" height="70" rx="8" fill="rgba(231,76,60,0.15)" stroke="rgba(231,76,60,0.3)" stroke-width="1"/>
      <text x="0" y="12" text-anchor="middle" font-size="36" fill="#e74c3c" font-weight="bold" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="cnt04_display.click+0.3s" dur="0.2s" fill="freeze"/>4</text>
    </g>
    <g transform="translate(455,80)">
      <rect x="-40" y="-35" width="80" height="70" rx="8" fill="rgba(231,76,60,0.15)" stroke="rgba(231,76,60,0.3)" stroke-width="1"/>
      <text x="0" y="12" text-anchor="middle" font-size="36" fill="#e74c3c" font-weight="bold" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="cnt04_display.click+0.4s" dur="0.2s" fill="freeze"/>5</text>
    </g>
    <g transform="translate(540,80)">
      <rect x="-30" y="-35" width="60" height="70" rx="8" fill="rgba(231,76,60,0.15)" stroke="rgba(231,76,60,0.3)" stroke-width="1"/>
      <text x="0" y="12" text-anchor="middle" font-size="36" fill="#e74c3c" font-weight="bold" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="cnt04_display.click+0.5s" dur="0.2s" fill="freeze"/>6</text>
    </g>
    <text x="300" y="140" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击启动计数器</text>
  </g>
</svg>`
  },
  {
    id: 'counter_milestone_05',
    name: '里程碑数字',
    category: 'num_counter',
    tags: ['里程碑', '成就', '达成', '庆祝'],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click-milestone',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cnt05_g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f1c40f"/><stop offset="100%" stop-color="#f39c12"/></linearGradient>
  </defs>
  <rect width="600" height="200" fill="white" rx="12"/>
  <g id="cnt05_mile" style="cursor:pointer;">
    <text x="300" y="40" text-anchor="middle" font-size="14" fill="#bbb">我们已经达成</text>
    <text x="300" y="110" text-anchor="middle" font-size="72" fill="url(#cnt05_g)" font-weight="bold" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="cnt05_mile.click" dur="0.8s" fill="freeze"/>
      1,000,000
    </text>
    <text x="300" y="145" text-anchor="middle" font-size="18" fill="#2c3e50" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="cnt05_mile.click+0.4s" dur="0.5s" fill="freeze"/>
      用户里程碑
    </text>
    <text x="300" y="175" text-anchor="middle" font-size="12" fill="#999" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="cnt05_mile.click+0.6s" dur="0.5s" fill="freeze"/>
      感谢每一位用户的信任与支持
    </text>
  </g>
</svg>`
  },
  {
    id: 'counter_comparison_06',
    name: '数据对比面板',
    category: 'num_counter',
    tags: ['对比', '同比', '增长', '面板'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-compare-stats',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="200" fill="#fafafa" rx="12"/>
  <g id="cnt06_panel" style="cursor:pointer;">
    <g opacity="0">
      <rect x="20" y="20" width="270" height="160" rx="10" fill="white"/>
      <text x="155" y="55" text-anchor="middle" font-size="12" fill="#999">上月</text>
      <text x="155" y="100" text-anchor="middle" font-size="42" fill="#bdc3c7" font-weight="bold">8,520</text>
      <text x="155" y="130" text-anchor="middle" font-size="13" fill="#999">阅读量</text>
      <animate attributeName="opacity" from="0" to="1" begin="cnt06_panel.click" dur="0.4s" fill="freeze"/>
    </g>
    <g opacity="0">
      <rect x="310" y="20" width="270" height="160" rx="10" fill="white"/>
      <text x="445" y="55" text-anchor="middle" font-size="12" fill="#999">本月</text>
      <text x="445" y="100" text-anchor="middle" font-size="42" fill="#9b59b6" font-weight="bold">12,680</text>
      <text x="445" y="130" text-anchor="middle" font-size="13" fill="#27ae60">+48.8%</text>
      <polygon points="435,135 445,125 455,135" fill="#27ae60" opacity="0">
        <animate attributeName="opacity" from="0" to="1" begin="cnt06_panel.click+0.6s" dur="0.3s" fill="freeze"/>
      </polygon>
      <animate attributeName="opacity" from="0" to="1" begin="cnt06_panel.click+0.3s" dur="0.4s" fill="freeze"/>
    </g>
  </g>
</svg>`
  }
]

// ==================== 9. 氛围特效 atmosphere ====================
export const SVG_ATMOSPHERE = [
  {
    id: 'atmo_rain_01',
    name: '雨滴效果',
    category: 'atmosphere',
    tags: ['雨天', '下雨', '氛围', '忧伤'],
    colorScheme: '#2980b9',
    interactive: false,
    interactionType: 'auto',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="atm01_sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#4a6fa5"/><stop offset="100%" stop-color="#2c3e50"/></linearGradient>
  </defs>
  <rect width="600" height="300" fill="url(#atm01_sky)" rx="12"/>
  <g opacity="0.3">
    <line x1="50" y1="-10" x2="45" y2="20" stroke="#adc5e0" stroke-width="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="-5 310" dur="1.2s" repeatCount="indefinite"/></line>
    <line x1="150" y1="-10" x2="145" y2="20" stroke="#adc5e0" stroke-width="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="-5 310" dur="1s" repeatCount="indefinite" begin="0.3s"/></line>
    <line x1="250" y1="-10" x2="245" y2="20" stroke="#adc5e0" stroke-width="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="-5 310" dur="1.1s" repeatCount="indefinite" begin="0.1s"/></line>
    <line x1="350" y1="-10" x2="345" y2="20" stroke="#adc5e0" stroke-width="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="-5 310" dur="0.9s" repeatCount="indefinite" begin="0.5s"/></line>
    <line x1="450" y1="-10" x2="445" y2="20" stroke="#adc5e0" stroke-width="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="-5 310" dur="1.3s" repeatCount="indefinite" begin="0.2s"/></line>
    <line x1="550" y1="-10" x2="545" y2="20" stroke="#adc5e0" stroke-width="1.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="-5 310" dur="1.1s" repeatCount="indefinite" begin="0.7s"/></line>
    <line x1="100" y1="-10" x2="95" y2="20" stroke="#adc5e0" stroke-width="1"><animateTransform attributeName="transform" type="translate" from="0 0" to="-5 310" dur="1.4s" repeatCount="indefinite" begin="0.4s"/></line>
    <line x1="300" y1="-10" x2="295" y2="20" stroke="#adc5e0" stroke-width="1"><animateTransform attributeName="transform" type="translate" from="0 0" to="-5 310" dur="1.0s" repeatCount="indefinite" begin="0.6s"/></line>
    <line x1="500" y1="-10" x2="495" y2="20" stroke="#adc5e0" stroke-width="1"><animateTransform attributeName="transform" type="translate" from="0 0" to="-5 310" dur="1.2s" repeatCount="indefinite" begin="0.8s"/></line>
  </g>
  <text x="300" y="155" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.6)">雨天,适合阅读</text>
</svg>`
  },
  {
    id: 'atmo_stars_02',
    name: '星空闪烁',
    category: 'atmosphere',
    tags: ['星空', '夜晚', '梦幻', '浪漫'],
    colorScheme: '#1a1a2e',
    interactive: false,
    interactionType: 'auto',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="atm02_sky" cx="50%" cy="30%" r="70%"><stop offset="0%" stop-color="#16213e"/><stop offset="100%" stop-color="#0a0a1a"/></radialGradient>
  </defs>
  <rect width="600" height="300" fill="url(#atm02_sky)" rx="12"/>
  <g>
    <circle cx="80" cy="50" r="1.5" fill="white"><animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="200" cy="30" r="1" fill="white"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" begin="0.5s"/></circle>
    <circle cx="320" cy="60" r="2" fill="#f1c40f"><animate attributeName="opacity" values="0.2;1;0.2" dur="4s" repeatCount="indefinite" begin="1s"/></circle>
    <circle cx="450" cy="40" r="1.5" fill="white"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.8s" repeatCount="indefinite" begin="0.3s"/></circle>
    <circle cx="550" cy="70" r="1" fill="white"><animate attributeName="opacity" values="0.2;1;0.2" dur="3.5s" repeatCount="indefinite" begin="1.5s"/></circle>
    <circle cx="130" cy="120" r="1" fill="white"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" repeatCount="indefinite" begin="0.8s"/></circle>
    <circle cx="380" cy="100" r="1.5" fill="#ffeaa7"><animate attributeName="opacity" values="0.2;1;0.2" dur="3.2s" repeatCount="indefinite" begin="2s"/></circle>
    <circle cx="500" cy="130" r="1" fill="white"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.7s" repeatCount="indefinite" begin="0.6s"/></circle>
    <circle cx="60" cy="180" r="1.5" fill="white"><animate attributeName="opacity" values="0.2;1;0.2" dur="3.8s" repeatCount="indefinite" begin="1.2s"/></circle>
    <circle cx="250" cy="160" r="2" fill="#f1c40f"><animate attributeName="opacity" values="0.2;1;0.2" dur="4.5s" repeatCount="indefinite" begin="0.4s"/></circle>
    <circle cx="520" cy="200" r="1" fill="white"><animate attributeName="opacity" values="0.3;1;0.3" dur="2.3s" repeatCount="indefinite" begin="1.8s"/></circle>
  </g>
  <circle cx="480" cy="60" r="25" fill="#f1c40f" opacity="0.15"/>
  <circle cx="480" cy="60" r="20" fill="#f1c40f" opacity="0.2"/>
  <text x="300" y="250" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.4)">繁星点点,愿你好梦</text>
</svg>`
  },
  {
    id: 'atmo_sunrise_03',
    name: '日出渐变',
    category: 'atmosphere',
    tags: ['日出', '清晨', '温暖', '希望'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-sunrise',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="atm03_night" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1a1a2e"/><stop offset="100%" stop-color="#16213e"/></linearGradient>
    <linearGradient id="atm03_day" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffecd2"/><stop offset="50%" stop-color="#fcb69f"/><stop offset="100%" stop-color="#ff9a9e"/></linearGradient>
    <radialGradient id="atm03_sun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#f1c40f"/><stop offset="100%" stop-color="#f39c12" stop-opacity="0"/></radialGradient>
    <clipPath id="atm03_clip"><rect width="600" height="300" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#atm03_clip)">
    <rect width="600" height="300" fill="url(#atm03_night)" id="atm03_bg"/>
    <rect width="600" height="300" fill="url(#atm03_day)" opacity="0" id="atm03_dawn">
      <animate attributeName="opacity" from="0" to="1" begin="atm03_btn.click" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </rect>
    <circle cx="300" cy="320" r="60" fill="url(#atm03_sun)" id="atm03_sun_el">
      <animate attributeName="cy" from="320" to="200" begin="atm03_btn.click" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </circle>
    <circle cx="300" cy="320" r="30" fill="#f1c40f">
      <animate attributeName="cy" from="320" to="200" begin="atm03_btn.click" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </circle>
    <text x="300" y="150" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.5)" id="atm03_btn" style="cursor:pointer;">点击迎接日出</text>
  </g>
</svg>`
  },
  {
    id: 'atmo_sakura_04',
    name: '樱花飘落',
    category: 'atmosphere',
    tags: ['樱花', '春天', '浪漫', '飘落'],
    colorScheme: '#ff6b9d',
    interactive: false,
    interactionType: 'auto',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="atm04_bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fce4ec"/><stop offset="100%" stop-color="#f8bbd0"/></linearGradient>
  </defs>
  <rect width="600" height="300" fill="url(#atm04_bg)" rx="12"/>
  <g opacity="0.6">
    <ellipse cx="80" cy="-10" rx="6" ry="4" fill="#ff6b9d" transform="rotate(30 80 -10)">
      <animateTransform attributeName="transform" type="translate" from="0 0" to="30 320" dur="4s" repeatCount="indefinite"/>
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" additive="sum"/>
    </ellipse>
    <ellipse cx="200" cy="-10" rx="5" ry="3" fill="#f48fb1">
      <animateTransform attributeName="transform" type="translate" from="0 0" to="20 320" dur="5s" repeatCount="indefinite" begin="1s"/>
    </ellipse>
    <ellipse cx="350" cy="-10" rx="7" ry="4" fill="#ff6b9d">
      <animateTransform attributeName="transform" type="translate" from="0 0" to="-15 320" dur="4.5s" repeatCount="indefinite" begin="0.5s"/>
    </ellipse>
    <ellipse cx="480" cy="-10" rx="5" ry="3" fill="#f48fb1">
      <animateTransform attributeName="transform" type="translate" from="0 0" to="25 320" dur="3.8s" repeatCount="indefinite" begin="2s"/>
    </ellipse>
    <ellipse cx="550" cy="-10" rx="6" ry="4" fill="#ff6b9d">
      <animateTransform attributeName="transform" type="translate" from="0 0" to="-10 320" dur="5.5s" repeatCount="indefinite" begin="1.5s"/>
    </ellipse>
    <ellipse cx="130" cy="-10" rx="4" ry="3" fill="#f48fb1">
      <animateTransform attributeName="transform" type="translate" from="0 0" to="35 320" dur="4.2s" repeatCount="indefinite" begin="0.8s"/>
    </ellipse>
    <ellipse cx="420" cy="-10" rx="6" ry="3" fill="#ff6b9d">
      <animateTransform attributeName="transform" type="translate" from="0 0" to="-20 320" dur="4.8s" repeatCount="indefinite" begin="2.5s"/>
    </ellipse>
  </g>
  <text x="300" y="155" text-anchor="middle" font-size="20" fill="#c2185b" opacity="0.6">樱花树下,春风十里</text>
</svg>`
  },
  {
    id: 'atmo_fog_05',
    name: '晨雾迷蒙',
    category: 'atmosphere',
    tags: ['雾气', '朦胧', '清晨', '神秘'],
    colorScheme: '#95a5a6',
    interactive: false,
    interactionType: 'auto',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="atm05_bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#d5dbdb"/><stop offset="100%" stop-color="#aeb6bf"/></linearGradient>
    <filter id="atm05_blur"><feGaussianBlur stdDeviation="15"/></filter>
  </defs>
  <rect width="600" height="250" fill="url(#atm05_bg)" rx="12"/>
  <ellipse cx="200" cy="180" rx="250" ry="40" fill="rgba(255,255,255,0.4)" filter="url(#atm05_blur)">
    <animate attributeName="cx" values="200;400;200" dur="10s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="450" cy="130" rx="200" ry="30" fill="rgba(255,255,255,0.3)" filter="url(#atm05_blur)">
    <animate attributeName="cx" values="450;150;450" dur="12s" repeatCount="indefinite"/>
  </ellipse>
  <ellipse cx="100" cy="100" rx="180" ry="25" fill="rgba(255,255,255,0.25)" filter="url(#atm05_blur)">
    <animate attributeName="cx" values="100;500;100" dur="15s" repeatCount="indefinite"/>
  </ellipse>
  <text x="300" y="130" text-anchor="middle" font-size="18" fill="rgba(100,100,100,0.5)">雾里看花,水中望月</text>
</svg>`
  },
  {
    id: 'atmo_aurora_06',
    name: '极光效果',
    category: 'atmosphere',
    tags: ['极光', '北极', '梦幻', '壮观'],
    colorScheme: '#2ecc71',
    interactive: false,
    interactionType: 'auto',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="atm06_sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0a0a2a"/><stop offset="100%" stop-color="#1a1a3e"/></linearGradient>
    <filter id="atm06_glow"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>
  <rect width="600" height="300" fill="url(#atm06_sky)" rx="12"/>
  <g filter="url(#atm06_glow)" opacity="0.5">
    <path d="M0,100 Q100,50 200,80 Q300,110 400,60 Q500,30 600,70" fill="none" stroke="#2ecc71" stroke-width="20">
      <animate attributeName="d" values="M0,100 Q100,50 200,80 Q300,110 400,60 Q500,30 600,70;M0,80 Q100,110 200,60 Q300,40 400,90 Q500,70 600,50;M0,100 Q100,50 200,80 Q300,110 400,60 Q500,30 600,70" dur="8s" repeatCount="indefinite"/>
    </path>
    <path d="M0,130 Q150,80 300,120 Q450,160 600,100" fill="none" stroke="#3498db" stroke-width="15">
      <animate attributeName="d" values="M0,130 Q150,80 300,120 Q450,160 600,100;M0,110 Q150,150 300,90 Q450,70 600,130;M0,130 Q150,80 300,120 Q450,160 600,100" dur="10s" repeatCount="indefinite"/>
    </path>
    <path d="M0,160 Q200,120 400,150 Q500,170 600,140" fill="none" stroke="#9b59b6" stroke-width="12">
      <animate attributeName="d" values="M0,160 Q200,120 400,150 Q500,170 600,140;M0,140 Q200,170 400,120 Q500,100 600,160;M0,160 Q200,120 400,150 Q500,170 600,140" dur="12s" repeatCount="indefinite"/>
    </path>
  </g>
  <g>
    <circle cx="100" cy="40" r="1" fill="white" opacity="0.5"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="300" cy="25" r="1.5" fill="white" opacity="0.4"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite"/></circle>
    <circle cx="500" cy="50" r="1" fill="white" opacity="0.5"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/></circle>
  </g>
  <text x="300" y="260" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.3)">极光之下,万物寂静</text>
</svg>`
  }
]

// ==================== 10. 复古装饰 retro_vintage ====================
export const SVG_RETRO_VINTAGE = [
  {
    id: 'retro_poster_01',
    name: '复古海报框',
    category: 'retro_vintage',
    tags: ['复古', '海报', '70年代', '怀旧'],
    colorScheme: '#d4a574',
    interactive: false,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ret01_bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f5e6d3"/><stop offset="100%" stop-color="#e8d5b7"/></linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#ret01_bg)" rx="0"/>
  <rect x="20" y="20" width="560" height="360" fill="none" stroke="#c4a882" stroke-width="3"/>
  <rect x="30" y="30" width="540" height="340" fill="none" stroke="#c4a882" stroke-width="1"/>
  <line x1="40" y1="80" x2="560" y2="80" stroke="#c4a882" stroke-width="1"/>
  <text x="300" y="65" text-anchor="middle" font-size="24" fill="#8B7355" font-weight="bold" letter-spacing="8">VINTAGE</text>
  <rect x="60" y="100" width="480" height="200" fill="rgba(196,168,130,0.15)" rx="4"/>
  <text x="300" y="200" text-anchor="middle" font-size="16" fill="#a08060">在这里放置你的内容</text>
  <line x1="40" y1="320" x2="560" y2="320" stroke="#c4a882" stroke-width="1"/>
  <text x="300" y="345" text-anchor="middle" font-size="11" fill="#a08060" letter-spacing="3">ESTABLISHED MCMLXXI</text>
  <text x="300" y="365" text-anchor="middle" font-size="9" fill="#c4a882">PREMIUM QUALITY</text>
</svg>`
  },
  {
    id: 'retro_newspaper_02',
    name: '旧报纸版式',
    category: 'retro_vintage',
    tags: ['报纸', '新闻', '黑白', '经典'],
    colorScheme: '#2c3e50',
    interactive: false,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="#f5f0e8" rx="0"/>
  <line x1="20" y1="20" x2="580" y2="20" stroke="#2c3e50" stroke-width="4"/>
  <text x="300" y="55" text-anchor="middle" font-size="32" fill="#2c3e50" font-weight="bold" letter-spacing="2">THE DAILY NEWS</text>
  <line x1="20" y1="65" x2="580" y2="65" stroke="#2c3e50" stroke-width="2"/>
  <text x="50" y="82" font-size="9" fill="#666">Vol. CXXIII No. 42</text>
  <text x="300" y="82" text-anchor="middle" font-size="9" fill="#666">WEDNESDAY, JANUARY 1, 2025</text>
  <text x="550" y="82" text-anchor="end" font-size="9" fill="#666">PRICE: $0.25</text>
  <line x1="20" y1="90" x2="580" y2="90" stroke="#2c3e50" stroke-width="1"/>
  <text x="300" y="130" text-anchor="middle" font-size="22" fill="#2c3e50" font-weight="bold">HEADLINE GOES HERE</text>
  <text x="300" y="155" text-anchor="middle" font-size="13" fill="#666">Subheadline with additional context</text>
  <line x1="290" y1="165" x2="310" y2="165" stroke="#2c3e50" stroke-width="2"/>
  <line x1="300" y1="180" x2="300" y2="380" stroke="#d5d0c8" stroke-width="1"/>
  <foreignObject x="30" y="180" width="260" height="200">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:11px;color:#444;line-height:1.6;text-align:justify;column-count:1;">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...
    </div>
  </foreignObject>
  <foreignObject x="310" y="180" width="260" height="200">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:11px;color:#444;line-height:1.6;text-align:justify;">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident...
    </div>
  </foreignObject>
</svg>`
  },
  {
    id: 'retro_stamp_03',
    name: '复古邮票框',
    category: 'retro_vintage',
    tags: ['邮票', '邮寄', '复古', '边框'],
    colorScheme: '#c0392b',
    interactive: false,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="350" fill="#f5f0e8" rx="8"/>
  <g transform="translate(50,25)">
    <rect width="500" height="300" fill="white" stroke="#d5d0c8" stroke-width="2"/>
    <g fill="#f5f0e8">
      <circle cx="0" cy="20" r="8"/><circle cx="0" cy="50" r="8"/><circle cx="0" cy="80" r="8"/><circle cx="0" cy="110" r="8"/><circle cx="0" cy="140" r="8"/><circle cx="0" cy="170" r="8"/><circle cx="0" cy="200" r="8"/><circle cx="0" cy="230" r="8"/><circle cx="0" cy="260" r="8"/><circle cx="0" cy="280" r="8"/>
      <circle cx="500" cy="20" r="8"/><circle cx="500" cy="50" r="8"/><circle cx="500" cy="80" r="8"/><circle cx="500" cy="110" r="8"/><circle cx="500" cy="140" r="8"/><circle cx="500" cy="170" r="8"/><circle cx="500" cy="200" r="8"/><circle cx="500" cy="230" r="8"/><circle cx="500" cy="260" r="8"/><circle cx="500" cy="280" r="8"/>
      <circle cx="20" cy="0" r="8"/><circle cx="50" cy="0" r="8"/><circle cx="80" cy="0" r="8"/><circle cx="110" cy="0" r="8"/><circle cx="140" cy="0" r="8"/><circle cx="170" cy="0" r="8"/><circle cx="200" cy="0" r="8"/><circle cx="230" cy="0" r="8"/><circle cx="260" cy="0" r="8"/><circle cx="290" cy="0" r="8"/><circle cx="320" cy="0" r="8"/><circle cx="350" cy="0" r="8"/><circle cx="380" cy="0" r="8"/><circle cx="410" cy="0" r="8"/><circle cx="440" cy="0" r="8"/><circle cx="470" cy="0" r="8"/>
      <circle cx="20" cy="300" r="8"/><circle cx="50" cy="300" r="8"/><circle cx="80" cy="300" r="8"/><circle cx="110" cy="300" r="8"/><circle cx="140" cy="300" r="8"/><circle cx="170" cy="300" r="8"/><circle cx="200" cy="300" r="8"/><circle cx="230" cy="300" r="8"/><circle cx="260" cy="300" r="8"/><circle cx="290" cy="300" r="8"/><circle cx="320" cy="300" r="8"/><circle cx="350" cy="300" r="8"/><circle cx="380" cy="300" r="8"/><circle cx="410" cy="300" r="8"/><circle cx="440" cy="300" r="8"/><circle cx="470" cy="300" r="8"/>
    </g>
    <rect x="20" y="20" width="460" height="200" fill="#fef3e2" rx="4"/>
    <text x="250" y="120" text-anchor="middle" font-size="14" fill="#a08060">邮票内容区域</text>
    <text x="250" y="250" text-anchor="middle" font-size="18" fill="#c0392b" font-weight="bold" letter-spacing="2">POSTAGE STAMP</text>
    <text x="250" y="275" text-anchor="middle" font-size="24" fill="#2c3e50" font-weight="bold">$1.00</text>
  </g>
</svg>`
  },
  {
    id: 'retro_typewriter_04',
    name: '打字机文本',
    category: 'retro_vintage',
    tags: ['打字机', '文字', '逐字', '复古'],
    colorScheme: '#5d4037',
    interactive: true,
    interactionType: 'click-typewriter',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="250" fill="#faf8f0" rx="8"/>
  <rect x="30" y="30" width="540" height="190" fill="white" stroke="#e0d8c8" stroke-width="1" rx="4"/>
  <g id="ret04_text" style="cursor:pointer;">
    <text x="50" y="70" font-size="16" fill="#5d4037" font-family="monospace" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="ret04_text.click" dur="0.1s" fill="freeze"/>
      &gt; 从前有座山...
    </text>
    <text x="50" y="100" font-size="16" fill="#5d4037" font-family="monospace" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="ret04_text.click+0.5s" dur="0.1s" fill="freeze"/>
      &gt; 山里有座庙...
    </text>
    <text x="50" y="130" font-size="16" fill="#5d4037" font-family="monospace" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="ret04_text.click+1s" dur="0.1s" fill="freeze"/>
      &gt; 庙里有个老和尚...
    </text>
    <text x="50" y="160" font-size="16" fill="#5d4037" font-family="monospace" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="ret04_text.click+1.5s" dur="0.1s" fill="freeze"/>
      &gt; 在给小和尚讲故事...
    </text>
    <text x="50" y="190" font-size="16" fill="#5d4037" font-family="monospace" opacity="0">
      <animate attributeName="opacity" from="0" to="1" begin="ret04_text.click+2s" dur="0.1s" fill="freeze"/>
      &gt; _
    </text>
    <rect x="52" y="178" width="10" height="16" fill="#5d4037" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" begin="ret04_text.click+2s"/>
    </rect>
  </g>
  <text x="300" y="245" text-anchor="middle" font-size="10" fill="#c4a882">点击开始打字</text>
</svg>`
  },
  {
    id: 'retro_vinyl_05',
    name: '黑胶唱片',
    category: 'retro_vintage',
    tags: ['唱片', '音乐', '黑胶', '旋转'],
    colorScheme: '#1a1a1a',
    interactive: true,
    interactionType: 'click-spin-vinyl',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ret05_vinyl" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#333"/><stop offset="30%" stop-color="#1a1a1a"/><stop offset="60%" stop-color="#333"/><stop offset="80%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#333"/></radialGradient>
  </defs>
  <rect width="600" height="350" fill="#f5f0e8" rx="12"/>
  <g transform="translate(300,175)" id="ret05_disc" style="cursor:pointer;">
    <circle r="140" fill="url(#ret05_vinyl)"/>
    <circle r="130" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <circle r="110" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <circle r="90" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <circle r="70" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <circle r="50" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <circle r="35" fill="#c0392b"/>
    <circle r="30" fill="#c0392b" stroke="#a93226" stroke-width="1"/>
    <text x="0" y="-8" text-anchor="middle" font-size="8" fill="white" font-weight="bold">CLASSIC</text>
    <text x="0" y="5" text-anchor="middle" font-size="6" fill="rgba(255,255,255,0.7)">RECORDS</text>
    <circle r="4" fill="#1a1a1a"/>
    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" begin="click"/>
  </g>
  <text x="300" y="335" text-anchor="middle" font-size="11" fill="#a08060">点击播放唱片</text>
</svg>`
  },
  {
    id: 'retro_badge_06',
    name: '复古徽章',
    category: 'retro_vintage',
    tags: ['徽章', '质量', '认证', '复古'],
    colorScheme: '#2c3e50',
    interactive: false,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="300" fill="#f5f0e8" rx="12"/>
  <g transform="translate(300,150)">
    <circle r="110" fill="none" stroke="#2c3e50" stroke-width="3"/>
    <circle r="100" fill="none" stroke="#2c3e50" stroke-width="1"/>
    <circle r="95" fill="none" stroke="#2c3e50" stroke-width="1" stroke-dasharray="2 4"/>
    <circle r="85" fill="none" stroke="#2c3e50" stroke-width="2"/>
    <text x="0" y="-40" text-anchor="middle" font-size="10" fill="#2c3e50" letter-spacing="4">ESTABLISHED</text>
    <text x="0" y="0" text-anchor="middle" font-size="32" fill="#2c3e50" font-weight="bold">PREMIUM</text>
    <text x="0" y="25" text-anchor="middle" font-size="14" fill="#2c3e50" letter-spacing="6">QUALITY</text>
    <line x1="-60" y1="35" x2="60" y2="35" stroke="#2c3e50" stroke-width="1"/>
    <text x="0" y="55" text-anchor="middle" font-size="10" fill="#2c3e50" letter-spacing="2">SINCE 1921</text>
    <g transform="rotate(0)" fill="none" stroke="#2c3e50" stroke-width="1">
      <path d="M-95,-30 L-110,-25"/>
      <path d="M-90,-50 L-105,-48"/>
      <path d="M95,-30 L110,-25"/>
      <path d="M90,-50 L105,-48"/>
    </g>
  </g>
</svg>`
  }
]
