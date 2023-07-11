<template>
    <div class="suggest-list">
        <el-drawer v-model="isOpen" direction="rtl" size="35%" z-index="10">
            <div class="head">搜“<span>{{ curWord }}</span>”相关的结果></div>
            <div class="container">
                <div class="subtitle">
                    单曲
                </div>
                <div class="container-item" v-for="item in songs" :key="item.id" @click="playSong(item)">
                    <span class="name">{{ item.name }}</span>
                    <span class="artist">
                        - {{ item.artists[0].name }}
                        <span v-for="ar in item.artists.slice(1)" :key="ar.id">/{{ ar.name }}</span>
                    </span>
                </div>
                <div class="subtitle">
                    歌手
                </div>
                <div class="container-item" v-for="item in artists" :key="item.id" @click="showArtistHome(item.id)">
                    <span class="name">{{ item.name }}</span>
                </div>
                <div class="subtitle">
                    专辑
                </div>
                <div class="container-item" v-for="item in albums" :key="item.id" @click="showAlbumDetail(item.id)">
                    <span class="name">{{ item.name }}</span>
                    <span class="artist">
                        - {{ item.artist.name }}
                    </span>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { computed, ref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'SuggestList',
    setup() {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const isOpen = ref(true);
        const curWord = ref('');
        const searchSuggest = computed(() => store.state.search.searchSuggest || {});

        const songs = computed(() => searchSuggest.value.songs);
        const artists = computed(() => searchSuggest.value.artists);
        const albums = computed(() => searchSuggest.value.albums);


        function playSong(song) {
            proxy.$Mitt.emit('playSong', { songId: song.id });
            let newItem = { id: song.id, name: song.name, artist: song.artists, len: song.duration };
            proxy.$Mitt.emit('addSong', { song: newItem, insertIndex: store.state.curSongIndex + 1 });
            isOpen.value = false;
        }

        function showArtistHome(artistId) {
            isOpen.value = false;
            router.push({
                name: 'artisthome', params: {
                    id: artistId
                }
            })
        }

        function showAlbumDetail(albumId) {
            isOpen.value = false;
            router.push({
                name: 'albumlist',
                params: {
                    id: albumId
                }
            });
        }

        proxy.$Mitt.on('openSuggestList', (keywords) => {
            isOpen.value = true;
            curWord.value = keywords;
            store.dispatch('getSearchSuggest', { keywords })
        })

        return {
            isOpen,
            curWord,
            songs,
            artists,
            albums,
            playSong,
            showArtistHome,
            showAlbumDetail,
        }
    }

}
</script>

<style lang="less" scoped>
.suggest-list {
    font-size: 12px;

    :deep(.el-drawer__header) {
        height: 50px;
        padding: 0px;
        margin: 0px;
    }

    :deep(.el-drawer__body) {
        padding: 0px;
        padding-bottom: 60px;
    }

    .head {
        padding-left: 5px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .container {
        padding-left: 5px;

        .subtitle {
            height: 33px;
            color: #656464;
            line-height: 33px;
        }

        .container-item {
            height: 30px;
            line-height: 30px;
            padding-left: 25px;
        }

        .container-item:hover {
            background-color: #f0f0f0;
        }
    }
}
</style>