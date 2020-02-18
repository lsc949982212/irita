<template>
    <div class="data_auth_share_container">
        <div class="data_auth_share_wrap">
            <div class="data_auth_share_title_container">
                <span class="data_auth_share_title">
                    数据授权共享
                </span>
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
                            prop="name"
                            label="申请时间"
                            min-width="110">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="申请者"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="响应者"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="授权状态"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="最后更新时间"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="70">
                        <template slot-scope="scope">
                            <span @click="handleCheckClick(scope.row)">
                                资产详情
                            </span>
                            <span @click="handleCheckClick(scope.row)">
                                授权
                            </span>
                            <span v-show="getTransShow(scope.row)"
                                  @click="handleTransClick(scope.row)">
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
        </div>
    </div>
</template>

<script>
    import axios from '../helper/httpHelper';
    import { constant } from '../constant/constant';
    import {accountHelper} from '../helper/accountHelper';
    import { getFormatAddress } from '../util/util';
    import cfg from '../config/config';


    export default {
        name : 'DataAuthShared',
        data(){
            return {
                tableData: [],
                totalTxCount:1,
                txListCurrentPage:1,
            }
        },
        components : {

        },
        mounted(){
            this.onPageChange(1);
        },
        methods:{
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
                console.log(row)
                this.$router.push(`/asset_detail?type=check&nft_id=${row.id}&owner=${row.owner}&transStatus=${row.transStatus}&query_type=${row.type}&number=${row.number}`);
            },
            handleTransClick(row){
                console.log(row)
                this.$router.push(`/asset_detail?type=trans&nft_id=${row.id}&owner=${row.owner}&transStatus=${row.transStatus}&query_type=${row.type}&number=${row.number}`);
            },
            onPageChange(page){
                this.txListCurrentPage = page;
                this.getDataList(page);
            },
            getDataList(page){
                axios.get({url:`/assets?pageNum=${page}&pageSize=10&used_count=true`,ctx:this}).then((data)=>{
                    if(data && data.data){
                        this.handleData(data);
                    }
                }).catch(e=>{
                    console.error(e)
                });
            },
            handleData(data){
                console.log(data)
                this.totalTxCount = data.total;
                this.tableData = data.data.map((asset)=>{
                    return {
                        number:asset.number,
                        id:asset.nft_id,
                        name:asset.asset_name,
                        type:asset.type,
                        owner:asset.nft_owner,
                        displayOwnerAddress:getFormatAddress(asset.nft_owner),
                        transStatus:asset.transfer_status,
                        displayOwner:accountHelper.getAccountList().find((a)=>a.address === asset.nft_owner) ? accountHelper.getAccountList().find((a)=>a.address === asset.nft_owner).name : '',
                        displayCheckStatus:this.getDisplayCheckStatus(asset.check_status),
                        displayTransStatus:this.getDisplayAssetTransStatus(asset.transfer_status),
                        isApply:asset.is_apply
                    };
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../style/mixin";

    .data_auth_share_container {
        width: 100%;
        height: 100%;
        .flexColumn;
        align-items: center;
        background:rgba(250,250,250,1);
        padding-bottom:40px;
        box-sizing:border-box;
        .data_auth_share_wrap{
            width: 69%;
            min-width:994px;
            box-shadow:0 2px 7px 0 rgba(3,44,65,0.12);
            border-radius:4px;
            margin-top:30px;
            padding:24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .data_auth_share_title_container{
                .flexRow;
                justify-content: space-between;
                margin-bottom:20px;
                .data_auth_share_title{
                    font-size:20px;
                    color:@mainFontColor;
                }
                .btn{
                    width:136px;
                }
            }
            .table_container{
                background:rgba(248,248,248,1);
                border-radius:4px;

                .el-table th, .el-table tr{
                    background: yellow;
                }
                .link_url {
                    color: @themeColor;
                    cursor: pointer;
                }
            }
            .pagination_container{
                .flexRow;
                justify-content: flex-end;
                align-items: flex-end;
                margin-top:10px;
                .total_page{
                    margin-right:10px;
                    font-size:14px;
                    color:@mainFontColor;
                }

            }
        }

    }

</style>