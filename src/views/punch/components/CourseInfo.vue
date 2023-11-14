<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import { showToast, Icon as VanIcon } from "vant";
import dayjs from "dayjs";
import type { IPunchCourse } from "@/types/punch";
import { defaultPunchCourse } from "@/types/punch";

const staticImg = Object.freeze({
  notClockedOut: "https://img.luojigou.vip/FuM5yTtvmMK_p7YkdFesHS9GVqFn",
  topBgi: "https://img.luojigou.vip/FuzNnf6blf29M9fooAZdUbRy17Dw",
  bottomBgi: "https://img.luojigou.vip/FhEUhvquhC3CiHMDlXQGWwseXcnV",
  bottomEndBgi: "https://img.luojigou.vip/FifRxqVDffAorZC0ijJc2UnuKt96",
  goldIcon: "https://img.luojigou.vip/FvcOSljsdHQ4TnAHa2OrKzIe6rJO",
  target: "https://img.luojigou.vip/FrGrst7bwzsS1SzEx1eqtIddz53n",
  targeted: "https://img.luojigou.vip/FscjnVK9eNQ4Kn0gdu96NPvOeqa6",
  calendarIcon: "https://img.luojigou.vip/Fs_Soy3fdYs0Q34kjgY21UItYwoD",
  reached: "https://img.luojigou.vip/Flz9J0DnYIVuetJFeZOUwwTYfL2d",
  notReached: "https://img.luojigou.vip/FpWRfKxtqYQW2Q2nh4nNiYLF5tOt",
  clocked: "https://img.luojigou.vip/Frdg4pyD3QrQ3YsviH93ae7BhBB8",
});

const props = withDefaults(
  defineProps<{
    info: IPunchCourse;
  }>(),
  {
    info: () => defaultPunchCourse(),
  },
);

const emit = defineEmits<{
  (e: "jumpPage", val: string): void;
}>();

const timer = ref<NodeJS.Timeout | null>(null);
const days = ref("0");
const hours = ref("0");
const minutes = ref("0");
const seconds = ref("0");

const info = computed(() => props.info);

// 是否已完成目标
const isTarget = computed(() => {
  return info.value.goalDays <= info.value.checkinDays;
});
// cashbackState 是否可提现 提现情况 0未提现,1提交提现申请,2未通过提现申请,3已通过提现申请,4已提现
const isFinish = computed(() => {
  return info.value && info.value.checkinState === 4;
});
// 活动是否已结束
const isEnd = computed(() => {
  try {
    const { expirationTime } = info.value;
    const t = dayjs(expirationTime).valueOf();
    const now = new Date().valueOf();
    return now > t;
  } catch (err) {
    return false;
  }
  // return info.checkinState === 3 || info.checkinState === 4
});

