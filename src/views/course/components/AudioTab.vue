<script setup lang="ts">
import { computed } from "vue";

const taList = [
  {
    id: 0,
    title: "详情",
  },
  {
    id: 1,
    title: "故事",
  },
];

const horizontalBar = "https://app-resources-luojigou.luojigou.vip/Fl9m2Rzx607MLfhoLl1D61VkYGv9";
const greenBar = "https://app-resources-luojigou.luojigou.vip/FiTaQnTOa55c4jH-ITw9A6fJXOc4";

const props = defineProps<{
  tabId: number;
  fixed?: boolean;
  num?: number;
}>();

const emit = defineEmits<{
  (e: "toggleTab", id: number): void;
}>();

const tabId = computed(() => props.tabId);
const fixed = computed(() => props.fixed);
const num = computed(() => props.num);
</script>

<template>
  <div :class="['audioTab', fixed ? 'fixed' : '']">
    <div class="container">
      <img :src="horizontalBar" class="horizontalBar" alt="" />
      <div class="content">
        <div
          v-for="item in taList"
          :key="item.id"
          :class="['tabItem', tabId === item.id ? 'checked' : '']"
          @click="emit('toggleTab', item.id)"
        >
          <div class="tabItem-container">
            <div class="title">{{ item.title }}{{ num && item.id === 1 ? `(${num})` : "" }}</div>
            <!--<img :src="greenBar" class="greenBar" alt=""/>-->
            <div class="bar"></div>
          </div>

          <div v-if="item.id === 1" class="try fc">试听</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.audioTab {
  width: 100vw;
  height: 62px;
  background-color: #41944e;

  .container {
    position: relative;
    padding-left: 17px;
    padding-right: 18px;
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 20px 20px 0 0;
    box-shadow: 0px -3px 10px 0px #1d812e;

    .horizontalBar {
      position: absolute;
      top: 7px;
      left: 50%;
      display: block;
      width: 42px;
      height: 7px;
      object-fit: cover;
      transform: translateX(-50%);
    }

    .content {
      display: flex;
      align-items: center;
      height: 100%;
      border-bottom: 1px solid #f6f6f6;

      .tabItem {
        position: relative;
        padding-top: 9px;
        height: 100%;
        box-sizing: border-box;

        &-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;

          .title {
            height: 22px;
            font-size: 14px;
            font-family:
              PingFangSC-Regular,
              PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 22px;
          }

          .bar {
            display: none;
            position: absolute;
            bottom: 3px;
            //margin-top: 6px;
            width: 17px;
            height: 2px;
            box-shadow: 0px 1px 3px 0px rgba(88, 215, 106, 0.5);
            background-color: #0b57c7;
            border-radius: 10px;
          }
        }

        .try {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(15px, -40%);
          width: 38px;
          height: 18px;
          background: #ffe0cc;
          border-radius: 9px 9px 9px 2px;
          font-size: 11px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #ff7422;
        }
      }

      .tabItem + .tabItem {
        margin-left: 43px;
      }

      .checked {
        .title {
          font-size: 18px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 550;
          color: #333333;
        }

        .bar {
          display: block;
        }

        .try {
          transform: translate(20px, -40%);
        }
      }
    }
  }
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #fff;

  .container {
    box-shadow: none;
  }
}
</style>
