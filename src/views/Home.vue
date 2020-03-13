<template>
    <div class="home_container flexColumn">
        <div class="home_wrap flexRow">
            <div class="home_left flexColumn">
                <div class="home_left_title_container">
                    <img src="../assets/my_assets.png" class="home_left_icon"/>
                    <span class="home_left_title">我的资产</span>
                </div>
                <div class="home_left_content_container flexRow">
                    <div class="home_left_item_container flexColumn">
                        <span class="home_left_item_title">资产总数</span>
                        <span
                                class="home_left_item_content"
                                @click="toAssetsList('totalAsset','list')"
                        >{{ totalAssets }}</span>
                    </div>
                    <div class="home_left_item_container flexColumn">
                        <span class="home_left_item_title">待处理的授权申请</span>
                        <span
                                class="home_left_item_content"
                                @click="toAssetsList('auth','share')"
                        >{{ authApplyWaitDeal }}</span>
                    </div>
                    <div class="home_left_item_container flexColumn">
                        <span class="home_left_item_title">待转出</span>
                        <span
                                class="home_left_item_content"
                                @click="toAssetsList('trans','list')"
                        >{{ transOutWait }}</span>
                    </div>
                </div>
                <div class="home_left_title_container">
                    <img src="../assets/out_assets.png" class="home_left_icon"/>
                    <span class="home_left_title">外部资产</span>
                </div>
                <div class="home_left_content_container flexRow">
                    <div class="home_left_item_container flexColumn">
                        <span class="home_left_item_title">已获解密授权</span>
                        <span
                                class="home_left_item_content"
                                @click="toAssetsList('secret','share')"
                        >{{ getedSecretAuth }}</span>
                    </div>
                    <div class="home_left_item_container flexColumn">
                        <span class="home_left_item_title">申请授权中</span>
                        <span
                                class="home_left_item_content"
                                @click="toAssetsList('applying','share')"
                        >{{ authApplying }}</span>
                    </div>
                    <div class="home_left_item_container flexColumn">
                        <span class="home_left_item_title">确认待接受</span>
                        <span
                                class="home_left_item_content"
                                @click="toAssetsList('accept','list')"
                        >{{ confirmWaitAccept }}</span>
                    </div>
                </div>
                <div class="home_left_title_container flexRow">
                    <img src="../assets/navigation.png" class="home_left_icon"/>
                    <span class="home_left_title">便捷导航</span>
                </div>
                <div class="home_left_content_container home_left_content_container_bottom flexRow">
                    <div class="home_left_item_container flexColumn">
                        <div class="home_left_item_icon_container flexRow" @click="toAddPage">
                            <img src="../assets/new_assets.png" class="home_left_item_icon"/>
                            <span class="home_left_item_bottom_title">新建资产</span>
                            <img src="../assets/arrow_right.png" class="home_left_item_arrow"/>
                        </div>
                        <span class="home_left_item_content_long">通过资产模型,灵活定制,快速登记资产</span>
                        <!--<span class="home_left_item_sub_content">
                                        上次操作{{  }}
                                    </span>
                                    <span class="home_left_item_sub_content">
                                        {{  }}分钟前
                        </span>-->
                    </div>
                    <div class="home_left_item_container flexColumn">
                        <div class="home_left_item_icon_container flexRow" @click="toSharePage">
                            <img src="../assets/share.png" class="home_left_item_icon"/>
                            <span class="home_left_item_bottom_title">数据授权共享</span>
                            <img src="../assets/arrow_right.png" class="home_left_item_arrow"/>
                        </div>
                        <span class="home_left_item_content_long">申请查看其它链上用户隐私保护的资产内容,对方授权共享后,可临时性查看其加密数据</span>
                        <!--<span class="home_left_item_sub_content">
                                        上次操作{{  }}
                                    </span>
                                    <span class="home_left_item_sub_content">
                                        {{  }}分钟前
                        </span>-->
                    </div>
                    <div class="home_left_item_container flexColumn" @click="toExplorer">
                        <div class="home_left_item_icon_container flexRow">
                            <img src="../assets/explorer.png" class="home_left_item_icon"/>
                            <span class="home_left_item_bottom_title">区块链浏览器</span>
                            <img src="../assets/arrow_right.png" class="home_left_item_arrow"/>
                        </div>
                        <span class="home_left_item_content_long">查看IRITA区块链的全部信息</span>
                        <!--<span class="home_left_item_sub_content">
                                        上次操作{{  }}
                                    </span>
                                    <span class="home_left_item_sub_content">
                                        {{  }}分钟前
                        </span>-->
                    </div>
                </div>
            </div>
            <div class="home_right">
                <div class="home_right_top flexRow">
                    <div class="home_right_top_title_container flexRow">
                        <img src="../assets/dynamic.png" class="home_right_top_icon"/>
                        <span class="home_right_top_title">链上动态</span>
                    </div>
                    <div class="home_right_top_all_container flexRow">
                        <span class="home_right_top_title" @click="toTransExplorer">查看全部</span>
                        <img src="../assets/arrow_right.png" class="home_right_arrow_icon"/>
                    </div>
                </div>
                <div class="home_right_item_container">
                    <div class="home_right_item" :key="item.tx_hash" v-for="item in dynamicList">
                        <div class="home_right_item_content_container">
              <span
                      class="home_right_item_link"
                      @click="handleAddressClick(item.address)"
              >{{ item.displayAddress }}</span>
                            <span class="home_right_item_content">{{ item.displayContent }}</span>
                            <span class="home_right_item_link" @click="handleNameClick(item)">{{ item.name }}</span>
                        </div>
                        <span
                                class="home_right_item_time"
                                @click="handleTimeClick(item)"
                        >{{ item.displayTimePassed }}前</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
      import constant from "../constant/constant";
      import cfg from '../config/config.json';
      import axios from "../helper/httpHelper";
      import {dynamic} from "../constant/dictionary";
      import {getFormatAddress, formatDuring} from "../util/util";
      import {Component, Prop, Vue} from "vue-property-decorator";
      import {IDynamic, ICfg} from "../types";

      @Component
      export default class Home extends Vue {
            private dynamicList: IDynamic[] = [];
            private totalAssets: number = 0;
            private authApplyWaitDeal: number = 0;
            private transOutWait: number = 0;
            private getedSecretAuth: number = 0;
            private authApplying: number = 0;
            private confirmWaitAccept: number = 0;

            private mounted(): void {
                  this.getDetail();
                  this.getDynamicList();
            }

            private get expired(): boolean {
                  return this.$store.state.expired;
            }

            private toAssetsList(type: string, pageType: string): void {
                  let assetStatusValue: number = constant.ASSET_STATUS_OPTIONS.ALL,
                      userAccountValue: number = constant.ASSETS_BELONG.ALL,
                      authStatusValue: number = constant.AUTH_STATUS.ALL,
                      relevantStatusValue: number = constant.RELEVANT.ALL;

                  switch (type) {
                        case "totalAsset":
                              userAccountValue = constant.ASSETS_BELONG.MINE;
                              break;
                        case "auth":
                              authStatusValue = constant.AUTH_STATUS.APPLYING;
                              relevantStatusValue = constant.RELEVANT.MY_RECEIVE;
                              break;
                        case "trans":
                              userAccountValue = constant.ASSETS_BELONG.MINE;
                              assetStatusValue = constant.ASSET_STATUS_OPTIONS.ACCEPT;
                              break;
                        case "secret":
                              authStatusValue = constant.AUTH_STATUS.AUTHORIZED;
                              relevantStatusValue = constant.RELEVANT.MY_POST;
                              break;
                        case "applying":
                              authStatusValue = constant.AUTH_STATUS.APPLYING;
                              relevantStatusValue = constant.RELEVANT.MY_POST;
                              break;
                        case "accept":
                              userAccountValue = constant.ASSETS_BELONG.OTHERS;
                              assetStatusValue = constant.ASSET_STATUS_OPTIONS.APPLYING;
                              break;
                  }
                  console.error(assetStatusValue, userAccountValue);
                  if (pageType === "list") {
                        this.$router.replace(
                            `/asset_list?&asset_status_value=${assetStatusValue}&user_account_value=${userAccountValue}`
                        );
                  } else if (pageType === "share") {
                        this.$router.replace(
                            `/auth_share?&auth_status_value=${authStatusValue}&relevant_status_value=${relevantStatusValue}`
                        );
                  }
            }

            private toAddPage(): void {
                  this.$router.replace("/asset_add");
            }

            private toExplorer(): void {
                  window.open(`${cfg.app.explorer}/#/home`);
            }

            private toSharePage(): void {
                  this.$router.replace("/auth_share");
            }

            private getDetail(): void {
                  axios
                      .get({url: `/assets/caculate_info`, ctx: this})
                      .then((data: any) => {
                            if (data && data.data) {
                                  this.handleData(data.data);
                            }
                      })
                      .catch((e: any) => {
                            console.error(e);
                      });
            }

            private handleData(data: any): void {
                  this.totalAssets = data.ownerasset_caculateinfo.total;
                  this.authApplyWaitDeal = data.ownerasset_caculateinfo.apply;
                  this.transOutWait = data.ownerasset_caculateinfo.wait_transfer;
                  this.getedSecretAuth = data.otherasset_caculateinfo.authok;
                  this.authApplying = data.otherasset_caculateinfo.applying;
                  this.confirmWaitAccept = data.otherasset_caculateinfo.wait_accept;
            }

            private getDynamicList(): void {
                  axios
                      .get({url: `/txs?pageNum=1&pageSize=6`, ctx: this})
                      .then((data: any) => {
                            if (data && data.data) {
                                  this.handleDynamicData(data.data);
                            }
                      })
                      .catch((e: any) => {
                            console.error(e);
                      });
            }

            private handleDynamicData(data: any): void {
                  console.log(data);
                  this.dynamicList = data.map((item: any) => {
                        let name = "";
                        if (constant.DYNAMIC.ASSETS.includes(item.type)) {
                              name = item.assetname;
                        } else if (constant.DYNAMIC.SERVICE.includes(item.type)) {
                              name = item.servicename;
                        }

                        return {
                              address: item.address,
                              displayAddress: getFormatAddress(item.address),
                              displayContent: dynamic.get(item.type),
                              name,
                              type: item.type,
                              displayTimePassed: this.formatTime(
                                  new Date().getTime() - item.time * 1000
                              ),
                              assetname: item.assetname,
                              servicename: item.servicename,
                              hash: item.tx_hash
                        };
                  });
            }

            private formatTime(time: number): string {
                  let obj = formatDuring(time);
                  let day = parseInt(obj.days);
                  let hours = parseInt(obj.hours);
                  let min = parseInt(obj.minutes);
                  if (day >= 1) {
                        return `${day}天`;
                  } else if (hours >= 1) {
                        return `${hours}小时`;
                  } else if (hours < 1) {
                        return `${min}分钟`;
                  } else {
                        return "";
                  }
            }

            private handleAddressClick(address: string): void {
                  window.open(`${cfg.app.explorer}/#/address/${address}`);
            }

            private handleNameClick(item: IDynamic): void {
                  if (constant.DYNAMIC.ASSETS.includes(item.type)) {
                        window.open(`${cfg.app.explorer}/#/nftAsset`);
                  } else if (constant.DYNAMIC.SERVICE.includes(item.type)) {
                        window.open(
                            `${cfg.app.explorer}/#/service?serviceName=${item.servicename}&chainId=${cfg.chainId}`
                        );
                  }
            }

            private toTransExplorer(): void {
                  window.open(`${cfg.app.explorer}/#/txs`);
            }

            private handleTimeClick(item: IDynamic): void {
                  window.open(`${cfg.app.explorer}/#/tx?txHash=${item.hash}`);
            }
      }
