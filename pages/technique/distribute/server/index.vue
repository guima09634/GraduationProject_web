<template>
  <el-container class="page-content-wrap table-content">
    <el-card class="width-100 margin-0-auto">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="queryForm.area" filterable placeholder="选择部门">
            <el-option
              v-for="(item,index) in departments"
              :key="index"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.emailId" placeholder="邮箱ID" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.userName" placeholder="邮箱账号" clearable />
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
        <el-table-column prop="emailId" label="邮箱ID"></el-table-column>
        <el-table-column prop="userName" label="邮箱账号"></el-table-column>
        <el-table-column prop="password" label="邮箱密码"></el-table-column>
        <el-table-column prop="host" label="邮箱域名"></el-table-column>
        <el-table-column prop="port" label="端口号"></el-table-column>
      </el-table>
      <efun-pagination
        @current-change="handleCurrentChange"
        :current-page="current"
        :total="total"
        :pageSize="pageSize" />

      <el-dialog title="邮件服务器信息" :visible.sync="dataFormShow">
        <el-form :model="modifyData" ref="dataForm" :rules="rules">
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="邮箱ID" prop="emailId" label-width="100px">
                    <el-input type="text" v-model="modifyData.emailId" placeholder="请输入邮箱ID" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱账号" prop="userName" label-width="100px">
                    <el-input type="text" v-model="modifyData.userName" placeholder="请输入邮箱账号" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="邮箱密码" prop="password" label-width="100px">
                    <el-input type="text" v-model="modifyData.password" placeholder="请输入邮箱密码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱域名" prop="host" label-width="100px">
                    <el-input type="text" v-model="modifyData.host" placeholder="请输入邮箱域名" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="端口号" prop="port" label-width="100px">
                    <el-input type="text" v-model="modifyData.port" placeholder="请输入端口号" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
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
      departments: [{
        value: 'hk_tw_extend_master',
        label: '港台'
      }, {
        value: 'korea',
        label: '韩国'
      }, {
        value: 'asia_extend_master',
        label: '亚欧'
      }],
      queryForm: {
        area: 'hk_tw_extend_master',
        emailId: '',
        userName: ''
      },
      rules: {
        emailId: [{
          required: true,
          message: '请输入邮箱ID',
          trigger: 'blur'
        }],
        userName: [{
          required: true,
          message: '请输入邮箱账号',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入邮箱密码',
          trigger: 'blur'
        }],
        host: [{
          required: true,
          message: '请输入邮箱域名',
          trigger: 'blur'
        }],
        port: [{
          required: true,
          message: '请输入端口号',
          trigger: 'blur'
        }]
      },
      tableData: [],
      tableLoading: false,
      current: 1,
      total: 0,
      pageSize: 10,
      selectData: [],
      dataFormShow: false,
      confirmBtnLoading: false,
      modifyData: {
        id: '',
        emailId: '',
        userName: '',
        password: '',
        host: '',
        port: ''
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
      this.current = page
      this.handleSearch()
    },
    handleSearch () {
      const params = this.queryForm
      params.size = this.pageSize
      params.page = this.current

      this.tableLoading = true
      this.$http.queryEmailServer(params).then(res => {
        this.total = res.data.total
        this.current = res.data.current
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
            ids: idArr.join(','),
            area: this.queryForm.area
          }
          this.$http.deleteEmailServer(params).then(res => {
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
          this.modifyData.area = this.queryForm.area

          this.confirmBtnLoading = true
          this.$http.saveEmailServer(this.modifyData).then(res => {
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
          emailId: '',
          userName: '',
          password: '',
          host: '',
          port: ''
        }
      }
    },
    cancelForm () {
      this.dataFormShow = false
    }
  }
}

</script>
