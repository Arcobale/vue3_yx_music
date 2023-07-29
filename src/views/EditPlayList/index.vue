<template>
    <div class="edit-playlist">
        <div class="edit-text">
            <el-form :model="updatePlaylistForm" label-position="right" label-width="80px">
                <el-form-item label="歌单名：">
                    <el-input v-model="updatePlaylistForm.name" autocomplete="off" placeholder="" minlength="1" />
                </el-form-item>
                <el-form-item label="标签：">
                    <ul class="tag">
                        <li v-for="(tag, index) in updatePlaylistForm?.tags" :key="index">{{ tag }}</li>
                    </ul>
                    <span class="tag-empty" @click="addTagsDialogVisible = true;">添加标签</span>
                </el-form-item>
                <el-form-item label="简介：">
                    <el-input v-model="updatePlaylistForm.desc" autocomplete="off" placeholder="" type="textarea"
                        maxlength="1000" show-word-limit resize="none" rows="3" />
                </el-form-item>
            </el-form>

            <div class="confirm">
                <el-button class="submit" type="primary" @click="updatePlaylist">保存</el-button>
                <el-button class="cancel" type="primary" @click="go(-1)">取消</el-button>
            </div>
        </div>

        <div class="edit-cover">
            <img :src="playlistDetail?.coverImgUrl" alt="">
            <div class="button">编辑封面</div>
        </div>

        <!-- 标签选择对话框 -->
        <el-dialog v-model="addTagsDialogVisible" title="添加标签" center align-center draggable>
            <p>选择合适的标签，最多可选<span>3</span>个</p>


            <div class="menu">
                <div class="menu-item" v-for="(key, index) in playListCategories" :key="index">
                    <div class="key">{{ key }}</div>
                    <ul class="categorytwo">
                        <li v-for="(cat, index2) in playListSortedCategories[index]" :key="index2">
                            <div class="clickable" :class="{ activeCat: updatePlaylistForm?.tags.includes(cat.name)}" @click="modifyTags(cat.name)">{{ cat.name }}</div>
                        </li>
                    </ul>
                </div>
            </div>


            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="addTagsDialogVisible = false">
                        完成
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { onMounted, reactive, watch, computed, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
    name: 'EditPlayList',
    setup() {
        const router = useRouter();
        const store = useStore();

        const addTagsDialogVisible = ref(false);

        const playlistId = computed(() => router.currentRoute.value.query.id);
        const playlistDetail = computed(() => store.state.playlist.playListDetail);
        const updatePlaylistForm = reactive({
            id: playlistId.value,
            name: '',
            desc: '',
            tags: [],
        });

        onMounted(() => {
            // 获取所有标签
            store.dispatch('getPlayListTag');
            getData();
        })

        watch(router.currentRoute, () => {
            getData();
        })

        function getData() {
            store.dispatch('getPlayListDetail', { id: playlistId.value, timestamp: new Date().getTime() }).then(() => {
                updatePlaylistForm.name = store.state.playlist.playListDetail.name;
                updatePlaylistForm.desc = store.state.playlist.playListDetail.description;
                updatePlaylistForm.tags = [...store.state.playlist.playListDetail.tags];
            });
        }

        function updatePlaylist() {
            // 歌单名为必填
            if (updatePlaylistForm.name) {
                let { name, desc } = updatePlaylistForm;
                let tags = updatePlaylistForm.tags.join(';');
                store.dispatch('getUpdatePlaylist', { id: playlistId.value, name, desc, tags }).then((msg) => {
                    console.log(msg);
                    // 返回前一个页面
                    go(-1);
                })
            }
        }

        function go(step) {
            router.go(step);
        }

        function modifyTags(tag) {
            let exist = updatePlaylistForm.tags.includes(tag)
            let curActiveElements = document.querySelectorAll('.activeCat');
            let element = event.target;
            // 点击的标签未选中且还能添加标签
            if (!exist && curActiveElements.length < 3) {
                updatePlaylistForm.tags.push(tag);
                element.classList.add('activeCat');
            } else if (exist) {
                // 点击的标签已选中
                let delIndex = updatePlaylistForm.tags.indexOf(tag);
                updatePlaylistForm.tags.splice(delIndex, 1);
                element.classList.remove('activeCat');
            } else {
                // 不能继续添加标签
                console.log('最多可选三个标签');
            }
        }

        return {
            addTagsDialogVisible,
            updatePlaylistForm,
            playlistDetail,
            playListCategories: computed(() => store.state.home.playListCategories || {}),
            playListSortedCategories: computed(() => store.getters.playListSortedCategories || {}),
            updatePlaylist,
            modifyTags,
            go
        }
    }
}
</script>

<style lang="less" scoped>
.edit-playlist {
    font-size: 14px;
    display: flex;

    .edit-text {
        width: 510px;

        .el-form {
            .el-input {
                // width: 418px;
            }
        }

        :deep(.el-form-item__content) {
            line-height: 1em;
        }

        .tag-empty {
            text-decoration: underline;
            cursor: pointer;
        }

        .tag {
            display: flex;

            li {
                padding: 4px 10px;
                border-radius: 10px;
                border: 1px solid #c3c3c3;
                color: #c3c3c3;
                margin-right: 8px;
            }
        }

        .confirm {
            margin-left: 80px;
            margin-top: 40px;

            .el-button {
                width: 82px;
                // span {
                letter-spacing: 6px;
                // }
            }

            .submit {
                background-color: #c3473a;
                color: white;
                border-radius: 20px;
                border: 1px solid #c3c3c3;
            }

            .disabled {
                opacity: 0.5;
            }

            .cancel {
                background-color: white;
                color: black;
                border-radius: 20px;
                border: 1px solid #c3c3c3;
            }
        }
    }


    .edit-cover {
        margin-left: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
            width: 150px;
            height: 150px;
            border-radius: 10px;
        }

        .button {
            width: 92px;
            line-height: 30px;
            text-align: center;
            border: 1px solid #c3c3c3;
            border-radius: 20px;
            cursor: default;
            margin-top: 25px;
        }

        .button:hover {
            background-color: #d0d0d0;
        }
    }

    .el-dialog {
        padding-left: 20px;
        width: 420px;

        p {
            color: #c3c3c3;

            span {
                color: #c24639;
                font-weight: 500;
            }
        }

        .menu {
            margin-top: 24px;
            max-height: 280px;
            overflow: scroll;

            .activeCat {
                color: #c24639;
                background-color: #f9e3e0;
            }

            .clickable {
                cursor: pointer;
            }

            .clickable:hover {
                color: #c24639;
            }

            .menu-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 30px;

                .key {
                    color: #c3c3c3;
                    width: 60px;
                    padding: 4px 15px;
                }

                ul {
                    display: grid;
                    font-weight: 400;
                    grid-template-columns: repeat(4, 92px);
                    row-gap: 4px;

                    li {
                        div {
                            display: block;
                            padding: 4px 15px;
                            border-radius: 20px;
                            max-width: fit-content;
                        }
                    }
                }
            }
        }
    }
}</style>