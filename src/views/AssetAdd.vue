<template>
    <div class="asset_add_container">
        <div class="asset_add_wrap">
            <div class="asset_add_title_container">
                <span class="asset_add_title">
                    新增资产
                </span>
            </div>
            <div class="content_container step_first" v-show="step === 1">
                <span class="content_title">
                    选择资产类型
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
            </div>
            <div class="content_container step_second" v-show="step === 2">
                <div class="content_item">
                    <p class="content_item_title">
                        基本信息
                    </p>
                    <div class="content_item_wrap" id="json_schema_node">

                    </div>
                </div>
            </div>
            <div class="content_container step_second" v-show="step === 2">
                <div class="content_item">
                    <p class="content_item_title">
                        资产详情
                    </p>
                    <div class="content_item_wrap">

                    </div>
                </div>
            </div>

            <div class="content_container step_third" v-show="step === 3">
                <div class="content_item">
                    <p class="content_item_title">
                        设置数据可见范围
                    </p>
                    <div class="content_item_wrap step_third_wrap">
                        <div class="content_visibility_item"
                             :key="info.title"
                             v-for="(info, index) in dataList">
                            <span class="content_visibility_title">
                                {{ info.title }}
                            </span>
                            <Select :options="info.data" :index="index"
                                    @closeOtherOps="closeOtherOps"
                                    :ref="`select_${index}`"
                                    @changeAuth="changeAuth"/>
                        </div>
                    </div>
                </div>

            </div>



            <div class="btn_container" v-show="step === 1">
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
                <el-button size="medium"
                           @click="changeStep(2)"
                           class="btn" type="primary">下一步</el-button>
            </div>
            <div class="btn_container" v-show="step === 2">
                <el-button class="btn" size="medium" @click="changeStep(1)">上一步</el-button>
                <el-button size="medium"
                           @click="changeStep(3)"
                           class="btn" type="primary">下一步</el-button>
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
            </div>
            <div class="btn_container" v-show="step === 3">
                <el-button class="btn" size="medium" @click="changeStep(2)">上一步</el-button>
                <el-button size="medium"
                           @click="save"
                           class="btn" type="primary">保存</el-button>
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
            </div>

        </div>
    </div>
</template>

<script>
    import Select from '../components/Select';
    import schema from './schema';

    export default {
        name : 'AssetAdd',
        data(){
            return {
                options: [{
                    value: '1',
                    label: '应收账款'
                }, {
                    value: '2',
                    label: '非标资产',
                    disabled: true
                }],
                value: '1',
                step:1,
                dataList:[{
                    title:'资产详细信息',
                    data:[{
                        value: '1',
                        label: '公开信息'
                    }, {
                        value: '2',
                        label: '授权查看',
                    }, {
                        value: '3',
                        label: '仅自己可见',
                    },]
                },{
                    title:'货物名称',
                    data:[{
                        value: '1',
                        label: '公开信息'
                    }, {
                        value: '2',
                        label: '授权查看',
                    }, {
                        value: '3',
                        label: '仅自己可见',
                    },]
                }]
            }
        },
        components : {
            Select
        },
        mounted(){
            $("#json_schema_node").alpaca({
                "schema": schema
            });
        },
        methods:{
            add(){
                this.$router.push('/asset_add');
            },
            handleClick(row){
                console.log(row)
            },
            handleCancelClick(){
                this.$router.go(-1);
            },
            changeStep(step){
                this.step = step;
            },
            save(){

            },
            changeAuth(res){
                console.log(res)
            },
            closeOtherOps(index){
                for(let i = 0; i < this.dataList.length; i++){
                    if(index !== i && this.$refs[`select_${index}`][0].getSelectOpsShow()){
                        console.log('-=-=-=-=');
                        this.$refs[`select_${i}`][0].setSelectOpsShow(false);
                    }
                }

            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../style/mixin";

    .asset_add_container {
        width: 100%;
        height: 100%;
        .flexColumn;
        align-items: center;
        background:rgba(250,250,250,1);
        .asset_add_wrap{
            width: 63%;
            box-shadow:0 2px 7px 0 rgba(3,44,65,0.12);
            border-radius:4px;
            margin-top:30px;
            padding:24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .asset_add_title_container{
                .flexRow;
                justify-content: space-between;
                margin-bottom:20px;
                .asset_add_title{
                    font-size:20px;
                    color:@mainFontColor;
                }
            }
            .step_first{
                .flexRow;
            }
            .step_second{
                .flexColumn;
                margin-bottom:10px;
            }

            .content_container{
                background:rgba(248,248,248,1);
                border-radius:4px;
                padding:20px;
                margin-bottom:20px;
                .content_title{
                    font-size:14px;
                    color:@mainFontColor;
                    margin-right:20px;
                    line-height:32px;
                }
                .content_item{
                    width:100%;
                    .content_item_title{
                        border-bottom:1px solid #EDEDED;
                        padding-bottom:10px;
                        width:100%;
                        font-size:14px;
                        color:@mainFontColor;
                    }
                    .step_third_wrap{
                        padding-top:12px;
                        .content_visibility_item{
                            .flexRow;
                            width:240px;
                            justify-content: space-between;
                            margin-bottom:10px;
                            .content_visibility_title{
                                font-size:14px;
                                color: @mainFontColor;
                            }
                        }
                    }
                }

            }
            .btn_container{
                .flexRow;
                justify-content: flex-end;
                .btn{
                    width:136px;
                    &:first-child{
                        margin-right:20px;
                    }
                }
            }
        }

    }

</style>