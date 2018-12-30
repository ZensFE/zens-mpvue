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
export default {
  data () {
    return {
      welcomeShow: true
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
