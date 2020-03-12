<template>
    <div class="select_container">
        <div class="select_choose_container flexRow"
             @click.stop="handleSelectClick">
            <span class="select_choose_title">
                {{ label }}
            </span>
            <img src="../assets/arrow.png" class="arrow">
        </div>
        <transition name="fade">
            <div class="select_item_container flexColumn" v-show="optionsShow">
                <span class="select_item"
                      @click.stop="handleOpsClick(auth)"
                      v-for="auth in info">
                    {{ auth.label }}
                </span>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {IOptions} from "../types";

    @Component
    export default class Select extends Vue{
          @Prop() private options: IOptions[];
          @Prop() private index: number;
          @Prop() private value?: string;

          private info: IOptions[];
          private optionsShow: boolean = false;
          private label: string;

          private mounted():void{
                document.body.addEventListener('click',()=>{
                      this.optionsShow = false;
                })
          }
          
          private beforeMount():void{
                console.log(this.value)
                if(this.value){
                      const op: IOptions | undefined = this.options.find((o:any)=>o.value === this.value);
                      this.label = op ? op.label :this.options[0].label
                }else{
                      this.label = this.options[0].label;
                }
                this.info = this.options;
          }

          private handleSelectClick(): void{
                this.optionsShow = !this.optionsShow;
                this.$emit('closeOtherOps',this.index)
          }
          
          private handleOpsClick(auth: IOptions): void{
                this.label = auth.label;
                this.$emit('changeAuth',{
                      index:this.index,
                      auth:auth.value
                });
                this.optionsShow = false;
          }
          
          private setSelectOpsShow(show: boolean): void{
                this.optionsShow = show;
          }
          
          private getSelectOpsShow(): boolean{
                return this.optionsShow;
          }
    }
</script>

<style scoped lang="scss">
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
            border-color:$themeColor;
            transition: all 1s linear;
        }
        .select_choose_container{
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
                color:$mainFontColor;
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
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 2px 0px rgba(17,27,57,0.1);
            border-radius:4px;
            z-index:10;
            .select_item{
                height:26px;
                line-height:26px;
                padding-left:10px;
                font-size:14px;
                color:$mainFontColor;
                background: #ffffff;
                &:hover{
                    background: rgba(33,188,93,.05);
                }
            }

        }

    }

</style>