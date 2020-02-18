import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login';
import Home from '../views/Home';
import AssetList from '../views/AssetList';
import DataAuthShared from '../views/DataAuthShared';
import AssetAdd from '../views/AssetAdd';
import AssetDetails from '../views/AssetDetails';
import AssetEdit from '../views/AssetEdit';

Vue.use(VueRouter);

const routes = [
    {
        path : '/login',
        name : 'login',
        //redirect:'/login',
        component : Login
    },
    {
        path : '/',
        redirect:'/login',
    },
    {
        path : '/home',
        name : 'home',
        component : Home
    },

    {
        path : '/asset_list',
        name : 'asset_list',
        /* component: () => import('../views/AssetList.vue')*/
        component : AssetList
    },
    {
        path : '/auth_share',
        name : 'auth_share',
        /* component: () => import('../views/AssetList.vue')*/
        component : DataAuthShared
    },

    {
        path : '/asset_add',
        name : 'asset_add',
        component : AssetAdd
    },
    {
        path : '/asset_detail',
        name : 'asset_detail',
        component : AssetDetails,
        props: (route) => ({ type: route.query.type })
    },
    {
        path : '/asset_edit',
        name : 'asset_edit',
        component : AssetEdit
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    next();
});

export default router
