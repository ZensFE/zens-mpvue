<template>
  <div>
    <!--闪屏页-->

    <!--非闪屏区域-->

  </div>
</template>

<script>
import utils from '../../utils/utils.js'
import http from '../../utils/http.js'
import welcome from '../../components/welcome.vue'
import serviceCard from '../../components/serviceCard.vue'
import skeScreen from '../../components/skeScreen.vue'
import {CARD_STATE_STR, DISPLAY_TYPE} from '../../global/global'

const BTN_IMG_RESERVE = 'https://zens-pic.oss-cn-shenzhen.aliyuncs.com/static/space/btn-reserve.png'
const BTN_IMG_SERVICE = 'https://zens-pic.oss-cn-shenzhen.aliyuncs.com/static/space/btn-service.png'
const BTN_IMG_APP = 'https://zens-pic.oss-cn-shenzhen.aliyuncs.com/static/space/btn-shopping.png'
export default {
  components: {welcome, serviceCard, skeScreen},
  data () {
    return {
      welcomeShow: true,
      hasCard: false,
      cardState: '',
      buttonImg: {
        RESERVE: BTN_IMG_RESERVE,
        SERVICE: BTN_IMG_SERVICE,
        APP: BTN_IMG_APP
      },
      userInfo: {
        avatar: '/static/img/default_avartar.png'
      },
      // storeInfo 对应后端的 shopAddress_lists
      storeInfo: {},
      cardInfo: {},
      mpList: [],
      shopList: []
    }
  },
  methods: {
    goMp (id) {
      utils.changePage('webView', {id})
    },
    cardClickHandler () {
      utils.changePage('serviceDetail', {orderId: this.orderId})
    },
    welcomeHideHandler () {
      wx.setStorageSync('visited', true)
      this.welcomeShow = false
    },
    isVisited () {
      const firstPage = wx.getStorageSync('first_page')
      if (/home/.test(firstPage)) {
        return wx.getStorageSync('visited')
      } else {
        // 如果第一个访问的页面不是home，那么他一定访问过其他页面
        wx.setStorageSync('visited', true)
        return true
      }
    },
    goSomewhere (url) {
      // 【开始预约】时，判断是否有用户信息的处理

      if (url === 'spaceList') {
        const userInfo = wx.getStorageSync('userInfo')
        if (!userInfo || !userInfo.nike_name) {
          utils.changePage('authorization', {loginBack: 'spaceList'})
        } else {
          utils.changePage(url)
        }
      } else {
        utils.changePage(url)
      }
    },
    goZensGift () {
      wx.navigateToMiniProgram({
        appId: 'wxe91b8cf74ef029f2'
      })
    },
    formLog (e) {
      utils.getFormId({ fname: 'home', fid: e.mp.detail.formId })
    },
    // 初始化全部信息
    initAll () {
      return http.request({
        to: 'index.info',
        data: {
          shop_id: this.shopId
        }
      }).then(data => {
        // 服务卡片
        let cardInfo = data.server_card_lists && data.server_card_lists[0]
        if (data.shop_info.length === 1) {
          wx.setStorageSync('store_id', data.shop_info[0].shop_id)
          this.shopId = data.shop_info[0].shop_id
        }
        let storeInfo = data.shop_info.filter(i => {
          return i.shop_id === this.shopId
        })[0]
        // 服务卡片信息
        this.hasCard = !!cardInfo
        wx.setNavigationBarTitle({
          title: storeInfo.shop_name
        })
        if (this.hasCard) {
          this.orderId = cardInfo.order_id
          this.cardInfo = {
            spaceName: cardInfo.order_room_name,
            spaceId: cardInfo.space_id,
            password: cardInfo.order_room_pwd,
            state: CARD_STATE_STR[cardInfo.order_status],
            userType: cardInfo.poster,
            orderId: cardInfo.order_id,
            storePhone: cardInfo.order_shop_contact,
            content: cardInfo.order_foods_content
          }
          this.cardState = cardInfo.order_status
          if (cardInfo.display_type !== DISPLAY_TYPE.DISH) {
            Object.assign(this.cardInfo, {
              timeStr: cardInfo.order_room_time
            })
          } else {
            Object.assign(this.cardInfo, {
              orderTimeStr: cardInfo.order_pay_time
            })
          }
        }

        // 图文列表
        this.mpList = data.recommend_lists
        // 用户信息
        this.userInfo.avatar = data.user_info.avatar_url
        // 门店信息
        this.storeInfo.name = storeInfo.shop_name
        this.storeInfo.id = storeInfo.shop_id
        this.storeInfo.address = storeInfo.detailed_address
      })
    }
  },
  watch: {
    welcomeShow (show, oldShow) {
      // 处理没有选择门店的情况
      if (!show && oldShow && !this.shopId) {
        utils.replacePage('storeList')
      }
    }
  },
  computed: {
    cardServices () {
      return utils.getCardServices(this.cardState, this.cardInfo.userType)
    }
  },
  onShow () {
    // 判断是否需要展示【闪屏】，
    this.welcomeShow = !this.isVisited()
    if (this.welcomeShow) {
      setTimeout(() => {
        this.welcomeHideHandler()
      }, 3000)
    }
    // 获取门店ID
    this.shopId = wx.getStorageSync('store_id')
    this.initAll()
  },
  onPullDownRefresh () {
    if (!this.welcomeShow) {
      this.initAll().then(() => {
        wx.stopPullDownRefresh()
      })
    } else {
      wx.stopPullDownRefresh()
    }
  }
}
</script>
<style>
  page {
    background-color: #ffffff;
  }
</style>
<style scoped lang="scss">

  span.arrow-down::after {
    /*content: '▲';*/
    content: '▼';
    font-size: 0.8em;
    line-height: 1.2em;
    vertical-align: center;
    margin-left: 0.5em;
  }
  .banner-button > img {
    border: none;
  }
  .left-tips {
    display: inline-block;
    background-color: transparentize(#000000, .6);
    position: absolute;
    top: 30rpx;
    border-top-right-radius: 50rpx;
    border-bottom-right-radius: 50rpx;
  }
  .click:active {
    transform: scale(0.9875);
  }
  .click-l:active {
    transform: scale(1.1);
  }
</style>
