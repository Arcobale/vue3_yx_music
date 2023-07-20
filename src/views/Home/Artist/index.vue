<template>
  <div class="artist">
    <div class="breadcrumb">
      <div class="category-area">
        <div class="key">
          语种：
        </div>
        <ul class="value" @click="changeArea">
          <li class="active clickable" value="-1">全部</li>
          <li class="clickable" value="7">华语</li>
          <li class="clickable" value="96">欧美</li>
          <li class="clickable" value="8">日本</li>
          <li class="clickable" value="16">韩国</li>
          <li class="clickable" value="0">其他</li>
        </ul>
      </div>
      <div class="category-type">
        <div class="key">
          分类：
        </div>
        <ul class="value" @click="changeType">
          <li class="active clickable" value="-1">全部</li>
          <li class="clickable" value="1">男歌手</li>
          <li class="clickable" value="2">女歌手</li>
          <li class="clickable" value="3">乐队组合</li>
        </ul>
      </div>
      <div class="category-initial">
        <div class="key">
          筛选：
        </div>
        <ul class="value" @click="changeInitial">
          <li class="active clickable" value="-1">热门</li>
          <li class="clickable" :value="initial.charCodeAt()" v-for="(initial, index) in initialList" :key="index">{{ initial }}</li>
          <li class="clickable" value="0">#</li>
        </ul>
      </div>
    </div>
    <div class="container" v-infinite-scroll="loadRestData" infinite-scroll-delay="50">
      <div class="singer-item" v-for="item in artistList" :key="item.id" @click="showArtistHome(item.id)">
        <div class="cover clickable">
          <img :src="item.img1v1Url" alt="" style="width: 134px; height: 134px;">
        </div>
        <div class="desc clickable">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'

export default {
  name: 'Artist',
  setup() {
    const store = useStore();
    const router = useRouter();

    const initialList = reactive([]);
    const artistListParams = reactive({
      limit: 30,
      offset: 0,
      type: -1,
      area: -1,
      initial: -1,
    })
    let loadCount = 1;
    const artistList = ref([]);

    onMounted(() => {
      produceInitialList();
      getData();
    })

    function produceInitialList() {
      for (let i = 0; i < 26; i++) {
        initialList.push(String.fromCharCode(65 + i));
      }
    }

    function getData() {
      store.dispatch('getArtistList', artistListParams).then(() => {
        // 每滑动触底请求一次就向列表数据中拼接
        artistList.value = artistList.value.concat(store.state.home.artistList);
      });
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

    function changeInitial(e) {
      let code = parseInt(e.target.value);
      if (code > 0) {
        artistListParams.initial = String.fromCharCode(code + 32);
      } else {
        artistListParams.initial = code;
      }
      let curActiveElement = document.querySelector('.category-initial .active');
      curActiveElement.classList.remove('active');
      e.target.classList.add('active');
      getData();
    }

    function showArtistHome(artistId) {
      router.push({
        name: 'artisthome', params: {
          id: artistId
        }
      })
    }

    function loadRestData() {
      loadCount++;
      artistListParams.offset = 30 * (loadCount - 1);
      getData();
    }

    return {
      initialList,
      changeArea,
      changeType,
      changeInitial,
      showArtistHome,
      loadRestData,
      artistList,
    }
  }
}
</script>

<style lang="less" scoped>
.artist {
  .clickable {
    cursor: pointer;
  }

  ul .clickable:hover {
    font-weight: 500;
  }

  img {
    border-radius: 5px;
  }

  .breadcrumb {
    font-size: 10px;
    line-height: 18px;

    .category-area,
    .category-type,
    .category-initial {
      display: flex;
      margin-bottom: 14px;

      .key {
        font-weight: 600;
        width: 36px;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        font-weight: 400;
        width: 720px;

        li {
          display: block;
          width: 64px;
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
    .category-initial {
      li {
        margin-bottom: 14px;
      }
    }
  }

  .container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 18px;
    row-gap: 40px;
    font-size: 12px;
    height: 500px;
    overflow: auto;

    .singer-item {
      .desc {
        margin-top: 8px;
        margin-left: 2px;
        font-weight: 400;
      }

      .desc .clickable:hover {
        font-weight: 500;
      }
    }
  }
}
</style>