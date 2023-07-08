import { createStore } from 'vuex'
import home from '@/store/home/index.js'
import recent from '@/store/recent/index.js'
import playlist from '@/store/playlist/index.js'
import artisthome from '@/store/artisthome/index.js'

const store = createStore({
    modules: {
        home,
        recent,
        playlist,
        artisthome
    }
});

export default store;