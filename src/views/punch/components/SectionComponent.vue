<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { IPunchCourse } from "@/types/punch";
import { defaultPunchCourse } from "@/types/punch";
import { Icon as VanIcon } from "vant";
import type { IChapter, IChapterItem } from "@/types/course";

const staticImg = Object.freeze({
  noStudy: "https://img.luojigou.vip/FpvWtjVvq-UuQrEPge-tC_bxExJo",
  studied: "https://img.luojigou.vip/FpHlzAendHU7KCtxk7NiSKZjqreF",
  lock: "https://img.luojigou.vip/FotqZ-fZ47Hh5FW9ilmWzvFoYvWK",
  shadow: "https://img.luojigou.vip/Fu_XCNRe8uyxDT7iziZ-aRaRin8A",
});

const textList = [
  { id: 1, text: "去学习" },
  { id: 2, text: "去分享" },
  { id: 3, text: "完成打卡" },
];

const props = withDefaults(
  defineProps<{
    info: IPunchCourse;
    selectedChapterIndex: number;
  }>(),
  {
    info: () => defaultPunchCourse(),
    selectedChapterIndex: 0,
  },
);

const emit = defineEmits<{
  (e: "jumpPage", val: string, params?: any): void;
  (e: "changeIndex", val: number): void;
}>();

const isStudy = ref(true);
const list = ref<IChapterItem[]>([]);
const showShadow = ref(false);
const itemRef = ref<HTMLElement | null>(null);
const topRef = ref<HTMLElement | null>(null);

const info = computed(() => props.info);
const selectedChapterIndex = computed(() => props.selectedChapterIndex);

const showItemList = computed(() => {
  return info.value && Array.isArray(info.value.chapterList) && info.value.chapterList.length > 0;
});
const showProgressBar = computed(() => {
  return info.value && info.value.checkinState !== 3 && info.value.checkinState !== 4;
});
// 进度条完成百分比
const progressBarWidth = computed(() => {
  if (info.value) {
    switch (info.value.checkinState) {
      case 0:
        return 0;
      case 1:
        return 50;
      case 2:
        return 100;
      default:
        return 0;
    }
  } else {
    return 0;
  }
});
// 章节列表
const chapterList = computed<IChapter[]>(() => {
  return (info.value && info.value.chapterList) || [];
});

watch(
  () => info.value.id,
  (val) => {
    console.log(val, "val");
    isStudy.value = true;
    checkoutFilter();
    if (info.value.id) {
      getShowShadow();
    }
  },
);
watch(selectedChapterIndex, (val) => {
  if (isStudy.value) {
    list.value = chapterList.value[val].itemList.filter((item) => item.watchComplete === 0);
  } else {
    list.value = chapterList.value[val].itemList;
  }
});

// 小节的按钮文字
function filterItemText(index: number, list: IChapterItem[]) {
  if (list[index].watchComplete === 1) {
    return "已完成";
  } else if (list[index].payType === 0) {
    const fIndex = list.findIndex((item) => item.payType === 0);
    if (fIndex === 0) {
      return "待解锁";
    } else if (fIndex === index) {
      return "明天再来";
    } else {
      return "待解锁";
    }
  }

  return "去学习";
}
// 小节的类名
function filterItemClass(item: IChapterItem) {
  if (item.watchComplete === 1) {
    return "sc-section-btn fc";
  } else if (item.payType === 0) {
    return "sc-section-btn fc tomorrow";
  }
  return "sc-section-btn fc goStudy";
}
// 每个小节的学习进度
function filterStudyPercentage(record: IChapterItem) {
  if (record) {
    const duration = (record.video && Math.trunc(Number(record.video.duration))) || 1;

    if (duration === 1) {
      return 0.0;
    }

    const lastTime = (record.getRecord && Math.trunc(Number(record.getRecord.lastTime))) || 0;

    const num = ((lastTime / duration) * 100).toFixed(2);
    return Number(num) > 100 ? "100.00" : num;
  }
  return 0.0;
}
// 进度数样式
function filterPercentageStyle(item: IChapterItem) {
  if (item && item.watchComplete === 1) {
    return "sc-section-left-info-percentage";
  }
  return "sc-section-left-info-percentage general";
}

