import request from '@/utils/request'

// 查询系统信息列表
export function listDqSystemInfo(query) {
  return request({
    url: '/system/dqSystemInfo/list',
    method: 'get',
    params: query
  })
}

// 查询系统信息详细
export function getDqSystemInfo(id) {
  return request({
    url: '/system/dqSystemInfo/' + id,
    method: 'get'
  })
}

// 新增系统信息
export function addDqSystemInfo(data) {
  return request({
    url: '/system/dqSystemInfo',
    method: 'post',
    data: data
  })
}

// 修改系统信息
export function updateDqSystemInfo(data) {
  return request({
    url: '/system/dqSystemInfo',
    method: 'put',
    data: data
  })
}

// 删除系统信息
export function delDqSystemInfo(id) {
  return request({
    url: '/system/dqSystemInfo/' + id,
    method: 'delete'
  })
}
