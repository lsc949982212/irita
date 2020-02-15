import { dictionary } from '../constant/dictionary';

/**
 * created by lvshenchao
 * get display format data
 */
export default class JsonSchemaHelper {
    constructor(jsonData,authorizationProperties,secretProperties){
        this.data = jsonData;
        this.addAuthDataList = [];
        this.editAuthDataList = [];
        this.authorizationProperties = authorizationProperties;
        this.secretProperties = secretProperties;
        //this.setAddFormatAuthData();
    }

    setAddFormatAuthData(data = this.data, prop = ''){
        for(let key in data){
            if(key === 'authorizationProperties' || key === 'secretProperties') continue;
            if(data[key] instanceof Array){
                if(data[key].length > 0){
                    let str = key;
                    if(prop){
                        str = `${prop}.${key}`
                    }
                    this.setAddFormatAuthData(data[key][0], `${str}[*]`)
                }
            } else if(typeof data[key] === 'object'){
                let str = key;
                if(prop){
                    str = `${prop}.${key}`
                }
                this.setAddFormatAuthData(data[key], str)
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
                    str:`$.${str}`,
                };
                if(key === Object.keys(data)[0]){
                    const nodeLevelStrList = str.split('.');
                    let type = nodeLevelStrList[nodeLevelStrList.findIndex((n)=>n === Object.keys(data)[0] || `${n}[0]` === Object.keys(data)[0]) - 1]
                    if(type.includes('[*]')){
                        type = type.split('[*]')[0]
                    }
                    authData.type = type;
                }
                this.addAuthDataList.push(authData)
            }
        }
        return this;
    }

    getAddAuthDataList(){
        return this.addAuthDataList;
    }

    setEditFormatAuthData(){
        console.log('json data',this.data);
        this.setAddFormatAuthData();
        console.log('auth list',this.getAddAuthDataList());
        let addAuthDataList = this.getAddAuthDataList();
        addAuthDataList.forEach((a)=>{
            if(this.authorizationProperties && this.authorizationProperties.length){

                if(this.authorizationProperties.includes(a.str)){
                    a.value = '2';
                }
            }
            if(this.secretProperties && this.secretProperties.length){
                if(this.secretProperties.includes(a.str)){
                    a.value = '3';
                }
            }

        });
        this.editAuthDataList = addAuthDataList;
        return this;
    }

    getEditAuthDataList(){
        return this.editAuthDataList;
    }



}