import apis from '../api/api.config.js'
import md5 from 'js-md5'
import global, {CODE, LOADING_TYPE} from '../global/global.js'
import utils from '../utils/utils.js'

const APP_ID = {
  TEST: '{{ testAppid }}',
  PRODUCT: '{{ appid }}'
}
const prefix = '{{ prefix }}'
// 线上环境
let productionMode = {
  host: '{{ productHost }}',
  port: '443',
  prefix: prefix,
  suffix: '',
  protocol: 'https'
}
// 测试环境
let testMode = {
  host: '{{ testHost }}',
  port: '443',
  prefix: prefix,
  suffix: '',
  protocol: 'https'
}

// 预发布环境
let testModeC = {
  host: '{{ preHost }}',
  port: '443',
  prefix: prefix,
  suffix: '',
  protocol: 'https'
}
let modes = {
  test: testMode,
  testPre: testModeC,
  production: productionMode
}
let mode = ''
let setMode = function (name) {
  mode = name
}
let getMode = function (name) {
  if (name in modes) {
    return modes[name]
  }
  if (mode in modes) {
    return modes[mode]
  }
  return modes.production
}
let getBaseUrl = function (name) {
  let mo = getMode(name)
  return `${mo.protocol}://${mo.host}:${mo.port}${mo.prefix}`.replace(/:443|:80/, '')
}
let getApi = function (requestObj) {
  let splits = requestObj.to.split('.')
  let uri = {}
  Object.assign(uri, apis)
  splits.forEach(function (value, index) {
    uri = uri[value] || uri
  })
  return {
    uri: uri.uri,
    method: uri.method
  }
}

/**
 * loading交互开始
 * @param type
 */
let startLoading = (type) => {
  if (type === LOADING_TYPE.TAB) {
    wx.showNavigationBarLoading()
  } else if (type === LOADING_TYPE.TOAST || type) {
    wx.showLoading({
      mask: true,
      title: '加载中'
    })
  }
}

/**
 * loading交互结束
 * @param type
 */
let endLoading = (type) => {
  if (type === LOADING_TYPE.TAB) {
    wx.hideNavigationBarLoading()
  } else if (type === LOADING_TYPE.TOAST || type) {
    wx.hideLoading()
  }
}
let hasError = function (res) {
  return res.code === 0
}
let appId = ''
let os = 'test'
if (process.env.NODE_ENV === 'production') {
  setMode('production')
  appId = APP_ID.PRODUCT
  os = 'mp'
} else if (process.env.NODE_ENV === 'preview') {
  appId = APP_ID.PRODUCT
  setMode('testPre')
} else {
  appId = APP_ID.TEST
  setMode('test')
}
let getAppid = function () {
  return appId
}
let request = function (config) {
  let api = getApi(config)
  config = Object.assign(config, api)
  if (typeof config.data !== 'object') {
    config.data = {}
  }
  let noNeedAuth = config.noNeedAuth || false
  let isLoginReq = config.isLoginReq || false
  let loadingType = config.loading || LOADING_TYPE.NONE
  let uri = getBaseUrl() + api.uri.replace(/\{(.*?)\}/g, (res, key) => {
    // 找到指定key后，删除对应值
    let value = config.data[key]
    delete config.data[key]
    return value
  })
  let time = new Date().getTime()
  let signStr = time + os
  let sign = md5(signStr)
  let urlArray = [
    'formlog',
    'shareinflow'
  ]
  function req () {
    let data = Object.assign(config.data, {
      'appid': appId,
      'os': os,
      'version': '1.0.0',
      'time': time,
      'sign': sign
    })
    return new Promise((resolve, reject) => {
      let skey = wx.getStorageSync('skey') || ''
      startLoading(loadingType)
      wx.request({
        url: uri,
        data: data,
        method: api.method ? api.method : 'POST',
        header: {
          'Content-Type': 'application/json',
          'X-Miniprogram-Auth': skey
        },
        success: res => {
          if (hasError(res.data)) {
            resolve(res.data.result, res.data.message)
          } else {
            reject(res.data)
          }
        },
        fail: res => {
          reject(res.data)
        },
        complete: res => {
          endLoading(loadingType)
          if (urlArray.indexOf(api.uri) > -1) {
            return
          }
          let pages = getCurrentPages()
          let pagesRoute = pages.length > 0 ? pages[pages.length - 1].route : ''
          if (res.statusCode !== 200 && pagesRoute.indexOf('loadFail') === -1) {
            wx.showToast({
              title: '网络不给力~',
              icon: 'none'
            })
          } else if (parseInt(res.data.code) === CODE.NO_USER_INFO && pagesRoute.indexOf('authorization') === -1 && !noNeedAuth) {
            if (global.st) {
              utils.replacePage('authorization')
            } else {
              utils.changePage('authorization')
            }
          } else if (parseInt(res.data.code) === CODE.NO_PHONE) {
            utils.replacePage('authorization')
          } else if (parseInt(res.data.code) === CODE.NO_BASE_INFO && pagesRoute.indexOf('authorization') === -1) {
            utils.changePage('authorization')
          }
        }
      })
    })
  }
  if (isLoginReq) {
    // 如果当前是login_mp接口的话 不需要等待wxLoginPromise
    return req()
  } else {
    return global.wxLoginPromise.then(req)
  }
}
export default {
  request,
  getAppid
}
