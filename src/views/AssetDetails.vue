<template>
    <div class="asset_details_container">
        <div class="asset_details_wrap">
            <div class="asset_details_title_container">
                <span class="asset_details_title">
                    {{ $route.query.type === 'check'? '资产信息' : '资产转让详情' }}
                </span>
                <el-button size="small"
                           @click="edit"
                           v-show="editBtnShow"
                           class="btn" type="primary">编辑
                </el-button>
                <el-button size="small"
                           @click="applyCheck"
                           v-show="applyBtnShow"
                           class="btn" type="primary">申请查看
                </el-button>

            </div>
            <div class="asset_details_trans_container" v-if="$route.query.type === 'trans'">
                <span class="asset_details_trans_title">
                    受让方 :
                </span>
                <el-select v-model="value" placeholder="请选择" size="small">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :disabled="item.disabled"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-button size="small"
                           @click="handleTransBtnClick"
                           class="asset_details_trans_btn" type="primary">转让申请
                </el-button>
            </div>
            <div class="schema_container" id="schema_container">
                <div class="content_item" id="detail_json_schema_node"></div>
            </div>

            <div class="content_container">
                <p class="content_chain_info">
                    链上信息
                </p>
                <div class="content_chain_info_wrap">
                    <div class="content_chain_info_item">
                        <div class="content_chain_info_item_wrap">
                            <span class="content_chain_info_item_title">
                                denom:
                            </span>
                            <span class="content_chain_info_item_content">
1
                            </span>
                        </div>
                        <div class="content_chain_info_item_wrap">
                            <span class="content_chain_info_item_title">
                                owner:
                            </span>
                            <span class="content_chain_info_item_content">
2
                            </span>
                        </div>
                        <div class="content_chain_info_item_wrap">
                            <span class="content_chain_info_item_title">
                                详情:
                            </span>
                            <span class="content_chain_info_item_content link" @click="handleTokenDetailClick">
https://www.taobao.com
                            </span>
                        </div>
                    </div>
                    <div class="content_chain_info_item">
                        <div class="content_chain_info_item_wrap">
                            <span class="content_chain_info_item_title">
                                token_id:
                            </span>
                            <span class="content_chain_info_item_content">
