/**
 * SVG 装饰模板库
 * 提供 27 大类 SVG 装饰与交互模板，用于微信公众号文章排版
 * 所有 SVG 均为内联格式，兼容微信 WebView
 *
 * 分类:
 * 1. borders    - 装饰边框/画框
 * 2. dividers   - 分隔线/分割线
 * 3. badges     - 徽章/标签/印章
 * 4. patterns   - 背景纹理图案
 * 5. icons      - 装饰性插图
 * 6. seasonal   - 节日/季节元素
 * 7. text_deco  - 文字装饰(引号/高亮/气泡)
 * 8. waves      - 波浪与有机形状
 * 9. progress   - 进度与时间线
 * 10. callouts  - 提示框与信息面板
 * 11. dataviz   - 数据可视化装饰
 * 12. arrows    - 箭头与连接器
 * 13. gradients - 渐变背景
 * 14. chinese   - 中国风文化
 * 15. sketch    - 手绘涂鸦
 * 16. cards     - 社交卡片
 * 17. editorial - 编辑排版
 * 18. botanical - 自然植物
 * 19. tech      - 科技代码
 * 20. music     - 音乐音频
 * 21. lifestyle - 生活方式
 * === 交互式 SMIL 动画模板 (微信公众号黑科技) ===
 * 22. expand    - 点击展开 (智族GQ风格)
 * 23. switch    - 点击切换
 * 24. animate   - 自动动画
 * 25. parallax  - 视差滚动
 * 26. game      - 互动游戏
 * 27. deco_anim - 动效装饰
 */

// =============================================
// 1. 装饰边框 (Borders & Frames)
// =============================================
export const SVG_BORDERS = [
  {
    id: 'border_gold_corner',
    name: '金色角框',
    category: 'borders',
    tags: ['经典', '奢华', '金色'],
    colorScheme: '#D4AF37',
    svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <path d="M10 30Q10 10 30 10L55 10" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
  <path d="M245 10L270 10Q290 10 290 30L290 50" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
  <path d="M10 170L10 150Q10 190 30 190L55 190" stroke="#D4AF37" stroke-width="2.5" fill="none" />
  <path d="M245 190L270 190Q290 190 290 170L290 150" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
  <circle cx="30" cy="30" r="3" fill="#D4AF37"/><circle cx="270" cy="30" r="3" fill="#D4AF37"/>
  <circle cx="30" cy="170" r="3" fill="#D4AF37"/><circle cx="270" cy="170" r="3" fill="#D4AF37"/>
</svg>`
  },
  {
    id: 'border_modern_geo',
    name: '现代几何框',
    category: 'borders',
    tags: ['现代', '几何', '紫色'],
    colorScheme: '#667EEA',
    svg: `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <rect x="8" y="8" width="284" height="164" fill="none" stroke="#667EEA" stroke-width="3" rx="12"/>
  <line x1="20" y1="20" x2="60" y2="20" stroke="#764BA2" stroke-width="4" stroke-linecap="round"/>
  <line x1="280" y1="20" x2="240" y2="20" stroke="#764BA2" stroke-width="4" stroke-linecap="round"/>
  <line x1="20" y1="160" x2="60" y2="160" stroke="#764BA2" stroke-width="4" stroke-linecap="round"/>
  <line x1="280" y1="160" x2="240" y2="160" stroke="#764BA2" stroke-width="4" stroke-linecap="round"/>
  <circle cx="20" cy="20" r="5" fill="#667EEA" opacity="0.6"/>
  <circle cx="280" cy="20" r="5" fill="#667EEA" opacity="0.6"/>
  <circle cx="20" cy="160" r="5" fill="#667EEA" opacity="0.6"/>
  <circle cx="280" cy="160" r="5" fill="#667EEA" opacity="0.6"/>
</svg>`
  },
  {
    id: 'border_chinese_cloud',
    name: '中式祥云框',
    category: 'borders',
    tags: ['中国风', '祥云', '红色'],
    colorScheme: '#C53030',
    svg: `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:640px;height:auto;display:block;margin:0 auto;">
  <path d="M30 15Q40 10 50 15Q60 10 70 15Q80 10 90 15Q100 10 110 15Q120 10 130 15Q140 10 150 15Q160 10 170 15Q180 10 190 15Q200 10 210 15Q220 10 230 15Q240 10 250 15Q260 10 270 15Q280 10 290 15" stroke="#C53030" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M30 185Q40 190 50 185Q60 190 70 185Q80 190 90 185Q100 190 110 185Q120 190 130 185Q140 190 150 185Q160 190 170 185Q180 190 190 185Q200 190 210 185Q220 190 230 185Q240 190 250 185Q260 190 270 185Q280 190 290 185" stroke="#C53030" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <line x1="20" y1="28" x2="20" y2="172" stroke="#C53030" stroke-width="2" opacity="0.8"/>
  <line x1="300" y1="28" x2="300" y2="172" stroke="#C53030" stroke-width="2" opacity="0.8"/>
  <path d="M15 23L25 23L25 13" stroke="#C53030" stroke-width="2.5" fill="none"/><path d="M305 23L295 23L295 13" stroke="#C53030" stroke-width="2.5" fill="none"/>
  <path d="M15 177L25 177L25 187" stroke="#C53030" stroke-width="2.5" fill="none"/><path d="M305 177L295 177L295 187" stroke="#C53030" stroke-width="2.5" fill="none"/>
</svg>`
  },
  {
    id: 'border_double_line',
    name: '双线简约框',
    category: 'borders',
    tags: ['简约', '双线', '灰色'],
    colorScheme: '#4A5568',
    svg: `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <rect x="6" y="6" width="288" height="168" fill="none" stroke="#4A5568" stroke-width="2" rx="4"/>
  <rect x="12" y="12" width="276" height="156" fill="none" stroke="#4A5568" stroke-width="1" rx="2" opacity="0.5"/>
</svg>`
  },
  {
    id: 'border_art_nouveau',
    name: '新艺术花框',
    category: 'borders',
    tags: ['艺术', '花纹', '绿色'],
    colorScheme: '#48BB78',
    svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <rect x="10" y="10" width="280" height="180" fill="none" stroke="#48BB78" stroke-width="2" rx="8"/>
  <path d="M20 10Q25 0 30 10" stroke="#48BB78" stroke-width="2" fill="none"/>
  <path d="M60 10Q65 0 70 10" stroke="#48BB78" stroke-width="2" fill="none"/>
  <path d="M100 10Q105 0 110 10" stroke="#48BB78" stroke-width="2" fill="none"/>
  <path d="M140 10Q145 0 150 10" stroke="#48BB78" stroke-width="2" fill="none"/>
  <path d="M180 10Q185 0 190 10" stroke="#48BB78" stroke-width="2" fill="none"/>
  <path d="M220 10Q225 0 230 10" stroke="#48BB78" stroke-width="2" fill="none"/>
  <path d="M260 10Q265 0 270 10" stroke="#48BB78" stroke-width="2" fill="none"/>
  <ellipse cx="150" cy="10" rx="6" ry="4" fill="#48BB78" opacity="0.3"/>
  <ellipse cx="150" cy="190" rx="6" ry="4" fill="#48BB78" opacity="0.3"/>
</svg>`
  },
  {
    id: 'border_dashed_ticket',
    name: '票券虚线框',
    category: 'borders',
    tags: ['复古', '票券', '棕色'],
    colorScheme: '#8B7355',
    svg: `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;">
  <rect x="8" y="8" width="284" height="164" fill="none" stroke="#8B7355" stroke-width="2" stroke-dasharray="8 4" rx="8"/>
  <circle cx="8" cy="90" r="10" fill="#FFFFFF" stroke="#8B7355" stroke-width="2"/>
  <circle cx="292" cy="90" r="10" fill="#FFFFFF" stroke="#8B7355" stroke-width="2"/>
</svg>`
  }
]

// =============================================
// 2. SVG 分隔线 (Dividers)
// =============================================
export const SVG_DIVIDERS = [
  {
    id: 'divider_wave',
    name: '波浪分隔',
    category: 'dividers',
    tags: ['波浪', '流畅', '蓝色'],
    colorScheme: '#4299E1',
    svg: `<svg viewBox="0 0 400 30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%;height:20px;display:block;margin:15px auto;">
  <path d="M0 15Q50 0 100 15T200 15T300 15T400 15" stroke="#4299E1" stroke-width="2" fill="none" opacity="0.7"/>
  <path d="M0 15Q50 30 100 15T200 15T300 15T400 15" stroke="#90CDF4" stroke-width="1.5" fill="none" opacity="0.5"/>
</svg>`
  },
  {
    id: 'divider_dots_scale',
    name: '渐变圆点',
    category: 'dividers',
    tags: ['圆点', '渐变', '橙色'],
    colorScheme: '#ED8936',
    svg: `<svg viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:500px;height:25px;display:block;margin:15px auto;">
  <line x1="50" y1="20" x2="350" y2="20" stroke="#CBD5E0" stroke-width="1" opacity="0.4"/>
  <circle cx="60" cy="20" r="2" fill="#4A5568"/><circle cx="110" cy="20" r="3" fill="#4A5568"/>
  <circle cx="160" cy="20" r="5" fill="#4A5568"/><circle cx="200" cy="20" r="7" fill="#ED8936"/>
  <circle cx="240" cy="20" r="5" fill="#4A5568"/><circle cx="290" cy="20" r="3" fill="#4A5568"/>
  <circle cx="340" cy="20" r="2" fill="#4A5568"/>
</svg>`
  },
  {
    id: 'divider_floral',
    name: '花卉分隔',
    category: 'dividers',
    tags: ['花卉', '自然', '粉色'],
    colorScheme: '#F56565',
    svg: `<svg viewBox="0 0 300 50" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:450px;height:35px;display:block;margin:15px auto;">
  <line x1="15" y1="25" x2="120" y2="25" stroke="#68D391" stroke-width="2"/>
  <line x1="180" y1="25" x2="285" y2="25" stroke="#68D391" stroke-width="2"/>
  <ellipse cx="135" cy="25" rx="8" ry="12" fill="#FBB6CE" transform="rotate(-30 135 25)"/>
  <ellipse cx="150" cy="18" rx="8" ry="12" fill="#FBB6CE"/>
  <ellipse cx="165" cy="25" rx="8" ry="12" fill="#FBB6CE" transform="rotate(30 165 25)"/>
  <ellipse cx="135" cy="32" rx="8" ry="12" fill="#FBB6CE" transform="rotate(30 135 32)"/>
  <ellipse cx="165" cy="32" rx="8" ry="12" fill="#FBB6CE" transform="rotate(-30 165 32)"/>
  <circle cx="150" cy="26" r="5" fill="#F56565"/><circle cx="150" cy="26" r="2.5" fill="#FED7D7"/>
</svg>`
  },
  {
    id: 'divider_diamond',
    name: '菱形线条',
    category: 'dividers',
    tags: ['菱形', '简约', '蓝色'],
    colorScheme: '#4299E1',
    svg: `<svg viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px;height:22px;display:block;margin:15px auto;">
  <line x1="20" y1="15" x2="135" y2="15" stroke="#A0AEC0" stroke-width="1.5"/>
  <line x1="165" y1="15" x2="280" y2="15" stroke="#A0AEC0" stroke-width="1.5"/>
  <rect x="145" y="10" width="10" height="10" fill="#4299E1" transform="rotate(45 150 15)"/>
  <rect x="147" y="12" width="6" height="6" fill="#90CDF4" transform="rotate(45 150 15)"/>
</svg>`
  },
  {
    id: 'divider_arrows',
    name: '箭头分隔',
    category: 'dividers',
    tags: ['箭头', '方向', '橙色'],
    colorScheme: '#ED8936',
    svg: `<svg viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px;height:22px;display:block;margin:15px auto;">
  <line x1="20" y1="15" x2="280" y2="15" stroke="#E2E8F0" stroke-width="1"/>
  <path d="M140 8L150 15L140 22" stroke="#ED8936" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M150 8L160 15L150 22" stroke="#ED8936" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
</svg>`
  },
  {
    id: 'divider_stars',
    name: '星星分隔',
    category: 'dividers',
    tags: ['星星', '装饰', '金色'],
    colorScheme: '#F59E0B',
    svg: `<svg viewBox="0 0 300 30" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:400px;height:22px;display:block;margin:15px auto;">
  <line x1="20" y1="15" x2="120" y2="15" stroke="#E2E8F0" stroke-width="1"/>
  <line x1="180" y1="15" x2="280" y2="15" stroke="#E2E8F0" stroke-width="1"/>
  <path d="M135 15l3-6 3 6-6-4h6z" fill="#F59E0B"/><path d="M147 15l4-8 4 8-8-5h8z" fill="#F59E0B"/>
  <path d="M163 15l3-6 3 6-6-4h6z" fill="#F59E0B"/>
</svg>`
  },
  {
    id: 'divider_ink_brush',
    name: '水墨笔触',
    category: 'dividers',
    tags: ['水墨', '中国风', '黑色'],
    colorScheme: '#2D3748',
    svg: `<svg viewBox="0 0 400 20" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:500px;height:16px;display:block;margin:15px auto;">
  <path d="M30 10Q80 4 150 10T280 8T370 10" stroke="#2D3748" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
  <path d="M50 12Q120 16 200 10T350 12" stroke="#2D3748" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.3"/>
</svg>`
  },
  {
    id: 'divider_zigzag',
    name: '锯齿线',
    category: 'dividers',
    tags: ['锯齿', '活泼', '红色'],
    colorScheme: '#E53E3E',
    svg: `<svg viewBox="0 0 400 20" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:500px;height:16px;display:block;margin:15px auto;">
  <path d="M20 10L40 4L60 16L80 4L100 16L120 4L140 16L160 4L180 16L200 4L220 16L240 4L260 16L280 4L300 16L320 4L340 16L360 4L380 10" stroke="#E53E3E" stroke-width="2" fill="none" stroke-linejoin="round" opacity="0.6"/>
</svg>`
  }
]

// =============================================
// 3. 徽章标签 (Badges & Labels)
// =============================================
export const SVG_BADGES = [
  {
    id: 'badge_ribbon',
    name: '缎带徽章',
    category: 'badges',
    tags: ['缎带', '推荐', '红色'],
    colorScheme: '#E53E3E',
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:60px;height:60px;">
  <path d="M0 0L80 0L80 55L40 42L0 55Z" fill="#E53E3E"/>
  <path d="M0 0L80 0L80 50L40 40L0 50Z" fill="#FC8181" opacity="0.8"/>
  <path d="M35 42L40 65L45 42" fill="#742A2A" opacity="0.5"/>
</svg>`
  },
  {
    id: 'badge_circle',
    name: '圆形徽章',
    category: 'badges',
    tags: ['圆形', '认证', '蓝色'],
    colorScheme: '#4299E1',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:70px;height:70px;">
  <circle cx="50" cy="50" r="46" fill="#F7FAFC" stroke="#4299E1" stroke-width="3"/>
  <circle cx="50" cy="50" r="38" fill="#4299E1"/>
  <circle cx="50" cy="50" r="42" fill="none" stroke="#4299E1" stroke-width="1" opacity="0.4" stroke-dasharray="3 3"/>
  <path d="M38 50L46 58L62 42" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },
  {
    id: 'badge_shield',
    name: '盾牌徽章',
    category: 'badges',
    tags: ['盾牌', '安全', '绿色'],
    colorScheme: '#48BB78',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style="width:60px;height:72px;">
  <path d="M50 10L85 25L85 60Q85 90 50 110Q15 90 15 60L15 25Z" fill="#48BB78" stroke="#2F855A" stroke-width="2"/>
  <path d="M50 20L75 30L75 60Q75 80 50 95Q25 80 25 60L25 30Z" fill="#68D391"/>
  <path d="M40 60L48 68L65 48" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },
  {
    id: 'badge_stamp',
    name: '印章徽章',
    category: 'badges',
    tags: ['印章', '官方', '红色'],
    colorScheme: '#E53E3E',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:70px;height:70px;">
  <circle cx="50" cy="50" r="44" fill="none" stroke="#E53E3E" stroke-width="5" stroke-dasharray="2.5 3"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="#E53E3E" stroke-width="2"/>
  <circle cx="50" cy="50" r="33" fill="none" stroke="#E53E3E" stroke-width="1" stroke-dasharray="4 2"/>
  <path d="M50 30L52 37L59 37L54 42L56 49L50 44L44 49L46 42L41 37L48 37Z" fill="#E53E3E" opacity="0.8"/>
</svg>`
  },
  {
    id: 'badge_price_tag',
    name: '价格标签',
    category: 'badges',
    tags: ['标签', '促销', '粉色'],
    colorScheme: '#FC8181',
    svg: `<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:60px;">
  <path d="M10 10L90 10L110 45L90 80L10 80Z" fill="#FED7D7" stroke="#FC8181" stroke-width="2"/>
  <circle cx="25" cy="45" r="6" fill="#FFFFFF" stroke="#FC8181" stroke-width="1.5"/>
  <path d="M15 15L85 15L100 45L85 75L15 75Z" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.5"/>
</svg>`
  },
  {
    id: 'badge_hexagon',
    name: '六角星徽章',
    category: 'badges',
    tags: ['六角', '特色', '紫色'],
    colorScheme: '#9F7AEA',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:70px;height:70px;">
  <path d="M50 5L90 27.5L90 72.5L50 95L10 72.5L10 27.5Z" fill="#9F7AEA" stroke="#805AD5" stroke-width="2"/>
  <path d="M50 15L80 32.5L80 67.5L50 85L20 67.5L20 32.5Z" fill="#B794F4" opacity="0.6"/>
  <circle cx="50" cy="50" r="15" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.8"/>
</svg>`
  }
]

// =============================================
// 4. 背景纹理 (Background Patterns)
// =============================================
export const SVG_PATTERNS = [
  {
    id: 'pattern_dots',
    name: '圆点纹理',
    category: 'patterns',
    tags: ['圆点', '简约', '灰色'],
    colorScheme: '#CBD5E0',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:120px;">
  <defs><pattern id="p-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1.5" fill="#CBD5E0"/></pattern></defs>
  <rect width="100" height="100" fill="#F7FAFC"/><rect width="100" height="100" fill="url(#p-dots)"/>
</svg>`
  },
  {
    id: 'pattern_diagonal',
    name: '斜线纹理',
    category: 'patterns',
    tags: ['斜线', '经典', '浅灰'],
    colorScheme: '#E2E8F0',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:120px;">
  <defs><pattern id="p-diag" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" stroke="#E2E8F0" stroke-width="4"/></pattern></defs>
  <rect width="100" height="100" fill="#FFFFFF"/><rect width="100" height="100" fill="url(#p-diag)"/>
</svg>`
  },
  {
    id: 'pattern_grid',
    name: '网格纹理',
    category: 'patterns',
    tags: ['网格', '技术', '蓝色'],
    colorScheme: '#BEE3F8',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:120px;">
  <defs><pattern id="p-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0L0 0 0 20" fill="none" stroke="#BEE3F8" stroke-width="1"/></pattern></defs>
  <rect width="100" height="100" fill="#FAFAFA"/><rect width="100" height="100" fill="url(#p-grid)"/>
</svg>`
  },
  {
    id: 'pattern_waves',
    name: '波浪纹理',
    category: 'patterns',
    tags: ['波浪', '海洋', '蓝色'],
    colorScheme: '#63B3ED',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:120px;">
  <defs><pattern id="p-wave" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 10Q10 0 20 10T40 10" fill="none" stroke="#63B3ED" stroke-width="1" opacity="0.5"/></pattern></defs>
  <rect width="100" height="100" fill="#EBF8FF"/><rect width="100" height="100" fill="url(#p-wave)"/>
</svg>`
  },
  {
    id: 'pattern_hexagon',
    name: '蜂巢纹理',
    category: 'patterns',
    tags: ['六边形', '蜂巢', '金色'],
    colorScheme: '#F6E05E',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:120px;">
  <defs><pattern id="p-hex" x="0" y="0" width="28" height="48" patternUnits="userSpaceOnUse"><path d="M14 0L28 8L28 24L14 32L0 24L0 8Z" fill="none" stroke="#F6E05E" stroke-width="1" opacity="0.5"/><path d="M14 16L28 24L28 40L14 48L0 40L0 24Z" fill="none" stroke="#F6E05E" stroke-width="1" opacity="0.3"/></pattern></defs>
  <rect width="100" height="100" fill="#FFFFF0"/><rect width="100" height="100" fill="url(#p-hex)"/>
</svg>`
  },
  {
    id: 'pattern_confetti',
    name: '彩色碎片',
    category: 'patterns',
    tags: ['彩色', '活泼', '多彩'],
    colorScheme: '#FF6B9D',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:120px;">
  <rect width="100" height="100" fill="#FAFAFA"/>
  <rect x="15" y="12" width="4" height="4" fill="#FF6B9D" opacity="0.5" transform="rotate(30 17 14)"/>
  <rect x="45" y="8" width="3" height="6" fill="#4ECDC4" opacity="0.4" transform="rotate(-15 46 11)"/>
  <rect x="75" y="18" width="5" height="3" fill="#FFE66D" opacity="0.5" transform="rotate(45 77 19)"/>
  <rect x="25" y="45" width="4" height="4" fill="#AA96DA" opacity="0.4" transform="rotate(20 27 47)"/>
  <rect x="60" y="40" width="3" height="5" fill="#95E1D3" opacity="0.5" transform="rotate(-30 61 42)"/>
  <rect x="85" y="55" width="4" height="3" fill="#FF6B9D" opacity="0.3" transform="rotate(60 87 56)"/>
  <rect x="10" y="75" width="5" height="3" fill="#4ECDC4" opacity="0.5" transform="rotate(-45 12 76)"/>
  <rect x="50" y="70" width="3" height="5" fill="#FFE66D" opacity="0.4" transform="rotate(15 51 72)"/>
  <rect x="80" y="80" width="4" height="4" fill="#AA96DA" opacity="0.5" transform="rotate(30 82 82)"/>
</svg>`
  }
]

// =============================================
// 5. 装饰性插图 (Decorative Illustrations)
// =============================================
export const SVG_ILLUSTRATIONS = [
  {
    id: 'illust_coffee',
    name: '咖啡杯',
    category: 'icons',
    tags: ['咖啡', '生活', '棕色'],
    colorScheme: '#8B4513',
    svg: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:61px;">
  <path d="M25 40L30 85Q30 90 35 90L65 90Q70 90 70 85L75 40Z" fill="#FFFFFF" stroke="#4A5568" stroke-width="2"/>
  <ellipse cx="50" cy="40" rx="25" ry="6" fill="#E2E8F0" stroke="#4A5568" stroke-width="2"/>
  <path d="M75 50Q90 50 90 65Q90 78 75 78" fill="none" stroke="#4A5568" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="50" cy="44" rx="21" ry="4" fill="#8B4513" opacity="0.7"/>
  <path d="M42 30Q40 24 42 18" stroke="#A0AEC0" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/>
  <path d="M50 33Q48 26 50 20" stroke="#A0AEC0" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/>
  <path d="M58 30Q60 24 58 16" stroke="#A0AEC0" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'illust_heart',
    name: '爱心',
    category: 'icons',
    tags: ['爱心', '浪漫', '红色'],
    colorScheme: '#F56565',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;">
  <path d="M50 85C20 65 10 45 10 35Q10 15 25 15Q35 15 45 25Q50 30 50 30Q50 30 55 25Q65 15 75 15Q90 15 90 35C90 45 80 65 50 85Z" fill="#F56565"/>
  <path d="M35 25Q30 20 25 20Q18 20 18 30C18 35 20 40 30 50" fill="#FC8181" opacity="0.6"/>
</svg>`
  },
  {
    id: 'illust_star_glow',
    name: '发光星',
    category: 'icons',
    tags: ['星星', '成就', '金色'],
    colorScheme: '#F59E0B',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;">
  <circle cx="50" cy="50" r="42" fill="#FEF3C7" opacity="0.35"/>
  <path d="M50 15L58 42L87 42L64 58L72 85L50 68L28 85L36 58L13 42L42 42Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
  <path d="M50 28L54 45L72 45L58 55L62 72L50 62L38 72L42 55L28 45L46 45Z" fill="#FCD34D"/>
</svg>`
  },
  {
    id: 'illust_gift',
    name: '礼物盒',
    category: 'icons',
    tags: ['礼物', '节日', '红色'],
    colorScheme: '#E53E3E',
    svg: `<svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:61px;">
  <rect x="20" y="48" width="60" height="45" fill="#FC8181" stroke="#E53E3E" stroke-width="2" rx="3"/>
  <rect x="15" y="38" width="70" height="14" fill="#FBB6CE" stroke="#E53E3E" stroke-width="2" rx="2"/>
  <rect x="47" y="38" width="6" height="55" fill="#E53E3E"/>
  <rect x="20" y="44" width="60" height="5" fill="#E53E3E"/>
  <ellipse cx="36" cy="32" rx="11" ry="7" fill="#F56565"/><ellipse cx="64" cy="32" rx="11" ry="7" fill="#F56565"/>
  <circle cx="50" cy="32" r="5" fill="#E53E3E"/>
</svg>`
  },
  {
    id: 'illust_book',
    name: '书本',
    category: 'icons',
    tags: ['书本', '学习', '蓝色'],
    colorScheme: '#4299E1',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;">
  <path d="M15 20L50 12L85 20L85 80L50 88L15 80Z" fill="#EBF8FF" stroke="#4299E1" stroke-width="2"/>
  <line x1="50" y1="12" x2="50" y2="88" stroke="#4299E1" stroke-width="2"/>
  <line x1="25" y1="30" x2="45" y2="26" stroke="#90CDF4" stroke-width="2" stroke-linecap="round"/>
  <line x1="25" y1="40" x2="45" y2="36" stroke="#90CDF4" stroke-width="2" stroke-linecap="round"/>
  <line x1="25" y1="50" x2="45" y2="46" stroke="#90CDF4" stroke-width="2" stroke-linecap="round"/>
  <line x1="55" y1="26" x2="75" y2="30" stroke="#90CDF4" stroke-width="2" stroke-linecap="round"/>
  <line x1="55" y1="36" x2="75" y2="40" stroke="#90CDF4" stroke-width="2" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'illust_rocket',
    name: '火箭',
    category: 'icons',
    tags: ['火箭', '科技', '橙色'],
    colorScheme: '#ED8936',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style="width:50px;height:60px;">
  <path d="M50 10Q55 10 62 30L65 60L55 75L45 75L35 60L38 30Q42 10 50 10Z" fill="#EDF2F7" stroke="#4A5568" stroke-width="2"/>
  <path d="M35 55L25 70L38 62Z" fill="#ED8936"/><path d="M65 55L75 70L62 62Z" fill="#ED8936"/>
  <circle cx="50" cy="40" r="8" fill="#4299E1" stroke="#2B6CB0" stroke-width="1.5"/>
  <circle cx="50" cy="40" r="4" fill="#BEE3F8"/>
  <path d="M43 75L50 95L57 75" fill="#ED8936"/><path d="M46 75L50 88L54 75" fill="#F6AD55"/>
</svg>`
  }
]

