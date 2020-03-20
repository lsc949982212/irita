<template>
    <div class="asset_list_container flexColumn">
        <div class="asset_list_wrap">
            <div class="asset_list_title_container flexRow">
                <div class="asset_list_title">
                    资产列表
                    <span class="asset_list_filter_total">
                        (共 {{ totalAssets }} 条记录)
                    </span>
                </div>

            </div>
            <div class="asset_list_filter_container flexRow">

                <el-select v-model="assetTypeValue"
                           class="asset_list_select"
                           placeholder="请选择" size="small">
                    <el-option
                            v-for="item in assetType"
                            :key="item.value"
                            :label="item.label"
                            :disabled="item.disabled"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="assetStatusValue"
                           class="asset_list_select"
                           placeholder="请选择" size="small">
                    <el-option
                            v-for="item in assetStatus"
                            :key="item.value"
                            :label="item.label"
                            :disabled="item.disabled"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="checkStatusValue"
                           class="asset_list_select"
                           placeholder="请选择" size="small">
                    <el-option
                            v-for="item in checkStatus"
                            :key="item.value"
                            :label="item.label"
                            :disabled="item.disabled"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="userAccountValue"
                           class="asset_list_select"
                           placeholder="请选择" size="small">
                    <el-option
                            v-for="item in userAccount"
                            :key="item.value"
                            :label="item.label"
                            :disabled="item.disabled"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="input"
                          class="asset_list_input"
                          placeholder="资产编号/资产名称/操作者地址"></el-input>
                <el-button size="medium"
                           @click="onPageChange(1)"
                           class="asset_list_btn" type="primary">搜索
                </el-button>

            </div>
            <div class="table_container">
                <el-table
                        :data="tableData"
                        v-loading="loading"
                        style="width: 100%">
                    <el-table-column
                            fixed
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
                            prop="type"
                            label="资产类型"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            label="操作者地址"
                            min-width="75">
                        <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('address',scope.row.owner)">
                                    {{ scope.row.displayOwnerAddress }}
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="displayOwner"
                            label="所有者"
                            min-width="60">
                    </el-table-column>
                    <el-table-column
                            prop="displayCheckStatus"
                            label="查验结果"
                            min-width="60">
                    </el-table-column>
                    <el-table-column
                            prop="displayTransStatus"
                            label="转让状态"
                            min-width="80">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="70">
                        <template slot-scope="scope">
                            <el-button @click="handleCheckClick(scope.row)" type="text" size="small">
                                查看
                                <i style="position:relative;width:5px;height:5px;top:-8px;left:-3px;
                                background:rgba(254,47,93,1);border-radius:50%;display:inline-block;"
                                   v-show="scope.row.isApply"></i>
                            </el-button>
                            <el-button type="text" size="small"
                                       v-show="getTransShow(scope.row)"
                                       @click="handleTransClick(scope.row)">转让
                            </el-button>
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
        </div>
    </div>
</template>

