<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {
  getToken,
  isWeixinBrowser,
  navAppPage,
  registerWxOpenLaunchApp,
  wxUpdateAppMessageShareData,
} from "@/utils";
import { useRoute, useRouter } from "vue-router";
import { showToast, Swipe as VanSwipe, SwipeItem as VanSwipeItem } from "vant";
import { getMobileCommitBySpuIdRequest, getMobileCommodityDetailRequest } from "@/api/group";
import type { IGroupCommodity } from "@/types/group";
import { defaultGroupCommodity, ICommodityCommit } from "@/types/group";
import TopNav from "@/views/group/components/TopNav.vue";
import ActivityInfoV2 from "@/views/group/components/ActivityInfoV2.vue";
import GroupTeam from "@/views/group/components/GroupTeam.vue";
import BuyModal from "@/views/group/components/BuyModal.vue";
import ConfirmOrderV2 from "@/views/course/components/ConfirmOrderV2.vue";
import { defaultCourseDetail } from "@/types/course";
import type { ICourseDetail } from "@/types/course";
import MomComment from "@/views/group/components/MomComment.vue";

const okLogo = "https://app-resources-luojigou.luojigou.vip/FiSeuywTuh3CJYSSRsyIFAzX9m9s";
const moneyLogo = "https://app-resources-luojigou.luojigou.vip/FmKNJzM4d5r08JL5Wgc9F1nFLjdA";
const rightBtn = "https://app-resources-luojigou.luojigou.vip/FgPA5a1BrBjJAdRFs6Kuoovv0mCI";

const isApp = !isWeixinBrowser();
const router = useRouter();
const route = useRoute();
const { id } = route.query;

const buyShow = ref(false);
const info = reactive<IGroupCommodity>(defaultGroupCommodity());
const coverId = ref(0);
const payType = ref("微信支付");
const payShow = ref(false);
const chosenSku = ref("");
const queryParams = reactive({
  spuId: "",
  state: 0,
  page: 1,
});
const commitList = ref<ICommodityCommit[]>([]);
const buyModalRef = ref<HTMLElement | null>(null);

// 单独购买需要的信息
const payInfo = computed<IGroupCommodity>(() => {
  try {
    return Object.assign(defaultGroupCommodity(), {
      imgCover: info.goods.imageUrl,
      name: info.goods.title,
      price: info.goods.price,
    });
  } catch (err) {
    console.log(err, "payInfo");
    return Object.assign(defaultGroupCommodity(), {
      imgCover: "",
      name: "",
      price: "",
    });
  }
});
// 拼团活动状态 0 未开始 1 已开始 2已结束
const activityState = computed(() => {
  try {
    const { startTime, endTime } = info.groupBuyActivity;
    const sTime = new Date(startTime).valueOf();
    const eTime = new Date(endTime).valueOf();
    const now = new Date().valueOf();

    if (now < sTime) {
      return "0";
    } else if (now > eTime) {
      return "2";
    } else {
      return "1";
    }
  } catch (err) {
    console.log(err, "activityState");
  }

  return "2";
});

function paySuccess() {
  payShow.value = false;
  navAppPage(`/goods/detail?id=${info.goods.id}`);
}

