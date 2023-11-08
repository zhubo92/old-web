<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import type { IGroupCommodity } from "@/types/group";
import { defaultGroupCommodity } from "@/types/group";

const props = withDefaults(defineProps<{ info: IGroupCommodity }>(), {
  info: () => defaultGroupCommodity(),
});

const courseInfoBGI = "https://app-resources-luojigou.luojigou.vip/Fvm-qETgPpi0JOHnzkwdIIG1Cjkh";
const timer = ref<NodeJS.Timeout | null>(null);
const days = ref("0");
const hours = ref("0");
const minutes = ref("0");
const seconds = ref("0");
const timeStr = ref("距开始仅剩");

const info = computed(() => props.info);

function clearTimer() {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
}

// 计算时间 t时间差
function computeTime(t: number) {
  const _days = parseInt(String(t / (1000 * 60 * 60 * 24)));
  days.value = String(_days);
  const _hours = parseInt(String((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  hours.value = String(_hours > 9 ? _hours : "0" + _hours);
  const _minutes = parseInt(String((t % (1000 * 60 * 60)) / (1000 * 60)));
  minutes.value = String(_minutes > 9 ? _minutes : "0" + _minutes);
  const _seconds = parseInt(String((t % (1000 * 60)) / 1000));
  seconds.value = String(_seconds > 9 ? _seconds : "0" + _seconds);

  // console.log(days, hours, minutes, seconds);
}
function filterTime() {
  clearTimer();

  try {
    const { startTime, endTime } = info.value.groupBuyActivity;
    // const {startTime, endTime} = {
    //   startTime: '2022-08-08 09:11:00',
    //   endTime: '2022-08-08 09:12:00'
    // };

    const st = new Date(startTime).valueOf();
    const et = new Date(endTime).valueOf();
    timer.value = setInterval(() => {
      const now = new Date().valueOf();
      if (now < st) {
        // 未开始
        computeTime(st - now);
        timeStr.value = "距开始仅剩";
      } else if (now > st && now < et) {
        // 进行中
        computeTime(et - now);
        timeStr.value = "距结束仅剩";
      } else if (now > et) {
        // 已结束
        days.value = "0";
        hours.value = "0";
        minutes.value = "0";
        seconds.value = "0";
        clearTimer();
        timeStr.value = "已结束";
      }
    }, 1000);
  } catch (err) {
    console.log(err, "filterTime");
  }
}

filterTime();

onUnmounted(() => {
  clearTimer();
});
</script>

<template>
  <div class="group-info ceshi" :style="{ backgroundImage: `url(${courseInfoBGI})` }">
    <div class="group-info-left">
      <div v-if="info.groupBuyActivity" class="group-info-left-top">
        <div class="group-info-left-top-ap">
          <span>￥</span>{{ info.groupBuyActivity.activityPrice.toFixed(2) }}
        </div>

        <div class="group-info-left-top-cont">{{ info.groupBuyActivity.population }}人拼团价</div>
      </div>
      <div v-if="info.goods" class="group-info-left-bottom">
        <del class="group-info-left-bottom-original">原价：¥{{ info.goods.price.toFixed(2) }}</del>
      </div>
    </div>

    <div class="group-info-right">
      <div class="group-info-right-text">{{ timeStr }}</div>
      <div v-if="timeStr !== '已结束'" class="group-info-right-time">
        <span>{{ days }}</span
        >天 <span>{{ hours }}</span
        >: <span>{{ minutes }}</span
        >:
        <span>{{ seconds }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.group-info {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  margin-top: -23px;
  border-radius: 22px 22px 0px 0px;
  width: 100vw;
  height: 104px;
  //background: linear-gradient(320deg, #FB9868 0%, #FF4D46 100%);
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;

  &-left {
    margin-top: 6px;
    margin-left: 16px;

    &-top {
      display: flex;
      align-items: center;

      &-ap {
        height: 45px;
        font-size: 32px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 45px;

        span {
          height: 30px;
          font-size: 22px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 30px;
        }
      }

      &-cont {
        margin-left: 6px;
        padding: 1px 4px 1px 5px;
        height: 16px;
        font-size: 11px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ff3b3b;
        line-height: 16px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 3px;
      }
    }

    &-bottom {
      margin-top: -3px;
      height: 16px;
      font-size: 11px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 16px;
      opacity: 0.7;
    }
  }

  &-right {
    margin-top: 14px;
    margin-right: 16px;
    text-align: right;

    &-text {
      margin-bottom: 7px;
      height: 17px;
      font-size: 12px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 17px;
    }

    &-time {
      display: flex;
      align-items: center;
      height: 17px;
      font-size: 12px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 550;
      color: #ffffff;
      line-height: 17px;

      span {
        display: block;
        margin: 0 2px;
        width: 18px;
        height: 18px;
        line-height: 18px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: inset 0px 0px 6px 0px rgba(255, 102, 102, 0.2);
        border-radius: 3px;
        font-size: 11px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 500;
        color: #ff5140;
        text-align: center;
        box-sizing: border-box;
      }
    }
  }
}
</style>
