<script setup lang="ts">
import { Overlay as VanOverlay, showLoadingToast, showToast, Icon as VanIcon } from "vant";
import { computed, ref, watch } from "vue";
import { defaultCourseDetail } from "@/types/course";
import type { ICourseDetail } from "@/types/course";
import {
  getAliPaySignRequest,
  getCourseOrderRequest,
  getCourseOrderWeChatPayRequest,
  getMagicCoinsPayOrderRequest,
  getMagicCoinsPayRequest,
  getMagicCoinsRequest,
  getWxPaySignRequest,
  payOrderByMagicRequest,
  placeOrderAtAppRequest,
} from "@/api/pay";
import { useRoute, useRouter } from "vue-router";
import { getUserInfo } from "@/utils/storage";
import { callAppFc, isWeixinBrowser, navAppPage, wxPayFc } from "@/utils";
import type { IGroupCommodity } from "@/types/group";

interface IPay {
  id: number;
  title: string;
  logo: string;
}

const ALL_PAY_LIST: IPay[] = [
  {
    id: 0,
    title: "魔法币支付",
    logo: "https://app-resources-luojigou.luojigou.vip/Fovav6PMSRd5ZcYbQHaK3bXqpbPf",
  },
  {
    id: 1,
    title: "微信支付",
    logo: "https://app-resources-luojigou.luojigou.vip/Fr-FGKuBfx304ON7sq8S3O2sOp3Z",
  },
  {
    id: 2,
    title: "支付宝支付",
    logo: "https://app-resources-luojigou.luojigou.vip/FjlPMe47op66HAAIzJ9M9gTJLnir",
  },
];

const checked = "https://app-resources-luojigou.luojigou.vip/FpR9H4bTNPg4hM2QHQLnPdYcH71q";
const check = "https://app-resources-luojigou.luojigou.vip/FvmxFdt5AZUjE3rwUujCbIRWbNft";

const router = useRouter();

const { id } = useRoute().query;

const props = withDefaults(
  defineProps<{
    info: ICourseDetail | IGroupCommodity;
    show: boolean;
    payType: string;
    isPunch?: boolean;
  }>(),
  { info: () => defaultCourseDetail(), show: false, payType: "微信支付", isPunch: false },
);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "pay", payType: string): void;
  (e: "changePayType", title: string): void;
  (e: "paySuccess"): void;
}>();

const orderId = ref(""); // 订单id
const magicCoins = ref(0); // 魔法币
const system = ref("H5"); // 支付环境 H5 ANDROID IOS
const platform = ref("H5"); // 下单平台: APP H5
const changeTypeShow = ref<boolean>(false);
const payList = ref(ALL_PAY_LIST.slice(0, 2));

const show = computed(() => props.show);
const info = computed(() => props.info);
const payType = computed(() => props.payType);
const isPunch = computed(() => props.isPunch);

// 魔法币是否足够
const isEnough = computed(() => {
  return !(myPayType.value === 3 && magicCoins.value < (info.value as ICourseDetail).price);
});

// 支付方式 0-微信 2-支付宝 3-魔法币
const myPayType = computed(() => {
  if (payType.value === "微信支付") {
    return 0;
  } else if (payType.value === "支付宝支付") {
    return 2;
  } else {
    return 3;
  }
});

watch(show, (val) => {
  if (val) {
    getCoins();
  }
});

async function getMagicCoinsPay() {
  const { status } = await getMagicCoinsPayRequest(orderId.value);
  if (status === 200) {
    showToast("下单成功");

    await router.push("/course/PaySuccess");
  } else {
    showToast("下单失败");
    emit("close");
  }
}

// 魔法币支付订单
async function getMagicCoinsPayOrder() {
  const userInfo = getUserInfo();

  const params = {
    courseSkuId: (info.value as ICourseDetail).id,
    courseSpuId: (info.value as ICourseDetail).aiCourseSpuId,
    wxName: userInfo?.nickname,
  };
  const { data, msg, status } = await getMagicCoinsPayOrderRequest(params);
  if (status === 200) {
    orderId.value = String(data);
    await getMagicCoinsPay();
  } else {
    msg && showToast(msg);
  }
}

