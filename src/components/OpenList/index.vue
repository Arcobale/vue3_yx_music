<template>
    <div class="openlist">
        <el-drawer v-model="isOpen" direction="rtl" size="42%" z-index="10">
            <div class="header">
                <div class="title">当前播放</div>
                <div class="subtitle">
                    <span class="count">总{{ playData.length }}首</span>
                    <div class="right">
                        <span class="button">收藏全部</span>
                        <span class="button" @click="clearList">清空列表</span>
                    </div>
                </div>
            </div>
            <el-table :data="playData" stripe highlight-current-row height="470px">
                <el-table-column property="name" width="195" />
                <el-table-column property="artist" width="120" />
                <el-table-column class="len" property="len" />
            </el-table>
        </el-drawer>
    </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'OpenList',
    setup() {
        const store = useStore();
        const { proxy } = getCurrentInstance();

        const isOpen = ref(false);
        const songDetailParams = reactive({
            ids: 1
        });
        const playData = reactive([]);

        onMounted(() => {

        })

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

        function arrToString(artists) {
            if (artists.length <= 1) {
                return artists[0].name;
            } else {
                let res = artists[0].name;
                for (let i = 1; i < artists.length; i++) {
                    res += '/' + artists[i].name;
                }
                return res;
            }
        }

        function clearList() {
            proxy.$Mitt.emit('clearSongList');
        }

        proxy.$Mitt.on('clearSongList', () => {
            playData.length = 0;
            proxy.$Mitt.emit('stopCurSong');
        })

        proxy.$Mitt.on('openList', () => {
            isOpen.value = true;
        })

        proxy.$Mitt.on('addSong', (song) => {
            songDetailParams.ids = song.id;
            playData.push({
                name: song.name,
                artist: arrToString(song.artist),
                len: toSongLen(song.len),
            });
        })

        return {
            isOpen,
            playData,
            clearList,
        }

    }

}
</script>

<style lang="less" scoped>
.openlist {
    font-size: 12px;

    :deep(.el-drawer__header) {
        height: 50px;
        padding: 0px;
        margin: 0px;
    }

    .header {
        height: 70px;
        box-sizing: border-box;
        padding-top: 15px;
        // border-bottom: 1px solid #c3c3c3;

        .title {
            font-size: 20px;
            font-weight: 600;
        }

        .subtitle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 18px;
            height: 12px;
            line-height: 12px;

            .count {
                font-size: 10px;
                color: #c3c3c3;
                text-align: center;
            }

            .right {
                display: flex;
                font-size: 12px;

                .button {
                    margin-left: 22px;
                }
            }
        }
    }

    .len {
        color: #c3c3c3;
    }
}
</style>