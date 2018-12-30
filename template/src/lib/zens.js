import formId from './mixins/formId'
import urlParams from './mixins/urlParams'

export default {
  install (Vue, options) {
    Vue.mixin(formId)
    Vue.mixin(urlParams)
  }
}
