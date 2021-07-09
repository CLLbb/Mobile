<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <!-- <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="手机号查询">
              <j-input placeholder="请输入手机号" v-model="queryParam.username"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div> -->
    <!-- 监控-begin -->
    <a-row :gutter="24">
      <a-col :md="14" :sm="14">
        <p class="title1">实时监控</p>
        <div class="station">
          <template v-for="(playRow,index) of FlvPlayerList">
            <div :class="'children'+index" v-if="playRow.url" :key="index">
              <span>{{ playRow.title }}</span>
              <VueXgplayer :config="playRow" format="flv" @player="FlvPlayer = $event" />
            </div>
          </template>
        </div>
      </a-col>

      <a-col :md="10" :sm="10">
          <el-row >
            <div class="single_info" style="margin-bottom:20px">
                <p class="title2">人员信息</p>
                <img :src="getAvatarView(userdate2.avatar)" class="top_img" />
                <ul class="userinfo">
                  <li>姓名：{{ userdate2.userName }}</li>
                  <li>手机号：{{ userdate2.phone }}</li>
                  <!-- <li>实时话费：{{ userdate2.telBill }}</li>
                  <li>账户余额：{{ userdate2.accountBlance }}</li> -->
                  <li>网龄：{{ userdate2.netAge }}</li>
                  <li>近三个月消费：{{ userdate2.consu3Month }}元</li>
                  <li>ARUP值：{{ userdate2.arupVal }}</li>
                  <li>用户类型：{{ userdate2.userType }}</li>
                  <li class="product">
                    已订产品：
                    <ul class="userinfo2">
                      <li v-for="item in shopProduct" :key="item.id">{{ item }}</li>
                    </ul>
                  </li>
                </ul>
              </div>
          </el-row>
          <!-- 人员列表begin -->
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <p class="title1">实时抓拍</p>
            </a-col>
          </a-row>

           <!-- 测试 -->
           <a-row :gutter="24">
              <!-- <a-col :md="6" :sm="6" v-for="item in userInfoList" :key="item.id" @click="gotodetail(item.phone)"> -->
                <a-carousel autoplay  style="background-color:#ccc;margin:0px 20px 20px 20px">
                   <div class="imgslide" v-for="item in userInfoList" :key="item.id">
                    <img :src="getAvatarView(item.avatar)" class="bottom_img" />
                </div>
                </a-carousel>
              <!-- </a-col> -->
            </a-row>
            <!-- 测试 -->
      <!--    <marquee-text>-->
            <a-row :gutter="24">
              <a-col :md="6" :sm="6" v-for="item in userInfoList" :key="item.id" @click="gotodetail(item.phone)">
                <div class="img">
                  <p>{{ item.orgEventTime }}</p>
                  <img :src="getAvatarView(item.avatar)" class="bottom_img" />
                  <p>{{ item.userName }}</p>
                  <p>{{ item.consu3month }}</p>
                </div>
              </a-col>
            </a-row>
      <!-- </marquee-text>-->
      </a-col>
    </a-row>
    <!-- 监控-end -->
  </a-card>
</template>

<script>
import UserModal from './modules/UserModalNew'
import { getImgList, getAddressList } from '@/api/user'
import PasswordModal from './modules/PasswordModal'
import { putAction, getFileAccessHttpUrl } from '@/api/manage'
import { frozenBatch } from '@/api/api'
import { PantherListMixin } from '@/mixins/PantherListMixin'
import SysUserAgentModal from './modules/SysUserAgentModal'
import JInput from '@/components/panther/JInput'
import UserRecycleBinModal from './modules/UserRecycleBinModal'
import MarqueeText from 'vue-marquee-text-component'

import { getuserinfo } from '@/api/user'

