import utils from '../utils/utils'
const tryToBeNumber = str => isNaN(Number(str)) ? str : Number(str)

export default {
  data () {
    return {
      // 处理过的url参数
      query: {},
      // 页面场景值参数
      scene: {}
    }
  },
  onShow () {
    const mpQuery = this.$root.$mp.query
    let sceneParams = {}
    if (mpQuery.scene) {
      sceneParams = utils.parseQueryString(mpQuery.scene)
      this.scene = sceneParams
    }
    for (let param in mpQuery) {
      if (mpQuery.hasOwnProperty(param)) {
        const paramValue = decodeURIComponent(sceneParams[param] || mpQuery[param])
        this.query[param] = tryToBeNumber(paramValue)
      }
    }
  }
}
