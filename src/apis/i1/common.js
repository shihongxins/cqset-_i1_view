export const DevTypeMap = {
  0: '所有设备',
  1: '枪机',
  2: '云台',
  3: '杆塔倾斜',
  4: '微气象',
  5: '污秽监测',
  6: '覆冰监测',
  7: '微风振动',
  8: '导线舞动',
  9: '风偏和弧垂',
};

export const ChannelDevTypeMap = {
  GUN: {
    zh: '枪机',
    name: 'GUN',
  },
  PTZ: {
    zh: '云台',
    name: 'PTZ',
  },
  breeze_vibration_characteristic: {
    zh: '微风振动特征量',
    name: 'breeze_vibration_characteristic',
  },
  breeze_vibration_waveform_signal: {
    zh: '微风振动波形信号',
    name: 'breeze_vibration_waveform_signal',
  },
  conductor_dancing: {
    zh: '导线舞动特征量',
    name: 'conductor_dancing',
  },
  conductor_dancing_track: {
    zh: '导地线舞动轨迹',
    name: 'conductor_dancing_track',
  },
  conductor_deviation: {
    zh: '导线风偏',
    name: 'conductor_deviation',
  },
  conductor_sag: {
    zh: '导线弧垂',
    name: 'conductor_sag',
  },
  conductor_temperature: {
    zh: '导线温度',
    name: 'conductor_temperature',
  },
  ice_monitor: {
    zh: '覆冰监测',
    name: 'ice_monitor',
  },
  insulator_leakage_current: {
    zh: '绝缘子串泄露电流',
    name: 'insulator_leakage_current',
  },
  micro_meteorology: {
    zh: '微气象',
    name: 'micro_meteorology',
  },
  pollution_lightning_pressure: {
    zh: '闪络电压监测扩展协议(武汉风河智能)',
    name: 'pollution_lightning_pressure',
  },
  site_pollution: {
    zh: '现场污秽度',
    name: 'site_pollution',
  },
  tower_tilt: {
    zh: '杆塔倾斜',
    name: 'tower_tilt',
  },
};

/**
 * @param {string} basePath
 * @param {import("axios").AxiosInstance} service
 * @returns
 */
