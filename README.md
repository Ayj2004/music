src/
├── components/ # 组件
│ ├── Layout.vue # 布局组件（修改主题色）
│ ├── MusicCard.vue # 音乐卡片组件（新增）
│ ├── MusicPlayer.vue # 音乐播放器组件（新增）
│ └── Navbar.vue # 导航栏（修改标题）
├── composables/
│ └── useMusics.ts # 音乐数据交互（替换原 usePosts.ts）
├── router/
│ └── index.ts # 路由简化（仅保留首页）
├── types/
│ └── index.ts # 音乐类型定义（替换原 Post 类型）
├── views/
│ └── HomeView.vue # 首页（音乐列表+播放器）
├── public/ # 静态资源（新增）
│ ├── covers/ # 封面图目录
│ │ ├── default.jpg # 默认封面
│ │ └── 1.jpg/2.jpg # 歌曲封面
│ └── music/ # 音频文件目录
│ ├── default.mp3 # 默认音频
│ └── 1.mp3/2.mp3 # 歌曲音频
├── index.css # 全局样式（修改主题色为紫色）
├── main.ts # 入口文件（无修改）
└── App.vue # 根组件（无修改）
