import { reqPlayListAll, reqSongDetail, reqTopListDetail, reqSongUrl, reqAlbumDetail } from "@/api";

const state = {
    playListAll: [],
    songDetail: [],
    playListDetail: {},
    songUrl: {},
    albumDetail: {},
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
    },
    ALBUMDETAIL(state, albumDetail) {
        state.albumDetail = albumDetail;
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
    },
    async getAlbumDetail({commit}, params) {
        let res = await reqAlbumDetail(params);
        if (res.code == 200) {
            commit('ALBUMDETAIL', res);
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