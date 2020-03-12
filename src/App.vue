<template>
    <div id="app" class="flexColumn">
        <div class="header_container flexRow">
            <div class="header_wrap flexRow">
                <img src="./assets/logo.png" alt="网络原因,暂无..." class="logo">
                <div class="header_center_container flexRow" id="header_center_container">
                    <div class="tab_container flexRow">
                        <span class="tab"
                              @click="handleTabClick(0)"
                              :class="activeTab === 0 ? 'active' : ''">
                            首页
                        </span>
                        <span class="tab"
                              v-show="!expired"
                              @click="handleTabClick(1)"
                              :class="activeTab === 1 ? 'active' : ''">
                            新建资产
                        </span>
                        <span class="tab"
                              v-show="!expired"
                              @click="handleTabClick(2)"
                              :class="activeTab === 2 ? 'active' : ''">
                            资产列表
                        </span>
                        <span class="tab"
                              v-show="!expired"
                              @click="handleTabClick(3)"
                              :class="activeTab === 3 ? 'active' : ''">
                            数据授权共享
                        </span>

                    </div>

                    <div class="login_container"
                         v-show="expired"
                         @click="handleLoginClick">
                        登录
                    </div>
                    <div class="login_account_container flexRow"
                         v-show="!expired">
                        <span class="login_account">
                            {{ displayUserName }}
                        </span>
                        <span class="exit" @click="handleExitClick">
                            退出
                        </span>

                    </div>

                </div>

            </div>

        </div>
        <div class="body_container">
            <router-view @handleLoginClick="handleLoginClick"/>
        </div>
        <el-dialog
                :visible.sync="centerDialogVisible"
                width="400px"
                top="35vh"
                center>
            <div class="login_dialog_container flexColumn">
                <span class="login_dialog_title">登录</span>
                <el-input
                        placeholder="请输入账户名"
                        v-model="username"
                        class="login_input_username"
                        clearable>
                </el-input>
                <el-input
                        placeholder="请输入密码"
                        v-model="psd"
                        class="login_input_psd"
                        show-password
                        clearable>
                </el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary"
                               class="login_container"
                               style="width:100%;"
                               @click="login">登录
                    </el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script lang='ts'>
      import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
      import {Message} from 'element-ui';
      import LoginHelper from './helper/LoginHelper';

      @Component
      export default class App extends Vue {
            private activeTab: number = 2;
            private centerDialogVisible: boolean = false;
            private username: string = '';
            private psd: string = '';
            private displayUserName: string = '';
            private showToast: boolean = true;


            @Watch('$route')
            private onRouteChanged(to: any, oldRoute: any): void {
                  if (to.path !== '/login') {
                        const token: string | null = sessionStorage.getItem('token');
                        if (token) {
                              this.displayUserName = JSON.parse(token).name;
                        }
                        if (to.path === '/asset_list') {
                              this.activeTab = 2;
                        } else if (to.path === '/asset_add') {
                              this.activeTab = 1;
                        } else if (to.path === '/auth_share') {
                              this.activeTab = 3;
                        } else if (to.path === '/home') {
                              this.activeTab = 0;
                        }
                  }
            }

            @Watch('expired')
            private onExpiredChanged(expired: boolean): void {
                  if (expired) {
                        this.$router.push('/login');
                  }
            }

            get expired(): boolean {
                  return this.$store.state.expired;
            }

            private beforeMount(): void {
                  const token: string | null = sessionStorage.getItem('token');
                  if (token) {
                        this.displayUserName = JSON.parse(token).name;
                  }
            }

            private mounted(): void {
                  this.$nextTick(() => {
                        const offsetLeft2 : any = document.getElementById('header_center_container');
                        this.$store.commit('SET_OFFSET_LEFT', offsetLeft2.offsetLeft);
                  });
                  if (this.$route.path === '/home') {
                        this.activeTab = 0;
                  } else if (this.$route.path === '/asset_add') {
                        this.activeTab = 1;
                  } else if (this.$route.path === '/asset_list') {
                        this.activeTab = 2;
                  } else if (this.$route.path === '/auth_share') {
                        this.activeTab = 3;
                  }
                  if (this.expired) {
                        this.$router.push('/login');
                  }
            }

            private handleTabClick(tab: number): void {
                  if (tab === 0) {
                        if (this.$route.path === '/home') {
                              return;
                        }
                        this.$router.replace('/home');
                  } else if (tab === 1) {
                        if (this.$route.path === '/asset_add') {
                              return;
                        }
                        this.$router.replace('/asset_add');
                  } else if (tab === 2) {
                        if (this.$route.path === '/asset_list') {
                              return;
                        }
                        this.$router.replace('/asset_list');
                  } else if (tab === 3) {
                        if (this.$route.path === '/auth_share') {
                              return;
                        }
                        this.$router.replace('/auth_share');
                  }
            }

            private handleLoginClick(): void {
                  this.centerDialogVisible = true;
            }

            private login(): void {
                  if (!this.username) {
                        this.$message.error('请输入账号');
                        return;
                  } else if (!this.psd) {
                        this.$message.error('请输入密码');
                        return;
                  }
                  const isSuccess = LoginHelper.login({
                        username: this.username,
                        psd: this.psd,
                        ctx: this,
                  });

                  if (isSuccess) {
                        Message({
                              message: '登录成功',
                              type: 'success',
                              duration: 2000,
                        });
                        this.centerDialogVisible = false;
                        this.$router.replace('/home');
                  } else {
                        this.$message.error('账号或者密码错误');
                  }
            }

            private handleExitClick(): void {
                  this.showToast = false;
                  LoginHelper.exit(this);
                  setTimeout(() => {
                        this.showToast = true;
                  }, 3000);
            }

      }

