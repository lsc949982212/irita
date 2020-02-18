<template>
    <div id="app">
        <div class="header_container">
            <div class="header_wrap">
                <img src="./assets/logo.png" alt="网络原因,暂无..." class="logo">
                <div class="header_center_container" id="header_center_container">
                    <div class="tab_container">
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
                    </div>

                    <div class="login_container"
                         v-show="expired"
                         @click="handleLoginClick">
                        登录
                    </div>
                    <div class="login_account_container"
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
        <!--<login-dialog />-->
        <el-dialog
                :visible.sync="centerDialogVisible"
                width="400px"
                top="35vh"
                center>
            <div class="login_dialog_container">
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

<script>
    import { Message } from 'element-ui';
    import loginHelper from './helper/loginHelper';

    export default {
        name : "app",
        data(){
            let activeTab;
            if(this.$route.path === '/asset_list'){
                activeTab = 2;
            }else if(this.$route.path === '/home'){
                activeTab = 0;
            }else if(this.$route.path === '/asset_add'){
                activeTab = 1;
            }else{
                activeTab = 2;
            }
            let token = sessionStorage.getItem('token');
            let displayUserName = '';
            if(token){
                displayUserName = JSON.parse(token).name;
            }
            return {
                activeTab : activeTab,
                centerDialogVisible : false,
                username : '',
                psd : '',
                displayUserName,
                showToast:true,
            }
        },
        watch : {
            $route(to){
                if(to.path === '/login'){
                    //this.activeTab = 0
                } else {
                    let token = sessionStorage.getItem('token');
                    let displayUserName = '';
                    if(token){
                        displayUserName = JSON.parse(token).name;
                    }
                    this.displayUserName = displayUserName;
                    if(to.path === '/asset_list'){
                        this.activeTab = 2
                    }else if(to.path === '/asset_add'){
                        this.activeTab = 1
                    }else if(to.path === '/home'){
                        this.activeTab = 0
                    }
                }
            },
            expired(expired){
                if(expired){
                    /*if(this.showToast){
                        this.$message.error('登录过期,请重新登录');
                    }*/
                    this.$router.push('/login');
                }
            }
        },
        computed:{
            expired(){
                return this.$store.state.expired;
            }
        },
        components : {},
        mounted(){
            this.$nextTick(() =>{
                const offsetLeft2 = document.getElementById('header_center_container');
                this.$store.commit('SET_OFFSET_LEFT', offsetLeft2.offsetLeft)
            });
            if(this.$route.path === '/login'){
                //this.activeTab = 0
            } else if(this.$route.path === '/home'){
                this.activeTab = 0
            }  else if(this.$route.path === '/asset_add'){
                this.activeTab = 1
            } else  if(this.$route.path === '/asset_list'){
                this.activeTab = 2
            }
            if(this.expired){
                this.$router.push('/login');
            }
        },
        methods : {
            handleTabClick(tab){
                if(tab === 0){
                    if(this.$route.path === '/home'){
                        return;
                    }
                    this.$router.replace('/home')
                } else if(tab === 1){
                    if(this.$route.path === '/asset_add'){
                        return;
                    }
                    this.$router.replace('/asset_add')



                    /*if(this.$route.path === '/login'){
                        if(tab === 1){
                            this.$router.replace('/asset_list')
                        }else if(tab === 2){
                            this.$router.replace('/asset_add')
                        }
                    }else if(this.$route.path !== '/asset_list'){

                        if(tab === 1){
                            this.$router.push('/asset_list')
                        }else if(tab === 2){
                            this.$router.push('/asset_add')
                        }
                    }*/

                } else if(tab === 2){
                    if(this.$route.path === '/asset_list'){
                        return;
                    }
                    this.$router.replace('/asset_list')


                    /*if(this.$route.path === '/login'){
                        if(tab === 1){
                            this.$router.replace('/asset_list')
                        }else if(tab === 2){

                        }
                    }else if(this.$route.path !== '/asset_list'){

                        if(tab === 1){
                            this.$router.push('/asset_list')
                        }else if(tab === 2){
                            this.$router.push('/asset_add')
                        }
                    }*/

                }
            },
            handleLoginClick(){
                this.centerDialogVisible = true;
            },
            login(){
                //this.$refs.login.setDialogVisible(true);
                if(!this.username){
                    this.$message.error('请输入账号');
                    return;
                } else if(!this.psd){
                    this.$message.error('请输入密码');
                    return;
                }
                const isSuccess = loginHelper.login({
                    username : this.username,
                    psd : this.psd,
                    ctx : this
                });

                if(isSuccess){
                    Message({
                        message : '登录成功',
                        type : 'success'
                    });
                    this.centerDialogVisible = false;
                    this.$router.replace('/asset_list')
                } else {
                    this.$message.error('账号或者密码错误');
                }
            },
            handleExitClick(){
                this.showToast = false;
                loginHelper.exit(this);
                setTimeout(()=>{
                    this.showToast = true;
                },3000)
            }

        }
    }
</script>

<style lang="less">
    // @import "./style/reset";
    @import "./style/mixin";
    @import "./style/jsonSchemaReset";

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
                .flexColumn;
                font-size: 16px;
                .header_container {
                    width: 100%;
                    height: 80px;
                    flex:0 0 80px;
                    background: #2449AD;
                    position: relative;
                    .flexRow;
                    justify-content: center;
                    box-sizing: border-box;
                    .header_wrap {
                        .flexRow;
                        height: 100%;
                        align-items: center;
                        width: 69%;
                        min-width:994px;
                        .logo {
                            height: 40px;
                            width: 123px;
                            flex: 0 0 123px;
                            cursor: pointer;
                        }
                        .header_center_container {
                            .flexRow;
                            flex: 1;
                            margin-left: 90px;
                            justify-content: space-between;

                            .tab_container {
                                height: 100%;
                                .flexRow;
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
                            .login_account_container{
                                .flexRow;
                                align-items: center;
                                .login_account{
                                    color: #ffffff;
                                    padding:2px 20px 2px 20px;
                                }
                                .exit{
                                    color: rgba(255, 255, 255, 0.5);
                                    border-left:1px solid rgba(255, 255, 255, 0.5);
                                    padding:0 20px 0 20px;
                                    cursor:pointer;
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
                    .flexColumn;
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
                    .login_container{
                        background: #21BC5D;
                        border:none;
                    }

                }

                .fade-enter-active, .fade-leave-active {
                    transition: opacity .28s;
                }
                .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
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
            }
        }
    }

</style>
