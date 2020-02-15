<template>
    <div class="asset_edit_container">
        <div class="asset_edit_wrap">
            <div class="asset_edit_title_container">
                <span class="asset_edit_title">
                    资产信息
                </span>
            </div>

            <div class="edit_schema_container" v-show="step === 1">
                <div class="content_item" id="edit_json_schema_node"></div>
            </div>
            <div class="content_container" v-show="step === 2">
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
                                    :value="info.value"
                                    :ref="`select_${index}`"
                                    @changeAuth="changeAuth"/>
                        </div>
                    </div>
                </div>

            </div>
            <div class="btn_container">
                <el-button size="medium"
                           @click="save"
                           v-show="step === 2"
                           class="btn" type="primary">保存
                </el-button>
                <el-button size="medium"
                           @click="next"
                           v-show="step === 1"
                           class="btn" type="primary">下一步
                </el-button>
                <el-button size="medium"
                           @click="previous"
                           v-show="step === 2"
                           class="btn" type="primary">上一步
                </el-button>

                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
            </div>

        </div>
    </div>
</template>

<script>
    import Select from '../components/Select';
    import schema from '../schema/schema';
    import { dictionary } from '../constant/dictionary';
    import JsonSchema from '../helper/JsonSchemaHelper';
    import axios from '../helper/httpHelper';
    import { Message } from 'element-ui';
    import { getErrorMsgByErrorCode } from '../helper/errorCodeHelper';

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
                authorizationProperties:[],
                secretProperties:[],

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
            previous(){
                this.step = 1;
            },
            next(){
                this.step = 2;
                this.setAuthListUI();
            },
            save(){
                let authorization = this.authList.filter((a) => a.value === '2');
                let secret = this.authList.filter((a) => a.value === '3');
                let jsonData = $("#edit_json_schema_node").alpaca().getValue();
                jsonData.authorizationProperties = [];
                jsonData.secretProperties = [];
                authorization.forEach((a) => jsonData.authorizationProperties.push(a.str));
                secret.forEach((a) => jsonData.secretProperties.push(a.str));
                this.jsonData = jsonData;
                this.postData();
            },
            postData(){
                console.log('要发送的数据',this.jsonData);
                const body = {
                    asset_data:this.jsonData,
                };
                axios.put({url:`/assets`,body,ctx:this}).then((data)=>{
                    console.log('response after submit json data',data)
                    if(data && data.data && data.data.status === 'success'){
                        Message({
                            message : '编辑资产成功',
                            type : 'success'
                        });
                        this.$router.go(-1);
                    } else if(data && data.data && data.data.status === 'fail'){
                        this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                    } else{
                        this.$message.error('编辑资产失败');
                    }

                }).catch(e=>{
                    console.error('submit json data failed',e);
                    this.$message.error('编辑资产失败');
                });
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
                axios.get({url:`/assets/detail/${this.$route.query.nft_id}?address=${this.$accountHelper.getAccount().address}`,ctx:this}).then((data)=>{
                    if(data){
                        this.handleDetailData(data.data);
                    }

                }).catch(e=>{
                    console.error('get asset detail failed',e)
                });
            },
            handleDetailData(data){
                console.log('detail data', data)
                if(data.asset_info){
                    this.jsonData =  JSON.parse(data.asset_info);
                    this.authorizationProperties = this.jsonData.authorizationProperties;
                    this.secretProperties = this.jsonData.secretProperties;
                    this.renderUI();
                }

            },
            renderUI(){
                $("#edit_json_schema_node").alpaca({
                    "schemaSource" : schema,
                    "dataSource" : this.jsonData
                });
                setTimeout(() =>{
                    document.getElementsByClassName('alpaca-required-indicator').forEach((node) =>{
                        node.innerHTML = '(必填)';
                    });
                    let assetNode = document.getElementsByName('basicInfo_assetType');
                    let ownerNode = document.getElementsByName('basicInfo_assetType');
                    if(assetNode && assetNode.length){
                        document.getElementsByName('basicInfo_assetType')[0].setAttribute('disabled',true)
                    }
                    if(ownerNode && ownerNode.length){
                        document.getElementsByName('basicInfo_assetOwner')[0].setAttribute('disabled',true)
                    }

                }, 300)
            },
            setAuthListUI(){
                let jsonData = $("#edit_json_schema_node").alpaca().getValue();
                console.error(this.authorizationProperties,this.secretProperties)
                this.authList = new JsonSchema(jsonData,this.authorizationProperties,this.secretProperties).setEditFormatAuthData().getEditAuthDataList();
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
                    .form-control{
                        padding:0 0 0 12px;
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