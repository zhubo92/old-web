<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { byAliPayFc, byWechatPay, getToken, navAppPage, wxPayFc } from "@/utils";
import { useRoute, useRouter } from "vue-router";
import {
  showToast,
  Empty as VanEmpty,
  ActionSheet as VantActionSheet,
  Icon as VanIcon,
} from "vant";
import { getMobileAddressByIdRequest, getMobileDefaultAddressRequest } from "@/api/me";
import {
  deleteAICourseOrderRequest,
  deleteProductOrderRequest,
  getMagicCoinsRequest,
} from "@/api/pay";
import {
  getGroupBuySkuDetailRequest,
  goGroupBuyCoursePayRequest,
  goGroupBuyProductPayRequest,
} from "@/api/group";
import { calcCouponOneRequest, getCouponRequest } from "@/api/coupon";
import type { ICoupon, IGroupOrder, IGroupOrderCoupon } from "@/types/group";
import { defaultCoupon, defaultGroupOrder, defaultGroupOrderCoupon } from "@/types/group";
import TopNav from "@/views/group/components/TopNav.vue";
import CTabs from "@/views/group/components/CTabs.vue";
import CouponComponent from "@/views/group/components/CouponComponent.vue";
import type { IShoppingAddress } from "@/types/me";
import { defaultShoppingAddress } from "@/types/me";

const stepList = [
  {
    id: 0,
    cover: "https://app-resources-luojigou.luojigou.vip/Fr_MXomIY2DYTWgn-mULAruv-lLj",
    title: "选择商品",
    remark: "开团/参团",
  },
  {
    id: 1,
    cover: "https://app-resources-luojigou.luojigou.vip/Fibmc0q8_593K3Dwjx2WiduHMBSl",
    title: "邀请好友",
    remark: "参团支付",
  },
  {
    id: 2,
    cover: "https://app-resources-luojigou.luojigou.vip/FnInFlvk9wqPM2WE0z7XZ72R_RVh",
    title: "人满成团",
    remark: "失败退款",
  },
];
const addressLogo = "https://app-resources-luojigou.luojigou.vip/FjjE4LikeoiM_sr5z-kTUZc8GSAt";
const checked = "https://app-resources-luojigou.luojigou.vip/FpR9H4bTNPg4hM2QHQLnPdYcH71q";
const check = "https://app-resources-luojigou.luojigou.vip/FvmxFdt5AZUjE3rwUujCbIRWbNft";
const rightBtn = "https://app-resources-luojigou.luojigou.vip/FgPA5a1BrBjJAdRFs6Kuoovv0mCI";
const nextLogo = "https://app-resources-luojigou.luojigou.vip/Fs5ygYPzkUfGuLEQznQaCKHpksb7";

const router = useRouter();
const route = useRoute();
const { count, activity, sku, groupId, isGroup } = route.query;

const payList = ref([
  {
    id: 0,
    logo: "https://app-resources-luojigou.luojigou.vip/Fr-FGKuBfx304ON7sq8S3O2sOp3Z",
    title: "微信支付",
  },
  {
    id: 2,
    logo: "https://app-resources-luojigou.luojigou.vip/FjlPMe47op66HAAIzJ9M9gTJLnir",
    title: "支付宝支付",
  },
  {
    id: 3,
    logo: "https://app-resources-luojigou.luojigou.vip/Fovav6PMSRd5ZcYbQHaK3bXqpbPf",
    title: "魔法币支付",
  },
]);

const tabsList = ref([
  {
    name: "可用",
    value: 1,
    count: 0,
  },
  {
    name: "不可用",
    value: 0,
    count: 0,
  },
]);

const magicCoins = ref(0);
const payType = ref(0); // 支付方式 0-微信 2-支付宝 3-魔法币
const info = reactive<IGroupOrder>(defaultGroupOrder()); // 下单商品详情
const platform = ref("H5"); // 下单平台: APP H5
const system = ref("H5"); // 支付环境 H5 ANDROID IOS
const address = reactive<IShoppingAddress>(defaultShoppingAddress());
const orderId = ref("");
const couponDialog = ref(false); // 优惠券弹出框

const showCouponState = ref(1); // 1 可用 0 不可用
const coupons = reactive<IGroupOrderCoupon>(defaultGroupOrderCoupon());
const curCoupon = reactive<ICoupon>(defaultCoupon());
const payLoading = ref(false); // 支付loading

