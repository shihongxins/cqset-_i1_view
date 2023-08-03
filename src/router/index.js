import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes as routesOfDashboard } from './dashboard';

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      redirect: '/dashboard/devices',
      component: () => import('@/views/dashboard/DashBoardLayout.vue'),
      children: routesOfDashboard,
    },
  ],
});
