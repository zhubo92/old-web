<script setup lang="ts">
import { Overlay as VanOverlay } from "vant";
import { computed } from "vue";
import { shareToWechatWeb } from "@/utils";

const list = [
  // {
  //   id: 0,
  //   img: "https://app-resources-luojigou.luojigou.vip/Fiw_lSVEtPzIP1HtdZlutrnC0_eo",
  //   text: '保存图片'
  // },
  {
    id: 0,
    img: "https://app-resources-luojigou.luojigou.vip/Fr9CyE_SldABDGhxGGExMsRyPdvS",
    text: "微信好友",
  },
  {
    id: 1,
    img: "https://app-resources-luojigou.luojigou.vip/Fkuk1Tn82qN2WVL83MM7nZy1cGQs",
    text: "朋友圈",
  },
];

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

function share(id: number) {
  shareToWechatWeb(id);
  emit("close");
}
</script>

<template>
  <VanOverlay :show="show" z-index="20" @click="emit('close')">
    <div class="share-poster-modal" @click.stop>
      <div class="share-poster-modal-title">分享至</div>
      <div class="share-poster-modal-list">
        <div
          v-for="item in list"
          :key="item.id"
          class="share-poster-modal-list-item"
          @click="share(item.id)"
        >
          <img :src="item.img" alt="" class="share-poster-modal-list-item-cover" />
          <div class="share-poster-modal-list-item-text">{{ item.text }}</div>
        </div>
      </div>

      <div class="share-poster-modal-cancel" @click="emit('close')">取消</div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
img {
  display: block;
  object-fit: cover;
}

.share-poster-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 216px;
  background: #ffffff;
  border-radius: 24px 24px 0px 0px;
  overflow: hidden;

  &-title {
    margin-top: 20px;
    margin-bottom: 10px;
    height: 23px;
    font-size: 16px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    text-align: center;
  }

  &-list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0 auto;
    padding-bottom: 16px;
    width: 343px;
    border-bottom: 1px solid #eeeeee;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      &-cover {
        margin-bottom: 9px;
        width: 55px;
        height: 55px;
      }

      &-text {
        height: 19px;
        font-size: 13px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
      }
    }
  }

  &-cancel {
    flex: 1;
    padding-top: 10px;
    //height: 21px;
    font-size: 15px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 21px;
    text-align: center;
  }
}

.share-poster {
  position: fixed;
  bottom: 254px;
  left: 50%;
  transform: translateX(-50%);
  width: 260px;
  height: 418px;
  background: linear-gradient(320deg, #fb646d 0%, #ff4d46 100%);
  border-radius: 20px;
}
</style>
