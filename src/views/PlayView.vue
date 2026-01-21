<template>
  <Layout title="播放音乐 | 云栈听歌房">
    <div class="max-w-4xl mx-auto py-8 px-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-20">
        <span class="inline-block animate-spin mr-2 text-2xl">🔄</span>
        加载音乐详情中...
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-center py-20 text-red-500 text-xl">
        {{ error }}
      </div>

      <!-- 音乐播放详情 -->
      <div
        v-if="currentMusic && !loading && !error"
        class="flex flex-col md:flex-row gap-8 items-center"
      >
        <!-- 封面 -->
        <div
          class="w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden shadow-lg"
        >
          <img
            :src="currentMusic.cover"
            :alt="currentMusic.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- 信息与播放控制 -->
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-3xl font-bold mb-2 text-primary">
            {{ currentMusic.name }}
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            歌手：{{ currentMusic.singer }}
          </p>

          <!-- 播放/暂停按钮 + 音量调节 -->
          <div class="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <button
              class="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-lg"
              @click="togglePlay"
            >
              {{ isPlaying ? "⏸️ 暂停" : "▶️ 播放" }}
            </button>

            <!-- 新增音量调节区域 -->
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <span class="text-xl">{{ volumeIcon }}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                v-model="volume"
                class="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                @input="adjustVolume"
              />
            </div>
          </div>

          <!-- 歌词展示 -->
          <div
            class="mt-8 p-4 bg-card-bg border border-border-color rounded-lg h-60 overflow-y-auto"
          >
            <div class="lyric text-center space-y-2">
              {{ currentMusic.lyric || "暂无歌词" }}
            </div>
          </div>
        </div>
      </div>

      <!-- 音频元素（隐藏） -->
      <audio ref="audioRef" @ended="handleAudioEnded" class="hidden"></audio>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "@/components/Layout.vue";
import { useMusics } from "@/composables/useMusics";

const route = useRoute();
const router = useRouter();
const musicId = route.params.id as string;

// 解构音乐相关方法和状态
const {
  currentMusic,
  isPlaying,
  loading,
  error,
  audioRef,
  fetchMusicById,
  togglePlay,
  handleAudioEnded,
  changeMusic,
} = useMusics();

// 新增音量控制相关
const volume = ref(0.7); // 默认音量70%

// 音量图标计算属性
const volumeIcon = computed(() => {
  if (volume.value === 0) return "🔇";
  if (volume.value < 0.5) return "🔈";
  return "🔊";
});

// 调整音量方法
const adjustVolume = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value;
  }
};

// 监听音频元素挂载，同步音量
watch(
  audioRef,
  (newAudio) => {
    if (newAudio) {
      newAudio.volume = volume.value;
    }
  },
  { immediate: true }
);

// 加载当前音乐详情
const loadCurrentMusic = async () => {
  if (!musicId) {
    router.push("/"); // 无ID则返回首页
    return;
  }
  const res = await fetchMusicById(musicId);
  if (res.success && res.data) {
    changeMusic(res.data); // 设置为当前播放音乐
  } else {
    router.push("/"); // 加载失败返回首页
  }
};

// 页面挂载时加载音乐
onMounted(() => {
  loadCurrentMusic();
});

// 页面卸载时暂停播放
onBeforeUnmount(() => {
  if (audioRef.value && isPlaying.value) {
    audioRef.value.pause();
  }
});
</script>

<style scoped>
.lyric {
  white-space: pre-line; /* 保留歌词换行 */
  line-height: 1.8;
}

/* 自定义音量滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: none;
}
</style>
