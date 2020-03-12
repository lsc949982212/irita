import {dictionary} from '../constant/dictionary';

/**
 * created by lvshenchao
 * get display format data
 */
export default class JsonDataHelper {
      public data: any;
      public addAuthDataList: any[] = [];
      public editAuthDataList: any[] = [];
      public authorizationProperties: any;
      public secretProperties: any;
      public schema: any;

      constructor(jsonData: any, schema?: any, authorizationProperties?: any, secretProperties?: any) {
            this.data = jsonData;
            this.addAuthDataList = [];
            this.editAuthDataList = [];
            this.authorizationProperties = authorizationProperties;
            this.secretProperties = secretProperties;
            this.schema = schema;
      }

      public setAddFormatAuthData(data: any = this.data, prop: string = '') {
            for (let key in data) {
                  if (key === 'authorizationProperties' || key === 'secretProperties' || key === 'dataInteract') continue;
                  if (data[key] instanceof Array) {
                        if (data[key].length > 0) {
                              let str = key;
                              if (prop) {
                                    str = `${prop}.${key}`
                              }
                              console.error(typeof data[key][0], typeof data[key][0] !== 'object')
                              if (typeof data[key][0] === 'object') {
                                    this.setAddFormatAuthData(data[key][0], `${str}[*]`)
                              } else {
                                    console.error(data[key], typeof data[key][0])
                                    let authData:any = {
                                          title: dictionary.get(key),
                                          data: [{
                                                value: '1',
                                                label: '公开信息'
                                          }, {
                                                value: '2',
                                                label: '授权查看',
                                          }, {
                                                value: '3',
                                                label: '仅自己可见',
                                          }],
                                          value: '1',
                                          str: `$.${str}`,
                                    };
                                    if (key === Object.keys(data)[0]) {
                                          const nodeLevelStrList = str.split('.');
                                          let type:any = nodeLevelStrList[nodeLevelStrList.findIndex((n: string) => n === Object.keys(data)[0] || `${n}[0]` === Object.keys(data)[0]) - 1]
                                          if (type.includes('[*]')) {
                                                type = type.split('[*]')[0]
                                          }
                                          authData.type = type;
                                    }
                                    this.addAuthDataList.push(authData)
                              }

                        }
                  } else if (typeof data[key] === 'object') {
                        let str: string = key;
                        if (prop) {
                              str = `${prop}.${key}`
                        }
                        this.setAddFormatAuthData(data[key], str)
                  } else {
                        let str: string = key;
                        if (prop) {
                              str = `${prop}.${key}`
                        }
                        let authData:any = {
                              title: dictionary.get(key),
                              data: [{
                                    value: '1',
                                    label: '公开信息'
                              }, {
                                    value: '2',
                                    label: '授权查看',
                              }, {
                                    value: '3',
                                    label: '仅自己可见',
                              }],
                              value: '1',
                              str: `$.${str}`,
                        };

                        if (key === Object.keys(data)[0]) {
                              const nodeLevelStrList = str.split('.');
                              let type:any = nodeLevelStrList[nodeLevelStrList.findIndex((n:string) => n === Object.keys(data)[0] || `${n}[0]` === Object.keys(data)[0]) - 1]
                              if (type.includes('[*]')) {
                                    type = type.split('[*]')[0]
                              }
                              authData.type = type;
                        }
                        this.addAuthDataList.push(authData)
                  }
            }
            return this;
      }

      public getAddAuthDataList():any[] {
            return this.addAuthDataList;
      }


      public setEditFormatAuthData():JsonDataHelper {
            console.log('json data', this.data);
            this.setAddFormatAuthData();
            console.log('auth list', this.getAddAuthDataList());
            let addAuthDataList: any[] = this.getAddAuthDataList();
            addAuthDataList.forEach((a: any) => {
                  if (this.authorizationProperties && this.authorizationProperties.length) {

                        if (this.authorizationProperties.includes(a.str)) {
                              a.value = '2';
                        }
                  }
                  if (this.secretProperties && this.secretProperties.length) {
                        if (this.secretProperties.includes(a.str)) {
                              a.value = '3';
                        }
                  }

            });
            this.editAuthDataList = addAuthDataList;
            return this;
      }

      public getEditAuthDataList():any[] {
            return this.editAuthDataList;
      }


}