// =============================================
// 6. 节日/季节元素 (Seasonal)
// =============================================
export const SVG_SEASONAL = [
  {
    id: 'seasonal_lantern',
    name: '红灯笼',
    category: 'seasonal',
    tags: ['春节', '灯笼', '红色'],
    colorScheme: '#E53E3E',
    svg: `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" style="width:50px;height:65px;">
  <line x1="50" y1="5" x2="50" y2="18" stroke="#C53030" stroke-width="2"/>
  <ellipse cx="50" cy="18" rx="16" ry="4" fill="#FFD700"/>
  <path d="M34 18Q27 45 27 60Q27 78 50 78Q73 78 73 60Q73 45 66 18Z" fill="#E53E3E" stroke="#C53030" stroke-width="1.5"/>
  <ellipse cx="50" cy="78" rx="23" ry="3.5" fill="#FFD700"/>
  <line x1="50" y1="18" x2="50" y2="78" stroke="#FFD700" stroke-width="1.5"/>
  <line x1="50" y1="78" x2="50" y2="100" stroke="#D4AF37" stroke-width="2.5"/>
  <circle cx="50" cy="102" r="4" fill="#FFD700"/>
  <line x1="50" y1="106" x2="50" y2="120" stroke="#C53030" stroke-width="1.5"/>
</svg>`
  },
  {
    id: 'seasonal_moon',
    name: '中秋明月',
    category: 'seasonal',
    tags: ['中秋', '月亮', '金色'],
    colorScheme: '#FFD700',
    svg: `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg" style="width:60px;height:60px;">
  <circle cx="55" cy="55" r="50" fill="#FFFACD" opacity="0.25"/>
  <circle cx="55" cy="55" r="40" fill="#FFD700"/>
  <circle cx="45" cy="45" r="7" fill="#F4D03F" opacity="0.5"/>
  <circle cx="65" cy="50" r="5" fill="#F4D03F" opacity="0.4"/>
  <circle cx="50" cy="65" r="4.5" fill="#F4D03F" opacity="0.4"/>
  <path d="M40 38Q46 33 55 36" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>
  <circle cx="18" cy="25" r="1.5" fill="#FFFFFF"/><circle cx="95" cy="38" r="2" fill="#FFFFFF"/>
  <circle cx="22" cy="82" r="1.5" fill="#FFFFFF"/><circle cx="92" cy="78" r="1.5" fill="#FFFFFF"/>
</svg>`
  },
  {
    id: 'seasonal_sakura',
    name: '樱花',
    category: 'seasonal',
    tags: ['春天', '樱花', '粉色'],
    colorScheme: '#FBB6CE',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;">
  <path d="M10 70Q40 50 70 40Q80 35 90 30" stroke="#6B4423" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cx="38" cy="52" rx="7" ry="10" fill="#FBB6CE"/><ellipse cx="38" cy="52" rx="7" ry="10" fill="#FBB6CE" transform="rotate(72 38 52)"/>
  <ellipse cx="38" cy="52" rx="7" ry="10" fill="#FBB6CE" transform="rotate(144 38 52)"/><ellipse cx="38" cy="52" rx="7" ry="10" fill="#FBB6CE" transform="rotate(216 38 52)"/>
  <ellipse cx="38" cy="52" rx="7" ry="10" fill="#FBB6CE" transform="rotate(288 38 52)"/>
  <circle cx="38" cy="52" r="4" fill="#F6AD55"/>
  <ellipse cx="65" cy="40" rx="5" ry="8" fill="#FED7E2"/><ellipse cx="65" cy="40" rx="5" ry="8" fill="#FED7E2" transform="rotate(72 65 40)"/>
  <ellipse cx="65" cy="40" rx="5" ry="8" fill="#FED7E2" transform="rotate(144 65 40)"/><ellipse cx="65" cy="40" rx="5" ry="8" fill="#FED7E2" transform="rotate(216 65 40)"/>
  <ellipse cx="65" cy="40" rx="5" ry="8" fill="#FED7E2" transform="rotate(288 65 40)"/>
  <circle cx="65" cy="40" r="3" fill="#F6AD55"/>
</svg>`
  },
  {
    id: 'seasonal_snowflake',
    name: '雪花',
    category: 'seasonal',
    tags: ['冬天', '雪花', '蓝色'],
    colorScheme: '#4299E1',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;">
  <line x1="50" y1="10" x2="50" y2="90" stroke="#4299E1" stroke-width="3" stroke-linecap="round"/>
  <line x1="10" y1="50" x2="90" y2="50" stroke="#4299E1" stroke-width="3" stroke-linecap="round"/>
  <line x1="22" y1="22" x2="78" y2="78" stroke="#4299E1" stroke-width="3" stroke-linecap="round"/>
  <line x1="78" y1="22" x2="22" y2="78" stroke="#4299E1" stroke-width="3" stroke-linecap="round"/>
  <line x1="50" y1="25" x2="43" y2="20" stroke="#90CDF4" stroke-width="2"/><line x1="50" y1="25" x2="57" y2="20" stroke="#90CDF4" stroke-width="2"/>
  <line x1="50" y1="75" x2="43" y2="80" stroke="#90CDF4" stroke-width="2"/><line x1="50" y1="75" x2="57" y2="80" stroke="#90CDF4" stroke-width="2"/>
  <line x1="25" y1="50" x2="20" y2="43" stroke="#90CDF4" stroke-width="2"/><line x1="25" y1="50" x2="20" y2="57" stroke="#90CDF4" stroke-width="2"/>
  <line x1="75" y1="50" x2="80" y2="43" stroke="#90CDF4" stroke-width="2"/><line x1="75" y1="50" x2="80" y2="57" stroke="#90CDF4" stroke-width="2"/>
  <circle cx="50" cy="50" r="5" fill="#4299E1" opacity="0.7"/><circle cx="50" cy="50" r="2.5" fill="#BEE3F8"/>
</svg>`
  },
  {
    id: 'seasonal_christmas_tree',
    name: '圣诞树',
    category: 'seasonal',
    tags: ['圣诞', '节日', '绿色'],
    colorScheme: '#2F855A',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style="width:50px;height:60px;">
  <path d="M50 20L32 42L38 42L25 60L32 60L20 80L80 80L68 60L75 60L62 42L68 42Z" fill="#2F855A"/>
  <path d="M50 20L36 38L40 38L30 52L36 52L28 68" fill="#48BB78" opacity="0.5"/>
  <rect x="43" y="80" width="14" height="14" fill="#744210" rx="2"/>
  <circle cx="45" cy="50" r="3.5" fill="#E53E3E"/><circle cx="58" cy="55" r="3.5" fill="#F6AD55"/>
  <circle cx="48" cy="68" r="3.5" fill="#4299E1"/><circle cx="62" cy="65" r="3.5" fill="#E53E3E"/>
  <circle cx="38" cy="72" r="3.5" fill="#F6E05E"/>
  <path d="M50 10L52 17L58 17L54 21L55 27L50 23L45 27L46 21L42 17L48 17Z" fill="#F6E05E"/>
</svg>`
  },
  {
    id: 'seasonal_leaf_autumn',
    name: '秋叶',
    category: 'seasonal',
    tags: ['秋天', '落叶', '橙色'],
    colorScheme: '#ED8936',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:55px;height:55px;">
  <path d="M50 15Q70 20 80 40Q85 55 75 70Q65 80 50 85Q35 80 25 70Q15 55 20 40Q30 20 50 15Z" fill="#ED8936" stroke="#C05621" stroke-width="1.5"/>
  <path d="M50 15Q60 25 65 45Q67 55 60 68" fill="#F6AD55" opacity="0.5"/>
  <line x1="50" y1="18" x2="50" y2="82" stroke="#C05621" stroke-width="1.5"/>
  <path d="M50 35Q60 30 68 35" stroke="#C05621" stroke-width="1" fill="none"/>
  <path d="M50 50Q38 44 30 48" stroke="#C05621" stroke-width="1" fill="none"/>
  <path d="M50 65Q62 60 70 64" stroke="#C05621" stroke-width="1" fill="none"/>
</svg>`
  }
]

// =============================================
// 7. 文字装饰 (Text Decorations)
// =============================================
export const SVG_TEXT_DECO = [
  {
    id: 'deco_quote_marks',
    name: '大引号',
    category: 'text_deco',
    tags: ['引号', '引用', '灰色'],
    colorScheme: '#A0AEC0',
    svg: `<svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg" style="width:40px;height:34px;">
  <path d="M10 30Q10 18 18 12L18 17Q14 19 13 25L20 25L20 40L10 40Z" fill="#A0AEC0" opacity="0.6"/>
  <path d="M30 30Q30 18 38 12L38 17Q34 19 33 25L40 25L40 40L30 40Z" fill="#A0AEC0" opacity="0.6"/>
</svg>`
  },
  {
    id: 'deco_speech_bubble',
    name: '对话气泡',
    category: 'text_deco',
    tags: ['气泡', '对话', '青色'],
    colorScheme: '#38B2AC',
    svg: `<svg viewBox="0 0 250 90" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:380px;height:auto;display:block;">
  <rect x="10" y="10" width="230" height="55" rx="12" fill="#E6FFFA" stroke="#38B2AC" stroke-width="2"/>
  <path d="M35 65L25 80L50 65" fill="#E6FFFA" stroke="#38B2AC" stroke-width="2" stroke-linejoin="round"/>
  <line x1="35" y1="65" x2="50" y2="65" stroke="#E6FFFA" stroke-width="3"/>
</svg>`
  },
  {
    id: 'deco_highlight',
    name: '荧光笔高亮',
    category: 'text_deco',
    tags: ['高亮', '强调', '黄色'],
    colorScheme: '#FEFCBF',
    svg: `<svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;height:22px;display:block;">
  <path d="M8 20Q50 14 100 20T192 18" stroke="#FEFCBF" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.7"/>
</svg>`
  },
  {
    id: 'deco_bracket',
    name: '大括号装饰',
    category: 'text_deco',
    tags: ['括号', '强调', '橙色'],
    colorScheme: '#ED8936',
    svg: `<svg viewBox="0 0 300 70" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px;height:50px;display:block;">
  <path d="M22 8L14 8L14 62L22 62" stroke="#ED8936" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M278 8L286 8L286 62L278 62" stroke="#ED8936" stroke-width="3.5" fill="none" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'deco_underline_brush',
    name: '手绘下划线',
    category: 'text_deco',
    tags: ['下划线', '手绘', '粉色'],
    colorScheme: '#FED7E2',
    svg: `<svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;height:14px;display:block;">
  <path d="M5 12Q40 6 80 12T155 10Q170 9 195 12" stroke="#FED7E2" stroke-width="6" fill="none" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'deco_callout_info',
    name: '信息提示框',
    category: 'text_deco',
    tags: ['提示', '信息', '蓝色'],
    colorScheme: '#4299E1',
    svg: `<svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:450px;height:auto;display:block;">
  <rect x="8" y="8" width="284" height="84" rx="8" fill="#EBF8FF" stroke="#4299E1" stroke-width="2.5"/>
  <circle cx="32" cy="50" r="15" fill="#4299E1"/>
  <circle cx="32" cy="42" r="2.5" fill="#FFFFFF"/>
  <rect x="30" y="48" width="4" height="11" rx="2" fill="#FFFFFF"/>
</svg>`
  }
]


