import { router } from './router';
import { useUserStore } from './stores/user';
import { pinia } from './stores';
import { request } from './apis/request';
import { errorHandler } from './apis/request/tools';

const routerWhiteList = [router.match({ name: 'Login' })];

router.beforeEach((to, from, next) => {
  const userStore = useUserStore(pinia);
  const loginValidated = userStore.validate();
  if (loginValidated) {
    if (to.name === 'Login') {
      next('/');
    }
  } else {
    let inRouterWhiteList = !!routerWhiteList.filter(
      (route) => route.name === to.name || route.path === to.path
    ).length;
    if (!inRouterWhiteList) {
      // do other something like notify to user
      next({ name: 'Login' });
    }
  }
  next();
});

const requestWhiteList = ['/sys/login'];

request.interceptors.request.use(
  (config) => {
    console.log('request.interceptors.request 1');
    const tokenRequired = !(
      config.headers['token'] ||
      (requestWhiteList.length && requestWhiteList.indexOf(config.url) > -1)
    );
    if (tokenRequired) {
      const userStore = useUserStore();
      const tokenValidated = userStore.validate();
      if (tokenValidated) {
        request.defaults.headers['token'] = userStore.token;
      } else {
        delete request.defaults.headers['token'];
        // do other something like notify to user
      }
    }
    return config;
  },
  (err) => {
    return Promise.reject(errorHandler.wrapDataToErrorFirstStyle(err, true));
  }
);
