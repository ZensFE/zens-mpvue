<template>
  <form report-submit="true" @submit="formIdCollect" class="zens-container">
    <img src="https://zens-pic.oss-cn-shenzhen.aliyuncs.com/static/space/in1.jpg"
         mode="widthFix"
         class="dummy-img" alt="">

    <div class="flex-container padding30">
      <button form-type="submit" class="btn">主色</button>
      <button class="btn red pill">红色</button>
      <button class="btn gray radius">授权页</button>
    </div>
  </form>
</template>

<script>
// import utils from '../../utils/utils.js'
// import http from '../../utils/http.js'
import formId from '../../mixins/formId'
import urlParams from '../../mixins/urlParams'
export default {
  mixins: [formId, urlParams],
  data () {
    return {
      welcomeShow: true,
      $a: ''
    }
  },
  methods: {
  },
  onShow () {
    wx.showModal({
      title: '注意',
      showCancel: false,
      content: 'App.vue中的utils.wxLogin()已被注释'
    })
    console.log(this.query, this.$a)
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
