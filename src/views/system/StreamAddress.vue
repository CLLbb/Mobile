<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter="searchform">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="名称">
              <a-input placeholder="输入名称查询" v-model="searchdate"></a-input>
            </a-form-item>
          </a-col>
           <a-button type="primary" icon="search" @click="searchform(searchdate)">查询</a-button>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">添加地址</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('用户信息')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-button type="primary" icon="hdd" @click="recycleBinVisible=true">回收站</a-button> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel"/>
            删除
          </a-menu-item>
          <!-- <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')"/>
            下发
          </a-menu-item>
          <a-menu-item @click="handleChangePassword()">
            <a-icon type="lock" />
            批量下发
          </a-menu-item>
          <a-menu-item @click="Issure()">
             <a-icon type="lock"/>
            下发
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="unlock" @click="batchFrozen('1')"/>
            解冻
          </a-menu-item> -->
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>
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
        @change="handleTableChange"
        >     

        <template slot="avatarslot" slot-scope="text, record">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />

          <!-- <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDelete(record.id)">删除</a>
              </a-menu-item>
			  <a-menu-item>
          </a-menu-item>
            </a-menu>
          </a-dropdown> -->
		  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <user-modal  ref="modalForm" @ok="modalFormOk" :deviceList="deviceList"></user-modal>

    <!-- <password-modal ref="passwordmodal" :phoneList='phoneList' :roleList="roleList" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal" :roleList="roleList"></sys-user-agent-modal> -->

    <!-- 用户回收站 -->
    <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import UserModal from './modules/StreamAddressModal'
  import PasswordModal from './modules/issume'
  import {putAction,getFileAccessHttpUrl} from '@/api/manage';
  import {frozenBatch} from '@/api/api'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import SysUserAgentModal from "./modules/Drop";
  import JInput from '@/components/panther/JInput'
  import UserRecycleBinModal from './modules/UserRecycleBinModal'
  import {getAddressList,deviceList,deleAddress,searchAddress,deviceListUser} from '@/api/user'

  export default {
    name: "UserList",
    mixins: [PantherListMixin],
    components: {
      SysUserAgentModal,
      UserModal,
      PasswordModal,
      JInput,
      UserRecycleBinModal
    },
    data() {
      return {
        // 批量下发数据
        phoneList:[],
        searchdate:'',
        deviceList:[],
        description: '这是获取视频流地址页面',
        queryParam: {},
        recycleBinVisible: false,
        columns: [
          {
            title: '设备名称',
            align: "center",
            width: 80,
            dataIndex: 'name',
          },
          {
            title: '设备位置',
            align: "center",
            dataIndex: 'devicePosition',
          },
          {
            title: '流服务地址',
            align: "center",
            // width: 100,
            dataIndex: 'webrtcstreamerAddr'
          },
          {
            title: '推流地址',
            align: "center",
            // width: 100,
            dataIndex: 'rtspIp'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            // width: 170
          }
        ],
        url: {
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/operate/streamAddr/list",
          delete: "/operate/streamAddr/delete",
          deleteBatch: "/operate/streamAddr/deleteBatch",
          exportXlsUrl: "operate/user/exportXls",
          importExcelUrl: "operate/user/importExcel",
          positiveLeave: "sys/user/positiveOrLeave",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    mounted(){
      this.getAddress(),
       this.deviceList2()
    },
    methods: {
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar)
      },

      //视频流地址搜索
      searchform(){
        let form=this.searchdate;
        console.log(form);
        searchAddress(form).then(res=>{
          this.dataSource=res.result.records
        })
      },

      // 获取流地址列表
      getAddress(){
        getAddressList().then(res=>{
          this.dataSource=res.result.records
        })
      },
       // 获取设备列表
      deviceList2(){
        deviceListUser().then(res=>{
          this.deviceList=res.result.records;
          console.log('设备列表',res)
        })
      },

	//   删除操作
	handleDelete(id){
		deleAddress(id).then(res=>{
			this.getAddress()
		})
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
          // 删除ids
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
      handleChangePassword() {
        this.$refs.passwordmodal.show();
        this.Issure();
        console.log('this.$refs.passwordmodal',this.$refs.passwordmodal);
        console.log('this.$refs.passwordmodal.show',this.$refs.passwordmodal.show);

      },
      handleAgentSettings(username){
        this.$refs.sysUserAgentModal.agentSettings(username);
        this.$refs.sysUserAgentModal.title = "设备信息同步";
      },
      passwordModalOk() {
        //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
      }
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>