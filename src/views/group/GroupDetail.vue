<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import {
  getToken,
  isWeixinBrowser,
  navAppPage,
  registerWxOpenLaunchApp,
  shareToFriendForReward,
  shareToFriendForRewardDirectly,
  wxUpdateAppMessageShareData,
} from "@/utils";
import { useRoute, useRouter } from "vue-router";
import {
  getAICourseActivityRequest,
  getGroupBuyGroupDetailByOrderRequest,
  getGroupBuyGroupDetailRequest,
  getMobileCommodityDetailRequest,
} from "@/api/group";
import { showToast } from "vant";
import type { IGroupDetail } from "@/types/group";
import { defaultGroupDetail } from "@/types/group";
import TopNav from "@/views/group/components/TopNav.vue";
import InvitePoster from "@/views/group/components/InvitePoster.vue";
import BuyModal from "@/views/group/components/BuyModal.vue";

const yesLogo = "https://app-resources-luojigou.luojigou.vip/FrSm5fCdQ3ptEHluW1RNpLF79HRp";
const rightBtn = "https://app-resources-luojigou.luojigou.vip/FgPA5a1BrBjJAdRFs6Kuoovv0mCI";
const unknown = "https://app-resources-luojigou.luojigou.vip/FgrZgbfzbBy99A3TQROBoRB18xhx";
const groupFail = "https://app-resources-luojigou.luojigou.vip/FuxHZZbE1N6OjzZXvKRFjFzel0ib";
const shareLogo = "https://app-resources-luojigou.luojigou.vip/FhChzOHMkDJmjwWSW2NvPXJxWtsU";
const gifts = "https://img.luojigou.vip/FtHJ8v6uEF6lLo-tNJG-d4CG0chL";

const isApp = !isWeixinBrowser();
const router = useRouter();
const route = useRoute();
const { id, orderId, state } = route.query;

const paySuccessShow = ref(false);
const detail = reactive<IGroupDetail>(defaultGroupDetail());
const days = ref("0");
const hours = ref("0");
const minutes = ref("0");
const seconds = ref("0");
const timer = ref<NodeJS.Timeout | null>(null);
const posterShow = ref(false);
const shareShow = ref(false);
const buyShow = ref(false);
const chosenSku = ref("");
const info = reactive({});
const buyModalRef = ref<HTMLElement | null>(null);

function clearTimer() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}