4
                            </span>
                        </div>
                        <div class="content_chain_info_item_wrap">
                            <span class="content_chain_info_item_title">
                                token_uri:
                            </span>
                            <span class="content_chain_info_item_content">

                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content_container">
                <p class="content_chain_info">
                    资产转让
                </p>
                <div class="content_table_wrap">
                    <el-table
                            :data="transferData"
                            style="width: 100%">
                        <el-table-column
                                fixed
                                prop="time"
                                label="提出时间"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="receiver"
                                label="受让者"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="txStatus"
                                label="转让状态"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                min-width="80">
                            <template slot-scope="scope">
                                <el-button @click="trans(scope.row)"
                                           v-show="getTransDisplayShow(scope.row,0)"
                                           type="text" size="small">
                                    转让
                                </el-button>
                                <el-button @click="acceptTrans(scope.row)"
                                           v-show="getTransDisplayShow(scope.row,1)"
                                           type="text" size="small">
                                    接受转让
                                </el-button>

                                <el-button type="text" size="small"
                                           @click="refused(scope.row)"
                                           v-show="getTransDisplayShow(scope.row,1)">拒绝
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="pagination_container" v-show="totalTransCount > 5">
                <span class="total_page">
                    共{{ totalTransCount }}条
                </span>
                <el-pagination
                        background
                        @current-change="onTxTransPaginationClick"
                        :current-page="transCurrentPage"
                        layout="prev, pager, next"
                        :total="1000">
                </el-pagination>
            </div>
            <div class="content_container">
                <p class="content_chain_info">
                    数据申请与授权
                </p>
                <div class="content_table_wrap">
                    <el-table
                            :data="applyAndAuthDataList"
                            style="width: 100%">
                        <el-table-column
                                fixed
                                prop="time"
                                label="提出时间"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="applicant"
                                label="申请者"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="applyStatus"
                                label="申请状态"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                min-width="80">
                            <template slot-scope="scope">
                                <el-button @click="handleAuthClick(scope.row)"
                                           v-show="getAuthShow(scope.row)"
                                           type="text" size="small">
                                    授权
                                </el-button>
                                <el-button type="text" size="small"
                                           v-show="getAuthShow(scope.row)"
                                           @click="handleRefusedClick(scope.row)">拒绝
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="pagination_container" v-show="totalApplyCount > 5">
                <span class="total_page">
                    共{{ totalApplyCount }}条
                </span>
                <el-pagination
                        background
                        @current-change="onAuthPaginationClick"
                        :current-page="authCurrentPage"
                        layout="prev, pager, next"
                        :total="1000">
                </el-pagination>
            </div>
            <div class="content_container">
                <div class="content_tab_container">
                    <span class="content_tab_item"
                          :class="tab === 0? 'active_tab' : ''"
                          @click="handleTabClick(0)">
                        资产交易记录
                    </span>
                    <span class="content_tab_item"
                          :class="tab === 1? 'active_tab' : ''"
                          @click="handleTabClick(1)">
                        服务交易记录
                    </span>

                </div>

                <div class="content_table_wrap" v-show="tab === 0">
                    <el-table
                            :data="assetListData"
                            style="width: 100%">
                        <el-table-column
                                fixed
                                prop="txType"
                                label="交易类型"
                                min-width="100">
                        </el-table-column>
                        <el-table-column
                                prop="txHash"
                                label="交易哈希"
                                min-width="100">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="时间"
                                min-width="60">
                        </el-table-column>
                        <el-table-column
                                prop="id"
                                label="senderAddr"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="receiverAddr"
                                label="接收地址"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="height"
                                label="区块高度"
                                min-width="50">
                        </el-table-column>

                    </el-table>
                </div>
                <div class="content_table_wrap" v-show="tab === 1">
                    <el-table
                            :data="serviceListData"
                            style="width: 100%">
                        <el-table-column
                                fixed
                                prop="serviceName"
                                label="服务名称"
                                min-width="100">
                        </el-table-column>
                        <el-table-column
                                prop="serviceType"
                                label="服务类型"
                                min-width="100">
                        </el-table-column>
                        <el-table-column
                                prop="serviceHash"
                                label="服务交易哈希"
                                min-width="130">
                        </el-table-column>
                        <el-table-column
                                prop="id"
                                label="time"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                prop="providerAddr"
                                label="提供方地址"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="consumeAddr"
                                label="消费方地址"
                                min-width="120">
                        </el-table-column>
                        <el-table-column
                                prop="height"
                                label="区块高度"
                                min-width="70">
                        </el-table-column>

                    </el-table>
                </div>
            </div>
            <div class="pagination_container" v-show="totalTxListCount > 5 && tab === 0">
                    <span class="total_page">
                        共{{ totalTxListCount }}条
                    </span>
                <el-pagination
                        background
                        @current-change="onAssetTxPaginationClick"
                        :current-page="assetTxCurrentPage"
                        layout="prev, pager, next"
                        :total="1000">
                </el-pagination>
            </div>
            <div class="pagination_container" v-show="totalServiceListCount > 5 && tab === 1">
                    <span class="total_page">
                        共{{ totalServiceListCount }}条
                    </span>
                <el-pagination
                        background
                        @current-change="onServiceTxPaginationClick"
                        :current-page="serviceTxCurrentPage"
                        layout="prev, pager, next"
                        :total="1000">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                :visible.sync="centerDialogVisible"
                width="400px"
                top="35vh"
                center>
            <div class="asset_details_dialog_container">
                <span class="asset_details_dialog_title">dialogTitle</span>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancelBtnClick"
                               size="medium"
                               class="asset_details_cancel_btn">取消
                    </el-button>
                    <el-button type="primary"
                               size="medium"
                               class="asset_details_confirm_btn"
                               @click="handleConfirmBtnClick">确定
                    </el-button>

                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import schema from './schema';
    import jsonData from './data';
    import { constant } from '../constant/constant';
    import axios from '../helper/httpHelper';

    export default {
        name : 'AssetAdd',
        data(){
            return {
                jsonData : null,
                transferData : [{
                    id : '金属送吧膜回收,知否知否',
                    time : 'A公司的应收账款',
                    receiver : '应收账款',
                    txStatus : '暴力服务商B',
                }],
                applyAndAuthDataList : [{
                    id : '金属送吧膜回收,知否知否',
                    time : 'A公司的应收账款',
                    applicant : '应收账款',
                    applyStatus : '暴力服务商B',
                }],
                assetListData : [{
                    id : '金属送吧膜回收,知否知否',
                    txType : 'A公司的应收账款',
                    txHash : '应收账款',
                    time : '暴力服务商B',
                    senderAddr : 'A公司的应收账款',
                    receiverAddr : '应收账款',
                    height : '暴力服务商B',
                }],
                serviceListData : [{
                    id : '金属送吧膜回收,知否知否',
                    serviceName : 'A公司的应收账款',
                    serviceType : '应收账款',
                    serviceHash : '暴力服务商B',
                    time : 'A公司的应收账款',
                    providerAddr : '应收账款',
                    consumeAddr : '应收账款',
                    height : '暴力服务商B',
                }],
                tab : 0,
                totalTransCount : 100,
                totalApplyCount : 100,
                totalTxListCount : 100,
                totalServiceListCount : 100,
                options : [{
                    value : '1',
                    label : '应收账款'//todo 受让方的账号名称
                }, {
                    value : '2',
                    label : '非标资产',
                    disabled : true
                }],
                value : '1',
                centerDialogVisible : false,
                dialogTitle : '确认转让?',
                dialogType : 1,
                transCurrentPage : 1,
                authCurrentPage : 1,
                assetTxCurrentPage : 1,
                serviceTxCurrentPage : 1,
            }
        },
        components : {},
        mounted(){
            $("#detail_json_schema_node").alpaca({
                "schemaSource" : schema,
                "dataSource" : jsonData,
                "view" : "bootstrap-display"
            });
            console.log(this.$route)


            setTimeout(()=>{
                let node = this.getElementByAttr('div','data-alpaca-field-path', /^\//);
                for(let item of node){
                    const path = item.getAttribute('data-alpaca-field-path')
                    let status = document.createElement('span');
                    status.className = 'check_status';
                    status.innerHTML = '未查验';
                    item.appendChild(status);
                    let btn = document.createElement('span');
                    btn.className = 'check_btn';
                    btn.innerHTML = '查验';
                    btn.onclick = this.handleCheck.bind(this, path);
                    item.appendChild(btn);

                }
            },300)
        },
        computed : {
            editBtnShow(){
                //todo 资产拥有者,并且状态是正常
                return this.$route.query.type === 'check'
            },
            applyBtnShow(){
                //todo 非资产拥有者,并且有加密的数据
                //转让申请中或者是已接收待转让
                return this.$route.query.type === 'check' && !this.isOwner
            },
            isOwner(){
                //todo
                return true
            }
        },
        methods : {
            edit(){
                this.$router.push('/asset_edit');
            },
            applyCheck(){

            },
            acceptTrans(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认接受转让?';
                this.dialogType = 2;
            },
            trans(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认转让?';
                this.dialogType = 1;
            },
            refused(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认拒绝接受转让?';
                this.dialogType = 3;
            },
            handleAuthClick(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认授权?';
                this.dialogType = 4;
            },
            handleRefusedClick(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认拒绝转让?';
                this.dialogType = 5;
            },
            getTransDisplayShow(row, type){
                if(type === 0){
                    if(this.isOwner && row.status === constant.ASSET_LIST_STATUS.ACCEPT){
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(!this.isOwner && row.status === constant.ASSET_LIST_STATUS.APPLYING){
                        return true;
                    } else {
                        return false;
                    }
                }

            },
            getAuthShow(row){
                if(this.isOwner && row.status === constant.AUTHORIZATION_STATUS.APPLYING){
                    return true;
                } else {
                    return false;
                }
            },
            getDisplayAssetTransStatus(status){
                switch (status){
                    case constant.ASSET_LIST_STATUS.APPLYING:
                        return '转让申请中';
                    case constant.ASSET_LIST_STATUS.ACCEPT:
                        return '已接受待转让';
                    case constant.ASSET_LIST_STATUS.TRANSFERED:
                        return '已转让';
                    case constant.ASSET_LIST_STATUS.REFUSED:
                        return '已拒绝';
                    case constant.ASSET_LIST_STATUS.INVALID:
                        return '已失效';

                }
            },
            getDisplayAssetAuthStatus(status){
                switch (status){
                    case constant.AUTHORIZATION_STATUS.APPLYING:
                        return '申请中';
                    case constant.AUTHORIZATION_STATUS.AUTH:
                        return '已授权';
                    case constant.AUTHORIZATION_STATUS.REFUSED:
                        return '已拒绝';
                    case constant.AUTHORIZATION_STATUS.INVALID:
                        return '已失效';

                }
            },

            handleTabClick(tab){
                this.tab = tab;
            },
            onTxTransPaginationClick(page){
                console.log(page)
                this.transCurrentPage = page
            },
            onAuthPaginationClick(page){
                console.log(page)
                this.authCurrentPage = page
            },
            onAssetTxPaginationClick(page){
                console.log(page)
                this.assetTxCurrentPage = page
            },
            onServiceTxPaginationClick(page){
                console.log(page)
                this.serviceTxCurrentPage = page
            },
            getDataList(page, url, index){
                axios.get({url, ctx : this}).then((data) =>{
                    this.handleData(data, index)
                });

            },
            handleData(data, index){

            },
            handleTransBtnClick(){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认转让?';
                this.dialogType = 0;
            },
            handleConfirmBtnClick(){

            },
            handleCancelBtnClick(){
                this.centerDialogVisible = false;
            },
            handleTokenDetailClick(){
                window.open('https://www.baidu.com')
            },
            getElementByAttr(tag, dataAttr, reg){
                let aElements = document.getElementById('schema_container').getElementsByTagName(tag);
                let aEle = [];
                for(let i = 0 ; i < aElements.length ; i++){
                    let ele = aElements[i].getAttribute(dataAttr);
                    if(ele && ele.startsWith('/') && ele !== '/'){
                        aEle.push(aElements[i]);
                    }
                }
                return aEle;
            },
            handleCheck(path){
                console.log(path)
            }

        }
    }
</script>
<style lang="less">
    @import "../style/mixin";

    .asset_details_container {
        width: 100%;
        height: 100%;
        .flexColumn;
        align-items: center;
        background: rgba(250, 250, 250, 1);
        .asset_details_wrap {
            width: 69%;
            min-width: 994px;
            box-shadow: 0 2px 7px 0 rgba(3, 44, 65, 0.12);
            border-radius: 4px;
            margin-top: 30px;
            padding: 24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .asset_details_title_container {
                .flexRow;
                justify-content: space-between;
                margin-bottom: 20px;
                .asset_details_title {
                    font-size: 20px;
                    color: @mainFontColor;
                }
                .btn {
                    width: 136px;
                }
            }
            .asset_details_trans_container {
                .flexRow;
                align-items: center;
                margin-bottom: 20px;
                .asset_details_trans_title {
                    font-size: 14px;
                    color: @mainFontColor;
                    margin-right: 10px;
                }
                .asset_details_trans_btn {
                    margin-left: 20px;
                    width: 136px;
                }
            }
            .schema_container {

                .alpaca-container-item {
                    background: rgba(248, 248, 248, 1) !important;
                }
                .alpaca-container-label {
                    font-size: 14px;
                    font-weight: 400;
                    color: @mainFontColor;
                    padding-bottom: 10px;
                    border-color: #EDEDED;
                }
                .form-group {
                    .flexRow;

                    .alpaca-control-label {
                        font-size: 14px;
                        font-weight: 400;
                        color: #9E9E9E;
                        margin-right: 10px;
                    }
                    .alpaca-required-indicator {
                        display: none;
                    }
                    .alpaca-control {
                        font-size: 14px;
                        color: @mainFontColor;
                    }
                    .check_status{
                        font-size:14px;
                        color:@mainFontColor;
                        margin-left:30px;
                    }
                    .check_btn{
                        cursor:pointer;
                        color:@themeColor;
                        font-weight:400;
                        font-size:14px;
                        margin-left:30px;
                    }
                }
            }
            .content_container {
                background: rgba(248, 248, 248, 1);
                border-radius: 4px;
                padding: 20px;
                margin-bottom: 20px;
                .content_chain_info {
                    font-size: 14px;
                    color: @mainFontColor;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #EDEDED
                }
                .content_chain_info_wrap {
                    .flexRow;
                    width: 100%;
                    .content_chain_info_item {
                        flex: 1;

                        .content_chain_info_item_wrap {
                            .flexRow;
                            margin-top: 17px;
                            .content_chain_info_item_title {
                                font-size: 14px;
                                color: #9E9E9E;
                                width: 80px;
                            }
                            .content_chain_info_item_content {
                                font-size: 14px;
                                color: @mainFontColor;
                            }
                            .link {
                                color: @themeColor;
                                cursor: pointer;
                            }
                        }
                    }

                }
                .content_tab_container {
                    .flexRow;

                    .content_tab_item {
                        padding-bottom: 10px;
                        border-bottom: 2px solid transparent;
                        box-sizing: border-box;
                        font-size: 14px;
                        font-weight: 600;
                        margin-right: 40px;
                        cursor: pointer;
                    }
                    .active_tab {
                        color: @themeColor;
                        border-color: @themeColor;
                    }

                }

            }
            .pagination_container {
                .flexRow;
                justify-content: flex-end;
                align-items: flex-end;
                margin-bottom: 20px;
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