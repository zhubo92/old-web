<script setup lang="ts">
import { Overlay as VanOverlay, showToast, Stepper as VanStepper } from "vant";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { defaultGroupCommodity } from "@/types/group";
import type { IGroupCommodity } from "@/types/group";

const router = useRouter();
const { path, id } = useRoute().query;

const emit = defineEmits<{
  (e: "close"): void;
  (e: "returnSku", sku: string): void;
}>();

const props = withDefaults(
  defineProps<{
    show: boolean;
    info: IGroupCommodity;
  }>(),
  {
    show: false,
    info: () => defaultGroupCommodity(),
  },
);

const buyNum = ref(1);
const chosenSkuId = ref("");

const info = computed(() => props.info);
const show = computed(() => props.show);

const inventory = computed(() => {
  try {
    const item = info.value.skuInfo.filter((item: any) => item.id === chosenSkuId.value)[0];
    console.log(item, "item1");
    return item.inventory;
  } catch (err) {
    console.log(err, "inventory");
  }

  return "";
});

const activityPrice = computed(() => {
  console.log(chosenSkuId.value, "chosenSkuId");
  const item = info.value.skuInfo.filter((item) => item.id === chosenSkuId.value);
  console.log(item, "item2");
  return item[0].activityPrice.toFixed(2);
});

const price = computed(() => {
  return info.value.skuInfo.filter((item) => item.id === chosenSkuId.value)[0].price.toFixed(2);
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

function changeSku(item: {
  id: string;
  shortId: number;
  productId: string;
  sku: string;
  level: null;
  price: number;
  count: number;
  produceCode: string;
  goods: null;
  activityPrice: number;
  inventory: number;
}) {
  chosenSkuId.value = item.id;
  console.log(chosenSkuId.value, "chosenSkuId");
  emit("returnSku", item.sku);
}

watch(
  () => info.value.skuInfo,
  () => {
    changeSku(info.value.skuInfo[0]);
  },
);
</script>

<template>
  <VanOverlay :show="show" z-index="20" @click="emit('close')">
    <div v-if="info.goods" class="buy-modal" @click.stop>
      <div class="buy-modal-info">
        <img :src="info.goods.imageUrl" alt="" class="buy-modal-info-cover" />
        <div class="buy-modal-info-right">
          <div class="buy-modal-info-right-title">
            {{ info.goods.title }}
          </div>

          <div v-if="info.groupBuyActivity" class="buy-modal-info-right-price">
            <span>¥{{ activityPrice }}</span>
            <del>¥{{ price }}</del>
            <div class="buy-modal-info-right-price-label">
              {{ info.groupBuyActivity.population }}人拼团价
            </div>
          </div>
          <div class="buy-modal-info-right-remark">
            <span>库存{{ inventory }}件</span>
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
            @click="changeSku(item)"
          >
            {{ item.sku }}
          </div>
        </div>
      </div>

      <div class="buy-modal-num">
        <div class="buy-modal-num-left">购买数量：</div>
        <VanStepper v-model="buyNum" theme="round" button-size="22" disable-input />
      </div>

      <div class="buy-modal-btn" @click="goBuy">立即购买</div>
    </div>
  </VanOverlay>
</template>

<style scoped lang="scss">
.buy-modal {
  padding-bottom: 46px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  min-height: 391px;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  overflow: hidden;

  img {
    display: block;
    object-fit: cover;
  }

  &-info {
    display: flex;
    justify-content: space-between;
    margin: 16px auto;
    padding-bottom: 15px;
    width: 342px;
    border-bottom: 1px solid #f6f6f6;

    &-cover {
      width: 106px;
      height: 106px;
      border-radius: 10px;
    }

    &-right {
      &-title {
        width: 226px;
        font-size: 14px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 550;
        color: #161616;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      &-price {
        display: flex;
        align-items: center;
        margin-top: 20px;

        span {
          display: block;
          height: 20px;
          font-size: 14px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC;
          font-weight: 600;
          color: #ff2929;
          line-height: 20px;
        }

        del {
          margin-left: 4px;
          display: block;
          height: 14px;
          font-size: 10px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
        }

        &-label {
          margin-left: 10px;
          padding: 1px 4px;
          height: 16px;
          font-size: 11px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 16px;
          background: linear-gradient(320deg, #fb6882 0%, #ff4d46 100%);
          border-radius: 3px;
          box-sizing: content-box;
        }
      }

      &-remark {
        display: flex;
        align-items: center;
        margin-top: 10px;

        span {
          display: block;
          height: 17px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 17px;
        }

        span + span {
          margin-left: 20px;
        }
      }
    }
  }

  &-shape {
    margin: 0 auto;
    width: 342px;
    border-bottom: 1px solid #f6f6f6;

    &-text {
      margin: 16px 0;
      height: 14px;
      font-size: 14px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #211d1d;
      line-height: 14px;
    }

    &-items {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    &-item {
      margin-right: 12px;
      margin-bottom: 16px;
      padding: 8px;
      //height: 20px;
      font-size: 14px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #6e6e6e;
      line-height: 20px;
      box-sizing: content-box;
      border: 1px solid #606060;
      border-radius: 4px;
    }

    .buy-modal-shape-item:last-child {
      margin-right: 0;
    }

    //.buy-modal-shape-item + .buy-modal-shape-item {
    //  margin-left: 12px;
    //}

    .chosen {
      background-color: #2456c9;
      color: #fff;
      border: 1px solid #2456c9;
    }
  }

  &-num {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px auto;
    width: 342px;

    &-left {
      height: 14px;
      font-size: 14px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #211d1d;
      line-height: 14px;
    }
  }

  &-btn {
    margin: 10px auto 0;
    width: 352px;
    height: 46px;
    line-height: 46px;
    background: linear-gradient(306deg, #ff8259 0%, #ff4747 100%);
    border-radius: 23px;
    font-size: 18px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 550;
    color: #ffffff;
    text-align: center;
  }
}

::v-deep(.van-stepper--round .van-stepper__minus) {
  color: #c7c7c7;
  background-color: #ececec;
  border-color: #f3f3f3;
}

::v-deep(.van-stepper--round .van-stepper__plus) {
  color: #494949;
  background-color: #fff;
  border: 1px solid #f1f1f1;
}
</style>