</script>

<style lang="scss" scoped>
    @import "../style/mixin";

    .home_container {
        width: 100%;
        height: 100%;
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
            .home_left {
                width: 680px;
                flex: 0 0 680px;
                margin-right: 60px;
                .home_left_title_container {
                    align-items: center;
                    margin-bottom: 20px;
                    .home_left_icon {
                        width: 14px;
                        height: 14px;
                        margin-right: 11px;
                    }
                    .home_left_title {
                        font-size: 16px;
                        color: $mainFontColor;
                    }
                }
                .home_left_content_container {
                    justify-content: space-between;
                    height: 110px;
                    border: 1px solid rgba(237, 237, 237, 1);
                    padding: 20px 30px 0 30px;
                    border-radius: 4px;
                    margin-bottom: 30px;
                    .home_left_item_container {
                        align-items: flex-start;
                        width: 180px;
                        .home_left_item_title {
                            color: #9e9e9e;
                            font-size: 14px;
                            margin-bottom: 20px;
                        }
                        .home_left_item_content {
                            color: $themeColor;
                            font-size: 24px;
                            cursor: pointer;
                        }
                    }
                }
                .home_left_content_container_bottom {
                    height: 192px;
                    .home_left_item_container {
                        align-items: flex-start;
                        width: 180px;
                        padding-bottom: 25px;
                        .home_left_item_icon_container {
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
                                color: $themeColor;
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
                            color: #9e9e9e;
                        }
                        .home_left_item_sub_content {
                            height: 17px;
                            flex: 0 0 17px;
                            color: #d3d3d3;
                            font-size: 12px;
                        }
                    }
                }
            }
            .home_right {
                flex: 1;
                height: 100%;
                .home_right_top {
                    justify-content: space-between;
                    margin-bottom: 6px;
                    height: 20px;
                    flex: 0 0 20px;
                    .home_right_top_title_container {
                        align-items: center;
                        .home_right_top_icon {
                            width: 14px;
                            height: 14px;
                            margin-right: 11px;
                        }
                        .home_right_top_title {
                            font-size: 16px;
                            color: $mainFontColor;
                        }
                    }
                    .home_right_top_all_container {
                        align-items: center;
                        cursor: pointer;
                        .home_right_top_title {
                            font-size: 14px;
                            color: $themeColor;
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
                        border-bottom: 1px solid #ededed;
                        padding: 14px 0;
                        .home_right_item_content_container {
                            height: 44px;
                            overflow: hidden;
                            .home_right_item_link {
                                font-size: 14px;
                                color: $themeColor;
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
                            color: #9e9e9e;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
</style>