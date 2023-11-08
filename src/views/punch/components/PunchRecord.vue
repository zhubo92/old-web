<script setup lang="ts">
import type { IPunchRecord } from "@/types/punch";
import { computed } from "vue";

const logo = "https://img.luojigou.vip/Fg0SNaFJoOapX2bPgzCvUqoIqdOi";

const props = withDefaults(
  defineProps<{
    list: IPunchRecord[];
  }>(),
  {
    list: () => [],
  },
);

const emit = defineEmits<{
  (e: "jumpPage", mode: string): void;
}>();

const list = computed<IPunchRecord[]>(() => props.list);
</script>

<template>
  <div class="pr">
    <div class="pr-title">打卡记录</div>

    <template v-if="list.length !== 0">
      <div v-for="item in list" :key="item.id" class="pr-item fc">
        <img :src="item.itemImg" alt="" class="pr-item-cover" />
        <div class="pr-item-right">
          <div class="pr-item-right-time">{{ item.chockInTime }}</div>
          <div class="pr-item-right-name">{{ item.itemName }}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <img :src="logo" alt="" class="pr-logo" />
      <div class="pr-text fc">暂时没有历史记录哦~</div>
      <div class="pr-btn fc" @click="emit('jumpPage', 'goPunch')">去打卡</div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.pr {
  margin-top: -20px;
  padding: 20px 16px 36px;
  width: 100%;
  background: #ffffff;
  //box-shadow: 0 6px 11px 4px rgba(113,113,113,0.02);
  border-radius: 22px;
  box-sizing: border-box;
  overflow: hidden;

  &-title {
    height: 29px;
    font-size: 21px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 29px;
  }

  &-item {
    margin: 18px auto 0;
    width: 343px;
    height: 87px;
    background: #ffffff;
    box-shadow: 0px 5px 30px 0px rgba(159, 159, 159, 0.24);
    border-radius: 16px;

    &-cover {
      width: 94px;
      height: 53px;
      object-fit: cover;
      border-radius: 10px;
    }

    &-right {
      margin-left: 20px;

      &-time {
        width: 179px;
        height: 24px;
        font-size: 17px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
      }

      &-name {
        margin-top: 5px;
        width: 197px;
        height: 17px;
        font-size: 12px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 17px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  &-logo {
    margin: 41px auto 0;
    width: 158px;
    height: 110px;
    object-fit: cover;
  }

  &-text {
    margin-top: 21px;
    height: 20px;
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
  }

  &-btn {
    margin: 16px auto 127px;
    width: 114px;
    height: 43px;
    border-radius: 25px;
    border: 1px solid #0b57c7;
    font-size: 18px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #0b57c7;
  }
}
</style>
