import { reqMVDetail } from "@/api";

const state = {
    MVDetail: {}
};

const mutations = {
    MVDETAIL(state, MVDetail) {
        state.MVDetail = MVDetail;
    }
};

const actions = {
    async getMVDetail({commit}, params) {
        let res = await reqMVDetail(params);
        if (res.code == 200) {
            commit('MVDETAIL', res.mvs);
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