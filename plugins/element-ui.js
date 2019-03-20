import Vue from 'vue'
import Element from 'element-ui/lib/element-ui.common'
import Util from '@/lib/util'

export default ({ app }) => {
  Vue.use(Element, {
    size: Util.getCookie('size') || 'mini',
    i18n: (key, value) => app.i18n.t(key, value)
  })
}
