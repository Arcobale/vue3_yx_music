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
            <div class="nav-item active">专辑</div>
            <div class="nav-item">MV</div>
            <div class="nav-item">歌手详情</div>
            <div class="nav-item">相似歌手</div>
        </div>

        <div class="container">
            <div class="top-song">
                <div class="album-cover">
                    <img src="" alt="">
                </div>
                <div class="album-detail">
                    <div class="header">
                        <div class="album-title">热门50首</div>
                        <div class="button">
                            <span>播放</span>
                            <span>收藏</span>
                        </div>
                    </div>
                    <div class="songlist">
                        <div class="song-item" v-for="(song, index) in artistTopSong.slice(0, 10)" :key="song.id">
                            <div class="song-num">{{ fixedNum(index + 1) }}</div>
                            <div class="song-title">
                                {{ song.name }}
                                <span class="song-alias" v-if="song.alia.length != 0">
                                    （{{ song.alia[0] }}）
                                </span>
                            </div>
                            <div class="song-length">{{ toSongLen(song.dt) }}</div>
                        </div>
                    </div>
                    <div class="all">查看全部 ></div>
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
    name: 'ArtistHome',

    setup() {
        const store = useStore();
        const router = useRouter();

        const artistId = computed(() => router.currentRoute.value.params.id)

        // const artistDetail = computed(() => store.state.artisthome.artistDetail || {});

        onMounted(() => {
            store.dispatch('getArtistDetail', { id: artistId.value });
            store.dispatch('getArtistTopSong', { id: artistId.value });
        });

        function fixedNum(num) {
            return num < 10 ? '0' + num : '' + num;
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
            artist: computed(() => store.state.artisthome.artistDetail || {}),
            artistTopSong: computed(() => store.state.artisthome.artistTopSong || {}),
            fixedNum,
            toSongLen,
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
                font-size: 16px;
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
        width: 740px;
        border-bottom: 1px solid #e0e0e0;
        margin-top: 30px;
        display: flex;
        align-items: center;
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

        .top-song {
            display: flex;

            .album-cover img {
                width: 150px;
                height: 150px;
                border-radius: 10px;
            }

            .album-detail {
                margin-left: 60px;

                .header {
                    display: flex;

                    .album-title {
                        font-size: 16px;
                        font-weight: 600;
                    }

                    .button {
                        margin-left: 20px;
                        text-align: center;
                        line-height: 16px;

                        span {
                            padding: 0px 10px;
                        }

                        span:first-child {
                            border-right: 1px solid #e0e0e0;
                        }
                    }
                }

                .songlist {
                    width: 520px;
                    margin-top: 10px;

                    .song-item {
                        height: 30px;
                        display: flex;
                        align-items: center;

                        .song-num {
                            font-size: 10px;
                            margin: 0 10px;
                            color: #c3c3c3;
                            width: 40px;
                        }

                        .song-title {
                            width: 400px;
                            font-weight: 400;

                            .song-alias {
                                color: #656464;
                            }
                        }

                        .song-length {
                            font-size: 8px;
                            color: #c3c3c3;
                        }
                    }

                    .song-item:nth-child(2n+1) {
                        background-color: #f2f2f2;
                    }
                }

                .all {
                    width: 520px;
                    height: 30px;
                    background-color: #f2f2f2;
                    text-align: right;
                    line-height: 30px;
                }
            }
        }
    }
}</style>