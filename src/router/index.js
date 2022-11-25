import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../components/Layout/index.vue'
const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  /** -----登录页----- **/
  {
    path: '/login',
    name: 'Login',
    component:() => import('../views/login/index.vue'),
    meta: { name: 'Login', common: true }
  },
  /** ----- main ----- **/
  {
    path: '/main',
    component: Layout,
    redirect: '/home',
    children: [
      /** -------首页------- **/
      {
        path: '/home',
        name: 'Home',
        component:() => import('../views/home/index.vue'),
        meta: { name: 'Home', common: true }
      },
      /** -------通讯录------- **/
      {
        path: '/addressbook/:id',
        name: 'AddressBook',
        component:() => import('../views/addressbook/index.vue'),
        meta: { name: 'AddressBook', common: false }
      },
      /** -------通用管理------- **/
      // 日志
      {
        path: '/base/log',
        name: 'BaseLog',
        component:() => import('../views/base/log/index.vue'),
        meta: { name: 'BaseLog', common: true }
      },
      // 写日志（编辑/创建）
      {
        path: '/base/log/write',
        name: 'BaseLogWrite',
        component:() => import('../views/base/log/write/index.vue'),
        meta: { name: 'BaseLog', common: true }
      },
      // 公告
      {
        path: '/base/bulletin',
        name: 'BaseBulletin',
        component:() => import('../views/base/bulletin/index.vue'),
        meta: { name: 'BaseBulletin', common: true }
      },
      // 公告详情
      {
        path: '/base/bulletin/detail/:id',
        name: 'BaseBulletinDetail',
        component:() => import('../views/base/bulletin/detail/index.vue'),
        meta: { name: 'BaseBulletin', common: true }
      },
      // 写公告（编辑/创建）
      {
        path: '/base/bulletin/write',
        name: 'BaseBulletinWrite',
        component:() => import('../views/base/bulletin/write/index.vue'),
        meta: { name: 'BaseBulletin', common: true }
      },
      /** -------审批中心------- **/
      {
        path: '/approval',
        name: 'Approval',
        component:() => import('../views/approval/index.vue'),
        meta: { name: 'Approval', common: false }
      },
      /** -------表单------- **/
      {
        path: '/form/:id',
        name: 'Form',
        component:() => import('../views/form/index.vue'),
        meta: { name: 'Form', common: false }
      },
      /** --------404-------- **/
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component:() => import('../views/404/index.vue'),
        meta: { name: 'NotFound', common: true }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // 通讯录
  if (to.meta.name === 'AddressBook') to.meta.name = `AddressBook${to.params.id}`
  if(to.meta.name === 'Form') to.meta.name = `Form${to.params.id}`
  if(to.path === '/login') return next()
  if(!window.sessionStorage.getItem("token")) return next('/login')
  // if(!to.meta.common && !JSON.parse(window.sessionStorage.getItem('sr'))[to.meta.name]) return next('/404')
  next()
})

export default router