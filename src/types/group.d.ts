interface ISku {
  id: string;
  activityId: string;
  spuId: string;
  skuId: string;
  originalPrice: number;
  activityPrice: number;
  inventory: number;
  createTime: string;
  updateTime: string;
}

export interface IGroupActivity {
  id: string;
  productSpuId: string;
  activityName: string;
  productName: string;
  productImage: string;
  productType: number;
  population: number;
  groupMinPrice: number;
  groupMaxPrice: number;
  startTime: string;
  endTime: string;
  dataState: number;
  totalFinishGroup: null | number;
  totalGroup: null | number;
  skuList: ISku[];
  courseAlreadyBuy: boolean;
  courseMediaType: number;
}

export interface IGroupTeam {
  id: string;
  activityId: string;
  state: number;
  createTime: string;
  endTime: string;
  finishTime: null | string;
  spuId: string;
  skuId: string;
  orderId: string;
  unionId: string;
  userId: string;
  teamLeader: string;
  userName: string;
  userAvatar: string;
  population: number;
  autoFinish: number;
  realPopulation: number;
  isMe: boolean;
}

interface IGroupBuyActivity {
  groupActivityId: string;
  startTime: string;
  endTime: string;
  population: number;
  activityPrice: number;
  group: IGroupTeam[];
}

export interface IGroupCourse {
  spuId: string;
  skuId: string;
  name: string;
  simpleDescription: string;
  activityTag: null | string;
  price: number;
  markingPrice: number;
  imgCover: string;
  imgCoverMini: string;
  suitAge: string;
  mediaType: number;
  description: string;
  salesNumber: string;
  haveGroupActivity: boolean;
  groupBuyActivity: IGroupBuyActivity;
  haveBuy: boolean;
  currentGroupId: null | string;
  alreadyBuy: 0 | 1;
  isCollection: boolean;
}

export function defaultGroupCourse(): IGroupCourse {
  return {
    spuId: "",
    skuId: "",
    name: "",
    simpleDescription: "",
    activityTag: null,
    price: 0,
    markingPrice: 0,
    imgCover: "",
    imgCoverMini: "",
    suitAge: "",
    mediaType: 0,
    description: "",
    salesNumber: "",
    haveGroupActivity: false,
    groupBuyActivity: {
      groupActivityId: "",
      startTime: "",
      endTime: "",
      population: 0,
      activityPrice: 0,
      group: [],
    },
    haveBuy: false,
    currentGroupId: null,
    alreadyBuy: 0,
    isCollection: false,
  };
}

interface IGroupDetailProduct {
  activityName: string;
  productName: string;
  productImage: string;
  productType: number;
  startTime: string;
  endTime: string;
  validityHours: number;
  population: number;
  posterImage: null | string;
  activityId: string;
  spuId: string;
  skuId: string;
  originalPrice: number;
  activityPrice: number;
  inventory: number;
}

interface IGroupDetailJoinUser {
  id: string;
  activityId: string;
  createId: string;
  spuId: string;
  skuId: string;
  orderId: string;
  productType: number;
  unionId: string;
  userId: string;
  teamLeader: number;
  robot: number;
  userName: string;
  userAvatar: string;
  buyCount: number;
  payMoney: number;
  createTime: string;
}

export interface IGroupDetail {
  product: IGroupDetailProduct;
  joinUsers: IGroupDetailJoinUser[];
  needUser: number;
  state: number;
  expiredTime: string;
  joinGroup: boolean;
  orderId: string;
  payMoney: number;
  myGroup: boolean;
  createGroupId: string;
}

export function defaultGroupDetail(): IGroupDetail {
  return {
    product: {
      activityName: "",
      productName: "",
      productImage: "",
      productType: 0,
      startTime: "",
      endTime: "",
      validityHours: 0,
      population: 0,
      posterImage: null,
      activityId: "",
      spuId: "",
      skuId: "",
      originalPrice: 0,
      activityPrice: 0,
      inventory: 0,
    },
    joinUsers: [],
    needUser: 0,
    state: 0,
    expiredTime: "",
    joinGroup: false,
    orderId: "",
    payMoney: 0,
    myGroup: false,
    createGroupId: "",
  };
}

export interface IGroupOrder {
  activityName: string;
  productName: string;
  productImage: string;
  productType: number;
  startTime: string;
  endTime: string;
  validityHours: number;
  population: number;
  posterImage: null | string;
  activityId: string;
  spuId: string;
  skuId: string;
  originalPrice: number;
  activityPrice: number;
  inventory: number;
}

export function defaultGroupOrder(): IGroupOrder {
  return {
    activityName: "",
    productName: "",
    productImage: "",
    productType: 0,
    startTime: "",
    endTime: "",
    validityHours: 0,
    population: 0,
    posterImage: null,
    activityId: "",
    spuId: "",
    skuId: "",
    originalPrice: 0,
    activityPrice: 0,
    inventory: 0,
  };
}

