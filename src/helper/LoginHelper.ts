import cfg from '../config/config.json';
import * as types from '../types';
import * as constant from '../constant';


export default class LoginHelper {

      public static login(params: types.IParams): boolean {
            const {username, psd, ctx} = params;
            const config: types.ICfg = JSON.parse(JSON.stringify(cfg));

            if (config.account[params.username] && config.account[username].psd === psd) {
                  ctx.$store.commit('SET_EXPIRED_STATUS', false);
                  const token: types.IConfig = {
                        address: config.account[username].address,
                        publicKey: config.account[username].publicKey,
                        name: config.account[username].name,
                        domain: config.account[username].domain,
                        isSupervise: config.account[username].isSupervise,
                  };

                  sessionStorage.setItem('token', JSON.stringify(token));
                  return true;
            } else {
                  return false;
            }
      }

      public static checkLoginStatus(ctx: any): number {
            const token = sessionStorage.getItem('token');
            if (!token) {
                  return constant.LoginCode.LoginFailed;
            } else {
                  return constant.LoginCode.LoginSuccess;
            }
      }

      public static exit(ctx: any) {
            sessionStorage.removeItem('token');
            ctx.$store.commit('SET_EXPIRED_STATUS', true);
      }

}
