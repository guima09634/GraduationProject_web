<template>
  <div class="efun-menu">
    <div
      v-for="(menu,index) in menuList"
      :key="index"
      :class="{ 'menu-active':menu.show }"
      class="efun-menu-item cursor-pointer">
      <div
        class="efun-menu-title-msg"
        @click="toggleMenu(index)">
        <h2 class="efun-menu-title cursor-pointer">
          {{ menu.name }}
          <i v-show="false" class="el-icon-arrow-down pull-right icon-arrow" />
        </h2>
      </div>
      <el-collapse-transition>
        <ul
          v-show="menu.show">
          <li
            v-for="(subMenu,subIndex) in (menu.childMenus)"
            :key="subIndex"
            class="efun-menu-item-list-item"
            @click="toggleMbNav()">
            <a
              :class="{ 'sub-menu-active' : (activeMenuItem === subMenu.url) }"
              class="font-s-12"
              @click="handlerMenuChange(subMenu)">
              <i class="fas font-18 el-icon-menu menu-icon" />
              {{ subMenu.name }}
            </a>
          </li>
        </ul>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    activeMenuItem: function () {
      return this.$route.path
    },
    ...mapState({
      mbNavIsOpen: state => state.common.mbNavIsOpen
    })
  },
  methods: {
    toggleMbNav () {
      if (this.mbNavIsOpen) {
        this['common/toggleMbNav']()
      }
    },
    handlerMenuChange: function (menu) {
      this.$router.push({
        path: menu.url
      })
    },
    toggleMenu: function (index) {
      this.menuList[index].show = !this.menuList[index].show
      this.menuList.sort() // 触发视图更新
    },
    ...mapMutations(['common/toggleMbNav'])
  }
}
</script>
