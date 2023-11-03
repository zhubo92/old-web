<script setup lang="ts">
import { Overlay as VanOverlay } from "vant";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    show: boolean;
    rules?: string | null;
  }>(),
  {
    show: false,
    rules:
      "1.每日可解锁一节课程，点击进行观看。\n2.每日完成解锁视频的完整播放并且分享到任意位置（微信好友、朋友圈）后自动打卡成功。\n3.在规定的时间内完成打卡任务后，返还全部学费；如果支付时使用的魔法币支付的将返还魔法币。\n4.返现金额以购课实际支付金额为准。\n5.提现申请时间为达成打卡目标后的14天内，超时未提现请联系客服。",
  },
);

const bgi = "https://img.luojigou.vip/FnQ9R4z_68PkkzLovnbzLo-oWtq_";
const closeBtn = "https://img.luojigou.vip/Frdez22QJTY1OMk5Uwb4HNqjf_Cj";
const defaultText =
  "1.每日可解锁一节课程，点击进行观看。\n2.每日完成解锁视频的完整播放并且分享到任意位置（微信好友、朋友圈）后自动打卡成功。\n3.在规定的时间内完成打卡任务后，返还全部学费；如果支付时使用的魔法币支付的将返还魔法币。\n4.返现金额以购课实际支付金额为准。\n5.提现申请时间为达成打卡目标后的14天内，超时未提现请联系客服。";

const textArr = computed(() => {
  if (props.rules) {
    const arr = props.rules.replace(/\n/g, "<br />").split("<br />");
    return arr;
  } else {
    const arr = defaultText.replace(/\n/g, "<br />").split("<br />");
    return arr;
  }
});
</script>

<template>
  <VanOverlay :show="show" :z-index="20" :lock-scroll="false" @click="$emit('close')">
    <div class="rules" @click.stop>
      <div class="rules-container">
        <img :src="bgi" alt="" class="rules-container-bgi" />
        <div class="rules-container-text">
          <div v-for="(text, textIndex) in textArr" :key="textIndex">
            {{ text }}
          </div>
        </div>
        <div class="rules-container-bottom fc">
          <div class="rules-container-bottom-btn fc" @click="$emit('close')">我知道了</div>
        </div>
      </div>
      <img :src="closeBtn" alt="" class="rules-close" @click="$emit('close')" />
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
.rules {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;

  &-container {
    position: relative;
    width: 273px;
    height: 400px;
    background: no-repeat top/contain #ffffff;
    border-radius: 20px;
    overflow: hidden;

    &-bgi {
      display: block;
      width: 100%;
      object-fit: contain;
    }

    &-text {
      height: 229px;
      overflow: scroll;

      div {
        margin: 0 auto;
        width: 229px;
        font-size: 13px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        //white-space: pre-wrap;
      }

      div + div {
        margin-top: 11px;
      }
    }

    &-bottom {
      //position: absolute;
      //bottom: 0;
      //left: 0;
      width: 100%;
      height: 68px;
      background: #ffffff;
      border-radius: 0 0 20px 20px;

      &-btn {
        width: 229px;
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
  }

  &-close {
    display: block;
    margin: 20px auto 0;
    width: 35px;
    height: 34px;
  }
}
</style>
