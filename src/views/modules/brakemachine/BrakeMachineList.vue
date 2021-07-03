<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="名称">
              <a-input placeholder="输入名称模糊查询" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchDeviceReset(3)" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">新增闸机</a-button>
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
                <a @click="recycleBinVisible=true,sn=record.sn,type=6" >指令接收状态</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="issuedDeviceCommand(record.sn,1)">左开闸</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="issuedDeviceCommand(record.sn,2)">左闸常开</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="issuedDeviceCommand(record.sn,3)">左关闸</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="issuedDeviceCommand(record.sn,4)">右开闸</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="issuedDeviceCommand(record.sn,5)">右闸常开</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="issuedDeviceCommand(record.sn,6)">右关闸</a>
              </a-menu-item>

            </a-menu>
          </a-dropdown>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <brake-machine-modal ref="modalForm" @ok="modalFormOk"/>
    <device-command-ack-modal :visible.sync="recycleBinVisible" :sn="sn" :type="type" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import JInput from '@/components/panther/JInput'
  import BrakeMachineModal from './modules/BrakeMachineModal'
  import DeviceCommandAckModal from './modules/DeviceCommandAckModal'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import { postAction } from '../../../api/manage'

  export default {
    name: "BrakeMachineList",
    mixins: [PantherListMixin],
    components: {
      JInput,
      DeviceCommandAckModal,
      BrakeMachineModal
    },
    data() {
      return {
        description: '这是闸机管理页面',
        queryParam: {type:3},
        recycleBinVisible: false,
        sn:'',
        type:6,
          columns: [
          {
            title: 'SN号',
            align: "center",
            dataIndex: 'sn',
            width: 80
          },
          {
            title: '名称',
            align: "center",
            dataIndex: 'name',
            width: 80
          },
          {
            title: '闸机IP',
            align: "center",
            width: 80,
            dataIndex: 'ip'
          },
          {
            title: '闸机对接IP',
            align: "center",
            width: 80,
            dataIndex: 'localIp'
          },
          {
            title: '关联影厅',
            align: "center",
            width: 80,
            dataIndex: 'screens'
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
          list: "/device/list",
          delete: "/device/delete",
          deleteBatch: "/device/deleteBatch",
          queryById: "/device/queryById",
          activateDevice: "/device/activateDevice",
          issuedDeviceCommand: "/device/issuedDeviceCommand"
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
      issuedDeviceCommand: function (sn,subtype) {
        var that = this;
        const formData = new FormData();
        formData.append("sn",sn);
        formData.append("type",6);
        formData.append("subtype",subtype);
        postAction(that.url.issuedDeviceCommand, formData).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },

    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>