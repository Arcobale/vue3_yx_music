<template>
    <div class="song">
        <div class="container">
            <div class="song-item" v-for="(item, index) in topListDetail.slice(0, 5)" :key="item.id"
                @dblclick="playSong(item.id)">
                <div class="num">{{ index + 1 }}</div>
                <div class="title">{{ item.name }}</div>
                <div class="alia" v-if="item.alia != ''">（{{ item.alia[0] }}）</div>
                <div class="artist">
                    <div class="artist-item" v-for="ar in item.ar" :key="ar.id">
                        {{ ar.name }}
                    </div>
                </div>
            </div>
        </div>
        <div class="all" @click="showDetail(rankId)">
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

        function playSong(songId) {
            proxy.$Mitt.emit('playSong', songId);
            proxy.$Mitt.emit('addSong', songId);
        }

        function showDetail(playListId) {
            router.push({
                name: 'playlist',
                params: {
                    id: playListId
                }
            });
        }

        return {
            topListDetail,
            playSong,
            showDetail,
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
            margin-left: 20px;
        }

        .alia {
            color: #656464;
        }

        .artist {
            display: flex;
            position: absolute;
            right: 50px;
            color: #949494;

            .artist-item {
                height: 12px;
                border-left: 1px solid #949494;
                padding: 0 5px;
            }

            .artist-item:first-child {
                border-left: none;
            }
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