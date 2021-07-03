<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="姓名">
              <a-input placeholder="输入姓名模糊查询" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.approve" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="1">未审</a-select-option>
                <a-select-option value="2">驳回</a-select-option>
                <a-select-option value="5">通过</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">

            <a-col :md="6" :sm="8">
              <a-form-item label="开始时间">
                <a-date-picker
                  style="width: 100%"
                  placeholder="开始时间"
                  value-format="yyyy-MM-DD 00:00:00"
                  v-model="queryParam.startTime"
                  :getCalendarContainer="node => node.parentNode"/>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="结束时间">
                <a-date-picker
                  style="width: 100%"
                  placeholder="结束时间"
                  v-model="queryParam.endTime"
                  value-format="yyyy-MM-DD 23:59:59"
                  :getCalendarContainer="node => node.parentNode"/>
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset('补卡')" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record" >
          <a @click="auditProcess(record,5)" v-show="record.approve == 1">批准</a>
          <a-divider type="vertical" v-show="record.approve == 1"/>
          <a @click="auditProcess(record,2)" v-show="record.approve == 1">驳回</a>
        </span>

        <span slot="action1" slot-scope="text, record">
          {{record.recordTag}}（{{record.approveName}}）
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import JInput from '@/components/panther/JInput'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import {postAction} from '@/api/manage';

  export default {
    name: "FillCardAuditList",
    mixins: [PantherListMixin],
    components: {
      JInput
    },
    data() {
      return {
        description: '这是补卡审核页面',
        queryParam: {recordTag:'补卡'},
          columns: [
          {
            title: '补卡时间',
            align: "center",
            dataIndex: 'startTime',
            width: 80,
            sorter: true
          },
          {
            title: '姓名',
            align: "center",
            width: 80,
            dataIndex: 'userName'
          },
          {
            title: '所属部门',
            align: "center",
            width: 80,
            dataIndex: 'deptName'
          },
          {
            title: '事由',
            align: "center",
            width: 80,
            dataIndex: 'reason'
          },
          {
            title: '标志',
            align: "center",
            width: 80,
            dataIndex: 'action1',
            scopedSlots: {customRender: 'action1'},
          },
          {
            title: '申请日期',
            align: "center",
            width: 80,
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 80
          }

        ],
        url: {
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/process/list",
          delete: "/process/delete",
          deleteBatch: "/process/deleteBatch",
          queryById: "/process/queryById",
          auditProcess: "/process/auditProcess",
        },
        isShow:true
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar)
      },

      batchFrozen: function (status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return false;
        } else {
          let ids = "";
          let that = this;
          let isAdmin = false;
          that.selectionRows.forEach(function (row) {
            if (row.username == 'admin') {
              isAdmin = true;
            }
          });
          if (isAdmin) {
            that.$message.warning('管理员账号不允许此操作,请重新选择！');
            return;
          }
          that.selectedRowKeys.forEach(function (val) {
            ids += val + ",";
          });
          that.$confirm({
            title: "确认操作",
            content: "是否" + (status == 1 ? "解冻" : "冻结") + "选中账号?",
            onOk: function () {
              frozenBatch({ids: ids, status: status}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },
      handleMenuClick(e) {
        if (e.key == 1) {
          this.batchDel();
        } else if (e.key == 2) {
          this.batchFrozen(2);
        } else if (e.key == 3) {
          this.batchFrozen(1);
        }
      },
      handleFrozen: function (id, status, username) {
        let that = this;
        //TODO 后台校验管理员角色
        if ('admin' == username) {
          that.$message.warning('管理员账号不允许此操作！');
          return;
        }
        frozenBatch({ids: id, status: status}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      auditProcess(record,approve){
        let param = {};
        param = record;
        param.approve = approve;
        postAction(this.url.auditProcess,param).then(res=>{
          if(res.success){
            this.$message.warning(res.message);
            this.searchReset('补卡');
          }
        })
      },

    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>