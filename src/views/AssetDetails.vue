<template>
    <div class="asset_details_container">
        <div class="asset_details_wrap">
            <div class="asset_details_title_container">
                <span class="asset_details_title">
                    {{ $route.query.type === 'check'? '资产信息' : '资产转让详情' }}
                </span>
                <div class="edit_btn_container">
                    <el-button size="small"
                               v-show="!applyTransShow" class="btn"
                               style="margin-bottom:10px;"
                               @click="showJsonData = !showJsonData"
                               type="default">
                        显示/隐藏 原始数据
                    </el-button>
                    <el-button size="small"
                               @click="edit"
                               v-show="editBtnShow"
                               class="btn" type="primary">编辑
                    </el-button>
                    <el-button size="small"
                               @click="applyCheck"
                               v-show="applyAuthShow"
                               :loading="applyBtnLoading"
                               class="btn" type="primary">申请查看
                    </el-button>
                    <el-button size="small"
                               @click="unlock"
                               v-show="unlockShow"
                               class="btn" type="primary">点击解密
                    </el-button>
                </div>


            </div>

            <div class="asset_details_trans_container"
                 v-show="applyTransShow"
                 v-if="$route.query.type === 'trans'">
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
            <div class="schema_container" id="schema_container" v-show="!showJsonData">
                <div class="content_item" id="detail_json_schema_node"></div>
                <div class="content_item" id="locked_detail_json_schema_node" style="display:none;"></div>
                <!-- <div class="note_container" v-show="jsonData">
                     <span class="auth_title">授权可见:</span>
                     <span class="auth_color"></span>
                     <span class="secret_title">仅自己可见:</span>
                     <span class="secret_color"></span>

                 </div>-->
            </div>
            <div class="schema_container" v-show="showJsonData">
                <pre>{{ jsonData }}</pre>
            </div>


            <div class="content_container" style="margin-top:20px;">
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
                                {{ chainInfo.type }}
                            </span>
                        </div>
                        <div class="content_chain_info_item_wrap">
                            <span class="content_chain_info_item_title">
                                nft_owner:
                            </span>
                            <span class="content_chain_info_item_content link" @click="toExplorer('address')">
                                {{ chainInfo.nft_owner }}
                            </span>
                        </div>
                    </div>
                    <div class="content_chain_info_item">
                        <div class="content_chain_info_item_wrap">
                            <span class="content_chain_info_item_title">
                                token_id:
                            </span>
                            <span class="content_chain_info_item_content link" @click="toExplorer('nft_id')">
                                {{ chainInfo.number }}
                            </span>
                        </div>
                        <div class="content_chain_info_item_wrap">
                            <span class="content_chain_info_item_title">
                                token_uri:
                            </span>
                            <a class="content_chain_info_item_content link" :href="chainInfo.nft_uri" target="_blank">
                                {{ chainInfo.nft_uri }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content_container">
                <p class="content_chain_info">
                    资产转让
                </p>
                <div class="auth_refresh_btn" @click="refreshList('trans')">
                    <div class="latest_update_time_container" v-show="transLatestUpdateTime">
                        <span class="latest_update_title">
                            最后更新时间
                        </span>
                        <span class="latest_update_content">
                            {{ transLatestUpdateTime }}
                        </span>
                    </div>
                    <img src="../assets/refresh.png" class="refresh_icon">
                    <span class="auth_refresh_btn_refresh">
                        刷新
                    </span>
                </div>
                <div class="content_table_wrap">
                    <el-table
                            :data="transferData"
                            style="width: 100%">
                        <el-table-column
                                fixed
                                prop="time"
                                label="提出时间"
                                min-width="100">
                        </el-table-column>
                        <el-table-column
                                prop="displayReceiver"
                                label="受让者"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                prop="displayStatus"
                                label="转让状态"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                min-width="60">
                            <template slot-scope="scope">
                                <el-button @click="trans(scope.row)"
                                           v-show="scope.row.showTransBtn"
                                           type="text" size="small">
                                    转让
                                </el-button>
                                <el-button @click="acceptTrans(scope.row)"
                                           v-show="scope.row.showAcceptBtn"
                                           type="text" size="small">
                                    接受转让
                                </el-button>

                                <el-button type="text" size="small"
                                           @click="refused(scope.row)"
                                           v-show="scope.row.showAcceptBtn">拒绝
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
                        :total="totalTransCount">
                </el-pagination>
            </div>
            <div class="content_container">
                <p class="content_chain_info">
                    数据申请与授权
                </p>
                <div class="auth_refresh_btn" @click="refreshList('auth')">
                    <div class="latest_update_time_container" v-show="authLatestUpdateTime">
                        <span class="latest_update_title">
                            最后更新时间
                        </span>
                        <span class="latest_update_content">
                            {{ authLatestUpdateTime }}
                        </span>
                    </div>
                    <img src="../assets/refresh.png" class="refresh_icon">
                    <span class="auth_refresh_btn_refresh">
                        刷新
                    </span>
                </div>
                <div class="content_table_wrap">
                    <el-table
                            :data="applyAndAuthDataList"
                            style="width: 100%">
                        <el-table-column
                                fixed
                                prop="time"
                                label="提出时间"
                                min-width="100">
                        </el-table-column>
                        <el-table-column
                                prop="applicant"
                                label="申请者"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                prop="applyStatus"
                                label="申请状态"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                min-width="60">
                            <template slot-scope="scope">
                                <el-button @click="handleAuthClick(scope.row)"
                                           v-show="scope.row.showAuthBtn"
                                           type="text" size="small">
                                    授权
                                </el-button>
                                <el-button type="text" size="small"
                                           v-show="scope.row.showAuthBtn"
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
                        :total="totalApplyCount">
                </el-pagination>
            </div>


            <div class="content_container">
                <p class="content_chain_info">
                    查验数据
                </p>
                <div class="auth_refresh_btn" @click="refreshList('check')">
                    <!--<div class="latest_update_time_container" v-show="authLatestUpdateTime">
                        <span class="latest_update_title">
                            最后更新时间
                        </span>
                        <span class="latest_update_content">
                            {{ authLatestUpdateTime }}
                        </span>
                    </div>-->
                    <img src="../assets/refresh.png" class="refresh_icon">
                    <span class="auth_refresh_btn_refresh">
                        刷新
                    </span>
                </div>
                <div class="content_table_wrap">
                    <el-table
                            :data="checkDataList"
                            style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    hello world
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="result"
                                label="查验结果"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="查验状态"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                min-width="60">
                            <template slot-scope="scope">
                                <el-button @click="postCheckData(scope.row)"
                                           type="text" size="small">
                                    查验
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>


                </div>
            </div>
            <div class="pagination_container" v-show="totalcheckCount > 5">
                <span class="total_page">
                    共{{ totalcheckCount }}条
                </span>
                <el-pagination
                        background
                        @current-change="onCheckPaginationClick"
                        :current-page="checkCurrentPage"
                        layout="prev, pager, next"
                        :total="totalcheckCount">
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
                <div class="auth_refresh_btn" @click="refreshList('list')">
                    <img src="../assets/refresh.png" class="refresh_icon">
                    <span class="auth_refresh_btn_refresh">
                        刷新
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
                                min-width="60">
                        </el-table-column>
                        <el-table-column
                                label="交易哈希"
                                min-width="80">
                            <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('hash',scope.row.txHash)">
                                    {{ getFormatAddress(scope.row.txHash) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="时间"
                                min-width="100">
                        </el-table-column>
                        <el-table-column
                                label="发起地址"
                                min-width="70">
                            <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('address',scope.row.senderAddr)">
                                    {{ getFormatAddress(scope.row.senderAddr) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="接收地址"
                                min-width="70">
                            <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('address',scope.row.receiverAddr)">
                                    {{ getFormatAddress(scope.row.receiverAddr) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="区块高度"
                                min-width="50">
                            <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('height',scope.row.height)">
                                    {{ scope.row.height }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="tokenUri"
                                label="token_uri"
                                min-width="80">
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
                            <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('serviceName',scope.row.serviceName)">
                                    {{ scope.row.serviceName }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="serviceType"
                                label="服务类型"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                label="服务交易哈希"
                                min-width="80">
                            <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('hash',scope.row.serviceHash)">
                                    {{ getFormatAddress(scope.row.serviceHash) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="时间"
                                min-width="100">
                        </el-table-column>
                        <el-table-column
                                label="提供方地址"
                                min-width="70">
                            <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('address',scope.row.providerAddr)">
                                    {{ getFormatAddress(scope.row.providerAddr) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="消费方地址"
                                min-width="70">
                            <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('address',scope.row.consumeAddr)">
                                    {{ getFormatAddress(scope.row.consumeAddr) }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="height"
                                label="区块高度"
                                min-width="50">
                            <template slot-scope="scope">
                                <span class="link_url" @click="toExplorer('height',scope.row.height)">
                                    {{ scope.row.height }}
                                </span>
                            </template>
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
                        :total="totalTxListCount">
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
                        :total="totalServiceListCount">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                :visible.sync="centerDialogVisible"
                width="400px"
                top="35vh"
                center>
            <div class="asset_details_dialog_container">
                <span class="asset_details_dialog_title">{{ dialogTitle }}</span>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancelBtnClick"
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
</template>

<script>
    import schema from '../schema/detail_receivable';
    import { constant } from '../constant/constant';
    import axios from '../helper/httpHelper';
    import cfg from '../config/config';
    import { Message } from 'element-ui';
    import { formatTimestamp, getFormatAddress } from '../util/util';
    import { getErrorMsgByErrorCode } from '../helper/errorCodeHelper';
    import { conversionHelper } from '../helper/conversionHelper';

    export default {
        name : 'AssetAdd',
        data(){
            let token = sessionStorage.getItem('token');
            let recevieAddr, receiverName;

            if(token){
                for(let key in cfg.account){
                    if(cfg.account[key].address !== JSON.parse(token).address){
                        recevieAddr = cfg.account[key].address;
                        receiverName = cfg.account[key].name;
                    }
                }
            }
            return {
                jsonData : null,
                transferData : [],
                applyAndAuthDataList : [],
                checkDataList : [{
                    result:'哈哈哈',
                    status:'未查验'
                }],
                assetListData : [],
                serviceListData : [],
                tab : 0,
                totalTransCount : 1,
                totalApplyCount : 1,
                totalcheckCount : 1,
                totalTxListCount : 1,
                totalServiceListCount : 1,
                options : [{
                    value : recevieAddr,
                    label : receiverName
                }],
                value : recevieAddr,
                centerDialogVisible : false,
                dialogTitle : '确认转让?',
                dialogType : 1,
                transCurrentPage : 1,
                authCurrentPage : 1,
                checkCurrentPage : 1,
                assetTxCurrentPage : 1,
                serviceTxCurrentPage : 1,
                hasSecret : true,
                accountApplyAuthorizeStatus : 5,
                accountApplyTransStatus : 5,
                chainInfo : {
                    nft_id : "",
                    number : "",
                    asset_name : "",
                    type : "",
                    owner : "",
                    nft_uri : ""
                },
                operateNftId : 0,
                requestId : 0,
                consumer : '',
                authRequestId : '',
                flUnlock : false,
                nftId : '',
                provider : '',//转让的时候需要
                flMounted : false,
                useUnlock : false,
                loading : false,
                applyBtnLoading : false,
                transRequestId : '',
                postTransRequestId : '',
                postTransNftId : '',
                authorizationList : [],
                secretList : [],
                showJsonData : false,
                assetType : 'receivable',
                needSavedData : null,
                checkData : null,
                authLatestUpdateTime : '',
                transLatestUpdateTime : '',
            }
        },
        components : {},
        mounted(){
            this.loadData();
            //this.getCheckout();
        },
        computed : {
            editBtnShow(){
                //资产拥有者,并且状态是正常
                const {type, transStatus} = this.$route.query;
                return type === 'check' && this.isOwner && Number(transStatus) === constant.ASSET_STATUS.NORMAL && (this.accountApplyTransStatus === constant.ASSET_LIST_STATUS.TRANSFERED || this.accountApplyTransStatus === constant.ASSET_LIST_STATUS.REFUSED || this.accountApplyTransStatus === constant.ASSET_LIST_STATUS.INVALID || this.accountApplyTransStatus === 5);
            },
            applyAuthShow(){
                //非资产拥有者  &&  有授权查看的数据 && (授权状态是: 已拒绝 || 已失效 || 已过期)
                return this.$route.query.type === 'check' && !this.isOwner && this.hasSecret && (this.accountApplyAuthorizeStatus === constant.AUTHORIZATION_STATUS.REFUSED || this.accountApplyAuthorizeStatus === constant.AUTHORIZATION_STATUS.INVALID || this.accountApplyAuthorizeStatus === constant.AUTHORIZATION_STATUS.EXPIRED || this.accountApplyAuthorizeStatus === 5);
            },
            applyTransShow(){//展示申请转让按钮
                //资产拥有者 && (转让状态是: 已拒绝 || 已失效 || 已转让)
                return this.$route.query.type === 'trans' && this.isOwner && (this.accountApplyTransStatus === constant.ASSET_LIST_STATUS.TRANSFERED || this.accountApplyTransStatus === constant.ASSET_LIST_STATUS.REFUSED || this.accountApplyTransStatus === constant.ASSET_LIST_STATUS.INVALID || this.accountApplyTransStatus === 5);
            },
            unlockShow(){
                //非资产拥有者 && 有加密的数据 && 展示点击解密 && (授权状态是: 已授权)
                return this.$route.query.type === 'check' && !this.isOwner && this.hasSecret && this.accountApplyAuthorizeStatus === constant.AUTHORIZATION_STATUS.AUTH;
            },
            isOwner(){
                return this.$route.query.owner === this.$accountHelper.getAccount().address
            }
        },
        methods : {
            loadData(){
                this.getAssetTransList(1);
                this.getAssetAuthList(1);
                this.getCheckList(1);
                this.onAssetTxPaginationClick(1);
            },
            getFormatAddress(address){
                return getFormatAddress(address)
            },
            postCheckData(data){
                console.log(data)
            },
            refreshList(type){
                switch (type){
                    case 'trans':
                        this.transCurrentPage = 1;
                        this.getAssetTransList(1);
                    case 'auth':
                        this.authCurrentPage = 1;
                        this.getAssetAuthList(1);
                    case 'check':
                        this.checkCurrentPage = 1;
                        this.getCheckList(1);
                    case 'list':
                        this.assetTxCurrentPage = 1;
                        this.authCurrentPage = 1;
                        if(this.tab === 0){
                            this.onAssetTxPaginationClick(1);
                        } else {
                            this.onServiceTxPaginationClick(1);
                        }

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
                    case constant.AUTHORIZATION_STATUS.EXPIRED:
                        return '已过期';


                }
            },
            edit(){
                this.$router.push(`/asset_edit?nft_id=${this.$route.query.nft_id}&asset_type=${this.assetType}`);
            },
            applyCheck(){
                this.applyBtnLoading = true;
                axios.post({
                    url : `/assets_authorization/${this.$route.query.nft_id}/authorization/apply`,
                    body : {},
                    ctx : this
                }).then((data) =>{
                    console.log(data);
                    this.applyBtnLoading = false;
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : '申请已提交成功,请耐心等待',
                            type : 'success'
                        });
                        this.loadData();
                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                    } else {
                        this.$message.error('申请提交失败');
                    }
                }).catch(e =>{
                    this.applyBtnLoading = false;
                    console.error(e);
                    this.$message.error('申请提交失败');
                });
            },
            handleTransBtnClick(){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认转让?';
                this.dialogType = 0;
            },
            trans(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认转让?';
                this.dialogType = 1;
                this.operateNftId = row.id;
                this.requestId = row.requestId;
                this.provider = row.provider;
            },
            acceptTrans(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认接受转让?';
                this.dialogType = 2;
                this.operateNftId = row.id;
                this.requestId = row.requestId;
            },
            refused(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认拒绝接受转让?';
                this.dialogType = 3;
                this.operateNftId = row.id;
                this.requestId = row.requestId;
            },
            handleAuthClick(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认授权?';
                this.dialogType = 4;
                this.operateNftId = row.id;
                this.requestId = row.requestId;
                this.consumer = row.consumer;
            },
            handleRefusedClick(row){
                this.centerDialogVisible = true;
                this.dialogTitle = '确认拒绝查看';
                this.dialogType = 5;
                this.operateNftId = row.id;
                this.requestId = row.requestId;
            },
            handleConfirmBtnClick(){
                if(this.dialogType === 0){
                    this.transfer();
                } else if(this.dialogType === 1){//最后一步,确认了就发送链上交易
                    this.postTransfer();
                } else if(this.dialogType === 2){
                    this.postAcceptTrans();
                } else if(this.dialogType === 3){
                    this.postRefuseTrans();
                } else if(this.dialogType === 4){
                    this.acceptAuth();
                } else if(this.dialogType === 5){
                    this.refuseAuth();
                }
            },


            handleTabClick(tab){
                this.tab = tab;
                if(tab === 0){
                    this.onAssetTxPaginationClick(1);
                } else {
                    this.onServiceTxPaginationClick(1);
                }
            },
            onTxTransPaginationClick(page){
                this.transCurrentPage = page
                this.getAssetTransList(page);
            },
            onAuthPaginationClick(page){
                this.authCurrentPage = page
                this.getAssetAuthList(page);
            },
            onCheckPaginationClick(page){
                this.checkCurrentPage = page
                this.getCheckList(page);
            },

            onAssetTxPaginationClick(page){
                this.assetTxCurrentPage = page;
                this.getAssetTxList(page);
            },
            onServiceTxPaginationClick(page){
                this.serviceTxCurrentPage = page;
                this.getServiceDataList(page);
            },
            getDataList(page, url, index){
                axios.get({url, ctx : this}).then((data) =>{
                    this.handleData(data, index)
                });

            },
            handleData(data, index){

            },
            postAcceptTrans(){
                let token = sessionStorage.getItem('token');
                let displayUserName = '';
                if(token){
                    displayUserName = JSON.parse(token).name;
                }
                const body = {
                    request_id : this.requestId,
                    owner_name:displayUserName,
                };
                this.loading = true;
                axios.post({
                    url : `/assets_transfer/${this.operateNftId}/transfer_owner/accept`,
                    body,
                    ctx : this
                }).then((data) =>{
                    console.log(data);
                    this.loading = false;
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : '接受申请成功',
                            type : 'success'
                        });
                        this.loadData();
                        this.centerDialogVisible = false;
                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                        this.centerDialogVisible = false;
                    } else {
                        this.$message.error('接受申请失败');
                        this.centerDialogVisible = false;
                        //接受失败以后重新请求转让状态,修改可操作按钮
                        this.getAssetTransList(1);
                    }
                }).catch(e =>{
                    console.error(e);
                    this.loading = false;
                    this.$message.error('接受申请失败');
                    this.centerDialogVisible = false;
                    this.getAssetTransList(1);
                });

            },
            postTransfer(){
                const body = {
                    request_id : this.postTransRequestId
                };
                this.loading = true;
                axios.post({
                    url : `/assets_transfer/${this.postTransNftId}/transfer_handle`,
                    body,
                    ctx : this
                }).then((data) =>{
                    this.loading = false;
                    console.log(data);
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : '转让成功',
                            type : 'success'
                        });
                        this.loadData();
                        this.centerDialogVisible = false;
                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                        this.centerDialogVisible = false;
                    } else {
                        this.$message.error('转让失败,请稍后重试');
                        this.centerDialogVisible = false;
                    }
                }).catch(e =>{
                    this.loading = false;
                    console.error(e);
                    this.$message.error('转让失败,请稍后重试');
                    this.centerDialogVisible = false;
                });
            },
            postRefuseTrans(){
                const body = {
                    request_id : this.requestId,
                };
                this.loading = true;
                axios.post({
                    url : `/assets_transfer/${this.operateNftId}/transfer_owner/refuse`,
                    body,
                    ctx : this
                }).then((data) =>{
                    console.log(data);
                    this.loading = false;
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : '拒绝申请成功',
                            type : 'success'
                        });
                        this.loadData();
                        this.centerDialogVisible = false;
                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                        this.centerDialogVisible = false;
                    } else {
                        this.$message.error('拒绝申请失败');
                        this.centerDialogVisible = false;
                    }
                }).catch(e =>{
                    this.loading = false;
                    console.error(e);
                    this.$message.error('拒绝申请失败');
                    this.centerDialogVisible = false;
                });

            },

            refuseAuth(){
                const body = {
                    request_id : this.requestId,
                };
                this.loading = true;
                axios.post({
                    url : `/assets_authorization/${this.operateNftId}/authorization/refuse`,
                    body,
                    ctx : this
                }).then((data) =>{
                    console.log(data);
                    this.loading = false;
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : '拒绝成功',
                            type : 'success'
                        });
                        this.loadData();
                        this.centerDialogVisible = false;
                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                        this.centerDialogVisible = false;
                    } else {
                        this.$message.error('拒绝失败');
                        this.centerDialogVisible = false;
                    }
                }).catch(e =>{
                    console.error(e);
                    this.loading = false;
                    this.$message.error('拒绝失败');
                    this.centerDialogVisible = false;
                });
            },
            acceptAuth(){
                const body = {
                    "consumer_pubkey" : this.$accountHelper.getPublicKeyByAddress(this.consumer),
                    "request_id" : this.requestId,
                };
                this.loading = true;
                axios.post({
                    url : `/assets_authorization/${this.operateNftId}/authorization/accept`,
                    body,
                    ctx : this
                }).then((data) =>{
                    console.log(data);
                    this.loading = false;
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : '授权成功',
                            type : 'success'
                        });
                        this.loadData();
                        this.centerDialogVisible = false;
                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                        this.centerDialogVisible = false;
                    } else {
                        this.$message.error('授权失败');
                        this.centerDialogVisible = false;
                    }
                }).catch(e =>{
                    console.error(e);
                    this.loading = false;
                    this.$message.error('授权失败');
                    this.centerDialogVisible = false;
                });
            },
            transfer(){
                let publicKey, address;
                let token = sessionStorage.getItem('token');
                if(token){
                    for(let key in cfg.account){
                        if(cfg.account[key].address !== JSON.parse(token).address){
                            publicKey = cfg.account[key].publicKey;
                            address = cfg.account[key].address;
                        }
                    }
                }
                const body = {
                    provider : address,
                    provider_pubkey : publicKey
                };
                this.loading = true;
                axios.post({
                    url : `/assets_transfer/${this.$route.query.nft_id}/transfer_owner`,
                    body,
                    ctx : this
                }).then((data) =>{
                    this.loading = false;
                    console.log(data);
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : '申请转让成功',
                            type : 'success'
                        });
                        this.centerDialogVisible = false;
                        //this.$router.go(-1);
                        this.loadData();
                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                        this.centerDialogVisible = false;
                    } else {
                        this.$message.error('申请转让失败');
                    }
                }).catch(e =>{
                    this.loading = false;
                    console.error(e);
                    this.$message.error('申请转让失败');
                    this.centerDialogVisible = false;
                });
            },
            unlock(){//点击解密
                const body = {
                    "request_id" : this.authRequestId,
                };
                axios.post({
                    url : `/assets_authorization/${this.nftId}/authorization/lookup`,
                    body,
                    ctx : this
                }).then((data) =>{
                    console.log(data);
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : '解密成功',
                            type : 'success'
                        });
                        this.jsonData = JSON.parse(data.data.data);
                        this.secretList = JSON.parse(data.data.data).secretProperties;
                        document.getElementById('detail_json_schema_node').style.display = 'none';
                        document.getElementById('locked_detail_json_schema_node').style.display = 'block';
                        setTimeout(() =>{
                            $("#locked_detail_json_schema_node").alpaca({
                                "schemaSource" : schema,
                                "dataSource" : JSON.parse(data.data.data),
                                "view" : "bootstrap-display"
                            });
                            this.drawNoteNode();
                            this.setSecretFieldStyle();
                        }, 100);

                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                        this.centerDialogVisible = false;
                    } else {
                        this.$message.error('解密失败');
                        //失败以后重新请求授权状态,如果状态改变则修改按钮展示
                        this.getAssetAuthList();
                    }
                }).catch(e =>{
                    console.error(e);
                    this.$message.error('解密失败');
                });
            },
            handleCancelBtnClick(){
                this.centerDialogVisible = false;
            },
            toExplorer(type, param){
                switch (type){
                    case 'address':
                        window.open(`${cfg.app.explorer}/#/address/${param ? param : this.chainInfo.nft_owner}`);
                    case 'nft_id':
                        window.open(`${cfg.app.explorer}/#/nft/token?denom=${this.chainInfo.type}&tokenId=${this.chainInfo.number}`);
                    case 'hash':
                        window.open(`${cfg.app.explorer}/#/tx?txHash=${param}`);
                    case 'height':
                        window.open(`${cfg.app.explorer}/#/block/${param}`);
                    case 'serviceName':
                        window.open(`${cfg.app.explorer}/#/service?serviceName=${param}&chainId=${cfg.chainId}`);
                }
            },
            getCheckElement(tag, dataAttr, reg){
                if(document.getElementById('schema_container')){
                    let aElements = document.getElementById('schema_container').getElementsByTagName(tag);
                    let aEle = [];
                    for(let i = 0 ; i < aElements.length ; i++){
                        let ele = aElements[i].getAttribute(dataAttr);
                        if(ele && ele.startsWith('/') && ele !== '/'){
                            aEle.push(aElements[i]);
                        }
                    }
                    return aEle;
                } else {
                    return null;
                }

            },
            getElementByAttr(tag, dataAttr){
                let aElements = document.getElementById('schema_container').getElementsByTagName(tag);
                let aEle = [];
                for(let i = 0 ; i < aElements.length ; i++){
                    let ele = aElements[i].getAttribute(dataAttr);
                    if(ele && ele === 'detailedInfo'){
                        aEle.push(aElements[i]);
                    }
                }
                return aEle;
            },
            handleCheck(path){
                console.log(path)
            },
            getDetails(){
                let url = `/assets/detail/${this.$route.query.nft_id}?address=${this.$accountHelper.getAccount().address}`;
                if(this.useUnlock){
                    url += `&request_id=${this.transRequestId}`;
                }

                axios.get({
                    url,
                    ctx : this
                }).then((data) =>{
                    if(data){
                        this.handleDetailData(data.data);
                    }

                }).catch(e =>{
                    console.error(e)
                });
            },
            getCheckStatus(){
                let url = `/assets_check?pageNum=1&pageSize=10&used_count=false&nft_id=${this.$route.query.nft_id}`;
                axios.get({
                    url,
                    ctx : this
                }).then((data) =>{
                    res(data)
                }).catch(e =>{
                    console.error(e);
                    rej(e);
                });
            },
            handleDetailData(data){
                console.log('detail data', data)
                if(data && data.asset_info){
                    let jsonData = JSON.parse(data.asset_info);

                    conversionHelper.booleanToDisplayField(jsonData);
                    console.log('json data after conversion', jsonData);
                    this.jsonData = jsonData;
                    this.authorizationList = JSON.parse(data.asset_info).authorizationProperties;
                    this.secretList = JSON.parse(data.asset_info).secretProperties;
                    this.hasSecret = this.jsonData.authorizationProperties.length > 0 && !this.$accountHelper.isOwner(data.chain_info.owner)
                    this.renderUI();
                }
                if(data && data.chain_info){
                    this.chainInfo = data.chain_info;
                }
            },
            setSecretFieldStyle(){
                setTimeout(() =>{
                    let node = this.getCheckElement('div', 'data-alpaca-field-path', /^\//);
                    const pathMap = new Map();
                    for(let item of node){
                        const name = item.getAttribute('data-alpaca-field-path');
                        pathMap.set(name, item);
                    }
                    this.authorizationList.forEach((a) =>{
                        let replaced = a.replace(/\./g, '/').replace('$', '');
                        if(pathMap.has(replaced)){
                            pathMap.get(replaced).getElementsByClassName('alpaca-control')[0].style.color = '#2449AD';
                        } else {
                            Array.from(pathMap.keys()).forEach((p) =>{
                                if(p.includes('[') && p.includes(']')){
                                    let num = p.split('[')[1].split(']')[0];
                                    if(p.replace(num, '*') === replaced){
                                        pathMap.get(p).getElementsByClassName('alpaca-control')[0].style.color = '#2449AD';
                                    }
                                }
                            })
                        }
                    });
                    this.secretList.forEach((a) =>{
                        let replaced = a.replace(/\./g, '/').replace('$', '');
                        if(pathMap.has(replaced)){
                            pathMap.get(replaced).style.color = 'yellow';
                            pathMap.get(replaced).getElementsByClassName('alpaca-control')[0].style.color = '#FF6200';
                        } else {
                            Array.from(pathMap.keys()).forEach((p) =>{
                                if(p.includes('[') && p.includes(']')){
                                    let num = p.split('[')[1].split(']')[0];
                                    if(p.replace(num, '*') === replaced){
                                        pathMap.get(p).getElementsByClassName('alpaca-control')[0].style.color = '#FF6200';
                                    }
                                }
                            })
                        }
                    });

                }, 250)
            },
            //添加密文注释
            drawNoteNode(){
                setTimeout(() =>{
                    let node = this.getElementByAttr('div', 'data-alpaca-container-item-name');
                    if(node && node.length){
                        const container = document.createElement('div');
                        container.className = 'note_container';

                        const authTitle = document.createElement('span');
                        authTitle.className = 'auth_title';
                        authTitle.innerHTML = '授权可见';
                        const authColor = document.createElement('span');
                        authColor.className = 'auth_color';

                        const secretTitle = document.createElement('span');
                        secretTitle.className = 'secret_title';
                        secretTitle.innerHTML = '仅自己可见';
                        const secretColor = document.createElement('span');
                        secretColor.className = 'secret_color';

                        container.appendChild(authColor);
                        container.appendChild(authTitle);
                        container.appendChild(secretColor);
                        container.appendChild(secretTitle);
                        node[0].appendChild(container);
                        node[0].style.position = 'relative';

                    }
                }, 300)
            },
            renderUI(){
                $("#detail_json_schema_node").alpaca({
                    "schemaSource" : schema,
                    "dataSource" : this.jsonData,
                    "view" : "bootstrap-display"
                });
                this.setSecretFieldStyle();
                this.drawNoteNode();
            },
            getAssetTransList(page){
                axios.get({
                    url : `/assets_transfer/${this.$route.query.nft_id}/transfer_records?pageNum=${page}&pageSize=10`,
                    ctx : this
                }).then((data) =>{
                    if(data && data.data){
                        this.handleAssetTransData(data, page);
                    }

                }).catch(e =>{
                    console.error(e)
                });
            },
            handleAssetTransData(data, page){
                console.log('transfer asset list data', data)
                //判断是否展示'申请转让'按钮 accountApplyTransStatus
                if(data.data.length > 0 && page === 1){
                    this.accountApplyTransStatus = data.data[0].status;
                    //如果最新的转让状态是  转让申请中,并且当前账户是受让方, 使用直接调用解密接口 (useUnlock)
                    //当前账户是受让者
                    if(data.data[0].status === constant.ASSET_LIST_STATUS.APPLYING && this.$accountHelper.getAccount().address === data.data[0].provider){
                        this.useUnlock = true;
                        this.transRequestId = data.data[0].request_id;
                        console.log('trans request id:', this.transRequestId)
                    } else {
                        this.useUnlock = false;
                    }

                    //当前账户是owner
                    if(data.data[0].status === constant.ASSET_LIST_STATUS.ACCEPT && this.$accountHelper.getAccount().address === data.data[0].consumer){
                        console.log('current trans status is:已接受', data.data[0].request_id);
                        this.postTransRequestId = data.data[0].request_id;
                        this.postTransNftId = data.data[0].nft_id;
                    }
                    if(!this.flMounted){
                        this.getDetails();
                        this.flMounted = true;
                    }

                } else if(data.data.length === 0){
                    if(!this.flMounted){
                        this.getDetails();
                        this.flMounted = true;
                    }
                }
                this.totalTransCount = data.total;
                if(data.data.length > 0){
                    this.transLatestUpdateTime = formatTimestamp(data.data[0].update_at)
                }
                this.transferData = data.data.map((t) =>{
                    return {
                        id : t.nft_id,
                        requestId : t.request_id,
                        time : formatTimestamp(t.create_at),
                        receiver : t.provider,
                        txStatus : t.status,
                        displayStatus : this.getDisplayAssetTransStatus(t.status),
                        displayReceiver : this.$accountHelper.getUserNameByAddress(t.provider),
                        consumer : t.consumer,
                        provider : t.provider,
                        showAcceptBtn : t.status === constant.ASSET_LIST_STATUS.APPLYING && t.provider === this.$accountHelper.getAccount().address,
                        showTransBtn : t.status === constant.ASSET_LIST_STATUS.ACCEPT && t.consumer === this.$accountHelper.getAccount().address,
                    }
                })
            },
            getAssetAuthList(page){
                axios.get({
                    url : `/assets_authorization/${this.$route.query.nft_id}/authorization_records?pageNum=${page}&pageSize=10`,
                    ctx : this
                }).then((data) =>{
                    if(data && data.data){
                        this.handleAssetAuthData(data, page);
                    }
                }).catch(e =>{
                    console.error(e)
                });
            },
            getCheckList(page){

                //查验数据

                axios.get({
                    url : `/assets_authorization/${this.$route.query.nft_id}/authorization_records?pageNum=${page}&pageSize=10`,
                    ctx : this
                }).then((data) =>{
                    if(data && data.data){
                        this.handleCheckData(data, page);
                    }
                }).catch(e =>{
                    console.error(e)
                });
            },
            handleCheckData(data,page){
                console.error(data)
            },
            handleAssetAuthData(data, page){
                console.log('authorization asset list data', data);
                this.totalApplyCount = data.total;
                //判断是否展示'点击解密'按钮和'申请查看'按钮;  accountApplyAuthorizeStatus
                if(data.data.length > 0 && page === 1){
                    this.consumer = data.data[0].consumer;
                    this.authRequestId = data.data[0].request_id;
                    this.flUnlock = true;
                    this.nftId = data.data[0].nft_id;
                    this.accountApplyAuthorizeStatus = data.data[0].status;
                }
                if(data.data.length > 0){
                    this.authLatestUpdateTime = formatTimestamp(data.data[0].update_at)
                }
                this.applyAndAuthDataList = data.data.map((a) =>{
                    return {
                        id : a.nft_id,
                        requestId : a.request_id,
                        time : formatTimestamp(a.create_at),
                        applicant : this.$accountHelper.getUserNameByAddress(a.consumer),
                        applyStatus : this.getDisplayAssetAuthStatus(a.status),
                        showAuthBtn : a.status === constant.AUTHORIZATION_STATUS.APPLYING && a.provider === this.$accountHelper.getAccount().address,
                        provider : a.provider,
                        consumer : a.consumer,
                    }
                })
            },
            getAssetTxList(page){
                const {query_type, number} = this.$route.query;
                axios.get({
                    url : `/assets_tx?pageNum=${page}&pageSize=10&used_count=true&asset_no=${number}&asset_type=${query_type}`,
                    ctx : this
                }).then((data) =>{
                    if(data && data.data){
                        this.handleTxListData(data);
                    }
                }).catch(e =>{
                    console.error(e)
                });
            },
            handleTxListData(data){
                console.log('asset list data', data);
                this.totalTxListCount = data.total;
                this.assetListData = data.data.map((item) =>{
                    return {
                        txType : item.type,
                        txHash : item.tx_hash,
                        time : formatTimestamp(item.time),
                        senderAddr : item.consumer,
                        receiverAddr : item.provider,
                        height : item.height,
                        tokenUri : item.token_uri
                    }
                })
            },
            getServiceDataList(page){
                axios.get({
                    url : `/assets_tx/service_tx?pageNum=${page}&pageSize=10&used_count=true&nft_id=${this.$route.query.nft_id}`,
                    ctx : this
                }).then((data) =>{
                    if(data && data.data){
                        this.handleServiceDataData(data);
                    }
                }).catch(e =>{
                    console.error(e)
                });
            },
            handleServiceDataData(data){
                console.log('service list data', data);
                this.totalServiceListCount = data.total;
                this.serviceListData = data.data.map((item) =>{
                    return {
                        serviceName : item.service_name,
                        serviceType : item.type,
                        serviceHash : item.tx_hash,
                        time : formatTimestamp(item.time),
                        providerAddr : item.provider,
                        consumeAddr : item.consumer,
                        height : item.height,
                    }
                })
            },
            getCheckout(){
                axios.get({
                    url : `/assets_check/${this.$route.query.nft_id}?examine_no=hello&address=faa1fwgw9ej3yzq6frn8rq7pswfhkdcsq8szgx0xkq`,
                    ctx : this
                }).then((data) =>{
                    if(data && data.status && data.status === 'success'){
                        Message({
                            message : '查验已提交成功,请耐心等待',
                            type : 'success'
                        });
                    }
                }).catch(e =>{
                    console.error(e)
                });
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
                margin-bottom: 30px;
                .asset_details_title {
                    font-size: 20px;
                    color: @mainFontColor;
                }
                .btn {
                    width: 136px;
                    height: 34px;
                }
                .edit_btn_container {
                    .flexRow;
                    justify-content: flex-end;
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
                    margin-right: 20px;
                    width: 136px;
                }
            }
            .schema_container {
                position: relative;
                height: 400px;
                overflow-y: auto;
                pre {
                    border: none;
                }
                .note_container {
                    position: absolute;
                    left: 100px;
                    top: 13px;
                    .flexRow;
                    align-items: center;
                    .auth_title {
                        font-size: 12px;
                        color: #464646;
                        margin-right: 20px;
                        line-height: 14px;
                    }
                    .auth_color {
                        width: 10px;
                        border-radius: 2px;
                        height: 10px;
                        background: #2449AD;
                        margin-right: 10px;
                    }
                    .secret_title {
                        font-size: 12px;
                        color: #464646;
                        line-height: 14px;
                    }
                    .secret_color {
                        width: 10px;
                        border-radius: 2px;
                        height: 10px;
                        background: #FF6200;
                        margin-right: 10px;
                    }

                }
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
                        display: inline-block;
                        width: 140px;
                    }
                    .alpaca-required-indicator {
                        display: none;
                    }
                    .alpaca-control {
                        font-size: 14px;
                        color: @mainFontColor;
                        word-break: break-all;
                        max-width: 500px;
                    }
                    .check_status {
                        font-size: 14px;
                        color: @mainFontColor;
                    }
                    .check_btn {
                        cursor: pointer;
                        color: @themeColor;
                        font-weight: 400;
                        font-size: 14px;
                        margin-left: 30px;
                    }
                }
                #detail_json_schema_node {

                    .alpaca-field-object.alpaca-top, .alpaca-field-object.alpaca-top .alpaca-container {
                        padding: 0;
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
                position: relative;
                .auth_refresh_btn {
                    position: absolute;
                    top: 16px;
                    right: 20px;
                    z-index: 10;
                    .flexRow;
                    align-items: center;
                    cursor: pointer;
                    .refresh_icon {
                        width: 17px;
                        height: 14px;
                    }
                    .auth_refresh_btn_refresh {
                        font-size: 14px;
                        color: @themeColor;
                        margin-left: 8px;
                    }
                    .latest_update_time_container {
                        .flexRow;
                        margin-right: 20px;
                        .latest_update_title {
                            font-size: 14px;
                            margin-right: 10px;
                            color: @mainFontColor;
                        }
                        .latest_update_content {
                            font-size: 14px;
                            color: @mainFontColor;
                        }
                    }

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
                                min-width: 80px;
                            }
                            .content_chain_info_item_content {
                                font-size: 14px;
                                color: @mainFontColor;
                                word-break: break-all;
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
                .content_table_wrap {

                    .link_url {
                        color: @themeColor;
                        cursor: pointer;
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