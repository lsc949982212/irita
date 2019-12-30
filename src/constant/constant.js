export const constant = {
    ERROR:{
        ERROR_LOGIN:{
            code:0,//人为的修改sessionStorage中的token
            description:'登录状态出现问题,请重新登录',
        },
        NOT_LOGIN:{
            code:1,//未登录
            description:'请登录'
        },
        EXPIRED:{
            code:2,
            description:'登录已过期,请重新登录',
        }
    },
    SUCCESS:{
        code:10001
    }

};