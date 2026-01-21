/** 音乐类型定义 */
export interface Music {
  id: string | number;
  name: string; // 歌曲名
  singer: string; // 歌手
  cover: string; // 封面路径（前端静态资源）
  lyric: string; // 歌词
  audioPath: string; // 音频路径（前端静态资源）
}

/** KV操作返回结果类型 */
export interface KVResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
