<script setup lang="ts">
import { defaultCommodityCommit } from "@/types/group";
import type { ICommodityCommit } from "@/types/group";
import { computed } from "vue";

const props = withDefaults(defineProps<{ info: ICommodityCommit }>(), {
  info: () => defaultCommodityCommit(),
});

const info = computed(() => props.info);
</script>

<template>
  <div class="mom-comment">
    <div class="mom-comment-info">
      <img v-if="info.user" :src="info.user.avatarUrl" alt="" class="mom-comment-info-logo" />
      <div class="mom-comment-info-right">
        <div v-if="info.user" class="mom-comment-info-right-name">
          {{ info.user.nickName }}
        </div>
        <div class="mom-comment-info-right-text">
          <span>{{ info.createTime }}</span>
          <span>{{ info.sku.sku }}</span>
        </div>
      </div>
    </div>

    <div class="mom-comment-cont">
      {{ info.commit }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.mom-comment {
  flex: 0 0 auto;
  margin-left: 12px;
  padding: 20px 12px;
  width: 313px;
  background: #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;

  img {
    display: block;
    object-fit: cover;
  }

  &-info {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    &-logo {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    &-right {
      margin-left: 14px;

      &-name {
        height: 18px;
        font-size: 13px;
        font-family:
          PingFangSC-Regular,
          PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 18px;
      }

      &-text {
        display: flex;

        span {
          display: block;
          margin-right: 6px;
          height: 14px;
          font-size: 10px;
          font-family:
            PingFangSC-Regular,
            PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 14px;
        }
      }
    }
  }

  &-cont {
    margin: 0 auto;
    width: 289px;
    font-size: 13px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}
</style>
