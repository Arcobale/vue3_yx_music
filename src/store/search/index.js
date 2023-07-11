import { reqSearch, reqSearchDefault, reqSearchHot, reqSearchHotDetail, reqSearchSuggest, reqSearchMultiMatch } from "@/api";

const state = {
    searchList: [],
    bestMatch: {},
    searchDefault: '',
    searchHot: [],
    searchHotDetail: [],
    searchSuggest: [],
    searchMultiMatch: [],
};

const mutations = {
    SEARCHLIST(state, res) {
        state.searchList = res.result;
        state.bestMatch = res.result.songs[0].artists[0];
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
            commit('SEARCHLIST', res);
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