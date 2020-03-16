

export default class JsonSchemaHelper {
    constructor(){}
    /**
     * 去掉schema文件中的interact, authorization, secret字段
     * @param schema
     * @return schema
     */
    public static getFormatSchemaFile(schema: any): any{
        const banField:string[] = ['dataInteract','authorizationProperties','secretProperties'];
        let tempSchema:any = JSON.parse(JSON.stringify(schema));
        if(tempSchema.properties){
            for(let key in tempSchema.properties){
                if(banField.includes(key)){
                    delete tempSchema.properties[key];
                }
            }
        }
        return tempSchema;
    }

    public static getTitleByJSONPath(schema: any, path: any): void{
        if('properties' in schema){
            schema = schema.properties[path];
        }else if('items' in schema){
            console.error(path)
            schema = schema.items[path];
        }

    }

      static formatJsonSchemaToTreeData(schema: any): void{//algorithm need to be optimized
            if('properties' in schema){
                  schema.children = [];
                  for(let key in schema.properties){
                        if(key === 'dataInteract' || key === 'authorizationProperties' || key === 'secretProperties') continue;
                        //schema.properties[key].id = schema.properties[key]['$id'];
                        schema.properties[key].label = schema.properties[key].title;
                        //set disabled items
                        /*if(schema.properties[key]['$id'] && schema.properties[key]['$id'].includes('basicInfo')){
                            schema.properties[key].disabled = true;
                        }*/
                        schema.children.push(schema.properties[key]);
                        if('properties' in schema.properties[key]){

                              JsonSchemaHelper.formatJsonSchemaToTreeData(schema.properties[key])
                        }

                  }
            }else{
                  schema.id = schema['$id'];
                  schema.label = schema.title;
            }

      }

      static resetArrayToObject(schema: any){
            for(let key in schema){
                  if(key === 'dataInteract' || key === 'authorizationProperties' || key === 'secretProperties') continue;
                  if(Array.isArray(schema[key]) || typeof schema[key] !== 'object') continue;
                  if('items' in schema[key]){
                        schema[key].properties = schema[key].items.properties;
                  }else{
                        JsonSchemaHelper.resetArrayToObject(schema[key])
                  }
            }
      }


}