// 获取用户剩余魔法币
async function getCoins() {
  const { data, status } = await getMagicCoinsRequest();
  if (status === 200) {
    magicCoins.value = data || 0;
  } else {
    // Toast('获取魔法币失败');
    magicCoins.value = 0;
  }
}
// 更改支付方式
function changePayType(item: IPay) {
  try {
    if (item.id === 0 && magicCoins.value < (info.value as ICourseDetail).price) {
      showToast("魔法币不足");
      return;
    }
    emit("changePayType", item.title);
  } catch (err) {
    console.log(err, "changePayType");
    showToast("魔法币不足");
  }
}
// 切换成更改支付方式页面
function changeType() {
  changeTypeShow.value = true;
}
// 微信支付
async function getCourseOrderWeChatPay() {
  try {
    const { data } = await getCourseOrderWeChatPayRequest({
      orderId: orderId.value,
    });

    const state = await wxPayFc(data);

    if (state) {
      await router.push("/course/PaySuccess");
    } else {
      emit("close");
    }
  } catch (err) {
    console.log(err, "getCourseOrderWeChatPay");
  }
}
// h5课程下单
async function getCourseOrder() {
  const userInfo = getUserInfo();
  const params = {
    courseSkuId: String(id),
    wxName: userInfo ? userInfo.nickname : "",
  };
  const { data, msg, status } = await getCourseOrderRequest(params);
  if (status === 200) {
    orderId.value = String(data);

    if ((info.value as ICourseDetail).price !== 0) {
      await getCourseOrderWeChatPay();
    } else {
      await router.push("/course/PaySuccess");
    }
  } else {
    msg && showToast(msg);
  }
}
// 魔法币支付
async function payOrderByMagic() {
  const { msg, status } = await payOrderByMagicRequest(orderId.value);
  if (status === 200) {
    paySuccess();
  } else {
    msg && showToast(msg);
  }
}
// 接收返回的支付结果
function getPayResult() {
  try {
    (window as any).returnPayResult = async (data: any) => {
      console.log("返回的支付结果：", data);
      if (myPayType.value === 2) {
        // 支付宝支付
        if (data == 9000) {
          // 支付成功
          paySuccess();
        } else if (data == 8000 || data == 4000 || data == 5000 || data == 6001 || data == 6002) {
          showToast("支付失败");
        }
      } else if (myPayType.value === 0) {
        // 微信支付
        if (data == 0) {
          // 支付成功
          paySuccess();
        } else if (data == -1 || data == -2) {
          showToast("支付失败");
        }
      }
    };
  } catch (err) {
    console.log(err, "getPayResult");
  }
}
// 获取微信支付签名
async function getWxPaySign() {
  const { data, msg, status } = await getWxPaySignRequest(orderId.value);
  if (status === 200) {
    console.log(data, "getWxPaySign");
    callAppFc("byWechatPay", {
      callback: "returnPayResult",
      ticket: data,
    });
  } else {
    msg && showToast(msg);
  }
}
// 获取支付宝签名
async function getAliPaySign() {
  const { data, msg, status } = await getAliPaySignRequest(orderId.value);
  if (status === 200) {
    console.log(data, "getAliPaySign");
    callAppFc("byAliPay", {
      callback: "returnPayResult",
      ticket: data,
    });
  } else {
    msg && showToast(msg);
  }
}

function paySuccess() {
  showLoadingToast({
    message: "加载中...",
    forbidClick: true, // 背景禁止点击
    duration: 1000,
  });
  setTimeout(() => {
    showToast("购买成功");
    emit("paySuccess");
  }, 1000);
}

async function placeOrderAtApp() {
  const params = {
    orderType: 1,
    payApi: "APP",
    platform: platform.value,
    courseSkuId: (info.value as ICourseDetail).id
      ? (info.value as ICourseDetail).id
      : (info.value as IGroupCommodity).goods.imgList[0].spuId,
    payMethod: myPayType.value,
  };
  const { data, msg, status } = await placeOrderAtAppRequest(params);
  if (status === 200) {
    console.log(data, "placeOrderAtApp");
    orderId.value = data.id;

    if ((info.value as ICourseDetail).price === 0) {
      paySuccess();
      return;
    }

    if (system.value === "IOS") {
      await payOrderByMagic();
    } else {
      if (myPayType.value === 0) {
        await getWxPaySign();
      } else if (myPayType.value === 2) {
        await getAliPaySign();
      } else {
        await payOrderByMagic();
      }
    }
  } else {
    msg && showToast(msg);
  }
}

function goPay() {
  if (!isWeixinBrowser()) {
    if (isEnough.value) {
      placeOrderAtApp();
    } else {
      navAppPage("/shop/magic/user_account", null, "getCoins");
    }
  } else {
    if (payType.value === "微信支付") {
      // 微信支付
      getCourseOrder();
    } else {
      // 魔法币支付
      getMagicCoinsPayOrder();
    }
  }
}
</script>

