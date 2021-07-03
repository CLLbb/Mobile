<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :model="form" ref="ruleForm" >
         <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"  label="手机号" >
          <a-input v-model="form.phone" disabled/>
        </a-form-item>
        <a-form-item label="用户下发" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-model="form.sn"
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
import { httpAction} from '@/api/manage'
import JDate from '@/components/panther/JDate.vue'
import JSelectUserByDep from '@/components/pantherbiz/JSelectUserByDep'

export default {
  //下发设备弹窗
  name: 'SysUserAgentModal',
  props: ['roleList'],
  components: {
    JDate,
    JSelectUserByDep,
  },
  data() {
    return {
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      username: '',
      confirmLoading: false,
      form: {
        sn: '',
        phone: '',
      },
      // validatorRules:{
      //   agentUserName:{rules: [{ required: true, message: '请输入代理人用户名!' }]},
      //   startTime:{rules: [{ required: true, message: '请输入代理开始时间!' }]},
      //   endTime:{rules: [{ required: true, message: '请输入代理结束时间!' }]},
      // },
      url: {
        add: '/operate/faceMember/add',
        edit: '/sys/sysUserAgent/edit',
        queryByUserName: '/sys/sysUserAgent/queryByUserName',
      },
    }
  },
 
  methods: {
    agentSettings(row) {
		console.log(row);
		this.visible = true
		this.username = row.userName
        this.form.phone = row.userPhone
   
    },
   
    close() {
      this.$emit('close')
	  this.form = this.$options.data().form
      this.visible = false
    },
    handleOk() {
      const that = this
	      that.confirmLoading = true
          httpAction(this.url.add, this.form, 'post').then((res) => {
			   that.confirmLoading = false
               if (res.code === 200) {
                 that.$message.success(res.message)
               } else {
                 that.$message.warning(res.message)
               }
             })
             .finally(() => {
               that.confirmLoading = false
               that.close()
             })
	},
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style scoped>
</style>