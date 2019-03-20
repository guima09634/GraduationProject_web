<template>
  <el-container class="page-content-wrap table-content">
    <el-card class="width-100 margin-0-auto">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="queryForm.ddKey" placeholder="数据字典标识" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.ddName" placeholder="数据字典类型名称" clearable />
        </el-form-item>
      </el-form>
      <div class="button-list">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch()" plain>查询</el-button>
        <el-button type="success" icon="el-icon-plus" @click="showDataForm()" plain>添加</el-button>
        <el-button type="warning" icon="el-icon-edit" @click="showDataForm('true')" plain>修改</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="askForDelete()" plain>删除</el-button>
      </div>
      <el-table :data="tableData" v-loading="tableLoading" class="width-100"
                @select-all="handleSelectionChange" @select="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID" width="80px"></el-table-column>
        <el-table-column prop="ddKey" label="数据字典标识"></el-table-column>
        <el-table-column prop="ddName" label="数据字典类型名称"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="creator" label="创建人"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间"></el-table-column>
      </el-table>
      <efun-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :total="totalCount"
        :pageSize="pageSize" />

      <el-dialog title="数据字典项" :visible.sync="dataFormShow">
        <el-form :model="modifyData" ref="dataForm" :rules="rules">
          <el-row>
            <el-col :span="14">
              <el-form-item label="数据字典标识" prop="ddKey" label-width="150px">
                <el-input type="text" v-model="modifyData.ddKey" placeholder="数据字典标识" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <div style="padding-left:20px;">
                <el-button type="primary" @click="autoCreateKey()">自动生成</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label="数据字典类型名称" prop="ddName" label-width="150px">
                <el-input type="text" v-model="modifyData.ddName" placeholder="数据字典类型名称" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="port" label-width="150px">
                <el-input :rows="5" type="textarea" v-model="modifyData.remark" placeholder="请输入备注" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelForm()">取 消</el-button>
          <el-button v-loading="confirmBtnLoading" type="primary" @click="addAndEdit()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </el-container>
</template>

<script>
import EfunPagination from '@/components/common/EfunPagination'

export default {
  components: {
    EfunPagination
  },
  data () {
    return {
      queryForm: {
        ddKey: '',
        ddName: ''
      },
      rules: {
        ddKey: [{
          required: true,
          message: '请输入字典类型编码',
          trigger: 'blur'
        }],
        ddName: [{
          required: true,
          message: '请输入类型名称',
          trigger: 'blur'
        }]
      },
      tableData: [],
      tableLoading: false,
      currentPage: 1,
      totalCount: 0,
      pageSize: 10,
      selectData: [],
      dataFormShow: false,
      confirmBtnLoading: false,
      modifyData: {
        id: '',
        ddKey: '',
        ddName: '',
        remark: ''
      }
    }
  },
  watch: {
    dataFormShow: function (val, oldVal) {
      if (this.$refs['dataForm'] !== undefined) {
        this.$refs['dataForm'].clearValidate()
      }
    }
  },
  methods: {
    handleCurrentChange (page) {
      this.currentPage = page
      this.handleSearch()
    },
    handleSearch () {
      const params = this.queryForm
      params.size = this.pageSize
      params.page = this.currentPage

      this.tableLoading = true
      this.$http.queryDataDictionary(params).then(res => {
        this.totalCount = res.data.totalCount
        this.currentPage = res.data.currentPage
        this.tableData = res.data.data
        this.tableLoading = false
      })
    },
    handleSelectionChange (val) {
      this.selectData = val
    },
    askForDelete () {
      if (this.selectData.length) {
        this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const idArr = []
          this.selectData.map(item => {
            idArr.push(item.id)
          })
          var params = {
            ids: idArr.join(',')
          }
          this.$http.deleteDataDictionary(params).then(res => {
            this.$message({
              message: res.code + '-' + res.message,
              type: res.code === 'e1000' ? 'success' : 'error'
            })
            this.handleSearch()
          })
        })
      } else {
        this.$message.error('请至少选择一项数据！')
      }
    },
    showDataForm (isEdit) {
      if (isEdit) { // 如果是编辑功能
        if (this.selectData.length !== 1) {
          this.$message.error('请选择一条数据进行操作')
          return
        }
      }
      this.changeFormData(isEdit, this.selectData)
      this.dataFormShow = !this.dataFormShow
    },
    addAndEdit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmBtnLoading = true
          this.$http.saveDataDictionary(this.modifyData).then(res => {
            this.$message({
              message: '提交成功！',
              type: 'success'
            })
            this.cancelForm()
            this.handleSearch()
            this.confirmBtnLoading = false
          })
        } else {
          this.$message.error('请正确地把信息填写完整！')
          return false
        }
      })
    },
    changeFormData (isEdit, data) {
      if (isEdit) {
        Object.assign(this.modifyData, data[0])
      } else {
        this.modifyData = {
          id: '',
          ddKey: '',
          ddName: '',
          remark: ''
        }
      }
    },
    cancelForm () {
      this.dataFormShow = false
    },
    autoCreateKey () {
      this.$http.autoCreateKey().then(res => {
        if (res.code === 'e1000') {
          console.log(res)
          this.modifyData.ddKey = res.data
        }
      })
    }
  }
}

</script>
