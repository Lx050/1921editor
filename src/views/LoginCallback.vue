<template>
  <div class="flex items-center justify-center min-h-screen" style="background:var(--color-bg-page);">
    <div class="text-center">
      <h2 class="text-xl font-semibold mb-2">Login disabled</h2>
      <p style="color:rgba(0,0,0,0.45);">Redirecting...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/')
})
</script>