async function registerComponents() {
  const { title, subtitle, imageUrl } = info.goods;
  await registerWxOpenLaunchApp(() => {
    wxUpdateAppMessageShareData(title, subtitle, imageUrl);
  });
}
function returnSku(val: string) {
  chosenSku.value = val;
}
function changePayType(type: string) {
  payType.value = type;
}
function jumpPage(type: string, params?: any) {
  console.log(type, params, "type,params");
  if (type === "goInvite" || type === "makeUpOrder") {
    // 去邀请 去凑单
    router.push({
      path: "/group/GroupDetail",
      query: {
        id: params, // 团id
      },
    });
  } else if (type === "lookDetail") {
    // 查看详情
    router.push({
      path: "/group/GroupDetail",
      query: {
        id: info.currentGroupId, // 团id
      },
    });
  } else if (type === "startGroup") {
    if (activityState.value === "1") {
      // 活动开始
      buyShow.value = true;
    } else if (activityState.value === "0") {
      showToast("拼团活动还未开始");
    } else if (activityState.value === "2") {
      showToast("拼团活动已结束");
    }
  } else if (type === "buyAlone") {
    // 单独购买
    if (isApp) {
      navAppPage(`/goods/detail?id=${id}`);
    } else {
      payShow.value = true;
    }
  }
}
function changeCoverSwiper(index: number) {
  coverId.value = index;
}
// 获取评论
async function getMobileCommitBySpuId() {
  try {
    const { spuId, state, page } = queryParams;
    const { data, msg, status } = await getMobileCommitBySpuIdRequest(spuId, state, page);
    if (status === 200) {
      commitList.value = data.entityList || [];
      console.log(commitList, "info");
    } else {
      msg && showToast(msg);
    }
  } catch (err) {
    console.log(err, "getMobileCommitBySpuId");
  }
}
// 获取商品详情
async function getMobileCommodityDetail(id: string) {
  const { data, status, msg } = await getMobileCommodityDetailRequest(id);
  if (status === 200) {
    Object.assign(info, data);

    if (!info.haveGroupActivity) {
      navAppPage(`goods/detail?id=${id}`);
    }
    // buyModalRef.value.chosenSkuId = info.skuInfo[0].id;

    chosenSku.value = info.skuInfo[0].sku;
  } else {
    showToast(msg);
  }
}

onMounted(async () => {
  await getToken();

  if (typeof id === "string") {
    await getMobileCommodityDetail(id);
    queryParams.spuId = id;
    await getMobileCommitBySpuId();
  }

  await registerComponents();
});
</script>