async function init() {
  if (typeof id === "string") await getGroupBuyGroupDetail(id);

  if (typeof orderId === "string") await getGroupBuyGroupDetailByOrder(orderId);

  filterTime();

  if (state === "1" && detail?.state !== 1) {
    // 支付成功
    paySuccessShow.value = true;
  }
}
// 获取商品详情
async function getMobileCommodityDetail(id: string) {
  const { data, status, msg } = await getMobileCommodityDetailRequest(id);
  if (status === 200) {
    Object.assign(info, data);
    console.log(info, "info");

    if (buyModalRef.value) buyModalRef.value.chosenSkuId = info.skuInfo[0].id;

    chosenSku.value = info.skuInfo[0].sku;
  } else {
    showToast(msg);
  }
}
async function getAICourseActivity(id: string) {
  const { data, status } = await getAICourseActivityRequest(id);
  if (status === 200) {
    return data;
  } else {
    return null;
  }
}
function returnSku(val: string) {
  chosenSku.value = val;
}
async function registerComponents() {
  await registerWxOpenLaunchApp(() => {
    const { productImage, productName } = detail.product;
    wxUpdateAppMessageShareData(productName, "🎁立即邀请得好礼 >>", productImage);
  });
}
async function jumpPage(type: string, data?: any) {
  console.log(type, data, "跳转参数");
  const { productImage, activityPrice, originalPrice, population, productType } = detail.product;

  const { origin, pathname } = window.location;

  const defaultUrl = `${origin}${pathname}#/growTogether/group/detail?id=${detail.createGroupId}`;

  if (type === "lookDetail") {
    // 查看详情
    if (isApp) {
      const res = await getAICourseActivity(detail.product.skuId);
      if (res && res.search("http") !== -1) {
        // h5页面

        const path = res.split("#")[1];
        await router.push(path);
      } else {
        const path = productType === 2 ? `/goods/detail?id=` : "/course/pipeline?course_id=";
        const id = productType === 2 ? detail.product.spuId : detail.product.skuId;

        navAppPage(`${path}${id}`);
      }
    } else {
      const path =
        detail.product.productType === 1 ? "/group/GroupCourse?id=" : "/group/GroupCommodity?id=";
      const id = detail.product.productType === 1 ? detail.product.skuId : detail.product.spuId;
      await router.push(`${path}${id}`);
    }
  } else if (type === "inviteFriends") {
    // 邀请好友
    shareToFriendForReward({
      teamLeader: detail.myGroup ? 1 : 0, // 是否是团长 0-否 1-是
      productImage: productImage, // 课程封面
      activityPrice: activityPrice, // 拼团活动价
      originalPrice: originalPrice, // 原价
      population: population, // 成团人数
      inviteCode: defaultUrl,
    });
  } else if (type === "lookOrder") {
    // 查看订单详情
    const path =
      detail.product.productType === 1
        ? `ai/course/order/details?ai_course_order_id=${detail.orderId}`
        : "";
    navAppPage(path, () => {
      window.location.href = `https://sj.qq.com/myapp/detail.htm?apkName=com.zaojiao.app`;
    });
  } else if (type === "joinGroup") {
    // 参团下单
    const { activityId, skuId, productType } = detail.product;
    if (productType === 1) {
      await router.push({
        path: "/group/GroupOrder",
        query: {
          activity: activityId,
          sku: skuId,
          groupId: id,
        },
      });
    } else {
      buyShow.value = true;
    }
  } else if (type === "shareGroup") {
    // 分享到微信群
    shareToFriendForRewardDirectly(
      {
        teamLeader: detail.myGroup ? 1 : 0, // 是否是团长 0-否 1-是
        productImage: productImage, // 课程封面
        activityPrice: activityPrice, // 拼团活动价
        originalPrice: originalPrice, // 原价
        population: population, // 成团人数
        inviteCode: defaultUrl,
        type: data,
      },
      () => {
        if (data === 1) {
          shareShow.value = true;
        } else {
          posterShow.value = true;
        }
      },
    );
  } else if (type === "lookMyCourse") {
    // 查看我的课程
    const path = productType === 2 ? `/goods/detail?id=` : "/course/pipeline?course_id=";
    const id = productType === 2 ? detail.product.spuId : detail.product.skuId;
    navAppPage(`${path}${id}`, () => {
      router.push("/home/MyCourse");
    });
  }
}
function filterTime() {
  try {
    const time = new Date(detail.expiredTime).valueOf();

    timer.value = setInterval(() => {
      const now = new Date().valueOf();

      // console.log(time, now, 'time now');

      if (time > now) {
        const n = new Date().valueOf();
        const t = time - n;
        // const months = parseInt((t % (1000 * 60 * 60 * 24 * 30 * 12)) / (1000 * 60 * 60 * 24 * 30));
        days.value = String(parseInt(String(t / (1000 * 60 * 60 * 24))));
        const _hours = parseInt(String((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        hours.value = _hours > 9 ? _hours + "" : "0" + _hours;
        const _minutes = parseInt(String((t % (1000 * 60 * 60)) / (1000 * 60)));
        minutes.value = _minutes > 9 ? _minutes + "" : "0" + _minutes;
        const _seconds = parseInt(String((t % (1000 * 60)) / 1000));
        seconds.value = _seconds > 9 ? _seconds + "" : "0" + _seconds;
      } else {
        clearTimer();
        if (detail.state !== 1) detail.state = -1;
      }
    }, 1000);
  } catch (e) {
    console.log(e, "filterTime");
  }
}
// 拼团详情-订单ID
async function getGroupBuyGroupDetailByOrder(id: string) {
  const { data, status, msg } = await getGroupBuyGroupDetailByOrderRequest(id);
  if (status === 200) {
    console.log(data, "getGroupBuyGroupDetailByOrder");
    Object.assign(detail, data);
    if (detail.product.productType === 2) {
      await getMobileCommodityDetail(detail.product.spuId);
    }
  } else {
    showToast(msg);
  }
}
// 拼团详情
async function getGroupBuyGroupDetail(id: string) {
  const { data, status, msg } = await getGroupBuyGroupDetailRequest(id);
  if (status === 200) {
    Object.assign(detail, data);

    if (detail.product.productType === 2) {
      await getMobileCommodityDetail(detail.product.spuId);
    }

    console.log(detail, "detail");
  } else {
    showToast(msg);
  }
}

onMounted(async () => {
  (window as any).prevPage = () => {
    router.go(-1);
  };

  await getToken();
  await init();

  await registerComponents();
});

onUnmounted(() => {
  clearTimer();
});
</script>

<template>
  <div :class="['group-detail', isApp ? 'isApp' : '']">
    <TopNav :type="3" :title="'拼团详情'" />

    <!--课程详情-->
    <div v-if="detail.product" class="group-detail-info" @click="jumpPage('lookDetail')">
      <img :src="detail.product.productImage" alt="" class="group-detail-info-cover" />
      <div class="group-detail-info-right">
        <div class="group-detail-info-right-title">{{ detail.product.productName }}</div>
        <div class="group-detail-info-right-label">拼团</div>
        <div class="group-detail-info-right-price">
          <div class="group-detail-info-right-price-current">
            <span>￥</span>{{ detail.product.activityPrice.toFixed(2) }}
          </div>

          <del>¥{{ detail.product.originalPrice.toFixed(2) }}</del>
        </div>
      </div>
      <div v-if="detail.state === 1" class="group-detail-info-btn">查看课程</div>
      <img v-else :src="rightBtn" alt="" class="group-detail-info-rightBtn" />
    </div>

    <!--拼团内容-->
    <div class="group-detail-container">
      <div v-if="detail.state === 1" class="group-detail-container-yes">
        <img class="group-detail-container-yes-logo" :src="yesLogo" alt="" />
        <div class="group-detail-container-yes-text">拼团成功</div>
      </div>
      <div v-else class="group-detail-container-title">拼团剩余时间</div>

      <!-- 活动正在进行中 -->
      <div v-if="detail.state === 0" class="group-detail-container-time">
        <span>{{ days }}</span
        >天 <span>{{ hours }}</span
        >: <span>{{ minutes }}</span
        >:
        <span>{{ seconds }}</span>
      </div>

      <!--拼团失败-->
      <div v-else-if="detail.state === -1">
        <div class="group-detail-container-end">活动已结束</div>
        <img class="group-detail-container-failImg" :src="groupFail" alt="" />
      </div>

      <!--拼团成功显示5人-->
      <div v-if="detail.state === 1" class="group-detail-container-team success">
        <div v-if="Array.isArray(detail.joinUsers)" class="group-detail-container-team-items">
          <div
            v-for="user in detail.joinUsers.slice(0, 5)"
            :key="user.id"
            class="group-detail-container-team-item"
          >
            <img :src="user.userAvatar" alt="" />
            <div v-if="user.teamLeader === 1" class="group-detail-container-team-item-label">
              团长
            </div>
          </div>
        </div>

        <div class="group-detail-container-team-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <!--拼团失败或者正在拼团最多显示三个-->
      <div v-else class="group-detail-container-team">
        <div v-if="Array.isArray(detail.joinUsers)">
          <div
            v-for="user in detail.joinUsers.slice(0, 3)"
            :key="user.id"
            class="group-detail-container-team-item"
          >
            <img :src="user.userAvatar" alt="" />
            <div v-if="user.teamLeader === 1" class="group-detail-container-team-item-label">
              团长
            </div>
          </div>
        </div>

        <div class="group-detail-container-team-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>

        <img :src="unknown" alt="" class="group-detail-container-team-unknown" />
      </div>

      <div v-if="detail.state !== 1" class="group-detail-container-text">
        还差<span>{{ detail.needUser }}</span
        >人，即可拼团成功
      </div>

      <div v-if="detail.state === 0">
        <div
          v-if="!detail.joinGroup"
          class="group-detail-container-invite join-group"
          @click="jumpPage('joinGroup')"
        >
          立即加入
        </div>

        <div v-else>
          <div class="group-detail-container-invite" @click="jumpPage('inviteFriends')">
            邀请好友参团
            <div class="group-detail-container-invite-tip">不邀请无法获得哦!</div>
          </div>

          <div class="group-detail-container-look" @click="jumpPage('lookOrder')">查看订单详情</div>
        </div>
      </div>

      <!--<template v-else-if="detail.state === 1">-->
      <!--  <div-->
      <!--    class="group-detail-container-invite"-->
      <!--    @click="jumpPage('lookMyCourse')"-->
      <!--  >-->
      <!--    查看课程-->
      <!--  </div>-->
      <!--</template>-->
    </div>

    <!--课程服务-->
    <!--<div class="group-detail-serve">-->
    <!--  <div class="group-detail-serve-title">课程服务</div>-->
    <!--  <img-->
    <!--    src="https://app-resources-luojigou.luojigou.vip/Fo3UxpYP1Pqpdj7HPeOIsXTiAaA1"-->
    <!--    alt=""-->
    <!--    class="group-detail-serve-qrcode"-->
    <!--  />-->
    <!--  <div class="group-detail-serve-text">助力孩子思维成长学习分享</div>-->
    <!--  <div class="group-detail-serve-remark">-->
    <!--    <img :src="Safety" alt=""/>-->
    <!--    <span>已通过安全认证，可放心扫码</span>-->
    <!--  </div>-->
    <!--</div>-->
    <div class="group-detail-serve">
      <div class="group-detail-serve-name">获取更多福利</div>
      <AddWechatBtn />
      <img :src="gifts" alt="" class="group-detail-serve-img" />
    </div>

    <!--支付成功-->
    <PaySuccess
      :show="paySuccessShow"
      :info="detail"
      :days="days"
      :hours="hours"
      :minutes="minutes"
      :seconds="seconds"
      @close="paySuccessShow = false"
      @jumpPage="jumpPage"
    />

    <!--分享海报-->
    <InvitePoster :show="posterShow" :info="detail" @close="posterShow = false" />
    <!--<share-poster :show="sharePosterShow"/>-->

    <!--分享到朋友圈提醒-->
    <div v-if="shareShow" class="shareLogo" @click="shareShow = false">
      <img :src="shareLogo" alt="" />
    </div>

    <!--商品购买选择规格弹窗-->
    <div v-show="buyShow" ref="buyModalRef">
      <BuyModal :show="buyShow" :info="info" @returnSku="returnSku" @close="buyShow = false" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.group-detail {
  min-height: 100vh;
  background: #f4f4f4;
  overflow: hidden;

  img {
    display: block;
    object-fit: cover;
  }

  &-info {
    display: flex;
    padding: 16px 13px 16px 16px;
    margin: 20px auto 0;
    position: relative;
    width: 343px;
    height: 127px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.81);
    border-radius: 10px;

    &-cover {
      margin-right: 19px;
      width: 95px;
      height: 95px;
      border-radius: 10px;
    }

    &-right {
      display: flex;
      flex-direction: column;
      overflow: hidden;

      &-title {
        margin-top: 1px;
        width: 192px;
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

      &-label {
        margin-top: 4px;
        padding: 1px 7px 1px 8px;
        width: fit-content;
        height: 17px;
        font-size: 12px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 550;
        color: #ff4d46;
        line-height: 17px;
        box-sizing: content-box;
        background: #ffd3d3;
        border-radius: 3px;
      }

      &-price {
        display: flex;
        margin-top: 24px;

        &-current {
          height: 14px;
          font-size: 18px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ff4f4f;
          line-height: 14px;

          span {
            font-size: 12px;
          }
        }

        del {
          margin-left: 8px;
          height: 17px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 17px;
        }
      }
    }

    &-rightBtn {
      position: absolute;
      top: 50%;
      right: 13px;
      transform: translateX(-50%);
      width: 6px;
      height: 10px;
    }

    &-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      bottom: 18px;
      right: 16px;
      width: 87px;
      height: 30px;
      font-size: 14px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ff624d;
      border-radius: 23px;
      border: 1px solid #ff624d;
    }
  }

  &-container {
    position: relative;
    margin: 10px auto;
    width: 343px;
    //height: 332px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.81);
    border-radius: 10px;
    overflow: hidden;

    &-yes {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 27px 0 18px;

      &-logo {
        margin-right: 8px;
        display: block;
        width: 22px;
        height: 22px;
        object-fit: cover;
      }

      &-text {
        height: 24px;
        font-size: 26px;
        font-family: YouSheBiaoTiHei;
        color: #333333;
        line-height: 24px;
      }
    }

    &-title {
      margin-top: 17px;
      margin-bottom: 7px;
      height: 24px;
      font-size: 23px;
      font-family: YouSheBiaoTiHei;
      color: #333333;
      line-height: 24px;
      text-align: center;
    }

    &-time {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 17px;
      font-size: 12px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 550;
      color: #ff2727;
      line-height: 17px;

      span {
        display: block;
        padding: 0 7px;
        margin: 0 2px;
        height: 22px;
        line-height: 22px;
        background: rgba(255, 250, 248, 0.9);
        box-shadow: inset 0px 0px 6px 0px rgba(255, 102, 102, 0.2);
        border-radius: 4px;
        font-size: 16px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ff5140;
      }
    }

    .success {
      flex-direction: column;
      margin-bottom: 30px;

      .group-detail-container-team-dots {
        margin-top: 15px;
      }
    }

    &-team {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 13px;

      &-items {
        display: flex;
        align-items: center;
      }

      &-item {
        position: relative;
        width: 50px;
        height: 57px;

        img {
          width: 50px;
          height: 50px;
          border: 1px solid #ff4d46;
          border-radius: 50%;
        }

        &-label {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          padding: 2px 11px 1px 12px;
          width: fit-content;
          height: 17px;
          font-size: 12px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 550;
          color: #ffffff;
          line-height: 17px;
          box-sizing: content-box;
          background: linear-gradient(320deg, #ff6141 0%, #ff4d46 100%);
          border-radius: 10px;
        }
      }

      .group-detail-container-team-item + .group-detail-container-team-item {
        margin-left: 20px;
      }

      &-dots {
        display: flex;
        align-items: center;
        margin-left: 14px;
        margin-right: 13px;

        div {
          width: 4px;
          height: 4px;
          background: #ff4e46;
          border-radius: 50%;
        }

        div:first-child {
          opacity: 0.7;
        }

        div:nth-child(2) {
          opacity: 0.5;
        }

        div:nth-child(3) {
          opacity: 0.3;
        }

        div + div {
          margin-left: 5px;
        }
      }

      &-unknown {
        width: 52px;
        height: 52px;
      }
    }

    &-text {
      margin-bottom: 18px;
      height: 33px;
      font-size: 15px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 21px;
      text-align: center;

      span {
        color: #ff4d46;
        font-size: 24px;
        font-weight: 600;
      }
    }

    &-invite {
      position: relative;
      margin: 0 auto 14px;
      width: 275px;
      height: 44px;
      line-height: 44px;
      background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
      border-radius: 23px;
      font-size: 17px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ffffff;
      text-align: center;

      &-tip {
        position: absolute;
        top: -14px;
        right: -30px;
        width: 121px;
        height: 24px;
        line-height: 22px;
        background: linear-gradient(111deg, #ffe749 0%, #ffc927 100%);
        border-radius: 12px 12px 12px 0;
        border: 2px solid #ffffff;
        font-size: 10px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ff4740;
        text-align: center;
        animation: tipAni 0.8s infinite;
      }

      @keyframes tipAni {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
        }
      }
    }

    .join-group {
      margin-bottom: 25px;
    }

    &-look {
      margin: 0 auto 20px;
      width: 275px;
      height: 44px;
      line-height: 44px;
      border-radius: 23px;
      border: 1px solid #ff4740;
      font-size: 17px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ff4740;
      text-align: center;
    }

    &-end {
      margin-bottom: 20px;
      font-size: 16px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #999999;
      text-align: center;
    }

    &-failImg {
      position: absolute;
      right: 7px;
      top: 8px;
      display: block;
      height: 79px;
      width: 87px;
      object-fit: cover;
    }
  }

  &-serve {
    margin: 0 auto 20px;
    width: 343px;
    //height: 190px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.81);
    border-radius: 10px;
    text-align: center;
    overflow: hidden;

    &-title {
      margin: 12px auto 7px;
      height: 24px;
      font-size: 18px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 24px;
    }

    &-qrcode {
      margin: 0 auto 5px;
      width: 88px;
      height: 88px;
    }

    &-text {
      margin-bottom: 6px;
      height: 18px;
      font-size: 13px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
    }

    &-remark {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        margin-right: 3px;
        width: 10px;
        height: 12px;
      }

      span {
        display: block;
        height: 16px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #1cbb5c;
        line-height: 16px;
      }
    }

    &-name {
      margin: 26px auto 21px;
      height: 24px;
      font-size: 18px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 24px;
      text-align: center;
    }

    &-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto 22px;
      width: 275px;
      height: 50px;
      font-size: 17px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffffff;
      background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
      border-radius: 25px;
    }

    &-img {
      display: block;
      margin: 0 auto 30px;
      width: 267px;
      height: 69px;
      object-fit: cover;
    }
  }

  .shareLogo {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);

    img {
      position: absolute;
      top: 33px;
      right: 41px;
      display: block;
      width: 183px;
      height: 121px;
    }
  }
}
</style>
