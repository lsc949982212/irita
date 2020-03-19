<template>
    <el-select v-model="value"
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
      import * as types from "../types";
      import * as constant from "../constant";

      @Component
      export default class Options extends Vue {
            @Prop() private id: string;
            @Prop() private defaultValue?: number;

            private value: number = this.defaultValue ? this.defaultValue : constant.DataVisibility.Public;

            private options: types.IOptions[] = [{
                  value: constant.DataVisibility.Public,
                  label: '公开信息'
            }, {
                  value: constant.DataVisibility.Authorization,
                  label: '授权查看',
            }, {
                  value: constant.DataVisibility.Secret,
                  label: '仅自己可见',
            }];

            private handleChange(value: any): void{
                  this.$emit('handleSelect', this.id.replace(/#/g, '$').replace(/\/properties\//g, '.').replace(/\/items/, '[*]'), value);
            }

      }
</script>

<style lang="scss">
    @import '../style/mixin';
    .el-tree-node{
        margin-bottom:5px;
    }


</style>