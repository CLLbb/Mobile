<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="名称">
              <j-input placeholder="输入名称模糊查询" v-model="queryParam.name"></j-input>
            </a-form-item>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增时段</a-button>
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
          <!--          <a @click="positiveOrLeave(record.id,1)" >移除</a>-->

        </span>

        <span slot="action1" slot-scope="text, record">
          {{record.time1Start}}-{{record.time1End}}
        </span>

        <span slot="action2" slot-scope="text, record">
          {{record.time2Start}}-{{record.time2End}}
        </span>

        <span slot="action3" slot-scope="text, record">
          {{record.time3Start}}-{{record.time3End}}
        </span>

        <span slot="action4" slot-scope="text, record">
          {{record.time4Start}}-{{record.time4End}}
        </span>

        <span slot="action5" slot-scope="text, record">
          {{record.time5Start}}-{{record.time5End}}
        </span>

        <span slot="action6" slot-scope="text, record">
          {{record.time6Start}}-{{record.time6End}}
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <confine-modal ref="modalForm" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import JInput from '@/components/panther/JInput'
  import ConfineModal from './modules/ConfineModal'
  import {PantherListMixin} from '@/mixins/PantherListMixin'

  export default {
    name: "ConfineList",
    mixins: [PantherListMixin],
    components: {
      JInput,
      ConfineModal
    },
    data() {
      return {
        description: '这是出入时段管理页面',
        queryParam: {workingStatus:0},
          columns: [
          {
            title: '名称',
            align: "center",
            dataIndex: 'name',
            width: 80
          },
          {
            title: '时段1',
            align: "center",
            width: 80,
            dataIndex: 'action1',
            scopedSlots: {customRender: 'action1'},
          },
          {
            title: '时段2',
            align: "center",
            width: 80,
            dataIndex: 'action2',
            scopedSlots: {customRender: 'action2'},
          },

          {
            title: '时段3',
            align: "center",
            width: 80,
            dataIndex: 'action3',
            scopedSlots: {customRender: 'action3'},
          },
          {
            title: '时段4',
            align: "center",
            width: 80,
            dataIndex: 'action4',
            scopedSlots: {customRender: 'action4'},
          },
          {
            title: '时段5',
            align: "center",
            width: 80,
            dataIndex: 'action5',
            scopedSlots: {customRender: 'action5'},
          },
          {
            title: '时段6',
            align: "center",
            width: 80,
            dataIndex: 'action6',
            scopedSlots: {customRender: 'action6'},
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
          list: "/confine/list",
          delete: "/confine/delete",
          deleteBatch: "/confine/deleteBatch",
          queryById: "/confine/queryById"
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