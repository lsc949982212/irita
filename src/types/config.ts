type IApp = {
      explorer: string;
}

export type ICfg = {
      account: any;
      app: IApp;
      env: string;
      chainId: string;
      checkerAddress: string;
}


export type IAccount = {
      psd: string;
      publicKey: string;
      address: string;
      name: string;
      domain: string;
      isSupervise: string;
}

export type IConfig = {
      address: string;
      publicKey: string;
      name: string;
      domain: string;
      isSupervise: string;
}

export interface IParams {
      username: string;
      psd: string;
      ctx: any;
}