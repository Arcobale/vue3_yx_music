<template>
    <div class="search-video">
        <div class="container">
            <div class="container-item" v-for="item in searchListVideo" :key="item.id" @click="showDetail(item.id)">
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
                <span class="creator">{{ item.artists[0].name }}</span>
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

        function showDetail(mvId) {
            // router.push({
            //     name: 'mv',
            //     params: {
            //         id: mvId
            //     }
            // });
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
            showDetail,
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

            span {
                display: block;
                width: 233px;
                margin-top: 8px;
            }

            span.creator {
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