function jumpPage(val: string) {
  if (val === "withdrawals") {
    if (info.value.checkinState === 4) {
      if (info.value.cashbackState === 0) {
        emit("jumpPage", "withdrawals");
      } else {
        emit("jumpPage", "goWithdrawals");
      }
    } else {
      showToast("完成全部打卡任务才可以去提现");
    }
  } else if (val === "goShare") {
    emit("jumpPage", "goShare");
  }
}
function clearTimer() {
  days.value = "0";
  hours.value = "0";
  minutes.value = "0";
  seconds.value = "0";
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}
function filterTime() {
  clearTimer();
  try {
    // 过期时间
    const { expirationTime } = info.value;

    const t = dayjs(expirationTime).valueOf();

    timer.value = setInterval(() => {
      const now = new Date().valueOf();

      if (now < t) {
        // 进行中

        computeTime(t - now);
      } else {
        // 已结束

        clearTimer();
      }
    }, 1000);
  } catch (err) {
    console.log(err, "filterTime");
  }
}
// 计算时间 t时间差
function computeTime(t: number) {
  // const months = parseInt((t % (1000 * 60 * 60 * 24 * 30 * 12)) / (1000 * 60 * 60 * 24 * 30));
  const _days = parseInt(String(t / (1000 * 60 * 60 * 24)));
  days.value = String(_days);
  const _hours = parseInt(String((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  hours.value = _hours > 9 ? _hours + "" : "0" + _hours;
  const _minutes = parseInt(String((t % (1000 * 60 * 60)) / (1000 * 60)));
  minutes.value = _minutes > 9 ? _minutes + "" : "0" + _minutes;
  const _seconds = parseInt(String((t % (1000 * 60)) / 1000));
  seconds.value = _seconds > 9 ? _seconds + "" : "0" + _seconds;
  // console.log(days, hours, minutes, seconds);
}

watch(info, () => {
  filterTime();
});

onUnmounted(() => {
  clearTimer();
});
</script>

<template>
  <div class="ci">
    <div class="ci-title">
      {{ info.courseName }}
    </div>
    <div class="ci-time">截止时间：{{ info.expirationTime }}</div>
    <!--打卡状态 0-今日未打卡 1-今日已学习未分享 2-今日完成打卡 3-整体未达成 4-整体已达成-->
    <template v-if="info.checkinState === 0">
      <div class="ci-btn fc">
        <img :src="staticImg.notClockedOut" class="notClockedOut" alt="" />
        <div class="text fc">今日未打卡</div>
      </div>
    </template>
    <template v-else-if="info.checkinState === 1">
      <div class="ci-share fc" @click="jumpPage('goShare')">
        分享完成打卡
        <div class="ci-share-shadow shadow1"></div>
        <div class="ci-share-shadow shadow2"></div>
        <div class="ci-share-shadow shadow3"></div>
        <div class="ci-share-shadow shadow4"></div>
        <div class="ci-share-shadow shadow5"></div>
      </div>
    </template>
    <template v-else-if="info.checkinState === 2">
      <div class="ci-btn2 fc">
        <img :src="staticImg.clocked" alt="" />
        <div>今日已打卡</div>
      </div>
    </template>
    <template v-else-if="info.checkinState === 3">
      <img :src="staticImg.notReached" alt="" class="reach" />
    </template>
    <template v-else-if="info.checkinState === 4">
      <img :src="staticImg.reached" alt="" class="reach" />
    </template>
    <div class="ci-progress">
      <!--背景-->
      <img :src="staticImg.topBgi" alt="" class="ci-progress-topBgi" />
      <img v-if="isEnd" :src="staticImg.bottomEndBgi" alt="" class="ci-progress-bottomBgi" />
      <img v-else :src="staticImg.bottomBgi" alt="" class="ci-progress-bottomBgi" />

      <!--活动状态和倒计时-->
      <div v-if="isEnd" class="ci-progress-time fc end">活动已结束</div>
      <div v-else class="ci-progress-time fc">
        <div class="fc">距离结束时间：</div>
        <div class="box fc">{{ days }}</div>
        <div class="fc m2">天</div>
        <div class="box fc">{{ hours }}</div>
        <div class="fc m2">:</div>
        <div class="box fc">{{ minutes }}</div>
        <div class="fc m2">:</div>
        <div class="box fc">{{ seconds }}</div>
      </div>

      <!--进度条-->
      <div class="ci-progress-bar">
        <div
          class="ci-progress-bar-finish"
          :style="{ width: `${(info.checkinDays / info.validDays) * 100}%` }"
        >
          <img :src="staticImg.goldIcon" alt="" />
          <div class="ci-progress-bar-finish-day fc">
            {{ info.checkinDays }}/{{ info.validDays }}天
          </div>
        </div>
        <div
          :class="['ci-progress-bar-target', isTarget && 'targeted']"
          :style="{
            backgroundImage: `url(${isTarget ? staticImg.targeted : staticImg.target})`,
            left: `${(info.goalDays / info.validDays) * 100}%`,
          }"
        >
          <div>打卡目标{{ info.goalDays }}天</div>
        </div>
      </div>

      <div
        :class="['ci-progress-btn fc', isFinish && 'finishBtn']"
        @click="jumpPage('withdrawals')"
      >
        去提现
      </div>
      <div class="ci-progress-bottom fc" @click="emit('jumpPage', 'lookPunchDetail')">
        <img :src="staticImg.calendarIcon" alt="" />
        <div class="fc">查看打卡详情</div>
        <VanIcon class="ci-progress-bottom-back" size="10" name="arrow" color="#FF711A" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ci {
  margin-top: 88px;
  overflow: hidden;

  &-title {
    margin: 0 auto;
    width: 343px;
    height: 28px;
    font-size: 21px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #4a2b14;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-time {
    margin: 6px auto 0;
    width: 343px;
    height: 17px;
    font-size: 15px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #dd7a45;
    line-height: 17px;
  }

  &-btn {
    margin-left: 16px;
    margin-top: 29px;
    margin-bottom: 19px;
    width: 119px;
    height: 42px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 11px;

    .notClockedOut {
      margin-right: 2px;
      width: 16px;
      height: 16px;
      object-fit: contain;
    }

    .text {
      height: 20px;
      font-size: 14px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #f86415;
      line-height: 20px;
    }
  }

  &-share {
    position: relative;
    margin: 28px 0 22px 16px;
    width: 118px;
    height: 42px;
    border-radius: 25px;
    background: linear-gradient(180deg, #fe925e 0%, #ff542e 100%);
    font-size: 14px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #ffffff;

    &-shadow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      border: 1px solid #ff5b34;
    }

    .shadow1 {
      animation: Ani 2s ease-in-out infinite;
    }

    .shadow2 {
      animation: Ani 2s 0.4s ease-in-out infinite;
    }

    .shadow3 {
      animation: Ani 2s 0.8s ease-in-out infinite;
    }

    .shadow4 {
      animation: Ani 2s 1.2s ease-in-out infinite;
    }

    .shadow5 {
      animation: Ani 2s 1.6s ease-in-out infinite;
    }

    @keyframes Ani {
      0% {
        width: 118px;
        height: 42px;
        border-radius: 28px;
        opacity: 0.8;
      }
      50% {
        width: 142px;
        height: 64px;
        border-radius: 32px;
        opacity: 0;
      }

      100% {
        width: 118px;
        height: 42px;
        border-radius: 28px;
        opacity: 0;
      }
    }
  }

  &-btn2 {
    margin-left: 16px;
    margin-top: 29px;
    margin-bottom: 19px;
    width: 119px;
    height: 42px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 11px;

    img {
      margin-right: 2px;
      width: 16px;
      height: 16px;
      object-fit: contain;
    }

    div {
      height: 20px;
      font-size: 14px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #2d6ece;
      line-height: 20px;
    }
  }

  .reach {
    margin-top: 17px;
    margin-left: 38px;
    margin-bottom: 7px;
    width: 77px;
    height: 66px;
    object-fit: contain;
  }

  &-progress {
    position: relative;
    margin: 0 auto;
    width: 375px;
    height: 233px;
    overflow: hidden;

    &-topBgi {
      position: absolute;
      z-index: 1;
      width: 375px;
      height: 233px;
      object-fit: cover;
    }

    &-bottomBgi {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 0;
      width: 340px;
      height: 165px;
      object-fit: cover;
    }

    > div {
      position: relative;
      z-index: 2;
    }

    &-time {
      margin-top: 22px;
      margin-left: 146px;
      justify-content: flex-start;
      height: 16px;
      font-size: 11px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ff711a;
      line-height: 16px;

      .box {
        width: 17px;
        height: 16px;
        background: rgba(255, 255, 255, 0.72);
        border-radius: 3px;
        font-size: 11px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ff5140;
      }

      .m2 {
        margin-left: 2px;
        margin-right: 2px;
      }
    }

    .end {
      margin-left: 201px;
      font-size: 11px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #999999;
    }

    &-bar {
      display: flex;
      align-items: center;
      padding-left: 2px;
      margin: 38px auto 0;
      position: relative;
      width: 291px;
      height: 19px;
      background: rgba(243, 245, 249, 0.3);
      box-shadow: inset 0px 0px 8px 0px rgba(159, 159, 159, 0.2);
      border-radius: 10px;
      box-sizing: border-box;

      &-finish {
        position: relative;
        z-index: 2;
        width: 0;
        height: 15px;
        background: #5c9eff;
        border-radius: 9px;

        img {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(50%, -50%);
          width: 60px;
          height: 60px;
          object-fit: cover;
        }

        &-day {
          position: absolute;
          bottom: -32px;
          right: 0;
          transform: translateX(50%);
          width: 100px;
          height: 17px;
          font-size: 11px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #0b57c7;
          line-height: 17px;
          white-space: normal;
        }
      }

      &-target {
        position: absolute;
        left: 80%;
        top: -29px;
        transform: translateX(-50%);
        width: 80px;
        height: 50px;
        background: no-repeat center/contain;

        div {
          margin-top: 2px;
          width: 100%;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #aaaaaa;
          transform: scale(0.8333333333);
          text-align: center;
        }
      }

      .targeted {
        div {
          color: #ffa14c;
        }
      }
    }

    &-btn {
      margin: 34px auto 0;
      width: 311px;
      height: 42px;
      background: #f0f0f0;
      border-radius: 21px;
      font-size: 16px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #999999;
    }

    .finishBtn {
      color: #ffffff;
      background: #ffa14c;
    }

    &-bottom {
      margin-top: 12px;

      img {
        width: 16px;
        height: 15px;
        object-fit: contain;
      }

      > div {
        margin-left: 1px;
        //margin-right: 3px;
        height: 17px;
        font-size: 12px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ff711a;
        line-height: 17px;
      }
    }
  }
}
</style>
