import { reqLikeList, reqUserSubcount, reqUserAccount, reqUserPlaylist, reqSubPlaylist, reqAlbumSublist, reqArtistSublist, reqMVSublist, reqRecentSong, reqSubAlbum, reqUserDetail, reqSubArtist, reqSubMV, reqPersonalFM, reqLike } from '@/api'
import { reqUpdatePlaylistTrack, reqCreatePlaylist, reqDeletePlaylist, reqUpdatePlaylist } from '@/api'

const state = {
    userSubcount: {},
    userAccount: {},
    userId: -1,
    likeListId: [],
    userPlaylist: [],

    userAlbumSublist: [],
    userAlbumSubCount: 0,
    userArtistSublist: [],
    userArtistSubCount: 0,
    userMVSublist: [],
    userMVSubCount: 0,
    recentSong: [],

    personalFM: [],
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
    USERALBUMSUBLIST(state, res) {
        state.userAlbumSublist = res.data;
        state.userAlbumSubCount = res.count;
    },
    USERARTISTSUBLIST(state, res) {
        state.userArtistSublist = res.data;
        state.userArtistSubCount = res.count;
    },
    USERMVSUBLIST(state, res) {
        state.userMVSublist = res.data;
        state.userMVSubCount = res.count;
    },
    RECENTSONG(state, recentSong) {
        state.recentSong = recentSong;
    },
    PERSONALFM(state, personalFM) {
        state.personalFM = personalFM;
    }
};

const actions = {
    async getUserSubcount({ commit }, params) {
        let res = await reqUserSubcount(params);
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
    async getUserDetail({ commit }, params) {
        let res = await reqUserDetail(params);
        if (res.code == 200) {

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
    async getUserAlbumSublist({ commit }, params) {
        let res = await reqAlbumSublist(params);
        if (res.code == 200) {
            commit('USERALBUMSUBLIST', res);
        }
    },
    async getUserArtistSublist({ commit }, params) {
        let res = await reqArtistSublist(params);
        if (res.code == 200) {
            commit('USERARTISTSUBLIST', res);
        }
    },
    async getUserMVSublist({ commit }, params) {
        let res = await reqMVSublist(params);
        if (res.code == 200) {
            commit('USERMVSUBLIST', res);
        }
    },
    async getRecentSong({ commit }, params) {
        let res = await reqRecentSong(params);
        if (res.code == 200) {
            commit('RECENTSONG', res.data.list);
        }
    },

    async getSubPlaylist({ commit }, params) {
        let res = await reqSubPlaylist(params);
        if (res.code == 200) {
            if (params.t === 1) {
                return Promise.resolve('收藏成功！');
            } else {
                return Promise.resolve('歌单取消收藏成功！');
            }
        } else {
            return Promise.reject('操作失败！');
        }
    },
    async getSubAlbum({ commit }, params) {
        let res = await reqSubAlbum(params);
        if (res.code == 200) {
            if (params.t === 1) {
                return Promise.resolve('专辑已收藏');
            } else {
                return Promise.resolve('专辑取消收藏成功');
            }
        } else {
            return Promise.reject('操作失败！');
        }
    },
    async getSubArtist({ commit }, params) {
        let res = await reqSubArtist(params);
        if (res.code == 200) {
            if (params.t === 1) {
                return Promise.resolve('收藏成功！');
            } else {
                return Promise.resolve('歌手取消收藏成功！');
            }
        } else {
            return Promise.reject('操作失败！');
        }
    },
    async getSubMV({ commit }, params) {
        let res = await reqSubMV(params);
        if (res.code == 200) {
            if (params.t === 1) {
                return Promise.resolve('视频已收藏');
            } else {
                return Promise.resolve('视频取消收藏成功');
            }
        } else {
            return Promise.reject('操作失败！');
        }
    },
    async getLike({ commit }, params) {
        let res = await reqLike(params);
        if (res.code == 200) {
            if (params.like) {
                return Promise.resolve('已添加到我喜欢的音乐');
            } else {
                return Promise.resolve('取消喜欢成功');
            }
        } else {
            return Promise.reject('操作失败！');
        }
    },

    async getPersonalFM({ commit }, params) {
        let res = await reqPersonalFM(params);
        if (res.code == 200) {
            commit('PERSONALFM', res.data);
        }
    },


    // 关于歌单修改
    async getUpdatePlaylistTrack({commit}, params) {
        let res = await reqUpdatePlaylistTrack(params);
        if (res.body.code == 200) {
            if (params.op === 'add') {
                return Promise.resolve('添加歌曲成功');
            } else if (params.op === 'del') {
                return Promise.resolve('删除歌曲成功');
            }
        } else if (res.body.code == 502) {
            return Promise.reject(res.body.message);
        } else {
            return Promise.reject('操作失败！');
        }
    },
    async getCreatePlaylist({commit}, params) {
        let res = await reqCreatePlaylist(params);
        if (res.code == 200) {
            if (params.type === 'NORMAL') {
                return Promise.resolve('创建歌单成功');
            } else if (params.type === 'VIDEO') {
                return Promise.resolve('创建视频歌单成功');
            } else if (params.type === 'SHARED') {
                return Promise.resolve('创建共享歌单成功');
            }
        } else {
            return Promise.reject('操作失败！');
        }
    },
    async getDeletePlaylist({commit}, params) {
        let res = await reqDeletePlaylist(params);
        if (res.code == 200) {
            return Promise.resolve('删除歌单成功');
        } else {
            return Promise.reject('操作失败！');
        }
    },
    async getUpdatePlaylist({commit}, params) {
        let res = await reqUpdatePlaylist(params);
        if (res.code == 200) {
            return Promise.resolve('保存成功！');
        } else {
            return Promise.reject('操作失败！');
        }
    }
};

const getters = {
    userPlaylistId(state) {
        let { userPlaylist } = state;
        let ids = new Map();
        for (let playlist of userPlaylist) {
            ids.set(playlist.id, playlist.creator.userId);
        }
        return ids;
    },
    userAlbumSublistId(state) {
        let { userAlbumSublist } = state;
        let ids = new Set();
        for (let album of userAlbumSublist) {
            ids.add(album.id);
        }
        return ids;
    },
    userArtistSublistId(state) {
        let { userArtistSublist } = state;
        let ids = new Set();
        for (let artist of userArtistSublist) {
            ids.add(artist.id);
        }
        return ids;
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}