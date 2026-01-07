<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-[#141419] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-white/10">
      <!-- 弹窗头部 -->
      <div class="relative px-6 py-5 border-b border-white/10">
        <!-- 装饰性渐变 -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6b4a] via-[#d4a574] to-[#ff6b4a]"></div>

        <h3 class="magazine-title-md text-[#f5f5f5]">创建公众号草稿</h3>
        <p class="text-sm text-[#a0a0b0] mt-1">填写文章信息，上传到草稿箱</p>
      </div>

      <!-- 弹窗内容 -->
      <div class="p-6 space-y-4">
        <!-- 标题 -->
        <div>
          <label class="block text-sm font-medium text-[#a0a0b0] mb-2">文章标题 *</label>
          <input
            v-model="form.title"
            type="text"
            class="magazine-input"
            placeholder="请输入文章标题"
          />
        </div>

        <!-- 封面图 -->
        <div>
          <label class="block text-sm font-medium text-[#a0a0b0] mb-2">封面图 *</label>
          <div class="flex items-center space-x-2">
            <select
              v-model="form.coverImageId"
              class="magazine-input flex-1"
            >
              <option value="">请选择封面图</option>
              <option
                v-for="img in availableImages"
                :key="img.id"
                :value="img.mediaId"
              >
                {{ img.name }}
              </option>
            </select>

            <!-- 封面上传按钮 -->
            <div class="relative">
              <input
                type="file"
                accept="image/*"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                @change="handleCoverUpload"
                :disabled="isUploadingCover"
              />
              <button
                type="button"
                class="px-3 py-2 bg-[#252530] hover:bg-[#2dd4a6]/20 text-[#a0a0b0] hover:text-[#2dd4a6] text-sm rounded-lg transition-colors whitespace-nowrap flex items-center border border-white/10"
                :class="{'opacity-50': isUploadingCover}"
              >
                <svg v-if="!isUploadingCover" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                <div v-else class="w-4 h-4 mr-1 border-2 border-[#2dd4a6] border-t-transparent rounded-full animate-spin"></div>
                {{ isUploadingCover ? '上传中...' : '上传封面' }}
              </button>
            </div>
          </div>
          <p v-if="availableImages.length === 0" class="text-xs text-[#d4a574] mt-2">
            * 纯文字排版也需要一张封面图，请上传
          </p>
        </div>

        <!-- 作者 -->
        <div>
          <label class="block text-sm font-medium text-[#a0a0b0] mb-2">作者（选填）</label>
          <input
            v-model="form.author"
            type="text"
            class="magazine-input"
            placeholder="如：小编"
          />
        </div>

        <!-- 摘要 -->
        <div>
          <label class="block text-sm font-medium text-[#a0a0b0] mb-2">摘要（选填）</label>
          <textarea
            v-model="form.digest"
            rows="2"
            class="magazine-textarea"
            placeholder="文章摘要，不填则默认截取正文前54字"
          ></textarea>
        </div>

        <!-- 显示封面 -->
        <div class="flex items-center">
          <input
            v-model="form.showCover"
            type="checkbox"
            id="showCover"
            class="w-4 h-4 bg-[#252530] border-white/20 rounded focus:ring-[#ff6b4a] focus:ring-offset-0"
          />
          <label for="showCover" class="ml-2 text-sm text-[#a0a0b0]">在文章内显示封面图</label>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171] px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <!-- 成功提示 -->
        <div v-if="success" class="bg-[#2dd4a6]/10 border border-[#2dd4a6]/30 text-[#2dd4a6] px-4 py-3 rounded-lg text-sm">
          <div class="flex items-start space-x-2">
            <div class="text-lg">✓</div>
            <div class="flex-1">
              <div class="font-semibold mb-1">草稿创建成功！</div>
              <div class="text-xs text-[#2dd4a6]/80">文章已保存到公众号草稿箱</div>
            </div>
          </div>
        </div>

        <!-- AI 图片上传进度提示 -->
        <div v-if="aiProgress" class="bg-[#60a5fa]/10 border border-[#60a5fa]/30 text-[#60a5fa] px-4 py-3 rounded-lg text-sm">
          <div class="flex items-center space-x-2">
            <div v-if="!aiProgress.includes('✓')" class="w-4 h-4 border-2 border-[#60a5fa] border-t-transparent rounded-full animate-spin"></div>
            <div v-else class="text-lg">✓</div>
            <div class="flex-1">{{ aiProgress }}</div>
          </div>
        </div>
      </div>

      <!-- 弹窗底部 -->
      <div class="bg-[#0a0a0c] px-6 py-4 flex justify-end space-x-3 border-t border-white/10">
        <button
          @click="$emit('close')"
          class="magazine-btn magazine-btn-secondary"
        >
          取消
        </button>
        <button
          @click="$emit('submit')"
          :disabled="isSubmitting || !form.title || !form.coverImageId"
          class="magazine-btn bg-gradient-to-r from-[#ff6b4a] to-[#ff8566] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">创建中...</span>
          <span v-else>创建草稿</span>
          <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
    target.value = '' // 清空input
  }
}
</script>
