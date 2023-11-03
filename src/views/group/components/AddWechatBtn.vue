<script setup lang="ts">
import { isWeixinBrowser, launchMiniProgram, registerWxOpenLaunchApp } from "@/utils";
import { onMounted } from "vue";
import { getCWXSignature } from "@/api/user";
import OpenLaunchWeapp from "@/components/OpenLaunchWeapp.vue";

const isApp = !isWeixinBrowser();
const username = "gh_fbe5ebf0c69e"; // 所需跳转的小程序原始id
const path = "/pages/contact/index"; // 路径

function jump() {
  launchMiniProgram({
    appId: username,
    path: path,
  });
}

onMounted(() => {
  registerWxOpenLaunchApp(() => {}, getCWXSignature, ["chooseImage"], ["wx-open-launch-weapp"]);
});
</script>

<template>
  <div class="add-wechat-btn">
    <div v-if="isApp" class="add-wechat-btn-box" @click="jump">点此添加老师微信</div>
    <div v-else>
      <OpenLaunchWeapp :username="username" :path="path">
        <div
          style="
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
          "
        >
          点此添加老师微信
        </div>
      </OpenLaunchWeapp>
    </div>
  </div>
</template>

<style scoped lang="scss">
.add-wechat-btn {
  &-box {
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
}
</style>
