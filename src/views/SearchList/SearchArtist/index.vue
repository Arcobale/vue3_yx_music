<template>
    <div class="search-artist">
        <div class="container">
            <div class="container-item" v-for="item in searchListArtist" :key="item.id" @click="showArtistHome(item.id)">
                <div class="cover">
                    <img :src="item.img1v1Url" alt="">
                </div>
                <div class="name">
                    {{ item.name }}
                    <span v-if="item.alia">({{ item.alia[0] }})</span>
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
    name: 'SearchArtist',
    setup() {
        const store = useStore();
        const router = useRouter();

        const searchListArtist = computed(() => store.state.search.searchListArtist || []);

        onMounted(() => {

        });

        function showArtistHome(artistId) {
            router.push({
                name: 'artisthome', params: {
                    id: artistId
                }
            })
        }

        return {
            showArtistHome,
            searchListArtist,
        }
    }

}
</script>
  
<style lang="less" scoped>
.search-artist {
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
}

</style>