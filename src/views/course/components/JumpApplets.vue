<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getSToken } from "@/utils/storage";
import { isWeixinBrowser, launchMiniProgram } from "@/utils";
import { getCWXSignature } from "@/api/user";
import wx from "weixin-js-sdk";
import { showToast } from "vant";
import { useAppStore } from "@/stores";
import { storeToRefs } from "pinia";

const props = withDefaults(
  defineProps<{
    extraData: string;
    isFinish: boolean;
    quesId: number | string;
    semesterLeveCode: number | string;
  }>(),
  { extraData: "", isFinish: false, quesId: "", semesterLeveCode: "" },
);
const { loading } = storeToRefs(useAppStore());
const practice = "";
const username = "gh_c4ee7ecb7cec"; // 所需跳转的小程序原始id
const path = "pages/game/index"; // 路径
const isApp = !isWeixinBrowser();

const queryPath = computed(() => {
  const token = getSToken();
  return path + `?quesId=${props.quesId}&semesterLeveCode=${props.semesterLeveCode}&token=${token}`;
});

async function registerComponents() {
  const { status, data } = await getCWXSignature();
  if (status === 200) {
    const { signature, appId, nonceStr, timestamp } = data;
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
      appId, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名
      jsApiList: ["chooseImage", "previewImage"], // 必填，需要使用的JS接口列表
      openTagList: ["wx-open-launch-weapp"], // 可选，需要使用的开放标签列表
    });

    wx.error(() => {
      console.log("error");
    });

    wx.ready(() => {
      console.log("ready");
    });
  }
}

function jump() {
  launchMiniProgram({
    appId: username,
    path: `/${queryPath.value}`,
  });
}
function handleToast() {
  showToast("动画游戏观看完成后，才可以解锁练一练哦");
}

onMounted(async () => {
  loading.value = true;
  await registerComponents();
  loading.value = false;
});
</script>

<template>
  <div class="jump">
    <wx-open-launch-weapp
      v-if="isFinish && !isApp"
      :id="queryPath"
      style="display: inline-block; border: none"
      :username="username"
      :path="queryPath"
      :extra-data="extraData"
    >
      <component v-bind:is="'script'" type="text/wxtag-template">
        <div style="display: flex; flex-direction: column; align-items: center">
          <img
            src="https://app-resources-luojigou.luojigou.vip/FjONELpanlJjuAaIMZkO-vudduD6"
            alt=""
            style="margin-bottom: 3px; display: block; width: 27px; height: 27px; object-fit: cover"
          />
          <span
            style="
              height: 14px;
              font-size: 10px;
              font-family:
                PingFangSC-Regular,
                PingFang SC,
                serif;
              font-weight: 400;
              color: #fa6400;
              line-height: 14px;
            "
          >
            练一练
          </span>
        </div>
        <!--练一练-->
      </component>
    </wx-open-launch-weapp>
    <template v-else-if="isFinish && isApp">
      <div style="display: flex; flex-direction: column; align-items: center" @click="jump">
        <img
          src="https://app-resources-luojigou.luojigou.vip/FjONELpanlJjuAaIMZkO-vudduD6"
          alt=""
          style="margin-bottom: 3px; display: block; width: 27px; height: 27px; object-fit: cover"
        />
        <span
          style="
            height: 14px;
            font-size: 10px;
            font-family:
              PingFangSC-Regular,
              PingFang SC,
              serif;
            font-weight: 400;
            color: #999;
            line-height: 14px;
          "
        >
          练一练
        </span>
      </div>
    </template>
    <template v-else>
      <div style="display: flex; flex-direction: column; align-items: center" @click="handleToast">
        <img
          src="https://app-resources-luojigou.luojigou.vip/Ft6O3xstCti6HUvkBM7jAwkGuiU3"
          alt=""
          style="margin-bottom: 3px; display: block; width: 27px; height: 27px; object-fit: cover"
        />
        <span
          style="
            height: 14px;
            font-size: 10px;
            font-family:
              PingFangSC-Regular,
              PingFang SC,
              serif;
            font-weight: 400;
            color: #999;
            line-height: 14px;
          "
        >
          练一练
        </span>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
