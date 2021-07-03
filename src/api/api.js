import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import Vue from 'vue'
import {UI_CACHE_DB_DICT_DATA } from "@/store/mutation-types"

//角色管理
const addRole = (params)=>postAction("/sys/role/add",params);
const editRole = (params)=>putAction("/sys/role/edit",params);
const checkRoleCode = (params)=>getAction("/sys/role/checkRoleCode",params);
const queryall = (params)=>getAction("/sys/role/queryall",params);

//用户管理
const addUser = (params)=>postAction("/sys/user/add",params);
const editUser = (params)=>putAction("/sys/user/edit",params);
const queryUserRole = (params)=>getAction("/sys/user/queryUserRole",params);
const getUserList = (params)=>getAction("/sys/user/list",params);
const frozenBatch = (params)=>putAction("/sys/user/frozenBatch",params);
const userTrial = (params)=>postAction("/sys/user/updatePositive",params);
//验证用户是否存在
const checkOnlyUser = (params)=>getAction("/sys/user/checkOnlyUser",params);
//改变密码
const changePassword = (params)=>putAction("/sys/user/changePassword",params);

//权限管理
const addPermission= (params)=>postAction("/sys/permission/add",params);
const editPermission= (params)=>putAction("/sys/permission/edit",params);
const getPermissionList = (params)=>getAction("/sys/permission/list",params);
/*update_begin author:wuxianquan date:20190908 for:添加查询一级菜单和子菜单查询api */
const getSystemMenuList = (params)=>getAction("/sys/permission/getSystemMenuList",params);
const getSystemSubmenu = (params)=>getAction("/sys/permission/getSystemSubmenu",params);
const getSystemSubmenuBatch = (params) => getAction('/sys/permission/getSystemSubmenuBatch', params)

const queryTreeList = (params)=>getAction("/sys/permission/queryTreeList",params);
const queryTreeListForRole = (params)=>getAction("/sys/role/queryTreeList",params);
const queryListAsync = (params)=>getAction("/sys/permission/queryListAsync",params);
const queryRolePermission = (params)=>getAction("/sys/permission/queryRolePermission",params);
const saveRolePermission = (params)=>postAction("/sys/permission/saveRolePermission",params);
const queryPermissionsByUser = (params)=>getAction("/sys/permission/getUserPermissionByToken",params);
const loadAllRoleIds = (params)=>getAction("/sys/permission/loadAllRoleIds",params);
const getPermissionRuleList = (params)=>getAction("/sys/permission/getPermRuleListByPermId",params);
const queryPermissionRule = (params)=>getAction("/sys/permission/queryPermissionRule",params);

// 部门管理
const queryDepartTreeList = (params)=>getAction("/sys/sysDepart/queryTreeList",params);
const queryIdTree = (params)=>getAction("/sys/sysDepart/queryIdTree",params);
const queryParentName   = (params)=>getAction("/sys/sysDepart/queryParentName",params);
const searchByKeywords   = (params)=>getAction("/sys/sysDepart/searchBy",params);
const deleteByDepartId   = (params)=>deleteAction("/sys/sysDepart/delete",params);

//二级部门管理
const queryDepartPermission = (params)=>getAction("/sys/permission/queryDepartPermission",params);
const saveDepartPermission = (params)=>postAction("/sys/permission/saveDepartPermission",params);
const queryTreeListForDeptRole = (params)=>getAction("/sys/sysDepartPermission/queryTreeListForDeptRole",params);
const queryDeptRolePermission = (params)=>getAction("/sys/sysDepartPermission/queryDeptRolePermission",params);
const saveDeptRolePermission = (params)=>postAction("/sys/sysDepartPermission/saveDeptRolePermission",params);
const queryMyDepartTreeList = (params)=>getAction("/sys/sysDepart/queryMyDeptTreeList",params);

//日志管理
//const getLogList = (params)=>getAction("/sys/log/list",params);
const deleteLog = (params)=>deleteAction("/sys/log/delete",params);
const deleteLogList = (params)=>deleteAction("/sys/log/deleteBatch",params);

//数据字典
const addDict = (params)=>postAction("/sys/dict/add",params);
const editDict = (params)=>putAction("/sys/dict/edit",params);
const treeList = (params)=>getAction("/sys/dict/treeList",params);
const addDictItem = (params)=>postAction("/sys/dictItem/add",params);
const editDictItem = (params)=>putAction("/sys/dictItem/edit",params);

//考勤管理
const addAttendanceRule = (params)=>postAction("/attendance/rule/add",params);
const editAttendanceRule = (params)=>putAction("/attendance/rule/edit",params);
const editComputationPeriod = (params)=>putAction("/computation/period/edit",params);
const addConfine = (params)=>postAction("/confine/add",params);
const editConfine = (params)=>putAction("/confine/edit",params);

//设备管理
const addDevice = (params)=>postAction("/device/add",params);
const editDevice = (params)=>putAction("/device/edit",params);
const addFaceMessage = (params)=>postAction("/face/message/add",params);
const editFaceMessage = (params)=>putAction("/face/message/edit",params);
const addFaceMember = (params)=>postAction("/face/member/add",params);
const editFaceMember = (params)=>putAction("/face/member/edit",params);
const addDeviceLib = (params)=>postAction("/device/lib/add",params);
const editDeviceLib = (params)=>putAction("/device/lib/edit",params);
const queryDeviceAll = (params)=>getAction("/device/list",params);
const queryDeviceById = (params)=>getAction("/device/queryById",params);
const queryDeptDeviceTree = (params)=>getAction("/device/queryDeptDeviceTree",params);
const issueDevicePackage = (params)=>postAction("/device/issueDevicePackage",params);

