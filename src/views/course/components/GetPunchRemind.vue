<script setup lang="ts">
import { Overlay as VanOverlay } from "vant";
import { computed } from "vue";

const close = "https://app-resources-luojigou.luojigou.vip/FsYUqsiyptxoNjMXbkS9owmT6TNm";
const code = "https://img.luojigou.vip/Fgz6fY9wSMTynxUZxf-GdTxhrt7-";

const emit = defineEmits<{
  (event: "close"): void;
}>();

const props = withDefaults(
  defineProps<{
    show: boolean;
  }>(),
  {
    show: false,
  },
);

const show = computed(() => props.show);
</script>

<template>
  <VanOverlay :show="show" :z-index="20" :lock-scroll="false" @click="emit('close')">
    <div class="gpr" @click.stop>
      <img :src="close" alt="" class="gpr-close" @click="emit('close')" />
      <div class="gpr-code">
        <img :src="code" alt="" class="" />
      </div>
      <div class="gpr-text">扫描二维码关注服务号可以获取打卡提醒哦~</div>
      <div class="gpr-btn fc" @click="emit('close')">我知道了</div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
.gpr {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 273px;
  height: 259px;
  background: #ffffff;
  border-radius: 20px;

  &-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 13px;
    height: 13px;
  }

  &-code {
    position: absolute;
    top: 36px;
    left: 50%;
    transform: translateX(-50%);
    border: 3px solid rgba(11, 87, 199, 0.31);
    border-radius: 5px;

    img {
      width: 101px;
      height: 101px;
    }
  }

  &-text {
    position: absolute;
    bottom: 62px;
    left: 50%;
    transform: translateX(-50%);
    width: 209px;
    height: 40px;
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    text-align: center;
  }

  &-btn {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 139px;
    height: 34px;
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #ffffff;
    background: #0b57c7;
    border-radius: 20px;
  }
}
</style>
