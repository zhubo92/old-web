<script setup lang="ts">
import { showToast } from "vant";
import { defaultGroupCourse } from "@/types/group";
import type { IGroupCourse } from "@/types/group";
import type { IChapter, IChapterItem, IChapterItemVideo } from "@/types/course";
import { computed } from "vue";

// 已暂停按钮
const pauseBtn = "https://app-resources-luojigou.luojigou.vip/FlKCVvmUNymUXFn-MKk2galzf9WV";
// 未解锁按钮
const notUnlockedBtn = "https://app-resources-luojigou.luojigou.vip/FhqmzcLJAq9qtjR5nCdMKBdePQ-v";

const emit = defineEmits<{
  (e: "try", url: IChapterItemVideo | any, record: IChapterItem, type?: string): void;
}>();

const props = withDefaults(
  defineProps<{
    info: IGroupCourse;
    chapterList: IChapter[];
    showChapter?: number;
  }>(),
  { info: () => defaultGroupCourse(), chapterList: () => [], showChapter: 0 },
);

const info = computed(() => props.info);
const chapterList = computed(() => props.chapterList);
const showChapter = computed(() => props.showChapter);
function filterDuration(s: string | number) {
  s = Math.floor(Number(s));

  let m = Math.floor(s / 60);

  s -= 60 * m;

  return m > 0 ? m + "分钟" + s + "秒" : s + "秒";
}

// 试看
function handleTry(record: IChapterItem) {
  console.log(record, "handleTry");
  if (record.payType === 1) {
    if (record.video) {
      emit("try", record.video, record);
    } else {
      emit("try", record.audio, record, "audio");
    }
  } else {
    showToast("该课程需要解锁后才能观看哦~");
  }
}
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
            <div class="info-top-title">{{ item.name }}</div>
            <div v-if="item.payType === 1" class="info-top-try fc">
              {{ info && info.mediaType === 1 ? "试听" : "试看" }}
            </div>
          </div>
          <div v-if="item.video && item.video.duration" class="time">
            {{ filterDuration(item.video.duration) }}
          </div>
        </div>
        <div class="btn">
          <img :src="item.payType === 0 ? notUnlockedBtn : pauseBtn" alt="" />
          <span v-if="item.payType === 1">{{
            info && info.mediaType === 1 ? "试听" : "试看"
          }}</span>
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

      .btn {
        display: flex;
        flex-direction: column;
        align-items: center;

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
