<script setup lang="ts">
import { Grid as VanGrid, GridItem as VanGridItem } from "vant";
import { useRouter } from "vue-router";
interface IItem {
  path: string;
  query?: { id?: string; mode?: string; inviteCode?: string; schoolId?: string };
  name: string;
}

const router = useRouter();

const list: IItem[] = [
  { path: "/home", name: "h5活动首页", query: {} },
  { path: "/invite/InviteHavePrize", name: "邀请有奖活动", query: {} },
  // { path: "/courseList", name: "课程列表", query: {} },
  { path: "/group/GroupActivity", name: "拼团活动列表", query: {} },
  // { path: "/punch", name: "打卡活动列表", query: {} },
  // { path: "/growTogether/course", name: "逻辑狗课程列表", query: {} },
  { path: "/home/MyCourse", name: "我的课程", query: {} },
  { path: "/course/CourseDetail", name: "普通课程", query: { id: "1539526998462238721" } },
  { path: "/group/GroupCourse", name: "拼团课程", query: { id: "1539113640722370562" } },
  { path: "/punchCourse/1623572406377492482", name: "打卡课程", query: {} },
  { path: "/punchDetail/1623572406377492482", name: "打卡课程详情", query: {} },
  {
    path: "/course/CourseDetail",
    name: "逻辑狗课程",
    query: { id: "1539526998462238721", mode: "luojigou" },
  },
  // { path: "/garden/apply", name: "代理商邀请园长开园", query: { inviteCode: "1070" } },
  // { path: "/teach/apply", name: "邀请教师加入园所", query: { schoolId: "1636556857269067777" } },
  // { path: "/parent/apply", name: "邀请幼儿加入园所", query: { schoolId: "1593165872201457666" } },
  // { path: "/book", name: "成长册" },
  // { path: "/acPage", name: "微页面活动组件", query: { id: "1653942274733699074" } },
];

function handleClick(item: IItem) {
  const { path, query } = item;
  router.push({ path, query });
}
</script>

<template>
  <div class="nav">
    <VanGrid :column-num="3">
      <VanGridItem
        v-for="(item, index) in list"
        :key="index"
        icon="photo-o"
        :text="item.name"
        @click="handleClick(item)"
      />
    </VanGrid>
  </div>
</template>

<style scoped lang="scss"></style>
