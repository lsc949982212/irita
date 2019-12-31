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
                <div class="content_item" id="json_schema_node"></div>
            </div>
            <div class="content_container step_third" v-show="step === 3">
                <div class="content_item">
                    <p class="content_item_title">
                        设置数据可见范围
                    </p>
                    <div class="content_item_wrap step_third_wrap">
                        <div class="content_visibility_item"

                             v-for="(info, index) in authList">
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
                           @click="checkData"
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
    import jsonData from './data';
    import {Dictionary} from '../constant/Dictionary';

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
                authList:[],
                jsonData:null,
            }
        },
        components : {
            Select
        },
        mounted(){
            $("#json_schema_node").alpaca({
                "schemaSource": schema,
                "dataSource":jsonData
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
            checkData(){
                let jsonData = $("#json_schema_node").alpaca().getValue();
                console.log(jsonData);
                if(!jsonData.basicInfo.assetNo || !jsonData.basicInfo.assetType || !jsonData.basicInfo.assetName){
                    return;
                }
                jsonData.authorizationProperties = [];
                jsonData.secretProperties = [];
                this.jsonData = jsonData;
                this.changeStep(3);
                this.setAuth();
            },
            save(){
                console.log(this.authList)
                let authorization = this.authList.filter((a)=>a.value === '1');
                let secret = this.authList.filter((a)=>a.value === '2');
                if(this.authList.detailedInfo.payments.length){
                    for(let i = 0; i < authorization.length; i++){
                        if(Object.keys(this.authList.detailedInfo.payments[0]).includes(authorization[i])){
                            this.authList.authorizationProperties.push(`detailedInfo.payments.${authorization[i]}`)
                        }
                    }

                }
                if(this.authList.detailedInfo.contracts.length){
                    for(let i = 0; i < authorization.length; i++){
                        if(Object.keys(this.authList.detailedInfo.contracts[0]).includes(authorization[i])){
                            this.authList.authorizationProperties.push(`detailedInfo.contracts.${authorization[i]}`)
                        }
                    }


                }
                if(this.authList.detailedInfo.invoices.length){
                    for(let i = 0; i < authorization.length; i++){
                        if(Object.keys(this.authList.detailedInfo.invoices[0]).includes(authorization[i])){
                            this.authList.authorizationProperties.push(`detailedInfo.invoices.${authorization[i]}`)
                        }
                    }

                }

            },
            changeAuth(res){
                console.log(res)
                this.authList[res.index].value = res.auth;
            },
            setAuth(){
                let authList = [];
                this.setFormatDataList('payments',authList);
                this.setFormatDataList('contracts',authList);
                this.setFormatDataList('invoices',authList);
                console.log('====',authList);
                this.authList = authList;
            },
            setFormatDataList(field, authList){
                if(this.jsonData.detailedInfo[field].length){
                    for(let key in this.jsonData.detailedInfo[field][0]){
                        authList.push({
                            title:Dictionary.get(key),
                            data:[{
                                value: '1',
                                label: '公开信息'
                            }, {
                                value: '2',
                                label: '授权查看',
                            }, {
                                value: '3',
                                label: '仅自己可见',
                            }],
                            value:'1',
                            titleKey:key,
                        })
                    }
                }
            },
            closeOtherOps(index){
                for(let i = 0; i < this.authList.length; i++){
                    if(index !== i && this.$refs[`select_${index}`][0].getSelectOpsShow()){
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
            /*.step_second{
                .flexColumn;
                margin-bottom:10px;
            }*/

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