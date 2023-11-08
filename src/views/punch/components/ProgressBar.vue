<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    detail: any;
  }>(),
  {
    detail: () => {},
  },
);

const detail = computed(() => props.detail);
</script>

<template>
  <div class="pb">
    <div class="pb-top">
      <div class="pb-top-text">累计打卡</div>
      <div class="pb-top-day">
        <div>{{ detail.checkinDays }}</div>
        <div>天</div>
        /{{ detail.totalItemNum }}天
      </div>
    </div>
    <div class="pb-con">
      <div
        class="pb-con-finish"
        :style="{ width: `${(detail.checkinDays / detail.totalItemNum) * 100}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pb {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  margin-top: 88px;
  box-sizing: border-box;

  &-top {
    display: flex;
    justify-content: space-between;
    width: 343px;

    &-text {
      margin-top: 7px;
      height: 17px;
      font-size: 16px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 550;
      color: #3b1d1d;
      line-height: 17px;
    }

    &-day {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      font-size: 15px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #666666;

      div:nth-child(1) {
        height: 28px;
        font-size: 30px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 28px;
      }

      div:nth-child(2) {
        font-size: 15px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 600;
        color: #333333;
      }
    }
  }

  &-con {
    display: flex;
    align-items: center;
    margin-top: 16px;
    width: 343px;
    height: 18px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 9px;

    &-finish {
      height: 18px;
      background: #5c9eff;
      border-radius: 9px;
    }
  }
}
</style>
