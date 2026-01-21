<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main class="flex-grow py-8 pb-24">
      <!-- 给播放器留底部空间 -->
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from "./Navbar.vue";
</script>
