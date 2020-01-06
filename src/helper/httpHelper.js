import axios from 'axios';
import {constant} from '../constant/constant';
import loginHelper from '../helper/loginHelper';

export default {
    get(params) {
        const{url, ctx} = params;
        if(loginHelper.checkLoginStatus(ctx) !== constant.SUCCESS.code){
            loginHelper.exit(ctx);
            return;
        }
        return new Promise((res,rej)=>{
            axios.get(url, {timeout:constant.TIME_OUT}).then(result => res(result)).catch((e)=>rej(e));
        })

    },
    post(params) {
        const {url,body,ctx} = params;
        if(loginHelper.checkLoginStatus(ctx) !== constant.SUCCESS.code){
            loginHelper.exit(ctx);
            return;
        }
        return new Promise((res,rej)=>{
            axios.post(url, body, {timeout: constant.TIME_OUT}).then(result => {
                    res(result);
                }
            ).catch((e)=>{
                rej(e);
            });
        })

    },
    put(params) {
        const {url,body,ctx,} = params;
        if(loginHelper.checkLoginStatus(ctx) !== constant.SUCCESS.code){
            loginHelper.exit(ctx);
            return;
        }
        return new Promise((res,rej)=>{
            axios.put(url, body, {timeout: constant.TIME_OUT}).then(result => {
                res(result);
                }
            ).catch((e)=>{
                rej(e)
            });
        })

    },
}