<template>
  <div class="recent-song"></div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, onMounted, reactive } from 'vue';

export default {

  setup() {
    const store = useStore();

    onMounted(() => {
      const recentSongParams = reactive({
        limit: 100
      })
      store.dispatch('getRecentSong', recentSongParams);
    })

    return {
      recentSong: computed(() => store.state.recent.recentSong),
    }
  }

}
</script>

<style lang="less" scoped>

</style>