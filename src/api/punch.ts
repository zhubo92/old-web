import request from "@/utils/request";
import type { IQueryParams } from "@/types/http-codes";
import type { IPunchActivity, IPunchCourse, IPunchDetail, IPunchRecord } from "@/types/punch";
export function getPunchActivityListRequest(params: IQueryParams) {
  return request<{
    records: IPunchActivity[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    searchCount: boolean;
    pages: number;
  }>({
    url: `mall/cashback/activity/page`,
    method: "GET",
    params,
  });
}

export function checkinUserNotifyRequest(data: { id: string; state: number }) {
  return request<0 | 1>({
    url: `mall/cashback/activity/checkin/notify`,
    method: "PUT",
    data,
  });
}

export function getPunchUserDetailRequest(params: { activityId: string }) {
  return request<IPunchCourse>({
    url: `mall/cashback/activity/user/detail`,
    method: "GET",
    params,
  });
}

export function applyMyCashbackRequest(activityId: string) {
  return request({
    url: `mall/MyCashback/apply/${activityId}`,
    method: "GET",
  });
}

export function getPunchRecordRequest(params: IQueryParams & { activityId: string }) {
  return request<{
    records: IPunchRecord[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    searchCount: boolean;
    pages: number;
  }>({
    url: `mall/cashback/activity/checkin/record`,
    method: "GET",
    params,
  });
}

export function getPunchDetailRequest(activityId: string) {
  return request<IPunchDetail>({
    url: `mall/cashback/activity/checkin/detail?activityId=${activityId}`,
    method: "GET",
  });
}
