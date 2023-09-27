<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

interface ITab {
  id: number;
  title: string;
  img: string;
  checkedImg: string;
  path: string;
}
const tabList: ITab[] = [
  {
    id: 0,
    title: "首页",
    img: "https://app-resources-luojigou.luojigou.vip/FmgI7qQkTwxtGeaI4VCstadhBCdv",
    checkedImg: "https://app-resources-luojigou.luojigou.vip/FrIUFDzrlQgXAeSsgMQ_7BV_SBpr",
    path: "/home/ActivityArea",
  },
  {
    id: 2,
    title: "逻辑狗课",
    img: "https://app-resources-luojigou.luojigou.vip/FpvupKmEOYnMC23VuiXvG5VshtIZ",
    checkedImg: "https://app-resources-luojigou.luojigou.vip/FlieeaAbfLQ0wNNjrMJDkkjIPI36",
    path: "/home/LuojigouCourse",
  },
  {
    id: 1,
    title: "我的课程",
    img: "https://app-resources-luojigou.luojigou.vip/FmvVPXbCgEmUhdaxHMT_2i2jbhrD",
    checkedImg: "https://app-resources-luojigou.luojigou.vip/FkFgyLWWcNygR0i7iyKWrQkmucNz",
    path: "/home/MyCourse",
  },
];

const router = useRouter();

// const checkedId = ref<number>(0);

const route = useRoute();
const checkedId = computed(() => {
  console.log(route.path, "path");
  return tabList.find((item) => item.path === route.path)?.id || 0;
});

function changeTab(item: ITab) {
  if (checkedId.value !== item.id) {
    router.replace(item.path);
  }
}
</script>

<template>
  <div class="tab-bar">
    <div
      :class="['tab-bar-item', checkedId === item.id ? 'checked' : '']"
      v-for="item in tabList"
      :key="item.id"
      @click="changeTab(item)"
    >
      <img :src="checkedId === item.id ? item.checkedImg : item.img" alt="" />
      <div>{{ item.title }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 55px;
  background: #ffffff;
  box-shadow: 0px -3px 28px 0px rgba(119, 119, 119, 0.1);

  .tab-bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 7px;
    box-sizing: border-box;

    img {
      display: block;
      width: 21px;
      height: 21px;
      object-fit: cover;
    }

    div {
      margin-top: 5px;
      height: 14px;
      font-size: 10px;
      font-family:
        PingFangSC-Medium,
        PingFang SC,
        serif;
      font-weight: 500;
      color: #aaa;
      line-height: 14px;
    }
  }

  .checked {
    div {
      color: #0b57c7;
    }
  }
}
</style>
