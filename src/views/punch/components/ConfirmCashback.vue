<script setup lang="ts">
import { Overlay as VanOverlay } from "vant";
import { computed } from "vue";

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
  (e: "jumpPage", page: string): void;
}>();

const show = computed(() => props.show);
</script>

<template>
  <VanOverlay :show="show" :z-index="20" :lock-scroll="false" @click="emit('close')">
    <div class="cbm" @click.stop>
      <div class="cbm-text">是否发起提现申请</div>
      <div class="cbm-btns fc">
        <div class="fc" @click="emit('jumpPage', 'confirm')">确定</div>
        <div class="fc" @click="emit('close')">取消</div>
      </div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
.cbm {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 273px;
  height: 149px;
  background: #ffffff;
  border-radius: 20px;

  &-text {
    position: absolute;
    top: 34px;
    left: 0;
    width: 100%;
    height: 22px;
    font-size: 16px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
    text-align: center;
  }

  &-btns {
    position: absolute;
    bottom: 24px;
    left: 0;
    width: 100%;
    height: 34px;

    .fc {
      width: 85px;
      height: 34px;
      background: #efefef;
      border-radius: 20px;
      font-size: 14px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #999999;
    }

    :first-child {
      margin-right: 23px;
      width: 85px;
      height: 34px;
      background: #0b57c7;
      border-radius: 20px;
      font-size: 14px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
</style>
