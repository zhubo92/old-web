<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import {
  backTop,
  buried,
  callAppFc,
  getToken,
  isWeixinBrowser,
  navAppPage,
  registerWxOpenLaunchApp,
  wxUpdateAppMessageShareData,
} from "@/utils";
import { showToast, Swipe as VanSwipe, SwipeItem as VanSwipeItem } from "vant";
import type { SwipeInstance } from "vant";
import { useRoute, useRouter } from "vue-router";
import { getMobileCourseDetailRequest } from "@/api/group";
import { getAICourseItemRequest, handleCollectCourseRequest } from "@/api/course";
import type { IGroupCourse } from "@/types/group";
import { defaultGroupCourse } from "@/types/group";
import type { ICourseDetail } from "@/types/course";
import { defaultCourseDetail } from "@/types/course";
import TopNav from "@/views/group/components/TopNav.vue";
import CourseTab from "@/views/group/components/CourseTab.vue";
import ActivityInfo from "@/views/group/components/ActivityInfo.vue";
import PunchRules from "@/views/course/components/PunchRules.vue";
import GroupTeam from "@/views/group/components/GroupTeam.vue";
import DirectoryPart from "@/views/group/components/DirectoryPart.vue";
import LookCourse from "@/views/course/components/LookCourse.vue";
import ConfirmOrderV2 from "@/views/course/components/ConfirmOrderV2.vue";
import { setAudio } from "@/utils/storage";

const staticImg = Object.freeze({
  buyLogo: "https://app-resources-luojigou.luojigou.vip/FtEsRA8TePMldqUAb9S9cID6L69Q",
  learnLogo: "https://img.luojigou.vip/FompUx_sqvDH4d5kkA6_HL3bE_i7",
  punch: "https://img.luojigou.vip/Fh_Bb9Ph13YO0It20cVsZoyjyO2c",
});
const isApp = !isWeixinBrowser();
const route = useRoute();
const router = useRouter();
const { id } = route.query;

const tabId = ref(0);
const courseInfo = reactive<ICourseDetail>(defaultCourseDetail()); // 课程详情
const info = reactive<IGroupCourse>(defaultGroupCourse()); // 拼团详情
const tabPosition = ref("top");
const tabFixTop = ref(false);
const payType = ref("微信支付");
const payShow = ref(false);
const swiperHeight = ref(1000);
const tabDistance = ref(0);
const playMedia = reactive<any>({
  videoUrl: "",
});
const showRules = ref(false);
const descriptionRef = ref<HTMLElement | null>(null);
const directoryRef = ref<HTMLElement | null>(null);
const swiperRef = ref<SwipeInstance | null>(null);
const topNavRef = ref<HTMLElement | null>(null);

// 显示队伍
const showTeam = computed(() => {
  const { haveBuy, groupBuyActivity, alreadyBuy } = info;
  return (
    !haveBuy &&
    alreadyBuy === 0 &&
    groupBuyActivity &&
    Array.isArray(groupBuyActivity.group) &&
    groupBuyActivity.group.length !== 0
  );
});
// 是否是打卡活动
const isPunch = computed(() => {
  return courseInfo.cashbackActivity === 1;
});
// 拼团活动状态 0 未开始 1 已开始 2已结束
const activityState = computed(() => {
  try {
    const { startTime, endTime } = info.groupBuyActivity;
    const sTime = new Date(startTime).valueOf();
    const eTime = new Date(endTime).valueOf();
    const now = new Date().valueOf();

    if (now < sTime) {
      return "0";
    } else if (now > eTime) {
      return "2";
    } else {
      return "1";
    }
  } catch (err) {
    console.log(err, "activityState");
  }

  return "2";
});

