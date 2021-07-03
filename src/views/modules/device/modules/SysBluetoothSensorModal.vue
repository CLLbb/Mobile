<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="蓝牙编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select  v-decorator="[ 'sensorCode', validatorRules.sensorCode]" placeholder="请选择蓝牙编号" :getPopupContainer= "(target) => target.parentNode">
            <a-select-option v-for="(sensorCode,sensorCodeIndex) in selectedSensorCode" :key="sensorCodeIndex.toString()" :value="sensorCode.id">
              {{ sensorCode.id }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="mac地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['macAddress', validatorRules.macAddress]" placeholder="请输入mac地址"></a-input>
        </a-form-item>
        <a-form-item label="设备号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select  show-search v-decorator="[ 'sn', validatorRules.sn]" placeholder="请选择设备" :getPopupContainer= "(target) => target.parentNode">
            <a-select-option v-for="(sn,snIndex) in selectedSn" :key="snIndex.toString()" :value="sn.sn">
              {{ sn.sn }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="位置" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['position', validatorRules.position]" placeholder="请输入位置"></a-input>
        </a-form-item>


      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { validateDuplicateValue } from '@/utils/util'
  import JDictSelectTag from "@/components/dict/JDictSelectTag"
  import { queryDeviceAll } from '@api/api'


  export default {
    name: "SysBluetoothSensorModal",
    components: {
      JDictSelectTag,
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        visible: false,
        model: {},
        isDisabledAuth: true,
        selectedSensorCode: [
        ],
        selectedSn: [],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          sensorCode: {
            rules: [
              { required: true, message: '请输入蓝牙编号!'},
            ]
          },
          macAddress: {
            rules: [
              { required: true, message: '请输入mac地址!'},
            ]
          },
          sn: {
            rules: [
              { required: true, message: '请输入设备号!'},
            ]
          },
          position: {
            rules: [
              { required: true, message: '请输入位置!'},
            ]
          },
        },
        url: {
          add: "/device/sysBluetoothSensor/add",
          edit: "/device/sysBluetoothSensor/edit",
        }
      }
    },
    created () {
      this.initSensorCode()
    },
    methods: {
      initSensorCode(){
        for (let i = 1; i < 31; i++) {
          let sensorCode = {id:i.toString()};
          if (i<10) {
            sensorCode = {id:'0'+i.toString()}
          }
          this.selectedSensorCode.push(sensorCode);
        }
      },
      add () {
        this.edit({activitiSync:'1'});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.loadSn();
        console.log(record);
        console.log(this.isDisabledAuth);
        if (record.hasOwnProperty("activitiSync")){
          this.isDisabledAuth = false;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'sensorCode','macAddress','sn','position'))
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }

        })
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'sensorCode','macAddress','sn','position'))
      },
      loadSn(){
        let data = {type:1,isPage:0}
        queryDeviceAll(data).then((res)=>{
          if(res.success){
            this.selectedSn = res.result.records;
          }else{
            console.log(res.message);
          }
        });
      },
      disabledAuth(){
        return this.isDisabledAuth;
      }


    }
  }
</script>