import { reqRecentSong } from "@/api";

const state = {
    recentSong: [],
};

const mutations = {
    RECENTSONG(state, recentSong) {
        state.recentSong = recentSong;
    }
};

const actions = {
    async getRecentSong({commit}, params) {
        let res = await reqRecentSong(params);
        if (res.code == 200) {
            commit('RECENTSONG', res.data.list);
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