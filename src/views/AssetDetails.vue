<template>
    <div class="asset_details_container">
        <div class="asset_details_wrap">
            <div class="asset_details_title_container">
                <span class="asset_details_title">
                    资产信息
                </span>
                <el-button size="small"
                           @click="edit"
                           class="btn" type="primary">编辑</el-button>
            </div>
            <div class="content_container">
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
                            <span class="content_chain_info_item_content">
3
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
5
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
                                <el-button @click="acceptTrans(scope.row)" type="text" size="small">
                                    接受转让
                                    <i style="position:relative;width:5px;height:5px;top:-8px;left:-3px;
                                background:rgba(254,47,93,1);border-radius:50%;display:inline-block;"></i>
                                </el-button>
                                <el-button type="text" size="small">拒绝</el-button>
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
                                <el-button @click="acceptTrans(scope.row)" type="text" size="small">
                                    接受转让
                                    <i style="position:relative;width:5px;height:5px;top:-8px;left:-3px;
                                background:rgba(254,47,93,1);border-radius:50%;display:inline-block;"></i>
                                </el-button>
                                <el-button type="text" size="small">拒绝</el-button>
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
                        @current-change="onTxTransPaginationClick"
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
                        @current-change="onTxTransPaginationClick"
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
                        @current-change="onTxTransPaginationClick"
                        layout="prev, pager, next"
                        :total="1000">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import schema from './schema';
    import jsonData from './data';

    export default {
        name : 'AssetAdd',
        data(){
            return {
                jsonData:null,
                transferData:[{
                    id: '金属送吧膜回收,知否知否',
                    time: 'A公司的应收账款',
                    receiver: '应收账款',
                    txStatus: '暴力服务商B',
                }],
                applyAndAuthDataList:[{
                    id: '金属送吧膜回收,知否知否',
                    time: 'A公司的应收账款',
                    applicant: '应收账款',
                    applyStatus: '暴力服务商B',
                }],
                assetListData:[{
                    id: '金属送吧膜回收,知否知否',
                    txType: 'A公司的应收账款',
                    txHash: '应收账款',
                    time: '暴力服务商B',
                    senderAddr: 'A公司的应收账款',
                    receiverAddr: '应收账款',
                    height: '暴力服务商B',
                }],
                serviceListData:[{
                    id: '金属送吧膜回收,知否知否',
                    serviceName: 'A公司的应收账款',
                    serviceType: '应收账款',
                    serviceHash: '暴力服务商B',
                    time: 'A公司的应收账款',
                    providerAddr: '应收账款',
                    consumeAddr: '应收账款',
                    height: '暴力服务商B',
                }],
                tab:0,
                totalTransCount:100,
                totalApplyCount:100,
                totalTxListCount:100,
                totalServiceListCount:100,
            }
        },
        components : {

        },
        mounted(){
            $("#detail_json_schema_node").alpaca({
                "schemaSource": schema,
                "dataSource":jsonData,
                "view": "bootstrap-display"
            });
        },
        methods:{
            edit(){
                this.$router.push('/asset_edit');
            },
            acceptTrans(row){

            },
            handleTabClick(tab){
                this.tab = tab;
            },
            onTxTransPaginationClick(page){
                console.log(page)
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../style/mixin";


    .asset_details_container {
        width: 100%;
        height: 100%;
        .flexColumn;
        align-items: center;
        background:rgba(250,250,250,1);
        .asset_details_wrap{
            width: 69%;
            min-width:994px;
            box-shadow:0 2px 7px 0 rgba(3,44,65,0.12);
            border-radius:4px;
            margin-top:30px;
            padding:24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .asset_details_title_container{
                .flexRow;
                justify-content: space-between;
                margin-bottom:20px;
                .asset_details_title{
                    font-size:20px;
                    color:@mainFontColor;
                }
                .btn{
                    width:136px;
                }
            }

            .content_container{
                background:rgba(248,248,248,1);
                border-radius:4px;
                padding:20px;
                margin-bottom:20px;
                .content_chain_info{
                    font-size:14px;
                    color: @mainFontColor;
                    padding-bottom:10px;
                    border-bottom:1px solid #EDEDED
                }
                .content_chain_info_wrap{
                    .flexRow;
                    width:100%;
                    .content_chain_info_item{
                        flex:1;

                        .content_chain_info_item_wrap{
                            .flexRow;
                            margin-top:17px;
                            .content_chain_info_item_title{
                                font-size:14px;
                                color:#9E9E9E;
                                width:80px;
                            }
                            .content_chain_info_item_content{
                                font-size:14px;
                                color:@mainFontColor;
                            }
                        }
                    }

                }
                .content_tab_container{
                    .flexRow;

                    .content_tab_item{
                        padding-bottom:10px;
                        border-bottom:2px solid transparent;
                        box-sizing:border-box;
                        font-size:14px;
                        font-weight:600;
                        margin-right:40px;
                        cursor: pointer;
                    }
                    .active_tab{
                        color: @themeColor;
                        border-color: @themeColor;
                    }

                }

            }
            .pagination_container{
                .flexRow;
                justify-content: flex-end;
                align-items: flex-end;
                margin-bottom:20px;
                .total_page{
                    margin-right:10px;
                    font-size:14px;
                    color:@mainFontColor;
                }

            }
        }

    }

</style>