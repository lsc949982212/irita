import cfg from '../config/config.json';
import { Params, Config, Cfg, Account } from '../types';

export default {
      getAccountList<T>(): Array<T> {
            const config: Cfg = JSON.parse(JSON.stringify(cfg));
            const accountList: Array<T> = [];
            for (const key of Object.keys(config.account)) {
                  accountList.push(config.account[key]);
            }
            return accountList;
      },
      isOwner(address: string): boolean {
            const token: string | null = sessionStorage.getItem('token');
            if (token) {
                  return JSON.parse(token).address === address;
            } else {
                  return false;
            }
      },
      getAccount(): any {
            const token: string | null = sessionStorage.getItem('token');
            if (token) {
                  return JSON.parse(token);
            } else {
                  return null;
            }
      },
      getUserNameByAddress(address: string): string {
            const a: any | undefined = this.getAccountList().find((item: any) => item.address === address);
            return a ? a.name : address;
      },
      getPublicKeyByAddress(address: string): string {
            const a: any | undefined = this.getAccountList().find((item: any) => item.address === address);
            return a ? a.publicKey : '';
      },
      isSupervise(): boolean {
            let isSupervise = false;
            const token: string | null = sessionStorage.getItem('token');
            if (token) {
                  return isSupervise = JSON.parse(token).isSupervise === 'true';
            } else {
                  return false;
            }
      },

};