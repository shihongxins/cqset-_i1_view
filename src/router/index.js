import Vue from 'vue';
import VueRouter from 'vue-router';
import { routes as bigscreenRoutes } from './bigscreen';

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
