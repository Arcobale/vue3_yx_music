import { reqArtistDesc, reqArtistDetail, reqArtistTopSong, reqSimiArtist, reqArtistAlbum, reqArtistMV } from "@/api";

const state = {
    artistDesc: {},
    artistDetail: {},
    artistTopSong: [],
    simiArtist: [],
    artistAlbum: [],
    artistMV: []
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
    },
    SIMIARTIST(state, simiArtist) {
        state.simiArtist = simiArtist;
    },
    ARTISTALBUM(state, artistAlbum) {
        state.artistAlbum = artistAlbum;
    },
    ARTISTMV(state, artistMV) {
        state.artistMV = artistMV;
    }
};

const actions = {
    async getArtistDesc({commit}, params) {
        let res = await reqArtistDesc(params);
        if (res.code == 200) {
            commit('ARTISTDESC', res.introduction);
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
    },
    async getSimiArtist({commit}, params) {
        let res = await reqSimiArtist(params);
        if (res.code == 200) {
            commit('SIMIARTIST', res.songs);
        }
    },
    async getArtistAlbum({commit}, params) {
        let res = await reqArtistAlbum(params);
        if (res.code == 200) {
            commit('ARTISTALBUM', res.hotAlbums);
        }
    },
    async getArtistMV({commit}, params) {
        let res = await reqArtistMV(params);
        if (res.code == 200) {
            commit('ARTISTMV', res.mvs);
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