<script setup lang="ts">
import type { IChapterItemVideo, ICourseDetail } from "@/types/course";
import { defaultCourseDetail } from "@/types/course";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { backTop, buried, getToken, isWeixinBrowser } from "@/utils";
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from "vant";
import type { SwipeInstance } from "vant";
import { getAICourseItemBank2Request, getAICourseItemRequest } from "@/api/course";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";
import AudioTab from "@/views/course/components/AudioTab.vue";
import LookCourse from "@/views/course/components/LookCourse.vue";
import StoryDetail from "@/views/course/components/StoryDetail.vue";
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

const coverShadow = "https://app-resources-luojigou.luojigou.vip/Fs3CslKsaGph0hjVZ8XWFJCflanP";
const recommendText = "https://app-resources-luojigou.luojigou.vip/FtP16gv9v5uJkiEtr257ghh9T-0l";
const audioLogo = "https://app-resources-luojigou.luojigou.vip/FsnZbqWzG7xJ2zxYTSka21WLIWD_";

const router = useRouter();
const route = useRoute();
const { loading } = storeToRefs(useAppStore());

const { id, fullScreen, mode } = route.query;

const isApp = !isWeixinBrowser();
const info = ref<ICourseDetail>(defaultCourseDetail()); // 课程详情
const tabFixTop = ref(false); // 顶部的tab是否显示
const tabId = ref(0);
const orderId = ref("");
const payShow = ref(false);
const payType = ref("微信支付");
const swiperHeight = ref(1000);
const playMedia = ref<IChapterItemVideo>();
const showLookBtn = ref(true);
const swiperRef = ref<SwipeInstance | null>(null);
const descriptionRef = ref<HTMLElement | null>(null);
const directoryRef = ref<HTMLElement | null>(null);

const showHeader = computed(() => {
  return isApp && fullScreen !== "1";
});

// 是否是打卡活动
const isPunch = computed(() => {
  return info.value.cashbackActivity === 1;
});
// 是否是逻辑狗课程
const isLuojigouCourse = computed(() => {
  try {
    const state =
      (mode && mode === "luojigou") ||
      luojigouCourseSkuIdList.findIndex((item) => item === id) !== -1;
    // console.log(state, "isLuojigouCourse");
    return state;
  } catch (err) {
    console.error(err);
    return false;
  }
});

