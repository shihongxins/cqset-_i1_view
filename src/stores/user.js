import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { LOCAL_STORAGE } from './index';

const LOCAL_STORAGE_KEY = 'User';

const getDefaultState = () => {
  let userInfo,
    from = {
      href: 'http://iot.cqset.com/view/#/login',
      name: '智慧电网数据分析平台',
    };
  try {
    const data = LOCAL_STORAGE.getItem(LOCAL_STORAGE_KEY) || {};
    const loginTime = dayjs(data.userInfo?.time);
    if (data.userInfo?.token && dayjs().diff(loginTime) < 1000 * 60 * 60 * 24 * 7) {
      ({ userInfo, from } = data);
    } else {
      LOCAL_STORAGE.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch (error) {
    console.error(error);
    LOCAL_STORAGE.removeItem(LOCAL_STORAGE_KEY);
  }
  return { userInfo, from };
};

const useUserStore = defineStore(LOCAL_STORAGE_KEY, {
  state: () => {
    return getDefaultState();
  },
  getters: {
    userName: (state) => {
      return state.userInfo?.nick_name || state.userInfo?.name;
    },
    token: (state) => {
      return state.userInfo?.token;
    },
  },
  actions: {
    refresh(userInfo, from) {
      if (userInfo) {
        const loginTime = dayjs(userInfo.time);
        if (userInfo && userInfo.token && dayjs().diff(loginTime) < 1000 * 60 * 60 * 24 * 7) {
          LOCAL_STORAGE.setItem(LOCAL_STORAGE_KEY, { userInfo, from: from || this.from });
        }
      }
      this.$patch(getDefaultState());
    },
    validate() {
      this.refresh();
      return Boolean(this.token);
    },
    async logout() {
      let resData;
      try {
        // 退出无需请求接口，直接清除本地数据即可
        // resData = await APILoginView.login
        LOCAL_STORAGE.removeItem(LOCAL_STORAGE_KEY);
        this.$patch(getDefaultState());
        resData = true;
      } catch (error) {
        resData = error;
      }
      return resData;
    },
  },
});

export { LOCAL_STORAGE_KEY, useUserStore, useUserStore as default };
