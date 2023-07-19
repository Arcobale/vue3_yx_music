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
            <div class="nav-item active clickable" value="song" type="1">单曲</div>
            <div class="nav-item clickable" value="artist" type="100">歌手</div>
            <div class="nav-item clickable" value="album" type="10">专辑</div>
            <div class="nav-item clickable" value="video" type="1004">视频</div>
            <div class="nav-item clickable" value="playlist" type="1000">歌单</div>
        </div>

        <div class="container">
            <router-view></router-view>
        </div>

        <div class="pagination" v-if="pageCount > 1">
            <el-pagination background layout="prev, pager, next" :page-count="pageCount" pager-count="9"
                v-model:current-page="currentPage" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'SearchList',
    setup() {
        const store = useStore();
        const router = useRouter();

        const count = computed(() => store.state.search.count);
        const pageCount = ref(0);
        const currentPage = ref(1);
        
        // type值意义
        // 1:单曲，10:专辑，100:歌手，1000:歌单，1004:MV，1014:视频
        const searchListParams = reactive({
            keywords: router.currentRoute.value.params.keyword,
            limit: 100,
            offset: 0,
            type: 1,
        })

        onMounted(() => {
            getData();
        });

        function getData() {
            store.dispatch('getSearchList', searchListParams).then(() => {
                pageCount.value = Math.ceil(count.value / searchListParams.limit);
            });
        }

        function changeRoute() {
            let element = event.target;
            let curActiveElement = document.querySelector('.active');
            let routeName = element.getAttribute('value');
            let type = element.getAttribute('type');

            element.classList.add('active');
            curActiveElement.classList.remove('active');

            searchListParams.type = parseInt(type);
            searchListParams.offset = 0;
            currentPage.value = 1;
            if (type == 1) {
                searchListParams.limit = 100;
            } else if (type == 10 || type == 1000) {
                searchListParams.limit = 20;
            } else if (type == 1004) {
                searchListParams.limit = 21;
            }
            getData();

            let routes = router.currentRoute.value.fullPath.split('/');
            routes.pop();
            routes.push(routeName);
            router.push(routes.join('/'));
        }


        function handleCurrentChange(val) {
            searchListParams.offset = (val - 1) * searchListParams.limit;
            getData();
        }

        return {
            pageCount,
            currentPage,
            searchListParams,
            changeRoute,
            count,
            handleCurrentChange
        }
    }

}
</script>

<style lang="less" scoped>
.search-list {
    font-size: 12px;
    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        font-weight: 500;
    }

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


    .pagination {
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }
}
</style>