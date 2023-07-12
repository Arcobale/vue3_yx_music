<template>
    <div class="lyric">
        <el-drawer v-model="isOpen" direction="btt" size="100%" z-index="9">

            <div class="top">
                <div class="left">
                    <div class="cover">
                        <img :src="songDetail?.al?.picUrl" alt="">
                    </div>
                    <div class="func">
                        <div class="button">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-heart"></use>
                            </svg>
                        </div>
                        <div class="button">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-tianjia"></use>
                            </svg>
                        </div>
                        <div class="button">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-xiazai"></use>
                            </svg>
                        </div>
                        <div class="button">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-share"></use>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="right">
                    <div class="title">{{ songDetail?.name }}</div>
                    <div class="subtitle">
                        <div class="album">
                            专辑：
                            <span class="clickable" @click="showAlbumDetail(songDetail.al.id)">{{ songDetail?.al?.name
                            }}</span>
                        </div>
                        <div class="artist">
                            歌手：
                            <span class="clickable" @click="showArtistHome(songDetail.ar[0].id)">{{
                                songDetail?.ar?.[0]?.name }}</span>
                            <div v-if="songDetail?.ar?.length > 1">
                                <span v-for="ar in songDetail?.ar?.slice(1)" :key="ar.id"> / <span class="clickable"
                                        @click="showArtistHome(ar.id)">{{ ar.name }}</span>
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
                            {{ lyric?.content }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom">
                <div class="comment">
                    <span class="large">听友评论<span class="small">（已有{{ total }}条评论）</span></span>
                    <div class="writecomment">
                        <input type="text">
                    </div>

                    <span class="middle" v-if="commentMusicHot?.length !== 0">精彩评论</span>
                    <div class="comment-container" v-if="commentMusicHot?.length !== 0">
                        <div class="comment-container-item" v-for="comment in commentMusicHot" :key="comment.commentId">
                            <img :src="comment?.user?.avatarUrl" alt="">
                            <div class="user-info">
                                <div class="user-top">
                                    <span class="clickable">{{ comment?.user?.nickname }}：</span>
                                    <span class="user-content">{{ comment?.content }}</span>
                                </div>
                                <div class="user-bottom">
                                    <div class="publish-time">
                                        {{ fixedDate(comment?.time) }}
                                    </div>
                                    <div class="operation">
                                        <span class="ope report">举报</span>
                                        <span class="ope">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-dianzan"></use>
                                            </svg>
                                            <span v-if="comment?.likedCount > 0">{{ comment?.likedCount }}</span>
                                        </span>
                                        <span class="ope">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-redo"></use>
                                            </svg>
                                        </span>
                                        <span class="ope">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-pinglun"></use>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <span class="middle">最新评论（{{ total }}）</span>
                    <div class="comment-container" v-if="commentMusicHot?.length !== 0">
                        <div class="comment-container-item" v-for="comment in commentMusic" :key="comment.commentId">
                            <img :src="comment?.user?.avatarUrl" alt="">
                            <div class="user-info">
                                <div class="user-top">
                                    <span class="clickable">{{ comment?.user?.nickname }}：</span>
                                    <span class="user-content">{{ comment?.content }}</span>
                                </div>
                                <div class="user-bottom">
                                    <div class="publish-time">
                                        {{ fixedDate(comment?.time) }}
                                    </div>
                                    <div class="operation">
                                        <span class="ope report">举报</span>
                                        <span class="ope">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-dianzan"></use>
                                            </svg>
                                            <span v-if="comment?.likedCount > 0">{{ comment?.likedCount }}</span>
                                        </span>
                                        <span class="ope">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-redo"></use>
                                            </svg>
                                        </span>
                                        <span class="ope">
                                            <svg class="icon" aria-hidden="true">
                                                <use xlink:href="#icon-pinglun"></use>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pagination"></div>
                </div>
            </div>

        </el-drawer>
    </div>
</template>

<script>
import { ref, getCurrentInstance, computed, reactive, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { dayjs } from 'element-plus'

export default {
    name: "Lyric",
    setup() {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const isOpen = ref(false);
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

        proxy.$Mitt.on('closeLyric', () => {
            isOpen.value = false;
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
                    if (isOpen.value && curLyricIndex.value > 5) {
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

        function fixedDate(time) {
            let timeFormat = dayjs(time).format("YYYY年MM月DD日 HH:mm");
            return timeFormat;
        }

        return {
            isOpen,
            songDetail,
            lyrics,
            lyricWordByWord: computed(() => store.state.lyric.lyricWordByWord || ''),
            commentMusic: computed(() => store.state.lyric.commentMusic || {}),
            commentMusicHot: computed(() => store.state.lyric.commentMusicHot || {}),
            total: computed(() => store.state.lyric.total),
            showArtistHome,
            showAlbumDetail,
            fixedDate,
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

    .clickable {
        color: #4c70a4;
        cursor: pointer;
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

                    .icon {
                        width: 18px;
                        height: 18px;
                        fill: black;
                        margin: 11px;
                    }
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
        display: flex;

        span.large {
            font-size: 16px;
            font-weight: 600;
            line-height: 30px;
        }

        span.middle {
            font-size: 14px;
            font-weight: 600;
            margin-top: 60px;
            display: block;
        }

        span.small {
            font-size: 12px;
        }

        .comment {
            width: 568px;

            .writecomment {}

            .comment-container {

                .comment-container-item {
                    min-height: 76px;
                    display: flex;
                    align-items: center;

                    img {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                    }

                    .user-info {
                        margin-left: 10px;
                        width: 516px;
                        padding: 18px 0;
                        border-bottom: 1px solid #eeeeee;

                        .user-top {
                            line-height: 18px;
                        }

                        .user-bottom {
                            margin-top: 10px;
                            display: flex;
                            justify-content: space-between;
                            color: #9b9b9b;


                            .operation {
                                display: flex;

                                .icon {
                                    width: 12px;
                                    height: 12px;
                                    fill: #9b9b9b;
                                }

                                span.ope {
                                    display: block;
                                    padding: 0 10px;
                                    height: 10px;
                                    font-size: 10px;
                                    border-right: 1px solid #9b9b9b;
                                    text-align: center;
                                    span {
                                        margin-left: 4px;
                                    }
                                }

                                span:last-child {
                                    border-right: none;
                                }

                                span.report {
                                    display: none;
                                }
                            }
                        }
                    }
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