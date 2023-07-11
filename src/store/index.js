import { createStore } from 'vuex'
import home from '@/store/home/index.js'
import recent from '@/store/recent/index.js'
import playlist from '@/store/playlist/index.js'
import artisthome from '@/store/artisthome/index.js'
import mv from '@/store/mv/index.js'
import search from '@/store/search/index.js'

const store = createStore({
    state: {
        curSongIndex: -1,
        curCycle: 0,
    },
    mutations: {
        SKIPSONG(state, { step, total }) {
            state.curSongIndex = (state.curSongIndex + step) % total;
            state.curSongIndex += state.curSongIndex < 0 ? total : 0;
        },
        SKIPSONGRANDOM(state, { total }) {
            state.curSongIndex = Math.floor(Math.random() * total);
        },
        CHANGESONG(state, newIndex) {
            state.curSongIndex = newIndex;
        },
        CHANGECYCLE(state) {
            state.curCycle = (state.curCycle + 1) % 3;
        }
    },
    modules: {
        home,
        recent,
        playlist,
        artisthome,
        mv,
        search
    }
});

export default store;