import axios from 'axios';
import LoginHelper from '../helper/LoginHelper';
import accountHelper from '../helper/accountHelper';
import * as types from '../types';
import * as constant from '../constant';

export default {
      get<T>(params: types.IHttpGetParams): Promise<T> {
            const {url, ctx} = params;
            if (LoginHelper.checkLoginStatus(ctx) !== constant.LoginCode.LoginSuccess) {
                  LoginHelper.exit(ctx);
                  return new Promise(() => {
                  });
            }
            return new Promise((res) => {
                  console.log('url', `${accountHelper.getAccount().domain}${url}`);
                  axios.get(`${accountHelper.getAccount().domain}${url}`, {
                        timeout: constant.TIME_OUT
                  }).then((result) => res(result.data));
            })

      },
      post<T>(params: types.IHttpPostParams): Promise<T> {
            const {url, body, ctx} = params;
            if (LoginHelper.checkLoginStatus(ctx) !== constant.LoginCode.LoginSuccess) {
                  LoginHelper.exit(ctx);
                  return new Promise(() => {
                  });
            }
            return new Promise((res: any, rej: any) => {
                  console.log('url', `${accountHelper.getAccount().domain}${url}`)
                  axios.post(`${accountHelper.getAccount().domain}${url}`, body, {timeout: constant.TIME_OUT}).then((result: any) => {
                        res(result);
                  });
            })

      },
      put<T>(params: types.IHttpPutParams): Promise<T> {
            const {url, body, ctx} = params;
            if (LoginHelper.checkLoginStatus(ctx) !== constant.LoginCode.LoginSuccess) {
                  LoginHelper.exit(ctx);
                  return new Promise(() => {
                  });
            }
            return new Promise((res: any) => {
                  axios.put(`${accountHelper.getAccount().domain}${url}`, body, {timeout: constant.TIME_OUT}).then((result) => {
                        res(result);
                  });
            })
      },
      withinPrefixGet<T>(params: types.IHttpGetParams): Promise<T> {
            const {url} = params;
            return new Promise((res) => {
                  axios.get(url, {timeout: constant.TIME_OUT}).then((result) =>
                      res(result.data)
                  );
            })
      }

}