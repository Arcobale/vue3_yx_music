<template>
    <div class="header">
        <div class="album-title clickable" @click="showAlbumDetail(props.albumId)">{{ albumName }}</div>
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
        <div class="song-item" v-for="(song, index) in albumSong.slice(0, 10)" :key="song.id"
            @dblclick="playAllSong(song.id, index)">
            <div class="song-num">{{ fixedNum(index + 1) }}</div>
            <div class="song-title" :class="{ deactive: song.dt === 0 }">
                {{ song.name }}
                <span class="song-alias" v-if="song.alia.length != 0">
                    （{{ song.alia[0] }}）
                </span>
            </div>
            <div class="song-length">{{ toSongLen(song.dt) }}</div>
        </div>
    </div>

    <div class="all clickable" v-if="albumSong.length > 10" @click="showDetail(albumId)">查看全部 ></div>
</template>

<script>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'AlbumSongList',
    props: ['albumId'],
    setup(props) {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const albumDetail = ref('');
        const albumName = computed(() => albumDetail.value.album?.name || '');
        const albumSong = computed(() => albumDetail.value.songs || []);

        onMounted(() => {
            store.dispatch('getAlbumDetail', { id: props.albumId }).then(() => {
                albumDetail.value = store.state.playlist.albumDetail || {};
            });
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
            let newItem = { id: song.id, name: song.name, artist: song.ar, len: song.dt };
            proxy.$Mitt.emit('addSong', { song: newItem, insertIndex: store.state.curSongIndex + 1 });
        }

        function showDetail(albumId) {
            router.push({
                name: 'albumlist',
                params: {
                    id: albumId
                }
            });
        }

        function playAllSong(curSongId, curSongIndex) {
            proxy.$Mitt.emit('clearSongList');
            for (let i = 0; i < albumSong.value.length; i++) {
                let item = albumSong.value[i];
                let newItem = { id: item.id, name: item.name, artist: item.ar, len: item.dt };
                proxy.$Mitt.emit('addSong', { song: newItem });
            }
            if (typeof curSongId === 'number') {
                proxy.$Mitt.emit('playSong', { songId: curSongId, songIndex: curSongIndex });
            } else {
                proxy.$Mitt.emit('playSong', { songId: albumSong.value[0].id, songIndex: 0 });
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
            props,
            albumId: ref(props.albumId),
            albumName,
            albumSong,
            fixedNum,
            toSongLen,
            playSong,
            showDetail,
            showAlbumDetail,
            playAllSong
        }
    }

}
</script>

<style lang="less" scoped>
.clickable {
    cursor: pointer;
}

.clickable:hover {
    font-weight: 500;

    .icon {
        fill: black;
    }
}

.header {
    display: flex;

    .icon {
        width: 16px;
        height: 16px;
        fill: #666666;
    }


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
            font-weight: 400;
            margin-right: 10px;
            max-width: 400px;
            min-width: 400px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            .song-alias {
                color: #656464;
            }
        }

        .deactive {
            color: #c3c3c3;
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
</style>