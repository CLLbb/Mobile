<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: 100%; overflow: auto; padding-bottom: 53px"
  >
    <template slot="title">
      <div style="width: 100%">
        <span>{{ title }}</span>
        <span style="display: inline-block; width: calc(100% - 51px); padding-right: 10px; text-align: right">
          <a-button @click="toggleScreen" icon="appstore" style="height: 20px; width: 20px; border: 0px"></a-button>
        </span>
      </div>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户姓名" v-decorator.trim="['userName', validatorRules.userName]" />
        </a-form-item>
        <!-- update--end--autor:wangshuai-----date:20200108------for：新增身份和负责部门------ -->
        <!-- <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload
            v-if="fileList.length <= 0"
            class="avatar-uploader"
            text="上传"
            v-model="fileList"
          ></j-image-upload>
          <img v-else :src="getAvatarView(fileList || '')" alt="" style="width: 80px; height: 80px" />
        </a-form-item> -->
         <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload class="avatar-uploader" text="上传" v-model="fileList" ></j-image-upload>
        </a-form-item>
        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['userSex', {}]"
            placeholder="请选择性别"
            :getPopupContainer="(target) => target.parentNode"
          >
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入手机号码" v-decorator="['userPhone', validatorRules.userPhone]" />
        </a-form-item>

        <a-form-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户年龄" v-decorator="['age', validatorRules.age]" />
        </a-form-item>

        <a-form-item label="网龄" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户网龄" v-decorator="['netAge', validatorRules.netAge]" />
        </a-form-item>

        <a-form-item label="户实时话费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户实时话费" v-decorator="['telBill', validatorRules.telBill]" />
        </a-form-item>

        <a-form-item label="用户账户余额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户账户余额" v-decorator="['accountBlance', validatorRules.accountBlance]" />
        </a-form-item>

        <a-form-item label="近3月消费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户近3月消费" v-decorator="['consu3month', validatorRules.consu3month]" />
        </a-form-item>

        <a-form-item label="ARUP值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用ARUP值" v-decorator="['arupVal', validatorRules.arupVal]" />
        </a-form-item>

        <a-form-item label="已订购产品" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户已订购产品" v-decorator="['orderProduct', validatorRules.orderProduct]" />
        </a-form-item>

        <a-form-item label="语音" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户语音" v-decorator="['voice', validatorRules.voice]" />
        </a-form-item>

        <a-form-item label="流量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户流量" v-decorator="['flow', validatorRules.flow]" />
        </a-form-item>

        <a-form-item label="往月欠费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户往月欠费" v-decorator="['arrears', validatorRules.arrears]" />
        </a-form-item>

        <a-form-item label="终端品牌" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户终端品牌" v-decorator="['terminal', validatorRules.terminal]" />
        </a-form-item>

        <a-form-item label="家庭宽带" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户家庭宽带" v-decorator="['homeBroad', validatorRules.homeBroad]" />
        </a-form-item>

        <a-form-item label="亲情号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户亲情号" v-decorator="['qinqingHao', validatorRules.qinqingHao]" />
        </a-form-item>
        <a-form-item label="用户标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="用户不同标签请用逗号隔开" v-decorator="['userTag', validatorRules.userTag]" />
        </a-form-item>
      </a-form>
    </a-spin>
    <depart-window ref="departWindow" @ok="modalFormOk"></depart-window>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: 0.8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
