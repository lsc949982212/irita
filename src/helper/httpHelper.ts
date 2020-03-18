import axios from 'axios';
import constant from '../constant/constant';
import LoginHelper from '../helper/LoginHelper';
import accountHelper from '../helper/accountHelper';
import * as types from '../types';

export default {
      get(params: types.IHttpGetParams): Promise<any> {
            const {url, ctx} = params;
            if (LoginHelper.checkLoginStatus(ctx) !== constant.SUCCESS.code) {
                  LoginHelper.exit(ctx);
                  return new Promise(() => {
                  });
            }
            return new Promise((res: any, rej: any) => {
                  console.log('url', `${accountHelper.getAccount().domain}${url}`);
                  axios.get(`${accountHelper.getAccount().domain}${url}`, {
                        timeout: constant.TIME_OUT
                  }).then(result => res(result.data)).catch((e) => rej(e));
            })

      },
      post(params: types.IHttpPostParams): Promise<any> {
            const {url, body, ctx} = params;
            if (LoginHelper.checkLoginStatus(ctx) !== constant.SUCCESS.code) {
                  LoginHelper.exit(ctx);
                  return new Promise(() => {
                  });
            }
            return new Promise((res: any, rej: any) => {
                  console.log('url', `${accountHelper.getAccount().domain}${url}`)
                  axios.post(`${accountHelper.getAccount().domain}${url}`, body, {timeout: constant.TIME_OUT}).then((result: any) => {
                            res(result);
                      }).catch((e: any) => {
                        rej(e);
                  });
            })

      },
      put(params: types.IHttpPutParams) {
            const {url, body, ctx} = params;
            if (LoginHelper.checkLoginStatus(ctx) !== constant.SUCCESS.code) {
                  LoginHelper.exit(ctx);
                  return new Promise(() => {
                  });
            }
            return new Promise((res: any, rej: any) => {
                  axios.put(`${accountHelper.getAccount().domain}${url}`, body, {timeout: constant.TIME_OUT}).then((result: any) => {
                            res(result);
                      }).catch((e: any) => {
                        rej(e)
                  });
            })
      },
      withinPrefixGet(params: any) {
            const {url} = params;
            return new Promise((res: any, rej: any) => {
                  axios.get(url, {timeout: constant.TIME_OUT}).then((result: any) =>
                      res(result.data)
                  ).catch((e: any) => rej(e));
            })
      }

}