<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getToken } from "@/utils";

const staticImg = {
  bgi: "https://app-resources-luojigou.luojigou.vip/FqkgUTdpw5wvCIlvhZUsjHyoSJHi",
  receiveScs: "https://app-resources-luojigou.luojigou.vip/FlkBfJoEdq0g44hLwSCFtqAbrQpN",
  item1: "https://img.luojigou.vip/FuOFaOP7m55zy-k_opaBlxOi17dQ",
  item2: "https://img.luojigou.vip/FhoH9XL1bIZKuOACKbgP3LRFxKNb",
  code0: "https://img.luojigou.vip/Fv1h1rWl8MW6XJKBCkDxlvjJsMOo", // 加群
  code1: "https://img.luojigou.vip/FvgUUnyO0j3TD3k258WcSgeO-UuB", // 果果老师
};

const router = useRouter();
const route = useRoute();
const { mode, id } = route.query;

const path = ref("/home/MyCourse");

const code = computed(() => {
  return mode === "1" ? staticImg.code1 : staticImg.code0;
});

function look() {
  router.push(path.value);
}

onMounted(async () => {
  await getToken();
  path.value = `/courseDetail?id=${id}&mode=luojigou`;
});
</script>

<template>
  <div class="ARGamePaySuccess" :style="{ backgroundImage: `url(${staticImg.bgi})` }">
    <img :src="staticImg.receiveScs" alt="" class="logo" />
    <div class="look" @click="look">查看课程</div>
    <img :src="staticImg.item1" alt="" />
    <div class="item2">
      <img :src="staticImg.item2" alt="" />
      <img :src="code" alt="" class="code" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ARGamePaySuccess {
  width: 100vw;
  min-height: 100vh;
  background-size: 100%;
  overflow: hidden;

  img {
    margin: 0 auto 6px;
    display: block;
    width: 331px;
  }

  .logo {
    margin-top: 30px;
    //margin-bottom: 24px;
    width: 166px;
    height: 32px;
  }

  .look {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 6px auto 12px;
    width: 91px;
    height: 28px;
    line-height: 28px;
    background: rgba(255, 255, 255, 0.33);
    border-radius: 14px;
    border: 1px solid #ffffff;
    font-size: 13px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }

  .item2 {
    position: relative;
    overflow: hidden;

    img {
      margin-bottom: 0;
    }

    .code {
      position: absolute;
      top: 76px;
      left: 50%;
      transform: translateX(-50%);
      width: 205px;
      height: 204px;
    }
  }
}
</style>
