export interface Params {
      username: string;
      psd: string;
      ctx: any;
}

interface App {
      explorer: string;
}

export interface Cfg {
      account: any;
      app: App;
      env: string;
      chainId: string;
      checkerAddress: string;
}


export interface Account {
      psd: string;
      publicKey: string;
      address: string;
      name: string;
      domain: string;
      isSupervise: string;
}

export interface Config {
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
}


