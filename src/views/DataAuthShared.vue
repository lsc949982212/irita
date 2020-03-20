<template>
    <div class="data_auth_share_list_container flexColumn">
        <div class="data_auth_share_list_wrap">
            <div class="data_auth_share_list_title_container flexRow">
                <div class="data_auth_share_list_title">
                    数据授权共享
                    <span class="data_auth_share_list_filter_total">
                        (共 {{ totalAssets }} 条记录)
                    </span>
                </div>

            </div>
            <div class="data_auth_share_list_filter_container flexRow">
                <el-select v-model="authStatusValue"
                           class="data_auth_share_list_select"
                           placeholder="请选择" size="small">
                    <el-option
                            v-for="item in authStatus"
                            :key="item.value"
                            :label="item.label"
                            :disabled="item.disabled"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="relevantStatusValue"
                           class="data_auth_share_list_select"
                           placeholder="请选择" size="small">
                    <el-option
                            v-for="item in relevantStatus"
                            :key="item.value"
                            :label="item.label"
                            :disabled="item.disabled"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="input"
                          class="data_auth_share_list_input"
                          placeholder="资产编号/资产名称"></el-input>
                <el-button size="medium"
                           @click="onPageChange(1)"
                           class="data_auth_share_list_btn" type="primary">搜索
                </el-button>

            </div>
            <div class="table_container">
                <el-table
                        :data="tableData"
                        v-loading="tableLoading"
                        style="width: 100%">
                    <el-table-column
                            fixed
                            prop="applyTime"
                            label="申请时间"
                            min-width="110">
                    </el-table-column>
                    <el-table-column
                            prop="number"
                            label="资产编号"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="资产名称"
                            min-width="110">
                    </el-table-column>
                    <el-table-column
                            label="申请者"
                            min-width="70">
                        <template slot-scope="scope">
                            <a :href="`${cfg.app.explorer}/#/address/${scope.row.consumer}`"
                               target="_blank"
                               class="data_auth_link">
                                {{ scope.row.applyer }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="响应者"
                            min-width="70">
                        <template slot-scope="scope">
                            <a :href="`${cfg.app.explorer}/#/address/${scope.row.provider}`"
                               target="_blank"
                               class="data_auth_link">
                                {{ scope.row.responser }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="授权状态"
                            min-width="70">
                        <template slot-scope="scope">
                            <a :href="scope.row.resp_resource_url"
                               target="_blank"
                               v-if="scope.row.status === constant.AuthStatus.Authorized"
                               class="data_auth_link">
                                已授权
                            </a>
                            <span v-else>
                                {{ scope.row.authStatus}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="lastUpdateTime"
                            label="更新时间"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="120">
                        <template slot-scope="scope">
                            <span @click="handleCheckClick(scope.row)"
                                  class="data_auth_link">
                                详情
                            </span>
                            <span @click="handleAuthClick(scope.row)"
                                  v-show="scope.row.showBtn"
                                  class="data_auth_link">
                                授权
                            </span>
                            <span @click="handleRefuseClick(scope.row)"
                                  v-show="scope.row.showBtn"
                                  class="data_auth_link data_auth_link_refuse">
                                拒绝
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination_container flexRow" v-show="totalTxCount > 10">
                    <span class="total_page">
                        共{{ totalTxCount }}条
                    </span>
                <el-pagination
                        background
                        @current-change="onPageChange"
                        :current-page="txListCurrentPage"
                        layout="prev, pager, next"
                        :total="totalTxCount">
                </el-pagination>
            </div>
            <el-dialog
                    :visible.sync="centerDialogVisible"
                    width="400px"
                    top="35vh"
                    center>
                <div class="asset_details_dialog_container">
                    <span class="asset_details_dialog_title">{{ dialogTitle }}</span>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="centerDialogVisible = false"
                                   size="medium"
                                   class="asset_details_cancel_btn">取消
                        </el-button>
                        <el-button type="primary"
                                   size="medium"
                                   :loading="loading"
                                   class="asset_details_confirm_btn"
                                   @click="handleConfirmBtnClick">确定
                        </el-button>

                    </div>
                </div>

            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts">
      import AccountHelper from '../helper/AccountHelper';
      import {getFormatAddress, formatTimestamp} from '../util/util';
      import getErrorMsgByErrorCode from '../helper/errorCodeHelper';
      import cfg from '../config/config.json';
      import {Message} from 'element-ui';
      import {Component, Vue} from 'vue-property-decorator';
      import * as types from "../types";
      import * as constant from "../constant";
      import AxiosHelper from '../helper/AxiosHelper';

      @Component
      export default class DataAuthShared extends Vue {
            private authStatusValue: number = constant.AuthStatus.All;
            private relevantStatusValue: number = constant.Relevant.All;
            private tableData: any[] = [];
            private totalAssets: number = 0;
            private totalTxCount: number = 1;
            private txListCurrentPage: number = 1;
            private authStatus: types.IOptions[] = [{
                  value: constant.AuthStatus.All,
                  label: constant.AuthStatusMap.get(constant.AuthStatus.All)
            }, {
                  value: constant.AuthStatus.Applying,
                  label: constant.AuthStatusMap.get(constant.AuthStatus.Applying)
            }, {
                  value: constant.AuthStatus.Authorized,
                  label: constant.AuthStatusMap.get(constant.AuthStatus.Authorized)
            }, {
                  value: constant.AuthStatus.Refused,
                  label: constant.AuthStatusMap.get(constant.AuthStatus.Refused)
            }, {
                  value: constant.AuthStatus.Invalid,
                  label: constant.AuthStatusMap.get(constant.AuthStatus.Invalid)
            }, {
                  value: constant.AuthStatus.Expired,
                  label: constant.AuthStatusMap.get(constant.AuthStatus.Expired)
            },];

            private relevantStatus: types.IOptions[] = [{
                  value: constant.Relevant.All,
                  label: constant.RelevantMap.get(constant.Relevant.All)
            }, {
                  value: constant.Relevant.MyPost,
                  label: constant.RelevantMap.get(constant.Relevant.MyPost)
            }, {
                  value: constant.Relevant.MyReceive,
                  label: constant.RelevantMap.get(constant.Relevant.MyReceive)
            }];
            private constant: object = constant;
            private input: string = '';
            private consumer_pubkey: string = '';
            private request_id: string = '';
            private centerDialogVisible: boolean = false;
            private loading: boolean = false;
            private dialogTitle: string = '';
            private consumer: string = '';
            private nftId: string = '';
            private dialogType: number = 0;//0 授权, 1 拒绝;
            private cfg: types.ICfg = JSON.parse(JSON.stringify(cfg));
            private tableLoading: boolean = false;

            private beforeMount(): void {
                  this.authStatusValue = this.$route.query.auth_status_value ? Number(this.$route.query.auth_status_value) : constant.AuthStatus.All;
                  this.relevantStatusValue = this.$route.query.relevant_status_value ? Number(this.$route.query.relevant_status_value) : constant.Relevant.All;
            }

            private mounted(): void {
                  this.onPageChange(1);
            }

            private handleAuthClick(item: any): void {
                  this.dialogType = 0;
                  this.centerDialogVisible = true;
                  this.request_id = item.request_id;
                  this.consumer = item.consumer;
                  this.nftId = item.id;
                  this.consumer_pubkey = item.consumer_pubkey;
                  this.dialogTitle = '确认要授权吗';

            }

            private handleRefuseClick(item: any): void {
                  this.dialogType = 1;
                  this.centerDialogVisible = true;
                  this.request_id = item.request_id;
                  this.consumer = item.consumer;
                  this.nftId = item.id;
                  this.consumer_pubkey = item.consumer_pubkey;
                  this.dialogTitle = '确认要拒绝吗';
            }

            private async handleConfirmBtnClick() {
                  const {request_id, dialogType, consumer} = this;
                  let body: object = {}, url: string = '', str: string = '';
                  if (dialogType === 0) {
                        body = {
                              "consumer_pubkey": AccountHelper.getPublicKeyByAddress(consumer),
                              "request_id": request_id,
                        };
                        url = `/assets_authorization/${this.nftId}/authorization/accept`;
                        str = '授权'
                  } else {
                        body = {
                              "request_id": request_id,
                        };
                        url = `/assets_authorization/${this.nftId}/authorization/refuse`;
                        str = '拒绝'
                  }
                  this.loading = true;
                  try {
                        const data: types.IResponse<string> = await AxiosHelper.post({
                              url,
                              body
                        });
                        this.centerDialogVisible = false;
                        this.loading = false;
                        if (data && data.status === 'success') {
                              Message({
                                    message: `${str}成功`,
                                    type: 'success'
                              });
                              this.onPageChange(1);
                        } else if (data && data.status === 'fail') {
                              this.$message.error(getErrorMsgByErrorCode(data.errCode));
                        } else {
                              this.$message.error(`${str}失败`);
                        }
                  } catch (e) {
                        console.error(e);
                        this.loading = false;
                        this.$message.error(`${str}失败`);
                        this.centerDialogVisible = false;
                  }

            }

            private getTransShow(row: any): boolean {
                  return AccountHelper.isOwner(row.owner) && row.transStatus === constant.AssetsStatus.Normal
            }

            private handleCheckClick(row: any): void {
                  this.getDetails(row)
            }

            private async getDetails(row: any) {
                  try {
                        const url: string = `/assets/detail/${row.id}?address=${AccountHelper.getAccount().address}`;
                        let data: types.IResponse<types.IAssetDetails> = await AxiosHelper.get({url});
                        if (data && data.data && data.data.chain_info) {
                              this.$router.push(`/asset_detail?type=check&nft_id=${row.id}&query_type=${data.data.chain_info.type}`);
                        }
                  } catch (e) {
                        console.error(e);
                        this.$message.error(`获取数据失败`);
                  }

            }


            private handleTransClick(row:any):void {
                  this.$router.push(`/asset_detail?type=trans&nft_id=${row.id}&query_type=${row.type}`);
            }

            private onPageChange(page:number):void {
                  this.txListCurrentPage = page;
                  this.getDataList(page);
            }

            private async getDataList(page:number) {
                  const {relevantStatusValue, authStatusValue, input} = this;
                  let url: string = `/assets_authorization?pageNum=${page}&pageSize=10&used_count=true&auth_type=${relevantStatusValue}&status=${authStatusValue}`;
                  if (this.input) {
                        url += `&query_data=${input}`
                  }
                  this.tableLoading = true;
                  try {
                        const data: types.IResponse<types.IAssetAuthorization[]> = await AxiosHelper.get({url});
                        if (data && data.status === 'success' && data.data) {
                              this.handleData(data);
                        }
                        this.tableLoading = false;
                  } catch (e) {
                        console.error(e);
                        this.tableLoading = false;
                        this.$message.error('获取数据失败, 请稍后重试');
                  }


            }

            private handleData(data: any):void {
                  console.log(data)
                  this.totalTxCount = data.total;
                  this.totalAssets = data.total;
                  let isNotSupervise: boolean =  false;
                  const superviseAccount: types.IAccount | undefined = AccountHelper.getAccountList().find((item: types.IAccount)=>item.isSupervise === 'true');
                  this.tableData = data.data.map((asset: types.IAssetAuthorization) => {
                        if(superviseAccount && superviseAccount.address !== asset.consumer) isNotSupervise = true;
                        return {
                              number: asset.asset_no,
                              id: asset.nft_id,
                              name: asset.asset_name,
                              applyTime: formatTimestamp(asset.time),
                              lastUpdateTime: formatTimestamp(asset.update_at),
                              applyer: getFormatAddress(asset.consumer),
                              responser: getFormatAddress(asset.provider),
                              authStatus: constant.AuthStatusMap.get(asset.status),
                              provider: asset.provider,
                              status: asset.status,
                              request_id: asset.request_id,
                              consumer: asset.consumer,
                              resp_resource_url: asset.resp_resource_url,
                              showBtn:asset.status === constant.AuthStatus.Applying && asset.provider === AccountHelper.getAccount().address && isNotSupervise
                        };
                  })
            }

      }
    
</script>
<style lang="scss" scoped>
    @import "../style/mixin";

    .data_auth_share_list_container {
        width: 100%;
        height: 100%;
        align-items: center;
        background: rgba(250, 250, 250, 1);
        padding-bottom: 40px;
        box-sizing: border-box;
        .data_auth_share_list_wrap {
            width: 69%;
            min-width: 994px;
            box-shadow: 0 2px 7px 0 rgba(3, 44, 65, 0.12);
            border-radius: 4px;
            margin-top: 30px;
            padding: 24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .data_auth_share_list_title_container {
                
                justify-content: space-between;
                margin-bottom: 20px;
                .data_auth_share_list_title {
                    font-size: 20px;
                    color: $mainFontColor;
                    .data_auth_share_list_filter_total {
                        width: 90px;
                        flex: 0 0 90px;
                        font-size: 14px;
                        color: $mainFontColor;
                        margin-left: 10px;
                    }
                }
                .btn {
                    width: 136px;
                }
            }
            .data_auth_share_list_filter_container {
                width: 100%;
                align-items: center;
                margin-bottom: 20px;
                .data_auth_share_list_select {
                    width: 170px;
                    height: 34px;
                    flex: 0 0 170px;
                    margin-right: 10px;
                }
                .data_auth_share_list_input {
                    margin-right: 10px;
                    width: 300px;
                    flex: 0 0 300px;
                }

            }
            .table_container {
                background: rgba(248, 248, 248, 1);
                border-radius: 4px;

                .el-table th, .el-table tr {
                    background: yellow;
                }
                .link_url {
                    color: $themeColor;
                    cursor: pointer;
                }
                .data_auth_link {
                    color: $themeColor;
                    cursor: pointer;
                    display: inline-block;
                    margin-right: 10px;
                }
                .data_auth_link_refuse {
                    color: #FE2F5D;
                }
            }
            .pagination_container {
                justify-content: flex-end;
                align-items: flex-end;
                margin-top: 10px;
                .total_page {
                    margin-right: 10px;
                    font-size: 14px;
                    color: $mainFontColor;
                }

            }
        }
        .asset_details_dialog_container {

            .asset_details_dialog_title {
                font-size: 20px;
                color: $mainFontColor;
                font-weight: 600;
                margin-bottom: 40px;
                text-align: center;
                display: inline-block;
                width: 100%;
            }
            .dialog-footer {
                display:flex;
                flex-direction:row;
                justify-content: center;
                .asset_details_cancel_btn {
                    width: 136px;
                    margin-right: 20px;
                }
                .asset_details_confirm_btn {
                    width: 136px;
                }
            }

        }
    }

</style>