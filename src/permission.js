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
    let { userIntercetorsConfig } = config;
    if (userIntercetorsConfig?.request?.enable) {
      console.log('request.interceptors.request 1');
      if (userIntercetorsConfig.request.validToken) {
        const tokenRequired = !(
          config.headers['token'] ||
          (requestWhiteList.length && requestWhiteList.indexOf(config.url) > -1)
        );
        if (tokenRequired) {
          const userStore = useUserStore();
          const tokenValidated = userStore.validate();
          if (tokenValidated) {
            request.defaults.headers.common['token'] = userStore.token;
            config.headers['token'] = userStore.token;
          } else {
            delete request.defaults.headers.common['token'];
            // do other something like notify to user
          }
        }
      }
    }
    return config;
  },
  (err) => {
    let {
      config: { userIntercetorsConfig },
    } = err;
    if (userIntercetorsConfig?.request?.enable) {
      return Promise.reject(
        userIntercetorsConfig?.response?.useErrorFirstStyle
          ? errorHandler.wrapDataToErrorFirstStyle(err, true)
          : err
      );
    }
    return err;
  }
);
