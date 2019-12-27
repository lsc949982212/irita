import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login';
import AssetList from '../views/AssetList';
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
        path : '/asset_list',
        name : 'asset_list',
        /* component: () => import('../views/AssetList.vue')*/
        component : AssetList
    },
    {
        path : '/asset_add',
        name : 'asset_add',
        component : AssetAdd
    },
    {
        path : '/asset_detail',
        name : 'asset_detail',
        component : AssetDetails
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
    console.log(to)
    console.log(from)
    next();
});

export default router
