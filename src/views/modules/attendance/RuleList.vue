<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
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
<!--            <a-col :md="6" :sm="8">-->
<!--              <a-form-item label="真实名字">-->
<!--                <a-input placeholder="请输入真实名字" v-model="queryParam.realname"></a-input>-->
<!--              </a-form-item>-->
<!--            </a-col>-->

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
      <a-button @click="handleAdd" type="primary" icon="plus">新增规则</a-button>
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
          <a @click="getParam(record.id)" >编辑</a>

          <a-divider type="vertical" />

          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
<!--          <a @click="positiveOrLeave(record.id,1)" >移除</a>-->

        </span>

        <span slot="action1" slot-scope="text, record">
          <a @click="getParam(record.id)" >查看</a>
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <attendance-rule-modal ref="modalForm" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import JInput from '@/components/panther/JInput'
  import AttendanceRuleModal from './modules/AttendanceRuleModal'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import { getAction, postAction } from '../../../api/manage'

  export default {
    name: "RuleList",
    mixins: [PantherListMixin],
    components: {
      JInput,
      AttendanceRuleModal
    },
    data() {
      return {
        description: '这是考勤规则管理页面',
        queryParam: {workingStatus:0},
        columns: [
          {
            title: '月份',
            align: "center",
            dataIndex: 'month',
            width: 80,
            sorter: true
          },
          {
            title: '适用部门',
            align: "center",
            width: 80,
            dataIndex: 'deptName',
          },
          {
            title: '日期规则',
            align: "center",
            width: 200,
            dataIndex: 'days',
          },

          {
            title: '时间规则',
            align: "center",
            width: 80,
            dataIndex: 'action1',
            scopedSlots: {customRender: 'action1'},
          },
          {
            title: '创建日期',
            align: "center",
            width: 100,
            dataIndex: 'createTime',
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
          list: "/attendance/rule/list",
          delete: "/attendance/rule/delete",
          deleteBatch: "/attendance/rule/deleteBatch",
          queryDetailById: "/attendance/rule/queryDetailById"
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
      },
      getParam(id) {
        if(!this.url.queryDetailById){
          this.$message.error("请设置url.queryDetailById!")
          return
        }
        const formData = new FormData();
        getAction(this.url.queryDetailById, {id:id}).then((res) => {
          if (res.success) {
            this.handleEdit(res.result);
          } else {
            this.$message.warning(res.message);
          }
        });
      }


    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>