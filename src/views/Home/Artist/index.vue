<template>
  <div class="artist">
    <div class="breadcrumb">
      <div class="category-area">
        <div class="key">
          语种：
        </div>
        <ul class="value" @click="changeArea">
          <li class="active" value="-1">全部</li>
          <li value="7">华语</li>
          <li value="96">欧美</li>
          <li value="8">日本</li>
          <li value="16">韩国</li>
          <li value="0">其他</li>
        </ul>
      </div>
      <div class="category-type">
        <div class="key">
          分类：
        </div>
        <ul class="value" @click="changeType">
          <li class="active" value="-1">全部</li>
          <li value="1">男歌手</li>
          <li value="2">女歌手</li>
          <li value="3">乐队组合</li>
        </ul>
      </div>
    </div>
    <div class="container">
      <div class="singer-item" v-for="item in artistList" :key="item.id">
        <div class="cover">
            <img :src="item.img1v1Url" alt="" style="width: 134px; height: 134px;">
          </div>
          <div class="desc">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Artist',
  setup() {
    const store = useStore();
    const artistListParams = reactive({
      limit: 30,
      offset: 0,
      type: -1,
      area: -1
    })

    onMounted(() => {
      getData();
    })

    function getData() {
      store.dispatch('getArtistList', artistListParams);
    }

    function changeArea(e) {
      artistListParams.area = parseInt(e.target.value);
      let curActiveElement = document.querySelector('.category-area .active');
      curActiveElement.classList.remove('active');
      e.target.classList.add('active');
      getData();
    }

    function changeType(e) {
      artistListParams.type = parseInt(e.target.value);
      let curActiveElement = document.querySelector('.category-type .active');
      curActiveElement.classList.remove('active');
      e.target.classList.add('active');
      getData();
    }

    return {
      changeArea,
      changeType,
      ...toRefs(artistListParams),
      artistList: computed(() => store.state.home.artistList),
    }
  }
}
</script>

<style lang="less" scoped>
.artist {
  img {
    border-radius: 5px;
  }
  .breadcrumb {
    font-size: 10px;
    line-height: 18px;
    .category-area, .category-type {
      display: flex;
      margin-bottom: 14px;
      .key {
        font-weight: 600;
      }
      ul {
        display: flex;
        justify-content: space-evenly;
        font-weight: 400;
        li {
          display: block;
          width: 76px;
          box-sizing: border-box;
          text-align: center;
          border-left: 1px solid #e0e0e0;
        }
        li:first-child {
          border-left: none;
        }
        .active {
          font-weight: 600;
          color: #c24639;
        }
      }
    }
  }
  .container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 18px;
    row-gap: 40px;
    font-size: 12px;
    margin-top: 16px;

    .singer-item {
      .desc {
        margin-top: 8px;
        margin-left: 2px;
        font-weight: 400;
      }
    }
  }
}
</style>