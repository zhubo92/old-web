<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { callAppFc, getToken } from "@/utils";
import { showToast } from "vant";
import { useRoute, useRouter } from "vue-router";
import {
  applyMyCashbackRequest,
  checkinUserNotifyRequest,
  getPunchUserDetailRequest,
} from "@/api/punch";
import type { IPunchCourse } from "@/types/punch";
import { defaultPunchCourse } from "@/types/punch";
import HeaderComponent from "@/views/punch/components/HeaderComponent.vue";
import PunchRules from "@/views/punch/components/PunchRules.vue";
import CourseInfo from "@/views/punch/components/CourseInfo.vue";
import SectionComponent from "@/views/punch/components/SectionComponent.vue";
import ConfirmCashback from "@/views/punch/components/ConfirmCashback.vue";
import ClockInSuccess from "@/views/punch/components/ClockInSuccess.vue";
import type { IChapterItem } from "@/types/course";

const staticImg = Object.freeze({
  bgi: "https://img.luojigou.vip/FmXn9NfH3rxxWlretO7oBuK5IhM8",
  goShare: "https://img.luojigou.vip/FkcYebcPUMLHAgRWVYAth-6Xdw9o",
});

const router = useRouter();
const { id } = useRoute().params;
const { origin, pathname } = window.location;

const showRules = ref(false);
const info = reactive<IPunchCourse>(defaultPunchCourse());

const showCashback = ref(false);
const showClockIn = ref(false);
const selectedChapterIndex = ref(0); // 选中的章节索引

const showShareBtn = computed(() => {
  return info.checkinState === 1;
});

function handleClose() {
  getPunchUserDetail();
  showClockIn.value = false;
}
// 每日提醒开关
async function checkinUserNotify() {
  const { data, msg, status } = await checkinUserNotifyRequest({
    id: info.id,
    state: info.isDailyRemind === 1 ? 0 : 1,
  });
  if (status === 200) {
    info.isDailyRemind = data;
    showToast(info.isDailyRemind === 1 ? "已开启" : "已关闭");
  } else {
    msg && showToast(msg);
  }
}
async function getPunchUserDetail() {
  if (typeof id !== "string") return;
  const { data, msg, status } = await getPunchUserDetailRequest({ activityId: id });
  if (status === 200) {
    console.log(data, "getPunchUserDetail");
    Object.assign(info, data, {
      chapterList: data.chapterList.map((chapter) => {
        return {
          ...chapter,
          itemList: chapter.itemList.map((item, index) => {
            return {
              ...item,
              index,
            };
          }),
        };
      }),
    });
  } else {
    msg && showToast(msg);
  }
}
// 查看是否可以申请提现
async function applyMyCashback(id: string) {
  const { msg, status } = await applyMyCashbackRequest(id);
  if (status === 200) {
    callAppFc("goWithdrawals", { activityId: id });
    info.cashbackState = 1;
  } else {
    msg && showToast(msg);
  }
}
function changeIndex(index: number) {
  selectedChapterIndex.value = index;
}
async function jumpPage(
  val: string,
  params: { item: IChapterItem | null; index: undefined | number; list: IChapterItem[] } = {
    item: null,
    index: undefined,
    list: [],
  },
) {
  console.log(val, params, "jumpPage");

  const { item, index, list } = params;
  const { poster, checkinDays, courseSpuId, courseName, courseSkuId, progressBar } = info;

  if (val === "jumpSection") {
    // 跳转APP播放页面

    if (item && item.payType === 0) {
      const fIndex = list.findIndex((item) => item.payType === 0);
      if (fIndex === 0) {
        showToast("该小节未解锁");
      } else if (fIndex === index) {
        showToast("明天再来学习吧~");
      } else {
        showToast("该小节未解锁");
      }
      return;
    }

    callAppFc("jumpSection", {
      info: {
        ...info,
        activityUrl: `${origin}${pathname}#/punchDetail/${id}`,
        shareUrl: `${origin}${pathname}#/courseDetail?id=${courseSkuId}`,
        name: courseName,
        id: courseSkuId,
        aiCourseSpuId: courseSpuId,
        hasPaid: 0,
        poster: info.poster ? info.poster : "https://img.luojigou.vip/FnAFqBMhIgE6HaGfMK_EWsPr8uj1",
      },
      sectionIndex: selectedChapterIndex,
      rowIndex: item?.index,
      slideEnable: progressBar,
    });
  } else if (val === "checkinUserNotify") {
    // 切换每日提醒开关
    await checkinUserNotify();
  } else if (val === "withdrawals") {
    // 打卡确认提现弹窗
    showCashback.value = true;
  } else if (val === "goWithdrawals") {
    // 去提现
    callAppFc("goWithdrawals", { activityId: id });
  } else if (val === "confirm") {
    // 验证是否可以提现
    if (typeof id === "string") await applyMyCashback(id);
    showCashback.value = false;
  } else if (val === "lookPunchDetail") {
    // 跳转打卡详情
    await router.push(`/punch/PunchDetail/${id}?fullscreen=true`);
  } else if (val === "returnPrev") {
    // 返回上一页
    callAppFc("popPage", "", () => {
      router.go(-1);
    });
  } else if (val === "goShare") {
    // 去分享
    callAppFc("goShare", {
      poster: poster ? poster : "https://img.luojigou.vip/Fs7E3u-urlRjsoQ-GLdA_nmjOR3c",
      checkinDays: checkinDays * 1 + 1,
      shareUrl: `${origin}${pathname}#/course/CourseDetail?id=${courseSkuId}`,
      activityId: id,
    });
  }
}

