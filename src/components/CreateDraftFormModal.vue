<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 p-4"
    style="background:rgba(0,0,0,0.4);"
    @click.self="$emit('close')"
  >
    <div style="
      background:var(--color-bg-card);
      border:1px solid rgba(0,0,0,0.1);
      border-radius:var(--radius-md);
      box-shadow:var(--shadow-content-card);
      width:100%; max-width:480px;
      overflow:hidden;
    ">
      <!-- 弹窗头部 -->
      <div style="padding:20px 24px 16px; border-bottom:1px solid rgba(0,0,0,0.08);">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div>
            <h3 style="font-size:16px; font-weight:700; color:rgba(0,0,0,0.95); letter-spacing:-0.3px; margin:0 0 2px;">创建公众号草稿</h3>
            <p style="font-size:12px; color:var(--color-text-secondary); margin:0;">填写文章信息，上传到微信草稿箱</p>
          </div>
          <button
            @click="$emit('close')"
            style="width:28px; height:28px; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.05); border:none; border-radius:6px; cursor:pointer; color:rgba(0,0,0,0.5); transition:all 150ms;"
            onmouseover="this.style.background='rgba(0,0,0,0.09)'"
            onmouseout="this.style.background='rgba(0,0,0,0.05)'"
            title="关闭"
            aria-label="关闭创建草稿"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 弹窗内容 -->
      <div style="padding:20px 24px; display:flex; flex-direction:column; gap:16px; max-height:60vh; overflow-y:auto;">

        <!-- 标题 -->
        <div>
          <label style="display:block; font-size:11px; font-weight:600; color:rgba(0,0,0,0.55); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">文章标题 *</label>
          <input
            v-model="form.title"
            type="text"
            class="notion-input"
            placeholder="请输入文章标题"
            style="font-size:14px; padding:9px 12px;"
          />
        </div>

        <!-- 封面图 -->
        <div>
          <label style="display:block; font-size:11px; font-weight:600; color:rgba(0,0,0,0.55); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">封面图 *</label>
          <div style="display:flex; gap:8px; align-items:stretch;">
            <select
              v-model="form.coverImageId"
              class="notion-input"
              style="flex:1; font-size:13px; padding:8px 12px; cursor:pointer;"
            >
              <option value="">请选择封面图</option>
              <option
                v-for="img in availableImages"
                :key="img.id"
                :value="img.mediaId"
              >{{ img.name }}</option>
            </select>

            <div style="position:relative; flex-shrink:0;">
              <input
                type="file"
                accept="image/*"
                style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer;"
                @change="handleCoverUpload"
                :disabled="isUploadingCover"
              />
              <button
                type="button"
                style="
                  padding:8px 14px;
                  background:rgba(0,0,0,0.04);
                  border:1px solid rgba(0,0,0,0.12);
                  border-radius:6px;
                  font-size:12px;
                  font-weight:600;
                  color:rgba(0,0,0,0.65);
                  cursor:pointer;
                  display:flex;
                  align-items:center;
                  gap:4px;
                  white-space:nowrap;
                  height:100%;
                "
                :style="{ opacity: isUploadingCover ? 0.5 : 1 }"
              >
                <svg v-if="!isUploadingCover" width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                <div v-else style="width:12px; height:12px; border:2px solid rgba(0,0,0,0.3); border-top-color:var(--color-accent-primary); border-radius:50%; animation:spin 0.8s linear infinite;"></div>
                {{ isUploadingCover ? '上传中...' : '上传封面' }}
              </button>
            </div>
          </div>
          <p v-if="availableImages.length === 0" style="font-size:11px; color:var(--color-text-muted); margin:4px 0 0;">纯文字排版也需要一张封面图，请上传</p>
        </div>

        <!-- 作者 -->
        <div>
          <label style="display:block; font-size:11px; font-weight:600; color:rgba(0,0,0,0.55); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">作者（选填）</label>
          <input
            v-model="form.author"
            type="text"
            class="notion-input"
            placeholder="如：小编"
            style="font-size:13px; padding:8px 12px;"
          />
        </div>

        <!-- 摘要 -->
        <div>
          <label style="display:block; font-size:11px; font-weight:600; color:rgba(0,0,0,0.55); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px;">摘要（选填）</label>
          <textarea
            v-model="form.digest"
            rows="2"
            class="notion-input"
            placeholder="文章摘要，不填则默认截取正文前54字"
            style="font-size:13px; padding:8px 12px; resize:none; line-height:1.5;"
          ></textarea>
        </div>

        <!-- 显示封面 -->
        <div style="display:flex; align-items:center; gap:8px;">
          <input
            v-model="form.showCover"
            type="checkbox"
            id="showCover"
            style="width:14px; height:14px; accent-color:var(--color-accent-primary); cursor:pointer;"
          />
          <label for="showCover" style="font-size:13px; color:rgba(0,0,0,0.7); cursor:pointer;">在文章内显示封面图</label>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" style="padding:10px 12px; background:var(--color-error-light); border:1px solid var(--color-error-border); border-radius:6px; font-size:13px; color:var(--color-error);">
          {{ error }}
        </div>

        <!-- 成功提示 -->
        <div v-if="success" style="padding:10px 12px; background:var(--color-success-light); border:1px solid var(--color-success-border); border-radius:6px; font-size:13px; color:var(--color-success); display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:16px; line-height:1;">✓</span>
          <div>
            <div style="font-weight:600; margin-bottom:2px;">草稿创建成功！</div>
            <div style="font-size:11px; color:#15803d;">文章已保存到公众号草稿箱</div>
          </div>
        </div>

        <!-- AI 图片上传进度 -->
        <div v-if="aiProgress" style="padding:10px 12px; background:var(--color-badge-bg); border:1px solid rgba(0,117,222,0.15); border-radius:6px; font-size:13px; color:var(--color-badge-text); display:flex; align-items:center; gap:8px;">
          <div v-if="!aiProgress.includes('✓')" style="width:14px; height:14px; border:2px solid var(--color-badge-text); border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; flex-shrink:0;"></div>
          <span v-else style="font-size:16px; line-height:1; flex-shrink:0;">✓</span>
          <span>{{ aiProgress }}</span>
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div style="padding:16px 24px; border-top:1px solid rgba(0,0,0,0.08); display:flex; justify-content:flex-end; gap:8px; background:var(--color-bg-warm);">
        <button
          @click="$emit('close')"
          style="
            padding:8px 16px;
            background:transparent;
            border:none;
            border-radius:var(--radius-xs);
            font-size:13px;
            font-weight:600;
            color:rgba(0,0,0,0.5);
            cursor:pointer;
            transition:color 150ms;
          "
          onmouseover="this.style.color='rgba(0,0,0,0.85)'"
          onmouseout="this.style.color='rgba(0,0,0,0.5)'"
        >取消</button>
        <button
          @click="$emit('submit')"
          :disabled="isSubmitting || !form.title || !form.coverImageId"
          style="
            padding:8px 20px;
            background:var(--color-accent-primary);
            color:var(--color-text-inverse);
            border:none;
            border-radius:var(--radius-xs);
            font-size:13px;
            font-weight:600;
            cursor:pointer;
            display:flex;
            align-items:center;
            gap:6px;
            transition:background 150ms, opacity 150ms;
          "
          :style="{ opacity: (isSubmitting || !form.title || !form.coverImageId) ? 0.5 : 1, cursor: (isSubmitting || !form.title || !form.coverImageId) ? 'not-allowed' : 'pointer' }"
          onmouseover="if(!this.disabled) this.style.background='var(--color-accent-hover)'"
          onmouseout="this.style.background='var(--color-accent-primary)'"
        >
          <div v-if="isSubmitting" style="width:12px; height:12px; border:2px solid rgba(255,255,255,0.4); border-top-color:var(--color-text-inverse); border-radius:50%; animation:spin 0.8s linear infinite;"></div>
          <span>{{ isSubmitting ? '创建中...' : '创建草稿' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface WechatImage {
  id: string
  mediaId: string
  url?: string
  name: string
  status: string
}

interface DraftForm {
  title: string
  coverImageId: string
  author: string
  digest: string
  showCover: boolean
}

const props = defineProps<{
  show: boolean
  initialTitle?: string
  availableImages: WechatImage[]
  error?: string
  success?: string
  aiProgress?: string
  isSubmitting?: boolean
  isUploadingCover?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: []
  'upload-cover': [file: File]
  'update:form': [form: DraftForm]
}>()

const form = ref<DraftForm>({
  title: '',
  coverImageId: '',
  author: '',
  digest: '',
  showCover: true
})

// 初始化标题
watch(() => props.show, (newVal) => {
  if (newVal && props.initialTitle) {
    form.value.title = props.initialTitle
  }
}, { immediate: true })

// 表单变化时通知父组件
watch(form, (newForm) => {
  emit('update:form', { ...newForm })
}, { deep: true })

const handleCoverUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('upload-cover', file)
    target.value = ''
  }
}
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
