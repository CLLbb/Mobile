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
    let param = {
      sn:this.sn,
      type:this.type
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
    name: 'DeviceCommandAckModal',
    mixins: [PantherListMixin],
    props: {
      sn:'',
      type:null,
      subtype:null,
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
        queryParam: {sn:this.sn,type:this.type},
        columns: [
          { title: '设备号', align: 'center', dataIndex: 'sn'},
          { title: '指令类型', align: 'center', dataIndex: 'type',
            customRender: function (text) {
              if(text == 1) {return "设备关机";}
              else if (text==2){return "设备重启";}
              else if (text==3){return "抓拍图片";}
              else if (text==4){return "设备激活";}
              else if (text==5){return "设备冻结";}
              else if (text==6){return "闸机开关指令";}
              else if (text==7){return "支付事件";}
            }
          },
          { title: '子类型', align: 'center', dataIndex: 'subtype',
            customRender: function (text) {
            if(text == 1) {return "左开闸";}
            else if (text==2){return "左闸常开";}
            else if (text==3){return "左关闸";}
            else if (text==4){return "右开闸";}
            else if (text==5){return "右闸常开";}
            else if (text==6){return "右关闸";}
            }
          },
          { title: '设备接收状态', align: 'center', dataIndex: 'receiveStatus',customRender: function (text) {if(text == 1) {return "成功";}else {return "未接收";}} }
        ],
        url: {
          list: "/device/queryReceiveStatusBySn",
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
      // loadData() {
      //   superRequest.call(this, {
      //     loading: true,
      //     promise: this.$http.get(this.url.list),
      //     success: res => this.dataSource = res.result.records
      //   })
      // },
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