<script setup lang="ts">
import { Overlay as VanOverlay, showToast } from "vant";
import { computed, ref } from "vue";
import type { IGroupDetail } from "@/types/group";
import { defaultGroupDetail } from "@/types/group";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const { path, id } = useRoute().query;

const emit = defineEmits<{
  (e: "close"): void;
}>();

const props = withDefaults(
  defineProps<{
    show: boolean;
    info: any;
  }>(),
  {
    show: false,
    info: null,
  },
);

const buyNum = ref(1);
const chosenSkuId = ref("");

const info = computed(() => props.info);
const show = computed(() => props.show);

const inventory = computed(() => {
  try {
    const item = info.value.skuInfo.filter((item) => item.id === chosenSkuId.value)[0];
    return item.count;
  } catch (err) {
    console.log(err, "inventory");
  }

  return "";
});

function goBuy() {
  console.log(path, info);
  if (!chosenSkuId.value) {
    showToast("请选择规格款式");
    return;
  }

  emit("close");

  const params =
    path === "/group/GroupCommodity"
      ? {
          activity: info.value.groupBuyActivity.groupActivityId,
          sku: chosenSkuId.value,
          count: buyNum.value,
          isGroup: 0,
        }
      : {
          activity: info.value.groupBuyActivity.groupActivityId,
          sku: chosenSkuId.value,
          groupId: id,
          count: buyNum.value,
          isGroup: 0,
        };

  router.push({
    path: "/group/GroupOrder",
    query: params,
  });
}
</script>

<template>
  <VanOverlay :show="show" z-index="20" @click="$emit('close')">
    <div v-if="info.goods" class="buy-modal" @click.stop>
      <div class="buy-modal-info">
        <img :src="info.goods.imageUrl" alt="" class="buy-modal-info-cover" />
        <div class="buy-modal-info-right">
          <div class="buy-modal-info-right-title">
            {{ info.goods.title }}
          </div>
          <!--          <div class="buy-modal-info-right-desc">幼儿园男孩女孩益智早…</div>-->

          <div v-if="info.groupBuyActivity" class="buy-modal-info-right-price">
            <span>¥{{ info.groupBuyActivity.activityPrice.toFixed(2) }}</span>
            <del>¥{{ info.goods.price.toFixed(2) }}</del>
            <div class="buy-modal-info-right-price-label">
              {{ info.groupBuyActivity.population }}人拼团价
            </div>
          </div>
          <div class="buy-modal-info-right-remark">
            <span>库存{{ inventory }}件</span>
            <!--<span>思维语言</span>-->
          </div>
        </div>
      </div>

      <div class="buy-modal-shape">
        <div class="buy-modal-shape-text">款式：</div>
        <div class="buy-modal-shape-items">
          <div
            v-for="item in info.skuInfo"
            :key="item.id"
            :class="['buy-modal-shape-item', chosenSkuId === item.id ? 'chosen' : '']"
            @click="chosenSkuId = item.id"
          >
            {{ item.sku }}
          </div>
        </div>
      </div>

      <div class="buy-modal-num">
        <div class="buy-modal-num-left">购买数量：</div>
        <van-stepper v-model="buyNum" theme="round" button-size="22" disable-input />
      </div>

      <div class="buy-modal-btn" @click="goBuy">立即购买</div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss"></style>
