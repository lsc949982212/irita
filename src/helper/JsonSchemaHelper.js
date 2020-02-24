

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

    static formatJsonSchemaToTreeData(schema){//algorithm need to be optimized
        if('properties' in schema){
            schema.children = [];
            for(let key in schema.properties){
                if(key === 'dataInteract' || key === 'authorizationProperties' || key === 'secretProperties') continue;
                schema.properties[key].id = schema.properties[key]['$id'];
                schema.properties[key].label = schema.properties[key].title;
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

    static resetArrayToObject(schema){
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