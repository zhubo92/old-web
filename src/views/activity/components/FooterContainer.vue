<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const props = withDefaults(
  defineProps<{
    mode: string;
  }>(),
  {
    mode: "tab",
  },
);
const route = useRoute();

const boxHeight = ref(0);
const scrollTop = ref(0);

const mode = computed(() => props.mode);
const permission = computed(() => {
  return route.name === "GameCourse";
});

function listenPage() {
  document.addEventListener("scroll", (e) => {
    if (permission.value && history.length > 1) {
      const old = scrollTop.value;
      scrollTop.value = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop.value < 10) {
        setHeight(true);
      } else if (scrollTop.value - old > 5) {
        setHeight(false);
      } else if (old - scrollTop.value > 5) {
        setHeight(true);
      }
    }
  });
}
// 根据路由栈长度，判断微信是否出现底部白色操作栏
function changeHeight() {
  setHeight(history.length > 1);
}
function setHeight(isSmall = true) {
  if (mode.value === "course") {
    if (isSmall) {
      boxHeight.value = 76;
    } else {
      boxHeight.value = 87;
    }
  } else if (mode.value === "game") {
    if (isSmall) {
      boxHeight.value = 87;
    } else {
      boxHeight.value = 96;
    }
  } else {
    if (isSmall) {
      boxHeight.value = 55;
    } else {
      boxHeight.value = 87;
    }
  }
}

onMounted(() => {
  changeHeight();
  listenPage();
});
</script>

<template>
  <div class="footers">
    <!--占位置用的-->
    <div class="footers-box" :style="{ height: `${boxHeight}px` }"></div>
    <!--主要内容-->
    <div class="footers-container" :style="{ height: `${boxHeight}px` }">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footers {
  &-box {
    width: 100vw;
    background-color: #fafafa;
  }

  &-container {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100vw;
    background-color: #fff;
    box-shadow: 0px -3px 28px 0px rgba(119, 119, 119, 0.1);
    //overflow: hidden;
  }
}
</style>
