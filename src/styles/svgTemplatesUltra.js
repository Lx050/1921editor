/**
 * SVG Ultra 模板库 — 2025 SOTA 交互技术
 * 基于 E2.COOL / GQ Lab / 品牌案例最新研究
 *
 * 10 categories × 6 templates = 60 templates
 *
 * 1. scroll_unfurl    - 画卷展开 (古卷轴渐进揭示)
 * 2. poker_deal       - 扑克出牌 (卡牌飞出序列)
 * 3. infinite_selector - 无限选择器 (吸附滚动选择)
 * 4. stagger_entrance - 排队入场 (错时入场动画)
 * 5. layer_adhesion   - 错层吸附 (多层错速吸附)
 * 6. card_flip        - 卡牌翻转 (3D翻转揭秘)
 * 7. scroll_dismiss   - 滑动撤场 (滑动消散伸长)
 * 8. dark_light       - 明暗切换 (日夜模式切换)
 * 9. auto_cinema      - 自动影院 (连续播放序列)
 * 10. float_hotzone   - 浮层热区 (浮动气泡扩展)
 */

// ==================== 1. 画卷展开 scroll_unfurl ====================
export const SVG_SCROLL_UNFURL = [
  {
    id: 'scroll_ancient_01',
    name: '古卷轴展开',
    category: 'scroll_unfurl',
    tags: ['画卷', '卷轴', '展开', '古风'],
    colorScheme: '#8b6914',
    interactive: true,
    interactionType: 'click-scroll-unfurl',
    svg: `<svg viewBox="0 0 600 380" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="su01_clip"><rect width="600" height="380" rx="12"/></clipPath></defs>
  <g clip-path="url(#su01_clip)">
    <rect width="600" height="380" fill="#1a1a1a"/>
    <g id="su01_scroll" style="cursor:pointer;">
      <rect x="100" y="50" width="0" height="250" fill="#f4ecd8" rx="2"><animate attributeName="width" from="0" to="400" begin="su01_scroll.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="x" from="300" to="100" begin="su01_scroll.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <g opacity="0">
        <text x="300" y="130" text-anchor="middle" font-size="24" fill="#8b6914" font-weight="bold" font-family="serif">山水长卷</text>
        <line x1="150" y1="150" x2="450" y2="150" stroke="#c4a882" stroke-width="1"/>
        <text x="300" y="185" text-anchor="middle" font-size="13" fill="#666" font-family="serif">千里江山图 · 绢本设色</text>
        <text x="300" y="215" text-anchor="middle" font-size="12" fill="#888" font-family="serif">王希孟 · 北宋 · 宣和三年</text>
        <rect x="200" y="235" width="200" height="40" rx="4" fill="rgba(139,105,20,0.1)" stroke="#c4a882" stroke-width="0.5"/>
        <text x="300" y="260" text-anchor="middle" font-size="11" fill="#8b6914">故宫博物院藏</text>
        <animate attributeName="opacity" from="0" to="1" begin="su01_scroll.click+0.5s" dur="0.5s" fill="freeze"/>
      </g>
      <g id="su01_left">
        <rect x="290" y="40" width="20" height="270" rx="10" fill="#8b4513"/>
        <rect x="295" y="50" width="10" height="250" fill="#cd853f"/>
        <animate attributeName="transform" type="translate" from="0 0" to="-200 0" begin="su01_scroll.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </g>
      <g id="su01_right">
        <rect x="290" y="40" width="20" height="270" rx="10" fill="#8b4513"/>
        <rect x="295" y="50" width="10" height="250" fill="#cd853f"/>
        <animate attributeName="transform" type="translate" from="0 0" to="200 0" begin="su01_scroll.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </g>
      <text x="300" y="360" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击展开画卷</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'scroll_vertical_02',
    name: '竖轴卷展',
    category: 'scroll_unfurl',
    tags: ['竖轴', '纵向', '展开', '书法'],
    colorScheme: '#c0392b',
    interactive: true,
    interactionType: 'click-scroll-vertical',
    svg: `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="su02_clip"><rect width="600" height="400" rx="12"/></clipPath></defs>
  <g clip-path="url(#su02_clip)">
    <rect width="600" height="400" fill="#0d0d0d"/>
    <g id="su02_vscroll" style="cursor:pointer;">
      <rect x="200" y="200" width="200" height="0" fill="#f5e6c8" rx="2"><animate attributeName="height" from="0" to="280" begin="su02_vscroll.click" dur="0.8s" fill="freeze"/><animate attributeName="y" from="200" to="60" begin="su02_vscroll.click" dur="0.8s" fill="freeze"/></rect>
      <g opacity="0">
        <text x="300" y="130" text-anchor="middle" font-size="28" fill="#c0392b" font-family="serif" font-weight="bold">福</text>
        <text x="300" y="170" text-anchor="middle" font-size="14" fill="#8b6914" font-family="serif">春风送暖入屠苏</text>
        <text x="300" y="200" text-anchor="middle" font-size="14" fill="#8b6914" font-family="serif">千门万户曈曈日</text>
        <text x="300" y="230" text-anchor="middle" font-size="14" fill="#8b6914" font-family="serif">总把新桃换旧符</text>
        <circle cx="300" cy="280" r="20" fill="none" stroke="#c0392b" stroke-width="1.5"/>
        <text x="300" y="286" text-anchor="middle" font-size="10" fill="#c0392b">印</text>
        <animate attributeName="opacity" from="0" to="1" begin="su02_vscroll.click+0.4s" dur="0.4s" fill="freeze"/>
      </g>
      <rect x="200" y="195" width="200" height="10" rx="5" fill="#8b4513"><animate attributeName="y" from="195" to="55" begin="su02_vscroll.click" dur="0.8s" fill="freeze"/></rect>
      <rect x="200" y="195" width="200" height="10" rx="5" fill="#8b4513"><animate attributeName="y" from="195" to="335" begin="su02_vscroll.click" dur="0.8s" fill="freeze"/></rect>
      <text x="300" y="380" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击展开竖轴</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'scroll_modern_03',
    name: '现代卷展',
    category: 'scroll_unfurl',
    tags: ['现代', '展开', '简约', '品牌'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-scroll-modern',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="su03_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#su03_clip)">
    <rect width="600" height="300" fill="#f8f9fa"/>
    <g id="su03_mod" style="cursor:pointer;">
      <rect x="300" y="40" width="0" height="200" fill="white" stroke="#eee" stroke-width="1" rx="8"><animate attributeName="width" from="0" to="480" begin="su03_mod.click" dur="0.6s" fill="freeze"/><animate attributeName="x" from="300" to="60" begin="su03_mod.click" dur="0.6s" fill="freeze"/></rect>
      <g opacity="0">
        <text x="300" y="110" text-anchor="middle" font-size="22" fill="#2c3e50" font-weight="bold">BRAND STORY</text>
        <line x1="200" y1="125" x2="400" y2="125" stroke="#3498db" stroke-width="2"/>
        <text x="300" y="155" text-anchor="middle" font-size="12" fill="#666">Founded in 2020 | Reimagined in 2025</text>
        <text x="300" y="180" text-anchor="middle" font-size="11" fill="#999">Crafting experiences that inspire and delight</text>
        <rect x="230" y="195" width="140" height="30" rx="15" fill="#3498db"/><text x="300" y="215" text-anchor="middle" font-size="11" fill="white">Explore More</text>
        <animate attributeName="opacity" from="0" to="1" begin="su03_mod.click+0.3s" dur="0.3s" fill="freeze"/>
      </g>
      <rect x="295" y="35" width="10" height="210" rx="5" fill="#3498db"><animate attributeName="x" from="295" to="55" begin="su03_mod.click" dur="0.6s" fill="freeze"/></rect>
      <rect x="295" y="35" width="10" height="210" rx="5" fill="#2c3e50"><animate attributeName="x" from="295" to="535" begin="su03_mod.click" dur="0.6s" fill="freeze"/></rect>
      <text x="300" y="280" text-anchor="middle" font-size="11" fill="#bbb">点击展开</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'scroll_watercolor_04',
    name: '水墨画卷',
    category: 'scroll_unfurl',
    tags: ['水墨', '画卷', '中国风', '意境'],
    colorScheme: '#34495e',
    interactive: true,
    interactionType: 'click-scroll-ink',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="su04_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#su04_clip)">
    <rect width="600" height="350" fill="#f5f0e8"/>
    <g id="su04_ink" style="cursor:pointer;">
      <rect x="300" y="50" width="0" height="220" fill="#faf8f0" rx="4"><animate attributeName="width" from="0" to="440" begin="su04_ink.click" dur="0.8s" fill="freeze"/><animate attributeName="x" from="300" to="80" begin="su04_ink.click" dur="0.8s" fill="freeze"/></rect>
      <g opacity="0">
        <ellipse cx="200" cy="160" rx="60" ry="40" fill="#34495e" opacity="0.15"/><ellipse cx="250" cy="180" rx="40" ry="25" fill="#34495e" opacity="0.1"/><ellipse cx="350" cy="150" rx="70" ry="45" fill="#34495e" opacity="0.12"/>
        <polygon points="180,200 200,120 220,200" fill="#34495e" opacity="0.2"/><polygon points="330,200 360,100 390,200" fill="#34495e" opacity="0.18"/><polygon points="400,200 420,140 440,200" fill="#34495e" opacity="0.15"/>
        <path d="M100,210 Q200,190 300,210 Q400,230 500,200" fill="none" stroke="#34495e" stroke-width="1" opacity="0.2"/>
        <text x="300" y="260" text-anchor="middle" font-size="16" fill="#34495e" font-family="serif" opacity="0.6">远山如黛 · 近水含烟</text>
        <animate attributeName="opacity" from="0" to="1" begin="su04_ink.click+0.4s" dur="0.5s" fill="freeze"/>
      </g>
      <text x="300" y="330" text-anchor="middle" font-size="11" fill="#999">点击展卷</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'scroll_photo_05',
    name: '照片长卷',
    category: 'scroll_unfurl',
    tags: ['照片', '长卷', '展开', '相册'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-scroll-photo',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="su05_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#su05_clip)">
    <rect width="600" height="300" fill="#1a1a2e"/>
    <g id="su05_photo" style="cursor:pointer;">
      <rect x="300" y="50" width="0" height="180" fill="#2c2c4e" rx="6"><animate attributeName="width" from="0" to="500" begin="su05_photo.click" dur="0.7s" fill="freeze"/><animate attributeName="x" from="300" to="50" begin="su05_photo.click" dur="0.7s" fill="freeze"/></rect>
      <g opacity="0">
        <rect x="70" y="70" width="100" height="80" rx="4" fill="#e74c3c" opacity="0.8"/><text x="120" y="115" text-anchor="middle" font-size="10" fill="white">JAN</text>
        <rect x="185" y="70" width="100" height="80" rx="4" fill="#3498db" opacity="0.8"/><text x="235" y="115" text-anchor="middle" font-size="10" fill="white">MAR</text>
        <rect x="300" y="70" width="100" height="80" rx="4" fill="#2ecc71" opacity="0.8"/><text x="350" y="115" text-anchor="middle" font-size="10" fill="white">JUN</text>
        <rect x="415" y="70" width="100" height="80" rx="4" fill="#f39c12" opacity="0.8"/><text x="465" y="115" text-anchor="middle" font-size="10" fill="white">DEC</text>
        <text x="300" y="195" text-anchor="middle" font-size="14" fill="white" font-weight="bold">2025 MEMORIES</text>
        <text x="300" y="215" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.5)">A Year in Review</text>
        <animate attributeName="opacity" from="0" to="1" begin="su05_photo.click+0.3s" dur="0.4s" fill="freeze"/>
      </g>
      <text x="300" y="275" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击展开年度回顾</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'scroll_golden_06',
    name: '金色长轴',
    category: 'scroll_unfurl',
    tags: ['金色', '奢华', '长轴', '典雅'],
    colorScheme: '#d4af37',
    interactive: true,
    interactionType: 'click-scroll-golden',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="su06_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#su06_clip)">
    <rect width="600" height="350" fill="#0a0a0a"/>
    <g id="su06_gold" style="cursor:pointer;">
      <rect x="300" y="60" width="0" height="200" fill="#1a1510" rx="4"><animate attributeName="width" from="0" to="420" begin="su06_gold.click" dur="0.8s" fill="freeze"/><animate attributeName="x" from="300" to="90" begin="su06_gold.click" dur="0.8s" fill="freeze"/></rect>
      <g opacity="0">
        <text x="300" y="130" text-anchor="middle" font-size="28" fill="#d4af37" font-weight="bold" font-family="serif">INVITATION</text>
        <line x1="160" y1="145" x2="440" y2="145" stroke="#d4af37" stroke-width="0.5" opacity="0.5"/>
        <text x="300" y="175" text-anchor="middle" font-size="12" fill="#b8941e" font-family="serif">You are cordially invited</text>
        <text x="300" y="200" text-anchor="middle" font-size="12" fill="#b8941e" font-family="serif">to the Grand Opening Ceremony</text>
        <text x="300" y="235" text-anchor="middle" font-size="10" fill="rgba(212,175,55,0.5)">2025.12.31 · Shanghai</text>
        <animate attributeName="opacity" from="0" to="1" begin="su06_gold.click+0.4s" dur="0.4s" fill="freeze"/>
      </g>
      <rect x="295" y="55" width="10" height="210" rx="5" fill="#d4af37"><animate attributeName="x" from="295" to="85" begin="su06_gold.click" dur="0.8s" fill="freeze"/></rect>
      <rect x="295" y="55" width="10" height="210" rx="5" fill="#b8941e"><animate attributeName="x" from="295" to="505" begin="su06_gold.click" dur="0.8s" fill="freeze"/></rect>
      <text x="300" y="330" text-anchor="middle" font-size="11" fill="rgba(212,175,55,0.4)">点击启封</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 2. 扑克出牌 poker_deal ====================
export const SVG_POKER_DEAL = [
  {
    id: 'poker_classic_01',
    name: '经典发牌',
    category: 'poker_deal',
    tags: ['扑克', '发牌', '卡片', '飞出'],
    colorScheme: '#0e3020',
    interactive: true,
    interactionType: 'click-poker-deal',
    svg: `<svg viewBox="0 0 600 380" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="pk01_clip"><rect width="600" height="380" rx="12"/></clipPath></defs>
  <g clip-path="url(#pk01_clip)">
    <rect width="600" height="380" fill="#0e3020"/>
    <g id="pk01_deck" style="cursor:pointer;">
      <g><rect x="250" y="200" width="100" height="140" rx="8" fill="white"/><text x="300" y="280" text-anchor="middle" font-size="36" fill="#e74c3c">♦</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-200 -120" begin="pk01_deck.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="opacity" from="1" to="1" begin="pk01_deck.click" dur="0.1s" fill="freeze"/></g>
      <g><rect x="250" y="200" width="100" height="140" rx="8" fill="white"/><text x="300" y="280" text-anchor="middle" font-size="36" fill="#2c3e50">♣</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-70 -140" begin="pk01_deck.click+0.15s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="250" y="200" width="100" height="140" rx="8" fill="white"/><text x="300" y="280" text-anchor="middle" font-size="36" fill="#e74c3c">♥</text><animateTransform attributeName="transform" type="translate" from="0 0" to="70 -140" begin="pk01_deck.click+0.3s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="250" y="200" width="100" height="140" rx="8" fill="white"/><text x="300" y="280" text-anchor="middle" font-size="36" fill="#2c3e50">♠</text><animateTransform attributeName="transform" type="translate" from="0 0" to="200 -120" begin="pk01_deck.click+0.45s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <rect x="250" y="200" width="100" height="140" rx="8" fill="#1a4d35" stroke="rgba(255,255,255,0.3)" stroke-width="1"/><text x="300" y="275" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.6)">DEAL</text>
      <text x="300" y="365" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击发牌</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'poker_fan_02',
    name: '扇形展开',
    category: 'poker_deal',
    tags: ['扇形', '展开', '手牌', '扑克'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-poker-fan',
    svg: `<svg viewBox="0 0 600 380" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="pk02_clip"><rect width="600" height="380" rx="12"/></clipPath></defs>
  <g clip-path="url(#pk02_clip)">
    <rect width="600" height="380" fill="#1a1a2e"/>
    <g id="pk02_fan" style="cursor:pointer;">
      <g transform="translate(300,340)">
        <g><rect x="-40" y="-130" width="80" height="120" rx="6" fill="white"/><text x="0" y="-60" text-anchor="middle" font-size="28" fill="#e74c3c">A♥</text><animateTransform attributeName="transform" type="rotate" from="0" to="-30" begin="pk02_fan.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
        <g><rect x="-40" y="-130" width="80" height="120" rx="6" fill="white"/><text x="0" y="-60" text-anchor="middle" font-size="28" fill="#2c3e50">K♠</text><animateTransform attributeName="transform" type="rotate" from="0" to="-15" begin="pk02_fan.click+0.1s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
        <g><rect x="-40" y="-130" width="80" height="120" rx="6" fill="white"/><text x="0" y="-60" text-anchor="middle" font-size="28" fill="#e74c3c">Q♦</text></g>
        <g><rect x="-40" y="-130" width="80" height="120" rx="6" fill="white"/><text x="0" y="-60" text-anchor="middle" font-size="28" fill="#2c3e50">J♣</text><animateTransform attributeName="transform" type="rotate" from="0" to="15" begin="pk02_fan.click+0.1s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
        <g><rect x="-40" y="-130" width="80" height="120" rx="6" fill="white"/><text x="0" y="-60" text-anchor="middle" font-size="28" fill="#e74c3c">10♥</text><animateTransform attributeName="transform" type="rotate" from="0" to="30" begin="pk02_fan.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      </g>
      <text x="300" y="30" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.4)">ROYAL FLUSH</text>
      <text x="300" y="370" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击展开手牌</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'poker_cascade_03',
    name: '瀑布落牌',
    category: 'poker_deal',
    tags: ['瀑布', '下落', '连续', '卡牌'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-poker-cascade',
    svg: `<svg viewBox="0 0 600 380" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="pk03_clip"><rect width="600" height="380" rx="12"/></clipPath></defs>
  <g clip-path="url(#pk03_clip)">
    <rect width="600" height="380" fill="#0a0a1a"/>
    <g id="pk03_fall" style="cursor:pointer;">
      <g opacity="0"><rect x="60" y="50" width="90" height="120" rx="6" fill="#e74c3c"/><text x="105" y="118" text-anchor="middle" font-size="16" fill="white" font-weight="bold">CARD 1</text><animate attributeName="opacity" from="0" to="1" begin="pk03_fall.click" dur="0.3s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="0 -60" to="0 0" begin="pk03_fall.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="170" y="50" width="90" height="120" rx="6" fill="#3498db"/><text x="215" y="118" text-anchor="middle" font-size="16" fill="white" font-weight="bold">CARD 2</text><animate attributeName="opacity" from="0" to="1" begin="pk03_fall.click+0.15s" dur="0.3s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="0 -60" to="0 0" begin="pk03_fall.click+0.15s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="280" y="50" width="90" height="120" rx="6" fill="#2ecc71"/><text x="325" y="118" text-anchor="middle" font-size="16" fill="white" font-weight="bold">CARD 3</text><animate attributeName="opacity" from="0" to="1" begin="pk03_fall.click+0.3s" dur="0.3s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="0 -60" to="0 0" begin="pk03_fall.click+0.3s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="390" y="50" width="90" height="120" rx="6" fill="#f39c12"/><text x="435" y="118" text-anchor="middle" font-size="16" fill="white" font-weight="bold">CARD 4</text><animate attributeName="opacity" from="0" to="1" begin="pk03_fall.click+0.45s" dur="0.3s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="0 -60" to="0 0" begin="pk03_fall.click+0.45s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="60" y="190" width="420" height="50" rx="8" fill="rgba(255,255,255,0.05)"/><text x="270" y="222" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.6)" font-weight="bold">ALL CARDS REVEALED!</text><animate attributeName="opacity" from="0" to="1" begin="pk03_fall.click+0.7s" dur="0.3s" fill="freeze"/></g>
      <text x="300" y="360" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击瀑布发牌</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'poker_spiral_04',
    name: '螺旋飞牌',
    category: 'poker_deal',
    tags: ['螺旋', '旋转', '飞出', '动感'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-poker-spiral',
    svg: `<svg viewBox="0 0 600 380" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="pk04_clip"><rect width="600" height="380" rx="12"/></clipPath></defs>
  <g clip-path="url(#pk04_clip)">
    <rect width="600" height="380" fill="#1a1510"/>
    <g id="pk04_spin" style="cursor:pointer;">
      <g><rect x="265" y="140" width="70" height="100" rx="6" fill="#f39c12"/><text x="300" y="198" text-anchor="middle" font-size="14" fill="white" font-weight="bold">1</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-180 -80" begin="pk04_spin.click" dur="0.5s" fill="freeze"/><animateTransform attributeName="transform" type="rotate" from="0 300 190" to="-25 300 190" begin="pk04_spin.click" dur="0.5s" fill="freeze" additive="sum"/></g>
      <g><rect x="265" y="140" width="70" height="100" rx="6" fill="#e67e22"/><text x="300" y="198" text-anchor="middle" font-size="14" fill="white" font-weight="bold">2</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-60 -130" begin="pk04_spin.click+0.12s" dur="0.5s" fill="freeze"/><animateTransform attributeName="transform" type="rotate" from="0 300 190" to="-10 300 190" begin="pk04_spin.click+0.12s" dur="0.5s" fill="freeze" additive="sum"/></g>
      <g><rect x="265" y="140" width="70" height="100" rx="6" fill="#d35400"/><text x="300" y="198" text-anchor="middle" font-size="14" fill="white" font-weight="bold">3</text><animateTransform attributeName="transform" type="translate" from="0 0" to="60 -130" begin="pk04_spin.click+0.24s" dur="0.5s" fill="freeze"/><animateTransform attributeName="transform" type="rotate" from="0 300 190" to="10 300 190" begin="pk04_spin.click+0.24s" dur="0.5s" fill="freeze" additive="sum"/></g>
      <g><rect x="265" y="140" width="70" height="100" rx="6" fill="#e74c3c"/><text x="300" y="198" text-anchor="middle" font-size="14" fill="white" font-weight="bold">4</text><animateTransform attributeName="transform" type="translate" from="0 0" to="180 -80" begin="pk04_spin.click+0.36s" dur="0.5s" fill="freeze"/><animateTransform attributeName="transform" type="rotate" from="0 300 190" to="25 300 190" begin="pk04_spin.click+0.36s" dur="0.5s" fill="freeze" additive="sum"/></g>
      <rect x="265" y="140" width="70" height="100" rx="6" fill="#2c3e50" stroke="#f39c12" stroke-width="1.5"/>
      <text x="300" y="198" text-anchor="middle" font-size="20" fill="#f39c12">★</text>
      <text x="300" y="360" text-anchor="middle" font-size="11" fill="rgba(243,156,18,0.4)">点击螺旋出牌</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'poker_reveal_05',
    name: '翻牌揭秘',
    category: 'poker_deal',
    tags: ['翻牌', '揭秘', '悬念', '翻转'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-poker-reveal',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="pk05_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#pk05_clip)">
    <rect width="600" height="300" fill="#2c3e50"/>
    <text x="300" y="30" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.3)">MYSTERY CARDS</text>
    <g id="pk05_c1" style="cursor:pointer;">
      <rect x="60" y="50" width="110" height="160" rx="8" fill="#34495e" stroke="#5d6d7e" stroke-width="1"/><text x="115" y="140" text-anchor="middle" font-size="16" fill="#5d6d7e">?</text>
      <g opacity="0"><rect x="60" y="50" width="110" height="160" rx="8" fill="#e74c3c"/><text x="115" y="140" text-anchor="middle" font-size="32" fill="white">A♥</text><animate attributeName="opacity" from="0" to="1" begin="pk05_c1.click" dur="0.3s" fill="freeze"/></g>
    </g>
    <g id="pk05_c2" style="cursor:pointer;">
      <rect x="190" y="50" width="110" height="160" rx="8" fill="#34495e" stroke="#5d6d7e" stroke-width="1"/><text x="245" y="140" text-anchor="middle" font-size="16" fill="#5d6d7e">?</text>
      <g opacity="0"><rect x="190" y="50" width="110" height="160" rx="8" fill="#2ecc71"/><text x="245" y="140" text-anchor="middle" font-size="32" fill="white">K♣</text><animate attributeName="opacity" from="0" to="1" begin="pk05_c2.click" dur="0.3s" fill="freeze"/></g>
    </g>
    <g id="pk05_c3" style="cursor:pointer;">
      <rect x="320" y="50" width="110" height="160" rx="8" fill="#34495e" stroke="#5d6d7e" stroke-width="1"/><text x="375" y="140" text-anchor="middle" font-size="16" fill="#5d6d7e">?</text>
      <g opacity="0"><rect x="320" y="50" width="110" height="160" rx="8" fill="#3498db"/><text x="375" y="140" text-anchor="middle" font-size="32" fill="white">Q♠</text><animate attributeName="opacity" from="0" to="1" begin="pk05_c3.click" dur="0.3s" fill="freeze"/></g>
    </g>
    <g id="pk05_c4" style="cursor:pointer;">
      <rect x="450" y="50" width="110" height="160" rx="8" fill="#34495e" stroke="#5d6d7e" stroke-width="1"/><text x="505" y="140" text-anchor="middle" font-size="16" fill="#5d6d7e">?</text>
      <g opacity="0"><rect x="450" y="50" width="110" height="160" rx="8" fill="#f39c12"/><text x="505" y="140" text-anchor="middle" font-size="32" fill="white">J♦</text><animate attributeName="opacity" from="0" to="1" begin="pk05_c4.click" dur="0.3s" fill="freeze"/></g>
    </g>
    <text x="300" y="260" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">逐张点击揭秘</text>
  </g>
</svg>`
  },
  {
    id: 'poker_stack_06',
    name: '牌堆散开',
    category: 'poker_deal',
    tags: ['牌堆', '散开', '堆叠', '展示'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-poker-stack',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="pk06_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#pk06_clip)">
    <rect width="600" height="350" fill="#0d1117"/>
    <g id="pk06_stack" style="cursor:pointer;">
      <g><rect x="250" y="80" width="100" height="140" rx="8" fill="#1abc9c"/><text x="300" y="158" text-anchor="middle" font-size="14" fill="white">E</text><animateTransform attributeName="transform" type="translate" from="0 0" to="180 50" begin="pk06_stack.click+0.4s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="250" y="80" width="100" height="140" rx="8" fill="#16a085"/><text x="300" y="158" text-anchor="middle" font-size="14" fill="white">D</text><animateTransform attributeName="transform" type="translate" from="0 0" to="90 30" begin="pk06_stack.click+0.3s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="250" y="80" width="100" height="140" rx="8" fill="#27ae60"/><text x="300" y="158" text-anchor="middle" font-size="14" fill="white">C</text></g>
      <g><rect x="250" y="80" width="100" height="140" rx="8" fill="#2ecc71"/><text x="300" y="158" text-anchor="middle" font-size="14" fill="white">B</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-90 30" begin="pk06_stack.click+0.1s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="250" y="80" width="100" height="140" rx="8" fill="#58d68d"/><text x="300" y="158" text-anchor="middle" font-size="14" fill="white">A</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-180 50" begin="pk06_stack.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <text x="300" y="330" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击散开牌堆</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 3. 无限选择器 infinite_selector ====================
export const SVG_INFINITE_SELECTOR = [
  {
    id: 'selector_wheel_01',
    name: '滚轮选择器',
    category: 'infinite_selector',
    tags: ['滚轮', '选择', '滚动', '切换'],
    colorScheme: '#007aff',
    interactive: true,
    interactionType: 'click-selector-wheel',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="is01_clip"><rect width="600" height="350" rx="12"/></clipPath><linearGradient id="is01_fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#121212"/><stop offset="25%" stop-color="#121212" stop-opacity="0"/><stop offset="75%" stop-color="#121212" stop-opacity="0"/><stop offset="100%" stop-color="#121212"/></linearGradient></defs>
  <g clip-path="url(#is01_clip)">
    <rect width="600" height="350" fill="#121212"/>
    <rect x="200" y="140" width="200" height="50" fill="#222" rx="4"/>
    <g id="is01_next" style="cursor:pointer;">
      <g><text x="300" y="120" text-anchor="middle" font-size="18" fill="#555">January</text><text x="300" y="172" text-anchor="middle" font-size="22" fill="white" font-weight="bold">February</text><text x="300" y="220" text-anchor="middle" font-size="18" fill="#555">March</text><text x="300" y="268" text-anchor="middle" font-size="16" fill="#333">April</text>
        <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -48" begin="is01_next.click" dur="0.3s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </g>
      <rect x="200" y="75" width="200" height="230" fill="url(#is01_fade)" pointer-events="none"/>
      <rect x="200" y="140" width="200" height="50" fill="none" stroke="#007aff" stroke-width="1.5" rx="4"/>
      <text x="300" y="330" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击滚动选择</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'selector_color_02',
    name: '色彩选择器',
    category: 'infinite_selector',
    tags: ['色彩', '颜色', '选择', '调色'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-selector-color',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="is02_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#is02_clip)">
    <rect width="600" height="300" fill="#1a1a1a"/>
    <text x="300" y="30" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.4)">COLOR PICKER</text>
    <g id="is02_colors" style="cursor:pointer;">
      <circle cx="150" cy="150" r="40" fill="#e74c3c" opacity="0.5"><animate attributeName="opacity" from="0.5" to="1" begin="is02_colors.click" dur="0.3s" fill="freeze"/><animate attributeName="r" from="40" to="50" begin="is02_colors.click" dur="0.3s" fill="freeze"/></circle>
      <circle cx="250" cy="150" r="40" fill="#3498db" opacity="0.5"><animate attributeName="opacity" from="0.5" to="1" begin="is02_colors.click+0.1s" dur="0.3s" fill="freeze"/><animate attributeName="r" from="40" to="50" begin="is02_colors.click+0.1s" dur="0.3s" fill="freeze"/></circle>
      <circle cx="350" cy="150" r="40" fill="#2ecc71" opacity="0.5"><animate attributeName="opacity" from="0.5" to="1" begin="is02_colors.click+0.2s" dur="0.3s" fill="freeze"/><animate attributeName="r" from="40" to="50" begin="is02_colors.click+0.2s" dur="0.3s" fill="freeze"/></circle>
      <circle cx="450" cy="150" r="40" fill="#f39c12" opacity="0.5"><animate attributeName="opacity" from="0.5" to="1" begin="is02_colors.click+0.3s" dur="0.3s" fill="freeze"/><animate attributeName="r" from="40" to="50" begin="is02_colors.click+0.3s" dur="0.3s" fill="freeze"/></circle>
      <rect x="100" y="220" width="400" height="40" rx="20" fill="rgba(255,255,255,0.05)"/><rect x="100" y="220" width="0" height="40" rx="20" fill="#e74c3c"><animate attributeName="width" from="0" to="100" begin="is02_colors.click" dur="0.3s" fill="freeze"/></rect><rect x="200" y="220" width="0" height="40" rx="0" fill="#3498db"><animate attributeName="width" from="0" to="100" begin="is02_colors.click+0.1s" dur="0.3s" fill="freeze"/></rect><rect x="300" y="220" width="0" height="40" rx="0" fill="#2ecc71"><animate attributeName="width" from="0" to="100" begin="is02_colors.click+0.2s" dur="0.3s" fill="freeze"/></rect><rect x="400" y="220" width="0" height="40" rx="20" fill="#f39c12"><animate attributeName="width" from="0" to="100" begin="is02_colors.click+0.3s" dur="0.3s" fill="freeze"/></rect>
      <text x="300" y="280" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击激活色板</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'selector_date_03',
    name: '日期选择器',
    category: 'infinite_selector',
    tags: ['日期', '日历', '选择', '滚动'],
    colorScheme: '#2ecc71',
    interactive: true,
    interactionType: 'click-selector-date',
    svg: `<svg viewBox="0 0 600 320" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="is03_clip"><rect width="600" height="320" rx="12"/></clipPath></defs>
  <g clip-path="url(#is03_clip)">
    <rect width="600" height="320" fill="#0d1117"/>
    <text x="300" y="30" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.3)">SELECT DATE</text>
    <g id="is03_yr" style="cursor:pointer;">
      <rect x="60" y="110" width="150" height="50" fill="#1a2332" rx="6"/><text x="135" y="85" text-anchor="middle" font-size="16" fill="#444">2024</text><text x="135" y="142" text-anchor="middle" font-size="20" fill="#2ecc71" font-weight="bold">2025</text><text x="135" y="195" text-anchor="middle" font-size="16" fill="#444">2026</text>
      <animate attributeName="transform" type="translate" from="0 0" to="0 -45" begin="is03_yr.click" dur="0.3s" fill="freeze"/>
    </g>
    <g id="is03_mo" style="cursor:pointer;">
      <rect x="225" y="110" width="150" height="50" fill="#1a2332" rx="6"/><text x="300" y="85" text-anchor="middle" font-size="16" fill="#444">MAR</text><text x="300" y="142" text-anchor="middle" font-size="20" fill="#2ecc71" font-weight="bold">APR</text><text x="300" y="195" text-anchor="middle" font-size="16" fill="#444">MAY</text>
      <animate attributeName="transform" type="translate" from="0 0" to="0 -45" begin="is03_mo.click" dur="0.3s" fill="freeze"/>
    </g>
    <g id="is03_dy" style="cursor:pointer;">
      <rect x="390" y="110" width="150" height="50" fill="#1a2332" rx="6"/><text x="465" y="85" text-anchor="middle" font-size="16" fill="#444">14</text><text x="465" y="142" text-anchor="middle" font-size="20" fill="#2ecc71" font-weight="bold">15</text><text x="465" y="195" text-anchor="middle" font-size="16" fill="#444">16</text>
      <animate attributeName="transform" type="translate" from="0 0" to="0 -45" begin="is03_dy.click" dur="0.3s" fill="freeze"/>
    </g>
    <text x="300" y="280" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击各列滚动选择</text>
  </g>
</svg>`
  },
  {
    id: 'selector_menu_04',
    name: '菜单选择器',
    category: 'infinite_selector',
    tags: ['菜单', '选项', '列表', '滚动'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-selector-menu',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="is04_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#is04_clip)">
    <rect width="600" height="300" fill="#f5f5f5"/>
    <rect x="150" y="20" width="300" height="240" rx="12" fill="white" stroke="#eee" stroke-width="1"/>
    <g id="is04_menu" style="cursor:pointer;">
      <g><rect x="160" y="30" width="280" height="44" rx="6" fill="#f0e6f6"/><text x="300" y="58" text-anchor="middle" font-size="13" fill="#9b59b6" font-weight="bold">Premium Plan</text></g>
      <g><rect x="160" y="82" width="280" height="44" rx="6" fill="white"/><text x="300" y="110" text-anchor="middle" font-size="13" fill="#666">Standard Plan</text></g>
      <g><rect x="160" y="134" width="280" height="44" rx="6" fill="white"/><text x="300" y="162" text-anchor="middle" font-size="13" fill="#666">Basic Plan</text></g>
      <g><rect x="160" y="186" width="280" height="44" rx="6" fill="white"/><text x="300" y="214" text-anchor="middle" font-size="13" fill="#666">Free Trial</text></g>
      <rect x="430" y="30" width="6" height="44" rx="3" fill="#9b59b6"><animate attributeName="y" from="30" to="82" begin="is04_menu.click" dur="0.3s" fill="freeze"/></rect>
      <rect x="160" y="30" width="280" height="44" rx="6" fill="#f0e6f6"><animate attributeName="y" from="30" to="82" begin="is04_menu.click" dur="0.3s" fill="freeze"/></rect>
      <text x="300" y="280" text-anchor="middle" font-size="11" fill="#bbb">点击切换选中项</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'selector_size_05',
    name: '尺码选择器',
    category: 'infinite_selector',
    tags: ['尺码', '大小', '商品', '选择'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-selector-size',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="is05_clip"><rect width="600" height="250" rx="12"/></clipPath></defs>
  <g clip-path="url(#is05_clip)">
    <rect width="600" height="250" fill="#1a1a2e"/>
    <text x="300" y="35" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.4)">SELECT SIZE</text>
    <g id="is05_s" style="cursor:pointer;">
      <circle cx="100" cy="120" r="30" fill="none" stroke="#555" stroke-width="2"/><text x="100" y="127" text-anchor="middle" font-size="14" fill="#888">XS</text>
      <circle cx="200" cy="120" r="30" fill="none" stroke="#555" stroke-width="2"/><text x="200" y="127" text-anchor="middle" font-size="14" fill="#888">S</text>
      <circle cx="300" cy="120" r="30" fill="none" stroke="#e67e22" stroke-width="2"/><text x="300" y="127" text-anchor="middle" font-size="14" fill="#e67e22" font-weight="bold">M</text>
      <circle cx="400" cy="120" r="30" fill="none" stroke="#555" stroke-width="2"/><text x="400" y="127" text-anchor="middle" font-size="14" fill="#888">L</text>
      <circle cx="500" cy="120" r="30" fill="none" stroke="#555" stroke-width="2"/><text x="500" y="127" text-anchor="middle" font-size="14" fill="#888">XL</text>
      <circle cx="300" cy="120" r="30" fill="#e67e22" opacity="0.15"><animate attributeName="cx" from="300" to="400" begin="is05_s.click" dur="0.3s" fill="freeze"/></circle>
      <circle cx="300" cy="120" r="30" fill="none" stroke="#e67e22" stroke-width="2"><animate attributeName="cx" from="300" to="400" begin="is05_s.click" dur="0.3s" fill="freeze"/></circle>
      <text x="300" y="190" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.4)">Current: M<animate attributeName="opacity" from="1" to="0" begin="is05_s.click" dur="0.15s" fill="freeze"/></text>
      <text x="300" y="190" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0)" opacity="0">Current: L<animate attributeName="opacity" from="0" to="1" begin="is05_s.click+0.15s" dur="0.15s" fill="freeze"/></text>
      <text x="300" y="230" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击切换尺码</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'selector_emoji_06',
    name: '表情选择器',
    category: 'infinite_selector',
    tags: ['表情', '评分', '反馈', '选择'],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click-selector-emoji',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="is06_clip"><rect width="600" height="250" rx="12"/></clipPath></defs>
  <g clip-path="url(#is06_clip)">
    <rect width="600" height="250" fill="#fef9e7"/>
    <text x="300" y="30" text-anchor="middle" font-size="14" fill="#7d6608" font-weight="bold">How was your experience?</text>
    <g id="is06_e1" style="cursor:pointer;">
      <circle cx="120" cy="110" r="35" fill="#fadbd8"/><text x="120" y="120" text-anchor="middle" font-size="30">😞</text>
      <circle cx="120" cy="110" r="35" fill="none" stroke="#e74c3c" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="is06_e1.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="is06_e2.click" dur="0.15s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="is06_e3.click" dur="0.15s" fill="freeze"/></circle>
    </g>
    <g id="is06_e2" style="cursor:pointer;">
      <circle cx="300" cy="110" r="35" fill="#fdebd0"/><text x="300" y="120" text-anchor="middle" font-size="30">😐</text>
      <circle cx="300" cy="110" r="35" fill="none" stroke="#f39c12" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="is06_e2.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="is06_e1.click" dur="0.15s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="is06_e3.click" dur="0.15s" fill="freeze"/></circle>
    </g>
    <g id="is06_e3" style="cursor:pointer;">
      <circle cx="480" cy="110" r="35" fill="#d5f5e3"/><text x="480" y="120" text-anchor="middle" font-size="30">😍</text>
      <circle cx="480" cy="110" r="35" fill="none" stroke="#2ecc71" stroke-width="0"><animate attributeName="stroke-width" from="0" to="3" begin="is06_e3.click" dur="0.2s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="is06_e1.click" dur="0.15s" fill="freeze"/><animate attributeName="stroke-width" from="3" to="0" begin="is06_e2.click" dur="0.15s" fill="freeze"/></circle>
    </g>
    <text x="300" y="200" text-anchor="middle" font-size="11" fill="#999">点击选择反馈</text>
  </g>
</svg>`
  }
]

// ==================== 4. 排队入场 stagger_entrance ====================
export const SVG_STAGGER_ENTRANCE = [
  {
    id: 'stagger_list_01',
    name: '列表入场',
    category: 'stagger_entrance',
    tags: ['列表', '入场', '错时', '逐行'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-stagger-list',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="se01_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#se01_clip)">
    <rect width="600" height="350" fill="#050505"/>
    <g id="se01_list" style="cursor:pointer;">
      <g opacity="0"><rect x="80" y="30" width="440" height="55" rx="10" fill="#1a1a1a"/><circle cx="120" cy="57" r="16" fill="#e74c3c"/><rect x="150" y="50" width="200" height="10" rx="5" fill="#333"/><animate attributeName="opacity" from="0" to="1" begin="se01_list.click" dur="0.4s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="0 30" to="0 0" begin="se01_list.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="80" y="95" width="440" height="55" rx="10" fill="#1a1a1a"/><circle cx="120" cy="122" r="16" fill="#3498db"/><rect x="150" y="115" width="250" height="10" rx="5" fill="#333"/><animate attributeName="opacity" from="0" to="1" begin="se01_list.click+0.15s" dur="0.4s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="0 30" to="0 0" begin="se01_list.click+0.15s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="80" y="160" width="440" height="55" rx="10" fill="#1a1a1a"/><circle cx="120" cy="187" r="16" fill="#2ecc71"/><rect x="150" y="180" width="180" height="10" rx="5" fill="#333"/><animate attributeName="opacity" from="0" to="1" begin="se01_list.click+0.3s" dur="0.4s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="0 30" to="0 0" begin="se01_list.click+0.3s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="80" y="225" width="440" height="55" rx="10" fill="#1a1a1a"/><circle cx="120" cy="252" r="16" fill="#f39c12"/><rect x="150" y="245" width="220" height="10" rx="5" fill="#333"/><animate attributeName="opacity" from="0" to="1" begin="se01_list.click+0.45s" dur="0.4s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="0 30" to="0 0" begin="se01_list.click+0.45s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <text x="300" y="320" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击排队入场</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'stagger_grid_02',
    name: '网格入场',
    category: 'stagger_entrance',
    tags: ['网格', '入场', '矩阵', '渐现'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-stagger-grid',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="se02_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#se02_clip)">
    <rect width="600" height="350" fill="#0d1b2a"/>
    <g id="se02_grid" style="cursor:pointer;">
      <g opacity="0"><rect x="60" y="40" width="110" height="110" rx="8" fill="#3498db"/><animate attributeName="opacity" from="0" to="1" begin="se02_grid.click" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><rect x="185" y="40" width="110" height="110" rx="8" fill="#2980b9"/><animate attributeName="opacity" from="0" to="1" begin="se02_grid.click+0.1s" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><rect x="310" y="40" width="110" height="110" rx="8" fill="#1a6fa0"/><animate attributeName="opacity" from="0" to="1" begin="se02_grid.click+0.2s" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><rect x="435" y="40" width="110" height="110" rx="8" fill="#154f78"/><animate attributeName="opacity" from="0" to="1" begin="se02_grid.click+0.3s" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><rect x="60" y="165" width="110" height="110" rx="8" fill="#2574a9"/><animate attributeName="opacity" from="0" to="1" begin="se02_grid.click+0.15s" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><rect x="185" y="165" width="110" height="110" rx="8" fill="#1e6f9f"/><animate attributeName="opacity" from="0" to="1" begin="se02_grid.click+0.25s" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><rect x="310" y="165" width="110" height="110" rx="8" fill="#176190"/><animate attributeName="opacity" from="0" to="1" begin="se02_grid.click+0.35s" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><rect x="435" y="165" width="110" height="110" rx="8" fill="#105580"/><animate attributeName="opacity" from="0" to="1" begin="se02_grid.click+0.45s" dur="0.3s" fill="freeze"/></g>
      <text x="300" y="325" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击网格入场</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'stagger_side_03',
    name: '侧滑入场',
    category: 'stagger_entrance',
    tags: ['侧滑', '左右', '交替', '入场'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-stagger-side',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="se03_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#se03_clip)">
    <rect width="600" height="350" fill="#1a1a2e"/>
    <g id="se03_side" style="cursor:pointer;">
      <g opacity="0"><rect x="60" y="30" width="230" height="70" rx="8" fill="#9b59b6"/><text x="175" y="72" text-anchor="middle" font-size="13" fill="white" font-weight="bold">FROM LEFT</text><animate attributeName="opacity" from="0" to="1" begin="se03_side.click" dur="0.3s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="-100 0" to="0 0" begin="se03_side.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="310" y="110" width="230" height="70" rx="8" fill="#8e44ad"/><text x="425" y="152" text-anchor="middle" font-size="13" fill="white" font-weight="bold">FROM RIGHT</text><animate attributeName="opacity" from="0" to="1" begin="se03_side.click+0.2s" dur="0.3s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="100 0" to="0 0" begin="se03_side.click+0.2s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="60" y="190" width="230" height="70" rx="8" fill="#7d3c98"/><text x="175" y="232" text-anchor="middle" font-size="13" fill="white" font-weight="bold">FROM LEFT</text><animate attributeName="opacity" from="0" to="1" begin="se03_side.click+0.4s" dur="0.3s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="-100 0" to="0 0" begin="se03_side.click+0.4s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="310" y="270" width="230" height="50" rx="8" fill="#6c3483"/><text x="425" y="302" text-anchor="middle" font-size="13" fill="white" font-weight="bold">FROM RIGHT</text><animate attributeName="opacity" from="0" to="1" begin="se03_side.click+0.6s" dur="0.3s" fill="freeze"/><animateTransform attributeName="transform" type="translate" from="100 0" to="0 0" begin="se03_side.click+0.6s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <text x="300" y="345" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击交替侧滑入场</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'stagger_scale_04',
    name: '缩放入场',
    category: 'stagger_entrance',
    tags: ['缩放', '放大', '弹出', '入场'],
    colorScheme: '#2ecc71',
    interactive: true,
    interactionType: 'click-stagger-scale',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="se04_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#se04_clip)">
    <rect width="600" height="300" fill="#0d1117"/>
    <g id="se04_scale" style="cursor:pointer;">
      <g opacity="0" transform="translate(120,130)"><circle r="0" fill="#2ecc71"><animate attributeName="r" from="0" to="45" begin="se04_scale.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></circle><text y="7" text-anchor="middle" font-size="16" fill="white" font-weight="bold" opacity="0">01<animate attributeName="opacity" from="0" to="1" begin="se04_scale.click+0.2s" dur="0.2s" fill="freeze"/></text><animate attributeName="opacity" from="0" to="1" begin="se04_scale.click" dur="0.1s" fill="freeze"/></g>
      <g opacity="0" transform="translate(240,130)"><circle r="0" fill="#27ae60"><animate attributeName="r" from="0" to="45" begin="se04_scale.click+0.15s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></circle><text y="7" text-anchor="middle" font-size="16" fill="white" font-weight="bold" opacity="0">02<animate attributeName="opacity" from="0" to="1" begin="se04_scale.click+0.35s" dur="0.2s" fill="freeze"/></text><animate attributeName="opacity" from="0" to="1" begin="se04_scale.click+0.15s" dur="0.1s" fill="freeze"/></g>
      <g opacity="0" transform="translate(360,130)"><circle r="0" fill="#1abc9c"><animate attributeName="r" from="0" to="45" begin="se04_scale.click+0.3s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></circle><text y="7" text-anchor="middle" font-size="16" fill="white" font-weight="bold" opacity="0">03<animate attributeName="opacity" from="0" to="1" begin="se04_scale.click+0.5s" dur="0.2s" fill="freeze"/></text><animate attributeName="opacity" from="0" to="1" begin="se04_scale.click+0.3s" dur="0.1s" fill="freeze"/></g>
      <g opacity="0" transform="translate(480,130)"><circle r="0" fill="#16a085"><animate attributeName="r" from="0" to="45" begin="se04_scale.click+0.45s" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></circle><text y="7" text-anchor="middle" font-size="16" fill="white" font-weight="bold" opacity="0">04<animate attributeName="opacity" from="0" to="1" begin="se04_scale.click+0.65s" dur="0.2s" fill="freeze"/></text><animate attributeName="opacity" from="0" to="1" begin="se04_scale.click+0.45s" dur="0.1s" fill="freeze"/></g>
      <text x="300" y="270" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击缩放入场</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'stagger_bounce_05',
    name: '弹跳入场',
    category: 'stagger_entrance',
    tags: ['弹跳', '弹性', '活泼', '入场'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-stagger-bounce',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="se05_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#se05_clip)">
    <rect width="600" height="300" fill="#2c3e50"/>
    <g id="se05_bounce" style="cursor:pointer;">
      <g opacity="0"><rect x="80" y="200" width="80" height="0" rx="4" fill="#f39c12"><animate attributeName="height" from="0" to="120" begin="se05_bounce.click" dur="0.5s" fill="freeze"/><animate attributeName="y" from="200" to="80" begin="se05_bounce.click" dur="0.5s" fill="freeze"/></rect><text x="120" y="220" text-anchor="middle" font-size="11" fill="white" font-weight="bold" opacity="0">Q1<animate attributeName="opacity" from="0" to="1" begin="se05_bounce.click+0.3s" dur="0.2s" fill="freeze"/></text><animate attributeName="opacity" from="0" to="1" begin="se05_bounce.click" dur="0.1s" fill="freeze"/></g>
      <g opacity="0"><rect x="190" y="200" width="80" height="0" rx="4" fill="#e67e22"><animate attributeName="height" from="0" to="90" begin="se05_bounce.click+0.15s" dur="0.5s" fill="freeze"/><animate attributeName="y" from="200" to="110" begin="se05_bounce.click+0.15s" dur="0.5s" fill="freeze"/></rect><text x="230" y="220" text-anchor="middle" font-size="11" fill="white" font-weight="bold" opacity="0">Q2<animate attributeName="opacity" from="0" to="1" begin="se05_bounce.click+0.45s" dur="0.2s" fill="freeze"/></text><animate attributeName="opacity" from="0" to="1" begin="se05_bounce.click+0.15s" dur="0.1s" fill="freeze"/></g>
      <g opacity="0"><rect x="300" y="200" width="80" height="0" rx="4" fill="#d35400"><animate attributeName="height" from="0" to="150" begin="se05_bounce.click+0.3s" dur="0.5s" fill="freeze"/><animate attributeName="y" from="200" to="50" begin="se05_bounce.click+0.3s" dur="0.5s" fill="freeze"/></rect><text x="340" y="220" text-anchor="middle" font-size="11" fill="white" font-weight="bold" opacity="0">Q3<animate attributeName="opacity" from="0" to="1" begin="se05_bounce.click+0.6s" dur="0.2s" fill="freeze"/></text><animate attributeName="opacity" from="0" to="1" begin="se05_bounce.click+0.3s" dur="0.1s" fill="freeze"/></g>
      <g opacity="0"><rect x="410" y="200" width="80" height="0" rx="4" fill="#c0392b"><animate attributeName="height" from="0" to="100" begin="se05_bounce.click+0.45s" dur="0.5s" fill="freeze"/><animate attributeName="y" from="200" to="100" begin="se05_bounce.click+0.45s" dur="0.5s" fill="freeze"/></rect><text x="450" y="220" text-anchor="middle" font-size="11" fill="white" font-weight="bold" opacity="0">Q4<animate attributeName="opacity" from="0" to="1" begin="se05_bounce.click+0.75s" dur="0.2s" fill="freeze"/></text><animate attributeName="opacity" from="0" to="1" begin="se05_bounce.click+0.45s" dur="0.1s" fill="freeze"/></g>
      <line x1="60" y1="200" x2="540" y2="200" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <text x="300" y="260" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击弹出图表</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'stagger_text_06',
    name: '文字逐行入场',
    category: 'stagger_entrance',
    tags: ['文字', '逐行', '打字', '入场'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-stagger-text',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="se06_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#se06_clip)">
    <rect width="600" height="300" fill="#0d1117"/>
    <g id="se06_text" style="cursor:pointer;">
      <text x="300" y="60" text-anchor="middle" font-size="28" fill="rgba(26,188,156,0)" font-weight="bold">WELCOME<animate attributeName="fill" from="rgba(26,188,156,0)" to="rgba(26,188,156,1)" begin="se06_text.click" dur="0.3s" fill="freeze"/></text>
      <text x="300" y="100" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0)">to our brand new experience<animate attributeName="fill" from="rgba(255,255,255,0)" to="rgba(255,255,255,0.7)" begin="se06_text.click+0.2s" dur="0.3s" fill="freeze"/></text>
      <line x1="200" y1="120" x2="400" y2="120" stroke="#1abc9c" stroke-width="2" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="se06_text.click+0.4s" dur="0.3s" fill="freeze"/></line>
      <text x="300" y="155" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0)">Crafted with passion and precision<animate attributeName="fill" from="rgba(255,255,255,0)" to="rgba(255,255,255,0.5)" begin="se06_text.click+0.5s" dur="0.3s" fill="freeze"/></text>
      <text x="300" y="185" text-anchor="middle" font-size="13" fill="rgba(255,255,255,0)">Designed for the modern creator<animate attributeName="fill" from="rgba(255,255,255,0)" to="rgba(255,255,255,0.5)" begin="se06_text.click+0.65s" dur="0.3s" fill="freeze"/></text>
      <rect x="230" y="210" width="140" height="36" rx="18" fill="none" stroke="#1abc9c" stroke-width="1.5" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="se06_text.click+0.8s" dur="0.3s" fill="freeze"/></rect>
      <text x="300" y="234" text-anchor="middle" font-size="12" fill="rgba(26,188,156,0)">GET STARTED<animate attributeName="fill" from="rgba(26,188,156,0)" to="rgba(26,188,156,1)" begin="se06_text.click+0.8s" dur="0.3s" fill="freeze"/></text>
      <text x="300" y="285" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击逐行入场</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 5. 错层吸附 layer_adhesion ====================
export const SVG_LAYER_ADHESION = [
  {
    id: 'layer_dual_01',
    name: '双层错速滑动',
    category: 'layer_adhesion',
    tags: ['双层', '错速', '滑动', '吸附'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-layer-dual',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="la01_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#la01_clip)">
    <rect width="600" height="350" fill="#1a1a1a"/>
    <g id="la01_dual" style="cursor:pointer;">
      <g><rect x="50" y="50" width="250" height="250" rx="8" fill="#e74c3c" opacity="0.8"/><text x="175" y="180" text-anchor="middle" font-size="20" fill="white" font-weight="bold">LAYER A</text><animateTransform attributeName="transform" type="translate" from="0 0" to="130 0" begin="la01_dual.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="300" y="50" width="250" height="250" rx="8" fill="#3498db" opacity="0.8"/><text x="425" y="180" text-anchor="middle" font-size="20" fill="white" font-weight="bold">LAYER B</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-130 0" begin="la01_dual.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><rect x="225" y="100" width="150" height="150" rx="12" fill="white"/><text x="300" y="180" text-anchor="middle" font-size="16" fill="#333" font-weight="bold">HIDDEN</text><animate attributeName="opacity" from="0" to="1" begin="la01_dual.click+0.3s" dur="0.3s" fill="freeze"/></g>
      <text x="300" y="335" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击错层分离</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'layer_triple_02',
    name: '三层递进吸附',
    category: 'layer_adhesion',
    tags: ['三层', '递进', '吸附', '层叠'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-layer-triple',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="la02_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#la02_clip)">
    <rect width="600" height="350" fill="#0d1117"/>
    <g id="la02_tri" style="cursor:pointer;">
      <g><rect x="200" y="50" width="200" height="250" rx="8" fill="#6c3483"/><text x="300" y="180" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.6)">Layer 3</text><animateTransform attributeName="transform" type="translate" from="0 0" to="200 0" begin="la02_tri.click" dur="0.7s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="200" y="50" width="200" height="250" rx="8" fill="#8e44ad"/><text x="300" y="180" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.7)">Layer 2</text><animateTransform attributeName="transform" type="translate" from="0 0" to="0 0" begin="la02_tri.click" dur="0.5s" fill="freeze"/></g>
      <g><rect x="200" y="50" width="200" height="250" rx="8" fill="#a569bd"/><text x="300" y="180" text-anchor="middle" font-size="16" fill="white">Layer 1</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-200 0" begin="la02_tri.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <text x="300" y="335" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击三层展开</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'layer_vertical_03',
    name: '纵向错层分离',
    category: 'layer_adhesion',
    tags: ['纵向', '上下', '分离', '错层'],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'click-layer-vertical',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="la03_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#la03_clip)">
    <rect width="600" height="350" fill="#1a2e1a"/>
    <g id="la03_vert" style="cursor:pointer;">
      <g><rect x="100" y="75" width="400" height="200" rx="8" fill="#27ae60"/><text x="300" y="180" text-anchor="middle" font-size="16" fill="white">TOP LAYER</text><animateTransform attributeName="transform" type="translate" from="0 0" to="0 -80" begin="la03_vert.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="100" y="75" width="400" height="200" rx="8" fill="#2ecc71"/><text x="300" y="180" text-anchor="middle" font-size="16" fill="white">BOTTOM LAYER</text><animateTransform attributeName="transform" type="translate" from="0 0" to="0 80" begin="la03_vert.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><text x="300" y="180" text-anchor="middle" font-size="20" fill="white" font-weight="bold">REVEALED</text><animate attributeName="opacity" from="0" to="1" begin="la03_vert.click+0.3s" dur="0.3s" fill="freeze"/></g>
      <text x="300" y="335" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击纵向分离</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'layer_puzzle_04',
    name: '拼图错层',
    category: 'layer_adhesion',
    tags: ['拼图', '四向', '散开', '错层'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-layer-puzzle',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="la04_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#la04_clip)">
    <rect width="600" height="350" fill="#0a0a0a"/>
    <g id="la04_pz" style="cursor:pointer;">
      <g><rect x="200" y="75" width="100" height="100" rx="4" fill="#e67e22"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-60 -40" begin="la04_pz.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="300" y="75" width="100" height="100" rx="4" fill="#d35400"/><animateTransform attributeName="transform" type="translate" from="0 0" to="60 -40" begin="la04_pz.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="200" y="175" width="100" height="100" rx="4" fill="#f39c12"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-60 40" begin="la04_pz.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="300" y="175" width="100" height="100" rx="4" fill="#e74c3c"/><animateTransform attributeName="transform" type="translate" from="0 0" to="60 40" begin="la04_pz.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g opacity="0"><text x="300" y="180" text-anchor="middle" font-size="22" fill="white" font-weight="bold">OPEN</text><animate attributeName="opacity" from="0" to="1" begin="la04_pz.click+0.3s" dur="0.3s" fill="freeze"/></g>
      <text x="300" y="335" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击四向散开</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'layer_blinds_05',
    name: '百叶窗错层',
    category: 'layer_adhesion',
    tags: ['百叶窗', '条纹', '分离', '错层'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-layer-blinds',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="la05_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#la05_clip)">
    <rect width="600" height="300" fill="#0d1b2a"/>
    <g opacity="0"><rect x="50" y="30" width="500" height="220" rx="8" fill="#1a3a5c"/><text x="300" y="150" text-anchor="middle" font-size="18" fill="white" font-weight="bold">BEHIND THE BLINDS</text><animate attributeName="opacity" from="0" to="1" begin="la05_blinds.click+0.2s" dur="0.3s" fill="freeze"/></g>
    <g id="la05_blinds" style="cursor:pointer;">
      <rect x="50" y="30" width="500" height="44" fill="#3498db"><animateTransform attributeName="transform" type="translate" from="0 0" to="0 -50" begin="la05_blinds.click" dur="0.4s" fill="freeze"/></rect>
      <rect x="50" y="74" width="500" height="44" fill="#2980b9"><animateTransform attributeName="transform" type="translate" from="0 0" to="0 -25" begin="la05_blinds.click" dur="0.5s" fill="freeze"/></rect>
      <rect x="50" y="118" width="500" height="44" fill="#2471a3"/>
      <rect x="50" y="162" width="500" height="44" fill="#1a5276"><animateTransform attributeName="transform" type="translate" from="0 0" to="0 25" begin="la05_blinds.click" dur="0.5s" fill="freeze"/></rect>
      <rect x="50" y="206" width="500" height="44" fill="#154360"><animateTransform attributeName="transform" type="translate" from="0 0" to="0 50" begin="la05_blinds.click" dur="0.4s" fill="freeze"/></rect>
      <text x="300" y="280" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击百叶窗分离</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'layer_door_06',
    name: '对开门错层',
    category: 'layer_adhesion',
    tags: ['对开门', '开门', '双扇', '错层'],
    colorScheme: '#c0392b',
    interactive: true,
    interactionType: 'click-layer-door',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="la06_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#la06_clip)">
    <rect width="600" height="350" fill="#1a0a0a"/>
    <g opacity="0"><rect x="150" y="50" width="300" height="250" rx="12" fill="#2c1a1a"/><text x="300" y="160" text-anchor="middle" font-size="20" fill="#c0392b" font-weight="bold">WELCOME</text><text x="300" y="190" text-anchor="middle" font-size="12" fill="rgba(192,57,43,0.5)">Step inside</text><animate attributeName="opacity" from="0" to="1" begin="la06_door.click+0.2s" dur="0.3s" fill="freeze"/></g>
    <g id="la06_door" style="cursor:pointer;">
      <g><rect x="100" y="25" width="200" height="300" rx="6" fill="#c0392b"/><rect x="260" y="150" width="20" height="30" rx="4" fill="#922b21"/><text x="200" y="180" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.5)">PUSH</text><animateTransform attributeName="transform" type="translate" from="0 0" to="-150 0" begin="la06_door.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <g><rect x="300" y="25" width="200" height="300" rx="6" fill="#e74c3c"/><rect x="320" y="150" width="20" height="30" rx="4" fill="#c0392b"/><text x="400" y="180" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.5)">PUSH</text><animateTransform attributeName="transform" type="translate" from="0 0" to="150 0" begin="la06_door.click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></g>
      <text x="300" y="345" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击推开门</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 6. 卡牌翻转 card_flip ====================
export const SVG_CARD_FLIP = [
  {
    id: 'flip_member_01',
    name: '会员卡翻转',
    category: 'card_flip',
    tags: ['会员卡', '翻转', '正反', '揭秘'],
    colorScheme: '#e94560',
    interactive: true,
    interactionType: 'click-flip-member',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="cf01_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#cf01_clip)">
    <rect width="600" height="350" fill="#1a1a2e"/>
    <g id="cf01_card" style="cursor:pointer;">
      <g>
        <rect x="175" y="60" width="250" height="200" rx="16" fill="#16213e" stroke="#0f3460" stroke-width="2"/>
        <circle cx="300" cy="130" r="30" fill="#e94560" opacity="0.8"/><text x="300" y="138" text-anchor="middle" font-size="20" fill="white">★</text>
        <text x="300" y="185" text-anchor="middle" font-size="16" fill="#e94560" font-weight="bold">MEMBER CARD</text>
        <text x="300" y="210" text-anchor="middle" font-size="10" fill="#888">**** **** **** 8888</text>
        <text x="300" y="245" text-anchor="middle" font-size="9" fill="#555">tap to flip</text>
        <animate attributeName="opacity" from="1" to="0" begin="cf01_card.click" dur="0.2s" fill="freeze"/>
      </g>
      <g opacity="0">
        <rect x="175" y="60" width="250" height="200" rx="16" fill="#0f3460" stroke="#e94560" stroke-width="2"/>
        <rect x="190" y="80" width="220" height="30" fill="#1a1a2e"/>
        <text x="300" y="140" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.6)">CARD HOLDER</text>
        <text x="300" y="165" text-anchor="middle" font-size="14" fill="white" font-weight="bold">Zhang Wei</text>
        <text x="300" y="195" text-anchor="middle" font-size="10" fill="#e94560">VIP PLATINUM</text>
        <text x="300" y="220" text-anchor="middle" font-size="10" fill="#888">Valid: 2025.01 - 2026.12</text>
        <animate attributeName="opacity" from="0" to="1" begin="cf01_card.click+0.2s" dur="0.2s" fill="freeze"/>
      </g>
      <text x="300" y="310" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击翻转卡片</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'flip_tarot_02',
    name: '塔罗牌翻转',
    category: 'card_flip',
    tags: ['塔罗', '神秘', '翻转', '占卜'],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-flip-tarot',
    svg: `<svg viewBox="0 0 600 380" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="cf02_clip"><rect width="600" height="380" rx="12"/></clipPath></defs>
  <g clip-path="url(#cf02_clip)">
    <rect width="600" height="380" fill="#0a0a1a"/>
    <text x="300" y="30" text-anchor="middle" font-size="14" fill="rgba(142,68,173,0.5)">CHOOSE YOUR DESTINY</text>
    <g id="cf02_t1" style="cursor:pointer;">
      <rect x="50" y="50" width="140" height="210" rx="10" fill="#1a0a2e" stroke="#8e44ad" stroke-width="1.5"/><text x="120" y="160" text-anchor="middle" font-size="24" fill="#8e44ad">?</text>
      <g opacity="0"><rect x="50" y="50" width="140" height="210" rx="10" fill="#8e44ad"/><text x="120" y="140" text-anchor="middle" font-size="30" fill="white">☀</text><text x="120" y="175" text-anchor="middle" font-size="12" fill="white" font-weight="bold">THE SUN</text><text x="120" y="200" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.6)">Joy & Success</text><animate attributeName="opacity" from="0" to="1" begin="cf02_t1.click" dur="0.3s" fill="freeze"/></g>
    </g>
    <g id="cf02_t2" style="cursor:pointer;">
      <rect x="230" y="50" width="140" height="210" rx="10" fill="#1a0a2e" stroke="#8e44ad" stroke-width="1.5"/><text x="300" y="160" text-anchor="middle" font-size="24" fill="#8e44ad">?</text>
      <g opacity="0"><rect x="230" y="50" width="140" height="210" rx="10" fill="#6c3483"/><text x="300" y="140" text-anchor="middle" font-size="30" fill="white">☽</text><text x="300" y="175" text-anchor="middle" font-size="12" fill="white" font-weight="bold">THE MOON</text><text x="300" y="200" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.6)">Mystery & Intuition</text><animate attributeName="opacity" from="0" to="1" begin="cf02_t2.click" dur="0.3s" fill="freeze"/></g>
    </g>
    <g id="cf02_t3" style="cursor:pointer;">
      <rect x="410" y="50" width="140" height="210" rx="10" fill="#1a0a2e" stroke="#8e44ad" stroke-width="1.5"/><text x="480" y="160" text-anchor="middle" font-size="24" fill="#8e44ad">?</text>
      <g opacity="0"><rect x="410" y="50" width="140" height="210" rx="10" fill="#4a235a"/><text x="480" y="140" text-anchor="middle" font-size="30" fill="white">★</text><text x="480" y="175" text-anchor="middle" font-size="12" fill="white" font-weight="bold">THE STAR</text><text x="480" y="200" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.6)">Hope & Inspiration</text><animate attributeName="opacity" from="0" to="1" begin="cf02_t3.click" dur="0.3s" fill="freeze"/></g>
    </g>
    <text x="300" y="310" text-anchor="middle" font-size="11" fill="rgba(142,68,173,0.4)">逐张点击翻开塔罗牌</text>
  </g>
</svg>`
  },
  {
    id: 'flip_photo_03',
    name: '照片翻转',
    category: 'card_flip',
    tags: ['照片', '翻转', '信息', '双面'],
    colorScheme: '#2980b9',
    interactive: true,
    interactionType: 'click-flip-photo',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="cf03_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#cf03_clip)">
    <rect width="600" height="300" fill="#f5f5f5"/>
    <g id="cf03_photo" style="cursor:pointer;">
      <g><rect x="175" y="30" width="250" height="210" rx="8" fill="#2980b9"/><text x="300" y="120" text-anchor="middle" font-size="40" fill="rgba(255,255,255,0.3)">PHOTO</text><text x="300" y="155" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.5)">Travel · 2025 Summer</text><animate attributeName="opacity" from="1" to="0" begin="cf03_photo.click" dur="0.2s" fill="freeze"/></g>
      <g opacity="0"><rect x="175" y="30" width="250" height="210" rx="8" fill="white" stroke="#eee" stroke-width="1"/><text x="300" y="90" text-anchor="middle" font-size="14" fill="#333" font-weight="bold">Santorini, Greece</text><text x="300" y="120" text-anchor="middle" font-size="11" fill="#666">June 15, 2025</text><line x1="200" y1="135" x2="400" y2="135" stroke="#eee" stroke-width="1"/><text x="300" y="160" text-anchor="middle" font-size="10" fill="#999">The most beautiful sunset</text><text x="300" y="180" text-anchor="middle" font-size="10" fill="#999">we have ever seen together.</text><text x="300" y="215" text-anchor="middle" font-size="18" fill="#e74c3c">♥</text><animate attributeName="opacity" from="0" to="1" begin="cf03_photo.click+0.2s" dur="0.2s" fill="freeze"/></g>
      <text x="300" y="275" text-anchor="middle" font-size="11" fill="#bbb">点击查看照片背面</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'flip_coupon_04',
    name: '优惠券翻转',
    category: 'card_flip',
    tags: ['优惠券', '翻转', '促销', '福利'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-flip-coupon',
    svg: `<svg viewBox="0 0 600 280" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="cf04_clip"><rect width="600" height="280" rx="12"/></clipPath></defs>
  <g clip-path="url(#cf04_clip)">
    <rect width="600" height="280" fill="#fff5f5"/>
    <g id="cf04_coupon" style="cursor:pointer;">
      <g><rect x="100" y="40" width="400" height="170" rx="10" fill="#e74c3c"/><text x="300" y="100" text-anchor="middle" font-size="40" fill="white" font-weight="bold">50% OFF</text><text x="300" y="135" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.8)">Limited Time Offer</text><line x1="130" y1="155" x2="470" y2="155" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="6 3"/><text x="300" y="180" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.5)">Tap to reveal code</text>
        <animate attributeName="opacity" from="1" to="0" begin="cf04_coupon.click" dur="0.2s" fill="freeze"/>
      </g>
      <g opacity="0"><rect x="100" y="40" width="400" height="170" rx="10" fill="white" stroke="#e74c3c" stroke-width="2"/><text x="300" y="90" text-anchor="middle" font-size="12" fill="#e74c3c" font-weight="bold">YOUR EXCLUSIVE CODE</text><text x="300" y="130" text-anchor="middle" font-size="28" fill="#333" font-weight="bold" font-family="monospace">SAVE50NOW</text><line x1="130" y1="150" x2="470" y2="150" stroke="#eee" stroke-width="1" stroke-dasharray="6 3"/><text x="300" y="180" text-anchor="middle" font-size="10" fill="#999">Valid until 2025.12.31</text>
        <animate attributeName="opacity" from="0" to="1" begin="cf04_coupon.click+0.2s" dur="0.2s" fill="freeze"/>
      </g>
      <text x="300" y="250" text-anchor="middle" font-size="11" fill="#ccc">点击翻转查看优惠码</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'flip_business_05',
    name: '名片翻转',
    category: 'card_flip',
    tags: ['名片', '翻转', '商务', '联系'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-flip-business',
    svg: `<svg viewBox="0 0 600 280" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="cf05_clip"><rect width="600" height="280" rx="12"/></clipPath></defs>
  <g clip-path="url(#cf05_clip)">
    <rect width="600" height="280" fill="#ecf0f1"/>
    <g id="cf05_biz" style="cursor:pointer;">
      <g><rect x="120" y="40" width="360" height="180" rx="8" fill="#2c3e50"/><text x="300" y="100" text-anchor="middle" font-size="20" fill="white" font-weight="bold">ZHANG WEI</text><text x="300" y="125" text-anchor="middle" font-size="11" fill="#3498db">Senior Product Designer</text><line x1="220" y1="140" x2="380" y2="140" stroke="rgba(255,255,255,0.2)" stroke-width="1"/><text x="300" y="165" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.5)">Creative Studio Co.</text><text x="300" y="205" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.3)">flip for contact info</text>
        <animate attributeName="opacity" from="1" to="0" begin="cf05_biz.click" dur="0.2s" fill="freeze"/>
      </g>
      <g opacity="0"><rect x="120" y="40" width="360" height="180" rx="8" fill="white" stroke="#2c3e50" stroke-width="1"/><text x="300" y="85" text-anchor="middle" font-size="10" fill="#999">CONTACT</text><text x="300" y="115" text-anchor="middle" font-size="12" fill="#333">zhangwei@studio.com</text><text x="300" y="140" text-anchor="middle" font-size="12" fill="#333">+86 138 0000 8888</text><text x="300" y="165" text-anchor="middle" font-size="12" fill="#333">shanghai.studio.com</text><text x="300" y="200" text-anchor="middle" font-size="9" fill="#3498db">Shanghai, China</text>
        <animate attributeName="opacity" from="0" to="1" begin="cf05_biz.click+0.2s" dur="0.2s" fill="freeze"/>
      </g>
      <text x="300" y="260" text-anchor="middle" font-size="11" fill="#bbb">点击翻转名片</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'flip_recipe_06',
    name: '食谱翻转',
    category: 'card_flip',
    tags: ['食谱', '美食', '翻转', '步骤'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-flip-recipe',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="cf06_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#cf06_clip)">
    <rect width="600" height="300" fill="#fdf2e9"/>
    <g id="cf06_recipe" style="cursor:pointer;">
      <g><rect x="150" y="25" width="300" height="220" rx="12" fill="#f39c12"/><text x="300" y="90" text-anchor="middle" font-size="40" fill="white">🍰</text><text x="300" y="135" text-anchor="middle" font-size="18" fill="white" font-weight="bold">Tiramisu</text><text x="300" y="165" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.7)">Italian Classic Dessert</text><text x="300" y="195" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.5)">Prep: 30min | Serves: 6</text><text x="300" y="230" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.4)">tap for recipe</text>
        <animate attributeName="opacity" from="1" to="0" begin="cf06_recipe.click" dur="0.2s" fill="freeze"/>
      </g>
      <g opacity="0"><rect x="150" y="25" width="300" height="220" rx="12" fill="white" stroke="#f39c12" stroke-width="1.5"/><text x="300" y="60" text-anchor="middle" font-size="13" fill="#f39c12" font-weight="bold">INGREDIENTS</text><text x="300" y="85" text-anchor="middle" font-size="10" fill="#666">Mascarpone 500g</text><text x="300" y="105" text-anchor="middle" font-size="10" fill="#666">Espresso 200ml</text><text x="300" y="125" text-anchor="middle" font-size="10" fill="#666">Ladyfingers 24pcs</text><text x="300" y="145" text-anchor="middle" font-size="10" fill="#666">Cocoa Powder 30g</text><line x1="180" y1="160" x2="420" y2="160" stroke="#f5d5a5" stroke-width="1"/><text x="300" y="185" text-anchor="middle" font-size="10" fill="#999">Dip ladyfingers in espresso,</text><text x="300" y="205" text-anchor="middle" font-size="10" fill="#999">layer with mascarpone cream.</text><text x="300" y="230" text-anchor="middle" font-size="9" fill="#f39c12">Chill 4 hours before serving</text>
        <animate attributeName="opacity" from="0" to="1" begin="cf06_recipe.click+0.2s" dur="0.2s" fill="freeze"/>
      </g>
      <text x="300" y="280" text-anchor="middle" font-size="11" fill="#ccc">点击查看食谱</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 7. 滑动撤场 scroll_dismiss ====================
export const SVG_SCROLL_DISMISS = [
  {
    id: 'dismiss_swipe_01',
    name: '滑动消散',
    category: 'scroll_dismiss',
    tags: ['滑动', '消散', '离场', '渐隐'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-dismiss-swipe',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sd01_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#sd01_clip)">
    <rect width="600" height="300" fill="#f5f5f5"/>
    <g opacity="0"><rect x="100" y="50" width="400" height="180" rx="10" fill="#2ecc71"/><text x="300" y="150" text-anchor="middle" font-size="20" fill="white" font-weight="bold">NEW CONTENT</text><animate attributeName="opacity" from="0" to="1" begin="sd01_card.click+0.3s" dur="0.3s" fill="freeze"/></g>
    <g id="sd01_card" style="cursor:pointer;">
      <rect x="100" y="50" width="400" height="180" rx="10" fill="#e74c3c"/>
      <text x="300" y="130" text-anchor="middle" font-size="18" fill="white" font-weight="bold">SWIPE AWAY</text>
      <text x="300" y="160" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.6)">Click to dismiss this card</text>
      <animateTransform attributeName="transform" type="translate" from="0 0" to="600 0" begin="sd01_card.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      <animate attributeName="opacity" from="1" to="0" begin="sd01_card.click" dur="0.4s" fill="freeze"/>
    </g>
    <text x="300" y="270" text-anchor="middle" font-size="11" fill="#bbb">点击滑动消散</text>
  </g>
</svg>`
  },
  {
    id: 'dismiss_fade_02',
    name: '淡出撤场',
    category: 'scroll_dismiss',
    tags: ['淡出', '消失', '渐变', '撤场'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-dismiss-fade',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sd02_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#sd02_clip)">
    <rect width="600" height="300" fill="#0d1b2a"/>
    <g id="sd02_layers" style="cursor:pointer;">
      <g><rect x="80" y="40" width="180" height="180" rx="8" fill="#3498db" opacity="0.9"/><text x="170" y="140" text-anchor="middle" font-size="14" fill="white" font-weight="bold">CARD A</text><animate attributeName="opacity" from="0.9" to="0" begin="sd02_layers.click" dur="0.3s" fill="freeze"/></g>
      <g><rect x="210" y="40" width="180" height="180" rx="8" fill="#2980b9" opacity="0.9"/><text x="300" y="140" text-anchor="middle" font-size="14" fill="white" font-weight="bold">CARD B</text><animate attributeName="opacity" from="0.9" to="0" begin="sd02_layers.click+0.15s" dur="0.3s" fill="freeze"/></g>
      <g><rect x="340" y="40" width="180" height="180" rx="8" fill="#1a6fa0" opacity="0.9"/><text x="430" y="140" text-anchor="middle" font-size="14" fill="white" font-weight="bold">CARD C</text><animate attributeName="opacity" from="0.9" to="0" begin="sd02_layers.click+0.3s" dur="0.3s" fill="freeze"/></g>
    </g>
    <g opacity="0"><text x="300" y="145" text-anchor="middle" font-size="22" fill="#3498db" font-weight="bold">ALL CLEAR!</text><animate attributeName="opacity" from="0" to="1" begin="sd02_layers.click+0.5s" dur="0.3s" fill="freeze"/></g>
    <text x="300" y="270" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击逐层淡出</text>
  </g>
</svg>`
  },
  {
    id: 'dismiss_shrink_03',
    name: '缩小撤场',
    category: 'scroll_dismiss',
    tags: ['缩小', '收缩', '消失', '撤场'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-dismiss-shrink',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sd03_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#sd03_clip)">
    <rect width="600" height="300" fill="#1a1a2e"/>
    <g id="sd03_shrink" style="cursor:pointer;">
      <rect x="150" y="50" width="300" height="180" rx="12" fill="#9b59b6"/><text x="300" y="140" text-anchor="middle" font-size="18" fill="white" font-weight="bold">SHRINK ME</text><text x="300" y="170" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.5)">Click to shrink</text>
      <animateTransform attributeName="transform" type="scale" values="1;0.01" begin="sd03_shrink.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      <animate attributeName="opacity" from="1" to="0" begin="sd03_shrink.click+0.3s" dur="0.2s" fill="freeze"/>
    </g>
    <g opacity="0"><circle cx="300" cy="140" r="30" fill="#2ecc71"/><text x="300" y="147" text-anchor="middle" font-size="20" fill="white">✓</text><animate attributeName="opacity" from="0" to="1" begin="sd03_shrink.click+0.5s" dur="0.3s" fill="freeze"/></g>
    <text x="300" y="275" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击缩小消失</text>
  </g>
</svg>`
  },
  {
    id: 'dismiss_drop_04',
    name: '坠落撤场',
    category: 'scroll_dismiss',
    tags: ['坠落', '下落', '重力', '撤场'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-dismiss-drop',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sd04_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#sd04_clip)">
    <rect width="600" height="300" fill="#1a1510"/>
    <g id="sd04_drop" style="cursor:pointer;">
      <rect x="200" y="50" width="200" height="150" rx="10" fill="#e67e22"/>
      <text x="300" y="130" text-anchor="middle" font-size="16" fill="white" font-weight="bold">DROP IT</text>
      <animateTransform attributeName="transform" type="translate" from="0 0" to="0 300" begin="sd04_drop.click" dur="0.5s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.9 1"/>
      <animate attributeName="opacity" from="1" to="0" begin="sd04_drop.click+0.3s" dur="0.2s" fill="freeze"/>
    </g>
    <g opacity="0"><text x="300" y="140" text-anchor="middle" font-size="16" fill="#e67e22" font-weight="bold">DROPPED!</text><animate attributeName="opacity" from="0" to="1" begin="sd04_drop.click+0.4s" dur="0.3s" fill="freeze"/></g>
    <text x="300" y="270" text-anchor="middle" font-size="11" fill="rgba(230,126,34,0.4)">点击坠落撤场</text>
  </g>
</svg>`
  },
  {
    id: 'dismiss_explode_05',
    name: '爆裂撤场',
    category: 'scroll_dismiss',
    tags: ['爆裂', '炸开', '粒子', '撤场'],
    colorScheme: '#c0392b',
    interactive: true,
    interactionType: 'click-dismiss-explode',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sd05_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#sd05_clip)">
    <rect width="600" height="300" fill="#0a0a0a"/>
    <g id="sd05_boom" style="cursor:pointer;">
      <rect x="200" y="60" width="200" height="160" rx="10" fill="#c0392b"><animate attributeName="opacity" from="1" to="0" begin="sd05_boom.click" dur="0.2s" fill="freeze"/></rect>
      <text x="300" y="148" text-anchor="middle" font-size="16" fill="white" font-weight="bold"><animate attributeName="opacity" from="1" to="0" begin="sd05_boom.click" dur="0.1s" fill="freeze"/>BOOM!</text>
      <g opacity="0">
        <circle cx="220" cy="100" r="8" fill="#e74c3c"><animate attributeName="cx" from="300" to="150" begin="sd05_boom.click" dur="0.4s" fill="freeze"/><animate attributeName="cy" from="140" to="50" begin="sd05_boom.click" dur="0.4s" fill="freeze"/><animate attributeName="opacity" from="0" to="1" begin="sd05_boom.click" dur="0.1s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sd05_boom.click+0.3s" dur="0.2s" fill="freeze"/></circle>
        <circle cx="380" cy="80" r="6" fill="#f39c12"><animate attributeName="cx" from="300" to="420" begin="sd05_boom.click" dur="0.4s" fill="freeze"/><animate attributeName="cy" from="140" to="40" begin="sd05_boom.click" dur="0.4s" fill="freeze"/><animate attributeName="opacity" from="0" to="1" begin="sd05_boom.click" dur="0.1s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sd05_boom.click+0.3s" dur="0.2s" fill="freeze"/></circle>
        <circle cx="200" cy="220" r="7" fill="#e67e22"><animate attributeName="cx" from="300" to="170" begin="sd05_boom.click" dur="0.4s" fill="freeze"/><animate attributeName="cy" from="140" to="250" begin="sd05_boom.click" dur="0.4s" fill="freeze"/><animate attributeName="opacity" from="0" to="1" begin="sd05_boom.click" dur="0.1s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sd05_boom.click+0.3s" dur="0.2s" fill="freeze"/></circle>
        <circle cx="420" cy="200" r="5" fill="#c0392b"><animate attributeName="cx" from="300" to="450" begin="sd05_boom.click" dur="0.4s" fill="freeze"/><animate attributeName="cy" from="140" to="230" begin="sd05_boom.click" dur="0.4s" fill="freeze"/><animate attributeName="opacity" from="0" to="1" begin="sd05_boom.click" dur="0.1s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="sd05_boom.click+0.3s" dur="0.2s" fill="freeze"/></circle>
      </g>
    </g>
    <text x="300" y="270" text-anchor="middle" font-size="11" fill="rgba(192,57,43,0.4)">点击爆裂消散</text>
  </g>
</svg>`
  },
  {
    id: 'dismiss_flip_06',
    name: '翻转撤场',
    category: 'scroll_dismiss',
    tags: ['翻转', '旋转', '消失', '撤场'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-dismiss-flip',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="sd06_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#sd06_clip)">
    <rect width="600" height="300" fill="#ecf0f1"/>
    <g id="sd06_flip" style="cursor:pointer;">
      <rect x="175" y="50" width="250" height="180" rx="10" fill="#2c3e50"/>
      <text x="300" y="140" text-anchor="middle" font-size="16" fill="white" font-weight="bold">FLIP AWAY</text>
      <text x="300" y="170" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.4)">Click to flip dismiss</text>
      <animateTransform attributeName="transform" type="rotate" from="0 300 140" to="90 300 140" begin="sd06_flip.click" dur="0.3s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      <animate attributeName="opacity" from="1" to="0" begin="sd06_flip.click+0.2s" dur="0.15s" fill="freeze"/>
    </g>
    <g opacity="0"><text x="300" y="145" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">DISMISSED!</text><animate attributeName="opacity" from="0" to="1" begin="sd06_flip.click+0.3s" dur="0.3s" fill="freeze"/></g>
    <text x="300" y="270" text-anchor="middle" font-size="11" fill="#bbb">点击翻转撤场</text>
  </g>
</svg>`
  }
]

// ==================== 8. 明暗切换 dark_light ====================
export const SVG_DARK_LIGHT = [
  {
    id: 'darklight_scene_01',
    name: '日夜场景切换',
    category: 'dark_light',
    tags: ['日夜', '场景', '切换', '明暗'],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click-darklight-scene',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="dl01_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#dl01_clip)">
    <rect width="600" height="350" fill="#87ceeb"/>
    <g id="dl01_toggle" style="cursor:pointer;">
      <rect width="600" height="350" fill="#0a1628" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="dl01_toggle.click" dur="0.8s" fill="freeze"/></rect>
      <circle cx="480" cy="70" r="35" fill="#f1c40f"><animate attributeName="fill" from="#f1c40f" to="#ecf0f1" begin="dl01_toggle.click" dur="0.5s" fill="freeze"/><animate attributeName="r" from="35" to="25" begin="dl01_toggle.click" dur="0.5s" fill="freeze"/></circle>
      <g opacity="0"><circle cx="50" cy="50" r="1" fill="white"/><circle cx="150" cy="80" r="1.5" fill="white"/><circle cx="300" cy="40" r="1" fill="white"/><circle cx="400" cy="90" r="1.5" fill="white"/><circle cx="550" cy="60" r="1" fill="white"/><circle cx="200" cy="30" r="1" fill="white"/><animate attributeName="opacity" from="0" to="1" begin="dl01_toggle.click+0.3s" dur="0.5s" fill="freeze"/></g>
      <rect x="0" y="250" width="600" height="100" fill="#27ae60"><animate attributeName="fill" from="#27ae60" to="#0d1a0d" begin="dl01_toggle.click" dur="0.8s" fill="freeze"/></rect>
      <polygon points="100,250 140,180 180,250" fill="#2ecc71"><animate attributeName="fill" from="#2ecc71" to="#0a150a" begin="dl01_toggle.click" dur="0.8s" fill="freeze"/></polygon>
      <polygon points="350,250 400,160 450,250" fill="#27ae60"><animate attributeName="fill" from="#27ae60" to="#0d1a0d" begin="dl01_toggle.click" dur="0.8s" fill="freeze"/></polygon>
      <rect x="220" y="200" width="80" height="50" rx="2" fill="#e67e22"><animate attributeName="fill" from="#e67e22" to="#2c1a0a" begin="dl01_toggle.click" dur="0.8s" fill="freeze"/></rect>
      <rect x="235" y="210" width="15" height="15" fill="#f1c40f"><animate attributeName="fill" from="#f1c40f" to="#f1c40f" begin="dl01_toggle.click" dur="0.1s" fill="freeze"/></rect>
      <rect x="270" y="210" width="15" height="15" fill="#f1c40f"/>
      <text x="300" y="335" text-anchor="middle" font-size="11" fill="rgba(0,0,0,0.3)">点击切换日夜<animate attributeName="fill" from="rgba(0,0,0,0.3)" to="rgba(255,255,255,0.3)" begin="dl01_toggle.click" dur="0.5s" fill="freeze"/></text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'darklight_text_02',
    name: '文字明暗',
    category: 'dark_light',
    tags: ['文字', '明暗', '主题', '对比'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-darklight-text',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="dl02_clip"><rect width="600" height="250" rx="12"/></clipPath></defs>
  <g clip-path="url(#dl02_clip)">
    <rect width="600" height="250" fill="white"/>
    <g id="dl02_text" style="cursor:pointer;">
      <rect width="600" height="250" fill="#1a1a1a" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="dl02_text.click" dur="0.5s" fill="freeze"/></rect>
      <text x="300" y="80" text-anchor="middle" font-size="28" fill="#2c3e50" font-weight="bold">LIGHT MODE<animate attributeName="fill" from="#2c3e50" to="#ecf0f1" begin="dl02_text.click" dur="0.5s" fill="freeze"/></text>
      <text x="300" y="120" text-anchor="middle" font-size="14" fill="#666">Comfortable for daytime reading<animate attributeName="fill" from="#666" to="#999" begin="dl02_text.click" dur="0.5s" fill="freeze"/></text>
      <rect x="200" y="140" width="200" height="40" rx="20" fill="#2c3e50"><animate attributeName="fill" from="#2c3e50" to="#ecf0f1" begin="dl02_text.click" dur="0.5s" fill="freeze"/></rect>
      <circle cx="230" cy="160" r="14" fill="white"><animate attributeName="cx" from="230" to="370" begin="dl02_text.click" dur="0.4s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="fill" from="white" to="#1a1a1a" begin="dl02_text.click" dur="0.5s" fill="freeze"/></circle>
      <text x="300" y="225" text-anchor="middle" font-size="11" fill="#bbb">点击切换主题</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'darklight_card_03',
    name: '卡片明暗',
    category: 'dark_light',
    tags: ['卡片', '主题', '切换', '模式'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-darklight-card',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="dl03_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#dl03_clip)">
    <rect width="600" height="300" fill="#f5f5f5"/>
    <g id="dl03_card" style="cursor:pointer;">
      <rect width="600" height="300" fill="#0d1117" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="dl03_card.click" dur="0.5s" fill="freeze"/></rect>
      <rect x="50" y="30" width="230" height="210" rx="10" fill="white" stroke="#eee" stroke-width="1"><animate attributeName="fill" from="white" to="#1a1a2e" begin="dl03_card.click" dur="0.5s" fill="freeze"/><animate attributeName="stroke" from="#eee" to="#2c2c4e" begin="dl03_card.click" dur="0.5s" fill="freeze"/></rect>
      <rect x="70" y="50" width="190" height="100" rx="6" fill="#3498db"/>
      <text x="165" y="180" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">Article Title<animate attributeName="fill" from="#333" to="#ecf0f1" begin="dl03_card.click" dur="0.5s" fill="freeze"/></text>
      <text x="165" y="205" text-anchor="middle" font-size="10" fill="#999">2025.03.19<animate attributeName="fill" from="#999" to="#555" begin="dl03_card.click" dur="0.5s" fill="freeze"/></text>
      <rect x="320" y="30" width="230" height="210" rx="10" fill="white" stroke="#eee" stroke-width="1"><animate attributeName="fill" from="white" to="#1a1a2e" begin="dl03_card.click" dur="0.5s" fill="freeze"/><animate attributeName="stroke" from="#eee" to="#2c2c4e" begin="dl03_card.click" dur="0.5s" fill="freeze"/></rect>
      <rect x="340" y="50" width="190" height="100" rx="6" fill="#e74c3c"/>
      <text x="435" y="180" text-anchor="middle" font-size="13" fill="#333" font-weight="bold">Featured Post<animate attributeName="fill" from="#333" to="#ecf0f1" begin="dl03_card.click" dur="0.5s" fill="freeze"/></text>
      <text x="435" y="205" text-anchor="middle" font-size="10" fill="#999">Trending Now<animate attributeName="fill" from="#999" to="#555" begin="dl03_card.click" dur="0.5s" fill="freeze"/></text>
      <text x="300" y="280" text-anchor="middle" font-size="11" fill="#bbb">点击暗色模式</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'darklight_icon_04',
    name: '图标明暗',
    category: 'dark_light',
    tags: ['图标', '切换', '日月', '动画'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-darklight-icon',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="dl04_clip"><rect width="600" height="250" rx="12"/></clipPath></defs>
  <g clip-path="url(#dl04_clip)">
    <rect width="600" height="250" fill="#ffeaa7"/>
    <g id="dl04_icon" style="cursor:pointer;">
      <rect width="600" height="250" fill="#2d3436" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="dl04_icon.click" dur="0.6s" fill="freeze"/></rect>
      <circle cx="300" cy="100" r="40" fill="#f39c12"><animate attributeName="fill" from="#f39c12" to="#dfe6e9" begin="dl04_icon.click" dur="0.5s" fill="freeze"/><animate attributeName="r" from="40" to="30" begin="dl04_icon.click" dur="0.5s" fill="freeze"/></circle>
      <circle cx="300" cy="100" r="0" fill="#2d3436"><animate attributeName="r" from="0" to="15" begin="dl04_icon.click" dur="0.5s" fill="freeze"/><animate attributeName="cx" from="300" to="312" begin="dl04_icon.click" dur="0.5s" fill="freeze"/><animate attributeName="cy" from="100" to="90" begin="dl04_icon.click" dur="0.5s" fill="freeze"/></circle>
      <g><line x1="300" y1="40" x2="300" y2="25" stroke="#f39c12" stroke-width="3" stroke-linecap="round"/><line x1="340" y1="60" x2="350" y2="48" stroke="#f39c12" stroke-width="3" stroke-linecap="round"/><line x1="260" y1="60" x2="250" y2="48" stroke="#f39c12" stroke-width="3" stroke-linecap="round"/><line x1="355" y1="100" x2="370" y2="100" stroke="#f39c12" stroke-width="3" stroke-linecap="round"/><line x1="245" y1="100" x2="230" y2="100" stroke="#f39c12" stroke-width="3" stroke-linecap="round"/><animate attributeName="opacity" from="1" to="0" begin="dl04_icon.click" dur="0.3s" fill="freeze"/></g>
      <text x="300" y="175" text-anchor="middle" font-size="14" fill="#2d3436" font-weight="bold">LIGHT<animate attributeName="fill" from="#2d3436" to="#dfe6e9" begin="dl04_icon.click" dur="0.5s" fill="freeze"/></text>
      <text x="300" y="225" text-anchor="middle" font-size="11" fill="rgba(0,0,0,0.3)">点击切换日月<animate attributeName="fill" from="rgba(0,0,0,0.3)" to="rgba(255,255,255,0.3)" begin="dl04_icon.click" dur="0.5s" fill="freeze"/></text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'darklight_split_05',
    name: '分屏明暗',
    category: 'dark_light',
    tags: ['分屏', '对比', '左右', '明暗'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-darklight-split',
    svg: `<svg viewBox="0 0 600 280" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="dl05_clip"><rect width="600" height="280" rx="12"/></clipPath></defs>
  <g clip-path="url(#dl05_clip)">
    <rect width="600" height="280" fill="#ecf0f1"/>
    <g id="dl05_split" style="cursor:pointer;">
      <rect x="0" y="0" width="300" height="280" fill="#0d1117" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="dl05_split.click" dur="0.5s" fill="freeze"/></rect>
      <text x="150" y="120" text-anchor="middle" font-size="18" fill="#2c3e50" font-weight="bold">LIGHT<animate attributeName="fill" from="#2c3e50" to="#ecf0f1" begin="dl05_split.click" dur="0.5s" fill="freeze"/></text>
      <text x="150" y="155" text-anchor="middle" font-size="11" fill="#999">Comfortable<animate attributeName="fill" from="#999" to="#555" begin="dl05_split.click" dur="0.5s" fill="freeze"/></text>
      <text x="450" y="120" text-anchor="middle" font-size="18" fill="#2c3e50" font-weight="bold">DARK</text>
      <text x="450" y="155" text-anchor="middle" font-size="11" fill="#999">Focused</text>
      <line x1="300" y1="30" x2="300" y2="250" stroke="#ddd" stroke-width="1"><animate attributeName="stroke" from="#ddd" to="#333" begin="dl05_split.click" dur="0.5s" fill="freeze"/></line>
      <text x="300" y="260" text-anchor="middle" font-size="11" fill="#bbb">点击左侧变暗</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'darklight_gradient_06',
    name: '渐变明暗过渡',
    category: 'dark_light',
    tags: ['渐变', '过渡', '平滑', '明暗'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-darklight-gradient',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="dl06_clip"><rect width="600" height="250" rx="12"/></clipPath><linearGradient id="dl06_grad" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#f5f5f5"><animate attributeName="stop-color" from="#f5f5f5" to="#0a0a0a" begin="dl06_grad_btn.click" dur="0.8s" fill="freeze"/></stop><stop offset="100%" stop-color="#ecf0f1"><animate attributeName="stop-color" from="#ecf0f1" to="#1a1a2e" begin="dl06_grad_btn.click" dur="0.8s" fill="freeze"/></stop></linearGradient></defs>
  <g clip-path="url(#dl06_clip)">
    <rect width="600" height="250" fill="url(#dl06_grad)"/>
    <g id="dl06_grad_btn" style="cursor:pointer;">
      <text x="300" y="100" text-anchor="middle" font-size="24" fill="#333" font-weight="bold">GRADIENT SHIFT<animate attributeName="fill" from="#333" to="#ecf0f1" begin="dl06_grad_btn.click" dur="0.8s" fill="freeze"/></text>
      <text x="300" y="135" text-anchor="middle" font-size="12" fill="#888">Smooth transition between modes<animate attributeName="fill" from="#888" to="#666" begin="dl06_grad_btn.click" dur="0.8s" fill="freeze"/></text>
      <rect x="250" y="155" width="100" height="30" rx="15" fill="#e74c3c"/><text x="300" y="175" text-anchor="middle" font-size="10" fill="white">SWITCH</text>
      <text x="300" y="225" text-anchor="middle" font-size="11" fill="#bbb">点击渐变过渡<animate attributeName="fill" from="#bbb" to="#555" begin="dl06_grad_btn.click" dur="0.8s" fill="freeze"/></text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 9. 自动影院 auto_cinema ====================
export const SVG_AUTO_CINEMA = [
  {
    id: 'cinema_intro_01',
    name: '开场字幕',
    category: 'auto_cinema',
    tags: ['开场', '字幕', '电影', '影院'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-cinema-intro',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ac01_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ac01_clip)">
    <rect width="600" height="300" fill="#000"/>
    <g id="ac01_play" style="cursor:pointer;">
      <rect x="0" y="0" width="600" height="15" fill="#1a1a1a"/><rect x="0" y="285" width="600" height="15" fill="#1a1a1a"/>
      <text x="300" y="100" text-anchor="middle" font-size="10" fill="#e74c3c" opacity="0" letter-spacing="8">A PRODUCTION BY<animate attributeName="opacity" from="0" to="1" begin="ac01_play.click" dur="0.5s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ac01_play.click+2s" dur="0.5s" fill="freeze"/></text>
      <text x="300" y="150" text-anchor="middle" font-size="32" fill="white" opacity="0" font-weight="bold">THE STORY<animate attributeName="opacity" from="0" to="1" begin="ac01_play.click+0.5s" dur="0.5s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ac01_play.click+2s" dur="0.5s" fill="freeze"/></text>
      <text x="300" y="185" text-anchor="middle" font-size="12" fill="#888" opacity="0">begins with a single moment<animate attributeName="opacity" from="0" to="1" begin="ac01_play.click+1s" dur="0.5s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="ac01_play.click+2s" dur="0.5s" fill="freeze"/></text>
      <text x="300" y="160" text-anchor="middle" font-size="18" fill="white" opacity="0" font-weight="bold">CHAPTER ONE<animate attributeName="opacity" from="0" to="1" begin="ac01_play.click+2.5s" dur="0.5s" fill="freeze"/></text>
      <polygon points="290,245 290,265 310,255" fill="rgba(255,255,255,0.3)"/><text x="300" y="285" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.3)">click to play</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'cinema_credits_02',
    name: '滚动字幕',
    category: 'auto_cinema',
    tags: ['滚动', '字幕', '致谢', '片尾'],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click-cinema-credits',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ac02_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ac02_clip)">
    <rect width="600" height="300" fill="#000"/>
    <g id="ac02_credits" style="cursor:pointer;">
      <g>
        <text x="300" y="320" text-anchor="middle" font-size="10" fill="#f1c40f" letter-spacing="4">DIRECTED BY</text>
        <text x="300" y="350" text-anchor="middle" font-size="16" fill="white">Zhang Wei</text>
        <text x="300" y="400" text-anchor="middle" font-size="10" fill="#f1c40f" letter-spacing="4">PRODUCED BY</text>
        <text x="300" y="430" text-anchor="middle" font-size="16" fill="white">Li Ming</text>
        <text x="300" y="480" text-anchor="middle" font-size="10" fill="#f1c40f" letter-spacing="4">SPECIAL THANKS</text>
        <text x="300" y="510" text-anchor="middle" font-size="14" fill="white">Our Amazing Team</text>
        <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -300" begin="ac02_credits.click" dur="4s" fill="freeze"/>
      </g>
      <text x="300" y="280" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.3)">click for credits roll</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'cinema_countdown_03',
    name: '影院倒计时',
    category: 'auto_cinema',
    tags: ['倒计时', '影院', '开场', '数字'],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-cinema-countdown',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ac03_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ac03_clip)">
    <rect width="600" height="300" fill="#0a0a0a"/>
    <g id="ac03_count" style="cursor:pointer;">
      <circle cx="300" cy="140" r="60" fill="none" stroke="#333" stroke-width="2"/><circle cx="300" cy="140" r="60" fill="none" stroke="white" stroke-width="2" stroke-dasharray="377" stroke-dashoffset="0"><animate attributeName="stroke-dashoffset" from="0" to="377" begin="ac03_count.click" dur="3s" fill="freeze"/></circle>
      <text x="300" y="160" text-anchor="middle" font-size="60" fill="white" font-weight="bold">3<animate attributeName="opacity" values="1;0" dur="0.5s" begin="ac03_count.click+0.8s" fill="freeze"/></text>
      <text x="300" y="160" text-anchor="middle" font-size="60" fill="white" font-weight="bold" opacity="0">2<animate attributeName="opacity" values="0;1;0" dur="1s" begin="ac03_count.click+1s" fill="freeze"/></text>
      <text x="300" y="160" text-anchor="middle" font-size="60" fill="white" font-weight="bold" opacity="0">1<animate attributeName="opacity" values="0;1;0" dur="1s" begin="ac03_count.click+2s" fill="freeze"/></text>
      <text x="300" y="155" text-anchor="middle" font-size="24" fill="#e74c3c" font-weight="bold" opacity="0">ACTION!<animate attributeName="opacity" from="0" to="1" begin="ac03_count.click+3s" dur="0.3s" fill="freeze"/></text>
      <text x="300" y="270" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.3)">click to start countdown</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'cinema_scene_04',
    name: '场景切换',
    category: 'auto_cinema',
    tags: ['场景', '切换', '淡入', '电影'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-cinema-scene',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ac04_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ac04_clip)">
    <rect width="600" height="300" fill="#000"/>
    <g id="ac04_scene" style="cursor:pointer;">
      <g opacity="1"><rect width="600" height="300" fill="#1abc9c"/><text x="300" y="140" text-anchor="middle" font-size="22" fill="white" font-weight="bold">SCENE 1</text><text x="300" y="170" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.6)">The Beginning</text><animate attributeName="opacity" values="1;0" dur="0.5s" begin="ac04_scene.click+1s" fill="freeze"/></g>
      <g opacity="0"><rect width="600" height="300" fill="#e74c3c"/><text x="300" y="140" text-anchor="middle" font-size="22" fill="white" font-weight="bold">SCENE 2</text><text x="300" y="170" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.6)">The Conflict</text><animate attributeName="opacity" values="0;1;1;0" dur="2s" begin="ac04_scene.click+1.5s" fill="freeze"/></g>
      <g opacity="0"><rect width="600" height="300" fill="#8e44ad"/><text x="300" y="140" text-anchor="middle" font-size="22" fill="white" font-weight="bold">SCENE 3</text><text x="300" y="170" text-anchor="middle" font-size="12" fill="rgba(255,255,255,0.6)">The Resolution</text><animate attributeName="opacity" from="0" to="1" begin="ac04_scene.click+3.5s" dur="0.5s" fill="freeze"/></g>
      <text x="300" y="270" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.3)">click to play scenes</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'cinema_spotlight_05',
    name: '聚光灯开场',
    category: 'auto_cinema',
    tags: ['聚光灯', '开场', '舞台', '焦点'],
    colorScheme: '#f39c12',
    interactive: true,
    interactionType: 'click-cinema-spotlight',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ac05_clip"><rect width="600" height="300" rx="12"/></clipPath><radialGradient id="ac05_spot" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(243,156,18,0.4)"/><stop offset="100%" stop-color="rgba(243,156,18,0)"/></radialGradient></defs>
  <g clip-path="url(#ac05_clip)">
    <rect width="600" height="300" fill="#000"/>
    <g id="ac05_spot" style="cursor:pointer;">
      <circle cx="300" cy="140" r="0" fill="url(#ac05_spot)"><animate attributeName="r" from="0" to="200" begin="ac05_spot.click" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></circle>
      <text x="300" y="130" text-anchor="middle" font-size="28" fill="white" font-weight="bold" opacity="0">SPOTLIGHT<animate attributeName="opacity" from="0" to="1" begin="ac05_spot.click+0.5s" dur="0.3s" fill="freeze"/></text>
      <text x="300" y="160" text-anchor="middle" font-size="12" fill="#f39c12" opacity="0">On You<animate attributeName="opacity" from="0" to="1" begin="ac05_spot.click+0.8s" dur="0.3s" fill="freeze"/></text>
      <text x="300" y="270" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.3)">click for spotlight</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'cinema_curtain_06',
    name: '幕布拉开',
    category: 'auto_cinema',
    tags: ['幕布', '拉开', '舞台', '剧院'],
    colorScheme: '#c0392b',
    interactive: true,
    interactionType: 'click-cinema-curtain',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="ac06_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#ac06_clip)">
    <rect width="600" height="300" fill="#1a0a0a"/>
    <rect x="0" y="0" width="600" height="20" fill="#8b0000"/>
    <text x="300" y="160" text-anchor="middle" font-size="20" fill="rgba(255,255,255,0.5)" font-weight="bold">THE SHOW</text>
    <g id="ac06_curtain" style="cursor:pointer;">
      <rect x="0" y="20" width="300" height="280" fill="#c0392b"><animate attributeName="width" from="300" to="50" begin="ac06_curtain.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <rect x="300" y="20" width="300" height="280" fill="#c0392b"><animate attributeName="x" from="300" to="550" begin="ac06_curtain.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/><animate attributeName="width" from="300" to="50" begin="ac06_curtain.click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect>
      <text x="300" y="280" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.4)">click to open curtains</text>
    </g>
  </g>
</svg>`
  }
]

// ==================== 10. 浮层热区 float_hotzone ====================
export const SVG_FLOAT_HOTZONE = [
  {
    id: 'float_bubble_01',
    name: '气泡浮层',
    category: 'float_hotzone',
    tags: ['气泡', '浮层', '扩展', '信息'],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-float-bubble',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fh01_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#fh01_clip)">
    <rect width="600" height="350" fill="#0d1b2a"/>
    <g id="fh01_b1" style="cursor:pointer;">
      <circle cx="150" cy="140" r="30" fill="#3498db" opacity="0.7"><animate attributeName="r" values="30;33;30" dur="2s" repeatCount="indefinite"/></circle><text x="150" y="147" text-anchor="middle" font-size="12" fill="white" font-weight="bold">01</text>
      <g opacity="0"><rect x="80" y="180" width="140" height="60" rx="8" fill="rgba(52,152,219,0.9)"/><text x="150" y="207" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Design</text><text x="150" y="225" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.7)">Creative solutions</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh01_b1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh01_b2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh01_b3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="fh01_b2" style="cursor:pointer;">
      <circle cx="300" cy="100" r="35" fill="#e74c3c" opacity="0.7"><animate attributeName="r" values="35;38;35" dur="2.5s" repeatCount="indefinite"/></circle><text x="300" y="107" text-anchor="middle" font-size="12" fill="white" font-weight="bold">02</text>
      <g opacity="0"><rect x="230" y="145" width="140" height="60" rx="8" fill="rgba(231,76,60,0.9)"/><text x="300" y="172" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Develop</text><text x="300" y="190" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.7)">Building features</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh01_b2.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh01_b1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh01_b3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="fh01_b3" style="cursor:pointer;">
      <circle cx="450" cy="160" r="28" fill="#2ecc71" opacity="0.7"><animate attributeName="r" values="28;31;28" dur="1.8s" repeatCount="indefinite"/></circle><text x="450" y="167" text-anchor="middle" font-size="12" fill="white" font-weight="bold">03</text>
      <g opacity="0"><rect x="380" y="200" width="140" height="60" rx="8" fill="rgba(46,204,113,0.9)"/><text x="450" y="227" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Deploy</text><text x="450" y="245" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.7)">Ship to production</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh01_b3.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh01_b1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh01_b2.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <text x="300" y="330" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击气泡查看详情</text>
  </g>
</svg>`
  },
  {
    id: 'float_tag_02',
    name: '标签浮层',
    category: 'float_hotzone',
    tags: ['标签', '浮层', '标注', '热区'],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-float-tag',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fh02_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#fh02_clip)">
    <rect width="600" height="300" fill="#f5f5f5"/>
    <rect x="100" y="30" width="400" height="220" rx="8" fill="#ddd"/>
    <text x="300" y="150" text-anchor="middle" font-size="16" fill="#bbb">PRODUCT IMAGE</text>
    <g id="fh02_t1" style="cursor:pointer;">
      <circle cx="200" cy="100" r="8" fill="#e74c3c"><animate attributeName="r" values="8;10;8" dur="1.5s" repeatCount="indefinite"/></circle>
      <g opacity="0"><rect x="130" y="115" width="140" height="35" rx="6" fill="#e74c3c"/><text x="200" y="137" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Premium Material</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh02_t1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh02_t2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh02_t3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="fh02_t2" style="cursor:pointer;">
      <circle cx="350" cy="80" r="8" fill="#3498db"><animate attributeName="r" values="8;10;8" dur="1.5s" repeatCount="indefinite"/></circle>
      <g opacity="0"><rect x="280" y="95" width="140" height="35" rx="6" fill="#3498db"/><text x="350" y="117" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Smart Feature</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh02_t2.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh02_t1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh02_t3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="fh02_t3" style="cursor:pointer;">
      <circle cx="400" cy="180" r="8" fill="#2ecc71"><animate attributeName="r" values="8;10;8" dur="1.5s" repeatCount="indefinite"/></circle>
      <g opacity="0"><rect x="330" y="195" width="140" height="35" rx="6" fill="#2ecc71"/><text x="400" y="217" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Eco Friendly</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh02_t3.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh02_t1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh02_t2.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <text x="300" y="280" text-anchor="middle" font-size="11" fill="#bbb">点击标记查看产品特性</text>
  </g>
</svg>`
  },
  {
    id: 'float_pulse_03',
    name: '脉冲浮层',
    category: 'float_hotzone',
    tags: ['脉冲', '波纹', '扩散', '热区'],
    colorScheme: '#9b59b6',
    interactive: true,
    interactionType: 'click-float-pulse',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fh03_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#fh03_clip)">
    <rect width="600" height="300" fill="#1a1a2e"/>
    <g id="fh03_p1" style="cursor:pointer;">
      <circle cx="200" cy="130" r="20" fill="none" stroke="#9b59b6" stroke-width="1" opacity="0.3"><animate attributeName="r" values="20;35;20" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/></circle>
      <circle cx="200" cy="130" r="10" fill="#9b59b6"/>
      <g opacity="0"><rect x="130" y="160" width="140" height="50" rx="8" fill="rgba(155,89,182,0.9)"/><text x="200" y="182" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Node Alpha</text><text x="200" y="200" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.7)">Active · 42ms</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh03_p1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh03_p2.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="fh03_p2" style="cursor:pointer;">
      <circle cx="400" cy="130" r="20" fill="none" stroke="#e74c3c" stroke-width="1" opacity="0.3"><animate attributeName="r" values="20;35;20" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/></circle>
      <circle cx="400" cy="130" r="10" fill="#e74c3c"/>
      <g opacity="0"><rect x="330" y="160" width="140" height="50" rx="8" fill="rgba(231,76,60,0.9)"/><text x="400" y="182" text-anchor="middle" font-size="11" fill="white" font-weight="bold">Node Beta</text><text x="400" y="200" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.7)">Warning · 128ms</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh03_p2.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh03_p1.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <line x1="210" y1="130" x2="390" y2="130" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="4 2"/>
    <text x="300" y="270" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击节点查看状态</text>
  </g>
</svg>`
  },
  {
    id: 'float_orbit_04',
    name: '轨道浮层',
    category: 'float_hotzone',
    tags: ['轨道', '环绕', '行星', '浮层'],
    colorScheme: '#1abc9c',
    interactive: true,
    interactionType: 'click-float-orbit',
    svg: `<svg viewBox="0 0 600 350" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fh04_clip"><rect width="600" height="350" rx="12"/></clipPath></defs>
  <g clip-path="url(#fh04_clip)">
    <rect width="600" height="350" fill="#0a0a1a"/>
    <circle cx="300" cy="170" r="100" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    <circle cx="300" cy="170" r="30" fill="#1abc9c" opacity="0.8"/><text x="300" y="177" text-anchor="middle" font-size="12" fill="white" font-weight="bold">CORE</text>
    <g id="fh04_o1" style="cursor:pointer;">
      <circle cx="200" cy="170" r="15" fill="#e74c3c"><animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/></circle>
      <g opacity="0"><rect x="130" y="195" width="140" height="45" rx="6" fill="rgba(231,76,60,0.9)"/><text x="200" y="215" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Service A</text><text x="200" y="232" text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.6)">Running · 3 instances</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh04_o1.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh04_o2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh04_o3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="fh04_o2" style="cursor:pointer;">
      <circle cx="350" cy="80" r="15" fill="#f39c12"><animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/></circle>
      <g opacity="0"><rect x="280" y="100" width="140" height="45" rx="6" fill="rgba(243,156,18,0.9)"/><text x="350" y="120" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Service B</text><text x="350" y="137" text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.6)">Scaling · 5 instances</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh04_o2.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh04_o1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh04_o3.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <g id="fh04_o3" style="cursor:pointer;">
      <circle cx="380" cy="250" r="15" fill="#3498db"><animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/></circle>
      <g opacity="0"><rect x="310" y="270" width="140" height="45" rx="6" fill="rgba(52,152,219,0.9)"/><text x="380" y="290" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Service C</text><text x="380" y="307" text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.6)">Idle · 1 instance</text>
        <animate attributeName="opacity" from="0" to="1" begin="fh04_o3.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh04_o1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh04_o2.click" dur="0.2s" fill="freeze"/>
      </g>
    </g>
    <text x="300" y="340" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击卫星节点查看</text>
  </g>
</svg>`
  },
  {
    id: 'float_menu_05',
    name: '浮动菜单',
    category: 'float_hotzone',
    tags: ['菜单', '浮动', '弹出', '导航'],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click-float-menu',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fh05_clip"><rect width="600" height="300" rx="12"/></clipPath></defs>
  <g clip-path="url(#fh05_clip)">
    <rect width="600" height="300" fill="#2c3e50"/>
    <g id="fh05_menu" style="cursor:pointer;">
      <circle cx="300" cy="150" r="25" fill="#e67e22"/><text x="300" y="155" text-anchor="middle" font-size="20" fill="white">+</text>
      <g opacity="0"><circle cx="220" cy="90" r="20" fill="#e74c3c"/><text x="220" y="96" text-anchor="middle" font-size="10" fill="white">Home</text><animateTransform attributeName="transform" type="translate" from="80 60" to="0 0" begin="fh05_menu.click" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="0" to="1" begin="fh05_menu.click" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><circle cx="380" cy="90" r="20" fill="#3498db"/><text x="380" y="96" text-anchor="middle" font-size="10" fill="white">Blog</text><animateTransform attributeName="transform" type="translate" from="-80 60" to="0 0" begin="fh05_menu.click+0.1s" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="0" to="1" begin="fh05_menu.click+0.1s" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><circle cx="220" cy="210" r="20" fill="#2ecc71"/><text x="220" y="216" text-anchor="middle" font-size="10" fill="white">Shop</text><animateTransform attributeName="transform" type="translate" from="80 -60" to="0 0" begin="fh05_menu.click+0.2s" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="0" to="1" begin="fh05_menu.click+0.2s" dur="0.3s" fill="freeze"/></g>
      <g opacity="0"><circle cx="380" cy="210" r="20" fill="#9b59b6"/><text x="380" y="216" text-anchor="middle" font-size="10" fill="white">More</text><animateTransform attributeName="transform" type="translate" from="-80 -60" to="0 0" begin="fh05_menu.click+0.3s" dur="0.3s" fill="freeze"/><animate attributeName="opacity" from="0" to="1" begin="fh05_menu.click+0.3s" dur="0.3s" fill="freeze"/></g>
      <text x="300" y="280" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.3)">点击展开浮动菜单</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'float_tooltip_06',
    name: '工具提示浮层',
    category: 'float_hotzone',
    tags: ['提示', '工具', '悬浮', '信息'],
    colorScheme: '#34495e',
    interactive: true,
    interactionType: 'click-float-tooltip',
    svg: `<svg viewBox="0 0 600 280" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="fh06_clip"><rect width="600" height="280" rx="12"/></clipPath></defs>
  <g clip-path="url(#fh06_clip)">
    <rect width="600" height="280" fill="#ecf0f1"/>
    <rect x="50" y="30" width="500" height="190" rx="8" fill="white" stroke="#ddd" stroke-width="1"/>
    <text x="300" y="80" text-anchor="middle" font-size="16" fill="#2c3e50" font-weight="bold">Interactive Dashboard</text>
    <g id="fh06_i1" style="cursor:pointer;">
      <circle cx="180" cy="140" r="12" fill="#34495e"/><text x="180" y="145" text-anchor="middle" font-size="10" fill="white">i</text>
      <g opacity="0"><rect x="120" y="100" width="120" height="30" rx="6" fill="#34495e"/><text x="180" y="120" text-anchor="middle" font-size="9" fill="white">Users: 12,450</text><polygon points="175,130 185,130 180,138" fill="#34495e"/>
        <animate attributeName="opacity" from="0" to="1" begin="fh06_i1.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh06_i2.click" dur="0.15s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh06_i3.click" dur="0.15s" fill="freeze"/>
      </g>
    </g>
    <g id="fh06_i2" style="cursor:pointer;">
      <circle cx="300" cy="140" r="12" fill="#3498db"/><text x="300" y="145" text-anchor="middle" font-size="10" fill="white">i</text>
      <g opacity="0"><rect x="240" y="100" width="120" height="30" rx="6" fill="#3498db"/><text x="300" y="120" text-anchor="middle" font-size="9" fill="white">Revenue: $45K</text><polygon points="295,130 305,130 300,138" fill="#3498db"/>
        <animate attributeName="opacity" from="0" to="1" begin="fh06_i2.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh06_i1.click" dur="0.15s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh06_i3.click" dur="0.15s" fill="freeze"/>
      </g>
    </g>
    <g id="fh06_i3" style="cursor:pointer;">
      <circle cx="420" cy="140" r="12" fill="#27ae60"/><text x="420" y="145" text-anchor="middle" font-size="10" fill="white">i</text>
      <g opacity="0"><rect x="360" y="100" width="120" height="30" rx="6" fill="#27ae60"/><text x="420" y="120" text-anchor="middle" font-size="9" fill="white">Growth: +23%</text><polygon points="415,130 425,130 420,138" fill="#27ae60"/>
        <animate attributeName="opacity" from="0" to="1" begin="fh06_i3.click" dur="0.2s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh06_i1.click" dur="0.15s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin="fh06_i2.click" dur="0.15s" fill="freeze"/>
      </g>
    </g>
    <text x="300" y="255" text-anchor="middle" font-size="11" fill="#bbb">点击 i 图标查看提示</text>
  </g>
</svg>`
  }
]
