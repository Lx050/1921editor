<template>
  <div
    class="md:w-72 flex-shrink-0 border-r-0 md:border-r border-b md:border-b-0 h-full flex flex-col"
    style="background: var(--color-content-bg-soft); border-color: var(--color-content-border);"
  >
    <!-- 标签切换 -->
    <div class="flex-shrink-0 p-1 flex bg-gray-100 rounded-lg m-2">
      <button
        @click="activeTab = 'images'"
        :class="['flex-1 py-1.5 text-xs font-bold rounded-md transition-all', activeTab === 'images' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-black']"
      >图片库</button>
      <button
        @click="activeTab = 'info'"
        :class="['flex-1 py-1.5 text-xs font-bold rounded-md transition-all', activeTab === 'info' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-black']"
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
            <p class="text-sm text-gray-400">微信图片库为空</p>
            <p class="text-xs text-gray-400 mt-1">请在步骤2插入图片或上传图片</p>
          </div>
        </div>
      </div>

      <!-- 移动端顶部横向滚动图片库（固定高度）-->
      <div class="md:hidden bg-white border-b" v-if="wechatImages.length > 0">
        <div class="p-3">
          <h3 class="font-semibold text-gray-900 text-sm">微信图片库</h3>
          <p class="text-xs text-gray-600 mt-1">
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
      <div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">文章元数据</div>
      <div class="text-[10px] text-gray-500 mb-3 px-2 py-1 bg-gray-100 rounded">
        当前模式：{{ configStore.mode === 'daily' ? '日常模式' : configStore.mode === 'three_rural' ? '三下乡模式' : '转载模式' }}
      </div>
      
      <!-- 编辑人员 -->
      <div class="space-y-1">
        <label class="block text-xs font-semibold text-gray-700">编辑</label>
        <input 
          v-model="appStore.editorInput"
          type="text"
          placeholder="请输入编辑姓名"
          class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <!-- 团队名称 (三下乡 & 日常 & 寒假模式) -->
      <div v-if="['three_rural', 'daily', 'winter_practice'].includes(configStore.mode)" class="space-y-1">
        <label class="block text-xs font-semibold text-gray-700">团队名称</label>
        <input 
          v-model="appStore.teamName"
          type="text"
          placeholder="请输入团队名称"
          class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <!-- 来源公众号 (转载模式) -->
      <div v-if="configStore.mode === 'reprint'" class="space-y-1">
        <label class="block text-xs font-semibold text-gray-700">来源公众号</label>
        <input 
          v-model="appStore.sourceAccount"
          type="text"
          placeholder="请输入来源公众号"
          class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <!-- 文案作者 (日常模式) -->
      <div v-if="configStore.mode === 'daily'" class="space-y-1">
        <label class="block text-xs font-semibold text-gray-700">文案作者</label>
        <div class="flex flex-col gap-2">
          <div v-for="(name, index) in appStore.copywriterNames" :key="'cw_'+index" class="flex items-center gap-2">
            <input 
              :value="name"
              @input="(e) => updateArrayValue(appStore.copywriterNames, index, (e.target as HTMLInputElement).value)"
              type="text"
              class="flex-1 px-3 py-1.5 text-sm border rounded-lg outline-none"
            />
            <button @click="removeFromArray(appStore.copywriterNames, index)" aria-label="删除此项" class="text-gray-400 hover:text-red-500">×</button>
          </div>
          <button @click="appStore.copywriterNames.push('')" class="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center">+ 添加作者</button>
        </div>
      </div>

      <!-- 三下乡/寒假模式 专项信息 -->
      <div v-if="['three_rural', 'winter_practice'].includes(configStore.mode)" class="space-y-3 pt-2 border-t">
        <div class="text-[10px] font-bold text-gray-400 uppercase">专项详情 (用于同步飞书)</div>
        
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-gray-700">队伍专项</label>
          <input v-model="appStore.teamProject" type="text" placeholder="未识别" class="w-full px-3 py-2 text-sm border rounded-lg outline-none" />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-gray-700">负责人</label>
          <input v-model="appStore.teamLeader" type="text" placeholder="未识别" class="w-full px-3 py-2 text-sm border rounded-lg outline-none" />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-gray-700">所属院系</label>
          <input v-model="appStore.teamDepartment" type="text" placeholder="未识别" class="w-full px-3 py-2 text-sm border rounded-lg outline-none" />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-semibold text-gray-700">联系方式</label>
          <input v-model="appStore.teamContact" type="text" placeholder="未识别" class="w-full px-3 py-2 text-sm border rounded-lg outline-none" />
        </div>
      </div>

      <div class="pt-2 border-t mt-4">
        <p class="text-[10px] text-gray-400 leading-relaxed italic">
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