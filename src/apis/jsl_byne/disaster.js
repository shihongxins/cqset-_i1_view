import { assignCommonProperty } from '@shihongxins/jsutils';
import { request as service } from '../request';

export const APIDisaster = {
  basePath: '/pc/disaster',
  async list(params = {}) {
    const reqData = assignCommonProperty(
      {
        status: -1,
        keyword: '',
        page: 1,
        size: 10,
        sort: 'asc',
      },
      params
    );
    return service.post(`${APIDisaster.basePath}/list`, reqData);
  },
  async logs(params = {}) {
    const reqData = assignCommonProperty(
      {
        source: 'MongoDb',
        uuid: '', // -1 查所有
        sid: -1, // -1 查所有
        dept_id: 0, //接口需要数组 下面处理
        alarm: -1, // 报警类型： -1 所有 0 正常 1 报警
        page: 1,
        size: 10,
        sort: 'desc',
        keyword: '',
        type: '',
        start_date: '',
        end_date: '',
        export_log: false,
      },
      params
    );
    return service.post(`${APIDisaster.basePath}/logs`, reqData, {
      responseType: reqData.export_log ? 'blob' : 'json',
    });
  },
  async analysis(params = {}) {
    const reqData = assignCommonProperty(
      {
        source: 'MongoDb',
        start_date: '',
        end_date: '',
      },
      params
    );
    return service.post(`${APIDisaster.basePath}/analysis`, reqData);
  },
};
