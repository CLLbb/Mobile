<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <!-- <a-form layout="inline" @keyup.enter.native="searchQuery"> -->
        <a-form layout="inline" @keyup.enter="searchform">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="姓名">
              <!--<a-input placeholder="请输入账号查询" v-model="queryParam.username"></a-input>-->
              <a-input placeholder="输入姓名查询" v-model="searchdate"></a-input>
            </a-form-item>
          </a-col>
           <a-button type="primary" icon="search" @click="searchform(searchdate)">查询</a-button>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">添加用户</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('用户信息')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- <a-button type="primary" icon="hdd" @click="recycleBinVisible=true">回收站</a-button> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel"/>
            删除
          </a-menu-item>
          <!-- <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')"/>
            下发
          </a-menu-item> -->
          <a-menu-item @click="handleChangePassword()">
            <a-icon type="lock" />
            批量下发
          </a-menu-item>
          <!-- <a-menu-item @click="Issure()">
             <a-icon type="lock"/>
            下发
          </a-menu-item> -->
          <!-- <a-menu-item key="3">
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
<!-- 加插槽 -->
      <a-table
        ref="table"
        bordered
        size="middle"
        :rowKey="record=>record.Usersex"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
        >
         <span slot="switchUsersex" slot-scope='record'>
        <span v-if='record===1'>男</span>
        <span v-if='record===2'>女</span>
        </span>
     

        <template slot="avatarslot" slot-scope="text, record">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" >编辑</a>

          <!-- <a-divider type="vertical" /> -->

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleAgentSettings(record)">下发</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <user-modal  ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" :phoneList='phoneList' :roleList="roleList" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal" :roleList="roleList"></sys-user-agent-modal>

    <!-- 用户回收站 -->
    <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import UserModal from './modules/UserModalNewtwo'
  import PasswordModal from './modules/issume'
  import {putAction,getFileAccessHttpUrl} from '@/api/manage';
  import {frozenBatch} from '@/api/api'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import SysUserAgentModal from "./modules/Drop";
  import JInput from '@/components/panther/JInput'
  import UserRecycleBinModal from './modules/UserRecycleBinModal'
  import {deviceList,getVisiterlist,IssureAll} from '@/api/user'

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
        roleList:[],
        description: '这是用户列表页面',
        queryParam: {},
        recycleBinVisible: false,
        columns: [
          {
            title: '用户姓名',
            align: "center",
            width: 80,
            dataIndex: 'userName',
          },
          {
            title: '头像',
            align: "center",
            // width: 120,
            dataIndex: 'avatar',
            scopedSlots: {customRender: "avatarslot"}
          },

          {
            title: '性别',
            align: "center",
            // width: 80,
            dataIndex: 'userSex',
            key:'switchUsersex',
            scopedSlots:{customRender:'switchUsersex'}
          },
          {
            title: '网龄',
            align: "center",
            // width: 100,
            dataIndex: 'netAge'
          },
          {
            title: '手机号码',
            align: "center",
            // width: 100,
            dataIndex: 'userPhone'
          },
           {
            title: '用户标签',
            align: "center",
            // width: 100,
            dataIndex: 'userTag'
          },
           {
            title: '年龄',
            align: "center",
            // width: 100,
            dataIndex: 'age'
          },
           {
            title: '实时话费',
            align: "center",
            // width: 100,
            dataIndex: 'telBill'
          },
           {
            title: '账户余额',
            align: "center",
            // width: 100,
            dataIndex: 'accountBlance'
          },
           {
            title: '近3月消费',
            align: "center",
            // width: 100,
            dataIndex: 'consu3month'
          },
          {
            title: 'ARUP值',
            align: "center",
            // width: 100,
            dataIndex: 'arupVal'
          },
          {
            title: '已订购产品',
            align: "center",
            // width: 100,
            dataIndex: 'orderProduct'
          },
          {
            title: '语音',
            align: "center",
            // width: 100,
            dataIndex: 'voice'
          },
          {
            title: '流量',
            align: "center",
            // width: 100,
            dataIndex: 'flow'
          },
          {
            title: '往月欠费',
            align: "center",
            // width: 100,
            dataIndex: 'arrears'
          },
          {
            title: '终端产品',
            align: "center",
            // width: 100,
            dataIndex: 'terminal'
          },
          {
            title: '家庭宽带',
            align: "center",
            // width: 100,
            dataIndex: 'homeBroad'
          },
          {
            title: '亲情号',
            align: "center",
            // width: 100,
            dataIndex: 'qinqingHao'
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
          list: "/operate/user/list",
          delete: "/sys/user/delete",
          deleteBatch: "/operate/user/deleteUserBatch",
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
     
      this.deviceList2()
    },
    methods: {
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar)
      },

      // 表单搜索
      searchform(){
        let form=this.searchdate;
        console.log(form);
        getVisiterlist(form).then(res=>{
          this.dataSource=res.result.records
        })
      },

      // 获取设备列表
      deviceList2(){
        deviceList().then(res=>{
          this.roleList=res.result.records;
        })
      },
      // 获取电话号码
      Issure(){
        this.phoneList=this.selectionRows.map(({userPhone})=>(userPhone));
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