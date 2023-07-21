<template>
  <div class="subscribe-video">
    <span class="title">收藏的视频<span class="count">（{{ userMVSubCount }}）</span></span>
    <div class="container">
      <div class="container-item clickable" v-for="item in userMVSublist" :key="item.vid" @click="showMVDetail(item.vid)">
        <img :src="item?.coverUrl" alt="">
        <div class="mask">
          <div class="count">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-play1"></use>
            </svg>
            {{ fixedCount(item?.playTime) }}
          </div>
          <div class="length">{{ toSongLen(item?.durationms) }}</div>
        </div>
        <span class="name">
          {{ item?.title }}
          <span class="alia" v-if="item?.aliaName">（{{ item?.aliaName }}）</span>
        </span>
        <!-- MV -->
        <div class="creator" v-if="item.type === 0">
          <span class="clickable" @click="showArtistHome(item.creator[0].userId)">{{ item?.creator?.[0]?.userName
          }}</span>
          <span v-if="item?.creator?.length > 1">
            <span v-for="ar in item?.creator?.slice(1)" :key="ar.userId">
              / <span class="clickable" @click="showArtistHome(ar.userId)">{{ ar.userName }}</span>
            </span>
          </span>
        </div>
        <!-- 视频 -->
        <div class="creator" v-if="item.type === 1">
          <span class="clickable" @click="showUserHome(item.creator[0].userId)">by {{ item?.creator?.[0]?.userName
          }}</span>
          <span v-if="item?.creator?.length > 1">
            <span v-for="ar in item?.creator?.slice(1)" :key="ar.userId">
              / <span class="clickable" @click="showUserHome(ar.userId)">{{ ar.userName }}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'SubscribeVideo',
  setup() {
    const store = useStore();
    const router = useRouter();

    const userMVSublist = computed(() => store.state.user.userMVSublist || []);
    const userMVSubCount = computed(() => store.state.user.userMVSubCount);

    onMounted(() => {
      store.dispatch('getUserMVSublist');
    });

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
      showMVDetail,
      showArtistHome,
      showUserHome,
      toSongLen,
      fixedCount,
      userMVSublist,
      userMVSubCount
    }
  }

}
</script>

<style lang="less" scoped>
.subscribe-video {
  font-size: 12px;

  .clickable {
    cursor: pointer;
  }

  .title {
    font-weight: 600;

    .count {
      font-size: 10px;
      font-weight: 400;
      color: #696969;
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
        transform: translate(0, -100%);
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