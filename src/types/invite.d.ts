export interface IInviteActivity {
  inviteUsers: number;
  unionId: string;
  userId: string;
  goodsInfoUrl: null;
  shareEncouragePosterDO: IShareEncouragePosterDO;
  shareEncourageAwardDOS: IShareEncourageAwardDOS[];
  shareEncourageDO: IShareEncourageDO;
  goodsId: string;
  skuId: string;
}
interface IShareEncourageDO {
  id: string;
  name: string;
  jumpUrl: string;
  info: string;
  endTime: string;
  createTime: string;
  updateTime: string;
  state: number;
  isDelete: 0 | 1;
  isEnd: 1 | 0;
}
interface IShareEncourageAwardDOS {
  id: string;
  shareEncourageId: string;
  createTime: string;
  updateTime: string;
  ladderLevel: number;
  levelName: null | string;
  helpNumber: number;
  awardAmount: number;
  remainingAmount: number;
  isShow: boolean;
  isDelete: 0 | 1;
}
interface IShareEncouragePosterDO {
  id: string;
  shareEncourageId: string;
  guideTip: string;
  createTime: string;
  updateTime: string;
  userHead: string;
  nickName: string;
  qrCode: number;
  posterUrl: string;
  isDelete: 0 | 1;
}

export function defaultInviteActivity(): IInviteActivity {
  return {
    inviteUsers: 0,
    unionId: "",
    userId: "",
    goodsInfoUrl: null,
    shareEncouragePosterDO: {
      id: "",
      shareEncourageId: "",
      guideTip: "",
      createTime: "",
      updateTime: "",
      userHead: '{"shape": "0", "state": false}',
      nickName: '{"color": "#191970", "state": false, "fontSize": "16"}',
      qrCode: 0,
      posterUrl: "",
      isDelete: 0,
    },
    shareEncourageAwardDOS: [
      {
        id: "",
        shareEncourageId: "",
        createTime: "",
        updateTime: "",
        ladderLevel: 1,
        levelName: null,
        helpNumber: 0,
        awardAmount: 0,
        remainingAmount: 0,
        isShow: true,
        isDelete: 0,
      },
    ],
    shareEncourageDO: {
      id: "",
      name: "",
      jumpUrl: "",
      info: "",
      endTime: "",
      createTime: "",
      updateTime: "",
      state: 1,
      isDelete: 0,
      isEnd: 1,
    },
    goodsId: "",
    skuId: "",
  };
}

export interface IPosterInfo {
  id: string;
  shareEncourageId: string;
  guideTip: string;
  createTime: string;
  updateTime: string;
  userHead: string;
  nickName: string;
  qrCode: number;
  posterUrl: string;
  isDelete: 0 | 1;
}

export function defaultPosterInfo(): IPosterInfo {
  return {
    id: "",
    shareEncourageId: "",
    guideTip: "",
    createTime: "",
    updateTime: "",
    userHead: '{"shape": "0", "state": false}',
    nickName: '{"color": "#191970", "state": false, "fontSize": "16"}',
    qrCode: 0,
    posterUrl: "",
    isDelete: 0,
  };
}

export interface IInviteRecord {
  shareEncourageId: string;
  startTime: string;
  isEnd: 0 | 1;
  activityName: string;
  inviteInfoVOS: IInviteInfoVOS[];
}

export interface IInviteInfoVOS {
  newUserNickName: string;
  goodsId: number;
  createTime: string;
  goodsName: string;
}