onMounted(async () => {
  await getToken();
  await getPunchUserDetail();

  // 返回本页面章节改变
  (window as any).sectionLoad = (val: {
    sectionIndex: number;
    validDurationArray: { lastTime: string }[];
  }) => {
    console.log(val, "sectionLoad");
    try {
      info.chapterList[val.sectionIndex].itemList.forEach((item, index) => {
        if (item.getRecord) item.getRecord.lastTime = val.validDurationArray[index].lastTime;
      });
    } catch (err) {
      console.log(err, "sectionLoad");
    }
  };

  // 返回重新加载
  (window as any).onLoadPage = async () => {
    await getPunchUserDetail();
  };

  // 打卡完成
  (window as any).onFinish = async () => {
    showClockIn.value = true;
    console.log("完成");
    await getPunchUserDetail();
  };

  // 查看打卡详情
  (window as any).lookDetail = () => {
    jumpPage("lookPunchDetail");
  };
});
</script>

<template>
  <div class="pc" :style="{ backgroundImage: `url(${staticImg.bgi})` }">
    <HeaderComponent :info="info" @jumpPage="jumpPage" />

    <!--规则按钮-->
    <div class="pc-rules fc" @click="showRules = true">规则</div>

    <!--打卡规则弹窗-->
    <PunchRules :show="showRules" :rules="info.checkInExplain" @close="showRules = false" />

    <!--课程信息-->
    <CourseInfo :info="info" @jumpPage="jumpPage" />

    <!--章节-->
    <SectionComponent
      :info="info"
      :selectedChapterIndex="selectedChapterIndex"
      @changeIndex="changeIndex"
      @jumpPage="jumpPage"
    />

    <!--分享按钮-->
    <img
      v-if="showShareBtn"
      :src="staticImg.goShare"
      class="pc-goShare"
      alt=""
      @click="jumpPage('goShare')"
    />

    <!--确认提现弹窗-->
    <ConfirmCashback :show="showCashback" @close="showCashback = false" @jumpPage="jumpPage" />

    <!--打卡成功-->
    <ClockInSuccess :show="showClockIn" @close="handleClose" />
  </div>
</template>

<style scoped lang="scss">
::-webkit-scrollbar {
  display: none;
}

.pc {
  padding-bottom: 16px;
  width: 100vw;
  min-height: 100vh;
  background: no-repeat top/contain #fdf0e9;
  box-sizing: border-box;
  overflow: hidden;

  &-rules {
    padding-left: 3px;
    position: absolute;
    top: 118px;
    right: 0;
    width: 47px;
    height: 24px;
    font-size: 12px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #642407;
    background: linear-gradient(180deg, #ffe453 0%, #ffe678 100%);
    border-radius: 60px 0px 0px 60px;
    border: 1px solid #ffffff;
    box-sizing: border-box;
  }

  &-goShare {
    position: fixed;
    bottom: 51px;
    left: 50%;
    transform: translateX(-50%);
    width: 143px;
    height: 50px;
    object-fit: contain;
  }
}
</style>
