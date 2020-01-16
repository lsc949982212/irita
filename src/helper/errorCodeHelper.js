
const error = new Map([
    ['40000','请求参数错误'],
    ['40001','未认证'],
    ['40002','参数转化异常'],
    ['40003','记录已存在'],
    ['40004','记录未找到'],
    ['40005','操作被拒绝'],
]);

const DEFAULT_ERROR_MSG = '请求出错';

export const getErrorMsgByErrorCode = function (code){
    if(!code) return DEFAULT_ERROR_MSG;
    if(error.has(code)){
        return error.get(code);
    }else{
        return DEFAULT_ERROR_MSG;
    }
};