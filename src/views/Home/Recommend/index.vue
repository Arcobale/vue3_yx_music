<template>
  <div class="home-recommend">
    <div class="banner">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="(item, index) in banner" :key="index" @click="bannerHandler(item, item.targetType)">
          <img :src="item.imageUrl" alt="" style="height: 200px; border-radius: 10px;">
          <div class="mask">
            <div class="type" :style="{ backgroundColor: item.titleColor }">{{ item.typeTitle }}</div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="recommend-songlist">
      <div class="title">
        推荐歌单
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
      <div class="container">
        <div v-for="item in personalizedList" :key="item.id">
          <img :src="item.picUrl" :alt="item.name" class="cover" style="weight: 134px; height: 134px;"
            @click="showDetail(item.id)">
          <div class="desc">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="recommend-privatecontent">
      <div class="title">
        独家放送
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
      <div class="container">
        <div v-for="item in privateContent" :key="item.id">
          <img :src="item.sPicUrl" :alt="item.name" class="cover" style="weight: 170px; height: 95px;">
          <div class="desc">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="recommend-newsong">
      <div class="title">
        最新音乐
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
      <div class="container">
        <div v-for="(item, index) in newSong" :key="item.id" class="container-item" @dblclick="playSong(item.id)">
          <img :src="item.picUrl" :alt="item.name" class="cover" style="weight: 60px; height: 60px;">
          <span class="num">{{ fixedNum(index) }}</span>
          <div class="desc">
            <div class="item-title">{{ item.name }}</div>
            <div class="item-singer">
              <span v-for="artist in item.song.artists" :key="artist.id">{{ artist.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="recommend-privatecontent">
      <div class="title">
        推荐MV
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
      <div class="container">
        <div v-for="item in personalizedMV" :key="item.id">
          <img :src="item.picUrl" :alt="item.name" class="cover" style="weight: 170px; height: 95px;">
          <div class="desc">${{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, reactive, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Recommend',
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    const personalizedListParams = reactive({
      limit: 10
    })

    onMounted(() => {
      // state.personalizedList = store.state.home.personalizedList;
      store.dispatch("getPersonalizedList", personalizedListParams);
      store.dispatch("getPrivateContent");
      store.dispatch("getNewSong");
      store.dispatch("getPersonalizedMV");
      store.dispatch("getBanner");
    })

    function fixedNum(num) {
      return ('' + num).length < 2 ? ('0' + num) : ('' + num);
    }

    function showDetail(playListId) {
      router.push({
        name: 'playlist',
        params: {
          id: playListId
        }
      });
      // router.push(`/playlist/${playListId}`);
    }

    function playSong(songId) {
      proxy.$Mitt.emit('playSong', songId);
    }

    function showAlbumDetail(albumId) {
      router.push({
        name: 'albumlist',
        params: {
          id: albumId
        }
      });
    }

    function bannerHandler(banner, type) {
      if (type === 1) {
        // 新歌首发/热歌推荐，根据targetId播放歌曲
        playSong(banner.targetId);
      } else if (type === 3000) {
        // 数字专辑/独家策划/活动，根据url属性的id参数跳转歌单详情页
        // let url = banner.url;
        // let query = url.split('?')[1];
        // let id = query.split('=')[1];
        // showAlbumDetail(id);
        alert('暂不支持');
      } else if (type === 1000) {
        // 独家策划，根据targetId跳转歌单详情页
        // showDetail(banner.targetId);
      } else if (type === 10) {
        // 新碟首发/热碟推荐，根据targetId跳转歌单详情页
        showAlbumDetail(banner.targetId);
      }
    }

    return {
      store,
      personalizedList: computed(() => store.state.home.personalizedList || {}),
      privateContent: computed(() => store.state.home.privateContent || {}),
      newSong: computed(() => store.state.home.newSong || {}),
      personalizedMV: computed(() => store.state.home.personalizedMV || {}),
      banner: computed(() => store.state.home.banner || {}),
      fixedNum,
      showDetail,
      playSong,
      bannerHandler
    }
  }
}
</script>

<style lang="less" scoped>
.home-recomment {
  background-color: #ffffff;
}

.banner {
  margin: auto;

  .is-active {
    width: 538px;
    left: -70px;
  }

  .mask {
    // width: 70px;
    // height: 20px;
    width: 538px;
    height: 200px;
    border-radius: 10px;
    background-color: transparent;
    position: absolute;
    transform: translate(0, -100%);

    .type {
      width: 70px;
      height: 20px;
      position: absolute;
      bottom: 0;
      right: 0;
      border-top-left-radius: 10px;
      border-bottom-right-radius: 10px;
      color: white;
      font-size: 12px;
      text-align: center;
      line-height: 20px;
    }
  }
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.recommend-songlist {
  font-size: 12px;
  color: #000000;
  margin-top: 16px;
  width: 740px;

  .container {
    width: 100%;
    height: 100%;
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 2;

    column-gap: 14px;
    row-gap: 30px;
    place-items: start start;

    .cover {
      border-radius: 10%;
    }

    .desc {
      line-height: 16px;
    }
  }
}

.recommend-privatecontent {
  font-size: 12px;
  color: #000000;
  margin-top: 60px;

  .container {
    width: 740px;
    height: 140px;
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1;

    column-gap: 16px;
    place-items: start start;

    .cover {
      border-radius: 10px;
    }

    .desc {
      line-height: 16px;
    }
  }
}

.recommend-newsong {
  font-size: 12px;
  color: #000000;
  margin-top: 60px;

  .container {
    width: 740px;
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 5;

    column-gap: 38px;
    place-items: start start;

    .container-item {
      display: flex;
      align-items: center;
      margin: 8px 0;
      width: 100%;
      height: 80px;
      border-top: 1px solid #fafafa;
      margin: 0px;

      .cover {
        border-radius: 10%;
      }

      .num {
        color: #c3c3c3;
        font-size: 10px;
        margin: 0 10px;
      }

      .desc {
        flex: 1;

        .item-title {
          font-size: 14px;
        }

        .item-singer {
          margin-top: 8px;
          font-size: 10px;
          color: #6e6e6e;
        }
      }
    }

    .container-item:hover {
      background-color: #f0f0f0;
    }

    .container-item:nth-last-child(2) {
      border-bottom: 1px solid #fafafa;
    }

    .container-item:last-child {
      border-bottom: 1px solid #fafafa;
    }
  }
}
</style>