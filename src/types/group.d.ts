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