export const useI1CommonAPI = (basePath, service) => {
  if (!basePath) {
    throw new Error('未知 i1 接口基础路径');
  }
  if (!service) {
    throw new Error('必须传入 axios 或 axios 实例');
  }
  /**
   * @typedef {object} I1Dev - i1 设备
   * @property {string} uuid - 设备编号
   * @property {"ALL"|"GUN"|"HALF"|"BALL"|"PTZ"|"UNKNOW"} camera_type - 监控点类型 GUN枪机 HALF半球 BALL-快球 PTZ-云台 UNKNOW-未知
   * @property {string} camera_uuid - 相机UUID
   * @property {string} cmd_id - 状态监测装置 ID
   * @property {string} created_at - 创建时间
   * @property {number} dept_id - 部门
   * @property {string} detail - 电量等详细信息
   * @property {1|2|3|4|5} dev_type - 1图片机2云台 3杆塔倾斜 4微气象 5绝缘子污秽监测
   * @property {number} id
   * @property {string} name - 名称
   * @property {boolean} status - 在线状态
   * @property {number} station_id - 变电站ID
   * @property {number} tower_id - 杆塔ID
   * @property {string} updated_at - 更新时间
   * @property {string} version - 版本信息
   */
  const dev = {
    basePath: basePath + '/dev',
    /**
     * 添加 i1 设备
     * @param {I1Dev} info - i1 设备信息
     */
    add(info = {}) {
      const devInfo = Object.assign(
        {
          dept_id: 0,
          tower_id: 0,
          dev_type: 0,
          cmd_id: 'string',
          name: '',
        },
        info
      );
      if (!(devInfo && (devInfo.station_id || devInfo.tower_id) && devInfo.cmd_id)) {
        return new Error('设备信息不完整');
      }
      return service.post(`${this.basePath}/add`, devInfo).catch((reason) => reason);
    },
    /**
     * 删除 i1 设备
     * @param {I1Dev.cmd_id|string} uuid - i1 设备编号
     */
    del(uuid = '') {
      if (!uuid) {
        return new Error('未知设备编号');
      }
      return service.post(`${this.basePath}/del`, { uuid }).catch((reason) => reason);
    },
    /**
     * @typedef {object} I1DevListParams - i1 设备列表查询参数
     * @property {string} keyword - 搜索关键词(可选)
     * @property {number} page - minimum: 1 *页码(必须)
     * @property {number} size - minimum: 1 *每页条数(必须)
     * @property {"asc"|"desc"} sort - *排序方式(必须)
     * @property {number} station_id - 变电站(可选)
     * @property {number} line_id - 线路(可选)
     * @property {number} tower_id - 杆塔(可选)
     * @property {"ALL"|"GUN"|"HALF"|"BALL"|"PTZ"|"UNKNOW"} camera_type - *设备类型 监控点类型 GUN-枪机 HALF-半球 BALL-快球 PTZ-云台 UNKNOW-未知
     * @property {"ALL"|"ONLINE"|"OFFLINE"} status - *是否在线 ALL-所有 ONLINE-在线 OFFLINE-离线
     *
     * @description i1 设备列表
     * @param {I1DevListParams} query
     */
    async list(query = {}) {
      const reqData = Object.assign(
        {
          keyword: '',
          page: 1,
          size: 1,
          sort: 'asc',
          camera_type: 'ALL',
          status: 'ALL',
        },
        query
      );
      return service.post(`${this.basePath}/list`, reqData).catch((reason) => reason);
    },
    /**
     * 修改 i1 设备
     * @param {I1Dev} info - i1 设备信息
     */
    mod(info = {}) {
      const devInfo = Object.assign(
        {
          dept_id: 0,
          tower_id: 0,
          dev_type: 0,
          cmd_id: 'string',
          name: '',
        },
        info
      );
      if (!(devInfo && (devInfo.station_id || devInfo.tower_id) && devInfo.cmd_id)) {
        return new Error('设备信息不完整');
      }
      return service.post(`${this.basePath}/mod`, devInfo).catch((reason) => reason);
    },
  };

  /**
   * @typedef {object} I1DevChannel - i1 设备通道
   * @property {number} channel_no - 通道号
   * @property {I1Dev.cmd_id} cmd_id - 设备号
   * @property {"GUN"|"PTZ"|"tower_tilt"|"micro_meteorology"|"site_pollution"|"insulator_leakage_current"} dev_type - GUN: "枪机",PTZ: "云台",tower_tilt: "杆塔倾斜",micro_meteorology: "微气象",site_pollution: "现场污秽",insulator_leakage_current: "绝缘子串泄露电流数据",
   * @property {string} name - 设备通道名称
   */
  const channel = {
    basePath: basePath + '/dev/channel',
    /**
     * 添加通道
     * @param {I1DevChannel} info - 设备通道信息
     */
    add(info = {}) {
      const channelInfo = Object.assign(
        {
          cmd_id: '',
          channel_no: void 0,
          dev_type: '',
          name: '',
        },
        info
      );
      if (
        !(
          channelInfo &&
          channelInfo.cmd_id &&
          (channelInfo.dev_type ||
            (['GUN', 'PTZ'].includes(channelInfo.dev_type) && channelInfo.channel_no))
        )
      ) {
        return new Error('通道信息不完整');
      }
      return service.post(`${this.basePath}/add`, channelInfo).catch((reason) => reason);
    },
    /**
     * 通道列表
     * @param {I1Dev.cmd_id|string} uuid - i1 设备编号
     */
    list(uuid = '') {
      if (!uuid) {
        return new Error('未知设备编号');
      }
      return service.post(`${this.basePath}/list`, { uuid }).catch((reason) => reason);
    },
    /**
     * 删除通道
     * @param {number} id - 设备通道信息
     */
    async del(id) {
      if (id <= 0) {
        return new Error('通道信息不完整');
      }
      return service.post(`${this.basePath}/del`, { id }).catch((reason) => reason);
    },
    /**
     * 修改通道
     * @param {I1DevChannel} info - 设备通道信息
     */
    async mod(info = {}) {
      const channelInfo = Object.assign(
        {
          cmd_id: '',
          channel_no: void 0,
          dev_type: '',
          name: '',
        },
        info
      );
      if (
        !(
          channelInfo &&
          channelInfo.cmd_id &&
          (channelInfo.dev_type ||
            (['GUN', 'PTZ'].includes(channelInfo.dev_type) && channelInfo.channel_no))
        )
      ) {
        return new Error('通道信息不完整');
      }
      return service.post(`${this.basePath}/mod`, channelInfo).catch((reason) => reason);
    },
    /**
     * 通道类型
     * @returns
     */
    async type() {
      return service.post(`/pc/gw_i1/dev/channel/type`).catch((reason) => reason);
    },
  };

  const upgrade = {
    basePath: basePath + '/dev/upgrade',
    /**
     * @typedef I1DevUpgradeFileListQuery - i1 设备升级文件列表查询参数
     * @property {I1Dev.cmd_id} cmd_id - 设备编号
     * @property {0|1|2|3} dev_file_type - 设备升级文件类型：0：程序升级包，1：系统包，2：补丁,3-智能识别模型
     * @property {1|2} file_type - 升级文件类型: 1通用升级文件,2单个设备
     * @property {1|2} i1_region - I1协议地区版本 1:青海北京智芯 2:国网
     * @property {string} patch_path - 仅针对补丁有效，固定长度
     * @property {string} version - 版本号
     *
     * @param {I1DevUpgradeFileListQuery & { page: number, size: number }} query
     */
    file_list(query = {}) {
      const reqData = {
        params: Object.assign(
          {
            page: 1,
            size: 100,
            cmd_id: '',
            dev_file_type: 0,
            file_type: 0,
            i1_region: 0,
            patch_path: '',
            version: '',
          },
          query
        ),
      };
      if (!reqData.params.cmd_id) {
        return new Error('未知设备');
      }
      return service.get(`${this.basePath}/list`, { ...reqData }).catch((reason) => reason);
    },
  };

  const micro_meteorology = {
    /**
     * 微气象数据
     * @param {object} params - 通道信息
     * @param {string} params.cmd_id - 设备编号
     * @param {string?} params.dev_type - 设备类型 micro_meteorology
     * @param {string} params.sort - 排序方式
     * @param {string} params.start_date - 时间
     * @param {number} params.page - 列表页码
     * @param {number} params.size - 列表分页量
     */
    async list(params) {
      if (!params.cmd_id) {
        return new Error('无法获取微气象数据，缺少必要信息');
      }
      return service
        .get(`${basePath}/component/micro_meteorology`, { params })
        .catch((reason) => reason);
    },
  };
  return {
    dev,
    channel,
    upgrade,
    micro_meteorology,
  };
};
