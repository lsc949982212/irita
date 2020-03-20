import axios from 'axios';
import AccountHelper from '../helper/AccountHelper';
import * as types from '../types';
import * as constant from '../constant';
import * as decorators from '../decorators';


@decorators.Path(AccountHelper.getAccount().domain)
class AxiosHelper {
      public async get<T>(params: types.IHttpGetParams): Promise<T> {
            return new Promise((res, rej) => {
                  axios.get(
                      `${(this as any).path}${params.url}`,
                      {
                            timeout: constant.TIME_OUT
                      }).then((result) => res(result.data)).catch(e => {
                        rej(e)
                  });
            })
      }

      public async post<T>(params: types.IHttpPostParams): Promise<T> {
            return new Promise((res, rej) => {
                  axios.post(`${(this as any).path}${params.url}`,
                      params.body,
                      {timeout: constant.TIME_OUT}).then((result: any) => {
                        res(result.data);
                  }).catch(e => {
                        rej(e)
                  });
            })
      }

      public async put<T>(params: types.IHttpPutParams): Promise<T> {
            const {url, body} = params;
            return new Promise((res, rej) => {
                  axios.put(`${(this as any).path}${url}`, 
                  body, 
                  {timeout: constant.TIME_OUT}).then((result: any) => {
                        res(result.data);
                  }).catch(e => {
                        rej(e)
                  });
            })
      }

      public async withinPrefixGet<T>(params: types.IHttpGetParams): Promise<T> {
            return new Promise((res, rej) => {
                  axios.get(params.url, {timeout: constant.TIME_OUT}).then((result) =>
                      res(result.data)
                  ).catch(e => {
                        rej(e)
                  });
            })
      }

      public async upload<T>(params: types.IHttpPostParams): Promise<T> {
            return new Promise((res, rej) => {
                  fetch(`${(this as any).path}${params.url}`, {
                        method: "POST",
                        body: params.body
                  }).then((response: any) => {
                        return response.json();
                  }).then((result: any) => {
                        res(result);
                  }).catch(e => {
                        rej(e)
                  })
            })
      }

}

export default new AxiosHelper();
