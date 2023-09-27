<script setup lang="ts">
import { getToken } from "@/utils";
import { checkUserBuyCourseRequest, getLuojigouCourseListRequest } from "@/api/course";
import type { ILuojigouCourse } from "@/types/course";
import { useRouter } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores";

const router = useRouter();
// const img = 'https://app-resources-luojigou.luojigou.vip/FgNJ-RTvgVyvV-4t8s2fWn7b1uLe'
const bgi = "https://app-resources-luojigou.luojigou.vip/Fu1CAc2KUIHokifkFwwGIVZ7fwEL";

const { loading } = storeToRefs(useAppStore());

const list = ref<ILuojigouCourse[]>([]);
const queryParams = reactive({
  page: 1,
  pageSize: 1000,
});
async function getList() {
  const { data, status } = await getLuojigouCourseListRequest(queryParams);
  if (status === 200) {
    list.value = data.entityList;
  }
}

async function checkUserBuyCourse() {
  const { data, status } = await checkUserBuyCourseRequest();
  if (status === 200) {
    if (data) {
      await router.push(`/course/CourseDetail?id=${data}&mode=luojigou`);
    } else {
      await router.push(`/ARGame`);
    }
  }
}

onMounted(async () => {
  loading.value = true;
  await getToken();
  await getList();
  loading.value = false;
});
</script>

<template>
  <div class="course">
    <div v-for="item in list" :key="item.id" class="course-item" @click="checkUserBuyCourse">
      <div class="course-item-title">{{ item.categoryName }}</div>
      <div class="course-item-cont">
        <div class="course-item-cont-header" :style="{ backgroundImage: `url(${bgi})` }">
          <div class="course-item-cont-header-top">
            <div class="course-item-cont-header-top-title">{{ item.name }}</div>
            <div class="course-item-cont-header-top-age">{{ item.suitAge }}</div>
          </div>
          <div class="course-item-cont-header-remark">{{ item.simpleDescription }}</div>
        </div>

        <div class="course-item-cont-footer">
          <img :src="item.imgCover" alt="" class="course-item-cont-footer-img" />
          <div class="course-item-cont-footer-content">
            <div class="course-item-cont-footer-content-left">
              <div class="course-item-cont-footer-content-left-group">
                <img
                  v-for="(ava, avaIndex) in item.avatars"
                  :key="avaIndex"
                  :src="ava"
                  alt=""
                  class="course-item-cont-footer-content-left-group-item"
                />
              </div>
              <div class="course-item-cont-footer-content-left-text">
                {{ item.userCount }}位同学已加入课程
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.course {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background-color: #fafafa;
  overflow: hidden;
  box-sizing: border-box;

  img {
    display: block;
    object-fit: cover;
  }

  &-item {
    margin: 18px 0;
    width: 343px;

    &-title {
      margin-bottom: 14px;
      width: 343px;
      height: 28px;
      font-size: 20px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC,
        serif;
      font-weight: 600;
      color: #333333;
      line-height: 28px;
      overflow: hidden;
      /*文本不会换行*/
      white-space: nowrap;
      /*当文本溢出包含元素时，以省略号表示超出的文本*/
      text-overflow: ellipsis;
    }

    &-cont {
      border-radius: 20px;
      //overflow: hidden;

      &-header {
        padding: 14px 12px 0;
        width: 343px;
        height: 83px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        box-sizing: border-box;
        overflow: hidden;

        &-top {
          display: flex;
          align-items: center;
          margin-bottom: 4px;

          &-title {
            margin-right: 9px;
            height: 22px;
            font-size: 16px;
            font-family:
              PingFangSC-Semibold,
              PingFang SC,
              serif;
            font-weight: 600;
            color: #ffffff;
            line-height: 22px;
          }

          &-age {
            padding: 0 7px;
            height: 18px;
            line-height: 18px;
            font-size: 11px;
            font-family:
              PingFangSC-Semibold,
              PingFang SC,
              serif;
            font-weight: 600;
            color: #ffffff;
            background: #ff7c47;
            border-radius: 9px;
            box-sizing: content-box;
          }
        }

        &-remark {
          width: 319px;
          height: 16px;
          font-size: 11px;
          font-family:
            PingFangSC-Regular,
            PingFang SC,
            serif;
          font-weight: 400;
          color: #ffffff;
          line-height: 16px;
          overflow: hidden;
          /*文本不会换行*/
          white-space: nowrap;
          /*当文本溢出包含元素时，以省略号表示超出的文本*/
          text-overflow: ellipsis;
        }
      }

      &-footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: -15px;
        padding: 16px;
        background: #ffffff;
        box-shadow: 0px 2px 6px 0px #f4f4f4;
        border-radius: 20px;

        &-img {
          width: 311px;
          //height: 150px;
          border-radius: 10px;
        }

        &-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          width: 311px;

          &-left {
            display: flex;
            align-items: center;
            height: 20px;

            &-group {
              display: flex;
              align-items: center;
              height: 20px;

              &-item {
                width: 20px;
                height: 20px;
                border-radius: 50%;
              }

              .course-item-cont-footer-content-left-group-item
                + .course-item-cont-footer-content-left-group-item {
                margin-left: -4px;
              }
            }

            &-text {
              margin-left: 4px;
              height: 17px;
              font-size: 12px;
              font-family:
                PingFangSC-Regular,
                PingFang SC,
                serif;
              font-weight: 400;
              color: #999999;
              line-height: 22px;
            }
          }

          &-btn {
            width: 94px;
            height: 36px;
            line-height: 36px;
            font-size: 15px;
            font-family:
              PingFangSC-Medium,
              PingFang SC,
              serif;
            font-weight: 500;
            color: #ffffff;
            background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
            border-radius: 18px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
