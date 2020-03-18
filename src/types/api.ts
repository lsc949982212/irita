import Vue from 'vue';

export interface IResponse<T> {
      status: string;
      errorCode: string | number;
      errMsg: string;
      total: number;
      pageNum: number;
      pageSize: number;
      data: T;
}




interface IHttpParams {
      url: string;
      ctx: Vue;
}


export interface IHttpGetParams extends IHttpParams {
}

export interface IHttpPostParams extends IHttpParams {
      body: any;
}

export interface IHttpPutParams extends IHttpParams {
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


