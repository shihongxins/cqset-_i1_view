import Vue from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';
import { useStorage } from '../utils/storage';

Vue.use(PiniaVuePlugin);

export const pinia = createPinia();
export const LOCAL_STORAGE = useStorage('I1_VIEW');
