import {
  getCUserToken,
  getCWXSignature,
  getParentOrTeachToken,
  verifyTokenRequest,
  weixinLoginRequest,
} from "@/api/user";
import wx from "weixin-js-sdk";
import { HttpCodeEnum } from "@/types/http-codes";
import { showToast } from "vant";
import { clearData, getLToken, setSToken, setLToken, setUserInfo } from "@/utils/storage";
import html2canvas from "html2canvas";
import * as process from "process";

export function getImageUrl(name: string) {
  return new URL(`../assets/images/${name}.png`, import.meta.url).href;
}

export async function convertToImage(element: HTMLElement) {
  return html2canvas(element, {
    scale: 4,
    width: element.offsetWidth,
    height: element.offsetHeight,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  }).then((canvas) => {
    return canvas.toDataURL("image/png");
  });
}

/**
 * 友盟埋点
 */
export function buried(event: string, params = {}) {
  console.log(event, params, "友盟埋点");
  const { aplus_queue } = window as any;
  if (aplus_queue) {
    aplus_queue.push({
      action: "aplus.record",
      arguments: [event, "CLK", params],
    });
  }
}

/**
 * 返回顶部
 */
export function backTop() {
  const html = document.documentElement;
  html.scrollTop = 0;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  console.log("返回顶部了");
}

/**
 * 当前环境是否是微信浏览器
 */
export function isWeixinBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return /micromessenger/i.test(ua);
}

/**
 * 在APP中跳转APP页面的方法
 */
export function navAppPage(
  route: string,
  error: null | Function = null,
  callback = "",
  replace = false,
) {
  callAppFc("navAppPage", { route, callback, replace }, error);
}

export function popPage() {
  callAppFc("popPage");
}

export function returnPage() {
  callAppFc("returnPage");
}

export function launchMiniProgram(params: { appId: string; path: string }) {
  callAppFc("launchMiniProgram", params);
}

export function shareToFriendForReward(
  params: {
    title?: string;
    imgUrl?: string;
    inviteCode: string;
    teamLeader?: 0 | 1;
    productImage?: string;
    activityPrice?: number;
    originalPrice?: number;
    population?: number;
  },
  callback?: () => void,
) {
  callAppFc("shareToFriendForReward", params, callback);
}

export function shareCommonCourse(course: any) {
  callAppFc("shareCommonCourse", { course });
}
export function shareToWechatWeb(
  id: number,
  image = "https://app-resources-luojigou.luojigou.vip/Fk6jPFoAXOcNcmGk1nBi_S6z6vet",
  thumb = "https://app-resources-luojigou.luojigou.vip/Fk6jPFoAXOcNcmGk1nBi_S6z6vet",
  description = "开团后邀请好友拼团，团满即得！",
  url = window.location.href,
  title = "宝贝启蒙必修课，超值拼团限时购！",
) {
  callAppFc("shareToWechatWeb", {
    scene: id,
    image,
    thumb,
    description,
    url,
    title,
  });
}

/**
 * 调用app方法
 */
export function callAppFc(event: any, params = {}, error: null | Function = null) {
  if (!isWeixinBrowser()) {
    console.log(event, params, "callAppFc");
    try {
      window[event]["postMessage"](JSON.stringify(params));
    } catch (err) {
      if (error) error();
      console.log(err, event);
    }
  }
}

/**
 * 请求 app token
 *
 * 18043110072 15614410020 16603861667 18210827464
 */
export function getTestToken(phone = "15614410020", code = "5566", type = "c") {
  return new Promise((resolve) => {
    if (type === "c") {
      getCUserToken(phone, code).then((res) => {
        const { data, status } = res;
        console.log(data, "data");
        if (status === HttpCodeEnum.OK) {
          setSToken(data.accessToken);
          resolve(data.accessToken);
        }
      });
    } else {
      getParentOrTeachToken(phone, code).then((res) => {
        const { data, status } = res;
        if (status === HttpCodeEnum.OK) {
          if (type === "parent") {
            setSToken(data.parentAccessToken);
            resolve(data.parentAccessToken);
          } else if (type === "teach") {
            setSToken(data.teacherAccessToken);
            resolve(data.teacherAccessToken);
          }
        }
      });
    }
  });
}

export async function verifyToken() {
  const res = await verifyTokenRequest();
  if (res.status === HttpCodeEnum.UNAUTHORIZED) {
    clearData();
    return res;
  }
}

export function getQueryString(name: string) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
  let r = window.location.search.substr(1).match(reg); // 获取url中"?"符后的字符串并正则匹配
  let context = "";
  if (r != null) {
    context = r[2];
  }
  r = null;
  return context == null || context == "" || context == "undefined" ? "" : context;
}

export function getWXCode(appid = "wxe87236d542cd0f94") {
  const { origin, pathname, href } = window.location;
  const redirect_uri = encodeURIComponent(`${origin}${pathname}#${href.split("#")[1]}`);
  window.location.replace(
    `https://open.weixin.qq.com/connect/oauth2/authorize?&appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`,
  );
}

export function weixinLogin(authData: any): Promise<{ status: number }> {
  // 登录埋点
  const { aplus_queue } = window as any;
  aplus_queue.push({
    action: "aplus.record",
    arguments: ["weixinLogin", "CLK", authData],
  });

  return new Promise((resolve) => {
    weixinLoginRequest(authData).then((res) => {
      const { status, data, headers } = res;
      if (status === 200) {
        setLToken(headers.token);
        setUserInfo(data);
        resolve(res);
      } else {
        showToast("微信登录失败");
      }
    });
  });
}