<script lang="ts">
      import accountHelper from '../helper/accountHelper';
      import {getFormatAddress} from '../util/util';
      import cfg from '../config/config.json';
      import schemaConfig from '../schema/config.json';
      import {Component, Vue} from 'vue-property-decorator';
      import * as types from "../types";
      import * as constant from "../constant";
      import AxiosHelper from '../helper/AxiosHelper';

      @Component
      export default class AssetList extends Vue {
            private assetStatusValue: number = constant.AssetsStatusOptions.All;
            private userAccountValue: number = constant.AssetsBelong.All;
            private tableData: any[] = [];
            private assetType: any[] = [];
            private totalAssets: number = 0;
            private totalTxCount: number = 1;
            private txListCurrentPage: number = 1;
            private checkStatusValue: number = constant.CheckStatusOptions.All;
            private assetTypeValue: string = '';
            private input: string = '';
            private loading: boolean = true;
            private assetStatus: types.IOptions[] = [
                  {
                        value: constant.AssetsStatusOptions.All,
                        label: constant.AssetsStatusOptionsMap.get(constant.AssetsStatusOptions.All)
                  }, {
                        value: constant.AssetsStatusOptions.Normal,
                        label: constant.AssetsStatusOptionsMap.get(constant.AssetsStatusOptions.Normal)
                  }, {
                        value: constant.AssetsStatusOptions.Applying,
                        label: constant.AssetsStatusOptionsMap.get(constant.AssetsStatusOptions.Applying)
                  }, {
                        value: constant.AssetsStatusOptions.Accept,
                        label: constant.AssetsStatusOptionsMap.get(constant.AssetsStatusOptions.Accept)
                  }
            ];
            private checkStatus: types.IOptions[] = [{
                  value: constant.CheckStatusOptions.All,
                  label: constant.CheckStatusOptionsMap.get(constant.CheckStatusOptions.All)
            }, {
                  value: constant.CheckStatusOptions.Checked,
                  label: constant.CheckStatusOptionsMap.get(constant.CheckStatusOptions.Checked)
            }, {
                  value: constant.CheckStatusOptions.NotCheck,
                  label: constant.CheckStatusOptionsMap.get(constant.CheckStatusOptions.NotCheck)
            },{
                  value: constant.CheckStatusOptions.CheckFailed,
                  label: constant.CheckStatusOptionsMap.get(constant.CheckStatusOptions.CheckFailed)
            }];
            private userAccount: types.IOptions[] = [{
                  value: constant.AssetsBelong.All,
                  label: constant.AssetsBelongMap.get(constant.AssetsBelong.All)
            }, {
                  value: constant.AssetsBelong.Mine,
                  label: constant.AssetsBelongMap.get(constant.AssetsBelong.Mine)
            }, {
                  value: constant.AssetsBelong.Others,
                  label: constant.AssetsBelongMap.get(constant.AssetsBelong.Others)
            }];

            private beforeMount(): void {
                  this.assetStatusValue = this.$route.query.asset_status_value ? Number(this.$route.query.asset_status_value) : constant.AssetsStatusOptions.All;
                  this.userAccountValue = this.$route.query.user_account_value ? Number(this.$route.query.user_account_value) : constant.AssetsBelong.All;
            }

            private mounted(): void {
                  this.onPageChange(1);
                  this.getAssetType();
            }

            private async getAssetType() {
                  try {
                        const url: string = `/assets/denoms`;
                        const data: types.IResponse<types.IDenoms> = await AxiosHelper.get({url, ctx: this});
                        if (data && data.status === 'success') {
                              if (data && data.data && data.data.denoms) {
                                    data.data.denoms.forEach((item: string) => {
                                          if (schemaConfig.denoms.includes(item)) {
                                                this.assetType.push({
                                                      value: item,
                                                      label: item
                                                })
                                          }
                                    });
                                    this.assetType.unshift({
                                          value: '',
                                          label: '全部资产类型'
                                    });

                              }
                        } else {
                              this.$message.error('请求数据错误');
                        }
                  } catch (e) {
                        console.error(e);
                        this.$message.error('请求数据错误');
                  }
            }

            private getTransShow(row: any): boolean {
                  return accountHelper.isOwner(row.owner) && row.transStatus === constant.AssetsStatus.Normal;
            }

            private toExplorer(type: string, param: string): void {
                  switch (type) {
                        case 'address':
                              window.open(`${cfg.app.explorer}/#/address/${param}`);
                              break;
                  }
            }

            private handleCheckClick(row: any): void {
                  this.$router.push(`/asset_detail?type=check&nft_id=${row.id}&query_type=${row.type}`);
            }

            private handleTransClick(row: any): void {
                  this.$router.push(`/asset_detail?type=trans&nft_id=${row.id}&query_type=${row.type}`);
            }

            private onPageChange(page: number): void {
                  this.txListCurrentPage = page;
                  this.getDataList(page);
            }

            private async getDataList(page: number) {
                  const {assetTypeValue, assetStatusValue, checkStatusValue, userAccountValue, input} = this;
                  let url: string = `/assets/search?pageNum=${page}&pageSize=10&used_count=true&asset_type=${assetTypeValue}&transfer_status=${assetStatusValue}&check_status=${checkStatusValue}&owner=${userAccountValue}`;
                  this.loading = true;
                  if (this.input) {
                        url += `&query_data=${input}`
                  }
                  try {
                        const data: types.IResponse<types.IAssetsListItem[]> = await AxiosHelper.get({url, ctx: this});
                        if (data && data.status === 'success' && data.data) {
                              console.log(data)
                              this.totalTxCount = data.total;
                              this.totalAssets = data.total;
                              this.tableData = data.data.map((asset: types.IAssetsListItem) => {
                                    const owner: types.IAccount | undefined = accountHelper.getAccountList().find((a: types.IAccount) => a.address === asset.nft_owner);
                                    return {
                                          number: asset.number,
                                          id: asset.nft_id,
                                          name: asset.asset_name,
                                          type: asset.type,
                                          owner: asset.nft_owner,
                                          displayOwnerAddress: getFormatAddress(asset.nft_owner),
                                          transStatus: asset.transfer_status,
                                          displayOwner: owner ? owner.name : '',
                                          displayCheckStatus: constant.CheckResultMap.get(asset.check_status),
                                          displayTransStatus: constant.AssetsStatusMap.get(asset.transfer_status),
                                          isApply: asset.is_apply
                                    };
                              })
                        }
                        this.loading = false;
                  } catch (e) {
                        console.error(e);
                        this.loading = false;
                        this.$message.error('请求数据错误');
                  }

            }

      }
</script>
<style lang="scss" scoped>
    @import "../style/mixin";

    .asset_list_container {
        width: 100%;
        height: 100%;
        align-items: center;
        background: rgba(250, 250, 250, 1);
        padding-bottom: 40px;
        box-sizing: border-box;
        .asset_list_wrap {
            width: 69%;
            min-width: 994px;
            box-shadow: 0 2px 7px 0 rgba(3, 44, 65, 0.12);
            border-radius: 4px;
            margin-top: 30px;
            padding: 24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .asset_list_title_container {
                justify-content: space-between;
                margin-bottom: 20px;
                .asset_list_title {
                    font-size: 20px;
                    color: $mainFontColor;
                    .asset_list_filter_total {
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
            .asset_list_filter_container {
                width: 100%;
                align-items: center;
                margin-bottom: 20px;

                .asset_list_select {
                    width: 140px;
                    height: 34px;
                    flex: 0 0 140px;
                    margin-right: 10px;
                }
                .asset_list_input {
                    margin-right: 10px;
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

    }

</style>