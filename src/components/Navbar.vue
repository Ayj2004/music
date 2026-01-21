<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-primary">
            云栈听歌房
          </router-link>
        </div>
        <div class="flex items-center space-x-6">
          <router-link
            to="/"
            class="text-gray-700 hover:text-primary transition-colors"
            :class="{ 'text-primary font-medium': $route.name === 'home' }"
          >
            首页
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>
