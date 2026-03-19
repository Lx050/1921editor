/**
 * SVG Templates Pro - E2.COOL / GQ Lab 级别专业交互模板
 * 基于微信公众号 SOTA 交互技术研究成果
 *
 * 新增 8 大类别:
 *  1. sandwich_slide   - 夹层滑动 (6) - 多图层差速滑动
 *  2. shatter_effect   - 碎片粉碎 (6) - 元素碎裂飞散
 *  3. frame_sequence   - 序列帧播放 (6) - 逐帧动画
 *  4. parallax_3d      - 3D视差进阶 (6) - 深度视差
 *  5. mutex_accordion  - 互斥展开 (6) - 排他手风琴
 *  6. product_showcase  - 产品展台 (6) - 无限选择器
 *  7. map_hotspot      - 地图热区 (6) - 多点弹窗
 *  8. unlock_reveal    - 解锁揭秘 (6) - 密码/序列解锁
 *
 * 全部使用 SMIL 动画, 兼容微信 WebView
 */

// ==================== 1. 夹层滑动 sandwich_slide ====================
export const SVG_SANDWICH_SLIDE = [
  {
    id: 'sandwich_classic_01',
    name: '经典夹层滑动',
    category: 'sandwich_slide',
    tags: ['夹层', '滑动', 'GQ风格', '多层'],
    colorScheme: '#667eea',
    interactive: true,
    interactionType: 'click-sandwich-slide',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ss01_top" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#667eea"/><stop offset="100%" stop-color="#764ba2"/></linearGradient>
    <linearGradient id="ss01_bot" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#f093fb"/><stop offset="100%" stop-color="#f5576c"/></linearGradient>
    <linearGradient id="ss01_bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f0c29"/><stop offset="100%" stop-color="#302b63"/></linearGradient>
    <clipPath id="ss01_outer"><rect width="600" height="400" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#ss01_outer)">
    <rect width="600" height="400" fill="url(#ss01_bg)"/>
    <text x="300" y="190" text-anchor="middle" font-size="28" fill="rgba(255,255,255,0.15)" font-weight="bold">HIDDEN MESSAGE</text>
    <text x="300" y="220" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.1)">你发现了秘密内容</text>
    <g id="ss01_trigger" style="cursor:pointer;">
      <rect y="0" width="600" height="200" fill="url(#ss01_top)">
        <animate attributeName="x" from="0" to="-620" begin="ss01_trigger.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </rect>
      <text x="300" y="100" text-anchor="middle" font-size="22" fill="white" font-weight="bold">
        <animate attributeName="x" from="300" to="-320" begin="ss01_trigger.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        上层 - 向左滑出
      </text>
      <rect y="200" width="600" height="200" fill="url(#ss01_bot)">
        <animate attributeName="x" from="0" to="620" begin="ss01_trigger.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </rect>
      <text x="300" y="310" text-anchor="middle" font-size="22" fill="white" font-weight="bold">
        <animate attributeName="x" from="300" to="920" begin="ss01_trigger.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        下层 - 向右滑出
      </text>
      <text x="300" y="205" text-anchor="middle" font-size="14" fill="white" opacity="0.6">点击触发夹层滑动</text>
      <circle cx="300" cy="200" r="3" fill="white"><animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/></circle>
    </g>
  </g>
</svg>`
  },
  {
    id: 'sandwich_vertical_02',
    name: '纵向夹层滑动',
    category: 'sandwich_slide',
    tags: ['纵向', '上下', '夹层', '滑动'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-v-sandwich',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ss02_l" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1abc9c"/><stop offset="100%" stop-color="#16a085"/></linearGradient>
    <linearGradient id="ss02_r" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e74c3c"/><stop offset="100%" stop-color="#c0392b"/></linearGradient>
    <clipPath id="ss02_outer"><rect width="600" height="400" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#ss02_outer)">
    <rect width="600" height="400" fill="#1a1a2e"/>
    <text x="300" y="195" text-anchor="middle" font-size="20" fill="rgba(255,255,255,0.2)" font-weight="bold">夹层中的秘密</text>
    <text x="300" y="220" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.1)">上下分离 · 中间固定</text>
    <g id="ss02_click" style="cursor:pointer;">
      <rect x="0" y="0" width="300" height="400" fill="url(#ss02_l)">
        <animate attributeName="y" from="0" to="-420" begin="ss02_click.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </rect>
      <text x="150" y="200" text-anchor="middle" font-size="18" fill="white" font-weight="bold">
        <animate attributeName="y" from="200" to="-220" begin="ss02_click.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        左半 ↑
      </text>
      <rect x="300" y="0" width="300" height="400" fill="url(#ss02_r)">
        <animate attributeName="y" from="0" to="420" begin="ss02_click.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </rect>
      <text x="450" y="200" text-anchor="middle" font-size="18" fill="white" font-weight="bold">
        <animate attributeName="y" from="200" to="620" begin="ss02_click.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        右半 ↓
      </text>
      <text x="300" y="380" text-anchor="middle" font-size="12" fill="white" opacity="0.5">点击分离</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'sandwich_triple_03',
    name: '三层错速滑动',
    category: 'sandwich_slide',
    tags: ['三层', '错速', '差速', '进阶'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-triple-layer',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="ss03_outer"><rect width="600" height="400" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#ss03_outer)">
    <rect width="600" height="400" fill="#2c3e50"/>
    <text x="300" y="200" text-anchor="middle" font-size="24" fill="rgba(255,255,255,0.15)" font-weight="bold">THREE LAYERS</text>
    <g id="ss03_layers" style="cursor:pointer;">
      <g>
        <rect width="600" height="133" fill="#e74c3c" opacity="0.9"/>
        <text x="300" y="75" text-anchor="middle" font-size="16" fill="white">第一层 · 快速</text>
        <animate attributeName="transform" type="translate" from="0 0" to="-700 0" begin="ss03_layers.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </g>
      <g>
        <rect y="133" width="600" height="134" fill="#f39c12" opacity="0.9"/>
        <text x="300" y="208" text-anchor="middle" font-size="16" fill="white">第二层 · 中速</text>
        <animate attributeName="transform" type="translate" from="0 0" to="700 0" begin="ss03_layers.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </g>
      <g>
        <rect y="267" width="600" height="133" fill="#27ae60" opacity="0.9"/>
        <text x="300" y="342" text-anchor="middle" font-size="16" fill="white">第三层 · 慢速</text>
        <animate attributeName="transform" type="translate" from="0 0" to="-700 0" begin="ss03_layers.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </g>
      <text x="300" y="390" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.4)">点击体验三层差速滑动</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'sandwich_reveal_04',
    name: '夹层文字揭秘',
    category: 'sandwich_slide',
    tags: ['文字', '揭秘', '夹层', '阅读'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-text-sandwich',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ss04_top" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9b59b6"/><stop offset="100%" stop-color="#8e44ad"/></linearGradient>
    <clipPath id="ss04_outer"><rect width="600" height="300" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#ss04_outer)">
    <rect width="600" height="300" fill="#fafafa"/>
    <foreignObject x="50" y="80" width="500" height="140">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;color:#333;line-height:2;text-align:center;">
        <p style="margin:0;font-size:22px;font-weight:bold;color:#9b59b6;">答案揭晓</p>
        <p style="margin:8px 0 0;">真正的智慧不在于知道所有答案</p>
        <p style="margin:0;">而在于提出正确的问题</p>
      </div>
    </foreignObject>
    <g id="ss04_cover" style="cursor:pointer;">
      <rect width="600" height="300" fill="url(#ss04_top)"/>
      <text x="300" y="130" text-anchor="middle" font-size="28" fill="white" font-weight="bold">???</text>
      <text x="300" y="165" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.7)">点击揭开谜底</text>
      <rect x="225" y="180" width="150" height="35" rx="17" fill="rgba(255,255,255,0.15)"/>
      <text x="300" y="203" text-anchor="middle" font-size="13" fill="white">揭 秘</text>
      <animate attributeName="transform" type="translate" from="0 0" to="0 -320" begin="click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </g>
  </g>
</svg>`
  },
  {
    id: 'sandwich_magazine_05',
    name: '杂志翻页夹层',
    category: 'sandwich_slide',
    tags: ['杂志', '翻页', '出版', '高级'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-magazine-page',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ss05_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#ss05_clip)">
    <rect width="600" height="400" fill="#f5f0e8"/>
    <text x="300" y="180" text-anchor="middle" font-size="14" fill="#999">第二页内容</text>
    <rect x="60" y="100" width="480" height="200" rx="8" fill="#ecf0f1"/>
    <text x="300" y="200" text-anchor="middle" font-size="16" fill="#666">翻页后的精彩内容在此...</text>
    <g id="ss05_page" style="cursor:pointer;">
      <rect width="600" height="400" fill="#2c3e50"/>
      <text x="300" y="50" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)" letter-spacing="6">MAGAZINE</text>
      <text x="300" y="170" text-anchor="middle" font-size="36" fill="white" font-weight="bold">封面故事</text>
      <text x="300" y="210" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.5)">COVER STORY | 2025</text>
      <line x1="200" y1="230" x2="400" y2="230" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="300" y="260" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.4)">点击翻到下一页</text>
      <polygon points="290,280 310,280 300,295" fill="rgba(255,255,255,0.3)"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/></polygon>
      <animateTransform attributeName="transform" type="scale" from="1 1" to="0 1" begin="click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
    </g>
  </g>
