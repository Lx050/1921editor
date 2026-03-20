<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()
const { wechatImages } = storeToRefs(appStore)

const imageCount = computed(() => wechatImages.value.length)
</script>

<template>
  <div class="h-full flex flex-col p-4">
    <h3 class="text-sm font-medium text-gray-700 mb-3">图片管理</h3>

    <div v-if="imageCount === 0" class="flex-1 flex items-center justify-center text-gray-400 text-sm">
      <div class="text-center">
        <p>暂无图片</p>
        <p class="text-xs mt-1">上传图片或从微信素材库选择</p>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto">
      <p class="text-xs text-gray-500 mb-2">共 {{ imageCount }} 张图片</p>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="img in wechatImages"
          :key="img.id"
          class="aspect-square rounded border overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
        >
          <img
            :src="img.proxyUrl || img.localPreviewUrl || img.url"
            :alt="img.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>
