<template>
    <div class="home_container">
        <div class="home_wrap">
            <div class="home_left">
                <div class="home_left_title_container">
                    <img src="../assets/my_assets.png" class="home_left_icon">
                    <span class="home_left_title">
                        我的资产
                    </span>
                </div>
                <div class="home_left_content_container">
                    <div class="home_left_item_container">
                        <span class="home_left_item_title">
                            资产总数
                        </span>
                        <span class="home_left_item_content"
                              @click="toAssetsList('totalAsset','list')">
                            {{ totalAssets }}
                        </span>
                    </div>
                    <div class="home_left_item_container">
                        <span class="home_left_item_title">
                            待处理的授权申请
                        </span>
                        <span class="home_left_item_content"
                              @click="toAssetsList('auth','share')">
                            {{ authApplyWaitDeal }}
                        </span>
                    </div>
                    <div class="home_left_item_container">
                        <span class="home_left_item_title">
                            待转出
                        </span>
                        <span class="home_left_item_content"
                              @click="toAssetsList('trans','list')">
                            {{ transOutWait }}
                        </span>
                    </div>

                </div>
                <div class="home_left_title_container">
                    <img src="../assets/out_assets.png" class="home_left_icon">
                    <span class="home_left_title">
                        外部资产
                    </span>
                </div>
                <div class="home_left_content_container">
                    <div class="home_left_item_container">
                        <span class="home_left_item_title">
                            已获解密授权
                        </span>
                        <span class="home_left_item_content"
                              @click="toAssetsList('secret','share')">
                            {{ getedSecretAuth }}
                        </span>
                    </div>
                    <div class="home_left_item_container">
                        <span class="home_left_item_title">
                            申请授权中
                        </span>
                        <span class="home_left_item_content"
                              @click="toAssetsList('applying','share')">
                            {{ authApplying }}
                        </span>
                    </div>
                    <div class="home_left_item_container">
                        <span class="home_left_item_title">
                            确认待接受
                        </span>
                        <span class="home_left_item_content"
                              @click="toAssetsList('accept','list')">
                            {{ confirmWaitAccept }}
                        </span>
                    </div>
                </div>
                <div class="home_left_title_container">
                    <img src="../assets/navigation.png" class="home_left_icon">
                    <span class="home_left_title">
                        便捷导航
                    </span>
                </div>
                <div class="home_left_content_container home_left_content_container_bottom">
                    <div class="home_left_item_container">
                        <div class="home_left_item_icon_container">
                            <img src="../assets/new_assets.png" class="home_left_item_icon">
                            <span class="home_left_item_bottom_title">
                                新建资产
                            </span>
                            <img src="../assets/arrow_right.png" class="home_left_item_arrow">
                        </div>
                        <span class="home_left_item_content_long">
                            通过资产模型,灵活定制,快速登记资产
                        </span>
                        <span class="home_left_item_sub_content">
                            上次操作{{  }}
                        </span>
                        <span class="home_left_item_sub_content">
                            {{  }}分钟前
                        </span>
                    </div>
                    <div class="home_left_item_container">
                        <div class="home_left_item_icon_container">
                            <img src="../assets/share.png" class="home_left_item_icon">
                            <span class="home_left_item_bottom_title">
                                数据授权共享
                            </span>
                            <img src="../assets/arrow_right.png" class="home_left_item_arrow">
                        </div>
                        <span class="home_left_item_content_long">
                            申请查看其它链上用户隐私保护的资产内容,对方授权共享后,可临时性查看其加密数据
                        </span>
                        <span class="home_left_item_sub_content">
                            上次操作{{  }}
                        </span>
                        <span class="home_left_item_sub_content">
                            {{  }}分钟前
                        </span>
                    </div>
                    <div class="home_left_item_container">
                        <div class="home_left_item_icon_container">
                            <img src="../assets/explorer.png" class="home_left_item_icon">
                            <span class="home_left_item_bottom_title">
                                区块链浏览器
                            </span>
                            <img src="../assets/arrow_right.png" class="home_left_item_arrow">
                        </div>
                        <span class="home_left_item_content_long">
                            查看IRITA区块链的全部信息
                        </span>
                        <span class="home_left_item_sub_content">
                            上次操作{{  }}
                        </span>
                        <span class="home_left_item_sub_content">
                            {{  }}分钟前
                        </span>
                    </div>

                </div>
            </div>
            <div class="home_right">
                <div class="home_right_top">
                    <div class="home_right_top_title_container">
                        <img src="../assets/dynamic.png" class="home_right_top_icon">
                        <span class="home_right_top_title">
                            动态
                        </span>
                    </div>
                    <div class="home_right_top_all_container">
                        <span class="home_right_top_title">
                            查看全部
                        </span>
                        <img src="../assets/arrow_right.png" class="home_right_arrow_icon">
                    </div>
                </div>
                <div class="home_right_item_container">
                    <div class="home_right_item" v-for="item in dynamicList">
                        <div class="home_right_item_content_container">
                            <span class="home_right_item_link">
                                {{ item.address }}
                            </span>
                            <span class="home_right_item_content">
                                {{ item.displayContent }}
                            </span>
                            <span class="home_right_item_link">
                                {{ item.name }}
                            </span>
                        </div>
                        <span class="home_right_item_time">
                            {{ item.displayTimePassed }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import {constant} from "../constant/constant";

    export default {
        name : 'Home',
        data(){
            return {
                dynamicList : [{
                    address : 'faa*****fds',
                    displayContent : '发布了新资产',
                    name : '供应商A',
                    displayTimePassed : '3天前',

                }],
                totalAssets : 22,
                authApplyWaitDeal : 22,
                transOutWait : 22,
                getedSecretAuth : 22,
                authApplying : 22,
                confirmWaitAccept : 22,
            }
        },
        components : {},
        mounted(){

        },
        computed : {
            expired(){
                return this.$store.state.expired;
            }
        },
        methods : {
            toAssetsList(type, page){
                let assetStatusValue = constant.ASSET_STATUS_OPTIONS.ALL,
                    userAccountValue = constant.ASSETS_BELONG.ALL;

                switch (type){
                    case 'totalAsset':
                        userAccountValue = constant.ASSETS_BELONG.MINE;
                        break;

                    case 'auth':
                        //this.assetStatusValue = constant.ASSET_STATUS_OPTIONS.APPLYING;
                        break;
                    case 'trans':
                        userAccountValue = constant.ASSETS_BELONG.MINE;
                        assetStatusValue = constant.ASSET_STATUS_OPTIONS.ACCEPT;
                        break;
                    case 'secret':

                        break;
                    case 'applying':
                        break;

                    case 'accept':
                        userAccountValue = constant.ASSETS_BELONG.OTHERS;
                        assetStatusValue = constant.ASSET_STATUS_OPTIONS.APPLYING;
                        break;
                }
                console.error(assetStatusValue,userAccountValue)
                if(page === 'list'){
                    this.$router.replace(`/asset_list?&asset_status_value=${assetStatusValue}&user_account_value=${userAccountValue}`)
                }else if(page === 'share'){

                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../style/mixin";

    .home_container {
        width: 100%;
        height: 100%;
        .flexColumn;
        align-items: center;
        background: rgba(250, 250, 250, 1);
        .home_wrap {
            width: 69%;
            min-width: 994px;
            box-shadow: 0 2px 7px 0 rgba(3, 44, 65, 0.12);
            border-radius: 4px;
            margin-top: 30px;
            padding: 24px 30px 30px 30px;
            background: #ffffff;
            box-sizing: border-box;
            .flexRow;
            .home_left {
                width: 680px;
                flex: 0 0 680px;
                .flexColumn;
                margin-right: 60px;
                .home_left_title_container {
                    .flexRow;
                    align-items: center;
                    margin-bottom: 20px;
                    .home_left_icon {
                        width: 14px;
                        height: 14px;
                        margin-right: 11px;
                    }
                    .home_left_title {
                        font-size: 16px;
                        color: @mainFontColor;
                    }

                }
                .home_left_content_container {
                    .flexRow;
                    justify-content: space-between;
                    height: 110px;
                    border: 1px solid rgba(237, 237, 237, 1);
                    padding: 20px 30px 0 30px;
                    border-radius: 4px;
                    margin-bottom: 30px;
                    .home_left_item_container {
                        .flexColumn;
                        align-items: flex-start;
                        width: 180px;

                        .home_left_item_title {
                            color: #9E9E9E;
                            font-size: 14px;
                            margin-bottom: 20px;
                        }
                        .home_left_item_content {
                            color: @themeColor;
                            font-size: 24px;
                            cursor: pointer;

                        }

                    }

                }
                .home_left_content_container_bottom {
                    height: 222px;
                    .home_left_item_container {
                        .flexColumn;
                        align-items: flex-start;
                        width: 180px;
                        padding-bottom: 25px;
                        .home_left_item_icon_container {
                            .flexRow;
                            align-items: center;
                            margin-bottom: 14px;
                            height: 20px;
                            flex: 0 0 20px;
                            .home_left_item_icon {
                                height: 14px;
                                width: 14px;
                                margin-right: 10px;
                            }
                            .home_left_item_bottom_title {
                                font-size: 14px;
                                color: @themeColor;
                                cursor: pointer;
                                margin-right: 10px;
                            }
                            .home_left_item_arrow {
                                width: 5px;
                                height: 9px;
                            }
                        }
                        .home_left_item_content_long {
                            flex: 1;
                            font-size: 14px;
                            color: #9E9E9E;
                        }
                        .home_left_item_sub_content {
                            height: 17px;
                            flex: 0 0 17px;
                            color: #D3D3D3;
                            font-size: 12px;
                        }

                    }
                }
            }
            .home_right {
                flex: 1;
                height: 100%;
                .home_right_top {
                    .flexRow;
                    justify-content: space-between;
                    margin-bottom: 6px;
                    height: 20px;
                    flex: 0 0 20px;
                    .home_right_top_title_container {
                        .flexRow;
                        align-items: center;
                        .home_right_top_icon {
                            width: 14px;
                            height: 14px;
                            margin-right: 11px;
                        }
                        .home_right_top_title {
                            font-size: 16px;
                            color: @mainFontColor;
                        }

                    }
                    .home_right_top_all_container {
                        .flexRow;
                        align-items: center;
                        cursor: pointer;
                        .home_right_top_title {
                            font-size: 14px;
                            color: @themeColor;
                            margin-right: 4px;
                        }
                        .home_right_arrow_icon {
                            width: 5px;
                            height: 9px;
                        }
                    }

                }
                .home_right_item_container {
                    flex: 1;
                    overflow-y: auto;
                    .home_right_item {
                        border-bottom: 1px solid #EDEDED;
                        padding: 15px 0;
                        .home_right_item_content_container {

                            .home_right_item_link {
                                font-size: 14px;
                                color: @themeColor;
                                cursor: pointer;
                            }
                            .home_right_item_content {
                                font-size: 14px;
                                color: #464646;
                            }

                        }
                        .home_right_item_time {
                            margin: 8px 0;
                            font-size: 14px;
                            color: #9E9E9E;
                        }
                    }
                }
            }

        }

    }

</style>