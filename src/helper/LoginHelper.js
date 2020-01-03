import cfg from '../config/config';
import {constant} from '../constant/constant';

export default class LoginHelper {
    constructor(){
    }

    static login(params){
        const {username, psd, ctx} = params;
        if(username === cfg.account.username && psd === cfg.account.psd){
            LoginHelper.setSession(ctx);
            ctx.$store.commit('SET_EXPIRED_STATUS',false);
            return true;
        } else {
            return false;
        }
    }

    static setSession(ctx){
        const random = Math.random();
        const timestamp = new Date().getTime();
        const token = {
            random,
            timestamp,
        };

        ctx.$store.commit('SET_RANDOM_TOKEN', random);
        ctx.$store.commit('SET_LOGIN_TIME', timestamp);
        sessionStorage.setItem('token',JSON.stringify(token));
    }

    static checkLoginStatus(ctx){
        const {random, loginTime} = ctx.$store.state;
        const token = sessionStorage.getItem('token');
        if(!token){
            return constant.ERROR.NOT_LOGIN.code;
        }else{
            const savedToken = JSON.parse(token);
            if(savedToken.random !== random || savedToken.timestamp !== loginTime){
                return constant.ERROR.ERROR_LOGIN.code;
            }else if(loginTime + cfg.expired < new Date().getTime()){
                return constant.ERROR.ERROR_LOGIN.code;
            }else{
                return constant.SUCCESS.code
            }
        }
    }

    static exit(ctx){
        sessionStorage.removeItem('token');
        ctx.$store.commit('SET_EXPIRED_STATUS',true);
    }

}