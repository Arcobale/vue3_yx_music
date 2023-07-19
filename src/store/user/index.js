import { reqLikeList, reqUserSubcount, reqUserAccount, reqUserPlaylist, reqSubPlaylist } from '@/api'

const state = {
    userSubcount: {},
    userAccount: {},
    userId: -1,
    likeListId: [],
    userPlaylist: [],
};

const mutations = {
    USERSUBCOUNT(state, userSubcount) {
        state.userSubcount = userSubcount;
    },
    USERACCOUNT(state, res) {
        state.userAccount = res.profile;
        state.userId = res.profile.userId;
    },
    LIKELIST(state, likeListId) {
        state.likeListId = likeListId;
    },
    USERPLAYLIST(state, userPlaylist) {
        state.userPlaylist = userPlaylist;
    },
};

const actions = {
    async getUserSubcount({ commit }) {
        let res = await reqUserSubcount();
        if (res.code == 200) {
            commit('USERSUBCOUNT', res);
        }
    },
    async getUserAccount({ commit }) {
        let res = await reqUserAccount();
        if (res.code == 200) {
            commit('USERACCOUNT', res);
            return Promise.resolve(res.profile.userId);
        }
    },
    async getLikeList({ commit }, params) {
        let res = await reqLikeList(params);
        if (res.code == 200) {
            commit('LIKELIST', res.ids);
        }
    },
    async getUserPlaylist({ commit }, params) {
        let res = await reqUserPlaylist(params);
        if (res.code == 200) {
            commit('USERPLAYLIST', res.playlist);
        }
    },

    async getSubPlaylist({commit}, params) {
        let res = await reqSubPlaylist(params);
        if (res.code == 200) {
            return 'ok';
        } else {
            Promise.reject('操作失败！');
        }
    }
};

const getters = {
    userPlaylistId(state) {
        let { userPlaylist } = state;
        let ids = new Map();
        for (let playlist of userPlaylist) {
            // ids.push({ id: playlist.id, creatorId: playlist.creator.userId });
            ids.set(playlist.id, playlist.creator.userId);
        }
        return ids;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}