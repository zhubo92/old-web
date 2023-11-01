<script setup lang="ts">
// 正在播放按钮
import JumpApplets from "@/views/course/components/JumpApplets.vue";
import type { IChapter, IChapterItem, IChapterItemVideo } from "@/types/course";
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";
import { callAppFc, isWeixinBrowser, registerWxOpenLaunchApp } from "@/utils";
import { showToast } from "vant";
import { getCWXSignature } from "@/api/user";

const luojigouCourseSkuIdList = [
  "1568062284888866817",
  "1580445037357817858",
  "1592331295190867970",
  "1595230810675847170",
  "1599591971714146305",
  "1602510250959097857",
  "1607256790802026498",
];

const playBtn = "https://app-resources-luojigou.luojigou.vip/FlBIkfEQXZvqBGTZYD2lwM_NFXbt";
// 已暂停按钮
const pauseBtn = "https://app-resources-luojigou.luojigou.vip/FlKCVvmUNymUXFn-MKk2galzf9WV";
// 未解锁按钮
const notUnlockedBtn = "https://app-resources-luojigou.luojigou.vip/FhqmzcLJAq9qtjR5nCdMKBdePQ-v";
// 未解锁按钮2
const notUnlockedBtn2 = "https://app-resources-luojigou.luojigou.vip/FuhGfcTY1zJjoOvEMszqQFlTXhVM";
// 练一练
const practice = "https://app-resources-luojigou.luojigou.vip/FjONELpanlJjuAaIMZkO-vudduD6";
// 不能练一练
const noPractice = "https://app-resources-luojigou.luojigou.vip/Ft6O3xstCti6HUvkBM7jAwkGuiU3";

const { mode, id } = useRoute().query;

const { loading } = storeToRefs(useAppStore());

const props = withDefaults(
  defineProps<{
    chapterList: IChapter[];
    unlock: boolean;
    showChapter: number;
  }>(),
  {
    chapterList: () => [],
    unlock: false,
    showChapter: 0,
  },
);

const emit = defineEmits<{
  (e: "try", video: IChapterItemVideo, item: IChapterItem): void;
}>();

const isApp = !isWeixinBrowser();

const showChapter = computed(() => {
  return props.showChapter;
});

const chapterList = computed(() => {
  return props.chapterList;
});

const unlock = computed(() => {
  return props.unlock;
});

const isLuojigou = computed(() => {
  try {
    return (
      (mode && mode === "luojigou") ||
      luojigouCourseSkuIdList.findIndex((item) => item === id) !== -1
    );
  } catch (err) {
    console.error(err);
    return false;
  }
});

function filterDuration(video: any) {
  if (!video) return "";
  try {
    let s = Math.floor(video.duration * 1);
    let m = Math.floor(s / 60);
    s -= 60 * m;
    return m > 0 ? m + "分钟" + s + "秒" : s + "秒";
  } catch (err) {
    console.log(err, "filterDuration");
    return "";
  }
}

// 试看
function handleTry(record: IChapterItem) {
  if (!isLuojigou.value) {
    console.log(record, "handleTry");
    if (record.payType === 1) {
      emit("try", record.video, record);
    } else {
      showToast("该课程需要解锁后才能观看哦~");
    }
  }
}
// 在app中开启关闭全屏状态
function setFullScreen(state = false) {
  callAppFc("setFullScreen", { enable: state });
}
function config() {
  registerWxOpenLaunchApp(() => {}, getCWXSignature);
}
function jumpGame(path: string) {
  if (isApp) {
    const token = window.sessionStorage.getItem("token");
    if (token) window.localStorage.setItem("token", token);
  }
  setFullScreen(true);
  const url = path + `&id=${id}`;
  const length = history.length;
  if (length > 1) {
    location.href = url;
  } else {
    location.replace(url);
  }
}

onMounted(() => {
  loading.value = true;
  setFullScreen();
  loading.value = false;
});

onUnmounted(() => {});
</script>

