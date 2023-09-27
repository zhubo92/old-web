<script setup lang="ts">
import { Overlay as VanOverlay } from "vant";
import { computed, nextTick, ref, watch } from "vue";
import { getUserInfo } from "@/utils/storage";
import QRCode from "qrcodejs2-fix";
import { convertToImage } from "@/utils";

interface IInfo {
  posterUrl?: string;
}

const props = withDefaults(
  defineProps<{
    show: boolean;
    info: IInfo;
    id: string;
  }>(),
  {
    show: false,
    info: () => {
      return {
        posterUrl: "",
      };
    },
    id: "1579727645455802370",
  },
);

// const posterUrl = ref("");
const qrCode = ref<any>(null);
const myCanvasUrl = ref("");
const qrCodeUrl = ref("");
const qrcodeUrl = ref("");
const qrCodeUrlRef = ref<HTMLElement | null>(null);
const myCanvasRef = ref<HTMLElement | null>(null);

const id = computed(() => {
  return props.id;
});

const show = computed(() => {
  return props.show;
});

async function makeCode() {
  qrCodeUrl.value = await convertToImage(<HTMLElement>qrCodeUrlRef.value);
  makePoster();
}

function makePoster() {
  console.log("生成海报");
  const canvas = document.getElementById("myCanvas"); // 使用id来寻找canvas元素
  if (canvas) {
    const cxt = (canvas as any).getContext("2d"); // 创建context对象

    // 取可视化区域的宽、高并设置myCanvas的宽高
    // const clientWidth = document.documentElement.clientWidth;

    const rpx = 1;

    // 开始绘制
    const dpr = window.devicePixelRatio; // 获取设备的像素比
    console.log("hel:", 305 * rpx * dpr);
    (canvas as any).width = 305 * rpx * dpr; // 设置myCanvas的宽
    (canvas as any).height = 543 * rpx * dpr; // 设置myCanvas的高
    cxt.scale(dpr, dpr);

    // 绘制一个矩形，用来做全局背景颜色
    cxt.fillStyle = "transparent";
    cxt.fillRect(0, 0, (canvas as any).width, (canvas as any).height); // fillRect方法是创建一个矩形，x坐标、y坐标、宽度、高度

    const bgiSite = {
      x: 0,
      y: 0,
      w: 305 * rpx,
      h: 543 * rpx,
    };

    const qrcodeSite = {
      x: 203 * rpx,
      y: 447 * rpx,
      w: 74 * rpx,
      h: 74 * rpx,
    };

    const bgi = new Image();
    bgi.style.fontSize = "0";
    bgi.crossOrigin = "anonymous";
    bgi.src = <string>props.info?.posterUrl; // 背景图片路径
    // bgi.src = "https://app-resources-luojigou.luojigou.vip/Ftr17DAfMlQRg6OpP7n1mC72uQ_o"; // 背景图片路径
    bgi.onload = () => {
      cxt.drawImage(bgi, bgiSite.x, bgiSite.y, bgiSite.w, bgiSite.h);

      const qrcode = new Image();
      qrcode.crossOrigin = "anonymous";
      qrcode.src = qrCodeUrl.value; // 二维码图片路径
      qrcode.onload = () => {
        cxt.drawImage(qrcode, qrcodeSite.x, qrcodeSite.y, qrcodeSite.w, qrcodeSite.h);

        convertToImage(<HTMLElement>myCanvasRef.value).then((val) => {
          myCanvasUrl.value = val;
        });
      };
    };
  }
}

function creatQrCode() {
  if (qrCodeUrlRef.value) qrCodeUrlRef.value.innerHTML = "";
  qrCode.value = new QRCode(<HTMLElement>qrCodeUrlRef.value, {
    text: qrcodeUrl.value, // 需要转换为二维码的内容
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
  });

  nextTick();
  makeCode();
}

watch(show, (val) => {
  if (val) {
    myCanvasUrl.value = "";

    const { origin, pathname } = window.location;
    try {
      const USERINFO = getUserInfo();

      qrcodeUrl.value = `${origin}${pathname}#/enlighten?id=${id.value}&unionId=${USERINFO?.unionid}`;
    } catch (err) {
      console.log("获取不到userInfo");
      qrcodeUrl.value = `${origin}${pathname}#/enlighten?id=${id.value}`;
    }

    creatQrCode();
  }
});
</script>

<template>
  <VanOverlay :show="show" @click="$emit('close')">
    <div class="modal" @click.stop>
      <!--<div v-if="!myCanvasUrl" class="modal-cont">-->
      <!--  <img src="https://app-resources-luojigou.luojigou.vip/FuTg8bcmip7h9BsoYobfKTrq4S_P"-->
      <!--       class="modal-cont-img" alt="">-->
      <div class="qrCodeUrl" ref="qrCodeUrlRef"></div>
      <!--</div>-->

      <canvas v-if="!myCanvasUrl" id="myCanvas" ref="myCanvasRef" class="invite-poster"></canvas>

      <div v-else class="modal-img">
        <img :src="myCanvasUrl" class="cvURL" alt="" />
      </div>

      <span v-if="myCanvasUrl" class="modal-text">长按海报点击转发</span>
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
  //width: 304px;
  //height: 488px;

  &-img {
    overflow: hidden;
    border-radius: 20px;
  }

  &-text {
    display: block;
    margin-top: 12px;
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
  }

  .invite-poster {
    position: absolute;
    bottom: -317px;
    right: -508px;
    z-index: -1;
    width: 305px;
    height: 543px;
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 0px;
    background-color: transparent;
  }

  .cvURL {
    display: block;
    width: 305px;
    //height: 508px;
    //object-fit: contain;
  }
}

.qrCodeUrl {
  position: absolute;
  bottom: -2000px;
  right: -2000px;
  z-index: -1;
}
</style>
