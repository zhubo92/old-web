<script setup lang="ts">
import { Overlay as VanOverlay } from "vant";
import { defaultGroupDetail, IGroupDetail } from "@/types/group";
import { ref } from "vue";

const bgi = "https://app-resources-luojigou.luojigou.vip/FoQ8qGT6A1pQj5r8CBvW4a8cq87G";
const closeBtn = "https://app-resources-luojigou.luojigou.vip/FkoojZp_ypFfrvvegOJgvofYIi0c";
const weixin = "https://app-resources-luojigou.luojigou.vip/Fvu76BuRj6-hgWY-2FnFUYebEYls";
const poster = "https://app-resources-luojigou.luojigou.vip/Fm_9OasnFEhw_3lr3e4SRH5LZBhM";
const paySuccessBtn = "https://app-resources-luojigou.luojigou.vip/FnphDX_3VmBDXHB08UUJqUn5vp6p";

const props = withDefaults(
  defineProps<{
    show: boolean;
    info: IGroupDetail;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  }>(),
  {
    show: false,
    info: () => defaultGroupDetail(),
    days: "0",
    hours: "0",
    minutes: "0",
    seconds: "0",
  },
);

const emit = defineEmits<{
  (e: "close"): void;
  (e: "jumpPage", page: string, type: number): void;
}>();

const show = ref(props.show);
const info = ref(props.info);
const days = ref(props.days);
const hours = ref(props.hours);
const minutes = ref(props.minutes);
const seconds = ref(props.seconds);
</script>

<template>
  <VanOverlay :show="show" z-index="20" @click="emit('close')">
    <div class="modal-container">
      <div class="pay-success" :style="{ backgroundImage: `url(${bgi})` }">
        <div class="pay-success-time">
          <div>时间仅剩</div>
          <span>{{ days }}</span
          >天 <span>{{ hours }}</span
          >:<span>{{ minutes }}</span
          >:<span>{{ seconds }}</span>
        </div>

        <div v-if="info.product" class="pay-success-text">
          <img :src="paySuccessBtn" alt="" />
          <span>已支付{{ info.payMoney || info.product.activityPrice }}元</span>
        </div>

        <div class="pay-success-remark">离拼团成功之差最后一步：<span>分享到群</span></div>

        <div class="pay-success-share">
          <div class="pay-success-share-item" @click="emit('jumpPage', 'shareGroup', 1)">
            <div class="pay-success-share-item-label">戳我分享</div>
            <img :src="weixin" alt="" />
            <div class="pay-success-share-item-text">分享到群</div>
          </div>
          <div class="pay-success-share-item" @click="emit('jumpPage', 'shareGroup', 0)">
            <img :src="poster" alt="" />
            <div class="pay-success-share-item-text">领取海报</div>
          </div>
        </div>

        <div class="pay-success-footer">
          分享到<span>{{ info.needUser }}</span
          >个群，成功率提升100%
        </div>
      </div>

      <img :src="closeBtn" alt="" class="closeBtn" />
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;

  img {
    display: block;
    object-fit: cover;
  }

  .pay-success {
    width: 343px;
    height: 308px;
    border-radius: 20px;
    background-repeat: no-repeat;
    background-size: 100%;
    background-color: #fff;
    overflow: hidden;

    &-time {
      margin: 32px auto 29px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 17px;
      font-size: 12px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 550;
      color: #fff;
      line-height: 17px;

      div {
        margin-right: 10px;
        height: 22px;
        font-size: 16px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 22px;
      }

      span {
        display: block;
        //padding: 0 7px;
        margin: 0 2px;
        width: 24px;
        height: 22px;
        line-height: 22px;
        background: rgba(255, 250, 248, 0.9);
        box-shadow: inset 0px 0px 6px 0px rgba(255, 102, 102, 0.2);
        border-radius: 4px;
        font-size: 16px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ff5140;
        text-align: center;
      }
    }

    &-text {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 19px;

      img {
        margin-right: 9px;
        width: 22px;
        height: 22px;
      }

      span {
        display: block;
        height: 33px;
        font-size: 24px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC;
        font-weight: 600;
        color: #ff3d3d;
        line-height: 33px;
      }
    }

    &-remark {
      margin-bottom: 20px;
      height: 21px;
      font-size: 15px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 21px;
      text-align: center;

      span {
        color: #ff1a1a;
      }
    }

    &-share {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;

      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        &-label {
          position: absolute;
          top: -13px;
          right: -49px;
          width: 66px;
          height: 24px;
          line-height: 24px;
          background: #ffeb5e;
          border-radius: 14px 14px 14px 0;
          font-size: 12px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #ff4846;
          border: 1px solid #ffffff;
          text-align: center;
        }

        img {
          margin-bottom: 6px;
          width: 50px;
          height: 50px;
        }

        &-text {
          height: 17px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 17px;
        }
      }

      .pay-success-share-item + .pay-success-share-item {
        margin-left: 83px;
      }
    }

    &-footer {
      height: 17px;
      font-size: 12px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 17px;
      text-align: center;

      span {
        color: #ff3d3d;
      }
    }
  }

  .closeBtn {
    margin: 25px auto 0;
    width: 24px;
    height: 25px;
  }
}
</style>
