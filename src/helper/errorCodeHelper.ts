const error = new Map<string, string>([
    ['40000','请求参数错误'],
    ['40001','未认证'],
    ['40002','参数转化异常'],
    ['40003','记录已存在'],
    ['40004','记录未找到'],
    ['40005','操作被拒绝'],
    ['50002','授权已过期'],
    ['50003','资产类型错误'],
    ['50004','查验类型不支持'],
]);

const DEFAULT_ERROR_MSG = '请求出错';

export default function getErrorMsgByErrorCode(code: string): string{
      if(!code) return DEFAULT_ERROR_MSG;
      if(error.has(code)){
            const ErrMsg: string | undefined = error.get(code);
            if(ErrMsg){
                  return ErrMsg;
            }else{
                  return DEFAULT_ERROR_MSG;
            }
      }else{
            return DEFAULT_ERROR_MSG;
      }
}
