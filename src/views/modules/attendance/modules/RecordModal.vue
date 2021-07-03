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
      :pagination="false"
      :rowSelection="{selectedRowKeys, onChange: handleTableSelectChange}"
    >

    </a-table>

  </a-modal>
</template>

<script>

  import { getAction } from '@/api/manage'

  // 高度封装的请求，请务必使用 superRequest.call(this,{}) 的方式调用
  function superRequest(options) {
    this.loading = !!options.loading
    let param = {
      userId:this.userId,
      startTime:this.startTime.substring(0,10)+" 00:00:00",
      endTime:this.endTime.substring(0,10)+" 23:59:59"
    }
    getAction(this.url.list,param).then(res => {
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
    name: 'RecordModal',
    props: {
      userId:'',
      startTime:null,
      endTime:null,
      visible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        title: '考勤明细',
        loading: false,
        innerVisible: false,
        selectedRowKeys: [],
        dataSource: [],
        columns: [
          { title: '打卡时间', align: 'center', dataIndex: 'recordTime', sorter: true},
          { title: '姓名', align: 'center', dataIndex: 'userName'},
          { title: '工号', align: 'center', dataIndex: 'workNo' },
          { title: '所属部门', align: 'center', dataIndex: 'deptName' },
          { title: '核验设备', align: 'center', dataIndex: 'sn' }

        ],
        url: {
          list: "/record/list",
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

<style lang="less" scoped></style>