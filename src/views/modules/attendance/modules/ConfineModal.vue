<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: 100%;overflow: auto;padding-bottom: 53px;">

    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right">
          <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
        </span>
      </div>

    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入名称" v-decorator="['name', validatorRules.name]"/>
        </a-form-item>

        <a-form-item label="时段1" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-time-picker
            style="width: 50%"
            placeholder="开始时间"
            v-decorator="['time1Start', {initialValue:!model.time1Start?null:moment(model.time1Start,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
          <a-time-picker
            style="width: 50%"
            placeholder="结束时间"
            v-decorator="['time1End', {initialValue:!model.time1End?null:moment(model.time1End,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
        </a-form-item>

        <a-form-item label="时段2" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-time-picker
            style="width: 50%"
            placeholder="开始时间"
            v-decorator="['time2Start', {initialValue:!model.time2Start?null:moment(model.time2Start,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
          <a-time-picker
            style="width: 50%"
            placeholder="结束时间"
            v-decorator="['time2End', {initialValue:!model.time2End?null:moment(model.time2End,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
        </a-form-item>

        <a-form-item label="时段3" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-time-picker
            style="width: 50%"
            placeholder="开始时间"
            v-decorator="['time3Start', {initialValue:!model.time3Start?null:moment(model.time3Start,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
          <a-time-picker
            style="width: 50%"
            placeholder="结束时间"
            v-decorator="['time3End', {initialValue:!model.time3End?null:moment(model.time3End,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
        </a-form-item>

        <a-form-item label="时段4" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-time-picker
            style="width: 50%"
            placeholder="开始时间"
            v-decorator="['time4Start', {initialValue:!model.time4Start?null:moment(model.time4Start,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
          <a-time-picker
            style="width: 50%"
            placeholder="结束时间"
            v-decorator="['time4End', {initialValue:!model.time4End?null:moment(model.time4End,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
        </a-form-item>

        <a-form-item label="时段5" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-time-picker
            style="width: 50%"
            placeholder="开始时间"
            v-decorator="['time5Start', {initialValue:!model.time5Start?null:moment(model.time5Start,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
          <a-time-picker
            style="width: 50%"
            placeholder="结束时间"
            v-decorator="['time5End', {initialValue:!model.time5End?null:moment(model.time5End,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
        </a-form-item>

        <a-form-item label="时段6" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-time-picker
            style="width: 50%"
            placeholder="开始时间"
            v-decorator="['time6Start', {initialValue:!model.time6Start?null:moment(model.time6Start,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
          <a-time-picker
            style="width: 50%"
            placeholder="结束时间"
            v-decorator="['time6End', {initialValue:!model.time6End?null:moment(model.time6End,dateFormatHms)}]"
            :getCalendarContainer="node => node.parentNode"/>
        </a-form-item>

      </a-form>
    </a-spin>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
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
  import JSelectPosition from '@/components/pantherbiz/JSelectPosition'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getAction } from '@/api/manage'
  import {addConfine,editConfine,queryUserRole,queryall} from '@/api/api'
  import { disabledAuthFilter } from "@/utils/authFilter"
  import JImageUpload from '../../../../components/panther/JImageUpload'

  export default {
    name: "AttendanceRuleModal",
    components: {
      JImageUpload,
      JSelectPosition
    },
    data () {
      return {
        departDisabled: false, //是否是我的部门调用该页面
        roleDisabled: false, //是否是角色维护调用该页面
        modalWidth:800,
        drawerWidth:700,
        modaltoggleFlag:true,
        confirmDirty: false,
        selectedDepartKeys:[], //保存用户选择部门id
        checkedDepartKeys:[],
        checkedDepartNames:[], // 保存部门的名称 =>title
        checkedDepartNameString:"", // 保存部门的名称 =>title
        resultDepartOptions:[],
        userId:"", //保存用户id
        disableSubmit:false,
        userDepartModel:{userId:'',departIdList:[]}, // 保存SysUserDepart的用户部门中间表数据需要的对象
        dateFormat:"YYYY-MM-DD",
        dateFormatHms:"HH:mm:ss",
        validatorRules:{
          name:{rules: [{ required: true, message: '请输入名称!' }]}
        },
        departIdShow:false,
        departIds:[], //负责部门id
        title:"操作",
        visible: false,
        model: {},
        roleList:[],
        selectedRole:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        uploadLoading:false,
        confirmLoading: false,
        headers:{},
        form:this.$form.createForm(this),
        picUrl: "",
        url: {
          fileUpload: window._CONFIG['domianURL']+"/operate/user/uploadUserImg",
          userId:"/sys/user/generateUserId", // 引入生成添加用户情况下的url
          syncUserByUserName:"/process/extActProcess/doSyncUserByUserName",//同步用户到工作流
          queryTenantList: '/sys/tenant/queryList'
        },
        identity:"1",
        fileList:[],
        tenantList: [],
        currentTenant:[]
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
      this.initTenantList()

    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },
    methods: {
      isDisabledAuth(code){
        return disabledAuthFilter(code);
      },
      initTenantList(){
        getAction(this.url.queryTenantList).then(res=>{
          if(res.success){
            this.tenantList = res.result
          }
        })
      },
      //窗口最大化切换
      toggleScreen(){
        if(this.modaltoggleFlag){
          this.modalWidth = window.innerWidth;
        }else{
          this.modalWidth = 800;
        }
        this.modaltoggleFlag = !this.modaltoggleFlag;
      },
      initialRoleList(){
        queryall().then((res)=>{
          if(res.success){
            this.roleList = res.result;
          }else{
            console.log(res.message);
          }
        });
      },
      loadUserRoles(userid){
        queryUserRole({userid:userid}).then((res)=>{
          if(res.success){
            this.selectedRole = res.result;
          }else{
            console.log(res.message);
          }
        });
      },
      refresh () {
        this.selectedDepartKeys=[];
        this.checkedDepartKeys=[];
        this.checkedDepartNames=[];
        this.checkedDepartNameString = "";
        this.userId=""
        this.resultDepartOptions=[];
        this.departId=[];
        this.departIdShow=false;
        this.currentTenant = []
      },
      add () {
        this.picUrl = "";
        this.refresh();
        this.edit({activitiSync:'1'});
      },
      edit (record) {
        debugger;
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        let that = this;
        that.initialRoleList();
        that.checkedDepartNameString = "";
        that.form.resetFields();
        if(record.hasOwnProperty("id")){
          that.loadUserRoles(record.id);
          setTimeout(() => {
            this.fileList = record.avatar;
          }, 5)
        }
        that.userId = record.id;
        that.visible = true;
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model,'name'))
            // ,moment('time1Start',dateFormatHms),moment('time1End',dateFormatHms),
            // moment('time2Start',dateFormatHms),moment('time2End',dateFormatHms),moment('time3Start',dateFormatHms),moment('time3End',dateFormatHms),
            // moment('time4Start',dateFormatHms),moment('time4End',dateFormatHms),moment('time5Start',dateFormatHms),moment('time5End',dateFormatHms),
            // moment('time6Start',dateFormatHms),moment('time6End',dateFormatHms)
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
        this.userDepartModel = {userId:'',departIdList:[]};
        this.checkedDepartNames = [];
        this.checkedDepartNameString='';
        this.checkedDepartKeys = [];
        this.selectedDepartKeys = [];
        this.resultDepartOptions=[];
        this.departIds=[];
        this.departIdShow=false;
        this.identity="1";
        this.fileList=[];
      },
      moment,
      handleSubmit () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            if (values.time1Start != null){
              values.time1Start = values.time1Start.format(this.dateFormatHms);
            }
            if (values.time1End != null){
              values.time1End = values.time1End.format(this.dateFormatHms);
            }
            if (values.time2Start != null){
              values.time2Start = values.time2Start.format(this.dateFormatHms);
            }
            if (values.time2End != null){
              values.time2End = values.time2End.format(this.dateFormatHms);
            }
            if (values.time3Start != null){
              values.time3Start = values.time3Start.format(this.dateFormatHms);
            }
            if (values.time3End != null){
              values.time3End = values.time3End.format(this.dateFormatHms);
            }
            if (values.time4Start != null){
              values.time4Start = values.time4Start.format(this.dateFormatHms);
            }
            if (values.time4End != null){
              values.time4End = values.time4End.format(this.dateFormatHms);
            }
            if (values.time5Start != null){
              values.time5Start = values.time5Start.format(this.dateFormatHms);
            }
            if (values.time5End != null){
              values.time5End = values.time5End.format(this.dateFormatHms);
            }
            if (values.time6Start != null){
              values.time6Start = values.time6Start.format(this.dateFormatHms);
            }
            if (values.time6End != null){
              values.time6End = values.time6End.format(this.dateFormatHms);
            }

            let formData = Object.assign(this.model, values);

            let obj;
            if(!this.model.id){
              formData.id = this.userId;
              obj=addConfine(formData);
            }else{
              obj=editConfine(formData);
            }
            obj.then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.checkedDepartNames = [];
              that.userDepartModel.departIdList = {userId:'',departIdList:[]};
              that.close();
            })

          }
        })
      },
      handleCancel () {
        this.close()
      },
      handleConfirmBlur  (e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value
      },

      // 获取用户对应部门弹出框提交给返回的数据
      modalFormOk (formData) {
        this.checkedDepartNames = [];
        this.selectedDepartKeys = [];
        this.checkedDepartNameString = '';
        this.userId = formData.userId;
        this.userDepartModel.userId = formData.userId;
        this.departIds=[];
        this.resultDepartOptions=[];
        var depart=[];
        for (let i = 0; i < formData.departIdList.length; i++) {
          this.selectedDepartKeys.push(formData.departIdList[i].key);
          this.checkedDepartNames.push(formData.departIdList[i].title);
          this.checkedDepartNameString = this.checkedDepartNames.join(",");
          //新增部门选择，如果上面部门选择后不为空直接付给负责部门
          depart.push({
            key:formData.departIdList[i].key,
            title:formData.departIdList[i].title
          })
          this.departIds.push(formData.departIdList[i].key)
        }
        this.resultDepartOptions=depart;
        this.userDepartModel.departIdList = this.selectedDepartKeys;
        this.checkedDepartKeys = this.selectedDepartKeys  //更新当前的选择keys
      },
      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 500){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 700;
        }
      },
      identityChange(e){
        if(e.target.value==="1"){
          this.departIdShow=false;
        }else{
          this.departIdShow=true;
        }
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader > .ant-upload {
    width:104px;
    height:104px;
  }
  .ant-upload-select-picture-card i {
    font-size: 49px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-table-tbody .ant-table-row td{
    padding-top:10px;
    padding-bottom:10px;
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


  .is-selected {
    color: #1989FA;
  }
</style>