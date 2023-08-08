// Copyright (c) 2023 shihongxins
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { assignCommonProperty } from '@shihongxins/jsutils';
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
  /**
   * 所有通道设备
   * @param {{status: 'ALL'|'ONLINE'|'OFFLINE', media_type: 'all'|'image'|'video', cmd_id: string} & import('../request/tools').BaseQueryParams} query
   * @returns {Promise<import('../request/tools').ErrorFirstStyleResponse<any>>}
   */
  async dev(query = {}) {
    const reqData = assignCommonProperty(
      {
        status: 'ALL',
        media_type: 'all',
        cmd_id: '',
        keyword: '',
        page: 1,
        size: 8,
        sort: 'asc',
      },
      query
    );
    return request.get(`${this.basePath}/dev`, { params: reqData });
  },
};
