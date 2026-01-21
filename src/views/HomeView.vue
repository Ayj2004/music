<template>
  <Layout title="云栈听歌房 | 在线音乐系统">
    <div class="max-w-7xl mx-auto py-8 px-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-10">
        <span class="inline-block animate-spin mr-2">🔄</span>
        加载音乐列表中...
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-center py-10 text-red-500">
        {{ error }}
      </div>

      <!-- 音乐列表 -->
      <div
        v-if="!loading && !error && musics.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <MusicCard v-for="music in musics" :key="music.id" :music="music" />
      </div>

      <!-- 空状态 -->
      <div
        v-if="!loading && !error && !musics.length"
        class="text-center py-10"
      >
        <p class="text-gray-500 mb-4">暂无音乐资源</p>
      </div>

      <!-- 播放器（固定底部） -->
      <MusicPlayer />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Layout from "@/components/Layout.vue";
import MusicCard from "@/components/MusicCard.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
import { useMusics } from "@/composables/useMusics";

const { musics, loading, error, fetchMusics } = useMusics();

// 挂载时加载音乐列表
onMounted(() => {
  fetchMusics();
});
</script>
