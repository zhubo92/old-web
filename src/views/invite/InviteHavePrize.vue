<script setup lang="ts">
import {
  getInviteHavePrizeActivityRequest,
  getInviteHavePrizePosterInfoRequest,
} from "@/api/invite";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { HttpCodeEnum } from "@/types/http-codes";
import type { IInviteActivity, IPosterInfo } from "@/types/invite";
import { defaultInviteActivity, defaultPosterInfo } from "@/types/invite";
import { navAppPage, registerWxOpenLaunchApp, shareToFriendForReward } from "@/utils";
import { getCWXSignature } from "@/api/user";
import wx from "weixin-js-sdk";
import InvitePoster from "@/views/invite/components/InvitePoster.vue";
import { useRouter } from "vue-router";
import { getUserInfo } from "@/utils/storage";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";

const staticImg = {
  img1: "https://app-resources-luojigou.luojigou.vip/FuCWZPPCRMC_sO4sHkRgJn9pocuY",
  img2: "https://app-resources-luojigou.luojigou.vip/FtbxZXxVFo7ZH4uPSNQPkc9kjVCG",
  img3: "https://app-resources-luojigou.luojigou.vip/FtLDno5rOlBondVKwdgfBF0dIcOb",
  img4: "https://app-resources-luojigou.luojigou.vip/FjCNikts7LY_bi-dK26y-8kwumTR",
  inviteRecordBGI: "https://img.luojigou.vip/FkQEKdw-i56GysroqCeYh-H0EBAs",
  notObtained: "https://img.luojigou.vip/Fm4_YY6rDCooeCm1tO8GrOluzb2q",
  completed: "https://img.luojigou.vip/Fh-isO_XMcVUmgCkpV9M5PQloHex",
  addAddress: "https://img.luojigou.vip/FjQK5fs4GgZjxjpWWkOS-6l9wR2n",
  lookRecord: "https://img.luojigou.vip/Fgz9zlMDxuyvoASOLyIgRcjMDDdD",
  inviteBtn: "https://img.luojigou.vip/Fv3Lr0FFtmH0XS_phc4NGFPAxfpM",
  invitedBtn: "https://img.luojigou.vip/Fgn1ZdakmCGhIPqKkuEEqda6349p",
};
const id = "1706855694341734401";

const router = useRouter();
const { loading } = storeToRefs(useAppStore());
const barContainerRef = ref<HTMLElement | null>(null);
const show = ref<boolean>(false);
const barContainerWidth = ref<number>(268);
const timer = ref<null | NodeJS.Timeout>(null);
const days = ref<number>(0);
const hours = ref<number>(0);
const minutes = ref<number>(0);
const seconds = ref<number>(0);
const info = reactive<IInviteActivity>(defaultInviteActivity());
const poster = reactive<IPosterInfo>(defaultPosterInfo());

const total = computed(() => {
  let s = 0;
  if (
    info &&
    info.shareEncourageAwardDOS &&
    Array.isArray(info.shareEncourageAwardDOS) &&
    info.shareEncourageAwardDOS.length !== 0
  ) {
    s = info.shareEncourageAwardDOS[info.shareEncourageAwardDOS.length - 1].helpNumber;
  }
  return s;
});

const percentageWidth = computed(() => {
  let proportion = info.inviteUsers / total.value;
  if (proportion > 1) proportion = 1;
  return proportion * barContainerWidth.value;
});

const activityState = computed(() => {
  if (!info || !info.shareEncourageDO || !info.shareEncourageDO.createTime) return "-1";

  const { createTime, endTime, isEnd, state } = info.shareEncourageDO;
  const ctime = new Date(createTime).valueOf();
  const etime = new Date(endTime).valueOf();
  const now = new Date().getTime();
  if (ctime < now && now < etime && isEnd === 0 && state === 1) {
    // 正在进行中
    return "1";
  } else if (ctime > now && isEnd === 0) {
    // 未开始
    return "0";
  } else {
    // 已结束
    return "-1";
  }
});

const hasEndTime = computed(() => {
  return info && info.shareEncourageDO && info.shareEncourageDO.endTime;
});

