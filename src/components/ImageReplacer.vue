<template>
  <div
    class="md:w-72 flex-shrink-0 border-r-0 md:border-r border-b md:border-b-0 h-full flex flex-col"
    style="background: var(--color-content-bg-soft); border-color: var(--color-content-border);"
  >
    <!-- 标签切换 -->
    <div class="flex-shrink-0 p-1 flex rounded-lg m-2" style="background:var(--color-bg-warm);">
      <button
        @click="activeTab = 'images'"
        :class="['flex-1 py-1.5 text-xs font-bold rounded-md transition-all', activeTab === 'images' ? 'bg-white shadow-sm' : 'hover:text-black']"
        :style="activeTab === 'images' ? 'color: var(--color-accent-primary);' : 'color:rgba(0,0,0,0.45);'"
      >图片库</button>
      <button
        @click="activeTab = 'info'"
        :class="['flex-1 py-1.5 text-xs font-bold rounded-md transition-all', activeTab === 'info' ? 'bg-white shadow-sm' : 'hover:text-black']"
        :style="activeTab === 'info' ? 'color: var(--color-accent-primary);' : 'color:rgba(0,0,0,0.45);'"
      >文章信息</button>
    </div>

    <!-- 图片库内容 -->
    <div v-show="activeTab === 'images'" class="flex-1 flex flex-col overflow-hidden">
      <!-- 桌面端左侧图片库（纵向滚动）-->
      <div class="hidden md:flex md:flex-col h-full overflow-hidden">
        <div class="flex-shrink-0 p-4 border-b" style="background: var(--color-content-card); border-color: var(--color-content-border);">
          <h3 class="font-semibold" style="color: var(--color-content-text);">微信图片库</h3>
          <p class="text-sm mt-1" style="color: var(--color-content-text-secondary);">
            点击预览中的占位符图片，再从左侧选择图片替换
          </p>
        </div>
        <div class="flex-1 overflow-y-auto p-2">
          <WechatImageGallery
            v-if="wechatImages.length > 0"
            :images="wechatImages"
            :selectedPlaceholder="selectedPlaceholder"
            @select="handleImageSelect"
          />
          <div v-else class="h-full flex flex-col items-center justify-center p-6 text-center">
            <div class="text-3xl mb-3 opacity-30">🖼️</div>
            <p class="text-sm" style="color:var(--color-text-muted);">微信图片库为空</p>
            <p class="text-xs mt-1" style="color:var(--color-text-muted);">请在步骤2插入图片或上传图片</p>
          </div>
        </div>
      </div>

      <!-- 移动端顶部横向滚动图片库（固定高度）-->
      <div class="md:hidden bg-white border-b" v-if="wechatImages.length > 0">
        <div class="p-3">
          <h3 class="font-semibold text-sm" style="color:rgba(0,0,0,0.85);">微信图片库</h3>
          <p class="text-xs mt-1" style="color:rgba(0,0,0,0.55);">
            点击下方预览中的占位符，然后在此处选择图片
          </p>
        </div>
        <div class="px-3 pb-3 overflow-x-auto">
          <WechatImageGallery
            :images="wechatImages"
            :selectedPlaceholder="selectedPlaceholder"
            @select="handleImageSelect"
            :mobileLayout="true"
          />
        </div>
      </div>
    </div>

    <!-- 文章信息内容 -->
    <div v-show="activeTab === 'info'" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div class="text-xs font-bold uppercase tracking-wider mb-2" style="color:var(--color-text-muted);">文章元数据</div>
      <div class="text-[10px] mb-3 px-2 py-1 rounded" style="color:rgba(0,0,0,0.45); background:var(--color-bg-warm);">
        当前模式：{{ configStore.mode === 'daily' ? '日常模式' : configStore.mode === 'three_rural' ? '三下乡模式' : '转载模式' }}
      </div>

      <!-- 编辑人员 -->
      <div class="space-y-1">
        <label class="block text-xs font-semibold" style="color:rgba(0,0,0,0.65);">编辑</label>
        <input
          v-model="appStore.editorInput"
          type="text"
          placeholder="请输入编辑姓名"
          class="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-1 transition-all"
          style="--tw-ring-color: var(--color-accent-primary);"
        />
      </div>

      <!-- 项目名称 (三下乡模式) -->
      <div v-if="configStore.mode === 'three_rural'" class="space-y-1">
        <label class="block text-xs font-semibold" style="color:rgba(0,0,0,0.65);">项目名称</label>
        <input
          v-model="appStore.teamName"
          type="text"
          placeholder="请输入项目名称"
          class="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-1 transition-all"
          style="--tw-ring-color: var(--color-accent-primary);"
        />
      </div>

      <!-- 来源公众号 (转载模式) -->
      <div v-if="configStore.mode === 'reprint'" class="space-y-1">
        <label class="block text-xs font-semibold" style="color:rgba(0,0,0,0.65);">来源公众号</label>
        <input
          v-model="appStore.sourceAccount"
          type="text"
          placeholder="请输入来源公众号"
          class="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-1 transition-all"
          style="--tw-ring-color: var(--color-accent-primary);"
        />
      </div>

      <!-- 文案作者 (日常模式) -->
      <div v-if="configStore.mode === 'daily'" class="space-y-1">
        <label class="block text-xs font-semibold" style="color:rgba(0,0,0,0.65);">文案作者</label>
        <div class="flex flex-col gap-2">
          <div v-if="appStore.copywriterNames.length === 0" class="text-center py-4" style="color:var(--color-text-muted);">
            <p class="text-sm">暂无作者</p>
          </div>
          <div v-for="(name, index) in appStore.copywriterNames" :key="'cw_'+index" class="flex items-center gap-2">
            <input
              :value="name"
              @input="(e) => updateArrayValue(appStore.copywriterNames, index, (e.target as HTMLInputElement).value)"
              type="text"
              class="flex-1 px-3 py-1.5 text-sm border rounded-lg outline-none focus:ring-1"
              style="--tw-ring-color: var(--color-accent-primary);"
            />
            <button @click="removeFromArray(appStore.copywriterNames, index)" class="hover:text-red-500" style="color:var(--color-text-muted);" title="移除" aria-label="移除此作者">×</button>
          </div>
          <button @click="appStore.copywriterNames.push('')" class="text-xs font-medium flex items-center" style="color: var(--color-accent-primary);">+ 添加作者</button>
        </div>
      </div>

      <div class="pt-2 border-t mt-4">
        <p class="text-[10px] leading-relaxed italic" style="color:var(--color-text-muted);">
          提示：修改后预览区域将实时更新。审核（王雪 宋欣翼）和责编（朱梦鹤）为固定人员，无需修改。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WechatImageGallery from './WechatImageGallery.vue'
import type { WechatImage } from '../types/wechat'
import { useAppStore } from '../stores/appStore'
import { useConfigStore } from '../stores/configStore'

const props = defineProps<{
  wechatImages: WechatImage[]
  selectedPlaceholder: string | null
}>()

const emit = defineEmits<{
  select: [image: WechatImage, placeholder: string]
}>()

const appStore = useAppStore()
const configStore = useConfigStore()
const activeTab = ref<'images' | 'info'>('images')

const handleImageSelect = (image: WechatImage) => {
  if (props.selectedPlaceholder) {
    emit('select', image, props.selectedPlaceholder)
  }
}

// 通用数组操作助手
const updateArrayValue = (arr: string[], index: number, val: string) => {
  arr[index] = val
}

const removeFromArray = (arr: string[], index: number) => {
  arr.splice(index, 1)
}
</script>
