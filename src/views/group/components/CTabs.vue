<script setup lang="ts">
import { computed, ref } from "vue";
import { getImageUrl } from "@/utils";

const emit = defineEmits<{
  (e: "change", record: any): void;
}>();

const props = withDefaults(
  defineProps<{
    tabs: any[];
    height?: string;
    bgColor?: string;
    activeColor?: string;
    unactiveColor?: string;
  }>(),
  {
    tabs: () => [],
    height: "66px",
    bgColor: "#fff",
    activeColor: "#000",
    unactiveColor: "#000",
  },
);

const active = ref("");

const tabs = computed(() => {
  return props.tabs;
});

function changeTab(record: any) {
  emit("change", record);
  active.value = record.value;
}

active.value = tabs.value[0].value;
</script>

<template>
  <div class="tabs" :style="{ height: height, background: bgColor }">
    <div
      :class="['tab', item.value === active ? 'tab-active' : '']"
      v-for="(item, index) in tabs"
      :key="index"
      @click="changeTab(item)"
    >
      <div class="label-box">
        <div class="label" :style="{ color: active == item.value ? activeColor : unactiveColor }">
          {{ item.name }}
        </div>
        <img v-show="item.value === active" :src="getImageUrl('coupon-tabs-flag')" alt="" />
      </div>
      <div v-if="item.count">({{ item.count }})</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  width: 100%;
  padding: 0 86px;
  box-sizing: border-box;
  height: 66px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  // background-color: #fff;
  .tab {
    font-size: 15px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #999999;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .label-box {
      position: relative;
    }
    img {
      width: 14px;
      height: 6px;
      margin-top: 5px;
      display: block;
      position: absolute;
      left: 50%;
      bottom: -6px;
      transform: translateX(-50%);
    }
  }
  .tab-active {
    font-size: 15px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #333333;
  }
}
</style>
