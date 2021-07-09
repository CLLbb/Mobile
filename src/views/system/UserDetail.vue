<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
           <a-col :md="6" :sm="12">
            <a-form-item label="电话号码">
              <a-input placeholder="输入用户号码进行查询" v-model="searchdate"></a-input>
            </a-form-item>
          </a-col>
           <a-button type="primary" icon="search" @click="searchform(searchdate)">查询</a-button>
        </a-row>
      </a-form>
    </div>

    <!-- 详细信息-begin -->
		 <a-row :gutter="24">
          <a-col :md="24" :sm="4">
            <p class="title2">详细信息</p>
          </a-col>
     </a-row>
      <a-row :gutter="10">
         <a-col :md="7" :sm="4">
            <ul class="userinfo">
              <li>姓名：{{datedetail.userName}}</li>
              <li>手机号：{{datedetail.userPhone}}</li>
              <li>实时话费：{{datedetail.telBill}}</li>
              <li>账户余额：{{datedetail.accountBlance}}</li>
              <li>网龄：{{datedetail.netAge}}</li>
              <li>近三月消费：{{datedetail.consu3month}}元</li>
              <li>ARUR值：{{datedetail.arupVal}}</li>
              <li>用户类型：{{datedetail.userType}}</li>
              <a-row >
                  <a-col :md="6" :sm="16">
                    <li class="product">已订产品：</li>
                  </a-col>
                  <a-col :md="12" :sm="20" style="margin-left:-20px">
                     <li>{{datedetail.orderProduct}}</li>
                  </a-col>
              </a-row>
            </ul>
          </a-col>
           <a-col :md="6" :sm="4">
            <ul class="userinfo">
              <li>往月欠费：{{datedetail.arrears}}</li>
              <li>终端信息：{{datedetail.terminal}}</li>
              <a-row >
                  <a-col :md="7" :sm="16">
                    <li class="product">套餐余量：</li>
                  </a-col>
                  <a-col :md="12" :sm="20" style="margin-left:-20px">
                     <li>语音：{{datedetail.voice}}</li>
                     <li>流量：{{datedetail.flow}}</li>
                  </a-col>
              </a-row>
            </ul>
          </a-col>
           <a-col :md="6" :sm="4">
            <ul class="userinfo">
              <li>家庭宽带：{{datedetail.homeBroad}}</li>
               <a-row >
                  <a-col :md="7" :sm="16">
                    <li class="product">亲情号：</li>
                  </a-col>
                  <a-col :md="12" :sm="20" style="margin-left:-20px">
                     <li v-for="item in phonenumber" :key="item.id">{{item}}</li>
                  </a-col>
              </a-row>
            </ul>
          </a-col>
           <a-col :md="2" :sm="4" class="img1">
             <!-- <img src="../../assets/girl.jpg" alt=""> -->
             <img  :src="getAvatarView(datedetail.avatar)" class="bottom_img" />
          </a-col>
        </a-row>
    <!-- 详细信息-end -->

	<!-- 人员列表begin -->
	<a-row :gutter="24" >
		<a-col :md="24" :sm="24">
			<p class="title1">用户画像</p>
		</a-col>
	</a-row>
		<a-row :gutter="24">
			<a-col :md="10" :sm="10">
        <span>用户标签</span>
				<div class="img2">
          <a-row :gutter="24">
            <a-col :md="8" :sm="8">
              	<img src="../../assets/people.png" alt="" class="bottom_img">
            </a-col> 
			      <a-col :md="4" :sm="4">
              <div class="t1">
                <p v-for="item in userTag" :key='item.id'>{{item}}</p>
              </div>
            </a-col>
          </a-row>
				</div>
			</a-col>
			<a-col :md="12" :sm="12">
				 <span>应用使用程度</span>
         <!-- table区域-begin -->
          <div>
            <a-table
              ref="table"
              bordered
              size="middle"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource1"
              :pagination="ipagination"
              :loading="loading"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              @change="handleTableChange"
              style="margin:20px 0px">
              <template slot="avatarslot" slot-scope="text, record">
                <div class="anty-img-wrap">
                  <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
                </div>
              </template>

            </a-table>
          </div>
         <!-- table区域-end -->
			</a-col>
	</a-row>
  <a-row :gutter="24">
      <a-col :md="24" :sm="4">
        <p class="title2">产品营销推荐</p>
      </a-col>
  </a-row>
  <a-row :gutter="24">
      <a-col :md="24" :sm="4">
        <!-- table2区域-begin -->
          <div>
            <a-table
              ref="table"
              bordered
              size="middle"
              rowKey="id"
              :columns="columns2"
              :dataSource="dataSource2"
              :pagination="ipagination"
              :loading="loading"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              @change="handleTableChange">

              <template slot="avatarslot" slot-scope="text, record">
                <div class="anty-img-wrap">
                  <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
                </div>
              </template>

              <span slot="action" slot-scope="text, record">

                <a-popconfirm title="确定发送短信吗?" @confirm="() => handleDelete(record.CAMPSEG_ID)">
                  <a>下发短信</a>
                </a-popconfirm>
              </span>
            </a-table>
          </div>
         <!-- table2区域-end -->
      </a-col>
  </a-row>
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
  import {getVisiterdetail} from '@/api/user'

  import {getuserinfo} from '@/api/user'

  export default {
    name: "Userdate",
    mixins: [PantherListMixin],
    components: {
      SysUserAgentModal,
      UserModal,
      PasswordModal,
      JInput,
      UserRecycleBinModal
    },
    mounted(){
      this.getinfo();
    },
    data() {
      return {
        description: '用户详情界面',
        searchdate:this.$route.query.msgKey,
        queryParam: {},
        recycleBinVisible: false,
        url: {
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/sys/user/list",
          delete: "/sys/user/delete",
          deleteBatch: "/sys/user/deleteBatch",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "sys/user/importExcel",
          positiveLeave: "sys/user/positiveOrLeave",
        },
        // 表1数据
        columns: [
          {
            title: '排序',
            align: "center",
            dataIndex: 'username',
            width: 120,
          },
          {
            title: 'APP名称',
            align: "center",
            width: 120,
            dataIndex: 'avatar',
          },
           {
            title: '使用程度',
            align: "center",
            width: 100,
            dataIndex: 'realname',
          },
          {
            title: '使用时长',
            align: "center",
            width: 80,
            dataIndex: 'sex_dictText',
          },
        ],
      // 表2数据
        columns2: [
          {
            title: '推荐活动',
            align: "center",
            dataIndex: 'CAMPSEG_NAME',
            width: 120,
          },
          {
            title: '营销话术',
            align: "center",
            width: 100,
            dataIndex: 'RECM_STATS',
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 170
          }

        ],
      // 详细信息数据
      datedetail:{},
      phonenumber:'',
      userTag:'',
      // 表格绑定数据
      dataSource1:[],
      dataSource2:[],
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

      // 表单搜索
      searchform(){
        let form=this.searchdate;
        getVisiterdetail(form).then(res=>{
          this.datedetail=res.result;
          var strphone=res.result.result.qinqingHao;
          this.phonenumber=strphone.split(",");
        })
      },
      
      // 获取信息userTag
       getinfo(){
         if(this.searchdate){
           this.searchform();
         }else{
           getuserinfo().then(res=>{
            this.datedetail=res.result;
            var strphone=res.result.qinqingHao;
            this.phonenumber=strphone.split(",");
            var struserTag=res.result.userTag;
            this.userTag=struserTag.split(",");
        })
         }
      },

      // 获取首页传递过来的电话号码
      // 下发短信
      handleDelete(id){
        console.log(id)
      },
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar)
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
      passwordModalOk() {
        //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
      }
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
  .station{
  position:relative;
  background-color: rgb(255, 255, 255);
  height: 750px;
}
.title1{
	background: rgb(166, 218, 238);
	height: 40px;
	padding: 4px;
	border-radius: 2px;
	line-height: 40px;
}
.title2{
	background: rgb(166, 218, 238);
	height: 40px;
	padding: 4px;
	border-radius: 2px;
	line-height: 40px;
}
.userinfo{
	list-style: none;
	padding: 0px;
}
.userinfo li{
	line-height: 40px;
	margin-left:20px;
}
.product{
	position:relative;
}
.userinfo2{
	list-style: none;
	padding: 0px;
	position:absolute;
	left:60px;
	top:0px
}
.top_img{
	width: 150px;
	height: 150px;
	background-size: cover;
	border-radius: 10px;
	position:absolute;
	left:200px
}
.single_info{
	position: relative;
}
.img1 img{
  width: 60%;
  height: 60%;
}
.img2 {
	text-align: center;
}
.img2 img{
	width:100%;
	margin-bottom: 20px;
}
.img2{
  position: relative;
}
.t1 p{
  border: 1px solid #1296db;
  width:100%;
}
.t1{
  margin-top: 50px;
}
.bottom_img img{
  width:80px;
  height: 100%;
}
</style>