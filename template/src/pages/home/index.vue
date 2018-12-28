<template>
  <div>
    <!--闪屏页-->

    <!--非闪屏区域-->

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
  methods: {},
  onShow () {
    // 判断是否需要展示【闪屏】，
    this.welcomeShow = !this.isVisited()
    if (this.welcomeShow) {
      setTimeout(() => {
        this.welcomeHideHandler()
      }, 3000)
    }
    // 获取门店ID
    this.initAll()
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
