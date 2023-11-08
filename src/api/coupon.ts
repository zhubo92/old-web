import request from "@/utils/request";
export function getCouponRequest(data: any) {
  return request({
    url: `/mall/mobile/coupon/deducePrice`,
    method: "POST",
    data,
  });
}

export function calcCouponOneRequest(data: {
  activity: {
    activityId: string;
    activityType: string;
    value: number;
  };
  couponId: string;
  orderGoodsInfoVOS: {
    amount: number;
    id: string;
    type: number;
  }[];
}) {
  return request<number>({
    url: `/mall/mobile/coupon/deducePrice/one`,
    method: "POST",
    data,
  });
}
