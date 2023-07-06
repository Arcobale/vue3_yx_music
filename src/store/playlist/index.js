import { reqPlayListAll, reqSongDetail, reqTopListDetail } from "@/api";

const state = {
    playListAll: [],
    songDetail: [],
    playListDetail: {},
};

const mutations = {
    PLAYLISTALL(state, playListAll) {
        state.playListAll = playListAll;
    },
    SONGDETAIL(state, songDetail) {
        state.songDetail = songDetail;
    },
    PLAYLISTDETAIL(state, playListDetail) {
        state.playListDetail = playListDetail;
    }
};

const actions = {
    async getPlayListAll({commit}, params) {
        let res = await reqPlayListAll(params);
        if (res.code == 200) {
            commit('PLAYLISTALL', res.songs);
        }
    },
    async getSongDetail({commit}, params) {
        let res = await reqSongDetail(params);
        if (res.code == 200) {
            commit('SONGDETAIL', res.songs);
        }
    },
    async getPlayListDetail({commit}, params) {
        let res = await reqTopListDetail(params);
        if (res.code == 200) {
            commit('PLAYLISTDETAIL', res.playlist);
        }
    }
};

const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
}