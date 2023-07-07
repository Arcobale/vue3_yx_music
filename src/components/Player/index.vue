<template>
  <audio :src="songUrl"></audio>

  <div id="footer">
    <el-progress :percentage="percentage" color="#cf756c" :show-text="false" :stroke-width="2" v-if="songDetail"></el-progress>
    <div class="wrapper">
      <div class="song" v-if="songDetail">
        <div class="cover">
          <img :src="songDetail.al.picUrl" alt="">
        </div>
        <div class="song-detail">
          <div class="song-detail-info">
            <span class="info-title">{{ songDetail.name }}</span>
            <span class="info-singer"> - {{ songDetail.ar[0].name }}</span>
          </div>
          <div class="song-detail-length">
            {{ curTime }} / {{ toSongLen(songDetail.dt) }}
          </div>
        </div>
      </div>
      <div class="song-place" v-else></div>
      <div class="player">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-heart"></use>
        </svg>
        <svg class="icon skip" aria-hidden="true">
          <use xlink:href="#icon-skipback"></use>
        </svg>
        <div class="play" @click="changePlayState">
          <!-- <i class="iconfont icon-play1"></i> -->
          <svg class="icon" aria-hidden="true" v-if="isPaused">
            <use xlink:href="#icon-play2"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-if="!isPaused">
            <use xlink:href="#icon-pause"></use>
          </svg>
        </div>
        <svg class="icon skip" aria-hidden="true">
          <use xlink:href="#icon-skipforward"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-share"></use>
        </svg>
      </div>
      <div class="controler">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-danquxunhuan"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-icon_playlist"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-geciweidianji"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-004laba-2"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex';

export default {
  name: 'Player',
  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance();

    const isPaused = ref(true);
    const curTime = ref('00:00');
    const percentage = ref(0);
    const songUrl = computed(() => store.state.playlist.songUrl[0] ? store.state.playlist.songUrl[0].url : '');
    const songDetail = computed(() => store.state.playlist.songDetail[0] || undefined);

    const songUrlParams = reactive({
      id: 1,
      level: 'standard'
    });
    const songDetailParams = reactive({
      ids: 1
    });

    // 输出固定格式的时间
    function toSongLen(ms) {
      let second = Math.round(ms / 1000);
      let minute = parseInt(second / 60);
      second = second % 60;
      let res = '';

      res += minute < 10 ? '0' + minute : '' + minute;
      res += ':';
      res += second < 10 ? '0' + second : '' + second;
      return res;
    }

    // 监听双击歌曲播放的事件，使用歌曲id请求歌曲详情及其URL
    proxy.$Mitt.on('playSong', songId => {
      let audio = document.querySelector('audio');
      songUrlParams.id = songId;
      songDetailParams.ids = songId;
      store.dispatch('getSongUrl', songUrlParams);
      store.dispatch('getSongDetail', songDetailParams);

      // 监听歌曲播放的实时进度
      audio.addEventListener('timeupdate', () => {
        curTime.value = toSongLen(audio.currentTime * 1000);
        percentage.value = songDetail ? calcPlayProgress(audio.currentTime * 1000, songDetail.value.dt) : 0;
      });
      // 监听歌曲播放是否完成
      audio.addEventListener('ended', () => {
        audio.pause();
        isPaused.value = true;
      });
      // 等待歌曲资源请求完毕后再播放
      setTimeout(() => {
        audio.play();
        isPaused.value = false;
      }, 1000);
    })


    // 播放/暂停状态切换
    function changePlayState() {
      let audio = document.querySelector('audio');
      isPaused.value = !audio.paused;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }

    // 计算播放进度
    function calcPlayProgress(cur, total = 0) {
      return cur / total * 100;
    }

    return {
      songUrl,
      curTime,
      percentage,
      songDetail,
      changePlayState,
      toSongLen,
      calcPlayProgress,
      isPaused
    }
  }
}
</script>

<style lang="less" scoped>
#footer {
  width: 100%;
  background-color: white;

  .el-progress {
    width: 100%;
  }

  .wrapper {
    height: 60px;
    display: flex;
    justify-content: space-between;
    color: #9b9b9b;

    .icon {
      width: 16px;
      height: 16px;
    }

    .song-place {
      width: 300px;
    }

    .song {
      width: 300px;
      font-size: 10px;
      display: flex;
      align-items: center;

      .cover img {
        width: 38px;
        height: 38px;
        border-radius: 10%;
        margin: 0 8px;
      }

      .song-detail {
        .song-detail-info {
          .info-title {
            font-size: 12px;
            color: #000000;
          }

          margin-bottom: 4px;
        }
      }
    }

    .player {
      width: 300px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;

      .skip {
        fill: #c3473a;
      }

      .play {
        background-color: #c3473a;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        position: relative;

        svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          fill: white;
        }
      }
    }

    .controler {
      width: 215px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
  }
}
</style>