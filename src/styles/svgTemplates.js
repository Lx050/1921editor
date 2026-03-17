/**
 * SVG 装饰模板库
 * 提供 7 大类 SVG 装饰模板，用于微信公众号文章排版
 * 所有 SVG 均为内联格式，兼容微信 WebView
 *
 * 分类:
 * 1. borders   - 装饰边框/画框
 * 2. dividers  - 分隔线/分割线
 * 3. badges    - 徽章/标签/印章
 * 4. patterns  - 背景纹理图案
 * 5. icons     - 装饰性插图
 * 6. seasonal  - 节日/季节元素
 * 7. text_deco - 文字装饰(引号/高亮/气泡)
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
// 汇总导出
// =============================================
export const SVG_TEMPLATE_CATEGORIES = [
  { id: 'borders', name: '装饰边框', icon: '🖼', data: SVG_BORDERS },
  { id: 'dividers', name: '分隔线', icon: '➖', data: SVG_DIVIDERS },
  { id: 'badges', name: '徽章标签', icon: '🏅', data: SVG_BADGES },
  { id: 'patterns', name: '背景纹理', icon: '🎨', data: SVG_PATTERNS },
  { id: 'icons', name: '装饰插图', icon: '✨', data: SVG_ILLUSTRATIONS },
  { id: 'seasonal', name: '节日元素', icon: '🎉', data: SVG_SEASONAL },
  { id: 'text_deco', name: '文字装饰', icon: '💬', data: SVG_TEXT_DECO }
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
    ...SVG_TEXT_DECO
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
