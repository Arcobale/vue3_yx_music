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
                <div class="followstate clickable" @click="changeSubscribe">
                    <svg class="icon" aria-hidden="true" v-if="!isSubscribe">
                        <use xlink:href="#icon-tianjia"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" v-else>
                        <use xlink:href="#icon-icon"></use>
                    </svg>
                    <span v-if="isSubscribe">已</span>收藏
                </div>
                <div class="count">
                    <div class="count-item">单曲数：{{ artist.musicSize }}</div>
                    <div class="count-item">专辑数：{{ artist.albumSize }}</div>
                    <div class="count-item">MV数：{{ artist.mvSize }}</div>
                </div>
            </div>
        </div>

        <div class="nav" @click="changeRoute()">
            <div class="nav-item active clickable" value="album">专辑</div>
            <div class="nav-item clickable" value="mv">MV</div>
            <div class="nav-item clickable" value="detail">歌手详情</div>
            <div class="nav-item clickable" value="simi">相似歌手</div>
        </div>

        <div class="container">
            <router-view :artistId="artistId"></router-view>
        </div>

    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'ArtistHome',

    setup() {
        const store = useStore();
        const router = useRouter();

        const artistId = computed(() => router.currentRoute.value.params.id)

        const userArtistSublistId = computed(() => store.getters.userArtistSublistId);
        const isSubscribe = ref(false);

        onMounted(() => {
            store.dispatch('getArtistSublist');
            store.dispatch('getArtistDetail', { id: artistId.value });
            checkSubscribe();
        })

        function checkSubscribe() {
            if (userArtistSublistId.value.has(parseInt(artistId.value))) {
                isSubscribe.value = true;
            } else {
                isSubscribe.value = false;
            }
        }

        function changeSubscribe() {
            let t = isSubscribe.value ? 0 : 1;
            // 收藏歌手
            store.dispatch('getSubArtist', { t, id: artistId.value }).then(() => {
                // 切换显示状态
                isSubscribe.value = !isSubscribe.value;
            }, (msg) => {
                alert(msg);
            });
        }

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
            isSubscribe,
            artistId,
            artist: computed(() => store.state.artisthome.artistDetail || {}),
            changeRoute,
            changeSubscribe
        }
    }

}
</script>

<style lang="less" scoped>
.artist-home {
    font-size: 12px;

    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        font-weight: 500;
    }

    .icon {
        width: 14px;
        height: 14px;
        fill: #9b9b9b;
        position: relative;
        top: 2px;
    }

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

            .followstate:hover {
                background-color: #edeced;
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
}
</style>