</svg>`
  },
  {
    id: 'sandwich_door_06',
    name: '双开门夹层',
    category: 'sandwich_slide',
    tags: ['双开门', '对称', '门', '打开'],
    colorScheme: '#c0392b',
    interactive: true,
    interactionType: 'click-double-door',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ss06_dl" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#e74c3c"/></linearGradient>
    <linearGradient id="ss06_dr" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c0392b"/><stop offset="100%" stop-color="#e74c3c"/></linearGradient>
    <clipPath id="ss06_clip"><rect width="600" height="400" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#ss06_clip)">
    <rect width="600" height="400" fill="#1a1a2e"/>
    <text x="300" y="190" text-anchor="middle" font-size="24" fill="rgba(255,255,255,0.15)" font-weight="bold">WELCOME</text>
    <text x="300" y="220" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.1)">欢迎来到新世界</text>
    <g id="ss06_doors" style="cursor:pointer;">
      <rect x="0" y="0" width="300" height="400" fill="url(#ss06_dl)">
        <animate attributeName="x" from="0" to="-310" begin="ss06_doors.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </rect>
      <rect x="300" y="0" width="300" height="400" fill="url(#ss06_dr)">
        <animate attributeName="x" from="300" to="610" begin="ss06_doors.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </rect>
      <line x1="300" y1="0" x2="300" y2="400" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>
      <circle cx="280" cy="200" r="8" fill="none" stroke="#f1c40f" stroke-width="2"/><circle cx="320" cy="200" r="8" fill="none" stroke="#f1c40f" stroke-width="2"/>
      <text x="300" y="330" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.5)">点击开门</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 2. 碎片粉碎 shatter_effect ====================
export const SVG_SHATTER_EFFECT = [
  {
    id: 'shatter_grid_01',
    name: '网格碎片飞散',
    category: 'shatter_effect',
    tags: ['碎片', '粉碎', '飞散', '爆炸'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-shatter',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sh01_bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e74c3c"/><stop offset="100%" stop-color="#c0392b"/></linearGradient>
    <clipPath id="sh01_clip"><rect width="600" height="400" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#sh01_clip)">
    <rect width="600" height="400" fill="#1a1a1a"/>
    <text x="300" y="200" text-anchor="middle" font-size="28" fill="rgba(255,255,255,0.2)" font-weight="bold">SHATTERED</text>
    <g id="sh01_grid" style="cursor:pointer;">
      <rect x="0" y="0" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="-200 -150" begin="sh01_grid.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.3s" dur="0.5s" fill="freeze"/></rect>
      <rect x="150" y="0" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="-50 -200" begin="sh01_grid.click" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.2s" dur="0.5s" fill="freeze"/></rect>
      <rect x="300" y="0" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="80 -180" begin="sh01_grid.click" dur="0.75s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.25s" dur="0.5s" fill="freeze"/></rect>
      <rect x="450" y="0" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="220 -130" begin="sh01_grid.click" dur="0.85s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.3s" dur="0.5s" fill="freeze"/></rect>
      <rect x="0" y="100" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="-250 -50" begin="sh01_grid.click" dur="0.65s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.15s" dur="0.5s" fill="freeze"/></rect>
      <rect x="150" y="100" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="-100 80" begin="sh01_grid.click" dur="0.9s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.35s" dur="0.5s" fill="freeze"/></rect>
      <rect x="300" y="100" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="120 60" begin="sh01_grid.click" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.2s" dur="0.5s" fill="freeze"/></rect>
      <rect x="450" y="100" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="200 90" begin="sh01_grid.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.25s" dur="0.5s" fill="freeze"/></rect>
      <rect x="0" y="200" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="-180 100" begin="sh01_grid.click" dur="0.75s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.2s" dur="0.5s" fill="freeze"/></rect>
      <rect x="150" y="200" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="-60 160" begin="sh01_grid.click" dur="0.85s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.3s" dur="0.5s" fill="freeze"/></rect>
      <rect x="300" y="200" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="90 180" begin="sh01_grid.click" dur="0.9s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.35s" dur="0.5s" fill="freeze"/></rect>
      <rect x="450" y="200" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="230 140" begin="sh01_grid.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.3s" dur="0.5s" fill="freeze"/></rect>
      <rect x="0" y="300" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="-220 200" begin="sh01_grid.click" dur="0.85s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.25s" dur="0.5s" fill="freeze"/></rect>
      <rect x="150" y="300" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="-30 250" begin="sh01_grid.click" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.2s" dur="0.5s" fill="freeze"/></rect>
      <rect x="300" y="300" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="60 220" begin="sh01_grid.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.3s" dur="0.5s" fill="freeze"/></rect>
      <rect x="450" y="300" width="150" height="100" fill="url(#sh01_bg)"><animateTransform attributeName="transform" type="translate" from="0 0" to="200 240" begin="sh01_grid.click" dur="0.9s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh01_grid.click+0.35s" dur="0.5s" fill="freeze"/></rect>
      <text x="300" y="200" text-anchor="middle" font-size="24" fill="white" font-weight="bold">点击粉碎</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'shatter_circle_02',
    name: '圆形碎片扩散',
    category: 'shatter_effect',
    tags: ['圆形', '扩散', '碎片', '中心'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-circle-shatter',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sh02_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#sh02_clip)">
    <rect width="600" height="400" fill="#0d1b2a"/>
    <text x="300" y="200" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.15)">碎片飞散后的世界</text>
    <g id="sh02_pieces" style="cursor:pointer;">
      <circle cx="300" cy="200" r="25" fill="#3498db"><animateTransform attributeName="transform" type="translate" from="0 0" to="0 -200" begin="sh02_pieces.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh02_pieces.click+0.3s" dur="0.3s" fill="freeze"/></circle>
      <circle cx="300" cy="200" r="25" fill="#2980b9"><animateTransform attributeName="transform" type="translate" from="0 0" to="190 -60" begin="sh02_pieces.click" dur="0.65s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh02_pieces.click+0.3s" dur="0.35s" fill="freeze"/></circle>
      <circle cx="300" cy="200" r="25" fill="#1abc9c"><animateTransform attributeName="transform" type="translate" from="0 0" to="120 160" begin="sh02_pieces.click" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh02_pieces.click+0.35s" dur="0.35s" fill="freeze"/></circle>
      <circle cx="300" cy="200" r="25" fill="#16a085"><animateTransform attributeName="transform" type="translate" from="0 0" to="-120 160" begin="sh02_pieces.click" dur="0.55s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh02_pieces.click+0.25s" dur="0.3s" fill="freeze"/></circle>
      <circle cx="300" cy="200" r="25" fill="#2ecc71"><animateTransform attributeName="transform" type="translate" from="0 0" to="-190 -60" begin="sh02_pieces.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh02_pieces.click+0.3s" dur="0.3s" fill="freeze"/></circle>
      <circle cx="300" cy="200" r="25" fill="#e74c3c"><animateTransform attributeName="transform" type="translate" from="0 0" to="0 200" begin="sh02_pieces.click" dur="0.75s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="0" begin="sh02_pieces.click+0.35s" dur="0.4s" fill="freeze"/></circle>
      <circle cx="300" cy="200" r="40" fill="none" stroke="white" stroke-width="2" opacity="0.5"><animate attributeName="r" values="40;43;40" dur="2s" repeatCount="indefinite"/></circle>
      <text x="300" y="205" text-anchor="middle" font-size="14" fill="white" font-weight="bold">BOOM</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'shatter_text_03',
    name: '文字粉碎效果',
    category: 'shatter_effect',
    tags: ['文字', '消散', '粉碎', '字体'],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click-text-shatter',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sh03_clip"><rect width="600" height="200" rx="12"/></clipPath></defs>
  <g clip-path="url(#sh03_clip)">
    <rect width="600" height="200" fill="#2c3e50"/>
    <text x="300" y="105" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.15)">文字消散后的真相</text>
    <g id="sh03_text" style="cursor:pointer;">
      <text x="100" y="115" font-size="48" fill="#f1c40f" font-weight="bold"><animate attributeName="y" from="115" to="-50" begin="sh03_text.click" dur="0.6s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh03_text.click+0.2s" dur="0.4s" fill="freeze"/>点</text>
      <text x="165" y="115" font-size="48" fill="#f39c12" font-weight="bold"><animate attributeName="y" from="115" to="260" begin="sh03_text.click+0.05s" dur="0.6s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh03_text.click+0.25s" dur="0.4s" fill="freeze"/>击</text>
      <text x="230" y="115" font-size="48" fill="#e67e22" font-weight="bold"><animate attributeName="y" from="115" to="-80" begin="sh03_text.click+0.1s" dur="0.7s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh03_text.click+0.3s" dur="0.4s" fill="freeze"/>粉</text>
      <text x="295" y="115" font-size="48" fill="#d35400" font-weight="bold"><animate attributeName="y" from="115" to="280" begin="sh03_text.click+0.15s" dur="0.5s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh03_text.click+0.2s" dur="0.3s" fill="freeze"/>碎</text>
      <text x="360" y="115" font-size="48" fill="#e74c3c" font-weight="bold"><animate attributeName="y" from="115" to="-60" begin="sh03_text.click+0.08s" dur="0.65s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh03_text.click+0.28s" dur="0.4s" fill="freeze"/>文</text>
      <text x="425" y="115" font-size="48" fill="#c0392b" font-weight="bold"><animate attributeName="y" from="115" to="250" begin="sh03_text.click+0.12s" dur="0.55s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh03_text.click+0.22s" dur="0.35s" fill="freeze"/>字</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'shatter_diamond_04',
    name: '钻石碎裂',
    category: 'shatter_effect',
    tags: ['钻石', '碎裂', '闪光', '奢华'],
    colorScheme: '#5dade2',
    interactive: true,
    interactionType: 'click-diamond-shatter',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sh04_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#sh04_clip)">
    <rect width="600" height="350" fill="#0a0a1a"/>
    <text x="300" y="180" text-anchor="middle" font-size="16" fill="rgba(93,173,226,0.2)">BRILLIANT</text>
    <g id="sh04_diamond" style="cursor:pointer;" transform="translate(300,175)">
      <polygon points="0,-80 -70,0 -40,60 40,60 70,0" fill="#5dade2" opacity="0.9"><animateTransform attributeName="transform" type="translate" from="0 0" to="-200 -150" begin="sh04_diamond.click" dur="0.7s" fill="freeze"/><animate attributeName="opacity" from="0.9" to="0" begin="sh04_diamond.click+0.3s" dur="0.4s" fill="freeze"/></polygon>
      <polygon points="0,-80 70,0 40,60 0,20" fill="#85c1e9"><animateTransform attributeName="transform" type="translate" from="0 0" to="200 -120" begin="sh04_diamond.click" dur="0.65s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh04_diamond.click+0.25s" dur="0.4s" fill="freeze"/></polygon>
      <polygon points="0,-80 -70,0 0,20" fill="#aed6f1"><animateTransform attributeName="transform" type="translate" from="0 0" to="-150 -180" begin="sh04_diamond.click" dur="0.8s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh04_diamond.click+0.35s" dur="0.45s" fill="freeze"/></polygon>
      <polygon points="-70,0 -40,60 0,20" fill="#3498db"><animateTransform attributeName="transform" type="translate" from="0 0" to="-180 150" begin="sh04_diamond.click" dur="0.75s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh04_diamond.click+0.3s" dur="0.45s" fill="freeze"/></polygon>
      <polygon points="70,0 40,60 0,20" fill="#2980b9"><animateTransform attributeName="transform" type="translate" from="0 0" to="180 130" begin="sh04_diamond.click" dur="0.7s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh04_diamond.click+0.35s" dur="0.35s" fill="freeze"/></polygon>
      <polygon points="-40,60 40,60 0,20" fill="#1a5276"><animateTransform attributeName="transform" type="translate" from="0 0" to="0 200" begin="sh04_diamond.click" dur="0.85s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sh04_diamond.click+0.4s" dur="0.45s" fill="freeze"/></polygon>
      <text x="0" y="100" text-anchor="middle" font-size="11" fill="rgba(93,173,226,0.5)">点击碎裂钻石</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'shatter_card_05',
    name: '卡片撕裂效果',
    category: 'shatter_effect',
    tags: ['撕裂', '卡片', '破坏', '揭示'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-tear-card',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sh05_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#sh05_clip)">
    <rect width="600" height="300" fill="#fafafa"/>
    <text x="300" y="150" text-anchor="middle" font-size="20" fill="#8e44ad" font-weight="bold">隐藏的真相</text>
    <g id="sh05_card" style="cursor:pointer;">
      <rect x="0" y="0" width="295" height="300" fill="#8e44ad">
        <animate attributeName="x" from="0" to="-310" begin="sh05_card.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </rect>
      <rect x="305" y="0" width="295" height="300" fill="#9b59b6">
        <animate attributeName="x" from="305" to="615" begin="sh05_card.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </rect>
      <path d="M295,0 L300,50 L305,0 M295,50 L303,100 L305,50 M295,100 L298,150 L305,100 M295,150 L302,200 L305,150 M295,200 L300,250 L305,200 M295,250 L303,300 L305,250" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>
      <text x="300" y="140" text-anchor="middle" font-size="24" fill="white" font-weight="bold">TEAR ME</text>
      <text x="300" y="170" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.6)">点击撕开卡片</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'shatter_pixel_06',
    name: '像素化消散',
    category: 'shatter_effect',
    tags: ['像素', '消散', '数码', '科技'],
    colorScheme: '#2ecc71',
    interactive: true,
    interactionType: 'click-pixelate',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sh06_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#sh06_clip)">
    <rect width="600" height="300" fill="#1a1a2e"/>
    <text x="300" y="155" text-anchor="middle" font-size="16" fill="rgba(46,204,113,0.2)">DECODED</text>
    <g id="sh06_pixels" style="cursor:pointer;">
      <rect x="150" y="50" width="300" height="200" rx="8" fill="#2ecc71"/>
      <text x="300" y="155" text-anchor="middle" font-size="20" fill="white" font-weight="bold">PIXEL DISSOLVE</text>
      <text x="300" y="180" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.6)">点击像素化消散</text>
      <g>
        <rect x="150" y="50" width="30" height="20" fill="#2ecc71"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click" dur="0.3s" fill="freeze"/></rect>
        <rect x="180" y="50" width="30" height="20" fill="#27ae60"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.1s" dur="0.3s" fill="freeze"/></rect>
        <rect x="210" y="50" width="30" height="20" fill="#2ecc71"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.2s" dur="0.3s" fill="freeze"/></rect>
        <rect x="240" y="50" width="30" height="20" fill="#27ae60"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.05s" dur="0.3s" fill="freeze"/></rect>
        <rect x="270" y="50" width="30" height="20" fill="#2ecc71"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.15s" dur="0.3s" fill="freeze"/></rect>
        <rect x="300" y="50" width="30" height="20" fill="#27ae60"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.25s" dur="0.3s" fill="freeze"/></rect>
        <rect x="330" y="50" width="30" height="20" fill="#2ecc71"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.08s" dur="0.3s" fill="freeze"/></rect>
        <rect x="360" y="50" width="30" height="20" fill="#27ae60"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.18s" dur="0.3s" fill="freeze"/></rect>
        <rect x="390" y="50" width="30" height="20" fill="#2ecc71"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.28s" dur="0.3s" fill="freeze"/></rect>
        <rect x="420" y="50" width="30" height="20" fill="#27ae60"><animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.12s" dur="0.3s" fill="freeze"/></rect>
      </g>
      <animate attributeName="opacity" from="1" to="0" begin="sh06_pixels.click+0.3s" dur="0.5s" fill="freeze"/>
    </g>
  </g>
</svg>`
  }
]

