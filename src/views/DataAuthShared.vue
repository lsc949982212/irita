<template>
    <div class="data_auth_share_list_container">
        <div class="data_auth_share_list_wrap">
            <div class="data_auth_share_list_title_container">
                <div class="data_auth_share_list_title">
                    数据授权共享
                    <span class="data_auth_share_list_filter_total">
                        (共{{ totalAssets }} 个资产)
                    </span>
                </div>

            </div>
            <div class="data_auth_share_list_filter_container">
                <el-select v-model="authStatusValue"
                           @change="handleSelectChange"
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
                           @change="handleSelectChange"
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
                            prop="applyTime"
                            label="申请时间"
                            min-width="110">
                    </el-table-column>
                    <el-table-column
                            prop="applyer"
                            label="申请者"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            prop="responser"
                            label="响应者"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            prop="authStatus"
                            label="授权状态"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            prop="lastUpdateTime"
                            label="最后更新时间"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="140">
                        <template slot-scope="scope">
                            <span @click="handleCheckClick(scope.row)"
                                  class="data_auth_link">
                                资产详情
                            </span>
                            <span @click="handleAuthClick(scope.row)"
                                  v-show="scope.row.status === constant.AUTH_STATUS.APPLYING"
                                  class="data_auth_link">
                                授权
                            </span>
                            <span @click="handleRefuseClick(scope.row)"
                                  v-show="scope.row.status === constant.AUTH_STATUS.APPLYING"
                                  class="data_auth_link data_auth_link_refuse">
                                拒绝
                            </span>
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

