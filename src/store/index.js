import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        offsetLeft:0,
        random:0,
        loginTime:0,
    },
    mutations : {
        SET_OFFSET_LEFT(state,data){
            state.offsetLeft = data;
        },
        SET_RANDOM_TOKEN(state, data){
            state.random = data;
        },
        SET_LOGIN_TIME(state, data){
            state.loginTime = data;
        },

    },
    actions : {

    },
    modules : {

    }
})
