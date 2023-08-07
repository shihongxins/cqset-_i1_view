// Copyright (c) 2023 shihongxins
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { request } from '../request';

export const APIBigscreen = {
  basePath: '/pc/i1/screen',
  /**
   * 设备在线统计
   * @returns {Promise<import('../request/tools').ErrorFirstStyleResponse<any>>}
   */
  async status() {
    return request.get(`${this.basePath}/status`);
  },
};
