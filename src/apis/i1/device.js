import { request } from '../request';

/**
 * @param {string} basePath
 * @param {import("axios").AxiosInstance} service
 * @returns
 */
export const useAPII1Device = (basePath = '', service) => {
  if (!basePath) {
    throw new Error('未知 i1 接口基础路径');
  }
  service = service || request;
  const advantage = {
    basePath,
    /**
     * 设备采样参数
     * @typedef DevSamplingInfo
     * @property {string} cmd_id 设备号
     * @property {number} heartbeat_time 心跳上送周期
     * @property {number} main_time 采集时间周期
     * @property {number} sample_count 高速采用点数
     * @property {number} sample_freq 高速采样频率
     */
    sampling: {
      basePath: basePath,
      /**
       * 查询 设备采样参数
       * @param {object} query
       * @param {string} query.cmd_id
       * @param {string} query.uuid
       * @param {1|2|3|4|5} query.dev_type - 1图片机2云台 3杆塔倾斜 4微气象 5绝缘子污秽监测
       */
      get(query = {}) {
        if (!query.cmd_id) {
          return new Error('未知设备');
        }
        query.uuid = query.cmd_id;
        return service
          .get(`${this.basePath}/dev/sampling`, { params: query })
          .catch((reason) => reason);
      },
      /**
       * 设置 设备采样参数
       * @param {DevSamplingInfo} info
       */
      set(info = {}) {
        const reqData = Object.assign(
          {
            cmd_id: '',
            heartbeat_time: 0,
            main_time: 0,
            sample_count: 0,
            sample_freq: 0,
          },
          info
        );
        if (!reqData.cmd_id) {
          return new Error('未知设备');
        }
        return service.post(`${this.basePath}/api/dev/sampling`, reqData).catch((reason) => reason);
      },
    },
    /**
     * 设备网络
     * @typedef DevNetworkInfo
     * @property {string} cmd_id 设备号
     * @property {string} dns_server DNS服务器
     * @property {string} gateway 网关
     * @property {string} ip IP地址
     * @property {string} phone_number 手机串号，只做查询用
     * @property {string} subnet_mask 子网掩码
     */
    network: {
      basePath: basePath,
      /**
       * 查询 设备网络
       * @param {object} query
       * @param {string} query.cmd_id
       * @param {string} query.uuid
       * @param {1|2|3|4|5} query.dev_type - 1图片机2云台 3杆塔倾斜 4微气象 5绝缘子污秽监测
       */
      get(query = {}) {
        if (!query.cmd_id) {
          return new Error('未知设备');
        }
        query.uuid = query.cmd_id;
        return service
          .get(`${this.basePath}/dev/network`, { params: query })
          .catch((reason) => reason);
      },
      /**
       * 设置 设备网络
       * @param {DevNetworkInfo} info
       */
      set(info = {}) {
        const reqData = Object.assign(
          {
            cmd_id: '',
            dns_server: '',
            gateway: '',
            ip: '',
            phone_number: '',
            subnet_mask: '',
          },
          info
        );
        if (!reqData.cmd_id) {
          return new Error('未知设备');
        }
        return service.post(`${this.basePath}/api/dev/network`, reqData).catch((reason) => reason);
      },
    },
    /**
     * 设备唤醒
     * @typedef DevWakeupTime
     * @property {string} cmd_id* 设备编号
     * @property {integer} durationTime 监测装置苏醒时间长度(s)
     * @property {integer} referenceRevivalTime 监测装置苏醒参考时间(s)
     * @property {integer} revivalCycle 监测装置苏醒周期(s)
     */
    wakeup: {
      basePath: basePath + '/api/dev/wakeup',
      /**
       * 设置 设备唤醒
       * @param {DevWakeupTime} info
       */
      set(info = {}) {
        const reqData = Object.assign(
          {
            cmd_id: '',
            durationTime: 0,
            referenceRevivalTime: 0,
            revivalCycle: 0,
          },
          info
        );
        if (!reqData.cmd_id) {
          return new Error('未知设备');
        }
        return service.post(`${this.basePath}`, reqData).catch((reason) => reason);
      },
    },
    /**
     * 设备复位
     * @typedef DevReset
     * @property {string} cmd_id 设备编号
     * @property {0|1|2|3} mode 0常规复位(重启) 1复位至升级模式 2复位至诊断模式 3复位至调试模式
     * @param {DevReset} params
     */
    reset(params = {}) {
      const reqData = Object.assign(
        {
          cmd_id: '',
          mode: 0,
        },
        params
      );
      if (!reqData.cmd_id) {
        return new Error('未知设备');
      }
      return service.post(`${this.basePath}/api/dev/reset`, reqData).catch((reason) => reason);
    },
    /**
     * 设备编码
     * @typedef DevCoding
     * @property {string} cmd_id* 设备编号
     * @property {string} new_cmd_id* 新设备编号
     * @property {string} new_component_id* 新组件编号
     */
    coding: {
      basePath: basePath + '/api/dev/coding',
      /**
       * 设置 设备编码
       * @param {DevCoding} info
       */
      set(info = {}) {
        const reqData = Object.assign(
          {
            cmd_id: '',
            new_cmd_id: '',
            new_component_id: '',
          },
          info
        );
        if (!reqData.cmd_id) {
          return new Error('未知设备');
        }
        return service.post(`${this.basePath}`, reqData).catch((reason) => reason);
      },
    },
  };
  return {
    basePath,
    /**
     * 升级前获取设备最新信息
     * @param {I1DevChannel.cmd_id} cmd_id
     * @param {I1DevChannel.channel_no} channel_no
     */
    dev_info(cmd_id = '', channel_no) {
      if (!cmd_id) {
        return new Error('未知设备');
      }
      // /pc/i1 /pc/gw_i1
      return service
        .get(`${this.basePath}/api/dev/info`, { params: { cmd_id, channel_no } })
        .catch((reason) => reason);
    },
    /**
     * 上传升级文件
     * @param {FormData} formData - 升级文件信息
     * @returns
     */
    upload_file(formData = {}) {
      if (
        !(
          formData &&
          formData.has &&
          ['file_type', 'version', 'file'].every((key) => formData.has(key))
        )
      ) {
        return new Error('升级文件信息不完整');
      }
      // /pc/i1 /pc/gw_i1
      return service
        .post(`${this.basePath}/api/upgrade/upload_file`, formData)
        .catch((reason) => reason);
    },
    /**
     * 删除升级文件
     * @param {object} query - 升级文件查询参数
     * @param {number} query.id - 升级文件记录ID
     */
    delete_file(query = {}) {
      if (!(query && query.id)) {
        return new Error('升级文件信息不完整');
      }
      // /pc/i1 /pc/gw_i1
      return service.post(`${this.basePath}/api/upgrade/del`, query).catch((reason) => reason);
    },
    /**
     * 执行升级
     * @param {object} params - 执行升级请求参数
     * @param {"byte"|"service"} params.type - 执行升级请求参数
     * @param {string} params.cmd_id - 设备号
     * @param {number} params.id - 升级文件记录ID
     */
    upgrade(params = {}) {
      if (!(params && ['byte', 'service'].includes(params.type) && params.cmd_id && params.id)) {
        return new Error('升级版本信息不完整');
      }
      // /pc/i1 /pc/gw_i1
      return service
        .post(`${this.basePath}/api/upgrade/${params.type}`, params)
        .catch((reason) => reason);
    },
    advantage,
  };
};
