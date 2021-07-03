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

          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>

<!--          <a-divider type="vertical" />-->

<!--          <a href="javascript:;" @click="handleDetail(record)">详情</a>-->

        </span>

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.url)" icon="user"/>
          </div>
        </template>

      </a-table>
    </div>
    <!-- table区域-end -->

  </a-card>
</template>

<script>
  import JInput from '@/components/panther/JInput'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import {getFileAccessHttpUrl,postAction} from '@/api/manage';

  export default {
    name: "DeviceList",
    mixins: [PantherListMixin],
    components: {
      JInput
    },
    data() {
      return {
        description: '这是检票记录页面',
        queryParam: {},
          columns: [
          {
            title: 'SN号',
            align: "center",
            dataIndex: 'sn',
            width: 80
          },
          {
            title: '影院名称',
            align: "center",
            width: 80,
            dataIndex: 'cinemaName'
          },
          {
            title: '影片名称',
            align: "center",
            dataIndex: 'filmName',
            width: 80
          },
          {
            title: '电影票编码',
            align: "center",
            dataIndex: 'filmTicketCode',
            width: 80
          },
          {
            title: '是否通过',
            align: "center",
            dataIndex: 'isLetThrough',
            width: 80,
            customRender: function (text) {
              if(text == 1) {
                return "通过";
              }else {
                return "未通过";
              }
            }
          },
          {
            title: '操作类型',
            align: "center",
            dataIndex: 'operation',
            width: 80,
            customRender: function (text) {
              if(text==1) {
                return "售票";
              }else if (text == 2){
                return "退票";
              }else if (text == 3){
                return "预售";
              }else{
                return "补登";
              }
            }
          },
          {
            title: '操作时间',
            align: "center",
            dataIndex: 'operationTime',
            width: 80
          },
          {
            title: '电影票金额',
            align: "center",
            dataIndex: 'price',
            width: 80
          },
          {
            title: '影厅名称',
            align: "center",
            dataIndex: 'screenName',
            width: 80
          },
          {
            title: '电影票服务费',
            align: "center",
            dataIndex: 'service',
            width: 80
          },
          {
            title: '场次编码',
            align: "center",
            dataIndex: 'sessionCode',
            width: 80
          },
          {
            title: '秘钥启用时间',
            align: "center",
            dataIndex: 'startTime',
            width: 80
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
          list: "/check/ticket/record/list",
          delete: "/check/ticket/record/delete",
          deleteBatch: "/check/ticket/record/deleteBatch",
          queryById: "/check/ticket/record/queryById",
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