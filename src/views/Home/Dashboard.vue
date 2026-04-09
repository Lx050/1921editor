<template>
  <div style="min-height: 100vh; background: var(--color-bg-page);">

    <!-- ===== 顶部导航栏 ===== -->
    <nav style="
      background: #fff;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 40;
    ">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; height: 52px;">

          <!-- 品牌 + 空间名 -->
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="
              width: 32px; height: 32px;
              background: var(--color-accent-primary);
              border-radius: 6px;
              display: flex; align-items: center; justify-content: center;
              flex-shrink: 0;
            ">
              <span style="color:#fff; font-weight:700; font-size:16px; font-family:var(--font-display); letter-spacing:-0.5px;">B</span>
            </div>
            <span style="font-size:15px; font-weight:600; color:rgba(0,0,0,0.95); font-family:var(--font-display); letter-spacing:-0.2px;" class="hidden sm:inline">
              排版助手
            </span>
            <template v-if="userStore.currentTenant?.name">
              <div style="width:1px; height:18px; background:rgba(0,0,0,0.12);" class="hidden sm:block"></div>
              <span style="font-size:13px; color:var(--color-text-secondary);" class="hidden sm:inline">
                {{ userStore.currentTenant.name }}
              </span>
            </template>
          </div>

          <!-- 右侧操作区 -->
          <div style="display:flex; align-items:center; gap:8px;">

            <!-- 样式装配 -->
            <router-link
              to="/style-config"
              class="hidden md:flex"
              style="
                align-items: center; gap: 6px;
                padding: 6px 14px;
                background: var(--color-accent-primary);
                color: #fff;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 600;
                text-decoration: none;
                transition: background 150ms;
                border: 1px solid transparent;
              "
              onmouseover="this.style.background='var(--color-accent-hover)'"
              onmouseout="this.style.background='var(--color-accent-primary)'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
              </svg>
              样式装配
            </router-link>

            <!-- 未登录 -->
            <template v-if="!userStore.isLoggedIn">
              <router-link
                to="/login"
                style="padding:6px 12px; font-size:13px; font-weight:600; color:rgba(0,0,0,0.6); text-decoration:none; border-radius:4px; transition:color 150ms;"
                onmouseover="this.style.color='rgba(0,0,0,0.95)'"
                onmouseout="this.style.color='rgba(0,0,0,0.6)'"
              >登录</router-link>
              <router-link
                to="/register"
                style="
                  padding:6px 14px;
                  background:var(--color-accent-primary);
                  color:#fff;
                  border-radius:4px;
                  font-size:13px;
                  font-weight:600;
                  text-decoration:none;
                  transition:background 150ms;
                "
                onmouseover="this.style.background='var(--color-accent-hover)'"
                onmouseout="this.style.background='var(--color-accent-primary)'"
              >注册</router-link>
            </template>

            <!-- 已登录 — 用户头像 + 下拉 -->
            <div v-else style="position:relative;" @mouseenter="showSettings=true" @mouseleave="showSettings=false">
              <button style="
                display:flex; align-items:center; gap:8px;
                padding:4px 8px;
                border:1px solid rgba(0,0,0,0.1);
                border-radius:6px;
                background:#fff;
                cursor:pointer;
                transition:background 150ms;
                font-size:13px;
                color:rgba(0,0,0,0.7);
                font-weight:500;
              "
              onmouseover="this.style.background='var(--color-bg-warm)'"
              onmouseout="this.style.background='#fff'">
                <div style="
                  width:26px; height:26px;
                  background:var(--color-accent-soft);
                  border-radius:50%;
                  display:flex; align-items:center; justify-content:center;
                  font-size:12px; font-weight:700;
                  color:var(--color-accent-primary);
                ">
                  {{ (userStore.userInfo?.displayName || userStore.userInfo?.name || 'U').charAt(0) }}
                </div>
                <span class="hidden sm:inline" style="max-width:100px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                  {{ userStore.userInfo?.displayName || userStore.userInfo?.name || '创作者' }}
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>

              <!-- 下拉菜单 -->
              <transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="showSettings"
                  style="
                    position:absolute; right:0; top:calc(100% + 4px);
                    width:220px;
                    background:#fff;
                    border:1px solid rgba(0,0,0,0.1);
                    border-radius:8px;
                    box-shadow:var(--shadow-float);
                    padding:6px 0;
                    z-index:50;
                  "
                >
                  <div style="padding:6px 12px 4px; font-size:11px; font-weight:600; color:var(--color-text-muted); text-transform:uppercase; letter-spacing:0.06em;">空间管理</div>
                  <button @click="router.push('/tenant-select')" class="dropdown-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    切换空间
                  </button>
                  <button @click="router.push('/settings/tenant')" class="dropdown-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    空间设置
                  </button>
                  <div style="height:1px; background:rgba(0,0,0,0.07); margin:6px 0;"></div>
                  <div style="padding:4px 12px; font-size:11px; font-weight:600; color:var(--color-text-muted); text-transform:uppercase; letter-spacing:0.06em;">系统设置</div>
                  <button @click="router.push('/settings/wechat')" class="dropdown-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    公众号设置
                  </button>
                  <div style="height:1px; background:rgba(0,0,0,0.07); margin:6px 0;"></div>
                  <button @click="handleLogout" class="dropdown-item" style="color:var(--color-error);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    退出登录
                  </button>
                </div>
              </transition>
            </div>
          </div>

        </div>
      </div>
    </nav>

    <!-- ===== 主内容 ===== -->
    <main style="max-width:1200px; margin:0 auto; padding:48px 24px 80px;">

      <!-- 开始创作 -->
      <section style="margin-bottom:64px;">
        <div style="margin-bottom:32px;">
          <h1 style="
            font-size:32px; font-weight:700;
            color:rgba(0,0,0,0.95);
            letter-spacing:-0.75px;
            line-height:1.2;
            margin:0 0 8px;
            font-family:var(--font-display);
          ">开始创作</h1>
          <p style="font-size:15px; color:var(--color-text-secondary); margin:0; line-height:1.6;">
            选择适合的创作模式，开启高效的公众号图文排版体验
          </p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">

          <!-- 日常模式 -->
          <div
            @click="startWork('daily')"
            class="mode-card"
            style="--hover-border: rgba(0,117,222,0.3); --hover-bg: rgba(0,117,222,0.02);"
          >
            <div style="display:flex; align-items:flex-start; gap:16px; margin-bottom:16px;">
              <div style="
                width:44px; height:44px; border-radius:10px;
                background: #f0f7ff;
                display:flex; align-items:center; justify-content:center;
                flex-shrink:0;
                font-size:22px;
              ">📝</div>
              <div>
                <h3 style="font-size:16px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px; letter-spacing:-0.2px;">日常模式</h3>
                <span class="notion-badge">常用推荐</span>
              </div>
            </div>
            <p style="font-size:14px; color:var(--color-text-secondary); line-height:1.6; margin:0 0 20px;">
              适用于日常公众号图文排版，支持标准格式和多图模式，提供灵活的创作体验。
            </p>
            <div style="display:flex; align-items:center; gap:4px; font-size:13px; font-weight:600; color:var(--color-accent-primary);">
              立即开始
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- 三下乡模式 -->
          <div
            @click="startWork('three_rural')"
            class="mode-card"
            style="--hover-border: rgba(22,163,74,0.3); --hover-bg: rgba(22,163,74,0.02);"
          >
            <div style="display:flex; align-items:flex-start; gap:16px; margin-bottom:16px;">
              <div style="
                width:44px; height:44px; border-radius:10px;
                background:var(--color-success-light);
                display:flex; align-items:center; justify-content:center;
                flex-shrink:0;
                font-size:22px;
              ">🏡</div>
              <div>
                <h3 style="font-size:16px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px; letter-spacing:-0.2px;">三下乡模式</h3>
                <span class="notion-badge" style="background:var(--color-success-light); color:var(--color-success);">专项模板</span>
              </div>
            </div>
            <p style="font-size:14px; color:var(--color-text-secondary); line-height:1.6; margin:0 0 20px;">
              三下乡社会实践专项活动排版模板，符合特定规范，助力实践活动宣传。
            </p>
            <div style="display:flex; align-items:center; gap:4px; font-size:13px; font-weight:600; color:var(--color-success);">
              立即开始
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- 转载模式 -->
          <div
            @click="startWork('reprint')"
            class="mode-card"
            style="--hover-border: rgba(124,58,237,0.25); --hover-bg: rgba(124,58,237,0.02);"
          >
            <div style="display:flex; align-items:flex-start; gap:16px; margin-bottom:16px;">
              <div style="
                width:44px; height:44px; border-radius:10px;
                background:#faf5ff;
                display:flex; align-items:center; justify-content:center;
                flex-shrink:0;
                font-size:22px;
              ">📋</div>
              <div>
                <h3 style="font-size:16px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 4px; letter-spacing:-0.2px;">转载模式</h3>
                <span class="notion-badge" style="background:#faf5ff; color:#7c3aed;">高效复用</span>
              </div>
            </div>
            <p style="font-size:14px; color:var(--color-text-secondary); line-height:1.6; margin:0 0 20px;">
              标准化转载文章排版，自动处理引用和格式转换，让内容复用更简单。
            </p>
            <div style="display:flex; align-items:center; gap:4px; font-size:13px; font-weight:600; color:#7c3aed;">
              立即开始
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

        </div>
      </section>

      <!-- ===== 最近草稿 ===== -->
      <section>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
          <div>
            <h2 style="
              font-size:22px; font-weight:700;
              color:rgba(0,0,0,0.95);
              letter-spacing:-0.4px;
              margin:0 0 4px;
              font-family:var(--font-display);
            ">最近草稿</h2>
            <p style="font-size:13px; color:var(--color-text-secondary); margin:0;">继续编辑您的创作内容</p>
          </div>
        </div>

        <!-- 加载中 -->
        <div v-if="loading" style="padding:48px 0; text-align:center;">
          <div style="display:inline-flex; flex-direction:column; align-items:center; gap:12px;">
            <div style="
              width:32px; height:32px;
              border:2px solid rgba(0,0,0,0.08);
              border-top-color:var(--color-accent-primary);
              border-radius:50%;
              animation:spin 0.8s linear infinite;
            "></div>
            <span style="font-size:13px; color:var(--color-text-muted);">加载中...</span>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-else-if="articles.length === 0"
          style="
            padding:48px 24px;
            text-align:center;
            background:var(--color-bg-warm);
            border:1px dashed rgba(0,0,0,0.15);
            border-radius:12px;
          "
        >
          <div style="display:inline-flex; flex-direction:column; align-items:center; gap:12px;">
            <div style="
              width:48px; height:48px;
              background:rgba(0,0,0,0.05);
              border-radius:50%;
              display:flex; align-items:center; justify-content:center;
            ">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <p style="font-size:14px; color:var(--color-text-secondary); margin:0;">暂无草稿，快去创建第一篇排版吧！</p>
            <button
              @click="startWork('daily')"
              style="
                padding:8px 20px;
                background:var(--color-accent-primary);
                color:#fff;
                border:none;
                border-radius:4px;
                font-size:13px;
                font-weight:600;
                cursor:pointer;
                transition:background 150ms;
              "
              onmouseover="this.style.background='var(--color-accent-hover)'"
              onmouseout="this.style.background='var(--color-accent-primary)'"
            >立即开始创作</button>
          </div>
        </div>

        <!-- 文章列表 -->
        <div v-else style="display:flex; flex-direction:column; gap:1px; background:rgba(0,0,0,0.07); border:1px solid rgba(0,0,0,0.1); border-radius:12px; overflow:hidden;">
          <div
            v-for="(article, index) in articles"
            :key="article.id"
            class="article-row"
            @click="continueEdit(article.id)"
            :style="{ animationDelay: `${index * 40}ms` }"
          >
            <!-- 文章信息 -->
            <div style="flex:1; min-width:0; margin-right:16px;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                <h3 style="
                  font-size:14px; font-weight:600;
                  color:rgba(0,0,0,0.9);
                  margin:0;
                  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
                ">{{ article.title || '无标题' }}</h3>
                <span
                  :class="['notion-badge', getStatusBadgeClass(article.status)]"
                  style="flex-shrink:0;"
                >{{ formatStatus(article.status) }}</span>
              </div>
              <div style="display:flex; align-items:center; gap:4px; font-size:12px; color:var(--color-text-muted);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ formatDate(article.updatedAt) }}
              </div>
            </div>

            <!-- 操作按钮 -->
            <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
              <button
                @click.stop="confirmDeleteArticle(article)"
                class="icon-btn"
                title="删除"
                style="color:rgba(0,0,0,0.3);"
                onmouseover="this.style.color='var(--color-error)'; this.style.background='var(--color-error-light)'"
                onmouseout="this.style.color='rgba(0,0,0,0.3)'; this.style.background='transparent'"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
              <div class="icon-btn" style="color:var(--color-accent-primary); background:var(--color-badge-bg);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
            </div>

          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirm } from '@/composables/useConfirm'
