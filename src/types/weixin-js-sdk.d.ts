declare module "weixin-js-sdk" {
  export function config(options: WechatConfigOptions): void;
  export function ready(callback: () => void): void;
  export function error(callback: () => void): void;
  export function updateAppMessageShareData(options: UpdateAppMessageShareDataOptions): void;
}

interface UpdateAppMessageShareDataOptions {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
  success: () => void;
}

interface WechatConfigOptions {
  debug: boolean;
  appId: string;
  timestamp: string;
  nonceStr: string;
  signature: string;
  jsApiList: string[];
  openTagList: string[];
}
