import request from "@/utils/request";
import type { IUserInfo } from "@/types/user";

/**
 * 用户信息
 */
export function queryUserInfoRequest() {
  return request<IUserInfo>({
    url: "/teacher-lib/home/query/userInfo",
    method: "GET",
  });
}

/**
 * 校验是否超过使用人数
 */
export function verifyAuthCountRequest() {
  return request<string | null>({
    url: "/teacher-lib/utils/auth/count",
    method: "POST",
  });
}

/**
 * c端短信登录
 */
export function getCUserToken(phone: string, code: string) {
  return request<{ accessToken: string }>({
    url: `/app/sms/v2/checkCode/app/${phone}/${code}`,
    method: "POST",
  });
}

/**
 * 家长端或者教师端短信登录
 */
export function getParentOrTeachToken(phone: string, code: string) {
  return request<{ parentAccessToken: string; teacherAccessToken: string }>({
    url: `/parent/sms/login/V3/${phone}/${code}`,
    method: "GET",
  });
}

/**
 * c端签名
 */
export function getCWXSignature() {
  const url = window.location.href.split("#")[0];
  return request<{
    debug: boolean;
    signature: string;
    appId: string;
    url: string;
    nonceStr: string;
    timestamp: string;
  }>({
    url: `/app/wx/sign`,
    method: "GET",
    params: { url },
  });
}

/**
 * 获取家长端微信签名
 */
export function getParentWXSignature() {
  const url = window.location.href.split("#")[0];
  return request<{
    debug: boolean;
    signature: string;
    appId: string;
    url: string;
    nonceStr: string;
    timestamp: string;
  }>({
    url: `/app/wx/sign/parent`,
    method: "GET",
    params: { url },
  });
}

/**
 * 教师端签名
 */
export function getTeachWXSignature() {
  const url = window.location.href.split("#")[0];
  return request<{
    debug: boolean;
    signature: string;
    appId: string;
    url: string;
    nonceStr: string;
    timestamp: string;
  }>({
    url: `/app/wx/sign/teach`,
    method: "GET",
    params: { url },
  });
}

/**
 * 验证微信是否绑定手机号
 */
export function verifyBindPhoneRequest() {
  return request({
    url: `/app/h5/login/bindWx`,
    method: "GET",
  });
}

/**
 * 微信绑定手机号
 */
export function wxBindPhoneRequest(phone: string, code: string, data: any) {
  return request({
    url: `/app/h5/course/order/wxBandPhone/${phone}/${code}`,
    method: "POST",
    data,
  });
}

/**
 * 查询订单
 */
export function getAICourseOrderRequest(params: { isPage: number; state: number }) {
  return request<{ entityList: [] }>({
    url: `/app/v1/aiCourse/order`,
    method: "GET",
    params,
  });
}

/**
 * 获取验证码
 */
export function getSMSByPhoneRequest(phone: string) {
  return request({
    url: `mall/publicGood/login/SMS/${phone}`,
    method: "GET",
  });
}

/**
 * 校验Token
 */
export function verifyTokenRequest() {
  return request({
    url: `mall/mobile/common/verify/token`,
    method: "GET",
  });
}

/**
 * 微信网页授权登录
 */
export function weixinLoginRequest(data: any) {
  return request<IUserInfo>({
    url: `app/h5/login/wechat`,
    method: "POST",
    data,
  });
}
