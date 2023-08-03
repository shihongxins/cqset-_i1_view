import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { LOCAL_STORAGE } from './index';

const LOCAL_STORAGE_KEY = 'User';

const getDefaultState = () => {
  let user;
  try {
    const data = LOCAL_STORAGE.getItem(LOCAL_STORAGE_KEY) || {};
    const loginTime = dayjs(data.time);
    if (data && data.token && dayjs().diff(loginTime) < 1000 * 60 * 60 * 24 * 7) {
      user = data;
    } else {
      LOCAL_STORAGE.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch (error) {
    console.error(error);
    LOCAL_STORAGE.removeItem(LOCAL_STORAGE_KEY);
  }
  return user;
};

const useUserStore = defineStore(LOCAL_STORAGE_KEY, {
  state: () => {
    return {
      userInfo: getDefaultState(),
    };
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
    refresh(userinfo) {
      if (userinfo) {
        const loginTime = dayjs(userinfo.time);
        if (userinfo && userinfo.token && dayjs().diff(loginTime) < 1000 * 60 * 60 * 24 * 7) {
          LOCAL_STORAGE.setItem(LOCAL_STORAGE_KEY, userinfo);
        }
      }
      this.userInfo = getDefaultState();
    },
    validate() {
      this.refresh();
      return Boolean(this.token);
    },
    /*
    async login(account, password) {
      let resData;
      try {
        resData = await APILoginView.login(account, password);
        if (resData && resData.code === 200) {
          localStorage.setItem(LOCAL_STORAGE_KEY, encodeURIComponent(JSON.stringify(resData.data)));
          this.userInfo = getDefaultState();
        } else {
          throw new Error(getResponseMsg(resData));
        }
      } catch (error) {
        resData = error;
      }
      return resData;
    },
    */
    async logout() {
      let resData;
      try {
        // 退出无需请求接口，直接清除本地数据即可
        // resData = await APILoginView.login
        LOCAL_STORAGE.removeItem(LOCAL_STORAGE_KEY);
        this.userInfo = getDefaultState();
        resData = true;
      } catch (error) {
        resData = error;
      }
      return resData;
    },
  },
});

export { LOCAL_STORAGE_KEY, useUserStore, useUserStore as default };
