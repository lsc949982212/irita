

export default class JsonSchemaHelper {
    constructor(){}
    /**
     * 去掉schema文件中的interact, authorization, secret字段
     * @param schema
     * @return schema
     */
    static getFormatSchemaFile(schema){
        const banField = ['dataInteract','authorizationProperties','secretProperties'];
        let tempSchema = JSON.parse(JSON.stringify(schema));
        if(tempSchema.properties){
            for(let key in tempSchema.properties){
                if(banField.includes(key)){
                    delete tempSchema.properties[key];
                }
            }
        }
        return tempSchema;
    }

    static getTitleByJSONPath(schema, path){
        if('properties' in schema){
            schema = schema.properties[path];
        }else if('items' in schema){
            console.error(path)
            schema = schema.items[path];
        }

    }

    static formatJsonSchemaToTreeData(schema){

        if('properties' in schema){
            schema.children = [];
            for(let key in schema.properties){
                if(key === 'dataInteract' || key === 'authorizationProperties' || key === 'secretProperties') continue;
                schema.properties[key].id = schema.properties[key]['$id'];
                schema.properties[key].label = schema.properties[key].title;
                schema.children.push(schema.properties[key]);
                if('properties' in schema.properties[key]){
                    JsonSchemaHelper.formatJsonSchemaToTreeData(schema.properties[key])
                }else if('items' in schema){

                    schema.properties = schema.items.properties;

                    //JsonSchemaHelper.formatJsonSchemaToTreeData(schema.items.properties[key])
                }

            }
        }else{
            schema.id = schema['$id'];
            schema.label = schema.title;

            //schema.children.push(schema.properties)
        }

    }

}