import { useUserStore } from '../../stores/userStore'
import { useConfigStore } from '../../stores/configStore'
import { useAppStore } from '../../stores/appStore'
import { getArticles, getArticle, type Article } from '../../api/article'
import api from '../../utils/api'
import toast from '../../composables/useToast'

const router = useRouter()
const userStore = useUserStore()
const configStore = useConfigStore()
const appStore = useAppStore()

watch(() => userStore.currentTenant?.id, (newId) => {
  if (newId) {
    configStore.fetchBackendConfig(newId)
  }
}, { immediate: true })

const articles = ref<Article[]>([])
const loading = ref(true)
const showSettings = ref(false)
const isDeleting = ref(false)

const confirmDeleteArticle = async (article: Article) => {
  if (isDeleting.value) return
  const confirmed = await showConfirm({ title: '确认删除', message: `确定要删除文章「${article.title || '无标题'}」吗？此操作不可恢复。`, type: 'danger', confirmText: '删除', cancelText: '取消' })
  if (!confirmed) return
  isDeleting.value = true
  try {
    await api.delete(`/articles/${article.id}`)
    articles.value = articles.value.filter(a => a.id !== article.id)
    toast.success('文章已删除')
  } catch (error: any) {
    toast.error(error.response?.data?.message || '删除失败，请重试')
  } finally {
    isDeleting.value = false
  }
}

