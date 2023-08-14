/**
 * @typedef {object} I1PresentPoint - 预置点
 * @property {number} channel_no 通道号
 * @property {string} cmd_id 设备编号
 * @property {string} memo 预置点备注
 * @property {number} present_point 预置点号
 */

import { request } from '../request';
import { isNumberInRange } from '@shihongxins/jsutils';

export const APII1 = {
  /**
   * 轮播图片
   * @returns
   */
  async wheel_seeding(params = {}) {
    const defaultParams = {
      line_id: 0,
      tower_id: 0,
      cmd_id: '',
      channel_no: 0,
      start_date: '',
      end_date: '',
      keyword: '',
      page: 1,
      size: 10,
      sort: 'desc',
    };
    const reqData = Object.assign({}, defaultParams, params);
    return request.post('/pc/i1/wheel_seeding', reqData).catch((reason) => reason);
  },
  /**
   * 设备图片
   * @returns
   */
  async photo_list(params = {}) {
    const defaultParams = {
      line_id: 0,
      tower_id: 0,
      uuid: '',
      channel_no: 0,
      start_date: '',
      end_date: '',
      keyword: '',
      page: 1,
      size: 10,
      sort: 'desc',
    };
    const reqData = Object.assign({}, defaultParams, params);
    if (!reqData.uuid) {
      return new Error('未知设备');
    }
    return request.get('/pc/i1/photo/list', { params: reqData }).catch((reason) => reason);
  },
  /**
   * 通道图片
   * @returns
   */
  async channel_photo(params = {}) {
    const defaultParams = {
      line_id: 0,
      tower_id: 0,
      cmd_id: '',
      channel_no: 0,
      start_date: '',
      end_date: '',
      keyword: '',
      page: 1,
      size: 10,
      sort: 'desc',
    };
    const reqData = Object.assign({}, defaultParams, params);
    if (!reqData.cmd_id) {
      return new Error('未知设备');
    }
    return request.post('/pc/i1/dev/channel/photo', reqData).catch((reason) => reason);
  },
  /**
   * 预置点
   */
  preset: {
    /**
     * 预置点-列表
     * @param {object} params - 查询参数
     * @param {string} params.cmd_id - 设备编号
     * @param {string} params.channel_no - 通道号
     * @param {number} params.page - 页码
     * @param {number} params.size - 页数
     */
    async list(params = {}) {
      const reqData = Object.assign(
        {
          cmd_id: '',
          channel_no: 0,
          page: 1,
          size: 10,
        },
        params
      );
      if (!(reqData.cmd_id && reqData.channel_no)) {
        return new Error('查询预置点信息不完整');
      }
      return request.post('/pc/i1/dev/present_point/list', reqData).catch((reason) => reason);
    },
  },
  /**
   * 设备控制：推流，抓图，录像，云控，控球，定时任务
   */
  ctrl: {
    basePath: '/pc/i1',
    /**
     * 视频推流传输开始/停止
     * @param {object} params - 推流控制参数
     * @param {string} params.cmd_id - 设备号
     * @param {number} params.channel_no - 通道号
     * @param {0|1} params.control - 推流控制参数 0关闭 1启动
     * @returns
     */
    async video(params = {}) {
      if (!(params.cmd_id && params.channel_no)) {
        return new Error('未知设备及通道信息');
      }
      params.control = Number(Boolean(params.control)) || 0;
      return request
        .post(`${this.basePath}/api/video_transmission`, params)
        .catch((reason) => reason);
    },
    /**
     * 手动抓图
     * @param {object} params - 抓图参数
     * @param {string} params.cmd_id - 设备号
     * @param {number} params.channel_no - 通道号
     * @param {number} params.present - 预置点位号
     */
    async snap(params = {}) {
      const reqData = Object.assign(
        {
          cmd_id: '',
          channel_no: 0,
          present: 255,
        },
        params
      );
      if (!(reqData.cmd_id && reqData.channel_no)) {
        return new Error('缺少抓图参数');
      }
      let { present = 0 } = reqData;
      if (!(typeof present === 'number' && isNumberInRange(present, 0, 255, true))) {
        present = 255;
      }
      reqData.present = present;
      return request.post(`${this.basePath}/api/manual_photo`, reqData).catch((reason) => reason);
    },
    /**
     * 手动录像
     * @param {object} params - 录像参数
     * @param {string} params.cmd_id - 设备号
     * @param {number} params.channel_no - 通道号
     * @param {number} params.present - 预置点位号
     * @param {number} params.cap_time - 录像时长 10~255 s
     */
    async recording(params = {}) {
      const reqData = Object.assign(
        {
          cmd_id: '',
          channel_no: 0,
          present: 255,
          request_content: 1,
          cap_time: 10,
        },
        params
      );
      if (!(reqData.cmd_id && reqData.channel_no)) {
        return new Error('缺少录像参数');
      }
      let { present = 255, cap_time = 10 } = reqData;
      if (!(typeof present === 'number' && isNumberInRange(present, 0, 255, true))) {
        present = 255;
      }
      if (!(typeof cap_time === 'number' && isNumberInRange(cap_time, 10, 255, true))) {
        cap_time = 10;
      }
      reqData.present = present;
      reqData.cap_time = cap_time;
      return request.post(`${this.basePath}/api/manual_video`, reqData).catch((reason) => reason);
    },
    /**
     * 云台控制
     * @param {object} param - 控制信息
     * @param {string} param.cmd_id - 设备号
     * @param {number} param.channel_no - 通道号
     * @param {number} param.action_arg - 动作参数
     * @param {number} param.action - 动作
     * @param {string} param.memo - 备注
     * @returns
     */
    async ptz(param = {}) {
      const reqData = Object.assign(
        {
          cmd_id: '',
          channel_no: 1,
          action_arg: 0,
          action: 0,
          memo: '',
        },
        param
      );
      if (!(reqData.cmd_id && reqData.channel_no && reqData.action)) {
        return new Error('缺少控制参数');
      }
      return request.post(`${this.basePath}/api/camera_ptz`, reqData).catch((reason) => reason);
    },
  },
  /**
   * 抓图任务
   */
  snapTask: {
    basePath: '/pc/i1',
    /**
     * 获取抓图任务
     * @param {object} query - 查询参数
     * @param {string} query.cmd_id - 设备编号
     * @param {number} query.channel_no - 通道号
     * @returns
     */
    async get(query = {}) {
      if (!(query.cmd_id && query.channel_no)) {
        return new Error('未知设备及通道信息');
      }
      return request
        .get(`${this.basePath}/api/timetable_photo`, { params: query })
        .catch((reason) => reason);
    },
    /**
     * 设置抓图任务
     * @param {object} params - 任务信息详情
     * @param {0|1} params.req_flag - 参数配置类型标识；0 查询配置信息(默认不传) 1 设置配置信息
     * @param {string} params.cmd_id - 摄像机 ID
     * @param {1|2} params.set_flag - 操作 1-新增 2-删除
     * @param {number} params.channel_no - 频道
     * @param {object} params.time_point - 抓图时间任务点
     * @returns
     */
    async set(params = {}) {
      const reqData = Object.assign(
        {
          channel_no: 0, // 通道号
          cmd_id: '', // 设备号
          req_flag: 1, // 配置操作参数 0-查询 1-设置
          set_flag: 1, // 1:新增 2:删除
          time_point: {
            start_hour: 20, // 开始小时
            close_hour: 22, // 结束
            minute: 30, // 间隔
            preset_no: 255,
          },
        },
        params
      );
      if (!(reqData.cmd_id && reqData.channel_no)) {
        return new Error('未知设备及通道信息');
      }
      return request
        .post(`${this.basePath}/api/timetable_photo`, reqData)
        .catch((reason) => reason);
    },
  },
};
