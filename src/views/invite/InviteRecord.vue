<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";
import { showToast } from "vant";
import { getAllInviteRecordsRequest } from "@/api/invite";
import type { IQueryParams } from "@/types/http-codes";
import type { IInviteRecord } from "@/types/invite";

const staticImg = {
  emptyLogo: "https://img.luojigou.vip/FuqDXVCHD5XHZAFLRMCxRMZoAInt",
};

const { loading } = storeToRefs(useAppStore());

const list = ref<IInviteRecord[]>([]);
const total = ref<number>(-1);
const queryParams = reactive<IQueryParams>({
  isPage: 1,
  page: 1,
  pageSize: 10,
});

async function getAllInviteRecords() {
  const { data, msg, status } = await getAllInviteRecordsRequest(queryParams);
  if (status === 200) {
    console.log(data, "getAllInviteRecords");
    list.value = data.entityList;
    total.value = data.total;
  } else {
    showToast(msg);
  }
}

onMounted(async () => {
  loading.value = true;
  await getAllInviteRecords();
  window.onscroll = () => {
    // 滚动条滚动时，距离顶部的距离
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 可视区的高度
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    // 滚动条的总高度
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    //滚动条到底部的条件
    if (scrollTop + windowHeight === scrollHeight) {
      if (total.value === list.value.length) {
        showToast("到底啦");
      } else {
        queryParams.page++;
        getAllInviteRecords();
      }
    }
  };
  loading.value = false;
});
</script>

<template>
  <div class="record">
    <div v-if="Array.isArray(list) && list.length !== 0">
      <div v-for="item in list" :key="item.shareEncourageId" class="record-item">
        <div class="record-item-title">
          <div class="record-item-title-text">{{ item.activityName }}</div>
          <!--<div class="record-item-title-text">{{ item.startTime }}-{{ item.endTime }}活动</div>-->
          <div v-if="item.isEnd === 0" class="record-item-title-label">（进行中）</div>
          <div v-else class="record-item-title-label end">（已结束）</div>
        </div>

        <div
          v-if="Array.isArray(item.inviteInfoVOS) && item.inviteInfoVOS.length !== 0"
          class="record-item-container"
        >
          <div v-for="course in item.inviteInfoVOS" :key="course.goodsId" class="course-item">
            <div class="course-item-left">
              <div class="course-item-left-title">{{ course.newUserNickName }}</div>
              <div class="course-item-left-remark">
                <span>{{ course.createTime }}</span>
                <span class="goodsName">购买{{ course.goodsName }}</span>
              </div>
            </div>

            <div class="course-item-right">
              <div class="course-item-right-state">购买成功</div>
              <!--<div class="course-item-right-remark">（暂未激活）</div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty" v-else>
      <img :src="staticImg.emptyLogo" alt="" class="empty-logo" />

      <div class="empty-text">暂无邀请记录哦～</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.record {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 19px;
  width: 100vw;
  min-height: 100vh;
  background: #fafafa;
  overflow: hidden;

  &-item {
    margin-bottom: 24px;
    width: 343px;
    background: #ffffff;
    box-shadow: 0 2px 10px 0 #f4f4f4;
    border-radius: 10px;
    overflow: hidden;

    &-title {
      display: flex;
      align-items: center;
      margin: 15px 12px;

      &-text {
        height: 25px;
        font-size: 18px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC,
          serif;
        font-weight: 600;
        color: #333333;
        line-height: 25px;
      }

      &-label {
        margin-left: 4px;
        height: 25px;
        font-size: 18px;
        font-family:
          PingFangSC-Semibold,
          PingFang SC,
          serif;
        font-weight: 600;
        color: #ff9c3b;
        line-height: 25px;
      }

      .end {
        color: #999999;
      }
    }

    &-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 7px;

      .course-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 11px;
        width: 318px;

        &-left {
          &-title {
            margin-bottom: 6px;
            height: 21px;
            font-size: 15px;
            font-family:
              PingFangSC-Regular,
              PingFang SC,
              serif;
            font-weight: 400;
            color: #333333;
            line-height: 21px;
          }

          &-remark {
            display: flex;

            span {
              display: block;
              max-width: 100px;
              height: 17px;
              font-size: 12px;
              font-family:
                PingFangSC-Regular,
                PingFang SC,
                serif;
              font-weight: 400;
              color: #999999;
              line-height: 17px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            span + span {
              margin-left: 10px;
            }
          }
        }

        &-right {
          text-align: center;

          &-state {
            height: 21px;
            font-size: 15px;
            font-family:
              PingFangSC-Medium,
              PingFang SC,
              serif;
            font-weight: 500;
            color: #0b57c7;
            line-height: 21px;
          }

          &-remark {
            margin-top: 2px;
            height: 17px;
            font-size: 12px;
            font-family:
              PingFangSC-Regular,
              PingFang SC,
              serif;
            font-weight: 400;
            color: #ff2a2a;
            line-height: 17px;
          }
        }
      }
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-logo {
      margin-top: 40px;
      margin-bottom: 20px;
      display: block;
      width: 158px;
      height: 110px;
      object-fit: cover;
    }

    &-text {
      height: 22px;
      font-size: 16px;
      font-family:
        PingFangSC-Regular,
        PingFang SC,
        serif;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
  }
}
</style>
