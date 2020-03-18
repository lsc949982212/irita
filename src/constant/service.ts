import * as types from '../types';

export const service = new Map<types.Service, string>([
    [types.Service.check, '查验']
]);

export const dynamic = new Map<types.Dynamic, string>([
      [types.Dynamic.NftMint,'发布了新资产'],
      [types.Dynamic.NftEdit,'编辑了资产'],
      [types.Dynamic.NftTransfer,'转让了资产'],
      [types.Dynamic.NftBurn,'销毁了资产'],
      [types.Dynamic.ServiceDefine,'定义了跨链服务'],
      [types.Dynamic.ServiceBind,'绑定了跨链服务'],
      [types.Dynamic.ServiceRequest,'请求了跨链服务'],
      [types.Dynamic.ServiceResponse,'响应了跨链服务'],
]);