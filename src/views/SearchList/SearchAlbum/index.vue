<template>
    <div class="search-album">
        <div class="container">
            <div class="container-item clickable" v-for="item in searchListAlbum" :key="item.id" @click="showDetail(item.id)">
                <div class="cover">
                    <img :src="item.picUrl" alt="">
                </div>
                <div class="name">
                    {{ item.name }}
                </div>
                <div class="artist">
                    {{ item.artist.name }}
                    <span v-if="item.artist.alia.length !== 0">({{ item.artist.alia[0] }})</span>
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
    name: 'SearchAlbum',
    setup() {
        const store = useStore();
        const router = useRouter();

        const searchListAlbum = computed(() => store.state.search.searchListAlbum || []);

        onMounted(() => {

        });

        function showDetail(albumId) {
            router.push({
                name: 'albumlist',
                params: {
                    id: albumId
                }
            });
        }

        return {
            showDetail,
            searchListAlbum,
        }
    }

}
</script>
  
<style lang="less" scoped>
.search-album {
    font-size: 14px;
    .clickable {
        cursor: pointer;
    }
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
                width: 340px;
            }

            .artist {

                span {
                    color: #656464;
                }
            }
        }

        .container-item:nth-child(2n) {
            background-color: #fafafa;
        }

        .container-item:hover {
            background-color: #f0f0f0;
        }
    }
}</style>