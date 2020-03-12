

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

}