import api from './index'
import { axios } from '@/utils/request'

/**
 * @param parameter
 * @returns {*}
 */
// 历史数据
export function getuserlist(parameter) {
  return axios({
    url: '/operate/accessLog/list',
    method: 'GET',
  })
}

// 用户详情
export function getuserinfo(id) {
  return axios({
    url: '/operate/user/getById',
    method: 'GET',
  //   params:{
	// 	userId:+id,
	// }
  })
}

// 门店信息获取
export function getStoreList() {
  return axios({
    url: '/operate/store/list',
    method: 'get',
  })
}

// 门店查询
export function searchStore(name) {
  return axios({
    url: '/operate/store/list',
    method: 'get',
    params:{
      storeName:name,
	    }
  })
}

// 添加门店
export function addStore(parameter) {
  return axios({
    url: '/operate/store/add',
    method: 'post',
    data: parameter
  })
}

// 获取设备列表
export function deviceList() {
  return axios({
    url: '/operate/device/list',
    method: 'get',
  })
}

// 获取设备列表客户列表中
export function deviceListUser() {
  return axios({
    url: '/operate/device/list',
    method: 'get',
    params:{
      status:3,
      type:2
    }
  })
}

// 实时数据信息
export function getImgList() {
  return axios({
    url: '/operate/accessLog/list',
    method: 'get',
  })
}

// 客户列表查询接口
export function getVisiterlist(name) {
  return axios({
    url: '/operate/user/list',
    method: 'GET',
    params:{
      userName:name,
	}
  })
}

// 用户详情查询
export function getVisiterdetail(phone) {
  return axios({
    url: '/operate/user/getById',
    method: 'GET',
    params:{
      phone:phone,
	}
  })
}

// 设备查询
export function getDeviceInfo(id) {
  return axios({
    url: '/operate/device/queryById',
    method: 'GET',
    params:{
      id:id,
	}
  })
}
// 客户列表批量下发IssureAll
export function IssureAll(parameter) {
  return axios({
    url: '/operate/faceMember/addBatch',
    method: 'POST',
    data: parameter
  })
}

// 获取流地址列表
export function getAddressList() {
  return axios({
    url: '/operate/streamAddr/list',
    method: 'get',
  })
}

// 删除视频流地址
export function deleAddress(id) {
  return axios({
    url: '/operate/streamAddr/delete',
    method: 'Delete',
    params:{
      id:id,
	}
  })
}


// 查询视频流地址
export function searchAddress(name) {
  return axios({
    url: '/operate/streamAddr/list',
    method: 'get',
    params:{
      name:name,
	}
  })
}
export function logout(logoutToken) {
  return axios({
    url: '/sys/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Access-Token':  logoutToken
    }
  })
}

/**
 * 第三方登录
 * @param token
 * @returns {*}
 */
export function thirdLogin(token) {
  return axios({
    url: `/thirdLogin/getLoginUser/${token}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}