// =============================================
// 8. 波浪与有机形状 (Waves & Organic Shapes)
// =============================================
export const SVG_WAVES = [
  {
    id: 'wave_layered_blue',
    name: '多层蓝色波浪',
    category: 'waves',
    tags: ["波浪", "蓝色", "多层", "海洋"],
    colorScheme: '#1a6cf6',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="wlb1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#1a6cf6;stop-opacity:1"/><stop offset="100%" style="stop-color:#0a3fa8;stop-opacity:1"/></linearGradient><linearGradient id="wlb2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#4d9fff;stop-opacity:1"/><stop offset="100%" style="stop-color:#1a6cf6;stop-opacity:1"/></linearGradient><linearGradient id="wlb3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#a8d4ff;stop-opacity:1"/><stop offset="100%" style="stop-color:#4d9fff;stop-opacity:1"/></linearGradient></defs><rect width="400" height="120" fill="#e8f4ff"/><path d="M0 80 C50 60 100 100 150 80 C200 60 250 100 300 80 C350 60 400 90 400 80 L400 120 L0 120 Z" fill="url(#wlb1)" opacity="1"/><path d="M0 70 C60 50 110 90 160 70 C210 50 260 90 310 70 C360 50 400 75 400 70 L400 120 L0 120 Z" fill="url(#wlb2)" opacity="0.7"/><path d="M0 60 C70 40 120 80 170 60 C220 40 270 80 320 60 C370 40 400 65 400 60 L400 120 L0 120 Z" fill="url(#wlb3)" opacity="0.4"/></svg>`
  },
  {
    id: 'wave_sunset',
    name: '日落渐变波浪',
    category: 'waves',
    tags: ["波浪", "日落", "渐变", "橙色", "粉色"],
    colorScheme: '#ff6b35',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="sunsetBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ffe8d6"/><stop offset="100%" style="stop-color:#ffd6e8"/></linearGradient><linearGradient id="sunsetWave" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#ff6b35"/><stop offset="50%" style="stop-color:#ff8e53"/><stop offset="100%" style="stop-color:#ff4e8e"/></linearGradient><linearGradient id="sunsetWave2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#ff4e8e"/><stop offset="100%" style="stop-color:#ff6b35"/></linearGradient></defs><rect width="400" height="120" fill="url(#sunsetBg)"/><circle cx="340" cy="30" r="22" fill="#ffcc44" opacity="0.6"/><path d="M0 90 C40 70 80 110 120 90 C160 70 200 110 240 90 C280 70 320 105 360 90 C380 83 395 88 400 90 L400 120 L0 120 Z" fill="url(#sunsetWave)" opacity="0.9"/><path d="M0 75 C50 55 90 95 140 75 C190 55 230 95 280 75 C330 55 370 80 400 75 L400 120 L0 120 Z" fill="url(#sunsetWave2)" opacity="0.5"/></svg>`
  },
  {
    id: 'wave_minimal',
    name: '极简单线波浪',
    category: 'waves',
    tags: ["波浪", "极简", "线条", "灰色", "简约"],
    colorScheme: '#9e9e9e',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect width="400" height="60" fill="#fafafa"/><path d="M0 30 C40 10 80 50 120 30 C160 10 200 50 240 30 C280 10 320 50 360 30 C380 20 395 28 400 30" fill="none" stroke="#bdbdbd" stroke-width="1.5" stroke-linecap="round"/><path d="M0 38 C40 18 80 58 120 38 C160 18 200 58 240 38 C280 18 320 58 360 38 C380 28 395 36 400 38" fill="none" stroke="#e0e0e0" stroke-width="1" stroke-linecap="round"/></svg>`
  },
  {
    id: 'blob_organic',
    name: '有机色块',
    category: 'waves',
    tags: ["色块", "有机", "紫色", "渐变", "shape"],
    colorScheme: '#7c3aed',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#7c3aed"/><stop offset="50%" style="stop-color:#a855f7"/><stop offset="100%" style="stop-color:#c084fc"/></linearGradient><linearGradient id="blobGrad2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#e879f9"/><stop offset="100%" style="stop-color:#7c3aed"/></linearGradient><filter id="blobBlur"><feGaussianBlur stdDeviation="4"/></filter></defs><rect width="400" height="200" fill="#f5f0ff"/><ellipse cx="200" cy="100" rx="160" ry="70" fill="url(#blobGrad2)" opacity="0.15" filter="url(#blobBlur)"/><path d="M120 60 C150 30 230 25 270 55 C310 85 330 120 300 150 C270 180 190 185 150 165 C110 145 80 120 85 95 C88 78 100 80 120 60 Z" fill="url(#blobGrad)"/><path d="M155 80 C170 60 210 58 235 75 C255 90 260 115 245 135 C230 155 200 158 180 148 C158 137 145 118 148 100 C150 90 148 92 155 80 Z" fill="#e879f9" opacity="0.35"/></svg>`
  },
  {
    id: 'blob_scatter',
    name: '散落色块',
    category: 'waves',
    tags: ["色块", "散落", "多彩", "playful", "shapes"],
    colorScheme: '#f43f5e',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><filter id="bsBlur"><feGaussianBlur stdDeviation="2"/></filter></defs><rect width="400" height="150" fill="#fefefe"/><path d="M40 50 C50 30 75 28 85 48 C95 68 80 85 60 82 C40 79 30 70 40 50 Z" fill="#f43f5e" opacity="0.8"/><path d="M110 80 C125 55 155 52 165 75 C175 98 158 118 138 115 C118 112 100 100 110 80 Z" fill="#f59e0b" opacity="0.8"/><path d="M195 35 C210 15 240 18 248 40 C256 62 240 78 220 74 C200 70 185 52 195 35 Z" fill="#10b981" opacity="0.8"/><path d="M285 65 C298 42 328 45 335 68 C342 91 325 108 305 104 C285 100 272 85 285 65 Z" fill="#3b82f6" opacity="0.8"/><path d="M355 25 C365 10 385 12 390 30 C395 48 382 60 366 57 C350 54 345 40 355 25 Z" fill="#8b5cf6" opacity="0.8"/><path d="M60 105 C70 92 88 93 93 107 C98 121 88 132 74 130 C60 128 52 116 60 105 Z" fill="#06b6d4" opacity="0.7"/><path d="M248 100 C258 87 278 88 283 102 C288 116 278 128 264 126 C250 124 240 112 248 100 Z" fill="#ec4899" opacity="0.7"/></svg>`
  },
  {
    id: 'wave_chinese_cloud',
    name: '中式祥云波浪',
    category: 'waves',
    tags: ["波浪", "中国风", "祥云", "传统", "auspicious"],
    colorScheme: '#c0392b',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="cloudBg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#fff8f0"/><stop offset="100%" style="stop-color:#fff0f0"/></linearGradient></defs><rect width="400" height="80" fill="url(#cloudBg)"/><g fill="none" stroke="#c0392b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(10,15)"><path d="M0 25 C0 15 8 8 18 8 C18 3 23 0 28 2 C30 -2 36 -2 38 2 C43 0 48 3 48 8 C58 8 66 15 66 25 Z"/><path d="M8 25 C8 20 12 17 18 17"/><path d="M58 25 C58 20 54 17 48 17"/><path d="M28 8 C28 13 33 17 38 17"/></g><g transform="translate(88,15)"><path d="M0 25 C0 15 8 8 18 8 C18 3 23 0 28 2 C30 -2 36 -2 38 2 C43 0 48 3 48 8 C58 8 66 15 66 25 Z"/><path d="M8 25 C8 20 12 17 18 17"/><path d="M58 25 C58 20 54 17 48 17"/><path d="M28 8 C28 13 33 17 38 17"/></g><g transform="translate(166,15)"><path d="M0 25 C0 15 8 8 18 8 C18 3 23 0 28 2 C30 -2 36 -2 38 2 C43 0 48 3 48 8 C58 8 66 15 66 25 Z"/><path d="M8 25 C8 20 12 17 18 17"/><path d="M58 25 C58 20 54 17 48 17"/><path d="M28 8 C28 13 33 17 38 17"/></g><g transform="translate(244,15)"><path d="M0 25 C0 15 8 8 18 8 C18 3 23 0 28 2 C30 -2 36 -2 38 2 C43 0 48 3 48 8 C58 8 66 15 66 25 Z"/><path d="M8 25 C8 20 12 17 18 17"/><path d="M58 25 C58 20 54 17 48 17"/><path d="M28 8 C28 13 33 17 38 17"/></g><g transform="translate(322,15)"><path d="M0 25 C0 15 8 8 18 8 C18 3 23 0 28 2 C30 -2 36 -2 38 2 C43 0 48 3 48 8 C58 8 66 15 66 25 Z"/><path d="M8 25 C8 20 12 17 18 17"/><path d="M58 25 C58 20 54 17 48 17"/><path d="M28 8 C28 13 33 17 38 17"/></g></g><line x1="0" y1="40" x2="400" y2="40" stroke="#e74c3c" stroke-width="1" opacity="0.4"/><path d="M0 60 C50 52 100 68 150 60 C200 52 250 68 300 60 C350 52 380 62 400 60" fill="none" stroke="#c0392b" stroke-width="1.2" opacity="0.5"/></svg>`
  },
  {
    id: 'wave_liquid',
    name: '液态流动',
    category: 'waves',
    tags: ["波浪", "液态", "金属", "银色", "蓝色", "渐变"],
    colorScheme: '#94a3b8',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="liquidMetal" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#e2e8f0"/><stop offset="30%" style="stop-color:#94a3b8"/><stop offset="60%" style="stop-color:#60a5fa"/><stop offset="100%" style="stop-color:#c7d2fe"/></linearGradient><linearGradient id="liquidMetal2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#60a5fa"/><stop offset="50%" style="stop-color:#e2e8f0"/><stop offset="100%" style="stop-color:#94a3b8"/></linearGradient><linearGradient id="liquidBg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#f0f4f8"/><stop offset="100%" style="stop-color:#dde6f0"/></linearGradient><filter id="liquidGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="120" fill="url(#liquidBg)"/><path d="M-10 85 C30 60 70 105 110 80 C150 55 190 100 230 78 C270 56 310 95 350 72 C375 58 395 68 410 65 L410 120 L-10 120 Z" fill="url(#liquidMetal)" opacity="0.9"/><path d="M-10 70 C40 48 80 90 120 65 C160 40 200 85 240 62 C280 39 320 80 360 58 C385 45 400 55 410 52 L410 120 L-10 120 Z" fill="url(#liquidMetal2)" opacity="0.55"/><path d="M0 90 C50 72 90 108 140 88 C190 68 230 102 280 84 C320 68 360 92 400 80" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7" filter="url(#liquidGlow)"/></svg>`
  },
  {
    id: 'wave_double_curve',
    name: '双曲线优雅',
    category: 'waves',
    tags: ["波浪", "曲线", "优雅", "极简", "dual"],
    colorScheme: '#6366f1',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="curve1Grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.2"/><stop offset="50%" style="stop-color:#6366f1;stop-opacity:1"/><stop offset="100%" style="stop-color:#6366f1;stop-opacity:0.2"/></linearGradient><linearGradient id="curve2Grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#a5b4fc;stop-opacity:0.2"/><stop offset="50%" style="stop-color:#a5b4fc;stop-opacity:1"/><stop offset="100%" style="stop-color:#a5b4fc;stop-opacity:0.2"/></linearGradient></defs><rect width="400" height="80" fill="#f8f9ff"/><path d="M0 60 C100 60 150 20 200 20 C250 20 300 60 400 60" fill="none" stroke="url(#curve1Grad)" stroke-width="2" stroke-linecap="round"/><path d="M0 20 C100 20 150 60 200 60 C250 60 300 20 400 20" fill="none" stroke="url(#curve2Grad)" stroke-width="2" stroke-linecap="round"/><circle cx="200" cy="40" r="4" fill="#6366f1" opacity="0.8"/><circle cx="100" cy="40" r="2.5" fill="#a5b4fc" opacity="0.6"/><circle cx="300" cy="40" r="2.5" fill="#a5b4fc" opacity="0.6"/></svg>`
  }
]

// =============================================
// 9. 进度与时间线 (Progress & Timeline)
// =============================================
export const SVG_PROGRESS = [
  {
    id: 'progress_steps_3',
    name: '三步流程',
    category: 'progress',
    tags: ["进度", "steps", "3", "靛蓝", "workflow"],
    colorScheme: '#4f46e5',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="stepLine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#4f46e5"/><stop offset="100%" style="stop-color:#818cf8"/></linearGradient></defs><rect width="400" height="100" fill="#f5f3ff"/><line x1="90" y1="42" x2="170" y2="42" stroke="url(#stepLine)" stroke-width="2.5"/><line x1="230" y1="42" x2="310" y2="42" stroke="url(#stepLine)" stroke-width="2.5"/><circle cx="70" cy="42" r="22" fill="#4f46e5"/><circle cx="200" cy="42" r="22" fill="#4f46e5"/><circle cx="330" cy="42" r="22" fill="#818cf8"/><text x="70" y="48" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="Arial,sans-serif">1</text><text x="200" y="48" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="Arial,sans-serif">2</text><text x="330" y="48" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="Arial,sans-serif">3</text><text x="70" y="80" text-anchor="middle" fill="#4f46e5" font-size="12" font-family="Arial,sans-serif">开始</text><text x="200" y="80" text-anchor="middle" fill="#4f46e5" font-size="12" font-family="Arial,sans-serif">进行</text><text x="330" y="80" text-anchor="middle" fill="#818cf8" font-size="12" font-family="Arial,sans-serif">完成</text></svg>`
  },
  {
    id: 'progress_steps_4',
    name: '四步流程',
    category: 'progress',
    tags: ["进度", "steps", "4", "绿色", "workflow", "development"],
    colorScheme: '#059669',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="greenLine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#059669"/><stop offset="100%" style="stop-color:#34d399"/></linearGradient></defs><rect width="400" height="100" fill="#f0fdf4"/><line x1="65" y1="40" x2="120" y2="40" stroke="url(#greenLine)" stroke-width="2"/><line x1="160" y1="40" x2="215" y2="40" stroke="url(#greenLine)" stroke-width="2"/><line x1="255" y1="40" x2="310" y2="40" stroke="url(#greenLine)" stroke-width="2"/><circle cx="45" cy="40" r="18" fill="#059669"/><circle cx="140" cy="40" r="18" fill="#059669"/><circle cx="235" cy="40" r="18" fill="#059669"/><circle cx="330" cy="40" r="18" fill="#34d399"/><text x="45" y="45" text-anchor="middle" fill="white" font-size="11" font-weight="bold" font-family="Arial,sans-serif">需求</text><text x="140" y="45" text-anchor="middle" fill="white" font-size="11" font-weight="bold" font-family="Arial,sans-serif">设计</text><text x="235" y="45" text-anchor="middle" fill="white" font-size="11" font-weight="bold" font-family="Arial,sans-serif">开发</text><text x="330" y="45" text-anchor="middle" fill="white" font-size="11" font-weight="bold" font-family="Arial,sans-serif">上线</text><text x="45" y="72" text-anchor="middle" fill="#059669" font-size="10" font-family="Arial,sans-serif">Step 1</text><text x="140" y="72" text-anchor="middle" fill="#059669" font-size="10" font-family="Arial,sans-serif">Step 2</text><text x="235" y="72" text-anchor="middle" fill="#059669" font-size="10" font-family="Arial,sans-serif">Step 3</text><text x="330" y="72" text-anchor="middle" fill="#34d399" font-size="10" font-family="Arial,sans-serif">Step 4</text></svg>`
  },
  {
    id: 'timeline_vertical',
    name: '竖向时间线',
    category: 'progress',
    tags: ["时间线", "vertical", "紫色", "dates", "history"],
    colorScheme: '#7c3aed',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 220" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="vtLine" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#7c3aed"/><stop offset="100%" style="stop-color:#a78bfa"/></linearGradient></defs><rect width="300" height="220" fill="#faf5ff"/><line x1="80" y1="30" x2="80" y2="190" stroke="url(#vtLine)" stroke-width="2.5"/><circle cx="80" cy="55" r="10" fill="#7c3aed"/><circle cx="80" cy="110" r="10" fill="#7c3aed"/><circle cx="80" cy="165" r="10" fill="#a78bfa"/><circle cx="80" cy="55" r="5" fill="white"/><circle cx="80" cy="110" r="5" fill="white"/><circle cx="80" cy="165" r="5" fill="white"/><text x="100" y="50" fill="#7c3aed" font-size="11" font-weight="bold" font-family="Arial,sans-serif">2024 / 01</text><text x="100" y="65" fill="#6b7280" font-size="10" font-family="Arial,sans-serif">项目启动，完成立项</text><text x="100" y="105" fill="#7c3aed" font-size="11" font-weight="bold" font-family="Arial,sans-serif">2024 / 06</text><text x="100" y="120" fill="#6b7280" font-size="10" font-family="Arial,sans-serif">中期评审，产品上线</text><text x="100" y="160" fill="#a78bfa" font-size="11" font-weight="bold" font-family="Arial,sans-serif">2024 / 12</text><text x="100" y="175" fill="#6b7280" font-size="10" font-family="Arial,sans-serif">年终总结，迭代完成</text><circle cx="80" cy="30" r="4" fill="#7c3aed" opacity="0.4"/><circle cx="80" cy="190" r="4" fill="#a78bfa" opacity="0.4"/></svg>`
  },
  {
    id: 'timeline_horizontal',
    name: '横向时间线',
    category: 'progress',
    tags: ["时间线", "horizontal", "橙色", "红色", "quarters"],
    colorScheme: '#f97316',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 90" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="htLine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#f97316"/><stop offset="100%" style="stop-color:#ef4444"/></linearGradient></defs><rect width="400" height="90" fill="#fff7ed"/><line x1="40" y1="45" x2="360" y2="45" stroke="url(#htLine)" stroke-width="3" stroke-linecap="round"/><polygon points="360,39 374,45 360,51" fill="#ef4444"/><circle cx="80" cy="45" r="10" fill="#f97316"/><circle cx="173" cy="45" r="10" fill="#fb923c"/><circle cx="267" cy="45" r="10" fill="#f87171"/><circle cx="360" cy="45" r="10" fill="#ef4444"/><circle cx="80" cy="45" r="5" fill="white"/><circle cx="173" cy="45" r="5" fill="white"/><circle cx="267" cy="45" r="5" fill="white"/><circle cx="360" cy="45" r="5" fill="white"/><text x="80" y="28" text-anchor="middle" fill="#f97316" font-size="12" font-weight="bold" font-family="Arial,sans-serif">Q1</text><text x="173" y="28" text-anchor="middle" fill="#fb923c" font-size="12" font-weight="bold" font-family="Arial,sans-serif">Q2</text><text x="267" y="28" text-anchor="middle" fill="#f87171" font-size="12" font-weight="bold" font-family="Arial,sans-serif">Q3</text><text x="360" y="28" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold" font-family="Arial,sans-serif">Q4</text><text x="80" y="68" text-anchor="middle" fill="#9a3412" font-size="10" font-family="Arial,sans-serif">规划</text><text x="173" y="68" text-anchor="middle" fill="#9a3412" font-size="10" font-family="Arial,sans-serif">执行</text><text x="267" y="68" text-anchor="middle" fill="#9a3412" font-size="10" font-family="Arial,sans-serif">优化</text><text x="360" y="68" text-anchor="middle" fill="#9a3412" font-size="10" font-family="Arial,sans-serif">收官</text></svg>`
  },
  {
    id: 'progress_bar_gradient',
    name: '渐变进度条',
    category: 'progress',
    tags: ["进度", "柱状", "渐变", "蓝色", "紫色", "75%"],
    colorScheme: '#3b82f6',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#3b82f6"/><stop offset="100%" style="stop-color:#8b5cf6"/></linearGradient><clipPath id="barClip"><rect x="20" y="22" width="300" height="16" rx="8"/></clipPath><filter id="barGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="400" height="60" fill="#f5f3ff"/><rect x="20" y="22" width="300" height="16" rx="8" fill="#e5e7eb"/><rect x="20" y="22" width="225" height="16" rx="8" fill="url(#barGrad)" filter="url(#barGlow)"/><rect x="20" y="22" width="225" height="7" rx="4" fill="white" opacity="0.2"/><text x="335" y="34" fill="#8b5cf6" font-size="13" font-weight="bold" font-family="Arial,sans-serif">75%</text><text x="20" y="52" fill="#6b7280" font-size="10" font-family="Arial,sans-serif">进度</text><text x="320" y="52" text-anchor="end" fill="#6b7280" font-size="10" font-family="Arial,sans-serif">目标 100%</text></svg>`
  },
  {
    id: 'progress_circular',
    name: '环形进度',
    category: 'progress',
    tags: ["进度", "环形", "ring", "donut", "粉色", "80%"],
    colorScheme: '#ec4899',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ec4899"/><stop offset="100%" style="stop-color:#f472b6"/></linearGradient></defs><rect width="120" height="120" fill="#fdf2f8"/><circle cx="60" cy="60" r="44" fill="none" stroke="#fce7f3" stroke-width="10"/><circle cx="60" cy="60" r="44" fill="none" stroke="url(#ringGrad)" stroke-width="10" stroke-linecap="round" stroke-dasharray="220.9 276.5" transform="rotate(-90 60 60)"/><circle cx="60" cy="60" r="32" fill="white" opacity="0.7"/><text x="60" y="56" text-anchor="middle" fill="#ec4899" font-size="18" font-weight="bold" font-family="Arial,sans-serif">80%</text><text x="60" y="70" text-anchor="middle" fill="#f9a8d4" font-size="9" font-family="Arial,sans-serif">完成度</text></svg>`
  },
  {
    id: 'timeline_milestone',
    name: '里程碑',
    category: 'progress',
    tags: ["时间线", "里程碑", "flag", "release", "绿色", "development"],
    colorScheme: '#16a34a',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect width="400" height="100" fill="#f0fdf4"/><line x1="30" y1="55" x2="370" y2="55" stroke="#86efac" stroke-width="2" stroke-dasharray="6,4"/><g transform="translate(50,20)"><line x1="0" y1="0" x2="0" y2="35" stroke="#16a34a" stroke-width="2"/><rect x="0" y="0" width="28" height="16" rx="2" fill="#16a34a"/><text x="14" y="11" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="Arial,sans-serif">Alpha</text><text x="0" y="55" text-anchor="middle" fill="#16a34a" font-size="9" font-family="Arial,sans-serif">v0.1</text></g><g transform="translate(150,20)"><line x1="0" y1="0" x2="0" y2="35" stroke="#16a34a" stroke-width="2"/><rect x="0" y="0" width="26" height="16" rx="2" fill="#16a34a"/><text x="13" y="11" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="Arial,sans-serif">Beta</text><text x="0" y="55" text-anchor="middle" fill="#16a34a" font-size="9" font-family="Arial,sans-serif">v0.8</text></g><g transform="translate(255,20)"><line x1="0" y1="0" x2="0" y2="35" stroke="#4ade80" stroke-width="2"/><rect x="0" y="0" width="22" height="16" rx="2" fill="#4ade80"/><text x="11" y="11" text-anchor="middle" fill="white" font-size="8" font-weight="bold" font-family="Arial,sans-serif">RC</text><text x="0" y="55" text-anchor="middle" fill="#4ade80" font-size="9" font-family="Arial,sans-serif">v0.9</text></g><g transform="translate(340,20)"><line x1="0" y1="0" x2="0" y2="35" stroke="#86efac" stroke-width="2"/><rect x="0" y="0" width="38" height="16" rx="2" fill="#86efac"/><text x="19" y="11" text-anchor="middle" fill="#14532d" font-size="8" font-weight="bold" font-family="Arial,sans-serif">Release</text><text x="0" y="55" text-anchor="middle" fill="#86efac" font-size="9" font-family="Arial,sans-serif">v1.0</text></g></svg>`
  },
  {
    id: 'progress_checklist',
    name: '清单进度',
    category: 'progress',
    tags: ["进度", "清单", "todo", "青色", "tasks"],
    colorScheme: '#0d9488',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 110" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="checkBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f0fdfa"/><stop offset="100%" style="stop-color:#ccfbf1"/></linearGradient></defs><rect width="400" height="110" fill="url(#checkBg)"/><rect x="20" y="18" width="360" height="24" rx="6" fill="white" opacity="0.8"/><rect x="20" y="18" width="360" height="24" rx="6" fill="none" stroke="#99f6e4" stroke-width="1"/><circle cx="40" cy="30" r="9" fill="#0d9488"/><path d="M35 30 L38 33 L45 27" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="58" y="35" fill="#0d9488" font-size="12" font-family="Arial,sans-serif">完成需求文档整理与评审</text><rect x="20" y="50" width="360" height="24" rx="6" fill="white" opacity="0.8"/><rect x="20" y="50" width="360" height="24" rx="6" fill="none" stroke="#99f6e4" stroke-width="1"/><circle cx="40" cy="62" r="9" fill="#0d9488"/><path d="M35 62 L38 65 L45 59" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="58" y="67" fill="#0d9488" font-size="12" font-family="Arial,sans-serif">完成UI设计稿并通过验收</text><rect x="20" y="82" width="360" height="24" rx="6" fill="white" opacity="0.8"/><rect x="20" y="82" width="360" height="24" rx="6" fill="none" stroke="#d1d5db" stroke-width="1"/><circle cx="40" cy="94" r="9" fill="none" stroke="#d1d5db" stroke-width="2"/><text x="58" y="99" fill="#9ca3af" font-size="12" font-family="Arial,sans-serif">前端开发与联调测试</text><text x="350" y="99" text-anchor="end" fill="#2dd4bf" font-size="10" font-family="Arial,sans-serif">进行中</text></svg>`
  }
]

// =============================================
// 10. 提示框与信息面板 (Callout Boxes)
// =============================================
export const SVG_CALLOUTS = [
  {
    id: 'callout_info',
    name: '信息提示',
    category: 'callouts',
    tags: ["信息", "蓝色", "notice"],
    colorScheme: '#2196F3',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="5" y="5" width="390" height="70" rx="12" fill="#E3F2FD" stroke="#BBDEFB" stroke-width="1"/><circle cx="40" cy="40" r="16" fill="#2196F3"/><text x="40" y="46" text-anchor="middle" fill="#FFFFFF" style="font-family:Arial, sans-serif;font-weight:bold;font-size:20px;">i</text><text x="70" y="45" style="font-family:'Microsoft YaHei', sans-serif;font-size:15px;fill:#0D47A1;">点击此处查看更多详细信息内容</text></svg>`
  },
  {
    id: 'callout_warning',
    name: '警告提示',
    category: 'callouts',
    tags: ["警告", "橙色", "alert"],
    colorScheme: '#FF9800',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="5" y="5" width="390" height="70" rx="12" fill="#FFF3E0" stroke="#FFE0B2" stroke-width="1"/><path d="M40 24 L54 48 L26 48 Z" fill="#FF9800"/><text x="40" y="44" text-anchor="middle" fill="#FFFFFF" style="font-family:Arial, sans-serif;font-weight:bold;font-size:14px;">!</text><text x="70" y="45" style="font-family:'Microsoft YaHei', sans-serif;font-size:15px;fill:#E65100;">温馨提示：请注意操作风险与安全</text></svg>`
  },
  {
    id: 'callout_success',
    name: '成功提示',
    category: 'callouts',
    tags: ["成功", "绿色", "done"],
    colorScheme: '#4CAF50',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="5" y="5" width="390" height="70" rx="12" fill="#E8F5E9" stroke="#C8E6C9" stroke-width="1"/><circle cx="40" cy="40" r="16" fill="#4CAF50"/><path d="M32 40 L38 46 L48 34" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="70" y="45" style="font-family:'Microsoft YaHei', sans-serif;font-size:15px;fill:#1B5E20;">恭喜您！操作已成功完成并保存</text></svg>`
  },
  {
    id: 'callout_tip',
    name: '小贴士',
    category: 'callouts',
    tags: ["提示", "紫色", "lightbulb"],
    colorScheme: '#9C27B0',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="5" y="5" width="390" height="70" rx="12" fill="#F3E5F5" stroke="#E1BEEF" stroke-width="1"/><circle cx="40" cy="40" r="16" fill="#9C27B0"/><path d="M40 28 Q46 28 46 34 Q46 38 43 40 L43 46 L37 46 L37 40 Q34 38 34 34 Q34 28 40 28 Z" fill="#FFFFFF"/><text x="70" y="45" style="font-family:'Microsoft YaHei', sans-serif;font-size:15px;fill:#4A148C;">小技巧：尝试使用快捷键提高效率</text></svg>`
  },
  {
    id: 'callout_quote_elegant',
    name: '优雅引用',
    category: 'callouts',
    tags: ["引用", "灰色", "优雅"],
    colorScheme: '#9E9E9E',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="0" y="0" width="400" height="100" fill="#FAFAFA"/><rect x="0" y="0" width="6" height="100" fill="#9E9E9E"/><text x="30" y="40" style="font-family:Georgia, serif;font-size:60px;fill:#E0E0E0;opacity:0.8;">“</text><text x="40" y="55" style="font-family:'Microsoft YaHei', sans-serif;font-size:16px;fill:#424242;font-style:italic;">美是到处都有的。对于我们的眼睛，</text><text x="40" y="80" style="font-family:'Microsoft YaHei', sans-serif;font-size:16px;fill:#424242;font-style:italic;">不是缺少美，而是缺少发现。</text></svg>`
  },
  {
    id: 'callout_note',
    name: '笔记卡片',
    category: 'callouts',
    tags: ["笔记", "黄色", "paper"],
    colorScheme: '#FBC02D',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="5" y="5" width="390" height="90" fill="#FFFDE7" stroke="#FFF9C4" stroke-width="1"/><line x1="40" y1="35" x2="360" y2="35" stroke="#E0E0E0" stroke-width="1"/><line x1="40" y1="60" x2="360" y2="60" stroke="#E0E0E0" stroke-width="1"/><line x1="40" y1="85" x2="360" y2="85" stroke="#E0E0E0" stroke-width="1"/><path d="M20 20 L28 20 L32 35 L16 35 Z" fill="#FBC02D"/><text x="50" y="30" style="font-family:'Microsoft YaHei', sans-serif;font-size:14px;fill:#F57F17;font-weight:bold;">学习笔记</text><text x="50" y="55" style="font-family:'Microsoft YaHei', sans-serif;font-size:14px;fill:#5D4037;">1. 核心概念理解与应用</text></svg>`
  },
  {
    id: 'callout_important',
    name: '重要提醒',
    category: 'callouts',
    tags: ["重要", "红色", "星级"],
    colorScheme: '#F44336',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="5" y="5" width="390" height="70" rx="8" fill="#FFEBEE" stroke="#FFCDD2" stroke-width="2"/><path d="M40 25 L43 33 L52 33 L45 38 L48 47 L40 42 L32 47 L35 38 L28 33 L37 33 Z" fill="#F44336"/><text x="70" y="46" style="font-family:'Microsoft YaHei', sans-serif;font-size:16px;fill:#B71C1C;font-weight:bold;">重要：截止日期前请务必提交申请</text></svg>`
  },
  {
    id: 'callout_idea',
    name: '创意灵感',
    category: 'callouts',
    tags: ["创意", "渐变", "creative"],
    colorScheme: '#FF6B35',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="grad_idea" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FF9800;stop-opacity:0.1" /><stop offset="100%" style="stop-color:#F44336;stop-opacity:0.1" /></linearGradient></defs><rect x="0" y="0" width="400" height="80" rx="40" fill="url(#grad_idea)"/><circle cx="40" cy="40" r="20" fill="#FFD600"/><path d="M40 30 L40 25 M50 40 L55 40 M40 50 L40 55 M30 40 L25 40" stroke="#FF6D00" stroke-width="2"/><text x="75" y="46" style="font-family:'Microsoft YaHei', sans-serif;font-size:16px;fill:#E65100;font-weight:bold;">灵感闪现：这是一个全新的设计思路</text></svg>`
  }
]

