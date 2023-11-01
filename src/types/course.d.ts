export interface ILuojigouCourse {
  id: string;
  name: string;
  imgCover: string;
  imgCoverMini: null;
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
  hasPaid: number;
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
  userCount: number;
  categoryName: string;
  avatars: string[];
}

export interface IChapterItemVideo {
  id: null | string;
  videoUrl: null | string;
  parentId: null | string;
  createTime: null | string;
  updateTime: null | string;
  width: null | string;
  height: null | string;
  thumbnailUrl: null | string;
  duration: string;
}
export interface IChapterItem {
  id: string;
  name: string;
  videoId: null;
  aiCourseSkuId: string;
  sort: number;
  createTime: string;
  updateTime: string;
  readCount: number;
  aiCourseItemChapterId: string;
  type: number;
  payType: number;
  freeTime: number;
  audioId: null;
  imgCover: string;
  chapterName: null;
  chapterSort: null;
  richText: null;
  splitList: null;
  isLock: boolean;
  unLockTime: string;
  bankId: string;
  gameAddress: string;
  isFinish: boolean;
  semesterLeveCode: number;
  index?: number;
  sectionIndex?: number;
  video: IChapterItemVideo;
}
export interface IChapter {
  id: string;
  name: string;
  createTime: string;
  updateTime: null | string;
  aiCourseSkuId: string;
  sort: number;
  coverImgUrl: null | string;
  itemList: IChapterItem[];
}
export interface ICourseDetail {
  id: string;
  name: string;
  imgCover: string;
  imgCoverMini: null | string;
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
  paidCount: number;
  latestLearnedRecordId: null;
  latestLearnedRecord: null;
  abilityList: null;
  commentCount: number;
  shareCount: number;
  collectCount: number;
  isCollect: number;
  hasPaid: number;
  isComment: number;
  isShare: number;
  imgCoverWidth: null;
  imgCoverHeight: null;
  shareUrl: null;
  shareUrlQRCode: null;
  groupBuyActivity: null;
  groupBuyActivityId: null;
  groupBuyActivityUrl: null;
  totalLearnUser: null;
  chapterList: IChapter[];
  cashbackActivity?: 1 | 0;
  cashbackActivityId?: number;
  checkInExplain?: string;
  skuId?: string;
}

export function defaultCourseDetail() {
  return {
    id: "",
    name: "",
    imgCover: "",
    imgCoverMini: null,
    createTime: "",
    updateTime: "",
    price: 0,
    markingPrice: 0,
    categoryId: "",
    courseCount: 0,
    aiCourseSpuId: "",
    suitAge: "",
    wxNumber: null,
    wxQrCode: null,
    wxName: null,
    wxHeadImg: null,
    description: "",
    mediaType: 0,
    simpleDescription: "",
    sort: 0,
    showChapter: 0,
    courseType: 0,
    subCategoryId: "",
    activityTag: null,
    courseTags: null,
    paidCount: 0,
    latestLearnedRecordId: null,
    latestLearnedRecord: null,
    abilityList: null,
    commentCount: 0,
    shareCount: 0,
    collectCount: 0,
    isCollect: 0,
    hasPaid: 0,
    isComment: 0,
    isShare: 0,
    imgCoverWidth: null,
    imgCoverHeight: null,
    shareUrl: null,
    shareUrlQRCode: null,
    groupBuyActivity: null,
    groupBuyActivityId: null,
    groupBuyActivityUrl: null,
    totalLearnUser: null,
    chapterList: [],
  };
}
