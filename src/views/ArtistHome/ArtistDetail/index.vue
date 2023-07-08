<template>
  <div class="artistdetail">
    <div class="detail-item" v-for="(item,index) in artistDesc" :key="index">
      <div class="detail-key">
        {{ item.ti }}
      </div>
      <div class="detail-value">
        {{ item.txt }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'ArtistDetail',
    props: ['artistId'],
    setup(props) {
      const store = useStore();
      const router = useRouter();

      onMounted(() => {
        store.dispatch('getArtistDesc', {id: props.artistId || router.currentRoute.value.params.id});
      })

      return {
        artistDesc: computed(() => store.state.artisthome.artistDesc),
      }
    }
    

}
</script>

<style lang="less" scoped>
.artistdetail {
  .detail-item {
    .detail-key {
      font-size: 14px;
      color: black;
      margin: 18px 0;
    }
    .detail-value {
      font-size: 12px;
      color: #a0a0a0;
      line-height: 24px;
      white-space: pre-line;
    }
  }
}
</style>