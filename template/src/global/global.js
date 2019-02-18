// 错误码定义
export const CODE = Object.freeze({
  // 无基础信息 如 openid
  NO_BASE_INFO: -1,
  // 无用户详细信息 如 头像 昵称等
  NO_USER_INFO: -10000,
  // 未授权手机号
  NO_PHONE: -3,
  // 收集号未注册
  PHONE_NOT_REGISTERED: -10001,
  // 已被预约
  RESERVED: 20006
})

export const LOADING_TYPE = Object.freeze({
  NONE: 0,
  TAB: 1,
  TOAST: 2
})

export default {
  skey: null,
  scene: null,
  sence: null,
  st: null,
  cid: null,
  wxLoginPromise: null
}
