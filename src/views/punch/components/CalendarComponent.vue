<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { defaultPunchDetail } from "@/types/punch";
import type { IPunchDetail } from "@/types/punch";
import moment from "moment";
import type { SwipeInstance } from "vant";
import { Swipe as VanSwipe, SwipeItem as VanSwipeItem, Icon as VanIcon } from "vant";

interface IDay {
  isMonth: boolean;
  day: number;
  date: string;
  state: number;
  isStart: boolean;
  isToday: boolean;
}

const weekList = [
  { id: 0, name: "日" },
  { id: 1, name: "一" },
  { id: 2, name: "二" },
  { id: 3, name: "三" },
  { id: 4, name: "四" },
  { id: 5, name: "五" },
  { id: 6, name: "六" },
];

const props = withDefaults(
  defineProps<{
    detail: IPunchDetail;
  }>(),
  {
    detail: () => defaultPunchDetail(),
  },
);

const list = ref<IDay[][][]>([]);
const offsetHeight = ref(0);
const year = ref("");
const month = ref("");
const todayMonthIndex = ref(0);
const todayWeekIndex = ref(-1);
const todayIndex = ref(-1);
const selectedIndex = ref(0);
const isExpand = ref(true);
const weekHeight = ref(0);
const contentRef = ref<HTMLElement | null>(null);
const swiperRef = ref<SwipeInstance | null>(null);

const detail = computed(() => props.detail);

watch(
  () => detail.value.date,
  (val) => {
    if (val) init();
  },
);

function getTime(time: string) {
  return new Date(time).getTime();
}

function filterList() {
  if (!isExpand.value && todayMonthIndex.value === selectedIndex.value) {
    console.log("测试", list);
    return list.value.map((month) => {
      return month.filter((week: IDay[], weekIndex: number) => weekIndex === todayWeekIndex.value);
    });
  } else {
    return list.value;
  }
}

