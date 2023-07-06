import { reqPlayListAll, reqSongDetail, reqTopListDetail, reqSongUrl } from "@/api";

const state = {
    playListAll: [],
    songDetail: [],
    playListDetail: {},
    songUrl: {},
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
    },
    SONGURL(state, songUrl) {
        state.songUrl = songUrl;
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
    },
    async getSongUrl({commit}, params) {
        let res = await reqSongUrl(params);
        if (res.code == 200) {
            commit('SONGURL', res.data);
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