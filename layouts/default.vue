<template>
  <el-container>
    <sider-bar/>
    <el-main>
      <PageHeader/>
      <transition name="el-fade-in-linear">
        <nuxt/>
      </transition>
    </el-main>
    <div
      :class="{'mb-nav-show-overlay':mbNavIsOpen}"
      class="overlay"
      @click="toggleMbNav()" />
  </el-container>
</template>

<script>
import SiderBar from '@/components/common/SiderBar.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  components: {
    SiderBar,
    PageHeader
  },
  computed: {
    ...mapState({
      mbNavIsOpen: state => state.common.mbNavIsOpen
    })
  },
  methods: {
    toggleMbNav () {
      this['common/toggleMbNav']()
    },
    ...mapMutations([
      'common/toggleMbNav'
    ])
  }
}
</script>
