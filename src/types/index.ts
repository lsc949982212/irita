export interface IParams {
      username: string;
      psd: string;
      ctx: any;
}

interface IApp {
      explorer: string;
}

export interface ICfg {
      account: any;
      app: IApp;
      env: string;
      chainId: string;
      checkerAddress: string;
}


export interface IAccount {
      psd: string;
      publicKey: string;
      address: string;
      name: string;
      domain: string;
      isSupervise: string;
}

export interface IConfig {
      address: string;
      publicKey: string;
      name: string;
      domain: string;
      isSupervise: string;
}

export interface IHttpGetParams {
      url: string;
      ctx: any;
}

export interface IHttpPostParams {
      url: string;
      ctx: any;
      body: any;
}

export interface IHttpPutParams {
      url: string;
      ctx: any;
      body: any;
}

export interface IDynamic {
      address: string;
      displayAddress: string;
      displayContent: string;
      name: string;
      type: string;
      displayTimePassed: string;
      assetname: string;
      servicename: string;
      hash: string;
}

export interface IOptions {
      label: string;
      value: number | string;
      disabled?: boolean;
}

export interface IChainInfo{
      nft_id?: string;
      number?: string;
      asset_name?: string;
      type?: string;
      owner?: string;
      nft_uri?: string;
      nft_owner?: string;
      token_id?: string;
}


