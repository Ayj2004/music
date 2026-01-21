<template>
  <div
    class="music-card"
    :class="{ active: music.id === currentMusic?.id }"
    @click="goToPlayPage"
  >
    <img
      :src="music.cover"
      :alt="music.name"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="text-xl font-bold mb-2 line-clamp-1">{{ music.name }}</h3>
      <p class="text-gray-600 mb-4">歌手：{{ music.singer }}</p>
      <!-- 移除播放按钮 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Music } from "@/types";
import { useMusics } from "@/composables/useMusics";
import { useRouter } from "vue-router";

const props = defineProps<{
  music: Music;
}>();

const router = useRouter();
const { currentMusic } = useMusics(); // 仅保留currentMusic用于高亮，移除播放相关方法

// 跳转到播放页面
const goToPlayPage = () => {
  router.push(`/play/${props.music.id}`);
};
// 移除handlePlayClick方法
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
