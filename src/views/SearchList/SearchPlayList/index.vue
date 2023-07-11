<template>
    <div class="search-playlist">
        <div class="container">
            <div class="container-item" v-for="item in searchListPlayList" :key="item.id" @click="showDetail(item.id)">
                <div class="cover">
                    <img :src="item.coverImgUrl" alt="">
                </div>
                <div class="name">
                    {{ item.name }}
                </div>
                <div class="count">
                    {{ item.trackCount }}首
                </div>
                <div class="creator">
                    by {{ item.creator.nickname }}
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'SearchPlayList',
    setup() {
        const store = useStore();
        const router = useRouter();

        const searchListPlayList = computed(() => store.state.search.searchListPlayList || []);

        onMounted(() => {

        });

        function showDetail(playListId) {
            router.push({
                name: 'playlist',
                params: {
                    id: playListId
                }
            });
        }

        return {
            showDetail,
            searchListPlayList,
        }
    }

}
</script>
  
<style lang="less" scoped>
.search-playlist {
    font-size: 14px;

    .container {
        .container-item {
            height: 80px;
            display: flex;
            align-items: center;

            .cover img {
                width: 58px;
                height: 58px;
                border-radius: 5px;
            }

            .name {
                margin-left: 10px;
                width: 440px;
            }

            .count {
                width: 110px;
                color: #656464;
            }
            .creator {
                color: #656464;
            }
        }

        .container-item:nth-child(2n) {
            background-color: #fafafa;
        }

        .container-item:hover {
            background-color: #f0f0f0;
        }
    }
}
</style>