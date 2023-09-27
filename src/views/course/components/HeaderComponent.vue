<script setup lang="ts">
import { popPage } from "@/utils";
import { computed } from "vue";

const staticImg = Object.freeze({
  share: "https://app-resources-luojigou.luojigou.vip/FqDG4Kvlv9fdU4lGJmic2sTfEOq0",
  collect: "https://app-resources-luojigou.luojigou.vip/FkUII0IQYMEuwGVcDuzAfD2Fw6zN",
  collected: "https://app-resources-luojigou.luojigou.vip/FrvXnKxq2HV7UV4GZLHMX2Rm3gwx",
});

const props = withDefaults(
  defineProps<{
    info: {
      isCollect: 1 | 0;
      name: string;
    };
  }>(),
  {
    info: () => {
      return {
        isCollect: 0,
        name: "",
      };
    },
  },
);

const emit = defineEmits<{
  (e: "handleClick", mode: string): void;
}>();

const info = computed(() => {
  return props.info;
});
</script>

<template>
  <div class="hc">
    <div class="hc-position">
      <div class="hc-position-container">
        <!--返回按钮-->
        <VanIcon class="hc-position-container-left" size="22" name="arrow-left" @click="popPage" />

        <!--页面标题-->
        <div class="hc-position-container-title">{{ info.name }}</div>

        <div class="hc-position-container-btn">
          <img
            v-if="info.isCollect === 1"
            :src="staticImg.collected"
            alt=""
            @click="emit('handleClick', 'collect')"
          />
          <img v-else :src="staticImg.collect" alt="" @click="emit('handleClick', 'collect')" />
          <img :src="staticImg.share" alt="" @click="emit('handleClick', 'share')" />
        </div>
      </div>
    </div>

    <!--占位盒子-->
    <div class="hc-placeholder"></div>
  </div>
</template>

<style scoped lang="scss">
.hc {
  &-position {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    padding-top: 44px;
    width: 100vw;
    overflow: hidden;
    box-sizing: content-box;
    background-color: #fff;

    &-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      width: 100%;
      height: 44px;
      padding: 0 16px 0 20px;

      &-title {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 232px;
        height: 25px;
        font-size: 18px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 25px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &-btn {
        display: flex;
        align-items: center;

        img {
          display: block;
          width: 21px;
          height: 21px;
          object-fit: cover;
        }

        img + img {
          margin-left: 12px;
        }
      }
    }
  }

  &-placeholder {
    width: 100vw;
    height: 88px;
  }
}
</style>
