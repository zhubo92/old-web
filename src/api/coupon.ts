import request from "@/utils/request";
export function getCouponRequest(data: any) {
  return request({
    url: `/mall/mobile/coupon/deducePrice`,
    method: "POST",
    data,
  });
}

export function calcCouponOneRequest(data: any) {
  return request({
    url: `/mall/mobile/coupon/deducePrice/one`,
    method: "POST",
    data,
  });
}
