<template>
  <a-modal
    :width="1000"
    :title="title"
    :visible="innerVisible"
    @cancel="handleCancel"
    cancelText="关闭"
    :okButtonProps="{style:{display:'none'}}"
  >
    <a-table
      ref="table"
      rowKey="id"
      size="middle"
      bordered
      :columns="columns"
      :loading="loading"
      :dataSource="dataSource"
      :pagination="ipagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="handleTableChange">

    </a-table>

  </a-modal>
</template>

<script>

  import { getAction } from '@/api/manage'
  import {PantherListMixin} from '@/mixins/PantherListMixin'

  // 高度封装的请求，请务必使用 superRequest.call(this,{}) 的方式调用
  function superRequest(options) {
    this.loading = !!options.loading
    var params = this.getQueryParams();//查询条件
    let param = {
      advertisingId:this.advertisingId
    }
    getAction(this.url.list,param).then(res => {
      if (res.success && typeof options.success === 'function') {
        options.success(res)
      } else {
        throw new Error(res.message)
      }
    }).catch(e => {
      // this.$message.warning('查询设备接收情况失败：' + (e.message || e))
    }).finally(() => {
      this.loading = false
    })
  }

  export default {
    name: 'AdvertDeviceModal',
    mixins: [PantherListMixin],
    props: {
      advertisingId:'',
      visible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        title: '设备接收情况',
        loading: false,
        innerVisible: false,
        selectedRowKeys: [],
        dataSource: [],
        queryParam: {advertisingId:this.advertisingId},
        columns: [
          { title: '设备号', align: 'center', dataIndex: 'sn'},
          { title: '设备名称', align: 'center', dataIndex: 'deviceName'},
          { title: '设备接收状态', align: 'center', dataIndex: 'receiveStatus',customRender: function (text) {if(text == 1) {return "成功";}else {return "未接收";}} }
        ],
        url: {
          list: "/advertising/queryReception",
        },
      }
    },
    watch: {
      visible: {
        handler(val) {
          if (val) {
            this.loadData()
          }
          this.innerVisible = val
        }
      },
      innerVisible(val) {
        this.$emit('update:visible', val)
      },
    },
    methods: {
      loadData() {
        superRequest.call(this, {
          loading: true,
          promise: this.$http.get(this.url.list),
          success: res => this.dataSource = res.result.records
        })
      },
      handleOk() {
        this.loadData()
        this.$emit('ok')
      },
      handleCancel() {
        this.innerVisible = false
      },
      handleClearSelection() {
        this.handleTableSelectChange([], [])
      },
      handleTableSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectionRows = selectionRows
      },
    }
  }
</script>

<!--<style lang="less" scoped></style>-->
<style scoped>
  @import '~@assets/less/common.less'
</style>