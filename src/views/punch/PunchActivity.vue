<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
  callAppFc,
  filterImgCover,
  getToken,
  isWeixinBrowser,
  navAppPage,
  pageFinallyFc,
} from "@/utils";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { getPunchActivityListRequest } from "@/api/punch";
import type { IPunchActivity } from "@/types/punch";

const staticImg = {
  dog: "https://img.luojigou.vip/FgoPjYpinYKYNq8hoz1dwI9rtRCN",
  bgi: "https://img.luojigou.vip/FpWvdNbnO1vVIGZZBg3QmAAkocFw",
  img: "https://img.luojigou.vip/FigWJp8MQf3NJWpVWspZo80u_y8J",
  btn: "https://img.luojigou.vip/FoSomKl--jao35iZruPQ82TH0zr4",
};

const router = useRouter();
const isApp = !isWeixinBrowser();
const { origin, pathname } = window.location;

const list = ref<IPunchActivity[]>([]);
const queryParams = reactive({
  page: 1,
  pageSize: 20,
});

const total = ref(-1);

function filterBuyText(item: IPunchActivity) {
  // console.log(item, 'itme')
  return item.purchased === 0 ? "立即抢购" : "立即查看";
}

function resetParams() {
  list.value = [];
  queryParams.page = 1;
  total.value = -1;
}
async function loadList() {
  if (total.value !== list.value.length) {
    queryParams.page++;
    await getPunchActivityList();
  } else {
    showToast("已经到底啦~");
  }
}
async function getPunchActivityList() {
  const { data, status, msg } = await getPunchActivityListRequest(queryParams);
  if (status === 200) {
    list.value.push(...data.records);
    total.value = data.total;
  } else {
    msg && showToast(msg);
  }
}
function jumpPage(record: IPunchActivity) {
  console.log(record, "record");
  const { purchased, joinCashbackActivity, hasGroupBuyActivity, id, courseSkuId } = record;

  if (isApp) {
    if (purchased === 1) {
      // 已购买
      if (joinCashbackActivity === 1) {
        // 已参加活动
        const route = `${origin}${pathname}#/punch/PunchCourse/${id}`;
        navAppPage("course/punchActivities?url=" + encodeURIComponent(route));
      } else {
        // 未参加
        const path = "/course/pipeline?course_id=";
        navAppPage(`${path}${courseSkuId}`);
      }
    } else {
      // 未购买
      if (hasGroupBuyActivity === 1) {
        // 跳转到拼团详情
        callAppFc("navWebPage", {
          fullscreen: true,
          url: `${origin}${pathname}#/group/GroupCourse?id=${courseSkuId}`,
        });
      } else {
        // 跳转到课程详情
        callAppFc("navWebPage", {
          fullscreen: true,
          url: `${origin}${pathname}#/course/CourseDetail?id=${courseSkuId}`,
        });
      }
    }
  } else {
    if (hasGroupBuyActivity === 1) {
      // 跳转到拼团详情
      router.push(`/group/GroupCourse?id=${courseSkuId}`);
    } else {
      // 跳转到课程详情
      router.push(`/course/CourseDetail?id=${courseSkuId}`);
    }
  }
}

onMounted(async () => {
  await getToken();
  await getPunchActivityList();

  (window as any).onLoadPage = () => {
    resetParams();
    getPunchActivityList();
  };

  pageFinallyFc(() => {
    loadList();
  });
});
</script>

<template>
  <div class="punch box" :style="{ backgroundImage: `url(${staticImg.bgi})` }">
    <!--逻辑狗logo-->
    <img :src="staticImg.dog" alt="" class="punch-bgi" />

    <div v-for="item in list" :key="item.id" class="punch-ac" @click="jumpPage(item)">
      <div class="punch-ac-title">{{ item.courseName }}</div>
      <div class="punch-ac-detail">
        <div class="punch-ac-detail-age fc">{{ item.suitAge }}岁</div>
        <div class="punch-ac-detail-desc fc">打卡{{ item.goalDays }}天全额返现</div>
      </div>

      <img :src="filterImgCover(item.imgCover) as string" class="punch-ac-img" alt="" />

      <div class="btn fc" :style="{ backgroundImage: `url(${staticImg.btn})` }">
        <div class="btn-price fc">
          <div class="btn-price-text">超值价￥</div>
          <div class="btn-price-num">{{ item.price }}</div>
        </div>
        <div class="btn-buy fc">{{ filterBuyText(item) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  opacity: 0 !important;
}

.punch {
  padding-top: 211px;
  position: relative;
  padding-bottom: 20px;
  width: 100vw;
  min-height: 100vh;
  background: no-repeat top/contain #ffac2d;
  box-sizing: border-box;
  overflow: hidden;

  &-bgi {
    display: block;
    position: absolute;
    top: 96px;
    right: -46px;
    z-index: 10;
    width: 209px;
    height: 140px;
    object-fit: contain;
  }

  &-ac {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    width: 343px;
    //height: 424px;
    background: #ffffff;
    border-radius: 20px;

    &-title {
      margin-top: 25px;
      width: 303px;
      height: 24px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 700;
      color: #333333;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-detail {
      display: flex;
      margin-top: 6px;
      width: 303px;

      &-age {
        margin-right: 6px;
        padding: 3px 12px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #fc7a3f;
        background: #ffede4;
        border-radius: 16px;
      }

      &-desc {
        padding: 3px 12px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ffffff;
        background: #fc7a3f;
        border-radius: 16px;
      }
    }

    &-img {
      display: block;
      margin-top: 17px;
      width: 303px;
      height: 171px;
      border-radius: 10px;
      object-fit: cover;
    }

    &-section {
      display: flex;
      align-items: center;
      margin-top: 13px;
      width: 303px;
      overflow: scroll hidden;

      &-item {
        width: 89px;
        height: 50px;
        border-radius: 5px;
        //background: no-repeat center/cover;
        flex-shrink: 0;
        object-fit: cover;
      }

      .punch-ac-section-item + .punch-ac-section-item {
        margin-left: 10px;
      }
    }

    &-btn {
      display: flex;
      align-items: center;
      margin-top: 23px;
      margin-bottom: 27px;
      overflow: hidden;

      &-price {
        width: 150px;
        height: 46px;
        background: #ffea94;
        border-radius: 22px 0 0 22px;

        &-text {
          margin-top: 4px;
          font-size: 12px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 600;
          color: #ff6363;
          line-height: 12px;
        }

        &-num {
          font-size: 22px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 700;
          color: #ff4747;
          line-height: 22px;
        }
      }

      // 5px

      &-triangle {
        position: relative;
        z-index: 3;
        width: 0;
        height: 0;
        border-right: 5px solid transparent;
        border-top: 46px solid #ffea94;
      }

      &-buy {
        margin-left: -5px;
        width: 153px;
        height: 46px;
        background: linear-gradient(319deg, #ff8b41 0%, #ff582a 100%);
        border-radius: 0 22px 22px 0;
        font-size: 18px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ffffff;
      }
    }

    .btn {
      margin-top: 23px;
      margin-bottom: 27px;
      width: 303px;
      height: 46px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      overflow: hidden;

      &-price {
        width: 150px;
        height: 46px;

        &-text {
          margin-top: 4px;
          font-size: 12px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 600;
          color: #ff6363;
          line-height: 12px;
        }

        &-num {
          font-size: 22px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 700;
          color: #ff4747;
          line-height: 22px;
        }
      }

      &-buy {
        width: 153px;
        height: 46px;
        font-size: 18px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }

  .punch-ac + .punch-ac {
    margin-top: 20px;
  }
}
</style>
