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
      <button
        class="px-4 py-1 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
        @click.stop="handlePlayClick"
      >
        {{ isPlaying && music.id === currentMusic?.id ? "暂停" : "播放" }}
      </button>
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
const { currentMusic, isPlaying, togglePlay, changeMusic } = useMusics();

const goToPlayPage = () => {
  router.push(`/play/${props.music.id}`);
};

const handlePlayClick = () => {
  if (props.music.id !== currentMusic.value?.id) {
    changeMusic(props.music);
  }
  togglePlay();
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
