<template>
  <!--  <div>-->
  <!--    <div class="map-header">-->
  <!--      <button @click="fixedPos">定位</button>-->
  <!--      <div>-->
  <!--        <label>当前经度</label>-->
  <!--        <input v-model="map.lng" />-->
  <!--      </div>-->
  <!--      <div>-->
  <!--        <label>当前纬度</label>-->
  <!--        <input v-model="map.lat" />-->
  <!--      </div>-->
  <!--    </div>-->


  <!--    <baidu-map class="map" :center="map.center" :zoom="map.zoom" @ready="handler">-->
  <!--      &lt;!&ndash;缩放&ndash;&gt;-->
  <!--      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>-->
  <!--      &lt;!&ndash;定位&ndash;&gt;-->
  <!--      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>-->
  <!--      &lt;!&ndash;点&ndash;&gt;-->
  <!--      &lt;!&ndash;      <bm-marker  :position="map.center" :dragging="map.dragging" animation="BMAP_ANIMATION_DROP">&ndash;&gt;-->
  <!--      &lt;!&ndash;        &lt;!&ndash;提示信息&ndash;&gt;&ndash;&gt;-->
  <!--      &lt;!&ndash;        <bm-info-window :show="map.show">Hello~</bm-info-window>&ndash;&gt;-->
  <!--      &lt;!&ndash;      </bm-marker>&ndash;&gt;-->
  <!--      <bm-marker v-for="item in map.markers" :position="{lng: item.lng, lat: item.lat}" :dragging="map.dragging" animation="BMAP_ANIMATION_DROP" @click="lookDetail(item)">-->
  <!--        &lt;!&ndash;提示信息&ndash;&gt;-->
  <!--        <bm-info-window :title="map.infoWindow.info.name" :position="{lng: map.infoWindow.info.lng, lat: map.infoWindow.info.lat}"   :show="item.showFlag" @close="infoWindowClose(item)" @open="infoWindowOpen(item)">-->
  <!--        </bm-info-window>-->
  <!--      </bm-marker>-->
  <!--    </baidu-map>-->
  <!--  </div>-->


  <a-row :gutter="10">
    <a-col :md="4" :sm="24">
      <a-card :bordered="false">
        <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
          <a-input-search @search="onSearch" style="width:100%;margin-top: 10px" placeholder="请输入设备名称"/>
          <!-- 树-->

          <template v-if="userIdentity === 2 && departTree.length>0">

            <!--组织机构-->
            <a-tree
              showLine
              :selectedKeys="selectedKeys"
              :checkStrictly="true"
              @select="onSelect"
              :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
              :treeData="departTree"
              :autoExpandParent="autoExpandParent"
              :expandedKeys="iExpandedKeys"
              @expand="onExpand"
            />

          </template>
          <div style="margin-top: 24px;" v-else><h3>普通员工暂此权限</h3></div>
        </div>
      </a-card>
    </a-col>
    <a-col :md="20" :sm="24">
      <a-card :bordered="false">
        <baidu-map class="map" :center="map.center" :zoom="map.zoom" @ready="handler">
          <!--缩放-->
          <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
          <!--定位-->
          <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
          <!--点-->
          <bm-marker v-for="item in map.markers" :position="{lng: item.lng, lat: item.lat}" :dragging="map.dragging" animation="BMAP_ANIMATION_DROP" @click="lookDetail(item)">
            <!--提示信息-->
            <bm-info-window :title="map.infoWindow.info.title" :position="{lng: map.infoWindow.info.lng, lat: map.infoWindow.info.lat}"   :show="item.showFlag" @close="infoWindowClose(item)" @open="infoWindowOpen(item)">
            </bm-info-window>
          </bm-marker>
        </baidu-map>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>

  import {queryDeviceById, queryDeptDeviceTree} from '@/api/api'
  import {PantherListMixin} from '@/mixins/PantherListMixin'
  //医疗设备地图
  export default {
    name: "map",
    mixins: [PantherListMixin],
    data: () => ({
      map:{//113.956662,22.537299     113.959106,22.537032
        // markers: [{lng: 113.956662, lat: 22.537299,title:'测试1',showFlag:false},
        //   {lng: 113.959106, lat: 22.537032,title:'测试2',showFlag:false}],
        markers: [],
        infoWindow : {
          info:{}
        },
        lng:'',
        lat:'',
        center: {lng: 114.02597366, lat: 22.54605355},
        zoom: 15,
        show: true,
        dragging: false
      },
      userIdentity:2,
      autoExpandParent: true,
      selectedKeys: [],
      iExpandedKeys: [],
      departTree: [],
      treeData: []
    }),
    methods: {
      handler ({BMap, map}) {
        let that = this;
        console.log(BMap, map)
        // 鼠标缩放
        map.enableScrollWheelZoom(true);
        // 点击事件获取经纬度
        map.addEventListener('click', function (e) {
          console.log(e.point.lng, e.point.lat)
          that.map.show = true
        })
      },
      // 点击点坐标赋值
      lookDetail(marker){
        marker.showFlag = true;
        this.map.infoWindow.info = marker;
      },
      // 关闭弹窗
      infoWindowClose(marker) {
        marker.showFlag = false
      },
      // 打开弹窗
      infoWindowOpen(marker) {
        marker.showFlag = true
      },
      // 点击定位-定位到当前位置
      fixedPos() {
        let that = this;
        // that.map.center = {lng: 113.956662, lat: 22.537299};
        that.map.center = {lng: that.map.lng, lat:  that.map.lat};
      },
      loadData() {
        this.refresh();
      },
      refresh() {
        this.loading = true
        this.loadTree()
      },
      loadTree(name) {
        var that = this
        that.treeData = [];
        that.departTree = [];
        that.map.markers = [];
        let param = {
          name:name,
          type:1
        };
        queryDeptDeviceTree(param).then((res) => {
          if (res.success && res.result ) {
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.treeData.push(temp);
              that.departTree.push(temp);
              that.setThisExpandedKeys(temp);
              //添加标注点
              that.map.markers.push(temp);
            }
            this.loading = false
          }
        })
      },
      setThisExpandedKeys(node) {
        //只展开一级目录
        if (node.children && node.children.length > 0) {
          this.iExpandedKeys.push(node.key)
        }
      },
      onExpand(expandedKeys) {
        this.iExpandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      onSearch(value) {
        this.loadTree(value)
      },
      onSelect(selectedKeys, e) {
        var that = this;
        let param = {
          id:selectedKeys[0]
        };
        queryDeviceById(param).then((res) => {
          if (res.success && res.result ) {
            that.map.center = {lng: res.result.lng, lat: res.result.lat};
          }
        })
      },
    }
  }
</script>

<style scoped>
  .map {
    width: 100%;
    height: 800px;
  }
</style>