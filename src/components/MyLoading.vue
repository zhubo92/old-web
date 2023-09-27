<script setup lang="ts">
import { Loading as VanLoading } from "vant";
</script>

<template>
  <div class="loading flex-center">
    <VanLoading size="35px" color="#0b57c7">加载中...</VanLoading>
  </div>
</template>

<style scoped lang="scss">
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
