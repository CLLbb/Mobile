<template>
  <a-modal
    title="用户批量下发"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    cancelText="关闭"
    style="top:20px;"
  >
    <a-spin :spinning="confirmLoading">
     <a-form :model="form" ref="ruleForm" >
        <a-form-item label="用户下发" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
		  mode="multiple"
            v-model="snList"
            style="width: 100%"
            placeholder="请选择下发的设备SN"
            :getPopupContainer="(target) => target.parentNode"
          >
            <a-select-option v-for="(role, roleindex) in roleList" :key="roleindex.toString()" :value="role.sn">
              {{ role.sn }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
   import {IssureAll} from '@/api/user'

  export default {
    name: "PasswordModal",
	props: ['roleList','phoneList'],
    data () {
      return {
		// 批量下发要传输的数据
		snList:[],
        visible: false,
        confirmLoading: false,
        confirmDirty: false,

        model: {},

        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form:this.$form.createForm(this)
      }
    },
   
    methods: {
      show (username) {
		   console.log("this.roleList",this.phoneList);
        this.form.resetFields();
        this.visible = true;
        this.model.username = username;
        this.$nextTick(() => {
          this.form.setFieldsValue({username:username});
        });
		 console.log("this.roleList",this.roleList);
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
      },
      handleSubmit () {
        // 触发表单验证
		 console.log('snList',this.snList);
		 const params = {
		  phoneList:this.phoneList,	
		  snList:this.snList		
		 }
        IssureAll(params).then(res=>{
		  if (res.code === 200) {
			 this.$message.success(res.message)
			  this.close()
		  }
        })
		},
      handleCancel () {
        this.close()
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        const confirmpassword=form.getFieldValue('confirmpassword');
        console.log("confirmpassword==>",confirmpassword);
        if (value && confirmpassword && value !== confirmpassword) {
          callback('两次输入的密码不一样！');
        }
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback();
      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('两次输入的密码不一样！');
        } else {
          callback()
        }
      },
      handleConfirmBlur  (e) {
        const value = e.target.value
        this.confirmDirty = this.confirmDirty || !!value
      }
    }
  }
</script>