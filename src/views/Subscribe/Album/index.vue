<template>
    <div class="subscribe-album">
        <span class="title">收藏的专辑<span class="count">（{{ userAlbumSubCount }}）</span></span>
        <div class="container">
            <div class="container-item clickable" v-for="item in userAlbumSublist" :key="item.id"
                @click="showDetail(item.id)">
                <div class="cover">
                    <img :src="item.picUrl" alt="">
                </div>
                <div class="name">
                    {{ item?.name }}
                </div>
                <div class="artist">
                    <span class="clickable" @click="showArtistHome(item.artists[0].id)">{{ item?.artists?.[0]?.name
                    }}</span>
                    <span v-if="item?.artists?.length > 1">
                        <span v-for="ar in item?.artists?.slice(1)" :key="ar.id">
                            / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
                        </span>
                    </span>
                </div>
                <div class="size">
                    {{ item?.size }}首
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
    name: 'SubscribeAlbum',
    setup() {
        const store = useStore();
        const router = useRouter();

        const userAlbumSublist = computed(() => store.state.user.userAlbumSublist || []);
        const userAlbumSubCount = computed(() => store.state.user.userAlbumSubCount);

        onMounted(() => {
            store.dispatch('getUserAlbumSublist', { limit: 10000, offset: 0 });
        });

        function showDetail(albumId) {
            router.push({
                name: 'albumlist',
                params: {
                    id: albumId
                }
            });
        }

        function showArtistHome(artistId) {
            router.push({
                name: 'artisthome', params: {
                    id: artistId
                }
            })
        }

        return {
            showDetail,
            showArtistHome,
            userAlbumSubCount,
            userAlbumSublist,
        }
    }

}
</script>

<style lang="less" scoped>
.subscribe-album {
    font-size: 12px;

    .clickable {
        cursor: pointer;
    }

    .title {
        font-weight: 600;

        .count {
            font-size: 10px;
            font-weight: 400;
            color: #696969;
        }
    }

    .container {
        margin-top: 16px;

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
                width: 400px;
            }

            .artist {
                font-size: 10px;
                width: 210px;
                span {
                    color: #696969;
                }
            }

            .size {
                font-size: 10px;
                color: #696969;
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