import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
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
    // {
    //   path: "/group/GroupActivity",
    //   name: "GroupActivity",
    //   component: () => import("@/views/group/GroupActivity.vue"),
    //   meta: {
    //     title: "拼团活动"
    //   }
    // },
    {
      path: "/invite/InviteHavePrize",
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
      name: "CourseDetail",
      component: () => import("@/views/course/CourseDetail.vue"),
      meta: {
        title: "课程详情",
      },
    },
  ],
});

router.beforeEach((to) => {
  // 网页标题
  document.title = (to.meta?.title || "") as string;

  // 返回 false 以取消导航
  return true;
});

export default router;