// =============================================
// 11. 数据可视化装饰 (Data Visualization)
// =============================================
export const SVG_DATAVIZ = [
  {
    id: 'dataviz_stat_card',
    name: '数据卡片',
    category: 'dataviz',
    tags: ["统计", "card", "数字"],
    colorScheme: '#2196F3',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="5" y="5" width="190" height="110" rx="10" fill="#FFFFFF" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.1))" stroke="#E3F2FD"/><text x="20" y="35" style="font-family:'Microsoft YaHei', sans-serif;font-size:14px;fill:#757575;">今日访问量</text><text x="20" y="75" style="font-family:Arial, sans-serif;font-size:32px;font-weight:bold;fill:#1976D2;">1,234</text><path d="M20 95 L30 85 L40 95" fill="none" stroke="#4CAF50" stroke-width="2"/><text x="45" y="97" style="font-family:Arial, sans-serif;font-size:12px;fill:#4CAF50;">+12.5%</text></svg>`
  },
  {
    id: 'dataviz_pie_simple',
    name: '简约饼图',
    category: 'dataviz',
    tags: ["图表", "饼图", "distribution"],
    colorScheme: '#42A5F5',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M100 75 L100 25 A50 50 0 0 1 147 91 Z" fill="#42A5F5"/><path d="M100 75 L147 91 A50 50 0 0 1 70 115 Z" fill="#66BB6A"/><path d="M100 75 L70 115 A50 50 0 0 1 100 25 Z" fill="#FFA726"/><circle cx="160" cy="30" r="5" fill="#42A5F5"/><text x="170" y="34" style="font-family:Arial;font-size:10px;">40%</text><circle cx="160" cy="50" r="5" fill="#66BB6A"/><text x="170" y="54" style="font-family:Arial;font-size:10px;">35%</text><circle cx="160" cy="70" r="5" fill="#FFA726"/><text x="170" y="74" style="font-family:Arial;font-size:10px;">25%</text></svg>`
  },
  {
    id: 'dataviz_bar_chart',
    name: '柱状装饰',
    category: 'dataviz',
    tags: ["柱状", "图表", "growth"],
    colorScheme: '#FF6B35',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="bar_grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2196F3"/><stop offset="100%" stop-color="#64B5F6"/></linearGradient></defs><rect x="40" y="50" width="30" height="60" rx="4" fill="url(#bar_grad)" opacity="0.6"/><rect x="110" y="30" width="30" height="80" rx="4" fill="url(#bar_grad)" opacity="0.8"/><rect x="180" y="65" width="30" height="45" rx="4" fill="url(#bar_grad)" opacity="0.5"/><rect x="250" y="20" width="30" height="90" rx="4" fill="url(#bar_grad)"/><rect x="320" y="40" width="30" height="70" rx="4" fill="url(#bar_grad)" opacity="0.7"/><line x1="20" y1="110" x2="380" y2="110" stroke="#EEEEEE" stroke-width="2"/></svg>`
  },
  {
    id: 'dataviz_number_circle',
    name: '数字圆环',
    category: 'dataviz',
    tags: ["circle", "百分比", "kpi"],
    colorScheme: '#FF6B35',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><circle cx="75" cy="75" r="60" fill="none" stroke="#F5F5F5" stroke-width="12"/><circle cx="75" cy="75" r="60" fill="none" stroke="#00BCD4" stroke-width="12" stroke-dasharray="376.8" stroke-dashoffset="3.7" transform="rotate(-90 75 75)" stroke-linecap="round"/><text x="75" y="85" text-anchor="middle" style="font-family:Arial, sans-serif;font-size:36px;font-weight:bold;fill:#0097A7;">99%</text></svg>`
  },
  {
    id: 'dataviz_comparison',
    name: '对比箭头',
    category: 'dataviz',
    tags: ["对比", "箭头", "growth"],
    colorScheme: '#4CAF50',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="20" y="20" width="100" height="40" rx="20" fill="#F5F5F5"/><text x="70" y="46" text-anchor="middle" style="font-family:Arial;font-size:18px;fill:#9E9E9E;">120</text><path d="M140 40 L240 40 M230 30 L245 40 L230 50" fill="none" stroke="#4CAF50" stroke-width="3"/><rect x="260" y="20" width="120" height="40" rx="20" fill="#E8F5E9"/><text x="320" y="46" text-anchor="middle" style="font-family:Arial;font-size:22px;font-weight:bold;fill:#2E7D32;">350 ↑</text></svg>`
  },
  {
    id: 'dataviz_trend_line',
    name: '趋势折线',
    category: 'dataviz',
    tags: ["趋势", "线条", "growth"],
    colorScheme: '#2196F3',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M0 100 L80 80 L160 90 L240 40 L320 50 L400 20 L400 120 L0 120 Z" fill="#E3F2FD"/><polyline points="0,100 80,80 160,90 240,40 320,50 400,20" fill="none" stroke="#2196F3" stroke-width="3"/><circle cx="80" cy="80" r="4" fill="#FFFFFF" stroke="#2196F3" stroke-width="2"/><circle cx="240" cy="40" r="4" fill="#FFFFFF" stroke="#2196F3" stroke-width="2"/><circle cx="400" cy="20" r="4" fill="#FFFFFF" stroke="#2196F3" stroke-width="2"/></svg>`
  },
  {
    id: 'dataviz_rating_stars',
    name: '星级评分',
    category: 'dataviz',
    tags: ["评分", "stars", "review"],
    colorScheme: '#FFC107',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M20 5 L24 15 L35 15 L26 22 L29 32 L20 26 L11 32 L14 22 L5 15 L16 15 Z" fill="#FFC107"/><path d="M55 5 L59 15 L70 15 L61 22 L64 32 L55 26 L46 32 L49 22 L40 15 L51 15 Z" fill="#FFC107"/><path d="M90 5 L94 15 L105 15 L96 22 L99 32 L90 26 L81 32 L84 22 L75 15 L86 15 Z" fill="#FFC107"/><path d="M125 5 L129 15 L140 15 L131 22 L134 32 L125 26 L116 32 L119 22 L110 15 L121 15 Z" fill="#FFC107"/><path d="M160 5 L164 15 L175 15 L166 22 L169 32 L160 26 L151 32 L154 22 L145 15 L156 15 Z" fill="none" stroke="#FFC107" stroke-width="2"/></svg>`
  },
  {
    id: 'dataviz_percentage_bar',
    name: '百分比条',
    category: 'dataviz',
    tags: ["进度", "柱状", "percent"],
    colorScheme: '#2196F3',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="0" y="20" width="400" height="12" rx="6" fill="#F5F5F5"/><rect x="0" y="20" width="312" height="12" rx="6" fill="#2196F3"/><text x="312" y="15" text-anchor="middle" style="font-family:Arial;font-size:12px;fill:#2196F3;font-weight:bold;">78%</text><text x="0" y="15" style="font-family:'Microsoft YaHei', sans-serif;font-size:12px;fill:#757575;">项目进度</text></svg>`
  }
]

// =============================================
// 12. 箭头与连接器 (Arrows & Connectors)
// =============================================
export const SVG_ARROWS = [
  {
    id: 'arrow_curved_right',
    name: '弧形右箭头',
    category: 'arrows',
    tags: ["箭头", "curved", "渐变", "柔美"],
    colorScheme: '#FF6B35',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="grad_curved_arrow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FF8C00;stop-opacity:1" /><stop offset="100%" style="stop-color:#FF4500;stop-opacity:1" /></linearGradient></defs><path d="M20,50 Q100,50 150,40 T360,40" fill="none" stroke="url(#grad_curved_arrow)" stroke-width="6" stroke-linecap="round" /><path d="M360,40 L340,25 L340,55 Z" fill="url(#grad_curved_arrow)" /></svg>`
  },
  {
    id: 'arrow_flow_down',
    name: '向下流程箭头',
    category: 'arrows',
    tags: ["箭头", "down", "bold", "现代", "蓝色"],
    colorScheme: '#007AFF',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><filter id="dropShadow_flow"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.2"/></filter></defs><path d="M70,10 L130,10 L130,50 L160,50 L100,90 L40,50 L70,50 Z" fill="#007AFF" stroke="#ffffff" stroke-width="2" style="filter:url(#dropShadow_flow)" /></svg>`
  },
  {
    id: 'arrow_cycle',
    name: '循环箭头',
    category: 'arrows',
    tags: ["箭头", "循环", "loop", "recycle", "青色"],
    colorScheme: '#009688',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><g transform="translate(100,100)"><path d="M0,-80 A80,80 0 0,1 69.28,-40" fill="none" stroke="#009688" stroke-width="8" stroke-linecap="round" /><path d="M69.28,-40 L75,-55 L85,-35 Z" fill="#009688" transform="rotate(10)" /><path d="M0,-80 A80,80 0 0,1 69.28,-40" fill="none" stroke="#009688" stroke-width="8" stroke-linecap="round" transform="rotate(120)" /><path d="M69.28,-40 L75,-55 L85,-35 Z" fill="#009688" transform="rotate(130)" /><path d="M0,-80 A80,80 0 0,1 69.28,-40" fill="none" stroke="#009688" stroke-width="8" stroke-linecap="round" transform="rotate(240)" /><path d="M69.28,-40 L75,-55 L85,-35 Z" fill="#009688" transform="rotate(250)" /></g></svg>`
  },
  {
    id: 'arrow_branch',
    name: '分支连接',
    category: 'arrows',
    tags: ["箭头", "分支", "split", "connect", "紫色"],
    colorScheme: '#9C27B0',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><circle cx="30" cy="60" r="8" fill="#673AB7" /><circle cx="370" cy="20" r="6" fill="#9575CD" /><circle cx="370" cy="60" r="6" fill="#9575CD" /><circle cx="370" cy="100" r="6" fill="#9575CD" /><path d="M38,60 L100,60 C150,60 150,20 200,20 L360,20" fill="none" stroke="#673AB7" stroke-width="3" stroke-dasharray="5,3" /><path d="M38,60 L360,60" fill="none" stroke="#673AB7" stroke-width="3" stroke-dasharray="5,3" /><path d="M38,60 L100,60 C150,60 150,100 200,100 L360,100" fill="none" stroke="#673AB7" stroke-width="3" stroke-dasharray="5,3" /></svg>`
  },
  {
    id: 'arrow_process_flow',
    name: '流程指引',
    category: 'arrows',
    tags: ["箭头", "流程", "flowchart", "steps"],
    colorScheme: '#4CAF50',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="10" y="20" width="80" height="40" rx="8" fill="#4CAF50" /><rect x="160" y="20" width="80" height="40" rx="8" fill="#2196F3" /><rect x="310" y="20" width="80" height="40" rx="8" fill="#FF9800" /><path d="M100,40 L150,40" stroke="#555" stroke-width="2" marker-end="url(#arrowhead_proc)" /><path d="M250,40 L300,40" stroke="#555" stroke-width="2" marker-end="url(#arrowhead_proc)" /><defs><marker id="arrowhead_proc" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#555" /></marker></defs></svg>`
  },
  {
    id: 'arrow_hand_drawn',
    name: '手绘箭头',
    category: 'arrows',
    tags: ["箭头", "手绘", "sketch", "doodle"],
    colorScheme: '#333333',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M20,30 C50,25 80,35 110,30 C150,24 190,36 230,30 C270,24 310,35 360,30" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round" style="stroke-linejoin:round;" /><path d="M340,15 C350,20 360,30 360,30 C360,30 350,40 335,45" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round" style="stroke-linejoin:round;" /></svg>`
  }
]

// =============================================
// 13. 渐变背景 (Gradient Backgrounds)
// =============================================
export const SVG_GRADIENTS = [
  {
    id: 'gradient_aurora',
    name: '极光渐变',
    category: 'gradients',
    tags: ["背景", "渐变", "极光", "深色"],
    colorScheme: '#00ff88',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect width="400" height="200" fill="#1a1a2e" /><circle cx="100" cy="50" r="150" fill="url(#grad_aurora_1)" style="opacity:0.6" /><circle cx="300" cy="150" r="180" fill="url(#grad_aurora_2)" style="opacity:0.5" /><defs><radialGradient id="grad_aurora_1"><stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" /><stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:0" /></radialGradient><radialGradient id="grad_aurora_2"><stop offset="0%" style="stop-color:#bd00ff;stop-opacity:1" /><stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:0" /></radialGradient></defs></svg>`
  },
  {
    id: 'gradient_sunset_mesh',
    name: '日落网格',
    category: 'gradients',
    tags: ["背景", "渐变", "日落", "warm", "网格"],
    colorScheme: '#FF6A88',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect width="400" height="200" fill="#FF9A8B" /><circle cx="0" cy="200" r="250" fill="url(#grad_sunset_1)" /><circle cx="400" cy="0" r="200" fill="url(#grad_sunset_2)" /><defs><radialGradient id="grad_sunset_1"><stop offset="0%" style="stop-color:#FF6A88;stop-opacity:1" /><stop offset="100%" style="stop-color:#FF9A8B;stop-opacity:0" /></radialGradient><radialGradient id="grad_sunset_2"><stop offset="0%" style="stop-color:#FF99AC;stop-opacity:1" /><stop offset="100%" style="stop-color:#FFD700;stop-opacity:0" /></radialGradient></defs></svg>`
  },
  {
    id: 'gradient_ocean_deep',
    name: '深海渐变',
    category: 'gradients',
    tags: ["背景", "渐变", "海洋", "蓝色", "waves"],
    colorScheme: '#2c5364',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="grad_ocean" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#0f2027;stop-opacity:1" /><stop offset="100%" style="stop-color:#2c5364;stop-opacity:1" /></linearGradient></defs><rect width="400" height="200" fill="url(#grad_ocean)" /><path d="M0,150 Q100,120 200,150 T400,150 V200 H0 Z" fill="#ffffff" style="opacity:0.05" /><path d="M0,170 Q100,140 200,170 T400,170 V200 H0 Z" fill="#ffffff" style="opacity:0.1" /></svg>`
  },
  {
    id: 'gradient_rose_gold',
    name: '玫瑰金',
    category: 'gradients',
    tags: ["背景", "渐变", "金属", "luxury", "rose gold"],
    colorScheme: '#B76E79',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="grad_rose_gold" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#B76E79;stop-opacity:1" /><stop offset="25%" style="stop-color:#E0BFB8;stop-opacity:1" /><stop offset="50%" style="stop-color:#B76E79;stop-opacity:1" /><stop offset="75%" style="stop-color:#E0BFB8;stop-opacity:1" /><stop offset="100%" style="stop-color:#B76E79;stop-opacity:1" /></linearGradient></defs><rect width="400" height="200" fill="url(#grad_rose_gold)" /></svg>`
  },
  {
    id: 'gradient_neon_glow',
    name: '霓虹发光',
    category: 'gradients',
    tags: ["背景", "渐变", "霓虹", "cyberpunk", "发光"],
    colorScheme: '#00FFFF',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect width="400" height="200" fill="#050505" /><circle cx="80" cy="100" r="100" fill="url(#grad_neon_cyan)" /><circle cx="320" cy="100" r="100" fill="url(#grad_neon_magenta)" /><defs><radialGradient id="grad_neon_cyan"><stop offset="0%" style="stop-color:#00FFFF;stop-opacity:0.6" /><stop offset="100%" style="stop-color:#050505;stop-opacity:0" /></radialGradient><radialGradient id="grad_neon_magenta"><stop offset="0%" style="stop-color:#FF00FF;stop-opacity:0.6" /><stop offset="100%" style="stop-color:#050505;stop-opacity:0" /></radialGradient></defs></svg>`
  },
  {
    id: 'gradient_soft_pastel',
    name: '柔和粉彩',
    category: 'gradients',
    tags: ["背景", "渐变", "粉彩", "柔和", "cute"],
    colorScheme: '#ee9ca7',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="grad_pastel" x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="0%" style="stop-color:#ffdde1;stop-opacity:1" /><stop offset="50%" style="stop-color:#ee9ca7;stop-opacity:1" /><stop offset="100%" style="stop-color:#a7bfe8;stop-opacity:1" /></linearGradient></defs><rect width="400" height="200" fill="url(#grad_pastel)" /></svg>`
  }
]


// =============================================
// 14. 中国风文化 (Chinese Cultural)
// =============================================
export const SVG_CHINESE = [
  {
    id: 'chinese_paper_cut',
    name: '剪纸窗花',
    category: 'chinese',
    tags: ["传统", "窗花", "红色", "喜庆"],
    colorScheme: '#E60012',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><radialGradient id="cutGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ff4d4d"/><stop offset="100%" stop-color="#E60012"/></radialGradient></defs><g transform="translate(100,100)"><path d="M0,-90 L15,-40 L60,-70 L40,-15 L90,0 L40,15 L60,70 L15,40 L0,90 L-15,40 L-60,70 L-40,15 L-90,0 L-40,-15 L-60,-70 L-15,-40 Z" fill="url(#cutGrad)"/><path d="M0,-50 L10,-20 L40,-40 L20,-10 L50,0 L20,10 L40,40 L10,20 L0,50 L-10,20 L-40,40 L-20,10 L-50,0 L-20,-10 L-40,-40 L-10,-20 Z" fill="white" opacity="0.6"/><circle cx="0" cy="0" r="8" fill="white"/></g></svg>`
  },
  {
    id: 'chinese_knot',
    name: '中国结',
    category: 'chinese',
    tags: ["吉祥", "平安", "手工", "红色"],
    colorScheme: '#D32F2F',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M75,10 L95,30 M75,10 L55,30 M40,45 Q40,30 55,30 L95,30 Q110,30 110,45 L110,85 Q110,100 95,100 L55,100 Q40,100 40,85 Z" fill="none" stroke="#D32F2F" stroke-width="8"/><path d="M75,30 L75,100 M40,65 L110,65" stroke="#D32F2F" stroke-width="8"/><path d="M30,65 Q10,65 10,85 Q10,105 30,105 M120,65 Q140,65 140,85 Q140,105 120,105" fill="none" stroke="#D32F2F" stroke-width="6"/><path d="M75,100 L75,160 M60,160 L90,160 M60,170 L90,170 M60,180 L90,180 M75,160 L75,195" stroke="#D32F2F" stroke-width="4"/></svg>`
  },
  {
    id: 'chinese_seal',
    name: '印章方框',
    category: 'chinese',
    tags: ["金石", "书法", "文化", "篆刻"],
    colorScheme: '#B71C1C',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M12,15 L105,12 L108,105 L15,108 Z M25,25 L28,95 L95,92 L92,28 Z" fill="#B71C1C"/><path d="M40,40 L45,80 M60,40 L60,80 M75,40 L80,80" stroke="#B71C1C" stroke-width="5" stroke-linecap="round" opacity="0.8"/></svg>`
  },
  {
    id: 'chinese_ink_bamboo',
    name: '水墨竹叶',
    category: 'chinese',
    tags: ["水墨", "君子", "清雅", "黑色"],
    colorScheme: '#212121',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M100,150 Q110,80 105,0 M220,150 Q210,70 215,20 M105,70 L140,60 M105,70 L135,90 M215,60 L260,50 M215,60 L255,85" stroke="#212121" stroke-width="5" fill="none" opacity="0.9"/><path d="M140,60 L180,55 Q160,65 140,60 Z M135,90 L175,105 Q155,95 135,90 Z M260,50 L300,45 Q280,55 260,50 Z M255,85 L295,100 Q275,90 255,85 Z" fill="#212121"/></svg>`
  },
  {
    id: 'chinese_cloud_band',
    name: '祥云纹带',
    category: 'chinese',
    tags: ["吉祥", "如意", "云纹", "金色"],
    colorScheme: '#D4AF37',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M20,40 Q0,40 0,25 Q0,10 20,10 Q40,10 40,25 Q40,40 25,40 Q15,40 15,30 M100,40 Q80,40 80,25 Q80,10 100,10 Q120,10 120,25 Q120,40 105,40 Q95,40 95,30 M180,40 Q160,40 160,25 Q160,10 180,10 Q200,10 200,25 Q200,40 185,40 Q175,40 175,30 M260,40 Q240,40 240,25 Q240,10 260,10 Q280,10 280,25 Q280,40 265,40 Q255,40 255,30 M340,40 Q320,40 320,25 Q320,10 340,10 Q360,10 360,25 Q360,40 345,40 Q335,40 335,30" fill="none" stroke="#D4AF37" stroke-width="3"/><path d="M40,25 L80,25 M120,25 L160,25 M200,25 L240,25 M280,25 L320,25" stroke="#D4AF37" stroke-width="1" stroke-dasharray="4 2"/></svg>`
  },
  {
    id: 'chinese_lattice',
    name: '中式窗棂',
    category: 'chinese',
    tags: ["建筑", "古典", "园林", "深褐"],
    colorScheme: '#3E2723',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="0" y="0" width="400" height="100" fill="none" stroke="#3E2723" stroke-width="4"/><path d="M0,50 L400,50 M100,0 L100,100 M200,0 L200,100 M300,0 L300,100 M0,0 L100,50 L0,100 M100,0 L200,50 L100,100 M200,0 L300,50 L200,100 M300,0 L400,50 L300,100" fill="none" stroke="#3E2723" stroke-width="2"/><path d="M50,0 L50,100 M150,0 L150,100 M250,0 L250,100 M350,0 L350,100" stroke="#3E2723" stroke-width="1" opacity="0.5"/></svg>`
  },
  {
    id: 'chinese_ruyi',
    name: '如意纹',
    category: 'chinese',
    tags: ["如意", "边框", "华丽", "金色"],
    colorScheme: '#FFD700',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 50" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="ruyiGold"><stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#B8860B"/></linearGradient></defs><path d="M20,45 Q0,45 0,25 Q0,5 20,5 Q40,5 40,25 Q40,45 20,45 M20,15 Q12,15 12,25 Q12,35 20,35 Q28,35 28,25 Q28,15 20,15" fill="url(#ruyiGold)"/><path d="M60,45 Q40,45 40,25 Q40,5 60,5 Q80,5 80,25 Q80,45 60,45 M60,15 Q52,15 52,25 Q52,35 60,35 Q68,35 68,25 Q68,15 60,15" fill="url(#ruyiGold)" transform="translate(40,0)"/><path d="M140,45 Q120,45 120,25 Q120,5 140,5 Q160,5 160,25 Q160,45 140,45 M140,15 Q132,15 132,25 Q132,35 140,35 Q148,35 148,25 Q148,15 140,15" fill="url(#ruyiGold)" transform="translate(80,0)"/><path d="M220,45 Q200,45 200,25 Q200,5 220,5 Q240,5 240,25 Q240,45 220,45 M220,15 Q212,15 212,25 Q212,35 220,35 Q228,35 228,25 Q228,15 220,15" fill="url(#ruyiGold)" transform="translate(120,0)"/></svg>`
  },
  {
    id: 'chinese_dragon_frame',
    name: '龙纹边框',
    category: 'chinese',
    tags: ["龙纹", "尊贵", "边框", "红金"],
    colorScheme: '#FFAB00',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M10,60 L10,10 L60,10 M240,10 L290,10 L290,60 M290,140 L290,190 L240,190 M60,190 L10,190 L10,140" fill="none" stroke="#B71C1C" stroke-width="6"/><path d="M15,15 Q30,5 50,15 Q70,25 50,35 Q30,45 15,35 Z" fill="#FFAB00"/><path d="M285,15 Q270,5 250,15 Q230,25 250,35 Q270,45 285,35 Z" fill="#FFAB00"/><path d="M285,185 Q270,195 250,185 Q230,175 250,165 Q270,155 285,165 Z" fill="#FFAB00"/><path d="M15,185 Q30,195 50,185 Q70,175 50,165 Q30,155 15,165 Z" fill="#FFAB00"/></svg>`
  }
]

