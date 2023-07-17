import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';

import 'virtual:svg-icons-register';
import SVGIconNames from 'virtual:svg-icons-names';
import SvgIcon from './components/SvgIcon.vue';

console.log(SVGIconNames);

Vue.use(PiniaVuePlugin);
Vue.component('SvgIcon', SvgIcon);

const app = new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App),
});
app.$mount('#app');