const useCoupons = computed(() => {
  return showCouponState.value ? coupons.usable : coupons.unUsable;
});

const activityPrice = computed<number>(() => {
  try {
    if (curCoupon.id) return Number(curCoupon.discountedPrice);
    return info.productType === 1 ? info.activityPrice : info.activityPrice * Number(count);
  } catch (err) {
    console.log(err, "activityPrice");
    return 0;
  }
});

// 判断收货地址是否为空
const addressIsNull = computed(() => {
  return !address || !address.name || !address.phone;
});
const showNot = computed(() => {
  try {
    return activityPrice.value > magicCoins.value;
  } catch (err) {
    console.log(err, "showNot");
    return false;
  }
});

// 计算指定优惠券减免
async function calcCouponOne() {
  const $params = {
    activity: {
      activityId: info.activityId,
      activityType: typeof isGroup === "string" ? isGroup : "0",
      value: 0,
    },
    couponId: curCoupon.id,
    orderGoodsInfoVOS: [
      {
        amount: info.productType === 1 ? 1 : typeof count === "string" ? Number(count) : 1,
        id: info.skuId,
        type: 0,
      },
    ],
  };

  const { data, status } = await calcCouponOneRequest($params);
  console.log(data);
  if (status == 200) {
    curCoupon.discountedPrice = data;
  }
  couponDialog.value = false;
}

// 确认优惠券
function confirmCoupon() {
  calcCouponOne();
}

function selectCoupon(record: any) {
  Object.assign(curCoupon, record);
}

function openCouponDialog() {
  if (coupons.usable.length == 0) return;
  couponDialog.value = true;

  console.log("openCouponDialog", coupons.usable.length, couponDialog.value);
}

// 计算订单价格
async function getCoupon() {
  const $params = {
    activity: {
      activityId: info.activityId,
      activityType: typeof isGroup !== "string" ? 0 : isGroup,
      value: 0,
    },
    orderGoodsInfoVOS: [
      {
        amount: info.productType === 1 ? 1 : count,
        id: info.skuId,
        type: 0,
      },
    ],
  };

  const { data, status } = await getCouponRequest($params);
  if (status == 200) {
    Object.assign(coupons, data);

    if (coupons.usable.length > 0) {
      Object.assign(curCoupon, coupons.usable[0]);
      tabsList.value[0].count = coupons.usable.length;
    } else if (coupons.unUsable.length > 0) {
      tabsList.value[1].count = coupons.unUsable.length;
    }
  }
}

function changeCoupon(record: any) {
  showCouponState.value = record.value;
}

// 切换支付方式
function togglePayType(id: number) {
  if (id === 3 && system.value === "H5") {
    // 魔法币支付
    try {
      if (magicCoins.value < activityPrice.value) {
        showToast("魔法币不足");
      } else {
        payType.value = id;
      }
    } catch (err) {
      console.log(err, "togglePayType");
      showToast("魔法币不足");
    }
  } else {
    payType.value = id;
  }
}

// 接收返回的支付结果
function getPayResult() {
  try {
    (window as any)["returnPayResult"] = async (data: any) => {
      console.log("返回的支付结果：", data);
      if (system.value === "ANDROID") {
        if (payType.value === 2) {
          // 支付宝支付
          if (data == 9000) {
            // 支付成功
            await jumpPage("paySuccess", {
              orderId: orderId,
            });
          } else if (data == 8000 || data == 4000 || data == 5000 || data == 6001 || data == 6002) {
            console.log("是支付宝支付的安卓");
            await jumpPage("payFail");
          }
        } else if (payType.value === 0) {
          // 微信支付
          if (data == 0) {
            // 支付成功
            await jumpPage("paySuccess", {
              orderId: orderId,
            });
          } else if (data == -1 || data == -2) {
            await jumpPage("payFail");
          }
        }
      } else {
        if (data == 0) {
          // 支付成功
          await jumpPage("paySuccess", {
            orderId: orderId.value,
          });
        } else if (data == -1 || data == -2) {
          await jumpPage("payFail");
        }
      }
    };
  } catch (err) {
    console.log(err, "returnPayResult");
  }
}

