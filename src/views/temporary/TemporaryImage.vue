<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getImageUrl } from "@/utils";

const list = [
  {
    id: 0,
    title: "服务用户协议",
    url: [
      getImageUrl("img0_1"),
      getImageUrl("img0_2"),
      getImageUrl("img0_3"),
      getImageUrl("img0_4"),
    ],
  },
  {
    id: 1,
    title: "逻辑狗会员自动续费服务协议",
    url: [getImageUrl("img1_1"), getImageUrl("img1_2"), getImageUrl("img1_3")],
  },
  {
    id: 2,
    title: "用户隐私协议",
    url: [
      getImageUrl("img2_1"),
      getImageUrl("img2_2"),
      getImageUrl("img2_3"),
      getImageUrl("img2_4"),
      getImageUrl("img2_5"),
      getImageUrl("img2_6"),
      getImageUrl("img2_7"),
    ],
  },
];

const { id } = useRoute().params;

const url = computed(() => list[Number(id)].url);
const title = computed(() => list[Number(id)].title);

onMounted(() => {
  document.title = title.value;
});
</script>

<template>
  <img v-for="(u, i) in url" :key="i" :src="u" alt="" />
</template>

<style scoped lang="scss">
img {
  width: 100%;
}
</style>
