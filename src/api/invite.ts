import request from "@/utils/request";
import type { IQueryParams } from "@/types/http-codes";
import type { IInviteRecord } from "@/types/invite";

export function getInviteHavePrizeActivityRequest(id: string) {
  return request({
    url: `mall/share-encourage/activity/${id}`,
    method: "GET",
  });
}

export function getInviteHavePrizePosterInfoRequest(shareEncourageId: string) {
  return request({
    url: `mall/share-encourage/poster/${shareEncourageId}`,
    method: "GET",
  });
}

export function getAllInviteRecordsRequest(params: IQueryParams) {
  return request<{
    currentPage: number;
    pageSize: number;
    total: number;
    entityList: IInviteRecord[];
    assistData: null;
  }>({
    url: `mall/share-encourage/invite/all`,
    method: "GET",
    params,
  });
}
