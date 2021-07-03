<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
<!--      <a-button @click="handleAdd" type="primary" icon="plus">新增人脸信息</a-button>-->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel"/>
            下发
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
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

        <span slot="action" slot-scope="text, record">

          <a href="javascript:;" @click="handleDetail(record)">查看二维码</a>

           <a-divider type="vertical" />

          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>

        </span>

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.url)" icon="user"/>
          </div>
        </template>

      </a-table>
    </div>
    <!-- table区域-end -->

    <admin-pass-modal ref="modalForm" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import AdminPassModal from './modules/AdminPassModal'
  import JInput from '@/components/panther/JInput'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import {getFileAccessHttpUrl,postAction} from '@/api/manage';

  export default {
    name: "AdminPassList",
    mixins: [PantherListMixin],
    components: {
      AdminPassModal,
      JInput
    },
    data() {
      return {
        description: '这是会员二维码页面',
        queryParam: {},
          columns: [
          {
            title: 'SN号',
            align: "center",
            dataIndex: 'sn',
            width: 80
            // sorter: true
          },
          {
            title: '二维码内容',
            align: "center",
            width: 80,
            dataIndex: 'content'
          },
          {
            title: '有效时间',
            align: "center",
            dataIndex: 'validTime',
            width: 80
            // sorter: true
          },
          {
            title: '二维码',
            align: "center",
            width: 80,
            dataIndex: 'avatar',
            scopedSlots: {customRender: "avatarslot"}
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
          list: "/admin/pass/list",
          delete: "/admin/pass/delete",
          deleteBatch: "/admin/pass/deleteBatch",
          queryById: "/admin/pass/queryById"
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
          this.issue();
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
      issue(){
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        } else {
          var that = this;
          var formData = new FormData();
          formData.append("ids",this.selectedRowKeys);
          postAction(that.url.issueBatch,formData).then((res) => {
            if (res.success) {
              that.$message.success(res.message);
            }
          }).catch((err) => {
            this.$message.error('下发失败！');
          });
        }
      }

    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>