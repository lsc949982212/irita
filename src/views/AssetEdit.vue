<template>
    <div class="asset_edit_container flexColumn">
        <div class="asset_edit_wrap">
            <div class="asset_edit_title_container flexRow">
                <span class="asset_edit_title">
                    资产信息
                </span>
            </div>

            <div class="edit_schema_container" v-show="step === 1">
                <div class="content_item" id="edit_json_schema_node"></div>
            </div>
            <div class="content_container" v-show="step === 2">
                <div class="content_item">
                    <div class="auth_title_container flexRow">
                        <span class="auth_title">
                            设置数据可见范围
                        </span>
                    </div>
                    <div class="content_item_wrap step_third_wrap">
                        <div class="content_visibility_item flexRow"
                             :class="info.type ? 'first_item' : ''"
                             v-for="(info, index) in authList">
                            <!--<span class="content_visibility_type" v-if="info.type">
                                {{ dictionary.get(info.type) }}
                            </span>-->
                            <span class="content_visibility_title">
                                {{ info.title ? info.title : info.str.split('.')[info.str.split('.').length - 1] }}
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
            <div class="btn_container flexRow">

                <el-button size="medium"
                           @click="next"
                           v-show="step === 1"
                           class="btn" type="primary">下一步
                </el-button>
                <el-button size="medium"
                           @click="previous"
                           v-show="step === 2"
                           class="btn" type="default">上一步
                </el-button>
                <el-button size="medium"
                           @click="save"
                           v-show="step === 2"
                           class="btn" type="primary">保存
                </el-button>
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
    import Select from '../components/Select.vue';
    import { dictionary } from '../constant/dictionary';
    import JsonSchema from '../helper/JsonDataHelper';
    import JsonSchemaHelper from '../helper/JsonSchemaHelper';
    import axios from '../helper/httpHelper';
    import { Message } from 'element-ui';
    import getErrorMsgByErrorCode  from '../helper/errorCodeHelper';
    import {Component, Vue} from 'vue-property-decorator';
    import accountHelper from '../helper/accountHelper';
    
    @Component({
          components:{
                Select
          }
    })
    export default class AssetEdit extends Vue{
          private step : number = 1
          private authList : any[] = []
          private jsonData : any = null;
          private dictionary: any = dictionary;
          private authorizationProperties: any[] = [];
          private secretProperties: any[] = [];
          private assetType: string | (string | null)[];
          private dataInteract: any[] = [];
          private transferHistories: any[] = [];
          
          private beforeMount(): void{
                this.assetType = this.$route.query.asset_type;
          }
          private mounted(): void{
                this.getDetails();
          }
          
          private handleCancelClick(): void{
                this.$router.go(-1);
          }
          private previous(): void{
                this.step = 1;
          }
          private next(): void{
                this.step = 2;
                this.setAuthListUI();
          }
          private save(): void{
                let authorization: any[] = this.authList.filter((a: any) => a.value === '2');
                let secret: any[] = this.authList.filter((a: any) => a.value === '3');
                let jsonData:any = $("#edit_json_schema_node").alpaca().getValue();
                jsonData.authorizationProperties = [];
                jsonData.secretProperties = [];
                jsonData.dataInteract = this.dataInteract;
                jsonData.transferHistories = this.transferHistories;
                authorization.forEach((a:any) => jsonData.authorizationProperties.push(a.str));
                secret.forEach((a:any) => jsonData.secretProperties.push(a.str));
                this.jsonData = jsonData;
                this.postData();
          }
          
          private postData(): void{
                console.log('要发送的数据',this.jsonData);
                const body: any = {
                      asset_data:this.jsonData,
                };
                axios.put({url:`/assets/${this.$route.query.nft_id}`,body,ctx:this}).then((data: any)=>{
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

                }).catch((e: any)=>{
                      console.error('submit json data failed',e);
                      this.$message.error('编辑资产失败');
                });
          }
          
          private changeAuth(res: any): void{
                this.authList[res.index].value = res.auth;
          }
          
          private closeOtherOps(index: number): void{
                const nodeList: any = this.$refs[`select_${index}`];
                if(nodeList.length){
                      for (let i = 0; i < this.authList.length; i++) {
                            if (index !== i && nodeList[0].getSelectOpsShow()) {
                                  const subNodeList = this.$refs[`select_${i}`];
                                  subNodeList[0].setSelectOpsShow(false);
                            }
                      }
                }
          }
          
          private getDetails(): void{
                axios.get({url:`/assets/detail/${this.$route.query.nft_id}?address=${accountHelper.getAccount().address}`,ctx:this}).then((data:any)=>{
                      if(data){
                            this.handleDetailData(data.data);
                      }

                }).catch((e:any)=>{
                      console.error('get asset detail failed',e)
                });
          }
          
          private handleDetailData(data: any): void{
                console.log('detail data', data)
                if(data.asset_info){
                      this.jsonData =  JSON.parse(data.asset_info);
                      //查验数据需要加上
                      if(this.jsonData.dataInteract){
                            this.dataInteract = this.jsonData.dataInteract
                      }
                      if(this.jsonData.transferHistories){
                            this.transferHistories = this.jsonData.transferHistories
                      }

                      this.authorizationProperties = this.jsonData.authorizationProperties;
                      this.secretProperties = this.jsonData.secretProperties;
                      this.renderUI();
                }

          }
          
          private renderUI(): void{
                $("#edit_json_schema_node").alpaca({
                      "schemaSource" : JsonSchemaHelper.getFormatSchemaFile(require(`../schema/${this.assetType}`)),
                      "dataSource" : this.jsonData
                });
                setTimeout(() =>{
                      const node: any = document.getElementsByClassName('alpaca-required-indicator');
                      for(const item of node){
                            item.innerHTML = '(必填)';
                      }
                      let assetNode: any = document.getElementsByName('basicInfo_assetType');
                      let ownerNode: any = document.getElementsByName('basicInfo_assetType');
                      if(assetNode && assetNode.length){
                            document.getElementsByName('basicInfo_assetType')[0].setAttribute('disabled','true')
                      }
                      if(ownerNode && ownerNode.length){
                            document.getElementsByName('basicInfo_assetOwner')[0].setAttribute('disabled','true')
                      }

                }, 300)
          }
          
          private setAuthListUI(): void{
                let jsonData:any = $("#edit_json_schema_node").alpaca().getValue();
                this.authList = new JsonSchema(jsonData,this.authorizationProperties,this.secretProperties).setEditFormatAuthData().getEditAuthDataList();
          }
          
    }
    
