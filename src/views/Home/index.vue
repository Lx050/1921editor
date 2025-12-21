<template>
  <Dashboard v-if="userStore.isLoggedIn" />
  <LandingPage v-else />
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/userStore'
import Dashboard from './Dashboard.vue'
import LandingPage from './LandingPage.vue'

const userStore = useUserStore()
</script>