// 门店信息
const addUser2 = (params)=>postAction("/operate/user/addUser",params);
const editUser2 = (params)=>putAction("/operate/user/updateUser",params);
const addStore = (params)=>postAction("/operate/store/add",params);
const editStore = (params)=>putAction("/operate/store/edit",params);

// 流地址管理
// const queryUserRole = (params)=>getAction("/sys/user/queryUserRole",params);
const getStoreList = (params)=>getAction("/operate/store/list",params);
const addAddress = (params)=>postAction("/operate/streamAddr/addStreamAddr",params);
const editAddress = (params)=>putAction("/operate/streamAddr/update",params);

//记录调整
const addProcess = (params)=>postAction("/process/add",params);
const editProcess = (params)=>putAction("/process/edit",params);

//小程序
const addNews = (params)=>postAction("/news/add",params);
const editNews = (params)=>putAction("/news/edit",params);
const addAdvertising = (params)=>postAction("/advertising/add",params);
const editAdvertising = (params)=>putAction("/advertising/edit",params);

//影院管理
const addCinema = (params)=>postAction("/cinema/add",params);
const editCinema = (params)=>putAction("/cinema/edit",params);

//密钥规则
const addKeyRule = (params)=>postAction("/key/rule/add",params);
const editKeyRule = (params)=>putAction("/key/rule/edit",params);

//字典标签专用（通过code获取字典数组）
export const ajaxGetDictItems = (code, params)=>getAction(`/sys/dict/getDictItems/${code}`,params);
//从缓存中获取字典配置
function getDictItemsFromCache(dictCode) {
  if (Vue.ls.get(UI_CACHE_DB_DICT_DATA) && Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode]) {
    let dictItems = Vue.ls.get(UI_CACHE_DB_DICT_DATA)[dictCode];
    console.log("-----------getDictItemsFromCache----------dictCode="+dictCode+"---- dictItems=",dictItems)
    return dictItems;
  }
}

//系统通告
const doReleaseData = (params)=>getAction("/sys/annountCement/doReleaseData",params);
const doReovkeData = (params)=>getAction("/sys/annountCement/doReovkeData",params);
//获取系统访问量
const getLoginfo = (params)=>getAction("/sys/loginfo",params);
const getVisitInfo = (params)=>getAction("/sys/visitInfo",params);

//获取首页考勤统计
const getHomeAttendanceStatistics = (params)=>getAction("/home/attendanceStatistics",params);

// 根据部门主键查询用户信息
const queryUserByDepId = (params)=>getAction("/sys/user/queryUserByDepId",params);

// 重复校验
const duplicateCheck = (params)=>getAction("/sys/duplicate/check",params);
// 加载分类字典
const loadCategoryData = (params)=>getAction("/sys/category/loadAllData",params);
const checkRuleByCode = (params) => getAction('/sys/checkRule/checkByCode', params)
//加载我的通告信息
const getUserNoticeInfo= (params)=>getAction("/sys/sysAnnouncementSend/getMyAnnouncementSend",params);
const getTransitURL = url => `/sys/common/transitRESTful?url=${encodeURIComponent(url)}`
// 中转HTTP请求
export const transitRESTful = {
  get: (url, parameter) => getAction(getTransitURL(url), parameter),
  post: (url, parameter) => postAction(getTransitURL(url), parameter),
  put: (url, parameter) => putAction(getTransitURL(url), parameter),
  http: (url, parameter) => httpAction(getTransitURL(url), parameter),
}

export {
  addCinema,
  editCinema,
  addFaceMember,
  editFaceMember,
  issueDevicePackage,
  addFaceMessage,
  editFaceMessage,
  queryDeptDeviceTree,
  queryDeviceById,
  addKeyRule,
  editKeyRule,
  getHomeAttendanceStatistics,
  addAdvertising,
  editAdvertising,
  addNews,
  editNews,
  addDeviceLib,
  editDeviceLib,
  addProcess,
  editProcess,
  addDevice,
  editDevice,
  addConfine,
  editConfine,
  editComputationPeriod,
  addAttendanceRule,
  editAttendanceRule,
  addRole,
  editRole,
  checkRoleCode,
  addUser,
  editUser,
  queryUserRole,
  getUserList,
  queryDeviceAll,
  queryall,
  frozenBatch,
  checkOnlyUser,
  changePassword,
  getPermissionList,
  addPermission,
  editPermission,
  queryTreeList,
  queryListAsync,
  queryRolePermission,
  saveRolePermission,
  queryPermissionsByUser,
  loadAllRoleIds,
  getPermissionRuleList,
  queryPermissionRule,
  queryDepartTreeList,
  queryIdTree,
  queryParentName,
  searchByKeywords,
  deleteByDepartId,
  deleteLog,
  deleteLogList,
  addDict,
  editDict,
  treeList,
  addDictItem,
  editDictItem,
  doReleaseData,
  doReovkeData,
  getLoginfo,
  getVisitInfo,
  queryUserByDepId,
  duplicateCheck,
  queryTreeListForRole,
  getSystemMenuList,
  getSystemSubmenu,
  getSystemSubmenuBatch,
  loadCategoryData,
  checkRuleByCode,
  queryDepartPermission,
  saveDepartPermission,
  queryTreeListForDeptRole,
  queryDeptRolePermission,
  saveDeptRolePermission,
  queryMyDepartTreeList,
  getUserNoticeInfo,
  getDictItemsFromCache,
  userTrial,
  getStoreList,
  addUser2,
  editUser2,
  addStore,
  editStore,
  addAddress,
  editAddress
}



