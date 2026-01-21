import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 配置路径别名
    },
  },
  server: {
    port: 3000, // 启动端口
    open: true, // 自动打开浏览器
  },
  build: {
    outDir: "dist", // 打包输出目录
    assetsDir: "assets",
  },
});
