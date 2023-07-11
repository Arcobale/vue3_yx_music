import { reqSearch, reqSearchDefault, reqSearchHot, reqSearchHotDetail, reqSearchSuggest, reqSearchMultiMatch } from "@/api";

const state = {
    searchListSong: [],
    bestMatch: {},
    count: 0,

    searchListArtist: [],
    searchListAlbum: [],
    searchListPlayList: [],
    searchListVideo: [],

    searchDefault: '',
    searchHot: [],
    searchHotDetail: [],
    searchSuggest: [],
    searchMultiMatch: [],
};

const mutations = {
    SEARCHLISTSONG(state, res) {
        state.searchListSong = res.result.songs;
        state.count = res.result.songCount;
        state.bestMatch = res.result.songs[0].artists[0];
    },
    SEARCHLISTARTIST(state, res) {
        state.searchListArtist = res.result.artists;
        state.count = res.result.artistCount;
    },
    SEARCHLISTALBUM(state, res) {
        state.searchListAlbum = res.result.albums;
        state.count = res.result.albumCount;
    },
    SEARCHLISTPLAYLIST(state, res) {
        state.searchListPlayList = res.result.playlists;
        state.count = res.result.playlistCount;
    },
    SEARCHLISTVIDEO(state, res) {
        state.searchListVideo = res.result.mvs;
        state.count = res.result.mvCount;
    },


    SEARCHDEFAULT(state, searchDefault) {
        state.searchDefault = searchDefault;
    },
    SEARCHHOT(state, searchHot) {
        state.searchHot = searchHot;
    },
    SEARCHHOTDETAIL(state, searchHotDetail) {
        state.searchHotDetail = searchHotDetail;
    },
    SEARCHSUGGEST(state, searchSuggest) {
        state.searchSuggest = searchSuggest;
    },
    SEARCHMULTIMATCH(state, searchMultiMatch) {
        state.searchMultiMatch = searchMultiMatch;
    }
};

const actions = {
    async getSearchList({commit}, params) {
        let res = await reqSearch(params);
        if (res.code == 200) {
            // 1:单曲，10:专辑，100:歌手，1000:歌单，1004:MV，1014:视频
            if (params.type === 1) {
                commit('SEARCHLISTSONG', res);
            } else if (params.type === 100) {
                commit('SEARCHLISTARTIST', res);
            } else if (params.type === 10) {
                commit('SEARCHLISTALBUM', res);
            } else if (params.type === 1000) {
                commit('SEARCHLISTPLAYLIST', res);
            } else {
                commit('SEARCHLISTVIDEO', res);
            }
        }
    },
    async getSearchDefault({commit}) {
        let res = await reqSearchDefault();
        if (res.code == 200) {
            commit('SEARCHDEFAULT', res.data.realkeyword);
        }
    },
    async getSearchHot({commit}) {
        let res = await reqSearchHot();
        if (res.code == 200) {
            commit('SEARCHHOT', res.data);
        }
    },
    async getSearchHotDetail({commit}) {
        let res = await reqSearchHotDetail();
        if (res.code == 200) {
            commit('SEARCHHOTDETAIL', res.data);
        }
    },
    async getSearchSuggest({commit}, params) {
        let res = await reqSearchSuggest(params);
        if (res.code == 200) {
            commit('SEARCHSUGGEST', res.data);
        }
    },
    async getSearchMultiMatch({commit}, params) {
        let res = await reqSearchMultiMatch(params);
        if (res.code == 200) {
            commit('SEARCHMULTIMATCH', res.data);
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