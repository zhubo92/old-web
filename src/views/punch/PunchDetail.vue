<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { callAppFc, getToken } from "@/utils";
import { useRoute, useRouter } from "vue-router";
import { getPunchDetailRequest, getPunchRecordRequest } from "@/api/punch";
import { showToast } from "vant";
import HeaderComponent from "@/views/punch/components/HeaderComponent.vue";
import ProgressBar from "@/views/punch/components/ProgressBar.vue";
import type { IPunchDetail, IPunchRecord } from "@/types/punch";
import { defaultPunchDetail } from "@/types/punch";
import type { IQueryParams } from "@/types/http-codes";
import CalendarComponent from "@/views/punch/components/CalendarComponent.vue";
import PunchRecord from "@/views/punch/components/PunchRecord.vue";

const router = useRouter();
const route = useRoute();
const { id } = route.params;

const detail = reactive<IPunchDetail>(defaultPunchDetail());
const recordList = ref<IPunchRecord[]>([]);
const queryParams = reactive<IQueryParams & { activityId: string }>({
  activityId: "",
  isPage: 0,
  page: 1,
  pageSize: 100,
});

async function getPunchRecord() {
  const { data, msg, status } = await getPunchRecordRequest(queryParams);
  if (status === 200) {
    recordList.value = data.records;
    console.log(recordList, "getPunchRecord");
  } else {
    msg && showToast(msg);
  }
}
async function getPunchDetail(activityId: string) {
  const { data, msg, status } = await getPunchDetailRequest(activityId);
  if (status === 200) {
    console.log(data, "activityId");
    Object.assign(detail, data);
  } else {
    msg && showToast(msg);
  }
}
function jumpPage(val: string) {
  if (val === "returnPrev") {
    callAppFc("popPage", "", () => {
      router.go(-1);
    });
  } else if (val === "goPunch") {
    // 去打卡

    const { matched } = route;
    console.log(matched, "matched");

    if (
      matched &&
      Array.isArray(matched) &&
      matched.length > 0 &&
      matched[matched.length - 1].path === "/punch/PunchDetail/:id"
    ) {
      router.go(-1);
    }
  }
}

onMounted(async () => {
  await getToken();
  if (typeof id === "string") {
    queryParams.activityId = id;
    await getPunchDetail(id);
  }
  await getPunchRecord();
});
</script>

<template>
  <div class="pd">
    <HeaderComponent @jumpPage="jumpPage" />

    <div class="pd-top">
      <!--右上角背景-->
      <div class="pd-top-bgi"></div>
      <!--进度条-->
      <ProgressBar :detail="detail" />
      <!--日历-->
      <CalendarComponent :detail="detail" />
    </div>
    <!--打卡记录-->
    <PunchRecord :list="recordList" @jumpPage="jumpPage" />
  </div>
</template>

<style scoped lang="scss">
::-webkit-scrollbar {
  display: none;
}

.pd {
  padding-bottom: 26px;
  //padding-top: 88px;
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  overflow: hidden;

  &-top {
    padding-bottom: 36px;
    background: linear-gradient(336deg, rgba(255, 252, 249, 0.8) 0%, rgba(255, 232, 211, 0.8) 100%);
    overflow: hidden;

    div.pd-top-bgi {
      position: fixed;
      right: -80px;
      top: -50px;
      z-index: 0;
      width: 230px;
      height: 186px;
      background: rgba(255, 195, 126, 0.4);
      filter: blur(50px);
    }

    > div {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
