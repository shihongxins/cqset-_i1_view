import Vue from 'vue';

import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
dayjs.locale('zh-cn');

import { pinia } from './stores/index';

import App from './App.vue';
import { router } from './router';
import './permission';

import 'normalize.css';
import './assets/styles/global.scss';
import '@unocss/reset/tailwind-compat.css';
import 'virtual:uno.css';

import 'virtual:svg-icons-register';
import SVGIconNames from 'virtual:svg-icons-names';
import SvgIcon from './components/SvgIcon.vue';

console.log(SVGIconNames);

Vue.component('SvgIcon', SvgIcon);

console.log(import.meta.env);

// config CDN to transform import in vite build options
import ElementUI from 'element-ui';
if (import.meta.env.MODE === 'development' || import.meta.env.DEV) {
  import('element-ui/lib/theme-chalk/index.css');
  Vue.use(ElementUI);
}

const app = new Vue({
  router,
  pinia,
  render: (h) => h(App),
});
app.$mount('#app');
