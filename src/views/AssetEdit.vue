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
                        <data-visibility-setting-tree :treeData="treeData"
                                                      :defaultChoosed="defaultChoosed"
                                                      @handleSelect="handleSelect"/>
                    </div>
                </div>
            </div>
            <div class="content_container step_third" v-show="step === 3">
                <div class="content_item">
                    <p class="content_item_title">
                        设置数据交互服务
                    </p>
                    <div class="step_fourth_wrap flexRow">
                        <div class="tree_wrap">
                            <el-tree
                                    :data="treeData"
                                    default-expand-all
                                    show-checkbox
                                    ref="tree"
                                    node-key="$id">
                            </el-tree>
                        </div>
                        <div class="content_wrap">
                            <div class="content_head_container flexRow">
                                <el-select v-model="service" placeholder="请选择跨链服务" size="small">
                                    <el-option
                                            v-for="item in serviceList"
                                            :key="item.value"
                                            :label="item.label"
                                            :disabled="item.disabled"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-button size="medium"
                                           @click="addServiceItem"
                                           class="btn" type="primary">新增
                                </el-button>
                            </div>
                            <div class="service_content_container">
                                <el-table
                                        :data="checkDataList"
                                        style="width: 100%">
                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <el-form label-position="left" inline class="demo-table-expand">
                                                <pre>{{ props.row.interact }}</pre>
                                            </el-form>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            label="数据信息"
                                            min-width="60">
                                        <template>
                                            <span>
                                                数据信息
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="displayService"
                                            label="对应的服务"
                                            min-width="80">
                                    </el-table-column>
                                    <el-table-column
                                            label="操作"
                                            min-width="60">
                                        <template slot-scope="scope">
                                            <el-button @click="handleDeleteClick(scope.row)"
                                                       type="text" size="small" class="table_delete_btn">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <div class="btn_container flexRow">
                <el-button size="medium"
                           @click="previous"
                           v-show="step === 2 || step === 3"
                           class="btn" type="default">上一步
                </el-button>
                <el-button size="medium"
                           @click="next"
                           v-show="step === 1 || step === 2"
                           class="btn" type="primary">下一步
                </el-button>
                <el-button size="medium"
                           @click="save"
                           v-show="step === 3"
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
    import DataVisibilitySettingTree from '../components/DataVisibilitySettingTree.vue';
    import constant from '../constant/constant';
    import {IOptions} from '../types';
    let $:any=(<any>window).$;
    
    @Component({
          components:{
                Select, DataVisibilitySettingTree
          }
    })
    export default class AssetEdit extends Vue{
          private step : number = 1;
          private authList : any[] = [];
          private jsonData : any = null;
          private dictionary: any = dictionary;
          private authorizationProperties: string[] = [];
          private secretProperties: string[] = [];
          private assetType: string | (string | null)[];
          private dataInteract: any[] = [];
          private transferHistories: any[] = [];
          private treeData: any[] = [];
          private defaultChoosed: any = null;
          private service: number = constant.SERVICE.CHECK;
          private serviceList: IOptions[] = [];
          private checkDataList: any[] = [];
          
          private beforeMount(): void{
                this.assetType = this.$route.query.asset_type;
                this.serviceList.push({
                      value: constant.SERVICE.CHECK,
                      label: '查验'
                })
          }
          private mounted(): void{
                this.getDetails();
          }
          
          private handleCancelClick(): void{
                this.$router.go(-1);
          }
          private previous(): void{
                if(this.step === 2){
                      this.step = 1;
                }else if(this.step === 3){
                      this.step = 2;
                }
          }
          private next(): void{
                if(this.step === 1){
                      this.step = 2;
                      let schema: any = require(`../schema/${this.assetType}`);
                      JsonSchemaHelper.resetArrayToObject(schema);
                      JsonSchemaHelper.formatJsonSchemaToTreeData(schema);
                      this.treeData = schema.children;
                      console.error(schema)
                }else if(this.step === 2){
                      this.step = 3;

                }

          }
          private save(): void{
                let jsonData:any = $("#edit_json_schema_node").alpaca().getValue();
                jsonData.authorizationProperties = this.authorizationProperties;
                jsonData.secretProperties = this.secretProperties;
                jsonData.dataInteract = this.dataInteract;
                jsonData.transferHistories = this.transferHistories;
                this.jsonData = jsonData;
                this.postData();
          }

          private addServiceItem(): void {

                const treeNode: Element | Element[] | Vue | Vue[] = this.$refs.tree;
                if (<Vue>treeNode) {
                      const keys: string[] = (treeNode as any).getCheckedKeys();
                      if (keys instanceof Array) {
                            //console.error(this.$refs.tree.getCheckedKeys())
                            let data = keys.map((item: string) => {
                                  return item.replace(/#/g, '$').replace(/\/properties\//g, '.').replace(/\/items/, '[*]')
                            });
                            this.checkDataList.push({
                                  timestamp: new Date().getTime(),
                                  service: this.service,
                                  interact: data.map((item: string) => {
                                        return {
                                              xPath: item,
                                              interactType: this.service,
                                        }
                                  })
                            });
                            this.resetChecked();
                            console.error(data)
                      }
                }
          }

          private resetChecked(): void {
                const treeNode: Element | Element[] | Vue | Vue[] = this.$refs.tree;
                if (<Vue>treeNode) {
                      (treeNode as any).setCheckedKeys([]);
                }
          }

          private handleDeleteClick(row: any): void {
                console.log(row.timestamp)
                for (let i = 0; i < this.checkDataList.length; i++) {
                      if (this.checkDataList[i].timestamp === row.timestamp) {
                            this.checkDataList.splice(i, 1);
                            break;
                      }
                }
          }

          private handleSelect(id: string, value:number): void{
                console.log(id, value)
                if(value === constant.DATA_VISIBILITY.PUBLIC){
                      this.removeExistAuthItem(id);
                      this.removeExistSecItem(id);
                }else if(value === constant.DATA_VISIBILITY.AUTHORIZATION){
                      this.removeExistSecItem(id);
                      this.authorizationProperties.push(id);
                }else if(value === constant.DATA_VISIBILITY.SECRET){
                      this.removeExistAuthItem(id);
                      this.secretProperties.push(id);
                }

          }

          private removeExistAuthItem(id: string): void{
                const existAuthItem: string | undefined = this.authorizationProperties.find((i: string)=> i === id);
                if(existAuthItem){
                      this.authorizationProperties.splice(this.authorizationProperties.findIndex((i: string)=> i === id),1)
                }
          }

          private removeExistSecItem(id: string): void{
                const existSecItem: string | undefined = this.secretProperties.find((i: string)=> i === id);

                if(existSecItem){
                      this.secretProperties.splice(this.secretProperties.findIndex((i: string)=> i === id),1)
                }
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
                      this.defaultChoosed = {
                            authorizationProperties: this.authorizationProperties.map((item: string)=>item.replace(/\$/g, '#').replace(/\./g, '\/properties\/').replace(/\[\*\]/, '\/items')),
                            secretProperties: this.secretProperties.map((item: string)=>item.replace(/\$/g, '#').replace(/\./g, '\/properties\/').replace(/\[\*\]/, '\/items')),
                      };
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
                    .step_fourth_wrap {
                        padding-top: 15px;
                        .tree_wrap {
                            min-width: 350px;
                        }
                        .content_wrap {
                            flex: 1;

                            .el-select {
                                width: 300px;
                            }
                            .content_head_container {
                                margin-bottom: 10px;
                                .btn {
                                    width: 136px;
                                    margin-left: 20px;
                                }
                            }
                            .service_content_container {
                                background: #ffffff;
                                .table_delete_btn {
                                    color: #FE2F5D;
                                }

                                .el-table {
                                    background: #ffffff;
                                }
                                .el-table th, .el-table tr {
                                    background-color: #F8F8F8;
                                }
                                .el-table__expanded-cell[class*=cell] {
                                    padding: 10px 15px;
                                }
                                pre {
                                    font-size: 12px;
                                    color: $mainFontColor;
                                    background: #ffffff;
                                }
                            }
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