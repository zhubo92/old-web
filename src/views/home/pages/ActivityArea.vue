<script setup lang="ts">
import { getToken, registerWxOpenLaunchApp, wxUpdateAppMessageShareData } from "@/utils";
import EnterApp from "@/views/home/components/EnterApp.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";

const activityList = [
  // 邀请有奖
  {
    id: 0,
    img: "https://app-resources-luojigou.luojigou.vip/FupDgyTmMZxqzdMYP-FXzMoPugDp",
    path: "/invite/InviteHavePrize",
  },
  // 课程包
  // {
  //   id: 1,
  //   img: "https://app-resources-luojigou.luojigou.vip/FrztgpDT_1TndJ9jZ8dhL-fvGgVE",
  //   path: '/invite/coursePackage?id=1549573772350865409'
  // },
  // 拼团活动
  {
    id: 2,
    img: "https://app-resources-luojigou.luojigou.vip/FmeAYQyeM2Ez2F0GDemvQbUlh8iX",
    path: "/group/GroupActivity",
  },
  // 0元打卡
  {
    id: 3,
    img: "https://img.luojigou.vip/FoLs_LTEfEIH2aYY1qFDgDYrg9Rh",
    path: "/punch",
  },
];

const router = useRouter();

const { loading } = storeToRefs(useAppStore());
function jumpPage(path: string) {
  router.push(path);
}

onMounted(async () => {
  loading.value = true;
  await getToken();
  await registerWxOpenLaunchApp(() => {
    wxUpdateAppMessageShareData();
  });
  loading.value = false;
});
</script>

<template>
  <div class="activity">
    <img
      v-for="img in activityList"
      :key="img.id"
      :src="img.img"
      class="activity-img"
      alt=""
      @click="jumpPage(img.path)"
    />

    <!--底部跳转app-->
    <EnterApp />
  </div>
</template>

<style scoped lang="scss">
.activity {
  min-height: 100vh;
  background-color: #fafafa;
  overflow: hidden;

  .activity-img {
    display: block;
    margin: 20px auto 0;
    width: 343px;
    height: 156px;
    object-fit: cover;
    border-radius: 20px;
  }
}
</style>
