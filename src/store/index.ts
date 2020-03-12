import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const token: string | null = sessionStorage.getItem('token');
let expired: boolean = true;
if (token) {
      expired = false;
}
export default new Vuex.Store({
      state: {
            offsetLeft: 0,
            expired,
      },
      mutations: {
            SET_OFFSET_LEFT(state: any, data: any): void {
                  state.offsetLeft = data;
            },
            SET_EXPIRED_STATUS(state: any, data: any): void {
                  state.expired = data;
            },
      },
      actions: {},
      modules: {},
});
