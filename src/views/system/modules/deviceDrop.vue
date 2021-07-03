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
         <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"  label="设备id" >
          <a-input v-model="form.id" disabled/>
        </a-form-item>
        <a-form-item label="关联的门店" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-model="form.id"
            style="width: 100%"
            placeholder="选择要关联的门店"
            :getPopupContainer="(target) => target.parentNode"
          >
            <a-select-option v-for="(role, roleindex) in storeList" :key="roleindex.toString()" :value="role.id">
              {{ role.storeName }}
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
  props: ['storeList'],
  components: {
    JDate,
    JSelectUserByDep,
  },
  data() {
    return {
      title: '门店关联',
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
        id: '',  //门店id
        id: '',//设备id  id
      },
      url: {
        add: '/operate/device/dev_bangding',
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
        this.form.id = row.id
   
    },
   
    close() {
      this.$emit('close')
	  this.form = this.$options.data().form
      this.visible = false
    },
    handleOk() {
      const that = this
	      that.confirmLoading = true
		  var arr = [];
		  arr[0]=this.form
          httpAction(this.url.add, arr, 'post').then((res) => {
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