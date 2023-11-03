<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { ICourseDetail } from "@/types/course";
import { defaultCourseDetail } from "@/types/course";
import { showToast } from "vant";
import { buried } from "@/utils";
import { useRoute } from "vue-router";

const listOpen = "https://app-resources-luojigou.luojigou.vip/Fplo_QxlOwllT2rywvZ1dyESXDsm";
const listClose = "https://app-resources-luojigou.luojigou.vip/Fh6_khVE5ejOLMnft-zJvnVyt0l2";
const itemClose = "https://app-resources-luojigou.luojigou.vip/Fltu8sGhIvxODm-RypvrBwNLUDbg";
const unlocked = "https://app-resources-luojigou.luojigou.vip/FuV4yQDQWNw-VtdKSND0z_-DjGkv";
const player = "https://app-resources-luojigou.luojigou.vip/Fru7m_laXGG254zkCHWKnD8A5oc0";
const timer = "https://app-resources-luojigou.luojigou.vip/Fo88fyhKp7_y3rEhXCEzeyIx6ptv";

const route = useRoute();

const props = withDefaults(
  defineProps<{
    storyList: any[];
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
  () => storyList,
  (val) => {
    listData.value = val.value;
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
        title: this.title,
        url: record.audio.audioUrl,
        imgCover: record.imgCover,
      }),
    );
    this.$router.push("/tryPlay");
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

<style scoped lang="scss"></style>
