import { reqMVDetail, reqVideoCategoryList, reqVideoGroup, reqVideoAll, reqVideoGroupList } from "@/api";

const state = {
    MVDetail: {},
    videoGroupList: [],
    videoCategoryList: [],
    videoGroup: [],
    videoAll: [],
    hasMore: false,
};

const mutations = {
    MVDETAIL(state, MVDetail) {
        state.MVDetail = MVDetail;
    },
    VIDEOGROUPLIST(state, videoGroupList) {
        state.videoGroupList = videoGroupList;
    },
    VIDEOCATEGORYLIST(state, videoCategoryList) {
        state.videoCategoryList = videoCategoryList;
    },
    VIDEOGROUP(state, res) {
        state.videoGroup = res.datas;
        state.hasMore = res.hasMore;
    },
    VIDEOALL(state, res) {
        state.videoAll = res.datas;
        state.hasMore = res.hasMore;
    }
};

const actions = {
    async getMVDetail({commit}, params) {
        let res = await reqMVDetail(params);
        if (res.code == 200) {
            commit('MVDETAIL', res.mvs);
        }
    },
    async getVideoGroupList({commit}) {
        let res = await reqVideoGroupList();
        if (res.code == 200) {
            commit('VIDEOGROUPLIST', res.data);
        }
    },
    async getVideoCategoryList({commit}) {
        let res = await reqVideoCategoryList();
        if (res.code == 200) {
            commit('VIDEOCATEGORYLIST', res.data);
        }
    },
    async getVideoGroup({commit}, params) {
        let res = await reqVideoGroup(params);
        if (res.code == 200) {
            commit('VIDEOGROUP', res);
        }
    },
    async getVideoAll({commit}, params) {
        let res = await reqVideoAll(params);
        if (res.code == 200) {
            commit('VIDEOALL', res);
        }
    },
};

const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
}