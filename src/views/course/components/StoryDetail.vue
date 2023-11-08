<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { IChapter, ICourseDetail } from "@/types/course";
import { defaultCourseDetail } from "@/types/course";
import { showToast } from "vant";
import { buried } from "@/utils";
import { useRoute, useRouter } from "vue-router";

const listOpen = "https://app-resources-luojigou.luojigou.vip/Fplo_QxlOwllT2rywvZ1dyESXDsm";
const listClose = "https://app-resources-luojigou.luojigou.vip/Fh6_khVE5ejOLMnft-zJvnVyt0l2";
const itemClose = "https://app-resources-luojigou.luojigou.vip/Fltu8sGhIvxODm-RypvrBwNLUDbg";
const unlocked = "https://app-resources-luojigou.luojigou.vip/FuV4yQDQWNw-VtdKSND0z_-DjGkv";
const player = "https://app-resources-luojigou.luojigou.vip/Fru7m_laXGG254zkCHWKnD8A5oc0";
const timer = "https://app-resources-luojigou.luojigou.vip/Fo88fyhKp7_y3rEhXCEzeyIx6ptv";

const route = useRoute();
const router = useRouter();

const props = withDefaults(
  defineProps<{
    storyList: IChapter[];
    title: string;
    info: ICourseDetail;
  }>(),
  {
    list: [],
    title: "",
    info: () => defaultCourseDetail(),
  },
);

const listData = ref<any[]>([]);

const storyList = computed(() => props.storyList);
const title = computed(() => props.title);
const info = computed(() => props.info);

watch(
  () => storyList.value.length,
  () => {
    listData.value = storyList.value;
    listData.value.forEach((item) => {
      item.isOpen = true;
    });
  },
);

function filterTime(val: any) {
  if (!val.audio || !val.audio.duration) return "0";
  let s = val.audio.duration;
  s = Math.floor(s * 1);

  let m = Math.floor(s / 60);

  s -= 60 * m;

  return m > 0 ? m + ":" + s : s + "秒";
}

function handleTry(record: any) {
  if (record.payType === 0) {
    // 未解锁，不可以试听
    showToast("该课程需要解锁后才能观看哦~");
  } else {
    // 可以试听
    buried("clickTryListenBtn", { ...info.value, ...record, ...route.query });
    window.sessionStorage.setItem(
      "audio",
      JSON.stringify({
        name: record.name,
        title: title.value,
        url: record.audio.audioUrl,
        imgCover: record.imgCover,
      }),
    );
    router.push("/course/TryListen");
  }
}
function toggleOpen(val: any) {
  val.isOpen = !val.isOpen;
}
</script>

<template>
  <div class="story">
    <div v-for="list in listData" :key="list.id" class="story-List">
      <div class="story-List-content" @click="toggleOpen(list)">
        <div class="story-List-content-title">{{ list.name }}</div>
        <img v-if="list.isOpen" :src="listOpen" class="listOpen" alt="" />
        <img v-else :src="listClose" class="listClose" alt="" />
      </div>

      <div v-if="list.isOpen">
        <div
          v-for="item in list.itemList"
          :key="item.id"
          class="story-item"
          @click="handleTry(item)"
        >
          <div
            class="story-item-img"
            :style="{
              backgroundImage: `url(${item.imgCover})`,
            }"
          >
            <div v-if="item.payType === 0">
              <span class="story-item-img-shadow"></span>
              <img :src="unlocked" class="unlocked" alt="" />
            </div>
          </div>

          <div class="story-item-info">
            <div class="story-item-info-top">
              <div class="story-item-info-top-title">{{ item.name }}</div>
              <div v-if="item.payType === 1" class="story-item-info-top-try fc">试听</div>
            </div>
            <div v-if="item.payType === 1" class="story-item-info-bottom">
              <div class="story-item-info-bottom-player">
                <img :src="player" alt="" />
                <span>{{ item.readCount }}</span>
              </div>
              <div class="story-item-info-bottom-player">
                <img :src="timer" alt="" />
                <span>{{ filterTime(item) }}</span>
              </div>
            </div>
          </div>

          <img :src="itemClose" class="story-item-open" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.story {
  padding-top: 10px;
  //padding-bottom: 200px;
  background-color: #fff;
  overflow: hidden;

  &-List {
    margin: 0 auto 8px;
    width: 343px;
    background: rgba(246, 246, 246, 0.4);
    border-radius: 0px 0px 10px 10px;

    &-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      width: 343px;
      height: 65px;
      background: #ffffff;
      box-shadow: 0px 1px 4px 0px rgba(181, 194, 201, 0.26);
      border-radius: 10px;

      &-title {
        margin-left: 18px;
        width: 260px;
        height: 20px;
        font-size: 14px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 550;
        color: #333333;
        line-height: 20px;
        overflow: hidden;
        /*文本不会换行*/
        white-space: nowrap;
        /*当文本溢出包含元素时，以省略号表示超出的文本*/
        text-overflow: ellipsis;
      }

      .listOpen {
        margin-right: 20px;
        display: block;
        width: 16px;
        height: 9px;
        object-fit: cover;
      }

      .listClose {
        margin-right: 20px;
        display: block;
        width: 9px;
        height: 16px;
        object-fit: cover;
      }
    }

    .story-item {
      display: flex;
      align-items: center;
      position: relative;
      margin-left: 12px;
      margin-bottom: 10px;

      &-img {
        margin-right: 17px;
        position: relative;
        width: 98px;
        height: 80px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        border-radius: 10px;
        overflow: hidden;

        &-shadow {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
        }

        .unlocked {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 3;
          display: block;
          width: 23px;
          height: 29px;
          object-fit: cover;
          transform: translate(-50%, -50%);
        }
      }

      &-info {
        padding-top: 4px;
        height: 80px;
        border-bottom: 1px solid #f6f6f6;
        box-sizing: border-box;

        &-top {
          display: flex;
          align-items: center;
          margin-bottom: 16px;

          &-title {
            margin-right: 5px;
            max-width: 150px;
            height: 22px;
            font-size: 16px;
            font-family:
              PingFangSC-Medium,
              PingFang SC;
            font-weight: 550;
            color: #333333;
            line-height: 22px;
            white-space: nowrap;
            overflow: hidden;
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

        &-bottom {
          display: flex;
          align-items: center;

          &-player {
            display: flex;
            align-items: center;

            img {
              margin-right: 2px;
              display: block;
              width: 13px;
              height: 13px;
              object-fit: cover;
            }

            span {
              height: 17px;
              font-size: 12px;
              font-family:
                PingFangSC-Regular,
                PingFang SC;
              font-weight: 400;
              color: #bdbdbd;
              line-height: 17px;
            }
          }

          .story-item-info-bottom-player + .story-item-info-bottom-player {
            margin-left: 14px;
          }
        }
      }

      &-open {
        position: absolute;
        right: 13px;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        width: 7px;
        height: 11px;
        object-fit: cover;
      }
    }
  }
}
</style>