// 页面跳转
async function jumpPage(type: string, params = {}) {
  // const {groupId, sku} = $route.query;
  console.log(type, params, "跳转参数");
  if (type === "paySuccess") {
    // 支付成功
    showToast("支付成功");
    await router.push({
      path: "/group/GroupDetail",
      query: {
        ...params,
        state: 1, // 1成功 0失败
      },
    });
  } else if (type === "payFail") {
    // 支付失败
    console.log("支付失败");
    showToast("支付失败");
    await deleteAICourseOrder(orderId.value);
  } else if (type === "address") {
    // 跳转到收货地址
    await router.push({
      path: "/me/ShippingAddress",
    });
  } else if (type === "returnPrev") {
    // 返回上一页
    router.go(-1);
  } else if (type === "goGroupBuyCoursePay") {
    // 支付或充值
    if (payType.value === 3 && showNot) {
      navAppPage("/shop/magic/user_account", null, "getCoins");
    } else {
      await goGroupBuyCoursePay();
    }
  }
}

// 判断浏览器环境
function judgePlatform() {
  const ua = window.navigator.userAgent.toLowerCase();
  const isWeixin = ua.match(/MicroMessenger/i)?.[0]?.toLowerCase() === "micromessenger";

  if (isWeixin) {
    //微信浏览器
    system.value = "H5";
    platform.value = "H5";
    payList.value = [payList.value[0], payList.value[2]];
  } else {
    //其他的浏览器
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      //ios环境
      platform.value = "APP";
      system.value = "IOS";
      payList.value =
        info.productType === 2 ? [payList.value[0], payList.value[2]] : payList.value.slice(2, 3);
    } else if (navigator.userAgent.match(/android/i)) {
      //安卓环境
      platform.value = "APP";
      system.value = "ANDROID";
    }
  }

  payType.value = payList.value[0].id;
}

// 删除订单
async function deleteAICourseOrder(orderId: string) {
  console.log("调接口了", orderId);
  try {
    const request = info.productType === 1 ? deleteAICourseOrderRequest : deleteProductOrderRequest;
    const res = await request(orderId);
    console.log("取消订单", JSON.stringify(res));
  } catch (err) {
    console.log(err, "goGroupBuyCoursePay");
  }
}

// 把支付信息给app或者h5
async function handlePay(data: any) {
  console.log(JSON.stringify(data), "支付信息JSON");
  console.log(data, "支付信息");
  console.log(payType.value, "payType");
  console.log(system.value, "system");

  orderId.value = data.orderId;

  if (payType.value === 0) {
    // 微信支付
    if (system.value === "H5") {
      // h5支付
      if (["0", 0].includes(Math.floor(data.paidAmount))) return;
      const state = await wxPayFc(data);
      state ? await jumpPage("paySuccess", { orderId: orderId.value }) : await jumpPage("payFail");
    } else {
      // 安卓支付 ios支付
      byWechatPay(data);
    }
  } else if (payType.value === 2) {
    // 支付宝支付
    byAliPayFc(data.body);
  } else if (payType.value === 3) {
    // 魔法币支付
    showToast("支付成功");
    await jumpPage("paySuccess", {
      orderId: data.orderId,
    });
  }
}

// 拼团下单及支付
async function goGroupBuyCoursePay() {
  if (payLoading.value) return;
  payLoading.value = true;
  const { productName, skuId, productType } = info;
  const addressId = window.sessionStorage.getItem("addressId");

  const params = {
    addressId: productType === 1 ? "" : addressId,
    activityId: activity,
    count: productType === 1 ? 1 : count,
    groupId,
    platform: platform.value,
    productName,
    skuId,
    payMethod: payType.value,
    couponId: curCoupon.id,
  };

  let request = productType === 1 ? goGroupBuyCoursePayRequest : goGroupBuyProductPayRequest;

  const { data, status, msg } = await request(params);
  if (status === 200) {
    await handlePay(data);
  } else {
    showToast(msg);
  }

  payLoading.value = false;
}

// 下单商品详情
async function getGroupBuySkuDetail(params: { activity: string; sku: string }) {
  const { data, status, msg } = await getGroupBuySkuDetailRequest(params);
  if (status === 200) {
    Object.assign(info, data);

    if (info.productType === 2) {
      let addressId = window.sessionStorage.getItem("addressId");
      console.log(addressId, "addressId");

      if (addressId) {
        await getMobileAddressById(addressId);
      } else {
        await getMobileDefaultAddress();
      }
    }
  } else {
    showToast(msg);
  }
}

