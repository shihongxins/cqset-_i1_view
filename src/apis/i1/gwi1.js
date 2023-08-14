import { getListRequestParams } from '../global';
import http from '../http';

export const APIGWI1 = {
  /**
   * @typedef GWI1FaultListParams
   * @property {string} uuid
   * @property {number} dept_id
   * @property {string} keyword
   * @property {number} page
   * @property {number} size
   * @property {'asc'|'desc'} sort
   * 国网 i1 设备故障信息
   * @param {GWI1FaultListParams} params
   * @returns
   */
  async fault_list(params = {}) {
    const reqData = Object.assign({}, getListRequestParams(), params);
    return http.post('/pc/gw_i1/fault/list', reqData).catch((reason) => reason);
  },
  component: {
    insulator_leakage_current: {
      /**
       * 绝缘子串泄露电流数据
       * @param {object} params - 通道信息
       * @param {string} params.cmd_id - 设备编号
       * @param {string} params.component_id - 被监测设备 ID（17 位编码）
       * @param {string} params.sort - 排序方式
       * @param {string} params.start_date - 时间
       * @param {number} params.page - 列表页码
       * @param {number} params.size - 列表分页量
       */
      async list(params) {
        if (!(params.cmd_id && params.component_id)) {
          return new Error('无法获取绝缘子串泄露电流数据，缺少必要信息');
        }
        return http
          .post('/pc/gw_i1/dev/component/insulator_leakage_current', params)
          .catch((reason) => reason);
      },
      /**
       * 绝缘子参数
       * @typedef GWI1Insulator
       * @property {string} cmd_id 设备编号
       * @property {number} creepage_distance 爬电距离
       * @property {string} types 具体类型
       */
      insulator: {
        basePath: '/pc/gw_i1/insulator',
        /**
         * @param {GWI1Insulator} insulatorInfo
         */
        async add(insulatorInfo = {}) {
          if (!(insulatorInfo && insulatorInfo.cmd_id)) {
            return new Error('未知绝缘子参数设备信息');
          }
          const reqData = Object.assign(
            {
              cmd_id: '',
              creepage_distance: 0,
              types: '',
            },
            insulatorInfo || {}
          );
          return http.post(`${this.basePath}/add`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1Insulator} insulatorInfo
         */
        async del(insulatorInfo = {}) {
          if (!(insulatorInfo && insulatorInfo.cmd_id)) {
            return new Error('未知绝缘子参数设备信息');
          }
          return http.post(`${this.basePath}/delete`, insulatorInfo).catch((reason) => reason);
        },
        /**
         * @param {GWI1Insulator} insulatorInfo
         */
        async update(insulatorInfo = {}) {
          if (!(insulatorInfo && insulatorInfo.cmd_id)) {
            return new Error('未知绝缘子参数设备信息');
          }
          const reqData = Object.assign(
            {
              cmd_id: '',
              creepage_distance: 0,
              types: '',
            },
            insulatorInfo || {}
          );
          return http.post(`${this.basePath}/update`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1Insulator} insulatorInfo
         */
        async get(insulatorInfo = {}) {
          if (!(insulatorInfo && insulatorInfo.cmd_id)) {
            return new Error('未知绝缘子参数设备信息');
          }
          return http.post(`${this.basePath}/get`, insulatorInfo).catch((reason) => reason);
        },
      },
    },
    site_pollution: {
      /**
       * 现场污秽数据
       * @param {object} params - 通道信息
       * @param {string} params.cmd_id - 设备编号
       * @param {string} params.component_id - 被监测设备 ID（17 位编码）
       * @param {string} params.sort - 排序方式
       * @param {string} params.start_date - 时间
       * @param {number} params.page - 列表页码
       * @param {number} params.size - 列表分页量
       */
      async list(params) {
        if (!(params.cmd_id && params.component_id)) {
          return new Error('无法获取现场污秽数据，缺少必要信息');
        }
        return http
          .post('/pc/gw_i1/dev/component/site_pollution', params)
          .catch((reason) => reason);
      },
      /**
       * @typedef GWI1SitePollutionAlarmThreshold 告警阈值信息
       * @property {string} cmd_id
       * @property {number} esdd
       * @property {number} leakage_current
       * @property {number} nsdd
       * @property {number} pollution_lightning_pressure
       */ alarm: {
        basePath: '/pc/gw_i1/site_pollution/alarm',
        /**
         * @param {GWI1SitePollutionAlarmThreshold} alarmInfo
         */
        async add(alarmInfo = {}) {
          if (!(alarmInfo && alarmInfo.cmd_id)) {
            return new Error('未知告警阈值设备信息');
          }
          const reqData = Object.assign(
            {
              cmd_id: '',
              esdd: 0,
              leakage_current: 0,
              nsdd: 0,
              pollution_lightning_pressure: 0,
            },
            alarmInfo || {}
          );
          return http.post(`${this.basePath}/add`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1SitePollutionAlarmThreshold} alarmInfo
         */
        async del(alarmInfo = {}) {
          if (!(alarmInfo && alarmInfo.cmd_id)) {
            return new Error('未知告警阈值设备信息');
          }
          return http.post(`${this.basePath}/delete`, alarmInfo).catch((reason) => reason);
        },
        /**
         * @param {GWI1SitePollutionAlarmThreshold} alarmInfo
         */
        async update(alarmInfo = {}) {
          if (!(alarmInfo && alarmInfo.cmd_id)) {
            return new Error('未知告警阈值设备信息');
          }
          const reqData = Object.assign(
            {
              cmd_id: '',
              esdd: 0,
              leakage_current: 0,
              nsdd: 0,
              pollution_lightning_pressure: 0,
            },
            alarmInfo || {}
          );
          return http.post(`${this.basePath}/update`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1SitePollutionAlarmThreshold} alarmInfo
         */
        async get(alarmInfo = {}) {
          if (!(alarmInfo && alarmInfo.cmd_id)) {
            return new Error('未知告警阈值设备信息');
          }
          return http.post(`${this.basePath}/get`, alarmInfo).catch((reason) => reason);
        },
      },
    },
  },
};