/**
 * 获取token
 */
export async function getToken() {
  return new Promise((resolve) => {
    if (process.env.NODE_ENV === "development") {
      resolve(getTestToken());
    } else {
      if (isWeixinBrowser()) {
        const lToken = getLToken();
        if (lToken) {
          verifyToken().then((res) => {
            if (res?.status === HttpCodeEnum.OK) {
              resolve(true);
            } else {
              getWXCode();
            }
          });
        } else {
          const code = getQueryString("code");
          if (code) {
            weixinLogin({ code }).then((res) => {
              if (res?.status === 200) resolve(true);

              const { origin, pathname, hash } = window.location;
              location.replace(`${origin}${pathname}${hash}`);
            });
          } else {
            getWXCode();
          }
        }
      } else {
        callAppFc("getToken");
        (window as any).returnToken = (token: string) => {
          if (token) {
            setSToken(token);
            resolve(token);
          }
        };
      }
    }
  });
}

/**
 * 注册wx
 */
export async function registerWxOpenLaunchApp(
  callback?: () => void,
  request = getCWXSignature,
  jsApiList = ["updateAppMessageShareData", "getLocation", "closeWindow"],
  openTagList = ["wx-open-launch-app"],
) {
  if (process.env.NODE_ENV === "development") return Promise.resolve(true);

  return new Promise((resolve) => {
    request().then((res) => {
      const { data, status } = res;
      if (status === HttpCodeEnum.OK) {
        const { debug, signature, appId, nonceStr, timestamp } = data;
        wx.config({
          debug,
          appId,
          timestamp,
          nonceStr,
          signature,
          // 必填，需要使用的JS接口列表
          jsApiList,
          // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
          openTagList,
        });
        wx.error(() => {
          console.log("error");
          resolve(true);
        });

        wx.ready(() => {
          console.log("ready");
          resolve(true);
          callback?.();
        });
      }
    });
  });
}

/**
 * 微信自定义“分享给朋友”及“分享到QQ”按钮的分享内容
 */
export function wxUpdateAppMessageShareData(
  title = "宝贝启蒙必修课，超值拼团限时购！",
  desc = "开团后邀请好友拼团，团满即得！",
  imgUrl = getImageUrl("group_list_bgi"),
) {
  wx.updateAppMessageShareData({
    title, // 分享标题
    desc, // 分享描述
    imgUrl, // 分享图标
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
    success: () => {
      console.log("设置成功");
    },
  });
}

export function shareToFriendForRewardDirectly(
  params: {
    teamLeader: 0 | 1;
    productImage: string;
    activityPrice: number;
    originalPrice: number;
    population: number;
    inviteCode: string;
    type: string;
  },
  callback?: () => void,
) {
  callAppFc("shareToFriendForRewardDirectly", params, callback);
}

/**
 * 分割以逗号分割的封面图
 * @param imgsStr
 * @param mode 模式 img返回单张 arr返回数组
 */
export function filterImgCover(imgsStr: string, mode = "img") {
  try {
    if (mode === "img") {
      return imgsStr.split(",")[0];
    } else {
      return imgsStr.split(",");
    }
  } catch (err) {
    console.log(err, "filterImgCover");
    return imgsStr;
  }
}

/**
 * @description 页面到底操作
 * @param callback{Function} 回调函数
 * @author 朱波
 * @date 2023/2/22
 */
export function pageFinallyFc(callback: Function) {
  window.onscroll = () => {
    // 滚动条滚动时，距离顶部的距离
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 可视区的高度
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    // 滚动条的总高度
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    // 滚动条到底部的条件
    if (scrollTop + windowHeight === scrollHeight && callback) {
      callback();
    }
  };
}

export function byWechatPay(ticket: any) {
  callAppFc("byAliPay", {
    callback: "returnPayResult",
    ticket,
  });
}
export function byAliPayFc(ticket: any) {
  callAppFc("byAliPay", {
    callback: "returnPayResult",
    ticket,
  });
}

export function wxPayFc(record: any) {
  return new Promise((resolve) => {
    // 调用微信JSAPI
    function onBridgeReady(record: any) {
      console.log("调用微信支付WeixinJSBridge：", record);
      return new Promise((resolve) => {
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: record.appId, // 公众号名称，由商户传入
            timeStamp: record.timeStamp, // 时间戳
            nonceStr: record.nonceStr, // 随机串
            package: record.package, // 预支付id
            signType: record.signType, // 微信签名方式
            paySign: record.paySign, // 微信签名
          },
          (res: { err_msg: string }) => {
            console.log("支付结果:", res.err_msg);
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              resolve(true);
            } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
              showToast("已取消");
              resolve(false);
            } else if (res.err_msg === "get_brand_wcpay_request:fail") {
              showToast("支付失败");
              resolve(false);
            } else {
              showToast("支付错误");
              resolve(false);
            }
          },
        );
      });
    }

    if (typeof WeixinJSBridge === "undefined") {
      // 微信浏览器内置对象。参考微信官方文档
      if (document.addEventListener) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          async () => {
            await onBridgeReady(record);
          },
          false,
        );
      }
    } else {
      resolve(onBridgeReady(record));
    }
  });
}
