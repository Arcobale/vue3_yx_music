import { reqPersonalizedList, reqPrivateContent, reqNewSong, reqPersonalizedMV, reqBanner, reqPlayListHQ, reqPlayListTag, reqPlayListHotTag, reqTopList, reqTopListDetail, reqArtistList, reqNewSongList } from '@/api';

const state = {
    personalizedList: [],
    privateContent: [],
    newSong: [],
    personalizedMV: [],
    banner: [],
    playListHQ: [],
    playListCategories: [],
    playListSubCategories: [],
    playListHotTag: [],
    topList: [],
    topListDetail: [],
    artistList: [],
    newSongList: [],
};

const mutations = {
    PERSONALIZEDLIST(state, personalizedList) {
        state.personalizedList = personalizedList;
    },
    PRIVATECONTENT(state, privateContent) {
        state.privateContent = privateContent;
    },
    NEWSONG(state, newSong) {
        state.newSong = newSong;
    },
    PERSONALIZEDMV(state, personalizedMV) {
        state.personalizedMV = personalizedMV;
    },
    BANNER(state, banner) {
        state.banner = banner;
    },
    PLAYLISTHQ(state, playListHQ) {
        state.playListHQ = playListHQ;
    },
    PLAYLISTTAG(state, res) {
        state.playListCategories = res.categories;
        state.playListSubCategories = res.sub;
    },
    PLAYLISTHOTTAG(state, playListHotTag) {
        state.playListHotTag = playListHotTag;
    },
    TOPLIST(state, topList) {
        state.topList = topList;
    },
    TOPLISTDETAIL(state, topListDetail) {
        state.topListDetail = topListDetail;
    },
    ARTISTLIST(state, artistList) {
        state.artistList = artistList;
    },
    NEWSONGLIST(state, newSongList) {
        state.newSongList = newSongList;
    }
};

const actions = {
    async getPersonalizedList({commit}, params) {
        let res = await reqPersonalizedList(params);
        if (res.code == 200) {
            commit('PERSONALIZEDLIST', res.result);
        }
    },
    async getPrivateContent({commit}) {
        let res = await reqPrivateContent();
        if (res.code == 200) {
            commit('PRIVATECONTENT', res.result);
        }
    },
    async getNewSong({commit}) {
        let res = await reqNewSong();
        if (res.code == 200) {
            commit('NEWSONG', res.result);
        }
    },
    async getPersonalizedMV({commit}) {
        let res = await reqPersonalizedMV();
        if (res.code == 200) {
            commit('PERSONALIZEDMV', res.result);
        }
    },
    async getBanner({commit}) {
        let res = await reqBanner();
        if (res.code == 200) {
            commit('BANNER', res.banners);
        }
    },
    async getPlayListHQ({commit}, params) {
        let res = await reqPlayListHQ(params);
        if (res.code == 200) {
            commit('PLAYLISTHQ', res.playlists);
            return Promise.resolve(res.total);
        }
    },
    async getPlayListTag({commit}) {
        let res = await reqPlayListTag();
        if (res.code == 200) {
            commit('PLAYLISTTAG', res);
        }
    },
    async getPlayListHotTag({commit}) {
        let res = await reqPlayListHotTag();
        if (res.code == 200) {
            commit('PLAYLISTHOTTAG', res.tags);
        }
    },
    async getTopList({commit}) {
        let res = await reqTopList();
        if (res.code == 200) {
            commit('TOPLIST', res.list);
        }
    },
    async getTopListDetail({commit}, params) {
        let res = await reqTopListDetail(params);
        if (res.code == 200) {
            commit('TOPLISTDETAIL', res.playlist.tracks);
        }
    },
    async getArtistList({commit}, params) {
        let res = await reqArtistList(params);
        if (res.code == 200) {
            commit('ARTISTLIST', res.artists);
        }
    },
    async getNewSongList({commit}, params) {
        let res = await reqNewSongList(params);
        if (res.code == 200) {
            commit('NEWSONGLIST', res.data);
        }
    }
};

const getters = {
    playListSortedCategories(state) {
        let { playListCategories, playListSubCategories } = state;
        let sortedCat = new Array(Object.keys(playListCategories).length).fill(0).map(item => new Array());
        for (let i = 0; i < playListSubCategories.length; i++) {
            let item = playListSubCategories[i];
            let index = item['category'];
            sortedCat[index].push({name: item.name, hot: item.hot});
        }

        return sortedCat;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}