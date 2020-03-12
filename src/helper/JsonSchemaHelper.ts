

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

}