<template>
  <div class="zens-container">
    <img src="https://zens-pic.oss-cn-shenzhen.aliyuncs.com/static/space/in1.jpg"
         mode="widthFix"
         class="dummy-img" alt="">

    <div class="flex-container padding30">
      <button class="btn">主色</button>
      <button class="btn red pill">红色</button>
      <button class="btn gray radius">授权页</button>
    </div>
  </div>
</template>

<script>
// import utils from '../../utils/utils.js'
// import http from '../../utils/http.js'

export default {
  data () {
    return {
      welcomeShow: true
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
  img {
    width: 100%;
  }
</style>
