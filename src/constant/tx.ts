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



export {
      DataVisibility,
      Relevant,
      AuthStatus,
      RelevantMap,
      AuthStatusMap,
}