<template>
  <div class="groupCommodity">
    <TopNav :info="info" :type="2" />
    <!--商品封面-->
    <div
      v-if="Array.isArray(info.imageInfoList) && info.imageInfoList.length !== 0"
      class="commodity-cover"
    >
      <VanSwipe :loop="false" :show-indicators="false" @change="changeCoverSwiper">
        <VanSwipeItem v-for="(img, imgIndex) in info.imageInfoList" :key="imgIndex">
          <img :src="img" alt="" :class="['commodity-cover-img', isApp ? 'appCover' : '']" />
        </VanSwipeItem>
      </VanSwipe>

      <div class="commodity-cover-box">{{ coverId + 1 }}/{{ info.imageInfoList.length }}</div>
    </div>

    <!--拼团详情-->
    <ActivityInfoV2 v-if="info.haveGroupActivity" :info="info" />

    <!--课程信息-->
    <div v-if="info.goods" class="course-info">
      <div class="course-info-top">
        <div class="course-info-top-name">
          {{ info.goods.title }}
        </div>
        <!--<div class="course-info-top-collect">-->
        <!--  <img-->
        <!--    :src="collectLogo"-->
        <!--    alt=""-->
        <!--    class="course-info-top-collect-logo"-->
        <!--  />-->
        <!--  <div class="course-info-top-collect-text">收藏</div>-->
        <!--</div>-->
      </div>
      <div class="course-info-bottom">
        <div class="course-info-bottom-item">
          <img :src="okLogo" class="okLogo" alt="" />
          <span>免运费</span>
        </div>
        <div class="course-info-bottom-item">
          <img :src="moneyLogo" class="moneyLogo" alt="" />
          <span>{{ info.saleCount }}人已购买</span>
        </div>
      </div>
    </div>

    <div class="course-remark">
      <div class="course-remark-item">
        <div class="course-remark-item-left">
          <div class="course-remark-item-left-title">已选</div>
          <div class="course-remark-item-left-desc">{{ chosenSku }}</div>
        </div>
        <img :src="rightBtn" alt="" class="course-remark-item-right" />
      </div>
      <div class="course-remark-item">
        <div class="course-remark-item-left">
          <div class="course-remark-item-left-title">服务</div>
          <div class="course-remark-item-left-desc dots">会员包邮</div>
          <div class="course-remark-item-left-desc dots">官方出品</div>
          <div class="course-remark-item-left-desc dots">极速退换</div>
        </div>
        <img :src="rightBtn" alt="" class="course-remark-item-right" />
      </div>
    </div>

    <!--拼团队伍-->
    <GroupTeam
      v-if="
        info.groupBuyActivity &&
        Array.isArray(info.groupBuyActivity.group) &&
        info.groupBuyActivity.group.length !== 0
      "
      :group="info.groupBuyActivity.group"
      @jumpPage="jumpPage"
    />

    <!--宝妈们评价-->
    <div
      class="course-comment"
      v-if="commitList && Array.isArray(commitList) && commitList.length !== 0"
    >
      <div class="course-comment-header">
        <div class="course-comment-header-title">
          宝妈们评价{{ commitList.length !== 0 ? `（${commitList.length})` : "" }}
        </div>
        <div v-if="commitList.length > 10" class="course-comment-header-right">
          <div class="course-comment-header-right-text">更多</div>
          <img :src="rightBtn" alt="" class="course-comment-header-right-btn" />
        </div>
      </div>
      <div class="course-comment-container">
        <MomComment v-for="item in commitList" :key="item.id" :info="item" />
      </div>
    </div>

    <div v-if="info.goods" class="course-buy">
      <div v-if="info.haveGroupActivity" class="course-buy">
        <div v-if="info.haveBuy" class="course-buy-look" @click="jumpPage('lookDetail')">
          查看拼团详情
        </div>
        <div v-else-if="!isApp" class="course-buy">
          <!--<div class="course-buy-alone" @click="jumpPage('buyAlone')">-->
          <!--  <div class="course-buy-alone-price">-->
          <!--    <span>￥</span>-->
          <!--    {{ info.goods.price.toFixed(2) }}-->
          <!--  </div>-->

          <!--  <div class="course-buy-alone-text">单独购买</div>-->
          <!--</div>-->

          <div
            v-if="info.groupBuyActivity"
            :class="['course-buy-look', activityState === '1' ? 'started' : '']"
            @click="jumpPage('startGroup')"
          >
            <div class="course-buy-start-price">
              <span>￥</span>
              {{ info.groupBuyActivity.activityPrice.toFixed(2) }}
            </div>

            <div class="course-buy-start-text">立即开团</div>
          </div>
        </div>

        <div v-else class="course-buy">
          <div class="course-buy-alone" @click="jumpPage('buyAlone')">
            <div class="course-buy-alone-price">
              <span>￥</span>
              {{ info.goods.price.toFixed(2) }}
            </div>

            <div class="course-buy-alone-text">单独购买</div>
          </div>

          <div
            v-if="info.groupBuyActivity"
            :class="['course-buy-start', activityState === '1' ? 'started' : '']"
            @click="jumpPage('startGroup')"
          >
            <div class="course-buy-start-price">
              <span>￥</span>
              {{ info.groupBuyActivity.activityPrice.toFixed(2) }}
            </div>

            <div class="course-buy-start-text">立即开团</div>
          </div>
        </div>
      </div>

      <div v-else-if="info.goods" class="course-buy-btn" @click="jumpPage('buyAlone')">
        <span style="margin-right: 15px">¥{{ info.goods.price }}</span
        >立即购买
      </div>
    </div>

    <!--<div class="course-buy">-->
    <!--  <div class="course-buy-left">-->
    <!--    <div class="course-buy-left-logo">-->
    <!--      <img :src="customerServiceLogo" alt="">-->
    <!--      <span>客服</span>-->
    <!--    </div>-->
    <!--    <div class="course-buy-left-logo">-->
    <!--      <img :src="shoppingCartLogo" alt="">-->
    <!--      <span>购物车</span>-->
    <!--    </div>-->
    <!--  </div>-->

    <!--  <div class="course-buy-right">-->
    <!--    <div class="course-buy-right-alone">-->
    <!--      <div class="course-buy-right-alone-price">-->
    <!--        <span>￥</span>99.90-->
    <!--      </div>-->
    <!--      <div class="course-buy-right-alone-text">单独购买</div>-->
    <!--    </div>-->

    <!--    <div class="course-buy-right-group">-->
    <!--      <div class="course-buy-right-group-price">-->
    <!--        <span>￥</span>88.00-->
    <!--      </div>-->
    <!--      <div class="course-buy-right-group-text">立即开团</div>-->
    <!--    </div>-->
    <!--  </div>-->
    <!--</div>-->

    <div ref="buyModalRef">
      <BuyModal :show="buyShow" :info="info" @returnSku="returnSku" @close="buyShow = false" />
    </div>

    <ConfirmOrderV2
      :info="payInfo"
      :payType="payType"
      :show="payShow"
      @changePayType="changePayType"
      @paySuccess="paySuccess"
      @close="payShow = false"
    />
  </div>
</template>

