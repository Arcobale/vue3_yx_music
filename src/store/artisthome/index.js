import { reqArtistDesc, reqArtistDetail, reqArtistTopSong } from "@/api";

const state = {
    artistDesc: {},
    artistDetail: {},
    artistTopSong: [],
};

const mutations = {
    ARTISTDESC(state, artistDesc) {
        state.artistDesc = artistDesc;
    },
    ARTISTDETAIL(state, artistDetail) {
        state.artistDetail = artistDetail;
    },
    ARTISTTOPSONG(state, artistTopSong) {
        state.artistTopSong = artistTopSong;
    }
};

const actions = {
    async getArtistDesc({commit}, params) {
        let res = await reqArtistDesc(params);
        if (res.code == 200) {
            commit('ARTISTDESC', res);
        }
    },
    async getArtistDetail({commit}, params) {
        let res = await reqArtistDetail(params);
        if (res.code == 200) {
            commit('ARTISTDETAIL', res.data.artist);
        }
    },
    async getArtistTopSong({commit}, params) {
        let res = await reqArtistTopSong(params);
        if (res.code == 200) {
            commit('ARTISTTOPSONG', res.songs);
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