<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
function goHome() {
  router.replace("/home");
}
</script>

<template>
  <div class="not-found">
    <div class="not-found-cont">
      <div class="not-found-cont-text">页面不存在</div>
      <div class="not-found-cont-btn" @click="goHome">返回首页</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #fff;

  &-cont {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 300px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);

    &-text {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
    }

    &-btn {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      background: #ff4d4f;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>