<template>
  <VanOverlay z-index="20" :show="show" @click="emit('close')">
    <!--更换支付方式-->
    <div v-if="changeTypeShow" class="changeType" @click.stop>
      <VanIcon name="cross" class="close-btn" color="#D9D9D9" size="20px" @click="emit('close')" />

      <div class="title">支付方式</div>

      <div class="pay-list">
        <div v-for="item in payList" :key="item.id" class="pay-item" @click="changePayType(item)">
          <div class="pay-item-left">
            <img
              :src="item.logo"
              alt=""
              :class="['pay-item-left-logo', item.id === 1 ? 'weixinlogo' : '']"
            />
            <div class="pay-item-left-title">
              {{ item.title }}
              {{ item.id === 0 ? `（剩余${magicCoins}）` : "" }}
            </div>
          </div>

          <img :src="payType === item.title ? checked : check" alt="" class="pay-item-right" />
        </div>
      </div>

      <div class="goRecharge">
        <div @click="changeTypeShow = false">确定</div>
      </div>
    </div>

    <!--确认订单-->
    <div v-else class="confirmOrderV2" @click.stop>
      <VanIcon name="cross" class="close-btn" color="#D9D9D9" size="20px" @click="emit('close')" />

      <div class="info">
        <img :src="(info as ICourseDetail).imgCover" alt="" class="info-logo" />
        <div class="info-right">
          <div class="info-right-title">{{ (info as ICourseDetail).name }}</div>
          <div v-if="(info as ICourseDetail).price !== 0 && (info as ICourseDetail).price">
            <div class="info-right-price">
              <span>￥</span
              >{{ (info as ICourseDetail).price ? (info as ICourseDetail).price.toFixed(2) : 0 }}
            </div>
          </div>
          <div v-else class="info-right-price">免费</div>
        </div>
      </div>

      <div class="total">
        <span class="total-text">合计</span>
        <span class="total-price">{{
          (info as ICourseDetail).price ? (info as ICourseDetail).price.toFixed(2) : 0
        }}</span>
      </div>
      <div class="remark" @click="changeType">
        <span>使用{{ payType }}点击更换支付方式</span>
        <VanIcon name="arrow" class="jump" color="#999" />
      </div>

      <div class="go-pay">
        <div class="go-pay-text">
          <div class="go-pay-text-total">合计：</div>
          <div class="go-pay-text-price">
            <span>￥</span>
            <span class="big">{{
              (info as ICourseDetail).price ? (info as ICourseDetail).price.toFixed(2) : 0
            }}</span>
          </div>
        </div>

        <div class="go-pay-btn" @click="goPay">
          {{ isEnough ? "去支付" : "去充值" }}
        </div>
      </div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
.close-btn {
  position: absolute;
  right: 20px;
  top: 20px;
}

img {
  display: block;
  object-fit: cover;
}

.changeType {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  //height: 274px;
  background: #ffffff;
  border-radius: 20px 20px 0px 0px;
  overflow: hidden;

  .title {
    padding: 19px 0;
    font-size: 16px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 550;
    color: #333333;
    text-align: center;
    border-bottom: 1px solid #eee;
  }

  .pay-list {
    padding: 0 31px;

    .pay-item {
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
          margin-left: 10px;
          height: 20px;
          font-size: 14px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
        }
      }

      &-right {
        width: 16px;
        height: 16px;
      }
    }

    .pay-item + .pay-item {
      border-top: 1px solid #eee;
    }
  }

  .goRecharge {
    //position: absolute;
    //bottom: 0;
    //left: 0;
    width: 100vw;
    height: 87px;
    background: #ffffff;
    box-shadow: 0px -4px 34px 0px rgba(119, 119, 119, 0.1);
    text-align: center;
    overflow: hidden;

    div {
      margin: 6px auto;
      width: 348px;
      height: 38px;
      line-height: 38px;
      background: #0b57c7;
      border-radius: 23px;
      font-size: 17px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
}

.confirmOrderV2 {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 351px;
  background: #fefefe;
  border-radius: 20px 20px 0px 0px;
  overflow: hidden;

  .info {
    display: flex;
    align-items: center;
    margin: 44px auto 10px;
    width: 343px;
    height: 127px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(228, 233, 235, 0.53);
    border-radius: 10px;

    &-logo {
      margin-left: 16px;
      margin-right: 19px;
      width: 95px;
      height: 95px;
      border-radius: 10px;
    }

    &-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 95px;
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

      &-price {
        display: flex;
        margin-bottom: 10px;
        height: 18px;
        font-size: 18px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ff4f4f;
        line-height: 18px;

        span {
          font-size: 12px;
        }
      }
    }
  }

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto 10px;
    width: 343px;
    height: 50px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(228, 233, 235, 0.53);
    border-radius: 10px;

    &-text {
      margin-left: 14px;
      height: 22px;
      font-size: 16px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }

    &-price {
      margin-right: 14px;
      height: 14px;
      font-size: 16px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #ff4f4f;
      line-height: 14px;
    }
  }

  .remark {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 343px;
    height: 16px;
    font-size: 11px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 16px;
  }

  .go-pay {
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 87px;
    background: #ffffff;
    box-shadow: 0px -4px 34px 0px rgba(119, 119, 119, 0.1);
    overflow: hidden;

    &-text {
      display: flex;
      align-items: center;
      margin-top: 9px;
      margin-left: 16px;
      height: 30px;

      &-total {
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
        span {
          height: 21px;
          font-size: 15px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ff4f4f;
          line-height: 21px;
        }

        .big {
          height: 30px;
          font-size: 22px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ff4f4f;
          line-height: 30px;
        }
      }
    }

    &-btn {
      margin-top: 6px;
      margin-right: 11px;
      width: 115px;
      height: 38px;
      line-height: 38px;
      font-size: 17px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 550;
      color: #ffffff;
      background: #0b57c7;
      border-radius: 23px;
      text-align: center;
    }

    .notChecked {
      opacity: 0.5;
    }
  }
}
</style>
