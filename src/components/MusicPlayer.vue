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
      <!-- 播放控制 + 音量调节 -->
      <div class="flex items-center gap-4">
        <button @click="togglePlay" class="text-xl">
          {{ isPlaying ? "⏸️" : "▶️" }}
        </button>
        <button @click="playNext" class="text-xl">⏭️</button>
        <!-- 新增音量调节 -->
        <div class="flex items-center gap-1">
          <span class="text-lg">{{ volumeIcon }}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            v-model="volume"
            class="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            @input="adjustVolume"
          />
        </div>
      </div>
      <!-- 音频元素 -->
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
import { ref, watch, onMounted, computed } from "vue";
import { useMusics } from "@/composables/useMusics";

const {
  currentMusic,
  isPlaying,
  audioRef: globalAudioRef,
  togglePlay,
  handleAudioEnded,
  musics,
  changeMusic,
} = useMusics();

// 本地ref绑定DOM
const localAudioRef = ref<HTMLAudioElement | null>(null);

// 新增音量控制
const volume = ref(0.7);
const volumeIcon = computed(() => {
  if (volume.value === 0) return "🔇";
  if (volume.value < 0.5) return "🔈";
  return "🔊";
});

const adjustVolume = () => {
  if (globalAudioRef.value) {
    globalAudioRef.value.volume = volume.value;
  }
};

// 同步本地ref到全局
watch(
  localAudioRef,
  (newVal) => {
    globalAudioRef.value = newVal;
    // 同步音量
    if (newVal) newVal.volume = volume.value;
  },
  { immediate: true }
);

// 确保DOM挂载后同步
onMounted(() => {
  if (localAudioRef.value) {
    globalAudioRef.value = localAudioRef.value;
    localAudioRef.value.volume = volume.value;
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
