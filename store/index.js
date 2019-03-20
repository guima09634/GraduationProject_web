import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = () => {
  return new Vuex.Store({
    modules: {
      common
    },
    strict: debug
  })
}

export default store
