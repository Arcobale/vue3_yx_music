<template>
    <div class="hotsearch-list">
        <el-drawer v-model="isOpen" direction="rtl" size="35%" z-index="10">
            <div class="head">热搜榜</div>
            <div class="container">
                <div class="container-item" v-for="(item, index) in searchHotDetail" :key="index"
                    @click="search(item.searchWord)">
                    <span class="num" :class="{ topnum: index < 3 }">{{ index + 1 }}</span>
                    <div class="content">
                        <div class="top">
                            <span class="name" :class="{ topname: index < 3 }">{{ item.searchWord }}</span>
                            <span class="count">{{ item.score }}</span>
                        </div>
                        <span class="desc" v-if="item.content">{{ item.content }}</span>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'HotSearchList',
    setup() {
        const store = useStore();
        const router = useRouter();
        const { proxy } = getCurrentInstance();

        const isOpen = ref(false);
        onMounted(() => {
            
        })

        function search(keyword) {
            isOpen.value = false;
            router.push({
                name: 'searchlist', params: {
                    keyword
                }
            });
        }

        proxy.$Mitt.on('openHotSearchList', () => {
            isOpen.value = true;
            store.dispatch('getSearchHotDetail');
        })

        return {
            isOpen,
            searchHotDetail: computed(() => store.state.search.searchHotDetail || {}),
            search,
        }
    }

}
</script>

<style lang="less" scoped>
.hotsearch-list {
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
        height: 48px;
        font-size: 14px;
        line-height: 48px;
        padding-left: 20px;
    }

    .container {
        .container-item {
            display: flex;
            align-items: center;
            height: 53px;

            .num {
                width: 52px;
                text-align: center;
                font-weight: 600;
                color: #656464;
            }

            .topnum {
                color: #ea3126;
            }

            .content {
                .top {
                    display: flex;
                    align-items: flex-end;

                    .name {
                        font-weight: 400;
                    }

                    .count {
                        margin-left: 10px;
                        font-size: 10px;
                        color: #656464;
                    }

                    .topname {
                        font-weight: 600;
                    }
                }

                .desc {
                    display: block;
                    margin-top: 8px;
                    color: #656464;
                }
            }
        }

        .container-item:hover {
            background-color: #f0f0f0;
        }
    }
}</style>