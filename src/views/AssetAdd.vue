<template>
    <div class="asset_add_container flexColumn">
        <div class="asset_add_wrap">
            <div class="asset_add_title_container flexRow">
                <span class="asset_add_title">
                    新增资产
                </span>
            </div>
            <div class="content_container step_first flexRow" v-show="step === 1">
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

                <div class="add_schema_download_container flexRow">
                    <div class="download_container" id="schema_container_id">
                        <img src="../assets/download.png" class="download_icon">
                        <a class="download_node"
                           target="_blank"
                           :href="schemaDownloadUrl"
                           download>JSON Schema</a>
                    </div>
                    <div class="download_container" id="data_container_id">
                        <img src="../assets/download.png" class="download_icon">
                        <a target="_blank"
                           class="download_node"
                           :href="dataDownloadUrl"
                           download>资产数据文本样例</a>
                    </div>
                    <input type="file" id="files" style="display:none;margin-left:20px;" @change="fileImport"
                           accept=".json">
                    <el-button size="medium"
                               @click="handleImportClick"
                               class="btn" type="primary">导入资产
                    </el-button>
                </div>
                <div class="content_item" id="json_schema_node"></div>
            </div>
            <div class="content_container step_third" v-show="step === 3">
                <div class="content_item">
                    <p class="content_item_title">
                        设置数据可见范围
                    </p>
                    <div class="content_item_wrap step_third_wrap">
                        <data-visibility-setting-tree :treeData="treeData"  @handleSelect="handleSelect"/>
                    </div>
                </div>
            </div>
            <div class="content_container step_third" v-show="step === 4">
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
            <div class="btn_container flexRow" v-show="step === 1">
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
                <el-button size="medium"
                           @click="changeStep(2)"
                           class="btn" type="primary">下一步
                </el-button>
            </div>
            <div class="btn_container flexRow" v-show="step === 2">
                <el-button class="btn" size="medium" @click="changeStep(1)" type="default">上一步</el-button>
                <el-button size="medium"
                           @click="checkData"
                           class="btn" type="primary">下一步
                </el-button>
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
            </div>
            <div class="btn_container flexRow" v-show="step === 3">
                <el-button class="btn" size="medium" @click="changeStep(2)" type="default">上一步</el-button>
                <el-button size="medium"
                           @click="changeStep(4)"
                           class="btn" type="primary">下一步
                </el-button>
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
            </div>
            <div class="btn_container flexRow" v-show="step === 4">
                <el-button class="btn" size="medium" @click="step = 3" type="default">上一步</el-button>
                <el-button size="medium"
                           @click="save"
                           class="btn" type="primary">保存
                </el-button>
                <el-button class="btn" size="medium" @click="handleCancelClick">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
      import Select from '../components/Select.vue';
      import JsonSchemaHelper from '../helper/JsonSchemaHelper';
      import axios from '../helper/httpHelper';
      import {Message} from 'element-ui';
      import getErrorMsgByErrorCode from '../helper/errorCodeHelper';
      import {isJson} from '../util/util';
      import data from './data.json';
      import schemaConfig from '../schema/config.json';
      import {Component, Vue} from 'vue-property-decorator';
      import {IOptions} from '../types';
      import accountHelper from '../helper/accountHelper';
      import constant from '../constant/constant';
      import DataVisibilitySettingTree from '../components/DataVisibilitySettingTree.vue';
      let $: any = (window as any).$;

      let tempData: any = JSON.parse(JSON.stringify(data));

      @Component({
            components: {
                  Select,DataVisibilitySettingTree
            }
      })
      export default class AssetAdd extends Vue {
            private options: IOptions[] = [];
            private serviceList: IOptions[] = [];
            private dataInteract: any[] = [];
            private checkDataList: any[] = [];
            private treeData: any[] = [];
            private value: string = '';
            private step: number = 1;
            private jsonData: any = null;
            private downloadUrl: any = null;
            private service: number = constant.SERVICE.CHECK;
            private authorizationProperties: string[] = [];
            private secretProperties: string[] = [];

            private mounted(): void {
                  this.getAssetType();
                  console.error(this.step)
            }

            private beforeMount(): void {
                  this.serviceList.push({
                        value: constant.SERVICE.CHECK,
                        label: '查验'
                  })
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



            private get schemaDownloadUrl(): string {
                  if (this.value && this.downloadUrl) {
                        return this.downloadUrl[this.value].schema;
                  } else {
                        return '';
                  }
            }

            private get dataDownloadUrl(): string {
                  if (this.value && this.downloadUrl) {
                        return this.downloadUrl[this.value].template;
                  } else {
                        return '';
                  }
            }

            private add(): void {
                  this.$router.push('/asset_add');
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

            private handleDeleteClick(row: any): void {
                  console.log(row.timestamp)
                  for (let i = 0; i < this.checkDataList.length; i++) {
                        if (this.checkDataList[i].timestamp === row.timestamp) {
                              this.checkDataList.splice(i, 1);
                              break;
                        }
                  }
            }

            private resetChecked(): void {
                  const treeNode: Element | Element[] | Vue | Vue[] = this.$refs.tree;
                  if (<Vue>treeNode) {
                        (treeNode as any).setCheckedKeys([]);
                  }
            }


            private handleImportClick(): void {
                  const fileNode: any = document.getElementById('files');
                  if (fileNode) {
                        fileNode.click();
                  }

            }

            private fileImport(): void {
                  const fileNode: any = document.getElementById('files');
                  let selectedFile: any;
                  if (fileNode) {
                        selectedFile = fileNode.files[0];
                  }
                  const reader: FileReader = new FileReader();
                  reader.readAsText(selectedFile);
                  reader.onload = (): void => {
                        if (!isJson(reader.result)) {
                              this.$message.error('json数据格式有误,请重新上传');
                              return;
                        }
                        try {
                              if (reader.result && typeof reader.result === 'string') {
                                    if (JSON.parse(reader.result).basicInfo.assetType !== this.value) {
                                          this.$message.error('资产类型不匹配,请重新上传');
                                          setTimeout(() => {
                                                window.location.reload();
                                          }, 2000)
                                    }
                              }

                        } catch (e) {
                              this.$message.error('导入数据错误,请重新上传');
                        }
                        let tempData: any;
                        if (reader.result && typeof reader.result === 'string') {
                              console.error(JSON.parse(reader.result))
                              tempData = JSON.parse(JSON.stringify(JSON.parse(reader.result)))
                              if (JSON.parse(reader.result).dataInteract) {
                                    this.dataInteract = JSON.parse(reader.result).dataInteract;
                              }
                        }

                        const token: string | null = sessionStorage.getItem('token');
                        if (token && typeof token === 'string') {
                              tempData.basicInfo.assetOwner = JSON.parse(token).name;
                        }

                        const el: any = document.getElementById('json_schema_node');
                        const childs: any = el.childNodes;
                        for (let i = childs.length - 1; i >= 0; i--) {
                              el.removeChild(childs[i]);
                        }
                        $("#json_schema_node").alpaca({
                              "schemaSource": JsonSchemaHelper.getFormatSchemaFile(require(`../schema/${this.value}`)),
                              "dataSource": tempData
                        });
                        setTimeout(() => {
                              const node: any = document.getElementsByClassName('alpaca-required-indicator');
                              if (node) {
                                    node.forEach((node: any) => {
                                          node.innerHTML = '(必填)';
                                    });
                              }

                              const assetType: any = document.getElementsByName('basicInfo_assetType');
                              const assetOwner: any = document.getElementsByName('basicInfo_assetOwner');
                              if (assetType && assetType.length) {
                                    assetType[0].setAttribute('disabled', true)
                              }
                              if (assetOwner && assetOwner.length) {
                                    assetOwner[0].setAttribute('disabled', true)
                              }

                        }, 300)
                  }
            }

            private handleCancelClick(): void {
                  this.$router.go(-1);
            }

            private getAssetType(): void {
                  const url: string = `/assets/denoms`;
                  axios.get({url, ctx: this}).then((data: any) => {
                        console.log(data);
                        if (data && data.status === 'success') {
                              if (data && data.data && data.data.denoms) {
                                    data.data.denoms.forEach((item: string, index: number) => {
                                          if (schemaConfig.denoms.includes(item)) {
                                                this.options.push({
                                                      value: item,
                                                      label: item
                                                })
                                          }
                                    });
                                    this.downloadUrl = data.data.download_url;
                                    if (data.data.denoms.length > 0) {
                                          this.value = data.data.denoms[0]
                                          //this.value = 'car'
                                    }

                                    let schema: any = require(`../schema/${this.value}`);
                                    JsonSchemaHelper.resetArrayToObject(schema);
                                    JsonSchemaHelper.formatJsonSchemaToTreeData(schema);
                                    this.treeData = schema.children;


                              }
                        } else {
                              this.$message.error('请求数据错误');
                        }
                  }).catch((e: any) => {
                        console.error(e);
                        this.$message.error('请求数据错误');
                  });
            }

            private changeStep(step: number): void {

                  this.step = step;
                  if (step === 1) {
                        const el: any = document.getElementById('json_schema_node');
                        const childs: any = el.childNodes;
                        for (let i = childs.length - 1; i >= 0; i--) {
                              el.removeChild(childs[i]);
                        }
                  } else if (step === 2) {
                        console.log('当前选择的资产类型为:', this.value);
                        const token: string | null = sessionStorage.getItem('token');
                        if (token) {

                              if (token && typeof token === 'string') {
                                    tempData.basicInfo.assetOwner = JSON.parse(token).name;
                              }
                              tempData.basicInfo.assetType = this.value;
                        }
                        if ($("#json_schema_node")) {
                              $("#json_schema_node").alpaca({
                                    "schemaSource": JsonSchemaHelper.getFormatSchemaFile(require(`../schema/${this.value}`)),
                                    "dataSource": tempData
                              });
                        }

                        setTimeout(() => {
                              const node = document.getElementsByClassName('alpaca-required-indicator');
                              if (node) {
                                    for (const item of node) {
                                          item.innerHTML = '(必填)';
                                    }
                              }

                              const assetType: any = document.getElementsByName('basicInfo_assetType');
                              const assetOwner: any = document.getElementsByName('basicInfo_assetOwner');
                              if (assetType && assetType.length) {
                                    assetType[0].setAttribute('disabled', true)
                              }
                              if (assetOwner && assetOwner.length) {
                                    assetOwner[0].setAttribute('disabled', true)
                              }
                        }, 100);
                  } else if (step === 3) {
                        let schema: any = require(`../schema/${this.value}`);
                        JsonSchemaHelper.resetArrayToObject(schema);
                        JsonSchemaHelper.formatJsonSchemaToTreeData(schema);
                        this.treeData = schema.children;
                        console.error(schema)
                  }

            }

            private checkData(): void {
                  this.jsonData = $("#json_schema_node").alpaca().getValue();
                  this.changeStep(3);
            }

            private save(): void {
                  this.jsonData.authorizationProperties = this.authorizationProperties;
                  this.jsonData.secretProperties = this.secretProperties;
                  let dataInteract: any[] = [];
                  this.checkDataList.forEach((item) => dataInteract = [...dataInteract, ...item.interact]);
                  console.error(this.authorizationProperties)
                  console.error(this.secretProperties)
                  console.error(this.checkDataList)
                  console.error(dataInteract)
                  this.jsonData.dataInteract = dataInteract;
                  this.postData();
            }

            private postData(): void {
                  const body: any = {
                        asset_data: this.jsonData,
                        owner: accountHelper.getAccount().address,
                        owner_pubkey: accountHelper.getAccount().publicKey,
                  };

                  console.log('save asset', this.jsonData);
                  axios.post({url: `/assets`, body, ctx: this}).then((data: any) => {
                        console.log(data);
                        if (data && data.data && data.data.status === 'success') {
                              Message({
                                    message: '新增资产成功',
                                    type: 'success'
                              });
                              this.$router.replace('/asset_list');
                        } else if (data && data.data && data.data.status === 'fail') {
                              this.$message.error(getErrorMsgByErrorCode(data.data.errCode));
                        } else {
                              this.$message.error('新增资产失败');
                        }
                  }).catch((e: any) => {
                        console.error(e);
                        this.$message.error('新增资产失败');
                  });
            }
      }

</script>
<style lang="scss">
    @import "../style/mixin";

    .asset_add_container {
        width: 100%;
        height: 100%;
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
                justify-content: space-between;
                margin-bottom: 20px;
                .asset_add_title {
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
                    .content_item_title {
                        border-bottom: 1px solid #EDEDED;
                        padding-bottom: 10px;
                        width: 100%;
                        font-size: 14px;
                        color: $mainFontColor;
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
            .add_schema_container {
                .add_schema_download_container {
                    justify-content: flex-end;
                    .download_container {
                        cursor: pointer;
                        .download_icon {
                            width: 14px;
                            height: 13px;
                            margin-right: 10px;
                        }
                        .download_node {
                            font-size: 14px;
                            color: $themeColor;

                        }
                    }

                    .download_node {
                        margin-right: 20px;
                        line-height: 36px;
                    }

                }
                #json_schema_node {
                    .alpaca-top {
                        padding: 0;
                        margin: 10px 0;
                    }
                }

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
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .alpaca-control-label {
                        font-size: 14px;
                        font-weight: 400;
                        color: #9E9E9E;
                        margin-right: 10px;
                        min-width: 150px;
                        margin-bottom: 0;
                    }
                    .help-block {
                        display: none;
                    }
                    .alpaca-required-indicator {
                        //display: none;
                        font-style: normal;
                        color: red;
                    }
                    .alpaca-control {
                        font-size: 14px;
                        color: $mainFontColor;
                        width: 250px;
                        height: 26px;

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
                    .form-control {
                        padding: 0 0 0 12px;
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