// =============================================
// 15. 手绘涂鸦 (Hand-drawn & Sketch)
// =============================================
export const SVG_SKETCH = [
  {
    id: 'sketch_doodle_border',
    name: '涂鸦边框',
    category: 'sketch',
    tags: ["手绘", "边框", "涂鸦", "黑白"],
    colorScheme: '#000000',
    svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M10,10 C50,8 150,12 290,10 C292,50 288,150 290,190 C250,192 50,188 10,190 C8,150 12,50 10,10 Z" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13,13 C53,11 153,15 287,13 C289,53 285,153 287,187 C247,189 47,185 13,187 C11,147 15,47 13,13 Z" fill="none" stroke="#000000" stroke-width="1" stroke-opacity="0.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'sketch_underline_wave',
    name: '手绘波浪线',
    category: 'sketch',
    tags: ["手绘", "分割线", "波浪", "强调"],
    colorScheme: '#FF4D4F',
    svg: `<svg viewBox="0 0 400 30" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M10,15 Q30,5 50,15 T90,15 T130,15 T170,15 T210,15 T250,15 T290,15 T330,15 T370,15 T390,15" fill="none" stroke="#FF4D4F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'sketch_circle_highlight',
    name: '手绘圆圈标注',
    category: 'sketch',
    tags: ["手绘", "圈注", "重点", "红色"],
    colorScheme: '#FF4D4F',
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M60,10 C90,10 110,30 110,60 C110,95 85,110 60,110 C30,110 10,90 10,60 C10,35 35,15 55,12" fill="none" stroke="#FF4D4F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'sketch_arrow_curved',
    name: '手绘弯箭头',
    category: 'sketch',
    tags: ["手绘", "箭头", "指引", "黑色"],
    colorScheme: '#000000',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M20,80 Q90,90 160,30" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round"/><path d="M140,25 L165,28 L160,55" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'sketch_star_burst',
    name: '手绘星爆',
    category: 'sketch',
    tags: ["手绘", "爆炸", "促销", "背景"],
    colorScheme: '#FFC107',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M100,20 L120,70 L170,60 L140,100 L180,140 L120,130 L100,180 L80,130 L20,140 L60,100 L30,60 L80,70 Z" fill="#FFC107" stroke="#000000" stroke-width="2" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'sketch_banner_ribbon',
    name: '手绘丝带',
    category: 'sketch',
    tags: ["手绘", "标题", "丝带", "装饰"],
    colorScheme: '#008080',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M50,20 L350,20 L330,60 L70,60 Z" fill="none" stroke="#008080" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M50,20 L20,20 L10,40 L20,60 L70,60" fill="none" stroke="#008080" stroke-width="2" stroke-dasharray="4,2"/><path d="M350,20 L380,20 L390,40 L380,60 L330,60" fill="none" stroke="#008080" stroke-width="2" stroke-dasharray="4,2"/></svg>`
  },
  {
    id: 'sketch_thought_bubble',
    name: '手绘思考泡',
    category: 'sketch',
    tags: ["手绘", "气泡", "思考", "对话框"],
    colorScheme: '#E1F5FE',
    svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M50,100 Q40,60 80,50 Q100,20 150,30 Q200,20 220,50 Q260,60 250,100 Q270,140 220,150 Q180,180 130,150 Q80,160 50,100 Z" fill="#E1F5FE" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="80" cy="170" r="8" fill="#E1F5FE" stroke="#000000" stroke-width="2"/><circle cx="60" cy="185" r="5" fill="#E1F5FE" stroke="#000000" stroke-width="2"/></svg>`
  },
  {
    id: 'sketch_checkbox',
    name: '手绘复选框',
    category: 'sketch',
    tags: ["手绘", "打钩", "清单", "完成"],
    colorScheme: '#4CAF50',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="20" y="20" width="60" height="60" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" rx="2"/><path d="M35,50 L50,70 L90,20" fill="none" stroke="#4CAF50" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  }
]

// =============================================
// 16. 社交卡片 (Social Cards)
// =============================================
export const SVG_CARDS = [
  {
    id: 'card_profile',
    name: '个人名片',
    category: 'cards',
    tags: ["卡片", "名片", "简介", "商务"],
    colorScheme: '#2196F3',
    svg: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="2" y="2" width="396" height="116" rx="10" fill="#FFFFFF" stroke="#E0E0E0" stroke-width="1"/><circle cx="60" cy="60" r="35" fill="#E3F2FD"/><path d="M45,75 C45,65 52,60 60,60 C68,60 75,65 75,75" fill="#2196F3"/><circle cx="60" cy="50" r="8" fill="#2196F3"/><rect x="110" y="35" width="150" height="16" rx="4" fill="#212121"/><rect x="110" y="60" width="200" height="10" rx="2" fill="#9E9E9E"/><rect x="110" y="75" width="120" height="10" rx="2" fill="#BDBDBD"/></svg>`
  },
  {
    id: 'card_quote',
    name: '金句卡片',
    category: 'cards',
    tags: ["引用", "金句", "排版", "优雅"],
    colorScheme: '#FF9800',
    svg: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="2" y="2" width="396" height="146" rx="0" fill="#FFF8E1" stroke="#FF9800" stroke-width="2"/><text x="20" y="50" font-family="serif" font-size="60" fill="#FFD180">“</text><rect x="50" y="50" width="300" height="8" rx="2" fill="#424242"/><rect x="50" y="70" width="280" height="8" rx="2" fill="#424242"/><rect x="50" y="90" width="200" height="8" rx="2" fill="#424242"/><text x="350" y="130" font-family="serif" font-size="60" fill="#FFD180" text-anchor="end">”</text><rect x="280" y="110" width="80" height="6" rx="2" fill="#FF9800"/></svg>`
  },
  {
    id: 'card_stat_duo',
    name: '双数据卡',
    category: 'cards',
    tags: ["数据", "统计", "对比", "图表"],
    colorScheme: '#673AB7',
    svg: `<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="grad_card_stat" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#EDE7F6;stop-opacity:1" /><stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:1" /></linearGradient></defs><rect x="0" y="0" width="400" height="100" rx="8" fill="url(#grad_card_stat)"/><line x1="200" y1="20" x2="200" y2="80" stroke="#D1C4E9" stroke-width="1"/><text x="100" y="55" font-family="sans-serif" font-size="32" font-weight="bold" fill="#673AB7" text-anchor="middle">85%</text><text x="100" y="80" font-family="sans-serif" font-size="12" fill="#757575" text-anchor="middle">增长率</text><text x="300" y="55" font-family="sans-serif" font-size="32" font-weight="bold" fill="#673AB7" text-anchor="middle">12K</text><text x="300" y="80" font-family="sans-serif" font-size="12" fill="#757575" text-anchor="middle">新增用户</text></svg>`
  },
  {
    id: 'card_feature',
    name: '特性展示卡',
    category: 'cards',
    tags: ["功能", "列表", "图标", "详情"],
    colorScheme: '#3F51B5',
    svg: `<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="2" y="2" width="396" height="96" rx="8" fill="#FFFFFF" stroke="#E8EAF6" stroke-width="1"/><circle cx="50" cy="50" r="25" fill="#E8EAF6"/><path d="M40,50 L48,58 L60,42" fill="none" stroke="#3F51B5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="90" y="40" font-family="sans-serif" font-size="18" font-weight="bold" fill="#303F9F">核心优势</text><rect x="90" y="55" width="250" height="8" rx="2" fill="#9FA8DA" opacity="0.5"/><rect x="90" y="70" width="180" height="8" rx="2" fill="#9FA8DA" opacity="0.5"/></svg>`
  },
  {
    id: 'card_testimonial',
    name: '用户评价',
    category: 'cards',
    tags: ["评价", "评分", "信任", "口碑"],
    colorScheme: '#FFC107',
    svg: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="0" y="0" width="400" height="120" rx="8" fill="#FAFAFA"/><g transform="translate(20, 20)"><polygon points="10,1 12,7 19,7 13,11 15,17 10,13 5,17 7,11 1,7 8,7" fill="#FFC107"/><polygon points="35,1 37,7 44,7 38,11 40,17 35,13 30,17 32,11 26,7 33,7" fill="#FFC107"/><polygon points="60,1 62,7 69,7 63,11 65,17 60,13 55,17 57,11 51,7 58,7" fill="#FFC107"/><polygon points="85,1 87,7 94,7 88,11 90,17 85,13 80,17 82,11 76,7 83,7" fill="#FFC107"/><polygon points="110,1 112,7 119,7 113,11 115,17 110,13 105,17 107,11 101,7 108,7" fill="#FFC107"/></g><rect x="20" y="50" width="360" height="8" rx="2" fill="#BDBDBD"/><rect x="20" y="65" width="300" height="8" rx="2" fill="#BDBDBD"/><text x="20" y="100" font-family="sans-serif" font-size="12" fill="#757575">- 满意用户</text></svg>`
  },
  {
    id: 'card_pricing',
    name: '价格展示',
    category: 'cards',
    tags: ["价格", "套餐", "购买", "营销"],
    colorScheme: '#4CAF50',
    svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="0" y="0" width="300" height="200" rx="10" fill="#FFFFFF" stroke="#4CAF50" stroke-width="2"/><rect x="0" y="0" width="300" height="50" rx="8" fill="#E8F5E9"/><text x="150" y="32" font-family="sans-serif" font-size="18" font-weight="bold" fill="#2E7D32" text-anchor="middle">专业版</text><text x="150" y="90" font-family="sans-serif" font-size="36" font-weight="bold" fill="#4CAF50" text-anchor="middle">¥99</text><rect x="80" y="110" width="140" height="6" rx="2" fill="#BDBDBD"/><rect x="80" y="125" width="140" height="6" rx="2" fill="#BDBDBD"/><rect x="60" y="150" width="180" height="35" rx="17" fill="#4CAF50"/><text x="150" y="173" font-family="sans-serif" font-size="14" fill="#FFFFFF" text-anchor="middle">立即购买</text></svg>`
  },
  {
    id: 'card_event',
    name: '活动卡片',
    category: 'cards',
    tags: ["活动", "日历", "时间", "通知"],
    colorScheme: '#F44336',
    svg: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="2" y="2" width="396" height="116" rx="8" fill="#FFFFFF" stroke="#EEEEEE" stroke-width="1"/><rect x="20" y="20" width="80" height="80" rx="8" fill="#FFEBEE"/><text x="60" y="50" font-family="sans-serif" font-size="14" fill="#D32F2F" text-anchor="middle">12月</text><text x="60" y="85" font-family="sans-serif" font-size="28" font-weight="bold" fill="#D32F2F" text-anchor="middle">25</text><rect x="120" y="30" width="200" height="16" rx="4" fill="#212121"/><rect x="120" y="60" width="150" height="10" rx="2" fill="#757575"/><rect x="120" y="80" width="240" height="10" rx="2" fill="#BDBDBD"/></svg>`
  },
  {
    id: 'card_notification',
    name: '通知卡片',
    category: 'cards',
    tags: ["通知", "消息", "提醒", "弹窗"],
    colorScheme: '#03A9F4',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="0" y="0" width="400" height="80" rx="8" fill="#E1F5FE"/><circle cx="40" cy="40" r="20" fill="#03A9F4"/><path d="M40,30 C35,30 33,35 33,40 L33,45 L30,48 L50,48 L47,45 L47,40 C47,35 45,30 40,30" fill="#FFFFFF"/><rect x="80" y="25" width="200" height="12" rx="2" fill="#0277BD"/><rect x="80" y="45" width="280" height="10" rx="2" fill="#81D4FA"/></svg>`
  }
]

// =============================================
// 17. 编辑排版 (Editorial & Magazine)
// =============================================
export const SVG_EDITORIAL = [
  {
    id: 'editorial_drop_cap',
    name: '首字下沉框',
    category: 'editorial',
    tags: ["首字", "边框", "古典", "装饰"],
    colorScheme: '#D4AF37',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="editorial_drop_cap_grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" /><stop offset="100%" style="stop-color:#AA8C2C;stop-opacity:1" /></linearGradient></defs><rect x="2" y="2" width="96" height="96" fill="none" stroke="url(#editorial_drop_cap_grad)" stroke-width="4" /><rect x="12" y="12" width="76" height="76" fill="none" stroke="#D4AF37" stroke-width="1" stroke-dasharray="2,2" /><path d="M2,2 L12,12 M98,2 L88,12 M2,98 L12,88 M98,98 L88,88" stroke="#D4AF37" stroke-width="1" /></svg>`
  },
  {
    id: 'editorial_pull_quote',
    name: '拉引框',
    category: 'editorial',
    tags: ["引用", "排版", "简约", "重点"],
    colorScheme: '#666666',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="0" y="0" width="8" height="80" fill="#666666" /><path d="M30,20 Q30,45 50,45 L50,35 Q40,35 40,20 Z M60,20 Q60,45 80,45 L80,35 Q70,35 70,20 Z" fill="#999999" /></svg>`
  },
  {
    id: 'editorial_sidebar',
    name: '侧栏装饰',
    category: 'editorial',
    tags: ["侧边", "分割", "线条", "注释"],
    colorScheme: '#333333',
    svg: `<svg viewBox="0 0 30 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><line x1="15" y1="0" x2="15" y2="200" stroke="#333333" stroke-width="1" /><circle cx="15" cy="10" r="3" fill="#333333" /><circle cx="15" cy="190" r="3" fill="#333333" /><circle cx="15" cy="100" r="2" fill="#666666" /></svg>`
  },
  {
    id: 'editorial_section_break',
    name: '章节分隔',
    category: 'editorial',
    tags: ["分隔线", "章节", "优雅", "装饰"],
    colorScheme: '#000000',
    svg: `<svg viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><line x1="0" y1="20" x2="160" y2="20" stroke="#000000" stroke-width="1" /><line x1="240" y1="20" x2="400" y2="20" stroke="#000000" stroke-width="1" /><rect x="196" y="16" width="8" height="8" transform="rotate(45 200 20)" fill="#000000" /><rect x="180" y="17" width="6" height="6" transform="rotate(45 183 20)" fill="#666666" /><rect x="214" y="17" width="6" height="6" transform="rotate(45 217 20)" fill="#666666" /></svg>`
  },
  {
    id: 'editorial_page_number',
    name: '页码装饰',
    category: 'editorial',
    tags: ["页码", "圆形", "徽章", "数字"],
    colorScheme: '#333333',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><circle cx="50" cy="50" r="40" fill="none" stroke="#333333" stroke-width="2" /><circle cx="50" cy="50" r="34" fill="none" stroke="#333333" stroke-width="0.5" /><path d="M50,15 L50,25 M50,75 L50,85 M15,50 L25,50 M75,50 L85,50" stroke="#333333" stroke-width="1" /></svg>`
  },
  {
    id: 'editorial_column_rule',
    name: '分栏线',
    category: 'editorial',
    tags: ["分割线", "垂直", "花纹", "排版"],
    colorScheme: '#D4AF37',
    svg: `<svg viewBox="0 0 20 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><line x1="10" y1="0" x2="10" y2="90" stroke="#D4AF37" stroke-width="1" /><line x1="10" y1="110" x2="10" y2="200" stroke="#D4AF37" stroke-width="1" /><path d="M10,90 Q5,100 10,110 Q15,100 10,90" fill="#D4AF37" /></svg>`
  }
]

// =============================================
// 18. 自然植物 (Nature & Botanical)
// =============================================
export const SVG_BOTANICAL = [
  {
    id: 'botanical_leaf_border',
    name: '叶片边框',
    category: 'botanical',
    tags: ["植物", "边框", "叶子", "清新"],
    colorScheme: '#4CAF50',
    svg: `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M0,60 Q5,10 50,5 L70,5" fill="none" stroke="#4CAF50" stroke-width="2" /><ellipse cx="20" cy="20" rx="15" ry="8" transform="rotate(-45 20 20)" fill="#81C784" opacity="0.8" /><ellipse cx="50" cy="10" rx="15" ry="8" transform="rotate(10 50 10)" fill="#66BB6A" opacity="0.8" /><path d="M300,140 Q295,190 250,195 L230,195" fill="none" stroke="#4CAF50" stroke-width="2" /><ellipse cx="280" cy="180" rx="15" ry="8" transform="rotate(-45 280 180)" fill="#81C784" opacity="0.8" /></svg>`
  },
  {
    id: 'botanical_flower_garland',
    name: '花环装饰',
    category: 'botanical',
    tags: ["花朵", "装饰", "粉色", "可爱"],
    colorScheme: '#F48FB1',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M0,40 Q100,60 200,40 T400,40" fill="none" stroke="#A5D6A7" stroke-width="2" /><circle cx="50" cy="45" r="10" fill="#F48FB1" /><circle cx="150" cy="35" r="8" fill="#F06292" /><circle cx="250" cy="45" r="10" fill="#F48FB1" /><circle cx="350" cy="35" r="8" fill="#F06292" /><path d="M60,45 Q70,35 80,45" fill="none" stroke="#66BB6A" stroke-width="2" /></svg>`
  },
  {
    id: 'botanical_vine_divider',
    name: '藤蔓分隔线',
    category: 'botanical',
    tags: ["藤蔓", "分割线", "自然", "绿色"],
    colorScheme: '#66BB6A',
    svg: `<svg viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M0,20 Q50,0 100,20 T200,20 T300,20 T400,20" fill="none" stroke="#558B2F" stroke-width="1.5" /><path d="M40,15 Q50,5 60,15 Z" fill="#81C784" /><path d="M140,25 Q150,35 160,25 Z" fill="#81C784" /><path d="M240,15 Q250,5 260,15 Z" fill="#81C784" /><path d="M340,25 Q350,35 360,25 Z" fill="#81C784" /></svg>`
  },
  {
    id: 'botanical_wreath',
    name: '花圈',
    category: 'botanical',
    tags: ["花圈", "圆形", "植物", "标题"],
    colorScheme: '#43A047',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="botanical_wreath_grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#81C784;stop-opacity:1" /><stop offset="100%" style="stop-color:#2E7D32;stop-opacity:1" /></linearGradient></defs><circle cx="100" cy="100" r="80" fill="none" stroke="#8D6E63" stroke-width="1" /><circle cx="100" cy="20" r="8" fill="url(#botanical_wreath_grad)" /><circle cx="180" cy="100" r="8" fill="url(#botanical_wreath_grad)" /><circle cx="100" cy="180" r="8" fill="url(#botanical_wreath_grad)" /><circle cx="20" cy="100" r="8" fill="url(#botanical_wreath_grad)" /><path d="M100,20 A80,80 0 0,1 180,100" fill="none" stroke="#4CAF50" stroke-width="2" stroke-dasharray="5,5" /></svg>`
  },
  {
    id: 'botanical_branch',
    name: '树枝装饰',
    category: 'botanical',
    tags: ["树枝", "自然", "横向", "插图"],
    colorScheme: '#795548',
    svg: `<svg viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M20,80 Q200,20 380,50" fill="none" stroke="#795548" stroke-width="3" stroke-linecap="round" /><path d="M100,65 L110,40" fill="none" stroke="#795548" stroke-width="2" /><ellipse cx="110" cy="35" rx="10" ry="5" transform="rotate(-30 110 35)" fill="#66BB6A" /><path d="M250,45 L260,20" fill="none" stroke="#795548" stroke-width="2" /><ellipse cx="260" cy="15" rx="10" ry="5" transform="rotate(-10 260 15)" fill="#66BB6A" /></svg>`
  },
  {
    id: 'botanical_succulent',
    name: '多肉植物',
    category: 'botanical',
    tags: ["多肉", "盆栽", "可爱", "绿色"],
    colorScheme: '#009688',
    svg: `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><circle cx="75" cy="75" r="60" fill="#E0F2F1" /><path d="M75,75 Q45,35 75,15 Q105,35 75,75" fill="#80CBC4" stroke="#00695C" stroke-width="1" /><path d="M75,75 Q115,45 135,75 Q115,105 75,75" fill="#4DB6AC" stroke="#00695C" stroke-width="1" /><path d="M75,75 Q105,115 75,135 Q45,115 75,75" fill="#26A69A" stroke="#00695C" stroke-width="1" /><path d="M75,75 Q35,105 15,75 Q35,45 75,75" fill="#009688" stroke="#00695C" stroke-width="1" /></svg>`
  }
]

// =============================================
// 19. 科技代码 (Tech & Code)
// =============================================
export const SVG_TECH = [
  {
    id: 'tech_terminal',
    name: '终端窗口',
    category: 'tech',
    tags: ["代码", "窗口", "极客", "科技"],
    colorScheme: '#282C34',
    svg: `<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="0" y="0" width="400" height="120" rx="8" fill="#282C34" /><circle cx="20" cy="20" r="6" fill="#FF5F56" /><circle cx="40" cy="20" r="6" fill="#FFBD2E" /><circle cx="60" cy="20" r="6" fill="#27C93F" /><rect x="0" y="40" width="400" height="1" fill="#3E4451" /><rect x="20" y="60" width="150" height="10" rx="2" fill="#61AFEF" opacity="0.5" /><rect x="20" y="80" width="80" height="10" rx="2" fill="#98C379" opacity="0.5" /><rect x="110" y="80" width="10" height="14" fill="#ABB2BF" /></svg>`
  },
  {
    id: 'tech_code_bracket',
    name: '代码括号',
    category: 'tech',
    tags: ["代码", "符号", "编程", "开发"],
    colorScheme: '#61AFEF',
    svg: `<svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M100,20 Q60,20 60,60 L60,70 Q60,80 40,80 Q60,80 60,90 L60,100 Q60,140 100,140" fill="none" stroke="#61AFEF" stroke-width="8" stroke-linecap="round" /><path d="M200,20 Q240,20 240,60 L240,70 Q240,80 260,80 Q240,80 240,90 L240,100 Q240,140 200,140" fill="none" stroke="#61AFEF" stroke-width="8" stroke-linecap="round" /></svg>`
  },
  {
    id: 'tech_circuit',
    name: '电路板纹',
    category: 'tech',
    tags: ["电路", "连接", "电子", "科技"],
    colorScheme: '#00E676',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><circle cx="20" cy="40" r="4" fill="#00E676" /><circle cx="380" cy="40" r="4" fill="#00E676" /><polyline points="20,40 60,40 80,20 150,20 170,60 250,60 270,30 380,30" fill="none" stroke="#00E676" stroke-width="2" /><circle cx="150" cy="20" r="2" fill="#00E676" /><circle cx="250" cy="60" r="2" fill="#00E676" /></svg>`
  },
  {
    id: 'tech_binary',
    name: '二进制流',
    category: 'tech',
    tags: ["数据", "二进制", "流", "黑客"],
    colorScheme: '#00FF00',
    svg: `<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="tech_binary_grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#00FF00;stop-opacity:0.1" /><stop offset="50%" style="stop-color:#00FF00;stop-opacity:1" /><stop offset="100%" style="stop-color:#00FF00;stop-opacity:0.1" /></linearGradient></defs><rect x="0" y="0" width="400" height="60" fill="#000000" /><path d="M20,30 L380,30" stroke="url(#tech_binary_grad)" stroke-width="20" stroke-dasharray="10,10" /></svg>`
  },
  {
    id: 'tech_chip',
    name: '芯片图案',
    category: 'tech',
    tags: ["芯片", "CPU", "核心", "处理器"],
    colorScheme: '#333333',
    svg: `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="40" y="40" width="70" height="70" fill="#333333" /><rect x="55" y="55" width="40" height="40" fill="#444444" /><path d="M40,50 L20,50 M40,60 L20,60 M40,70 L20,70 M40,80 L20,80 M40,90 L20,90 M40,100 L20,100" stroke="#666666" stroke-width="2" /><path d="M110,50 L130,50 M110,60 L130,60 M110,70 L130,70 M110,80 L130,80 M110,90 L130,90 M110,100 L130,100" stroke="#666666" stroke-width="2" /><path d="M50,40 L50,20 M60,40 L60,20 M70,40 L70,20 M80,40 L80,20 M90,40 L90,20 M100,40 L100,20" stroke="#666666" stroke-width="2" /><path d="M50,110 L50,130 M60,110 L60,130 M70,110 L70,130 M80,110 L80,130 M90,110 L90,130 M100,110 L100,130" stroke="#666666" stroke-width="2" /></svg>`
  },
  {
    id: 'tech_keyboard',
    name: '键盘装饰',
    category: 'tech',
    tags: ["键盘", "按键", "输入", "外设"],
    colorScheme: '#E0E0E0',
    svg: `<svg viewBox="0 0 400 50" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="10" y="10" width="30" height="30" rx="4" fill="none" stroke="#333333" stroke-width="2" /><rect x="50" y="10" width="30" height="30" rx="4" fill="none" stroke="#333333" stroke-width="2" /><rect x="90" y="10" width="30" height="30" rx="4" fill="none" stroke="#333333" stroke-width="2" /><rect x="130" y="10" width="30" height="30" rx="4" fill="none" stroke="#333333" stroke-width="2" /><rect x="170" y="10" width="100" height="30" rx="4" fill="none" stroke="#333333" stroke-width="2" /><rect x="280" y="10" width="30" height="30" rx="4" fill="#333333" /></svg>`
  }
]

// =============================================
// 20. 音乐音频 (Music & Audio)
// =============================================
export const SVG_MUSIC = [
  {
    id: 'music_equalizer',
    name: '音频均衡器',
    category: 'music',
    tags: ["音频", "音乐", "均衡器", "动感"],
    colorScheme: '#8A2BE2',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="grad_eq" x1="0%" y1="100%" x2="0%" y2="0%"><stop offset="0%" style="stop-color:#4B0082;stop-opacity:1" /><stop offset="100%" style="stop-color:#8A2BE2;stop-opacity:1" /></linearGradient></defs><rect x="10" y="30" width="35" height="50" rx="5" style="fill:url(#grad_eq)" /><rect x="60" y="10" width="35" height="70" rx="5" style="fill:url(#grad_eq)" /><rect x="110" y="40" width="35" height="40" rx="5" style="fill:url(#grad_eq)" /><rect x="160" y="20" width="35" height="60" rx="5" style="fill:url(#grad_eq)" /><rect x="210" y="50" width="35" height="30" rx="5" style="fill:url(#grad_eq)" /><rect x="260" y="15" width="35" height="65" rx="5" style="fill:url(#grad_eq)" /><rect x="310" y="35" width="35" height="45" rx="5" style="fill:url(#grad_eq)" /><rect x="360" y="25" width="35" height="55" rx="5" style="fill:url(#grad_eq)" /></svg>`
  },
  {
    id: 'music_waveform',
    name: '音频波形',
    category: 'music',
    tags: ["波形", "声波", "节奏", "蓝色"],
    colorScheme: '#00BFFF',
    svg: `<svg viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="grad_wave" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#1E90FF;stop-opacity:1" /><stop offset="100%" style="stop-color:#00BFFF;stop-opacity:1" /></linearGradient></defs><path d="M0 30 Q 10 5, 20 30 T 40 30 T 60 30 T 80 30 T 100 30 T 120 30 T 140 30 T 160 30 T 180 30 T 200 30 T 220 30 T 240 30 T 260 30 T 280 30 T 300 30 T 320 30 T 340 30 T 360 30 T 380 30 T 400 30" style="fill:none;stroke:url(#grad_wave);stroke-width:3;" /><path d="M0 30 L10 10 L20 50 L30 20 L40 40 L50 5 L60 55 L70 25 L80 35 L90 15 L100 45 L110 30 L120 10 L130 50 L140 20 L150 40 L160 5 L170 55 L180 25 L190 35 L200 15 L210 45 L220 30 L230 10 L240 50 L250 20 L260 40 L270 5 L280 55 L290 25 L300 35 L310 15 L320 45 L330 30 L340 10 L350 50 L360 20 L370 40 L380 5 L390 55 L400 30" style="fill:none;stroke:url(#grad_wave);stroke-width:2;opacity:0.5" /></svg>`
  },
  {
    id: 'music_vinyl',
    name: '黑胶唱片',
    category: 'music',
    tags: ["复古", "黑胶", "唱片", "经典"],
    colorScheme: '#FF4500',
    svg: `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><circle cx="75" cy="75" r="70" style="fill:#1A1A1A;" /><circle cx="75" cy="75" r="60" style="fill:none;stroke:#333;stroke-width:1;" /><circle cx="75" cy="75" r="50" style="fill:none;stroke:#333;stroke-width:1;" /><circle cx="75" cy="75" r="40" style="fill:none;stroke:#333;stroke-width:1;" /><circle cx="75" cy="75" r="25" style="fill:#FF4500;" /><circle cx="75" cy="75" r="5" style="fill:#FFF;" /></svg>`
  },
  {
    id: 'music_notes_flow',
    name: '音符飘动',
    category: 'music',
    tags: ["音符", "旋律", "五线谱", "流动"],
    colorScheme: '#333333',
    svg: `<svg viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M10 20 Q 100 60, 200 20 T 390 20" style="fill:none;stroke:#DDD;stroke-width:1;" /><path d="M10 30 Q 100 70, 200 30 T 390 30" style="fill:none;stroke:#DDD;stroke-width:1;" /><path d="M10 40 Q 100 80, 200 40 T 390 40" style="fill:none;stroke:#DDD;stroke-width:1;" /><g transform="translate(50, 45)"><circle cx="0" cy="0" r="5" /><path d="M5 0 L5 -25" style="stroke:#333;stroke-width:2;" /></g><g transform="translate(150, 55)"><circle cx="0" cy="0" r="5" /><path d="M5 0 L5 -25 L15 -20" style="stroke:#333;stroke-width:2;fill:none;" /></g><g transform="translate(250, 45)"><circle cx="0" cy="0" r="5" /><path d="M5 0 L5 -25" style="stroke:#333;stroke-width:2;" /></g><g transform="translate(320, 35)"><circle cx="0" cy="0" r="5" /><path d="M5 0 L5 -25 L15 -20" style="stroke:#333;stroke-width:2;fill:none;" /></g></svg>`
  },
  {
    id: 'music_headphones',
    name: '耳机图案',
    category: 'music',
    tags: ["耳机", "听歌", "极简", "深灰"],
    colorScheme: '#444444',
    svg: `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M30 80 A 45 45 0 0 1 120 80" style="fill:none;stroke:#444;stroke-width:8;stroke-linecap:round;" /><rect x="20" y="80" width="20" height="35" rx="5" style="fill:#444;" /><rect x="110" y="80" width="20" height="35" rx="5" style="fill:#444;" /><path d="M40 85 L40 110 M110 85 L110 110" style="stroke:#666;stroke-width:2;" /></svg>`
  },
  {
    id: 'music_play_button',
    name: '播放按钮',
    category: 'music',
    tags: ["播放", "开始", "圆形", "渐变"],
    colorScheme: '#FF1493',
    svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><defs><linearGradient id="grad_play" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FF69B4;stop-opacity:1" /><stop offset="100%" style="stop-color:#FF1493;stop-opacity:1" /></linearGradient></defs><circle cx="60" cy="60" r="50" style="fill:url(#grad_play);" /><polygon points="50,40 85,60 50,80" style="fill:#FFF;" /></svg>`
  }
]

// =============================================
// 21. 生活方式 (Lifestyle & Food)
// =============================================
export const SVG_LIFESTYLE = [
  {
    id: 'lifestyle_coffee',
    name: '咖啡杯',
    category: 'lifestyle',
    tags: ["咖啡", "下午茶", "温暖", "爱心"],
    colorScheme: '#6F4E37',
    svg: `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><path d="M40 60 L110 60 Q110 110 75 110 Q40 110 40 60" style="fill:#6F4E37;" /><path d="M110 70 Q125 70 125 85 Q125 100 110 100" style="fill:none;stroke:#6F4E37;stroke-width:5;" /><path d="M60 30 Q65 20 60 10 M75 30 Q80 20 75 10 M90 30 Q95 20 90 10" style="fill:none;stroke:#D2B48C;stroke-width:2;stroke-linecap:round;" /><path d="M70 80 Q75 75 80 80 Q75 90 75 90 Q75 90 70 80" style="fill:#FFF;opacity:0.8;" /></svg>`
  },
  {
    id: 'lifestyle_camera',
    name: '相机图案',
    category: 'lifestyle',
    tags: ["摄影", "记录", "文艺", "相机"],
    colorScheme: '#333333',
    svg: `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="25" y="50" width="100" height="65" rx="5" style="fill:#555;" /><rect x="40" y="40" width="30" height="10" style="fill:#333;" /><circle cx="75" cy="82" r="25" style="fill:#333;stroke:#777;stroke-width:3;" /><circle cx="75" cy="82" r="10" style="fill:#111;" /><rect x="105" y="58" width="12" height="8" style="fill:#999;" /></svg>`
  },
  {
    id: 'lifestyle_travel',
    name: '旅行标签',
    category: 'lifestyle',
    tags: ["旅行", "出发", "标签", "蓝色"],
    colorScheme: '#4682B4',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="20" y="20" width="160" height="60" rx="10" style="fill:#4682B4;" /><circle cx="40" cy="50" r="6" style="fill:#FFF;" /><path d="M120 40 L135 50 L120 60 M135 50 L110 50" style="fill:none;stroke:#FFF;stroke-width:3;stroke-linecap:round;" /><path d="M125 43 L128 35 L133 45" style="fill:#FFF;" /><path d="M125 57 L128 65 L133 55" style="fill:#FFF;" /></svg>`
  },
  {
    id: 'lifestyle_fitness',
    name: '健身图标',
    category: 'lifestyle',
    tags: ["健身", "运动", "力量", "活力"],
    colorScheme: '#FF4500',
    svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="40" y="45" width="120" height="10" rx="5" style="fill:#333;" /><rect x="30" y="30" width="20" height="40" rx="5" style="fill:#FF4500;" /><rect x="150" y="30" width="20" height="40" rx="5" style="fill:#FF4500;" /><path d="M100 20 L105 30 L95 30 Z" style="fill:#FFD700;" /><path d="M175 40 L185 50 L175 60" style="fill:none;stroke:#FF4500;stroke-width:3;" /></svg>`
  },
  {
    id: 'lifestyle_book_stack',
    name: '书籍堆叠',
    category: 'lifestyle',
    tags: ["阅读", "学习", "知识", "书籍"],
    colorScheme: '#20B2AA',
    svg: `<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><rect x="30" y="90" width="90" height="20" rx="2" style="fill:#20B2AA;" /><rect x="35" y="70" width="80" height="20" rx="2" style="fill:#FF6347;" /><rect x="40" y="50" width="70" height="20" rx="2" style="fill:#F0E68C;" /><line x1="110" y1="90" x2="110" y2="110" style="stroke:#FFF;stroke-width:2;opacity:0.5;" /><line x1="105" y1="70" x2="105" y2="90" style="stroke:#FFF;stroke-width:2;opacity:0.5;" /><line x1="100" y1="50" x2="100" y2="70" style="stroke:#FFF;stroke-width:2;opacity:0.5;" /></svg>`
  },
  {
    id: 'lifestyle_plant_pot',
    name: '盆栽',
    category: 'lifestyle',
    tags: ["植物", "清新", "生活", "自然"],
    colorScheme: '#228B22',
    svg: `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto;display:block;margin:0 auto;"><polygon points="35,140 85,140 95,100 25,100" style="fill:#E2725B;" /><path d="M60 100 Q40 60 60 20 Q80 60 60 100" style="fill:#228B22;" /><path d="M60 80 Q20 70 10 40 Q50 50 60 80" style="fill:#32CD32;" /><path d="M60 80 Q100 70 110 40 Q70 50 60 80" style="fill:#32CD32;" /></svg>`
  }
]


// =============================================
// 22. 点击展开 (Click to Expand) [INTERACTIVE/SMIL]
// =============================================
export const SVG_INTERACTIVE_EXPAND = [
  {
    id: 'expand_reveal_text_01',
    name: '点击揭秘文字',
    category: 'expand',
    tags: ["点击交互", "揭秘", "文字展示", "WeChat"],
    colorScheme: '#2c3e50',
    interactive: true,
    interactionType: 'click-reveal',
    svg: `<svg width="100%" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;background:#f0f0f0;"><defs><clipPath id="clip_reveal_01"><rect x="0" y="0" width="600" height="300" rx="10"/></clipPath></defs><g clip-path="url(#clip_reveal_01)"><foreignObject x="20" y="20" width="560" height="260"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;color:#333;line-height:1.6;font-family:sans-serif;"><h3 style="margin:0 0 10px 0;color:#2c3e50;">隐藏的真相</h3><p>恭喜你发现了这段隐藏的内容。这里可以放置优惠券代码、答案解析或者惊喜留言。SVG交互让阅读体验更有趣。</p><p style="color:#e74c3c;font-weight:bold;">福利代码: VIP888</p></div></foreignObject><g id="cover_layer_01" style="cursor:pointer;"><rect width="600" height="300" fill="#2c3e50"><animate attributeName="width" from="600" to="0" begin="click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/></rect><text x="50%" y="50%" fill="#ffffff" font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle" style="pointer-events:none;">点击揭秘</text><rect width="600" height="300" fill="transparent"><animate attributeName="width" from="600" to="0" begin="click" dur="0.8s" fill="freeze"/></rect></g></g></svg>`
  },
  {
    id: 'expand_unfold_card_02',
    name: '点击展开卡片',
    category: 'expand',
    tags: ["卡片展开", "详情展示", "WeChat"],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click-expand',
    svg: `<svg width="100%" viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;overflow:hidden;"><g><rect x="20" y="20" width="560" height="160" rx="8" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1"/><foreignObject x="40" y="80" width="520" height="90" opacity="0"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:14px;color:#7f8c8d;line-height:1.5;">这里是展开后的详细内容区域。可以放置更多的文字描述、补充说明或者次级标题。点击卡片查看更多细节是常见的交互模式。</div></foreignObject><g id="card_trigger_02" style="cursor:pointer;"><rect x="20" y="20" width="560" height="160" fill="#ffffff" opacity="1"><animate attributeName="height" from="160" to="50" begin="click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/></rect><text x="300" y="55" font-size="18" font-weight="bold" fill="#3498db" text-anchor="middle" style="pointer-events:none;">点击查看详情</text><path d="M290,70 L300,80 L310,70" stroke="#3498db" stroke-width="2" fill="none" style="pointer-events:none;"><animateTransform attributeName="transform" type="rotate" from="0 300 75" to="180 300 75" begin="click" dur="0.6s" fill="freeze"/></path><animate attributeName="opacity" to="0" begin="click" dur="0.1s" fill="freeze" delay="0.6s"/></g><animate xlink:href="#card_trigger_02" attributeName="visibility" to="hidden" begin="click+0.6s" fill="freeze"/><set attributeName="opacity" to="1" begin="click+0.3s" fill="freeze"/></g><rect x="20" y="20" width="560" height="160" fill="transparent" style="cursor:pointer;"><animate attributeName="height" to="0" begin="click" dur="0.1s" fill="freeze"/></rect></svg>`
  },
  {
    id: 'expand_envelope_03',
    name: '信封打开',
    category: 'expand',
    tags: ["信封", "邀请函", "WeChat"],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click-rotate',
    svg: `<svg width="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;"><g transform="translate(50, 50)"><rect x="0" y="100" width="500" height="250" fill="#c0392b"/><foreignObject x="20" y="20" width="460" height="200"><div xmlns="http://www.w3.org/1999/xhtml" style="background:#fff;padding:20px;height:100%;box-sizing:border-box;border-radius:4px;font-family:serif;color:#333;"><h4 style="margin:0;text-align:center;">致读者的信</h4><p style="font-size:14px;text-indent:2em;">见信如晤。这是一封来自SVG交互的信件。点击信封，开启一段奇妙的旅程。</p></div></foreignObject><path d="M0,100 L250,280 L500,100" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/><path d="M0,350 L250,170 L500,350" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/><g id="flap_03" style="cursor:pointer;"><path d="M0,100 L250,280 L500,100 L250,0 Z" fill="#e67e22" stroke="#d35400" stroke-width="2"><animateTransform attributeName="transform" type="scale" values="1 1; 1 -1" keyTimes="0; 1" transform-origin="250 100" begin="click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.42 0 0.58 1"/></path><text x="250" y="80" text-anchor="middle" fill="#fff" font-size="16" style="pointer-events:none;">OPEN</text></g></g></svg>`
  },
  {
    id: 'expand_accordion_04',
    name: '手风琴展开',
    category: 'expand',
    tags: ["手风琴", "列表", "WeChat"],
    colorScheme: '#27ae60',
    interactive: true,
    interactionType: 'click-translate',
    svg: `<svg width="100%" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;"><defs><clipPath id="acc_clip_04"><rect x="0" y="60" width="600" height="240"/></clipPath></defs><g><rect x="0" y="0" width="600" height="60" fill="#27ae60" rx="5"/><text x="20" y="38" fill="#fff" font-size="20" font-weight="bold" style="pointer-events:none;">点击查看更多内容</text><path d="M550,25 L560,35 L570,25" stroke="#fff" stroke-width="3" fill="none" style="pointer-events:none;"><animateTransform attributeName="transform" type="rotate" from="0 560 30" to="180 560 30" begin="click" dur="0.5s" fill="freeze"/></path><g clip-path="url(#acc_clip_04)"><g transform="translate(0, -240)"><animateTransform attributeName="transform" type="translate" from="0, -240" to="0, 0" begin="click" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/><rect x="0" y="65" width="600" height="235" fill="#ecf0f1" rx="5"/><foreignObject x="20" y="85" width="560" height="200"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:15px;color:#333;line-height:1.8;"><p>这里是隐藏的详细内容。</p><p>1. SVG手风琴效果可以在不跳转的情况下展示更多信息。</p><p>2. 使用translate变换比改变高度性能更好。</p><p>3. 适用于问答(Q&A)或目录场景。</p></div></foreignObject></g></g><rect x="0" y="0" width="600" height="60" fill="transparent" style="cursor:pointer;"><set attributeName="pointer-events" to="none" begin="click"/></rect></g></svg>`
  },
  {
    id: 'expand_curtain_05',
    name: '帷幕拉开',
    category: 'expand',
    tags: ["帷幕", "开场", "WeChat"],
    colorScheme: '#8e44ad',
    interactive: true,
    interactionType: 'click-slide',
    svg: `<svg width="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;"><defs><linearGradient id="curtain_grad_05" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#8e44ad;stop-opacity:1"/><stop offset="50%" style="stop-color:#9b59b6;stop-opacity:1"/><stop offset="100%" style="stop-color:#8e44ad;stop-opacity:1"/></linearGradient></defs><g><rect x="0" y="0" width="600" height="400" fill="#fff"/><foreignObject x="50" y="100" width="500" height="200"><div xmlns="http://www.w3.org/1999/xhtml" style="text-align:center;color:#333;"><h1 style="font-size:32px;color:#8e44ad;">隆重登场</h1><p style="font-size:18px;">帷幕拉开，精彩内容呈现眼前。</p><img src="https://via.placeholder.com/100x100?text=SVG" style="margin-top:20px;border-radius:50%;"/></div></foreignObject><g id="left_curtain_05"><rect x="0" y="0" width="300" height="400" fill="url(#curtain_grad_05)"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-300 0" begin="click" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.42 0 0.58 1"/></g><g id="right_curtain_05"><rect x="300" y="0" width="300" height="400" fill="url(#curtain_grad_05)"/><animateTransform attributeName="transform" type="translate" from="0 0" to="300 0" begin="click" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.42 0 0.58 1"/></g><g style="cursor:pointer;"><rect x="250" y="180" width="100" height="40" rx="20" fill="rgba(0,0,0,0.5)"/><text x="300" y="205" fill="#fff" font-size="14" text-anchor="middle" style="pointer-events:none;">点击开幕</text><rect x="0" y="0" width="600" height="400" fill="transparent"><set attributeName="display" to="none" begin="click"/></rect></g></g></svg>`
  },
  {
    id: 'expand_scroll_06',
    name: '卷轴展开',
    category: 'expand',
    tags: ["国风", "卷轴", "WeChat"],
    colorScheme: '#f5e6c8',
    interactive: true,
    interactionType: 'click-expand-width',
    svg: `<svg width="100%" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;"><defs><pattern id="paper_pat_06" patternUnits="userSpaceOnUse" width="100" height="100"><rect width="100" height="100" fill="#f5e6c8"/><path d="M0 0L100 100" stroke="#e0d0b0" stroke-width="1"/></pattern></defs><g><rect x="50" y="20" width="500" height="260" fill="url(#paper_pat_06)" stroke="#8d6e63" stroke-width="2"/><foreignObject x="70" y="40" width="460" height="220"><div xmlns="http://www.w3.org/1999/xhtml" style="writing-mode: vertical-rl; font-family: 'KaiTi', serif; font-size: 24px; height: 100%; color:#3e2723;">千里之行，始于足下。<br/>点击卷轴，阅览详情。</div></foreignObject><g><rect x="0" y="0" width="600" height="300" fill="#fff"/><animate attributeName="width" from="600" to="0" begin="click" dur="1.5s" fill="freeze"/></g><g id="scroll_handle_06"><rect x="285" y="10" width="30" height="280" rx="5" fill="#5d4037"/><rect x="295" y="10" width="10" height="280" fill="#8d6e63"/><animateTransform attributeName="transform" type="translate" from="-250 0" to="250 0" begin="click" dur="1.5s" fill="freeze"/></g><g style="cursor:pointer;"><circle cx="300" cy="150" r="30" fill="#c0392b" opacity="0.8"><animate attributeName="opacity" to="0" begin="click" dur="0.2s" fill="freeze"/></circle><text x="300" y="155" fill="#fff" font-size="14" text-anchor="middle" style="pointer-events:none;">展开</text><rect x="200" y="0" width="200" height="300" fill="transparent"><set attributeName="display" to="none" begin="click"/></rect></g></g></svg>`
  },
  {
    id: 'expand_gift_box_07',
    name: '礼盒打开',
    category: 'expand',
    tags: ["礼盒", "惊喜", "WeChat"],
    colorScheme: '#d35400',
    interactive: true,
    interactionType: 'click-translate-y',
    svg: `<svg width="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;"><g transform="translate(150, 100)"><rect x="20" y="100" width="260" height="150" fill="#f39c12"/><foreignObject x="30" y="110" width="240" height="130"><div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;height:100%;background:#fff;border-radius:4px;color:#d35400;font-weight:bold;font-size:20px;">✨ 惊喜大礼包 ✨</div></foreignObject><g id="lid_07" style="cursor:pointer;"><rect x="0" y="50" width="300" height="60" rx="5" fill="#e67e22" stroke="#d35400" stroke-width="2"/><rect x="130" y="50" width="40" height="60" fill="#f1c40f"/><path d="M150,50 C150,20 110,20 110,50 M150,50 C150,20 190,20 190,50" stroke="#f1c40f" stroke-width="10" fill="none"/><text x="150" y="90" text-anchor="middle" fill="#fff" font-weight="bold" font-size="16" style="pointer-events:none;">CLICK</text><animateTransform attributeName="transform" type="translate" values="0,0; 0,-120" begin="click" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.5 0 0.5 1"/><animate attributeName="opacity" values="1;0" begin="click+0.5s" dur="0.3s" fill="freeze"/></g><rect x="20" y="110" width="260" height="140" fill="#d35400" opacity="0"><animate attributeName="opacity" to="1" begin="0s" dur="0.1s" fill="freeze"/></rect><rect x="20" y="110" width="260" height="140" fill="transparent"><animate attributeName="height" to="0" begin="click" dur="0.1s" fill="freeze"/></rect></g></svg>`
  },
  {
    id: 'expand_door_08',
    name: '推门而入',
    category: 'expand',
    tags: ["开门", "迎新", "WeChat"],
    colorScheme: '#5d4037',
    interactive: true,
    interactionType: 'click-scale-x',
    svg: `<svg width="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;display:block;margin:0 auto;"><g><image href="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=600&amp;q=80" x="0" y="0" width="600" height="400" preserveAspectRatio="xMidYMid slice"/><rect x="0" y="0" width="600" height="400" fill="rgba(0,0,0,0.3)"/><foreignObject x="100" y="150" width="400" height="100"><div xmlns="http://www.w3.org/1999/xhtml" style="color:#fff;text-align:center;font-size:24px;font-weight:bold;text-shadow:0 2px 4px rgba(0,0,0,0.5);">欢迎来到新世界</div></foreignObject><g id="doors_08"><g id="left_door_08" transform-origin="0 200"><rect x="0" y="0" width="300" height="400" fill="#795548" stroke="#3e2723" stroke-width="4"/><circle cx="260" cy="200" r="8" fill="#ffd700"/><animateTransform attributeName="transform" type="scale" from="1 1" to="0 1" begin="click" dur="1.2s" fill="freeze"/></g><g id="right_door_08" transform-origin="600 200"><rect x="300" y="0" width="300" height="400" fill="#795548" stroke="#3e2723" stroke-width="4"/><circle cx="340" cy="200" r="8" fill="#ffd700"/><animateTransform attributeName="transform" type="scale" from="1 1" to="0 1" begin="click" dur="1.2s" fill="freeze"/></g><g style="cursor:pointer;"><rect x="250" y="180" width="100" height="40" fill="transparent"/><text x="300" y="190" fill="#fff" font-size="14" text-anchor="middle" opacity="0.7" style="pointer-events:none;">点击推门</text><rect x="0" y="0" width="600" height="400" fill="transparent"><set attributeName="display" to="none" begin="click"/></rect></g></g></g></svg>`
  }
]

// =============================================
// 23. 点击切换 (Click to Switch) [INTERACTIVE/SMIL]
// =============================================
export const SVG_INTERACTIVE_SWITCH = [
  {
    id: 'switch_ab_compare',
    name: 'AB对比切换',
    category: 'switch',
    tags: ["对比", "切换", "交互"],
    colorScheme: '#f0f0f0',
    interactive: true,
    interactionType: 'click_to_reveal',
    svg: `<svg viewBox='0 0 600 400' style='width:100%;max-width:600px;display:block;margin:0 auto;' xmlns='http://www.w3.org/2000/svg'><rect width='600' height='400' fill='#eeeeee'/><g id='sw_ab_view_b'><rect width='600' height='400' fill='#3498db'/><text x='300' y='210' font-family='Arial' font-size='40' fill='white' text-anchor='middle'>AFTER / 方案 B</text></g><g id='sw_ab_view_a'><rect width='600' height='400' fill='#e74c3c'/><text x='300' y='210' font-family='Arial' font-size='40' fill='white' text-anchor='middle'>BEFORE / 方案 A</text><animate attributeName='opacity' from='1' to='0' begin='click' dur='0.5s' fill='freeze' restart='never'/></g><rect width='600' height='400' fill='transparent' style='cursor:pointer;'><set attributeName='visibility' to='hidden' begin='click' fill='freeze'/></rect></svg>`
  },
  {
    id: 'switch_color_palette',
    name: '点击调色板',
    category: 'switch',
    tags: ["颜色", "循环", "色块"],
    colorScheme: '#multi',
    interactive: true,
    interactionType: 'click_to_cycle',
    svg: `<svg viewBox='0 0 600 200' style='width:100%;max-width:600px;display:block;margin:0 auto;' xmlns='http://www.w3.org/2000/svg'><rect id='sw_pal_box' x='50' y='25' width='500' height='150' rx='20' fill='#34495e'><animate attributeName='fill' values='#34495e;#e74c3c;#2ecc71;#f1c40f;#9b59b6' begin='click' dur='0.5s' fill='freeze' restart='always'/></rect><text x='300' y='110' font-family='Arial' font-size='24' fill='white' text-anchor='middle' pointer-events='none'>点击切换颜色</text></svg>`
  },
  {
    id: 'switch_flip_card',
    name: '翻转卡片',
    category: 'switch',
    tags: ["翻转", "卡片", "3D"],
    colorScheme: '#ffffff',
    interactive: true,
    interactionType: 'click_to_flip',
    svg: `<svg viewBox='0 0 300 400' style='width:100%;max-width:600px;display:block;margin:0 auto;' xmlns='http://www.w3.org/2000/svg'><g transform='translate(150 200)'><g id='sw_flip_back' transform='scale(0 1)'><rect x='-140' y='-190' width='280' height='380' rx='15' fill='#2ecc71'/><text y='10' font-family='Arial' font-size='30' fill='white' text-anchor='middle'>背面内容</text><animateTransform attributeName='transform' type='scale' from='0 1' to='1 1' begin='sw_flip_trigger.click' dur='0.4s' fill='freeze' restart='never'/></g><g id='sw_flip_front'><rect x='-140' y='-190' width='280' height='380' rx='15' fill='#3498db'/><text y='10' font-family='Arial' font-size='30' fill='white' text-anchor='middle'>正面内容</text><animateTransform attributeName='transform' type='scale' from='1 1' to='0 1' begin='sw_flip_trigger.click' dur='0.4s' fill='freeze' restart='never'/></g></g><rect id='sw_flip_trigger' width='300' height='400' fill='transparent' style='cursor:pointer;'/></svg>`
  },
  {
    id: 'switch_day_night',
    name: '日夜切换',
    category: 'switch',
    tags: ["场景", "日夜", "自然"],
    colorScheme: '#87CEEB',
    interactive: true,
    interactionType: 'click_to_toggle',
    svg: `<svg viewBox='0 0 600 300' style='width:100%;max-width:600px;display:block;margin:0 auto;' xmlns='http://www.w3.org/2000/svg'><rect id='sw_dn_bg' width='600' height='300' fill='#87CEEB'><animate attributeName='fill' from='#87CEEB' to='#2C3E50' begin='click' dur='0.8s' fill='freeze' restart='never'/></rect><circle id='sw_dn_sun' cx='300' cy='100' r='40' fill='#f1c40f'><animate attributeName='cy' from='100' to='400' begin='sw_dn_bg.click' dur='0.8s' fill='freeze' restart='never'/></circle><circle id='sw_dn_moon' cx='300' cy='-100' r='35' fill='#ecf0f1'><animate attributeName='cy' from='-100' to='100' begin='sw_dn_bg.click' dur='0.8s' fill='freeze' restart='never'/></circle><text x='300' y='250' font-family='Arial' font-size='20' fill='white' text-anchor='middle' pointer-events='none'>点击切换昼夜</text></svg>`
  },
  {
    id: 'switch_like_heart',
    name: '点赞爱心',
    category: 'switch',
    tags: ["社交", "点赞", "动效"],
    colorScheme: '#e74c3c',
    interactive: true,
    interactionType: 'click_to_activate',
    svg: `<svg viewBox='0 0 200 200' style='width:100%;max-width:600px;display:block;margin:0 auto;' xmlns='http://www.w3.org/2000/svg'><g transform='translate(100 100)'><path id='sw_heart_path' d='M0 30 C-40 -10 -70 -50 -30 -80 C-10 -95 10 -95 30 -80 C70 -50 40 -10 0 30' fill='none' stroke='#e74c3c' stroke-width='5' transform='rotate(180)'><animate attributeName='fill' from='none' to='#e74c3c' begin='click' dur='0.3s' fill='freeze' restart='never'/></path><animateTransform attributeName='transform' type='scale' values='1;1.3;1' begin='sw_heart_path.click' dur='0.4s' restart='never'/></g></svg>`
  },
  {
    id: 'switch_lightbulb',
    name: '灯泡开关',
    category: 'switch',
    tags: ["创意", "开关", "灯泡"],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click_to_glow',
    svg: `<svg viewBox='0 0 200 300' style='width:100%;max-width:600px;display:block;margin:0 auto;' xmlns='http://www.w3.org/2000/svg'><defs><radialGradient id='sw_bulb_grad'><stop offset='0%' stop-color='#f1c40f' stop-opacity='0.8'/><stop offset='100%' stop-color='#f1c40f' stop-opacity='0'/></radialGradient></defs><circle cx='100' cy='100' r='80' fill='url(#sw_bulb_grad)' opacity='0'><animate attributeName='opacity' from='0' to='1' begin='sw_bulb_body.click' dur='0.3s' fill='freeze' restart='never'/></circle><path id='sw_bulb_body' d='M100 40 A60 60 0 1 0 100 160 L100 180 L80 180 L80 200 L120 200 L120 180 L100 180' fill='#bdc3c7' style='cursor:pointer;'><animate attributeName='fill' from='#bdc3c7' to='#f1c40f' begin='click' dur='0.3s' fill='freeze' restart='never'/></path><rect x='85' y='210' width='30' height='10' fill='#7f8c8d'/></svg>`
  },
  {
    id: 'switch_emoji_mood',
    name: '表情切换',
    category: 'switch',
    tags: ["表情", "心情", "变化"],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click_to_morph',
    svg: `<svg viewBox='0 0 200 200' style='width:100%;max-width:600px;display:block;margin:0 auto;' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='100' r='80' fill='#f1c40f'/><circle cx='70' cy='80' r='8' fill='#2c3e50'/><circle cx='130' cy='80' r='8' fill='#2c3e50'/><path id='sw_mood_mouth' d='M60 130 Q100 130 140 130' stroke='#2c3e50' stroke-width='8' stroke-linecap='round' fill='none'><animate attributeName='d' from='M60 130 Q100 130 140 130' to='M60 130 Q100 170 140 130' begin='click' dur='0.4s' fill='freeze' restart='never'/></path><rect width='200' height='200' fill='transparent' style='cursor:pointer;'><set attributeName='visibility' to='hidden' begin='click' fill='freeze'/></rect></svg>`
  },
  {
    id: 'switch_progress_fill',
    name: '进度填充',
    category: 'switch',
    tags: ["进度条", "加载", "填充"],
    colorScheme: '#2ecc71',
    interactive: true,
    interactionType: 'click_to_fill',
    svg: `<svg viewBox='0 0 600 60' style='width:100%;max-width:600px;display:block;margin:0 auto;' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='15' width='580' height='30' rx='15' fill='#ecf0f1'/><rect id='sw_prog_bar' x='10' y='15' width='0' height='30' rx='15' fill='#2ecc71'><animate attributeName='width' from='0' to='580' begin='sw_prog_trigger.click' dur='1.5s' fill='freeze' restart='never'/></rect><text x='300' y='35' font-family='Arial' font-size='14' fill='#7f8c8d' text-anchor='middle' pointer-events='none'>点击开始加载</text><rect id='sw_prog_trigger' width='600' height='60' fill='transparent' style='cursor:pointer;'/></svg>`
  }
]

// =============================================
// 24. 自动动画 (Auto Animation) [INTERACTIVE/SMIL]
// =============================================
export const SVG_AUTO_ANIMATE = [
  {
    id: 'animate_floating_clouds',
    name: '飘动云朵',
    category: 'animate',
    tags: ["云朵", "天空", "自然", "背景动画"],
    colorScheme: '#87CEEB',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;background-color:#87CEEB;"><g opacity="0.8"><path d="M50,50 Q70,30 90,50 T130,50 T170,50 V80 H50 Z" fill="#FFFFFF"><animateTransform attributeName="transform" type="translate" from="600 0" to="-200 0" dur="12s" repeatCount="indefinite" begin="0s"/></path></g><g opacity="0.9"><path d="M50,100 Q80,70 110,100 T170,100 T230,100 V140 H50 Z" fill="#FFFFFF"><animateTransform attributeName="transform" type="translate" from="600 20" to="-250 20" dur="8s" repeatCount="indefinite" begin="1s"/></path></g><g opacity="0.6"><path d="M50,30 Q65,15 80,30 T110,30 V50 H50 Z" fill="#FFFFFF"><animateTransform attributeName="transform" type="translate" from="600 0" to="-200 0" dur="18s" repeatCount="indefinite" begin="0s"/></path></g></svg>`
  },
  {
    id: 'animate_heartbeat',
    name: '心跳脉搏',
    category: 'animate',
    tags: ["爱心", "心跳", "健康", "情感"],
    colorScheme: '#FF6B6B',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width:100%;max-width:600px;display:block;margin:0 auto;"><circle cx="100" cy="100" r="80" fill="#FFF0F0" /><path d="M100,160 C100,160 40,115 40,80 C40,55 60,35 85,35 C100,35 100,55 100,55 C100,55 100,35 115,35 C140,35 160,55 160,80 C160,115 100,160 100,160 Z" fill="#FF6B6B"><animateTransform attributeName="transform" type="scale" values="1;1.2;1;1.1;1" keyTimes="0;0.1;0.2;0.3;1" dur="1s" repeatCount="indefinite" begin="0s" transform-origin="100 100"/></path></svg>`
  },
  {
    id: 'animate_typing_dots',
    name: '打字等待',
    category: 'animate',
    tags: ["加载", "等待", "输入中", "提示"],
    colorScheme: '#333333',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" style="width:100%;max-width:600px;display:block;margin:0 auto;"><rect width="100" height="40" rx="20" fill="#E0E0E0"/><circle cx="30" cy="20" r="5" fill="#555"><animate attributeName="cy" values="20;10;20" dur="0.6s" repeatCount="indefinite" begin="0s"/></circle><circle cx="50" cy="20" r="5" fill="#555"><animate attributeName="cy" values="20;10;20" dur="0.6s" repeatCount="indefinite" begin="0.2s"/></circle><circle cx="70" cy="20" r="5" fill="#555"><animate attributeName="cy" values="20;10;20" dur="0.6s" repeatCount="indefinite" begin="0.4s"/></circle></svg>`
  },
  {
    id: 'animate_sparkle_stars',
    name: '闪烁星光',
    category: 'animate',
    tags: ["星空", "闪烁", "唯美", "夜空"],
    colorScheme: '#0B1026',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 100" style="width:100%;max-width:600px;display:block;margin:0 auto;background-color:#0B1026;"><g fill="#FFFFFF"><circle cx="50" cy="20" r="2"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0s"/></circle><circle cx="150" cy="80" r="3"><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" begin="1s"/></circle><circle cx="300" cy="30" r="2"><animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s"/></circle><circle cx="450" cy="60" r="2.5"><animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="1.2s"/></circle><circle cx="550" cy="15" r="2"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.3s"/></circle><path d="M200,50 L202,45 L204,50 L209,52 L204,54 L202,59 L200,54 L195,52 Z"><animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" begin="0s"/><animateTransform attributeName="transform" type="rotate" from="0 202 52" to="360 202 52" dur="10s" repeatCount="indefinite"/></path></g></svg>`
  },
  {
    id: 'animate_wave_ocean',
    name: '海浪动画',
    category: 'animate',
    tags: ["海洋", "波浪", "夏天", "流动"],
    colorScheme: '#4facfe',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 150" style="width:100%;max-width:600px;display:block;margin:0 auto;background-color:#E0F7FA;overflow:hidden;"><defs><path id="wave_ao_1" d="M0,0 Q150,50 300,0 T600,0 T900,0 T1200,0 V100 H0 Z" fill="#4facfe" opacity="0.6"/></defs><g transform="translate(0, 80)"><use href="#wave_ao_1"><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="6s" repeatCount="indefinite"/></use></g><g transform="translate(-100, 100)"><path d="M0,0 Q150,40 300,0 T600,0 T900,0 T1200,0 V100 H0 Z" fill="#00f2fe" opacity="0.8"><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="4s" repeatCount="indefinite"/></path></g></svg>`
  },
  {
    id: 'animate_pendulum',
    name: '钟摆摇摆',
    category: 'animate',
    tags: ["催眠", "时间", "物理", "摇摆"],
    colorScheme: '#F4A261',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" style="width:100%;max-width:600px;display:block;margin:0 auto;"><line x1="0" y1="0" x2="200" y2="0" stroke="#333" stroke-width="4"/><g><line x1="100" y1="0" x2="100" y2="200" stroke="#264653" stroke-width="4"/><circle cx="100" cy="200" r="30" fill="#E76F51"/><animateTransform attributeName="transform" type="rotate" values="25 100 0; -25 100 0; 25 100 0" dur="2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/></g></svg>`
  }
]

// =============================================
// 25. 视差滚动 (Parallax Motion) [INTERACTIVE/SMIL]
// =============================================
export const SVG_PARALLAX = [
  {
    id: 'parallax_city_scroll',
    name: '城市视差',
    category: 'parallax',
    tags: ["城市", "风景", "剪影", "移动"],
    colorScheme: '#2C3E50',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;background-color:#FDC830;"><g opacity="0.5"><path d="M0,300 L0,150 L50,150 L50,120 L100,120 L100,160 L150,160 L150,100 L200,100 L200,150 L300,150 L300,80 L350,80 L350,150 L450,150 L450,110 L500,110 L500,160 L600,160 L600,150 L650,150 L650,120 L700,120 L700,160 L750,160 L750,100 L800,100 L800,150 L900,150 L900,80 L950,80 L950,150 L1050,150 L1050,110 L1100,110 L1100,160 L1200,160 L1200,300 Z" fill="#E67E22"><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="20s" repeatCount="indefinite"/></path></g><g><path d="M0,300 L0,200 L40,200 L40,180 L80,180 L80,220 L120,220 L120,170 L180,170 L180,210 L250,210 L250,150 L300,150 L300,220 L400,220 L400,190 L450,190 L450,230 L600,230 L600,200 L640,200 L640,180 L680,180 L680,220 L720,220 L720,170 L780,170 L780,210 L850,210 L850,150 L900,150 L900,220 L1000,220 L1000,190 L1050,190 L1050,230 L1200,230 L1200,300 Z" fill="#2C3E50"><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="10s" repeatCount="indefinite"/></path></g></svg>`
  },
  {
    id: 'parallax_forest_depth',
    name: '森林纵深',
    category: 'parallax',
    tags: ["森林", "树木", "自然", "绿色"],
    colorScheme: '#2D6A4F',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;background-color:#D8F3DC;"><g fill="#74C69D"><path d="M0,300 V150 L30,100 L60,150 L90,120 L120,150 L150,90 L180,150 L300,300 H0 Z M300,300 V150 L330,100 L360,150 L390,120 L420,150 L450,90 L480,150 L600,300 H300 Z M600,300 V150 L630,100 L660,150 L690,120 L720,150 L750,90 L780,150 L900,300 H600 Z"><animateTransform attributeName="transform" type="translate" from="0 0" to="-300 0" dur="15s" repeatCount="indefinite"/></path></g><g fill="#40916C"><path d="M0,300 V200 L50,130 L100,200 L150,140 L200,200 L300,300 H0 Z M300,300 V200 L350,130 L400,200 L450,140 L500,200 L600,300 H300 Z M600,300 V200 L650,130 L700,200 L750,140 L800,200 L900,300 H600 Z"><animateTransform attributeName="transform" type="translate" from="0 0" to="-300 0" dur="10s" repeatCount="indefinite"/></path></g><g fill="#1B4332"><path d="M0,300 V250 L70,180 L140,250 L200,190 L260,250 L300,300 H0 Z M300,300 V250 L370,180 L440,250 L500,190 L560,250 L600,300 H300 Z M600,300 V250 L670,180 L740,250 L800,190 L860,250 L900,300 H600 Z"><animateTransform attributeName="transform" type="translate" from="0 0" to="-300 0" dur="6s" repeatCount="indefinite"/></path></g></svg>`
  },
  {
    id: 'parallax_starfield',
    name: '星空穿梭',
    category: 'parallax',
    tags: ["宇宙", "科幻", "飞行", "速度"],
    colorScheme: '#000000',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;background-color:#000000;"><g fill="#555"><circle cx="50" cy="50" r="1"/><circle cx="250" cy="150" r="1"/><circle cx="450" cy="250" r="1"/><circle cx="650" cy="50" r="1"/><circle cx="850" cy="150" r="1"/><circle cx="1050" cy="250" r="1"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="10s" repeatCount="indefinite"/></g><g fill="#AAA"><circle cx="100" cy="200" r="1.5"/><circle cx="300" cy="50" r="1.5"/><circle cx="500" cy="150" r="1.5"/><circle cx="700" cy="200" r="1.5"/><circle cx="900" cy="50" r="1.5"/><circle cx="1100" cy="150" r="1.5"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="5s" repeatCount="indefinite"/></g><g fill="#FFF"><circle cx="150" cy="100" r="2"/><circle cx="350" cy="250" r="2"/><circle cx="550" cy="50" r="2"/><circle cx="750" cy="100" r="2"/><circle cx="950" cy="250" r="2"/><circle cx="1150" cy="50" r="2"/><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="2s" repeatCount="indefinite"/></g></svg>`
  },
  {
    id: 'parallax_road_drive',
    name: '公路行驶',
    category: 'parallax',
    tags: ["旅行", "驾驶", "公路", "视差"],
    colorScheme: '#7F8C8D',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;background-color:#87CEEB;"><rect y="150" width="600" height="150" fill="#27AE60"/><rect y="220" width="600" height="80" fill="#34495E"/><g stroke="#FFF" stroke-width="4" stroke-dasharray="40 40"><line x1="0" y1="260" x2="1200" y2="260"><animateTransform attributeName="transform" type="translate" from="0 0" to="-80 0" dur="0.5s" repeatCount="indefinite"/></line></g><g transform="translate(0, 150)"><g><rect x="100" y="-40" width="10" height="60" fill="#8B4513"/><circle cx="105" cy="-50" r="25" fill="#228B22"/><rect x="400" y="-40" width="10" height="60" fill="#8B4513"/><circle cx="405" cy="-50" r="25" fill="#228B22"/><rect x="700" y="-40" width="10" height="60" fill="#8B4513"/><circle cx="705" cy="-50" r="25" fill="#228B22"/><rect x="1000" y="-40" width="10" height="60" fill="#8B4513"/><circle cx="1005" cy="-50" r="25" fill="#228B22"/></g><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="3s" repeatCount="indefinite"/></g></svg>`
  },
  {
    id: 'parallax_underwater',
    name: '海底世界',
    category: 'parallax',
    tags: ["海洋", "鱼", "潜水", "蓝色"],
    colorScheme: '#006994',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;background-color:#006994;"><g fill="#004e6e"><path d="M0,280 Q30,250 60,280 T120,280 T180,280 T240,280 T300,280 T360,280 T420,280 T480,280 T540,280 T600,280 T660,280 T720,280 T780,280 T840,280 T900,280 T960,280 T1020,280 T1080,280 T1140,280 T1200,280 V300 H0 Z"><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="8s" repeatCount="indefinite"/></path></g><g><path d="M600,100 L580,90 L580,110 Z" fill="#FFD700"><animateTransform attributeName="transform" type="translate" from="0 0" to="-700 0" dur="12s" repeatCount="indefinite"/></path><path d="M600,200 L570,185 L570,215 Z" fill="#FF6347"><animateTransform attributeName="transform" type="translate" from="100 0" to="-800 0" dur="7s" repeatCount="indefinite"/></path></g><g fill="rgba(255,255,255,0.3)"><circle cx="100" cy="300" r="5"><animate attributeName="cy" from="300" to="0" dur="4s" repeatCount="indefinite" begin="0s"/></circle><circle cx="300" cy="300" r="8"><animate attributeName="cy" from="300" to="0" dur="5s" repeatCount="indefinite" begin="2s"/></circle><circle cx="500" cy="300" r="6"><animate attributeName="cy" from="300" to="0" dur="3.5s" repeatCount="indefinite" begin="1s"/></circle></g></svg>`
  },
  {
    id: 'parallax_mountain_layers',
    name: '山峦层叠',
    category: 'parallax',
    tags: ["山峰", "风景", "层叠", "紫色"],
    colorScheme: '#6A0572',
    interactive: true,
    interactionType: 'auto',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;background-color:#E0BBE4;"><g fill="#957DAD"><path d="M0,200 L100,50 L200,200 L300,50 L400,200 L500,50 L600,200 L700,50 L800,200 L900,50 L1000,200 L1100,50 L1200,200 H0 Z"><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="40s" repeatCount="indefinite"/></path></g><g fill="#D291BC"><path d="M0,200 L150,80 L300,200 L450,80 L600,200 L750,80 L900,200 L1050,80 L1200,200 H0 Z"><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="25s" repeatCount="indefinite"/></path></g><g fill="#FEC8D8"><path d="M0,200 L80,120 L160,200 L240,120 L320,200 L400,120 L480,200 L560,120 L640,200 L720,120 L800,200 L880,120 L960,200 L1040,120 L1120,200 L1200,200 H0 Z"><animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="15s" repeatCount="indefinite"/></path></g></svg>`
  }
]

// =============================================
// 26. 互动游戏 (Interactive Game) [INTERACTIVE/SMIL]
// =============================================
export const SVG_GAME = [
  {
    id: 'game_scratch_reveal',
    name: '刮刮乐互动',
    category: 'game',
    tags: ["互动", "抽奖", "刮刮乐"],
    colorScheme: '#cccccc',
    interactive: true,
    interactionType: 'click_reveal',
    svg: `<svg viewBox="0 0 400 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="200" fill="#f0f0f0"/><text x="200" y="115" font-size="40" font-weight="bold" fill="#e74c3c" text-anchor="middle">恭喜中奖！</text><rect id="t1_cover" width="400" height="200" fill="#aaaaaa"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="click" fill="freeze" restart="never"/></rect><text x="200" y="110" font-size="24" fill="white" text-anchor="middle" pointer-events="none">点击刮开图层</text></svg>`
  },
  {
    id: 'game_slot_machine',
    name: '幸运老虎机',
    category: 'game',
    tags: ["游戏", "老虎机", "抽奖"],
    colorScheme: '#f1c40f',
    interactive: true,
    interactionType: 'click_animate',
    svg: `<svg viewBox="0 0 400 200" style="width:100%;max-width:600px;display:block;margin:0 auto;background:#2c3e50;" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="t2_clip"><rect x="50" y="50" width="300" height="100"/></clipPath></defs><g clip-path="url(#t2_clip)"><g id="t2_reels"><g transform="translate(80,0)"><text y="80" font-size="40" fill="#f1c40f">🍎</text><text y="140" font-size="40" fill="#f1c40f">🍋</text><text y="200" font-size="40" fill="#f1c40f">🍒</text><text y="260" font-size="40" fill="#f1c40f">🍎</text><animateTransform attributeName="transform" type="translate" values="80,0; 80,-180; 80,-120" keyTimes="0; 0.8; 1" dur="2s" begin="t2_btn.click" fill="freeze" restart="never"/></g><g transform="translate(180,0)"><text y="80" font-size="40" fill="#f1c40f">🍒</text><text y="140" font-size="40" fill="#f1c40f">🍎</text><text y="200" font-size="40" fill="#f1c40f">🍋</text><text y="260" font-size="40" fill="#f1c40f">🍎</text><animateTransform attributeName="transform" type="translate" values="180,0; 180,-240; 180,-120" keyTimes="0; 0.8; 1" dur="2.2s" begin="t2_btn.click" fill="freeze" restart="never"/></g><g transform="translate(280,0)"><text y="80" font-size="40" fill="#f1c40f">🍋</text><text y="140" font-size="40" fill="#f1c40f">🍒</text><text y="200" font-size="40" fill="#f1c40f">🍎</text><text y="260" font-size="40" fill="#f1c40f">🍎</text><animateTransform attributeName="transform" type="translate" values="280,0; 280,-300; 280,-120" keyTimes="0; 0.8; 1" dur="2.5s" begin="t2_btn.click" fill="freeze" restart="never"/></g></g></g><rect id="t2_btn" x="150" y="160" width="100" height="30" rx="15" fill="#e74c3c"/><text x="200" y="182" font-size="14" fill="white" text-anchor="middle" pointer-events="none">点击抽奖</text></svg>`
  },
  {
    id: 'game_dice_roll',
    name: '随机掷骰子',
    category: 'game',
    tags: ["游戏", "骰子", "随机"],
    colorScheme: '#ffffff',
    interactive: true,
    interactionType: 'click_animate',
    svg: `<svg viewBox="0 0 200 200" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg"><rect id="t3_bg" width="200" height="200" fill="#27ae60" rx="20"/><g id="t3_dice" transform="translate(50,50)"><rect width="100" height="100" fill="white" rx="10"/><g id="t3_faces"><circle cx="50" cy="50" r="10" fill="red" opacity="1"><animate attributeName="opacity" values="1;0;1;0;1;0;0" dur="1s" begin="t3_bg.click" fill="freeze"/></circle><g opacity="0"><circle cx="25" cy="25" r="8" fill="black"/><circle cx="75" cy="75" r="8" fill="black"/><animate attributeName="opacity" values="0;1;0;1;0;1;0" dur="1s" begin="t3_bg.click" fill="freeze"/></g><g opacity="0"><circle cx="25" cy="25" r="8" fill="black"/><circle cx="50" cy="50" r="8" fill="black"/><circle cx="75" cy="75" r="8" fill="black"/><animate attributeName="opacity" values="0;0;0;0;0;0;1" dur="1s" begin="t3_bg.click" fill="freeze"/></g></g></g><text x="100" y="180" font-size="14" fill="white" text-anchor="middle">点击绿色区域掷骰子</text></svg>`
  },
  {
    id: 'game_fortune_wheel',
    name: '幸运大转盘',
    category: 'game',
    tags: ["游戏", "转盘", "抽奖"],
    colorScheme: '#e67e22',
    interactive: true,
    interactionType: 'click_rotate',
    svg: `<svg viewBox="0 0 400 400" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg"><g id="t4_wheel" transform="translate(200,200)"><circle r="180" fill="#f39c12" stroke="#d35400" stroke-width="5"/><path d="M0,0 L0,-180 A180,180 0 0,1 155.8,-90 Z" fill="#e74c3c"/><path d="M0,0 L155.8,-90 A180,180 0 0,1 155.8,90 Z" fill="#3498db"/><path d="M0,0 L155.8,90 A180,180 0 0,1 0,180 Z" fill="#2ecc71"/><path d="M0,0 L0,180 A180,180 0 0,1 -155.8,90 Z" fill="#9b59b6"/><path d="M0,0 L-155.8,90 A180,180 0 0,1 -155.8,-90 Z" fill="#f1c40f"/><path d="M0,0 L-155.8,-90 A180,180 0 0,1 0,-180 Z" fill="#1abc9c"/><animateTransform attributeName="transform" type="rotate" from="0" to="1485" dur="3s" begin="click" fill="freeze" restart="never" calcMode="spline" keySplines="0.25 0.1 0.25 1"/></g><path d="M200,10 L185,40 L215,40 Z" fill="#34495e"/><circle cx="200" cy="200" r="30" fill="#ffffff"/><text x="200" y="205" font-size="16" text-anchor="middle" font-weight="bold">GO</text></svg>`
  },
  {
    id: 'game_pick_card',
    name: '翻牌抽奖',
    category: 'game',
    tags: ["互动", "翻牌", "抽奖"],
    colorScheme: '#3498db',
    interactive: true,
    interactionType: 'click_flip',
    svg: `<svg viewBox="0 0 600 250" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg"><g id="t5_card1" transform="translate(50,50)"><rect width="120" height="150" fill="#3498db" rx="10"/><text x="60" y="85" font-size="40" fill="white" text-anchor="middle">?</text><g opacity="0"><rect width="120" height="150" fill="#e74c3c" rx="10"/><text x="60" y="85" font-size="20" fill="white" text-anchor="middle">一等奖</text><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="t5_card1.click" fill="freeze"/></g></g><g id="t5_card2" transform="translate(240,50)"><rect width="120" height="150" fill="#3498db" rx="10"/><text x="60" y="85" font-size="40" fill="white" text-anchor="middle">?</text><g opacity="0"><rect width="120" height="150" fill="#95a5a6" rx="10"/><text x="60" y="85" font-size="20" fill="white" text-anchor="middle">谢谢参与</text><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="t5_card2.click" fill="freeze"/></g></g><g id="t5_card3" transform="translate(430,50)"><rect width="120" height="150" fill="#3498db" rx="10"/><text x="60" y="85" font-size="40" fill="white" text-anchor="middle">?</text><g opacity="0"><rect width="120" height="150" fill="#f1c40f" rx="10"/><text x="60" y="85" font-size="20" fill="white" text-anchor="middle">优惠券</text><animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="t5_card3.click" fill="freeze"/></g></g></svg>`
  },
  {
    id: 'game_balloon_pop',
    name: '气球戳戳乐',
    category: 'game',
    tags: ["游戏", "气球", "惊喜"],
    colorScheme: '#ff4757',
    interactive: true,
    interactionType: 'click_pop',
    svg: `<svg viewBox="0 0 200 300" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg"><text x="100" y="150" font-size="24" fill="#2f3542" text-anchor="middle">祝你快乐！</text><g id="t6_balloon"><ellipse cx="100" cy="120" rx="50" ry="70" fill="#ff4757"/><path d="M100,190 L95,205 L105,205 Z" fill="#ff4757"/><line x1="100" y1="205" x2="100" y2="260" stroke="#747d8c" stroke-width="2"/><animateTransform attributeName="transform" type="scale" from="1" to="1.5" dur="0.1s" begin="click" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="click" fill="freeze"/></g><text x="100" y="290" font-size="12" fill="#a4b0be" text-anchor="middle">戳破气球看惊喜</text></svg>`
  }
]

// =============================================
// 27. 动效装饰 (Animated Decoration) [INTERACTIVE/SMIL]
// =============================================
export const SVG_DECO_ANIMATE = [
  {
    id: 'deco_neon_text',
    name: '霓虹闪烁文字',
    category: 'deco_anim',
    tags: ["装饰", "霓虹灯", "发光"],
    colorScheme: '#00d2ff',
    interactive: true,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 80" style="width:100%;max-width:600px;display:block;margin:0 auto;background:#000;" xmlns="http://www.w3.org/2000/svg"><filter id="t7_blur"><feGaussianBlur stdDeviation="3" result="blur"/></filter><text x="300" y="55" font-size="40" fill="#00d2ff" text-anchor="middle" font-weight="bold" filter="url(#t7_blur)">NEON LIGHTS<animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/></text><text x="300" y="55" font-size="40" fill="#fff" text-anchor="middle" font-weight="bold">NEON LIGHTS</text></svg>`
  },
  {
    id: 'deco_confetti',
    name: '五彩纸屑飘落',
    category: 'deco_anim',
    tags: ["装饰", "氛围", "纸屑"],
    colorScheme: '#ff6b6b',
    interactive: true,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;overflow:hidden;" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#ff6b6b"><animateTransform attributeName="transform" type="translate" from="50,-10" to="50,210" dur="3s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 55 -5" to="360 55 -5" dur="2s" repeatCount="indefinite" additive="sum"/></rect><rect width="10" height="10" fill="#feca57"><animateTransform attributeName="transform" type="translate" from="150,-10" to="170,210" dur="4s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 155 -5" to="360 155 -5" dur="2.5s" repeatCount="indefinite" additive="sum"/></rect><rect width="10" height="10" fill="#48dbfb"><animateTransform attributeName="transform" type="translate" from="300,-10" to="280,210" dur="3.5s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 305 -5" to="360 305 -5" dur="1.8s" repeatCount="indefinite" additive="sum"/></rect><rect width="10" height="10" fill="#1dd1a1"><animateTransform attributeName="transform" type="translate" from="450,-10" to="460,210" dur="4.2s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 455 -5" to="360 455 -5" dur="3s" repeatCount="indefinite" additive="sum"/></rect><rect width="10" height="10" fill="#ff9ff3"><animateTransform attributeName="transform" type="translate" from="550,-10" to="530,210" dur="2.8s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 555 -5" to="360 555 -5" dur="2.2s" repeatCount="indefinite" additive="sum"/></rect></svg>`
  },
  {
    id: 'deco_firework',
    name: '点击烟花绽放',
    category: 'deco_anim',
    tags: ["装饰", "烟花", "交互"],
    colorScheme: '#ff9f43',
    interactive: true,
    interactionType: 'click_animate',
    svg: `<svg viewBox="0 0 400 400" style="width:100%;max-width:600px;display:block;margin:0 auto;background:#000;" xmlns="http://www.w3.org/2000/svg"><g transform="translate(200,200)"><circle r="0" fill="none" stroke="#ff9f43" stroke-width="2"><animate attributeName="r" from="0" to="150" dur="1s" begin="click" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="1s" begin="click" fill="freeze"/></circle><circle r="0" fill="none" stroke="#ff4757" stroke-width="2"><animate attributeName="r" from="0" to="120" dur="0.8s" begin="click" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="0.8s" begin="click" fill="freeze"/></circle><circle r="0" fill="none" stroke="#54a0ff" stroke-width="2"><animate attributeName="r" from="0" to="180" dur="1.2s" begin="click" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="1.2s" begin="click" fill="freeze"/></circle></g><text x="200" y="380" fill="#fff" font-size="14" text-anchor="middle">点击中心绽放烟花</text></svg>`
  },
  {
    id: 'deco_ribbon_wave',
    name: '飘动丝带装饰',
    category: 'deco_anim',
    tags: ["装饰", "丝带", "动态"],
    colorScheme: '#e84393',
    interactive: true,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 60" style="width:100%;max-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg"><path d="M0,30 Q75,10 150,30 T300,30 T450,30 T600,30" fill="none" stroke="#e84393" stroke-width="10" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" from="0,0" to="-150,0" dur="2s" repeatCount="indefinite"/></path><path d="M150,30 Q225,10 300,30 T450,30 T600,30 T750,30" fill="none" stroke="#fd79a8" stroke-width="6" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" from="0,0" to="-150,0" dur="1.5s" repeatCount="indefinite"/></path></svg>`
  },
  {
    id: 'deco_spotlight',
    name: '聚光灯效果',
    category: 'deco_anim',
    tags: ["装饰", "聚光灯", "神秘"],
    colorScheme: '#000000',
    interactive: true,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;display:block;margin:0 auto;background:#eee;" xmlns="http://www.w3.org/2000/svg"><defs><mask id="t11_mask"><rect width="600" height="200" fill="white"/><circle cx="0" cy="100" r="60" fill="black"><animate attributeName="cx" from="0" to="600" dur="4s" repeatCount="indefinite"/></circle></mask></defs><rect width="600" height="200" fill="#222" mask="url(#t11_mask)"/><text x="300" y="110" font-size="30" fill="#333" text-anchor="middle">探索隐藏的内容...</text></svg>`
  },
  {
    id: 'deco_snow_fall',
    name: '冬日雪花飘落',
    category: 'deco_anim',
    tags: ["装饰", "雪花", "冬日"],
    colorScheme: '#ffffff',
    interactive: true,
    interactionType: 'none',
    svg: `<svg viewBox="0 0 600 300" style="width:100%;max-width:600px;display:block;margin:0 auto;background:#74b9ff;" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="-10" r="3" fill="white"><animate attributeName="cy" from="-10" to="310" dur="5s" repeatCount="indefinite"/><animate attributeName="cx" values="50;70;50" dur="2s" repeatCount="indefinite"/></circle><circle cx="150" cy="-10" r="5" fill="white"><animate attributeName="cy" from="-10" to="310" dur="7s" repeatCount="indefinite"/><animate attributeName="cx" values="150;130;150" dur="3s" repeatCount="indefinite"/></circle><circle cx="300" cy="-10" r="4" fill="white"><animate attributeName="cy" from="-10" to="310" dur="6s" repeatCount="indefinite"/><animate attributeName="cx" values="300;320;300" dur="2.5s" repeatCount="indefinite"/></circle><circle cx="450" cy="-10" r="2" fill="white"><animate attributeName="cy" from="-10" to="310" dur="4s" repeatCount="indefinite"/><animate attributeName="cx" values="450;430;450" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="550" cy="-10" r="6" fill="white"><animate attributeName="cy" from="-10" to="310" dur="8s" repeatCount="indefinite"/><animate attributeName="cx" values="550;570;550" dur="4s" repeatCount="indefinite"/></circle></svg>`
  }
]

// =============================================
// 汇总导出
// =============================================
export const SVG_TEMPLATE_CATEGORIES = [
  { id: 'borders', name: '装饰边框', icon: '🖼', data: SVG_BORDERS },
  { id: 'dividers', name: '分隔线', icon: '➖', data: SVG_DIVIDERS },
  { id: 'badges', name: '徽章标签', icon: '🏅', data: SVG_BADGES },
  { id: 'patterns', name: '背景纹理', icon: '🎨', data: SVG_PATTERNS },
  { id: 'icons', name: '装饰插图', icon: '✨', data: SVG_ILLUSTRATIONS },
  { id: 'seasonal', name: '节日元素', icon: '🎉', data: SVG_SEASONAL },
  { id: 'text_deco', name: '文字装饰', icon: '💬', data: SVG_TEXT_DECO },
  { id: 'waves', name: '波浪形状', icon: '🌊', data: SVG_WAVES },
  { id: 'progress', name: '进度时间', icon: '📊', data: SVG_PROGRESS },
  { id: 'callouts', name: '提示面板', icon: '📋', data: SVG_CALLOUTS },
  { id: 'dataviz', name: '数据图表', icon: '📈', data: SVG_DATAVIZ },
  { id: 'arrows', name: '箭头连接', icon: '➡', data: SVG_ARROWS },
  { id: 'gradients', name: '渐变背景', icon: '🎆', data: SVG_GRADIENTS },
  { id: 'chinese', name: '中国风', icon: '🏮', data: SVG_CHINESE },
  { id: 'sketch', name: '手绘涂鸦', icon: '✏', data: SVG_SKETCH },
  { id: 'cards', name: '社交卡片', icon: '🃏', data: SVG_CARDS },
  { id: 'editorial', name: '编辑排版', icon: '📰', data: SVG_EDITORIAL },
  { id: 'botanical', name: '自然植物', icon: '🌿', data: SVG_BOTANICAL },
  { id: 'tech', name: '科技代码', icon: '💻', data: SVG_TECH },
  { id: 'music', name: '音乐音频', icon: '🎵', data: SVG_MUSIC },
  { id: 'lifestyle', name: '生活方式', icon: '☕', data: SVG_LIFESTYLE },
  { id: 'expand', name: '点击展开', icon: '📖', data: SVG_INTERACTIVE_EXPAND, interactive: true },
  { id: 'switch', name: '点击切换', icon: '🔄', data: SVG_INTERACTIVE_SWITCH, interactive: true },
  { id: 'animate', name: '自动动画', icon: '✨', data: SVG_AUTO_ANIMATE, interactive: true },
  { id: 'parallax', name: '视差滚动', icon: '🌊', data: SVG_PARALLAX, interactive: true },
  { id: 'game', name: '互动游戏', icon: '🎮', data: SVG_GAME, interactive: true },
  { id: 'deco_anim', name: '动效装饰', icon: '🎪', data: SVG_DECO_ANIMATE, interactive: true }
]

/**
 * 获取所有 SVG 模板（扁平化）
 */
export function getAllSvgTemplates() {
  return [
    ...SVG_BORDERS,
    ...SVG_DIVIDERS,
    ...SVG_BADGES,
    ...SVG_PATTERNS,
    ...SVG_ILLUSTRATIONS,
    ...SVG_SEASONAL,
    ...SVG_TEXT_DECO,
    ...SVG_WAVES,
    ...SVG_PROGRESS,
    ...SVG_CALLOUTS,
    ...SVG_DATAVIZ,
    ...SVG_ARROWS,
    ...SVG_GRADIENTS,
    ...SVG_CHINESE,
    ...SVG_SKETCH,
    ...SVG_CARDS,
    ...SVG_EDITORIAL,
    ...SVG_BOTANICAL,
    ...SVG_TECH,
    ...SVG_MUSIC,
    ...SVG_LIFESTYLE,
    ...SVG_INTERACTIVE_EXPAND,
    ...SVG_INTERACTIVE_SWITCH,
    ...SVG_AUTO_ANIMATE,
    ...SVG_PARALLAX,
    ...SVG_GAME,
    ...SVG_DECO_ANIMATE
  ]
}

/**
 * 根据分类获取 SVG 模板
 */
export function getSvgTemplatesByCategory(category) {
  const cat = SVG_TEMPLATE_CATEGORIES.find(c => c.id === category)
  return cat ? cat.data : []
}

/**
 * 根据 ID 获取单个 SVG 模板
 */
export function getSvgTemplateById(id) {
  return getAllSvgTemplates().find(t => t.id === id) || null
}

/**
 * 搜索 SVG 模板（按名称或标签）
 */
export function searchSvgTemplates(keyword) {
  const kw = keyword.toLowerCase()
  return getAllSvgTemplates().filter(t =>
    t.name.toLowerCase().includes(kw) ||
    t.tags.some(tag => tag.includes(kw))
  )
}
