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
            <div class="add_schema_container step_second" v-show="step === 2">
                <div class="content_item" id="json_schema_node"></div>
            </div>
            <div class="content_container step_third" v-show="step === 3">
                <div class="content_item">
                    <p class="content_item_title">
                        设置数据可见范围
                    </p>
                    <div class="content_item_wrap step_third_wrap">
                        <div class="content_visibility_item"
                             :class="info.type ? 'first_item' : ''"
                             v-for="(info, index) in authList">
                            <span class="content_visibility_type" v-if="info.type">
                                {{ dictionary.get(info.type) }}
                            </span>
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
                           class="btn" type="primary">下一步
                </el-button>
            </div>
            <div class="btn_container" v-show="step === 2">
                <el-button class="btn" size="medium" @click="changeStep(1)">上一步</el-button>
                <el-button size="medium"
                           @click="checkData"
                           class="btn" type="primary">下一步
                </el-button>
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
            </div>
            <div class="btn_container" v-show="step === 3">
                <el-button class="btn" size="medium" @click="handleThirdStepPre">上一步</el-button>
                <el-button size="medium"
                           @click="save"
                           class="btn" type="primary">保存
                </el-button>
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
            </div>

        </div>
    </div>
</template>

<script>
    import Select from '../components/Select';
    import schema from './schema';
    import jsonData from './data';
    import { dictionary } from '../constant/dictionary';
    import JsonSchema from '../helper/JsonSchemaHelper';

    export default {
        name : 'AssetAdd',
        data(){
            return {
                options : [{
                    value : '1',
                    label : '应收账款'
                }, {
                    value : '2',
                    label : '非标资产',
                    disabled : true
                }],
                value : '1',
                step : 1,
                authList : [],
                jsonData : null,
                dictionary,
            }
        },
        components : {
            Select
        },
        mounted(){
            $("#json_schema_node").alpaca({
                "schemaSource" : schema,
                "dataSource" : jsonData
            });
        },
        methods : {
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
            checkData(){
                let jsonData = $("#json_schema_node").alpaca().getValue();
                console.log(jsonData);
                if(!jsonData.basicInfo.assetNo || !jsonData.basicInfo.assetType || !jsonData.basicInfo.assetName){
                    return;
                }
                this.authList = new JsonSchema(jsonData).getFormatAuthData();
                console.log('auth list:', this.authList)
                jsonData.authorizationProperties = [];
                jsonData.secretProperties = [];
                this.jsonData = jsonData;
                this.changeStep(3);
            },
            save(){
                let authorization = this.authList.filter((a) => a.value === '2');
                let secret = this.authList.filter((a) => a.value === '3');
                this.jsonData.authorizationProperties = [];
                this.jsonData.secretProperties = [];
                authorization.forEach((a) => this.jsonData.authorizationProperties.push(a.str));
                secret.forEach((a) => this.jsonData.secretProperties.push(a.str));
                this.postData();
            },
            postData(){
                console.log('-=-=-=-=-=-', this.jsonData)
            },
            changeAuth(res){
                this.authList[res.index].value = res.auth;
            },
            getDisplayType(type){
                if(type === 'payments'){
                    return '款项信息'
                } else if(type === 'contracts'){
                    return '合同信息'
                } else if(type === 'invoices'){
                    return '发票信息'
                } else if(type === 'receivable'){
                    return '资产详情'
                } else if(type === 'basicInfo'){
                    return '基本信息'
                }
            },
            handleThirdStepPre(){
                this.authList = [];
                this.changeStep(2);
            },
            closeOtherOps(index){
                for(let i = 0 ; i < this.authList.length ; i++){
                    if(index !== i && this.$refs[`select_${index}`][0].getSelectOpsShow()){
                        this.$refs[`select_${i}`][0].setSelectOpsShow(false);
                    }
                }

            }
        }
    }
</script>
<style lang="less">
    @import "../style/mixin";

    .asset_add_container {
        width: 100%;
        height: 100%;
        .flexColumn;
        align-items: center;
        background: rgba(250, 250, 250, 1);
        .asset_add_wrap {
            width: 69%;
            min-width: 994px;
            box-shadow: 0 2px 7px 0 rgba(3, 44, 65, 0.12);
            border-radius: 4px;
            margin-top: 30px;
            padding: 24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .asset_add_title_container {
                .flexRow;
                justify-content: space-between;
                margin-bottom: 20px;
                .asset_add_title {
                    font-size: 20px;
                    color: @mainFontColor;
                }
            }
            .step_first {
                .flexRow;
            }
            .content_container {
                background: rgba(248, 248, 248, 1);
                border-radius: 4px;
                padding: 20px;
                margin-bottom: 20px;
                .content_title {
                    font-size: 14px;
                    color: @mainFontColor;
                    margin-right: 20px;
                    line-height: 32px;
                }
                .content_item {
                    width: 100%;
                    .content_item_title {
                        border-bottom: 1px solid #EDEDED;
                        padding-bottom: 10px;
                        width: 100%;
                        font-size: 14px;
                        color: @mainFontColor;
                    }
                    .step_third_wrap {
                        padding-top: 12px;
                        .content_visibility_item {
                            .flexRow;
                            width: 400px;
                            justify-content: space-between;
                            margin-bottom: 10px;
                            position: relative;
                            .content_visibility_title {
                                font-size: 14px;
                                color: @mainFontColor;
                            }
                            padding-left: 40px;
                            .content_visibility_type {
                                position: absolute;
                                left: 0;
                                top: -40px;
                                width: 100%;
                                border-top: 1px solid #cccccc;
                                padding-top: 10px;
                            }
                        }
                        .first_item {
                            margin-top: 60px;
                        }
                    }
                }

            }
            .add_schema_container {
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
                    align-items: center;
                    .alpaca-control-label {
                        font-size: 14px;
                        font-weight: 400;
                        color: #9E9E9E;
                        margin-right: 10px;
                        min-width:150px;
                        margin-bottom:0;
                    }
                    .alpaca-required-indicator {
                        display: none;
                    }
                    .alpaca-control {
                        font-size: 14px;
                        color: @mainFontColor;
                        width:250px;
                        height:26px;

                    }
                    .radio{
                        width:150px;
                        margin-top:0;
                        margin-bottom:0;
                        margin-left:0;
                        label{
                            height:26px;
                            display:inline-block;
                        }
                    }
                    .form-control:focus{
                        box-shadow:0 0 3px @themeColor;
                        border-color: @themeColor;
                    }
                }
            }
            .btn_container {
                .flexRow;
                justify-content: flex-end;
                .btn {
                    width: 136px;
                    &:first-child {
                        margin-right: 20px;
                    }
                }
            }
        }

    }

</style>