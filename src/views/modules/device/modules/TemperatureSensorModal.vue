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
    debugger;
    let param = {
      sn:this.sn
    }
    getAction(this.url.list,params).then(res => {
      if (res.success && typeof options.success === 'function') {
        options.success(res)
      } else {
        throw new Error(res.message)
      }
    }).catch(e => {
      this.$message.warning('查询已删除的用户失败：' + (e.message || e))
    }).finally(() => {
      this.loading = false
    })
  }

  export default {
    name: 'TemperatureSensorModal',
    mixins: [PantherListMixin],
    props: {
      sn:'',
      visible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        title: '传感器数据',
        loading: false,
        innerVisible: false,
        selectedRowKeys: [],
        dataSource: [],
        queryParam: {sn:this.sn},
        columns: [
          { title: '温度（C）', align: 'center', dataIndex: 'temperature'},
          { title: '湿度（%RH）', align: 'center', dataIndex: 'humidity'},
          { title: '室内（Pa）', align: 'center', dataIndex: 'pressureDifference' },
          { title: '高效（Pa）', align: 'center', dataIndex: 'pressure' },
          { title: '0.5微粒（ug/m³）', align: 'center', dataIndex: 'dusk' },
          { title: '5微粒（ug/m³）', align: 'center', dataIndex: 'particle' },
          { title: '风速（m/s）', align: 'center', dataIndex: 'windSpeed' },
          { title: '上传时间', align: 'center', dataIndex: 'createTime'}
        ],
        url: {
          list: "/temperature/sensor/list",
        },
      }
    },
    watch: {
      visible: {
        immediate: true,
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
        // superRequest.call(this, {
        //   loading: true,
        //   promise: this.$http.get(this.url.list),
        //   success: res => this.dataSource = res.result.records
        // })
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