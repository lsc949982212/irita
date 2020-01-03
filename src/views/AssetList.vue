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
                            prop="id"
                            label="资产编号"
                            min-width="150">
                    </el-table-column>
                    <el-table-column
                            prop="assetName"
                            label="资产名称"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            prop="assetType"
                            label="资产类型"
                            min-width="60">
                    </el-table-column>
                    <el-table-column
                            prop="owner"
                            label="所有者"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="查验状态"
                            min-width="50">
                    </el-table-column>
                    <el-table-column
                            prop="txStatus"
                            label="转让状态"
                            min-width="70">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="90">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text" size="small">
                                查看
                                <i style="position:relative;width:5px;height:5px;top:-8px;left:-3px;
                                background:rgba(254,47,93,1);border-radius:50%;display:inline-block;"></i>
                            </el-button>
                            <el-button type="text" size="small">转让</el-button>
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
                        layout="prev, pager, next"
                        :total="1000">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from '../helper/httpHelper';

    export default {
        name : 'AssetList',
        data(){
            return {
                tableData: [{
                    id: '金属送吧膜回收,知否知否',
                    assetName: 'A公司的应收账款',
                    assetType: '应收账款',
                    owner: '暴力服务商B',
                    status: '已查验',
                    txStatus: '已授权待转让'
                },{
                    id: '金属送吧膜回收,知否知否',
                    assetName: 'A公司的应收账款',
                    assetType: '应收账款',
                    owner: '暴力服务商B',
                    status: '已查验',
                    txStatus: '已授权待转让'
                },{
                    id: '金属送吧膜回收,知否知否',
                    assetName: 'A公司的应收账款',
                    assetType: '应收账款',
                    owner: '暴力服务商B',
                    status: '已查验',
                    txStatus: '已授权待转让'
                },{
                    id: '金属送吧膜回收,知否知否',
                    assetName: 'A公司的应收账款',
                    assetType: '应收账款',
                    owner: '暴力服务商B',
                    status: '已查验',
                    txStatus: '已授权待转让'
                },{
                    id: '金属送吧膜回收,知否知否',
                    assetName: 'A公司的应收账款',
                    assetType: '应收账款',
                    owner: '暴力服务商B',
                    status: '已查验',
                    txStatus: '已授权待转让'
                },{
                    id: '金属送吧膜回收,知否知否',
                    assetName: 'A公司的应收账款',
                    assetType: '应收账款',
                    owner: '暴力服务商B',
                    status: '已查验',
                    txStatus: '已授权待转让'
                },{
                    id: '金属送吧膜回收,知否知否',
                    assetName: 'A公司的应收账款',
                    assetType: '应收账款',
                    owner: '暴力服务商B',
                    status: '已查验',
                    txStatus: '已授权待转让'
                },{
                    id: '金属送吧膜回收,知否知否',
                    assetName: 'A公司的应收账款',
                    assetType: '应收账款',
                    owner: '暴力服务商B',
                    status: '已查验',
                    txStatus: '已授权待转让'
                },],
                totalTxCount:100
            }
        },
        components : {

        },
        mounted(){
            setTimeout(()=>{
                axios.get({url:'',ctx:this});
            },3000)
        },
        methods:{
            add(){
                this.$router.push('/asset_add');
            },
            handleClick(row){
                console.log(row)
                this.$router.push('/asset_detail');
            },
            onPageChange(page){

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