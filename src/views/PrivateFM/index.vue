<template>
  <div class="privatefm">
    <div class="top">
      <div class="left">
        <div class="cover">
          <img :src="personalFM?.album?.picUrl" alt="">
        </div>
        <div class="func">
          <div class="button">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-heart"></use>
            </svg>
          </div>
          <div class="button">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
          </div>
          <div class="button">
            <svg class="icon" aria-hidden="true" @click="skipSong(1)">
              <use xlink:href="#icon-xiayigexiayishou"></use>
            </svg>
          </div>
          <div class="button">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-qita"></use>
            </svg>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="title">{{ personalFM?.name }}</div>
        <div class="subtitle">
          <div class="album">
            专辑：
            <span class="clickable" @click="showAlbumDetail(personalFM?.album.id)">{{ personalFM?.album?.name
            }}</span>
          </div>
          <div class="artist">
            歌手：
            <span class="clickable" @click="showArtistHome(personalFM?.artists[0].id)">{{
              personalFM?.artists?.[0]?.name }}</span>
            <span v-if="personalFM?.artists?.length > 1">
              <span v-for="ar in personalFM?.artists?.slice(1)" :key="ar.id"> / <span class="clickable"
                  @click="showArtistHome(ar.id)">{{ ar.name }}</span>
              </span>
            </span>
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
  </div>
</template>

<script>
import { ref, getCurrentInstance, computed, reactive, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { dayjs } from 'element-plus'

export default {
  name: "PrivateFM",
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();

    const curFMIndex = computed(() => store.state.curFMIndex);
    const curSongId = computed(() => store.state.lyric.curSongId);
    const curSongTime = computed(() => store.state.lyric.curSongTime);
    const curLyricIndex = ref(-1);
    const lyrics = computed(() => store.getters.lyricFormat || []);
    const personalFM = computed(() => store.state.user.personalFM[curFMIndex.value % 3]);

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
      store.commit('CHANGECYCLE');
      proxy.$Mitt.emit('clearSongList');
      proxy.$Mitt.emit('getFMData');
    })

    proxy.$Mitt.on('getFMData', (callBack) => {
      // 私人FM接口不接收参数，每次请求Url相同，则返回相同数据
      // 接口返回的响应头设置了过期时间，当超过时才会返回新的数据
      // 通过携带当前的时间戳作为参数，使每次请求的Url不同，才能返回不同数据
      store.dispatch('getPersonalFM', { timestamp: new Date().getTime() }).then(() => {
        addSong();
        if (curFMIndex.value === 0) {
          proxy.$Mitt.emit('playSong', { songId: personalFM.value.id, songIndex: 0 });
        }
        getLyricAndComment();

        if (callBack) {
          callBack();
        }

      });
    })

    function getLyricAndComment() {
      store.dispatch('getLyric', { id: curSongId.value });
      store.dispatch('getLyricWordByWord', { id: curSongId.value });

      commentMusicParams.id = curSongId.value;
      store.dispatch('getCommentMusic', commentMusicParams);

      // commentFloorParams.id = curSongId;
      // store.dispatch('getCommentFloor', commentFloorParams);
    }

    function addSong() {
      for (let i = 0; i < store.state.user.personalFM.length; i++) {
        let item = store.state.user.personalFM[i];
        let newItem = { id: item.id, name: item.name, artist: item.artists, len: item.duration };
        proxy.$Mitt.emit('addSong', { song: newItem });
      }
    }

    // 切歌
    function skipSong(step) {
      store.commit('SKIPFM', step);

      function doSkip() {
        proxy.$Mitt.emit('skipSong', step);
      }

      if (curFMIndex.value % 3 === 0) {
        // 传入回调函数作为参数，在异步获取完数据后执行
        // 使用延时时间为0ms的setTimeout失败原因：
        // 异步获取数据存在网络延迟，在resolve后才能将then中的成功回调加入微任务队列，而此时宏任务队列中的延迟器已经值ing完毕
        proxy.$Mitt.emit('getFMData', doSkip)
      } else {
        doSkip()
      }
    }

    watch(curSongId, () => {
      getLyricAndComment()
    })

    watch(curSongTime, () => {
      for (let i = 0; i < lyrics.value.length; i++) {
        if (lyrics.value[i]['time'] >= curSongTime.value) {
          curLyricIndex.value = i - 1;

          // 开始滚动
          if (curLyricIndex.value > 5) {
            lyricContainer.value.scrollTop = 30 * (curLyricIndex.value - 5);
          }
          break;
        }
      }
    })

    function showArtistHome(artistId) {
      router.push({
        name: 'artisthome', params: {
          id: artistId
        }
      })
    }

    function showAlbumDetail(albumId) {
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
      personalFM,
      lyrics,
      lyricWordByWord: computed(() => store.state.lyric.lyricWordByWord || ''),
      commentMusic: computed(() => store.state.lyric.commentMusic || {}),
      commentMusicHot: computed(() => store.state.lyric.commentMusicHot || {}),
      total: computed(() => store.state.lyric.total),
      skipSong,
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
.privatefm {
  font-size: 12px;
  padding: 0 30px;

  .clickable {
    color: #4c70a4;
    cursor: pointer;
  }

  .top {
    display: flex;
    align-items: center;

    .left {
      width: 50%;
      margin-right: 40px;

      .cover {
        margin: 20px auto;
        text-align: center;

        img {
          width: 268px;
          height: 268px;
          border-radius: 10px;
        }
      }

      .func {
        width: 100%;
        display: flex;
        justify-content: space-around;

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
          min-width: 140px;
          max-width: 140px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-right: 10px;
        }

        .artist {
          min-width: 100px;
          max-width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-right: 10px;
        }
      }

      .lyric-container {
        margin-top: 30px;
        height: 350px;
        width: 374px;
        overflow: scroll;

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
    margin-top: 45px;

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
      width: 730px;

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
            width: 674px;
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