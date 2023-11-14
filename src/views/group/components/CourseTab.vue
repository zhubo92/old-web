<script setup lang="ts">
import type { IGroupCourse } from "@/types/group";
import { computed } from "vue";
import { defaultGroupCourse } from "@/types/group";
import { isWeixinBrowser } from "@/utils";

const tabList = [
  {
    id: 0,
    title: "详情",
  },
  {
    id: 1,
    title: "目录",
  },
  // {
  //   id: 2,
  //   title: '评价',
  // },
];

const dotsLogo = "https://app-resources-luojigou.luojigou.vip/FhXozxYfBJ8skg4tcMMy5N3DvEPu";

const isApp = !isWeixinBrowser();

const emit = defineEmits<{
  (e: "toggleTab", id: number): void;
}>();

const props = withDefaults(
  defineProps<{
    tabId: number;
    tabPosition?: string;
    tabDistance?: number;
    info?: IGroupCourse;
  }>(),
  {
    tabId: 0,
    tabPosition: "",
    tabDistance: 0,
    info: () => defaultGroupCourse(),
  },
);

const tabId = computed(() => props.tabId);
const tabPosition = computed(() => props.tabPosition);
const tabDistance = computed(() => props.tabDistance);
const info = computed(() => props.info);
</script>

<template>
  <div
    :class="['tab', tabPosition === 'top' ? 'tabPositionTop' : '']"
    :style="{ top: `${tabPosition === 'top' && isApp ? tabDistance : 0}px` }"
    ref="tab"
    id="tab"
  >
    <div
      v-for="item in tabList"
      :key="item.id"
      :class="['tab-item', tabId === item.id ? 'checked' : '']"
      @click="emit('toggleTab', item.id)"
    >
      <div v-if="item.id === 1" class="try-look">
        {{ info && info.mediaType === 1 ? "试听" : "试看" }}
      </div>
      {{ item.title }}
      <!--<div class="dots"></div>-->
      <!--选中底标-->
      <img :src="dotsLogo" alt="" class="dotsLogo" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab {
  display: flex;
  justify-content: space-around;
  align-items: center;
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
    padding-top: 16px;
    height: 58px;
    font-size: 16px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #999999;

    .try-look {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 5px;
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

    //.dots {
    //  margin-top: 6px;
    //  width: 18px;
    //  height: 3px;
    //  border-radius: 3px;
    //}

    .dotsLogo {
      display: none;
    }
  }

  .checked {
    font-weight: 550;
    color: #333333;

    .dots {
      background: #0b57c7;
    }

    .dotsLogo {
      display: block;
      margin-top: 2px;
      width: 14px;
      height: 5px;
    }
  }
}

.tabPositionTop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
}

.isApp {
  top: 44px;
}
</style>
