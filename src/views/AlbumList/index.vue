<template>
    <div class="albumlist">
        <div class="albumlist-detail">
            <img :src="albumDesc.picUrl" alt="">
            <div class="right">
                <div class="name">
                    <div class="type">专辑</div>
                    {{ albumDesc.name }}
                </div>
                <div class="func">
                    <div class="playall clickable" @click="playAllSong">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bofang"></use>
                        </svg>
                        播放全部
                    </div>
                    <div class="collect clickable">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-tianjia"></use>
                        </svg>
                        收藏({{ fixedCount(albumDetailDynamic?.subCount) }})
                    </div>
                    <div class="share clickable">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-share"></use>
                        </svg>
                        分享({{ fixedCount(albumDetailDynamic?.shareCount) }})
                    </div>
                    <div class="downloadall clickable">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-xiazai"></use>
                        </svg>
                        下载全部
                    </div>
                </div>
                <div class="artist">
                    <span>歌手：</span>
                    <span class="clickable" @click="showArtistHome(albumDesc?.artist?.id)">{{ albumDesc?.artist?.name }}</span>
                </div>
                <div class="date">
                    <span>时间：</span>{{ fixedDate(albumDesc.publishTime) }}
                </div>
            </div>
        </div>
        <div class="container">
            <div class="song-item" v-for="(item, index) in albumSong" :key="item.id"
                @dblclick="playAllSong(item.id, index)">
                <div class="num">{{ fixedNum(index + 1) }}</div>
                <div class="title" :class="{ deactive: item.dt === 0 }">
                    <span class="bold">{{ item.name }}</span>
                    <span class="alia" v-if="item.alia != ''">({{ item.alia[0] }})</span>
                </div>
                <div class="artist">
                    <!-- {{ item.ar[0].name }}
                    <span v-for="ar in item.ar.slice(1)" :key="ar.id">/{{ ar.name }}</span> -->
                    <span class="clickable" @click="showArtistHome(item.ar[0].id)">{{ item?.ar?.[0]?.name }}</span>
                    <span v-if="item?.ar?.length > 1">
                        <span v-for="ar in item?.ar?.slice(1)" :key="ar.id">
                         / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
                        </span>
                    </span>
                </div>
                <div class="album clickable" @click="showAlbumDetail(item?.al?.id)">{{ item?.al?.name }}</div>
                <div class="length">{{ toSongLen(item.dt) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { dayjs } from 'element-plus'

export default {
    name: 'AlbumList',
    setup() {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const id = computed(() => router.currentRoute.value.params.id);
        const albumDetail = computed(() => store.state.playlist.albumDetail);
        const albumDetailDynamic = computed(() => store.state.playlist.albumDetailDynamic);
        const albumSong = computed(() => albumDetail.value.songs || []);

        onMounted(() => {
            store.dispatch('getAlbumDetailDynamic', { id: id.value });
            store.dispatch('getAlbumDetail', { id: id.value })
        })

        function fixedNum(num) {
            return num < 10 ? '0' + num : '' + num;
        }

        function playAllSong(curSongId, curSongIndex) {
            proxy.$Mitt.emit('clearSongList');
            for (let i = 0; i < albumSong.value.length; i++) {
                let item = albumSong.value[i];
                let newItem = { id: item.id, name: item.name, artist: item.ar, len: item.dt };
                proxy.$Mitt.emit('addSong', { song: newItem});
            }
            if (typeof curSongId === 'number') {
                proxy.$Mitt.emit('playSong', { songId: curSongId, songIndex: curSongIndex });
            } else {
                proxy.$Mitt.emit('playSong', { songId: albumSong.value[0].id, songIndex: 0 });
            }
        }

        // 输出固定格式的时间
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

        function fixedCount(num) {
            return num > 99999999 ? parseInt(num / 100000000) + '亿' : num > 99999 ? parseInt(num / 10000) + '万' : num + '';
        }

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

        return {
            fixedNum,
            fixedDate,
            fixedCount,
            toSongLen,
            playAllSong,
            showAlbumDetail,
            showArtistHome,
            albumDesc: computed(() => albumDetail.value.album || []),
            albumDetailDynamic,
            albumSong,
        }
    }
}
</script>

<style lang="less" scoped>
.albumlist {
    .clickable {
        cursor: pointer;
    }
    .clickable:hover {
        font-weight: 500;
    }

    .icon {
        width: 14px;
        height: 14px;
        fill: #9b9b9b;
        position: relative;
        top: 2px;
    }
    .albumlist-detail {
        display: flex;
        font-size: 10px;

        img {
            width: 200px;
            height: 200px;
            border-radius: 10px;
        }

        .right {
            margin-left: 30px;
            margin-top: 8px;

            .name {
                font-size: 20px;
                font-weight: 600;
                display: flex;
                align-items: center;

                .type {
                    width: 35px;
                    height: 18px;
                    border: 1px solid #e65d4c;
                    border-radius: 3px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #e65d4c;
                    text-align: center;
                    line-height: 18px;
                    margin-right: 8px;
                }
            }

            .func {
                font-size: 12px;
                display: flex;
                margin-top: 20px;
                line-height: 14px;

                div {
                    margin-right: 8px;
                    box-sizing: border-box;
                    padding: 5px 15px;
                    border: 1px solid #c3c3c3;
                    border-radius: 10px;
                }

                .playall {
                    background-color: #e65d4c;
                    color: white;
                }
                .playall .icon {
                    fill: white;
                }
            }


            .artist,
            .date {
                margin: 18px 0 10px;
                font-weight: 300;

                span.clickable {
                    color: #39629a;
                }
            }

            span {
                font-weight: 400;
            }
        }
    }

    .container {
        margin-top: 35px;

        .song-item {
            display: flex;
            height: 34px;
            font-size: 12px;
            font-weight: 400;
            align-items: center;
            color: #696969;

            .num {
                margin-left: 8px;
                width: 30px;
                color: #c3c3c3;
            }

            .title {
                margin-left: 0;
                margin-right: 30px;
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

            .deactive span {
                color: #c3c3c3 !important;
            }

            .artist {
                margin-right: 20px;
                max-width: 150px;
                min-width: 150px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .album {
                margin-right: 20px;
                max-width: 180px;
                min-width: 180px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .length {
                font-size: 8px;
            }
        }

        .song-item:nth-child(2n+1) {
            background-color: #fafafa;
        }

        .song-item:hover {
            background-color: #f0f0f0;
        }
    }
}</style>