function changePayType(val: string) {
  payType.value = val;
}
function jumpPay() {
  buried("clickBuyBtn", { ...info.value, ...route.query });
  payShow.value = true;
}
function toggleTab(id: number) {
  tabId.value = id;

  if (swiperRef.value) swiperRef.value.swipeTo(tabId.value);

  // if (tabFixTop) {
  //   document.querySelector('#tab').scrollIntoView({
  //     behavior: "smooth"
  //   });
  // }
  // 切换tab时要把内容跳转到顶部
  if (tabFixTop.value) {
    document.querySelector("#tab")?.scrollIntoView({
      behavior: "smooth",
    });
  }
}
// 初始化
function init() {
  if (swiperRef.value) swiperRef.value.swipeTo(tabId.value);
  // document.querySelector('#tab').scrollIntoView({
  //   behavior: "smooth"
  // });
}
// 滑动swiper
function changeSwiper(index: number) {
  toggleTab(index);
  try {
    let description = 1000;
    if (descriptionRef.value) description = descriptionRef.value.offsetHeight;
    let directory = 1000;
    if (directoryRef.value) directory = directoryRef.value.offsetHeight;
    // const comment = $refs.comment && $refs.comment.$el && $refs.comment.$el.offsetHeight;

    console.log(description, directory, "comment");
    // const list = [description, directory, comment];
    const list = [description, directory];
    swiperHeight.value = list[index];
    // console.log(swiperHeight,'swiperHeight');
  } catch (err) {
    console.log(err, "changeSwiper");
  }
}
// 设置页面标题
function setTitle() {
  document.title = info.value.name;
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
  let contents = info.value.description;
  let r = RegExp(/<[img]+\s+(.*?)(?<id>\w*?)[\s'"](.*?)>/g);
  let matchres = contents.match(r); // 返回数组['<img ... />','<img ... />']
  // console.log("matchres===", matchres);
  if (matchres) {
    matchres.forEach((item, index) => {
      let len = item.length;
      let _str = item.slice(0, len - 2) + ' style="width:100%;"/>'; //追加之后的img
      contents = contents.replace(item, _str);
    });
  }
  // console.log("contents===", contents);
  info.value.description = contents;

  setTimeout(() => {
    console.log(swiperHeight.value, "swiperHeight");
    let description = 1000;
    if (descriptionRef.value) description = descriptionRef.value.offsetHeight;
    let directory = 1000;
    if (directoryRef.value) directory = directoryRef.value.offsetHeight;

    console.log(description, directory, "comment1");
    const list = [description, directory];

    swiperHeight.value = list[tabId.value];
    console.log(swiperHeight.value, "swiperHeight1");
  }, 1500);
}

async function getAICourseItemBank(id: string) {
  const { data, status } = await getAICourseItemBank2Request({
    skuId: id,
  });
  if (status === 200) {
    Object.assign(info, data);
    changeImg();
  }
}
// 获取课程详情
async function getAICourseItem(id: string) {
  const { data, status } = await getAICourseItemRequest({ skuId: id });
  if (status === 200) {
    info.value = data;
    // console.log(info, 'getAICourseItem');
    changeImg();
  }
}
onMounted(async () => {
  loading.value = true;
  await getToken();

  if (typeof id === "string") {
    if (isLuojigouCourse.value) {
      await getAICourseItemBank(id);
    } else {
      await getAICourseItem(id);
    }
  }

  setTitle();
  init();
  buried("jumpCourseDetail", { ...info.value, ...route.query });

  const tab = document.querySelector("#tab");
  window.addEventListener("scroll", () => {
    if (tab) tabFixTop.value = tab.getBoundingClientRect().top < 0;
  });

  backTop();

  loading.value = false;
});
</script>

<template>
  <div class="a-container">
    <AudioTab v-if="tabFixTop" fixed :tabId="tabId" @toggleTab="toggleTab" />

    <div class="audio">
      <!--课程详情-->
      <div class="audio-info">
        <div v-if="info.imgCover">
          <img :src="info.imgCover" alt="" class="audio-info-logo" />
          <img :src="coverShadow" alt="" class="audio-info-coverShadow" />
        </div>
        <div class="audio-info-text" v-if="info.name">
          <div class="audio-info-text-title">{{ info.name }}</div>
          <div class="audio-info-text-desc">
            <div>{{ info.simpleDescription }}</div>
          </div>
        </div>
      </div>
      <!--音频logo-->
      <div class="audio-logo">
        <img :src="audioLogo" alt="" />
      </div>
      <!--推荐相关书籍-->
      <div class="audio-recommend">
        <span class="dots"></span>
        <img :src="recommendText" alt="" class="audio-recommend-logo" />
      </div>
    </div>

    <AudioTab id="tab" :tabId="tabId" @toggleTab="toggleTab" />

    <VanSwipe
      ref="swiperRef"
      class="mySwiper"
      :loop="false"
      :style="{ height: `${swiperHeight}px` }"
      :show-indicators="false"
      @change="changeSwiper"
    >
      <VanSwipeItem>
        <!--详情-->
        <div v-html="info.description" class="description" ref="descriptionRef"></div>
      </VanSwipeItem>
      <VanSwipeItem>
        <!--故事-->
        <div ref="directoryRef">
          <StoryDetail :info="info" :storyList="info.chapterList" :title="info.name" />
        </div>
      </VanSwipeItem>
    </VanSwipe>

    <div class="buy" v-if="info.hasPaid === 0">
      <div class="buy-left">
        <div class="buy-left-price">￥{{ info.price }}</div>
        <del class="buy-left-markingPrice">原价￥{{ info.markingPrice }}</del>
      </div>
      <div class="buy-text">优惠价</div>
      <div class="buy-btn" @click="jumpPay">立即购买</div>
    </div>

    <LookCourse v-else-if="showLookBtn" :info="info" @notShow="showLookBtn = false" />

    <!--占位置用的-->
    <div class="footers-box"></div>

    <ConfirmOrderV2
      :info="info"
      :payType="payType"
      :show="payShow"
      @changePayType="changePayType"
      @close="payShow = false"
    />
  </div>
</template>

<style scoped lang="scss">
.a-container {
  .audio {
    overflow: hidden;
    background-color: #41944e;

    &-info {
      display: flex;
      position: relative;
      padding-top: 10px;
      margin-bottom: 7px;

      &-logo {
        position: relative;
        z-index: 2;
        margin-left: 18px;
        display: block;
        width: 106px;
        height: 106px;
        object-fit: cover;
        border-radius: 10px;
      }

      &-coverShadow {
        position: absolute;
        left: 32px;
        top: 17px;
        z-index: 1;
        display: block;
        width: 97px;
        height: 94px;
        object-fit: cover;
      }

      &-text {
        margin-top: 13px;
        margin-left: 18px;

        &-title {
          margin-bottom: 8px;
          width: 200px;
          min-height: 22px;
          font-size: 18px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        &-desc {
          padding: 3px 10px 4px;
          background: rgba(25, 132, 42, 0.3);
          border-radius: 11px;

          div {
            width: 180px;
            font-size: 11px;
            font-family:
              PingFangSC-Regular,
              PingFang SC;
            font-weight: 400;
            color: #ffffff;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    &-logo {
      display: flex;
      justify-content: flex-end;
      margin-right: 35px;

      img {
        display: block;
        width: 87px;
        height: 60px;
        object-fit: cover;
      }
    }

    &-recommend {
      display: flex;
      align-items: center;
      margin-left: 22px;
      margin-bottom: 19px;

      .dots {
        display: block;
        margin-right: 8px;
        width: 3px;
        height: 12px;
        background: #ffffff;
        border-radius: 10px;
      }

      &-logo {
        display: block;
        width: 100px;
        height: 15px;
        object-fit: cover;
      }
    }
  }

  .description {
    //margin: -1em auto;
    background-color: #fff;
  }

  .buy {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    width: 100vw;
    height: 107px;
    background: #ffffff;
    box-shadow: 0 0 4px 0 rgba(230, 228, 228, 0.5);

    &-left {
      margin-top: 21px;
      margin-left: 16px;

      &-price {
        height: 25px;
        font-size: 24px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ff4567;
        line-height: 25px;
      }

      &-markingPrice {
        margin-top: 4px;
        margin-left: 2px;
        height: 25px;
        font-size: 14px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #adadad;
        line-height: 25px;
      }
    }

    &-text {
      margin-top: 25px;
      margin-left: 10px;
      height: 25px;
      font-size: 12px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ff4567;
      line-height: 25px;
    }

    &-btn {
      position: absolute;
      right: 16px;
      top: 25px;
      width: 112px;
      height: 42px;
      line-height: 42px;
      font-size: 16px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ffffff;
      background: linear-gradient(90deg, #ff4567 0%, #ff5c7a 100%);
      border-radius: 56px;
      text-align: center;
    }
  }

  .footers-box {
    height: 107px;
  }
}
</style>
