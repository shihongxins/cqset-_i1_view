import { request } from './request';

export const APIUser = {
  basePath: '/sys',
  async getVerifyCode() {
    return request
      .post(`${this.basePath}/get_verify_code`, {}, { responseType: 'blob' })
      .catch((reason) => reason);
  },
  async login(username, password, code) {
    if (!(username && password && code)) {
      return Promise.reject('用户名或密码不能为空');
    }
    return request
      .post(`${this.basePath}/login`, { username, password, code })
      .catch((reason) => reason);
  },
  async getMenu() {
    return request.post(`${this.basePath}/get_menu`).catch((reason) => reason);
  },
};
