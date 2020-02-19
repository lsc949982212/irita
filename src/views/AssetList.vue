<template>
    <div class="asset_list_container">
        <div class="asset_list_wrap">
            <div class="asset_list_title_container">
                <div class="asset_list_title">
                    资产列表
                    <span class="asset_list_filter_total">
                        (共 {{ totalAssets }} 条记录)
                    </span>
                </div>

            </div>
            <div class="asset_list_filter_container">

                <el-select v-model="assetTypeValue"
                           @change="handleSelectChange"
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
                           @change="handleSelectChange"
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
                           @change="handleSelectChange"
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
                           @change="handleSelectChange"
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
                            label="查验状态"
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
            <div class="pagination_container" v-show="totalTxCount > 10">
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

<script>
    import axios from '../helper/httpHelper';
    import { constant } from '../constant/constant';
    import { accountHelper } from '../helper/accountHelper';
    import { getFormatAddress } from '../util/util';
    import cfg from '../config/config';
    import denoms from '../schema/config';


    export default {
        name : 'AssetList',
        data(){
            let assetType = denoms.denoms.map((d)=>{
                return {
                    value: d,
                    label: d
                }
            });
            assetType.unshift({
                value: '',
                label: '全部资产类型'
            });

            let assetStatusValue = this.$route.query.asset_status_value ? Number(this.$route.query.asset_status_value) : constant.ASSET_STATUS_OPTIONS.ALL,
                userAccountValue = this.$route.query.user_account_value ? Number(this.$route.query.user_account_value) : constant.ASSETS_BELONG.ALL;
            return {
                tableData : [],
                totalAssets : 0,
                totalTxCount : 1,
                txListCurrentPage : 1,
                assetType,
                assetStatus : [{
                    value: constant.ASSET_STATUS_OPTIONS.ALL,
                    label: '全部资产状态'
                },{
                    value: constant.ASSET_STATUS_OPTIONS.NORMAL,
                    label: '正常'
                },{
                    value: constant.ASSET_STATUS_OPTIONS.APPLYING,
                    label: '转让申请中'
                },{
                    value: constant.ASSET_STATUS_OPTIONS.ACCEPT,
                    label: '已接受待转让'
                },],
                checkStatus : [{
                    value: constant.CHECK_STATUS_OPTIONS.ALL,
                    label: '全部查验状态'
                },{
                    value: constant.CHECK_STATUS_OPTIONS.CHECKED,
                    label: '已查验'
                },{
                    value: constant.CHECK_STATUS_OPTIONS.NOT_CHECK,
                    label: '未查验'
                }],
                userAccount : [{
                    value: constant.ASSETS_BELONG.ALL,
                    label: '全部用户资产'
                },{
                    value: constant.ASSETS_BELONG.MINE,
                    label: '我的资产'
                },{
                    value: constant.ASSETS_BELONG.OTHERS,
                    label: '其他用户资产'
                }],
                assetTypeValue:'',
                assetStatusValue,
                checkStatusValue:constant.CHECK_STATUS_OPTIONS.ALL,
                userAccountValue,
                input:'',

            }
        },
        components : {},
        mounted(){
            this.onPageChange(1);
        },
        methods : {
            getDisplayAssetTransStatus(status){
                switch (status){
                    case constant.ASSET_STATUS.NORMAL:
                        return '正常';
                    case constant.ASSET_STATUS.APPLyING:
                        return '转让申请中';
                    case constant.ASSET_STATUS.ACCEPT:
                        return '已接受待转让';

                }
            },
            handleSelectChange(value){

                //this.onPageChange(1);
            },
            getTransShow(row){
                return accountHelper.isOwner(row.owner) && row.transStatus === constant.ASSET_STATUS.NORMAL
            },
            getDisplayCheckStatus(status){
                switch (status){
                    case constant.CHECK_RESULT.NOT_CHECK:
                        return '未查验';
                    case constant.CHECK_RESULT.CHECKED:
                        return '已查验';
                    case constant.CHECK_RESULT.CHECK_FAILED:
                        return '查验失败';

                }
            },
            toExplorer(type, param){
                switch (type){
                    case 'address':
                        window.open(`${cfg.app.explorer}/#/address/${param ? param : this.chainInfo.nft_owner}`);
                }
            },
            handleCheckClick(row){
                this.$router.push(`/asset_detail?type=check&nft_id=${row.id}&owner=${row.owner}&transStatus=${row.transStatus}&query_type=${row.type}&number=${row.number}`);
            },
            handleTransClick(row){
                this.$router.push(`/asset_detail?type=trans&nft_id=${row.id}&owner=${row.owner}&transStatus=${row.transStatus}&query_type=${row.type}&number=${row.number}`);
            },
            onPageChange(page){
                this.txListCurrentPage = page;
                this.getDataList(page);
            },
            getDataList(page){
                const {assetTypeValue,assetStatusValue,checkStatusValue,userAccountValue,input} = this;
                console.log(assetTypeValue,assetStatusValue,checkStatusValue,userAccountValue,input);

                let url =  `/assets/search?pageNum=${page}&pageSize=10&used_count=true&asset_type=${assetTypeValue}&transfer_status=${assetStatusValue}&check_status=${checkStatusValue}&owner=${userAccountValue}`;
                if(this.input){
                    url += `&query_data=${input}`
                }
                axios.get({url, ctx : this}).then((data) =>{
                    if(data && data.data){
                        this.handleData(data);
                    }
                }).catch(e =>{
                    console.error(e)
                });
            },
            handleData(data){
                console.log(data)
                this.totalTxCount = data.total;
                this.totalAssets = data.total;
                this.tableData = data.data.map((asset) =>{
                    return {
                        number : asset.number,
                        id : asset.nft_id,
                        name : asset.asset_name,
                        type : asset.type,
                        owner : asset.nft_owner,
                        displayOwnerAddress : getFormatAddress(asset.nft_owner),
                        transStatus : asset.transfer_status,
                        displayOwner : accountHelper.getAccountList().find((a) => a.address === asset.nft_owner) ? accountHelper.getAccountList().find((a) => a.address === asset.nft_owner).name : '',
                        displayCheckStatus : this.getDisplayCheckStatus(asset.check_status),
                        displayTransStatus : this.getDisplayAssetTransStatus(asset.transfer_status),
                        isApply : asset.is_apply
                    };
                })
            },
            search(){

            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../style/mixin";

    .asset_list_container {
        width: 100%;
        height: 100%;
        .flexColumn;
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
                .flexRow;
                justify-content: space-between;
                margin-bottom: 20px;
                .asset_list_title {
                    font-size: 20px;
                    color: @mainFontColor;
                    .asset_list_filter_total {
                        width: 90px;
                        flex: 0 0 90px;
                        font-size: 14px;
                        color: @mainFontColor;
                        margin-left: 10px;
                    }
                }
                .btn {
                    width: 136px;
                }
            }
            .asset_list_filter_container {
                .flexRow;
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
                    margin-right:10px;
                }

            }
            .table_container {
                background: rgba(248, 248, 248, 1);
                border-radius: 4px;

                .el-table th, .el-table tr {
                    background: yellow;
                }
                .link_url {
                    color: @themeColor;
                    cursor: pointer;
                }
            }
            .pagination_container {
                .flexRow;
                justify-content: flex-end;
                align-items: flex-end;
                margin-top: 10px;
                .total_page {
                    margin-right: 10px;
                    font-size: 14px;
                    color: @mainFontColor;
                }

            }
        }

    }

</style>