// ==================== 3. 序列帧播放 frame_sequence ====================
export const SVG_FRAME_SEQUENCE = [
  {
    id: 'frame_filmstrip_01',
    name: '胶片帧滚动',
    category: 'frame_sequence',
    tags: ['胶片', '帧动画', '电影', '滚动'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-filmstrip',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fs01_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#fs01_clip)">
    <rect width="600" height="350" fill="#1a1a1a"/>
    <g id="fs01_strip" style="cursor:pointer;">
      <rect x="50" y="60" width="500" height="230" rx="6" fill="#2c3e50"/>
      <rect x="50" y="60" width="20" height="230" fill="#1a252f"/>
      <rect x="530" y="60" width="20" height="230" fill="#1a252f"/>
      <g><rect x="55" y="70" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="55" y="95" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="55" y="120" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="55" y="145" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="55" y="170" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="55" y="195" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="55" y="220" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="55" y="245" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="55" y="270" width="10" height="15" rx="2" fill="#f1c40f"/></g>
      <g><rect x="535" y="70" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="535" y="95" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="535" y="120" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="535" y="145" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="535" y="170" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="535" y="195" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="535" y="220" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="535" y="245" width="10" height="15" rx="2" fill="#f1c40f"/><rect x="535" y="270" width="10" height="15" rx="2" fill="#f1c40f"/></g>
      <rect x="80" y="80" width="130" height="190" rx="4" fill="#e74c3c"><animate attributeName="opacity" values="1;0.3;0.3;0.3" dur="3s" begin="fs01_strip.click" fill="freeze"/></rect>
      <text x="145" y="180" text-anchor="middle" font-size="13" fill="white">Frame 1</text>
      <rect x="220" y="80" width="130" height="190" rx="4" fill="#3498db"><animate attributeName="opacity" values="0.3;1;0.3;0.3" dur="3s" begin="fs01_strip.click" fill="freeze"/></rect>
      <text x="285" y="180" text-anchor="middle" font-size="13" fill="white">Frame 2</text>
      <rect x="360" y="80" width="130" height="190" rx="4" fill="#2ecc71"><animate attributeName="opacity" values="0.3;0.3;1;0.3" dur="3s" begin="fs01_strip.click" fill="freeze"/></rect>
      <text x="425" y="180" text-anchor="middle" font-size="13" fill="white">Frame 3</text>
      <text x="300" y="320" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.4)">点击播放胶片帧</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'frame_countdown_02',
    name: '倒计时序列',
    category: 'frame_sequence',
    tags: ['倒计时', '数字', '计数', '序列'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-countdown',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fs02_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#fs02_clip)">
    <rect width="600" height="300" fill="#0d1117"/>
    <g id="fs02_count" style="cursor:pointer;">
      <text x="300" y="170" text-anchor="middle" font-size="120" fill="#e74c3c" font-weight="bold" opacity="1">3<animate attributeName="opacity" values="1;0" dur="0.5s" begin="fs02_count.click+0s" fill="freeze"/></text>
      <text x="300" y="170" text-anchor="middle" font-size="120" fill="#f39c12" font-weight="bold" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1s" begin="fs02_count.click+0.5s" fill="freeze"/></text>
      <text x="300" y="170" text-anchor="middle" font-size="120" fill="#f39c12" font-weight="bold">2<animate attributeName="opacity" values="0;1;0" dur="1s" begin="fs02_count.click+0.5s" fill="freeze"/></text>
      <text x="300" y="170" text-anchor="middle" font-size="120" fill="#2ecc71" font-weight="bold">1<animate attributeName="opacity" values="0;1;0" dur="1s" begin="fs02_count.click+1.5s" fill="freeze"/></text>
      <text x="300" y="170" text-anchor="middle" font-size="60" fill="#3498db" font-weight="bold">GO!<animate attributeName="opacity" values="0;1" dur="0.3s" begin="fs02_count.click+2.5s" fill="freeze"/></text>
      <text x="300" y="270" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.4)">点击开始倒计时</text>
      <circle cx="300" cy="150" r="80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
    </g>
  </g>
</svg>`
  },
  {
    id: 'frame_flipbook_03',
    name: '翻页动画书',
    category: 'frame_sequence',
    tags: ['翻页', '动画', '书本', '故事'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-flipbook',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fs03_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#fs03_clip)">
    <rect width="600" height="350" fill="#f5f0e8"/>
    <rect x="100" y="30" width="400" height="280" rx="6" fill="white" stroke="#ddd" stroke-width="1"/>
    <g id="fs03_pages" style="cursor:pointer;">
      <g opacity="1"><rect x="110" y="40" width="380" height="260" fill="#fff8e1"/><text x="300" y="140" text-anchor="middle" font-size="22" fill="#2c3e50" font-weight="bold">第一章</text><text x="300" y="180" text-anchor="middle" font-size="14" fill="#666">故事从这里开始...</text><animate attributeName="opacity" values="1;0" dur="0.4s" begin="fs03_pages.click" fill="freeze"/></g>
      <g opacity="0"><rect x="110" y="40" width="380" height="260" fill="#e8f5e9"/><text x="300" y="140" text-anchor="middle" font-size="22" fill="#27ae60" font-weight="bold">第二章</text><text x="300" y="180" text-anchor="middle" font-size="14" fill="#666">旅途中的风景...</text><animate attributeName="opacity" values="0;1;1;0" dur="2s" begin="fs03_pages.click+0.4s" fill="freeze"/></g>
      <g opacity="0"><rect x="110" y="40" width="380" height="260" fill="#e3f2fd"/><text x="300" y="140" text-anchor="middle" font-size="22" fill="#2980b9" font-weight="bold">第三章</text><text x="300" y="180" text-anchor="middle" font-size="14" fill="#666">终章 · 再见</text><animate attributeName="opacity" values="0;1" dur="0.4s" begin="fs03_pages.click+2.4s" fill="freeze"/></g>
      <text x="300" y="330" text-anchor="middle" font-size="11" fill="#999">点击翻页</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'frame_loader_04',
    name: '加载进度序列',
    category: 'frame_sequence',
    tags: ['加载', '进度', '科技', '数据'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-loader',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fs04_clip"><rect width="600" height="250" rx="12"/></clipPath></defs>
  <g clip-path="url(#fs04_clip)">
    <rect width="600" height="250" fill="#0d1b2a"/>
    <g id="fs04_bar" style="cursor:pointer;">
      <rect x="100" y="100" width="400" height="30" rx="15" fill="rgba(52,152,219,0.2)"/>
      <rect x="100" y="100" width="0" height="30" rx="15" fill="#3498db"><animate attributeName="width" from="0" to="400" begin="fs04_bar.click" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <text x="300" y="80" text-anchor="middle" font-size="36" fill="#3498db" font-weight="bold">0%<animate attributeName="textContent" values="0%;25%;50%;75%;100%" dur="2s" begin="fs04_bar.click" fill="freeze"/></text>
      <text x="300" y="80" text-anchor="middle" font-size="36" fill="#3498db" font-weight="bold"><animate attributeName="opacity" from="1" to="0" begin="fs04_bar.click" dur="0.1s" fill="freeze"/>0%</text>
      <g opacity="0"><text x="300" y="80" text-anchor="middle" font-size="36" fill="#2ecc71" font-weight="bold">DONE!</text><animate attributeName="opacity" from="0" to="1" begin="fs04_bar.click+2s" dur="0.3s" fill="freeze"/></g>
      <text x="300" y="170" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.3)">LOADING SYSTEM</text>
      <text x="300" y="210" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击加载</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'frame_seasons_05',
    name: '四季变换',
    category: 'frame_sequence',
    tags: ['四季', '变换', '自然', '色彩'],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'click-seasons',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fs05_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#fs05_clip)">
    <rect width="600" height="350" fill="#87ceeb"/>
    <g id="fs05_seasons" style="cursor:pointer;">
      <g opacity="1"><rect width="600" height="350" fill="#87ceeb"/><circle cx="500" cy="60" r="40" fill="#f1c40f"/><rect x="0" y="230" width="600" height="120" fill="#27ae60"/><circle cx="150" cy="200" r="40" fill="#2ecc71"/><circle cx="150" cy="170" r="35" fill="#27ae60"/><circle cx="170" cy="180" r="30" fill="#2ecc71"/><rect x="145" y="210" width="10" height="50" fill="#8B4513"/><circle cx="400" cy="190" r="45" fill="#2ecc71"/><circle cx="400" cy="155" r="40" fill="#27ae60"/><rect x="395" y="200" width="10" height="60" fill="#8B4513"/><text x="300" y="30" text-anchor="middle" font-size="18" fill="white" font-weight="bold">春 SPRING</text><animate attributeName="opacity" values="1;0" dur="0.5s" begin="fs05_seasons.click" fill="freeze"/></g>
      <g opacity="0"><rect width="600" height="350" fill="#ff6b6b"/><circle cx="500" cy="60" r="45" fill="#f39c12"/><rect x="0" y="230" width="600" height="120" fill="#e67e22"/><circle cx="150" cy="200" r="40" fill="#e74c3c"/><rect x="145" y="210" width="10" height="50" fill="#8B4513"/><circle cx="400" cy="190" r="45" fill="#c0392b"/><rect x="395" y="200" width="10" height="60" fill="#8B4513"/><text x="300" y="30" text-anchor="middle" font-size="18" fill="white" font-weight="bold">秋 AUTUMN</text><animate attributeName="opacity" values="0;1;1;0" dur="2s" begin="fs05_seasons.click+0.5s" fill="freeze"/></g>
      <g opacity="0"><rect width="600" height="350" fill="#b0c4de"/><circle cx="500" cy="60" r="30" fill="#ddd"/><rect x="0" y="230" width="600" height="120" fill="white"/><rect x="140" y="200" width="20" height="60" fill="#8B4513"/><rect x="390" y="190" width="20" height="70" fill="#8B4513"/><circle cx="100" cy="280" r="15" fill="#ecf0f1"/><circle cx="350" cy="290" r="20" fill="#ecf0f1"/><circle cx="500" cy="275" r="12" fill="#ecf0f1"/><text x="300" y="30" text-anchor="middle" font-size="18" fill="#2c3e50" font-weight="bold">冬 WINTER</text><animate attributeName="opacity" values="0;1" dur="0.5s" begin="fs05_seasons.click+2.5s" fill="freeze"/></g>
      <text x="300" y="340" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.5)">点击切换季节</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'frame_typewriter_06',
    name: '打字机序列',
    category: 'frame_sequence',
    tags: ['打字机', '逐字', '文本', '复古'],
    colorScheme: '#34495e',
    interactive: true,
    interactionType: 'click-typewriter',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fs06_clip"><rect width="600" height="200" rx="12"/></clipPath></defs>
  <g clip-path="url(#fs06_clip)">
    <rect width="600" height="200" fill="#faf8f0"/>
    <rect x="40" y="30" width="520" height="130" rx="4" fill="white" stroke="#e0d8c8" stroke-width="1"/>
    <g id="fs06_type" style="cursor:pointer;">
      <text x="60" y="80" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">从<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click" dur="0.1s" fill="freeze"/></text>
      <text x="85" y="80" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">前<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+0.15s" dur="0.1s" fill="freeze"/></text>
      <text x="110" y="80" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">有<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+0.3s" dur="0.1s" fill="freeze"/></text>
      <text x="135" y="80" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">座<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+0.45s" dur="0.1s" fill="freeze"/></text>
      <text x="160" y="80" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">山<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+0.6s" dur="0.1s" fill="freeze"/></text>
      <text x="185" y="80" font-size="20" fill="#34495e" font-family="serif" opacity="0">，<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+0.75s" dur="0.1s" fill="freeze"/></text>
      <text x="60" y="120" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">山<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+1s" dur="0.1s" fill="freeze"/></text>
      <text x="85" y="120" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">里<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+1.15s" dur="0.1s" fill="freeze"/></text>
      <text x="110" y="120" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">有<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+1.3s" dur="0.1s" fill="freeze"/></text>
      <text x="135" y="120" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">座<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+1.45s" dur="0.1s" fill="freeze"/></text>
      <text x="160" y="120" font-size="20" fill="#2c3e50" font-family="serif" opacity="0">庙<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+1.6s" dur="0.1s" fill="freeze"/></text>
      <text x="185" y="120" font-size="20" fill="#34495e" font-family="serif" opacity="0">。<animate attributeName="opacity" from="0" to="1" begin="fs06_type.click+1.75s" dur="0.1s" fill="freeze"/></text>
      <rect x="60" y="65" width="2" height="25" fill="#2c3e50"><animate attributeName="x" values="60;85;110;135;160;185;60;85;110;135;160;185" dur="2s" begin="fs06_type.click" fill="freeze"/><animate attributeName="opacity" values="1;0;1;0;1" dur="0.8s" repeatCount="indefinite"/></rect>
      <text x="300" y="185" text-anchor="middle" font-size="11" fill="#999">点击开始打字</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 4. 3D视差进阶 parallax_3d ====================
export const SVG_PARALLAX_3D = [
  {
    id: 'parallax_mountain_01',
    name: '山脉远近视差',
    category: 'parallax_3d',
    tags: ['山脉', '远近', '视差', '风景'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-parallax-mountain',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="px01_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#px01_clip)">
    <rect width="600" height="400" fill="#1a1a2e"/>
    <circle cx="480" cy="80" r="30" fill="#f1c40f" opacity="0.8"/>
    <g id="px01_scene" style="cursor:pointer;">
      <g><polygon points="0,400 100,200 250,350 400,180 600,400" fill="#1e3a5f" opacity="0.5"><animateTransform attributeName="transform" type="translate" from="0 0" to="-30 0" begin="px01_scene.click" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><polygon points="-50,400 80,250 200,370 350,220 500,320 650,400" fill="#2c5f8a" opacity="0.6"><animateTransform attributeName="transform" type="translate" from="0 0" to="-60 0" begin="px01_scene.click" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><polygon points="-30,400 50,300 180,370 300,280 420,350 550,290 650,400" fill="#3d7ab5" opacity="0.7"><animateTransform attributeName="transform" type="translate" from="0 0" to="-100 0" begin="px01_scene.click" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><polygon points="0,400 120,330 250,380 380,320 500,370 600,400" fill="#27ae60"><animateTransform attributeName="transform" type="translate" from="0 0" to="-150 0" begin="px01_scene.click" dur="2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <text x="300" y="390" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.4)">点击体验视差滚动</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'parallax_city_02',
    name: '城市天际线',
    category: 'parallax_3d',
    tags: ['城市', '天际线', '建筑', '夜景'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-parallax-city',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="px02_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#px02_clip)">
    <rect width="600" height="350" fill="#0d1b2a"/>
    <g id="px02_city" style="cursor:pointer;">
      <g><rect x="50" y="200" width="40" height="150" fill="#1b2838" opacity="0.5"/><rect x="150" y="180" width="50" height="170" fill="#1b2838" opacity="0.5"/><rect x="350" y="170" width="45" height="180" fill="#1b2838" opacity="0.5"/><rect x="500" y="190" width="55" height="160" fill="#1b2838" opacity="0.5"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-20 0" begin="px02_city.click" dur="2s" fill="freeze"/></g>
      <g><rect x="100" y="150" width="60" height="200" fill="#2c3e50"/><rect x="110" y="160" width="10" height="10" fill="#f1c40f" opacity="0.6"/><rect x="130" y="160" width="10" height="10" fill="#f1c40f" opacity="0.4"/><rect x="110" y="180" width="10" height="10" fill="#f1c40f" opacity="0.8"/><rect x="130" y="180" width="10" height="10" fill="#f1c40f" opacity="0.3"/><rect x="250" y="120" width="70" height="230" fill="#34495e"/><rect x="260" y="130" width="12" height="12" fill="#3498db" opacity="0.5"/><rect x="280" y="130" width="12" height="12" fill="#3498db" opacity="0.7"/><rect x="260" y="155" width="12" height="12" fill="#3498db" opacity="0.4"/><rect x="400" y="140" width="55" height="210" fill="#2c3e50"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-50 0" begin="px02_city.click" dur="2s" fill="freeze"/></g>
      <g><rect x="180" y="100" width="80" height="250" fill="#5d6d7e"/><rect x="190" y="110" width="15" height="15" fill="#f1c40f" opacity="0.9"/><rect x="215" y="110" width="15" height="15" fill="#f1c40f" opacity="0.6"/><rect x="190" y="140" width="15" height="15" fill="#f1c40f" opacity="0.7"/><rect x="215" y="140" width="15" height="15" fill="#f1c40f" opacity="0.9"/><rect x="350" y="80" width="90" height="270" fill="#566573"/><rect x="360" y="90" width="15" height="15" fill="#e74c3c" opacity="0.4"/><rect x="385" y="90" width="15" height="15" fill="#3498db" opacity="0.5"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-90 0" begin="px02_city.click" dur="2s" fill="freeze"/></g>
      <text x="300" y="340" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击 · 城市在移动</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'parallax_ocean_03',
    name: '海洋深度层',
    category: 'parallax_3d',
    tags: ['海洋', '深度', '水下', '层次'],
    colorScheme: '#2980b9',
    interactive: true,
    interactionType: 'click-parallax-ocean',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="px03_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#px03_clip)">
    <rect width="600" height="400" fill="#0a1628"/>
    <g id="px03_ocean" style="cursor:pointer;">
      <rect x="0" y="0" width="600" height="100" fill="#1a5276" opacity="0.4"/>
      <rect x="0" y="100" width="600" height="100" fill="#154360" opacity="0.6"/>
      <rect x="0" y="200" width="600" height="100" fill="#0e2f44" opacity="0.8"/>
      <rect x="0" y="300" width="600" height="100" fill="#071a2a"/>
      <g><circle cx="100" cy="60" r="8" fill="#3498db" opacity="0.3"/><circle cx="300" cy="40" r="5" fill="#5dade2" opacity="0.2"/><circle cx="500" cy="70" r="6" fill="#85c1e9" opacity="0.25"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-20 -10" begin="px03_ocean.click" dur="2s" fill="freeze"/></g>
      <g><ellipse cx="200" cy="180" rx="40" ry="15" fill="#2980b9" opacity="0.3"/><ellipse cx="450" cy="160" rx="35" ry="12" fill="#2471a3" opacity="0.4"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-40 -20" begin="px03_ocean.click" dur="2s" fill="freeze"/></g>
      <g><circle cx="150" cy="280" r="20" fill="#1a5276" opacity="0.5"/><circle cx="400" cy="300" r="25" fill="#154360" opacity="0.4"/><text x="150" y="285" text-anchor="middle" font-size="20" fill="rgba(255,255,255,0.3)">🐠</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-80 -30" begin="px03_ocean.click" dur="2s" fill="freeze"/></g>
      <g><rect x="250" y="350" width="60" height="40" rx="4" fill="#0e2f44" opacity="0.6"/><rect x="350" y="360" width="50" height="35" rx="4" fill="#0a1628" opacity="0.5"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-120 -40" begin="px03_ocean.click" dur="2s" fill="freeze"/></g>
      <text x="300" y="390" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击下潜 · 深海视差</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'parallax_stars_04',
    name: '星空视差',
    category: 'parallax_3d',
    tags: ['星空', '宇宙', '深邃', '梦幻'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-parallax-stars',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="px04_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#px04_clip)">
    <rect width="600" height="400" fill="#0a0a1a"/>
    <g id="px04_stars" style="cursor:pointer;">
      <g><circle cx="50" cy="50" r="1" fill="white" opacity="0.3"/><circle cx="150" cy="100" r="1" fill="white" opacity="0.2"/><circle cx="300" cy="30" r="1" fill="white" opacity="0.4"/><circle cx="450" cy="80" r="1" fill="white" opacity="0.25"/><circle cx="550" cy="120" r="1" fill="white" opacity="0.3"/><circle cx="100" cy="200" r="1" fill="white" opacity="0.2"/><circle cx="400" cy="250" r="1" fill="white" opacity="0.35"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-10 -5" begin="px04_stars.click" dur="3s" fill="freeze"/></g>
      <g><circle cx="80" cy="150" r="1.5" fill="#bb8fce" opacity="0.4"/><circle cx="200" cy="60" r="2" fill="#85c1e9" opacity="0.5"/><circle cx="350" cy="180" r="1.5" fill="#f9e79f" opacity="0.4"/><circle cx="500" cy="50" r="2" fill="#abebc6" opacity="0.45"/><circle cx="250" cy="300" r="1.5" fill="#f5b7b1" opacity="0.3"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-30 -15" begin="px04_stars.click" dur="3s" fill="freeze"/></g>
      <g><circle cx="120" cy="120" r="3" fill="#8e44ad" opacity="0.6"/><circle cx="380" cy="90" r="2.5" fill="#2980b9" opacity="0.5"/><circle cx="480" cy="200" r="3" fill="#e74c3c" opacity="0.4"/><circle cx="220" cy="250" r="2" fill="#f39c12" opacity="0.5"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-60 -25" begin="px04_stars.click" dur="3s" fill="freeze"/></g>
      <g><circle cx="300" cy="200" r="15" fill="none" stroke="#8e44ad" stroke-width="1" opacity="0.3"><animate attributeName="r" values="15;20;15" dur="4s" repeatCount="indefinite"/></circle><circle cx="300" cy="200" r="5" fill="#8e44ad" opacity="0.8"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-100 -40" begin="px04_stars.click" dur="3s" fill="freeze"/></g>
      <text x="300" y="380" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.25)">点击穿越星空</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'parallax_forest_05',
    name: '森林层次',
    category: 'parallax_3d',
    tags: ['森林', '树木', '自然', '层次'],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'click-parallax-forest',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="px05_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#px05_clip)">
    <rect width="600" height="400" fill="#1a3a1a"/>
    <g id="px05_forest" style="cursor:pointer;">
      <g><polygon points="50,350 80,200 110,350" fill="#0d260d" opacity="0.4"/><polygon points="200,350 240,180 280,350" fill="#0d260d" opacity="0.35"/><polygon points="400,350 430,220 460,350" fill="#0d260d" opacity="0.4"/><polygon points="530,350 560,190 590,350" fill="#0d260d" opacity="0.3"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-15 0" begin="px05_forest.click" dur="2s" fill="freeze"/></g>
      <g><polygon points="100,380 150,220 200,380" fill="#1a4d1a" opacity="0.6"/><polygon points="280,380 320,200 360,380" fill="#1a4d1a" opacity="0.55"/><polygon points="450,380 500,230 550,380" fill="#1a4d1a" opacity="0.6"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-40 0" begin="px05_forest.click" dur="2s" fill="freeze"/></g>
      <g><polygon points="30,400 80,260 130,400" fill="#27ae60" opacity="0.7"/><polygon points="180,400 230,240 280,400" fill="#2ecc71" opacity="0.75"/><polygon points="350,400 400,250 450,400" fill="#27ae60" opacity="0.7"/><polygon points="500,400 540,270 580,400" fill="#2ecc71" opacity="0.65"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-80 0" begin="px05_forest.click" dur="2s" fill="freeze"/></g>
      <circle cx="450" cy="80" r="25" fill="#f1c40f" opacity="0.6"/>
      <text x="300" y="390" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击穿行森林</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'parallax_tunnel_06',
    name: '隧道纵深',
    category: 'parallax_3d',
    tags: ['隧道', '纵深', '透视', '空间'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-parallax-tunnel',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="px06_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#px06_clip)">
    <rect width="600" height="400" fill="#0a0a0a"/>
    <g id="px06_tunnel" style="cursor:pointer;">
      <rect x="0" y="0" width="600" height="400" fill="none" stroke="#e67e22" stroke-width="3" opacity="0.15"><animate attributeName="opacity" from="0.15" to="0.4" begin="px06_tunnel.click" dur="1.5s" fill="freeze"/></rect>
      <rect x="50" y="33" width="500" height="334" fill="none" stroke="#e67e22" stroke-width="2.5" opacity="0.2"><animate attributeName="opacity" from="0.2" to="0.5" begin="px06_tunnel.click" dur="1.5s" fill="freeze"/></rect>
      <rect x="100" y="66" width="400" height="268" fill="none" stroke="#e67e22" stroke-width="2" opacity="0.25"><animate attributeName="opacity" from="0.25" to="0.6" begin="px06_tunnel.click" dur="1.5s" fill="freeze"/></rect>
      <rect x="150" y="100" width="300" height="200" fill="none" stroke="#e67e22" stroke-width="1.5" opacity="0.35"><animate attributeName="opacity" from="0.35" to="0.7" begin="px06_tunnel.click" dur="1.5s" fill="freeze"/></rect>
      <rect x="200" y="133" width="200" height="134" fill="none" stroke="#e67e22" stroke-width="1" opacity="0.5"><animate attributeName="opacity" from="0.5" to="0.85" begin="px06_tunnel.click" dur="1.5s" fill="freeze"/></rect>
      <rect x="250" y="166" width="100" height="68" fill="none" stroke="#f39c12" stroke-width="1" opacity="0.7"><animate attributeName="opacity" from="0.7" to="1" begin="px06_tunnel.click" dur="1.5s" fill="freeze"/></rect>
      <circle cx="300" cy="200" r="5" fill="#f1c40f" opacity="0.8"><animate attributeName="r" from="5" to="15" begin="px06_tunnel.click" dur="1.5s" fill="freeze"/><animate attributeName="opacity" from="0.8" to="1" begin="px06_tunnel.click" dur="1.5s" fill="freeze"/></circle>
      <line x1="0" y1="0" x2="250" y2="166" stroke="rgba(230,126,34,0.1)" stroke-width="1"/><line x1="600" y1="0" x2="350" y2="166" stroke="rgba(230,126,34,0.1)" stroke-width="1"/><line x1="0" y1="400" x2="250" y2="234" stroke="rgba(230,126,34,0.1)" stroke-width="1"/><line x1="600" y1="400" x2="350" y2="234" stroke="rgba(230,126,34,0.1)" stroke-width="1"/>
      <text x="300" y="390" text-anchor="middle" font-size="11" fill="rgba(230,126,34,0.4)">点击进入隧道</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 5. 互斥展开 mutex_accordion ====================
export const SVG_MUTEX_ACCORDION = [
  {
    id: 'mutex_classic_01',
    name: '经典互斥手风琴',
    category: 'mutex_accordion',
    tags: ['互斥', '手风琴', '展开', '收缩'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-mutex-accordion',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ma01_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#ma01_clip)">
    <rect width="600" height="350" fill="#fafafa"/>
    <g id="ma01_s1" style="cursor:pointer;">
      <rect x="50" y="20" width="500" height="45" rx="6" fill="#e74c3c"/><text x="80" y="48" font-size="15" fill="white" font-weight="bold">Section A</text><text x="520" y="48" text-anchor="end" font-size="14" fill="rgba(255,255,255,0.7)">+</text>
      <g opacity="0"><rect x="50" y="65" width="500" height="60" rx="0 0 6 6" fill="#fadbd8"/><text x="80" y="100" font-size="13" fill="#666">展开了 Section A 的详细内容区域。</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma01_s1.click" dur="0.3s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma01_s2.click" dur="0.2s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma01_s3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="ma01_s2" style="cursor:pointer;">
      <rect x="50" y="135" width="500" height="45" rx="6" fill="#3498db"/><text x="80" y="163" font-size="15" fill="white" font-weight="bold">Section B</text><text x="520" y="163" text-anchor="end" font-size="14" fill="rgba(255,255,255,0.7)">+</text>
      <g opacity="0"><rect x="50" y="180" width="500" height="60" rx="0 0 6 6" fill="#d6eaf8"/><text x="80" y="215" font-size="13" fill="#666">展开了 Section B 的详细内容区域。</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma01_s2.click" dur="0.3s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma01_s1.click" dur="0.2s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma01_s3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="ma01_s3" style="cursor:pointer;">
      <rect x="50" y="250" width="500" height="45" rx="6" fill="#27ae60"/><text x="80" y="278" font-size="15" fill="white" font-weight="bold">Section C</text><text x="520" y="278" text-anchor="end" font-size="14" fill="rgba(255,255,255,0.7)">+</text>
      <g opacity="0"><rect x="50" y="295" width="500" height="50" rx="0 0 6 6" fill="#d5f5e3"/><text x="80" y="325" font-size="13" fill="#666">展开了 Section C 的详细内容区域。</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma01_s3.click" dur="0.3s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma01_s1.click" dur="0.2s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma01_s2.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
  </g>
</svg>`
  },
  {
    id: 'mutex_image_02',
    name: '图片互斥展开',
    category: 'mutex_accordion',
    tags: ['图片', '互斥', '画廊', '切换'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-mutex-image',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ma02_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ma02_clip)">
    <rect width="600" height="300" fill="#1a1a2e"/>
    <g id="ma02_a" style="cursor:pointer;">
      <rect x="20" y="20" width="170" height="260" rx="8" fill="#9b59b6"/>
      <text x="105" y="150" text-anchor="middle" font-size="14" fill="white" font-weight="bold">A</text>
      <animate attributeName="opacity" from="1" to="1" begin="ma02_a.click" dur="0.1s" fill="freeze"/>
      <rect x="20" y="20" width="170" height="260" rx="8" fill="none" stroke="white" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="ma02_a.click" dur="0.3s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="ma02_b.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="ma02_c.click" dur="0.2s" fill="freeze"/></rect>
    </g>
    <g id="ma02_b" style="cursor:pointer;">
      <rect x="210" y="20" width="170" height="260" rx="8" fill="#2980b9"/>
      <text x="295" y="150" text-anchor="middle" font-size="14" fill="white" font-weight="bold">B</text>
      <rect x="210" y="20" width="170" height="260" rx="8" fill="none" stroke="white" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="ma02_b.click" dur="0.3s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="ma02_a.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="ma02_c.click" dur="0.2s" fill="freeze"/></rect>
    </g>
    <g id="ma02_c" style="cursor:pointer;">
      <rect x="400" y="20" width="170" height="260" rx="8" fill="#e67e22"/>
      <text x="485" y="150" text-anchor="middle" font-size="14" fill="white" font-weight="bold">C</text>
      <rect x="400" y="20" width="170" height="260" rx="8" fill="none" stroke="white" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="ma02_c.click" dur="0.3s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="ma02_a.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="ma02_b.click" dur="0.2s" fill="freeze"/></rect>
    </g>
  </g>
</svg>`
  },
  {
    id: 'mutex_timeline_03',
    name: '时间线互斥',
    category: 'mutex_accordion',
    tags: ['时间线', '年份', '历史', '互斥'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-mutex-timeline',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ma03_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ma03_clip)">
    <rect width="600" height="300" fill="#2c3e50"/>
    <line x1="100" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <g id="ma03_y1" style="cursor:pointer;">
      <circle cx="150" cy="60" r="12" fill="#f39c12"/><text x="150" y="65" text-anchor="middle" font-size="10" fill="white" font-weight="bold">20</text>
      <g opacity="0"><rect x="80" y="90" width="140" height="100" rx="6" fill="rgba(243,156,18,0.2)"/><text x="150" y="120" text-anchor="middle" font-size="12" fill="white" font-weight="bold">2020</text><text x="150" y="145" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)">起步阶段</text><text x="150" y="165" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.5)">团队创立并发布首版</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma03_y1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma03_y2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma03_y3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="ma03_y2" style="cursor:pointer;">
      <circle cx="300" cy="60" r="12" fill="#e74c3c"/><text x="300" y="65" text-anchor="middle" font-size="10" fill="white" font-weight="bold">22</text>
      <g opacity="0"><rect x="230" y="90" width="140" height="100" rx="6" fill="rgba(231,76,60,0.2)"/><text x="300" y="120" text-anchor="middle" font-size="12" fill="white" font-weight="bold">2022</text><text x="300" y="145" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)">快速增长</text><text x="300" y="165" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.5)">用户量突破百万</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma03_y2.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma03_y1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma03_y3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="ma03_y3" style="cursor:pointer;">
      <circle cx="450" cy="60" r="12" fill="#2ecc71"/><text x="450" y="65" text-anchor="middle" font-size="10" fill="white" font-weight="bold">25</text>
      <g opacity="0"><rect x="380" y="90" width="140" height="100" rx="6" fill="rgba(46,204,113,0.2)"/><text x="450" y="120" text-anchor="middle" font-size="12" fill="white" font-weight="bold">2025</text><text x="450" y="145" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)">全面升级</text><text x="450" y="165" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.5)">AI驱动的新纪元</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma03_y3.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma03_y1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma03_y2.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <text x="300" y="280" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击时间节点 · 互斥显示详情</text>
  </g>
</svg>`
  },
  {
    id: 'mutex_faq_04',
    name: 'FAQ互斥面板',
    category: 'mutex_accordion',
    tags: ['FAQ', '问答', '互斥', '面板'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-mutex-faq',
    svg: `<svg viewBox="0 0 600 320" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ma04_clip"><rect width="600" height="320" rx="12"/></clipPath></defs>
  <g clip-path="url(#ma04_clip)">
    <rect width="600" height="320" fill="white"/>
    <text x="300" y="35" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">FAQ 常见问题</text>
    <g id="ma04_q1" style="cursor:pointer;">
      <rect x="40" y="50" width="520" height="35" rx="4" fill="#1abc9c"/><text x="60" y="73" font-size="13" fill="white">Q: 如何开始使用？</text>
      <g opacity="0"><rect x="40" y="85" width="520" height="40" fill="#e8f8f5"/><text x="60" y="110" font-size="12" fill="#555">A: 注册账号后即可直接使用所有功能。</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma04_q1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma04_q2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma04_q3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="ma04_q2" style="cursor:pointer;">
      <rect x="40" y="135" width="520" height="35" rx="4" fill="#2980b9"/><text x="60" y="158" font-size="13" fill="white">Q: 支持哪些文件格式？</text>
      <g opacity="0"><rect x="40" y="170" width="520" height="40" fill="#d6eaf8"/><text x="60" y="195" font-size="12" fill="#555">A: 支持 DOCX、PDF、TXT 和 Markdown。</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma04_q2.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma04_q1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma04_q3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="ma04_q3" style="cursor:pointer;">
      <rect x="40" y="220" width="520" height="35" rx="4" fill="#8e44ad"/><text x="60" y="243" font-size="13" fill="white">Q: 如何联系客服？</text>
      <g opacity="0"><rect x="40" y="255" width="520" height="40" fill="#f4ecf7"/><text x="60" y="280" font-size="12" fill="#555">A: 可通过右下角客服按钮在线沟通。</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma04_q3.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma04_q1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ma04_q2.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
  </g>
</svg>`
  },
  {
    id: 'mutex_tab_05',
    name: '标签互斥切换',
    category: 'mutex_accordion',
    tags: ['标签', 'Tab', '切换', '互斥'],
    colorScheme: '#34495e',
    interactive: true,
    interactionType: 'click-mutex-tab',
    svg: `<svg viewBox="0 0 600 280" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ma05_clip"><rect width="600" height="280" rx="12"/></clipPath></defs>
  <g clip-path="url(#ma05_clip)">
    <rect width="600" height="280" fill="#ecf0f1"/>
    <g id="ma05_t1" style="cursor:pointer;">
      <rect x="40" y="20" width="160" height="40" rx="6 6 0 0" fill="#34495e"/><text x="120" y="46" text-anchor="middle" font-size="13" fill="white" font-weight="bold">首页</text>
      <g opacity="1"><rect x="40" y="60" width="520" height="200" fill="white" rx="0 6 6 6"/><text x="300" y="150" text-anchor="middle" font-size="16" fill="#34495e">首页内容区域</text><text x="300" y="180" text-anchor="middle" font-size="12" fill="#999">欢迎回来</text>
        <animate attributeName="opacity" values="1" begin="ma05_t1.click" dur="0.1s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma05_t2.click" dur="0.2s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma05_t3.click" dur="0.2s" fill="freeze"/>
        <animate attributeName="opacity" from="0" to="1" begin="ma05_t1.click" dur="0.3s" fill="freeze"/>
      </g>
    </g>
    <g id="ma05_t2" style="cursor:pointer;">
      <rect x="220" y="20" width="160" height="40" rx="6 6 0 0" fill="#7f8c8d"/><text x="300" y="46" text-anchor="middle" font-size="13" fill="white" font-weight="bold">产品</text>
      <g opacity="0"><rect x="40" y="60" width="520" height="200" fill="white" rx="0 6 6 6"/><text x="300" y="150" text-anchor="middle" font-size="16" fill="#2980b9">产品展示区域</text><text x="300" y="180" text-anchor="middle" font-size="12" fill="#999">精选推荐</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma05_t2.click" dur="0.3s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma05_t1.click" dur="0.2s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma05_t3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="ma05_t3" style="cursor:pointer;">
      <rect x="400" y="20" width="160" height="40" rx="6 6 0 0" fill="#7f8c8d"/><text x="480" y="46" text-anchor="middle" font-size="13" fill="white" font-weight="bold">关于</text>
      <g opacity="0"><rect x="40" y="60" width="520" height="200" fill="white" rx="0 6 6 6"/><text x="300" y="150" text-anchor="middle" font-size="16" fill="#27ae60">关于我们</text><text x="300" y="180" text-anchor="middle" font-size="12" fill="#999">了解更多</text>
        <animate attributeName="opacity" from="0" to="1" begin="ma05_t3.click" dur="0.3s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma05_t1.click" dur="0.2s" fill="freeze"/>
        <animate attributeName="opacity" from="1" to="0" begin="ma05_t2.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
  </g>
</svg>`
  },
  {
    id: 'mutex_stack_06',
    name: '堆叠互斥展开',
    category: 'mutex_accordion',
    tags: ['堆叠', '卡片', '层叠', '互斥'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-mutex-stack',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ma06_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#ma06_clip)">
    <rect width="600" height="350" fill="#2c3e50"/>
    <g id="ma06_c1" style="cursor:pointer;">
      <rect x="80" y="30" width="440" height="80" rx="10" fill="#e67e22" opacity="0.9"/><text x="300" y="75" text-anchor="middle" font-size="16" fill="white" font-weight="bold">Card One</text>
      <rect x="80" y="30" width="440" height="80" rx="10" fill="none" stroke="white" stroke-width="0"><animate attributeName="stroke-width" from="0" to="2" begin="ma06_c1.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="2" to="0" begin="ma06_c2.click" dur="0.15s" fill="freeze"/><animate attributeName="stroke-width" from="2" to="0" begin="ma06_c3.click" dur="0.15s" fill="freeze"/></rect>
    </g>
    <g id="ma06_c2" style="cursor:pointer;">
      <rect x="80" y="130" width="440" height="80" rx="10" fill="#2980b9" opacity="0.9"/><text x="300" y="175" text-anchor="middle" font-size="16" fill="white" font-weight="bold">Card Two</text>
      <rect x="80" y="130" width="440" height="80" rx="10" fill="none" stroke="white" stroke-width="0"><animate attributeName="stroke-width" from="0" to="2" begin="ma06_c2.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="2" to="0" begin="ma06_c1.click" dur="0.15s" fill="freeze"/><animate attributeName="stroke-width" from="2" to="0" begin="ma06_c3.click" dur="0.15s" fill="freeze"/></rect>
    </g>
    <g id="ma06_c3" style="cursor:pointer;">
      <rect x="80" y="230" width="440" height="80" rx="10" fill="#27ae60" opacity="0.9"/><text x="300" y="275" text-anchor="middle" font-size="16" fill="white" font-weight="bold">Card Three</text>
      <rect x="80" y="230" width="440" height="80" rx="10" fill="none" stroke="white" stroke-width="0"><animate attributeName="stroke-width" from="0" to="2" begin="ma06_c3.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="2" to="0" begin="ma06_c1.click" dur="0.15s" fill="freeze"/><animate attributeName="stroke-width" from="2" to="0" begin="ma06_c2.click" dur="0.15s" fill="freeze"/></rect>
    </g>
    <text x="300" y="340" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击卡片 · 互斥高亮</text>
  </g>
</svg>`
  }
]

// ==================== 6. 产品展台 product_showcase ====================
export const SVG_PRODUCT_SHOWCASE = [
  {
    id: 'product_carousel_01',
    name: '产品轮播展台',
    category: 'product_showcase',
    tags: ['轮播', '产品', '展台', '商业'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-product-carousel',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ps01_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#ps01_clip)">
    <rect width="600" height="350" fill="#f8f9fa"/>
    <g id="ps01_cards" style="cursor:pointer;">
      <g opacity="1"><rect x="150" y="30" width="300" height="250" rx="12" fill="white" stroke="#eee" stroke-width="1"/><rect x="180" y="50" width="240" height="140" rx="8" fill="#e74c3c"/><text x="300" y="130" text-anchor="middle" font-size="20" fill="white" font-weight="bold">Product A</text><text x="300" y="220" text-anchor="middle" font-size="14" fill="#333" font-weight="bold">Premium Series</text><text x="300" y="245" text-anchor="middle" font-size="12" fill="#999">$299.99</text>
        <animate attributeName="opacity" values="1;0" dur="0.4s" begin="ps01_cards.click" fill="freeze"/>
      </g>
      <g opacity="0"><rect x="150" y="30" width="300" height="250" rx="12" fill="white" stroke="#eee" stroke-width="1"/><rect x="180" y="50" width="240" height="140" rx="8" fill="#3498db"/><text x="300" y="130" text-anchor="middle" font-size="20" fill="white" font-weight="bold">Product B</text><text x="300" y="220" text-anchor="middle" font-size="14" fill="#333" font-weight="bold">Classic Edition</text><text x="300" y="245" text-anchor="middle" font-size="12" fill="#999">$199.99</text>
        <animate attributeName="opacity" values="0;1;1;0" dur="2s" begin="ps01_cards.click+0.4s" fill="freeze"/>
      </g>
      <g opacity="0"><rect x="150" y="30" width="300" height="250" rx="12" fill="white" stroke="#eee" stroke-width="1"/><rect x="180" y="50" width="240" height="140" rx="8" fill="#27ae60"/><text x="300" y="130" text-anchor="middle" font-size="20" fill="white" font-weight="bold">Product C</text><text x="300" y="220" text-anchor="middle" font-size="14" fill="#333" font-weight="bold">Eco Friendly</text><text x="300" y="245" text-anchor="middle" font-size="12" fill="#999">$149.99</text>
        <animate attributeName="opacity" values="0;1" dur="0.4s" begin="ps01_cards.click+2.4s" fill="freeze"/>
      </g>
      <g><circle cx="270" cy="310" r="5" fill="#e74c3c"/><circle cx="300" cy="310" r="5" fill="#ddd"/><circle cx="330" cy="310" r="5" fill="#ddd"/></g>
      <text x="300" y="340" text-anchor="middle" font-size="11" fill="#bbb">点击轮播产品</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'product_360_02',
    name: '360度旋转展示',
    category: 'product_showcase',
    tags: ['360度', '旋转', '3D', '展示'],
    colorScheme: '#34495e',
    interactive: true,
    interactionType: 'click-product-360',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ps02_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#ps02_clip)">
    <rect width="600" height="350" fill="#1a1a2e"/>
    <g id="ps02_rotate" style="cursor:pointer;">
      <ellipse cx="300" cy="280" rx="120" ry="15" fill="rgba(255,255,255,0.05)"/>
      <rect x="240" y="80" width="120" height="180" rx="10" fill="#34495e" stroke="#5d6d7e" stroke-width="1"><animateTransform attributeName="transform" type="rotate" from="0 300 170" to="15 300 170" begin="ps02_rotate.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <rect x="250" y="95" width="100" height="110" rx="4" fill="#2c3e50"><animateTransform attributeName="transform" type="rotate" from="0 300 170" to="15 300 170" begin="ps02_rotate.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <circle cx="300" cy="230" r="12" fill="none" stroke="#5d6d7e" stroke-width="2"><animateTransform attributeName="transform" type="rotate" from="0 300 170" to="15 300 170" begin="ps02_rotate.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></circle>
      <text x="300" y="155" text-anchor="middle" font-size="18" fill="rgba(255,255,255,0.3)" font-weight="bold">PHONE</text>
      <g opacity="0.5"><path d="M 440 170 A 15 15 0 1 1 440 171" fill="none" stroke="white" stroke-width="1.5" stroke-dasharray="4 2"/><polygon points="455,165 455,175 465,170" fill="white" opacity="0.5"/></g>
      <text x="300" y="320" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击旋转产品</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'product_compare_03',
    name: '产品对比展台',
    category: 'product_showcase',
    tags: ['对比', 'VS', '比较', '产品'],
    colorScheme: '#2980b9',
    interactive: true,
    interactionType: 'click-product-compare',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ps03_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#ps03_clip)">
    <rect width="600" height="350" fill="#f5f5f5"/>
    <g id="ps03_vs" style="cursor:pointer;">
      <rect x="30" y="30" width="250" height="270" rx="10" fill="white" stroke="#e0e0e0" stroke-width="1"/>
      <rect x="50" y="50" width="210" height="80" rx="6" fill="#2980b9"/><text x="155" y="100" text-anchor="middle" font-size="18" fill="white" font-weight="bold">标准版</text>
      <text x="155" y="160" text-anchor="middle" font-size="24" fill="#2980b9" font-weight="bold">$99</text>
      <text x="155" y="190" text-anchor="middle" font-size="12" fill="#999">5GB 存储</text>
      <text x="155" y="210" text-anchor="middle" font-size="12" fill="#999">基础功能</text>
      <text x="155" y="230" text-anchor="middle" font-size="12" fill="#999">邮件支持</text>
      <rect x="320" y="30" width="250" height="270" rx="10" fill="white" stroke="#e74c3c" stroke-width="2"/>
      <rect x="340" y="50" width="210" height="80" rx="6" fill="#e74c3c"/><text x="445" y="100" text-anchor="middle" font-size="18" fill="white" font-weight="bold">专业版</text>
      <text x="445" y="160" text-anchor="middle" font-size="24" fill="#e74c3c" font-weight="bold">$299</text>
      <text x="445" y="190" text-anchor="middle" font-size="12" fill="#999">无限存储</text>
      <text x="445" y="210" text-anchor="middle" font-size="12" fill="#999">全部功能</text>
      <text x="445" y="230" text-anchor="middle" font-size="12" fill="#999">24/7 支持</text>
      <circle cx="300" cy="165" r="20" fill="#f39c12"/><text x="300" y="172" text-anchor="middle" font-size="14" fill="white" font-weight="bold">VS</text>
      <rect x="30" y="30" width="250" height="270" rx="10" fill="none" stroke="#2980b9" stroke-width="0"><animate attributeName="stroke-width" values="0;3;0;0" dur="2s" begin="ps03_vs.click" fill="freeze"/></rect>
      <rect x="320" y="30" width="250" height="270" rx="10" fill="none" stroke="#e74c3c" stroke-width="2"><animate attributeName="stroke-width" values="2;0;3;2" dur="2s" begin="ps03_vs.click" fill="freeze"/></rect>
      <text x="300" y="340" text-anchor="middle" font-size="11" fill="#bbb">点击对比闪烁</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'product_popup_04',
    name: '弹出详情展台',
    category: 'product_showcase',
    tags: ['弹出', '详情', '卡片', '信息'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-product-popup',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ps04_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#ps04_clip)">
    <rect width="600" height="350" fill="#f0f0f0"/>
    <rect x="170" y="40" width="260" height="200" rx="10" fill="#8e44ad"/>
    <text x="300" y="140" text-anchor="middle" font-size="22" fill="white" font-weight="bold">NEW</text>
    <text x="300" y="170" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.7)">点击查看详情</text>
    <g id="ps04_popup" style="cursor:pointer;">
      <rect x="170" y="40" width="260" height="200" rx="10" fill="transparent"/>
      <g opacity="0" transform="translate(0,20)">
        <rect x="100" y="250" width="400" height="80" rx="8" fill="white" stroke="#8e44ad" stroke-width="2"/>
        <text x="130" y="280" font-size="14" fill="#8e44ad" font-weight="bold">产品详情</text>
        <text x="130" y="300" font-size="11" fill="#666">全新设计 | 高端材质 | 限量发售</text>
        <text x="130" y="318" font-size="11" fill="#999">价格: ¥1,299 起</text>
        <animate attributeName="opacity" from="0" to="1" begin="ps04_popup.click" dur="0.4s" fill="freeze"/>
        <animate attributeName="transform" type="translate" from="0 20" to="0 0" begin="ps04_popup.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </g>
    </g>
  </g>
</svg>`
  },
  {
    id: 'product_gallery_05',
    name: '产品画廊',
    category: 'product_showcase',
    tags: ['画廊', '展示', '多图', '浏览'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-product-gallery',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ps05_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ps05_clip)">
    <rect width="600" height="300" fill="#1a1a2e"/>
    <g id="ps05_gal" style="cursor:pointer;">
      <g>
        <rect x="20" y="30" width="130" height="130" rx="8" fill="#1abc9c" opacity="0.7"><animate attributeName="opacity" from="0.7" to="1" begin="ps05_gal.click" dur="0.3s" fill="freeze"/></rect>
        <text x="85" y="100" text-anchor="middle" font-size="30" fill="white">01</text>
      </g>
      <g>
        <rect x="170" y="30" width="130" height="130" rx="8" fill="#e74c3c" opacity="0.7"><animate attributeName="opacity" from="0.7" to="1" begin="ps05_gal.click+0.1s" dur="0.3s" fill="freeze"/></rect>
        <text x="235" y="100" text-anchor="middle" font-size="30" fill="white">02</text>
      </g>
      <g>
        <rect x="320" y="30" width="130" height="130" rx="8" fill="#f39c12" opacity="0.7"><animate attributeName="opacity" from="0.7" to="1" begin="ps05_gal.click+0.2s" dur="0.3s" fill="freeze"/></rect>
        <text x="385" y="100" text-anchor="middle" font-size="30" fill="white">03</text>
      </g>
      <g>
        <rect x="470" y="30" width="110" height="130" rx="8" fill="#3498db" opacity="0.7"><animate attributeName="opacity" from="0.7" to="1" begin="ps05_gal.click+0.3s" dur="0.3s" fill="freeze"/></rect>
        <text x="525" y="100" text-anchor="middle" font-size="30" fill="white">04</text>
      </g>
      <rect x="20" y="180" width="560" height="80" rx="8" fill="rgba(255,255,255,0.05)" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="ps05_gal.click+0.4s" dur="0.3s" fill="freeze"/></rect>
      <text x="300" y="225" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0)" font-weight="bold">COLLECTION 2025<animate attributeName="fill" from="rgba(255,255,255,0)" to="rgba(255,255,255,0.8)" begin="ps05_gal.click+0.4s" dur="0.3s" fill="freeze"/></text>
      <text x="300" y="285" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击展示画廊</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'product_spotlight_06',
    name: '聚光灯展台',
    category: 'product_showcase',
    tags: ['聚光灯', '焦点', '高亮', '展示'],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click-product-spotlight',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="ps06_clip"><rect width="600" height="350" rx="12"/></clipPath>
    <radialGradient id="ps06_spot" cx="50%" cy="40%" r="30%"><stop offset="0%" stop-color="rgba(241,196,15,0.3)"/><stop offset="100%" stop-color="rgba(241,196,15,0)"/></radialGradient>
  </defs>
  <g clip-path="url(#ps06_clip)">
    <rect width="600" height="350" fill="#0a0a0a"/>
    <g id="ps06_light" style="cursor:pointer;">
      <circle cx="300" cy="140" r="0" fill="url(#ps06_spot)"><animate attributeName="r" from="0" to="180" begin="ps06_light.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></circle>
      <rect x="230" y="100" width="140" height="180" rx="12" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
      <rect x="245" y="115" width="110" height="90" rx="6" fill="#2c3e50"/>
      <text x="300" y="170" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.3)" font-weight="bold">ITEM</text>
      <text x="300" y="230" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.5)">限定商品</text>
      <text x="300" y="255" text-anchor="middle" font-size="11" fill="#f1c40f" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="ps06_light.click+0.5s" dur="0.3s" fill="freeze"/>NEW ARRIVAL</text>
      <text x="300" y="330" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.25)">点击聚光灯</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 7. 地图热区 map_hotspot ====================
export const SVG_MAP_HOTSPOT = [
  {
    id: 'map_china_01',
    name: '中国地图热区',
    category: 'map_hotspot',
    tags: ['中国', '地图', '热区', '省份'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-map-china',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="mh01_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#mh01_clip)">
    <rect width="600" height="400" fill="#0d1b2a"/>
    <text x="300" y="30" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.4)" font-weight="bold">EXPLORE MAP</text>
    <g id="mh01_bj" style="cursor:pointer;">
      <circle cx="380" cy="140" r="12" fill="#e74c3c" opacity="0.7"><animate attributeName="r" values="12;15;12" dur="2s" repeatCount="indefinite"/></circle>
      <text x="380" y="125" text-anchor="middle" font-size="10" fill="white" opacity="0.5">北京</text>
      <g opacity="0"><rect x="310" y="155" width="140" height="50" rx="6" fill="rgba(231,76,60,0.9)"/><text x="380" y="177" text-anchor="middle" font-size="11" fill="white" font-weight="bold">北京 · 首都</text><text x="380" y="195" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.7)">人口: 2,189万</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh01_bj.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_sh.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_gz.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_cd.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh01_sh" style="cursor:pointer;">
      <circle cx="430" cy="220" r="12" fill="#3498db" opacity="0.7"><animate attributeName="r" values="12;15;12" dur="2s" repeatCount="indefinite"/></circle>
      <text x="430" y="205" text-anchor="middle" font-size="10" fill="white" opacity="0.5">上海</text>
      <g opacity="0"><rect x="360" y="235" width="140" height="50" rx="6" fill="rgba(52,152,219,0.9)"/><text x="430" y="257" text-anchor="middle" font-size="11" fill="white" font-weight="bold">上海 · 魔都</text><text x="430" y="275" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.7)">人口: 2,487万</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh01_sh.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_bj.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_gz.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_cd.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh01_gz" style="cursor:pointer;">
      <circle cx="370" cy="310" r="12" fill="#2ecc71" opacity="0.7"><animate attributeName="r" values="12;15;12" dur="2s" repeatCount="indefinite"/></circle>
      <text x="370" y="295" text-anchor="middle" font-size="10" fill="white" opacity="0.5">广州</text>
      <g opacity="0"><rect x="300" y="325" width="140" height="50" rx="6" fill="rgba(46,204,113,0.9)"/><text x="370" y="347" text-anchor="middle" font-size="11" fill="white" font-weight="bold">广州 · 花城</text><text x="370" y="365" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.7)">人口: 1,881万</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh01_gz.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_bj.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_sh.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_cd.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh01_cd" style="cursor:pointer;">
      <circle cx="260" cy="250" r="12" fill="#f39c12" opacity="0.7"><animate attributeName="r" values="12;15;12" dur="2s" repeatCount="indefinite"/></circle>
      <text x="260" y="235" text-anchor="middle" font-size="10" fill="white" opacity="0.5">成都</text>
      <g opacity="0"><rect x="190" y="265" width="140" height="50" rx="6" fill="rgba(243,156,18,0.9)"/><text x="260" y="287" text-anchor="middle" font-size="11" fill="white" font-weight="bold">成都 · 蓉城</text><text x="260" y="305" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.7)">人口: 2,119万</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh01_cd.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_bj.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_sh.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh01_gz.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <path d="M300,80 Q350,100 380,140 Q400,180 430,220 Q420,270 370,310 Q320,320 260,250 Q230,200 250,150 Q270,100 300,80Z" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 4"/>
  </g>
