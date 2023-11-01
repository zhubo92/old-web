<script setup lang="ts">
import { defaultCourseDetail } from "@/types/course";
import type { ICourseDetail } from "@/types/course";
import { computed } from "vue";

const tag = "https://img.luojigou.vip/Fqd4fZoTMA2ID8m7Oy4fAfU431rG";

const props = withDefaults(defineProps<{ info: ICourseDetail }>(), {
  info: () => defaultCourseDetail(),
});

const emit = defineEmits<{
  (e: "buy"): void;
}>();

const info = computed(() => {
  return props.info;
});
</script>

<template>
  <div class="bottom-btn bb">
    <div class="bb-buy fc" @click="emit('buy')">
      <div v-if="info.price" class="bb-buy-sign">￥</div>
      <div class="bb-buy-price">{{ info.price }}</div>
      <del v-if="info.markingPrice && info.markingPrice !== info.price" class="bb-buy-markingPrice">
        ¥{{ info.markingPrice }}
      </del>
      <div class="bb-buy-text">立即购买</div>
      <div class="bb-buy-tag" :style="{ backgroundImage: `url(${tag})` }">优惠价</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bb {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 19;
  width: 100vw;
  height: 76px;
  background-color: #fff;
  box-shadow: 0px -3px 28px 0px rgba(119, 119, 119, 0.1);

  &-buy {
    position: relative;
    margin: 10px auto 0;
    width: 343px;
    height: 46px;
    background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
    border-radius: 23px;
    text-align: center;

    &-sign {
      margin-top: 7px;
      height: 24px;
      font-size: 17px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 24px;
    }

    &-price {
      margin-right: 2px;
      height: 37px;
      font-size: 26px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 37px;
    }

    &-markingPrice {
      margin-top: 10px;
      height: 18px;
      font-size: 13px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 18px;
    }

    &-text {
      margin-left: 8px;
      line-height: 46px;
      font-size: 18px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 550;
      color: #ffffff;
    }

    &-tag {
      padding-top: 4px;
      position: absolute;
      top: -20px;
      right: 12px;
      width: 67px;
      height: 31px;
      z-index: 10;
      background: no-repeat center/contain;
      font-size: 13px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 500;
      color: #ff6500;
      box-sizing: border-box;
    }
  }
}
</style>
