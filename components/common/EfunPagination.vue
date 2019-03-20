<template>
  <div class="pagination-wrap">
    <el-pagination class="pc-pagination"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total" />
    <div class="mb-pagination el-pagination is-background">
      <button type="button" @click="prevPage()" :disabled="currentPage === 1 || totalPage === 1" class="btn-prev">
        <i class="el-icon el-icon-arrow-left"></i>
      </button>
      <span class="current-page">{{ currentPage }}</span>
      <button type="button" @click="nextPage()" :disabled="currentPage === totalPage || totalPage === 1" class="btn-next">
        <i class="el-icon el-icon-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.total / this.currentPage)
    }
  },
  methods: {
    prevPage () {
      if (this.currentPage > 1) {
        this.handleCurrentChange(this.currentPage - 1)
      }
    },
    nextPage () {
      if (this.currentPage < this.totalPage) {
        this.handleCurrentChange(this.currentPage + 1)
      }
    },
    handleCurrentChange (data) {
      this.$emit('current-change', data)
    }
  }
}
</script>
