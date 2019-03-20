<template>
  <transition name="el-zoom-in-top">
    <el-aside
      :class="{ 'mb-nav-open':mbNavIsOpen }"
      class="side-bar"
      width="250px">
      <div class="sider-header">
        <img
          class="logo"
          src="../../assets/img/logo.png">
        <span class="el-dropdown-link choise-item font-bold">管理后台</span>
      </div>
      <efun-menu :menu-list="menuList"/>
    </el-aside>
  </transition>
</template>

<script>
import EfunMenu from './EfunMenu.vue'
import { mapMutations, mapState } from 'vuex'
import eventSent from '../../plugins/event-sent'

export default {
  components: {
    EfunMenu
  },
  data () {
    return {
      menuList: []
    }
  },
  computed: {
    ...mapState({
      mbNavIsOpen: state => state.common.mbNavIsOpen
    })
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      eventSent.$on('userDefinedEvent', (item) => {
        this.menuList = item.childMenus
      })
      this.menuList.forEach((json, index) => {
        if (index === 0) {
          json.show = true
        } else {
          json.show = false
        }
      })
    },
    ...mapMutations(['common/toggleMbNav'])
  }
}
</script>
