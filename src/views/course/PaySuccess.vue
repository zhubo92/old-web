<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getToken } from "@/utils";
import { useRouter } from "vue-router";
import GetPunchRemind from "@/views/course/components/GetPunchRemind.vue";

const router = useRouter();

const success = "https://app-resources-luojigou.luojigou.vip/Fs9KKifZAcS1OxRyRxQtfIsiswJt";
const text1 = "https://app-resources-luojigou.luojigou.vip/FkiD290pHo5I1LIZTQqKk_G20rh7";
const text2 = "https://app-resources-luojigou.luojigou.vip/FhwQsW0hnBa-2cQoeGSWKr2JHRor";
const code = "https://app-resources-luojigou.luojigou.vip/Fo3UxpYP1Pqpdj7HPeOIsXTiAaA1";
const show = ref(false);

function lookMyCourse() {
  router.replace("/home/MyCourse");
}

onMounted(async () => {
  await getToken();
});
</script>

<template>
  <div class="success">
    <div class="top">
      <img :src="success" alt="" class="logo" />
      <div class="text" @click="lookMyCourse">查看我的课程</div>
    </div>

    <div class="bottom">
      <img :src="text1" class="text1" alt="" />
      <img :src="code" class="code" alt="" />
      <img :src="text2" class="text2" alt="" />
    </div>

    <GetPunchRemind :show="show" @close="show = false" />
  </div>
</template>

<style scoped lang="scss">
.success {
  width: 100vw;
  height: 100vh;
  background-color: #fafafa;
  overflow: hidden;

  img {
    margin: 0 auto;
    display: block;
    object-fit: cover;
  }

  .top {
    margin: 10px auto 10px;
    width: 343px;
    height: 184px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.81);
    border-radius: 10px;
    overflow: hidden;

    .logo {
      margin: 46px auto 26px;
      width: 152px;
      height: 24px;
    }

    .text {
      margin: 0 auto;
      width: 158px;
      height: 48px;
      line-height: 48px;
      font-size: 16px;
      font-family:
        PingFangSC-Medium,
        PingFang SC;
      font-weight: 550;
      color: #0b57c7;
      border-radius: 8px;
      border: 1px solid #0b57c7;
      text-align: center;
    }
  }

  .bottom {
    margin: 0 auto;
    width: 343px;
    height: 322px;
    background: #ffffff;
    box-shadow: 0px 4px 19px 4px rgba(231, 237, 241, 0.81);
    border-radius: 10px;
    overflow: hidden;

    .text1 {
      margin: 25px auto 20px;
      width: 324px;
      height: 24px;
    }

    .code {
      width: 172px;
      height: 172px;
    }

    .text2 {
      margin-top: 16px;
      width: 208px;
      height: 44px;
    }
  }
}
</style>
