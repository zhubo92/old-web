import request from "@/utils/request";

export function getMagicCoinsPayRequest(orderId: string) {
  return request({
    url: `app/v1/aiCourse/order/${orderId}/magic/coin/pay`,
    method: "GET",
  });
}

export function getMagicCoinsPayOrderRequest(data: {
  courseSkuId: string;
  courseSpuId: string;
  wxName: string | null | undefined;
}) {
  return request({
    url: `app/v1/aiCourse/order/H5`,
    method: "POST",
    data,
    headers: {
      platform: "H5",
    },
  });
}

export function getMagicCoinsRequest() {
  return request<number>({
    url: `mall/magic-coin/getCoins`,
    method: "GET",
  });
}

export function getCourseOrderWeChatPayRequest(data: { orderId: string }) {
  return request({
    url: `app/h5/course/order/wechat/pay`,
    method: "POST",
    data,
  });
}

export function getCourseOrderRequest(data: { courseSkuId: string; wxName: string }) {
  return request<string>({
    url: `app/h5/course/order`,
    method: "POST",
    data,
  });
}

export function payOrderByMagicRequest(orderId: string) {
  return request({
    url: `app/v1/aiCourse/order/${orderId}/magic/coin/pay`,
    method: "GET",
  });
}

export function getWxPaySignRequest(orderId: string) {
  return request({
    url: `app/v1/aiCourse/order/${orderId}/wx/pay`,
    method: "GET",
  });
}

export function getAliPaySignRequest(orderId: string) {
  return request({
    url: `app/v1/aiCourse/order/${orderId}/ali/pay`,
    method: "GET",
  });
}

export function placeOrderAtAppRequest(data: {
  orderType: number;
  payApi: string;
  platform: string;
  courseSkuId: string | undefined;
  payMethod: number;
}) {
  return request<{ id: string; state: number }>({
    url: `app/v1/aiCourse/order/v2`,
    method: "POST",
    data,
  });
}

export function deleteAICourseOrderRequest(id: string) {
  return request({
    url: `app/v1/aiCourse/order/unpaid/${id}`,
    method: "DELETE",
  });
}

export function deleteProductOrderRequest(id: string) {
  return request({
    url: `mall/mobile/unpaid/${id}`,
    method: "DELETE",
  });
}

export function addPhoneToOrderRequest(orderId: string, phone: string) {
  return request({
    url: `app/app/gameCourse/note/${orderId}/${phone}`,
    method: "GET",
  });
}

export function wxBindPhoneRequest(phone: string, code: string, data: any) {
  return request({
    url: `app/h5/course/order/wxBandPhone/${phone}/${code}`,
    method: "POST",
    data,
  });
}

export function verifyBindPhoneRequest() {
  return request({
    url: `app/h5/login/bindWx`,
    method: "GET",
  });
}

export function addOrderInAPPRequest(data: {
  orderType: number;
  courseSkuId: string;
  payApi: string;
  payChannels: number;
  payMethod: number;
}) {
  return request<string>({
    url: `app/v1/aiCourse/order`,
    method: "POST",
    data,
  });
}
