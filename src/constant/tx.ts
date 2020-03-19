enum DataVisibility {
      Public = 1,
      Authorization = 2,
      Secret = 3,
}

enum Relevant {
      All = 1,
      MyPost = 2,
      MyReceive = 3
}

enum AuthStatus {
      All = -1,
      Applying = 0,
      Authorized = 1,
      Refused = 2,
      Invalid = 3,
      Expired = 4,
}

enum AssetsBelong {
      All = 0,
      Mine = 1,
      Others = 2,
}

enum CheckStatusOptions {
      All = -1,
      Checked = 1,
      NotCheck = 0,
      CheckFailed = 2
}

enum AssetsStatusOptions {
      All = -1,
      Normal = 0,
      Applying = 1,
      Accept = 2,
}

enum CheckStatus {
      NotCall = 0,
      Calling = 1,
      Responsed = 2,
      Expired = 2,
}

enum CheckResult {
      NotCheck = 0,
      Checked = 1,
      CheckFailed = 2,
}

enum AuthorizationStatus {
      Applying = 0,
      Auth = 1,
      Refused = 2,
      Invalid = 3,
      Expired = 4,
}

enum AssetsListStatus {
      Applying = 0,
      Accept = 1,
      Transfered = 2,
      Refused = 3,
      Invalid = 4,
      RefusedTransfer = 5,
}

enum AssetsStatus {
      Normal = 0,
      Applying = 1,
      Accept = 2,
}


const RelevantMap = new Map<Relevant, string>([
      [Relevant.All, '和我有关的全部记录'],
      [Relevant.MyPost, '我发起申请的'],
      [Relevant.MyReceive, '向我申请的'],
]);

const AuthStatusMap = new Map<AuthStatus, string>([
      [AuthStatus.All, '全部状态'],
      [AuthStatus.Applying, '申请中'],
      [AuthStatus.Authorized, '已授权'],
      [AuthStatus.Refused, '已拒绝'],
      [AuthStatus.Invalid, '已失效'],
      [AuthStatus.Expired, '已过期'],
]);

const AssetsBelongMap = new Map<AssetsBelong, string>([
      [AssetsBelong.All, '全部用户资产'],
      [AssetsBelong.Mine, '我的资产'],
      [AssetsBelong.Others, '向我申请的'],
]);

const CheckStatusOptionsMap = new Map<CheckStatusOptions, string>([
      [CheckStatusOptions.All, '全部查验状态'],
      [CheckStatusOptions.Checked, '已通过'],
      [CheckStatusOptions.NotCheck, '未查验'],
      [CheckStatusOptions.CheckFailed, '未通过'],
]);

const AssetsStatusOptionsMap = new Map<AssetsStatusOptions, string>([
      [AssetsStatusOptions.All, '全部资产状态'],
      [AssetsStatusOptions.Normal, '正常'],
      [AssetsStatusOptions.Applying, '转让申请中'],
      [AssetsStatusOptions.Accept, '已接受待转让'],
]);

const CheckStatusMap = new Map<CheckStatus, string>([
      [CheckStatus.NotCall, '未查验'],
      [CheckStatus.Calling, '查验中'],
      [CheckStatus.Responsed, '已查验'],
      [CheckStatus.Expired, '已失效'],
]);

const CheckResultMap = new Map<CheckResult, string>([
      [CheckResult.NotCheck, '未查验'],
      [CheckResult.Checked, '已通过'],
      [CheckResult.CheckFailed, '未通过'],
]);

const AuthorizationStatusMap = new Map<AuthorizationStatus, string>([
      [AuthorizationStatus.Applying, '申请中'],
      [AuthorizationStatus.Auth, '已授权'],
      [AuthorizationStatus.Refused, '已拒绝'],
      [AuthorizationStatus.Invalid, '已失效'],
      [AuthorizationStatus.Expired, '已过期'],
]);

const AssetsListStatusMap = new Map<AssetsListStatus, string>([
      [AssetsListStatus.Applying, '转让申请中'],
      [AssetsListStatus.Accept, '已接受待转让'],
      [AssetsListStatus.Transfered, '已转让'],
      [AssetsListStatus.Refused, '已拒绝'],
      [AssetsListStatus.Invalid, '已失效'],
      [AssetsListStatus.RefusedTransfer, '转让方拒绝'],
]);

const AssetsStatusMap = new Map<AssetsStatus, string>([
      [AssetsStatus.Normal, '正常'],
      [AssetsStatus.Applying, '转让申请中'],
      [AssetsStatus.Accept, '已接受待转让'],

]);




export {
      DataVisibility,
      Relevant,
      AuthStatus,
      AssetsBelong,
      CheckStatusOptions,
      AssetsStatusOptions,
      CheckStatus,
      AuthorizationStatus,
      AssetsListStatus,
      AssetsStatus,


      RelevantMap,
      AuthStatusMap,
      AssetsBelongMap,
      CheckStatusOptionsMap,
      AssetsStatusOptionsMap,
      CheckStatusMap,
      CheckResultMap,
      AuthorizationStatusMap,
      AssetsListStatusMap,
      AssetsStatusMap,
}