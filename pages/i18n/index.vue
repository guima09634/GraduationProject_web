<template>
  <el-container class="page-content-wrap table-content">
    <el-card class="width-100 margin-0-auto">
      <el-form>
        <el-form-item>
          <el-radio-group v-model="lang">
            <el-radio
              label="zh-CN"
              border>简体中文</el-radio>
            <el-radio
              label="en"
              border>English</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="size">
            <el-radio
              label="mini"
              border>mini</el-radio>
            <el-radio
              label="small"
              border>small</el-radio>
            <el-radio
              label="medium"
              border>medium</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          {{ $t('page.common.operation') }} &nbsp;
          <el-date-picker
            :placeholder="$t('page.common.search')"
            type="date"
            value-format="yyyy-MM-dd" />
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script>
import Util from '@/lib/util'

export default {
  computed: {
    lang: {
      get () {
        return this.$i18n.locale
      },
      set (lang) {
        this.$i18n.locale = lang
        Util.addCookie('lang', lang)
      }
    },
    size: {
      get () {
        return this.$ELEMENT.size
      },
      set (size) {
        this.$ELEMENT.size = size
        Util.addCookie('size', size)

        this.$router.go({
          path: this.$route,
          force: true
        })
      }
    }
  }
}

</script>
