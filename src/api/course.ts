import request from '@/utils/request'
import type { IQueryParams } from '@/types/http-codes'
import type { ILuojigouCourse } from '@/types/course'
export function getLuojigouCourseListRequest(params: IQueryParams) {
  return request<{ entityList: ILuojigouCourse[] }>({
    url: `app/app/gameCourse/list`,
    method: 'GET',
    params
  })
}

/**
 * 用户是否购买过逻辑狗课程
 */
export function checkUserBuyCourseRequest() {
  return request({
    url: `app/app/gameCourse/check/user`,
    method: 'GET'
  })
}

/**
 * 收藏课程
 */
// export function handleCollectCourseRequest(data) {
//   return request({
//     url: `app/aiCourse/collect`,
//     method: 'POST',
//     data
//   })
// }
