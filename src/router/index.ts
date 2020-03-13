import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import AssetList from '../views/AssetList.vue';
import AssetAdd from '../views/AssetAdd.vue';
import DataAuthShared from '../views/DataAuthShared.vue';
Vue.use(VueRouter);

const routes = [
      {
            path: '/',
            redirect: '/login',
      },
      {
            path: '/login',
            name: 'login',
            component: Login,
      },
      {
            path : '/home',
            name : 'home',
            component : Home
      },
      {
            path : '/asset_list',
            name : 'asset_list',
            component : AssetList
      },
      {
            path : '/asset_add',
            name : 'asset_add',
            component : AssetAdd
      },
      {
            path : '/auth_share',
            name : 'auth_share',
            component : DataAuthShared
      },
];

const router = new VueRouter({
      mode: 'history',
      base: process.env.BASE_URL,
      routes,
});

export default router;
