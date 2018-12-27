import http from './http.js'

let getFormId = function (formData) {
  return http.request({
    to: 'wechat.getFormId',
    data: {
      'channl': 'zp_zql',
      'fname': formData.fname,
      'fid': formData.fid
    }
  })
}
let savePicture = function (pic) {
  wx.showLoading({
    title: '保存图片中...'
  })
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: pic,
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            wx.hideLoading()
            resolve()
          },
          fail: res => {
            wx.hideLoading()
            if ((res.errMsg && res.errMsg.indexOf('denied') !== -1) || (res.errMsg && res.errMsg.indexOf('deny') !== -1)) {
              reject(res.errMsg)
            } else {
              wx.showToast({
                title: '保存图片失败',
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '保存图片失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  })
}
let getQueryString = function (name, query) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = query.match(reg)
  if (r != null) {
    return unescape(r[2])
  } else {
    return null
  }
}
let getQueryParms = function (parms) {
  let str = ''
  for (var item in parms) {
    str += item + '=' + parms[item] + '&'
  }
  return str.substr(0, str.length - 1)
}
let parseQueryString = function (str) {
  str = decodeURIComponent(str)
  var iterms = str.split('&')
  var arr = []
  var Json = {}
  for (var i = 0; i < iterms.length; i++) {
    arr = iterms[i].split('=')
    Json[arr[0]] = arr[1]
  }
  return Json
}

let formatTime = function (date, format = 'YYYY-MM-DD hh:mm:ss') {
  const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '日', '一', '二', '三', '四', '五', '六']
  return format.replace(/YYYY|YY|MM|DD|hh|mm|ss|星期|周|www|week/g, function (a) {
    switch (a) {
      case 'YYYY': return date.getFullYear()
      case 'YY': return (date.getFullYear() + '').slice(2)
      case 'MM': return (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      case 'DD': return (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
      case 'hh': return (date.getHours() < 10) ? '0' + date.getHours() : date.getHours()
      case 'mm': return (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()
      case 'ss': return (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()
      case '星期': return '星期' + week[date.getDay() + 7]
      case '周': return '周' + week[date.getDay() + 7]
      case 'week': return week[date.getDay()]
      case 'www': return week[date.getDay()].slice(0, 3)
    }
  })
}

let chooseAddress = function () {
  wx.showLoading({
    title: '加载中...'
  })
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: res => {
        wx.hideLoading()
        resolve(res)
      },
      fail: err => {
        if ((err.errMsg && err.errMsg.indexOf('denied') !== -1) || (err.errMsg && err.errMsg.indexOf('deny') !== -1)) {
          wx.hideLoading()
          reject(err.errMsg)
        } else {
          wx.showToast({
            title: '获取地址失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  })
}
let getSystemInfo = function () {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: res => {
        if (res.model.indexOf('iPhone X') !== -1) {
          resolve()
        } else {
          reject(res.model)
        }
      }
    })
  })
}
let wxLogin = function () {
  return new Promise((resolve, reject) => {
    let sKey = wx.getStorageSync('skey')
    if (sKey) {
      resolve(sKey)
    } else {
      wx.login({
        success (res) {
          if (res.code) {
            http.request({
              to: 'wechat.wxLogin',
              isLoginReq: true,
              data: {
                code: res.code
              }
            }).then(data => {
              wx.hideLoading()
              console.log(data)
              wx.setStorageSync('userId', data.userData.id)
              wx.setStorageSync('skey', data.skey)
              var userInfo = data.userData
              wx.setStorage({key: 'userInfo', data: userInfo})
              resolve(data)
            }).catch(err => {
              reject(err)
            })
          }
        }
      })
    }
  })
}
let copyText = function (text) {
  wx.setClipboardData({
    data: text,
    success: function (res) {
      wx.getClipboardData({
        success: function (res) {
          wx.showToast({
            title: '复制成功',
            icon: 'none',
            duration: 800
          })
        }
      })
    }
  })
}

/**
 * 判断指定参数是否为Object
 * @param obj
 * @returns {boolean}
 */
let isEmptyObject = (obj) => Object.keys(obj).length === 0

/**
 * 解析url参数
 * @param str
 */
let parseUrlParams = (str) => {
  let ret = {}
  let seg = str.replace(/^\?/, '').split('&')
  let len = seg.length
  let s = void 0
  for (let i = 0; i < len; i++) {
    if (!seg[i]) {
      continue
    }
    s = seg[i].split('=')
    ret[s[0]] = s[1]
  }
  return ret
}
/**
 * 跳转到指定页面
 * 功能：兼容不同格式的url；自动识别是应该使用switchTab还是redirectTo
 * @param target ： 跳转目标
 * @param params [Object, String]: 参数
 * @param type
 */
let changePage = function (target, params, type = 'navigate', callback) {
  const { tabList } = config
  /**
   * target兼容处理
   */
  // targetParams： target后自带的参数，如：/pages/coupons/main?type=self → ?type=self
  const targetParams = (/\?/.test(target) && target.slice(target.indexOf('?'))) || ''
  // targetUrl： 去除参数的url，如：/pages/coupons/main?type=self → /pages/coupons/main
  let targetUrl = (/\?/.test(target) && target.slice(0, target.indexOf('?'))) || target
  const targetStripped = targetUrl.replace(/\/main$/, '')
  // wholePath： 不包含页面参数的全路径，如： /pages/coupons/main
  const wholePath = `/pages/${targetStripped.slice(targetStripped.lastIndexOf('/') + 1)}/main`
  // url： 最终调用微信api的跳转全路径
  let url = ''
  // isTabPage： 是否为底部"标签页"
  const isTabPage = !!tabList.find(i => i === wholePath)
  //
  let paramsObj = {}
  /**
   * 参数兼容
   */
  // 参数为字符串的情况
  if (params && Array.isArray(params)) {
    paramsObj = Object.assign(paramsObj, parseUrlParams(targetParams), parseUrlParams(params))
  } else if (params && !isEmptyObject(params)) {
    paramsObj = Object.assign(paramsObj, parseUrlParams(targetParams), params)
  } else {
    paramsObj = Object.assign(paramsObj, parseUrlParams(targetParams))
  }
  // 转换Url Object → Url String
  let paramsList = []
  for (let key in paramsObj) {
    if (paramsObj.hasOwnProperty(key)) {
      paramsList.push(`${key}=${encodeURIComponent(paramsObj[key])}`)
    }
  }
  if (paramsList.length) {
    url = `/pages/${targetStripped.slice(targetStripped.lastIndexOf('/') + 1)}/main?${paramsList.join('&')}`
  } else {
    url = wholePath
  }
  /**
   * 跳转方法兼容
   *  如果是tab页，调用switchTab()方法，否则正常redirect
   */
  if (isTabPage) {
    wx.switchTab({
      url,
      success () {
        callback && callback()
      }
    })
  } else if (type === 'redirect') {
    wx.redirectTo({
      url,
      success () {
        callback && callback()
      }
    })
  } else if (type === 'reLaunch') {
    wx.reLaunch({
      url,
      success () {
        callback && callback()
      }
    })
  } else {
    wx.navigateTo({
      url,
      success () {
        callback && callback()
      }
    })
  }
}

/**
 * 替换当前页面 即wx.redirectTo
 * 功能：兼容不同格式的url；自动识别是应该使用switchTab还是redirectTo
 * @param target ： 跳转目标
 * @param params [Object, String]: 参数
 * @param callback :回调函数
 */
let replacePage = function (target, params, callback) {
  changePage(target, params, 'redirect', callback)
}

// 闪存存储
let snapSet = (content) => {
  const key = Date.now() + Math.random().toString(36).replace('0.', '')
  let contentStr = ''
  if (typeof content === 'string') {
    contentStr = content
  } else if (typeof content === 'object') {
    contentStr = JSON.stringify(content)
  }
  wx.setStorageSync(key, contentStr)
  return key
}

// 阅后即焚
let snapGet = (key) => {
  let content = wx.getStorageSync(key)
  if (content) {
    // 如果在缓存找到，就删除
    wx.removeStorage({key})
    return JSON.parse(content)
  } else {
    return false
  }
}


export default {
  getFormId,
  savePicture,
  getQueryString,
  parseQueryString,
  formatTime,
  chooseAddress,
  getSystemInfo,
  getQueryParms,
  wxLogin,
  copyText,
  changePage,
  replacePage,
  snapSet,
  snapGet
}