function getShowShadow() {
  let w = 0;
  setTimeout(() => {
    if (!topRef.value) return;
    for (let i = 0; i < topRef.value.childNodes.length; i++) {
      if ((topRef.value.childNodes[i] as Element).className) {
        if (w === 0) {
          w += 16;
        }
        w += (topRef.value.childNodes[i] as HTMLDivElement).offsetWidth;
        console.log((topRef.value.childNodes[i] as HTMLDivElement).offsetWidth, "class");
      }
    }

    showShadow.value = topRef.value.offsetWidth < w;
  }, 0);
}
function checkoutFilter() {
  // console.log("点了", chapterList.value[selectedChapterIndex.value].itemList, selectedChapterIndex);
  isStudy.value = !isStudy.value;
  if (isStudy.value) {
    list.value = chapterList.value[selectedChapterIndex.value].itemList.filter(
      (item: IChapterItem) => item.watchComplete === 0,
    );
  } else {
    list.value = chapterList.value[selectedChapterIndex.value].itemList;
  }
}
// 获取文字类名
function getTextClass(id: number) {
  if (info.value) {
    const { checkinState } = info.value;
    if (checkinState === 0 && id === 1) {
      // 还未学习 第一个亮
      return "sc-progress-bar-item-text";
    } else if (checkinState === 1) {
      // 打卡未分享 第一个对号 第二个亮
      return "sc-progress-bar-item-text";
    } else if (checkinState === 2) {
      // 已打卡完成 全部对号
      return "sc-progress-bar-item-text";
    }
  }
  return "sc-progress-bar-item-text light";
}
// 是否显示对号
function showIcon(id: number) {
  if (info.value) {
    const { checkinState } = info.value;
    if (checkinState === 1 && id === 1) {
      // 打卡未分享 第一个对号 第二个亮
      return true;
    } else if (checkinState === 2) {
      // 已打卡完成 全部对号
      return true;
    }
  }
  return false;
}
// 获取文字类名
function getProgressBarTextClass(id: number) {
  if (info.value) {
    const { checkinState } = info.value;
    if (checkinState === 0 && id === 1) {
      // 还未学习 第一个亮
      return "sc-progress-bar-item fc now";
    } else if (checkinState === 1) {
      // 打卡未分享 第一个对号 第二个亮
      if (id === 1) {
        return "sc-progress-bar-item fc finish";
      } else if (id === 2) {
        return "sc-progress-bar-item fc now";
      }
    } else if (checkinState === 2) {
      // 已打卡完成 全部对号
      return "sc-progress-bar-item fc finish";
    }
  }
  return "sc-progress-bar-item fc";
}
</script>

