import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/HomeView.vue'),
      redirect: '/home/ActivityArea',
      children: [
        {
          path: 'ActivityArea',
          name: 'ActivityArea',
          component: () => import('@/views/home/pages/ActivityArea.vue'),
          meta: {
            title: '活动专区'
          }
        },
        {
          path: 'LuojigouCourse',
          name: 'LuojigouCourse',
          component: () => import('@/views/home/pages/LuojigouCourse.vue'),
          meta: {
            title: '逻辑狗课'
          }
        },
        {
          path: 'MyCourse',
          name: 'MyCourse',
          component: () => import('@/views/home/pages/MyCourse.vue'),
          meta: {
            title: '我的课程'
          }
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  // 网页标题
  document.title = (to.meta?.title || '') as string

  // 返回 false 以取消导航
  return true
})

export default router
