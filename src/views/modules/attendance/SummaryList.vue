<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="名称">
              <a-input placeholder="输入名称模糊查询" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">迟到</a-select-option>
                <a-select-option value="3">旷工</a-select-option>
                <a-select-option value="4">早退</a-select-option>
                <a-select-option value="7">临时加班</a-select-option>
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
      <a-button type="primary" icon="download" @click="handleExportXls('每日汇总')">导出Excel</a-button>
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

          <a @click="recycleBinVisible=true,userId=record.userId,startTime=record.startTime,endTime=record.endTime" >明细</a>

        </span>

        <span slot="action2" slot-scope="text, record">
          {{record.startTime}} 至 {{record.endTime}}
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
    <record-modal :visible.sync="recycleBinVisible" :userId="userId" :startTime="startTime" :endTime="endTime" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import JInput from '@/components/panther/JInput'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import RecordModal from './modules/RecordModal'

  export default {
    name: "SummaryList",
    mixins: [PantherListMixin],
    components: {
      JInput,
      RecordModal
    },
    data() {
      return {
        description: '这是每日汇总页面',
        queryParam: {},
        recycleBinVisible: false,
        userId: '',
        startTime:null,
        endTime:null,
          columns: [
          {
            title: '打卡日期',
            align: "center",
            dataIndex: 'createTime',
            width: 80,
            sorter: true
          },
          {
            title: '打卡记录',
            align: "center",
            width: 160,
            dataIndex: 'action2',
            scopedSlots: {customRender: 'action2'},
          },
          {
            title: '工作时长（h）',
            align: "center",
            width: 80,
            dataIndex: 'timelength'
          },
          {
            title: '额外工时（h）',
            align: "center",
            width: 80,
            dataIndex: 'overtime'
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
            title: '状态',
            align: "center",
            width: 80,
            dataIndex: 'statusName'
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
          list: "/summary/list",
          delete: "/summary/delete",
          deleteBatch: "/summary/deleteBatch",
          queryById: "/summary/queryById",
          exportXlsUrl: "/summary/exportXls",
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