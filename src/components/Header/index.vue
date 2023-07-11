<template>
    <div id="header">
        <div id="history">
            <el-icon class="back">
                <ArrowLeft />
            </el-icon>
            <el-icon class="go">
                <ArrowRight />
            </el-icon>
        </div>
        <div id="tab">
            <ul v-if="option === 'home'">
                <router-link to="/home/recommend" class="link" active-class="active">个性推荐</router-link>
                <router-link to="/home/songlist" class="link" active-class="active">歌单</router-link>
                <router-link to="/home/rank" class="link" active-class="active">排行榜</router-link>
                <router-link to="/home/artist" class="link" active-class="active">歌手</router-link>
                <router-link to="/home/newmusic" class="link" active-class="active">最新音乐</router-link>
            </ul>
            <ul v-else-if="option === 'collection'">
                <router-link to="/collection/album" class="link" active-class="active">专辑</router-link>
                <router-link to="/collection/singer" class="link" active-class="active">歌手</router-link>
                <router-link to="/collection/video" class="link" active-class="active">视频</router-link>
            </ul>
            <ul v-else-if="option === 'video'">
                <router-link to="/video/videolist" class="link" active-class="active">视频</router-link>
                <router-link to="/video/mv" class="link" active-class="active">MV</router-link>
            </ul>
            <ul v-else></ul>
        </div>
        <div id="search">
            <div class="searchbox">
                <el-input v-model="searchWords" :placeholder="searchDefault" :prefix-icon="Search"
                    @keyup.enter="submitData" />
            </div>
            <el-icon>
                <Setting />
            </el-icon>
            <el-icon>
                <Message />
            </el-icon>
            <el-icon>
                <GoodsFilled />
            </el-icon>
            <el-icon>
                <CopyDocument />
            </el-icon>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Search } from '@element-plus/icons-vue'


export default {
    name: 'Header',
    setup() {
        const router = useRouter();
        const store = useStore();
        const option = computed(() => {
            return router.currentRoute.value.fullPath.split('/')[1];
        });

        const searchWords = ref('');

        onMounted(() => {
            store.dispatch('getSearchDefault');
        })

        function submitData() {
            router.push({
                name: 'searchlist', params: {
                    keyword: searchWords.value
                }
            });
        }

        return {
            option,
            searchWords,
            searchDefault: computed(() => store.state.search.searchDefault),
            Search,
            submitData,
        }
    }
}



</script>

<style lang="less" scoped>
#header {
    background: #d74d45;
    color: #f2c5c2;
    height: 50px;
    width: 100%;
    display: flex;

    #history {
        width: 200px;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .el-icon {
            margin: 0 10px;
        }
    }

    #tab {
        flex: 1;
        font-size: 12px;
        height: 100%;

        ul {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            line-height: 50px;

            .link {
                margin-left: 20px;
                color: #f2c5c2;
                text-decoration: none;
            }

            .active {
                color: #ffffff;
                font-size: 14px;
            }
        }
    }

    #search {
        width: 320px;
        height: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        .searchbox {
            // background-color: rgba(209, 113, 104, 0.6);
            // background-color: rgb(209 113 104 / 100%);
            // background-color: #d17168;
            border-radius: 100px;
            color: blue;

            :deep(.el-input__wrapper) {
                font-size: 12px;
                width: 145px;
                height: 22px;
                border-radius: 100px;
                // background-color: transparent;
                background-color: rgba(209, 113, 104, 0.9);
                border: 0px;
                box-shadow: 0 0 0 0;
            }

            :deep(.el-input__inner) {
                color: #f7e6e5;
            }

            :deep(.el-input__inner::placeholder) {
                color: #f5d3d1;
            }
        }
    }
}
</style>