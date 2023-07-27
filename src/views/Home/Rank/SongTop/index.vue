<template>
    <div class="song">
        <div class="container">
            <div class="song-item" v-for="(item, index) in topListDetail.slice(0, 5)" :key="item.id"
                @dblclick="playSong(item)">
                <div class="num">{{ index + 1 }}</div>
                <div class="title">
                    <span class="bold">{{ item.name }}</span>
                    <span class="alia" v-if="item.alia != ''">({{ item.alia[0] }})</span>
                </div>
                <div class="artist">
                    <span class="clickable" @click="showArtistHome(item.ar[0].id)">{{ item?.ar?.[0]?.name
                    }}</span>
                    <span v-if="item?.ar?.length > 1">
                        <span v-for="ar in item?.ar?.slice(1)" :key="ar.id">
                            / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <div class="all clickable" @click="showDetail(rankId)">
            查看全部
            <el-icon>
                <ArrowRight />
            </el-icon>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, reactive, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: 'SongTop',
    props: ['rankId'],

    setup(props) {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const topListDetail = ref('');
        const topListDetailParams = reactive({
            id: props.rankId
        })

        onMounted(() => {
            store.dispatch('getTopListDetail', topListDetailParams).then(() => {
                topListDetail.value = store.state.home.topListDetail || [];
            });
        })

        function playSong(song) {
            proxy.$Mitt.emit('playSong', { songId: song.id });
            let newItem = { id: song.id, name: song.name, artist: song.ar, len: song.dt };
            proxy.$Mitt.emit('addSong', { song: newItem, insertIndex: store.state.curSongIndex + 1 });
        }

        function showDetail(playListId) {
            router.push({
                name: 'playlist',
                params: {
                    id: playListId
                }
            });
        }

        function showArtistHome(artistId) {
            router.push({
                name: 'artisthome', params: {
                    id: artistId
                }
            })
        }

        return {
            topListDetail,
            playSong,
            showDetail,
            showArtistHome,
            rankId: props.rankId
        }
    }
}
</script>

<style lang="less" scoped>
.song {
    width: 535px;
    margin-left: 32px;
    font-size: 12px;

    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        font-weight: 500;
    }

    .song-item {
        display: flex;
        height: 34px;
        align-items: center;

        .num {
            width: 10px;
            font-weight: 500;
            color: #b9291b;
        }

        .title {
            margin-left: 8px;
            font-size: 13px;
            margin-right: 20px;
            max-width: 300px;
            min-width: 300px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            .bold {
                color: black;
            }

            .alia {
                color: #656464;
            }
        }

        .artist {
            margin-right: 20px;
            max-width: 170px;
            min-width: 170px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: right;
            color: #656464;
        }
    }

    .song-item:nth-child(2n+1) {
        background-color: #fafafa;
    }

    .song-item:hover {
        background-color: #f0f0f0;
    }

    .song-item:nth-last-child(1) {
        .num {
            color: #656464;
        }
    }

    .song-item:nth-last-child(2) {
        .num {
            color: #656464;
        }
    }

    .all {
        color: #656464;
        margin-top: 10px;
    }
}
</style>