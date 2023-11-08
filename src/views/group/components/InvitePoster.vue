<script setup lang="ts">
import { Overlay as VanOverlay } from "vant";
import { computed, ref, watch } from "vue";
import { getUserInfo } from "@/utils/storage";
import type { IGroupDetail } from "@/types/group";
import { defaultGroupDetail } from "@/types/group";
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2-fix";
import { defaultUserInfo } from "@/types/user";
import type { IUserInfo } from "@/types/user";

const props = withDefaults(
  defineProps<{
    show: boolean;
    info: IGroupDetail;
  }>(),
  {
    show: false,
    info: () => defaultGroupDetail(),
  },
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const posterUrl = ref("");
const defaultBGI = "https://app-resources-luojigou.luojigou.vip/FjuNsfvBOqJoH46DbEaWem9cIx4M";
const userInfo = ref<IUserInfo>(defaultUserInfo());
const posterContUrl = ref("");
const qrCodeRef = ref<HTMLElement | null>(null);

const qrCodePath = computed(() => {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/group/GroupDetail?id=${info.value.createGroupId}`;
});

const show = computed(() => props.show);
const info = computed(() => props.info);

watch(show, () => {
  if (show.value) {
    posterContUrl.value = "";
    const info = getUserInfo();
    if (info) {
      userInfo.value = info;
    } else {
      userInfo.value = defaultUserInfo();
    }

    console.log(userInfo.value, "userInfo");

    creatQrCode();
  }
});

// 给二维码做适配，根据当前视口宽度
function handleSetQrCodeWidth() {
  const width = window.innerWidth;
  const eleWidth = `${(width * 65) / 375}px`;
  if (qrCodeRef.value) {
    qrCodeRef.value.style.width = eleWidth;
    qrCodeRef.value.style.height = eleWidth;
    (qrCodeRef.value.childNodes[1] as HTMLDivElement).style.width = eleWidth;
    (qrCodeRef.value.childNodes[1] as HTMLDivElement).style.height = eleWidth;
  }

  setTimeout(() => {
    makePosterCont();
  }, 500);
}
function makePosterCont() {
  console.log("PosterCont转成base64");
  // 获取想要转换的 DOM 节点
  const dom = document.getElementById("poster");
  if (dom) {
    html2canvas(dom, {
      // dpi: 300,
      // scale: 10,
      // width: dom.offsetWidth,
      // height: dom.offsetHeight,
      backgroundColor: "#FF4F4F",
      useCORS: true, // 开启跨域设置，需要后台设置cors
    }).then((canvas) => {
      // var context = canvas.getContext('2d');
      // context.mozImageSmoothingEnabled = false;
      // context.webkitImageSmoothingEnabled = false;
      // context.msImageSmoothingEnabled = false;
      // context.imageSmoothingEnabled = false;
      // toDataURL函数生成img标签的可用数据  图片格式转成 base64
      posterUrl.value = canvas.toDataURL("image/png", 1.0);

      console.log(posterUrl, "posterContUrl");
    });
  }
}
function creatQrCode() {
  console.log("开始生成code");
  if (qrCodeRef.value) {
    qrCodeRef.value.innerHTML = "";
    new QRCode(qrCodeRef.value, {
      text: qrCodePath.value, // 需要转换为二维码的内容
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
    });
  }

  handleSetQrCodeWidth();
}
</script>

<template>
  <VanOverlay :show="show" :z-index="20" @click="emit('close')">
    <div class="modal" @click.stop>
      <div v-if="info.product" class="poster" id="poster">
        <img :src="defaultBGI" class="poster-bgi" alt="" />

        <div class="poster-user">
          <div v-if="userInfo.headimgurl" class="poster-user-left">
            <img :src="userInfo.headimgurl" alt="" class="poster-user-left-logo" />
            <div v-if="info.myGroup" class="poster-user-left-label">团长</div>
          </div>

          <div v-if="userInfo.nickname" class="poster-user-name">{{ userInfo.nickname }}</div>
        </div>

        <img :src="info.product.productImage" class="poster-cover" alt="" />

        <div class="poster-remark">就差你了，拼团拿走超值商品</div>
        <div class="poster-price">
          <div class="poster-price-top">
            <div class="poster-price-top-left"><span>¥</span>{{ info.product.activityPrice }}</div>
            <div class="poster-price-top-right">{{ info.product.population }}人拼团价</div>
          </div>
          <del class="poster-price-bottom"> 原价：¥{{ info.product.originalPrice }} </del>
        </div>

        <div class="qrCode" ref="qrCodeRef"></div>
      </div>

      <img :src="posterUrl" class="posterUrl" alt="" />

      <div v-if="posterUrl" class="remark">
        <img
          src="https://app-resources-luojigou.luojigou.vip/FjsO7TiUx84NGBBx_YD4x2LUcbAI"
          alt=""
        />
        <span>长按上方图片保存并分享</span>
      </div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;

  img {
    display: block;
    object-fit: cover;
  }

  //.myCanvas {
  //  position: absolute;
  //  top: -2000px;
  //  right: -2000px;
  //}

  .poster {
    position: absolute;
    right: -500px;
    top: -500px;
    //position: relative;
    width: 320px;
    height: 514px;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #fff;

    &-bgi {
      display: block;
      width: 320px;
      height: 514px;
    }

    &-user {
      position: absolute;
      top: 27px;
      left: 15px;
      z-index: 10;
      display: flex;
      align-items: center;

      &-left {
        position: relative;

        &-logo {
          width: 36px;
          height: 36px;
          border: 1px solid #ffffff;
          border-radius: 50%;
        }

        &-label {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 15px;
          line-height: 15px;
          background-color: #ffe441;
          border-radius: 10px;
          font-size: 8px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #ffffff;
          box-sizing: border-box;
          text-align: center;
        }
      }

      &-name {
        margin-left: 4px;
        height: 11px;
        line-height: 11px;
        font-size: 11px;
        color: #fff;
      }
    }

    &-cover {
      position: absolute;
      top: 117px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: block;
      width: 224px;
      height: 137px;
      border-radius: 5px;
      object-fit: cover;
    }

    &-remark {
      position: absolute;
      bottom: 181px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      width: 100%;
      height: 18px;
      font-size: 13px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC;
      font-weight: 600;
      color: #ff5043;
      line-height: 18px;
      text-align: center;
    }

    &-price {
      position: absolute;
      bottom: 34px;
      left: 25px;
      z-index: 10;

      &-top {
        display: flex;
        align-items: center;

        &-left {
          height: 42px;
          font-size: 30px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 42px;

          span {
            font-size: 15px;
            font-family:
              PingFangSC-Semibold,
              PingFang SC;
            font-weight: 600;
            color: #ffffff;
          }
        }

        &-right {
          margin-left: 4px;
          padding: 1px 4px;
          height: 16px;
          line-height: 16px;
          background: #fde17b;
          border-radius: 100px 100px 100px 2px;
          font-size: 10px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #ff5f5f;
          box-sizing: content-box;
        }
      }

      &-bottom {
        height: 16px;
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 16px;
      }
    }

    .qrCode {
      position: absolute;
      bottom: 30px;
      right: 36px;
      z-index: 10;
      width: 65px;
      height: 65px;
    }
  }

  .posterUrl {
    width: 320px;
    border-radius: 20px;
  }

  .remark {
    margin-top: 12px;
    display: flex;
    align-items: center;
    img {
      display: block;
      width: 15px;
      height: 15px;
      object-fit: cover;
    }

    span {
      display: block;
      margin-left: 6px;
      height: 20px;
      font-size: 14px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 20px;
    }
  }
}
</style>
