<template>
    <div class="login_container">
        <div class="login_wrap" :style="`margin-left:${$store.state.offsetLeft}px`">
            <div class="login_wrap_left">
                <span class="login_left_chain">IRITA</span>
                <span class="login_left_content">具有数据隐私保护的数字资产管理平台</span>
                <el-button type="primary" class="btn" @click="login">登录</el-button>
            </div>
            <img class="login_wrap_right" src="../assets/protect.png"/>


        </div>
    </div>
</template>

<script>


    export default {
        name : 'Login',
        data(){
            return {}
        },
        components : {},
        mounted(){

        },
        methods : {
            login(){
                this.$emit("handleLoginClick");
            }
        }
    }
</script>

<style lang="less" scoped>
    // @import "./style/reset";
    @import "../style/mixin";

    .login_container {
        width: 100%;
        height: 100%;
        //background:linear-gradient(139deg,rgba(52,73,110,1) 0%,rgba(29,46,77,1) 100%), url('../assets/bg.png') no-repeat 60%;
        background-color: rgba(52, 73, 110, 1);
        background-image: url('../assets/bg.png');
        background-size: 1800px 1050px;
        background-repeat: no-repeat;;
        background-origin: border-box;
        background-position: center 30%;
        padding-top: 125px;
        .login_wrap {
            .flexRow;
            align-items: center;
            .login_wrap_left {
                .flexColumn;
                width: 270px;
                margin-right: 176px;
                .login_left_chain {
                    font-weight: 900;
                    font-size: 80px;
                    color: #ffffff;
                    margin-bottom: 30px;
                }
                .login_left_content {
                    font-weight: 400;
                    font-size: 30px;
                    color: #ffffff;
                    margin-bottom: 63px;
                    width: 100%;
                    overflow-wrap: break-word;
                }
                .btn {
                    width: 160px;
                }

            }
            .login_wrap_right {
                width: 357px;
                height: 433px;
            }

        }
    }

</style>