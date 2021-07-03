<template>
  <div class="page-header-index-wide">

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a @click="initLogInfo(1)">今日</a>
              <a @click="initLogInfo(2)">近七天</a>
              <a @click="initLogInfo(3)">本月</a>
              <a @click="initLogInfo(4)">本年</a>
            </div>
<!--            <a-range-picker :style="{width: '256px'}" />-->
          </div>

          <a-tab-pane loading="true" tab="" key="1">
            <h3 :style="{ marginBottom: '20px' }">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              考勤统计</h3>
            <a-row>
              <a-col :xl="23" :lg="12" :md="12" :sm="24" :xs="24">
                <a-row>
                  <a-col :span="6">
                    <head-info title="加班人数" :content="overtimeTotal"></head-info>
                  </a-col>

                  <a-col :span="6">
                    <head-info title="迟到人数" :content="belateTotal"></head-info>
                  </a-col>

                  <a-col :span="6">
                    <head-info title="早退人数" :content="leaveearlyTotal"></head-info>
                  </a-col>

                  <a-col :span="6">
                    <head-info title="调休人数" :content="adjustTotal"></head-info>
                  </a-col>

                </a-row>
                <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
              </a-col>
            </a-row>
          </a-tab-pane>

        </a-tabs>
      </div>
    </a-card>

  </div>
</template>

<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import HeadInfo from '@/components/tools/HeadInfo.vue'

  import Trend from '@/components/Trend'
  import { getHomeAttendanceStatistics } from '@/api/api'

  const rankList = []
  for (let i = 0; i < 7; i++) {
    rankList.push({
      name: '白鹭岛 ' + (i+1) + ' 号店',
      total: 1234.56 - i * 100
    })
  }
  const barData = []
  for (let i = 0; i < 12; i += 1) {
    barData.push({
      x: `${i + 1}月`,
      y:Math.floor(Math.random() * 1000) + 200
    })
  }

  export default {
    name: "IndexChart",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      MiniBar,
      MiniProgress,
      RankList,
      Bar,
      Trend,
      LineChartMultid,
      HeadInfo
    },
    data() {
      return {
        overtimeTotal:0,
        belateTotal:0,
        leaveearlyTotal:0,
        adjustTotal:0,
        loading: true,
        center: null,
        rankList,
        barData,
        visitFields:['overtimeCount','belateCount','leaveearlyCount','adjustCount'],
        visitInfo:[],
        indicator: <a-icon type="loading" style="font-size: 24px" spin />
      }
    },
    created() {
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
      this.initLogInfo(2);
    },
    methods: {
      initLogInfo (type) {
        var params = {
          type: type
        };
        getHomeAttendanceStatistics(params).then(res=>{
          if(res.success){
             if (res.result.list.length > 0){
                this.visitInfo = res.result.list;
             }else {
               this.visitInfo = [{type:0,overtimeCount:0,belateCount:0,leaveearlyCount:0,adjustCount:0}];
             }
             this.overtimeTotal = res.result.total.overtimeTotal.toString();
             this.belateTotal = res.result.total.belateTotal.toString();
             this.leaveearlyTotal = res.result.total.leaveearlyTotal.toString();
             this.adjustTotal = res.result.total.adjustTotal.toString();
             // this.visitInfo = [{加班:1,迟到:12,早退:2,调休:3,type:'08-19',tian:'2020-08-19'},{加班:1,迟到:12,早退:2,调休:3,type:'08-20',tian:'2020-08-20'},{加班:1,迟到:12,早退:2,调休:3,type:'08-21',tian:'2020-08-21'}];
           }
         })
      },
    }
  }
</script>

<style lang="less" scoped>
  .circle-cust{
    position: relative;
    top: 28px;
    left: -100%;
  }
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }
    p {
      line-height: 42px;
      margin: 0;
      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
</style>