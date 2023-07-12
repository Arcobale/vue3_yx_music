import { reqLyric, reqLyricWordByWord, reqCommentMusic, reqCommentFloor } from '@/api';

const state = {
    isLyricOpen: false,
    curSongId: -1,
    curSongTime: -1,

    lyric: '',
    lyricWordByWord: '',

    commentMusic: [],
    commentMusicHot: [],
    commentFloor: [],
};

const mutations = {
    CHANGELYRICSTATE(state) {
        state.isLyricOpen = !state.isLyricOpen;
    },
    CHANGECURSONGID(state, curSongId) {
        state.curSongId = curSongId;
    },
    CHANGECURSONGTIME(state, curSongTime) {
        state.curSongTime = curSongTime;
    },

    LYRIC(state, lyric) {
        state.lyric = lyric;
    },
    LYRICWORDBYWORD(state, lyricWordByWord) {
        state.lyricWordByWord = lyricWordByWord;
    },

    COMMENTMUSIC(state, res) {
        state.commentMusic = res.comments;
        state.commentMusicHot = res.hotComments;
    },
    COMMENTFLOOR(state, commentFloor) {
        state.commentFloor = commentFloor;
    }
};

const actions = {
    async getLyric({ commit }, params) {
        let res = await reqLyric(params);
        if (res.code == 200) {
            commit('LYRIC', res.lrc.lyric);
        }
    },
    async getLyricWordByWord({ commit }, params) {
        let res = await reqLyricWordByWord(params);
        if (res.code == 200) {
            commit('LYRICWORDBYWORD', res.yrc ? res.yrc.lyric : res.lrc.lyric);
        }
    },
    async getCommentMusic({ commit }, params) {
        let res = await reqCommentMusic(params);
        if (res.code == 200) {
            commit('COMMENTMUSIC', res);
        }
    },
    async getCommentFloor({ commit }, params) {
        let res = await reqCommentFloor(params);
        if (res.code == 200) {
            commit('COMMENTFLOOR', res.data.comments);
        }
    },
};

const getters = {

    lyricFormat(state) {
        let { lyric } = state;
        
        let lyricsArr = lyric.split('\n');
        let result = new Array(lyricsArr.length - 1).fill(0);
        for (let i = 0; i < lyricsArr.length - 1; i++) {
            let [ lyricTime, lyricContent ] = lyricsArr[i].split('[')[1].split(']');

            // 转换为毫秒格式
            let [left, ms] = lyricTime.split('.');
            let [minute, second] = left.split(':');
            let rawTime = (parseInt(minute) * 60 + parseInt(second)) * 1000 + parseInt(ms);

            let newItem = { time: rawTime, content: lyricContent };
            result[i] = newItem;
        }
        return result;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}