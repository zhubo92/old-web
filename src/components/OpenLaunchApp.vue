<script lang="ts" setup>
import { ref } from "vue";

interface IProps {
  appid?: string;
  extinfo?: string;
  apkName?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  // wxe87236d542cd0f94 逻辑狗思维教育公众号 zaojiao.net 请求code
  // wxd61f929a1c72280a 思维魔法学堂公众号 luojigou.vip 请求code

  // wxeb44a864bdd935be zaojiao.net 打开app
  // wxf6e96c65ba6116d4 luojigou.vip 打开app

  appid: "wxeb44a864bdd935be",
  extinfo: "",
  apkName: "com.zaojiao.app",
});

const launchBtnRef = ref();

const handleReadyFn = () => {
  launchBtnRef.value.addEventListener("launch", function () {
    console.log("launch");
  });

  launchBtnRef.value.addEventListener("error", function (e: any) {
    console.log("error:", e.detail);
    window.location.href = `https://sj.qq.com/myapp/detail.htm?apkName=${props.apkName}`;
  });
};
</script>

<template>
  <wx-open-launch-app
    ref="launchBtnRef"
    :appid="props.appid"
    :extinfo="props.extinfo"
    @ready="handleReadyFn"
  >
    <component v-bind:is="'script'" type="text/wxtag-template">
      <slot></slot>
    </component>
  </wx-open-launch-app>
</template>

<style></style>