// 获取用户剩余魔法币
async function getMagicCoins() {
  const { data, status } = await getMagicCoinsRequest();
  if (status === 200) {
    magicCoins.value = data || 0;
  } else {
    showToast("获取魔法币失败");
  }
}

// 根据id获取收货地址数据
async function getMobileAddressById(id: string) {
  const { data, status, msg } = await getMobileAddressByIdRequest(id);
  if (status === 200) {
    Object.assign(address, data);
  } else {
    msg && showToast(msg);
  }
}

// 获取默认收货地址
async function getMobileDefaultAddress() {
  const { data, status, msg } = await getMobileDefaultAddressRequest();
  if (status === 200) {
    Object.assign(address, data);
    window.sessionStorage.setItem("addressId", address.id);
  } else {
    msg && showToast(msg);
  }
}

(window as any)["getCoins"] = () => {
  getMagicCoins();
};

onMounted(async () => {
  await getToken();

  getPayResult();

  if (typeof activity === "string" && typeof sku === "string") {
    const params = { activity, sku };
    await getGroupBuySkuDetail(params);
  }

  judgePlatform();
  await getCoupon();
});
</script>

<template>
  <div :class="['group-order', platform !== 'H5' ? 'app' : '']">
    <TopNav :type="3" :title="'确认订单'" />
    <div class="group-order-step">
      <div v-for="item in stepList" :key="item.id" class="group-order-step-item">
        <img :src="item.cover" alt="" class="group-order-step-item-cover" />
        <div class="group-order-step-item-title">{{ item.title }}</div>
        <div class="group-order-step-item-remark">{{ item.remark }}</div>
      </div>

      <img :src="nextLogo" class="next-logo next-logo1" alt="" />
      <img :src="nextLogo" class="next-logo next-logo2" alt="" />
    </div>

    <!--收货地址-->
    <div v-if="info.productType === 2" class="group-order-address" @click="jumpPage('address')">
      <img :src="addressLogo" alt="" class="group-order-address-logo" />
      <div v-if="addressIsNull" class="group-order-address-right">无收货地址</div>
      <div v-else>
        <div class="group-order-address-right">
          <div class="group-order-address-right-top">
            <!--todo-->
            <div>{{ address.name }}</div>
            <div>{{ address.phone }}</div>
          </div>

          <div class="group-order-address-right-text">
            {{ address.province }}{{ address.city }}{{ address.county }}{{ address.detail }}
          </div>
        </div>
      </div>

      <img :src="rightBtn" alt="" class="rightBtn" />
    </div>

    <!--商品详情-->
    <div class="group-order-detail">
      <img :src="info.productImage" alt="" class="group-order-detail-cover" />
      <div class="group-order-detail-right">
        <div class="group-order-detail-right-title">{{ info.productName }}</div>
        <div class="group-order-detail-right-label">拼团</div>
        <div class="group-order-detail-right-footer">
          <div class="group-order-detail-right-footer-price">
            <div><span>￥</span>{{ info.activityPrice }}</div>

            <del>¥{{ info.originalPrice }}</del>
          </div>

          <div class="group-order-detail-right-footer-num">
            x{{ info.productType === 1 ? 1 : $route.query.count }}
          </div>
        </div>
      </div>
    </div>

    <!-- 合计 -->
    <div class="total-price item-style" v-if="curCoupon.discountedPrice">
      <div class="label">合计</div>
      <div class="price">¥{{ curCoupon.discountedPrice }}</div>
    </div>

    <!-- 优惠券 -->
    <div class="coupon item-style" @click="openCouponDialog">
      <div class="coupon-label">
        <div class="label">优惠券</div>
        <div class="recommend" v-if="coupons.usable[0] && curCoupon.id === coupons.usable[0].id">
          已选推荐优惠
        </div>
      </div>
      <div class="coupon-redu">
        <!-- 已选择优惠券 -->
        <span class="discount" v-if="curCoupon.id"> -¥{{ curCoupon.discountPrice }} </span>
        <!-- 无优惠券 -->
        <span class="no-coupon" v-if="coupons.usable.length == 0">暂无可用</span>
        <VanIcon color="#999999" name="arrow" />
        <!-- 未选择优惠券 -->
        <span class="redu" v-if="coupons.usable.length != 0 && !curCoupon.id">
          剩余{{ coupons.usable.length }}张优惠券可用
        </span>
      </div>
    </div>

    <!--支付方式-->
    <div class="group-order-pay">
      <div
        v-for="item in payList"
        :key="item.id"
        class="group-order-pay-item"
        @click="togglePayType(item.id)"
      >
        <div class="group-order-pay-item-left">
          <img
            :src="item.logo"
            alt=""
            :class="['group-order-pay-item-left-logo', item.id === 2 ? 'weixinlogo' : '']"
          />
          <div class="group-order-pay-item-left-title">
            {{ item.title }}
            {{ item.id === 3 ? `（剩余${magicCoins}）` : "" }}
            <span v-if="item.id === 3 && showNot" class="group-order-pay-item-left-title-not"
              >余额不足</span
            >
          </div>
        </div>

        <img
          :src="payType === item.id ? checked : check"
          alt=""
          class="group-order-pay-item-right"
        />
      </div>
    </div>

    <!--底部-->
    <div class="group-order-footer">
      <div class="group-order-footer-left">
        <div class="group-order-footer-left-top">
          <div class="group-order-footer-left-top-text">待支付：</div>
          <div class="group-order-footer-left-top-price">
            <span>￥</span>{{ curCoupon.id ? curCoupon.discountedPrice : activityPrice }}
          </div>
        </div>

        <div class="coupon-pirce">已优惠¥{{ curCoupon.discountPrice.toFixed(2) }}元</div>
      </div>

      <div class="group-order-footer-btn" @click="jumpPage('goGroupBuyCoursePay')">
        {{ showNot && payType === 3 ? "去充值" : "提交订单" }}
      </div>
    </div>

    <!-- 优惠券弹出框 -->
    <VantActionSheet title="" :show="couponDialog">
      <div class="coupon-dialog">
        <CTabs :tabs="tabsList" @change="changeCoupon" unactiveColor="#999" bgColor="#f9f9f9" />

        <div class="coupon-list" v-if="useCoupons.length !== 0">
          <CouponComponent
            v-for="(item, index) in useCoupons"
            :key="item.id"
            :itemData="item"
            :isSelect="curCoupon.id === item.id"
            :isRecommend="index == 0"
            :isUse="showCouponState === 1"
            @select="selectCoupon"
          />
        </div>

        <VanEmpty style="height: 339px" description="暂无不可用优惠券" v-else />

        <div class="confirm-button" @click="confirmCoupon">确认</div>
      </div>
    </VantActionSheet>
  </div>
