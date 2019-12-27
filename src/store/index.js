import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        offsetLeft:0
    },
    mutations : {
        SET_OFFSET_LEFT(state,data){
            state.offsetLeft = data;
        }
    },
    actions : {

    },
    modules : {

    }
})
