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
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="0">未激活</a-select-option>
                <a-select-option value="1">已激活</a-select-option>
                <a-select-option value="2">不在线</a-select-option>
                <a-select-option value="3">在线</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="toggleSearchStatus">

          </template>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchDeviceReset(1)" icon="reload" style="margin-left: 8px">重置</a-button>
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增医疗设备</a-button>
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

<!--          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
<!--            <a>删除</a>-->
<!--          </a-popconfirm>-->

<!--          <a-divider type="vertical" />-->

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">详情</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item>
                <a @click="recycleBinVisible=true,sn=record.sn" >传感器数据</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="activateDevice(record.sn,1)" v-if="record.status == 0">激活</a>
                <a href="javascript:;" @click="activateDevice(record.sn,0)" v-if="record.status != 0">取消激活</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="">重启</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="">关机</a>
              </a-menu-item>

            </a-menu>
          </a-dropdown>

        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <device-medical-modal ref="modalForm" @ok="modalFormOk"/>

    <temperature-sensor-modal :visible.sync="recycleBinVisible" :sn="sn" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import JInput from '@/components/panther/JInput'
  import DeviceMedicalModal from './modules/DeviceMedicalModal'
  import TemperatureSensorModal from './modules/TemperatureSensorModal'
  import {PantherListMixin} from '@/mixins/PantherListMixin'

  export default {
    name: "DeviceMedicalList",
    mixins: [PantherListMixin],
    components: {
      JInput,
      DeviceMedicalModal,
      TemperatureSensorModal
    },
    data() {
      return {
        description: '这是医疗设备信息页面',
        queryParam: {type:1},
        recycleBinVisible: false,
        sn: '',
          columns: [
          {
            title: '所属公司',
            align: "center",
            dataIndex: 'deptName',
            width: 80
          },
          {
            title: 'SN号',
            align: "center",
            dataIndex: 'sn',
            width: 80
          },
          {
            title: '名称',
            align: "center",
            width: 80,
            dataIndex: 'name'
          },
          {
            title: '设备IP',
            align: "center",
            width: 80,
            dataIndex: 'ip'
          },
          {
            title: '状态',
            align: "center",
            width: 80,
            dataIndex: 'statusName'
          },
          {
            title: '级别',
            align: "center",
            width: 80,
            dataIndex: 'level'
          },
          // {
          //   title: '温湿传感器状态',
          //   align: "center",
          //   width: 80,
          //   dataIndex: 'temperatureHumiditySensorStatus',
          //   customRender: function (text) {
          //     if(text=='1') {
          //       return "正常";
          //     }
          //     if(text=='2') {
          //       return "异常";
          //     }
          //   }
          // },
          // {
          //   title: '微粒传感器状态',
          //   align: "center",
          //   width: 80,
          //   dataIndex: 'particleSensorStatus',
          //   customRender: function (text) {
          //     if(text=='1') {
          //       return "正常";
          //     }
          //     if(text=='2') {
          //       return "异常";
          //     }
          //   }
          // },
          // {
          //   title: '微风传感器状态',
          //   align: "center",
          //   width: 80,
          //   dataIndex: 'windSpeedSensorStatus',
          //   customRender: function (text) {
          //     if(text=='1') {
          //       return "正常";
          //     }
          //     if(text=='2') {
          //       return "异常";
          //     }
          //   }
          // },
          // {
          //   title: '气压传感器状态',
          //   align: "center",
          //   width: 80,
          //   dataIndex: 'pressureSensorStatus',
          //   customRender: function (text) {
          //     if(text=='1') {
          //       return "正常";
          //     }
          //     if(text=='2') {
          //       return "异常";
          //     }
          //   }
          // },
          {
            title: '描述',
            align: "center",
            width: 80,
            dataIndex: 'remark'
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
          activateDevice: "/device/activateDevice"
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