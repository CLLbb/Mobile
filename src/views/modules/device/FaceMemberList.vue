<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="用户名称">
              <a-input placeholder="输入用户名称模糊查询" v-model="queryParam.userName"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="12">
            <a-form-item label="会员号">
              <a-input placeholder="输入会员号模糊查询" v-model="queryParam.memberNo"></a-input>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增会员信息</a-button>
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
          <a @click="handleEdit(record)" >编辑</a>

          <a-divider type="vertical" />

          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>

          <a-divider type="vertical" />

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="activateDevice(record.sn,1)" v-if="record.status == 0">激活</a>
                <a href="javascript:;" @click="activateDevice(record.sn,0)" v-if="record.status != 0">冻结</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="issuedDevicePayEvent(record)">发起支付</a>
              </a-menu-item>

              <a-menu-item>
                <a @click="recycleBinVisible=true,sn=record.sn,type=7" >支付接收状态</a>
              </a-menu-item>

            </a-menu>
          </a-dropdown>

        </span>

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.url)" icon="user"/>
          </div>
        </template>

      </a-table>
    </div>
    <!-- table区域-end -->

    <face-member-modal ref="modalForm" @ok="modalFormOk"/>
    <device-command-ack-modal :visible.sync="recycleBinVisible" :sn="sn" :type="type" @ok="modalFormOk"/>
    <device-pay-event-modal ref="modalForm1" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import JInput from '@/components/panther/JInput'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import {getFileAccessHttpUrl,postAction} from '@/api/manage';
  import FaceMemberModal from './modules/FaceMemberModal'
  import DeviceCommandAckModal from '../brakemachine/modules/DeviceCommandAckModal'
  import DevicePayEventModal from './modules/DevicePayEventModal'

  export default {
    name: "FaceMemberList",
    mixins: [PantherListMixin],
    components: {
      JInput,
      DevicePayEventModal,
      DeviceCommandAckModal,
      FaceMemberModal
    },
    data() {
      return {
        description: '这是会员信息页面',
        queryParam: {},
        recycleBinVisible: false,
        sn:'',
        type:7,
          columns: [
          {
            title: 'SN号',
            align: "center",
            dataIndex: 'sn',
            width: 80
          },
          {
            title: '用户姓名',
            align: "center",
            dataIndex: 'userName',
            width: 80
          },
          {
            title: '会员号',
            align: "center",
            dataIndex: 'memberNo',
            width: 80
          },
          {
            title: '用户头像',
            align: "center",
            width: 80,
            dataIndex: 'avatar',
            scopedSlots: {customRender: "avatarslot"}
          },
          // {
          //   title: '下发状态',
          //   align: "center",
          //   width: 80,
          //   dataIndex: 'status',
          //   customRender: function(text) {
          //     if (text == 0) {
          //       return '下发中'
          //     } else if (text == 1) {
          //       return '成功'
          //     } else if (text == 2) {
          //       return '失败'
          //     }
          //   }
          // },
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
          list: "/face/member/list",
          delete: "/face/member/delete",
          deleteBatch: "/face/member/deleteBatch",
          queryById: "/face/member/queryById",
          issueBatch:"/face/member/issueBatch",
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
      },
      issuedDevicePayEvent: function (record) {
        this.$refs.modalForm1.edit(record);
        this.$refs.modalForm1.title = "发起支付";
        this.$refs.modalForm1.disableSubmit = false;
      },

    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>