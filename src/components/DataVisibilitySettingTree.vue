<template>
    <el-tree
            :data="treeData"
            ref="tree"
            default-expand-all
            node-key="$id">
        <div class="data_visibility_setting_tree_container flexRow"
             slot-scope="{ node, data }">
            <span class="data_visibility_setting_tree_label">{{ node.label }}</span>
            <Options :id="data.$id" v-show="node.isLeaf"
                     :defaultValue="defaultValue(data.$id)"
                     @handleSelect="(id, value)=>$emit('handleSelect',id, value)"/>
        </div>
    </el-tree>
</template>

<script lang="ts">
      import {Component, Prop, Vue} from 'vue-property-decorator';
      import Options from "./Options.vue";

      @Component({
            components:{
                  Options,
            }
      })
      export default class DataVisibilitySettingTree extends Vue {
            @Prop() private treeData: any;
            @Prop() private defaultChoosed?: any;

            private defaultValue(id: string): number | void{
                  if(this.defaultChoosed){
                        if(this.defaultChoosed.authorizationProperties.includes(id)){
                              return 2;
                        }else if(this.defaultChoosed.secretProperties.includes(id)){
                              return 3;
                        }
                  }
            }

      }
</script>

<style  lang="scss">
    @import '../style/mixin';
    .data_visibility_setting_tree_container{
        width:280px;
        align-items: center;
        .data_visibility_setting_tree_label{
            width:130px;
            color: #464646;
            font-size: 14px;
            flex:0 0 130px;
            margin-right:20px;
        }

    }

</style>