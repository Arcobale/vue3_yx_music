<template>
    <div class="search-song">
        最佳匹配
        <div class="bestmatch" @click="showArtistHome(bestMatchArtist.id)">
            <div class="cover">
                <img :src="bestMatchArtist.img1v1Url" alt="">
            </div>
            <div class="artist">
                歌手：{{ bestMatchArtist.name }}
            </div>
        </div>
        <div class="container">
            <div class="head">
                <div class="head-title">音乐标题</div>
                <div class="head-artist">歌手</div>
                <div class="head-album">专辑</div>
                <div class="head-length">时长</div>
            </div>
            <div class="container-item" v-for="(item, index) in searchListSong" :key="item.id" @dblclick="playSong(item)">
                <div class="num">{{ fixedNum(index + 1) }}</div>
                <div class="title">
                    <span class="bold">{{ item.name }}</span>
                    <span class="alia" v-if="item.alias != ''">({{ item.alias[0] }})</span>
                </div>
                <div class="artist">
                    {{ item.artists[0].name }}
                    <span v-for="ar in item.artists.slice(1)" :key="ar.id">/{{ ar.name }}</span>
                </div>
                <div class="album">{{ item ? item.album.name : '' }}</div>
                <div class="length">{{ toSongLen(item.duration) }}</div>
            </div>
        </div>
        <div class="pagination"></div>
    </div>
</template>

<script>
import { computed, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'SearchSong',
    setup() {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const searchListSong = computed(() => store.state.search.searchListSong || []);
        const bestMatchArtist = computed(() => store.state.search.bestMatch || {});

        onMounted(() => {

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

        function playSong(song) {
            proxy.$Mitt.emit('playSong', { songId: song.id });
            let newItem = { id: song.id, name: song.name, artist: song.artists, len: song.duration };
            proxy.$Mitt.emit('addSong', { song: newItem, insertIndex: store.state.curSongIndex + 1 });
        }

        function showArtistHome(artistId) {
            router.push({
                name: 'artisthome', params: {
                    id: artistId
                }
            })
        }

        return {
            fixedNum,
            toSongLen,
            playSong,
            showArtistHome,
            searchListSong,
            bestMatchArtist
        }
    }

}
</script>

<style lang="less" scoped>
.search-song {
    font-size: 12px;

    .bestmatch {
        width: 354px;
        height: 78px;
        border-radius: 10px;
        margin: 12px 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;

        .cover img {
            width: 78px;
            height: 78px;
            border-bottom-left-radius: 10px;
            border-top-left-radius: 10px;
        }

        .artist {
            font-size: 14px;
            padding-left: 10px;
            background-color: #e0e0e0;
            height: 78px;
            flex: 1;
            line-height: 78px;

            span {
                color: #656464;
            }
        }
    }

    .container {
        width: 730px;

        .head {
            height: 35px;
            color: #696969;
            border-top: 1px solid #e0e0e0;
            display: flex;
            line-height: 35px;

            .head-title {
                margin-left: 58px;
                width: 290px;
            }

            .head-artist {
                width: 140px;
            }

            .head-album {
                width: 180px;
            }
        }

        .container-item {
            height: 30px;
            display: flex;
            align-items: center;
            font-weight: 400;
            color: #696969;

            .num {
                margin-left: 20px;
                width: 30px;
                color: #c3c3c3;
            }

            .title {
                margin-left: 8px;
                width: 290px;

                .bold {
                    color: black;
                }

                .alia {
                    color: #656464;
                }
            }

            .artist {
                width: 140px;
            }

            .album {
                width: 180px;
            }
        }

        .container-item:nth-child(2n+1) {
            background-color: #fafafa;
        }

        .container-item:hover {
            background-color: #f0f0f0;
        }
    }

    .pagination {}
}</style>