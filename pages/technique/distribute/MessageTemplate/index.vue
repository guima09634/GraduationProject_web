<template>
  <div class="admin-page">
    <div class="search-bar">
      <slot name="admin-page-header">
        <div class="item">
          <div class="word">部门</div>
          <div class="choise-box">
            <el-select v-model="queryParams.area" filterable placeholder="选择部门">
              <el-option @click.native="selectPartment(item.value)" v-for="(item,index) in departments" :key="index"
                :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="word">游戏</div>
          <div class="choise-box">
            <el-select v-model="queryParams.gameCode" clearable filterable default-first-option placeholder="选择游戏">
              <el-option v-for="(item,index) in games" :key="index" :label="item.gameName + '[' +item.gameCode + ']'"
                :value="item.gameCode">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="word">信息类型</div>
          <div class="choise-box">
            <el-select v-model="queryParams.type" placeholder="请选择">
              <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="word">状态</div>
          <div class="choise-box">
            <el-select v-model="queryParams.status" clearable placeholder="请选择">
              <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="word">接收者</div>
          <div class="choise-box">
            <el-input v-model="queryParams.receiver" auto-complete="off"></el-input>
          </div>
        </div>
      </slot>
      <div class="item">
        <el-button type="success" plain @click="search">查询</el-button>
      </div>
    </div>
    <div class="tool-bar">
    </div>
    <div class="game-table">
      <el-table max-height="1000" ref="dataTable" :data="queryResult.data" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" :default-sort="{ order: 'descending'}">
        <el-table-column prop="area" label="地区" width="180" sortable></el-table-column>
        <el-table-column prop="gameCode" label="游戏" width="180" sortable></el-table-column>
        <el-table-column prop="title" label="标题" width="120" sortable></el-table-column>
        <el-table-column prop="channel" label="渠道" width="120" sortable></el-table-column>
        <el-table-column prop="template" label="内容" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="sender" label="发送者" sortable></el-table-column>
        <el-table-column prop="receiver" label="接收者" sortable></el-table-column>
        <el-table-column prop="sendTime" label="发送时间" width="180" sortable>
          <template slot-scope="scope">
            {{handlerDate(scope.row.sendTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态 " width="120" show-overflow-tooltip sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'wait'">未发送</span>
            <span v-if="scope.row.status === 'success'">发送成功</span>
            <span v-if="scope.row.status === 'fail'">发送失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="tips" label="原因" show-overflow-tooltip></el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="queryResult.pageSize"
          :total="queryResult.totalCount" style="float:right;"></el-pagination>
      </el-col>
    </div>
  </div>

</template>

<script>
import Util from '@/lib/util.js'

export default {
  data () {
    return {
      types: [{
        value: 'email',
        label: '邮件'
      }, {
        value: 'sms',
        label: '短信'
      }],
      status: [{
        value: 'wait',
        label: '未发送'
      }, {
        value: 'success',
        label: '发送成功'
      }, {
        value: 'fail',
        label: '发送失败'
      }],
      departments: [{
        value: 'hk_tw_vice',
        label: '港台'
      }, {
        value: 'korea',
        label: '韩国'
      }, {
        value: 'asia_vice',
        label: '亚欧'
      }],
      games: [],
      templates: [],
      queryParams: {
        gameCode: '',
        area: 'korea',
        type: 'sms',
        size: 10,
        page: 1
      },
      tableData: [],
      queryResult: {
        pageSize: 10,
        currentPage: 1,
        totalCount: 0,
        data: []
      },
      formWidth: '900px',
      formLabelWidth: '140px',
      multipleSelection: []
    }
  },
  methods: {
    formDataChange (data) {
      Object.assign(this.form, data)
    },
    handlerDate (data) {
      return data ? Util.formatDate(data, 'Y-MM-DD hh:mm:ss') : ''
    },
    selectPartment (value) {
      this.$http.loadGameByDepartment({ department: value }).then(res => {
        console.log(res)
        this.games = res.data
      })
    },
    rowClick (row, event, column) {
      this.$refs.dataTable.toggleRowSelection(row)
    },
    rowDBClick: function (row, event) {
      this.formDataChange(row)
    },
    getFormData (params) {
      var formData = new FormData()
      for (var i in params) {
        formData.append(i, params[i])
      }
      return formData
    },
    handleChange (file, fileList) {
      this.fileList3 = fileList.slice(-3)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    search () {
      var loading = this.openFullScreen()
      this.$service.message.query(this.queryParams).success((res) => {
        this.queryResult = res.data
        loading.close()
      }).failure((res) => {
        this.$msg.error(res.message)
        loading.close()
      })
    },
    handleCurrentChange (val) {
      this.queryParams.page = val
      this.search()
    },
    openFullScreen () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return loading
    }
  },
  components: {},
  mounted () {
    this.selectPartment(this.queryParams.area)
  },
  computed: {},
  filters: {
    formatDate: (value) => {
      return Util.formatDate(new Date(value), 'Y-MM-DD')
    }
  }
}
</script>
<style scoped lang="less">
  .admin-page {
    padding-top: 30px;

    .search-bar {
      overflow: hidden;

      .item {
        position: relative;
        padding-top: 40px;
        float: left;
        margin-right: 30px;

        .word {
          position: absolute;
          top: 0;
          font-weight: bold;
          color: #2b7ddc;
        }
      }
    }

    .tool-bar {
      padding-bottom: 20px;
      border-bottom: 1px solid #ddd;
      margin-top: 30px;
    }

    .dialog-popup {
      .form-box {
        overflow: hidden;

        .el-form-item {
          float: left;
          width: 100%;

          .table-item {
            width: 250px;
          }

          .table-full-item {
            width: 500px;
          }
        }
      }

    }
  }

  .el-upload_tip {
    color: red;
  }

</style>
