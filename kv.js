async function handleRequest(request) {
  try {
    // 统一响应头
    const DEFAULT_HEADERS = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    // URL解析容错
    let url, pathname, method;
    try {
      url = new URL(request.url);
      pathname = url.pathname;
      method = request.method.toUpperCase();
    } catch (urlErr) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "请求 URL 格式非法，无法解析",
        }),
        { status: 400, headers: DEFAULT_HEADERS }
      );
    }

    // OPTIONS预检请求
    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 初始化EdgeKV
    if (typeof EdgeKV === "undefined") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "EdgeKV 模块未加载，无法读取音乐数据",
        }),
        { status: 500, headers: DEFAULT_HEADERS }
      );
    }
    const edgeKV = new EdgeKV({ namespace: "kvmusic" });
    const getType = { type: "json" };

    // 1. 获取所有音乐列表（核心接口）
    if (method === "GET" && pathname === "/api/musics") {
      const musicList = (await edgeKV.get("music_list", getType)) || [];
      if (!Array.isArray(musicList)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "music_list 格式错误，预期为数组",
          }),
          { status: 500, headers: DEFAULT_HEADERS }
        );
      }

      // 批量读取单首音乐详情
      const musics = await Promise.all(
        musicList.map(async (id) => {
          if (!id) return null;
          const idStr = String(id);
          const musicKey = `music_${idStr}`;
          const music = await edgeKV.get(musicKey, getType);
          // 字段兜底
          return music
            ? {
                id: idStr,
                name: music.name || "未知歌曲",
                singer: music.singer || "未知歌手",
                cover: music.cover || "/covers/default.jpg", // 前端默认封面
                lyric: music.lyric || "暂无歌词",
                audioPath: music.audioPath || `/music/default.mp3`, // 前端默认音频
              }
            : null;
        })
      );

      const validMusics = musics.filter(Boolean);
      return new Response(
        JSON.stringify({
          success: true,
          data: validMusics,
        }),
        { headers: DEFAULT_HEADERS }
      );
    }

    // 2. 获取单首音乐详情
    if (method === "GET" && pathname.startsWith("/api/music/")) {
      const musicId = pathname.split("/").pop();
      if (!musicId) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "音乐ID不能为空",
          }),
          { status: 400, headers: DEFAULT_HEADERS }
        );
      }

      const musicIdStr = String(musicId);
      const musicKey = `music_${musicIdStr}`;
      const music = await edgeKV.get(musicKey, getType);

      if (!music) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "音乐不存在",
          }),
          { status: 404, headers: DEFAULT_HEADERS }
        );
      }

      // 字段兜底
      const musicWithDefault = {
        ...music,
        id: musicIdStr,
        name: music.name || "未知歌曲",
        singer: music.singer || "未知歌手",
        cover: music.cover || "/covers/default.jpg",
        lyric: music.lyric || "暂无歌词",
        audioPath: music.audioPath || `/music/default.mp3`,
      };

      return new Response(
        JSON.stringify({
          success: true,
          data: musicWithDefault,
        }),
        { headers: DEFAULT_HEADERS }
      );
    }

    // 路由未匹配
    return new Response(
      JSON.stringify({
        success: false,
        error: "接口不存在",
      }),
      { status: 404, headers: DEFAULT_HEADERS }
    );
  } catch (e) {
    const errorMsg = e.message || "未知操作异常";
    return new Response(
      JSON.stringify({
        success: false,
        error: `操作异常：${errorMsg}`,
      }),
      { status: 500, headers: DEFAULT_HEADERS }
    );
  }
}

// 导出fetch处理函数
export default {
  async fetch(request) {
    return handleRequest(request);
  },
};
