<template>
  <audio :src="songPlayDetail ? songPlayDetail.url : ''"></audio>

  <div id="footer">
    <div class="progress" @mousedown="dragStart" @mouseenter="isIconVisible = true" @mouseleave="isIconVisible = false">
      <el-progress :percentage="percentage" color="#cf756c" :show-text="false" :stroke-width="2" :duration="0"
        style="cursor: pointer;"></el-progress>
      <div class="progress-icon-wrapper">
        <span v-show="isIconVisible"></span>
      </div>
    </div>
    <div class="wrapper">
      <div class="song" v-if="!isEmpty">
        <div class="cover" @click="openOrCloseLyric">
          <img :src="songDetail?.al?.picUrl" alt="">
        </div>
        <div class="song-detail">
          <div class="song-detail-info">
            <span class="info-title">{{ songDetail?.name }}</span>
            - {{ songDetail?.ar?.[0]?.name }}
            <span v-for="ar in songDetail?.ar?.slice(1)" :key="ar.id">/{{ ar.name }}</span>
          </div>
          <div class="song-detail-length">
            {{ curTime }} / {{ songDetail?.dt ? toSongLen(songDetail.dt) : '' }}
          </div>
        </div>
      </div>
      <div class="song-place" v-else></div>
      <div class="player">
        <div class="like" @click="likeSong(curSongId)">
          <svg class="icon" aria-hidden="true" v-if="!isLike">
            <use xlink:href="#icon-aixin"></use>
          </svg>
          <svg class="icon red" aria-hidden="true" v-else>
            <use xlink:href="#icon-aixin1"></use>
          </svg>
        </div>
        <svg class="icon skip" aria-hidden="true" @click="skipSong(-1)">
          <use xlink:href="#icon-skipback"></use>
        </svg>
        <div class="play" @click="changePlayState">
          <svg class="icon" aria-hidden="true" v-if="isPaused">
            <use xlink:href="#icon-play2"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-else>
            <use xlink:href="#icon-pause"></use>
          </svg>
        </div>
        <svg class="icon skip" aria-hidden="true" @click="skipSong(1)">
          <use xlink:href="#icon-skipforward"></use>
        </svg>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-share"></use>
        </svg>
      </div>
      <div class="controler">
        <div class="cycle" @click="changeCycle">
          <svg class="icon" aria-hidden="true" v-if="curCycle === 0">
            <use xlink:href="#icon-danquxunhuan"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-else-if="curCycle === 1">
            <use xlink:href="#icon-xunhuanbofang"></use>
          </svg>
          <svg class="icon" aria-hidden="true" v-else-if="curCycle === 2">
            <use xlink:href="#icon-suijibofang"></use>
          </svg>
        </div>
        <svg class="icon" aria-hidden="true" @click="openList">
          <use xlink:href="#icon-a-icon_playlist"></use>
        </svg>
        <!-- <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-geciweidianji"></use>
        </svg> -->
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-004laba-2"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, reactive, ref } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Player',
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    // 循环状态。0:单曲循环，1:列表循环，2:随机播放
    const curCycle = computed(() => store.state.curCycle);
    const curSongId = computed(() => store.state.lyric.curSongId);
    const curFMIndex = computed(() => store.state.curFMIndex);
    const curTime = ref('00:00');
    const percentage = ref(0);

    const isPaused = ref(true);
    const isEmpty = ref(true);
    const isLike = ref(false);
    const isIconVisible = ref(false);

    const songPlayDetail = computed(() => store.state.playlist.songUrl ? store.state.playlist.songUrl[0] : {});
    const songDetail = computed(() => store.state.playlist.songDetail[0] || undefined);
    let isDragEnd = false;

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
    proxy.$Mitt.on('playSong', ({ songId, songIndex }) => {

      let audio = document.querySelector('audio');
      songUrlParams.id = songId;
      songDetailParams.ids = songId;
      store.commit('CHANGECURSONGID', songId);

      checkLike(songId);

      store.dispatch('getSongUrl', songUrlParams);
      store.dispatch('getSongDetail', songDetailParams);
      isEmpty.value = false;

      // 替换整个播放列表时记录点击歌曲的位置，以便切歌
      if (songIndex !== null) {
        store.commit('CHANGESONG', songIndex);
      }

      // 监听歌曲播放的实时进度
      audio.addEventListener('timeupdate', () => {
        curTime.value = toSongLen(audio.currentTime * 1000);
        store.commit('CHANGECURSONGTIME', audio.currentTime * 1000);
        percentage.value = songDetail.value ? calcPlayProgress(audio.currentTime * 1000, songDetail.value.dt) : 0;
        let progressIcon = document.querySelector('.progress-icon-wrapper span');
        progressIcon.style.left = percentage.value + '%';
      });

      // 监听歌曲播放是否完成
      audio.addEventListener('ended', () => {
        proxy.$Mitt.emit('skipSong', store.state.curCycle);
        isPaused.value = true;
      });

      // 等待歌曲资源请求完毕后再播放
      setTimeout(() => {
        audio.play();
        isPaused.value = false;
        let progressIcon = document.querySelector('.progress-icon-wrapper span');
        progressIcon.style.left = '0%';
        if (songPlayDetail.freeTrialInfo) {
          alert('您正在试听会员歌曲！');
        }
      }, 1000);
    })

    proxy.$Mitt.on('stopCurSong', () => {
      let audio = document.querySelector('audio');
      percentage.value = 0;
      isPaused.value = true;
      curTime.value = '00:00';
      isEmpty.value = true;
      audio.src = '';
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

    // 打开播放列表
    function openList() {
      proxy.$Mitt.emit('openList');
    }

    // 切歌
    function skipSong(step) {

      function doSkip() {
        proxy.$Mitt.emit('skipSong', step);
      }

      if (router.currentRoute.value.fullPath === '/fm') {
        store.commit('SKIPFM', step);
        if (curFMIndex.value % 3 === 0) {
          proxy.$Mitt.emit('getFMData', doSkip)
        } else {
          doSkip()
        }
      } else {
        doSkip();
      }
    }

    // 检查当前歌曲是否在喜欢音乐列表中
    function checkLike(songId) {
      // 请求加上时间戳，避免缓存
      store.dispatch('getLikeList', { uid: store.state.login.userId, timestamp: new Date().getTime() }).then(() => {
        if (store.state.user.likeListId.includes(songId)) {
          isLike.value = true;
        } else {
          isLike.value = false;
        }
      });
    }

    // 喜欢/取消喜欢音乐
    function likeSong(songId) {
      // like值默认为true，喜欢；false，取消喜欢
      console.log(songId, isLike.value);
      store.dispatch('getLike', { id: songId, like: !isLike.value }).then((msg) => {
        console.log(msg);
        checkLike(songId);
      });
    }

    // 切换循环状态
    function changeCycle() {
      store.commit('CHANGECYCLE');
    }

    function dragStart() {
      isDragEnd = false;
      let element = event.target;
      element.addEventListener("mouseup", dragEnd);
      document.body.addEventListener("mousemove", dragMove);
    }

    function dragMove() {
      if (!isDragEnd) {
        const progressBox = document.querySelector(".progress");
        const rect = progressBox.getBoundingClientRect();
        const width = rect.width;
        const offsetX = event.clientX - rect.left;

        percentage.value = Math.round((offsetX / width) * 100);
        percentage.value = Math.max(0, Math.min(percentage.value, 100));

        const currentTime = songDetail.value.dt * percentage.value / 100 / 1000;
        curTime.value = toSongLen(currentTime * 1000);
      }
    }

    function dragEnd() {
      isDragEnd = true;
      const progressBox = document.querySelector(".progress");
      const rect = progressBox.getBoundingClientRect();
      const width = rect.width;
      const offsetX = event.clientX - rect.left;

      percentage.value = Math.round((offsetX / width) * 100);
      percentage.value = Math.max(0, Math.min(percentage.value, 100));
      let audio = document.querySelector('audio');
      audio.currentTime = songDetail.value.dt * percentage.value / 100 / 1000;
    }

    function openOrCloseLyric() {
      let isOpen = store.state.lyric.isLyricOpen;
      if (isOpen) {
        proxy.$Mitt.emit('closeLyric');
      } else {
        proxy.$Mitt.emit('openLyric');
      }
    }

    return {
      curTime,
      curCycle,
      curSongId,
      percentage,
      songPlayDetail,
      songDetail,
      skipSong,
      likeSong,
      changePlayState,
      toSongLen,
      calcPlayProgress,
      openList,
      changeCycle,
      dragStart,
      openOrCloseLyric,
      isPaused,
      isEmpty,
      isIconVisible,
      isLike
    }
  }
}
</script>

<style lang="less" scoped>
#footer {
  width: 100%;
  background-color: white;

  svg {
    fill: black;
  }

  .progress {
    .progress-icon-wrapper {
      height: 16px;
      width: 100%;
      position: absolute;

      span {
        width: 8px;
        height: 8px;
        background-color: #cf756c;
        border-radius: 50%;
        position: absolute;
        margin-left: -4px;
        margin-top: -4px;
      }
    }
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
          margin-bottom: 4px;

          .info-title {
            font-size: 12px;
            color: #000000;
          }
        }
      }
    }

    .player {
      width: 300px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;

      .like {
        svg.red {
          fill: #c3473a;
        }
      }

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