<template>
  <div class="video-list">
    <div class="breadcrumb" @mouseleave="isOpen = false">
      <div class="category">
        <div class="current-tag" @click="isOpen = !isOpen">
          {{ curGroup }}
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>
        <div class="hot-tag">
          <div class="hot-tag-item" v-for="item in videoCategoryList" :key="item.id"
            @click="changeGroup(item.id, item.name)">
            <span class="clickable">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div class="nav" v-show="isOpen">
        <div class="all" @click="changeGroup(-1)">
          <span class="clickable activeCat">全部视频</span>
        </div>
        <div class="menu">
          <div class="menu-item clickable" v-for="item in videoGroupList" :key="item.id"
            @click="changeGroup(item.id, item.name)">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频 -->
    <div class="container" v-if="videoList?.[0]?.type === 1" v-infinite-scroll="loadRestData">
      <div class="container-item clickable" v-for=" item  in  videoList " :key="item.vid"
        @click="showMVDetail(item?.data?.vid)">
        <div class="mask">
          <div class="count">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-play1"></use>
            </svg>
            {{ fixedCount(item?.data?.playTime) }}
          </div>
          <div class="length">{{ toSongLen(item?.data?.durationms) }}</div>
        </div>
        <img :src="item?.data?.coverUrl" alt="">
        <span class="name">
          {{ item?.data?.title }}
        </span>
        <div class="creator">
          <span class="clickable" @click="showUserHome(item?.data?.creator.userId)">
            by {{ item?.data?.creator?.nickname }}
          </span>
        </div>
      </div>
    </div>

    <!-- MV -->
    <div class="container" v-if="videoList?.[0]?.type === 2" v-infinite-scroll="loadRestData">
      <div class="container-item clickable" v-for=" item  in  videoList " :key="item?.data?.id"
        @click="showMVDetail(item?.data?.id)">
        <img :src="item?.data?.coverUrl" alt="">
        <div class="mask">
          <div class="count">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-play1"></use>
            </svg>
            {{ fixedCount(item?.data?.playCount) }}
          </div>
          <div class="length">{{ toSongLen(item?.data?.duration) }}</div>
        </div>
        <span class="name">
          {{ item?.data?.name }}
        </span>
        <div class="creator">
          <span class="clickable" @click="showArtistHome(item?.data?.artists?.[0]?.id)">
            {{ item?.data?.artists?.[0]?.name }}
          </span>
          <span v-if="item?.data?.artists?.length > 1">
            <span v-for=" ar  in  item?.data?.artists?.slice(1) " :key="ar.id">
              / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'SubscribeVideo',
  setup() {
    const store = useStore();
    const router = useRouter();

    const videoGroupList = computed(() => store.state.mv.videoGroupList);
    const videoCategoryList = computed(() => store.state.mv.videoCategoryList);
    const videoList = ref([]);

    const curGroup = ref('全部视频');
    const isOpen = ref(false);
    let loadCount = 1;
    let offset = 0;

    onMounted(() => {
      store.dispatch('getVideoGroupList');
      store.dispatch('getVideoCategoryList');
      store.dispatch('getVideoAll', { offset: 0 }).then(() => {
        videoList.value = store.state.mv.videoAll;
      });
    });

    function changeGroup(groupId, groupName) {
      if (groupId === -1) {
        store.dispatch('getVideoAll', { offset: 0 }).then(() => {
          videoList.value = store.state.mv.videoAll;
        });
      } else {
        store.dispatch('getVideoGroup', { id: groupId, offset: 0 }).then(() => {
          videoList.value = store.state.mv.videoGroup;
        });
      }
      curGroup.value = groupId === -1 ? '全部视频' : groupName;
      isOpen.value = false;

      let curActiveElement = document.querySelector('.activeCat');
      let element = event.target;
      if (curActiveElement) {
        curActiveElement.classList.remove('activeCat');
      }
      element.classList.add('activeCat');
    }

    function getData() {
      if (curGroup.value === '全部视频') {
        store.dispatch('getVideoAll', { offset }).then(() => {
          videoList.value = videoList.value.concat(store.state.mv.videoAll);
        });
      } else {
        store.dispatch('getVideoGroup', { id: groupId, offset }).then(() => {
          videoList.value = videoList.value.concat(store.state.mv.videoGroup);
        });
      }
    }

    function loadRestData() {
      if (store.state.mv.hasMore) {
        loadCount++;
        offset = 12 * (loadCount - 1);
        getData();
      }
    }

    function showMVDetail(mvId) {
      // router.push({
      //     name: 'mv',
      //     params: {
      //         id: mvId
      //     }
      // });
    }

    function showArtistHome(artistId) {
      router.push({
        name: 'artisthome', params: {
          id: artistId
        }
      })
    }

    function showUserHome(userId) {

    }

    function fixedCount(num) {
      return num > 99999999 ? parseInt(num / 100000000) + '亿' : num > 99999 ? parseInt(num / 10000) + '万' : num + '';
    }

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

    return {
      curGroup,
      isOpen,
      showMVDetail,
      showArtistHome,
      showUserHome,
      toSongLen,
      fixedCount,
      changeGroup,
      videoGroupList,
      videoCategoryList,
      videoList,
      loadRestData
    }
  }

}
</script>

