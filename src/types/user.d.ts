export interface IUserInfo {
  appId: null | string;
  city: string;
  country: string;
  errcode: null;
  errmsg: null;
  headimgurl: string;
  id: null;
  language: string;
  nickname: string;
  openid: string;
  privilege: [];
  province: string;
  sex: number;
  subscribe: number;
  unionid: string;
  bindWx?: boolean;
}

export function defaultUserInfo(): IUserInfo {
  return {
    appId: null,
    city: "",
    country: "",
    errcode: null,
    errmsg: null,
    headimgurl:
      "https://thirdwx.qlogo.cn/mmopen/vi_32/mE833f4fRB1phY70o9VtskybL5peoFgNoiaWH6cKynq5gGIGXgudbU4CabVE7iamGeuQwav6ghUG7xgOD0FxyMLA/132",
    id: null,
    language: "",
    nickname: "zhū bō",
    openid: "o8gfxs-8quGUYCSJIWNClkvF9oUE",
    privilege: [],
    province: "",
    sex: 0,
    subscribe: 0,
    unionid: "o75lRwbdLj2kLdcJbcwSudc-o0Ms",
  };
}

export interface ICourseOrder {
  id: string;
  openId: string;
  unionId: string;
  price: number;
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  createTime: string;
  state: number;
  addressId: null;
  payTime: string;
  userId: string;
  platform: string;
  updateTime: null;
  payApi: string;
  appId: string;
  payMethod: null;
  courseSkuId: string;
  courseSpuId: string;
  expireTime: string;
  payChannels: number;
  isShow: true;
  orderType: number;
  activityId: null;
  note: null;
  wxName: null;
  couponId: null;
  wxPayConfigId: null;
  spu: ISpu;
  mediaType: number;
  expireSeconds: number;
  textBook: null;
  sku: ISku;
}

interface ISpu {
  id: string;
  name: string;
  imgCover: string;
  imgCoverMini: string;
  videoUrl: string;
  createTime: string;
  updateTime: string;
  price: number;
  markingPrice: number;
  categoryId: string;
  suitAge: string;
  parentNotice: null;
  courseCount: number;
  description: null;
  outline: null;
  notice: null;
  simpleDescription: string;
  mediaType: number;
  status: number;
  isDelete: number;
  sort: number;
  showChapter: number;
  isShow: boolean;
  showCoverImg: number;
}

interface ISku {
  id: string;
  name: string;
  imgCover: string;
  imgCoverMini: string;
  createTime: string;
  updateTime: string;
  price: number;
  markingPrice: number;
  categoryId: string;
  courseCount: number;
  aiCourseSpuId: string;
  suitAge: string;
  wxNumber: null;
  wxQrCode: null;
  wxName: null;
  wxHeadImg: null;
  description: string;
  mediaType: number;
  simpleDescription: string;
  sort: number;
  showChapter: number;
  courseType: number;
  subCategoryId: string;
  activityTag: null;
  courseTags: null;
  paidCount: null;
  latestLearnedRecordId: null;
  latestLearnedRecord: null;
  abilityList: null;
  commentCount: null;
  shareCount: null;
  collectCount: null;
  isCollect: null;
  hasPaid: null;
  isComment: null;
  isShare: null;
  imgCoverWidth: null;
  imgCoverHeight: null;
  shareUrl: null;
  shareUrlQRCode: null;
  groupBuyActivity: null;
  groupBuyActivityId: null;
  groupBuyActivityUrl: null;
  totalLearnUser: null;
}
