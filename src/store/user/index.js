import { reqLikeList } from '@/api'

const state = {
    likeList: [],
};

const mutations = {
    LIKELIST(state, likeList) {
        state.likeList = likeList;
    },
};

const actions = {
    async getLikeList({ commit }, params) {
        let res = await reqLikeList(params);
        if (res.code == 200) {
            commit('LIKELIST', res.data);
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