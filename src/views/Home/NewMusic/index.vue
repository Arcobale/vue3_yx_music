<template>
  <div class="newmusic">
    <div class="title" @click="changeRoute">
      <div class="title-item active-title" value="newsong">新歌速递</div>
      <div class="title-item" value="newalbum">新碟上架</div>
    </div>
    <div class="breadcrumb">
      <div class="left">
        <ul @click="changeType">
          <li class="active" value="0">全部</li>
          <li value="7">华语</li>
          <li value="96">欧美</li>
          <li value="8">日本</li>
          <li value="16">韩国</li>
        </ul>
      </div>
      <div class="right">
        <div class="play button" @click="playAllSong">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-bofang"></use>
          </svg>
          播放全部
        </div>
        <div class="collect button">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tianjia"></use>
          </svg>
          收藏全部
        </div>
      </div>
    </div>
    <div class="container">
      <div class="container-item" v-for="(item, index) in newSongList" :key="item.id"
        @dblclick="playAllSong(item.id, index)">
        <div class="song-num">{{ fixedNum(index + 1) }}</div>
        <div class="song-cover">
          <img :src="item.album.picUrl" alt="">
        </div>
        <div class="song-title">
          <span class="bold">{{ item.name }}</span>
          <span class="alia" v-if="item.alias != ''">({{ item.alias[0] }})</span>
        </div>
        <div class="song-artist">
          {{ item.artists[0].name }}
          <span v-for="ar in item.artists.slice(1)" :key="ar.id">/{{ ar.name }}</span>
        </div>
        <div class="song-album">{{ item.album.name }}</div>
        <div class="song-length">{{ toSongLen(item.duration) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, reactive, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'NewMusic',

  setup() {
    const store = useStore();
    const { proxy } = getCurrentInstance();

    const newSongListParams = reactive({
      type: 0
    })

    const newSongList = computed(() => store.state.home.newSongList || {});

    onMounted(() => {
      getData();
    })

    function getData() {
      store.dispatch('getNewSongList', newSongListParams);
    }

    function fixedNum(num) {
      return num < 10 ? '0' + num : '' + num;
    }

    function changeType(e) {
      newSongListParams.type = parseInt(e.target.value);
      let curActiveElement = document.querySelector('.active');
      curActiveElement.classList.remove('active');
      e.target.classList.add('active');
      getData();
    }

    function changeRoute(e) {
      let curActiveElement = document.querySelector('.active-title');
      curActiveElement.classList.remove('active-title');
      e.target.classList.add('active-title');
    }

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

    function playAllSong(curSongId, curSongIndex) {
      proxy.$Mitt.emit('clearSongList');
      for (let i = 0; i < newSongList.value.length; i++) {
        let item = newSongList.value[i];
        let newItem = { id: item.id, name: item.name, artist: item.artists, len: item.duration }
        proxy.$Mitt.emit('addSong', { song: newItem });
      }
      if (typeof curSongId === 'number') {
        proxy.$Mitt.emit('playSong', { songId: curSongId, songIndex: curSongIndex });
      } else {
        proxy.$Mitt.emit('playSong', { songId: newSongList.value[0].id, songIndex: 0 });
      }
    }

    return {
      fixedNum,
      changeType,
      changeRoute,
      toSongLen,
      playAllSong,
      newSongList,
    }
  }

}
</script>

<style lang="less" scoped>
.newmusic {
  .title {
    width: 230px;
    height: 30px;
    box-sizing: border-box;
    display: flex;
    margin: 0 auto;
    border-radius: 20px;
    border: 1px solid #bbbbbb;
    font-size: 12px;

    .title-item {
      width: 50%;
      box-sizing: border-box;
      padding: 8px 30px;
      border-radius: 20px;
    }

    .active-title {
      background-color: #bbbbbb;
      color: #fcfcfc;
    }
  }

  .breadcrumb {
    margin-top: 25px;
    width: 740px;
    display: flex;
    align-items: center;

    .left {
      ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 345px;
        font-size: 14px;
        font-weight: 400;
        color: #696969;

        li {
          display: block;
        }

        .active {
          font-weight: 600;
          color: black;
        }
      }
    }

    .right {
      display: flex;
      font-size: 12px;
      position: absolute;
      right: 50px;

      .button {
        width: 90px;
        height: 24px;
        border-radius: 10px;
        text-align: center;
        line-height: 24px;

      }

      svg {
        width: 12px;
        height: 12px;
      }

      .play {
        background-color: #e65d4c;
        color: white;
        margin-right: 7px;

        svg {
          fill: white;
        }
      }

      .collect {
        border: 1px solid #c3c3c3;
      }
    }
  }

  .container {
    margin-top: 8px;

    .container-item {
      height: 80px;
      display: flex;
      align-items: center;
      font-weight: 400;
      font-size: 11px;
      color: #696969;

      .song-cover {
        img {
          width: 60px;
          height: 60px;
          border-radius: 5px;
        }

      }

      .song-num {
        width: 30px;
        color: #c3c3c3;
      }

      .song-title {
        margin-left: 8px;
        font-size: 13px;
        width: 290px;

        .bold {
          color: black;
        }

        .alia {
          color: #656464;
        }
      }

      .song-artist {
        width: 140px;
      }

      .song-album {
        width: 180px;
      }

      .song-length {
        font-size: 8px;
      }
    }

    .container-item:nth-child(2n+1) {
      background-color: #fafafa;
    }
  }
}
</style>