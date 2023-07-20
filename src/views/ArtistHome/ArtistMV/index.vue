<template>
  <div class="artistmv">
    <div class="mv-item" v-for="item in artistMV" :key="item.id" @click="showMVDetail(item.id)">
      <img :src="item.imgurl16v9" alt="">
      <div class="mask">
        <span class="count">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-play1"></use>
          </svg>
          {{ fixedCount(item.playCount) }}
        </span>
        <span class="length">{{ toSongLen(item.duration) }}</span>
      </div>
      <div class="title">{{ item.name }}</div>
    </div>
  </div>
</template>
  
<script>
import { computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'ArtistMV',
  props: ['artistId'],
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const artistMVParams = reactive({
      id: props.artistId || router.currentRoute.value.params.id,
      limit: 50,
      offset: 0
    })

    onMounted(() => {
      store.dispatch('getArtistMV', artistMVParams);
    })

    function showMVDetail(mvId) {
      // router.push({
      //     name: 'mv',
      //     params: {
      //         id: mvId
      //     }
      // });
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
      artistMV: computed(() => store.state.artisthome.artistMV || {}),
      fixedCount,
      toSongLen
    }
  }


}
</script>
  
<style lang="less" scoped>
.artistmv {
  width: 730px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 15px;
  row-gap: 30px;

  .mv-item {
    font-size: 12px;

    img {
      height: 130px;
      width: 230px;
      border-radius: 10px;
    }

    .mask {
      color: white;
      height: 130px;
      width: 230px;
      background-color: transparent;
      position: absolute;
      transform: translate(0, -100%);

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

    .title {
      height: 25px;
      line-height: 25px;
      color: black;
      min-width: 230px;
      max-width: 230px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>