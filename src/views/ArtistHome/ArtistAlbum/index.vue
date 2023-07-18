<template>
    <div class="top-song">
        <div class="album-cover">
            <img src="" alt="">
        </div>
        <div class="album-detail">
            <div class="header">
                <div class="album-title">热门50首</div>
                <div class="button">
                    <span class="clickable" @click="playAllSong">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bofang"></use>
                        </svg>
                    </span>
                    <span class="clickable">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-tianjia"></use>
                        </svg>
                    </span>
                </div>
            </div>
            <div class="songlist">
                <div class="song-item" v-for="(song, index) in artistPartSong" :key="song.id"
                    @dblclick="playAllSong(song.id, index)">
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
            <div class="all clickable" v-if="!isAllSong" @click="isAllSong=true">查看全部50首 ></div>
        </div>
    </div>

    <div class="top-song" v-for="album in artistAlbum" :key="album.id">
        <div class="album-cover">
            <img class="clickable" :src="album.picUrl" alt="" @click="showAlbumDetail(album.id)">
            <div class="date">{{ fixedDate(album.publishTime) }}</div>
        </div>
        <div class="album-detail">
            
            <AlbumSongList :albumId="album.id"></AlbumSongList>

        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import AlbumSongList from './AlbumSongList'
import { dayjs } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
    name: 'ArtistAlbum',
    props: ['artistId'],
    components: {
        AlbumSongList
    },
    setup(props) {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const isAllSong = ref(false);
        const artistAlbumParams = reactive({
            id: props.artistId,
            limit: 30,
            offset: 0
        })

        const artistTopSong = computed(() => store.state.artisthome.artistTopSong || {});
        const artistPartSong = computed(() => isAllSong.value ? artistTopSong.value : artistTopSong.value.slice(0, 10));

        onMounted(() => {
            store.dispatch('getArtistTopSong', { id: props.artistId });
            store.dispatch('getArtistAlbum', artistAlbumParams);
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

        function fixedDate(time) {
            let timeFormat = dayjs(time).format("YYYY-MM-DD");
            return timeFormat;
        }

        function playSong(song) {
            proxy.$Mitt.emit('playSong', { songId: song.id });
            let newItem = { id: song.id, name: song.name, artist: song.ar, len: song.dt };
            proxy.$Mitt.emit('addSong', { song: newItem, insertIndex: store.state.curSongIndex + 1 });
        }

        function playAllSong(curSongId, curSongIndex) {
            proxy.$Mitt.emit('clearSongList');
            for (let i = 0; i < artistTopSong.value.length; i++) {
                let item = artistTopSong.value[i];
                let newItem = { id: item.id, name: item.name, artist: item.ar, len: item.dt };
                proxy.$Mitt.emit('addSong', { song: newItem });
            }
            if (typeof curSongId === 'number') {
                proxy.$Mitt.emit('playSong', { songId: curSongId, songIndex: curSongIndex });
            } else {
                proxy.$Mitt.emit('playSong', { songId: artistTopSong.value[0].id, songIndex: 0 });
            }
        }

        function showAlbumDetail(albumId) {
            router.push({
                name: 'albumlist',
                params: {
                    id: albumId
                }
            });
        }

        return {
            isAllSong,
            artistPartSong,
            artistTopSong,
            artistAlbum: computed(() => store.state.artisthome.artistAlbum || {}),
            fixedNum,
            toSongLen,
            fixedDate,
            playSong,
            playAllSong,
            showAlbumDetail
        }
    }
}
</script>

<style lang="less" scoped>
.top-song {
    display: flex;
    margin-bottom: 50px;
    .clickable {
        cursor: pointer;
    }
    .clickable:hover {
        font-weight: 500;
        .icon {
            fill: black;
        }
    }

    .icon {
        width: 16px;
        height: 16px;
        fill: #666666;
    }

    .album-cover {
        img {
            width: 150px;
            height: 150px;
            border-radius: 10px;
        }

        .date {
            margin-top: 5px;
        }
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
                background-color: #fafafa;
            }

            .song-item:hover {
                background-color: #f0f0f0;
            }
        }

        .all {
            width: 520px;
            height: 30px;
            background-color: #f2f2f2;
            text-align: right;
            line-height: 30px;
            padding-right: 25px;
            box-sizing: border-box;
        }
    }
}
</style>