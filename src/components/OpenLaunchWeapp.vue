<script lang="ts" setup>
import { ref } from "vue";

interface IProps {
  username?: string;
  path?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  // 小程序原始id
  username: "gh_fbe5ebf0c69e",
  path: "/pages/contact/index",
});

const launchBtnRef = ref();

const handleReadyFn = () => {
  launchBtnRef.value.addEventListener("launch", function () {
    console.log("launch");
  });

  launchBtnRef.value.addEventListener("error", function (e: any) {
    console.log("error:", e.detail);
  });
};
</script>

<template>
  <wx-open-launch-weapp
    ref="launchBtnRef"
    :username="props.username"
    :path="props.path"
    @ready="handleReadyFn"
  >
    <component v-bind:is="'script'" type="text/wxtag-template">
      <slot></slot>
    </component>
  </wx-open-launch-weapp>
</template>

<style></style>
