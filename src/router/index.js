import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { guess: true },
    component: () => import('../views/login.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: { guess: true },
    component: () => import('../views/login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    meta: { guess: true },
    component: () => import('../views/register.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/dashboard.vue'),
  },
  {
    path: '/addPatient',
    name: 'AddPatient',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/addPatient.vue'),
  },
  {
    path: '/forms/form1',
    name: 'forms/form1',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/form1.vue'),
  },
  {
    path: '/forms/form2',
    name: 'forms/form2',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/form2.vue'),
  },
  {
    path: '/forms/form3',
    name: 'forms/form3',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/form3.vue'),
  },
  {
    path: '/forms/form4',
    name: 'forms/form4',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/form4.vue'),
  },
  {
    path: '/forms/form5',
    name: 'forms/form5',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/form5.vue'),
  },
  {
    path: '/forms/form6',
    name: 'forms/form6',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/form6.vue'),
  },
  {
    path: '/forms/form7',
    name: 'forms/form7',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/form7.vue'),
  },
  {
    path: '/result',
    name: 'Result',
    // meta: { guess: true },
    meta: { login: true },
    component: () => import('../views/result.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token')

  if (to.meta.login && !isLoggedIn) {
    alert('Please login first!')
    next({ path: '/login' })
  }

  if (to.meta.guess && isLoggedIn) {
    alert("You've already logged in")
    next({ path: '/dashboard' })
  }

  next()
})

export default router
