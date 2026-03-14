/**
 * 主题预设包
 * 每个主题包含一套协调的标题、正文、引言样式组合
 */

export const themePresets = [
  {
    id: 'theme_tech_blue',
    name: '科技蓝',
    description: '现代科技风格，适合技术类文章',
    colorScheme: '#2563eb',
    styles: {
      title: 'title_blue_box',
      body: 'body_dashed_box',
      intro: 'intro_gradient_bg'
    }
  },
  {
    id: 'theme_business_gray',
    name: '商务灰',
    description: '专业商务风格，适合正式场合',
    colorScheme: '#6b7280',
    styles: {
      title: 'title_mac',
      body: 'body_mac_window',
      intro: 'intro_vertical_line'
    }
  },
  {
    id: 'theme_fresh_green',
    name: '清新绿',
    description: '自然清新风格，适合生活类内容',
    colorScheme: '#10b981',
    styles: {
      title: 'title_gradient_tag',
      body: 'body_paper_note',
      intro: 'intro_green_icon'
    }
  },
  {
    id: 'theme_warm_orange',
    name: '温暖橙',
    description: '温暖活力风格，适合创意内容',
    colorScheme: '#f97316',
    styles: {
      title: 'title_orange_gradient',
      body: 'body_orange_dots',
      intro: 'intro_red_orange_bars'
    }
  },
  {
    id: 'theme_minimal_black',
    name: '简约黑',
    description: '极简优雅风格，适合文艺内容',
    colorScheme: '#1f2937',
    styles: {
      title: 'title_ins_simple',
      body: 'body_ins_card',
      intro: 'intro_quote_big'
    }
  },
  {
    id: 'theme_elegant_purple',
    name: '优雅紫',
    description: '优雅紫色风格，适合时尚创意内容',
    colorScheme: '#8b5cf6',
    styles: {
      title: 'title_purple_badge',
      body: 'body_shadow_card',
      intro: 'intro_dotted_frame'
    }
  },
  {
    id: 'theme_warm_red',
    name: '中国红',
    description: '传统中国红风格，适合节日喜庆内容',
    colorScheme: '#dc2626',
    styles: {
      title: 'title_stamp_red',
      body: 'body_red_corner',
      intro: 'intro_red_orange_bars'
    }
  },
  {
    id: 'theme_dark_pro',
    name: '暗夜专业',
    description: '深色专业风格，适合高端科技内容',
    colorScheme: '#334155',
    styles: {
      title: 'title_dark_band',
      body: 'body_mac_window',
      intro: 'intro_dark_mode'
    }
  },
  {
    id: 'theme_nature_earth',
    name: '大地色',
    description: '自然大地色风格，适合文化艺术内容',
    colorScheme: '#92400e',
    styles: {
      title: 'title_chinese_ink',
      body: 'body_highlight_box',
      intro: 'intro_highlight_strip'
    }
  },
  {
    id: 'theme_candy_pink',
    name: '糖果粉',
    description: '活泼糖果风格，适合轻松趣味内容',
    colorScheme: '#ec4899',
    styles: {
      title: 'title_rainbow_underline',
      body: 'body_rounded_bubble',
      intro: 'intro_gradient_left'
    }
  }
]

/**
 * 根据 ID 获取主题
 */
export function getThemeById(id) {
  return themePresets.find(theme => theme.id === id)
}

/**
 * 获取所有主题
 */
export function getAllThemes() {
  return themePresets
}