</script>
<style lang="scss">
    @import "../style/mixin";

    .asset_edit_container {
        width: 100%;
        height: 100%;
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
                justify-content: space-between;
                margin-bottom: 20px;
                .asset_edit_title {
                    font-size: 20px;
                    color: $mainFontColor;
                }
            }
            

            .content_container {
                background: rgba(248, 248, 248, 1);
                border-radius: 4px;
                padding: 20px;
                margin-bottom: 20px;
                .content_title {
                    font-size: 14px;
                    color: $mainFontColor;
                    margin-right: 20px;
                    line-height: 32px;
                }
                .content_item {
                    width: 100%;
                    .auth_title_container {
                        padding-bottom: 10px;
                        width: 100%;
                        justify-content: space-between;
                        .auth_title {
                            font-size: 14px;
                            color: $mainFontColor;
                        }
                        .auth_update {

                        }
                    }
                    .step_third_wrap {
                        padding-top: 12px;
                        .content_visibility_item {
                            
                            width: 400px;
                            justify-content: space-between;
                            margin-bottom: 10px;
                            position: relative;
                            .content_visibility_title {
                                font-size: 14px;
                                color: $mainFontColor;
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
                    color: $mainFontColor;
                    padding-bottom: 10px;
                    border-color: #EDEDED;
                }
                .form-group {
                    display:flex;
                    flex-direction:row;
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
                        font-style: normal;
                        color: red;
                    }
                    .alpaca-control {
                        font-size: 14px;
                        color: $mainFontColor;
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
                        box-shadow: 0 0 3px $themeColor;
                        border-color: $themeColor;
                    }
                }
            }
            .btn_container {
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