// 引入搜索部门弹出框的组件
import departWindow from './DepartWindow'
import JSelectPosition from '@/components/pantherbiz/JSelectPosition'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAction } from '@/api/manage'
import { addUser2, editUser2, queryUserRole, queryall } from '@/api/api'
import { disabledAuthFilter } from '@/utils/authFilter'
import { duplicateCheck } from '@/api/api'
import JImageUpload from '../../../components/panther/JImageUpload'
import { putAction, getFileAccessHttpUrl } from '@/api/manage'
export default {
  name: 'UserModal',
  components: {
    JImageUpload,
    departWindow,
    JSelectPosition,
  },
  data() {
    return {
      departDisabled: false, //是否是我的部门调用该页面
      roleDisabled: false, //是否是角色维护调用该页面
      modalWidth: 800,
      drawerWidth: 700,
      modaltoggleFlag: true,
      confirmDirty: false,
      selectedDepartKeys: [], //保存用户选择部门id
      checkedDepartKeys: [],
      checkedDepartNames: [], // 保存部门的名称 =>title
      checkedDepartNameString: '', // 保存部门的名称 =>title
      resultDepartOptions: [],
      userId: '', //保存用户id
      disableSubmit: false,
      userDepartModel: { userId: '', departIdList: [] }, // 保存SysUserDepart的用户部门中间表数据需要的对象
      dateFormat: 'YYYY-MM-DD',
      validatorRules: {
        username: {
          rules: [
            {
              required: true,
              message: '请输入用户姓名!',
            },
            {
              validator: this.validateUsername,
            },
          ],
        },
        userName: { rules: [{ required: true, message: '请输入用户姓名!' }] },
      },
      departIdShow: false,
      departIds: [], //负责部门id
      title: '操作',
      visible: false,
      model: {},
      roleList: [],
      selectedRole: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      uploadLoading: false,
      confirmLoading: false,
      headers: {},
      form: this.$form.createForm(this),
      picUrl: '',
      url: {
        fileUpload: window._CONFIG['domianURL'] + '/operate/user/uploadUserImg',
        userWithDepart: '/sys/user/userDepartList', // 引入为指定用户查看部门信息需要的url
        userId: '/sys/user/generateUserId', // 引入生成添加用户情况下的url
        syncUserByUserName: '/process/extActProcess/doSyncUserByUserName', //同步用户到工作流
        queryTenantList: '/operate/user/getById',
      },
      identity: '1',
      fileList: [],
      tenantList: [],
      currentTenant: [],
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.initTenantList()
  },
  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    },
  },
  methods: {
    // getAvatarView: function (avatar) {
    //   return getFileAccessHttpUrl(avatar)
    // },
    isDisabledAuth(code) {
      return disabledAuthFilter(code)
    },
    initTenantList() {
      getAction(this.url.queryTenantList).then((res) => {
        if (res.success) {
          this.tenantList = res.result
        }
      })
    },
    //窗口最大化切换
    toggleScreen() {
      if (this.modaltoggleFlag) {
        this.modalWidth = window.innerWidth
      } else {
        this.modalWidth = 800
      }
      this.modaltoggleFlag = !this.modaltoggleFlag
    },
    initialRoleList() {
      queryall().then((res) => {
        if (res.success) {
          this.roleList = res.result
        } else {
          console.log(res.message)
        }
      })
    },
    loadUserRoles(userid) {
      queryUserRole({ userid: userid }).then((res) => {
        if (res.success) {
          this.selectedRole = res.result
        } else {
          console.log(res.message)
        }
      })
    },
    refresh() {
      this.selectedDepartKeys = []
      this.checkedDepartKeys = []
      this.checkedDepartNames = []
      this.checkedDepartNameString = ''
      this.userId = ''
      this.resultDepartOptions = []
      this.departId = []
      this.departIdShow = false
      this.currentTenant = []
    },
    add() {
      this.picUrl = ''
      this.refresh()
      this.edit({ activitiSync: '1' })
    },
    edit(record) {
      this.visible = true
      // console.log('ces')
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      let that = this
      that.initialRoleList()
      that.checkedDepartNameString = ''
      that.form.resetFields()
      if (record.hasOwnProperty('id')) {
        that.loadUserRoles(record.id)
       setTimeout(() => {
             this.fileList = record.avatar
          console.log('this.fileList',this.fileList)
          }, 5)     
        }
      that.id = record.id

      that.model = Object.assign({}, record)
      that.$nextTick(() => {
        that.form.setFieldsValue(
          pick(
            this.model,
            'userName',
            'userPhone',
            'age',
            'userSex',
            'userTag',
            'netAge',
            'telBill',
            'accountBlance',
            'consu3month',
            'arupVal',
            'orderProduct',
            'voice',
            'flow',
            'arrears',
            'terminal',
            'homeBroad',
            'qinqingHao',
            'post'
          )
        )
      })
      // console.log('ce222');
      //身份为上级显示负责部门，否则不显示
      if (this.model.userIdentity == '2') {
        this.identity = '2'
        this.departIdShow = true
      } else {
        this.identity = '1'
        this.departIdShow = false
      }
      // 调用查询用户对应的部门信息的方法
      that.checkedDepartKeys = []
      that.loadCheckedDeparts()

      //update-begin-author:taoyan date:2020710 for:多租户配置
      console.log(record)
      if (!record.relTenantIds) {
        this.currentTenant = []
      } else {
        this.currentTenant = record.relTenantIds.split(',').map(Number)
      }
    },

    //
    loadCheckedDeparts() {
      let that = this
      if (!that.userId) {
        return
      }
      getAction(that.url.userWithDepart, { userId: that.userId }).then((res) => {
        that.checkedDepartNames = []
        console.log(res)
        if (res.success) {
          var depart = []
          var departId = []
          res.result = res.result.length|| []
          for (let i = 0; i < res.result.length; i++) {
            that.checkedDepartNames.push(res.result[i].title)
            this.checkedDepartNameString = this.checkedDepartNames.join(',')
            that.checkedDepartKeys.push(res.result[i].key)
            //新增负责部门选择下拉框
            depart.push({
              key: res.result[i].key,
              title: res.result[i].title,
            })
            departId.push(res.result[i].key)
          }
          that.resultDepartOptions = depart
          //判断部门id是否存在，不存在择直接默认当前所在部门
          if (this.model.departIds) {
            this.departIds = this.model.departIds.split(',')
          } else {
            this.departIds = departId
          }
          that.userDepartModel.departIdList = that.checkedDepartKeys
        } else {
          console.log(res.message)
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.selectedRole = []
      this.userDepartModel = { userId: '', departIdList: [] }
      this.checkedDepartNames = []
      this.checkedDepartNameString = ''
      this.checkedDepartKeys = []
      this.selectedDepartKeys = []
      this.resultDepartOptions = []
      this.departIds = []
      this.departIdShow = false
      this.identity = '1'
      this.fileList = []
    },
    moment,
    handleSubmit() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          if (!values.birthday) {
            values.birthday = ''
          } else {
            values.birthday = values.birthday.format(this.dateFormat)
          }
          let formData = Object.assign(this.model, values)
          if (that.fileList != '') {
            formData.avatar = that.fileList
          } else {
            formData.avatar = null
          }
          //update-begin-author:taoyan date:2020710 for:多租户配置
          
          formData.relTenantIds = this.currentTenant.length > 0 ? this.currentTenant.join(',') : ''
          //update-end-author:taoyan date:2020710 for:多租户配置
          formData.selectedroles = this.selectedRole.length > 0 ? this.selectedRole.join(',') : ''
          formData.selecteddeparts =
            this.userDepartModel.departIdList.length > 0 ? this.userDepartModel.departIdList.join(',') : ''
          formData.userIdentity = this.identity
          //如果是上级择传入departIds,否则为空
          if (this.identity === '2') {
            formData.departIds = this.departIds.join(',')
          } else {
            formData.departIds = ''
          }
          // that.addDepartsToUser(that,formData); // 调用根据当前用户添加部门信息的方法
          let obj
          if (!this.model.id) {
            formData.id = this.id
            obj = addUser2(formData)
          } else {
            obj = editUser2(formData)
          }
          obj
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.checkedDepartNames = []
              that.userDepartModel.departIdList = { userId: '', departIdList: [] }
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      const confirmpassword = form.getFieldValue('confirmpassword')

      if (value && confirmpassword && value !== confirmpassword) {
        callback('两次输入的密码不一样！')
      }
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        //update-begin--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
        if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
          //update-end--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------

          var params = {
            tableName: 'sys_user',
            fieldName: 'phone',
            fieldVal: value,
            dataId: this.userId,
            delFlag: 0,
          }
          duplicateCheck(params).then((res) => {
            if (res.success) {
              callback()
            } else {
              callback('手机号已存在!')
            }
          })
        } else {
          callback('请输入正确格式的手机号码!')
        }
      }
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (
          new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          var params = {
            tableName: 'sys_user',
            fieldName: 'email',
            fieldVal: value,
            dataId: this.userId,
          }
          duplicateCheck(params).then((res) => {
            console.log(res)
            if (res.success) {
              callback()
            } else {
              callback('邮箱已存在!')
            }
          })
        } else {
          callback('请输入正确格式的邮箱!')
        }
      }
    },
    validateUsername(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'username',
        fieldVal: value,
        dataId: this.userId,
        delFlag: 0,
      }
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback('用户名已存在!')
        }
      })
    },
    validateWorkNo(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'work_no',
        fieldVal: value,
        dataId: this.userId,
        delFlag: 0,
      }
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback('工号已存在!')
        }
      })
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },

    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    beforeUpload: function (file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片')
        return false
      }
      //TODO 验证文件大小
    },
    handleChange(info) {
      this.picUrl = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          this.model.avatar = response.message
          this.picUrl = 'Has no pic url yet'
        } else {
          this.$message.warning(response.message)
        }
      }
    },
    // 搜索用户对应的部门API
    onSearch() {
      this.$refs.departWindow.add(this.checkedDepartKeys, this.userId)
    },

    // 获取用户对应部门弹出框提交给返回的数据
    modalFormOk(formData) {
      this.checkedDepartNames = []
      this.selectedDepartKeys = []
      this.checkedDepartNameString = ''
      this.userId = formData.userId
      this.userDepartModel.userId = formData.userId
      this.departIds = []
      this.resultDepartOptions = []
      var depart = []
      for (let i = 0; i < formData.departIdList.length; i++) {
        this.selectedDepartKeys.push(formData.departIdList[i].key)
        this.checkedDepartNames.push(formData.departIdList[i].title)
        this.checkedDepartNameString = this.checkedDepartNames.join(',')
        //新增部门选择，如果上面部门选择后不为空直接付给负责部门
        depart.push({
          key: formData.departIdList[i].key,
          title: formData.departIdList[i].title,
        })
        this.departIds.push(formData.departIdList[i].key)
      }
      this.resultDepartOptions = depart
      this.userDepartModel.departIdList = this.selectedDepartKeys
      this.checkedDepartKeys = this.selectedDepartKeys //更新当前的选择keys
    },
    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    identityChange(e) {
      if (e.target.value === '1') {
        this.departIdShow = false
      } else {
        this.departIdShow = true
      }
    },
  },
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>