import axios from './api'

export default {

  // 获取邮件服务器列表
  queryEmailServer: params => {
    return axios.get('emailServer/query.do', {
      params
    })
  },

  // 新增或修改邮件服务器
  saveEmailServer: params => {
    return axios.post('emailServer/save.do', params)
  },

  // 删除邮件服务器
  deleteEmailServer: params => {
    return axios.get('emailServer/delete.do', {
      params
    })
  },

  // 获取游戏列表
  loadGameByDepartment: params => {
    return axios.get('game/loadGameByDepartment.do', {
      params
    })
  },

  // 获取权限导航树
  getMenuTree: params => {
    return axios.pm('permission/getMenuTree.do', {
      params
    })
  },

  // 获取数据字典项
  queryDataDictionary: params => {
    return axios.post('data/dictionary/query.do', params)
  },

  // 保存数据字典项
  saveDataDictionary: params => {
    return axios.post('data/dictionary/save.do', params)
  },

  // 删除数据字典项
  deleteDataDictionary: params => {
    return axios.post('data/dictionary/delete.do', params)
  },

  // 自动生成Key
  autoCreateKey: params => {
    return axios.post('data/dictionary/autoCreateKey.do', params)
  },

  // 获取所有数据字典项
  getAllDataDictionary: params => {
    return axios.post('data/dictionary/getAllDataDictionary.do', params)
  },

  // 获取数据字典值
  queryDataDictionaryValue: params => {
    return axios.post('data/dictionary/value/query.do', params)
  },

  // 保存数据字典值
  saveDataDictionaryValue: params => {
    return axios.post('data/dictionary/value/save.do', params)
  },

  // 删除数据字典值
  deleteDataDictionaryValue: params => {
    return axios.post('data/dictionary/value/delete.do', params)
  },

  // 刷新缓存
  getAndRefreshCache: params => {
    return axios.post('data/dictionary/value/getAndRefreshCache.do', params)
  }
}
