<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="名称">
              <j-input placeholder="输入名称模糊查询" v-model="queryParam.userName"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-date-picker
              style="width: 100%"
              placeholder="开始时间"
              value-format="yyyy-MM-DD 00:00:00"
              v-model="queryParam.startTime"
              :getCalendarContainer="node => node.parentNode"/>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-date-picker
              style="width: 100%"
              placeholder="结束时间"
              v-model="queryParam.endTime"
              value-format="yyyy-MM-DD 23:59:59"
              :getCalendarContainer="node => node.parentNode"/>
          </a-col>

          <template v-if="toggleSearchStatus">

          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button type="primary" icon="download" @click="handleExportXls('考勤信息')">导出Excel</a-button>
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

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" >编辑</a>

          <a-divider type="vertical" />

          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import JInput from '@/components/panther/JInput'
  import {PantherListMixin} from '@/mixins/PantherListMixin'

  export default {
    name: "RecordList",
    mixins: [PantherListMixin],
    components: {
      JInput
    },
    data() {
      return {
        description: '这是考勤记录页面',
        queryParam: {},
          columns: [
          {
            title: '打卡时间',
            align: "center",
            dataIndex: 'recordTime',
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
            title: '工号',
            align: "center",
            width: 80,
            dataIndex: 'workNo'
          },
          {
            title: '所属部门',
            align: "center",
            width: 80,
            dataIndex: 'deptName'
          },
          {
            title: '核验设备',
            align: "center",
            width: 80,
            dataIndex: 'sn'
          }

        ],
        url: {
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/record/list",
          delete: "/record/delete",
          deleteBatch: "/record/deleteBatch",
          queryById: "/record/queryById",
          exportXlsUrl: "/record/exportXls",
        },
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
      handleChangeTrial(id,probationPeriod) {
        this.$refs.passwordmodal.show(id,probationPeriod);
      },
      handleAgentSettings(username){
        this.$refs.sysUserAgentModal.agentSettings(username);
        this.$refs.sysUserAgentModal.title = "用户代理人设置";
      }

    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>