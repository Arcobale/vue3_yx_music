<template>
    <div class="songlist">
        <div class="song-item" v-for="(song, index) in albumSong.slice(0, 10)" :key="song.id" @click="playSong(song.id)">
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

    <div class="all" v-if="albumSong.length > 10">查看全部 ></div>
</template>

<script>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'AlbumSongList',
    props: ['albumId'],
    setup(props) {
        const store = useStore();
        const { proxy } = getCurrentInstance();

        const albumDetail = ref('');

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

        function playSong(songId) {
            proxy.$Mitt.emit('playSong', songId);
        }

        return {
            albumDetail,
            albumSong: computed(() => albumDetail.value.songs || []),
            fixedNum,
            toSongLen,
            playSong,
        }
    }

}
</script>

<style lang="less" scoped>
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

        .deactive {
            color: #c3c3c3;
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
</style>