import Vue from 'vue';

import { Loading, Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/loading.css';
import 'element-ui/lib/theme-chalk/message.css';
import 'element-ui/lib/theme-chalk/message-box.css';

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
