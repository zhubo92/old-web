import type { IChapter } from "@/types/course";

export interface IPunchActivity {
  id: string;
  title: string;
  joinWay: number;
  goodsId: string;
  allowStartTime: string;
  allowEndTime: string;
  goalDays: number;
  validDays: number;
  unlockWay: number;
  progressBar: number;
  checkInExplain: string;
  poster: string;
  createTime: string;
  updateTime: string;
  state: number;
  courseName: string;
  suitAge: string;
  imgCover: string;
  imgCoverMini: string;
  mediaType: number;
  price: number;
  courseSkuId: string;
  chapterList: IChapter[];
  hasGroupBuyActivity: number;
  groupBuyActivityId: null;
  purchased: number;
  joinCashbackActivity: number;
}

export interface IPunchCourse {
  id: string;
  userId: string;
  unionId: string;
  purchaseType: number;
  payMoney: number;
  payMethod: number;
  orderId: string;
  cashbackState: number;
  cashbackType: null;
  cashbackTime: null;
  refuseReason: null;
  createTime: string;
  updateTime: string;
  activityId: string;
  isFinish: number;
  isDailyRemind: number;
  expirationTime: string;
  courseSpuId: string;
  courseSkuId: string;
  courseName: string;
  mediaType: number;
  imgCover: string;
  imgCoverMini: string;
  checkinState: number;
  goalDays: number;
  checkinDays: number;
  todayCheckinState: null;
  totalCourseItem: number;
  cashbackOperation: number;
  chapterList: IChapter[];
  learnCompletion: number;
  validDays: number;
  unlockWay: number;
  progressBar: number;
  checkInExplain: string;
  poster: string;
  isCollect: 0 | 1;
}
export function defaultPunchCourse(): IPunchCourse {
  return {
    id: "",
    userId: "",
    unionId: "",
    purchaseType: 0,
    payMoney: 0,
    payMethod: 0,
    orderId: "",
    cashbackState: 0,
    cashbackType: null,
    cashbackTime: null,
    refuseReason: null,
    createTime: "",
    updateTime: "",
    activityId: "",
    isFinish: 0,
    isDailyRemind: 0,
    expirationTime: "",
    courseSpuId: "",
    courseSkuId: "",
    courseName: "",
    mediaType: 0,
    imgCover: "",
    imgCoverMini: "",
    checkinState: 0,
    goalDays: 0,
    checkinDays: 0,
    todayCheckinState: null,
    totalCourseItem: 0,
    cashbackOperation: 0,
    chapterList: [],
    learnCompletion: 0,
    validDays: 0,
    unlockWay: 0,
    progressBar: 0,
    checkInExplain: "",
    poster: "",
    isCollect: 0,
  };
}

export interface IPunchDetail {
  date: string;
  startTime: string;
  endTime: string;
  totalItemNum: number;
  goalDays: number;
  checkinDays: number;
  checkinList: any[];
}

export function defaultPunchDetail(): IPunchDetail {
  return {
    date: "",
    startTime: "",
    endTime: "",
    totalItemNum: 0,
    goalDays: 0,
    checkinDays: 0,
    checkinList: [],
  };
}

export interface IPunchRecord {
  id: string;
  chockInTime: string;
  itemName: string;
  itemImg: string;
}