function filterDayClass(day: IDay) {
  // console.log(day, "filterDayClass");
  let className = "cd-con-week-day";

  if (day.state === 1) {
    className += " yes";
  } else if (day.state === 0) {
    className += " no";
  }

  if (day.isStart) {
    className += " start";
  }

  if (!day.isMonth) {
    if (isExpand.value) {
      className += " noMonth";
    } else {
      className += " noMonth2";
    }
  }

  if (day.isToday) {
    className += " today";
  }

  return className;
}
// 初始化
function init() {
  const { checkinList, startTime, endTime } = detail.value;
  // 开始时间所在年份月份
  const sy = startTime.split(" ")[0].split("-")[0];
  const sm = startTime.split(" ")[0].split("-")[1];
  const ey = endTime.split(" ")[0].split("-")[0];
  const em = endTime.split(" ")[0].split("-")[1];

  // console.log(sy, sm, ey, em, "测试");

  year.value = sy;
  month.value = sm;

  // 计算涉及到哪几个月份
  getYearAndMonth(`${sy}-${sm}`, `${ey}-${em}`).map((item) => {
    const { year: y, month: m } = item;
    // console.log(y, m, "测试");
    list.value.push(getMonthMatrix({ year: y, month: m }));
  });

  // console.log(list.value, "list23123123");

  const st = getTime(startTime.split(" ")[0]);

  const t = getTime(endTime.split(" ")[0]);
  const n = new Date().getTime();

  const et = t < n ? t : n;
  const monthList = checkinList.map((item) => item);

  const nowTime = moment(new Date().getTime()).format("YYYY-MM-DD");

  list.value.forEach((month, monthIndex) => {
    month.forEach((week: IDay[], weekIndex: number) => {
      week.forEach((day: IDay, dayIndex: number) => {
        const dt = getTime(day.date);

        // console.log(dt, "dt", day.date);

        if (dt === st) {
          list.value[monthIndex][weekIndex][dayIndex].isStart = true;
        }

        if (dt >= st && dt <= et) {
          list.value[monthIndex][weekIndex][dayIndex].state = 0;
        }

        const index = monthList.findIndex((m) => m.date === day.date);

        if (index !== -1) {
          list.value[monthIndex][weekIndex][dayIndex].state = monthList[index].state;
        }

        if (nowTime === day.date && day.isMonth) {
          list.value[monthIndex][weekIndex][dayIndex].isToday = true;
          todayMonthIndex.value = monthIndex;
          todayWeekIndex.value = weekIndex;
          todayIndex.value = dayIndex;
        }
      });
    });
  });

  // console.log(list.value, "list");

  setTimeout(() => {
    if (contentRef.value) {
      offsetHeight.value = contentRef.value.offsetHeight;

      const weeks = contentRef.value.childNodes;
      weekHeight.value = (weeks[1] as any).offsetHeight;

      // weekHeight.value = $refs.week[0].offsetHeight;
      // console.log(weekHeight.value, "weekHeight");
      // console.log(offsetHeight.value, "offsetHeight");
    }
  }, 0);
}
//传入 YYYY-MM , YYYY-MM  (2022-09)  (2023-12)  返回 YYYY-MM 数组
function getYearAndMonth(start: string, end: string) {
  let result = [];
  let starts = start.split("-");
  let ends = end.split("-");
  let staYear = parseInt(starts[0]);
  let staMon = parseInt(starts[1]);
  let endYear = parseInt(ends[0]);
  let endMon = parseInt(ends[1]);

  // console.log(staYear, staMon, endYear, endMon, "测试");

  while (staYear <= endYear) {
    if (staYear === endYear) {
      while (staMon <= endMon) {
        result.push({
          year: staYear,
          month: staMon,
        });
        staMon++;
      }
      staYear++;
    } else {
      result.push({
        year: staYear,
        month: staMon,
      });
      staMon++;
      if (staMon > 12) {
        staMon = 1;
        staYear++;
      }
    }
  }
  // console.log(result, "result");
  return result;
}
function getMonthMatrix(params: { year: number; month: number }) {
  const { year: y, month: m } = params;

  // console.log(this.getMonthDay(year, month - 1), 'this.getMonthDay(year, month - 1)')

  // const timeStamp = new Date().getTime()

  // 确定矩阵后面需要补下个月几天
  const totalDay = getMonthDay(y, m); // 本月天数

  // console.log(totalDay, '本月天数')
  // const lastDayIsWeek = this.getWeekByDay(year, month, totalDay)

  // const lastFillDay = totalDay - lastDayIsWeek
  const firstFillDay = getWeekByDay(y, m, 1);

  // console.log(firstFillDay, '本月第一天星期几')

  const matrix = [];

  let arr = [];

  for (let i = 0; i < 5; i++) {
    for (let k = 0; k < 7; k++) {
      let _day = 0;

      if (k < firstFillDay && i === 0) {
        // 上个月的
        _day = getMonthDay(y, m - 1) + k + 1 - firstFillDay;
      } else if (k + i * 7 >= totalDay + firstFillDay) {
        // 下个月的
        _day = k + i * 7 - (totalDay + firstFillDay) + 1;
      } else {
        _day = k + i * 7 - firstFillDay + 1;
      }

      const DAY = _day < 10 ? "0" + _day : _day + "";

      let MONTH = String(m);

      if (k < firstFillDay && i === 0) {
        MONTH = String(m === 1 ? 12 : m - 1);
      } else if (k + i * 7 >= totalDay + firstFillDay) {
        MONTH = String(m === 12 ? 1 : m + 1);
      }

      MONTH = Number(MONTH) < 10 ? "0" + MONTH : MONTH + "";

      const YEAR = k < firstFillDay && i === 0 && m === 1 ? y - 1 : y;

      // console.log(YEAR, "YEAR");
      const str = `${YEAR}-${MONTH}-${DAY}`;

      // const obj = {
      //   isMonth: !(k < firstFillDay && i === 0) && !(k + i * 7 >= (totalDay + firstFillDay)), // 是否是本月
      //   day,
      //   date: str
      // }

      // map
      // obj[str] = -1

      arr.push({
        isMonth: !(k < firstFillDay && i === 0) && !(k + i * 7 >= totalDay + firstFillDay), // 是否是本月
        day: _day,
        date: str,
        state: -1,
        isStart: false,
        isToday: false,
      });
    }
    matrix.push(arr);
    arr = [];
  }
  return matrix;
}
// 获取这个月份的天数
function getMonthDay(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}
// 获取这天星期几
function getWeekByDay(y: number, m: number, d: number) {
  return new Date(y, m - 1, d).getDay();
}
function handleChange(index: number) {
  selectedIndex.value = index;
  const day = list.value[index][0].filter((d: any) => d.day === 1)[0];
  year.value = day.date.split("-")[0];
  month.value = day.date.split("-")[1];
}
function goToday() {
  if (swiperRef.value) swiperRef.value.swipeTo(todayMonthIndex.value);
}

