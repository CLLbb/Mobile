<template>
  <div>
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
        <a-col :md="24" :sm="24">
          <!-- <p class="title1">实时监控</p> -->
          <div v-for="item in FlvPlayerList" :key="item.id" style="float: left">
            <div style="margin-right: 20px; margin-bottom: 20px">
              <p style="font-size: 16px; margin-bottom: 5px" class="svg_title">
                <a-icon type="video-camera" class="svg_icon" /><span>{{ item.devicePosition }}</span>
              </p>
              <iframe
                style="width: 350px; height: 300px"
                name="ddddd"
                id="iframes"
                scrolling="auto"
                :src="`/static/test.html?data=rtsp://${item.rtspIp}/live/mainstream`"
              ></iframe>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-card>
   <div class="flex-1">
    <div id="scroll-wrap">
      <ul class="scroll-ul">
        <li class="scroll-li" v-for="item in userInfoList" :key="item.id"  @click="gotodetail(item.phone)">
          <img :src="getAvatarView(item.avatar)"/>
        </li>
      </ul>
    </div>
  </div>
  </div>
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
  // mixins: [PantherListMixin],
  components: {
    SysUserAgentModal,
    UserModal,
    PasswordModal,
    JInput,
    UserRecycleBinModal,
    MarqueeText,
  },
  data() {
    return {
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
        positiveLeave: 'sys/user/positiveOrLeave',
      },

      timer: null,
      timer2: null,
      scorllTimer: null,

      // 人员信息数据
      userdate: '',
      userdate2: '',
      shopProduct: [],
      userInfoList: [],
      FlvPlayerList: [],
      list: [],
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  destroyed() {
    window.clearInterval(this.timer)
    window.clearInterval(this.timer2)
    window.clearInterval(this.scrollTimer)
  },
  mounted() {
    this.getinfo()
    this.getimg()
    this.getinfo2()
    this.getaddress()
   setTimeout(() => {
      this.init()
    }, 3000)
  },
  methods: {
    // 滚动部分js
   init() {
     const _this = this
      this.$nextTick(() => {
        var oDiv = document.getElementById('scroll-wrap')
        var oUl = oDiv.getElementsByClassName('scroll-ul')[0]
        var aLi = oUl.getElementsByClassName('scroll-li')

        var speed = 2

        oUl.innerHTML += oUl.innerHTML
        oUl.style.width = aLi[0].offsetWidth * aLi.length + 'px'

        function move() {
          if (oUl.offsetLeft < -oUl.offsetWidth / 2) {
            oUl.style.left = '0'
          }
          if (oUl.offsetLeft > 0) {
            oUl.style.left = -oUl.offsetWidth / 2 + 'px'
          }
          oUl.style.left = oUl.offsetLeft + speed + 'px'
        }

        var scrollTimer = setInterval(move, 30)
        oDiv.onmousemove = function() {
          clearInterval(scrollTimer)
        }
        oDiv.onmouseout = function() {
          scrollTimer = setInterval(move, 30);
        }
        aLi.onclick=function(){
          console.log('点击');
        }
      })
    },
    move() {
      console.log('move')
      var oUl = document.getElementsByClassName('scorll-ul')[0]
      const speed = 0.6

      if (oUl.offsetLeft < -oUl.offsetWidth / 2) {
        oUl.style.left = '0'
      }
      if (oUl.offsetLeft > 0) {
        oUl.style.left = -oUl.offsetWidth / 2 + 'px'
      }
      oUl.style.left = oUl.offsetLeft + speed + 'px'
    },
    // 视频流地址
    getaddress() {
      getAddressList().then((res) => {
        let flv = res.result.records
        if (flv.length >= 4) {
          this.FlvPlayerList = flv.slice(-4)
        } else {
          this.FlvPlayerList = flv.slice(0, 4)
        }
        console.log('流地址', res)
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
      console.log('phone',123);
      this.$router.push({
        path: '/operate/user/getById',
        query: {
          key: 'key',
          msgKey: phone,
        },
      })
    },
    getimg() {
      this.timer = setInterval(() => {
        getImgList().then((res) => {
          // this.userInfoList = res.result.records.slice(0, 4)
          this.userInfoList = res.result.records
          this.userdate2 = res.result.records[0]
        })
      }, 3000)
    },
    getAvatarView: function (avatar) {
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
    handleFrozen: function (id, status, username) {
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
    },
  },
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
.imgslide img {
  margin-left: 42%;
  margin-top: 20px;
  margin-bottom: 20px;
}

.userinfo {
  list-style: none;
  padding: 0px;
}

.userinfo li {
  line-height: 40px;
  margin-left: 20px;
}

.svg_icon {
  color: #4fb16a;
  font-size: 26px;
  margin-right: 10px;
}
.svg_title {
  display: flex;
  align-items: center;
}
.svg_title span {
  padding-bottom: 6px;
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
.scroll-item {
  /* overflow: hidden; */
  width: 120px;
  height: 120px;
  border-radius: 10px;
}
.bottom_img {
  width: 100%;
  height: 100%;
  background-size: cover;
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
/* 滚动部分样式 */
* {
  margin: 0;
  padding: 0;
}

#scroll-wrap {
  width: 800px;
  height: 200px;
  margin: 100px auto;
  position: relative;
  /* background: red; */
  overflow: hidden;
}

#scroll-wrap ul {
  position: absolute;
  left: 0;
  top: 0;
}

#scroll-wrap ul li {
  float: left;
  width: 200px;
  height: 200px;
  list-style: none;
  margin: 0px 20px;
}
#scroll-wrap ul li img {
  width: 200px;
  height: 150px;
  border-radius: 20px;
}
</style>