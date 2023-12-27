import { assignCommonProperty } from '@shihongxins/jsutils';
import service from '../http';

export const APIGWI1Screen = {
  site_pollution: {
    async list(params = {}) {
      const reqData = assignCommonProperty(
        {
          line_id: 0,
          tower_id: 0,
          status: 'ALL',
          keyword: '',
          page: 1,
          size: 10,
          sort: 'asc',
        },
        params
      );
      return service
        .post('/pc/gw_i1/screen/site_pollution/list', reqData)
        .catch((reason) => reason);
    },
    async analysis(params = {}) {
      const reqData = assignCommonProperty(
        {
          cmd_id: '',
          component_id: '',
          end_date: '',
          page: 1,
          size: 1,
          sort: 'asc',
          start_date: '',
        },
        params
      );
      if (!(reqData.cmd_id && reqData.component_id)) {
        return new Error('无法获取现场污秽数据，缺少必要信息');
      }
      return service.post('/pc/gw_i1/screen/site_pollution', reqData).catch((reason) => reason);
    },
  },
  async insulator_leakage_current(params = {}) {
    const reqData = assignCommonProperty(
      {
        cmd_id: '',
        component_id: '',
        end_date: '',
        page: 1,
        size: 1,
        sort: 'asc',
        start_date: '',
      },
      params
    );
    if (!(reqData.cmd_id && reqData.component_id)) {
      return new Error('无法获取绝缘子串泄露电流数据，缺少必要信息');
    }
    return service
      .post('/pc/gw_i1/screen/insulator_leakage_current', reqData)
      .catch((reason) => reason);
  },
  async pollution_lightning_pressure(params = {}) {
    const reqData = assignCommonProperty(
      {
        cmd_id: '',
        component_id: '',
        end_date: '',
        page: 1,
        size: 1,
        sort: 'asc',
        start_date: '',
      },
      params
    );
    if (!(reqData.cmd_id && reqData.component_id)) {
      return new Error('无法获取污闪电压数据，缺少必要信息');
    }
    return service
      .post('/pc/gw_i1/screen/pollution_lightning_pressure', reqData)
      .catch((reason) => reason);
  },
  async ice_monitor_analysis(params = {}) {
    const reqData = assignCommonProperty(
      {
        cmd_id: '',
        component_id: '',
        end_date: '',
        page: 1,
        size: 1,
        sort: 'asc',
        start_date: '',
      },
      params
    );
    if (!(reqData.cmd_id && reqData.component_id)) {
      return new Error('无法获取覆冰监测数据，缺少必要信息');
    }
    return service.post('/pc/gw_i1/screen/ice_monitor', reqData).catch((reason) => reason);
  },
  async dev_detail(uuid = '') {
    if (!uuid.trim()) {
      return new Error('未知设备');
    }
    return service.post('/pc/gw_i1/dev/detail', { uuid }).catch((reason) => reason);
  },
};