setTimeout(() => {
  console.log(
    JSON.parse(JSON.stringify(list.value)),
    "list",
    JSON.parse(JSON.stringify(filterList())),
  );
}, 500);
</script>

<template>
  <div :class="['cd', !isExpand && 'noExpand']">
    <!--头部-->
    <div class="cd-header" v-show="isExpand">
      <div
        class="cd-header-today fc"
        :style="{ opacity: `${todayMonthIndex === -1 ? 0 : 0.7}` }"
        @click="goToday"
      >
        回今天
      </div>
      <div class="cd-header-time">{{ year }}年{{ month }}月</div>
      <div class="cd-header-day">
        累计打卡<span>{{ detail.checkinDays || 0 }}</span
        >天
      </div>
    </div>
    <!--星期-->
    <div class="cd-week">
      <div v-for="item in weekList" :key="item.id" class="cd-week-item">{{ item.name }}</div>
    </div>
    <!--渲染后-->
    <div v-if="offsetHeight">
      <VanSwipe
        ref="swiperRef"
        :style="{ height: `${offsetHeight}px` }"
        :initial-swipe="todayMonthIndex"
        :touchable="isExpand"
        vertical
        :show-indicators="false"
        :loop="false"
        @change="handleChange"
      >
        <VanSwipeItem
          v-for="(month, monthIndex) in filterList()"
          :key="monthIndex"
          :style="{ height: `${offsetHeight}px` }"
        >
          <div ref="contentRef" class="cd-con">
            <div v-for="(week, weekIndex) in month" :key="weekIndex" class="cd-con-week">
              <div v-for="(day, dayIndex) in week" :key="dayIndex" :class="filterDayClass(day)">
                <div class="cd-con-week-day-num">{{ day.day }}</div>
                <div v-if="day.isStart && day.isMonth" class="cd-con-week-day-text">开始</div>
              </div>
            </div>
          </div>
        </VanSwipeItem>
      </VanSwipe>
    </div>
    <!--渲染前-->
    <template v-else>
      <div ref="contentRef" class="cd-con">
        <div v-for="(week, weekIndex) in list[0]" :key="weekIndex" class="cd-con-week">
          <div v-for="(day, dayIndex) in week" :key="dayIndex" :class="filterDayClass(day)">
            <div class="cd-con-week-day-num">{{ day.day }}</div>
            <div v-if="day.isStart && day.isMonth" class="cd-con-week-day-text">开始</div>
          </div>
        </div>
      </div>
    </template>
    <!--底部-->
    <div class="cd-bottom">
      <div class="cd-bottom-tip fc">
        <div class="cd-bottom-tip-item fc">
          <div class="cd-bottom-tip-item-dot alreadyDot"></div>
          <div class="cd-bottom-tip-item-text fc">已打卡</div>
        </div>
        <div class="cd-bottom-tip-item fc">
          <div class="cd-bottom-tip-item-dot"></div>
          <div class="cd-bottom-tip-item-text fc">未打卡</div>
        </div>
      </div>

      <div class="cd-bottom-btn fc" @click="isExpand = !isExpand">
        <VanIcon v-if="isExpand" name="arrow-up" color="#999" />
        <VanIcon v-else name="arrow-down" color="#999" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cd {
  position: relative;
  margin: 25px auto 0;
  padding: 16px 16px 0;
  width: 375px;
  height: 404px;
  background: #ffffff;
  box-shadow: 0px 6px 11px 4px rgba(113, 113, 113, 0.02);
  border-radius: 22px;
  box-sizing: border-box;
  overflow: hidden;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;

    &-today {
      width: 56px;
      height: 22px;
      border-radius: 13px;
      opacity: 0.7;
      border: 1px solid #666666;
      font-size: 12px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #666666;
    }

    &-time {
      height: 28px;
      font-size: 16px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #666666;
      line-height: 28px;
    }

    &-day {
      height: 17px;
      font-size: 12px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 17px;

      span {
        color: #0b57c7;
      }
    }
  }

  &-week {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 2px;

    &-item {
      width: 12px;
      height: 14px;
      font-size: 10px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
      transform: scale(0.83333333);
    }
  }

  &-con {
    //display: flex;
    //flex-wrap: wrap;
    //justify-content: space-around;
    //align-items: center;
    padding: 11px 0;

    &-week {
      display: flex;
      justify-content: space-around;
      align-items: center;

      &-day {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 44px;
        height: 44px;
        //background: rgba(255, 184, 120, 0.36);
        background-color: #fff;
        border-radius: 50%;

        &-num {
          height: 26px;
          font-size: 19px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #444444;
          line-height: 26px;
        }
      }

      .yes {
        background: rgba(255, 184, 120, 0.36);

        .cd-con-week-day-num {
          font-size: 19px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ff7c35;
        }

        .cd-con-week-day-text {
          font-size: 10px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #ff7c35;
        }
      }

      .no {
        background: #eeeeee;

        .cd-con-week-day-num {
          font-size: 19px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
        }

        .cd-con-week-day-text {
          font-size: 10px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #999999;
        }
      }

      .start {
        .cd-con-week-day-num {
          font-size: 13px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ff7c35;
        }

        .cd-con-week-day-text {
          margin-top: -8px;
          font-size: 12px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #ff7c35;
          transform: scale(0.83333333333);
        }
      }

      .noMonth {
        opacity: 0;
        background-color: #fff;

        .cd-con-week-day-num {
          font-size: 19px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #cecece;
          background-color: #fff;
        }
      }

      .noMonth2 {
        background-color: #fff;

        .cd-con-week-day-num {
          font-size: 19px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #cecece;
          background-color: #fff;
        }
      }

      .today {
        background: #ffa14c;
        box-shadow: 0 4px 6px 0 rgba(255, 161, 76, 0.41);

        .cd-con-week-day-num {
          font-size: 19px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }

        .cd-con-week-day-text {
          color: #ffffff;
        }
      }
    }

    .cd-con-week + .cd-con-week {
      margin-top: 11px;
    }
  }

  &-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 45px;
    background-color: #fff;

    &-tip {
      &-item {
        &-dot {
          width: 11px;
          height: 11px;
          background: #eeeeee;
          border-radius: 50%;
        }

        .alreadyDot {
          background: rgba(255, 184, 120, 0.36);
        }

        &-text {
          margin-left: 4px;
          height: 14px;
          font-size: 10px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
        }
      }

      .cd-bottom-tip-item + .cd-bottom-tip-item {
        margin-left: 20px;
      }
    }

    &-btn {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 64px;
      height: 22px;
      background: #f4f4f4;
      border-radius: 11px 11px 0px 0px;
    }
  }
}

.noExpand {
  width: 375px;
  height: 152px;
  background: #ffffff;
  border-radius: 22px;
  overflow: hidden;
}
</style>
