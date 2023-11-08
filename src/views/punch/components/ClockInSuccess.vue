<script setup lang="ts">
import { Overlay as VanOverlay } from "vant";
import { computed } from "vue";

const staticImg = Object.freeze({
  luojigou: "https://img.luojigou.vip/FlOyqh9X44NSO2BiOhQr8S76g4tN",
  bgi: "https://img.luojigou.vip/FrKoVLjTaxJ5A5ZsaHIJgLMvusiF",
});

const props = withDefaults(
  defineProps<{
    show: boolean;
  }>(),
  {
    show: false,
  },
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const show = computed(() => props.show);
</script>

<template>
  <VanOverlay :show="show" :z-index="20" :lock-scroll="false" @click="emit('close')">
    <div class="cis" :style="{ backgroundImage: `url(${staticImg.bgi})` }" @click.stop>
      <img :src="staticImg.luojigou" alt="" class="cis-img" />
      <div class="cis-quit fc" @click="emit('close')">退出</div>
      <div class="cis-look fc" @click="emit('close')">查看打卡详情</div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
.cis {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 268px;
  height: 239px;
  //background: linear-gradient(180deg, #FFE7C8 0%, #FFFFFF 100%);
  //border-radius: 20px;
  background: no-repeat bottom/cover;

  &-img {
    position: absolute;
    top: 0;
    left: 96px;
    width: 80px;
    height: 119px;
    object-fit: contain;
  }

  &-quit {
    position: absolute;
    bottom: 20px;
    left: 23px;
    width: 81px;
    height: 40px;
    background: #efefef;
    border-radius: 25px;
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #999999;
  }

  &-look {
    position: absolute;
    bottom: 20px;
    right: 23px;
    width: 116px;
    height: 40px;
    background: linear-gradient(306deg, #ff9400 0%, #ff7a38 100%);
    border-radius: 25px;
    font-size: 14px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
