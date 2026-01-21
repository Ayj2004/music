# 云栈听歌房 - 在线音乐播放系统

## 项目介绍

云栈听歌房是一款基于 Vue 3 + TypeScript + Vite 构建的在线音乐播放 Web 应用，支持音乐列表展示、音乐播放/暂停、音量调节、歌词展示、切换歌曲等核心功能，采用响应式设计适配不同设备尺寸，具备优雅的视觉风格和流畅的交互体验。

## 技术栈

- **前端框架**：Vue 3 (Composition API + `<script setup>`)
- **编程语言**：TypeScript
- **构建工具**：Vite
- **路由管理**：Vue Router
- **样式方案**：Tailwind CSS + 自定义 CSS 变量（支持亮色/暗色主题）
- **UI 设计**：响应式布局、卡片式设计、交互动效

## 核心功能

1. 音乐列表加载与展示（支持加载状态、错误处理、空状态）
2. 音乐播放/暂停控制（兼容浏览器自动播放限制）
3. 音量调节（可视化音量图标、滑块控制）
4. 歌曲切换（下一首、音频结束自动切歌）
5. 音乐详情页（封面、歌曲信息、歌词展示）
6. 响应式布局（适配移动端、平板、桌面端）
7. 主题样式（自定义 CSS 变量实现统一视觉风格）

## 项目结构

```
src/
├── components/       # 通用组件（Navbar、Layout、MusicCard、MusicPlayer等）
├── composables/      # 组合式函数（useMusics 封装音乐相关逻辑）
├── router/           # 路由配置（首页、播放页、404路由）
├── types/            # 类型定义（Music、KVResponse等）
├── views/            # 页面视图（HomeView 首页、PlayView 播放页）
├── assets/           # 静态资源（封面、音频文件等）
├── style.css         # 全局样式（重置、主题变量、通用样式）
├── index.css         # Tailwind 入口 + 自定义主题
├── main.ts           # 应用入口
└── vite-env.d.ts     # Vite 类型声明
```

## 快速开始

### 环境要求

- Node.js ≥ 16.x
- npm/yarn/pnpm

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 本地开发

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 构建生产包

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 预览生产包

```bash
npm run preview
# 或
yarn preview
# 或
pnpm preview
```

## 功能亮点

- **逻辑封装**：通过 `useMusics` 组合式函数统一管理音乐加载、播放、切换等核心逻辑，解耦组件与业务逻辑
- **异常处理**：完善的加载状态、错误提示、空状态处理，提升用户体验
- **浏览器兼容**：处理音频自动播放限制，提供友好的错误提示
- **响应式设计**：适配不同屏幕尺寸，移动端/桌面端体验一致
- **样式统一**：基于 CSS 变量实现主题化样式，便于扩展和维护

## 声明

本项目由阿里云 ESA 提供加速、计算和保护
![阿里云ESA](https://github.com/Ayj2004/music/blob/main/src/assets/aliyun.png)

## 注意事项

1. 音频播放受浏览器自动播放策略限制，首次播放需用户手动触发
2. 静态资源（封面、音频）需放置在指定路径，或修改 `useMusics.ts` 中的默认资源路径
3. 接口请求依赖阿里云 ESA 边缘函数服务，需确保接口地址可正常访问
