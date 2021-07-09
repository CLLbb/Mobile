<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <!-- <div class="table-page-search-wrapper">
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
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div> -->
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

        <template slot="avatarslot" slot-scope="text, record">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>

      </a-table>
    </div>
    <!-- table区域-end -->

    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>

    <!-- 用户回收站 -->
    <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk"/>
  </a-card>
</template>

<script>
  import UserModal from './modules/UserModalNew'
  import PasswordModal from './modules/PasswordModal'
  import {putAction,getFileAccessHttpUrl} from '@/api/manage';
  import {frozenBatch} from '@/api/api'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  import SysUserAgentModal from "./modules/SysUserAgentModal";
  import JInput from '@/components/panther/JInput'
  import UserRecycleBinModal from './modules/UserRecycleBinModal'
import {getuserlist} from '@/api/user.js'

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
        description: '这是历史数据界面',
        queryParam: {},
        recycleBinVisible: false,
        columns: [
          {
            title: '进店时间',
            align: "center",
            dataIndex: 'orgEventTime',
            width: 120,
          },
          {
            title: '照片',
            align: "center",
            width: 120,
            dataIndex: 'avatar',
            scopedSlots: {customRender: "avatarslot"}
          },
          // userImg
           {
            title: '姓名',
            align: "center",
            width: 100,
            dataIndex: 'userName',
          },
          {
            title: '手机号',
            align: "center",
            width: 80,
            dataIndex: 'phone',
          },
          {
            title: '近三月消费',
            align: "center",
            width: 100,
            dataIndex: 'consu3Month'
          },
          {
            title: '网龄',
            align: "center",
            width: 100,
            dataIndex: 'netAge'
          },
          {
            title: '已订购产品',
            align: "center",
            width: 180,
            dataIndex: 'orderProduct'
          },
        ],
		// 表格数据
		data:[],
        url: {
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/operate/accessLog/list",
          delete: "/sys/user/delete",
          deleteBatch: "/operate/user/deleteUserBatch",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "sys/user/importExcel",
          positiveLeave: "sys/user/positiveOrLeave",
        },
      }
    },
	created(){
		this.getlist();
	},
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
	// 测试方法
	getlist(){
    console.log('ces')

		getuserlist().then(res=>{
			this.data=res.result.records;
			console.log(this.data)
		})
	},
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
      handleChangePassword(username) {
        this.$refs.passwordmodal.show(username);
      },
      handleAgentSettings(username){
        this.$refs.sysUserAgentModal.agentSettings(username);
        this.$refs.sysUserAgentModal.title = "用户代理人设置";
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