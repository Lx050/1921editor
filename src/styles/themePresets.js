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
  },
  // ========== 校园主题 ==========
  {
    id: 'theme_youth_campus',
    name: '青春校园',
    description: '清新蓝色校园风格，适合日常校园推送',
    colorScheme: '#4A9FF5',
    styles: {
      title: 'title_graduation_cap',
      body: 'body_campus_card',
      intro: 'intro_youth_quote'
    }
  },
  {
    id: 'theme_graduation',
    name: '毕业季',
    description: '温暖金色毕业风格，适合毕业季、表彰类内容',
    colorScheme: '#F59E0B',
    styles: {
      title: 'title_star_youth',
      body: 'body_notebook_lined',
      intro: 'intro_growth_green'
    }
  },
  {
    id: 'theme_back_to_school',
    name: '开学季',
    description: '活力绿色开学风格，适合新学期、迎新类内容',
    colorScheme: '#10B981',
    styles: {
      title: 'title_book_open',
      body: 'body_spring_green',
      intro: 'intro_campus_announce'
    }
  },
  {
    id: 'theme_knowledge_light',
    name: '知识之光',
    description: '明亮知识风格，适合学术讲座、学习分享内容',
    colorScheme: '#F59E0B',
    styles: {
      title: 'title_lightbulb',
      body: 'body_sticky_note',
      intro: 'intro_study_tip'
    }
  },
  {
    id: 'theme_club_active',
    name: '活力社团',
    description: '活泼紫色风格，适合社团活动、校园文化内容',
    colorScheme: '#7C3AED',
    styles: {
      title: 'title_flag_banner',
      body: 'body_pink_ribbon',
      intro: 'intro_reading_corner'
    }
  },
  {
    id: 'theme_campus_bulletin',
    name: '校园公告',
    description: '醒目通知风格，适合校园通知、考试安排内容',
    colorScheme: '#EF4444',
    styles: {
      title: 'title_megaphone',
      body: 'body_bulletin',
      intro: 'intro_exam_notice'
    }
  },
  {
    id: 'theme_spring_campus',
    name: '春日校园',
    description: '温柔粉色风格，适合春游、文艺汇演内容',
    colorScheme: '#EC4899',
    styles: {
      title: 'title_cherry_blossom',
      body: 'body_sunflower',
      intro: 'intro_spring_bloom'
    }
  },
  {
    id: 'theme_chalkboard',
    name: '黑板风',
    description: '经典黑板教室风格，适合课堂笔记、教学内容',
    colorScheme: '#2D5016',
    styles: {
      title: 'title_campus_board',
      body: 'body_chalkboard',
      intro: 'intro_campus_news'
    }
  },
  // ========== SOTA 灵感新增校园主题 ==========
  {
    id: 'theme_sports_meet',
    name: '运动会',
    description: '活力运动风格，适合运动会、体育赛事内容',
    colorScheme: '#EF4444',
    styles: {
      title: 'title_sports_run',
      body: 'body_event_card',
      intro: 'intro_exam_notice'
    }
  },
  {
    id: 'theme_music_fest',
    name: '文艺汇演',
    description: '紫色文艺风格，适合音乐会、文艺演出、才艺展示',
    colorScheme: '#7C3AED',
    styles: {
      title: 'title_music_note',
      body: 'body_pink_ribbon',
      intro: 'intro_reading_corner'
    }
  },
  {
    id: 'theme_award_ceremony',
    name: '表彰大会',
    description: '金色荣誉风格，适合评优表彰、奖学金公示',
    colorScheme: '#F59E0B',
    styles: {
      title: 'title_trophy',
      body: 'body_bulletin',
      intro: 'intro_growth_green'
    }
  },
  {
    id: 'theme_numbered_guide',
    name: '编号指南',
    description: '蓝色编号风格，适合流程指引、步骤说明',
    colorScheme: '#3B82F6',
    styles: {
      title: 'title_number_01',
      body: 'body_timeline_dot',
      intro: 'intro_campus_announce'
    }
  },
  {
    id: 'theme_science_lab',
    name: '科学实验',
    description: '绿色实验室风格，适合科技创新、实验报告',
    colorScheme: '#22C55E',
    styles: {
      title: 'title_leaf_fresh',
      body: 'body_science_lab',
      intro: 'intro_study_tip'
    }
  },
  {
    id: 'theme_photo_album',
    name: '校园相册',
    description: '简洁相框风格，适合校园活动回顾、图片展',
    colorScheme: '#6B7280',
    styles: {
      title: 'title_bracket_green',
      body: 'body_photo_frame',
      intro: 'intro_youth_quote'
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
