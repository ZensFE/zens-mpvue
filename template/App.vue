<script>
  // import utils from './utils/utils.js'
  import global from './global/global.js'

  export default {
    data () {
      return {
        code: ''
      }
    },
    onShow (options) {

    },
    onLaunch (options) {
      wx.removeStorageSync('skey')
      global.scene = options.scene
      // global.wxLoginPromise = utils.wxLogin()
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    updateManager.applyUpdate()
                  } else if (res.cancel) {
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经上线，请您删除当前小程序，重新搜索哲品有礼'
              })
            })
          }
        })
      } else {
        return false
      }
    }
  }
</script>

<style lang="scss">
  @import "~z-icon/iconfont.css";
  @import "./styles/zens-ui.plus.scss";
  @import "./styles/common.scss";

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
  /* this rule will be remove */
  * {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
  }
  page {
    background: #eee;
  }
  .text-center {
    text-align: center;
  }
  .clearfix:after {
    display: block;
    height: 0px;
    visibility: hidden;
    content: "";
    clear: both;
  }
  button::after {
    border: none;
  }
  .padding-bottom {
    padding-bottom: 50rpx !important;
  }
  img {
    display: block;
  }
</style>
