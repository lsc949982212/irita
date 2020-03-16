const constant: any = {
      ERROR: {
            ERROR_LOGIN: {
                  code: 0,//人为的修改sessionStorage中的token
                  description: '登录状态出现问题,请重新登录',
            },
            NOT_LOGIN: {
                  code: 1,//未登录
                  description: '请登录',
            },
            EXPIRED: {
                  code: 2,
                  description: '登录已过期,请重新登录',
            },
      },
      SUCCESS: {
            code: 10001,
      },
      TIME_OUT: 10000,
      AUTHORIZATION_PROPERTIES: 'authorizationProperties',
      SECRET_PROPERTIES: 'secretProperties',
      ASSET_STATUS: {
            NORMAL: 0,
            APPLyING: 1,
            ACCEPT: 2,
      },
      ASSET_LIST_STATUS: {
            APPLYING: 0,
            ACCEPT: 1,
            TRANSFERED: 2,
            REFUSED: 3,
            INVALID: 4,
            REFUSED_TRANS: 5,
      },
      AUTHORIZATION_STATUS: {
            APPLYING: 0,
            AUTH: 1,
            REFUSED: 2,
            INVALID: 3,
            EXPIRED: 4,
      },
      CHECK_RESULT: {
            NOT_CHECK: 0,
            CHECKED: 1,
            CHECK_FAILED: 2,
      },
      CHECK_STATUS: {
            NOT_CALL: 0,
            CALLING: 1,
            RESPONSED: 2,
            EXPIRED: 2,
      },
      ASSET_STATUS_OPTIONS: {
            ALL: -1,
            NORMAL: 0,
            APPLYING: 1,
            ACCEPT: 2,
      },
      CHECK_STATUS_OPTIONS: {
            ALL: -1,
            CHECKED: 1,
            NOT_CHECK: 0,
            CHECK_FAILED:2
      },
      ASSETS_BELONG: {
            ALL: 0,
            MINE: 1,
            OTHERS: 2,
      },
      AUTH_STATUS: {
            ALL: -1,
            APPLYING: 0,
            AUTHORIZED: 1,
            REFUSED: 2,
            INVALID: 3,
            EXPIRED: 4,
      },
      RELEVANT: {
            ALL: 1,
            MY_POST: 2,
            MY_RECEIVE: 3,
      },
      DYNAMIC: {
            ASSETS: ['nft_mint', 'nft_edit', 'nft_transfer', 'nft_burn'],
            SERVICE: ['service_define', 'service_bind', 'service_request', 'service_response'],
      },
      SERVICE:{
            CHECK:1,
      },
      DATA_VISIBILITY:{
            PUBLIC:1,
            AUTHORIZATION:2,
            SECRET:3,
      }


};
export default constant;
