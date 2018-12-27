import '../static/sdk/ald-stat'
import Vue from 'vue'
import App from './App'
import global from './global/global'

Vue.prototype.vGlobal = global

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/home/main'
    ],
    window: {
      backgroundTextStyle: 'light',
      backgroundColor: '#fff',
      navigationBarTitleText: '哲品',
      navigationBarTextStyle: 'black',
      navigationBarBackgroundColor: '#fff'
    },
    navigateToMiniProgramAppIdList: [
      // 哲品Zens
      'wx3d758fac75c8a877',
      // 哲品有礼 正式
      'wxe91b8cf74ef029f2',
      // 哲品茶听
      'wxa507cee6c03771b3'
    ]
  }
}
