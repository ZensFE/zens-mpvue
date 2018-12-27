<template>
  <p class="des-txt" :class="{'fix-pos': fix}">
    <span @click="goGuide">使用说明</span> |
    <span>联系客服
      <button v-if="sessionInfo" type='default' :session-from="sessionInfo" open-type="contact" ></button>
      <button v-else open-type="contact"></button>
    </span> |
    <span @click="goCorporate">企业定制</span>
  </p>
</template>

<script>
export default {
  data () {
    return {
      userInfo: wx.getStorageSync('userInfo'),
      sessionInfo: {}
    }
  },
  name: 'footerButton',
  props: {
    fix: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goGuide () {
      wx.navigateTo({
        url: '/pages/guide/main'
      })
    },
    goCorporate () {
      wx.navigateTo({
        url: '/pages/story/main?id=2'
      })
    }
  },
  mounted () {
    this.sessionInfo = JSON.stringify({
      'nickName': this.userInfo.nike_name,
      'avatarUrl': this.userInfo.avatar_url
    })
  }
}
</script>

<style lang="scss" scoped>
  .des-txt {
    font-size: 26rpx;
    color: #B3B3B3;
    text-align: center;


    span {
      position: relative;
      padding: 10rpx;
    }

    button {
      background: none;
      border: none;
      color: #A3A3A3;
      font-size: 26rpx;
      position: absolute;
      left: 0;
      top: 0;
      padding: 30rpx 60rpx;
    }

    button:after {
      border: none;
    }
  }

  .des-txt.fix-pos {
    position: fixed;
    bottom: 25rpx;
    left: 0;
    z-index: 1001;
    width: 100%;
  }
</style>
