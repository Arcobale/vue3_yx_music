<template>
    <div id="header">
        <div id="history">
            <el-icon class="back" @click="changeRoute(-1)">
                <ArrowLeft />
            </el-icon>
            <el-icon class="go" @click="changeRoute(1)">
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
            <ul v-else-if="option === 'subscribe'">
                <router-link to="/subscribe/album" class="link" active-class="active">专辑</router-link>
                <router-link to="/subscribe/artist" class="link" active-class="active">歌手</router-link>
                <router-link to="/subscribe/video" class="link" active-class="active">视频</router-link>
            </ul>
            <ul v-else-if="option === 'video'">
                <router-link to="/video/videolist" class="link" active-class="active">视频</router-link>
                <router-link to="/video/mv" class="link" active-class="active">MV</router-link>
            </ul>
            <ul v-else></ul>
        </div>
        <div id="search">
            <div class="searchbox">
                <el-input ref="inputBox" v-model="searchWords" :placeholder="searchDefault" :prefix-icon="Search"
                    @keyup.enter="submitData" @input="suggestWord()" @click="openHotSearchList" />
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
import { ref, computed, onMounted, getCurrentInstance, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Search } from '@element-plus/icons-vue'


export default {
    name: 'Header',
    setup() {
        const router = useRouter();
        const store = useStore();
        const { proxy } = getCurrentInstance();

        const option = computed(() => {
            return router.currentRoute.value.fullPath.split('/')[1];
        });
        const searchWords = ref('');
        const inputBox = ref(null);

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

        function openHotSearchList() {
            // 搜索词为空时才打开热搜列表
            if (!searchWords.value) {
                setTimeout(() => {
                    inputBox.value.focus();
                }, 500);
                proxy.$Mitt.emit('openHotSearchList');
            } else {
                suggestWord();
            }
        }

        function suggestWord() {
            // 搜索词非空时才打开搜索建议
            if (searchWords.value) {
                proxy.$Mitt.emit('closeHotSearchList');
                // 防抖
                let timer = null;
                if (!timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    setTimeout(() => {
                        inputBox.value.focus();
                    }, 500);
                    proxy.$Mitt.emit('openSuggestList', searchWords.value);
                }, 500);
            } else {
                proxy.$Mitt.emit('closeSuggestList');
                setTimeout(() => {
                    inputBox.value.focus();
                }, 500);
                proxy.$Mitt.emit('openHotSearchList');
            }
        }

        function changeRoute(num) {
            router.go(num);
        }

        return {
            inputBox,
            option,
            searchWords,
            searchDefault: computed(() => store.state.search.searchDefault),
            Search,
            submitData,
            openHotSearchList,
            suggestWord,
            changeRoute
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
    -webkit-app-region: drag;

    #history {
        width: 200px;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .el-icon {
            margin: 0 10px;
            cursor: pointer;
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
        z-index: 40;

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
                z-index: 101;
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