import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Index",
      redirect: "/home/HomeNav",
    },
    {
      path: "/home/HomeNav",
      name: "HomeNav",
      component: () => import("@/views/home/HomeNav.vue"),
      meta: {
        title: "首页导航",
      },
    },
    {
      path: "/NotFound",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
      meta: {
        title: "首页导航",
      },
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/home/HomeView.vue"),
      redirect: "/home/ActivityArea",
      children: [
        {
          path: "ActivityArea",
          name: "ActivityArea",
          component: () => import("@/views/home/pages/ActivityArea.vue"),
          meta: {
            title: "活动专区",
          },
        },
        {
          path: "LuojigouCourse",
          name: "LuojigouCourse",
          component: () => import("@/views/home/pages/LuojigouCourse.vue"),
          meta: {
            title: "逻辑狗课",
          },
        },
        {
          path: "MyCourse",
          name: "MyCourse",
          component: () => import("@/views/home/pages/MyCourse.vue"),
          meta: {
            title: "我的课程",
          },
        },
      ],
    },
    {
      path: "/group/GroupActivity",
      alias: "/growTogether/activity/oneYuan",
      name: "GroupActivity",
      component: () => import("@/views/group/GroupActivity.vue"),
      meta: {
        title: "拼团活动",
      },
    },
    {
      path: "/group/GroupCommodity",
      name: "GroupCommodity",
      component: () => import("@/views/group/GroupCommodity.vue"),
      meta: {
        title: "拼团商品详情",
      },
    },
    {
      path: "/group/GroupCourse",
      name: "GroupCourse",
      component: () => import("@/views/group/GroupCourse.vue"),
      meta: {
        title: "拼团课程详情",
      },
    },
    {
      path: "/group/GroupDetail",
      name: "GroupDetail",
      component: () => import("@/views/group/GroupDetail.vue"),
      meta: {
        title: "拼团详情",
      },
    },
    {
      path: "/group/GroupOrder",
      name: "GroupOrder",
      component: () => import("@/views/group/GroupOrder.vue"),
      meta: {
        title: "拼团订单",
      },
    },
    {
      path: "/invite/InviteHavePrize",
      alias: "/invited",
      name: "InviteHavePrize",
      component: () => import("@/views/invite/InviteHavePrize.vue"),
      meta: {
        title: "邀请有奖",
      },
    },
    {
      path: "/invite/InviteRecord",
      name: "InviteRecord",
      component: () => import("@/views/invite/InviteRecord.vue"),
      meta: {
        title: "邀请记录",
      },
    },
    {
      path: "/me/ShippingAddress",
      name: "ShippingAddress",
      component: () => import("@/views/me/ShippingAddress.vue"),
      meta: {
        title: "收货地址",
      },
    },
    {
      path: "/me/AddAddress",
      name: "AddAddress",
      component: () => import("@/views/me/AddAddress.vue"),
      meta: {
        title: "新增地址",
      },
    },
    {
      path: "/course/CourseDetail",
      alias: "/courseDetail",
      name: "CourseDetail",
      component: () => import("@/views/course/CourseDetail.vue"),
      meta: {
        title: "课程详情",
      },
    },
    {
      path: "/course/AudioDetail",
      alias: "/audioCourse",
      name: "AudioDetail",
      component: () => import("@/views/course/AudioDetail.vue"),
      meta: {
        title: "音频课程详情",
      },
    },
    {
      path: "/course/TryListen",
      name: "TryListen",
      component: () => import("@/views/course/TryListen.vue"),
      meta: {
        title: "音频课程试听",
      },
    },
    {
      path: "/course/PaySuccess",
      name: "PaySuccess",
      component: () => import("@/views/course/PaySuccess.vue"),
      meta: {
        title: "支付成功",
      },
    },
    {
      path: "/course/TryListen",
      name: "TryListen",
      component: () => import("@/views/course/TryListen.vue"),
      meta: {
        title: "音频课程试听",
      },
    },
    {
      path: "/punch/PunchActivity",
      alias: "/punch",
      name: "PunchActivity",
      component: () => import("@/views/punch/PunchActivity.vue"),
      meta: {
        title: "打卡活动",
      },
    },
    {
      path: "/punch/PunchCourse/:id",
      alias: "/punchCourse/:id",
      name: "PunchCourse",
      component: () => import("@/views/punch/PunchCourse.vue"),
      meta: {
        title: "打卡课程",
      },
    },
    {
      path: "/punch/PunchDetail/:id",
      alias: "/punchDetail/:id",
      name: "PunchDetail",
      component: () => import("@/views/punch/PunchDetail.vue"),
      meta: {
        title: "打卡详情",
      },
    },
    {
      path: "/activity/GameCourse",
      name: "GameCourse",
      component: () => import("@/views/activity/GameCourse.vue"),
      meta: {
        title: "逻辑狗0基础思维成长训练营",
      },
    },
    {
      path: "/activity/GamePaySuccess",
      name: "GamePaySuccess",
      component: () => import("@/views/activity/GamePaySuccess.vue"),
      meta: {
        title: "领取成功",
      },
    },
  ],
});

router.beforeEach((to) => {
  // 网页标题
  document.title = (to.meta?.title || "") as string;
  // 404 页面
  // if (!router.getRoutes().find((route) => route.name === to.name)) {
  //   console.log(to, "to");
  //   return "/NotFound";
  // }

  // 返回 false 以取消导航
  return true;
});

export default router;
