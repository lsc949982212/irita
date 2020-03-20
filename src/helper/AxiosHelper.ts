import axios from 'axios';
import accountHelper from '../helper/accountHelper';
import * as types from '../types';
import * as constant from '../constant';
import * as decorators from '../decorators';


@decorators.Path(accountHelper.getAccount().domain)
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
            const {url, body, ctx} = params;
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

}

export default new AxiosHelper();
