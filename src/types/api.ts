import Vue from 'vue';

export interface IResponse<T> {
      status: string;
      errCode: string;
      errMsg: string;
      total: number;
      pageNum: number;
      pageSize: number;
      data?: T;
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


export type IDisplayDynamic = {
      address: string | undefined;
      displayAddress: string | undefined;
      displayContent: string | undefined;
      name: string | undefined;
      type: string | undefined;
      displayTimePassed: string | undefined;
      assetname: string | undefined;
      servicename: string | undefined;
      hash: string | undefined;
}

export type IOptions = {
      label: string | undefined;
      value: number | string;
      disabled?: boolean;
}

export type IChainInfo = {
      nft_id?: string;
      token_id?: string;
      number?: string;
      asset_name?: string;
      type?: string;
      owner?: string;
      nft_uri?: string;
      nft_owner?: string;
      check_status?: number;
      transfer_status?: number;
      is_apply?: boolean;
      mint_time?: number;
      record_id?: string;
}


export type IPath = (target: any) => void;

type OwnerAssetCalculateInfo = {
      total: number,
      apply: number,
      wait_transfer: number;
}

type OhterAssetCalculateInfo = {
      authok: number,
      applying: number,
      wait_accept: number;
}


//Home page preview
export type CalculateInfo = {
      ownerasset_caculateinfo: OwnerAssetCalculateInfo,
      otherasset_caculateinfo: OhterAssetCalculateInfo
}

export type IRecently = {
      tx_hash: string,
      address: string,
      servicename: string,
      assetname: string,
      time: number,
      type: string,
}

export type IDenoms = {
      denoms:string[],
      download_url:object,
}

export type ISaveAssets = {
      asset_data: object,
      owner: string,
      owner_pubkey: string,
}

export type IAssetDetails = {
      chain_info: IChainInfo,
      asset_info: object,
}


