import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes as JSL_BYNR_Routes } from './jsl_byne';

const VueRouterPush = VueRouter.prototype.push;
const VueRouterReplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function (to, onComplete, onAbort) {
  return VueRouterPush.call(this, to, onComplete, onAbort)?.catch((error) => {
    console.error('VueRouter push error', error);
    VueRouterReplace.call(this, onComplete, onAbort);
  });
};
Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'hash',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/views/Login.vue'),
    },
    /**
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
    */
    {
      path: '/',
      redirect: '/jsl_byne',
    },
    {
      path: '/jsl_byne',
      redirect: '/jsl_byne/disaster',
      component: () => import('@/views/jsl_byne/Layout.vue'),
      children: JSL_BYNR_Routes,
    },
  ],
});
