<template>
    <div class="song">
        <div class="container">
            <div class="song-item" v-for="(item, index) in topListDetail.slice(0, 5)" :key="item.id">
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
        <div class="all">
            查看全部
            <el-icon>
                <ArrowRight />
            </el-icon>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'SongTop',
    props: ['rankId'],

    setup(props) {
        console.log(props.rankId);
        const store = useStore();
        const topListDetail = ref([]);

        onMounted(() => {
            store.dispatch('getTopListDetail', { id: props.rankId }).then(() => {
                topListDetail.value = store.state.home.topListDetail
            });
        })

        return {
            topListDetail,
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