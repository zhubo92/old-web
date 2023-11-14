<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import {
  getToken,
  isWeixinBrowser,
  navAppPage,
  registerWxOpenLaunchApp,
  wxUpdateAppMessageShareData,
} from "@/utils";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import { getGroupActivityByPageRequest } from "@/api/group";
import SharePoster from "@/views/group/components/SharePoster.vue";
import type { IGroupActivity } from "@/types/group";

const bgi = "https://app-resources-luojigou.luojigou.vip/Fk6jPFoAXOcNcmGk1nBi_S6z6vet";
const homeLogo = "https://app-resources-luojigou.luojigou.vip/Fg1ha-aI8Vq0J4YWsjVv5jaHKrSP";

const isApp = !isWeixinBrowser();

const router = useRouter();
const { id } = useRoute().query;

const list = ref<IGroupActivity[]>([]);
const total = ref(-1);
const queryParams = reactive<{
  id: undefined | string;
  isPage: 1 | 0;
  page: number;
  pageSize: number;
}>({
  id: undefined,
  isPage: 1,
  page: 1,
  pageSize: 10,
});
const timeArr = ref<
  {
    days: number | string;
    hours: number | string;
    minutes: number | string;
    seconds: number | string;
    timer: null | NodeJS.Timeout;
    timeStr: string;
  }[]
>([]);
const sharePosterShow = ref(false);