</svg>`
  },
  {
    id: 'map_building_02',
    name: '建筑平面热区',
    category: 'map_hotspot',
    tags: ['建筑', '平面图', '室内', '标注'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-map-building',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="mh02_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#mh02_clip)">
    <rect width="600" height="350" fill="#ecf0f1"/>
    <text x="300" y="25" text-anchor="middle" font-size="14" fill="#2c3e50" font-weight="bold">1F 平面导览图</text>
    <rect x="50" y="40" width="500" height="270" rx="4" fill="white" stroke="#bdc3c7" stroke-width="2"/>
    <line x1="250" y1="40" x2="250" y2="310" stroke="#bdc3c7" stroke-width="1"/>
    <line x1="50" y1="175" x2="550" y2="175" stroke="#bdc3c7" stroke-width="1"/>
    <g id="mh02_r1" style="cursor:pointer;">
      <rect x="55" y="45" width="190" height="125" fill="rgba(52,152,219,0.1)"/><text x="150" y="110" text-anchor="middle" font-size="13" fill="#3498db">会议室A</text>
      <rect x="55" y="45" width="190" height="125" fill="none" stroke="#3498db" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="mh02_r1.click" dur="0.3s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="mh02_r2.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="mh02_r3.click" dur="0.2s" fill="freeze"/></rect>
    </g>
    <g id="mh02_r2" style="cursor:pointer;">
      <rect x="255" y="45" width="290" height="125" fill="rgba(46,204,113,0.1)"/><text x="400" y="110" text-anchor="middle" font-size="13" fill="#27ae60">开放办公区</text>
      <rect x="255" y="45" width="290" height="125" fill="none" stroke="#27ae60" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="mh02_r2.click" dur="0.3s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="mh02_r1.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="mh02_r3.click" dur="0.2s" fill="freeze"/></rect>
    </g>
    <g id="mh02_r3" style="cursor:pointer;">
      <rect x="55" y="180" width="490" height="125" fill="rgba(231,76,60,0.1)"/><text x="300" y="245" text-anchor="middle" font-size="13" fill="#e74c3c">展厅大堂</text>
      <rect x="55" y="180" width="490" height="125" fill="none" stroke="#e74c3c" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="mh02_r3.click" dur="0.3s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="mh02_r1.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="mh02_r2.click" dur="0.2s" fill="freeze"/></rect>
    </g>
    <text x="300" y="340" text-anchor="middle" font-size="11" fill="#999">点击区域查看详情</text>
  </g>
</svg>`
  },
  {
    id: 'map_campus_03',
    name: '校园导览图',
    category: 'map_hotspot',
    tags: ['校园', '导览', '学校', '标记'],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'click-map-campus',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="mh03_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#mh03_clip)">
    <rect width="600" height="400" fill="#e8f5e9"/>
    <text x="300" y="25" text-anchor="middle" font-size="14" fill="#2c3e50" font-weight="bold">校园导览</text>
    <rect x="40" y="100" width="120" height="80" rx="4" fill="#fff" stroke="#27ae60" stroke-width="1.5"/>
    <text x="100" y="145" text-anchor="middle" font-size="11" fill="#27ae60">图书馆</text>
    <rect x="240" y="60" width="120" height="80" rx="4" fill="#fff" stroke="#3498db" stroke-width="1.5"/>
    <text x="300" y="105" text-anchor="middle" font-size="11" fill="#3498db">教学楼</text>
    <rect x="440" y="100" width="120" height="80" rx="4" fill="#fff" stroke="#e74c3c" stroke-width="1.5"/>
    <text x="500" y="145" text-anchor="middle" font-size="11" fill="#e74c3c">体育馆</text>
    <rect x="240" y="250" width="120" height="80" rx="4" fill="#fff" stroke="#f39c12" stroke-width="1.5"/>
    <text x="300" y="295" text-anchor="middle" font-size="11" fill="#f39c12">食堂</text>
    <line x1="160" y1="140" x2="240" y2="100" stroke="#ddd" stroke-width="1" stroke-dasharray="4 2"/>
    <line x1="360" y1="100" x2="440" y2="140" stroke="#ddd" stroke-width="1" stroke-dasharray="4 2"/>
    <line x1="300" y1="140" x2="300" y2="250" stroke="#ddd" stroke-width="1" stroke-dasharray="4 2"/>
    <g id="mh03_lib" style="cursor:pointer;">
      <circle cx="100" cy="140" r="8" fill="#27ae60" opacity="0.5"><animate attributeName="r" values="8;11;8" dur="2s" repeatCount="indefinite"/></circle>
      <g opacity="0"><rect x="20" y="190" width="160" height="40" rx="4" fill="rgba(39,174,96,0.9)"/><text x="100" y="215" text-anchor="middle" font-size="10" fill="white">藏书120万册 | 8:00-22:00</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh03_lib.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh03_teach.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh03_teach" style="cursor:pointer;">
      <circle cx="300" cy="100" r="8" fill="#3498db" opacity="0.5"><animate attributeName="r" values="8;11;8" dur="2s" repeatCount="indefinite"/></circle>
      <g opacity="0"><rect x="220" y="150" width="160" height="40" rx="4" fill="rgba(52,152,219,0.9)"/><text x="300" y="175" text-anchor="middle" font-size="10" fill="white">5栋教学楼 | 200+教室</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh03_teach.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh03_lib.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <text x="300" y="385" text-anchor="middle" font-size="11" fill="#999">点击标记查看信息</text>
  </g>
</svg>`
  },
  {
    id: 'map_transit_04',
    name: '交通路线图',
    category: 'map_hotspot',
    tags: ['交通', '路线', '地铁', '站点'],
    colorScheme: '#2980b9',
    interactive: true,
    interactionType: 'click-map-transit',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="mh04_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#mh04_clip)">
    <rect width="600" height="300" fill="#f5f5f5"/>
    <text x="300" y="25" text-anchor="middle" font-size="14" fill="#2c3e50" font-weight="bold">Metro Line 1</text>
    <line x1="80" y1="150" x2="520" y2="150" stroke="#2980b9" stroke-width="6" stroke-linecap="round"/>
    <g id="mh04_s1" style="cursor:pointer;">
      <circle cx="120" cy="150" r="10" fill="white" stroke="#2980b9" stroke-width="3"/><text x="120" y="180" text-anchor="middle" font-size="10" fill="#333">起点站</text>
      <g opacity="0"><rect x="60" y="85" width="120" height="40" rx="6" fill="#2980b9"/><text x="120" y="110" text-anchor="middle" font-size="10" fill="white">始发 6:00 | 末班 23:00</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh04_s1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s3.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s4.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh04_s2" style="cursor:pointer;">
      <circle cx="250" cy="150" r="10" fill="white" stroke="#e74c3c" stroke-width="3"/><text x="250" y="180" text-anchor="middle" font-size="10" fill="#333">中心站</text>
      <g opacity="0"><rect x="190" y="85" width="120" height="40" rx="6" fill="#e74c3c"/><text x="250" y="110" text-anchor="middle" font-size="10" fill="white">换乘站 | Line 1 ↔ Line 3</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh04_s2.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s3.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s4.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh04_s3" style="cursor:pointer;">
      <circle cx="380" cy="150" r="10" fill="white" stroke="#2980b9" stroke-width="3"/><text x="380" y="180" text-anchor="middle" font-size="10" fill="#333">商业区</text>
      <g opacity="0"><rect x="320" y="85" width="120" height="40" rx="6" fill="#2980b9"/><text x="380" y="110" text-anchor="middle" font-size="10" fill="white">日均客流量 12万+</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh04_s3.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s4.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh04_s4" style="cursor:pointer;">
      <circle cx="480" cy="150" r="10" fill="white" stroke="#27ae60" stroke-width="3"/><text x="480" y="180" text-anchor="middle" font-size="10" fill="#333">终点站</text>
      <g opacity="0"><rect x="420" y="85" width="120" height="40" rx="6" fill="#27ae60"/><text x="480" y="110" text-anchor="middle" font-size="10" fill="white">末班 22:30 | P+R停车场</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh04_s4.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh04_s3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <text x="300" y="230" text-anchor="middle" font-size="11" fill="#bbb">点击站点查看信息</text>
  </g>
</svg>`
  },
  {
    id: 'map_treasure_05',
    name: '寻宝地图',
    category: 'map_hotspot',
    tags: ['寻宝', '游戏', '地图', '冒险'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-map-treasure',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="mh05_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#mh05_clip)">
    <rect width="600" height="400" fill="#f5e6c8"/>
    <rect x="20" y="20" width="560" height="360" rx="8" fill="#ede0c8" stroke="#c4a882" stroke-width="2"/>
    <text x="300" y="55" text-anchor="middle" font-size="18" fill="#8b6914" font-weight="bold" font-family="serif">TREASURE MAP</text>
    <path d="M100,200 Q200,150 250,250 Q300,180 400,220 Q450,280 500,200" fill="none" stroke="#c4a882" stroke-width="2" stroke-dasharray="8 4"/>
    <g id="mh05_x1" style="cursor:pointer;">
      <text x="100" y="210" text-anchor="middle" font-size="24" fill="#e74c3c" opacity="0.6">X<animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/></text>
      <g opacity="0"><rect x="40" y="220" width="120" height="35" rx="4" fill="rgba(231,76,60,0.85)"/><text x="100" y="243" text-anchor="middle" font-size="10" fill="white">线索1: 向东走100步</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh05_x1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh05_x2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh05_x3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh05_x2" style="cursor:pointer;">
      <text x="300" y="190" text-anchor="middle" font-size="24" fill="#e74c3c" opacity="0.6">X<animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/></text>
      <g opacity="0"><rect x="240" y="200" width="120" height="35" rx="4" fill="rgba(231,76,60,0.85)"/><text x="300" y="223" text-anchor="middle" font-size="10" fill="white">线索2: 古树下转南</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh05_x2.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh05_x1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh05_x3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh05_x3" style="cursor:pointer;">
      <text x="500" y="210" text-anchor="middle" font-size="30" fill="#f39c12" opacity="0.7"><animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>★</text>
      <g opacity="0"><rect x="430" y="220" width="130" height="35" rx="4" fill="rgba(243,156,18,0.9)"/><text x="495" y="243" text-anchor="middle" font-size="10" fill="white">宝藏! 恭喜你找到了!</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh05_x3.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh05_x1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh05_x2.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <text x="300" y="375" text-anchor="middle" font-size="11" fill="#c4a882">点击标记探索线索</text>
  </g>
</svg>`
  },
  {
    id: 'map_floorplan_06',
    name: '楼层导航图',
    category: 'map_hotspot',
    tags: ['楼层', '导航', '商场', '多层'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-map-floor',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="mh06_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#mh06_clip)">
    <rect width="600" height="350" fill="#2c3e50"/>
    <text x="300" y="30" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.5)" font-weight="bold">SHOPPING MALL</text>
    <g id="mh06_f3" style="cursor:pointer;">
      <rect x="150" y="50" width="300" height="60" rx="4" fill="#8e44ad" opacity="0.6"/>
      <text x="300" y="85" text-anchor="middle" font-size="14" fill="white">3F 餐饮美食</text>
      <g opacity="0"><rect x="460" y="50" width="120" height="60" rx="4" fill="rgba(142,68,173,0.9)"/><text x="520" y="77" text-anchor="middle" font-size="10" fill="white" font-weight="bold">3F</text><text x="520" y="97" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.7)">火锅/西餐/甜品</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh06_f3.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_f2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_f1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_b1.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh06_f2" style="cursor:pointer;">
      <rect x="150" y="120" width="300" height="60" rx="4" fill="#2980b9" opacity="0.6"/>
      <text x="300" y="155" text-anchor="middle" font-size="14" fill="white">2F 时尚服饰</text>
      <g opacity="0"><rect x="460" y="120" width="120" height="60" rx="4" fill="rgba(41,128,185,0.9)"/><text x="520" y="147" text-anchor="middle" font-size="10" fill="white" font-weight="bold">2F</text><text x="520" y="167" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.7)">潮牌/运动/饰品</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh06_f2.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_f3.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_f1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_b1.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh06_f1" style="cursor:pointer;">
      <rect x="150" y="190" width="300" height="60" rx="4" fill="#27ae60" opacity="0.6"/>
      <text x="300" y="225" text-anchor="middle" font-size="14" fill="white">1F 精品零售</text>
      <g opacity="0"><rect x="460" y="190" width="120" height="60" rx="4" fill="rgba(39,174,96,0.9)"/><text x="520" y="217" text-anchor="middle" font-size="10" fill="white" font-weight="bold">1F</text><text x="520" y="237" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.7)">化妆品/数码/书店</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh06_f1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_f3.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_f2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_b1.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="mh06_b1" style="cursor:pointer;">
      <rect x="150" y="260" width="300" height="60" rx="4" fill="#e67e22" opacity="0.6"/>
      <text x="300" y="295" text-anchor="middle" font-size="14" fill="white">B1 超市/停车场</text>
      <g opacity="0"><rect x="460" y="260" width="120" height="60" rx="4" fill="rgba(230,126,34,0.9)"/><text x="520" y="287" text-anchor="middle" font-size="10" fill="white" font-weight="bold">B1</text><text x="520" y="307" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.7)">生鲜超市/1200车位</text>
        <animate attributeName="opacity" from="0" to="1" begin="mh06_b1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_f3.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_f2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="mh06_f1.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
  </g>
</svg>`
  }
]