function paySuccess() {
  payShow.value = false;
  info.alreadyBuy = 1;
  navAppPage(`/course/pipeline?course_id=${info.skuId}`);
}
async function handleCollectCourse() {
  const { status, msg } = await handleCollectCourseRequest({
    aiCourseSpuId: courseInfo.spu.id,
    aiCourseSkuId: courseInfo.id,
  });
  if (status === 200) {
    courseInfo.isCollect = courseInfo.isCollect === 1 ? 0 : 1;
    showToast(courseInfo.isCollect === 1 ? "收藏成功" : "取消收藏成功");
  } else {
    showToast(msg);
  }
}
function handleTry(record: any, item: any, type = "video") {
  buried("clickGroupTryLookBtn", { ...courseInfo, ...record, ...route.query });

  console.log("try", record, item, type);
  if (isApp) {
    const { origin, pathname } = window.location;
    const { aiCourseSkuId, name, sectionIndex, index } = item;
    callAppFc("jumpSection", {
      info: {
        ...courseInfo,
        activityUrl: `${origin}${pathname}#/courseDetail?id=${aiCourseSkuId}`,
        shareUrl: `${origin}${pathname}#/courseDetail?id=${aiCourseSkuId}`,
        name,
        id: aiCourseSkuId,
        aiCourseSpuId: courseInfo.spu.id,
        hasPaid: 0,
      },
      sectionIndex: sectionIndex,
      rowIndex: index,
      slideEnable: 1,
    });
  } else {
    if (type === "video") {
      backTop();
      Object.assign(playMedia, record);
    } else {
      setAudio({
        name: item.name,
        title: courseInfo.name,
        url: record.audioUrl,
        imgCover: item.imgCover,
      });
      router.push("/course/TryListen");
    }
  }
}
async function registerComponents() {
  const { name, imgCoverMini, simpleDescription } = info;
  await registerWxOpenLaunchApp(() => {
    wxUpdateAppMessageShareData(name, simpleDescription, imgCoverMini);
  });
}
function changePayType(type: string) {
  payType.value = type;
}
function jumpPage(type: string, params?: any) {
  console.log(type, params, "type,params");
  if (type === "goInvite" || type === "makeUpOrder") {
    // 去邀请 去凑单
    router.push({
      path: "/group/GroupDetail",
      query: {
        id: params, // 团id
      },
    });
  } else if (type === "lookDetail") {
    // 查看详情
    router.push({
      path: "/group/GroupDetail",
      query: {
        id: info.currentGroupId, // 团id
      },
    });
  } else if (type === "buyAlone") {
    // 单独购买
    buried("clickGroupBuyBtn", { ...courseInfo, ...route.query });

    // if (isApp) {
    //   try {
    //     const path = '/course/pipeline?course_id=';
    //     const params = JSON.stringify({
    //       route: `${path}${$route.query.id}`
    //     });
    //     window['navAppPage']['postMessage'](params);
    //   } catch (err) {
    //     console.log(err, 'navAppPage');
    //   }
    // } else {
    payShow.value = true;
    // }
  } else if (type === "startGroup") {
    // 开团购买
    if (activityState.value !== "1") {
      showToast("活动还未开始");
      return;
    }

    buried("clickStartGroupBuyBtn", { ...courseInfo, ...route.query });

    const { groupActivityId } = info.groupBuyActivity;
    const { skuId } = info;

    router.push({
      path: "/group/GroupOrder",
      query: {
        activity: groupActivityId,
        sku: skuId,
        isGroup: 0,
      },
    });
  } else if (type === "lookCourse") {
    navAppPage(`/course/pipeline?course_id=${route.query.id}`);
  }
}
// 获取课程详情中的目录
async function getAICourseItem(id: string) {
  const { data, status } = await getAICourseItemRequest({ skuId: id });
  if (status === 200) {
    Object.assign(courseInfo, data);

    courseInfo.chapterList.forEach((chapter, chapterIndex) => {
      chapter.itemList.forEach((item, index) => {
        item.index = index;
        item.sectionIndex = chapterIndex;
      });
    });
    console.log(courseInfo, "courseInfo");
  }
}
// 更改富文本中的图片样式
async function changeImg() {
  let contents = info.description;
  let r = RegExp(/<[img]+\s+(.*?)(?<id>\w*?)[\s'"](.*?)>/g);
  let matchres = contents.match(r); //返回数组['<img ... />','<img ... />']
  // console.log("matchres===", matchres);
  if (matchres) {
    matchres.forEach((item: any) => {
      let len = item.length;
      let _str = item.slice(0, len - 2) + ' style="width:100%;"/>'; //追加之后的img
      contents = contents.replace(item, _str);
    });
  }
  // console.log("contents===", contents);
  info.description = contents;

  await nextTick();
  setTimeout(() => {
    let description = 1000;
    let directory = 1000;

    if (descriptionRef.value) {
      description = descriptionRef.value.offsetHeight;
    }
    if (directoryRef.value) {
      directory = directoryRef.value.offsetHeight;
    }
    const list = [description, directory];
    swiperHeight.value = list[tabId.value];
    console.log(swiperHeight.value, "swiperHeight");
  }, 1500);
}
// 获取课程详情
async function getMobileCourseDetail(id: string) {
  try {
    const { data, status, msg } = await getMobileCourseDetailRequest(id);
    if (status === 200) {
      Object.assign(info, data);
      console.log(info, "info");

      if (info.haveGroupActivity) {
        // 此课程有拼团活动
        await changeImg();
        await getAICourseItem(id);
      } else {
        // 没有拼团活动 跳转到app课程详情
        if (isApp) {
          // app里面
          navAppPage(`/course/pipeline?course_id=${id}`);
        } else {
          // 在h5中
          if (info.mediaType === 1) {
            // 音频课
            await router.replace({
              path: "/course/AudioDetail",
              query: {
                id,
              },
            });
          } else {
            // 视频课
            await router.replace({
              path: "/course/CourseDetail",
              query: {
                id,
              },
            });
          }
        }
      }
    } else {
      showToast(msg);
    }
  } catch (err) {
    console.log(err, "getMobileCourseDetail");
  }
}
function changeSwiper(index: number) {
  toggleTab(index);
  try {
    let description = 1000;
    if (descriptionRef.value) description = descriptionRef.value.offsetHeight;
    let directory = 1000;
    if (directoryRef.value) directory = directoryRef.value.offsetHeight;
    // const comment = $refs.comment.$el.offsetHeight;

    // console.log(description, directory, comment);
    const list = [description, directory];

    swiperHeight.value = list[index];
  } catch (err) {
    console.log(err, "changeSwiper");
  }
}
function toggleTab(id: number) {
  // console.log(id, 'id');
  tabId.value = id;
  swiperRef.value?.swipeTo(tabId.value);
}

onMounted(async () => {
  await getToken();

  if (typeof id === "string") await getMobileCourseDetail(id);

  await registerComponents();

  buried("jumpGroupCourseDetail", { ...courseInfo, ...route.query });

  swiperRef.value?.swipeTo(tabId.value);

  await nextTick();
  try {
    const tab = document.querySelector("#tab");
    if (tab) {
      window.addEventListener("scroll", () => {
        tabDistance.value = isApp && topNavRef.value ? topNavRef.value.clientHeight - 1 : 0;
        tabFixTop.value = tab.getBoundingClientRect().top < tabDistance.value;
      });
    }
  } catch (err) {
    console.log(err, "scroll");
  }

  backTop();
});
</script>

<template>
  <div :class="['groupCourse', isApp ? 'app' : '']">
    <div ref="topNavRef">
      <TopNav
        :type="1"
        :info="info"
        :courseInfo="courseInfo"
        :title="'课程详情'"
        @handleClick="handleCollectCourse"
      />
    </div>

    <CourseTab
      v-if="tabFixTop"
      :isApp="isApp"
      :tabId="tabId"
      :tabDistance="tabDistance"
      :tabPosition="tabPosition"
      @toggleTab="toggleTab"
    />

    <div class="course-box">
      <video
        v-if="playMedia.videoUrl"
        :src="playMedia.videoUrl"
        controls
        ref="video"
        autoplay
        class="course-video"
      ></video>

      <img v-else :src="info.imgCover" alt="" class="course-cover" />
    </div>

    <!--拼团详情-->
    <ActivityInfo :isPlay="!!playMedia.videoUrl" :info="info" />

    <!--课程信息-->
    <div class="course-info">
      <div class="course-info-header">
        <div v-if="info.activityTag" class="course-info-header-label">{{ info.activityTag }}</div>
        <div class="course-info-header-title">{{ info.name }}</div>
      </div>
      <div class="course-info-cont">{{ info.simpleDescription }}</div>
      <div class="course-info-footer">
        <div v-if="info.suitAge" class="course-info-footer-age">{{ info.suitAge }}岁</div>
        <div class="course-info-footer-num">
          <img :src="staticImg.learnLogo" alt="" />
          <div>{{ courseInfo.totalLearnUser }}人学过</div>
          <!--<div>{{ info.salesNumber }}人购买</div>-->
        </div>
      </div>
    </div>

    <!--打卡规则-->
    <div v-if="isPunch" class="punch" @click="showRules = true">
      <img :src="staticImg.punch" alt="" />
    </div>

    <!--打卡规则-->
    <PunchRules :show="showRules" @close="showRules = false" />

    <!--拼团队伍 !info.haveBuy &&-->
    <GroupTeam
      v-if="showTeam"
      ref="groupTeam"
      :group="info.groupBuyActivity.group"
      @jumpPage="jumpPage"
    />

    <div class="group-play">
      <div class="group-play-title">拼团玩法</div>
      <div v-if="info.groupBuyActivity" class="group-play-cont">
        开团后邀请{{ info.groupBuyActivity.population }}人参团则拼团成功，人数不够则自动退款。
      </div>
    </div>

    <CourseTab :tabId="tabId" :info="info" @toggleTab="toggleTab" />

    <VanSwipe
      ref="swiperRef"
      :loop="false"
      :style="{ height: `${swiperHeight}px` }"
      :show-indicators="false"
      class="mySwiper"
      @change="changeSwiper"
    >
      <VanSwipeItem>
        <!--详情-->
        <div ref="descriptionRef" class="description" v-html="info.description"></div>
      </VanSwipeItem>
      <VanSwipeItem>
        <!--目录-->
        <div v-if="Array.isArray(courseInfo.chapterList)" ref="directoryRef">
          <DirectoryPart
            :info="info"
            :chapterList="courseInfo.chapterList"
            :showChapter="courseInfo.showChapter"
            @try="handleTry"
          />
        </div>
      </VanSwipeItem>
    </VanSwipe>

    <LookCourse v-if="!isApp && info.alreadyBuy === 1" :info="courseInfo" />

    <div v-else-if="isApp && info.alreadyBuy === 1" class="lookCourse">
      <div class="lookCourse-btn" @click="jumpPage('lookCourse')">查看课程</div>
    </div>

    <div v-else-if="info.alreadyBuy === 0 && info.price" class="course-buy">
      <div v-if="info.haveBuy" class="course-buy-look" @click="jumpPage('lookDetail')">
        查看拼团详情
      </div>

      <div v-else class="course-buy">
        <div class="course-buy-alone" @click="jumpPage('buyAlone')">
          <div class="course-buy-alone-price">
            <span>￥</span>
            {{ info.price.toFixed(2) }}
          </div>

          <div class="course-buy-alone-text">单独购买</div>
        </div>

        <div
          v-if="info.groupBuyActivity"
          :class="['course-buy-start', activityState === '1' ? 'started' : '']"
          @click="jumpPage('startGroup')"
        >
          <div class="course-buy-start-price">
            <span>￥</span>
            {{ info.groupBuyActivity.activityPrice.toFixed(2) }}
          </div>

          <div class="course-buy-start-text">立即开团</div>
        </div>
      </div>
    </div>

    <ConfirmOrderV2
      :info="courseInfo"
      :payType="payType"
      :show="payShow"
      @changePayType="changePayType"
      @paySuccess="paySuccess"
      @close="payShow = false"
    />
  </div>
</template>

<style scoped lang="scss">
.groupCourse {
  position: relative;
  overflow: hidden;
  padding-bottom: 83px;

  .course-box {
    position: relative;
  }

  .course-label {
    position: absolute;
    right: 0;
    top: 38px;
    padding: 4px 10px 4px 14px;
    font-size: 13px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #0b57c7;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 100px 0 0 100px;
  }

  .course-video {
    display: block;
    width: 100%;
  }

  .course-cover {
    display: block;
    width: 100vw;
    height: 231px;
    object-fit: cover;
  }

  .course-info {
    position: relative;
    z-index: 3;
    margin-top: -30px;
    margin-bottom: 10px;
    padding: 17px 16px;
    width: 100vw;
    //height: 142px;
    background: #ffffff;
    box-shadow: 0px 6px 7px 4px rgba(231, 237, 241, 0.6);
    border-radius: 22px 22px 0px 0px;
    box-sizing: border-box;
    overflow: hidden;

    &-header {
      display: flex;
      align-items: center;
      width: 343px;

      &-label {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        margin-right: 6px;
        padding: 4px 8px 2px;
        height: 12px;
        //line-height: 12px;
        font-family: YouSheBiaoTiHei;
        color: #fff;
        font-size: 12px;
        background: linear-gradient(141deg, #ff9957 0%, #ff3737 100%);
        border-radius: 5px;
        box-sizing: content-box;
        transform: skewX(-10deg);
        white-space: nowrap;
      }

      &-title {
        width: 343px;
        height: 25px;
        font-size: 18px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 25px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &-cont {
      margin-top: 6px;
      width: 343px;
      font-size: 13px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #797979;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &-footer {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 343px;
      height: 23px;

      &-num {
        display: flex;
        align-items: center;

        img {
          display: block;
          width: 14px;
          height: 14px;
          object-fit: cover;
        }

        div {
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

      &-age {
        padding: 0 12px;
        height: 23px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ff7422;
        background: #fff2e8;
        line-height: 23px;
      }
    }
  }

  .punch {
    margin-bottom: 10px;

    img {
      display: block;
      width: 100vw;
      height: auto;
      object-fit: contain;
    }
  }

  .group-play {
    margin-bottom: 10px;
    padding: 16px;
    padding-right: 0;
    width: 100vw;
    height: 82px;
    background: #ffffff;
    box-shadow: 0px 0px 20px 4px rgba(231, 237, 241, 0.6);
    box-sizing: border-box;

    &-title {
      margin-bottom: 4px;
      height: 23px;
      font-size: 16px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 23px;
    }

    &-cont {
      height: 23px;
      font-size: 13px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #868686;
      line-height: 23px;
    }
  }

  .lookCourse {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 76px;
    background: #ffffff;
    box-shadow: 0px -4px 34px 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    &-btn {
      margin-top: 10px;
      width: 343px;
      height: 46px;
      line-height: 46px;
      background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
      border-radius: 23px;
      font-size: 18px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
    }
  }

  .course-buy {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100vw;
    height: 83px;
    background: #ffffff;
    box-shadow: 0px -4px 34px 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    &-alone {
      margin-right: 10px;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 131px;
      height: 46px;
      background: #dbe9ff;
      border-radius: 23px;
      box-sizing: border-box;

      &-price {
        display: flex;
        height: 30px;
        font-size: 22px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #0b57c7;
        line-height: 30px;

        span {
          margin-top: 7px;
          display: block;
          height: 21px;
          font-size: 15px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #0b57c7;
          line-height: 21px;
        }
      }

      &-text {
        margin-top: -4px;
        height: 16px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #0b57c7;
        line-height: 16px;
      }
    }

    &-start {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 202px;
      height: 46px;
      background: linear-gradient(306deg, #dbdbdb 0%, #cfcfcf 100%);
      border-radius: 23px;

      &-price {
        display: flex;
        height: 30px;
        font-size: 22px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 30px;

        span {
          margin-top: 7px;
          display: block;
          height: 21px;
          font-size: 15px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 21px;
        }
      }

      &-text {
        margin-top: -4px;
        height: 16px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 16px;
      }
    }

    .started {
      background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
    }

    &-look {
      margin-top: 10px;
      width: 343px;
      height: 46px;
      line-height: 46px;
      background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
      border-radius: 23px;
      font-size: 18px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
    }

    &-btn {
      margin-top: 10px;
      width: 343px;
      height: 46px;
      line-height: 46px;
      background: linear-gradient(306deg, #fb6872 0%, #ff4747 100%);
      border-radius: 23px;
      text-align: center;
      font-size: 18px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
}

.app {
  .course-label {
    //top: 82px;
  }
}

.description {
  //margin: -1em auto 0;
}
</style>
