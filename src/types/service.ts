export enum Service {
      check = 1
}

export interface InteractPath {
      xPath: string;
      interactType: number;
}

export interface InteractItem {
      timestamp: number;
      service: Service;
      interact: InteractPath[];
      serviceName?:string,
}

export enum Dynamic {
      NftMint = 'nft_mint',
      NftEdit = 'nft_edit',
      NftTransfer = 'nft_transfer',
      NftBurn = 'nft_burn',
      ServiceDefine = 'service_define',
      ServiceBind = 'service_bind',
      ServiceRequest = 'service_request',
      ServiceResponse = 'service_response',
}