export default {
  name: 'Userdate',
  mixins: [PantherListMixin],
  components: {
    SysUserAgentModal,
    UserModal,
    PasswordModal,
    JInput,
    UserRecycleBinModal,
    MarqueeText
  },
  data() {
    return {
      // 视频显示数量
      children1: false,
      children2: false,
      children3: false,
      children4: false,
      // 视频标题
      address: {
        title1: '',
        title2: '',
        title3: '',
        title4: ''
      },
      description: '实时监控/实时数据画面',
      queryParam: {},
      recycleBinVisible: false,
      imgpath: '',
      url: {
        syncUser: '/process/extActProcess/doSyncUser',
        list: '/sys/user/list',
        delete: '/sys/user/delete',
        deleteBatch: '/sys/user/deleteBatch',
        exportXlsUrl: '/sys/user/exportXls',
        importExcelUrl: 'sys/user/importExcel',
        positiveLeave: 'sys/user/positiveOrLeave'
      },
      // 视频数据
      configFlv: {
        id: 'vs1',
        url: 'http://192.168.1.104/live2?port=9999&app=http_flv&stream=test',
        width: 400,
        height: 300,
        volume: 0.6,
        autoplay: true
      },
      FlvPlayer: null,

      configFlv2: {
        id: 'vs2',
        url: 'http://192.168.1.104/live2?port=9998&app=http_flv&stream=test',
        width: 400,
        height: 300,
        volume: 0.6,
        autoplay: true
      },

      configFlv3: {
        id: 'vs3',
        url: 'http://192.168.1.104/live3?port=9997&app=http_flv&stream=test',
        width: 400,
        height: 300,
        volume: 0.6,
        autoplay: true
      },

      configFlv4: {
        id: 'vs4',
        url: 'http://192.168.1.104/live3?port=9996&app=http_flv&stream=test',
        width: 400,
        height: 300,
        volume: 0.6,
        autoplay: true
      },
    
      timer: null,
      timer2: null,

      // 人员信息数据
      userdate: '',
      userdate2: '',
      shopProduct: [],
      userInfoList: [],
      FlvPlayerList: []
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  mounted() {
    this.getinfo()
    this.getimg()
    this.getinfo2()
    this.getaddress()
  },
  methods: {
    // 视频流地址
    getaddress() {
      getAddressList().then(res => {
        let flv = res.result.records.map(({ addr, name }, index)=> ({
          title: name, url: addr, width: 400,
          id: 'vs' + index,
          height: 300,
          volume: 0.6,
          autoplay: true
        }));
        if(flv.length>=4){
          this.FlvPlayerList=flv.slice(-4)
        }else{
          this.FlvPlayerList=flv.slice(0,4)
        }
      })
    },

    getinfo() {
      let num = 86
      this.timer2 = setInterval(() => {
        getuserinfo(num).then((res) => {
          this.userdate = res.result
          var strProduct = res.result.orderProduct
          this.shopProduct = strProduct.split(',')
          this.imgpath = res.result.avatar
        })
      }, 3000)
    },

    getinfo2() {
      getImgList().then((res) => {
        this.userInfoList = res.result.records.slice(0, 4)
        this.userdate2 = res.result.records[0]
        var strProduct = res.result.records[0].orderProduct
        this.shopProduct = strProduct.split(',')
      })
    },

// 跳转到详情界面
    gotodetail(phone) {
      this.$router.push({
        path: '/operate/user/getById',
        query: {
          key: 'key',
          msgKey: phone
        }
      })
    },
    getimg() {
      this.timer = setInterval(() => {
        getImgList().then((res) => {
          this.userInfoList = res.result.records.slice(0, 4)
          this.userdate2 = res.result.records[0]
        })
      }, 3000)
    },
    getAvatarView: function(avatar) {
      return getFileAccessHttpUrl(avatar)
    },
    handleMenuClick(e) {
      if (e.key == 1) {
        this.batchDel()
      } else if (e.key == 2) {
        this.batchFrozen(2)
      } else if (e.key == 3) {
        this.batchFrozen(1)
      }
    },
    handleFrozen: function(id, status, username) {
      let that = this
      //TODO 后台校验管理员角色
      if ('admin' == username) {
        that.$message.warning('管理员账号不允许此操作！')
        return
      }
      frozenBatch({ ids: id, status: status }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleChangePassword(username) {
      this.$refs.passwordmodal.show(username)
    },
    passwordModalOk() {
      //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
    }
  },
  destroyed() {
    window.clearInterval(this.timer)
    window.clearInterval(this.timer2)
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';

.station {
  position: relative;
  background-color: rgb(255, 255, 255);
  height: 700px;
}
.ant-carousel >>> .slick-slide {
  text-align: center;
}
.imgslide img{
  margin-left: 42%;
  margin-top:20px;
  margin-bottom:20px
}
/* 视频定位 */
.children0 {
  position: absolute;
  left: 0px;
  z-index: 1;
}

.children1 {
  position: absolute;
  left: 420px;
  z-index: 1;
}

.children2 {
  position: absolute;
  top: 380px;
  left: 0px;
  z-index: 1;
}

.children3 {
  position: absolute;
  top: 380px;
  left: 420px;
  z-index: 1;
}

.title1 {
  background: rgb(166, 218, 238);
  height: 40px;
  padding: 4px;
  border-radius: 2px;
  line-height: 40px;
}

.title2 {
  background: rgb(166, 218, 238);
  height: 40px;
  padding: 4px;
  border-radius: 2px;
  line-height: 40px;
}

.userinfo {
  list-style: none;
  padding: 0px;
}

.userinfo li {
  line-height: 40px;
  margin-left: 20px;
}

.product {
  position: relative;
}

.userinfo2 {
  list-style: none;
  padding: 0px;
  position: absolute;
  left: 60px;
  top: 0px;
}

.bottom_img {
  width: 120px;
  height: 120px;
  background-size: cover;
  border-radius: 10px;
}

.top_img {
  width: 150px;
  height: 150px;
  background-size: cover;
  border-radius: 10px;
  position: absolute;
  left: 200px;
}

.single_info {
  position: relative;
}

.img {
  text-align: center;
}
</style>