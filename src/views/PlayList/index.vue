<template>
    <div class="playlist">
        <!-- <audio :src="songUrl"></audio> -->
        <div class="playlist-detail">
            <img :src="playListDetail.coverImgUrl" alt="">
            <div class="right">
                <div class="name">
                    {{ playListDetail.name }}
                </div>
                <div class="creator">
                    <img :src="playListDetail.creator ? playListDetail.creator.avatarUrl : ''" alt="">
                    {{ playListDetail.creator ? playListDetail.creator.nickname : '' }}
                </div>
                <div class="func">
                    <div class="playall">播放全部</div>
                    <div class="collect">收藏</div>
                    <div class="share">分享</div>
                    <div class="downloadall">下载全部</div>
                </div>
                <div class="count">
                    <div class="trackcount">
                        <span>歌曲数：</span>{{ playListDetail.trackCount }}
                    </div>
                    <div class="playcount">
                        <span>播放数：</span>{{ playListDetail.playCount }}
                    </div>
                </div>
                <div class="desc">
                    <span>简介：</span>{{ playListDetail.description }}
                </div>
            </div>
        </div>
        <div class="container">
            <div class="song-item" v-for="(item, index) in playListAll" :key="item.id" @dblclick="playSong(item.id)">
                <div class="num">{{ fixedNum(index + 1) }}</div>
                <div class="title">
                    <span class="bold">{{ item.name }}</span>
                    <span class="alia" v-if="item.alia != ''">({{ item.alia[0] }})</span>
                </div>
                <div class="artist">
                    <!-- <div class="artist-item" v-for="ar in item.ar" :key="ar.id">{{ ar.name }}</div> -->
                    {{ item.ar[0].name }}
                </div>
                <div class="album">{{ item.al.name }}</div>
                <div class="length">04:06</div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, computed, reactive, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: '歌单详情',
    setup() {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const id = computed(() => router.currentRoute.value.params.id);
        const playListAllParams = reactive({
            id,
            limit: 10,
            offset: 0,
        });
        const playListDetailParams = reactive({
            id
        });
        // const songUrlParams = reactive({
        //     id: 1,
        //     level: 'standard'
        // })
        // const songUrl = computed(() => store.state.playlist.songUrl[0] ? store.state.playlist.songUrl[0].url : '');

        onMounted(() => {
            store.dispatch('getPlayListAll', playListAllParams);
            store.dispatch('getPlayListDetail', playListDetailParams);
        })

        function fixedNum(num) {
            return num < 10 ? '0' + num : '' + num;
        }

        function playSong(songId) {
            // let audio = document.querySelector('audio');
            // songUrlParams.id = songId;
            // store.dispatch('getSongUrl', songUrlParams);
            // setTimeout(() => {
            //     console.log(songUrl.value);
            //     audio.play();
            // }, 1000);
            proxy.$Mitt.emit('playSong', songId);
        }

        return {
            fixedNum,
            playSong,
            // songUrl,
            playListAll: computed(() => store.state.playlist.playListAll || {}),
            playListDetail: computed(() => store.state.playlist.playListDetail || {}),
        }
    }
}
</script>

<style lang="less" scoped>
.playlist {
    .playlist-detail {
        display: flex;
        font-size: 10px;

        img {
            width: 200px;
            height: 200px;
            border-radius: 10px;
        }

        .right {
            margin-left: 30px;
            margin-top: 8px;

            .name {
                font-size: 20px;
                font-weight: 600;
            }

            .creator {
                margin: 15px 0 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                color: #39629a;
                img {
                    width: 21px;
                    height: 21px;
                    margin-right: 8px;
                }
            }

            .func {
                font-size: 12px;
                display: flex;
                div {
                    margin-right: 8px;
                    box-sizing: border-box;
                    padding: 5px 15px;
                    border: 1px solid #c3c3c3;
                    border-radius: 10px;
                }
                .playall {
                    background-color: #e65d4c;
                    color: white;
                }
            }


            .count {
                margin: 18px 0 10px;
                display: flex;
                font-weight: 300;
                .trackcount {
                    margin-right: 8px;
                }
            }
            .desc {
                line-height: 1.75;
                font-weight: 300;
            }

            span {
                font-weight: 400;
            }
        }
    }

    .container {
        margin-top: 35px;

        .song-item {
            display: flex;
            height: 34px;
            font-size: 12px;
            font-weight: 400;
            align-items: center;
            color: #696969;

            .num {
                margin-left: 8px;
                width: 30px;
                color: #c3c3c3;
            }

            .title {
                margin-left: 0;
                width: 300px;

                .bold {
                    color: black;
                }

                .alia {
                    color: #656464;
                }
            }

            .artist {
                width: 180px;
            }

            .album {
                width: 200px;
            }

            .length {
                font-size: 8px;
            }
        }

        .song-item:nth-child(2n+1) {
            background-color: #f2f2f2;
        }
    }
}</style>