import { createStore } from 'vuex'
import home from '@/store/home/index.js'
import recent from '@/store/recent/index.js'
import playlist from '@/store/playlist/index.js'
import artisthome from '@/store/artisthome/index.js'
import mv from '@/store/mv/index.js'

const store = createStore({
    state: {
        curSongIndex: -1
    },
    mutations: {
        SKIPSONG(state, { step, total }) {
            state.curSongIndex = (state.curSongIndex + step) % total;
            state.curSongIndex += state.curSongIndex < 0 ? total : 0;
        },
        CHANGESONG(state, newIndex) {
            state.curSongIndex = newIndex;
        }
    },
    modules: {
        home,
        recent,
        playlist,
        artisthome,
        mv
    }
});

export default store;