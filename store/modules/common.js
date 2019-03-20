const state = {
  mbNavIsOpen: false
}

const getters = {}

const actions = {}

const mutations = {
  toggleMbNav (state, val) {
    state.mbNavIsOpen = val || !state.mbNavIsOpen
    console.log(state.mbNavIsOpen)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