// ==================== 8. 解锁揭秘 unlock_reveal ====================
export const SVG_UNLOCK_REVEAL = [
  {
    id: 'unlock_password_01',
    name: '密码解锁',
    category: 'unlock_reveal',
    tags: ['密码', '解锁', '安全', '输入'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-unlock-password',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ul01_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#ul01_clip)">
    <rect width="600" height="350" fill="#1a1a2e"/>
    <g id="ul01_lock" style="cursor:pointer;">
      <rect x="200" y="80" width="200" height="160" rx="10" fill="#2c3e50" stroke="#34495e" stroke-width="2"/>
      <path d="M250,80 L250,50 Q250,20 300,20 Q350,20 350,50 L350,80" fill="none" stroke="#5d6d7e" stroke-width="8" stroke-linecap="round">
        <animate attributeName="d" to="M250,80 L250,50 Q250,20 300,20 Q350,20 350,50 L350,40" begin="ul01_lock.click" dur="0.5s" fill="freeze"/>
      </path>
      <circle cx="300" cy="150" r="15" fill="#e74c3c"><animate attributeName="fill" from="#e74c3c" to="#2ecc71" begin="ul01_lock.click" dur="0.3s" fill="freeze"/></circle>
      <rect x="296" y="160" width="8" height="20" rx="2" fill="#c0392b"><animate attributeName="fill" from="#c0392b" to="#27ae60" begin="ul01_lock.click" dur="0.3s" fill="freeze"/></rect>
      <g><rect x="220" y="260" width="40" height="40" rx="6" fill="rgba(255,255,255,0.1)"/><text x="240" y="286" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.5)">*</text></g>
      <g><rect x="270" y="260" width="40" height="40" rx="6" fill="rgba(255,255,255,0.1)"/><text x="290" y="286" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.5)">*</text></g>
      <g><rect x="320" y="260" width="40" height="40" rx="6" fill="rgba(255,255,255,0.1)"/><text x="340" y="286" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.5)">*</text></g>
      <g opacity="0"><text x="300" y="40" text-anchor="middle" font-size="16" fill="#2ecc71" font-weight="bold">UNLOCKED!</text>
        <animate attributeName="opacity" from="0" to="1" begin="ul01_lock.click+0.3s" dur="0.3s" fill="freeze"/>
      </g>
      <text x="300" y="330" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击解锁</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'unlock_slider_02',
    name: '滑动解锁',
    category: 'unlock_reveal',
    tags: ['滑动', '解锁', '手机', '经典'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-unlock-slider',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ul02_clip"><rect width="600" height="250" rx="12"/></clipPath></defs>
  <g clip-path="url(#ul02_clip)">
    <rect width="600" height="250" fill="#0d1b2a"/>
    <g id="ul02_slider" style="cursor:pointer;">
      <rect x="100" y="90" width="400" height="50" rx="25" fill="rgba(52,152,219,0.2)"/>
      <text x="300" y="120" text-anchor="middle" font-size="14" fill="rgba(52,152,219,0.5)">滑动解锁<animate attributeName="opacity" from="0.5" to="0" begin="ul02_slider.click" dur="0.3s" fill="freeze"/></text>
      <circle cx="130" cy="115" r="20" fill="#3498db">
        <animate attributeName="cx" from="130" to="470" begin="ul02_slider.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </circle>
      <text x="130" y="121" text-anchor="middle" font-size="16" fill="white" font-weight="bold">→
        <animate attributeName="x" from="130" to="470" begin="ul02_slider.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </text>
      <rect x="100" y="90" width="0" height="50" rx="25" fill="rgba(52,152,219,0.3)"><animate attributeName="width" from="0" to="400" begin="ul02_slider.click" dur="0.8s" fill="freeze"/></rect>
      <g opacity="0"><text x="300" y="180" text-anchor="middle" font-size="20" fill="#2ecc71" font-weight="bold">WELCOME BACK</text>
        <animate attributeName="opacity" from="0" to="1" begin="ul02_slider.click+0.5s" dur="0.3s" fill="freeze"/>
      </g>
      <text x="300" y="220" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击模拟滑动</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'unlock_sequence_03',
    name: '序列解锁',
    category: 'unlock_reveal',
    tags: ['序列', '步骤', '解谜', '顺序'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-unlock-sequence',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ul03_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ul03_clip)">
    <rect width="600" height="300" fill="#2c3e50"/>
    <text x="300" y="40" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.4)">按顺序点击解锁</text>
    <g id="ul03_s1" style="cursor:pointer;">
      <circle cx="150" cy="130" r="35" fill="rgba(243,156,18,0.3)" stroke="#f39c12" stroke-width="2"/>
      <text x="150" y="137" text-anchor="middle" font-size="20" fill="#f39c12" font-weight="bold">1</text>
      <circle cx="150" cy="130" r="35" fill="none" stroke="#2ecc71" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="ul03_s1.click" dur="0.3s" fill="freeze"/></circle>
    </g>
    <g id="ul03_s2" style="cursor:pointer;">
      <circle cx="300" cy="130" r="35" fill="rgba(243,156,18,0.3)" stroke="#f39c12" stroke-width="2"/>
      <text x="300" y="137" text-anchor="middle" font-size="20" fill="#f39c12" font-weight="bold">2</text>
      <circle cx="300" cy="130" r="35" fill="none" stroke="#2ecc71" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="ul03_s2.click" dur="0.3s" fill="freeze"/></circle>
    </g>
    <g id="ul03_s3" style="cursor:pointer;">
      <circle cx="450" cy="130" r="35" fill="rgba(243,156,18,0.3)" stroke="#f39c12" stroke-width="2"/>
      <text x="450" y="137" text-anchor="middle" font-size="20" fill="#f39c12" font-weight="bold">3</text>
      <circle cx="450" cy="130" r="35" fill="none" stroke="#2ecc71" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="ul03_s3.click" dur="0.3s" fill="freeze"/></circle>
    </g>
    <g opacity="0"><rect x="150" y="200" width="300" height="60" rx="10" fill="#2ecc71"/><text x="300" y="237" text-anchor="middle" font-size="18" fill="white" font-weight="bold">ALL UNLOCKED!</text>
      <animate attributeName="opacity" from="0" to="1" begin="ul03_s3.click+0.3s" dur="0.4s" fill="freeze"/>
    </g>
    <text x="300" y="285" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">依次点击 1→2→3</text>
  </g>
</svg>`
  },
  {
    id: 'unlock_puzzle_04',
    name: '拼图解锁',
    category: 'unlock_reveal',
    tags: ['拼图', '解锁', '游戏', '组合'],
    colorScheme: '#2ecc71',
    interactive: true,
    interactionType: 'click-unlock-puzzle',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ul04_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#ul04_clip)">
    <rect width="600" height="350" fill="#1a1a2e"/>
    <rect x="200" y="75" width="200" height="200" rx="4" fill="rgba(46,204,113,0.1)" stroke="rgba(46,204,113,0.3)" stroke-width="1" stroke-dasharray="4 2"/>
    <g id="ul04_puzzle" style="cursor:pointer;">
      <g>
        <rect x="100" y="30" width="95" height="95" rx="4" fill="#2ecc71" opacity="0.8">
          <animate attributeName="x" from="100" to="200" begin="ul04_puzzle.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
          <animate attributeName="y" from="30" to="75" begin="ul04_puzzle.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        </rect>
        <text x="147" y="85" text-anchor="middle" font-size="12" fill="white">A
          <animate attributeName="x" from="147" to="247" begin="ul04_puzzle.click" dur="0.5s" fill="freeze"/>
          <animate attributeName="y" from="85" to="130" begin="ul04_puzzle.click" dur="0.5s" fill="freeze"/>
        </text>
      </g>
      <g>
        <rect x="420" y="30" width="95" height="95" rx="4" fill="#27ae60" opacity="0.8">
          <animate attributeName="x" from="420" to="305" begin="ul04_puzzle.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
          <animate attributeName="y" from="30" to="75" begin="ul04_puzzle.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        </rect>
        <text x="467" y="85" text-anchor="middle" font-size="12" fill="white">B
          <animate attributeName="x" from="467" to="352" begin="ul04_puzzle.click" dur="0.6s" fill="freeze"/>
          <animate attributeName="y" from="85" to="130" begin="ul04_puzzle.click" dur="0.6s" fill="freeze"/>
        </text>
      </g>
      <g>
        <rect x="100" y="240" width="95" height="95" rx="4" fill="#1abc9c" opacity="0.8">
          <animate attributeName="x" from="100" to="200" begin="ul04_puzzle.click" dur="0.55s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
          <animate attributeName="y" from="240" to="180" begin="ul04_puzzle.click" dur="0.55s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        </rect>
        <text x="147" y="295" text-anchor="middle" font-size="12" fill="white">C
          <animate attributeName="x" from="147" to="247" begin="ul04_puzzle.click" dur="0.55s" fill="freeze"/>
          <animate attributeName="y" from="295" to="235" begin="ul04_puzzle.click" dur="0.55s" fill="freeze"/>
        </text>
      </g>
      <g>
        <rect x="420" y="240" width="95" height="95" rx="4" fill="#16a085" opacity="0.8">
          <animate attributeName="x" from="420" to="305" begin="ul04_puzzle.click" dur="0.65s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
          <animate attributeName="y" from="240" to="180" begin="ul04_puzzle.click" dur="0.65s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        </rect>
        <text x="467" y="295" text-anchor="middle" font-size="12" fill="white">D
          <animate attributeName="x" from="467" to="352" begin="ul04_puzzle.click" dur="0.65s" fill="freeze"/>
          <animate attributeName="y" from="295" to="235" begin="ul04_puzzle.click" dur="0.65s" fill="freeze"/>
        </text>
      </g>
      <text x="300" y="335" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击拼合碎片</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'unlock_scratch_05',
    name: '刮刮卡',
    category: 'unlock_reveal',
    tags: ['刮刮卡', '抽奖', '揭示', '惊喜'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-scratch-card',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ul05_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ul05_clip)">
    <rect width="600" height="300" fill="#f5f5f5"/>
    <rect x="100" y="40" width="400" height="200" rx="10" fill="white" stroke="#eee" stroke-width="1"/>
    <text x="300" y="120" text-anchor="middle" font-size="48" fill="#f39c12" font-weight="bold">$100</text>
    <text x="300" y="155" text-anchor="middle" font-size="14" fill="#999">恭喜中奖!</text>
    <text x="300" y="190" text-anchor="middle" font-size="11" fill="#ccc">奖品编号: 2025-LUCKY-888</text>
    <g id="ul05_cover" style="cursor:pointer;">
      <rect x="100" y="40" width="400" height="200" rx="10" fill="#9b59b6"/>
      <rect x="120" y="60" width="360" height="160" rx="6" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="4 2"/>
      <text x="300" y="125" text-anchor="middle" font-size="22" fill="white" font-weight="bold">SCRATCH HERE</text>
      <text x="300" y="155" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0.6)">点击刮开涂层</text>
      <animate attributeName="opacity" from="1" to="0" begin="click" dur="0.6s" fill="freeze"/>
    </g>
    <text x="300" y="275" text-anchor="middle" font-size="11" fill="#bbb">点击刮开</text>
  </g>
</svg>`
  },
  {
    id: 'unlock_combination_06',
    name: '转盘密码锁',
    category: 'unlock_reveal',
    tags: ['转盘', '密码锁', '机械', '解谜'],
    colorScheme: '#34495e',
    interactive: true,
    interactionType: 'click-combination-lock',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ul06_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#ul06_clip)">
    <rect width="600" height="350" fill="#1a1a1a"/>
    <g id="ul06_dial" style="cursor:pointer;">
      <circle cx="300" cy="170" r="100" fill="#2c3e50" stroke="#5d6d7e" stroke-width="4"/>
      <circle cx="300" cy="170" r="80" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <g>
        <text x="300" y="110" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.6)">0</text>
        <text x="370" y="175" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.6)">25</text>
        <text x="300" y="240" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.6)">50</text>
        <text x="230" y="175" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.6)">75</text>
      </g>
      <line x1="300" y1="170" x2="300" y2="100" stroke="#e74c3c" stroke-width="3" stroke-linecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 300 170" to="360 300 170" begin="ul06_dial.click" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </line>
      <circle cx="300" cy="170" r="8" fill="#34495e" stroke="#5d6d7e" stroke-width="2"/>
      <polygon points="300,65 295,55 305,55" fill="#e74c3c"/>
      <g opacity="0"><rect x="180" y="290" width="240" height="40" rx="8" fill="#2ecc71"/><text x="300" y="316" text-anchor="middle" font-size="14" fill="white" font-weight="bold">SAFE OPENED!</text>
        <animate attributeName="opacity" from="0" to="1" begin="ul06_dial.click+1s" dur="0.3s" fill="freeze"/>
      </g>
      <text x="300" y="340" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击旋转密码盘</text>
    </g>
  </g>
</svg>`
  }
]
