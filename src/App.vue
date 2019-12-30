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
                              @click="handleTabClick(1)"
                              :class="activeTab === 1 ? 'active' : ''">
                            资产列表
                        </span>
                    </div>

                    <div class="login_container"
                         @click="handleLoginClick">
                        登录
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
                               @click="login">登录</el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import LoginHelper from './helper/LoginHelper';

    export default {
        name : "app",
        data(){
            let activeTab;
            if(this.$route.path === '/asset_list'){
                activeTab = 1;
            }else{
                activeTab = 0;
            }
            return {
                activeTab:activeTab,
                centerDialogVisible:false,
                username:'',
                psd:'',
            }
        },
        watch:{
            $route(to){
                if(to.path === '/login'){
                    this.activeTab = 0
                }else{
                    this.activeTab = 1
                }
            }
        },
        components:{

        },
        mounted(){
            this.$nextTick(()=>{
                const offsetLeft2 = document.getElementById('header_center_container');
                this.$store.commit('SET_OFFSET_LEFT',offsetLeft2.offsetLeft)
            })
        },
        methods:{
            handleTabClick(tab){
                //this.activeTab = tab;
                if(tab === 0){
                    this.$router.replace('/login')
                }else{
                    this.$router.replace('/asset_list')
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
                }else if(!this.psd){
                    this.$message.error('请输入密码');
                    return;
                }
                const isSuccess = LoginHelper.login({
                    username:this.username,
                    psd:this.psd,
                    ctx:this
                });

                if(isSuccess){
                    Message({
                        message: '登录成功',
                        type: 'success'
                    });
                    this.centerDialogVisible = false;
                    this.$router.replace('/asset_list')
                }else{
                    this.$message.error('账号或者密码错误');
                }


            },

        }
    }
</script>

<style lang="less">
   // @import "./style/reset";
    @import "./style/mixin";

    html{
        width:100%;
        height:100%;
        margin:0;
        padding:0;
        body{
            width:100%;
            height:100%;
            margin:0;
            padding:0;
            div,p{
                margin:0;
                padding:0;
                border:none;
            }
            #app {
                width:100%;
                height:100%;
                .flexColumn;
                font-size:16px;
                .header_container{
                    width:100%;
                    height:80px;
                    background:linear-gradient(139deg,rgba(52,73,110,1) 0%,rgba(29,46,77,1) 100%);
                    position:relative;
                    .flexRow;
                    justify-content: center;
                    box-sizing: border-box;
                    .header_wrap{
                        .flexRow;
                        height:100%;
                        align-items: center;
                        width:63%;
                        .logo{
                            height:40px;
                            width:123px;
                            flex:0 0 123px;
                            cursor: pointer;
                        }
                        .header_center_container{
                            .flexRow;
                            flex:1;
                            margin-left:90px;
                            justify-content: space-between;

                            .tab_container{
                                height:100%;
                                .flexRow;
                                .tab{
                                    height:80px;
                                    line-height: 80px;
                                    color:#ffffff;
                                    cursor: pointer;
                                    font-size:16px;
                                    font-weight:600;
                                    color:rgba(255,255,255,0.5);
                                    border-bottom:3px solid transparent;
                                    &:first-child{
                                        margin-right:40px;
                                    }
                                    box-sizing: border-box;
                                }
                                .active{
                                    color:rgba(255,255,255,1);
                                    border-bottom:3px solid #ffffff;
                                }
                            }
                            .login_container{
                                color:rgba(255,255,255,0.5);
                                line-height: 80px;
                                cursor: pointer;
                            }
                        }

                    }

                }
                .body_container{
                    width:100%;
                    flex:1;
                    box-sizing:border-box;
                }
                .login_dialog_container{
                    .flexColumn;
                    .login_dialog_title{
                        color:#111B39;
                        margin-bottom:20px;
                    }
                    .login_input_username{
                        margin-bottom:20px;
                        &:last-child{
                            margin-bottom:50px;
                        }
                    }
                    .login_input_psd{
                        margin-bottom:50px;
                    }

                }

                .fade-enter-active, .fade-leave-active {
                    transition: opacity .28s;
                }
                .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
                    opacity: 0;
                }




                //reset element ui
                .el-dialog__footer{
                    padding:0 30px 40px 30px;
                }
                .el-dialog__body{
                    padding:0 30px 40px 30px !important;
                }
                .el-button{
                    font-weight:400;
                }
                .el-table th, .el-table tr{
                    background-color: #F8F8F8;
                }
                tr{
                    border:none;
                }
                .el-table--enable-row-transition .el-table__body td{
                    border:none;
                }
            }
        }
    }

</style>
