<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row class="form-row" :gutter="24" >
          <a-col :span="24" pull="2">
            <a-form-item label="SN号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="SN号" v-decorator="['sn', validatorRules.sn]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="24" >
          <a-col :span="24" pull="2">
            <a-form-item label="支付金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input placeholder="支付金额" v-decorator="['money', validatorRules.money]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import JEditor from '@/components/panther/JEditor'

  export default {
    name: "DevicePayEventModal",
    components:{
      JEditor
    },
    data() {
      return {
        title: "操作",
        visible: false,
        disable: true,
        model: {},
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
    },
    methods: {
      add() {
        this.disable = false;
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.model, 'sn'))
        });
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.disable = true;
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = this.url.payEvent;
            let method = 'post';
            let formData = Object.assign(this.model, values);
            //时间格式化

            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })


          }
        })
      },
      handleCancel() {
        this.close()
      },

    }
  }
</script>

<style scoped>

</style>