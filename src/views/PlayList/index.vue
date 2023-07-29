<template>
    <div class="playlist">
        <div class="playlist-detail">
            <img :src="playListDetail.coverImgUrl" alt="">
            <div class="right">
                <div class="name">
                    <div class="type">歌单</div>
                    {{ playListDetail.name }}
                </div>
                <div class="creator">
                    <img class="clickable" :src="playListDetail?.creator?.avatarUrl" alt="">
                    <span class="clickable">{{ playListDetail?.creator?.nickname }}</span>
                    <span class="publish-time">{{ fixedDate(playListDetail?.createTime) }}创建</span>
                </div>
                <div class="func">
                    <div class="playall clickable" @click="playAllSong">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bofang"></use>
                        </svg>播放全部
                    </div>
                    <div class="collect clickable" :class="{ disabled: isSelf }" @click="changeSubscribe">
                        <svg class="icon" aria-hidden="true" v-if="!isSubscribe">
                            <use xlink:href="#icon-tianjia"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true" v-else>
                            <use xlink:href="#icon-icon"></use>
                        </svg>
                        <span v-if="isSubscribe && !isSelf">已</span>收藏({{ fixedCount(playListDetail?.subscribedCount) }})
                    </div>
                    <div class="share clickable">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-share"></use>
                        </svg>分享({{ fixedCount(playListDetail?.shareCount) }})
                    </div>
                    <div class="downloadall clickable">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-xiazai"></use>
                        </svg>下载全部
                    </div>
                </div>
                <div class="count">
                    <div class="trackcount">
                        <span>歌曲数：</span>{{ playListDetail.trackCount }}
                    </div>
                    <div class="playcount">
                        <span>播放数：</span>{{ fixedCount(playListDetail?.playCount) }}
                    </div>
                </div>
                <div class="desc">
                    <div class="content" :class="{ descToggle: !isToggle }">
                        <span>简介：</span>{{ playListDetail.description }}
                    </div>
                    <div class="toggle">
                        <svg class="icon" aria-hidden="true" v-if="isToggle" @click="isToggle = !isToggle">
                            <use xlink:href="#icon-xiajiantou"></use>
                        </svg>
                        <svg class="icon" aria-hidden="true" v-else @click="isToggle = !isToggle">
                            <use xlink:href="#icon-shangjiantou"></use>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="song-item" v-for="(item, index) in playListTracks" :key="item.id" :data-songId="item.id"
                @contextmenu="openContextMenu" @dblclick="playAllSong(item.id, index)">
                <div class="num">{{ fixedNum(index + 1) }}</div>
                <div class="title">
                    <span class="bold">{{ item.name }}</span>
                    <span class="alia" v-if="item.alia != ''">（{{ item.alia[0] }}）</span>
                </div>
                <div class="artist">
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

            <!-- 歌曲右键菜单 -->
            <div id="contextMenu">
                <div class="menu-item sub">
                    收藏歌单
                    <div class="submenu">
                        <div class="submenu-item" v-for="playlist in userPlaylist?.slice(0, createdPlaylistCount)"
                            :key="playlist.id" @click="updatePlaylistSongs('add', playlist.id)">
                            {{ playlist.name }}
                        </div>
                    </div>
                </div>
                <div class="menu-item" @click="updatePlaylistSongs('del')">
                    从歌单中删除
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, computed, reactive, getCurrentInstance, watch, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { dayjs } from 'element-plus'

