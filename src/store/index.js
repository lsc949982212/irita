import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
let token = sessionStorage.getItem('token');
let expired = true;
if(token){
    expired = false;
}
export default new Vuex.Store({
    state : {
        offsetLeft:0,
        expired,
    },
    mutations : {
        SET_OFFSET_LEFT(state,data){
            state.offsetLeft = data;
        },
        SET_EXPIRED_STATUS(state, data){
            state.expired = data;
        },


    },
    actions : {

    },
    modules : {

    }
})
