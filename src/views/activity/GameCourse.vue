<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  addOrderInAPPRequest,
  addPhoneToOrderRequest,
  getCourseOrderRequest,
  getCourseOrderWeChatPayRequest,
  verifyBindPhoneRequest,
  wxBindPhoneRequest,
} from "@/api/pay";
import { buried, getToken, isWeixinBrowser, wxPayFc } from "@/utils";
import { getUserInfo } from "@/utils/storage";
import { showToast } from "vant";
import { defaultUserInfo } from "@/types/user";
import { checkUserBuyCourseRequest, getAICourseItemRequest } from "@/api/course";
import FooterContainer from "@/views/activity/components/FooterContainer.vue";
import LoginModelV2 from "@/views/activity/components/LoginModelV2.vue";

let imgList = ["https://img.luojigou.vip/FlHtyEb7jUXwmhqgUpc_Pl0z13ce"];

const luojigouCourseSkuIdList = [
  "1568062284888866817",
  "1580445037357817858",
  "1592331295190867970",
  "1595230810675847170",
  "1599591971714146305",
  "1602510250959097857",
  "1607256790802026498",
];

const noFreeImgList = ["https://img.luojigou.vip/loDzAl2YxJbFXmWeKGbuzyUIr6Pn"];

const luojigouCourseSkuId = luojigouCourseSkuIdList[luojigouCourseSkuIdList.length - 1];
const isApp = !isWeixinBrowser();
const router = useRouter();
const route = useRoute();

const { fullScreen, id: _id, type, mode } = route.query;

const id = ref(luojigouCourseSkuId);
const hasPaid = ref(false);
const show = ref(false);
const orderId = ref("");
const info = reactive<any>({});
const phone = ref("");
const isFree = ref(true);

const btnText = computed(() => {
  try {
    return hasPaid.value ? "查看课程" : info.price === 0 ? "立即领取" : "立即购买";
  } catch (err) {
    console.error(err);
    return "立即领取";
  }
});

function jump() {
  router.push(`/activity/GamePaySuccess?id=${id.value}&mode=${isFree.value ? 0 : 1}`);
}
// 微信支付
async function getCourseOrderWeChatPay() {
  try {
    const { data } = await getCourseOrderWeChatPayRequest({
      orderId: orderId.value,
    });

    const state = await wxPayFc(data);

    state && jump();
  } catch (err) {
    console.log(err, "getCourseOrderWeChatPay");
  }
}
// h5课程下单
async function getCourseOrder() {
  const userInfo = getUserInfo() || defaultUserInfo();

  const { data, msg, status } = await getCourseOrderRequest({
    courseSkuId: id.value,
    wxName: userInfo.nickname,
  });
  if (status === 200) {
    orderId.value = data;

    buried("ARGamePay", { orderId: orderId.value });

    if (info.price === 0) {
      jump();
    } else {
      await getCourseOrderWeChatPay();
    }
  } else {
    msg && showToast(msg);
  }
}
// 给订单添加手机号
async function addPhoneToOrder() {
  try {
    const { data, msg, status } = await addPhoneToOrderRequest(orderId.value, phone.value);
    if (status === 200) {
      console.log(data, "addPhoneToOrder");
    } else {
      msg && showToast(msg);
    }
  } catch (err) {
    console.log(err, "getCourseOrderWeChatPay");
  }
}
// 登录
async function handleLogin(_phone: string, _code: string) {
  phone.value = _phone;
  const USERINFO = getUserInfo() || defaultUserInfo();
  const state = await bindPhone(_phone, _code, USERINFO);
  state && (await getCourseOrder());
}
// 微信是否绑定手机号
async function bindPhone(_phone: string, _code: string, _userInfo: any) {
  const { status, msg } = await wxBindPhoneRequest(_phone, _code, _userInfo);
  showToast(msg);
  if (status === 200) {
    show.value = false;
    return true;
  } else {
    return false;
  }
}
// 用户是否购买过逻辑狗课程
async function checkUserBuyCourse() {
  const { data, msg, status } = await checkUserBuyCourseRequest();
  if (status === 200) {
    hasPaid.value = Boolean(data);
    id.value = data || luojigouCourseSkuId;
  } else {
    msg && showToast(msg);
  }
}
// 验证微信是否绑定手机号
async function verifyBindPhone() {
  const { status, data, msg } = await verifyBindPhoneRequest();
  if (status === 200) {
    return data;
  } else {
    msg && showToast(msg);
    return false;
  }
}
// 在APP中下单
async function addOrderInAPP() {
  const params = {
    orderType: 1,
    courseSkuId: id.value,
    payApi: "APP",
    payChannels: 1,
    payMethod: 0,
  };
  const { data, msg, status } = await addOrderInAPPRequest(params);
  // console.log(data,'addOrderInAPP')
  if (status === 200) {
    orderId.value = data;
    jump();
  } else {
    msg && showToast(msg);
  }
}
async function pay() {
  if (hasPaid.value) {
    await router.push(
      `/course/CourseDetail?id=${id.value}&mode=luojigou${
        fullScreen === "1" ? "&fullScreen=1" : ""
      }`,
    );
  } else if (isApp) {
    await addOrderInAPP();
  } else {
    const state = await verifyBindPhone();
    if (state) {
      // await getCourseOrder();
      showToast("本活动仅限新用户参加");
    } else {
      show.value = true;
    }
  }
}
// 获取课程信息
async function getAICourseItem() {
  console.log(id, "-------------", _id);
  if (typeof _id !== "string") return;
  const { data, msg, status } = await getAICourseItemRequest({
    skuId: _id,
  });
  if (status === 200) {
    if (data) {
      Object.assign(info, data);
    } else {
      // Toast('该课程不存在')
      console.log("该课程不存在");
    }
  } else {
    msg && showToast(msg);
  }
}

