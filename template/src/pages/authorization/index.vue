<template>
  <clays class="authorization">
      <div class="authwrap zens-container">
        <div class="img-container round padding20"
             style="width: 140rpx; height: 140rpx; margin-top: 85rpx;margin-bottom: 120rpx;">
          <!-- <img src="/static/img/logo.svg" alt=""> -->
          <img src="/static/img/logo.png" alt="">
        </div>
            <div class="auth-text">哲品茶听</div>
      </div>
      <div class="line-gray"></div>
      <div class="text1">请同意授权</div>
      <div class="text2">·以便哲品茶听为您提供更好的服务</div>
      <button formType="submit" class="bt" type="primary" open-type="getUserInfo"
                      @getuserinfo="bindGetUserInfo"> 确认授权</button>
  </clays>
</template>

<script>
import global from '../../global/global.js'
import http from '../../utils/http.js'
import utils from '../../utils/utils.js'

export default {
  data () {
    return {
      code: '',
      encrypted_data: '',
      iv: '',
      st: null,
      cid: null,
      page: null,
      userInfo: '',
      fname: 'login'
    }
  },
  methods: {
    bindGetUserInfo (e) {
      var that = this
      wx.checkSession({
        success: function () {
        },
        fail: function () {
          that.wxlogin()
        }
      })
      if (wx.canIUse('button.open-type.getUserInfo')) {
        if (e.mp.detail.rawData) {
          wx.showLoading({
            title: '加载中...'
          })
          this.encrypted_data = e.mp.detail.encryptedData
          this.iv = e.mp.detail.iv
          http.request({
            to: 'wechat.wxLogin',
            data: {
              code: this.code,
              encrypted_data: this.encrypted_data,
              iv: this.iv,
              st: this.st,
              cid: this.cid,
              page: this.page
            }
          }).then(
            data => {
              wx.hideLoading()
              wx.setStorageSync('skey', data.skey)
              wx.setStorageSync('userId', data.userData.id)
              var userInfo = data.userData
              wx.setStorage({
                key: 'userInfo',
                data: userInfo,
                success: function (res) {
                  if (global.st && global.cid) {
                    wx.redirectTo({
                      url: '../authorPhone/main'
                    })
                  } else if (that.$query.loginBack) {
                    utils.replacePage(that.$query.loginBack)
                  } else {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            },
            err => {
              wx.hideLoading()
              wx.showToast({
                title: err.msg,
                icon: 'none',
                duration: 2000
              })
              wx.hideToast()
            }
          )
        }
      } else {
        wx.showToast({
          title: '请升级微信版本',
          icon: 'loading'
        })
        wx.hideToast()
      }
    },
    wxlogin () {
      var self = this
      wx.login({
        success (res) {
          if (res.code) {
            self.code = res.code
          } else {
            console.log('登录失败！---' + res.errMsg)
          }
        }
      })
    }
  },
  onShow () {
    this.wxlogin()
  }
}
</script>

<style scoped lang="scss">
.authorization {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .authwrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 102rpx;
    .auth-icon {
      width: 158rpx;
      height: 158rpx;
      border-radius: 50%;
      background: #d8d8d8;
    }
    .auth-text {
      margin-top: 20rpx;
      font-size: 39rpx;
      line-height: 54rpx;
      color: #2e2e2e;
      text-align: center;
    }
  }
  .line-gray {
    margin-top: 46rpx;
    margin-left: 70rpx;
    width: 610rpx;
    height: 1rpx;
    background: #ebebeb;
  }
  .text1 {
    color: #2e2e2e;
    font-size: 32rpx;
    line-height: 46rpx;
    margin-top: 50rpx;
    margin-left: 70rpx;
  }
  .text2 {
    color: #4a4a4a;
    font-size: 30rpx;
    line-height: 42rpx;
    margin-top: 21rpx;
    margin-left: 70rpx;
  }
  .bt {
    height: 88rpx;
    margin: 81rpx 70rpx;
    width: 610rpx;
    font-size: 34rpx;
    line-height: 88rpx;
  }
}
</style>
