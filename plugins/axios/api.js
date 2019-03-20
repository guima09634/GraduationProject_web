import axios from 'axios'
import Util from '@/lib/util'
import Qs from 'qs'

console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
console.log(JSON.stringify(process.env.NODE_ENV))
console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')

var permissionUrl
var centerUrl
if (process.env.NODE_ENV === 'production') {
  permissionUrl = 'https://mgr-permission.efun.com/'
  centerUrl = 'https://center.efun.com/'
} else {
  permissionUrl = 'http://t-permission.efun.com/'
  centerUrl = 'http://localhost:8081/'
}

const centerDomain = {
  baseURL: centerUrl, // 基础url前缀
  successCode: 'e1000', // 接口正确返回时的code
  timeout: 300000, // 设置超时时间
  needSetToken: false, // 是否需要header添加token
  needHandleResponse: true // 是否需要拦截器中处理响应数据
}
// 为了解决超时问题
axios.defaults.retry = 4
axios.defaults.retryDelay = 1000
var instance = axios.create({
  baseURL: centerDomain.baseURL,
  timeout: centerDomain.timeout,
  transformRequest: [function (data) {
    data = Qs.stringify(data)
    return data
  }],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
if (centerDomain.needSetToken) {
  setHeaderToken(instance)
}
if (centerDomain.needHandleResponse) {
  handleRepsonseData(instance, centerDomain)
}

const dynamicDomain = {
  pm: {
    domain: permissionUrl,
    successCode: 'e1000', // 接口正确返回时的code
    needSetToken: true, // 是否需要header添加token
    needHandleResponse: true // 是否需要拦截器中处理响应数据
  }
}
for (const i in dynamicDomain) {
  instance[i] = axios.create({
    baseURL: dynamicDomain[i].domain,
    timeout: dynamicDomain[i].timeout || centerDomain.timeout
  })
  if (dynamicDomain[i].needSetToken) {
    setHeaderToken(instance[i])
  }
  if (dynamicDomain[i].needHandleResponse) {
    handleRepsonseData(instance[i], dynamicDomain[i])
  }
}

function setHeaderToken (ins) {
  // request 请求拦截器
  ins.interceptors.request.use(config => {
    // 设置headers
    config.headers.pmtoken = Util.getCookie('token')
    return config
  },
  error => {
    return Promise.reject(error)
  })
}

function handleRepsonseData (ins, conf) {
  // response 响应拦截器
  ins.interceptors.response.use(response => {
    // 对响应数据做点什么
    const code = response.data.code
    if (code !== conf.successCode) { // 返回的code = 成功code时才到then函数里
      if (code === 'e1004') { // 返回的code != 成功code时弹窗提示
        console.log('********************* current response token invalid ************************')
        console.log(response)
        var pmUrl = 'http://t-permission.efun.com'
        if (process.env.NODE_ENV === 'production') {
          pmUrl = 'https://mgr-permission.efun.com'
        }
        location.href = pmUrl + '/login?from=' + encodeURIComponent(location.href)
      }
    }
    return response.data
  }, error => {
    return Promise.reject(error)
  })
}

export default instance