<style scoped lang="scss">
.groupCommodity {
  background: #f6f6f6;
  min-height: 100vh;
  padding-bottom: 83px;

  img {
    display: block;
    object-fit: cover;
  }

  .commodity-cover {
    position: relative;

    &-img {
      width: 100vw;
      height: 273px;
    }

    .appCover {
      width: 100vw;
      height: 317px;
      object-fit: cover;
    }

    &-box {
      position: absolute;
      bottom: 31px;
      right: 12px;
      padding: 0 5px;
      height: 18px;
      line-height: 18px;
      font-size: 11px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #666666;
      background-color: #fff;
      border-radius: 10px;
    }
  }

  .course-info {
    position: relative;
    z-index: 3;
    margin-top: -34px;
    background-color: #fff;
    border-radius: 22px 22px 0px 0px;
    overflow: hidden;

    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 18px auto 13px;
      width: 351px;

      &-name {
        width: 351px;
        font-size: 17px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      &-collect {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 38px;
        height: 38px;
        background: #fafafa;
        border-radius: 50%;

        &-logo {
          margin-bottom: 3px;
          width: 14px;
          height: 15px;
        }

        &-text {
          height: 10px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 10px;
          transform: scale(0.6);
        }
      }
    }

    &-bottom {
      display: flex;
      justify-content: space-between;
      margin: 0 auto 10px;
      width: 351px;

      &-item {
        display: flex;
        align-items: center;

        .okLogo {
          margin-bottom: 3px;
          width: 13px;
          height: 13px;
        }

        .moneyLogo {
          margin-bottom: 3px;
          width: 11px;
          height: 11px;
        }

        span {
          margin-left: 5px;
          display: block;
          height: 23px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 23px;
        }
      }
    }
  }

  .course-remark {
    margin-top: 8px;
    background-color: #fff;

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      width: 351px;
      height: 48px;

      &-left {
        display: flex;
        align-items: center;

        &-title {
          margin-right: 12px;
          height: 16px;
          font-size: 14px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #b0b0b0;
          line-height: 16px;
        }

        &-desc {
          width: 290px;
          height: 16px;
          font-size: 14px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #666;
          line-height: 16px;
          overflow: hidden;
          /*文本不会换行*/
          white-space: nowrap;
          /*当文本溢出包含元素时，以省略号表示超出的文本*/
          text-overflow: ellipsis;
        }

        .dots {
          padding-left: 8px;
          margin-right: 12px;
          position: relative;
          width: fit-content;
        }

        .dots::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          z-index: 3;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          background: #0b57c7;
          border-radius: 50%;
        }
      }

      &-right {
        width: 8px;
        height: 14px;
      }
    }

    .course-remark-item + .course-remark-item {
      border-top: 1px solid #f6f6f6;
    }
  }

  .group-team {
    margin-top: 8px;
  }

  .course-comment {
    background-color: #fff;
    margin-top: 8px;
    padding-bottom: 12px;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      margin: 0 auto;
      width: 351px;

      &-title {
        height: 16px;
        font-size: 14px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
      }

      &-right {
        display: flex;
        align-items: center;

        &-text {
          margin-right: 9px;
          height: 12px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 12px;
        }

        &-btn {
          width: 8px;
          height: 14px;
        }
      }
    }

    &-container {
      display: flex;
      overflow-x: scroll;
      width: 100vw;
    }
  }

  .course-buy {
    display: flex;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100vw;
    height: 83px;
    background: #ffffff;
    box-shadow: 0px -4px 34px 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    &-alone {
      margin-right: 10px;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 131px;
      height: 46px;
      background: #dbe9ff;
      border-radius: 23px;
      box-sizing: border-box;

      &-price {
        display: flex;
        height: 30px;
        font-size: 22px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #0b57c7;
        line-height: 30px;

        span {
          margin-top: 7px;
          display: block;
          height: 21px;
          font-size: 15px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #0b57c7;
          line-height: 21px;
        }
      }

      &-text {
        margin-top: -4px;
        height: 16px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #0b57c7;
        line-height: 16px;
      }
    }

    &-start {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 202px;
      height: 46px;
      background: linear-gradient(306deg, #dbdbdb 0%, #cfcfcf 100%);
      border-radius: 23px;

      &-price {
        display: flex;
        justify-content: center;
        height: 30px;
        font-size: 22px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 30px;

        span {
          margin-top: 7px;
          display: block;
          height: 21px;
          font-size: 15px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 21px;
        }
      }

      &-text {
        margin-top: -4px;
        height: 16px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 16px;
      }
    }

    .started {
      background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
    }

    &-look {
      margin-top: 10px;
      width: 343px;
      height: 46px;
      line-height: 46px;
      background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
      border-radius: 23px;
      font-size: 18px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffffff;
      text-align: center;
    }

    &-btn {
      margin-top: 10px;
      width: 343px;
      height: 46px;
      line-height: 46px;
      background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
      border-radius: 23px;
      text-align: center;
      font-size: 18px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }

  //.course-buy {
  //  position: fixed;
  //  left: 0;
  //  bottom: 0;
  //  z-index: 10;
  //  display: flex;
  //  justify-content: space-between;
  //  width: 100vw;
  //  height: 84px;
  //  background: #FFFFFF;
  //  box-shadow: 0px -4px 5px 0px rgba(255, 72, 106, 0.0300);
  //
  //  &-left {
  //    display: flex;
  //    margin-top: 14px;
  //    margin-left: 14px;
  //
  //    &-logo {
  //      display: flex;
  //      flex-direction: column;
  //      align-items: center;
  //
  //      img {
  //        width: 20px;
  //        height: 20px;
  //      }
  //
  //      span {
  //        margin-top: 4px;
  //        height: 10px;
  //        font-size: 10px;
  //        font-family: PingFangSC-Regular, PingFang SC;
  //        font-weight: 400;
  //        color: #666666;
  //        line-height: 10px;
  //      }
  //    }
  //
  //    .course-buy-left-logo + .course-buy-left-logo {
  //      margin-left: 26px;
  //    }
  //  }
  //
  //  &-right {
  //    margin-top: 7px;
  //    display: flex;
  //
  //    &-alone {
  //      display: flex;
  //      flex-direction: column;
  //      align-items: center;
  //      margin-right: 2px;
  //      width: 120px;
  //      height: 48px;
  //      background: linear-gradient(145deg, #FFC87E 0%, #FFC741 100%);
  //      border-radius: 10px 0px 0px 10px;
  //      overflow: hidden;
  //
  //      &-price {
  //        margin-top: 2px;
  //        height: 30px;
  //        font-size: 22px;
  //        font-family: PingFangSC-Semibold, PingFang SC;
  //        font-weight: 600;
  //        color: #FFFFFF;
  //        line-height: 30px;
  //
  //        span {
  //          margin-top: 7px;
  //          height: 21px;
  //          font-size: 15px;
  //          font-family: PingFangSC-Semibold, PingFang SC;
  //          font-weight: 600;
  //          color: #FFFFFF;
  //          line-height: 21px;
  //        }
  //      }
  //
  //      &-text {
  //        margin-top: -4px;
  //        height: 16px;
  //        font-size: 11px;
  //        font-family: PingFangSC-Regular, PingFang SC;
  //        font-weight: 400;
  //        color: #FFFFFF;
  //        line-height: 16px;
  //      }
  //    }
  //
  //    &-group {
  //      display: flex;
  //      flex-direction: column;
  //      align-items: center;
  //      margin-right: 12px;
  //      width: 120px;
  //      height: 48px;
  //      background: linear-gradient(306deg, #FB6872 0%, #FF4747 100%);
  //      border-radius: 0px 10px 10px 0px;
  //      overflow: hidden;
  //
  //      &-price {
  //        margin-top: 2px;
  //        height: 30px;
  //        font-size: 22px;
  //        font-family: PingFangSC-Semibold, PingFang SC;
  //        font-weight: 600;
  //        color: #FFFFFF;
  //        line-height: 30px;
  //
  //        span {
  //          margin-top: 7px;
  //          height: 21px;
  //          font-size: 15px;
  //          font-family: PingFangSC-Semibold, PingFang SC;
  //          font-weight: 600;
  //          color: #FFFFFF;
  //          line-height: 21px;
  //        }
  //      }
  //
  //      &-text {
  //        margin-top: -4px;
  //        height: 16px;
  //        font-size: 11px;
  //        font-family: PingFangSC-Regular, PingFang SC;
  //        font-weight: 400;
  //        color: #FFFFFF;
  //        line-height: 16px;
  //      }
  //    }
  //  }
  //}
}
</style>
