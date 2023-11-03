<script setup lang="ts">
import { backTop, buried, callAppFc, getToken, isWeixinBrowser, navAppPage } from "@/utils";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";
import type { SwipeInstance } from "vant";
import { showToast } from "vant";
import {
  getAICourseItemBank2Request,
  getAICourseItemRequest,
  handleCollectCourseRequest,
} from "@/api/course";
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from "vant";
import { defaultCourseDetail } from "@/types/course";
import type { ICourseDetail, IChapterItem, IChapterItemVideo } from "@/types/course";
import SectionDirectory from "@/views/course/components/SectionDirectory.vue";
import PunchRules from "@/views/course/components/PunchRules.vue";
import HeaderComponent from "@/views/course/components/HeaderComponent.vue";
import { filterTry } from "@/utils/filters";
import BottomBtn from "@/views/course/components/BottomBtn.vue";
import LookCourse from "@/views/course/components/LookCourse.vue";
import ConfirmOrderV2 from "@/views/course/components/ConfirmOrderV2.vue";

const luojigouCourseSkuIdList = [
  "1568062284888866817",
  "1580445037357817858",
  "1592331295190867970",
  "1595230810675847170",
  "1599591971714146305",
  "1602510250959097857",
  "1607256790802026498",
];
const tabList = [
  {
    id: 0,
    title: "详情",
  },
  {
    id: 1,
    title: "目录",
  },
];
const staticImg = Object.freeze({
  learnLogo: "https://img.luojigou.vip/FompUx_sqvDH4d5kkA6_HL3bE_i7",
  dotsLogo: "https://img.luojigou.vip/FsRDbu8uRa4QE0f9PppProATIESW",
  tag: "https://img.luojigou.vip/Fqd4fZoTMA2ID8m7Oy4fAfU431rG",
  punch: "https://img.luojigou.vip/Fh_Bb9Ph13YO0It20cVsZoyjyO2c",
});
const isApp = !isWeixinBrowser();
const router = useRouter();
const route = useRoute();
const { fullScreen, mode, id } = route.query;
const { loading } = storeToRefs(useAppStore());
const payType = ref("");
const checkedId = ref(0);
const swiperHeight = ref(1000);
const tabFixTop = ref(false);
const payShow = ref(false);
const showRules = ref(false);
const mySwiperRef = ref<SwipeInstance | null>(null);
const descriptionRef = ref<HTMLElement | null>(null);
const directoryRef = ref<HTMLElement | null>(null);
const info = reactive<ICourseDetail>(defaultCourseDetail());
const playMedia = reactive({
  videoUrl: "",
});

const showHeader = computed(() => {
  return isApp && fullScreen !== "1";
});

const isPunch = computed(() => {
  return info.cashbackActivity === 1;
});

const isLuojigouCourse = computed(() => {
  try {
    const state =
      (mode && mode === "luojigou") ||
      luojigouCourseSkuIdList.findIndex((item) => item === id) !== -1;
    console.log(state, "isLuojigouCourse");
    return state;
  } catch (err) {
    console.error(err);
    return false;
  }
});

