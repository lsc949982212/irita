<template>
    <div class="asset_edit_container">
        <div class="asset_edit_wrap">
            <div class="asset_edit_title_container">
                <span class="asset_edit_title">
                    资产信息
                </span>
            </div>

            <div class="edit_schema_container" @click="handleAuthContainerClick">
                <div class="content_item" id="edit_json_schema_node"></div>
            </div>
            <div class="content_container">
                <div class="content_item">
                    <div class="auth_title_container">
                        <span class="auth_title">
                            设置数据可见范围
                        </span>
                    </div>
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
            <div class="btn_container">
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
    import { dictionary } from '../constant/dictionary';
    import JsonSchema from '../helper/JsonSchemaHelper';
    import axios from '../helper/httpHelper';

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
            this.getDetails();


        },
        methods : {
            handleCancelClick(){
                this.$router.go(-1);
            },
            handleAuthContainerClick(){
                this.checkData();
            },
            checkData(){
                let jsonData = $("#edit_json_schema_node").alpaca().getValue();
                console.log(jsonData);
                this.authList = new JsonSchema(jsonData).getFormatAuthData();
                jsonData.authorizationProperties = [];
                jsonData.secretProperties = [];
                this.jsonData = jsonData;

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
                console.log(this.jsonData)
            },
            changeAuth(res){
                this.authList[res.index].value = res.auth;
            },
            closeOtherOps(index){
                for(let i = 0 ; i < this.authList.length ; i++){
                    if(index !== i && this.$refs[`select_${index}`][0].getSelectOpsShow()){
                        this.$refs[`select_${i}`][0].setSelectOpsShow(false);
                    }
                }

            },
            getDetails(){
                axios.get({url:`/assets/detail/${this.$route.query.nft_id}?address=${this.$accountHelper.getAccountAddress()}`,ctx:this}).then((data)=>{
                    if(data){
                        this.handleDetailData(data.data);
                    }

                }).catch(e=>{
                    console.error('-----',e)
                });
            },
            handleDetailData(data){
                console.log('detail data', JSON.parse(data))
                this.jsonData = data;
                this.renderUI();
            },
            renderUI(){
                $("#edit_json_schema_node").alpaca({
                    "schemaSource" : schema,
                    "dataSource" : this.jsonData
                });

                setTimeout(() =>{
                    this.checkData();
                }, 1000)
            }
        }
    }
</script>
<style lang="less">
    @import "../style/mixin";

    .asset_edit_container {
        width: 100%;
        height: 100%;
        .flexColumn;
        align-items: center;
        background: rgba(250, 250, 250, 1);
        .asset_edit_wrap {
            width: 69%;
            min-width: 994px;
            box-shadow: 0 2px 7px 0 rgba(3, 44, 65, 0.12);
            border-radius: 4px;
            margin-top: 30px;
            padding: 24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .asset_edit_title_container {
                .flexRow;
                justify-content: space-between;
                margin-bottom: 20px;
                .asset_edit_title {
                    font-size: 20px;
                    color: @mainFontColor;
                }
            }
            .step_first {
                .flexRow;
            }
            /*.step_second{
                .flexColumn;
                margin-bottom:10px;
            }*/

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
                    .auth_title_container {
                        border-bottom: 1px solid #EDEDED;
                        padding-bottom: 10px;
                        width: 100%;
                        .flexRow;
                        justify-content: space-between;
                        .auth_title {
                            font-size: 14px;
                            color: @mainFontColor;
                        }
                        .auth_update {

                        }
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
            .edit_schema_container {
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
                        min-width: 150px;
                        margin-bottom: 0;
                    }
                    .alpaca-required-indicator {
                        display: none;
                    }
                    .alpaca-control {
                        font-size: 14px;
                        color: @mainFontColor;
                        width: 250px;
                        height: 26px;

                    }
                    .help-block{
                        display:none;
                    }
                    .radio {
                        width: 150px;
                        margin-top: 0;
                        margin-bottom: 0;
                        margin-left: 0;
                        label {
                            height: 26px;
                            display: inline-block;
                        }
                    }
                    .form-control:focus {
                        box-shadow: 0 0 3px @themeColor;
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