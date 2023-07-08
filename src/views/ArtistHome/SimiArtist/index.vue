<template>
  <div class="simiartist">
    该模块需登录！
  </div>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'SimiArtist',
  props: ['artistId'],
  setup(props) {
    const store = useStore();
    const router = useRouter();

    onMounted(() => {
      // store.dispatch('getSimiArtist', { id: props.artistId || router.currentRoute.value.params.id }); // 301，需登录
    })

    return {
      simiArtist: computed(() => store.state.artisthome.simiArtist || {}),
    }
  }
}
</script>
  
<style lang="less" scoped></style>