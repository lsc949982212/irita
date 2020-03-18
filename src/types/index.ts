export type IParams = {
      username: string;
      psd: string;
      ctx: any;
}

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

export type IHttpGetParams = {
      url: string;
      ctx: any;
}

export type IHttpPostParams = {
      url: string;
      ctx: any;
      body: any;
}

export type IHttpPutParams = {
      url: string;
      ctx: any;
      body: any;
}

export type IDynamic = {
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

export type IOptions = {
      label: string;
      value: number | string;
      disabled?: boolean;
}

export type IChainInfo = {
      nft_id?: string;
      number?: string;
      asset_name?: string;
      type?: string;
      owner?: string;
      nft_uri?: string;
      nft_owner?: string;
      token_id?: string;
}

export type InteractPath = {
      xPath: string;
      interactType: number;
}


