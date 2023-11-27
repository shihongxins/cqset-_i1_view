import { request as service } from '../request';

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
    const reqData = Object.assign(
      {
        start_date: '',
        uuid: '',
        keyword: '',
        page: 1,
        size: 10,
        sort: 'desc',
      },
      params
    );
    return service.post('/pc/gw_i1/fault/list', reqData).catch((reason) => reason);
  },
  /**
   * @typedef I1GwComponentDataQuery - i1 国网组件设备数据查询参数
   * @property {string} cmd_id - 设备编号
   * @property {string?} dev_type - 被监测设备类型
   * @property {string?} component_id - 被监测设备 组件ID
   * @property {string} sort - 排序方式
   * @property {string} start_date - 时间
   * @property {number} page - 列表页码
   * @property {number} size - 列表分页量
   */
  component: {
    insulator_leakage_current: {
      /**
       * 绝缘子串泄露电流数据
       * @param {I1GwComponentDataQuery} params
       */
      async list(params = {}) {
        if (!params.cmd_id) {
          return new Error('无法获取绝缘子串泄露电流数据，缺少必要信息');
        }
        return service
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
          return service.post(`${this.basePath}/add`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1Insulator} insulatorInfo
         */
        async del(insulatorInfo = {}) {
          if (!(insulatorInfo && insulatorInfo.cmd_id)) {
            return new Error('未知绝缘子参数设备信息');
          }
          return service.post(`${this.basePath}/delete`, insulatorInfo).catch((reason) => reason);
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
          return service.post(`${this.basePath}/update`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1Insulator} insulatorInfo
         */
        async get(insulatorInfo = {}) {
          if (!(insulatorInfo && insulatorInfo.cmd_id)) {
            return new Error('未知绝缘子参数设备信息');
          }
          return service.post(`${this.basePath}/get`, insulatorInfo).catch((reason) => reason);
        },
      },
    },
    site_pollution: {
      /**
       * 现场污秽数据
       * @param {I1GwComponentDataQuery} params
       */
      async list(params = {}) {
        if (!params.cmd_id) {
          return new Error('无法获取现场污秽数据，缺少必要信息');
        }
        return service
          .post('/pc/gw_i1/dev/component/site_pollution', params)
          .catch((reason) => reason);
      },
      /**
       * @typedef GWI1SitePollutionAlarmThreshold 现场污秽 - 告警阈值信息
       * @property {string} cmd_id
       * @property {number} esdd
       * @property {number} leakage_current
       * @property {number} nsdd
       * @property {number} pollution_lightning_pressure
       */
      alarm: {
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
          return service.post(`${this.basePath}/add`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1SitePollutionAlarmThreshold} alarmInfo
         */
        async del(alarmInfo = {}) {
          if (!(alarmInfo && alarmInfo.cmd_id)) {
            return new Error('未知告警阈值设备信息');
          }
          return service.post(`${this.basePath}/delete`, alarmInfo).catch((reason) => reason);
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
          return service.post(`${this.basePath}/update`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1SitePollutionAlarmThreshold} alarmInfo
         */
        async get(alarmInfo = {}) {
          if (!(alarmInfo && alarmInfo.cmd_id)) {
            return new Error('未知告警阈值设备信息');
          }
          return service.post(`${this.basePath}/get`, alarmInfo).catch((reason) => reason);
        },
      },
    },
    /**
     * @typedef I1GwPollutionLightningPressure 污闪电压数据
     * @property {boolean} alarm 告警
     * @property {integer} clear_id 消缺ID
     * @property {string} cmd_id
     * @property {string} component_id 被监测设备 ID
     * @property {string} created_at
     * @property {number} flashover_volt 闪络电压（无符号整数，取值范围：大于 0, 单位:V）
     * @property {integer} id
     * @property {number} leakage_curr 泄露电流（浮点数，取值范围：大于 0, 单位 mA）
     * @property {integer} max_humi 日最高湿度(无符号字符，取值范围：0~100, 单位 RH%）
     * @property {number} max_temp 日最高温度（浮点数，取值范围：-100~+100, 单位℃）
     * @property {integer} min_humi 日最低湿度(无符号字符，取值范围：0~100, 单位 RH%）
     * @property {number} min_temp 日最低温度（浮点数，取值范围：-100~+100,, 单位℃）
     * @property {number} salt_density 等值盐密度（浮点数，取值范围：大于 0, 单位 mg/cm 2 ）
     * @property {string} timestamp 采集时间
     * @property {integer} unit_no 采集单元序号
     * @property {integer} unit_sum 采集单元总数
     * @property {string} updated_at
     */
    pollution_lightning_pressure: {
      /**
       * 污闪电压数据
       * @param {I1GwComponentDataQuery} params
       * @returns {Promise<import('../global.js').ResponseBody<I1GwPollutionLightningPressure>>}
       */
      async list(params = {}) {
        if (!params.cmd_id) {
          return new Error('无法获取污闪电压数据，缺少必要信息');
        }
        return service
          .post('/pc/gw_i1/dev/component/pollution_lightning_pressure', params)
          .catch((reason) => reason);
      },
    },
    /**
     * @typedef I1GwIceMonitor 覆冰监测数据
     * @property {number} air_temperature 拉力采集时刻的气温
     * @property {boolean} alarm 是否告警
     * @property {integer} clear_id 消缺ID
     * @property {string} cmd_id 设备编码
     * @property {string} component_id 被监测设备编码
     * @property {string} created_at 创建时间
     * @property {number} equal_ice_thickness 等值覆冰厚度(精确到小数点后1位) mm
     * @property {integer} humidity 拉力采集时刻的湿度 %RH
     * @property {integer} id 记录ID
     * @property {number} instantaneous_wind_direction 监测装置安装点处拉力采集时刻的瞬时风向
     * @property {number} instantaneous_wind_speed 监测装置安装点处拉力采集时间的瞬时风速 m/s
     * @property {integer} t_sensor_num 安装的拉力传感器个数
     * @property {number} tension 综合载荷 N
     * @property {string} tension_detail 拉力传感器数据
     * @property {number} tension_difference 不均衡张力差N
     * @property {string} timestamp 采集时间
     * @property {string} updated_at 更新时间
     */
    ice_monitor: {
      /**
       * 覆冰监测数据
       * @param {I1GwComponentDataQuery} params
       * @returns {Promise<import('../global.js').ResponseBody<I1GwIceMonitor>>}
       */
      async list(params = {}) {
        if (!params.cmd_id) {
          return new Error('无法获取覆冰监测数据，缺少必要信息');
        }
        return service
          .post('/pc/gw_i1/dev/component/ice_monitor', params)
          .catch((reason) => reason);
      },
      /**
       * @typedef GWI1IceMonitorAlarmThreshold 覆冰监测 - 告警阈值信息
       * @property {string} cmd_id
       * @property {number} air_temperature - 气温
       * @property {number} equal_ice_thickness - 等值覆冰厚度
       * @property {number} humidity - 湿度
       * @property {number} instantaneous_wind_speed - 风速
       * @property {number} crosswise_angle - 横向偏斜角
       * @property {number} forward_tilt_angle - 顺向偏斜角
       * @property {number} tension - 综合载荷
       * @property {number} tension_difference - 不均衡张力差
       * @property {number} tension_value - 拉力值
       */
      alarm: {
        basePath: '/pc/gw_i1/ice_monitor/alarm',
        /**
         * @param {GWI1IceMonitorAlarmThreshold} alarmInfo
         */
        async add(alarmInfo = {}) {
          if (!(alarmInfo && alarmInfo.cmd_id)) {
            return new Error('未知告警阈值设备信息');
          }
          const reqData = Object.assign(
            {
              cmd_id: '',
              air_temperature: 30,
              equal_ice_thickness: 10,
              humidity: 10,
              instantaneous_wind_speed: 10,
              crosswise_angle: 0,
              forward_tilt_angle: 0,
              tension: 0,
              tension_difference: 0,
              tension_value: 0,
            },
            alarmInfo || {}
          );
          return service.post(`${this.basePath}/add`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1SitePollutionAlarmThreshold} alarmInfo
         */
        async del(alarmInfo = {}) {
          if (!(alarmInfo && alarmInfo.cmd_id)) {
            return new Error('未知告警阈值设备信息');
          }
          return service.post(`${this.basePath}/delete`, alarmInfo).catch((reason) => reason);
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
              air_temperature: 30,
              equal_ice_thickness: 10,
              humidity: 10,
              instantaneous_wind_speed: 10,
              crosswise_angle: 0,
              forward_tilt_angle: 0,
              tension: 0,
              tension_difference: 0,
              tension_value: 0,
            },
            alarmInfo || {}
          );
          return service.post(`${this.basePath}/update`, reqData).catch((reason) => reason);
        },
        /**
         * @param {GWI1SitePollutionAlarmThreshold} alarmInfo
         */
        async get(alarmInfo = {}) {
          if (!(alarmInfo && alarmInfo.cmd_id)) {
            return new Error('未知告警阈值设备信息');
          }
          return service.post(`${this.basePath}/get`, alarmInfo).catch((reason) => reason);
        },
      },
    },
    /**
     * 导地线微风振动特征量数据
     * @async
     * @param {I1GwComponentDataQuery} params
     * @returns {Promise<import('../global.js').ResponseBody<any>>}
     */
    async characteristic_quantity(params = {}) {
      if (!(params && params.cmd_id)) {
        return new Error('无法获取导地线微风振动特征量数据，缺少设备信息');
      }
      return service
        .post(`/pc/gw_i1/dev/component/characteristic_quantity`, params)
        .catch((reason) => reason);
    },
    /**
     * 导地线舞动特征量数据
     * @async
     * @param {I1GwComponentDataQuery} params
     * @returns {Promise<import('../global.js').ResponseBody<any>>}
     */
    async conductor_dancing(params = {}) {
      if (!(params && params.cmd_id)) {
        return new Error('无法获取导地线舞动特征量数据，缺少设备信息');
      }
      return service
        .post(`/pc/gw_i1/dev/component/conductor_dancing`, params)
        .catch((reason) => reason);
    },
    /**
     * 导线风偏数据
     * @async
     * @param {I1GwComponentDataQuery} params
     * @returns {Promise<import('../global.js').ResponseBody<any>>}
     */
    async conductor_deviation(params = {}) {
      if (!(params && params.cmd_id)) {
        return new Error('无法获取导线风偏数据，缺少设备信息');
      }
      return service
        .post(`/pc/gw_i1/dev/component/conductor_deviation`, params)
        .catch((reason) => reason);
    },
    /**
     * 导线弧垂数据
     * @async
     * @param {I1GwComponentDataQuery} params
     * @returns {Promise<import('../global.js').ResponseBody<any>>}
     */
    async conductor_sag(params = {}) {
      if (!(params && params.cmd_id)) {
        return new Error('无法获取导线拉差数据，缺少设备信息');
      }
      return service
        .post(`/pc/gw_i1/dev/component/conductor_sag`, params)
        .catch((reason) => reason);
    },
    /**
     * 导线温度数据
     * @async
     * @param {I1GwComponentDataQuery} params
     * @returns {Promise<import('../global.js').ResponseBody<any>>}
     */
    async conductor_temperature(params = {}) {
      if (!(params && params.cmd_id)) {
        return new Error('无法获取导线温度数据，缺少设备信息');
      }
      return service
        .post(`/pc/gw_i1/dev/component/conductor_temperature`, params)
        .catch((reason) => reason);
    },
    // TODO: component_conductor_dancing_track 导地线舞动轨迹数据
    // TODO: wave_form 导地线微风振动波形信号数据
    // TODO: 日志消缺
  },
};
