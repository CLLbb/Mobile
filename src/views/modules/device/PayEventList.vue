<template>
  <a-card
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok=""
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-row class="form-row" :gutter="24" >
          <a-col :span="24" pull="2">
            <a-form-item label="设备" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!roleDisabled" >
              <a-select
                show-search
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
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="24" >
          <a-col :span="24" pull="2">
            <a-form-item label="支付金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :placeholder="money" v-decorator="['money', validatorRules.money]" id = "moneytext"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="24" >
          <a-col :span="24" pull="2">
            <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :placeholder="name" v-decorator="['name', validatorRules.name]" :disabled="disable"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="24" >
          <a-col :span="24" pull="2">
            <a-form-item label="会员号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :placeholder="memberNo" v-decorator="['memberNo', validatorRules.memberNo]" :disabled="disable"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row class="form-row" :gutter="24" >
          <a-col :span="24" pull="2">
            <a-form-item label="刷脸时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input :placeholder="time" v-decorator="['time', validatorRules.time]" :disabled="disable"/>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </a-spin>

    <span style="float: right;overflow: hidden;" class="table-page-search-submitButtons">
      <a-button @click="copy()" type="primary" style="margin-left: 8px">复制会员号</a-button>
      <a-button @click="issuedPayEvent" type="primary" style="margin-left: 8px">发起支付</a-button>
<!--      <a-button @click="reset()" type="primary" style="margin-left: 8px">重置</a-button>-->
    </span>

  </a-card>
</template>

<script>
  import JEditor from '@/components/panther/JEditor'
  import { queryDeviceAll } from '@/api/api'
  import { postAction } from '../../../api/manage'
  import store from '@/store/'

  export default {
    name: "PayEventList",
    components:{
      JEditor
    },
    data() {
      return {
        title: "识客支付",
        visible: true,
        disable: true,
        roleDisabled: false,
        sn:'',
        name:'',
        memberNo:'',
        time:'',
        money:null,
        deviceList:[],
        selectedDevice:[],
        model: {},
        dateFormat:"YYYY-MM-DD HH:mm:ss",
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          money: {rules: [{required: true, message: '请输入支付金额!'}]},
        },
        url: {
          payEvent: "/device/issuedDevicePayEvent",
        },
      }
    },
    created() {
      this.initWebSocket();
      this.initialDeviceList();
    },
    methods: {
      reset(){
        this.sn = '';
        this.name = '';
        this.memberNo = '';
        this.money = '';
        this.time = '';
        this.selectedDevice = [];
      },
      copy(){
        var input = document.createElement("input");   // 直接构建input
        input.value = this.memberNo;  // 设置内容
        document.body.appendChild(input);    // 添加临时实例
        input.select();   // 选择实例内容
        document.execCommand("Copy");   // 执行复制
        document.body.removeChild(input); // 删除临时实例
        this.$message.success('复制成功');
        //清除会员
        this.name = '';
        this.memberNo = '';
        this.time = '';
        this.form.resetFields();
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.disable = true;
      },
      handleCancel() {
        this.close()
      },
      initWebSocket: function () {
        // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        var userId = store.getters.userInfo.id;
        var url = window._CONFIG['domianURL'].replace("https://","wss://").replace("http://","ws://")+"/websocket/"+userId;
        this.websock = new WebSocket(url);
        this.websock.onopen = this.websocketOnopen;
        this.websock.onerror = this.websocketOnerror;
        this.websock.onmessage = this.websocketOnmessage;
        this.websock.onclose = this.websocketOnclose;
      },
      websocketOnopen: function () {
        console.log("WebSocket连接成功");
      },
      websocketOnerror: function (e) {
        console.log("WebSocket连接发生错误");
        this.reconnect();
      },
      websocketOnmessage: function (e) {
        var data = eval("(" + e.data + ")"); //解析对象
        debugger;
        if(data.businessType == 5){
          this.sn = data.content.sn;
          this.name = data.content.name;
          this.memberNo = data.content.memberNo;
          this.money = data.content.money;
          this.time = data.content.time;
        }
      },
      websocketOnclose: function (e) {
        console.log("connection closed (" + e + ")");
        if(e){
          console.log("connection closed (" + e.code + ")");
        }
        this.reconnect();
      },
      websocketSend(text) { // 数据发送
        try {
          this.websock.send(text);
        } catch (err) {
          console.log("send failed (" + err.code + ")");
        }
      },
      initialDeviceList(){
        queryDeviceAll({isPage:0,type:2}).then((res)=>{
          if(res.success){
            this.deviceList = res.result.records;
          }else{
            console.log(res.message);
          }
        });
      },
      issuedPayEvent: function () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            formData.sn = that.sn;
            formData.name = that.name;
            formData.memberNo = that.memberNo;
            formData.deviceIds = [this.selectedDevice];
            postAction(that.url.payEvent, formData).then((res)=>{
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
    }
  }
</script>

<style scoped>

</style>