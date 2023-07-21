<template>
    <div class="allmv">
        <div class="breadcrumb">
            <div class="category-area">
                <div class="key">
                    地区：
                </div>
                <ul class="value" @click="changeArea">
                    <li class="clickable"><span class="active">全部</span></li>
                    <li class="clickable"><span>内地</span></li>
                    <li class="clickable"><span>港台</span></li>
                    <li class="clickable"><span>欧美</span></li>
                    <li class="clickable"><span>韩国</span></li>
                    <li class="clickable"><span>日本</span></li>
                </ul>
            </div>
            <div class="category-type">
                <div class="key">
                    类型：
                </div>
                <ul class="value" @click="changeType">
                    <li class="clickable"><span class="active">全部</span></li>
                    <li class="clickable"><span>官方版</span></li>
                    <li class="clickable"><span>原声</span></li>
                    <li class="clickable"><span>现场版</span></li>
                    <li class="clickable"><span>网易出品</span></li>
                </ul>
            </div>
            <div class="category-order">
                <div class="key">
                    排序：
                </div>
                <ul class="value" @click="changeOrder">
                    <li class="clickable"><span class="active">上升最快</span></li>
                    <li class="clickable"><span>最热</span></li>
                    <li class="clickable"><span>最新</span></li>
                </ul>
            </div>
        </div>
        <div class="container">
            <div class="container-item clickable" v-for="item in MVAll" :key="item?.id" @click="showMVDetail(item?.id)">
                <img :src="item?.cover" alt="">
                <div class="mask">
                    <div class="count">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-play1"></use>
                        </svg>
                        {{ fixedCount(item?.playCount) }}
                    </div>
                </div>
                <span class="name">
                    {{ item?.name }}
                </span>
                <div class="creator">
                    <span class="clickable" @click="showArtistHome(item?.artists?.[0]?.id)">
                        {{ item?.artists?.[0]?.name }}
                    </span>
                    <span v-if="item?.artists?.length > 1">
                        <span v-for="ar in item?.artists?.slice(1)" :key="ar.id">
                            / <span class="clickable" @click="showArtistHome(ar.id)">{{ ar.name }}</span>
                        </span>
                    </span>
                </div>
            </div>
        </div>

        <div class="pagination">
            <el-pagination background layout="prev, pager, next" :page-count="pageCount" :pager-count="9"
                v-model:current-page="currentPage" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'AllMV',
    setup() {
        const store = useStore();
        const router = useRouter();

        const curArea = ref(router.currentRoute.value.query.area);
        const curType = ref(router.currentRoute.value.query.type);
        const curOrder = ref(router.currentRoute.value.query.order);
        const pageCount = ref(0);
        const currentPage = ref(1);

        const MVAllParams = reactive({
            area: curArea,
            type: curType,
            order: curOrder,
            limit: 96,
            offset: 0,
        });

        const MVAll = computed(() => store.state.mv.MVAll);

        onMounted(() => {
            getData();
        });

        watch(router.currentRoute, () => {
            getData();
        })

        function getData() {
            // 找到选中的地区
            let curActiveElement = document.querySelector('.category-area .active');
            let elements = document.querySelectorAll('.category-area span');
            if (curActiveElement) {
                curActiveElement.classList.remove('active');
            }
            curArea.value = router.currentRoute.value.query.area;
            for (let e of elements) {
                if (e.innerHTML === curArea.value) {
                    e.classList.add('active');
                }
            }

            // 找到选中的类型
            curActiveElement = document.querySelector('.category-type .active');
            elements = document.querySelectorAll('.category-type span');
            if (curActiveElement) {
                curActiveElement.classList.remove('active');
            }
            curType.value = router.currentRoute.value.query.type;
            for (let e of elements) {
                if (e.innerHTML === curType.value) {
                    e.classList.add('active');
                }
            }

            // 找到选中的排序
            curActiveElement = document.querySelector('.category-order .active');
            elements = document.querySelectorAll('.category-order span');
            if (curActiveElement) {
                curActiveElement.classList.remove('active');
            }
            curOrder.value = router.currentRoute.value.query.order;
            for (let e of elements) {
                if (e.innerHTML === curOrder.value) {
                    e.classList.add('active');
                }
            }
            store.dispatch('getMVAll', MVAllParams).then((total) => {
                pageCount.value = Math.ceil(total / MVAllParams.limit);
            });
        }

        function showMVDetail(mvId) {
            // router.push({
            //     name: 'mv',
            //     params: {
            //         id: mvId
            //     }
            // });
        }

        function showArtistHome(artistId) {
            router.push({
                name: 'artisthome', params: {
                    id: artistId
                }
            })
        }

        function fixedCount(num) {
            return num > 99999999 ? parseInt(num / 100000000) + '亿' : num > 99999 ? parseInt(num / 10000) + '万' : num + '';
        }

        function changeArea() {
            let element = event.target;
            router.push({
                path: '/allmv',
                query: {
                    area: element.innerHTML,
                    type: curType.value,
                    order: curOrder.value,
                }
            });
        }

        function changeType() {
            let element = event.target;
            router.push({
                path: '/allmv',
                query: {
                    area: curArea.value,
                    type: element.innerHTML,
                    order: curOrder.value,
                }
            });
        }

        function changeOrder() {
            let element = event.target;
            router.push({
                path: '/allmv',
                query: {
                    area: curArea.value,
                    type: curType.value,
                    order: element.innerHTML,
                }
            });
        }

        function handleCurrentChange(val) {
            MVAllParams.offset = (val - 1) * MVAllParams.limit;
            store.dispatch('getMVAll', MVAllParams);
        }

        return {
            showMVDetail,
            showArtistHome,
            fixedCount,
            changeArea,
            changeType,
            changeOrder,
            handleCurrentChange,
            MVAll,
            pageCount,
            currentPage
        }
    }
}
</script>

