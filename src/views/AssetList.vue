<template>
    <div class="asset_list_container">
        <div class="asset_list_wrap">
            <div class="asset_list_title_container">
                <span class="asset_list_title">
                    资产列表
                </span>
                <el-button type="primary" class="btn"
                           @click="add">
                    资产新建
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
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="资产类型"
                            min-width="60">
                    </el-table-column>
                    <el-table-column
                            prop="displayOwner"
                            label="所有者"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            prop="displayCheckStatus"
                            label="查验状态"
                            min-width="50">
                    </el-table-column>
                    <el-table-column
                            prop="displayTransStatus"
                            label="转让状态"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="90">
                        <template slot-scope="scope">
                            <el-button @click="handleCheckClick(scope.row)" type="text" size="small">
                                查看
                                <i style="position:relative;width:5px;height:5px;top:-8px;left:-3px;
                                background:rgba(254,47,93,1);border-radius:50%;display:inline-block;"></i>
                            </el-button>
                            <el-button type="text" size="small"
                                       v-show="getTransShow(scope.row)"
                                       @click="handleTransClick(scope.row)">转让</el-button>
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
                        :total="1000">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from '../helper/httpHelper';
    import { constant } from '../constant/constant';
    import {accountHelper} from '../helper/accountHelper';

    export default {
        name : 'AssetList',
        data(){
            return {
                tableData: [{
                    id: '金属送吧膜回收,知否知否',
                    name: 'A公司的应收账款',
                    type: '应收账款',
                    displayOwner: '暴力服务商B',
                    displayCheckStatus: '已查验',
                    displayTransStatus: '已授权待转让'
                }],
                totalTxCount:100,
                txListCurrentPage:1,
            }
        },
        components : {

        },
        mounted(){
            this.onPageChange(1);
        },
        methods:{
            add(){
                this.$router.push('/asset_add');
            },
            getDisplayAssetTransStatus(status){
                switch (status){
                    case constant.ASSET_LIST_STATUS.APPLYING:
                        return '转让申请中';
                    case constant.ASSET_LIST_STATUS.ACCEPT:
                        return '已接受待转让';
                    case constant.ASSET_LIST_STATUS.TRANSFERED:
                        return '正常';
                    case constant.ASSET_LIST_STATUS.REFUSED:
                        return '正常';
                    case constant.ASSET_LIST_STATUS.INVALID:
                        return '正常';

                }
            },
            getTransShow(row){
                return accountHelper.isOwner(row.owner) && (row.transStatus === constant.ASSET_LIST_STATUS.TRANSFERED || row.transStatus === constant.ASSET_LIST_STATUS.REFUSED || row.transStatus === constant.ASSET_LIST_STATUS.INVALID)
            },
            getDisplayCheckStatus(status){
                switch (status){
                    case constant.CHECK_STATUS.NOT_CHECK:
                        return '未查验';
                    case constant.CHECK_STATUS.CHECKED:
                        return '已查验';
                    case constant.CHECK_STATUS.CHECK_FAILED:
                        return '查验失败';

                }
            },
            handleCheckClick(row){
                console.log(row)
                this.$router.push(`/asset_detail?type=check&nft_id=${row.id}&owner=${row.owner}&transStatus=${row.transStatus}`);
            },
            handleTransClick(row){
                console.log(row)
                this.$router.push('/asset_detail?type=trans');
            },
            onPageChange(page){
                this.txListCurrentPage = page;
                this.getDataList(page);
            },
            getDataList(page){
                axios.get({url:`/assets?pageNum=${page}&pageSize=10`,ctx:this}).then((data)=>{
                    this.handleData(data);
                }).catch(e=>{
                    console.error('-----',e)
                });
            },
            handleData(data){
                console.log(data)
                this.totalTxCount = data.total;
                this.tableData = data.data.map((asset)=>{
                    let o = {
                        number:asset.number,
                        id:asset.nft_id,
                        name:asset.asset_name,
                        type:asset.type,
                        owner:asset.owner,
                        transStatus:asset.transfer_status,
                        displayOwner:accountHelper.getAccountList().find((a)=>a.address === asset.owner) ? accountHelper.getAccountList().find((a)=>a.address === asset.owner).name : '',
                        displayCheckStatus:this.getDisplayCheckStatus(asset.check_status),
                        displayTransStatus:this.getDisplayAssetTransStatus(asset.transfer_status),
                    };
                    return o;
                })
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
        background:rgba(250,250,250,1);
        padding-bottom:40px;
        box-sizing:border-box;
        .asset_list_wrap{
            width: 69%;
            min-width:994px;
            box-shadow:0 2px 7px 0 rgba(3,44,65,0.12);
            border-radius:4px;
            margin-top:30px;
            padding:24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .asset_list_title_container{
                .flexRow;
                justify-content: space-between;
                margin-bottom:20px;
                .asset_list_title{
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