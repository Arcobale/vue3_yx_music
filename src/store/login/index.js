import { reqQRKey, reqQRCodeLink, reqQRCheck, reqSentCaptcha, reqVerifyCaptcha, reqLoginPhone } from "@/api";

const state = {
    QRKey: '',
    QRCodeLink: '',
    avatarUrl: '',
    nickname: '',
    cookie: '',
    status: -1,
};

const mutations = {
    QRKEY(state, QRKey) {
        state.QRKey = QRKey;
    },
    QRCODELINK(state, QRCodeLink) {
        state.QRCodeLink = QRCodeLink;
    },
    USERINFO(state, res) {
        state.avatarUrl = res.avatarUrl;
        state.nickname = res.nickname;
        state.status = res.code;
    },
    COOKIE(state, res) {
        state.cookie = res.cookie;
        state.status = res.code;
    },
    LOGINPHONE(state, res) {
        
    }
};

const actions = {
    async getQRKey({ commit }) {
        let res = await reqQRKey();
        if (res.code == 200) {
            commit('QRKEY', res.data.unikey);
        }
    },
    async getQRCodeLink({ commit }, params) {
        let res = await reqQRCodeLink(params);
        if (res.code == 200) {
            commit('QRCODELINK', res.data.qrimg);
        }
    },
    async getQRCheck({ commit }, params) {
        let res = await reqQRCheck(params);
        if (res.code == 802) {
            commit('USERINFO', res);
        } else if (res.code == 803) {
            commit('COOKIE', res);
        }
    },
    async getSentCaptcha({commit}, params) {
        let res = await reqSentCaptcha(params);
        if (res.code == 200) {
            return 'ok';
        }
    },
    async getVerifyCaptcha({commit}, params) {
        let res = await reqVerifyCaptcha(params);
        if (res.code == 200) {
            return 'ok';
        }
    },
    async getLoginPhone({commit}, params) {
        let res = await reqLoginPhone(params);
        if (res.code == 200) {
            commit('LOGINPHONE', res);
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