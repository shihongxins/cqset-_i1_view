import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes as bigscreenRoutes } from './bigscreen';

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
      redirect: '/bigscreen',
    },
    {
      path: '/bigscreen',
      redirect: '/bigscreen/devices',
      component: () => import('@/views/bigscreen/Layout.vue'),
      children: bigscreenRoutes,
    },
  ],
});
