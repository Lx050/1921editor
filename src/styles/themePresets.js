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
  },
  // ========== SOTA Mintimate 8色主题体系（第二轮迭代） ==========
  {
    id: 'theme_energetic_orange',
    name: '焕能橙（SOTA）',
    description: 'Mintimate 橙色系，活力充沛',
    colorScheme: '#f97316',
    styles: {
      title: 'title_gradient_tag',
      body: 'body_quote_orange',
      intro: 'intro_gradient_tech'
    }
  },
  {
    id: 'theme_code_purple',
    name: '编程紫（SOTA）',
    description: 'Mintimate 紫色系，极客风格',
    colorScheme: '#674AF6',
    styles: {
      title: 'title_geek_pattern',
      body: 'body_gradient_frost',
      intro: 'intro_overlay_caption'
    }
  },
  {
    id: 'theme_wechat_green',
    name: '微信绿（SOTA）',
    description: 'Mintimate 绿色系，微信原生风',
    colorScheme: '#07c160',
    styles: {
      title: 'title_left_accent',
      body: 'body_quote_green',
      intro: 'intro_green_icon'
    }
  },
  {
    id: 'theme_source_blue',
    name: '源码蓝（SOTA）',
    description: 'Mintimate 蓝色系，技术文档风',
    colorScheme: '#0366d6',
    styles: {
      title: 'title_tech_gradient',
      body: 'body_inset_shadow',
      intro: 'intro_gradient_tech'
    }
  },
  {
    id: 'theme_aurora_cyan',
    name: '极光青（SOTA）',
    description: 'Mintimate 青色系，清新自然',
    colorScheme: '#00bcd4',
    styles: {
      title: 'title_center_bottom_line',
      body: 'body_elevation_card',
      intro: 'intro_shadow_quote'
    }
  },
  {
    id: 'theme_sakura_pink',
    name: '樱花粉（SOTA）',
    description: 'Mintimate 粉色系，柔美浪漫',
    colorScheme: '#CF6C88',
    styles: {
      title: 'title_asymmetric_card',
      body: 'body_quote_red',
      intro: 'intro_dashed_elegant'
    }
  },
  {
    id: 'theme_build_gold',
    name: '构建金（SOTA）',
    description: 'Mintimate 金色系，温暖稳重',
    colorScheme: '#ff9800',
    styles: {
      title: 'title_shadow_elegant',
      body: 'body_elevation_card',
      intro: 'intro_shadow_quote'
    }
  },
  {
    id: 'theme_deep_dark',
    name: '深邃黑（SOTA）',
    description: 'Mintimate 暗色系，沉稳专业',
    colorScheme: '#333333',
    styles: {
      title: 'title_inverted_bg',
      body: 'body_inset_shadow',
      intro: 'intro_overlay_caption'
    }
  },
  // ========== 国潮/新拟态/Alert 主题（第三轮迭代） ==========
  {
    id: 'theme_guochao_classic',
    name: '国潮古韵',
    description: '传统中国风，金色+红色+楷体，适合文化类内容',
    colorScheme: '#d4af37',
    styles: {
      title: 'title_guochao_gold',
      body: 'body_guochao_classic',
      intro: 'intro_alert_important'
    }
  },
  {
    id: 'theme_neumorphic',
    name: '新拟态',
    description: '柔和立体新拟态风格，适合科技/设计类文章',
    colorScheme: '#a3b1c6',
    styles: {
      title: 'title_neumorphic',
      body: 'body_neumorphic',
      intro: 'intro_alert_note'
    }
  },
  {
    id: 'theme_ink_wash',
    name: '水墨丹青',
    description: '中国水墨画风格，淡雅写意',
    colorScheme: '#5a5a5a',
    styles: {
      title: 'title_ink_wash',
      body: 'body_glassmorphism',
      intro: 'intro_alert_tip'
    }
  },
  {
    id: 'theme_github_alert',
    name: 'GitHub Alert',
    description: 'GitHub 风格 Alert 配色，适合技术文档',
    colorScheme: '#0969da',
    styles: {
      title: 'title_gradient_border',
      body: 'body_gradient_border',
      intro: 'intro_alert_note'
    }
  },
  // ========== 杂志/复古/赛博/极光主题（第四轮迭代） ==========
  {
    id: 'theme_editorial_magazine',
    name: '杂志排版',
    description: '经典杂志衬线风格，优雅大气的排版',
    colorScheme: '#2c3e50',
    styles: {
      title: 'title_editorial_serif',
      body: 'body_editorial_serif',
      intro: 'intro_magazine_pullquote'
    }
  },
  {
    id: 'theme_retro_terminal',
    name: '终端黑客',
    description: '复古终端/黑客风格，绿色荧光字',
    colorScheme: '#00ff41',
    styles: {
      title: 'title_retro_terminal',
      body: 'body_retro_terminal',
      intro: 'intro_synthwave_neon'
    }
  },
  {
    id: 'theme_synthwave',
    name: '赛博朋克',
    description: '赛博朋克霓虹风格，暗色调+霓虹色',
    colorScheme: '#ff006e',
    styles: {
      title: 'title_synthwave',
      body: 'body_retro_terminal',
      intro: 'intro_synthwave_neon'
    }
  },
  {
    id: 'theme_vintage_newspaper',
    name: '复古报纸',
    description: '1940s 复古报纸风格，做旧纸张质感',
    colorScheme: '#8b6914',
    styles: {
      title: 'title_newspaper',
      body: 'body_newspaper_vintage',
      intro: 'intro_retro_sepia'
    }
  },
  // ========== 粘土/粗野派/侘寂/全息主题（第五轮迭代） ==========
  {
    id: 'theme_claymorphism',
    name: '粘土风格',
    description: '柔软3D粘土效果，现代温和的视觉体验',
    colorScheme: '#37597d',
    styles: {
      title: 'title_claymorphism',
      body: 'body_claymorphism',
      intro: 'intro_clay_callout'
    }
  },
  {
    id: 'theme_brutalist',
    name: '粗野派',
    description: '高对比粗野主义风格，大胆直接的视觉冲击',
    colorScheme: '#000000',
    styles: {
      title: 'title_brutalist',
      body: 'body_brutalist',
      intro: 'intro_brutalist_accent'
    }
  },
  {
    id: 'theme_wabi_sabi',
    name: '侘寂禅意',
    description: '日式侘寂美学，素雅极简的自然之美',
    colorScheme: '#8b7e74',
    styles: {
      title: 'title_wabi_sabi',
      body: 'body_wabi_sabi',
      intro: 'intro_wabi_sabi_zen'
    }
  },
  {
    id: 'theme_holographic',
    name: '全息彩虹',
    description: '彩虹全息渐变效果，未来感十足',
    colorScheme: '#667eea',
    styles: {
      title: 'title_holographic',
      body: 'body_holographic',
      intro: 'intro_holographic_card'
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
