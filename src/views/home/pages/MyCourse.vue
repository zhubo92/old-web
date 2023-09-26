<script setup lang="ts">
import { getAICourseOrderRequest, verifyBindPhoneRequest, wxBindPhoneRequest } from '@/api/user'
import { getUserInfo, setUserInfo } from '@/utils/storage'
import { filterImgCover, getToken } from '@/utils'
import type { ICourseOrder, IUserInfo } from '@/types/user'
import LoginModal from '@/views/home/components/LoginModal.vue'
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores'

const router = useRouter()
const { loading } = storeToRefs(useAppStore())

const info = reactive<IUserInfo>({
  appId: null,
  city: '',
  country: '',
  errcode: null,
  errmsg: null,
  headimgurl:
    'https://thirdwx.qlogo.cn/mmopen/vi_32/mE833f4fRB1phY70o9VtskybL5peoFgNoiaWH6cKynq5gGIGXgudbU4CabVE7iamGeuQwav6ghUG7xgOD0FxyMLA/132',
  id: null,
  language: '',
  nickname: 'zhū bō',
  openid: 'o8gfxs-8quGUYCSJIWNClkvF9oUE',
  privilege: [],
  province: '',
  sex: 0,
  subscribe: 0,
  unionid: 'o75lRwbdLj2kLdcJbcwSudc-o0Ms',
})
const bindWx = ref<boolean>(false)
const show = ref<boolean>(false)
const list = ref<ICourseOrder[]>([])

// 验证微信是否绑定手机号
async function verifyBindPhone() {
  const data = await verifyBindPhoneRequest()
  bindWx.value = Boolean(data)
}
// 微信绑定手机号
async function bindPhone(phone: string, code: string) {
  await wxBindPhoneRequest(phone, code, info)
  setUserInfo({ ...getUserInfo(), bindWx: true })
  bindWx.value = true
  show.value = false
}
function lookCourse(record: ICourseOrder) {
  router.push({
    path: '/groupCourse',
    query: {
      id: record?.sku?.id,
    },
  })
}
// 查询订单
async function getAICourseOrder() {
  const { data } = await getAICourseOrderRequest({
    isPage: 0,
    state: 2,
  })
  list.value = data.entityList || []
}

onMounted(async () => {
  loading.value = true
  await getToken()
  Object.assign(info, getUserInfo())
  await verifyBindPhone()
  await getAICourseOrder()
  loading.value = false
})
</script>

<template>
  <div class="myCourse">
    <div class="remark">
      课程已放入您登录的手机账号-【我的课程】中，下载、登录逻辑狗·一起成长APP即可开启学习啦！
    </div>

    <div class="info" v-if="info && (info.headimgurl || info.nickname)">
      <img v-if="info.headimgurl" :src="info.headimgurl" alt="" class="info-logo" />
      <div class="info-right" v-if="info.nickname">
        <div class="info-name">{{ info.nickname }}</div>
        <div v-if="!bindWx" class="info-right-btn" @click="show = true">绑定手机号</div>
        <div v-else class="info-right-btn">手机号已绑定</div>
      </div>
    </div>

    <div v-if="list.length === 0" class="space">暂无已购买内容</div>
    <div class="course">
      <div v-for="item in list" :key="item.id" class="course-item" @click="lookCourse(item)">
        <img :src="filterImgCover(item.sku.imgCover) as string" alt="" class="course-item-logo" />
        <div class="course-item-info">
          <div class="course-item-info-name">{{ item.sku.name }}</div>
          <!--          <div class="course-item-info-total">共{{ item.sku.courseCount }}节</div>-->
        </div>
      </div>
    </div>

    <LoginModal :show="show" @close="show = false" @login="bindPhone" />
  </div>
</template>

<style scoped lang="scss">
.myCourse {
  overflow: hidden;

  .remark {
    padding: 8px 16px 10px;
    width: 100vw;
    background: rgba(0, 0, 0, 0.3);
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC,
      serif;
    font-weight: 400;
    color: #ffffff;
  }

  .info {
    margin: 14px 16px 26px;
    display: flex;
    align-items: center;

    .info-logo {
      margin-right: 13px;
      display: block;
      width: 62px;
      height: 62px;
      object-fit: cover;
      border-radius: 50%;
    }

    .info-right {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .info-name {
        width: 115px;
        height: 20px;
        font-size: 18px;
        font-family:
          PingFangSC-Medium,
          PingFang SC,
          serif;
        font-weight: 550;
        color: #000000;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 102px;
        height: 36px;
        font-size: 14px;
        font-family:
          PingFangSC-Medium,
          PingFang SC,
          serif;
        font-weight: 500;
        color: #ffffff;
        background: #0b57c7;
        border-radius: 18px;
      }
    }
  }

  .type {
    margin: 18px auto 26px;
    display: flex;
    align-items: center;
    width: 343px;
    overflow-x: scroll;

    &-item {
      margin-right: 10px;
      padding: 5px 14px;
      width: fit-content;
      font-size: 14px;
      font-family:
        PingFangSC-Regular,
        PingFang SC,
        serif;
      font-weight: 400;
      color: #333333;
      background: #eaeaea;
      border-radius: 15px;
      white-space: nowrap;
      border: 1px solid transparent;
    }

    .checked {
      font-size: 14px;
      font-family:
        PingFangSC-Semibold,
        PingFang SC,
        serif;
      font-weight: 600;
      color: #0b57c7;
      border-radius: 15px;
      border: 1px solid #0b57c7;
      background-color: #fff;
    }
  }

  .space {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 300px;
  }

  .course {
    padding-bottom: 128px;
    overflow: hidden;

    &-item {
      display: flex;
      align-items: center;
      margin: 18px auto 0;
      width: 343px;
      height: 127px;
      background: #ffffff;
      box-shadow: 0px 6px 19px 4px rgba(231, 237, 241, 0.6);
      border-radius: 20px;
      overflow: hidden;

      &-logo {
        margin-left: 16px;
        display: block;
        width: 95px;
        height: 95px;
        object-fit: cover;
        border-radius: 10px;
      }

      &-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 19px;
        height: 95px;
        overflow: hidden;

        &-name {
          margin-top: 5px;
          width: 197px;
          font-size: 16px;
          font-family:
            PingFangSC-Semibold,
            PingFang SC,
            serif;
          font-weight: 600;
          color: #333333;
          line-height: 24px;
        }

        &-total {
          margin-bottom: 10px;
          height: 12px;
          font-size: 12px;
          font-family:
            PingFangSC-Regular,
            PingFang SC,
            serif;
          font-weight: 400;
          color: #999999;
          line-height: 12px;
        }
      }
    }
  }
}
</style>
