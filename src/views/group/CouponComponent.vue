<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";

const checked = require("@/assets/images/checked.png");
const check = require("@/assets/images/growTogether/check.png");

const emit = defineEmits<{
  (e: "select", record: any): void;
}>();

const props = withDefaults(
  defineProps<{
    itemData: any;
    isUse?: number;
    isSelect?: boolean;
    isRecommend?: boolean;
  }>(),
  {
    itemData: () => {},
    isUse: 1,
    isSelect: false,
    isRecommend: false,
  },
);

const couponType = ref("");
const downcountText = ref("");
const onDay = ref(false);

const timeId = ref<NodeJS.Timeout | null>(null);

const itemData = computed(() => {
  return props.itemData;
});
const isUse = computed(() => {
  return props.isUse;
});

const isSelect = computed(() => {
  return props.isSelect;
});

const isRecommend = computed(() => {
  return props.isRecommend;
});

function selectCoupon() {
  emit("select", itemData);
}

onMounted(() => {
  couponType.value = itemData.value.discountType;

  if (itemData.value.expireDate == null) {
    downcountText.value = "无期限";
  } else if (
    itemData.value.expireDate &&
    dayjs(itemData.value.expireDate).diff(new Date()) < 60 * 60 * 24 * 1000 * 20
  ) {
    onDay.value = true;
    timeId.value = setInterval(() => {
      downcountText.value = dayjs(dayjs(itemData.value.expireDate).diff(new Date()) - 1000).format(
        "hh:mm:ss",
      );
    }, 1000);
  } else {
    downcountText.value = "有效期至" + dayjs(itemData.value.expireDate).format("YYYY/MM/DD");
  }
});

onUnmounted(() => {
  clearInterval(timeId.value);
});
</script>

<template>
  <div class="coupon">
    <div :class="['coupon-item', isUse ? '' : 'coupon-item-unactive']">
      <div class="recommend-coupon" v-if="isRecommend">推荐优惠</div>
      <div class="coupon-discount">
        <!-- 折扣券 和 满减券两种 -->
        <div class="discount" v-if="couponType === 'DISCOUNT'">
          <!-- 最大满减设计图上没有体现 -->
          <div class="count">{{ (itemData.price * 10).toFixed(1) }}</div>
          <div class="unit">折</div>
        </div>

        <!-- 满减券  -->
        <div class="discount" v-else>
          <div style="font-size: 14px; margin-bottom: 4px">¥</div>
          <div class="count">{{ itemData.price }}</div>
        </div>
        <div class="use-condition">无门槛</div>
      </div>
      <div class="line"></div>
      <div class="coupon-info" @click="selectCoupon">
        <div class="info">
          <div class="label">{{ itemData.description }}</div>
          <div class="discount-price">可抵扣¥{{ itemData.discountPrice }}</div>
          <div :class="['term-of-validity', onDay ? 'downcount' : '']">{{ downcountText }}</div>
        </div>
        <div class="coupon-active" v-if="isUse == 1">
          <img :src="isSelect ? checked : check" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.coupon-item {
  width: 343px;
  height: 93px;
  background: #ffffff;
  box-shadow: 0px 0px 6px 0px rgba(235, 235, 235, 0.5);
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  border-radius: 11px;
  box-sizing: border-box;
  overflow: hidden;
  .recommend-coupon {
    width: 64px;
    height: 20px;
    background: rgba(254, 89, 75, 0.4);
    border-radius: 11px 0px 11px 0px;

    font-size: 12px;
    font-family:
      PingFangSC-Medium,
      PingFang SC;
    font-weight: 500;
    color: #ff4f4f;
    transform: scale(0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -2px;
    left: -8px;
  }
  .coupon-discount {
    width: 96px;
    height: 93px;
    background: linear-gradient(270deg, rgba(254, 89, 75, 0) 0%, rgba(254, 89, 75, 0.3) 120%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    font-family:
      PingFangSC-Semibold,
      PingFang SC;
    font-weight: 600;
    color: #ff4f4f;
    box-sizing: border-box;
    .discount {
      display: flex;
      align-items: flex-end;
      .unit {
        font-size: 14px;
        margin-bottom: 4px;
      }
    }
    .use-condition {
      font-size: 10px;
      font-family:
        PingFangSC-Regular,
        PingFang SC;
      font-weight: 400;
      color: #666666;
    }
  }
  .line {
    width: 1px;
    height: 56px;
    background: #f6f6f6;
  }
  .coupon-info {
    width: 246px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px 0 21px;
    box-sizing: border-box;
    .info {
      .label {
        font-size: 16px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #333333;
        margin-bottom: -4px;
      }
      .discount-price {
        font-size: 11px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #ff4f4f;
        margin-top: 6px;
        margin-bottom: 4px;
      }
      .term-of-validity {
        font-size: 10px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #666666;
        margin-top: 4px;
      }
      .downcount {
        font-size: 10px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ff4f4f;
        margin-top: 4px;
      }
    }
    .coupon-active {
      img {
        width: 20px;
        height: 20px;
        display: block;
      }
    }
  }
}

.coupon-item-unactive {
  .coupon-discount {
    background: linear-gradient(270deg, rgba(238, 238, 238, 0) 0%, #e5e5e5 120%);
    .discount {
      color: #999999;
      .count {
        color: #999999;
      }
      .unit {
      }
    }
  }
  .coupon-info {
    .info {
      .label {
        color: #999999;
      }
    }
  }
}
</style>
