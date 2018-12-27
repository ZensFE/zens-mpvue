import apis from '../api/api.config.js'
import md5 from 'js-md5'
import global, {CODE} from '../global/global.js'
import utils from '../utils/utils.js'

// 线上环境
let producationMode = {
  host: 'ct.zens.asia',
  port: '80',
  prefix: '/wxcx/',
  suffix: '',
  protocol: 'https'
}
// 测试环境
let testMode = {
  host: 'ct-demo.zens.asia',
  port: '80',
  prefix: '/wxcx/',
  suffix: '',
  protocol: 'https'
}
let testModeB = {
  host: 'test.zens.asia',
  port: '80',
  prefix: '/wxcx/',
  suffix: '',
  protocol: 'http'
}
// 预发布环境
let testModeC = {
  host: 'ct-preview.zens.asia',
  port: '80',
  prefix: '/wxcx/',
  suffix: '',
  protocol: 'https'
}
let modes = {
  test: testMode,
  testB: testModeB,
  testPre: testModeC,
  producation: producationMode
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
  return modes.producation
}
let getBaseUrl = function (name) {
  let mo = getMode(name)
  let port = mo.port === '80' ? '' : ':' + mo.port
  return mo.protocol + '://' + mo.host + port + mo.prefix
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
let hasError = function (res) {
  if (res.code === 0) {
    return true
  } else {
    return false
  }
}
let appid = 'wx7ad619f57bc5d947'
let os = 'test'
if (process.env.NODE_ENV === 'production') {
  setMode('producation')
  appid = 'wxa507cee6c03771b3'
  os = 'mp'
} else if (process.env.NODE_ENV === 'preview') {
  setMode('testPre')
} else {
  // setMode('testB')
  setMode('test')
}
let getAppid = function () {
  return appid
}
let baseUrl = getBaseUrl()
let request = function (config) {
  let api = getApi(config)
  config = Object.assign(config, api)
  if (typeof config.data !== 'object') {
    config.data = {}
  }
  let noNeedAuth = config.noNeedAuth || false
  let isLoginReq = config.isLoginReq || false
  let uri = baseUrl + api.uri.replace(/\{(.*?)\}/g, (res, key) => {
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
      'appid': appid,
      'os': os,
      'version': '1.0.0',
      'time': time,
      'sign': sign
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: uri,
        data: data,
        method: api.method ? api.method : 'POST',
        header: {
          'Content-Type': 'application/json',
          'X-Miniprogram-Auth': wx.getStorageSync('skey') || ''
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
          if (urlArray.indexOf(api.uri) > -1) {
            return
          }
          let pages = getCurrentPages()
          let pagesRoute = pages.length > 0 ? pages[pages.length - 1].route : ''
          if (res.statusCode !== 200 && pagesRoute.indexOf('loadFail') === -1) {
            // wx.navigateTo({
            //   url: '../loadFail/main'
            // })
            wx.showToast({
              title: '网络不给力~',
              icon: 'none'
            })
            // 上报错误信息
            wx.reportAnalytics('server_error', {
              url: uri,
              params: JSON.stringify(data),
              http_code: res.statusCode
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
            // 理论上不应该出现接口返回-1的情况，如果返回上报
            let page = getCurrentPages() || []
            let pagePath = page.length ? (page[page.length - 1].route) : 'unkown'
            wx.reportAnalytics('no_auth_1', {
              time: Date.now(),
              uuid: wx.getStorageSync('aldstat_uuid'),
              page: pagePath,
              uri: uri,
              reqData: JSON.stringify(config.data)
            })
          }
        }
      })
    })
  }
  // return req()
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
