<template>
  <div class="music-player" v-if="currentMusic">
    <div class="max-w-7xl mx-auto flex items-center gap-6">
      <!-- 封面 -->
      <img
        :src="currentMusic.cover"
        :alt="currentMusic.name"
        class="w-16 h-16 rounded object-cover"
      />
      <!-- 歌曲信息 -->
      <div class="flex-1">
        <h3 class="font-bold">{{ currentMusic.name }}</h3>
        <p class="text-sm text-gray-500">{{ currentMusic.singer }}</p>
        <p class="text-sm mt-1 line-clamp-1">{{ currentMusic.lyric }}</p>
      </div>
      <!-- 播放控制 -->
      <div class="flex items-center gap-4">
        <button @click="togglePlay" class="text-xl">
          {{ isPlaying ? "⏸️" : "▶️" }}
        </button>
        <button @click="playNext" class="text-xl">⏭️</button>
      </div>
      <!-- 音频元素：移除:src，改为通过逻辑动态设置，ref绑定到全局audioRef -->
      <audio
        ref="localAudioRef"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="handleAudioEnded"
        class="hidden"
      ></audio>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"; // 新增ref/watch/onMounted
import { useMusics } from "@/composables/useMusics";

const {
  currentMusic,
  isPlaying,
  audioRef: globalAudioRef, // 接收全局audioRef
  togglePlay,
  handleAudioEnded,
  musics,
  changeMusic,
} = useMusics();

// 本地ref绑定DOM
const localAudioRef = ref<HTMLAudioElement | null>(null);

// 关键：将本地DOM ref同步到全局audioRef
watch(
  localAudioRef,
  (newVal) => {
    globalAudioRef.value = newVal;
  },
  { immediate: true }
);

// 确保DOM挂载后同步
onMounted(() => {
  if (localAudioRef.value) {
    globalAudioRef.value = localAudioRef.value;
  }
});

// 下一首
const playNext = () => {
  if (!currentMusic.value || musics.value.length === 0) return;
  const currentIndex = musics.value.findIndex(
    (m) => m.id === currentMusic.value!.id
  );
  const nextIndex = (currentIndex + 1) % musics.value.length;
  changeMusic(musics.value[nextIndex]);
};
</script>