export interface ICoupon {
  suitGoodsType: string;
  description: string;
  isSupportActivity: null;
  state: null;
  expireStr: null;
  JumpPath: null;
  text: string;
  discountPrice: number;
  discountedPrice: number;
  price: number;
  miniPrice: null;
  maxPrice: null;
  discountType: string;
  id: string;
  startDate: null;
  expireDate: null;
  createTime: string;
  orderId: null;
  useType: number;
  useRule: null;
  couponTypeId: string;
  useState: null;
}

export function defaultCoupon(): ICoupon {
  return {
    suitGoodsType: "",
    description: "",
    isSupportActivity: null,
    state: null,
    expireStr: null,
    JumpPath: null,
    text: "",
    discountPrice: 0,
    discountedPrice: 0,
    price: 0,
    miniPrice: null,
    maxPrice: null,
    discountType: "",
    id: "",
    startDate: null,
    expireDate: null,
    createTime: "",
    orderId: null,
    useType: 0,
    useRule: null,
    couponTypeId: "",
    useState: null,
  };
}

export interface IGroupOrderCoupon {
  usable: ICoupon[];
  unUsable: ICoupon[];
}

export function defaultGroupOrderCoupon(): IGroupOrderCoupon {
  return {
    usable: [],
    unUsable: [],
  };
}

export interface IGroupCommodity {
  goods: {
    id: string;
    shortId: number;
    title: string;
    subtitle: string;
    price: number;
    priceRange: string;
    imageUrl: string;
    salesVolume: number;
    description: string;
    barCode: string;
    markingPrice: number;
    activeDelete: number;
    categoryId: string;
    banner: string;
    state: number;
    version: number;
    rebate: number;
    imgList: {
      id: string;
      imgUrl: string;
      width: number;
      height: number;
      spuId: string;
      createTime: string;
    }[];
    categoryName: null;
    bannerEx: string[];
    skuInfo: null;
  };
  skuInfo: {
    id: string;
    shortId: number;
    productId: string;
    sku: string;
    level: null;
    price: number;
    count: number;
    produceCode: string;
    goods: null;
    activityPrice: number;
    inventory: number;
  }[];
  imageInfoList: string[];
  haveGroupActivity: boolean;
  groupBuyActivity: {
    groupActivityId: string;
    startTime: string;
    endTime: string;
    population: number;
    activityPrice: number;
    group: null | any[];
  };
  haveBuy: boolean;
  currentGroupId: null;
  isCollection: boolean;
  saleCount: number;
}

export function defaultGroupCommodity(): IGroupCommodity {
  return {
    goods: {
      id: "",
      shortId: 0,
      title: "",
      subtitle: "",
      price: 0,
      priceRange: "",
      imageUrl: "",
      salesVolume: 0,
      description: "",
      barCode: "",
      markingPrice: 0,
      activeDelete: 0,
      categoryId: "",
      banner: "",
      state: 0,
      version: 0,
      rebate: 0,
      imgList: [],
      categoryName: null,
      bannerEx: [],
      skuInfo: null,
    },
    skuInfo: [],
    imageInfoList: [],
    haveGroupActivity: false,
    groupBuyActivity: {
      groupActivityId: "",
      startTime: "",
      endTime: "",
      population: 0,
      activityPrice: 0,
      group: null,
    },
    haveBuy: false,
    currentGroupId: null,
    isCollection: false,
    saleCount: 0,
  };
}

export interface ICommodityCommit {
  id: string;
  skuId: string;
  commit: string;
  imgs: string;
  userId: string;
  orderId: string;
  score: number;
  createTime: string;
  state: number;
  user: {
    id: null;
    openId: null;
    sessionKey: null;
    proxyUserId: null;
    nickName: string;
    gender: number;
    province: null;
    city: null;
    country: null;
    avatarUrl: string;
    unionId: null;
    phone: null;
    birthday: null;
    hobby: null;
    createTime: null;
    updateTime: null;
    appId: null;
    defaultLoginSchoolId: null;
    defaultLoginClassId: null;
  };
  imgList: string[];
  imgListThumbnail: string[];
  sku: {
    id: string;
    shortId: number;
    productId: string;
    sku: string;
    level: null;
    price: number;
    count: number;
    produceCode: string;
    goods: null;
  };
}
export function defaultCommodityCommit(): ICommodityCommit {
  return {
    id: "",
    skuId: "",
    commit: "",
    imgs: "",
    userId: "",
    orderId: "",
    score: 0,
    createTime: "",
    state: 0,
    user: {
      id: null,
      openId: null,
      sessionKey: null,
      proxyUserId: null,
      nickName: "",
      gender: 0,
      province: null,
      city: null,
      country: null,
      avatarUrl: "",
      unionId: null,
      phone: null,
      birthday: null,
      hobby: null,
      createTime: null,
      updateTime: null,
      appId: null,
      defaultLoginSchoolId: null,
      defaultLoginClassId: null,
    },
    imgList: [],
    imgListThumbnail: [],
    sku: {
      id: "",
      shortId: 0,
      productId: "",
      sku: "",
      level: null,
      price: 0,
      count: 0,
      produceCode: "",
      goods: null,
    },
  };
}
