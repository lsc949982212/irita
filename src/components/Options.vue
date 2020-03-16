<template>
    <el-select v-model="defaultValue"
               @change="handleChange"
               class="options_container"
               placeholder="请选择" size="small">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :disabled="item.disabled"
                :value="item.value">
        </el-option>
    </el-select>
</template>

<script lang="ts">
      import {Component, Prop, Vue} from 'vue-property-decorator';
      import {IOptions} from "../types";
      import constant from '../constant/constant';

      @Component
      export default class Options extends Vue {
            @Prop() private id: string;
            @Prop() private defaultChecked?: any;

            private options: IOptions[] = [{
                  value: constant.DATA_VISIBILITY.PUBLIC,
                  label: '公开信息'
            }, {
                  value: constant.DATA_VISIBILITY.AUTHORIZATION,
                  label: '授权查看',
            }, {
                  value: constant.DATA_VISIBILITY.SECRET,
                  label: '仅自己可见',
            }];
            private defaultValue: number = 1;


            private handleChange(value: any): void{
                  this.$emit('handleSelect', this.id, value);
            }

      }
</script>

<style lang="scss">
    @import '../style/mixin';
    .el-tree-node{
        margin-bottom:5px;
    }


</style>