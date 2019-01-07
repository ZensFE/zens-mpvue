<template>
  <clays>
    <img src="https://zens-pic.oss-cn-shenzhen.aliyuncs.com/static/space/in1.jpg"
         mode="widthFix" style="width: 100%;"
         class="dummy-img" alt="">

    <div class="flex-container padding30">
      <button form-type="submit" class="btn">formId</button>
      <button class="btn red pill">红色</button>
      <button class="btn gray radius" @click="goAuth">授权页</button>
    </div>
    <hr>
    <div class="flex-container padding30">
      <div class="btn-group">
        <button class="btn pill">左侧按钮</button>
        <button class="btn gray pill">右侧按钮</button>
      </div>
    </div>
    <div class="flex-container padding30">
      <text class="icon-home"></text>
      <text class="icon-gift text-red"></text>
      <text class="icon-buys text-primary"></text>
      <text class="icon-close-circle text-darker"></text>
      <text class="icon-coupon text-gray"></text>
      <text class="icon-plus fs-40"></text>
      <text class="icon-reduce fs-40"></text>
    </div>
    <button class="btn big fixed-bottom">底部按钮</button>
  </clays>
</template>

<script>
import utils from '../../utils/utils'
export default {
  data () {
    return {
      welcomeShow: true
    }
  },
  methods: {
    goAuth () {
      utils.changePage('authorization')
    }
  },
  onShow () {
    wx.showModal({
      title: '注意',
      showCancel: false,
      content: 'App.vue中的utils.wxLogin()已被注释'
    })
  }
}
</script>
<style>
  page {
    background-color: #ffffff;
  }
</style>
<style scoped lang="scss">
  .xModel {
    .fixed-bottom {
      box-sizing: content-box;
      padding-bottom: 20rpx;
    }
  }
</style>
