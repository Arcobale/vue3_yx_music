import { reqPersonalizedList } from '@/api';

const state = {
    personalizedList: []
};

const mutations = {
    PERSONALIZEDLIST(state, personalizedList) {
        state.personalizedList = personalizedList;
    }
};

const actions = {
    async getPersonalizedList({commit}, limit) {
        let res = await reqPersonalizedList(limit);
        if (res.code == 200) {
            commit('PERSONALIZEDLIST', res.data);
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