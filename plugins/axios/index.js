import Vue from 'vue'
import http from './interface'

Vue.prototype.$http = http
Vue.use(http)