<script>
    import axios from '../helper/httpHelper';
    import { constant } from '../constant/constant';
    import { accountHelper } from '../helper/accountHelper';
    import { getFormatAddress, formatTimestamp } from '../util/util';
    import { getErrorMsgByErrorCode } from '../helper/errorCodeHelper';
    import cfg from '../config/config';
    import denoms from '../schema/config';
    import { Message } from 'element-ui';


    export default {
        name : 'AssetList',
        data(){
            let authStatusValue = this.$route.query.auth_status_value ? Number(this.$route.query.auth_status_value) : constant.AUTH_STATUS.ALL,
                relevantStatusValue = this.$route.query.relevant_status_value ? Number(this.$route.query.relevant_status_value) : constant.RELEVANT.ALL;
            return {
                tableData : [],
                totalAssets : 0,
                totalTxCount : 1,
                txListCurrentPage : 1,
                authStatus : [{
                    value: constant.AUTH_STATUS.ALL,
                    label: '全部授权状态'
                },{
                    value: constant.AUTH_STATUS.APPLYING,
                    label: '申请中'
                },{
                    value: constant.AUTH_STATUS.AUTHORIZED,
                    label: '已授权'
                },{
                    value: constant.AUTH_STATUS.REFUSED,
                    label: '已拒绝'
                },{
                    value: constant.AUTH_STATUS.INVALID,
                    label: '已失效'
                },{
                    value: constant.AUTH_STATUS.EXPIRED,
                    label: '已过期'
                },],
                relevantStatus : [{
                    value: constant.RELEVANT.ALL,
                    label: '和我有关的全部记录'
                },{
                    value: constant.RELEVANT.MY_POST,
                    label: '我发起申请的'
                },{
                    value: constant.RELEVANT.MY_RECEIVE,
                    label: '向我申请的'
                }],
                authStatusValue,
                relevantStatusValue,
                constant,
                input:'',
                consumer_pubkey:'',
                request_id:'',
                centerDialogVisible:false,
                loading:false,
                dialogTitle:'',
                consumer:'',
                nftId:'',
                dialogType:0,//0 授权, 1 拒绝;

            }
        },
        components : {},
        mounted(){
            this.onPageChange(1);
        },
        methods : {
            getDisplayAuthStatus(status){
                switch (status){
                    case constant.AUTH_STATUS.APPLYING:
                        return '申请中';
                    case constant.AUTH_STATUS.AUTHORIZED:
                        return '已授权';
                    case constant.AUTH_STATUS.REFUSED:
                        return '已拒绝';
                    case constant.AUTH_STATUS.INVALID:
                        return '已失效';
                    case constant.AUTH_STATUS.EXPIRED:
                        return '已过期';
                }
            },
            handleAuthClick(item){
                this.dialogType = 0;
                this.centerDialogVisible = true;
                this.request_id = item.request_id;
                this.consumer = item.consumer;
                this.nftId = item.id;
                this.consumer_pubkey = item.consumer_pubkey;
                this.dialogTitle = '确认要授权吗';

            },
            handleRefuseClick(item){
                this.dialogType = 1;
                this.centerDialogVisible = true;
                this.request_id = item.request_id;
                this.consumer = item.consumer;
                this.nftId = item.id;
                this.consumer_pubkey = item.consumer_pubkey;
                this.dialogTitle = '确认要拒绝吗';
            },
            handleConfirmBtnClick(){
                const {request_id, dialogType,consumer} = this;
                console.error(request_id, dialogType,consumer)
                let body = null, url = '', str = '';
                if(dialogType === 0){
                    body = {
                        "consumer_pubkey" : this.$accountHelper.getPublicKeyByAddress(consumer),
                        "request_id" : request_id,
                    };
                    url = `/assets_authorization/${this.nftId}/authorization/accept`;
                    str = '授权'
                }else{
                    body = {
                        "request_id" : request_id,
                    };
                    url = `/assets_authorization/${this.nftId}/authorization/refuse`;
                    str = '拒绝'
                }
                this.loading = true;
                axios.post({url,body, ctx : this}).then((data) =>{
                    console.log(data);
                    this.loading = false;
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : `${str}成功`,
                            type : 'success'
                        });
                        this.centerDialogVisible = false;
                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                        this.centerDialogVisible = false;
                    } else {
                        this.$message.error(`${str}失败`);
                        this.centerDialogVisible = false;
                    }
                }).catch(e =>{
                    console.error(e);
                    this.loading = false;
                    this.$message.error(`${str}失败`);
                    this.centerDialogVisible = false;
                });

            },
            handleSelectChange(){
                this.onPageChange(1);
            },
            getTransShow(row){
                return accountHelper.isOwner(row.owner) && row.transStatus === constant.ASSET_STATUS.NORMAL
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

                const {relevantStatusValue,authStatusValue,input} = this;
                console.log(authStatusValue,relevantStatusValue,input);

                let url = `/assets_authorization?pageNum=${page}&pageSize=10&used_count=true&auth_type=${relevantStatusValue}&status=${authStatusValue}`;
                if(this.input){
                    url += `&query_data=${input}`
                }
                axios.get({url , ctx : this}).then((data) =>{
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
                        number : asset.asset_no,
                        id : asset.nft_id,
                        name : asset.asset_name,
                        applyTime : formatTimestamp(asset.time),
                        lastUpdateTime : formatTimestamp(asset.update_at),
                        applyer:getFormatAddress(asset.consumer),
                        responser:getFormatAddress(asset.provider),
                        authStatus : this.getDisplayAuthStatus(asset.status),
                        type : asset.type,
                        owner : asset.nft_owner,
                        transStatus : asset.transfer_status,
                        status:asset.status,
                        request_id:asset.request_id,
                        consumer:asset.consumer,
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

    .data_auth_share_list_container {
        width: 100%;
        height: 100%;
        .flexColumn;
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
                .flexRow;
                justify-content: space-between;
                margin-bottom: 20px;
                .data_auth_share_list_title {
                    font-size: 20px;
                    color: @mainFontColor;
                    .data_auth_share_list_filter_total {
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
            .data_auth_share_list_filter_container {
                .flexRow;
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
                    margin-right:10px;
                    width:300px;
                    flex:0 0 300px;
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
                .data_auth_link{
                    color: @themeColor;
                    cursor: pointer;
                    display:inline-block;
                    margin-right:10px;
                }
                .data_auth_link_refuse{
                    color:#FE2F5D;
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
        .asset_details_dialog_container {

            .asset_details_dialog_title {
                font-size: 20px;
                color: @mainFontColor;
                font-weight: 600;
                margin-bottom: 40px;
                text-align: center;
                display: inline-block;
                width: 100%;
            }
            .dialog-footer {
                .flexRow;
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