export default {
    name: 'PlayList',
    setup() {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const playlistId = computed(() => router.currentRoute.value.params.id);
        const playListDetailParams = reactive({
            id: playlistId
        });
        const playListTracks = computed(() => store.state.playlist.playListDetail?.tracks || {});
        const userPlaylistId = computed(() => store.getters.userPlaylistId);

        const userId = computed(() => store.state.user.userId);
        const creatorId = computed(() => {
            if (userPlaylistId.value.has(parseInt(playlistId.value))) {
                return userPlaylistId.value.get(parseInt(playlistId.value));
            }
            return -1;
        });
        const userPlaylist = computed(() => store.state.user.userPlaylist);
        const createdPlaylistCount = computed(() => store.state.user.userSubcount?.createdPlaylistCount);

        const isSubscribe = ref(false);
        const isSelf = computed(() => userId.value === creatorId.value);
        const isToggle = ref(true);

        let selectedSongIds = [];

        onMounted(() => {
            getData();
            let menuItem = document.querySelector('#contextMenu .sub');

            menuItem.addEventListener('mouseenter', () => {
                let submenu = document.querySelector('#contextMenu .sub .submenu');
                submenu.style.visibility = 'visible';
            });
            menuItem.addEventListener('mouseleave', () => {
                let submenu = document.querySelector('#contextMenu .sub .submenu');
                submenu.style.visibility = 'hidden';
            });

            // 点击事件收回右键菜单
            window.onclick = function (e) {
                // 清除选中的歌曲
                selectedSongIds.length = 0;
                let menu = document.querySelector('#contextMenu');
                let submenu = document.querySelector('#contextMenu .sub .submenu');
                if (menu) {
                    menu.style.visibility = 'hidden';
                }
                if (submenu) {
                    submenu.style.visibility = 'hidden';
                }
            }
        })

        watch(router.currentRoute, () => {
            getData();
        })

        function getData() {
            playListDetailParams.timestamp = new Date().getTime();
            store.dispatch('getPlayListDetail', playListDetailParams).then(() => {
                checkSubscribe();
            });
        }

        function checkSubscribe() {
            if (userPlaylistId.value.has(parseInt(playlistId.value))) {
                isSubscribe.value = true;
            } else {
                isSubscribe.value = false;
            }
        }

        function fixedNum(num) {
            return num < 10 ? '0' + num : '' + num;
        }

        function playAllSong(curSongId, curSongIndex) {
            proxy.$Mitt.emit('clearSongList');
            for (let i = 0; i < playListTracks.value.length; i++) {
                let item = playListTracks.value[i];
                let newItem = { id: item.id, name: item.name, artist: item.ar, len: item.dt };
                proxy.$Mitt.emit('addSong', { song: newItem });
            }
            if (typeof curSongId === 'number') {
                proxy.$Mitt.emit('playSong', { songId: curSongId, songIndex: curSongIndex });
            } else {
                proxy.$Mitt.emit('playSong', { songId: playListTracks.value[0].id, songIndex: 0 });
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

        function changeSubscribe() {
            if (!isSelf.value) {
                let t = isSubscribe.value ? 2 : 1;
                // 收藏歌单
                store.dispatch('getSubPlaylist', { t, id: playlistId.value, timestamp: new Date().getTime() }).then((msg) => {
                    console.log(msg);
                    // 切换显示状态
                    isSubscribe.value = !isSubscribe.value;

                    // 获取当前创建歌单数量和收藏歌单数量
                    store.dispatch('getUserSubcount', { timestamp: new Date().getTime() }).then(() => {
                        // 获取用户歌单
                        store.dispatch('getUserPlaylist', { uid: userId.value, timestamp: new Date().getTime() });
                    });
                });
            }
        }

        function updatePlaylistSongs(op, pid = playlistId.value) {
            let tracks = selectedSongIds.join(',');
            // 只能操作自己创建的歌单
            if (isSelf.value) {
                // 添加或删除歌曲到歌单
                store.dispatch('getUpdatePlaylistTrack', { op, pid, tracks }).then((msg) => {
                    console.log(msg);
                    playListDetailParams.timestamp = new Date().getTime();
                    // 更新歌曲列表
                    store.dispatch('getPlayListDetail', playListDetailParams);
                });
            }
        }

        function openContextMenu(e) {
            // 取消默认的浏览器右键菜单
            e.preventDefault();
            // 获取自定义的右键菜单
            let menu = document.getElementById('contextMenu');
            menu.style.left = e.clientX + 'px';
            menu.style.top = e.clientY + 'px';
            menu.style.visibility = 'visible';
            selectedSongIds.push(parseInt(e.currentTarget.getAttribute('data-songId')));
        }

        return {
            isSubscribe,
            isSelf,
            isToggle,
            fixedNum,
            playAllSong,
            toSongLen,
            fixedDate,
            fixedCount,
            showAlbumDetail,
            showArtistHome,
            changeSubscribe,
            openContextMenu,
            updatePlaylistSongs,
            playListDetail: computed(() => store.state.playlist.playListDetail || {}),
            playListTracks,
            userPlaylist,
            createdPlaylistCount,
        }
    }
}
</script>

<style lang="less" scoped>
.playlist {
    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        font-weight: 500;
    }

    .disabled {
        color: #c3c3c3;
        cursor: default;

        .icon {
            fill: #c3c3c3;
        }
    }

    .icon {
        width: 14px;
        height: 14px;
        fill: #9b9b9b;
        position: relative;
        top: 2px;
        margin-right: 2px;
    }

    .playlist-detail {
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

            .creator {
                margin: 15px 0 20px;
                font-size: 12px;
                display: flex;
                align-items: center;

                img {
                    width: 21px;
                    height: 21px;
                    margin-right: 8px;
                }

                .publish-time {
                    margin-left: 8px;
                    font-weight: 300;
                }
            }

            .creator .clickable {
                color: #4c70a4;
                cursor: pointer;
            }

            .func {
                font-size: 12px;
                line-height: 14px;
                display: flex;

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


            .count {
                margin: 18px 0 10px;
                display: flex;
                font-weight: 300;

                .trackcount {
                    margin-right: 8px;
                }
            }

            .desc {
                display: flex;
                justify-content: space-between;

                .content {
                    line-height: 1.75;
                    font-weight: 300;
                    max-width: 500px;
                    min-width: 500px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .descToggle {
                    white-space: normal;
                }

                .toggle {
                    margin-left: 15px;
                    cursor: pointer;
                }
            }

            span {
                font-weight: 400;
            }
        }
    }

    .container {
        margin-top: 35px;

        #contextMenu {
            position: fixed;
            visibility: hidden;
            background-color: #f0f0f0;
            width: 180px;
            padding: 4px;
            font-size: 14px;
            border: 1px solid black;
            border-radius: 10px;

            .menu-item {
                line-height: 22px;
                height: 22px;
                cursor: default;
                border-radius: 10px;
                width: 166px;
                padding: 4px 8px;

                .submenu {
                    width: 210px;
                    padding: 4px;
                    border: 1px solid black;
                    border-radius: 10px;
                    background-color: #f0f0f0;
                    position: relative;
                    left: 165px;
                    top: -35px;
                    visibility: hidden;
                    color: black;

                    .submenu-item {
                        cursor: default;
                        border-radius: 10px;
                        padding: 4px 8px;
                        width: 166px;
                        white-space: nowrap;
                        overflow: hidden;
                    }

                    .submenu-item:hover {
                        background-color: #102db9;
                        color: white;
                    }
                }
            }

            .menu-item:hover {
                background-color: #102db9;
                color: white;
            }
        }

        .song-item {
            display: flex;
            height: 34px;
            font-size: 12px;
            font-weight: 400;
            align-items: center;
            color: #696969;
            cursor: default;

            .num {
                margin-left: 8px;
                width: 30px;
                color: #c3c3c3;
            }

            .title {
                margin-left: 10px;
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
}
</style>
