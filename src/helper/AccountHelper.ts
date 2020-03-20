import cfg from '../config/config.json';
import * as types from '../types';


export default class AccountHelper {
      public static getAccountList(): types.IAccount[] {
            const config: types.ICfg = JSON.parse(JSON.stringify(cfg));
            const accountList: types.IAccount[] = [];
            for (const key of Object.keys(config.account)) {
                  accountList.push(config.account[key]);
            }
            return accountList;
      }

      public static isOwner(address: string): boolean {
            const token: string | null = sessionStorage.getItem('token');
            if (token) {
                  return JSON.parse(token).address === address;
            } else {
                  return false;
            }
      }

      public static getAccount(): types.IConfig {
            const token: string | null = sessionStorage.getItem('token');
            if (token) {
                  return JSON.parse(token);
            } else {
                  return {
                        address: '',
                        publicKey: '',
                        name: '',
                        domain: '',
                        isSupervise: '',
                  };
            }
      }

      public static getUserNameByAddress(address: string): string {
            const a: any | undefined = this.getAccountList().find((item: any) => item.address === address);
            return a ? a.name : address;
      }

      public static getPublicKeyByAddress(address: string): string {
            const a: any | undefined = this.getAccountList().find((item: any) => item.address === address);
            return a ? a.publicKey : '';
      }

      public static isSupervise(): boolean {
            let isSupervise = false;
            const token: string | null = sessionStorage.getItem('token');
            if (token) {
                  return isSupervise = JSON.parse(token).isSupervise === 'true';
            } else {
                  return false;
            }
      }
}