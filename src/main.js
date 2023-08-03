import Vue from 'vue';
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

const app = new Vue({
  router,
  pinia,
  render: (h) => h(App),
});
app.$mount('#app');