<style lang="less" scoped>
.video-list {
  font-size: 12px;

  .clickable {
    cursor: pointer;
  }

  .clickable:hover {
    color: #c24639;
  }

  .breadcrumb {
    .activeCat {
      color: #c24639;
      background-color: #ffeeeb;
    }

    .category {
      display: flex;
      height: 28px;
      display: flex;
      justify-content: space-between;
      margin-right: 20px;
      margin-top: 14px;
      text-align: center;

      .current-tag {
        height: 100%;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-size: 14px;
        line-height: 28px;
        padding: 0 16px;
        text-align: center;

        .el-icon {
          position: relative;
          top: 2px;
          left: -2px;
        }
      }

      .current-tag:hover {
        background-color: #edeced;
        cursor: default;
      }

      .hot-tag {
        width: 600px;
        height: 28px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .hot-tag-item {
          box-sizing: border-box;
          border-left: 1px solid #e0e0e0;

          span {
            padding: 4px 14px;
            border-radius: 20px;
            margin-left: 4px;
          }
        }

        .hot-tag-item:first-child {
          border-left: none;
        }
      }
    }

    .nav {
      width: 715px;
      font-size: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      margin-top: 8px;

      .all {
        padding: 12px 20px;
        border-bottom: 1px solid #e0e0e0;

        span {
          font-size: 14px;
          font-weight: 500;
          padding: 6px 10px;
          text-align: center;
          border-radius: 20px;
        }
      }

      .all :hover {
        color: #c24639;
      }

      .menu {
        padding: 8px 20px 50px 30px;
        display: flex;
        flex-wrap: wrap;
        max-height: 440px;
        overflow: scroll;

        .menu-item {
          margin-bottom: 35px;
          min-width: 110px;

          span {
            padding: 6px 10px;
            text-align: center;
            border-radius: 20px;
            margin-left: -10px;
          }
        }
      }
    }
  }

  .container {
    width: 730px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 16px;
    row-gap: 38px;
    margin-top: 16px;

    .container-item {
      position: relative;
      img {
        width: 233px;
        height: 130px;
        border-radius: 10px;
      }

      .mask {
        width: 233px;
        height: 130px;
        background-color: transparent;
        position: absolute;
        color: white;

        .count {
          position: absolute;
          top: 6px;
          right: 8px;

          .icon {
            width: 12px;
            height: 12px;
            fill: white;
          }
        }

        .length {
          position: absolute;
          bottom: 6px;
          right: 8px;
        }
      }

      .name {
        display: block;
        min-width: 233px;
        max-width: 233px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 8px;
        margin-top: 8px;

        .alia {
          display: inline;
          color: #656464;
        }
      }

      .creator {
        max-width: 233px;
        min-width: 233px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #656464;

        span {
          display: inline;
        }
      }

      .clickable:hover {
        font-weight: 500;
      }
    }

    .container-item:nth-child(2n) {
      background-color: #fafafa;
    }

    .container-item:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>