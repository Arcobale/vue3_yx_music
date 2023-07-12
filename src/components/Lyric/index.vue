<template>
    <div class="lyric">
        <el-drawer v-model="isOpen" direction="btt" size="100%" z-index="9">

            <div class="top">
                <div class="left">
                    <div class="cover">
                        <img :src="songDetail.al.picUrl" alt="">
                    </div>
                    <div class="func">
                        <div class="button">喜欢</div>
                        <div class="button">收藏</div>
                        <div class="button">下载</div>
                        <div class="button">分享</div>
                    </div>
                </div>

                <div class="right">
                    <div class="title">{{ songDetail.name }}</div>
                    <div class="subtitle">
                        <div class="album">
                            专辑：
                            <span class="clickable" @click="showAlbumDetail(songDetail.al.id)">{{ songDetail.al.name }}</span>
                        </div>
                        <div class="artist">
                            歌手：
                            <span class="clickable" @click="showArtistHome(songDetail.ar[0].id)">{{ songDetail.ar[0].name }}</span>
                            <div v-if="songDetail.ar.length > 1">
                                <span v-for="ar in songDetail.ar.slice(1)" :key="ar.id">
                                    / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
                                </span>
                            </div>
                        </div>
                        <div class="source">
                            来源：
                        </div>
                    </div>
                    <div class="lyric-container" ref="lyricContainer">
                        <div class="sentence" :class="{ active: index === curLyricIndex }" v-for="(lyric, index) in lyrics"
                            :key="index">
                            {{ lyric.content }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom">
                <div class="comment">
                    <span>听友评论<span class="small">（已有66条评论）</span></span>
                    <div class="writecomment">
                        <input type="text">
                    </div>

                    <span class="middle">最新评论（66）</span>
                    <div class="comment-container">
                        <div class="comment-container-item">

                        </div>
                    </div>
                    <div class="pagination"></div>
                </div>
                <div class="recommend">
                    <div class="playlist">
                        <span>包含这首歌的歌单</span>
                    </div>
                    <div class="simisong">
                        <span>相似歌曲</span>
                    </div>
                </div>
            </div>

        </el-drawer>
    </div>
</template>

<script>
import { ref, getCurrentInstance, computed, reactive, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: "Lyric",
    setup() {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const isOpen = ref(true);
        const curSongId = computed(() => store.state.lyric.curSongId);
        const curSongTime = computed(() => store.state.lyric.curSongTime);
        const curLyricIndex = ref(-1);
        const songDetail = ref({});
        const lyrics = computed(() => store.getters.lyricFormat || []);

        const lyricContainer = ref(null);

        const commentMusicParams = reactive({
            id: 2056897713,
            limit: 20,
            offset: 0,
            // before,
        });
        // parentCommentId：楼层评论Id
        // type：资源类型。0:歌曲，1:MV，2:歌单，3:专辑，4:电台节目，5:视频，6:动态，7:电台。
        const commentFloorParams = reactive({
            id: 2056897713,
            type: 0,
            parentCommentId: 5928950562,
            limit: 20,
            // time,
        });

        onMounted(() => {
            getData();
        })

        function getData() {
            store.dispatch('getLyric', { id: curSongId.value });
            store.dispatch('getLyricWordByWord', { id: curSongId.value });
            store.dispatch('getSongDetail', { ids: curSongId.value }).then(() => {
                songDetail.value = store.state.playlist.songDetail[0];
            });

            commentMusicParams.id = curSongId.value;
            store.dispatch('getCommentMusic', commentMusicParams);

            // commentFloorParams.id = curSongId;
            // store.dispatch('getCommentFloor', commentFloorParams);
        }

        proxy.$Mitt.on('openLyric', () => {
            getData();

            isOpen.value = true;
            store.commit('CHANGELYRICSTATE');
        })

        watch(curSongId, () => {
            // 只有在歌词界面打开时切歌才重新发请求
            if (isOpen.value) {
                getData();
            }
        })

        watch(curSongTime, () => {
            for (let i = 0; i < lyrics.value.length; i++) {
                if (lyrics.value[i]['time'] >= curSongTime.value) {
                    curLyricIndex.value = i - 1;

                    // 开始滚动
                    if (curLyricIndex.value > 5) {
                        console.log(lyricContainer.value.scrollTop)
                        lyricContainer.value.scrollTop = 30 * (curLyricIndex.value - 5);
                    }
                    break;
                }
            }
        })

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

        proxy.$Mitt.on('closeLyric', () => {
            isOpen.value = false;
            store.commit('CHANGELYRICSTATE');
        })

        return {
            isOpen,
            songDetail,
            lyrics,
            lyricWordByWord: computed(() => store.state.lyric.lyricWordByWord || ''),
            showArtistHome,
            showAlbumDetail,
            lyricContainer,
            curLyricIndex
        }
    }
}
</script>

<style lang="less" scoped>
.lyric {
    font-size: 12px;

    :deep(.el-drawer__header) {
        height: 50px;
        padding: 0px;
        margin: 0px;
    }

    :deep(.el-drawer__body) {
        padding-left: 55px;
        padding-right: 55px;
        padding-bottom: 60px;
    }

    .top {
        display: flex;
        align-items: center;

        .left {
            width: 50%;

            .cover {
                width: 328px;
                height: 328px;
                border-radius: 50%;
                background-color: #eaeaea;
                margin: 20px auto;

                img {
                    width: 308px;
                    height: 308px;
                    border-radius: 50%;
                    margin-left: 10px;
                    margin-top: 10px;
                }
            }

            .func {
                width: 100%;
                display: flex;
                justify-content: space-evenly;

                .button {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #eaeaea;
                    text-align: center;
                    line-height: 40px;
                }
            }
        }

        .right {
            width: 50%;

            .title {
                font-size: 22px;
                margin-top: 40px;
                margin-bottom: 16px;
            }

            .subtitle {
                display: flex;

                .clickable {
                    color: #4c70a4;
                    cursor: pointer;
                }

                .album {
                    width: 150px;
                }

                .artist {
                    width: 143px;
                }
            }

            .lyric-container {
                margin-top: 30px;
                height: 350px;
                width: 374px;
                overflow: auto;

                .sentence {
                    margin-bottom: 18px;
                }

                .active {
                    font-size: 14px;
                    font-weight: 600;
                }
            }
        }
    }

    .bottom {
        margin-top: 60px;
        display: flex;

        span {
            font-size: 16px;
            font-weight: 600;
            line-height: 30px;
        }

        .comment {
            width: 568px;

            .writecomment {
                margin-bottom: 42px;
            }

            span.middle {
                font-size: 14px;
            }

            .comment-container {

                .comment-container-item {
                    height: 76px;
                }
            }

            .pagination {}
        }

        .recommend {
            margin-left: 40px;

            .playlist {
                margin-bottom: 30px;
            }

            .simisong {}
        }
    }
}
</style>