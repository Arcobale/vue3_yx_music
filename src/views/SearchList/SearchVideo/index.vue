<template>
    <div class="search-video">
        <div class="container">
            <div class="container-item clickable" v-for="item in searchListVideo" :key="item.id"
                @click="showMVDetail(item.id)">
                <img :src="item.cover" alt="">
                <div class="mask">
                    <div class="count">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-play1"></use>
                        </svg>
                        {{ fixedCount(item.playCount) }}
                    </div>
                    <div class="length">{{ toSongLen(item.duration) }}</div>
                </div>
                <span class="name">{{ item.name }}</span>
                <div class="creator">
                    <span class="clickable" @click="showArtistHome(item.artists[0].id)">{{ item?.artists?.[0]?.name
                    }}</span>
                    <span v-if="item?.artists?.length > 1">
                        <span v-for="ar in item?.artists?.slice(1)" :key="ar.id">
                            / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
                        </span>
                    </span>
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
    name: 'SearchVideo',
    setup() {
        const store = useStore();
        const router = useRouter();

        const searchListVideo = computed(() => store.state.search.searchListVideo || []);

        onMounted(() => {

        });

        function showMVDetail(mvId) {
            // router.push({
            //     name: 'mv',
            //     params: {
            //         id: mvId
            //     }
            // });
        }

        function showArtistHome(artistId) {
            router.push({
                name: 'artisthome', params: {
                    id: artistId
                }
            })
        }

        function fixedCount(num) {
            return num > 99999999 ? parseInt(num / 100000000) + '亿' : num > 99999 ? parseInt(num / 10000) + '万' : num + '';
        }

        function toSongLen(ms) {
            let second = Math.round(ms / 1000);
            let minute = parseInt(second / 60);
            second = second % 60;
            let res = '';

            res += minute < 10 ? '0' + minute : '' + minute;
            res += ':';
            res += second < 10 ? '0' + second : '' + second;
            return res;
        }

        return {
            showMVDetail,
            showArtistHome,
            toSongLen,
            fixedCount,
            searchListVideo,
        }
    }

}
</script>
  
<style lang="less" scoped>
.search-video {
    font-size: 14px;

    .clickable {
        cursor: pointer;
    }

    .container {
        width: 730px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 16px;
        row-gap: 38px;

        .container-item {
            img {
                width: 233px;
                height: 130px;
                border-radius: 10px;
            }

            .mask {
                width: 233px;
                height: 130px;
                background-color: transparent;
                position: absolute;
                transform: translate(0, -100%);
                color: white;

                .count {
                    position: absolute;
                    top: 6px;
                    right: 8px;

                    .icon {
                        width: 12px;
                        height: 12px;
                        fill: white;
                    }
                }

                .length {
                    position: absolute;
                    bottom: 6px;
                    right: 8px;
                }
            }

            .name {
                display: block;
                min-width: 233px;
                max-width: 233px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 8px;
                margin-top: 8px;

                .alia {
                    display: inline;
                    color: #656464;
                }
            }

            .creator {
                max-width: 233px;
                min-width: 233px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: #656464;

                span {
                    display: inline;
                }
            }

            .clickable:hover {
                font-weight: 500;
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