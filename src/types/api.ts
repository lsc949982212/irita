export interface IResponse<T> {
      status: string;
      errCode: string;
      errMsg: string;
      total: number;
      pageNum: number;
      pageSize: number;
      data: T;
}

interface IHttpParams {
      url: string;
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
      nft_id: string;
      token_id: string;
      number: string;
      asset_name: string;
      type: string;
      owner: string;
      nft_uri: string;
      nft_owner: string;
      check_status: number;
      transfer_status: number;
      is_apply: boolean;
      mint_time: number;
      record_id: string;
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
      asset_info: string,
}

export type IAssetsListItem = {
      nft_id: string,
      token_id: string,
      number: string,
      asset_name: string,
      type: string,
      owner: string,
      nft_owner: string,
      nft_uri: string,
      check_status: number,
      transfer_status:number,
      is_apply: boolean,
      mint_time: number,
      record_id: string,
}

export type IAssetAuthorization = {
      request_id: string,
      nft_id: string,
      asset_no: string,
      asset_name: string,
      resp_resource_url: string,
      provider: string,
      consumer: string,
      status: number,
      time: number,
      create_at:number,
      update_at: number,
}

//提交查验
export type ICheckPost = {
      req_data_path: string,
      interact_type: string,
      checker_addr: string,
}
//解密文件
export type IDecodeData = {
      asset_content: string,
      record_files: IRecordFile[],
}

export type IRecordFile = {
      origin_file: string,
      re_encrypted_file: string,
}

export interface ITfs {
      hash?: string,
      uri: string,
      meta: string,
}

export interface ITransferData {
      request_id: string;
      nft_id: string;
      provider: string;
      consumer: string;
      tfs: ITfs;
      hashok: number;
      contentok: number;
      record_id: string;
      status: number;
      time: number;
      create_at: number;
      update_at: number;
}

export interface ICheckData {
      nft_id: string;
      time: number;
      request_id: string;
      req_data_path: string;
      interact_type: number;
      provider: string;
      consumer: string;
      status: number;
      check_result: boolean;
}

export interface IAssetTxData {
      time: number;
      height: number;
      tx_hash: string;
      type: string;
      status: number;
      consumer: string;
      provider: string;
      token_uri: string;
      service_name: string;
}

export interface IServiceData extends IAssetTxData {}

export interface IEvicenceData {
      tx_hash: string;
      record_id: string;
      height: number;
      time: number;
      address: string;
      tfs: ITfs;
}

export interface ITfsContent extends ITfs{
      digest: string,
      digest_algo: string,
}

export interface IEvidenceData {
      tx_hash: string;
      time: number;
      file_nums: number;
      contents: ITfsContent[];
}