async function handleCollectCourse() {
  const { status, msg } = await handleCollectCourseRequest({
    aiCourseSpuId: info.aiCourseSpuId,
    aiCourseSkuId: info.id,
  });
  if (status === 200) {
    info.isCollect = info.isCollect === 1 ? 0 : 1;
    showToast(info.isCollect === 1 ? "收藏成功" : "取消收藏成功");
  } else {
    showToast(msg);
  }
}
async function handleClick(key: string) {
  if (key === "collect") {
    await handleCollectCourse();
  } else if (key === "share") {
    callAppFc("shareCommonCourse", {
      course: info,
    });
  }
}
function paySuccess() {
  payShow.value = false;

  if (isLuojigouCourse.value) {
    if (typeof id === "string" && id.length > 0) getAICourseItemBank(id);
    // 优先展示目录
    checkedId.value = 1;
    setTitle();
    if (mySwiperRef.value) mySwiperRef.value.swipeTo(checkedId.value);
  } else {
    const { origin, pathname } = window.location;
    const route = `${origin}${pathname}#/punchCourse/${info.cashbackActivityId}`;

    navAppPage("course/punchActivities?url=" + encodeURIComponent(route), null, "", true);
  }
}
function handleTry(video: IChapterItemVideo, item: IChapterItem) {
  buried("clickTryLookBtn", { ...info, ...video, ...route.query });

  console.log("try", video, item);
  if (isApp) {
    const { origin, pathname } = window.location;
    const { aiCourseSkuId, name, sectionIndex, index } = item;
    callAppFc("jumpSection", {
      info: {
        ...info,
        activityUrl: `${origin}${pathname}#/courseDetail?id=${aiCourseSkuId}`,
        shareUrl: `${origin}${pathname}#/courseDetail?id=${aiCourseSkuId}`,
        name,
        id: aiCourseSkuId,
        aiCourseSpuId: info.aiCourseSpuId,
        hasPaid: 0,
      },
      sectionIndex: sectionIndex,
      rowIndex: index,
      slideEnable: 1,
    });
  } else {
    backTop();
    Object.assign(playMedia, video);
  }
}
// 引流课程
async function getAICourseItemBank(id: string) {
  const { data, status } = await getAICourseItemBank2Request({
    skuId: id,
  });
  if (status === 200) {
    Object.assign(info, data);
    changeImg();
  }
}
function changePayType(val: string) {
  payType.value = val;
}
async function goBuy() {
  if (info.hasPaid === 1) {
    showToast("该课程已购买");
    return;
  }

  buried("clickBuyBtn", { ...info, ...route.query });
  if (isLuojigouCourse.value && isApp) {
    await router.push(`/ARGamePay?id=${id}`);
  } else {
    payShow.value = true;
  }
}
// 切换tab
function changeTab(id: number) {
  checkedId.value = id;
  if (mySwiperRef.value) mySwiperRef.value.swipeTo(checkedId.value);

  // 切换tab时要把内容跳转到顶部
  if (tabFixTop.value) {
    document.querySelector("#tab")?.scrollIntoView({
      behavior: "smooth",
    });
  }
}
// 滑动swiper
function changeSwiper(index: number) {
  changeTab(index);

  let description = 1000;
  let directory = 1000;

  if (descriptionRef.value) {
    description = descriptionRef.value.offsetHeight;
  }
  if (directoryRef.value) {
    directory = directoryRef.value.offsetHeight;
  }

  const list = [description, directory];

  console.log(descriptionRef.value, directoryRef.value, list, "description, directory");

  swiperHeight.value = list[index];
}
// 设置页面标题
function setTitle() {
  document.title = info.name;
  let iframe = document.createElement("iframe");
  iframe.src = "";
  iframe.style.display = "none";

  // 这个就是我们异步获取 title 的函数
  let fn = () => {
    setTimeout(() => {
      iframe.removeEventListener("load", fn);
      document.body.removeChild(iframe);
      // console.log('title', document.title);
    }, 0);
  };
  iframe.addEventListener("load", fn);
  document.body.appendChild(iframe);
}
// 更改富文本中的图片样式
function changeImg() {
  let contents = info.description;
  let r = RegExp(/<[img]+\s+(.*?)(?<id>\w*?)[\s'"](.*?)>/g);
  // 返回数组['<img ... />','<img ... />']
  let matches = contents.match(r);
  if (matches) {
    matches.forEach((item) => {
      let len = item.length;
      // 追加之后的img
      let _str = item.slice(0, len - 2) + ' style="width:100%;"/>';
      contents = contents.replace(item, _str);
    });
  }

  contents = contents.replace("<p>", "<div>");
  contents = contents.replace("</p>", "</div>");

  info.description = contents;

  nextTick();
  setTimeout(() => {
    console.log("触发了");
    changeSwiper(checkedId.value);
  }, 1500);
}
// 获取课程详情
async function getAICourseItem(id: string) {
  const { data, status } = await getAICourseItemRequest({ skuId: id });
  if (status === 200) {
    Object.assign(info, data);
    info.chapterList.forEach((chapter, chapterIndex) => {
      chapter.itemList.forEach((item, index) => {
        item.index = index;
        item.sectionIndex = chapterIndex;
      });
    });
    console.log(info, "getAICourseItem");
    changeImg();
  }
}

onMounted(async () => {
  loading.value = true;
  await getToken();
  if (isLuojigouCourse.value) {
    if (typeof id === "string" && id.length > 0) await getAICourseItemBank(id);
    // 优先展示目录
    checkedId.value = 1;
  } else {
    if (typeof id === "string" && id.length > 0) await getAICourseItem(id);
  }

  setTitle();
  if (mySwiperRef.value) mySwiperRef.value.swipeTo(checkedId.value);
  buried("jumpCourseDetail", route.query);

  const tab = document.querySelector("#tab");
  if (tab) {
    window.addEventListener("scroll", () => {
      // console.log('111', tab.getBoundingClientRect().top)
      try {
        tabFixTop.value = tab.getBoundingClientRect().top < 0;
      } catch (err) {
        console.log(err, "scroll");
      }
    });
  }

  backTop();
  loading.value = false;
});
</script>

<template>
  <div class="course-detail">
    <div v-if="showHeader">
      <HeaderComponent :info="info" @handleClick="handleClick" />
    </div>

    <!--顶部的tab栏-->
    <div
      v-if="tabFixTop"
      class="course-detail-tab"
      :style="{ position: 'fixed', top: 0, left: 0, zIndex: 9, margin: 0 }"
    >
      <div
        v-for="item in tabList"
        :key="item.id"
        :class="['course-detail-tab-item', checkedId === item.id ? 'checked' : '']"
        @click="changeTab(item.id)"
      >
        <div v-if="item.id === 1 && !isLuojigouCourse" class="try fc">
          {{ filterTry(info.mediaType) }}
        </div>
        {{ item.title }}
        <div class="dots"></div>
        <img :src="staticImg.dotsLogo" alt="" />
      </div>
    </div>

    <!--顶部封面图-->
    <div class="course-detail-cover">
      <!--播放中-->
      <div v-if="playMedia.videoUrl">
        <video
          :src="playMedia.videoUrl"
          autoplay
          controls
          ref="video"
          :poster="playMedia.videoUrl + '?vframe/jpg/offset/1'"
        ></video>
      </div>
      <!--未播放-->
      <img v-else :src="info.imgCover" alt="" />
    </div>

    <!--课程主要信息-->
    <div :class="['course-detail-info', playMedia.videoUrl && 'info2']">
      <!--逻辑狗课程已经购买后不显示价格-->
      <div v-if="isLuojigouCourse && info.hasPaid === 1"></div>
      <div v-else-if="info.price !== 0 && info.price">
        <div class="course-detail-info-top">
          <div class="course-detail-info-top-price">￥{{ info.price.toFixed(2) }}</div>
          <del v-if="info.markingPrice" class="course-detail-info-top-markingPrice">
            原价:¥{{ info.markingPrice.toFixed(2) }}
          </del>
        </div>
      </div>
      <template v-else-if="info.price === 0">
        <div class="course-detail-info-price">免费</div>
      </template>

      <div class="course-detail-info-content">
        <div class="course-detail-info-content-title">
          <!--<div class="course-detail-info-content-title-label">618</div>-->
          {{ info.name }}
        </div>
        <div class="course-detail-info-content-desc">{{ info.simpleDescription }}</div>
      </div>
      <div class="course-detail-info-footer">
        <div v-if="info.suitAge" class="course-detail-info-footer-age">{{ info.suitAge }}岁</div>
        <!--<div class="course-detail-info-footer-people">{{ info.paidCount }}人购买</div>-->
        <div v-if="info.totalLearnUser" class="course-detail-info-footer-people">
          <img :src="staticImg.learnLogo" alt="" />
          <span>{{ info.totalLearnUser }}人学过</span>
        </div>
      </div>
    </div>

    <!--打卡详情-->
    <div v-if="isPunch" class="punch" @click="showRules = true">
      <img :src="staticImg.punch" alt="" />
    </div>

    <!--打卡规则-->
    <PunchRules :show="showRules" :rules="info.checkInExplain" @close="showRules = false" />

    <!--tab栏-->
    <div class="course-detail-tab" ref="tab" id="tab">
      <div
        v-for="item in tabList"
        :key="item.id"
        :class="['course-detail-tab-item', checkedId === item.id ? 'checked' : '']"
        @click="changeTab(item.id)"
      >
        <div v-if="item.id === 1 && !isLuojigouCourse" class="try fc">
          {{ filterTry(info.mediaType) }}
        </div>
        {{ item.title }}
        <!--<div class="dots"></div>-->
        <img :src="staticImg.dotsLogo" alt="" />
      </div>
    </div>

    <!--tab栏内容-->
    <VanSwipe
      ref="mySwiperRef"
      class="mySwiper"
      :loop="false"
      :style="{ height: `${swiperHeight}px` }"
      :show-indicators="false"
      @change="changeSwiper"
    >
      <VanSwipeItem>
        <!--详情-->
        <div v-html="info.description" ref="descriptionRef" class="description"></div>
      </VanSwipeItem>
      <VanSwipeItem v-if="Array.isArray(info.chapterList)">
        <!--目录-->
        <div ref="directoryRef">
          <SectionDirectory
            :chapterList="info.chapterList"
            :unlock="info.hasPaid === 1"
            :showChapter="info.showChapter"
            @try="handleTry"
          />
        </div>
      </VanSwipeItem>
    </VanSwipe>

    <!--底部-->
    <BottomBtn v-if="info.hasPaid === 0" :info="info" @buy="goBuy" />

    <LookCourse v-else-if="!isApp" :info="info" />

    <!--支付弹窗-->
    <ConfirmOrderV2
      :isPunch="isPunch"
      :info="info"
      :payType="payType"
      :show="payShow"
      @changePayType="changePayType"
      @paySuccess="paySuccess"
      @close="payShow = false"
    />
  </div>
</template>

<style scoped lang="scss">
.course-detail {
  position: relative;
  min-height: 100vh;
  background-color: #fbfcfd;
  overflow: hidden;

  &-cover {
    img {
      display: block;
      width: 100vw;
      height: 231px;
      object-fit: cover;
    }

    video {
      display: block;
      width: 100%;
    }
  }

  &-type {
    position: absolute;
    right: 0;
    top: 38px;
    width: 50px;
    height: 26px;
    line-height: 26px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #0b57c7;
    border-radius: 100px 0px 0px 100px;
    text-align: center;
  }

  &-info {
    position: relative;
    z-index: 1;
    margin-top: -23px;
    padding: 16px 16px 13px;
    background-color: #ffffff;
    box-shadow: 0px 6px 11px 4px rgba(231, 237, 241, 0.6);
    border-radius: 22px 22px 0 0;
    box-sizing: border-box;
    overflow: hidden;

    &-top {
      display: flex;
      align-items: center;
      margin-bottom: 13px;

      &-price {
        height: 32px;
        font-size: 23px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ff1f1f;
        line-height: 32px;
      }

      &-markingPrice {
        margin-left: 12px;
        height: 17px;
        font-size: 12px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
      }
    }

    &-price {
      margin-bottom: 13px;
      height: 32px;
      font-size: 23px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #ff1f1f;
      line-height: 32px;
    }

    &-content {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;

      &-title {
        margin-bottom: 10px;
        width: 343px;
        height: 28px;
        font-size: 20px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 28px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &-label {
          margin-right: 6px;
          padding: 4px 8px;
          font-size: 12px;
          height: 12px;
          line-height: 12px;
          color: #fff;
          background: linear-gradient(141deg, #ff9957 0%, #ff3737 100%);
          border-radius: 3px;
          box-sizing: content-box;
        }
      }

      &-desc {
        width: 343px;
        //height: 43px;
        font-size: 15px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 23px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 11px;
      height: 23px;
      font-size: 15px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 23px;

      &-age {
        height: 23px;
        font-size: 12px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 23px;
      }

      &-people {
        display: flex;
        align-items: center;

        img {
          display: block;
          width: 14px;
          height: 14px;
          object-fit: cover;
        }

        span {
          display: block;
          margin-left: 2px;
          height: 23px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 23px;
        }
      }
    }
  }

  .info2 {
    margin-top: 0;
    border-radius: 0;
  }

  .punch {
    margin-top: 10px;
    box-shadow: 0px 6px 11px 4px rgba(231, 237, 241, 0.6);

    img {
      display: block;
      width: 100vw;
      height: auto;
    }
  }

  &-tab {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 10px;
    position: relative;
    z-index: 2;
    width: 100vw;
    height: 58px;
    background: #ffffff;
    box-shadow: 0px 0px 20px 4px rgba(231, 237, 241, 0.6);

    &-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      font-size: 16px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #999999;

      .try {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(17px);
        width: 38px;
        height: 18px;
        font-size: 11px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ff7422;
        background: #ffe0cc;
        border-radius: 9px 9px 9px 2px;
      }

      img {
        //margin-top: 6px;
        width: 14px;
        height: 5px;
        object-fit: cover;
        opacity: 0;
      }
    }

    .checked {
      font-weight: 550;
      color: #333333;

      img {
        opacity: 1;
      }
    }
  }

  .buy-btn-container {
    position: relative;
    margin: 10px auto 0;
    width: 343px;
    height: 46px;
    //background: linear-gradient(306deg, #FB6872 0%, #FF4747 100%);
    background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
    border-radius: 23px;
    text-align: center;

    &-price {
      align-items: flex-start;
      margin-right: 8px;

      &-sign {
        margin-top: 9px;
        height: 24px;
        font-size: 17px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 24px;
      }

      &-num {
        height: 37px;
        font-size: 26px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 37px;
      }

      &-original {
        margin-top: 13px;
        margin-left: 2px;
        height: 18px;
        font-size: 13px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 18px;
      }
    }

    &-text {
      line-height: 46px;
      font-size: 18px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 550;
      color: #ffffff;
    }

    &-tag {
      padding-top: 4px;
      position: absolute;
      top: -20px;
      right: 12px;
      width: 67px;
      height: 31px;
      z-index: 10;
      background: no-repeat center/contain;
      font-size: 13px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ff6500;
      box-sizing: border-box;
    }
  }

  .hasPaid {
    opacity: 0.5;
  }
}

.mySwiper {
  padding-bottom: 76px;
  box-sizing: content-box;
}

.footer {
  &-box {
    width: 100vw;
    height: 76px;
    background-color: #fafafa;
  }

  &-container {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 76px;
    background-color: #fff;
    box-shadow: 0px -3px 28px 0px rgba(119, 119, 119, 0.1);
    //overflow: hidden;
  }
}
</style>