const startWork = (mode: 'daily' | 'three_rural' | 'reprint') => {
  appStore.resetApp()
  appStore.initializeUserMetadata(userStore.userInfo)
  configStore.setMode(mode)
  router.push('/step1')
}

const handleLogout = async () => {
  const confirmed = await showConfirm({ message: '确定要退出登录吗？', type: 'warning' })
  if (confirmed) {
    userStore.logout()
    router.push('/')
  }
}

const continueEdit = async (id: string) => {
  try {
    loading.value = true
    appStore.resetApp()
    const article = await getArticle(id)
    appStore.setCurrentArticleId(article.id)
    if (article.config) {
      appStore.setStyleConfig(article.config)
      if (article.config.metadata) {
        const meta = article.config.metadata
        if (meta.editorInput !== undefined) appStore.editorInput = meta.editorInput
        if (meta.teamName !== undefined) appStore.teamName = meta.teamName
        if (meta.sourceAccount !== undefined) appStore.sourceAccount = meta.sourceAccount
        if (meta.copywriterNames) appStore.copywriterNames = meta.copywriterNames
        if (meta.plannerNames) appStore.plannerNames = meta.plannerNames
        if (meta.editorNames) appStore.editorNames = meta.editorNames
      }
    }
    let hasContentBlocks = false
    if (article.content) {
      try {
        const savedBlocks = JSON.parse(article.content)
        if (Array.isArray(savedBlocks) && savedBlocks.length > 0) {
          const restoredBlocks = savedBlocks.map((block: any, index: number) => ({
            id: `restored_${index}_${Date.now()}`,
            type: block.type || 'body',
            text: block.text || '',
            source: 'restored',
            meta: block.aiImageUrl ? { aiImageUrl: block.aiImageUrl } : {}
          }))
          appStore.setContentBlocks(restoredBlocks)
          hasContentBlocks = true
          const rawText = savedBlocks.map((b: any) => b.text || '').join('\n\n')
          appStore.setRawText(rawText)
        }
      } catch {
        appStore.setRawText(article.content)
      }
    }
    const hasImages = Array.isArray(article.images) && article.images.length > 0
    const hasContent = Boolean(article.content) || hasContentBlocks || hasImages
    if (hasContent) {
      router.push('/step3/' + article.id)
    } else {
      router.push('/step1')
    }
  } catch (error: any) {
    toast.error('加载文章失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const getStatusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    'PUBLISHED': 'notion-badge-success'
  }
  return map[status] || ''
}

const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    'DRAFT': '草稿',
    'PARSED': '已编辑',
    'ADJUSTED': '已调整',
    'PUBLISHED': '已发布'
  }
  return map[status] || '已编辑'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await getArticles()
    articles.value = res
  } catch (error: any) {
    toast.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    fetchArticles()
  } else {
    loading.value = false
  }
})

onActivated(() => {
  if (userStore.isLoggedIn) {
    fetchArticles()
  } else {
    loading.value = false
  }
})
</script>

<style scoped>
/* 模式卡片 */
.mode-card {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: border-color 200ms, box-shadow 200ms, transform 200ms;
  box-shadow: var(--shadow-content-card);
}
.mode-card:hover {
  border-color: var(--hover-border, rgba(0,117,222,0.3));
  background: var(--hover-bg, rgba(0,117,222,0.02));
  box-shadow: var(--shadow-content-hover);
  transform: translateY(-2px);
}

/* 文章行 */
.article-row {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  cursor: pointer;
  transition: background 150ms;
  animation: fadeUp 0.3s ease-out both;
}
.article-row:hover {
  background: var(--color-bg-warm);
}

/* 图标按钮 */
.icon-btn {
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  border: none; border-radius: 6px;
  cursor: pointer;
  background: transparent;
  transition: background 150ms, color 150ms;
}

/* 下拉菜单项 */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 14px;
  font-size: 13px;
  color: rgba(0,0,0,0.75);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 120ms;
}
.dropdown-item:hover {
  background: var(--color-bg-warm);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
