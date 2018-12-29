import utils from '../utils/utils.js'
export default {
  data () {
    return {
      fname: ''
    }
  },
  methods: {
    formIdCollect (e) {
      const fname = this.fname || this.$root.$mp.appOptions.path.replace(/\/|pages|main/g, '')
      const formId = e.mp.detail.formId
      utils.getFormId({fname, 'fid': formId})
    }
  }
}
