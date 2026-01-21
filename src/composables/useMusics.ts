import { ref } from "vue";
import type { Music, KVResponse } from "@/types";

const EDGE_FUNCTION_BASE_URL = "https://kvmusic.4fa2a2a9.er.aliyun-esa.net";

export const useMusics = () => {
  const musics = ref<Music[]>([]);
  const loading = ref(false);
  const error = ref("");
  const currentMusic = ref<Music | null>(null);
  const isPlaying = ref(false);
  const audioRef = ref<HTMLAudioElement | null>(null);

  // 根据ID查找音乐
  const getMusicById = (id: string | number): Music | undefined => {
    return musics.value.find((music) => music.id === id);
  };

  // 重置错误
  const resetError = () => {
    error.value = "";
  };

  // 获取所有音乐列表
  const fetchMusics = async (): Promise<KVResponse<Music[]>> => {
    loading.value = true;
    resetError();
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/musics`);
      if (!response.ok) {
        throw new Error(`请求失败：${response.status} ${response.statusText}`);
      }
      const result: KVResponse<Music[]> = await response.json();
      if (result.success) {
        musics.value = (result.data || []).map((music) => ({
          ...music,
          name: music.name || "未知歌曲",
          singer: music.singer || "未知歌手",
          cover: music.cover || "/covers/default.jpg",
          lyric: music.lyric || "暂无歌词",
          audioPath: music.audioPath || "/music/default.mp3",
        }));
        if (musics.value.length > 0 && !currentMusic.value) {
          currentMusic.value = musics.value[0];
        }
        return { success: true, data: musics.value };
      } else {
        const errMsg = result.error || "获取音乐列表失败";
        error.value = errMsg;
        return { success: false, error: errMsg };
      }
    } catch (e) {
      const errMsg = `网络异常：${(e as Error).message}`;
      error.value = errMsg;
      return { success: false, error: errMsg };
    } finally {
      loading.value = false;
    }
  };

  // 获取单首音乐
  const fetchMusicById = async (id: string): Promise<KVResponse<Music>> => {
    if (!id || typeof id !== "string") {
      const errMsg = "音乐ID格式错误";
      error.value = errMsg;
      return { success: false, error: errMsg };
    }

    loading.value = true;
    resetError();
    try {
      const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/api/music/${id}`);
      if (!response.ok) {
        throw new Error(`请求失败：${response.status} ${response.statusText}`);
      }
      const result: KVResponse<Music> = await response.json();
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const errMsg = result.error || "获取音乐详情失败";
        error.value = errMsg;
        return { success: false, error: errMsg };
      }
    } catch (e) {
      const errMsg = `网络异常：${(e as Error).message}`;
      error.value = errMsg;
      return { success: false, error: errMsg };
    } finally {
      loading.value = false;
    }
  };

  // 播放/暂停：强制设置src + 捕获播放错误
  const togglePlay = () => {
    if (!audioRef.value || !currentMusic.value) {
      error.value = "未加载音频资源或无选中歌曲";
      return;
    }

    try {
      // 强制设置src（确保路径正确）
      audioRef.value.src = currentMusic.value.audioPath;
      if (isPlaying.value) {
        audioRef.value.pause();
      } else {
        // 解决浏览器自动播放限制：必须由用户交互触发
        const playPromise = audioRef.value.play();
        if (playPromise) {
          playPromise.catch((err) => {
            console.error("播放失败（浏览器限制）：", err);
            error.value = "播放失败：请手动点击播放（浏览器禁止自动播放）";
          });
        }
      }
      isPlaying.value = !isPlaying.value;
    } catch (err) {
      console.error("播放/暂停异常：", err);
      error.value = `播放失败：${(err as Error).message}`;
      isPlaying.value = false;
    }
  };

  // 切换歌曲：强制重置src + 播放
  const changeMusic = (music: Music) => {
    currentMusic.value = music;
    if (audioRef.value) {
      audioRef.value.src = music.audioPath;
      // 捕获切换歌曲时的播放错误
      const playPromise = audioRef.value.play();
      if (playPromise) {
        playPromise.catch((err) => {
          console.error("切换歌曲播放失败：", err);
          error.value = "切换歌曲失败：请手动点击播放";
        });
      }
      isPlaying.value = true;
    }
  };

  // 音频结束自动播放下一首
  const handleAudioEnded = () => {
    if (!currentMusic.value || musics.value.length === 0) return;
    const currentIndex = musics.value.findIndex(
      (m) => m.id === currentMusic.value!.id
    );
    const nextIndex = (currentIndex + 1) % musics.value.length;
    changeMusic(musics.value[nextIndex]);
  };

  return {
    musics,
    loading,
    error,
    currentMusic,
    isPlaying,
    audioRef,
    fetchMusics,
    fetchMusicById,
    getMusicById,
    togglePlay,
    changeMusic,
    handleAudioEnded,
  };
};
