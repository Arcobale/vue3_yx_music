import { reqPlayListAll, reqSongDetail, reqTopListDetail, reqSongUrl, reqAlbumDetail, reqAlbumDetailDynamic } from "@/api";

const state = {
    playListAll: [],
    songDetail: [],
    playListDetail: {},
    songUrl: {},
    albumDetail: {},
    albumDetailDynamic: {},
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
    },
    ALBUMDETAILDYNAMIC(state, albumDetailDynamic) {
        state.albumDetailDynamic = albumDetailDynamic;
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
    },
    async getAlbumDetailDynamic({commit}, params) {
        let res = await reqAlbumDetailDynamic(params);
        if (res.code == 200) {
            commit('ALBUMDETAILDYNAMIC', res);
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