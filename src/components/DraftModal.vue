<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-150"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 p-4"
    style="background:rgba(0,0,0,0.4);"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    @keydown.escape="$emit('cancel')"
  >
    <div style="background:var(--color-bg-card); border:1px solid rgba(0,0,0,0.1); border-radius:var(--radius-md); width:100%; max-width:440px; padding:24px; box-shadow:var(--shadow-content-card);">

      <h3 style="font-size:16px; font-weight:700; color:rgba(0,0,0,0.95); margin:0 0 6px; letter-spacing:-0.2px;">{{ title }}</h3>
      <p style="font-size:13px; color:var(--color-text-secondary); margin:0 0 16px; line-height:1.5;">{{ message }}</p>

      <!-- 草稿链接 -->
      <div v-if="draftUrl" style="margin-bottom:16px;">
        <label style="display:block; font-size:11px; font-weight:600; color:rgba(0,0,0,0.5); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">草稿链接</label>
        <div style="display:flex; align-items:center; gap:8px;">
          <input
            type="text"
            :value="draftUrl"
            readonly
            class="notion-input"
            style="font-size:13px; padding:8px 12px; flex:1;"
          />
          <button
            @click="copyDraftUrl"
            class="magazine-btn-secondary"
            style="padding:8px 14px; font-size:13px; font-weight:600; border-radius:var(--radius-xs); border:1px solid rgba(0,0,0,0.12); background:rgba(0,0,0,0.04); color:rgba(0,0,0,0.7); cursor:pointer; white-space:nowrap; flex-shrink:0;"
          >
            复制
          </button>
        </div>
      </div>

      <!-- 二维码 -->
      <div v-if="qrCodeUrl" style="margin-bottom:16px;">
        <label style="display:block; font-size:11px; font-weight:600; color:rgba(0,0,0,0.5); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">扫码查看草稿</label>
        <div style="display:flex; justify-content:center; background:var(--color-bg-warm); padding:16px; border-radius:8px; border:1px solid rgba(0,0,0,0.08);">
          <img :src="qrCodeUrl" alt="草稿二维码" style="width:128px; height:128px;" />
        </div>
      </div>

      <!-- 错误信息 -->
      <div v-if="error" style="margin-bottom:16px; padding:10px 12px; background:var(--color-error-light); border:1px solid var(--color-error-border); border-radius:6px; font-size:13px; color:var(--color-error);">
        {{ error }}
      </div>

      <!-- 按钮 -->
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button
          v-if="showCancel"
          @click="$emit('cancel')"
          style="padding:8px 16px; background:transparent; border:none; border-radius:var(--radius-xs); font-size:13px; font-weight:600; color:rgba(0,0,0,0.5); cursor:pointer; transition:color 150ms;"
          onmouseover="this.style.color='rgba(0,0,0,0.85)'"
          onmouseout="this.style.color='rgba(0,0,0,0.5)'"
        >
          取消
        </button>
        <button
          @click="$emit('confirm')"
          style="padding:8px 20px; background:var(--color-accent-primary); color:var(--color-text-inverse); border:none; border-radius:var(--radius-xs); font-size:13px; font-weight:600; cursor:pointer; transition:background 150ms;"
          onmouseover="this.style.background='var(--color-accent-hover)'"
          onmouseout="this.style.background='var(--color-accent-primary)'"
        >
          确定
        </button>
      </div>
    </div>
  </div>
  </Transition>
</template>

<script setup lang="ts">
import { copyToClipboard } from '../utils/clipboard'
import { showAlert } from '@/composables/useConfirm'
const props = defineProps<{
  show: boolean
  title: string
  message: string
  draftUrl?: string
  qrCodeUrl?: string
  error?: string
  showCancel?: boolean
}>()

defineEmits<{
  cancel: []
  confirm: []
}>()

const copyDraftUrl = async () => {
  if (props.draftUrl) {
    const result = await copyToClipboard(props.draftUrl)
    if (!result.ok) {
      console.error('复制失败:', result.error)
      await showAlert(props.draftUrl, '草稿链接')
    }
  }
}
</script>