<style lang="less" scoped>
.allmv {
    width: 730px;
    font-size: 12px;

    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        font-weight: 500;
    }

    .active {
        color: #c24639;
        background-color: #ffeeeb;
    }

    .breadcrumb {
        font-size: 10px;
        line-height: 18px;

        .category-area,
        .category-type,
        .category-order {
            display: flex;
            margin-bottom: 14px;

            .key {
                font-weight: 600;
                width: 36px;
            }

            ul {
                display: flex;
                flex-wrap: wrap;
                font-weight: 400;

                li {
                    display: block;
                    width: 75px;
                    box-sizing: border-box;
                    text-align: center;
                    border-left: 1px solid #e0e0e0;

                    span {
                        padding: 4px 10px;
                        border-radius: 20px;
                    }
                }

                li:first-child {
                    border-left: none;
                }
            }
        }

        .category-initial {
            li {
                margin-bottom: 14px;
            }
        }
    }

    .container {
        width: 730px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 16px;
        row-gap: 38px;
        margin-top: 16px;

        .container-item {
            img {
                width: 233px;
                height: 130px;
                border-radius: 10px;
            }

            .mask {
                width: 233px;
                height: 130px;
                background-color: transparent;
                position: absolute;
                transform: translate(0, -100%);
                color: white;

                .count {
                    position: absolute;
                    top: 6px;
                    right: 8px;

                    .icon {
                        width: 12px;
                        height: 12px;
                        fill: white;
                    }
                }

                .length {
                    position: absolute;
                    bottom: 6px;
                    right: 8px;
                }
            }

            .name {
                display: block;
                min-width: 233px;
                max-width: 233px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 8px;
                margin-top: 8px;

                .alia {
                    display: inline;
                    color: #656464;
                }
            }

            .creator {
                max-width: 233px;
                min-width: 233px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                color: #656464;

                span {
                    display: inline;
                }
            }

            .clickable:hover {
                font-weight: 500;
            }
        }

        .container-item:nth-child(2n) {
            background-color: #fafafa;
        }

        .container-item:hover {
            background-color: #f0f0f0;
        }
    }

    .pagination {
        display: flex;
        justify-content: center;
        margin: 40px 0 80px;
    }
}
</style>