<template>
  <div class="sc">
    <div class="sc-top">
      <div class="sc-top-chapter" ref="topRef">
        <div
          v-for="(chapter, chapterIndex) in chapterList"
          :key="chapterIndex"
          ref="itemRef"
          :class="['sc-top-chapter-item', selectedChapterIndex === chapterIndex && 'check']"
          @click="emit('changeIndex', chapterIndex)"
        >
          {{ chapter.name }}
        </div>
      </div>
      <!--筛选按钮-->
      <div class="sc-top-isStudy" @click="checkoutFilter">
        <img v-if="showShadow" :src="staticImg.shadow" alt="" class="shadow" />
        <img :src="isStudy ? staticImg.studied : staticImg.noStudy" class="noStudy" alt="" />
        <div :class="[isStudy && 'yes']">未学完</div>
      </div>
    </div>
    <div class="sc-desc">每日可解锁一节课程，点击进行观看</div>
    <div v-if="showProgressBar" class="sc-progress">
      <div class="sc-progress-bar">
        <!--完成的进度条-->
        <div class="sc-progress-bar-finish" :style="{ width: `${progressBarWidth}%` }"></div>
        <!--进度条上的圆圈和文字-->
        <div v-for="item in textList" :key="item.id" :class="getProgressBarTextClass(item.id)">
          <VanIcon v-if="showIcon(item.id)" name="success" color="#fff" fontSize="12" />
          <div v-else class="sc-progress-bar-item-box"></div>
          <div :class="getTextClass(item.id)">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
    <template v-if="showItemList">
      <div v-for="(item, index) in list" :key="item.id" class="sc-section">
        <div class="sc-section-left">
          <div
            :class="['sc-section-left-cover']"
            :style="{ backgroundImage: `url(${item.imgCover})` }"
          >
            <template v-if="item.payType === 0">
              <img :src="staticImg.lock" alt="" />
              <div class="pay"></div>
            </template>
          </div>
          <div class="sc-section-left-info">
            <div class="sc-section-left-info-title">{{ item.name }}</div>
            <div :class="filterPercentageStyle(item)">已学{{ filterStudyPercentage(item) }}%</div>
          </div>
        </div>
        <div
          :class="filterItemClass(item)"
          @click="emit('jumpPage', 'jumpSection', { item, index, list })"
        >
          {{ filterItemText(index, list) }}
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.sc {
  margin: -5px auto 0;
  padding: 0 16px 16px;
  width: 343px;
  background: #ffffff;
  box-shadow: 0 6px 11px 4px rgba(113, 113, 113, 0.02);
  border-radius: 22px;
  box-sizing: border-box;
  overflow: hidden;

  &-top {
    display: flex;
    align-items: center;
    overflow: hidden;

    &-chapter {
      display: flex;
      align-items: center;
      margin-top: 14px;
      width: 256px;
      overflow: scroll hidden;

      &-item {
        width: fit-content;
        height: 28px;
        font-size: 17px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 28px;
        box-sizing: content-box;
        white-space: nowrap;
      }

      .check {
        font-size: 19px;
        font-weight: 600;
        color: #333333;
      }

      .sc-top-chapter-item + .sc-top-chapter-item {
        margin-left: 16px;
      }
    }

    &-isStudy {
      flex: 1;
      display: flex;
      align-items: center;
      position: relative;
      margin-top: 15px;
      margin-left: 6px;
      //width: 71px;
      height: 39px;
      background: #ffffff;

      div {
        margin-left: 2px;
        //width: 36px;
        width: fit-content;
        height: 17px;
        font-size: 12px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #9d9d9d;
        line-height: 17px;
        white-space: nowrap;
      }

      .shadow {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(calc(-100% - 4px), -50%);
        width: 10px;
        height: 44px;
        opacity: 0.5;
      }

      .noStudy {
        width: 11px;
        height: 11px;
        object-fit: contain;
      }

      .yes {
        height: 17px;
        font-size: 12px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #2368cc;
        line-height: 17px;
        //transform: scale(.8);
      }
    }
  }

  &-desc {
    height: 16px;
    font-size: 11px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #bcbcbc;
    line-height: 16px;
  }

  &-progress {
    display: flex;
    justify-content: center;
    margin-top: 18px;
    width: 311px;
    height: 64px;
    background: rgba(255, 232, 197, 0.28);
    border-radius: 12px;

    &-bar {
      position: relative;
      margin-top: 22px;
      width: 247px;
      height: 5px;
      background: rgba(250, 221, 200, 0.41);
      border-radius: 3px;

      &-finish {
        height: 5px;
        border-radius: 3px;
        background: rgba(255, 105, 25, 0.3);
      }

      &-item {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        background-color: #fdfdfd;
        box-shadow: 0px 2px 12px 0px rgba(187, 187, 187, 0.26);
        border-radius: 50%;
        border: 2px solid #fee3d2;

        &:nth-child(2) {
          left: 0;
        }

        &:nth-child(3) {
          left: 50%;
        }

        &:nth-child(4) {
          left: 100%;
        }

        &-box {
          width: 10px;
          height: 10px;
          background: #fcdec9;
          border-radius: 50%;
          box-shadow: 0px 2px 12px 0px rgba(187, 187, 187, 0.26);
        }

        &-text {
          position: absolute;
          bottom: -24px;
          left: 50%;
          height: 17px;
          font-size: 11px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 600;
          color: #f86415;
          line-height: 17px;
          white-space: nowrap;
          transform: scale(0.9) translateX(-50%);
        }

        .light {
          color: #ff8c48;
        }
      }

      .now {
        background-color: #faddc8;

        .sc-progress-bar-item-box {
          background: #f86415;
          box-shadow: 0px 2px 12px 0px rgba(187, 187, 187, 0.26);
        }
      }

      .finish {
        width: 22px;
        height: 22px;
        background: #f86415;
        border: 2px solid #fadcc9;
      }
    }
  }

  &-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;

    &-left {
      display: flex;
      align-items: center;

      &-cover {
        position: relative;
        width: 75px;
        height: 42px;
        background: no-repeat center/cover;
        border-radius: 6px;
        overflow: hidden;

        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
          width: 13px;
          height: 12px;
          object-fit: contain;
        }

        .pay {
          width: 100%;
          height: 100%;
          background: #000000;
          opacity: 0.4;
        }
      }

      &-info {
        margin-left: 14px;

        &-title {
          width: 150px;
          height: 20px;
          font-size: 14px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &-percentage {
          margin-top: 5px;
          height: 17px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #ff8c48;
          line-height: 17px;
        }

        .general {
          font-weight: 400;
          color: #999;
        }
      }
    }

    &-btn {
      width: 64px;
      height: 26px;
      border-radius: 13px;
      border: 1px solid #ffa14c;
      font-size: 12px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffa14c;
    }

    .tomorrow {
      width: 64px;
      height: 26px;
      font-size: 12px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #8ab0e5;
      background: #f1faff;
      border-radius: 13px;
      border-color: #f1faff;
    }

    .goStudy {
      width: 64px;
      height: 26px;
      background: #2d6ece;
      border-radius: 13px;
      font-size: 12px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffffff;
      border-color: #2d6ece;
    }
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
