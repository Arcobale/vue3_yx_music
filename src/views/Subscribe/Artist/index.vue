<template>
    <div class="subscribe-artist">
        <span class="title">收藏的歌手<span class="count">（{{ userArtistSubCount }}）</span></span>
        <div class="container">
            <div class="container-item clickable" v-for="item in userArtistSublist" :key="item.id"
                @click="showArtistHome(item.id)">
                <div class="cover">
                    <img :src="item.img1v1Url" alt="">
                </div>
                <div class="name">
                    {{ item.name }}
                    <span v-if="item.alias.length > 0">({{ item.alias[0] }})</span>
                    <span v-else-if="item.trans">({{ item.trans }})</span>
                </div>
                <div class="albumcount">
                    专辑：{{ item.albumSize }}
                </div>
                <div class="mvcount">
                    MV：{{ item.mvSize }}
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
    name: 'SubscribeArtist',
    setup() {
        const store = useStore();
        const router = useRouter();

        const userArtistSublist = computed(() => store.state.user.userArtistSublist || []);
        const userArtistSubCount = computed(() => store.state.user.userArtistSubCount);

        onMounted(() => {
            store.dispatch('getUserArtistSublist', { timestamp: new Date().getTime() });
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
            userArtistSublist,
            userArtistSubCount
        }
    }

}
</script>

<style lang="less" scoped>
.subscribe-artist {
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
                width: 410px;

                span {
                    color: #696969;
                }
            }

            .albumcount {
                width: 180px;
                font-size: 10px;
                color: #696969;
            }

            .mvcount {
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