onMounted(async () => {
  await getToken();
  await checkUserBuyCourse();
  if (typeof _id === "string") {
    id.value = _id;
    imgList = noFreeImgList;
    isFree.value = false;
  }

  // 埋点
  const { aplus_queue } = window as any;
  if (type === "0" || mode === "0") {
    aplus_queue.push({
      action: "aplus.record",
      arguments: ["ARGameChannel0", "CLK", route.query],
    });
    console.log("ARGameChannel0");
  } else if (type === "1" || mode === "1") {
    aplus_queue.push({
      action: "aplus.record",
      arguments: ["ARGameChannel1", "CLK", route.query],
    });
    console.log("ARGameChannel1");
  } else if (type === "2" || mode === "2") {
    aplus_queue.push({
      action: "aplus.record",
      arguments: ["ARGameChannel2", "CLK", route.query],
    });
    console.log("ARGameChannel2");
  } else {
    aplus_queue.push({
      action: "aplus.record",
      arguments: ["ARGameChannel", "CLK", route.query],
    });
    console.log("ARGameChannel");
  }

  await getAICourseItem();
});
</script>

<template>
  <div class="ARGame">
    <img v-for="img in imgList" :key="img" :src="img" alt="" />
    <FooterContainer mode="game">
      <div :class="['footer-btn', !hasPaid && 'buy']" @click="pay">{{ btnText }}</div>
    </FooterContainer>

    <LoginModelV2 :show="show" @close="show = false" @login="handleLogin" />
  </div>
</template>

<style scoped lang="scss">
img {
  display: block;
  width: 100vw;
}

img:nth-child(2) {
  margin-top: -1px;
}

img:nth-child(5) {
  margin-bottom: 10px;
}

.ARGame {
  background-color: #fff6e2;
  box-sizing: content-box;
  overflow: hidden;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 86px;
  background-color: #fff;
  overflow: hidden;
}

.footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  width: 343px;
  height: 47px;
  background: linear-gradient(245deg, #ffb228 0%, #ff901c 100%);
  border-radius: 23px;
  font-size: 18px;
  font-family:
    PingFangSC-Medium,
    PingFang SC;
  font-weight: 500;
  color: #ffffff;
}

.buy {
  animation: Ani 0.6s infinite;
}

@keyframes Ani {
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
</style>
