<script setup lang="ts">
import MyLoading from "@/components/MyLoading.vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";

const { loading } = storeToRefs(useAppStore());
</script>

<template>
  <MyLoading v-if="loading" />
  <RouterView />
</template>
