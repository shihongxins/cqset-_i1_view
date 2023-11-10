import { assignCommonProperty } from '@shihongxins/jsutils';
import { request as service } from '../request';

export const APITowerTilt = {
  basePath: '/pc/tower_tilt',
  async list(params = {}) {
    const reqData = assignCommonProperty(
      {
        dept_id: 0,
        line_id: 0,
        status: 'ALL', // ALL ONLINE OFFLINE UNBIND
        keyword: '',
        page: 1,
        size: 10,
        sort: 'asc',
      },
      params
    );
    return service.post(`${this.basePath}/list`, reqData);
  },
  /**
   * @description 杆塔倾斜-传感器日志（及导出）
   * @param Object - { dept_id, line_id, start_date, end_date, alarm, keyword, page, size, sort, export_log } params
   */
  async log_list(params = {}) {
    const reqData = assignCommonProperty(
      {
        dept_id: 0,
        line_id: 0,
        start_date: '',
        end_date: '',
        alarm: -1, // -1 0 1
        keyword: '',
        page: 1,
        size: 10,
        sort: 'asc',
        export_log: false,
      },
      params
    );
    return service.post(`${this.basePath}/log_list`, reqData);
  },
  /**
   * @description 杆塔倾斜-报警数据(导出)
   * @param Object - { dept_id, line_id, tower_id, end, keyword, page, size, sort, start, uuid, export_log, }
   * @returns Object - {code, data}
   */
  async alarm_data(params = {}) {
    const reqData = assignCommonProperty(
      {
        dept_id: 0,
        line_id: 0,
        tower_id: 0,
        uuid: '',
        start: '',
        end: '',
        keyword: '',
        page: 1,
        size: 10,
        sort: 'asc',
        export_log: false,
      },
      params
    );
    return service.post(`${this.basePath}/get_alarm_data`, reqData);
  },
  /**
   * @description 杆塔倾斜-历史数据
   * @param Object - { dept_id, end, page, size, sort, start, uuid, }
   * @returns Object - {code, data}
   */
  async get_history_data(params = {}) {
    const reqData = assignCommonProperty(
      {
        dept_id: 0,
        uuid: '',
        start: '',
        end: '',
        page: 1,
        size: 10,
        sort: 'asc',
      },
      params
    );
    return service.post(`${this.basePath}/get_history_data`, reqData);
  },
  /**
   * @description 杆塔倾斜-设备在线数据
   * @param Object - { dept_id }
   * @returns Object - {code, data}
   */
  async online_count(params = {}) {
    const { dept_id = 0 } = params;
    return service.post(`${this.basePath}/online_count`, { dept_id });
  },
  /**
   * @description 杆塔倾斜-日志分析
   * @param Object - { dept_id, line_id, date }
   * @returns Object - {code, data}
   */
  async analysis(params) {
    const {
      dept_id = 0,
      line_id = 0,
      date = '', // yyyy-MM
    } = params;
    return service.post(`${this.basePath}/analysis`, { dept_id, line_id, date });
  },
};