</template>

<style scoped lang="scss">
.group-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 67px;
  min-height: 100vh;
  background: #f4f4f4;
  overflow: hidden;

  img {
    display: block;
  }

  &-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    width: 100vw;
    height: 44px;
    background-color: #fff;

    &-title {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 25px;
      font-size: 18px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 25px;
    }
  }

  &-step {
    display: flex;
    justify-content: space-around;
    //align-items: center;
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 343px;
    height: 118px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.33);
    border-radius: 10px;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;

      &-cover {
        margin-top: 20px;
        margin-bottom: 15px;
        width: 28px;
        height: 27px;
      }

      &-title {
        height: 18px;
        font-size: 13px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 18px;
      }

      &-remark {
        height: 18px;
        font-size: 13px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
      }
    }

    .next-logo {
      position: absolute;
      top: 29px;
      width: 17px;
      height: 9px;
    }

    .next-logo1 {
      left: 102px;
    }

    .next-logo2 {
      right: 102px;
    }
  }

  &-address {
    position: relative;
    display: flex;
    align-items: center;
    padding: 14px 20px 15px;
    margin-bottom: 10px;
    width: 343px;
    //height: 109px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.33);
    border-radius: 10px;

    &-logo {
      margin-right: 9px;
      width: 16px;
      height: 16px;
    }

    &-right {
      &-top {
        display: flex;

        div {
          width: 45px;
          height: 24px;
          font-size: 15px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 550;
          color: #333333;
          line-height: 24px;
        }

        div + div {
          margin-left: 10px;
        }
      }

      &-text {
        width: 255px;
        //height: 48px;
        font-size: 15px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 24px;
      }
    }

    .rightBtn {
      position: absolute;
      right: 13px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 10px;
    }
  }

  &-detail {
    display: flex;
    padding: 16px;
    margin-bottom: 10px;
    width: 343px;
    height: 127px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.33);
    border-radius: 10px;
    box-sizing: border-box;

    &-cover {
      margin-right: 19px;
      width: 95px;
      height: 95px;
      object-fit: cover;
      border-radius: 10px;
    }

    &-right {
      overflow: hidden;

      &-title {
        margin-top: 1px;
        margin-bottom: 4px;
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
        margin-bottom: 23px;
        padding: 1px 7px 1px 8px;
        width: fit-content;
        height: 17px;
        font-size: 12px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ff4d46;
        line-height: 19px;
        background: #ffd3d3;
        border-radius: 3px;
        box-sizing: content-box;
      }

      &-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-price {
          display: flex;

          div {
            margin-right: 8px;
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

        &-num {
          height: 14px;
          font-size: 13px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 14px;
        }
      }
    }
  }

  .item-style {
    width: 343px;
    height: 50px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.33);
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto 10px;
    padding: 0 14px;
    box-sizing: border-box;

    .label {
      font-size: 16px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #333333;
    }
  }

  .total-price {
    .price {
      font-size: 16px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #ff4f4f;
    }
  }

  .coupon {
    .coupon-label {
      display: flex;
      align-items: center;

      .recommend {
        width: 79px;
        height: 18px;
        border-radius: 3px;
        border: 1px solid #ff4f4f;
        margin-left: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ff4f4f;
        transform: scale(0.83);
      }
    }

    .coupon-redu {
      display: flex;
      align-items: center;

      .redu {
        font-size: 16px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #333333;
        display: flex;
        align-items: center;
      }

      .discount {
        font-size: 16px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ff4f4f;
      }

      .no-coupon {
        color: #999999;
      }
    }
  }

  &-pay {
    padding: 8px 15px;
    width: 343px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.33);
    border-radius: 10px;

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 19px 0;

      &-left {
        display: flex;
        align-items: center;

        &-logo {
          width: 22px;
          height: 22px;
        }

        .weixinlogo {
          width: 22px;
          height: 20px;
        }

        &-title {
          display: flex;
          align-items: center;
          margin-left: 10px;
          height: 20px;
          font-size: 14px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 20px;

          &-not {
            height: 16px;
            font-size: 11px;
            font-family:
              PingFangSC-Medium,
              PingFang SC;
            font-weight: 500;
            color: #ff2d2d;
            line-height: 16px;
          }
        }
      }

      &-right {
        width: 16px;
        height: 16px;
      }
    }

    .group-order-pay-item + .group-order-pay-item {
      border-top: 1px solid #eee;
    }
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    padding-left: 16px;
    padding-right: 11px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 67px;
    background: #ffffff;
    box-shadow: 0px -4px 34px 0px rgba(119, 119, 119, 0.1);
    overflow: hidden;
    box-sizing: border-box;

    &-left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 9px;

      &-top {
        display: flex;

        &-text {
          margin-top: 6px;
          height: 20px;
          font-size: 14px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
        }

        &-price {
          height: 30px;
          font-size: 22px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ff5e44;
          line-height: 30px;

          span {
            height: 21px;
            font-size: 15px;
            font-family:
              PingFangSC-Semibold,
              PingFang SC;
            font-weight: 600;
            color: #ff5e44;
            line-height: 21px;
          }
        }
      }

      .coupon-pirce {
        font-size: 12px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ff5e44;
        margin-top: 3px;
      }
    }

    &-btn {
      margin-top: 6px;
      width: 115px;
      height: 38px;
      line-height: 38px;
      background: #0b57c7;
      border-radius: 23px;
      font-size: 17px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
    }
  }

  .coupon-dialog {
    background-color: #f9f9f9;

    .tabs {
      width: 100%;
      padding: 0 86px;
      box-sizing: border-box;
      height: 66px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .tab {
        font-size: 14px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #999999;
      }

      .tab-active {
        font-size: 14px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #333333;
      }
    }

    .coupon-list {
      width: 100%;
      height: 339px;
      overflow: hidden;
      overflow-y: scroll;
      scroll-behavior: smooth;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 10px;
      background-color: #f9f9f9;
    }

    .confirm-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 343px;
      height: 46px;
      background: #0c57c6;
      border-radius: 100px;
      font-size: 16px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffffff;
      margin: 52px auto 28px;
    }
  }

  ///deep/ .van-popup {
  //  background-color: #f9f9f9;
  //}
}
</style>
