import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PlayView from "@/views/PlayView.vue"; // 导入播放页面

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/play/:id", // 播放页面，带音乐ID参数
      name: "play",
      component: PlayView,
    },
    // 404路由
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
