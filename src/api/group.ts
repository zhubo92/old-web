import request from "@/utils/request";
import type {
  ICommodityCommit,
  IGroupActivity,
  IGroupCommodity,
  IGroupCourse,
  IGroupDetail,
  IGroupOrder,
} from "@/types/group";
export function getGroupActivityByPageRequest(params: {
  id: undefined | string;
  isPage: 1 | 0;
  page: number;
  pageSize: number;
}) {
  return request<{
    records: IGroupActivity[];
    total: number;
    size: number;
    current: number;
    orders: [];
    searchCount: boolean;
    pages: number;
  }>({
    url: `mall/mobile/group-activity/page`,
    method: "GET",
    params,
  });
}

export function getMobileCourseDetailRequest(id: string) {
  return request<IGroupCourse>({
    url: `mall/mobile/course/detail?skuId=${id}`,
    method: "GET",
  });
}

export function getGroupBuyGroupDetailByOrderRequest(orderId: string) {
  return request({
    url: `mall/mobile/group-buy/group/detail/order?orderId=${orderId}`,
    method: "GET",
  });
}

export function getMobileCommodityDetailRequest(spuId: string) {
  return request<IGroupCommodity>({
    url: `mall/mobile/group/detail?spuId=${spuId}`,
    method: "GET",
  });
}

export function getAICourseActivityRequest(skuId: string) {
  return request({
    url: `app/v1/AICourse/activity?skuId=${skuId}`,
    method: "GET",
  });
}

export function getGroupBuyGroupDetailRequest(id: string) {
  return request<IGroupDetail>({
    url: `mall/mobile/group-buy/group/detail/group?groupId=${id}`,
    method: "GET",
  });
}

export function getGroupBuySkuDetailRequest(params: { activity: string; sku: string }) {
  return request<IGroupOrder>({
    url: `mall/mobile/group-buy/sku/detail`,
    method: "GET",
    params,
  });
}

export function goGroupBuyCoursePayRequest(data: any) {
  return request({
    url: `mall/mobile/group-buy/course/pay`,
    method: "POST",
    data,
  });
}

export function goGroupBuyProductPayRequest(data: any) {
  return request({
    url: `mall/mobile/group-buy/product/pay`,
    method: "POST",
    data,
  });
}

export function getMobileCommitBySpuIdRequest(spuId: string, state: number, page: number) {
  return request<{
    assistData: null;
    currentPage: number;
    entityList: ICommodityCommit[];
    pageSize: number;
    total: number;
  }>({
    url: `mall/mobile/commit/get/${spuId}/${state}/${page}`,
    method: "GET",
  });
}
