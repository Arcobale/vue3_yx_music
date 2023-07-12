<template>
  <div class="home-songlist">
    <div class="banner">
      <div class="left">
        <img :src="bannerCover.coverImgUrl" :alt="bannerCover.name" style="width: 138px;">
      </div>
      <div class="right">
        <div class="flag">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-user"></use>
          </svg>
          精品歌单
        </div>
        <div class="word">
          <div class="name">{{ bannerCover.name }}</div>
          <div class="desc">{{ bannerCover.description }}</div>
        </div>
      </div>
    </div>

    <div class="breadcrumb" @mouseleave="isOpen = false">
      <div class="category">
        <div class="current-tag clickable" @click="isOpen = true">
          {{ curCat }}
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>
        <div class="hot-tag">
          <div class="hot-tag-item" v-for="item in playListHotTag" :key="item.id" @click="changeCat(item.name)">
            <span class="clickable">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div class="nav" v-if="isOpen">
        <div class="all" @click="changeCat('全部')">
          <span class="clickable">全部歌单</span>
        </div>
        <div class="menu">
          <div class="menu-item" v-for="(key, index) in playListCategories" :key="index">
            <div class="key">{{ key }}</div>
            <ul class="categorytwo">
              <li class="clickable" v-for="(cat, index2) in playListSortedCategories[index]" :key="index2" @click="changeCat(cat.name)">
                {{ cat.name }}
                <span class="hot" v-if="cat.hot">HOT</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="songlist">
      <div v-for="item in playListHQ" :key="item.id" @click="showDetail(item.id)">
        <img :src="item.coverImgUrl" :alt="item.name" class="cover clickable" style="width: 170px; height: 170px;">
        <div class="mask clickable">
          <div class="creator">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-user"></use>
            </svg>
            {{ item.creator.nickname }}
          </div>
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

    <div class="pagination">

    </div>
  </div>
</template>

<script>
import { onMounted, computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'SongList',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isOpen = ref(false);
    const curCat = ref('全部歌单');

    const playListHQParams = reactive({
      order: 'hot',
      cat: '全部',
      limit: 100,
      offset: 0
    })
    const playListHQ = computed(() => store.state.home.playListHQ ? store.state.home.playListHQ : []);

    onMounted(() => {
      store.dispatch('getPlayListHQ', playListHQParams);
      store.dispatch('getPlayListTag');
      store.dispatch('getPlayListHotTag');
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

    function changeCat(cat) {
      playListHQParams.cat = cat;
      store.dispatch('getPlayListHQ', playListHQParams);

      curCat.value = cat === '全部' ? '全部歌单' : cat;
      isOpen.value = false;
      // let curActive = document.querySelector('.active-cat');
      // if (curActive) {
      //   curActive.classList.remove('.active-cat');
      // }
      // console.log(event.target)
      // if (!event.target.classList) {
      //   event.target.classList = [];
      // }
      // event.target.classList.add('.active-cat');
    }

    return {
      isOpen,
      curCat,
      fixedNum,
      playListHQ,
      bannerCover: computed(() => playListHQ.value[0] || {}),
      playListCategories: computed(() => store.state.home.playListCategories || {}),
      playListSortedCategories: computed(() => store.getters.playListSortedCategories || {}),
      playListHotTag: computed(() => store.state.home.playListHotTag || {}),
      showDetail,
      changeCat
    }
  }
}
</script>

<style lang="less" scoped>
.home-songlist {
  font-size: 12px;
  color: #363636;

  .clickable {
    cursor: pointer;
  }

  .clickable:hover {
    color: #c24639;
  }

  .banner {
    width: 740px;
    height: 170px;
    display: flex;
    align-items: center;
    background-color: black;
    padding: 14px;
    box-sizing: border-box;
    border-radius: 10px;

    .left img {
      border-radius: 10px;
    }

    .right {
      margin-left: 8px;

      .flag {
        box-sizing: border-box;
        width: 100px;
        height: 28px;
        border: 1px solid #c89c58;
        border-radius: 20px;
        font-size: 14px;
        line-height: 28px;
        padding-left: 12px;
        color: #c89c58;

        .icon {
          width: 12px;
          height: 12px;
          fill: #c89c58;
        }
      }

      .word {
        margin-top: 20px;
        color: #9e8a64;

        .name {
          font-size: 16px;
          margin-bottom: 10px;
          color: white;
        }

        .desc {
          line-height: 16px;
        }
      }
    }
  }

  .breadcrumb {
    .active-cat {
      color: #c24639;
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
        box-sizing: border-box;
        width: 100px;
        height: 100%;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-size: 14px;
        line-height: 28px;
        padding-left: 14px;
      }
      .current-tag:hover {
        background-color: #edeced;
      }

      .hot-tag {
        width: 600px;
        height: 28px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .hot-tag-item {
          box-sizing: border-box;
          padding: 0 14px;
          border-left: 1px solid #e0e0e0;
        }

        .hot-tag-item:first-child {
          border-left: none;
        }
      }
    }

    .nav {
      width: 740px;
      font-size: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      margin-top: 8px;

      .all {
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;

        span {
          font-size: 14px;
          font-weight: 500;
          margin-left: 16px;
        }
      }

      .all :hover {
        color: #c24639;
      }

      .menu {
        padding: 16px 16px 100px 16px;

        .menu-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 30px;

          .key {
            color: #c3c3c3;
            width: 115px;
            padding: 8px;
          }

          ul {
            display: grid;
            font-weight: 400;
            grid-template-columns: repeat(6, 1fr);

            li {
              display: block;
              width: 95px;
              height: 28px;
              line-height: 28px;
            }


            .hot {
              font-variant-caps: all-small-caps;
              color: #c24639;
            }
          }
        }
      }
    }
  }

  .songlist {
    display: grid;
    width: 740px;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 40px;
    column-gap: 16px;
    margin-top: 14px;

    .icon {
      width: 12px;
      height: 12px;
      fill: white;
    }

    .cover {
      border-radius: 10px;
    }

    .desc {
      line-height: 16px;
    }

    .desc .clickable:hover {
      font-weight: 500;
    }

    .mask {
      height: 170px;
      width: 170px;
      position: absolute;
      transform: translate(0, -100%);
      color: white;
      font-size: 10px;

      .creator {
        position: absolute;
        bottom: 10px;
        left: 10px;
      }

      .playcount {
        position: absolute;
        top: 6px;
        right: 8px;
      }
    }
  }
}
</style>