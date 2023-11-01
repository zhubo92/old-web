<script setup lang="ts">
import OpenLaunchApp from "@/components/OpenLaunchApp.vue";
import { ref, watch } from "vue";
import { defaultCourseDetail } from "@/types/course";
import type { ICourseDetail } from "@/types/course";

const props = withDefaults(
  defineProps<{
    info: ICourseDetail;
  }>(),
  { info: () => defaultCourseDetail() },
);

const extinfo = ref<string>("");

watch(
  () => props.info,
  (val) => {
    if (val.cashbackActivity) {
      const { origin, pathname } = window.location;
      extinfo.value = `${origin}${pathname}#/punchCourse/${val.cashbackActivityId}`;
    } else {
      extinfo.value = `/course/pipeline?course_id=${val.id}`;
    }

    console.log(extinfo.value, "extinfo.value");
  },
);
</script>

<template>
  <div class="look-course">
    <OpenLaunchApp :extinfo="extinfo">
      <div
        style="
          margin-top: 10px;
          width: 343px;
          height: 46px;
          line-height: 46px;
          background: linear-gradient(306deg, #ff9a59 0%, #ff4747 100%);
          border-radius: 23px;
          font-size: 18px;
          font-family:
            PingFangSC-Medium,
            PingFang SC;
          font-weight: 500;
          color: #ffffff;
          text-align: center;
        "
      >
        查看课程
      </div>
    </OpenLaunchApp>
  </div>
</template>

<style scoped lang="scss"></style>
