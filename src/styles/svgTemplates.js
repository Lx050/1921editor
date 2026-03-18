/**
 * SVG 装饰模板库
 * 提供 13 大类 SVG 装饰模板，用于微信公众号文章排版
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
  { id: 'gradients', name: '渐变背景', icon: '🎆', data: SVG_GRADIENTS }
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
    ...SVG_GRADIENTS
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
