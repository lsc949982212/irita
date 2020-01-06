import { dictionary } from '../constant/dictionary';

/**
 * created by lvshenchao
 * get display format data
 */
export default class JsonSchemaHelper {
    constructor(jsonData){
        this.data = jsonData;
        this.authDataList = [];
        this.setFormatAuthData();
    }

    setFormatAuthData(data = this.data, prop = ''){
        for(let key in data){
            if(data[key] instanceof Array){
                if(data[key].length > 0){
                    let str = key;
                    if(prop){
                        str = `${prop}.${key}`
                    }
                    this.setFormatAuthData(data[key][0], str)
                }
            } else if(typeof data[key] === 'object'){
                let str = key;
                if(prop){
                    str = `${prop}.${key}`
                }
                this.setFormatAuthData(data[key], str)
            } else {
                let str = key;
                if(prop){
                    str = `${prop}.${key}`
                }
                let authData = {
                    title : dictionary.get(key),
                    data : [{
                        value : '1',
                        label : '公开信息'
                    }, {
                        value : '2',
                        label : '授权查看',
                    }, {
                        value : '3',
                        label : '仅自己可见',
                    }],
                    value : '1',
                    str,
                };
                if(key === Object.keys(data)[0]){
                    authData.type = Object.keys(data)[0];
                    const nodeLevelStrList = str.split('.');
                    authData.type = nodeLevelStrList[nodeLevelStrList.findIndex((n)=>n === Object.keys(data)[0]) - 1]
                }
                this.authDataList.push(authData)
            }
        }
    }

    getFormatAuthData(){
        return this.authDataList;
    }


}