</script>

<style lang="scss">
    @import "./style/mixin.scss";
    @import "./style/jsonSchemaReset.scss";

    html {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            div, p {
                margin: 0;
                padding: 0;
                border: none;
            }
            #app {
                width: 100%;
                height: 100%;
                font-size: 16px;
                .header_container {
                    width: 100%;
                    height: 80px;
                    //flex:0 0 80px;
                    background: #2449AD;
                    position: relative;
                    //.flexRow;
                    justify-content: center;
                    box-sizing: border-box;
                    .header_wrap {
                        //.flexRow;
                        height: 100%;
                        align-items: center;
                        width: 69%;
                        min-width: 994px;
                        .logo {
                            height: 40px;
                            width: 123px;
                            flex: 0 0 123px;
                            cursor: pointer;
                        }
                        .header_center_container {
                            //.flexRow;
                            flex: 1;
                            margin-left: 90px;
                            justify-content: space-between;

                            .tab_container {
                                height: 100%;
                                //.flexRow;
                                .tab {
                                    height: 80px;
                                    line-height: 80px;
                                    color: #ffffff;
                                    cursor: pointer;
                                    font-size: 16px;
                                    font-weight: 600;
                                    color: rgba(255, 255, 255, 0.5);
                                    border-bottom: 3px solid transparent;
                                    //&:first-child {
                                    margin-right: 40px;
                                    //}
                                    box-sizing: border-box;
                                }
                                .active {
                                    color: rgba(255, 255, 255, 1);
                                    border-bottom: 3px solid #ffffff;
                                }
                            }
                            .login_container {
                                color: rgba(255, 255, 255, 0.5);
                                line-height: 80px;
                                cursor: pointer;
                            }
                            .login_account_container {
                                //.flexRow;
                                align-items: center;
                                .login_account {
                                    color: #ffffff;
                                    padding: 2px 20px 2px 20px;
                                }
                                .exit {
                                    color: rgba(255, 255, 255, 0.5);
                                    border-left: 1px solid rgba(255, 255, 255, 0.5);
                                    padding: 0 20px 0 20px;
                                    cursor: pointer;
                                }
                            }
                        }

                    }

                }
                .body_container {
                    width: 100%;
                    flex: 1;
                    box-sizing: border-box;
                    overflow-y: auto;
                    background: #fafafa;
                }
                .login_dialog_container {
                    //.flexColumn;
                    .login_dialog_title {
                        color: #111B39;
                        margin-bottom: 20px;
                    }
                    .login_input_username {
                        margin-bottom: 20px;
                        &:last-child {
                            margin-bottom: 50px;
                        }
                    }
                    .login_input_psd {
                        margin-bottom: 50px;
                    }
                    .login_container {
                        background: #21BC5D;
                        border: none;
                    }

                }

                .fade-enter-active, .fade-leave-active {
                    transition: opacity .28s;
                }
                .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
                {
                    opacity: 0;
                }

                //reset element ui
                .el-dialog__footer {
                    padding: 0 30px 40px 30px;
                }
                .el-dialog__body {
                    padding: 0 30px 40px 30px !important;
                }
                .el-button {
                    font-weight: 400;
                }
                .el-table th, .el-table tr {
                    background-color: #F8F8F8;
                }
                tr {
                    border: none;
                }
                .el-table--enable-row-transition .el-table__body td {
                    border: none;
                }

                .el-input__inner {
                    height: 34px;
                    line-height: 34px;
                }
                .el-button--medium {
                    height: 34px;
                }
                .el-upload__input {
                    display: none;
                }
            }
        }
    }
</style>