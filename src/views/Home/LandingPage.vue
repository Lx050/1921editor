<template>
  <div style="background:#fff; min-height:100vh; display:flex; flex-direction:column;">

    <!-- Hero 区域 -->
    <div style="
      max-width:1200px; margin:0 auto;
      padding:80px 24px 64px;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:64px;
      align-items:center;
    " class="hero-grid">
      <!-- 左侧文字 -->
      <div>
        <div style="
          display:inline-flex; align-items:center; gap:6px;
          padding:4px 12px;
          background:var(--color-badge-bg);
          color:var(--color-badge-text);
          border-radius:9999px;
          font-size:12px;
          font-weight:600;
          letter-spacing:0.02em;
          margin-bottom:24px;
        ">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="6" cy="6" r="3"/>
          </svg>
          版式装配引擎 V1.0
        </div>

        <h1 style="
          font-size:52px; font-weight:700;
          color:rgba(0,0,0,0.95);
          line-height:1.08;
          letter-spacing:-1.75px;
          margin:0 0 20px;
          font-family:var(--font-display);
        ">
          为公众号而生的<br>
          <span style="color:var(--color-accent-primary);">智能排版引擎</span>
        </h1>

        <p style="
          font-size:18px; font-weight:400;
          color:var(--color-text-secondary);
          line-height:1.65;
          margin:0 0 36px;
          max-width:420px;
        ">
          简化排版工作流。团队协作与智能样式让你专注内容本身，告别重复的格式调整。
        </p>

        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <button
            @click="router.push('/step1')"
            style="
              padding:10px 24px;
              background:var(--color-accent-primary);
              color:#fff;
              border:none;
              border-radius:4px;
              font-size:15px;
              font-weight:600;
              cursor:pointer;
              transition:background 150ms;
              letter-spacing:-0.1px;
            "
            onmouseover="this.style.background='var(--color-accent-hover)'"
            onmouseout="this.style.background='var(--color-accent-primary)'"
          >
            免费开始使用
          </button>
          <a
            href="#features"
            style="
              padding:10px 20px;
              background:rgba(0,0,0,0.05);
              color:rgba(0,0,0,0.75);
              border:none;
              border-radius:4px;
              font-size:15px;
              font-weight:600;
              cursor:pointer;
              text-decoration:none;
              transition:background 150ms;
            "
            onmouseover="this.style.background='rgba(0,0,0,0.08)'"
            onmouseout="this.style.background='rgba(0,0,0,0.05)'"
          >了解更多</a>
        </div>

      </div>

      <!-- 右侧图片 -->
      <div style="border-radius:12px; overflow:hidden; border:1px solid rgba(0,0,0,0.1); box-shadow:var(--shadow-float);">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          alt="工作台"
          style="width:100%; display:block; aspect-ratio:16/10; object-fit:cover;"
        />
      </div>
    </div>

    <!-- 特性区域 -->
    <div id="features" style="background:var(--color-bg-warm); border-top:1px solid rgba(0,0,0,0.07); border-bottom:1px solid rgba(0,0,0,0.07);">
      <div style="max-width:1200px; margin:0 auto; padding:64px 24px;">
        <div style="text-align:center; margin-bottom:48px;">
          <h2 style="
            font-size:36px; font-weight:700;
            color:rgba(0,0,0,0.95);
            letter-spacing:-1px;
            margin:0 0 12px;
            font-family:var(--font-display);
          ">一切为内容服务</h2>
          <p style="font-size:16px; color:var(--color-text-secondary); margin:0; max-width:480px; margin-inline:auto; line-height:1.6;">
            专为微信公众号内容团队设计的排版工具，让每次发布都轻松高效
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:16px;">
          <div v-for="f in features" :key="f.title" style="
            background:#fff;
            border:1px solid rgba(0,0,0,0.1);
            border-radius:12px;
            padding:24px;
            box-shadow:var(--shadow-content-card);
          ">
            <div style="
              width:40px; height:40px;
              border-radius:8px;
              display:flex; align-items:center; justify-content:center;
              font-size:20px;
              margin-bottom:16px;
            " :style="{background: f.bg}">{{ f.icon }}</div>
            <h3 style="font-size:15px; font-weight:700; color:rgba(0,0,0,0.9); margin:0 0 8px; letter-spacing:-0.2px;">{{ f.title }}</h3>
            <p style="font-size:13px; color:var(--color-text-secondary); line-height:1.6; margin:0;">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA 区域 -->
    <div style="max-width:1200px; margin:0 auto; padding:80px 24px; text-align:center;">
      <h2 style="
        font-size:40px; font-weight:700;
        color:rgba(0,0,0,0.95);
        letter-spacing:-1.2px;
        margin:0 0 16px;
        font-family:var(--font-display);
      ">现在就开始</h2>
      <p style="font-size:16px; color:var(--color-text-secondary); margin:0 0 32px; line-height:1.6;">
        无需安装，打开浏览器即可使用
      </p>
      <button
        @click="router.push('/step1')"
        style="
          padding:12px 32px;
          background:var(--color-accent-primary);
          color:#fff;
          border:none;
          border-radius:4px;
          font-size:16px;
          font-weight:600;
          cursor:pointer;
          transition:background 150ms;
          letter-spacing:-0.2px;
        "
        onmouseover="this.style.background='var(--color-accent-hover)'"
        onmouseout="this.style.background='var(--color-accent-primary)'"
      >
        免费开始排版
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  { icon: '⚡', bg: 'var(--color-warning-light)', title: '三步完成排版', desc: '输入文本 → 编辑内容 → 生成预览，最快三分钟完成一篇公众号图文排版。' },
  { icon: '🎨', bg: '#f0f7ff', title: '多套专业样式', desc: '内置多种经过实战验证的排版样式，覆盖日常推文、活动宣传、转载等常用场景。' },
  { icon: '🤝', bg: 'var(--color-success-light)', title: '团队协作', desc: '多人共享空间，统一样式配置，保持团队内容风格的高度一致性。' },
  { icon: '📱', bg: '#faf5ff', title: '真机预览', desc: '实时模拟微信公众号的实际显示效果，所见即所得，避免发布后的格式意外。' },
]
</script>

<style scoped>
@media (max-width: 768px) {
  .hero-grid {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
    padding-top: 48px !important;
  }
}
</style>
