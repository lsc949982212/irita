import axios from 'axios';
import {constant} from '../constant/constant';
import loginHelper from '../helper/loginHelper';
import cfg from '../config/config';
import {accountHelper} from '../helper/accountHelper';

export default {
    get(params) {
        const{url, ctx} = params;
        if(loginHelper.checkLoginStatus(ctx) !== constant.SUCCESS.code){
            loginHelper.exit(ctx);
            return new Promise(()=>{});
        }
        return new Promise((res,rej)=>{
            axios.get(`${accountHelper.getAccount().domain}${url}`, {timeout:constant.TIME_OUT}).then(result => res(result.data)).catch((e)=>rej(e));
        })

    },
    post(params) {
        const {url,body,ctx} = params;
        if(loginHelper.checkLoginStatus(ctx) !== constant.SUCCESS.code){
            loginHelper.exit(ctx);
            return new Promise(()=>{});
        }
        return new Promise((res,rej)=>{
            axios.post(`${accountHelper.getAccount().domain}${url}`, body, {timeout: constant.TIME_OUT}).then(result => {
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
            return new Promise(()=>{});
        }
        return new Promise((res,rej)=>{
            axios.put(`${accountHelper.getAccount().domain}${url}`, body, {timeout: constant.TIME_OUT}).then(result => {
                res(result);
                }
            ).catch((e)=>{
                rej(e)
            });
        })
    },
}