<template>
  <div class="directory">
    <div v-for="chapter in chapterList" :key="chapter.id" class="chapterList">
      <div v-if="showChapter === 1" class="chapterListTitle">{{ chapter.name }}</div>
      <div
        v-for="item in chapter.itemList"
        :key="item.id"
        class="chapterItem"
        @click="handleTry(item)"
      >
        <div class="info">
          <div class="info-top">
            <div
              :class="[
                'info-top-title',
                (unlock || isLuojigou) && 'title2',
                !isLuojigou && item.payType === 0 && 'w300',
              ]"
            >
              {{ item.name }}
            </div>
            <div v-if="!isLuojigou && item.payType === 1" class="info-top-try fc">试看</div>
          </div>
          <div v-if="!isLuojigou && item.payType === 1" class="time">
            {{ filterDuration(item.video) }}
          </div>
        </div>
        <!--逻辑狗课程-->
        <template v-if="isLuojigou">
          <div v-if="!item.isLock" class="chapter-item-btns">
            <!--<div class="chapter-item-btn">-->
            <!--  <img :src="item.isLock ? practice : noPractice" alt="" class="chapter-item-btn-img">-->
            <!--  <span :class="['chapter-item-btn-text', !item.isLock && 'grey']">练一练</span>-->
            <!--</div>-->
            <!--跳转到小程序-->
            <JumpApplets
              :quesId="item.bankId"
              :semesterLeveCode="item.semesterLeveCode"
              :isFinish="item.isFinish"
            />

            <div class="chapter-item-btn" @click="jumpGame(item.gameAddress)">
              <img :src="pauseBtn" alt="" class="chapter-item-btn-img" />
              <span class="chapter-item-btn-text blue"></span>
            </div>
          </div>
          <div v-else class="btn">
            <!--<div class="btn-label">9.11 19:00 周二开课</div>-->
            <!--<div class="btn-label">{{ item.unLockTime }}开课</div>-->
            <img :src="notUnlockedBtn2" alt="" />
            <!--          <span>试看</span>-->
          </div>
        </template>
        <!--普通课程-->
        <div v-else class="btn">
          <img :src="item.payType === 0 ? notUnlockedBtn : pauseBtn" alt="" />
          <span v-if="item.payType === 1">试看</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.directory {
  padding: 0 16px;

  .chapterList {
    .chapterListTitle {
      display: block;
      margin: 0 auto;
      width: 343px;
      height: 58px;
      font-size: 20px;
      font-family: "YouSheBiaoTiHei";
      color: #333333;
      line-height: 58px;
      border-bottom: 1px solid #eee;
    }

    .chapterItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 83px;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      overflow: hidden;

      .info {
        &-top {
          display: flex;
          align-items: center;
          margin-bottom: 7px;

          &-title {
            max-width: 260px;
            height: 24px;
            font-size: 17px;
            font-family:
              PingFangSC-Medium,
              PingFang SC;
            font-weight: 550;
            color: #333333;
            line-height: 24px;
            overflow: hidden;
            /*文本不会换行*/
            white-space: nowrap;
            /*当文本溢出包含元素时，以省略号表示超出的文本*/
            text-overflow: ellipsis;
          }

          .w300 {
            max-width: 300px;
          }

          &-try {
            width: 39px;
            height: 18px;
            font-size: 11px;
            font-family:
              PingFangSC-Medium,
              PingFang SC;
            font-weight: 500;
            color: #ffffff;
            background: linear-gradient(279deg, #ff9055 0%, #ffb856 100%);
            border-radius: 9px;
          }
        }

        .title2 {
          width: 200px;
        }

        .time {
          height: 20px;
          font-size: 14px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
        }
      }

      .chapter-item-btns {
        display: flex;
        align-items: center;
        margin-right: 8px;

        .chapter-item-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-left: 24px;

          &-img {
            margin-bottom: 3px;
            display: block;
            width: 27px;
            height: 27px;
            object-fit: cover;
          }

          &-text {
            height: 14px;
            font-size: 10px;
            font-family:
              PingFangSC-Regular,
              PingFang SC;
            font-weight: 400;
            color: #fa6400;
            line-height: 14px;
          }

          .grey {
            color: #999;
          }

          .blue {
            color: #0b57c7;
          }
        }
      }

      .btn {
        display: flex;
        flex-direction: column;
        align-items: center;

        &-label {
          display: flex;
          justify-content: center;
          align-items: center;
          //width: 70px;
          padding: 0 5px;
          height: 18px;
          line-height: 18px;
          font-size: 10px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #ffffff;
          background: #ff7422;
          border-radius: 9px 9px 2px 9px;
          box-sizing: content-box;
        }

        img {
          margin-bottom: 1px;
          display: block;
          width: 27px;
          height: 27px;
        }

        span {
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #0b57c7;
        }
      }
    }
  }
}
</style>
