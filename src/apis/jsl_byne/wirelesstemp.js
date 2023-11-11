import { request as service } from '../request';
import { assignCommonProperty } from '@shihongxins/jsutils';

export const APIWirelessTemperatureV2 = {
  /**
   * @typedef WirelessTemperatureV2Device
   * @property {string} created_at
   * @property {number} dept_id
   * @property {number} id
   * @property {string} name
   * @property {number} status
   * @property {number} t_alarm
   * @property {string} updated_at
   * @property {string} uuid
   * @property {number} v_alarm
   */
  device: {
    basePath: '/wirelesstemp_v2',
    /**
     * @async
     * @param {import("./global").ListRequestParams} params
     * @returns {Promise<import("./global").ResponseBody<WirelessTemperatureV2Device[]>>}
     */
    async list(params = {}) {
      const reqData = assignCommonProperty(
        {
          dept_id: 0,
          status: -1,
          keyword: '',
          page: 1,
          size: 10,
          sort: 'asc',
        },
        params
      );
      return service.post(`${this.basePath}/list`, reqData).catch((reason) => reason);
    },
    /**
     * @async
     * @param {WirelessTemperatureV2Device} info
     * @returns {Promise<import("./global").ResponseBody<WirelessTemperatureV2Device>>}
     */
    async mod(info = {}) {
      if (!(info && info.id && info.uuid)) {
        return new TypeError('未知设备');
      }
      return service.post(`${this.basePath}/mod`, info).catch((reason) => reason);
    },
  },
  /**
   * @typedef WirelessTemperatureV2Log
   * @property {number} clear_id
   * @property {string} created_at
   * @property {number} id
   * @property {string} name
   * @property {number} status
   * @property {number} t1
   * @property {number} t2
   * @property {number} t3
   * @property {number} t4
   * @property {number} t5
   * @property {number} t6
   * @property {string} updated_at
   * @property {string} uuid
   * @property {number} v1
   * @property {number} v2
   * @property {number} v3
   * @property {number} v4
   * @property {number} v5
   * @property {number} v6
   */
  log: {
    basePath: '/wirelesstemplog_v2',
    /**
     * @async
     * @param {import("./global").ListRequestParams} params
     * @returns {Promise<import("./global").ResponseBody<WirelessTemperatureV2Log[]>>}
     */
    async list(params = {}) {
      const reqData = assignCommonProperty(
        {
          uuid: '',
          alarm: -1,
          start_date: '',
          end_date: '',
          keyword: '',
          page: 1,
          size: 10,
          sort: 'desc',
        },
        params
      );
      return service.post(`${this.basePath}/list`, reqData).catch((reason) => reason);
    },
  },
};