const qrcodeUrl = computed(() => {
  const { origin, pathname } = window.location;
  try {
    const userInfo = getUserInfo();
    return `${origin}${pathname}#/enlighten?id=${id}&unionId=${userInfo?.unionid}`;
  } catch (err) {
    console.log("获取不到userInfo");
    return `${origin}${pathname}#/enlighten?id=${id}`;
  }
});

async function getActivityInfo() {
  const { status, data } = await getInviteHavePrizeActivityRequest(id);
  if (status === HttpCodeEnum.OK) {
    Object.assign(info, data);
  }
}

async function getPosterInfo() {
  const { status, data } = await getInviteHavePrizePosterInfoRequest(id);
  if (status === 200) {
    Object.assign(poster, data);
  }
}

function addAddress() {
  navAppPage(
    "address/express/index",
    () => {
      router.push("/me/ShippingAddress");
    },
    "addAddress",
  );
}

function handleInvite() {
  if (
    !info ||
    !info.shareEncourageDO ||
    info.shareEncourageDO.state !== 1 ||
    activityState.value !== "1"
  ) {
    return;
  }

  shareToFriendForReward({
    title: poster.guideTip,
    imgUrl: poster.posterUrl,
    inviteCode: qrcodeUrl.value,
  });
}

function filterTime(val: string) {
  const time = new Date(val).valueOf();
  const now = new Date().valueOf();

  if (time > now) {
    timer.value = setInterval(() => {
      const n = new Date().valueOf();
      const t = time - n;
      days.value = parseInt(String(t / (1000 * 60 * 60 * 24)));
      hours.value = parseInt(String((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      minutes.value = parseInt(String((t % (1000 * 60 * 60)) / (1000 * 60)));
      seconds.value = parseInt(String((t % (1000 * 60)) / 1000));
    }, 1000);
  }
}
function lookDetail() {
  navAppPage("home/userInviteHistoryPage", () => {
    router.push("/invite/InviteRecord");
  });
}

async function updateAppMessageShareData() {
  const { guideTip, posterUrl } = poster;
  wx.updateAppMessageShareData({
    title: guideTip, // 分享标题
    desc: "🎁立即邀请得好礼 >>", // 分享描述
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
    imgUrl: posterUrl, // 分享图标
    success: () => {
      // 设置成功
      console.log("设置成功");
    },
  });
}

function getWidth() {
  nextTick();

  if (barContainerRef.value) barContainerWidth.value = barContainerRef.value.offsetWidth;
}

onMounted(async () => {
  loading.value = true;
  await getActivityInfo();
  await getPosterInfo();

  if (hasEndTime.value) filterTime(info.shareEncourageDO.endTime);

  await registerWxOpenLaunchApp(() => {
    updateAppMessageShareData();
  }, getCWXSignature);

  getWidth();

  loading.value = false;
});
</script>

<template>
  <div class="invite-have-prize">
    <img :src="staticImg.img1" alt="" class="img" />
    <!--第二部分邀请记录-->
    <div
      class="invite-record"
      v-if="info && info.shareEncourageAwardDOS"
      :style="{ backgroundImage: `url(${staticImg.inviteRecordBGI})` }"
    >
      <div class="invite-record-container">
        <!--进度条-->
        <div class="progress-bar">
          <div class="progress-bar-gifts">
            <div
              v-for="gift in info.shareEncourageAwardDOS"
              :key="gift.id"
              class="progress-bar-gift"
            >
              <!--未获得-->
              <img v-if="info.inviteUsers < gift.helpNumber" :src="staticImg.notObtained" alt="" />
              <!--已获得-->
              <img v-else :src="staticImg.completed" alt="" />

              <span>{{ gift.helpNumber }}人</span>
            </div>
          </div>

          <div class="progress-bar-container" ref="barContainerRef">
            <div class="progress-bar-completed" :style="{ width: `${percentageWidth}px` }"></div>
          </div>
        </div>

        <div class="invite-record-container-num">{{ info.inviteUsers }}/{{ total }}</div>
      </div>

      <div class="btns">
        <div class="btn add-address" @click="addAddress">
          <img :src="staticImg.addAddress" alt="" />
          <span>添加收货地址</span>
        </div>
        <div class="btn look-record" @click="lookDetail">
          <img :src="staticImg.lookRecord" alt="" />
          <span>查看邀请记录</span>
        </div>
      </div>
    </div>

    <img :src="staticImg.img2" alt="" class="img" />

    <img :src="staticImg.img3" alt="" class="img" />

    <img :src="staticImg.img4" alt="" class="img" />

    <!--底部邀请按钮-->
    <div class="invite-btn">
      <div class="invite-btn-text" v-if="activityState === '1'">
        <div>距活动结束还有</div>
        <div class="invite-btn-text-time">
          <span>{{ days }}天</span>
          <span>{{ hours }}小时</span>
          <span>{{ minutes }}分钟</span>
          <span>{{ seconds }}秒</span>
        </div>
      </div>
      <div class="invite-btn-text" v-else-if="activityState === '0'">
        <div>活动还未开始</div>
      </div>
      <div class="invite-btn-text" v-else>
        <div>活动已结束</div>
      </div>

      <div
        :class="['invite-btn-img', activityState === '1' && 'inviteBtn']"
        :style="{
          backgroundImage: `url(${
            activityState === '1' ? staticImg.inviteBtn : staticImg.invitedBtn
          })`,
        }"
        @click="handleInvite"
      >
        立即邀请得好礼
      </div>
    </div>

    <InvitePoster :info="poster" :id="id" :show="show" @close="show = false" />
  </div>
</template>

<style scoped lang="scss">
.invite-have-prize {
  padding-bottom: 90px;
  background-color: #8283fd;

  img {
    display: block;
    object-fit: cover;
  }

  .img {
    display: block;
    width: 100vw;
  }

  .header {
    position: relative;
    width: 100vw;
    height: 88px;
    background: #ffffff;

    .header-icon {
      position: absolute;
      bottom: 13px;
      left: 20px;
    }

    .header-title {
      position: absolute;
      bottom: 11px;
      left: 50%;
      transform: translateX(-50%);
      height: 25px;
      font-size: 18px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC,
        serif;
      font-weight: 600;
      color: #333333;
      line-height: 25px;
      text-align: center;
    }
  }

  .combo-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 28px;
    padding-top: 317px;
    position: relative;
    width: 100vw;
    height: 780px;
    background-repeat: no-repeat;
    background-size: cover;

    .combo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // padding: 0 20px;
      width: 343px;
      height: 135px;
      background: #fef5e4;
      border-radius: 20px;
      box-sizing: border-box;

      img {
        object-fit: cover;
        width: 343px;
        height: 135px;
        display: block;
      }

      .combo-item-info {
        .combo-item-info-title {
          padding: 3px 10px;
          width: fit-content;
          height: 24px;
          font-size: 17px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC,
            serif;
          font-weight: 600;
          color: #ff6600;
          line-height: 24px;
          background: #ffdf7e;
          border-radius: 4px;
          text-align: center;
          box-sizing: content-box;
        }

        .combo-item-info-gift1 {
          margin-top: 11px;
          margin-bottom: 6px;
          height: 21px;
          font-size: 14px;
          font-family:
            PingFangSC-Medium,
            PingFang SC,
            serif;
          font-weight: 550;
          color: #ff4a1d;
          line-height: 21px;
        }

        .combo-item-info-gift2 {
          height: 21px;
          font-size: 14px;
          font-family:
            PingFangSC-Medium,
            PingFang SC,
            serif;
          font-weight: 550;
          color: #ff4390;
          line-height: 21px;

          span {
            font-weight: 400;
            color: #533f40;
          }
        }

        .combo-item-info-rule {
          margin-top: 6px;
          margin-bottom: 4px;
          height: 33px;
          font-size: 16px;
          font-family:
            PingFangSC-Regular,
            PingFang SC,
            serif;
          font-weight: 400;
          color: #533f40;
          line-height: 37px;

          span {
            font-size: 24px;
            color: #fd7600;
            font-weight: 600;
          }
        }

        .combo-item-info-illustrate {
          height: 22px;
          font-size: 16px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC,
            serif;
          font-weight: 600;
          color: #f33f40;
          line-height: 22px;

          span {
            color: #fd6000;
          }
        }
      }

      .combo-item-imgUrl {
        position: relative;
        width: 100px;
        height: 95px;
        border-radius: 10px;

        img {
          display: block;
          width: 100px;
          height: 95px;
          background: #ffffff;
          border-radius: 10px;
          object-fit: cover;
        }

        div {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100px;
          height: 21px;
          background: #ff718d;
          border-radius: 0px 0px 10px 10px;
          font-size: 11px;
          font-family:
            PingFangSC-Medium,
            PingFang SC,
            serif;
          font-weight: 550;
          color: #ffffff;
          line-height: 21px;
          text-align: center;
        }
      }
    }

    .combo-item + .combo-item {
      margin-top: 16px;
    }

    .combo-list-remark {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 17px;
      font-size: 12px;
      font-family:
        PingFangSC-Regular,
        PingFang SC,
        serif;
      font-weight: 400;
      color: #ffffff;
      line-height: 17px;
      text-align: center;
    }
  }

  .invite-record {
    position: relative;
    margin: 0 auto 28px;
    padding-top: 102px;
    width: 365px;
    height: 265px;
    background-repeat: no-repeat;
    background-size: cover;
    box-sizing: border-box;

    .invite-record-container {
      display: flex;
      justify-content: center;
      align-items: center;

      .progress-bar {
        position: relative;
        margin-right: 14px;
        width: 270px;
        height: 70px;

        .progress-bar-gifts {
          display: flex;
          justify-content: space-around;
          align-items: center;
          position: relative;
          z-index: 3;

          .progress-bar-gift {
            display: flex;
            flex-direction: column;
            align-items: center;

            img {
              width: 50px;
              height: 50px;
            }

            span {
              height: 18px;
              font-size: 13px;
              font-family:
                PingFangSC-Semibold,
                PingFang SC,
                serif;
              font-weight: 600;
              color: #684046;
              line-height: 18px;
            }
          }
        }

        .progress-bar-container {
          position: absolute;
          z-index: 0;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 268px;
          height: 6px;
          background-color: #ffdadb;
          border-radius: 3px;

          .progress-bar-completed {
            width: 0;
            height: 6px;
            background: linear-gradient(270deg, #ff662c 0%, #ffd56b 100%);
            border-radius: 3px;
          }
        }
      }

      .invite-record-container-num {
        height: 17px;
        font-size: 12px;
        font-family:
          PingFangSC-Regular,
          PingFang SC,
          serif;
        font-weight: 400;
        color: #7f585e;
        line-height: 17px;
      }
    }

    .btns {
      position: absolute;
      bottom: 18px;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 31px;
      width: 100%;
      box-sizing: border-box;

      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 136px;
        height: 34px;
        background: #feff7d;
        border-radius: 17px;

        img {
          margin-bottom: 2px;
          display: block;
          margin-right: 5px;
          width: 10px;
          height: 11px;
          object-fit: contain;
        }

        span {
          display: block;
          height: 17px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC,
            serif;
          font-weight: 400;
          color: #f17a8f;
          line-height: 17px;
        }
      }

      .add-address {
        margin-right: 31px;
      }
    }
  }

  .invite-process {
    position: relative;
    margin: 0 auto 31px;
    padding-top: 62px;
    padding-left: 41px;
    width: 365px;
    height: 386px;
    background-repeat: no-repeat;
    background-size: cover;
    box-sizing: border-box;

    .invite-process-step {
      display: flex;
      align-items: center;

      .invite-process-step-imgs {
        margin-right: 23px;

        .imgUrl {
          display: block;
          width: 52px;
          height: 52px;
        }
      }

      .invite-process-step-content {
        .invite-process-step-content-title {
          margin-bottom: 4px;
          height: 22px;
          font-size: 16px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC,
            serif;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
        }

        .invite-process-step-content-remark {
          width: 208px;
          font-size: 13px;
          font-family:
            PingFangSC-Regular,
            PingFang SC,
            serif;
          font-weight: 400;
          color: #333333;
          line-height: 20px;

          span {
            color: #ff662c;
          }
        }
      }
    }

    .arrow {
      margin-top: 13px;
      margin-left: 18px;
      margin-bottom: 14px;
      width: 16px;
      height: 30px;
    }
  }

  .award-detail {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto 31px;
    padding-top: 70px;
    width: 365px;
    height: 1142px;
    background-repeat: no-repeat;
    background-size: cover;
    box-sizing: border-box;

    .award-detail-item {
      position: relative;

      .titleImg {
        margin: 0 auto 6px;
        width: 333px;
        height: 39px;
      }

      .awardImg {
        margin: 0 auto;
        width: 281px;
        height: 280px;
        background: #ffffff;
        border-radius: 10px;
      }

      .award-detail-item-total {
        position: absolute;
        left: 35px;
        bottom: 10px;
        padding: 2px 12px;
        width: fit-content;
        height: 18px;
        font-size: 13px;
        font-family:
          PingFangSC-Regular,
          PingFang SC,
          serif;
        font-weight: 400;
        color: #ffffff;
        line-height: 18px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 11px;
        text-align: center;
        box-sizing: content-box;
      }
    }

    .award-detail-item + .award-detail-item {
      margin-top: 28px;
    }
  }

  .question {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    padding-top: 66px;
    padding-bottom: 30px;
    width: 365px;
    height: 754px;
    background-repeat: no-repeat;
    background-size: cover;
    box-sizing: border-box;

    .question-item {
      .question-item-title {
        margin-bottom: 5px;
        width: 330px;
        height: 22px;
        font-size: 15px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC,
          serif;
        font-weight: 600;
        color: #333333;
        line-height: 24px;
      }

      .question-item-content {
        margin-left: 35px;
        width: 270px;
        font-size: 13px;
        font-family:
          PingFangSC-Regular,
          PingFang SC,
          serif;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        box-sizing: content-box;

        span {
          color: #ff0303;
        }
      }
    }
  }

  .question-img {
    margin: 0 auto;
    display: block;
    width: 365px;
    object-fit: contain;
  }

  .rule {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto 135px;
    padding-top: 72px;
    width: 365px;
    height: 474px;
    background-repeat: no-repeat;
    background-size: cover;
    box-sizing: border-box;

    .rule-item {
      .rule-item-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        height: 24px;
        font-size: 17px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC,
          serif;
        font-weight: 600;
        color: #333333;
        line-height: 24px;
      }

      .rule-item-title::before {
        content: "";
        display: inline-block;
        margin-right: 6px;
        width: 6px;
        height: 17px;
        background: linear-gradient(180deg, #ffe570 0%, #ffcb67 100%);
        border-radius: 3px;
      }

      .rule-item-content {
        width: 303px;
        font-size: 13px;
        font-family:
          PingFangSC-Regular,
          PingFang SC,
          serif;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
      }
    }

    .rule-item + .rule-item {
      margin-top: 20px;
    }
  }

  .luojigouLogo {
    margin: 7px auto 15px;
    display: block;
    width: 112px;
    height: 44px;
    object-fit: cover;
  }

  .invite-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 4;
    width: 100vw;
    height: 90px;
    background: #ffffff;
    box-shadow: 0px -3px 28px 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .invite-btn-text {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 6px 0 2px;
      font-size: 12px;
      font-family:
        PingFangSC-Regular,
        PingFang SC,
        serif;
      font-weight: 400;
      color: #666666;

      .invite-btn-text-time {
        margin-left: 16px;
        height: 22px;
        font-size: 16px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC,
          serif;
        font-weight: 600;
        color: #ff7f4c;
        line-height: 22px;

        span + span {
          margin-left: 8px;
        }
      }
    }

    .invite-btn-img {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      width: 270.9px;
      height: 39.6px;
      line-height: 44px;
      font-size: 18px;
      font-family:
        PingFangSC-Medium,
        PingFang SC,
        serif;
      font-weight: 500;
      color: #ffffff;
      background-repeat: no-repeat;
      background-size: 100%;
      text-align: center;
    }

    .inviteBtn {
      animation: inviteBtnAni 0.6s infinite 2s;
    }

    @keyframes inviteBtnAni {
      0% {
        transform: translateX(-50%) scale(1);
      }
      50% {
        transform: translateX(-50%) scale(1.1);
      }
      100% {
        transform: translateX(-50%) scale(1);
      }
    }
  }
}
</style>
