import cfg from '../config/config';

export const conversionHelper = {
    booleanToDisplayField(data){
        if(!data instanceof Array && typeof data === 'object'){
            for(let key in data){
                if(!data[key] instanceof Array && typeof data[key] === 'object'){
                    this.booleanToDisplayField(data[key])
                }else if(data[key] instanceof Array){
                    data[key].forEach((d)=>this.booleanToDisplayField(d))
                }else if(typeof data[key] === "boolean"){
                    if(data[key] === true){
                        data[key] = '是';
                    }else{
                        data[key] = '否';
                    }
                }
            }
        }else if(data instanceof Array){
            data.forEach((d)=>this.booleanToDisplayField(d))
        }else if(typeof data === "boolean"){
            if(data === true){
                data = '是';
            }else{
                data = '否';
            }
        }


    }


};