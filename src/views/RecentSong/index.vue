<template>
  <div class="recent-song">
    <div class="top">
      <span class="count">共100首</span>
      <div class="wrapper">
        <div class="playall clickable" @click="playAllSong">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-bofang"></use>
          </svg>
          播放全部
        </div>
        <div class="clear clickable">清空列表</div>
      </div>
    </div>
    <div class="container">
      <div class="head">
        <div class="head-title">音乐标题</div>
        <div class="head-artist">歌手</div>
        <div class="head-time">播放时间</div>
      </div>
      <div class="container-item" v-for="(item, index) in recentSong" :key="item.resourceId"
        @dblclick="playSong(item?.data)">
        <div class="num">{{ fixedNum(index + 1) }}</div>
        <div class="title">
          <span class="bold">{{ item?.data?.name }}</span>
          <span class="alia" v-if="item?.data?.alia != ''">（{{ item?.data?.alia?.[0] }}）</span>
        </div>
        <div class="artist">
          <span class="clickable" @click="showArtistHome(item?.data?.ar?.[0]?.id)">{{ item?.data?.ar?.[0]?.name }}</span>
          <span v-if="item?.data?.ar?.length > 1">
            <span v-for="ar in item?.data?.ar?.slice(1)" :key="ar.id">
              / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
            </span>
          </span>
        </div>
        <div class="time">{{ toPlayTime(item?.playTime) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { dayjs } from 'element-plus'

export default {
  name: 'RecentSong',
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    const recentSong = computed(() => store.state.user.recentSong);

    onMounted(() => {
      store.dispatch('getRecentSong', { limit: 100 });
    });

    function fixedNum(num) {
      return num < 10 ? '0' + num : '' + num;
    }

    function toPlayTime(lastTime) {
      let nowTime = new Date().getTime();
      let res = '';

      let second = Math.round((nowTime - lastTime) / 1000);
      let minute = parseInt(second / 60);
      second = second % 60;
      let hour = parseInt(minute / 60);
      minute = minute % 60;
      let day = parseInt(hour / 24);
      hour = hour % 24;

      if (day === 1) {
        res = '昨天';
      } else if (day > 1) {
        res = dayjs(lastTime).format("YYYY-MM-DD");
      } else {
        if (hour !== 0) {
          res = `${hour}小时前`;
        } else {
          if (minute !== 0) {
            res = `${minute}分钟前`;
          } else {
            res = `${second}秒前`;
          }
        }
      }
      return res;
    }

    function playSong(song) {
      proxy.$Mitt.emit('playSong', { songId: song.id });
      let newItem = { id: song.id, name: song.name, artist: song.ar, len: song.dt };
      proxy.$Mitt.emit('addSong', { song: newItem, insertIndex: store.state.curSongIndex + 1 });
    }

    function playAllSong(curSongId, curSongIndex) {
      proxy.$Mitt.emit('clearSongList');
      for (let i = 0; i < recentSong.value?.length; i++) {
        let item = recentSong.value[i].data;
        let newItem = { id: item.id, name: item.name, artist: item.ar, len: item.dt };
        proxy.$Mitt.emit('addSong', { song: newItem });
      }
      if (typeof curSongId === 'number') {
        proxy.$Mitt.emit('playSong', { songId: curSongId, songIndex: curSongIndex });
      } else {
        proxy.$Mitt.emit('playSong', { songId: recentSong.value[0].data.id, songIndex: 0 });
      }
    }

    function showArtistHome(artistId) {
      router.push({
        name: 'artisthome', params: {
          id: artistId
        }
      })
    }

    function showAlbumDetail(albumId) {
      router.push({
        name: 'albumlist',
        params: {
          id: albumId
        }
      });
    }

    return {
      fixedNum,
      toPlayTime,
      playSong,
      playAllSong,
      showArtistHome,
      showAlbumDetail,
      recentSong,
    }
  }

}
</script>

<style lang="less" scoped>
.recent-song {
  font-size: 12px;

  .clickable {
    cursor: pointer;
  }

  .clickable:hover {
    font-weight: 500;
  }

  .top {
    margin-bottom: 20px;

    .count {
      color: #696969;
      font-size: 10px;
    }

    .wrapper {
      display: flex;
      align-items: flex-end;

      .playall {
        font-size: 14px;
        margin-top: 20px;
        background-color: #e65d4c;
        color: white;
        margin-right: 8px;
        box-sizing: border-box;
        padding: 5px 15px;
        border: 1px solid #c3c3c3;
        border-radius: 10px;
        width: 115px;
      }

      .playall .icon {
        fill: white;
        width: 14px;
        height: 14px;
        fill: #9b9b9b;
        position: relative;
        top: 2px;
      }

      .clear {
        font-size: 14px;
        color: #4c70a4;
        position: absolute;
        right: 50px;
      }
    }
  }

  .container {
    width: 730px;

    .head {
      height: 35px;
      color: #696969;
      border-top: 1px solid #e0e0e0;
      display: flex;
      line-height: 35px;

      .head-title {
        margin-left: 40px;
        min-width: 370px;
      }

      .head-artist {
        min-width: 220px;
      }

      .head-time {
        min-width: 140px;
      }
    }

    .container-item {
      height: 30px;
      display: flex;
      align-items: center;
      font-weight: 400;
      color: #696969;

      .num {
        width: 40px;
        color: #c3c3c3;
        flex-shrink: 0;
        text-align: center;
      }

      .title {
        max-width: 370px;
        min-width: 370px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        .bold {
          color: black;
        }

        .alia {
          color: #656464;
        }
      }

      .artist {
        max-width: 220px;
        min-width: 220px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .time {
        max-width: 140px;
        min-width: 140px;
      }
    }

    .container-item:nth-child(2n+1) {
      background-color: #fafafa;
    }

    .container-item:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>