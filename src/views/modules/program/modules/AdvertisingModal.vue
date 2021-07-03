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

        <a-form-item label="广告描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入广告描述" v-decorator="['remark', validatorRules.remark]"/>
        </a-form-item>

        <a-form-item label="轮播间隔/s" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入轮播间隔/s" v-decorator="['shuffling', validatorRules.shuffling]"/>
        </a-form-item>

        <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'status', {}]" placeholder="请选择是否启用" :getPopupContainer= "(target) => target.parentNode">
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁止</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="广告图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
<!--          <j-image-upload class="avatar-uploader" text="上传" v-model="fileList" ></j-image-upload>-->
          <j-upload class="avatar-uploader" text="上传" v-model="fileList" ></j-upload>
        </a-form-item>

        <a-form-item label="关联设备" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!roleDisabled" >
          <a-select
            mode="multiple"
            style="width: 100%"
            placeholder="请选择设备"
            optionFilterProp = "children"
            v-model="selectedDevice"
            :getPopupContainer= "(target) => target.parentNode">
            <a-select-option v-for="(device,deviceindex) in deviceList" :key="deviceindex.toString()" :value="device.id">
              {{ device.name }}
            </a-select-option>
          </a-select>
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
  import {addAdvertising,editAdvertising,queryUserRole,queryDeviceAll} from '@/api/api'
  import { disabledAuthFilter } from "@/utils/authFilter"
  import JImageUpload from '../../../../components/panther/JImageUpload'
  import JUpload from '../../../../components/panther/JUpload'

  export default {
    name: "DeviceLibModal",
    components: {
      JUpload,
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
          name:{rules: [{ required: true, message: '请输入名称!' }]},
          title:{rules: [{ required: true, message: '请输入标题!' }]}
        },
        departIdShow:false,
        departIds:[], //负责部门id
        title:"操作",
        visible: false,
        model: {},
        deviceList:[],
        selectedDevice:[],
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
      initialDeviceList(){
        queryDeviceAll({isPage:0}).then((res)=>{
          if(res.success){
            this.deviceList = res.result.records;
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
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        let that = this;
        that.initialDeviceList();
        that.checkedDepartNameString = "";
        that.form.resetFields();
        if(record.hasOwnProperty("id")){
          setTimeout(() => {
            this.fileList = record.url;
          }, 5)
        }
        that.selectedDevice = record.deviceIds;

        that.userId = record.id;
        that.visible = true;
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model,'shuffling','remark','status','url'))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedDevice = [];
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

            let formData = Object.assign(this.model, values);

            if(that.fileList != ''){
              formData.url = that.fileList;
            }else{
              formData.url = null;
            }

            formData.deviceIds = this.selectedDevice;
            let obj;
            if(!this.model.id){
              formData.id = this.userId;
              obj=addAdvertising(formData);
            }else{
              obj=editAdvertising(formData);
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