import { reqLikeList, reqUserSubcount, reqUserAccount, reqUserPlaylist } from '@/api'

const state = {
    userSubcount: {},
    userAccount: {},
    likeListId: [],
    userPlaylist: [],
};

const mutations = {
    USERSUBCOUNT(state, userSubcount) {
        state.userSubcount = userSubcount;
    },
    USERACCOUNT(state, userAccount) {
        state.userAccount = userAccount;
    },
    LIKELIST(state, likeListId) {
        state.likeListId = likeListId;
    },
    USERPLAYLIST(state, userPlaylist) {
        state.userPlaylist = userPlaylist;
    },
};

const actions = {
    async getUserSubcount({commit}) {
        let res = await reqUserSubcount();
        if (res.code == 200) {
            commit('USERSUBCOUNT', res);
        }
    },
    async getUserAccount({commit}) {
        let res = await reqUserAccount();
        if (res.code == 200) {
            commit('USERACCOUNT', res.profile);
            return Promise.resolve(res.profile.userId);
        }
    },
    async getLikeList({ commit }, params) {
        let res = await reqLikeList(params);
        if (res.code == 200) {
            commit('LIKELIST', res.ids);
        }
    },
    async getUserPlaylist({commit}, params) {
        let res = await reqUserPlaylist(params);
        if (res.code == 200) {
            commit('USERPLAYLIST', res.playlist);
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