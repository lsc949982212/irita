<template>
    <div class="select_container">
        <div class="select_choose_container"
             @click.stop="handleSelectClick">
            <span class="select_choose_title">
                {{ label }}
            </span>
            <img src="../assets/arrow.png" class="arrow">
        </div>
        <transition name="fade">
            <div class="select_item_container" v-show="optionsShow">
                <span class="select_item"
                      @click.stop="handleOpsClick(auth)"
                      v-for="auth in info">
                    {{ auth.label }}
                </span>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name : "Select",
        beforeMount(){

        },
        mounted(){
            document.body.addEventListener('click',()=>{
                this.optionsShow = false;
            })
        },
        props:{
            options:{
                required:true,
                type:Array,
            },
            index:{
                required:true,
                type:Number,
            },
            value:{
                required:false,
                type:String,
            },

        },
        data(){
            let label;
            if(this.value){
                label = this.options.find(o=>o.value === this.value) ? this.options.find(o=>o.value === this.value).label :this.options[0].label
            }else{
                this.label = this.options[0].label;
            }
            return {
                info:this.options,
                optionsShow:false,
                label
            }
        },
        methods:{
            handleSelectClick(){
                this.optionsShow = !this.optionsShow;
                this.$emit('closeOtherOps',this.index)
            },
            handleOpsClick(auth){
                this.label = auth.label;
                this.$emit('changeAuth',{
                    index:this.index,
                    auth:auth.value
                });
                this.optionsShow = false;
            },
            setSelectOpsShow(show){
                this.optionsShow = show;
            },
            getSelectOpsShow(){
                return this.optionsShow;
            }
        }
    }
</script>

<style scoped lang="less">
    @import '../style/mixin';
    .select_container{
        width:130px;
        height:26px;
        box-sizing: border-box;
        border-radius:4px;
        border:1px solid rgba(237,237,237,1);
        cursor:pointer;
        position:relative;
        &:hover{
            border-color:@themeColor;
            transition: all 1s linear;
        }
        .select_choose_container{
            .flexRow;
            align-items: center;
            height:100%;
            width:100%;
            background:rgba(241,241,241,1);
            padding-left:10px;
            border-radius:4px;
            box-sizing: border-box;
            justify-content: space-between;
            .select_choose_title{
                font-size:14px;
                color:@mainFontColor;
            }
            .arrow{
                width:6px;
                height:11px;
                margin-right:10px;
            }
        }
        .select_item_container{
            position:absolute;
            width:100%;
            top:27px;
            left:0;
            .flexColumn;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 2px 0px rgba(17,27,57,0.1);
            border-radius:4px;
            z-index:10;
            .select_item{
                height:26px;
                line-height:26px;
                padding-left:10px;
                font-size:14px;
                color:@mainFontColor;
                background: #ffffff;
                &:hover{
                    background: rgba(33,188,93,.05);
                }
            }

        }

    }

</style>