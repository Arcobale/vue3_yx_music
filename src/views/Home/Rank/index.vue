<template>
  <div class="rank">
    <div class="hot-list">
      <div class="title">
        官方榜
      </div>
      <div class="container">
        <div class="container-item" v-for="item in topList.slice(0, 4)" :key="item.id">
          <div class="cover clickable" @click="showDetail(item.id)">
            <img :src="item.coverImgUrl" alt="" style="width: 170px; height: 170px;">
            <div class="mask">
              <div class="frequency">
                {{ item.updateFrequency }}
              </div>
            </div>
          </div>
          <SongTop :rankId="item.id"></SongTop>
        </div>
      </div>
    </div>
    <div class="all-list">
      <div class="title">
        全球榜
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
      <div class="container">
        <div class="container-item" v-for="item in topList.slice(4)" :key="item.id" @click="showDetail(item.id)">
          <div class="cover clickable">
            <img :src="item.coverImgUrl" alt="" style="width: 170px;">
          </div>
          <div class="mask clickable">
            <div class="playcount">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-play1"></use>
              </svg>
              {{ fixedNum(item.playCount) }}
            </div>
          </div>
          <div class="desc clickable">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SongTop from './SongTop'

export default {
  name: 'Rank',

  components: {
    SongTop
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    onMounted(() => {
      store.dispatch('getTopList');
    })

    function fixedNum(num) {
      return num > 99999999 ? parseInt(num / 100000000) + '亿' : num > 99999 ? parseInt(num / 10000) + '万' : num + '';
    }

    function showDetail(playListId) {
      router.push({
        name: 'playlist',
        params: {
          id: playListId
        }
      });
    }

    return {
      fixedNum,
      showDetail,
      topList: computed(() => store.state.home.topList || {})
    }
  }
}
</script>

<style lang="less" scoped>
.rank {

  .clickable {
    cursor: pointer;
  }

  img {
    border-radius: 10px;
  }

  .icon {
    width: 12px;
    height: 12px;
    fill: white;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .hot-list {
    .container {
      .container-item {
        margin: 30px 0;
        display: flex;

        .mask {
          height: 170px;
          width: 170px;
          position: absolute;
          transform: translate(0, -100%);
          color: white;
          font-size: 10px;

          .frequency {
            position: absolute;
            top: 110px;
            left: 50%;
            transform: translate(-50%, 0);
          }
        }
      }
    }
  }

  .all-list {

    .container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      row-gap: 50px;
      font-size: 12px;

      .container-item {
        .mask {
          height: 170px;
          width: 170px;
          position: absolute;
          transform: translate(0, -100%);
          color: white;
          font-size: 10px;

          .playcount {
            position: absolute;
            top: 6px;
            right: 6px;
          }
        }

        .desc {
          margin-top: 8px;
        }

        .desc .clickable:hover {
          font-weight: 500;
        }
      }
    }
  }
}
</style>