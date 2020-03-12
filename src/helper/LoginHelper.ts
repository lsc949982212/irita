import cfg from '../config/config.json';
import constant from '../constant/constant';
import {Params, Config, Cfg} from '../types';


export default class LoginHelper {

      public static login(params: Params): boolean {
            const {username, psd, ctx} = params;
            const config: Cfg = JSON.parse(JSON.stringify(cfg));

            if (config.account[params.username] && config.account[username].psd === psd) {
                  ctx.$store.commit('SET_EXPIRED_STATUS', false);
                  const token: Config = {
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
                  return constant.ERROR.NOT_LOGIN.code;
            } else {
                  return constant.SUCCESS.code;
            }
      }

      public static exit(ctx: any) {
            sessionStorage.removeItem('token');
            ctx.$store.commit('SET_EXPIRED_STATUS', true);
      }

}
