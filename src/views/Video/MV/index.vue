<template>
  <div class="mv">
    <div class="wrapper">
      <div class="top">
        <div class="title clickable" @click="changeRoute(`/allmv?area=${curArea}&type=${'全部'}&order=${'最新'}`)">
          最新MV
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>

        <div class="hot-tag">
          <div class="hot-tag-item" v-for="(area, index) in areaList" :key="index" @click="changeArea(1, area)">
            <span class="clickable">{{ area }}</span>
          </div>

        </div>
      </div>

      <div class="container">
        <div class="container-item clickable" v-for="item in MVFirst" :key="item?.id" @click="showMVDetail(item?.id)">
          <div class="mask">
            <div class="count">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-play1"></use>
              </svg>
              {{ fixedCount(item?.playCount) }}
            </div>
          </div>
          <img :src="item?.cover" alt="">
          <span class="name">
            {{ item?.name }}
          </span>
          <div class="creator">
            <span class="clickable" @click="showArtistHome(item?.artists?.[0]?.id)">
              {{ item?.artists?.[0]?.name }}
            </span>
            <span v-if="item?.artists?.length > 1">
              <span v-for="ar in item?.artists?.slice(1)" :key="ar.id">
                / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="wrapper">
      <div class="top">
        <div class="title clickable" @click="changeRoute(`/allmv?area=${'全部'}&type=${'网易出品'}&order=${'最新'}`)">
          网易出品
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>
      </div>

      <div class="container">
        <div class="container-item clickable" v-for="item in MVExclusive" :key="item?.id" @click="showMVDetail(item?.id)">
          <div class="mask">
            <div class="count">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-play1"></use>
              </svg>
              {{ fixedCount(item?.playCount) }}
            </div>
          </div>
          <img :src="item?.cover" alt="">
          <span class="name">
            {{ item?.name }}
          </span>
          <div class="creator">
            <span class="clickable" @click="showArtistHome(item?.artists?.[0]?.id)">
              {{ item?.artists?.[0]?.name }}
            </span>
            <span v-if="item?.artists?.length > 1">
              <span v-for="ar in item?.artists?.slice(1)" :key="ar.id">
                / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'MV',
  setup() {
    const store = useStore();
    const router = useRouter();

    const curArea = ref('内地');
    const areaList = ref(['内地', '港台', '欧美', '日本', '韩国']);

    const MVFirstParams = reactive({
      area: '内地',
      limit: 6,
    });
    const MVExclusiveParams = reactive({
      limit: 6,
      offset: 0,
    });

    const MVFirst = computed(() => store.state.mv.MVFirst);
    const MVExclusive = computed(() => store.state.mv.MVExclusive);

    onMounted(() => {
      store.dispatch('getMVFirst', MVFirstParams);
      store.dispatch('getMVExclusive', MVExclusiveParams);
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

    function fixedCount(num) {
      return num > 99999999 ? parseInt(num / 100000000) + '亿' : num > 99999 ? parseInt(num / 10000) + '万' : num + '';
    }

    function changeRoute(routePath) {
      router.push(routePath);
    }

    function changeArea(type, areaName) {
      // 改变最新MV的area
      if (type === 1) {
        MVFirstParams.area = areaName;
        store.dispatch('getMVFirst', MVFirstParams);
      } else if (type === 2) {
        // 改变MV排行榜的area
        MVTopParams.area = areaName;
        store.dispatch('getMVTop', MVTopParams);
      }
      curArea.value = areaName;

      let curActiveElement = document.querySelector('.activeCat');
      let element = event.target;
      if (curActiveElement) {
        curActiveElement.classList.remove('activeCat');
      }
      element.classList.add('activeCat');
    }

    return {
      curArea,
      areaList,
      showMVDetail,
      showArtistHome,
      fixedCount,
      changeRoute,
      changeArea,
      MVFirst,
      MVExclusive
    }
  }

}
</script>

<style lang="less" scoped>
.mv {
  width: 730px;

  .clickable {
    cursor: pointer;
  }

  .clickable:hover {
    font-weight: 500;
  }

  .wrapper {
    width: 100%;
    font-size: 12px;
    color: #000000;
    margin-bottom: 60px;

    .top {
      height: 28px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 14px;
      text-align: flex-end;

      .title {
        font-size: 16px;
        font-weight: 500;
      }

      .hot-tag {
        width: 280px;
        height: 28px;
        display: flex;
        align-items: center;

        .hot-tag-item {
          box-sizing: border-box;
          border-left: 1px solid #e0e0e0;
          width: 58px;

          span {
            padding: 2px 10px;
            border-radius: 20px;
            margin-left: 4px;
          }
        }

        .hot-tag-item:first-child {
          border-left: none;
        }

        .activeCat {
          color: #c24639;
          background-color: #ffeeeb;
        }
      }
    }

    .container {
      width: 730px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 16px;
      row-gap: 40px;
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
      }

      .container-item:nth-child(2n) {
        background-color: #fafafa;
      }

      .container-item:hover {
        background-color: #f0f0f0;
      }
    }
  }
}
</style>