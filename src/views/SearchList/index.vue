<template>
    <div class="search-list">
        <div class="result">
            {{ searchListParams.keywords }}
            <span v-if="searchListParams.type === 1">找到 {{ count }} 首单曲</span>
            <span v-else-if="searchListParams.type === 100">找到 {{ count }} 位歌手</span>
            <span v-else-if="searchListParams.type === 10">找到 {{ count }} 张专辑</span>
            <span v-else-if="searchListParams.type === 1000">找到 {{ count }} 个歌单</span>
            <span v-else>找到 {{ count }} 个视频</span>
        </div>

        <div class="nav" @click="changeRoute()">
            <div class="nav-item active" value="song" type="1">单曲</div>
            <div class="nav-item" value="artist" type="100">歌手</div>
            <div class="nav-item" value="album" type="10">专辑</div>
            <div class="nav-item" value="video" type="1004">视频</div>
            <div class="nav-item" value="playlist" type="1000">歌单</div>
        </div>

        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'SearchList',
    setup() {
        const store = useStore();
        const router = useRouter();
        
        // type值意义
        // 1:单曲，10:专辑，100:歌手，1000:歌单，1004:MV，1014:视频
        const searchListParams = reactive({
            keywords: router.currentRoute.value.params.keyword,
            limit: 30,
            offset: 0,
            type: 1,
        })

        onMounted(() => {
            getData();
        });

        function getData() {
            store.dispatch('getSearchList', searchListParams);
        }

        function changeRoute() {
            let element = event.target;
            let curActiveElement = document.querySelector('.active');
            let routeName = element.getAttribute('value');
            let type = element.getAttribute('type');

            element.classList.add('active');
            curActiveElement.classList.remove('active');

            searchListParams.type = parseInt(type);
            getData();

            let routes = router.currentRoute.value.fullPath.split('/');
            routes.pop();
            routes.push(routeName);
            router.push(routes.join('/'));
        }

        return {
            searchListParams,
            changeRoute,
            count: computed(() => store.state.search.count),
        }
    }

}
</script>

<style lang="less" scoped>
.search-list {
    font-size: 12px;

    .result {
        font-size: 22px;
        font-weight: 600;
        span {
            font-size: 12px;
            font-weight: 400;
        }
    }

    .nav {
        height: 30px;
        width: 730px;
        border-bottom: 1px solid #e0e0e0;
        margin-top: 30px;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
        div {
            height: 100%;
            margin-right: 30px;
            line-height: 30px;
        }
        .active {
            color: #af0900;
            border-bottom: 2px solid #af0900;
        }
    }
    .container {
        font-size: 12px;
        margin-top: 20px;
    }
}
</style>