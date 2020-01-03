import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
let token = sessionStorage.getItem('token');
let random = 0;
let loginTime = 0;
let expired = true;
if(token){
    random = JSON.parse(token).random;
    loginTime = JSON.parse(token).loginTime;
    expired = false;
}
export default new Vuex.Store({


    state : {
        offsetLeft:0,
        random,
        loginTime,
        expired,
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
        SET_EXPIRED_STATUS(state, data){
            console.error('===',data)
            state.expired = data;
        },


    },
    actions : {

    },
    modules : {

    }
})
