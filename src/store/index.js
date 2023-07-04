import { createStore } from 'vuex'
import home from '@/store/home/index.js'

const store = createStore({
    modules: {
        home,
    }
});

export default store;