function goHome() {
  router.push("/home");
}
function filterTime(info: any, index: number) {
  try {
    const { startTime, endTime } = info;
    const sTime = new Date(startTime).valueOf();
    const eTime = new Date(endTime).valueOf();

    if (!timeArr.value[index].timer) {
      timeArr.value[index].timer = setInterval(() => {
        const now = new Date().valueOf();
        if (sTime > now) {
          const t = sTime - now;
          timeArr.value[index].timeStr = "距开始";
          // const months = parseInt((t % (1000 * 60 * 60 * 24 * 30 * 12)) / (1000 * 60 * 60 * 24 * 30));
          timeArr.value[index].days = parseInt(String(t / (1000 * 60 * 60 * 24)));
          const hours = parseInt(String((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
          timeArr.value[index].hours = hours > 9 ? hours : "0" + hours;
          const minutes = parseInt(String((t % (1000 * 60 * 60)) / (1000 * 60)));
          timeArr.value[index].minutes = minutes > 9 ? minutes : "0" + minutes;
          const seconds = parseInt(String((t % (1000 * 60)) / 1000));
          timeArr.value[index].seconds = seconds > 9 ? seconds : "0" + seconds;
        } else if (now > sTime && now < eTime) {
          const t = eTime - now;
          timeArr.value[index].timeStr = "距结束";
          // const months = parseInt((t % (1000 * 60 * 60 * 24 * 30 * 12)) / (1000 * 60 * 60 * 24 * 30));
          timeArr.value[index].days = parseInt(String(t / (1000 * 60 * 60 * 24)));
          const hours = parseInt(String((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
          timeArr.value[index].hours = hours > 9 ? hours : "0" + hours;
          const minutes = parseInt(String((t % (1000 * 60 * 60)) / (1000 * 60)));
          timeArr.value[index].minutes = minutes > 9 ? minutes : "0" + minutes;
          const seconds = parseInt(String((t % (1000 * 60)) / 1000));
          timeArr.value[index].seconds = seconds > 9 ? seconds : "0" + seconds;
        } else {
          clearTimerArr();
          queryParams.page = 1;
          getGroupActivityByPage();
        }
      }, 1000);
    }
  } catch (e) {
    console.log(e, "filterTime");
  }
}
function clearTimerArr() {
  timeArr.value.forEach((item) => {
    if (item.timer) {
      clearInterval(item.timer);
      item.timer = null;
    }
  });
  timeArr.value = [];
}
function startTimerArr() {
  clearTimerArr();
  // 计算拼团队伍结束倒计时定时器
  list.value.forEach((item, index) => {
    timeArr.value.push({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timer: null,
      timeStr: "据结束",
    });

    filterTime(item, index);
  });
}
async function scrollBottom() {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  let clientHeight = document.documentElement.clientHeight;
  let scrollHeight = document.documentElement.scrollHeight;
  if (scrollTop + clientHeight >= scrollHeight) {
    console.log("滚动到底部了");
    queryParams.page++;
    if (total.value === list.value.length) {
      showToast("到底啦");
    } else {
      await getGroupActivityByPage();
    }
  }
}
function jumpDetail(record: IGroupActivity) {
  if (isApp) {
    if (record.courseAlreadyBuy) {
      const path = record.productType === 1 ? `/course/pipeline?course_id=` : `/goods/detail?id=`;
      const id = record.productType === 1 ? record.skuList[0].skuId : record.productSpuId;
      navAppPage(`${path}${id}`);
    } else {
      const url = record.productType === 1 ? "GroupCourse" : "GroupCommodity";
      const id = record.productType === 1 ? record.skuList[0].skuId : record.productSpuId;
      const { origin, pathname } = window.location;
      navAppPage(
        "group_buy/webview?url=" +
          encodeURIComponent(`${origin}${pathname}#/group/${url}?id=${id}`),
      );
    }
  } else {
    if (record.productType === 1) {
      router.push({
        path: "/group/GroupCourse",
        query: {
          id: record.skuList[0].skuId,
        },
      });
    } else if (record.productType === 2) {
      router.push({
        path: "/group/GroupCommodity",
        query: {
          id: record.productSpuId,
        },
      });
    }
  }
}
async function getGroupActivityByPage() {
  const { data, msg, status } = await getGroupActivityByPageRequest(queryParams);
  if (status === 200) {
    console.log(data, "getOneSaleCourse");
    list.value.push(...data.records);
    total.value = data.total;
    startTimerArr();
  } else {
    msg && showToast(msg);
  }
}

onMounted(async () => {
  await getToken();

  if (typeof id === "string") queryParams.id = id;

  await registerWxOpenLaunchApp(() => {
    wxUpdateAppMessageShareData(
      "宝贝启蒙必修课，超值拼团限时购！",
      "开团后邀请好友拼团，团满即得！",
      bgi,
    );
  });

  await getGroupActivityByPage();

  window.addEventListener("scroll", scrollBottom);
});

onUnmounted(() => {
  window.removeEventListener("scroll", scrollBottom);
});
</script>

<template>
  <div class="one-yuan" :style="{ backgroundImage: `url(${bgi})` }">
    <img v-if="!isApp" :src="homeLogo" alt="" class="one-yuan-btn home" @click="goHome" />
    <div class="one-yuan-content">
      <div
        class="commodity-item"
        v-for="(item, index) in list"
        :key="item.id"
        @click="jumpDetail(item)"
      >
        <div class="commodity-item-left">
          <img :src="item.productImage" alt="" class="commodity-item-left-img" />
          <div class="commodity-item-left-time">
            <div class="commodity-item-left-time-text">{{ timeArr[index].timeStr }}</div>
            <div class="commodity-item-left-time-value">
              {{ timeArr[index].days }}天{{ timeArr[index].hours }}:{{ timeArr[index].minutes }}:{{
                timeArr[index].seconds
              }}
            </div>
          </div>
        </div>
        <div class="commodity-item-info">
          <div class="commodity-item-info-name">
            <span class="commodity-item-info-name-label">{{ item.population }}人团</span>
            {{ item.productName }}
          </div>

          <div class="commodity-item-info-footer">
            <div v-if="item.skuList && Array.isArray(item.skuList) && item.skuList.length !== 0">
              <div class="commodity-item-info-footer-price">
                <span>￥</span>
                {{ item.skuList[0].activityPrice.toFixed(2) }}
              </div>
            </div>
            <template v-else>
              <div class="commodity-item-info-footer-price">免费</div>
            </template>

            <div class="commodity-item-info-footer-buy">
              {{ item.courseAlreadyBuy ? "立即查看" : "立即购买" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <SharePoster :show="sharePosterShow" @close="sharePosterShow = false" />
  </div>
</template>

<style scoped lang="scss">
.one-yuan {
  padding-bottom: 20px;
  width: 100vw;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: 100%;
  background-color: #ffc345;
  overflow: hidden;

  &-btn {
    position: absolute;
    top: 12px;
    z-index: 3;
    display: block;
    width: 22px;
    height: 22px;
    object-fit: cover;
  }

  .home {
    left: 27px;
  }

  .share {
    right: 27px;
  }

  &-content {
    margin-top: 209px;

    .commodity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px 0 16px;
      margin: 0 auto 10px;
      width: 343px;
      height: 127px;
      background: #ffffff;
      border-radius: 20px;
      box-sizing: border-box;
      overflow: hidden;

      &-left {
        position: relative;
        width: 95px;
        height: 95px;
        border-radius: 10px;
        overflow: hidden;

        &-img {
          display: block;
          width: 95px;
          height: 95px;
          border-radius: 10px;
          object-fit: cover;
        }

        &-time {
          display: flex;
          align-items: flex-end;
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 3;
          width: 100%;

          &-text {
            position: relative;
            z-index: 2;
            padding: 0 3px;
            width: fit-content;
            height: 20px;
            line-height: 24px;
            font-size: 10px;
            font-family: YouSheBiaoTiHei;
            color: #ffffff;
            background: linear-gradient(306deg, #fb6872 0%, #ff4747 100%);
            border-radius: 0px 10px 0px 0px;
            box-sizing: content-box;
          }

          &-value {
            margin-left: -4px;
            padding-left: 6px;
            flex: 1;
            //padding-right: 4px;
            //width: 95px;
            height: 18px;
            line-height: 20px;
            font-size: 8px;
            font-family:
              PingFangSC-Medium,
              PingFang SC;
            font-weight: 500;
            color: #ff4f4f;
            background: linear-gradient(97deg, #fee083 0%, #fff178 100%);
            //text-align: right;
            //box-sizing: border-box;
          }
        }
      }

      &-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 19px;
        height: 95px;

        &-name {
          display: flex;
          align-items: center;
          width: 200px;
          font-size: 16px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 24px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          -webkit-box-align: start;
          overflow: hidden;

          &-label {
            position: relative;
            top: -2px;
            display: inline-block;
            //margin-right: 2px;
            padding: 0 8px;
            width: fit-content;
            height: 18px;
            line-height: 18px;
            font-size: 11px;
            font-family:
              PingFangSC-Regular,
              PingFang SC;
            font-weight: 400;
            color: #ff704a;
            border-radius: 9px;
            border: 1px solid rgba(255, 153, 87, 1);
            box-sizing: border-box;
          }
        }

        &-desc {
          width: 200px;
          height: 24px;
          font-size: 16px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 24px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 200px;

          &-price {
            height: 14px;
            font-size: 18px;
            font-family: "YanShiXieHeiTi";
            font-weight: 600;
            color: #ff4f4f;
            line-height: 14px;

            span {
              margin-right: -5px;
              font-size: 12px;
            }
          }

          &-buy {
            width: 93px;
            height: 31px;
            line-height: 31px;
            background: linear-gradient(128deg, #ffb61b 0%, #ff6b1d 100%);
            border-radius: 16px;
            font-size: 14px;
            font-family:
              PingFangSC-Semibold,
              PingFang SC;
            font-weight: 600;
            color: #ffffff;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
