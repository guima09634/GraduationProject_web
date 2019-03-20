<template>
  <div class="control-bar clearfix">
    <div class="header-line pos-rel display-flex">
      <i
        :class="{ 'mb-nav-open':mbNavIsOpen }"
        class="el-icon-d-arrow-right margin-r-10 mb-menu cursor-pointer pos-rel"
        @click="toggleMbNav()" />
      <el-menu
        default-active="1"
        mode="horizontal"
        size="medium">
        <el-menu-item v-for="(item) in menuList" :key="item.sort" :index="(item.sort).toString()" @click.native="itemClick(item)">
          <a class="font-bold font-s-12">&nbsp;<i class="fah font-18 menu-icon" :class="item.icon" />{{item.name}}&nbsp;</a>
        </el-menu-item>
        <el-menu-item index="99" @click.native="logout()">
          <a class="font-bold color-danger font-s-12"><i class="fah font-18 menu-icon el-icon-circle-close" />退出</a>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import eventSent from '@/plugins/event-sent'
import Util from '@/lib/util.js'

export default {
  data () {
    return {
      userName: '',
      menuList: []
    }
  },
  computed: {
    ...mapState({
      mbNavIsOpen: state => state.common.mbNavIsOpen
    })
  },
  mounted () {
    this.userName = Util.getCookie('userName') || '未登录'

    this.$http.getMenuTree({
      systemId: 8
    }).then((res) => {
      if (res.data) {
        this.menuList = res.data
        this.itemClick(this.menuList[0])
      }
    })
  },
  methods: {
    toggleMbNav () {
      this['common/toggleMbNav']()
    },
    ...mapMutations([
      'common/toggleMbNav'
    ]),
    itemClick (item) {
      eventSent.$emit('userDefinedEvent', item)
    },
    logout () {
      var pmUrl = 'http://t-permission.efun.com'
      if (process.env.NODE_ENV === 'production') {
        pmUrl = 'https://mgr-permission.efun.com'
      }
      location.href = pmUrl + '/login?from=' + encodeURIComponent(location.href)
    }
  }
}
</script>

