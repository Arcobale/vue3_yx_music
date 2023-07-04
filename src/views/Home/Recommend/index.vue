<template>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="item in 8" :key="item">
      <div text="2xl" justify="center">{{ item }}</div>
    </el-carousel-item>
  </el-carousel>
  <div class="recommend-songlist">
    <div class="title">
      推荐歌单
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
    <div class="container">
      <div v-for="item in 10" :key="item">
        <img src="" alt="hello world." class="cover" style="weight: 134px; height: 134px;">
        <div>hello world.</div>
      </div>
    </div>
  </div>
  独家放送
  最新音乐
  推荐MV
  播客
  LOOK直播
</template>

<script>
import { onMounted, reactive, toRefs, computed } from 'vue';
import { useStore } from 'vuex';
// import { useRouter } from 'vue-router';

export default {
  setup() {
    const limit = 10;
    // const router = useRouter();
    const store = useStore();
    const state = reactive({
      personalizedList: []
    })
    console.log(store)

    onMounted(() => {
        // state.personalizedList = store.state.home.personalizedList;
        store.dispatch("getPersonalizedList", {limit});
    })

    return {
      store,
      ...toRefs(state),
      personalizedList: computed(() => store.state.home.personalizedList)
    }
  }
}
</script>

<style lang="less" scoped>
.el-carousel__item div {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.recommend-songlist {
  font-size: 14px;

  .title {
    font-size: 16px;
  }

  .container {
    border: 1px solid red;
    width: 740px;
    height: 400px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 2;

    column-gap: 14px;
    row-gap: 36px;
    place-items: center center;
  }
}
</style>