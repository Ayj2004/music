<template>
  <div
    class="music-card"
    :class="{ active: music.id === currentMusic?.id }"
    @click="goToPlayPage" // 点击卡片跳转播放页
  >
    <img
      :src="music.cover"
      :alt="music.name"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="text-xl font-bold mb-2 line-clamp-1">{{ music.name }}</h3>
      <p class="text-gray-600 mb-4">歌手：{{ music.singer }}</p>
      <button
        class="px-4 py-1 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
        @click.stop="handlePlayClick" // 阻止事件冒泡，仅控制播放
      >
        {{ isPlaying && music.id === currentMusic?.id ? "暂停" : "播放" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Music } from "@/types";
import { useMusics } from "@/composables/useMusics";
import { useRouter } from "vue-router"; // 导入路由

const props = defineProps<{
  music: Music;
}>();

const router = useRouter(); // 初始化路由
const { currentMusic, isPlaying, togglePlay, changeMusic } = useMusics();

// 跳转到播放页面
const goToPlayPage = () => {
  router.push(`/play/${props.music.id}`);
};

// 点击播放按钮的逻辑
const handlePlayClick = () => {
  if (props.music.id !== currentMusic.value?.id) {
    changeMusic(props.music); // 切换到当前歌曲
  }
  togglePlay(); // 播放/暂停
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>