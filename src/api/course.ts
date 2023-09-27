import request from "@/utils/request";
import type { IQueryParams } from "@/types/http-codes";
import type { ILuojigouCourse } from "@/types/course";
export function getLuojigouCourseListRequest(params: IQueryParams) {
  return request<{ entityList: ILuojigouCourse[] }>({
    url: `app/app/gameCourse/list`,
    method: "GET",
    params,
  });
}

/**
 * 用户是否购买过逻辑狗课程
 */
export function checkUserBuyCourseRequest() {
  return request({
    url: `app/app/gameCourse/check/user`,
    method: "GET",
  });
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

export function getAICourseItemBank2Request(params: { skuId: string }) {
  return request({
    url: `app/app/gameCourse/bank/2`,
    method: "GET",
    params,
  });
}

export function getAICourseItemRequest(params: { skuId: string }) {
  return request({
    url: `app/v1/AICourse/item`,
    method: "GET",
    params,
  });
}

export function handleCollectCourseRequest(data: { aiCourseSpuId: string; aiCourseSkuId: string }) {
  return request({
    url: `app/aiCourse/collect`,
    method: "POST",
    data,
  });
}
