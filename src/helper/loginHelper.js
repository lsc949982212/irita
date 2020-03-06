import cfg from '../config/config';
import {constant} from '../constant/constant';

export default class loginHelper {
    constructor(){
    }

    static login(params){
        const {username, psd, ctx} = params;

        if(cfg.account[username] && cfg.account[username].psd === psd){
            ctx.$store.commit('SET_EXPIRED_STATUS',false);
            const token = {
                address:cfg.account[username].address,
                publicKey:cfg.account[username].publicKey,
                name:cfg.account[username].name,
                domain:cfg.account[username].domain,
                isSupervise:cfg.account[username].isSupervise,
            };

            sessionStorage.setItem('token',JSON.stringify(token));
            return true;
        }else {
            return false;
        }
    }

    static checkLoginStatus(ctx){
        const token = sessionStorage.getItem('token');
        if(!token){
            return constant.ERROR.NOT_LOGIN.code;
        }else{
            return constant.SUCCESS.code
        }
    }

    static exit(ctx){
        sessionStorage.removeItem('token');
        ctx.$store.commit('SET_EXPIRED_STATUS',true);
    }

}