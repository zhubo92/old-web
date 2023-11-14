<script setup lang="ts">
import { Icon as VanIcon, Switch as VanSwitch } from "vant";
import { computed, onMounted, ref } from "vue";
import type { IPunchCourse } from "@/types/punch";
import { defaultPunchCourse } from "@/types/punch";

const emit = defineEmits<{
  (e: "jumpPage", val: string): void;
}>();

const props = withDefaults(
  defineProps<{
    info: IPunchCourse;
  }>(),
  {
    info: () => defaultPunchCourse(),
  },
);

const value = ref(0);

const info = computed(() => props.info);

const showDailyRemind = computed(() => {
  return !!info.value;
});
const isDailyRemind = computed(() => {
  return info.value && info.value.isDailyRemind === 1;
});

function handleTop() {
  const top = 10;
  // 滚动条滚动时，距离顶部的距离
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  value.value = scrollTop > top ? 1 : scrollTop === 0 ? 0 : scrollTop / top;
}

onMounted(() => {
  handleTop();
  window.onscroll = () => {
    handleTop();
  };
});
</script>

<template>
  <div class="hc" :style="{ background: `rgba(255,255,255, ${value})` }">
    <!--返回键-->
    <VanIcon class="hc-back" size="22" name="arrow-left" @click="emit('jumpPage', 'returnPrev')" />

    <!--右上角提醒-->
    <div v-if="showDailyRemind" class="hc-remind fc" @click="emit('jumpPage', 'checkinUserNotify')">
      <div class="hc-remind-text fc">每日提醒</div>
      <VanSwitch v-model="isDailyRemind" active-color="#FF7046" size="15px" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hc {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 81px;
  overflow: hidden;

  &-back {
    position: absolute;
    top: 56px;
    left: 12px;
  }

  &-remind {
    position: absolute;
    top: 56px;
    right: 17px;

    &-text {
      margin-right: 4px;
      height: 18px;
      font-size: 13px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #dd7a45;
      //line-height: 18px;
    }

    ::v-deep(.van-switch__node) {
      transition:
        0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05),
        -webkit-transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
      transform: translateY(-1px);
    }

    ::v-deep(.van-switch--on .van-switch__node) {
      transform: translate(1em, -1px);
    }
  }
}
</style>
