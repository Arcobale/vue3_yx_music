<template>
    <div class="artist-home">

        <div class="artist-detail">
            <div class="cover">
                <img :src="artist.cover" alt="">
            </div>
            <div class="right">
                <div class="name">{{ artist.name }}</div>
                <div class="alias">
                    <span v-for="(alia, index) in artist.alias" :key="index">{{ alia }}; </span>
                </div>
                <div class="followstate">收藏</div>
                <div class="count">
                    <div class="count-item">单曲数：{{ artist.musicSize }}</div>
                    <div class="count-item">专辑数：{{ artist.albumSize }}</div>
                    <div class="count-item">MV数：{{ artist.mvSize }}</div>
                </div>
            </div>
        </div>

        <div class="nav" @click="changeRoute()">
            <div class="nav-item active" value="album">专辑</div>
            <div class="nav-item" value="mv">MV</div>
            <div class="nav-item" value="detail">歌手详情</div>
            <div class="nav-item" value="simi">相似歌手</div>
        </div>

        <div class="container">
            <router-view :artistId="artistId"></router-view>
        </div>

    </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'ArtistHome',

    setup() {
        const store = useStore();
        const router = useRouter();

        const artistId = computed(() => router.currentRoute.value.params.id)

        onMounted(() => {
            store.dispatch('getArtistDetail', { id: artistId.value });
        });

        function changeRoute() {
            let element = event.target;
            let curActiveElement = document.querySelector('.active');
            let routeName = element.getAttribute('value');
            let routes = router.currentRoute.value.fullPath.split('/');
            routes.pop();
            routes.push(routeName);
            router.push(routes.join('/'));

            element.classList.add('active');
            curActiveElement.classList.remove('active');
        }


        return {
            artistId,
            artist: computed(() => store.state.artisthome.artistDetail || {}),
            changeRoute,
        }
    }

}
</script>

<style lang="less" scoped>
.artist-home {
    font-size: 12px;

    .artist-detail {
        display: flex;

        .cover img {
            width: 200px;
            height: 200px;
            border-radius: 10px;
        }

        .right {
            margin-left: 30px;

            .name {
                font-size: 20px;
                font-weight: 600;
                margin-top: 8px;
            }

            .alias {
                margin-top: 12px;

                span {
                    font-size: 10px;
                    font-weight: 400;
                }
            }

            .followstate {
                width: 80px;
                height: 30px;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                margin: 18px 0;
                text-align: center;
                line-height: 30px;
            }

            .count {
                display: flex;

                .count-item {
                    width: 80px;
                }
            }
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
}</style>